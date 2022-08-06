import React from 'react'
import { Article, Segment } from 'ark-markdown'

const MARK1 = `
> 用法不限，此处仅作示范。

## useState 形式

\`\`\`typescript
interface FooData {
  // ...
}

function createStore(defaultData: FooData) {
  return new Store<FooData>('foo', defaultData)
}

function Example() {
  const [data, store] = useCreator(createStore, {
    // ... 
  })
  // return ...
}
\`\`\`

## context 形式

\`\`\`typescript
interface FooData {
  // ...
}

function createStore(defaultData: FooData) {
  return new Store<FooData>('foo', defaultData)
}

const Provider = createProvider(createStore)

function Parent() {
  return (
    <Provider {...defaultData}>
      <Child/>
    </Provider>
  )
}

function Child() {
  const data = useData<FooData>('foo')
  const store = useStore<Store<FooData>>('foo')
  // return ...
}
\`\`\`

## 扩展 Store

\`\`\`typescript
interface FooData {
  // ...
}

class FooStore extends Store<FooData> {
  constructor(defaultData: FooData) {
    super('foo', defaultData)
  }
}

function createStore(defaultData: FooData) {
  return new FooStore(defaultData)
}

const Provider = createProvider(createStore)

function Parent() {
  return (
    <Provider {...defaultData}>
      <Child/>
    </Provider>
  )
}

function Child() {
  const data = useData<FooData>('foo')
  const store = useStore<Store<FooData>>('foo')
  // return ...
}
\`\`\`

## 推荐

> 代码量多些，但程序的可扩展性和可维护性高。

1、定义

\`\`\`typescript
// foo.ts
import { Store, useData, useStore, createProvider, merge } from 'stine'

interface FooData {
  // ...
}

const STORE_KEY = 'foo'

export function useFooData() {
  return useData<FooData>(STORE_KEY)
}

export function useFooStore() {
  return useStore<FooStore>(STORE_KEY)
}

export const FooProvider = createProvider((
  props: Partial<FooData>
) => {
  return new FooStore(merge(props, {
    // ...
  }))
})

export class FooStore extends Store<FooData> {
  constructor(defaultData: FooData) {
    super(STORE_KEY, defaultData)
  }

  // 公共逻辑可以这样加：
  fetchData() {
    post('/xxx/xxx', {...}).then(res => {
      this.setPart(res)
    })
  }
}
\`\`\`

2、使用

\`\`\`typescript
import { FooProvider } from './foo-store.tsx'

function Parent() {
  return (
    <FooProvider {...partFooData}>
      <Child/>
    </FooProvider>
  )
}
\`\`\`

\`\`\`typescript
import { useFooData, useFooStore } from './foo.ts'

function Child() {
  const data = useFooData()
  const store = useFooStore()
  // return ...
}
\`\`\`
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
