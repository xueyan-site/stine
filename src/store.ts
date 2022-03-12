import {
  useContext,
  createElement,
  useState,
  useEffect,
  Context
} from 'react'
import EventEmitter from 'eventemitter3'
import { COMPARE_METHOD_MAP, STORE_EVENT_TYPE } from './constants'
import {
  setStore,
  deleteStore,
  initStoreEvent,
  ensureDataContext,
  ensureStoreContext
} from './manager'
import { random } from './tools'
import type { EventNames, EventArgs } from 'eventemitter3'
import type { CompareFunction, StoreOptions, CompareType, UpdateTiming } from './types'

/**
 * Universal status manager
 */
export class Store<T_Data> extends EventEmitter {
  /**
   * store type
   */
  readonly type: string

  /**
   * store ID
   */
  readonly id: string

  /**
   * Initial data
   */
  defaultData: T_Data

  /**
   * Comparison algorithm for deciding whether to update the data
   */
  compare: CompareFunction

  /**
   * 更新时机
   */
  updateTiming?: UpdateTiming

  /**
   * Whether to enable debug
   */
  debug?: boolean

  /**
   * Context of current store
   */
  protected storeContext: Context<this>

  /**
   * Context of current data
   */
  protected dataContext: Context<T_Data>

  /**
   * Previous data
   */
  protected __prevData__?: T_Data

  /**
   * get previous data
   */
  get prevData(): T_Data | undefined {
    return this.__prevData__
  }

  /**
   * current data
   */
  protected __data__: T_Data

  /**
   * get current data
   */
  get data(): T_Data {
    return this.__data__
  }

  /**
   * handler for set current data
   */
  protected setData: React.Dispatch<React.SetStateAction<T_Data>>

  /**
   * indicates if it has been used
   */
  private used?: boolean

  /**
   * Update Count
   */
  private updateCount: number

  /**
   * Timer used when updating
   */
  private updateCloser?: () => void

  /**
   * create a store
   * @param type store type
   */
  constructor(type: string, defaultData: T_Data, options: StoreOptions = {}) {
    super()
    this.debug = options.debug
    this.type = type
    this.id = random()
    this.defaultData = defaultData
    this.updateTiming = options.updateTiming
    this.__data__ = defaultData
    this.setData = () => {}
    this.updateCount = 0
    this.storeContext = ensureStoreContext(type)
    this.dataContext = ensureDataContext(type, defaultData)
    this.compare = (options.compare && typeof options.compare === 'string')
      ? COMPARE_METHOD_MAP[options.compare]
      : options.compare || COMPARE_METHOD_MAP.deep
    initStoreEvent(this, options)
  }

  /**
   * emit event
   */
  emit<T extends EventNames<string | symbol>>(
    event: T,
    ...args: EventArgs<string | symbol, T>
  ): boolean {
    if (this.debug) {
      console.log(
        `%c ${this.type} %c ${event}`,
        'background:#000;color:#fff',
        'color:#f44',
        args
      )
    }
    return super.emit(event, ...args)
  }

  /**
   * set data
   */
  set(data: T_Data, compare?: CompareType, updateTiming?: UpdateTiming): boolean {
    /**
     * 对比两者是否存在改动，若无，则无需继续
     */
    const currCompare = typeof compare === 'string'
      ? COMPARE_METHOD_MAP[compare]
      : compare
    if ((currCompare || this.compare)(data, this.__data__)) {
      return false
    }
    /**
     * 发出即将更新的消息
     */
    const prevData = this.__data__
    this.emit(STORE_EVENT_TYPE.UPDATE_BEFORE, { data, prevData, store: this })
    this.__prevData__ = prevData
    this.__data__ = data
    /**
     * 去除定时
     */
    if (this.updateCloser) {
      this.updateCloser()
      this.updateCloser = undefined
    }
    /**
     * 更新
     */
    const update = () => {
      this.setData(data)
      this.updateCount += 1
      this.updateCloser = undefined
    }
    const currUpdateTiming = updateTiming || this.updateTiming
    if (typeof currUpdateTiming === 'number') {
      if (currUpdateTiming > 0) {
        const timer = setTimeout(update, currUpdateTiming)
        this.updateCloser = () => clearTimeout(timer)
      } else {
        update()
      }
    } else if (currUpdateTiming === 'now') {
      update()
    } else {
      const timer = requestAnimationFrame(update)
      this.updateCloser = () => cancelAnimationFrame(timer)
    }
    return true
  }

