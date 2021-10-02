import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
## xueyan-react-store

它是一个 \`React\` 状态管理器，对 \`react context\` 进行了简单封装，具备很强的可扩展性，适用于管理复杂场景的数据。  
`

const MARK2 = `
## Why

\`redux\` 和 \`mobx\` 对 \`context\` 机制都进行了严格的封装，但使用它们的成本很高。
\`redux\` 不够直观，理解成本太大，各种库和各种方法堆砌在一起后，使用者会很难维护。
\`mobx\` 控制得太细了，而且不太直观，在数据流动上面不容易理解，它会造成理解阻碍和实现上的阻碍。

我们希望在业务中满足：

- 1、方便修改
- 2、状态可轻易地往上提升
- 3、数据可以达到最小粒度更新（即最小次数和最小范围更新）

本工具，是一个简单直观，满足上述要求的状态管理器。  
`

const MARK3 = `
## 亮点

1、继承自 EventEmitter，可通过事件机制，跨任意层级组件传递消息。  

2、拥有完备的生命周期。  

3、数据和方法分离。修改数据的时候，不会造成方法调用处组件重新渲染。  

4、内置三种数据对比方式，默认是深度对比，它使数据达到最小粒度更新。  
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
      <Segment>{MARK2}</Segment>
      <Segment>{MARK3}</Segment>
      <Segment>## 标志</Segment>
      <img style={{ width: '128px' }} src={XT_PATH+'project.png'} />
    </Article>
  )
}
