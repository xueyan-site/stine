import {
  useRef,
  useImperativeHandle,
  forwardRef,
  createElement
} from 'react'
import Store from './store'
import type { ComponentType, PropsWithChildren } from 'react'
import type { ProvideComponentProps } from './types'

/**
 * Create a Provider
 * @param createStore
 */
export function createProvider<T_Store extends Store<any>, T_Props = {}>(
  createStore: (props: T_Props) => T_Store,
  Component?: ComponentType<ProvideComponentProps<T_Store, T_Props>>
) {
  if (Component) {
    return forwardRef<T_Store, PropsWithChildren<T_Props>>((props, ref) => {
      const storeRef = useRef<T_Store>()
      if (!storeRef.current) {
        storeRef.current = createStore(props)
      }
      useImperativeHandle(ref, () => storeRef.current as any)
      return createElement(
        storeRef.current.Provider,
        undefined,
        createElement(Component, {
          ...props,
          store: storeRef.current
        })
      )
    })
  } else {
    return forwardRef<T_Store, PropsWithChildren<T_Props>>((props, ref) => {
      const storeRef = useRef<T_Store>()
      if (!storeRef.current) {
        storeRef.current = createStore(props)
      }
      useImperativeHandle(ref, () => storeRef.current as any)
      return createElement(storeRef.current.Provider, props)
    })
  }
}
