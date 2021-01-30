import React, { Fragment, useRef } from 'react'
import { MarkdownSegment } from 'xueyan-react-markdown'
import Store, { ProvideComponentProps, createProvider } from 'xueyan-react-store'

const preCode = `
## 预备

\`\`\`ts
import React from 'react'
import Store, { createProvider, TProvideComponentProps } from 'xueyan-react-store'

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
function createStore(props: NameProps) {
  return new Store<NameData>('名称', {
    fullname: props.lastName + props.firstName
  })
}

const Name = createProvider(createStore1, ({
  store
}: ProvideComponentProps<Store<NameData>, NameProps>) => {
  const data = store.useData()
  return <div>{store.type}：{data.fullname}</div>
})
\`\`\`
`

function createStore1(props: NameProps) {
  return new Store<NameData>('名称', {
    fullname: props.lastName + props.firstName
  })
}

const Name1 = createProvider(createStore1, ({
  store
}: ProvideComponentProps<Store<NameData>, NameProps>) => {
  const data = store.useData()
  return <div>{store.type}：{data.fullname}</div>
})

const code2 = `
## 写法二

\`\`\`ts
function Name2(props: NameProps) {
  const storeRef = useRef<Store<NameData>>()
  if (!storeRef.current) {
    storeRef.current = new Store<NameData>('example4', {
      fullname: props.lastName + props.firstName
    })
  }
  const store = storeRef.current
  const [data] = store.useStore()
  return <div>{store.type}：{data.fullname}</div>
}
\`\`\`
`

function Name2(props: NameProps) {
  const storeRef = useRef<Store<NameData>>()
  if (!storeRef.current) {
    storeRef.current = new Store<NameData>('example4', {
      fullname: props.lastName + props.firstName
    })
  }
  const store = storeRef.current
  const [data] = store.useStore()
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
    </Fragment>
  )
}
