import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
## deepEqual

\`(a: any, b: any) => boolean\`

判断两份数据是否深度值相等

> 深度值相等：两份数据中所有同名键对应的数据相等。

## shallowEqual

\`(a: any, b: any) => boolean\`

判断两份数据是否浅层值相等

> 浅层值相等：两份数据中，最上层同名键对应的数据相等。

## fullEqual

\`(a: any, b: any) => boolean\`

判断是否全等

> 全等：若是值类型，则值相等，若是引用类型，则引用地址相等。

## random

\`(length: number = 12): string\`

生成随机字符串（默认长度为12位）

随机字符串以 \`acdefghijkmnprstuvwxyz\` 中任一字母开头，后续字符集合为 \`0123456789acdefghijkmnprstuvwxyz\`。

> bloq 与 6109 相似，为了容易识别，去掉了它们。  
> 默认长度下，两份随机字符串相同的概率约为 \`6.3 * 10^35\`。  

## merge

深层合并数据

\`\`\`typescript
type merge<T> = (
  data: any,      // 当前数据
  defaultData: T  // 默认值
) => T
\`\`\`

\`\`\`typescript
merge(
  { a: 33, b: null, d: 66 },
  { a: 0, b: 44, c: 55 }
)
// > { a: 33, b: 44, c: 55, d: 66 }
\`\`\`
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
