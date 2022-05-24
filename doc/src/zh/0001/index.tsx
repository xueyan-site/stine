import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
\`React\` 状态管理器，内部对 \`react context\` 进行了简单封装，具备可扩展性，适用于复杂场景。  

它有如下特点：

1、拥有 \`生命周期\` 事件机制。  

2、继承自 \`EventEmitter3\`，可通过事件机制，跨任意层级组件传递消息。  

3、\`数据\` 和 \`方法\` 分离。修改数据的时候，不会造成方法调用处的重新渲染。  

4、内置有 \`浅比较\`、\`深比较\` 和 \`全等比较\` 三种数据对比方式，默认是深度对比。  

5、可指定 \`下一帧\`、\`延时\`、\`立即\` 三种累积更新的时机，默认是下一帧更新。
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
