import Store from './Store'
import { COMPARE_METHOD_MAP } from './constants'

/**
 * 比对算法类型
 */
export type CompareFunction = (a: any, b: any) => boolean

/**
 * 比对算法类型
 */
export type CompareType = keyof typeof COMPARE_METHOD_MAP | CompareFunction

/**
 * 事件处理器类型
 */
export type EventListener = (...args: any[]) => void

/**
 * Store事件相关的初始化选项
 */
export interface StoreEventOptions {
  onCreated?: EventListener
  onRendered?: EventListener
  onUpdateBefore?: EventListener
  onUpdated?: EventListener
  onDestroyBefore?: EventListener
}

/**
 * Store的初始化选项
 */
export interface StoreOptions extends StoreEventOptions {
  debug?: boolean // 是否开启debug（若开启，则在抛事件的时候，会打印数据）
  compare?: CompareType // 指定默认的对比算法
}

/**
 * 提供给供应器的component的props
 */
export type ProvideComponentProps<
  T_Store extends Store<any>,
  T_Props = {}
> = T_Props & {
  store: T_Store
}
