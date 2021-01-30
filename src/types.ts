import Store from './Store'
import { COMPARE_METHOD_MAP } from './constants'

/**
 * 比对算法类型
 */
export type CompareFunction = (
  a: any,
  b: any,
  diff?: string[][],
  pathList?: string[]
) => boolean

/**
 * 比对算法类型
 */
export type CompareType = keyof typeof COMPARE_METHOD_MAP | CompareFunction

/**
 * 事件处理器类型
 */
export type EventListener = (...args: any[]) => void

/**
 * Store事件相关的初始化选项
 */
export interface StoreEventOptions {
  onCreated?: EventListener
  onRendered?: EventListener
  onUpdateBefore?: EventListener
  onUpdated?: EventListener
  onDestroyBefore?: EventListener
}

/**
 * Store的初始化选项
 */
export interface StoreOptions extends StoreEventOptions {
  id?: string // 指定store的ID（若不指定，则会自动生成）
  debug?: boolean // 是否开启debug（若开启，则在抛事件的时候，会打印数据）
  compare?: CompareType // 指定默认的对比算法
}

/**
 * 更新数据时的选项
 */
export interface SetDataOptions {
  compare?: CompareType // 指定对比算法
  emitPath?: boolean // 是否不抛出path改动的消息
}

/**
 * 提供给供应器的component的props
 */
export type ProvideComponentProps<
  T_Store extends Store<any>,
  T_Props = {}
> = T_Props & {
  store: T_Store
}
