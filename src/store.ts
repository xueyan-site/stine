import {
  useContext,
  createElement,
  useState,
  useEffect,
  Context
} from 'react'
import EventEmitter from 'eventemitter3'
import { random, COMPARE_METHOD_MAP } from './tools'
import {
  setStore,
  deleteStore,
  initStoreEvent,
  ensureDataContext,
  ensureStoreContext
} from './manager'
import type { EventNames, EventArgs } from 'eventemitter3'
import type { CompareFunction, StoreEventOptions, CompareType, UpdateTiming } from './types'

/**
 * Store's initialization options
 */
export interface StoreOptions extends StoreEventOptions {
  /** open debug mode, store will console data when emit event */
  debug?: boolean
  /** indicate default compare method: deep, shadow, full */
  compare?: CompareType
  /** 更新时机 */
  updateTiming?: UpdateTiming
}

export interface StoreSetOptions {
  /** indicate default compare method: deep, shadow, full */
  compare?: CompareType,
  /** 更新时机 */
  updateTiming?: UpdateTiming
}

/**
 * universal status manager
 */
export class Store<T> extends EventEmitter {
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
  defaultData: T

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
  protected dataContext: Context<T>

  /**
   * Previous data
   */
  protected _prevData?: T

  /**
   * get previous data
   */
  get prevData(): T | undefined {
    return this._prevData
  }

  /**
   * current data
   */
  protected _data: T

  /**
   * get current data
   */
  get data(): T {
    return this._data
  }

  /**
   * handler for set current data
   */
  protected setData: React.Dispatch<React.SetStateAction<T>>

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
  constructor(type: string, defaultData: T, options: StoreOptions = {}) {
    super()
    this.debug = options.debug
    this.type = type
    this.id = random()
    this.defaultData = defaultData
    this.updateTiming = options.updateTiming
    this._data = defaultData
    this.setData = () => {}
    this.updateCount = 0
    this.storeContext = ensureStoreContext(type)
    this.dataContext = ensureDataContext(type, defaultData)
    this.compare = (
      typeof options.compare === 'string'
        ? COMPARE_METHOD_MAP[options.compare]
        : options.compare
    ) || COMPARE_METHOD_MAP.deep
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
        `%c ${this.type} %c ${String(event)}`,
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
  set(data: T, options: StoreSetOptions = {}): boolean {
    /**
     * 对比两者是否存在改动，若无，则无需继续
     */
    const compare = typeof options.compare === 'string'
      ? COMPARE_METHOD_MAP[options.compare]
      : options.compare
    if ((compare || this.compare)(data, this._data)) {
      return false
    }
    /**
     * 发出即将更新的消息
     */
    const prevData = this._data
    this.emit('beforeUpdate', { data, prevData, store: this })
    this._prevData = prevData
    this._data = data
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
      this.updateCount += 1
      this.updateCloser = undefined
      this.setData(data)
    }
    const _updateTiming = options.updateTiming || this.updateTiming
    if (typeof _updateTiming === 'number') {
      if (_updateTiming > 0) {
        const timer = setTimeout(update, _updateTiming)
        this.updateCloser = () => clearTimeout(timer)
      } else {
        update()
      }
    } else if (_updateTiming === 'now') {
      update()
    } else {
      const timer = requestAnimationFrame(update)
      this.updateCloser = () => cancelAnimationFrame(timer)
    }
    return true
  }

  /**
   * reset current data
   */
  reset(partData?: Partial<T>, options?: StoreSetOptions): boolean {
    return this.set({ ...this.defaultData, ...partData }, options)
  }

  /**
   * update part data
   */
  setPart(part: Partial<T>, options?: StoreSetOptions): boolean {
    return this.set({ ...this._data, ...part }, options)
  }

  /**
   * update item
   */
  setItem<K extends keyof T>(
    key: K, 
    item: T[K], 
    options?: StoreSetOptions
  ): boolean {
    const partData: Partial<T> = {}
    partData[key] = item
    return this.setPart(partData, options)
  }

  /**
   * update item part
   */
  setItemPart<K extends keyof T>(
    key: K, 
    itemPart: Partial<T[K]>, 
    options?: StoreSetOptions
  ): boolean {
    const partData: Partial<T> = {}
    partData[key] = { ...this.data[key], ...itemPart }
    return this.setPart(partData, options)
  }

  /**
   * Use data (only the provider with Context in the upper layer)
   */
  readonly useData = (): T => {
    return useContext(this.dataContext)
  }

  /**
   * Get the data of the current store  
   * An instance can only be used in one place and cannot be used more than once  
   */
  readonly useState = (defaultData: T = this.defaultData): [T, this] => {
    const [data, setData] = useState<T>(defaultData)
    this._data = data
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
        this.emit('beforeDestroy', {
          data: this._data,
          store: this
        })
        this.removeAllListeners()
        this.updateCount === 0
        this._data = this.defaultData
        this._prevData = undefined
        this.setData = () => {}
        deleteStore(this)
      }
    }, [])
    /**
     * 生命周期机制
     */
    useEffect(() => {
      if (this.updateCount === 0) {
        this.emit('created', {
          data: this._data,
          store: this
        })
      } else {
        this.emit('updated', {
          data: this._data,
          store: this
        })
      }
      this.emit('rendered', {
        data: this._data,
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
      store: Store<T>,
      data: T
    }) => React.ReactNode)
  }) => {
    const [data, store] = this.useState()
    return createElement(
      this.storeContext.Provider,
      { value: store },
      createElement(
        this.dataContext.Provider,
        { value: data },
        children instanceof Function
          ? children({ ...props, data, store })
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
      store: Store<T>,
      data: T
    }) => React.ReactNode)
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
          ? children({ ...props, data, store })
          : children
      )
    )
  }
}
