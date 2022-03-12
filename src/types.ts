import type { Store } from './Store'
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
 * Comparison algorithm type
 */
export type UpdateTiming = 'nextFrame' | 'now' | number

/**
 * Store's initialization options
 */
export interface StoreOptions<T_Data> extends StoreEventOptions {
  /** open debug mode, store will console data when emit event */
  debug?: boolean
  /** Context of current data */
  context?: React.Context<T_Data>
  /** indicate default compare method: deep, shadow, full */
  compare?: CompareType
  /** 更新时机 */
  updateTiming?: UpdateTiming
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
