export { Store } from './store'
export { useData, useStore, useCreator } from './hooks'
export { createProvider, createInhertProvider } from './providers'
export { ensureDataContext, getDataContext, getStore, getStoreContext } from './manager'
export { deepEqual, shallowEqual, fullEqual, random, merge } from './tools'

export type { StoreOptions } from './store'
export type {
  ProviderProps,
  CompareFunction,
  CompareType,
  UpdateTiming,
  EventListener,
  StoreEventType,
  StoreEventOptions,
} from './types'
