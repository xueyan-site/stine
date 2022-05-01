import { Context, createContext } from 'react'
import type { Store } from './store'
import type { StoreEventOptions } from './types'

/**
 * Set the listener at initialization time
 */
export const initStoreEvent = <S extends Store<any>>(
  store: S,
  options: StoreEventOptions
) => {
  if (options.onCreated) {
    store.once('created', options.onCreated)
  }
  if (options.onRendered) {
    store.on('rendered', options.onRendered)
  }
  if (options.onUpdateBefore) {
    store.on('beforeUpdate', options.onUpdateBefore)
  }
  if (options.onUpdated) {
    store.on('updated', options.onUpdated)
  }
  if (options.onDestroyBefore) {
    store.once('beforeDestroy', options.onDestroyBefore)
  }
}

/**
 * Collector for store instances
 */
const storeMap = new Map<string, Store<any>>()

/**
 * Get the generated store instance
 */
export const getStore = <S extends Store<any>>(
  storeId: string
): S | undefined => {
  return storeMap.get(storeId) as any
}

/**
 * Set the generated store instance
 */
export const setStore = <S extends Store<any>>(store: S): void => {
  storeMap.set(store.id, store)
}

/**
 * Delete the generated store instance
 */
export const deleteStore = <S extends Store<any>>(
  store: S
): boolean => {
  return storeMap.delete(store.id)
}

/**
 * Collector for store context
 */
const storeContextMap = new Map<string, Context<any>>()

/**
 * Get store instance context
 */
export const getStoreContext = <S extends Store<any>>(
  storeType: string
): Context<S> | undefined => {
  return storeContextMap.get(storeType)
}

/**
 * Get store instance context (create if none)
 */
export const ensureStoreContext = <S extends Store<any>>(
  storeType: string
): Context<S> => {
  let context = storeContextMap.get(storeType)
  if (!context) {
    context = createContext<any>({})
    context.displayName = 'store ' + storeType
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
 */
export const getDataContext = <T>(
  storeType: string
): Context<T> | undefined => {
  return dataContextMap.get(storeType)
}

/**
 * Get store data context (create if none)
 */
export const ensureDataContext = <T>(
  storeType: string,
  defaultData?: T,
): Context<T> => {
  let context = dataContextMap.get(storeType)
  if (!context) {
    context = createContext<any>(defaultData)
    context.displayName = 'data ' + storeType
    dataContextMap.set(storeType, context)
  }
  return context
}
