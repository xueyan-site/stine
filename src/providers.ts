import { useRef, useImperativeHandle, forwardRef, createElement } from 'react'
import { Store } from './store'
import type { ProvideComponentProps } from './types'

/**
 * Create a Provider
 * @param createStore
 */
export function createProvider<S extends Store<any>, P = {}>(
  createStore: (props: P) => S,
  Component?: React.ComponentType<ProvideComponentProps<S, P>>
) {
  return forwardRef<S, React.PropsWithChildren<P>>((props, ref) => {
    const storeRef = useRef<S>()
    if (!storeRef.current) {
      storeRef.current = createStore(props)
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
 * Create a Provider
 * @param createStore
 */
export function createInhertProvider<S extends Store<any>, P = {}>(
  createStore: (props: P) => S,
  Component?: React.ComponentType<ProvideComponentProps<S, P>>
) {
  return forwardRef<S, React.PropsWithChildren<P>>((props, ref) => {
    const storeRef = useRef<S>()
    if (!storeRef.current) {
      storeRef.current = createStore(props)
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
