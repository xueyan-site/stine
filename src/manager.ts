import { Context, createContext } from 'react'
import { STORE_EVENT_TYPE } from './constants'
import type Store from './store'
import type { StoreEventOptions } from './types'

/**
 * Set the listener at initialization time
 *
 * @param store
 * @param options
 */
export const initStoreEvent = <T_Store extends Store<any>>(
  store: T_Store,
  options: StoreEventOptions
) => {
  if (options.onCreated) {
    store.once(STORE_EVENT_TYPE.CREATED, options.onCreated)
  }
  if (options.onRendered) {
    store.on(STORE_EVENT_TYPE.RENDERED, options.onRendered)
  }
  if (options.onUpdateBefore) {
    store.on(STORE_EVENT_TYPE.UPDATE_BEFORE, options.onUpdateBefore)
  }
  if (options.onUpdated) {
    store.on(STORE_EVENT_TYPE.UPDATED, options.onUpdated)
  }
  if (options.onDestroyBefore) {
    store.once(STORE_EVENT_TYPE.DESTROY_BEFORE, options.onDestroyBefore)
  }
}

/**
 * Collector for store instances
 */
const storeMap = new Map<string, Store<any>>()

/**
 * Get the generated store instance
 * @param storeId
 */
export const getStore = <T_Store extends Store<any>>(
  storeId: string
): T_Store | undefined => {
  return storeMap.get(storeId) as any
}

/**
 * Set the generated store instance
 * @param storeId
 */
export const setStore = <T_Store extends Store<any>>(store: T_Store): void => {
  storeMap.set(store.id, store)
}

/**
 * Delete the generated store instance
 * @param storeId
 */
export const deleteStore = <T_Store extends Store<any>>(
  store: T_Store
): boolean => {
  return storeMap.delete(store.id)
}

/**
 * Collector for store context
 */
const storeContextMap = new Map<string, Context<any>>()

/**
 * Get store instance context
 * @param storeType
 */
export const getStoreContext = <T_Store extends Store<any>>(
  storeType: string
): Context<T_Store> | undefined => {
  return storeContextMap.get(storeType)
}

/**
 * Get store instance context (create if none)
 * @param storeType
 */
export const ensureStoreContext = <T_Store extends Store<any>>(
  storeType: string
): Context<T_Store> => {
  let context = storeContextMap.get(storeType)
  if (!context) {
    context = createContext({})
    context.displayName = 'store_' + storeType
    storeContextMap.set(storeType, context)
  }
  return context
}

/**
 * Collector for data context
 */
const dataContextMap = new Map<string, Context<any>>()

/**
 * Get store data context
 * @param storeType
 */
export const getDataContext = <T_Data>(
  storeType: string
): Context<T_Data> | undefined => {
  return dataContextMap.get(storeType)
}

/**
 * Get store data context (create if none)
 * @param storeType
 */
export const ensureDataContext = <T_Data>(
  storeType: string
): Context<T_Data> => {
  let context = dataContextMap.get(storeType)
  if (!context) {
    context = createContext({})
    context.displayName = 'data_' + storeType
    dataContextMap.set(storeType, context)
  }
  return context
}
