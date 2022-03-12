export { Store } from './store'
export { useData, useStore, useCreator } from './hooks'
export { createProvider, createInhertProvider } from './providers'
export { ensureDataContext, getDataContext, getStore, getStoreContext } from './manager'
export { deepEqual, shallowEqual, fullEqual, random, merge } from './tools'
export { STORE_EVENT_TYPE } from './constants'

export type {
  CompareFunction,
  CompareType,
  UpdateTiming,
  EventListener,
  StoreOptions,
  StoreEventOptions,
  ProvideComponentProps
} from './types'
