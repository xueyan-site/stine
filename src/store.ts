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
import type { Dispatch, SetStateAction, ReactNode } from 'react'
import type { EventNames, EventArgs } from 'eventemitter3'
import type { CompareFunction, StoreOptions, CompareType } from './types'

/**
 * Universal status manager
 */
export default class Store<T_Data> extends EventEmitter {
  /**
   * store ID
   */
  readonly id: string

  /**
   * store type
   */
  readonly type: string

  /**
   * Initial data
   */
  initialData: T_Data

  /**
   * Comparison algorithm for deciding whether to update the data
   */
  defaulComparator: CompareFunction

  /**
   * Whether to enable debug
   */
  debug?: boolean

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
  protected __setData__: Dispatch<SetStateAction<T_Data>>

  /**
   * indicates if it has been used
   */
  protected __isUsed__?: boolean

  /**
   * Update Count
   */
  protected __updateCount__: number

  /**
   * Timer used when updating
   */
  protected __updateTimer__?: any

  /**
   * Context of current store
   */
  protected __storeContext__: Context<this>

  /**
   * Context of current data
   */
  protected __dataContext__: Context<T_Data>

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
  constructor(type: string, initialData: T_Data, options: StoreOptions = {}) {
    super()
    /**
     * 初始化内部的成员变量
     */
    this.debug = options.debug
    this.type = type
    this.id = random()
    this.initialData = initialData
    this.__data__ = initialData
    this.__setData__ = () => {}
    this.__updateCount__ = 0
    /**
     * 设置上下文
     */
    this.__dataContext__ = ensureDataContext(type)
    this.__storeContext__ = ensureStoreContext(type)
    /**
     * 计算出默认的对比函数
     */
    const compare = options.compare
    if (compare && typeof compare === 'string') {
      this.defaulComparator = COMPARE_METHOD_MAP[compare]
    } else {
      this.defaulComparator = compare || COMPARE_METHOD_MAP.deep
    }
    /**
     * 设置监听器
     */
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
  set(data: T_Data, compare?: CompareType): boolean {
    /**
     * 获取对比方法
     */
    let currCompare: CompareFunction
    if (typeof compare === 'string') {
      currCompare = COMPARE_METHOD_MAP[compare] || this.defaulComparator
    } else {
      currCompare = compare || this.defaulComparator
    }
    /**
     * 对比两者是否存在改动，若无，则无需继续
     */
    if (currCompare(data, this.__data__)) {
      return false
    }
    const prevData = this.__data__
    /**
     * 发出即将更新的消息
     */
    this.emit(STORE_EVENT_TYPE.UPDATE_BEFORE, { data, prevData, store: this })
    this.__prevData__ = prevData
    this.__data__ = data
    /**
     * 延迟刷新页面
     */
    if (this.__updateTimer__) {
      clearTimeout(this.__updateTimer__)
    }
    this.__updateTimer__ = setTimeout(() => {
      this.__setData__(data)
      this.__updateCount__ += 1
      this.__updateTimer__ = undefined
    }, 7)
    return true
  }

  /**
   * update part data
   */
  setPart(partData: Partial<T_Data>, compare?: CompareType): boolean {
    return this.set({ ...this.__data__, ...partData }, compare)
  }

  /**
   * reset current data
   */
  reset(partData?: Partial<T_Data>, compare?: CompareType): boolean {
    return this.set({ ...this.initialData, ...partData }, compare)
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
    const [data, setData] = useState<T_Data>(this.initialData)
    this.__data__ = data
    this.__setData__ = setData
    /**
     * 使用检测，若该实例已经在其他地方使用过，则需要警告提示
     */
    useEffect(() => {
      setStore(this)
      if (this.__isUsed__) {
        throw new Error(`store ${this.id} cannot be supplied more than once`)
      } else {
        this.__isUsed__ = true
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
        this.__data__ = this.initialData
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
    children?: ReactNode | ((props: { 
      [props: string]: any,
      store: Store<T_Data>,
      data: T_Data
    }) => ReactNode | undefined)
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
