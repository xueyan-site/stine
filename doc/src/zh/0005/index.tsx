import React from 'react'
import { Article, Segment } from 'ark-markdown'

const MARK1 = `
## ensureDataContext

获取指定类型的 Store 数据上下文，若不存在则创建

\`\`\`
type ensureDataContext<S extends Store<any>> = (
  storeType: string
) => Context<S>
\`\`\`

## getDataContext

获取指定类型的 Store 数据上下文

\`\`\`
type getDataContext<T>(
  storeType: string
) => Context<T> | undefined
\`\`\`

## getStore

获取指定的 Store

\`\`\`
type getStore<S extends Store<any>> = (
  storeId: string
) => S | undefined
\`\`\`

## getStoreContext

获取指定类型的 Store 上下文

\`\`\`
type getStoreContext<S extends Store<any>> = (
  storeType: string
) => Context<S> | undefined
\`\`\`
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
