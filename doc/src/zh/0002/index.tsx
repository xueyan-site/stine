import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
状态管理类，继承自 [EventEmitter3](https://github.com/primus/eventemitter3) （[文档](https://nodejs.org/api/events.html)）

\`\`\`typescript
class Store<T> extends EventEmitter {
  constructor(
    type: string, 
    defaultData: T, 
    options: StoreOptions = {}
  ): this
}
\`\`\`

| 参数 | 名称 | 类型 | 说明 |
| - | - | - | - |
| type | store类型 | \`string\` |  |
| defaultData | 初始默认数据 | \`T\` |  |
| options | store设置选项 | \`StoreOptions = {}\` | |

## 成员属性

| 属性 | 名称 | 类型 | 说明 |
| - | - | - | - |
| type | store类型 | \`readonly string\` |  |
| id | store标识 | \`readonly string\` |  |
| defaultData | 初始默认数据 | \`T\` |  |
| compare | 默认数据对比方法 | \`CompareFunction = 'deep'\` | 当对比结果为false时更新 |
| updateTiming | 数据更新时机 | \`UpdateTiming = 'nextFrame'\` |  |
| debug | 是否打印日志信息 | \`? boolean\` |  |
| prevData | 前一份数据 | \`get T,undefined\` |  |
| data | 当前数据 | \`get T\` |  |

## 成员方法

### Store.emit

\`\`\`typescript
type emit<T extends EventNames<string | symbol>> = (
  event: T,
  ...args: EventArgs<string | symbol, T>
) => boolean
\`\`\`

代理 \`EventEmitter3.emit\` 方法，使支持抛事件的同时，可以打印日志。

### Store.set

\`\`\`typescript
type set = (
  data: T, 
  options: StoreSetOptions = {}
) => boolean
\`\`\`

更新数据

\`\`\`typescript
// < store { a: 0, b: 0 }
store.set({ a: 1, b: 2 })
// > store { a: 1, b: 2 }
\`\`\`

### Store.reset

\`\`\`typescript
type reset(
  partData?: Partial<T>, 
  options?: StoreSetOptions
) => boolean
\`\`\`

用 defaultData 重置数据

若传入有 partData，会与 defaultData 合并成新的 defaultData。

\`\`\`typescript
// < store { a: 0, b: 0 }
store.reset({ a: 1 })
// > store { a: 1, b: 0 }
// > store.defaultData { a: 1, b: 0 }
\`\`\`

### Store.setPart

\`\`\`typescript
setPart(
  part: Partial<T>, 
  options?: StoreSetOptions
): boolean
\`\`\`

更新部分数据（数据类型必须是对象）

\`\`\`typescript
// < store { a: 0, b: 0 }
store.setPart({ a: 1 })
// > store { a: 1, b: 0 }
\`\`\`

### Store.setItem

\`\`\`typescript
setItem<K extends keyof T>(
  key: K, 
  item: T[K], 
  options?: StoreSetOptions
): boolean
\`\`\`

更新某一项数据（数据类型必须是对象）

\`\`\`typescript
// < store { a: 0, b: 0 }
store.setItem('a', 1)
// > store { a: 1, b: 0 }
\`\`\`

### Store.setItemPart

\`\`\`typescript
setItemPart<K extends keyof T>(
  key: K, 
  itemPart: Partial<T[K]>, 
  options?: StoreSetOptions
): boolean
\`\`\`

更新某一项数据中的部分数据（数据类型必须是对象，且该项数据类型也必须是对象）

\`\`\`typescript
// < store { a: { b: 0, c: 0 } }
store.setItemPart('a', { b: 1 })
// > store { a: { b: 1, c: 0 } }
\`\`\`

### Store.useData

\`\`\`typescript
readonly useData = () => T
\`\`\`

获取当前数据的 hook

### Store.useState

\`\`\`typescript
readonly useState = (
  defaultData: T = this.defaultData
) => [T, this]
\`\`\`

获取当前数据和Store实例的 hook

内部实现了生命周期，专供与内部调用，或者外部创建store后直接使用。

一个Store实例的 useState 方法，仅能在一个地方调用，在多个地方调用会引起报错。

### Store.Provider

\`\`\`typescript
readonly Provider = (props: {
  [props: string]: any,
  children?: React.ReactNode | ((props: { 
    [props: string]: any,
    store: Store<T>,
    data: T
  }) => React.ReactNode)
}) => React.ReactElement
\`\`\`

Store 的数据供应组件。

### Store.InheritProvider

\`\`\`typescript
readonly InheritProvider = (props: {
  [props: string]: any,
  children?: React.ReactNode | ((props: {
    [props: string]: any,
    store: Store<T>,
    data: T
  }) => React.ReactNode)
}) => React.ReactElement
\`\`\`

Store 的数据供应组件。

与 Store.Provider 不同的是，它会以上级 Store 的数据作为初始数据，若没有，再使用当前 Store 的初始数据。

## 类型补充

### StoreOptions

store 设置选项

\`\`\`typescript
interface StoreOptions extends StoreEventOptions {
  debug?: boolean               // 是否开启debug模式（控制台会打印事件消息）
  compare?: CompareType         // 数据的对比方式
  updateTiming?: UpdateTiming   // 更新时机
}
\`\`\`

### StoreSetOptions

store 修改数据时的设置选项

\`\`\`typescript
interface StoreSetOptions {
  compare?: CompareType         // 数据的对比方式
  updateTiming?: UpdateTiming   // 更新时机
}
\`\`\`

### StoreEventOptions

store 事件相关的设置选项

\`\`\`typescript
interface StoreEventOptions {
  onCreated?: EventListener         // 创建时触发
  onRendered?: EventListener        // 渲染时触发（即创建时和更新时触发）
  onUpdateBefore?: EventListener    // 发现有更新时触发
  onUpdated?: EventListener         // 更新时触发
  onDestroyBefore?: EventListener   // 销毁之前触发
}
\`\`\`

### EventListener

事件监听器

\`\`\`typescript
type EventListener = (...args: any[]) => void
\`\`\`

### CompareType

数据的对比方式

> 若 key 以 _ 开头，对比时，会忽略该项数据。  

\`\`\`typescript
type CompareType =
  | CompareFunction // 自定义对比函数
  | 'is'            // 全等比较
  | 'deep'          // 深等比较 （默认）
  | 'shallow'       // 浅等比较
  | 'not'           // 不比较，默认更新

type CompareFunction = (
  curr: any, // 当前的数据
  prev: any  // 原来的数据
) => boolean
\`\`\`

### UpdateTiming

数据更新的时机

\`\`\`typescript
type UpdateTiming =
  | 'nextFrame'  // 下一帧画面渲染之前更新（默认）
  | 'now'        // 立即更新
  | number       // 延迟多少ms之后更新（单位：ms）
\`\`\`

### StoreEventType

Store 内置事件类型

\`\`\`typescript
type StoreEventType =
  | 'created'
  | 'rendered'
  | 'beforeUpdate'
  | 'updated'
  | 'beforeDestroy'
\`\`\`

除了在创建Store时提前监听，还可通过 on 方法监听：

\`\`\`typescript
// 监听 Store 被渲染时
store.on('rendered', () => { ... })
\`\`\`
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
