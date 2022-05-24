import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
## createProvider

\`\`\`ts
type createProvider<S extends Store<any>, P = {}> = (
  createStore: (props: P) => S,                                 // store 的创建器
  Component?: React.ComponentType<ProvideComponentProps<S, P>>  // 承接组件，若有，则 Provider 获得的 props 将会透传给它
) => React.ForwardRefExoticComponent<
  React.PropsWithoutRef<React.PropsWithChildren<P>> 
  & RefAttributes<S>
>

type ProvideComponentProps<S extends Store<any>, P = {}> = P & {
  store: S
}
\`\`\`

Store 内部提供了 Provider，若要使用它，须先实例化 Store，但一个 Store 实例只能在一个组件内供应，组件被销毁后，实例的数据也应该跟着被销毁，所以一般情况下，在组件内实例化 Store 是最合适的选择。  

为了避免每次都要在组件内实例化 Store，本包提供了 createProvider 方法。  

它的实现如下：

\`\`\`javascript
function createProvider(createStore, Component) {
  return forwardRef((props, ref) => {
    const storeRef = useRef()

    if (!storeRef.current) {
      storeRef.current = createStore(props)
    }

    useImperativeHandle(ref, () => {
      return storeRef.current
    })

    if (!Component) {
      return createElement(storeRef.current.Provider, props)
    }

    return createElement(
      storeRef.current.Provider,
      undefined,
      createElement(Component, {
        ...props,
        store: storeRef.current
      })
    )
  })
}
\`\`\`

## createInhertProvider

\`\`\`ts
function createProvider<S extends Store<any>, P = {}>(
  createStore: (props: P) => S,                                 // store 的创建器
  Component?: React.ComponentType<ProvideComponentProps<S, P>>  // 承接组件，若有，则 Provider 获得的 props 将会透传给它
) => React.ForwardRefExoticComponent<
  React.PropsWithoutRef<React.PropsWithChildren<P>> 
  & RefAttributes<S>
>
\`\`\`

该方法与 createProvider 的实现及作用一样，不同的是，它包装的是 Store.InhertProvider。

> Store.InheritProvider 会以上级 Store 的数据作为初始数据，若没有，再使用当前 Store 的默认数据。
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
