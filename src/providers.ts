import React, { useRef, useImperativeHandle, forwardRef, createElement } from 'react'
import { Store } from './store'
import type { ProviderProps } from './types'

/**
 * Create a Provider
 */
export function createProvider<S extends Store<any>, P = {}>(
  createStore: (props: Omit<P, 'children'>) => S,
  Component?: React.ComponentType<ProviderProps<S, P>>
) {
  return forwardRef<S, P>((props, ref) => {
    const storeRef = useRef<S>()
    if (!storeRef.current) {
      const { children, ...other } = props
      storeRef.current = createStore(other)
    }
    useImperativeHandle(ref, () => storeRef.current as any)
    if (Component) {
      return createElement(
        storeRef.current.Provider,
        undefined,
        createElement(Component, {
          ...props,
          store: storeRef.current
        })
      )
    } else {
      return createElement(storeRef.current.Provider, props)
    }
  })
}

/**
 * Create a Inhert Provider
 */
export function createInhertProvider<S extends Store<any>, P = {}>(
  createStore: (props: Omit<P, 'children'>) => S,
  Component?: React.ComponentType<ProviderProps<S, P>>
) {
  return forwardRef<S, React.PropsWithChildren<P>>((props, ref) => {
    const storeRef = useRef<S>()
    if (!storeRef.current) {
      const { children, ...other } = props
      storeRef.current = createStore(other)
    }
    useImperativeHandle(ref, () => storeRef.current as any)
    if (Component) {
      return createElement(
        storeRef.current.InheritProvider,
        undefined,
        createElement(Component, {
          ...props,
          store: storeRef.current
        })
      )
    } else {
      return createElement(storeRef.current.InheritProvider, props)
    }
  })
}
