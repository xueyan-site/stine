import React from 'react'
import { Article, Segment } from 'ark-markdown'

const MARK1 = `
## useData

获取 Store.data

\`\`\`typescript
type useData<T> = (
  type: string   // Store 类型
) => T
\`\`\`

## useStore

获取 Store

\`\`\`typescript
type useData<S extends Store<any>> = (
  type: string   // Store 类型
) => S
\`\`\`

当 Store 内数据被修改时，不会引起组件的更新。

## useCreator

使用 Store 创建器

\`\`\`typescript
type useCreator = {
  <S extends Store<any>>(
    createStore: () => S
  ): [S["data"], S];
  <S extends Store<any>, P>(
    createStore: (props: P) => S, props: P
  ): [S["data"], S];
}
\`\`\`

可以将其看作是封装了 Store 的 useState。

通过该 hook，可以让程序直接使用 Store 对象，而不依赖于 Context 机制。

\`\`\`typescript
function createStore(props: Record<string, any>) {
  return new Store('xxx', props)
}
const [data, store] = useCreator(createStore, { ... })
store.setItem('a', 1)
\`\`\`
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
