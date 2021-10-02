import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
## 下载

\`\`\`bash
npm i xueyan-react-store
\`\`\`

\`\`\`bash
yarn add xueyan-react-store
\`\`\`
`

const MARK2 = `
## 简单使用

\`\`\`typescript
import React from 'react'
import Store, { useCreator } from 'xueyan-react-store'

interface FooData {
  a: string
}

function App() {
  const [foo, fooStore] = useCreator(() => {
    return new Store<FooData>('random-key', {
      a: ''
    })
  })

  return <div>...</div>
}
\`\`\`
`

const MARK3 = `
## 推荐使用

1、自定义store

\`\`\`typescript
import Store, { createProvider, useData, useStore, merge } from 'xueyan-react-store'

const STORE_KEY = 'random-key'

export interface Foo {
  a: string
}

const FOO: Foo = {
  a: ''
}

export function useFoo() {
  return useData<Foo>(STORE_KEY)
}

export function useFooStore() {
  return useStore<FooStore>(STORE_KEY)
}

export const FooProvider = createProvider((props: {
  data?: Partial<Foo>
}) => {
  return new FooStore(merge(props.data, FOO))
})

export default class FooStore extends Store<Foo> {
  constructor(defaultData: Foo) {
    super(STORE_KEY, defaultData)
  }

  fetch() {
    console.log('i am fetching...')
  }
}
\`\`\`

2、提供store数据

\`\`\`typescript
import React from 'react'
import { FooProvider } from 'path/to/foo-store'

function App() {
  const fooRef = useRef()

  useEffect(() => {
    if (fooRef.current) {
      fooRef.current.fetch()
    }
  }, [])

  return (
    <FooProvider data={undefined}>
      <div>...</div>
    </FooProvider>
  )
}
\`\`\`

3、使用和修改store数据

\`\`\`typescript
import React from 'react'
import { useFoo, useFooStore } from 'path/to/foo-store'

function Component() {
  const foo = useFoo()
  const fooStore = useFooStore()

  return <div>...</div>
}
\`\`\`
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
      <Segment>{MARK2}</Segment>
      <Segment>{MARK3}</Segment>
    </Article>
  )
}
