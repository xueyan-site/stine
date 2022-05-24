import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
## ensureDataContext

\`\`\`
type ensureDataContext<S extends Store<any>> = (
  storeType: string
) => Context<S>
\`\`\`

获取指定类型的 Store 数据上下文，若不存在则创建。

## getDataContext

\`\`\`
type getDataContext<T>(
  storeType: string
) => Context<T> | undefined
\`\`\`

获取指定类型的 Store 数据上下文

## getStore

\`\`\`
type getStore<S extends Store<any>> = (
  storeId: string
) => S | undefined
\`\`\`

获取指定的 Store

## getStoreContext

\`\`\`
type getStoreContext<S extends Store<any>> = (
  storeType: string
) => Context<S> | undefined
\`\`\`

获取指定类型的 Store 上下文
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
