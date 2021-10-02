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
  /** open debug mode, store will console data when emit event */
  debug?: boolean
  /** indicate default compare method: deep, shadow, full */
  compare?: CompareType
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
