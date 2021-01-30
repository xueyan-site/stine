import React, { Fragment, useRef } from 'react'
import { MarkdownSegment } from 'xueyan-react-markdown'
import Store, { useCreateStore } from 'xueyan-react-store'

const preCode = `
## 预备

\`\`\`ts
import React from 'react'
import Store, { useCreateStore } from 'xueyan-react-store'

interface NameProps {
  lastName: string // 姓
  firstName: string // 名
}

interface NameData {
  fullname: string
}
\`\`\`
`

interface NameProps {
  lastName: string // 姓
  firstName: string // 名
}

interface NameData {
  fullname: string
}

const code1 = `
## 写法一

\`\`\`ts
function Name(props: NameProps) {
  const [data, store] = useCreateStore<Store<NameData>, NameProps>((props: NameProps) {
    return new Store<NameData>('名称', {
      fullname: props.lastName + props.firstName
    })
  })
  return <div>{store.type}：{data.fullname}</div>
}

ReactDOM.render(
  <Name firstName="三" lastName="张" />,
  document.getElementById('app')
)
\`\`\`
`

function Name1(props: NameProps) {
  const [data, store] = useCreateStore<Store<NameData>>(() => {
    return new Store<NameData>('名称', {
      fullname: props.lastName + props.firstName
    })
  })
  return <div>{store.type}：{data.fullname}</div>
}

const code2 = `
## 写法二

\`\`\`ts
function createStore(props: NameProps) {
  return new Store<NameData>('名称', {
    fullname: props.lastName + props.firstName
  })
}

function Name(props: NameProps) {
  const [data, store] = useCreateStore<Store<NameData>, NameProps>(createStore, props)
  return <div>{store.type}：{data.fullname}</div>
}

ReactDOM.render(
  <Name firstName="三" lastName="张" />,
  document.getElementById('app')
)
\`\`\`
`

function createStore(props: NameProps) {
  return new Store<NameData>('名称', {
    fullname: props.lastName + props.firstName
  })
}

function Name2(props: NameProps) {
  const [data, store] = useCreateStore<Store<NameData>, NameProps>(createStore, props)
  return <div>{store.type}：{data.fullname}</div>
}

const code3 = `
## 写法三（useCreateStore的原理）

\`\`\`ts
function Name(props: NameProps) {
  const storeRef = useRef<Store<NameData>>()
  if (!storeRef.current) {
    storeRef.current = new Store<NameData>('名称', {
      fullname: props.lastName + props.firstName
    })
  }
  const [data, store] = storeRef.current.useStore()
  return <div>{store.type}：{data.fullname}</div>
}

ReactDOM.render(
  <Name firstName="三" lastName="张" />,
  document.getElementById('app')
)
\`\`\`
`

function Name3(props: NameProps) {
  const storeRef = useRef<Store<NameData>>()
  if (!storeRef.current) {
    storeRef.current = new Store<NameData>('名称', {
      fullname: props.lastName + props.firstName
    })
  }
  const [data, store] = storeRef.current.useStore()
  return <div>{store.type}：{data.fullname}</div>
}

export default function UseOne() {
  return (
    <Fragment>
      <MarkdownSegment>{preCode}</MarkdownSegment>
      <MarkdownSegment>{code1}</MarkdownSegment>
      <p>结果：</p>
      <Name1 firstName="三" lastName="张" />
      <MarkdownSegment>{code2}</MarkdownSegment>
      <p>结果：</p>
      <Name2 firstName="三" lastName="张" />
      <MarkdownSegment>{code3}</MarkdownSegment>
      <p>结果：</p>
      <Name3 firstName="三" lastName="张" />
    </Fragment>
  )
}
