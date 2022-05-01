import type { Store } from './Store'
import type { COMPARE_METHOD_MAP } from './tools'

export type StoreEventType =
  | 'created'
  | 'rendered'
  | 'beforeUpdate'
  | 'updated'
  | 'beforeDestroy'

export type CompareFunction = (a: any, b: any) => boolean

export type CompareType = keyof typeof COMPARE_METHOD_MAP | CompareFunction

export type EventListener = (...args: any[]) => void

export interface StoreEventOptions {
  onCreated?: EventListener
  onRendered?: EventListener
  onUpdateBefore?: EventListener
  onUpdated?: EventListener
  onDestroyBefore?: EventListener
}

export type UpdateTiming = 'nextFrame' | 'now' | number

export type ProvideComponentProps<S extends Store<any>, P = {}> = P & {
  store: S
}
