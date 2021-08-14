import { Context, createContext } from 'react'
import { STORE_EVENT_TYPE } from './constants'
import type Store from './store'
import type { StoreEventOptions } from './types'

/**
 * 在初始化时设置监听器
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
 * store实例的收集器
 */
const storeMap = new Map<string, Store<any>>()

/**
 * 获取已生成的store实例
 * @param storeId
 */
export const getStore = <T_Store extends Store<any>>(
  storeId: string
): T_Store | undefined => {
  return storeMap.get(storeId) as any
}

/**
 * 设置已生成的store实例
 * @param storeId
 */
export const setStore = <T_Store extends Store<any>>(store: T_Store): void => {
  storeMap.set(store.id, store)
}

/**
 * 删除已生成的store实例
 * @param storeId
 */
export const deleteStore = <T_Store extends Store<any>>(
  store: T_Store
): boolean => {
  return storeMap.delete(store.id)
}

/**
 * store context的收集器
 */
const storeContextMap = new Map<string, Context<any>>()

/**
 * 获取store实例上下文
 * @param storeType
 */
export const getStoreContext = <T_Store extends Store<any>>(
  storeType: string
): Context<T_Store> | undefined => {
  return storeContextMap.get(storeType)
}

/**
 * 获取store实例上下文
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
 * data context的收集器
 */
const dataContextMap = new Map<string, Context<any>>()

/**
 * 获取store数据上下文
 * @param storeType
 */
export const getDataContext = <T_Data>(
  storeType: string
): Context<T_Data> | undefined => {
  return dataContextMap.get(storeType)
}

/**
 * 获取store数据上下文（没有则创建）
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
