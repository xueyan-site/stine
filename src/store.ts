import {
  useContext,
  createElement,
  PropsWithChildren,
  useState,
  useEffect,
  Context,
  Dispatch,
  SetStateAction
} from 'react'
import EventEmitter, { EventNames, EventArgs } from 'eventemitter3'
import { RANDOM_CHARS, COMPARE_METHOD_MAP, STORE_EVENT_TYPE } from './constants'
import {
  setStore,
  deleteStore,
  initStoreEvent,
  ensureDataContext,
  ensureStoreContext
} from './manager'
import {
  CompareFunction,
  StoreOptions,
  CompareType
} from './types'

/**
 * 通用的状态管理器
 */
export default class Store<T_Data> extends EventEmitter {
  /**
   * store ID
   */
  readonly id: string

  /**
   * store类型
   */
  readonly type: string

  /**
   * 初始数据
   */
  initialData: T_Data

  /**
   * 比对算法，用于决定是否更新数据
   */
  defaulComparator: CompareFunction

  /**
   * 是否开启debug
   */
  debug?: boolean

  /**
   * 上一次数据
   */
  protected __prevData__?: T_Data

  /**
   * 当前数据
   */
  protected __data__: T_Data

  /**
   * 设置当前数据
   */
  protected __setData__: Dispatch<SetStateAction<T_Data>>

  /**
   * 表示是否被使用过
   */
  protected __isUsed__?: boolean

  /**
   * 更新计数
   */
  protected __updateCount__: number

  /**
   * 更新时使用的定时器
   */
  protected __updateTimer__?: any

  /**
   * 当前数据的上下文
   */
  protected __storeContext__: Context<this>

  /**
   * 当前数据的上下文
   */
  protected __dataContext__: Context<T_Data>

  /**
   * 获取数据
   */
  get prevData(): T_Data | undefined {
    return this.__prevData__
  }

  /**
   * 获取数据
   */
  get data(): T_Data {
    return this.__data__
  }

  /**
   * 创建一个Store
   *
   * @param type store的名字
   * @param defaultData store的默认数据
   */
  constructor(type: string, initialData: T_Data, options: StoreOptions = {}) {
    super()
    /**
     * 初始化内部的成员变量
     */
    this.debug = options.debug
    this.type = type
    this.id = this.randomId()
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
   * 生成随机数
   * @param length 随机数的长度
   * @returns 
   */
  randomId(length: number = 16) {
    let current = ''
    const MAX = RANDOM_CHARS.length
    for (let i = 0; i < length; i++) {
      current += RANDOM_CHARS.charAt(
        Math.floor(Math.random() * MAX)
      )
    }
    return current
  }

  /**
   * 重写emit方法
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
   * 设置数据
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
   * 更新部分数据
   */
  setPart(partData: T_Data, compare?: CompareType): boolean {
    return this.set({ ...this.__data__, ...partData }, compare)
  }

  /**
   * 重置数据
   */
  reset(partData?: Partial<T_Data>, compare?: CompareType): boolean {
    return this.set({ ...this.initialData, ...partData }, compare)
  }

  /**
   * 使用数据（仅在上层有Context的供应器）
   */
  readonly useData = (): T_Data => {
    return useContext(this.__dataContext__)
  }

  /**
   * 直接获取当前store的数据  
   * 一个实例只能被用于一处，不能被多次使用  
   */
  readonly useStore = (): [T_Data, this] => {
    const [data, setData] = useState<T_Data>(this.initialData)
    this.__data__ = data
    this.__setData__ = setData
    /**
     * 使用检测
     * 若该实例已经在其他地方使用过，则需要警告提示
     */
    useEffect(() => {
      setStore(this)
      if (this.__isUsed__) {
        throw new Error(`store ${this.id} cannot be supplied more than once`)
      } else {
        this.__isUsed__ = true
      }
      /**
       * 在组件被卸载时
       * 执行清除事件
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
   * 提供数据（Context的供应器）
   */
  readonly Provider = ({
    children,
    ...props
  }: PropsWithChildren<{ [props: string]: any }>) => {
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
