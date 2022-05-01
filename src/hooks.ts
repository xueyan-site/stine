import { useContext, useMemo } from 'react'
import { ensureStoreContext, ensureDataContext } from './manager'
import type { Store } from './store'

/**
 * Use store (only if store is supplied on the upper level)
 */
export const useStore = <S extends Store<any>>(type: string): S => {
  return useContext(ensureStoreContext(type))
}

/**
 * Use data (only when data is available on the upper level)
 */
export const useData = <T>(type: string): T => {
  return useContext(ensureDataContext(type))
}

/**
 * Create a store directly and use it
 */
export const useCreator: {
  <S extends Store<any>>(
    createStore: () => S
  ): [S['data'], S]
  <S extends Store<any>, P>(
    createStore: (props: P) => S,
    props: P
  ): [S['data'], S]
} = ((createStore: any, props: any) => {
  const store = useMemo<Store<any>>(() => createStore(props), [])
  return store.useState()
}) as any
