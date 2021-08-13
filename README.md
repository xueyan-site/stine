# xueyan-react-store

`xueyan-react-store` is a react store manage tool.  

- [xueyan-react-store](#xueyan-react-store)
  - [Why use it](#why-use-it)
  - [What are its highlights](#what-are-its-highlights)
  - [How to use it](#how-to-use-it)
  - [Interface](#interface)
  - [Develop](#develop)
  - [Appendix](#appendix)

## Why use it

## What are its highlights

## How to use it

```ts
import React from 'react'
import Store, { createProvider, useData, useStore } from 'xueyan-react-store'

interface Data {
  a: string
}

const Provider = createProvider(
  (props: Data) => new Store<Data>('k', props)
)

function Received() {
  const data = useData<Data>('k')
  const store = useStore<Store<Data>>('k')
  return <div>{store.type}: {data.a}</div>
}

function App() {
  return (
    <Provider a="this is data">
      <Received />
    </Provider>
  )
}
```

## Interface

## Develop

Please make sure that `Node` and `NPM` are installed on your computer, and `xueyan-typescript-cli` is installed globally. After switching current work path to this project root in CMD, you can run command `yarn start`.

## Appendix

author - xueyan-site <yang@xueyan.site>  
builder - [xueyan-typescript-cli](https://github.com/xueyan-site/xueyan-typescript-cli)  
