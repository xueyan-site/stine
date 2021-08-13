import { useContext, useMemo } from 'react'
import Store from './store'
import { ensureStoreContext, ensureDataContext } from './manager'

/**
 * 使用数据（仅在上层有store供应时）
 */
export const useStore = <T_Store extends Store<any>>(type: string): T_Store => {
  return useContext(ensureStoreContext(type))
}

/**
 * 使用数据（仅在上层有数据供应时）
 */
export const useData = <T_Data>(type: string): T_Data => {
  return useContext(ensureDataContext(type))
}

/**
 * 直接创建一个store
 * @param createStore
 */
export const useStoreCreator: {
  <T_Store extends Store<any>>(
    createStore: () => T_Store
  ): [T_Store['data'], T_Store]
  <T_Store extends Store<any>, T_Props>(
    createStore: (props: T_Props) => T_Store,
    props: T_Props
  ): [T_Store['data'], T_Store]
} = ((createStore: any, props: any) => {
  const store = useMemo<Store<any>>(() => createStore(props), [])
  return store.useStore()
}) as any
