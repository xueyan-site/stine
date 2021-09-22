import type Store from './Store'
import type { COMPARE_METHOD_MAP } from './constants'

/**
 * Comparison algorithm define
 */
export type CompareFunction = (a: any, b: any) => boolean

/**
 * Comparison algorithm type
 */
export type CompareType = keyof typeof COMPARE_METHOD_MAP | CompareFunction

/**
 * event listener define
 */
export type EventListener = (...args: any[]) => void

/**
 * Store event-related initialization options
 */
export interface StoreEventOptions {
  onCreated?: EventListener
  onRendered?: EventListener
  onUpdateBefore?: EventListener
  onUpdated?: EventListener
  onDestroyBefore?: EventListener
}

/**
 * Store's initialization options
 */
export interface StoreOptions extends StoreEventOptions {
  debug?: boolean // 是否开启debug（若开启，则在抛事件的时候，会打印数据）
  compare?: CompareType // 指定默认的对比算法
}

/**
 * The props of Component provided to Provider
 */
export type ProvideComponentProps<
  T_Store extends Store<any>,
  T_Props = {}
> = T_Props & {
  store: T_Store
}