  /**
   * update part data
   */
  setPart(partData: Partial<T_Data>, compare?: CompareType, updateTiming?: UpdateTiming): boolean {
    return this.set({ ...this.__data__, ...partData }, compare, updateTiming)
  }

  /**
   * reset current data
   */
  reset(partData?: Partial<T_Data>, compare?: CompareType, updateTiming?: UpdateTiming): boolean {
    return this.set({ ...this.defaultData, ...partData }, compare, updateTiming)
  }

  /**
   * Use data (only the provider with Context in the upper layer)
   */
  readonly useData = (): T_Data => {
    return useContext(this.dataContext)
  }

  /**
   * Get the data of the current store  
   * An instance can only be used in one place and cannot be used more than once  
   */
  readonly useState = (defaultData: T_Data = this.defaultData): [T_Data, this] => {
    const [data, setData] = useState<T_Data>(defaultData)
    this.__data__ = data
    this.setData = setData
    /**
     * 使用检测，若该实例已经在其他地方使用过，则需要警告提示
     */
    useEffect(() => {
      setStore(this)
      this.defaultData = defaultData
      if (this.used) {
        throw new Error(`store ${this.id} cannot be supplied more than once`)
      } else {
        this.used = true
      }
      /**
       * 在组件被卸载时，执行清除事件
       */
      return () => {
        this.emit(STORE_EVENT_TYPE.DESTROY_BEFORE, {
          data: this.__data__,
          store: this
        })
        this.removeAllListeners()
        this.updateCount === 0
        this.__data__ = this.defaultData
        this.__prevData__ = undefined
        this.setData = () => {}
        deleteStore(this)
      }
    }, [])
    /**
     * 生命周期机制
     */
    useEffect(() => {
      if (this.updateCount === 0) {
        this.emit(STORE_EVENT_TYPE.CREATED, {
          data: this.__data__,
          store: this
        })
      } else {
        this.emit(STORE_EVENT_TYPE.UPDATED, {
          data: this.__data__,
          store: this
        })
      }
      this.emit(STORE_EVENT_TYPE.RENDERED, {
        data: this.__data__,
        store: this
      })
    }, [this.updateCount])
    return [data, this]
  }

  /**
   * Provisioning data
   */
  readonly Provider = ({
    children,
    ...props
  }: {
    [props: string]: any,
    children?: React.ReactNode | ((props: { 
      [props: string]: any,
      store: Store<T_Data>,
      data: T_Data
    }) => React.ReactNode | undefined)
  }) => {
    const [data, store] = this.useState()
    return createElement(
      this.storeContext.Provider,
      { value: store },
      createElement(
        this.dataContext.Provider,
        { value: data },
        children instanceof Function
          ? children({  ...props, data, store })
          : children
      )
    )
  }

  /**
   * Provisioning data (default data inherit parent context data)
   */
  readonly InheritProvider = ({
    children,
    ...props
  }: {
    [props: string]: any,
    children?: React.ReactNode | ((props: {
      [props: string]: any,
      store: Store<T_Data>,
      data: T_Data
    }) => React.ReactNode | undefined)
  }) => {
    const defaultData = useContext(this.dataContext)
    const [data, store] = this.useState(defaultData)
    return createElement(
      this.storeContext.Provider,
      { value: store },
      createElement(
        this.dataContext.Provider,
        { value: data },
        children instanceof Function
          ? children({  ...props, data, store })
          : children
      )
    )
  }
}
