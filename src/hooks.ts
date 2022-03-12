import { useContext, useMemo } from 'react'
import { ensureStoreContext, ensureDataContext } from './manager'
import type { Store } from './store'

/**
 * Use store (only if store is supplied on the upper level)
 */
export const useStore = <T_Store extends Store<any>>(type: string): T_Store => {
  return useContext(ensureStoreContext(type))
}

/**
 * Use data (only when data is available on the upper level)
 */
export const useData = <T_Data>(type: string): T_Data => {
  return useContext(ensureDataContext(type))
}

/**
 * Create a store directly and use it
 */
export const useCreator: {
  <T_Store extends Store<any>>(
    createStore: () => T_Store
  ): [T_Store['data'], T_Store]
  <T_Store extends Store<any>, T_Props>(
    createStore: (props: T_Props) => T_Store,
    props: T_Props
  ): [T_Store['data'], T_Store]
} = ((createStore: any, props: any) => {
  const store = useMemo<Store<any>>(() => createStore(props), [])
  return store.useState()
}) as any
