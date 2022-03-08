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
  protected __storeContext__: Context<this>

  /**
   * Context of current data
   */
  protected __dataContext__: Context<T_Data>

  /**
   * Previous data
   */
  protected __prevData__?: T_Data

  /**
   * current data
   */
  protected __data__: T_Data

  /**
   * handler for set current data
   */
  protected __setData__: React.Dispatch<React.SetStateAction<T_Data>>

  /**
   * indicates if it has been used
   */
  private __used__?: boolean

  /**
   * Update Count
   */
  private __updateCount__: number

  /**
   * Timer used when updating
   */
  private __updateCloser__?: () => void

  /**
   * get previous data
   */
  get prevData(): T_Data | undefined {
    return this.__prevData__
  }

  /**
   * get current data
   */
  get data(): T_Data {
    return this.__data__
  }

  /**
   * create a store
   *
   * @param type store type
   * @param initialData initial data
   */
  constructor(type: string, defaultData: T_Data, options: StoreOptions = {}) {
    super()
    this.debug = options.debug
    this.type = type
    this.id = random()
    this.defaultData = defaultData
    this.updateTiming = options.updateTiming
    this.__data__ = defaultData
    this.__setData__ = () => {}
    this.__updateCount__ = 0
    this.__dataContext__ = ensureDataContext(type)
    this.__storeContext__ = ensureStoreContext(type)
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
    if (this.__updateCloser__) {
      this.__updateCloser__()
      this.__updateCloser__ = undefined
    }
    /**
     * 更新
     */
    const updater = () => {
      this.__setData__(data)
      this.__updateCount__ += 1
      this.__updateCloser__ = undefined
    }
    const currUpdateTiming = updateTiming || this.updateTiming
    if (typeof currUpdateTiming === 'number' && currUpdateTiming > 0) {
      const timer = setTimeout(updater, currUpdateTiming)
      this.__updateCloser__ = () => clearTimeout(timer)
    } else if (currUpdateTiming === 'now') {
      updater()
    } else {
      const timer = requestAnimationFrame(updater)
      this.__updateCloser__ = () => cancelAnimationFrame(timer)
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
    return useContext(this.__dataContext__)
  }

  /**
   * Get the data of the current store  
   * An instance can only be used in one place and cannot be used more than once  
   */
  readonly useStore = (): [T_Data, this] => {
    const [data, setData] = useState<T_Data>(this.defaultData)
    this.__data__ = data
    this.__setData__ = setData
    /**
     * 使用检测，若该实例已经在其他地方使用过，则需要警告提示
     */
    useEffect(() => {
      setStore(this)
      if (this.__used__) {
        throw new Error(`store ${this.id} cannot be supplied more than once`)
      } else {
        this.__used__ = true
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
        this.__updateCount__ === 0
        this.__data__ = this.defaultData
        this.__prevData__ = undefined
        this.__setData__ = () => {}
        deleteStore(this)
      }
    }, [])
    /**
     * 生命周期机制
     */
    useEffect(() => {
      if (this.__updateCount__ === 0) {
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

    }, [this.__updateCount__])
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
    const [data] = this.useStore()
    return createElement(
      this.__storeContext__.Provider,
      { value: this },
      createElement(
        this.__dataContext__.Provider,
        { value: data },
        children instanceof Function
          ? children({ data, store: this, ...props })
          : children
      )
    )
  }
}
