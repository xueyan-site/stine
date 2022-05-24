import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
> 用法不限于以下几种，此处仅用于示范。

## 直接使用

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

## 用 context 传递数据

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

> 这样写代码量会多些，但相较于以上写法，程序的可扩展性和可维护性最好。

1、新建 foo-store.tsx 文件，写入如下代码。

\`\`\`typescript
import { Store, useData, useStore, createProvider, merge } from 'xueyan-react-store'

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

2、使用 foo-store.tsx

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
import { useFooData, useFooStore } from './foo-store.tsx'

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
