# xueyan-react-store

xueyan-react-store 是一个 react 状态管理工具。  
xueyan-react-store is a react store manage tool.  

本包创建自 xueyan <yang@xueyan.site>。  
The project created by xueyan <yang@xueyan.site>.  

## 下载 Install

```bash
# 如果你使用的是NPM：
# if you use NPM: 
npm i xueyan-react-store

# 如果你使用的是Yarn：
# if you use Yarn: 
yarn add xueyan-react-store
```

## 示例 Example

```ts
import React, { useRef } from 'react'
import Store, { createProvider, useData, useStore } from 'xueyan-react-store'

interface Props {
  a: string
}

interface Data {
  b: string
}

const DataProvider = createProvider((props: Props) => {
  return new Store<Data>('store', {
    b: props.a
  }, {
    debug: true
  })
})

function DataReceived() {
  const store = useStore<Store<Data>>('store')
  const data = useData<Data>('store')
  return <div>{store.type} {data.b}</div>
}

export default () => {
  return (
    <DataProvider a="this is data">
      <DataReceived />
    </DataProvider>
  )
}
```
