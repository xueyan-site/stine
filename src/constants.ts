import { fullEqual, deepEqual, shallowEqual } from './tools'

/**
 * 比对算法映射表
 */
export const COMPARE_METHOD_MAP = {
  is: fullEqual,
  deep: deepEqual,
  shallow: shallowEqual
}

/**
 * 状态管理器内部的事件类型
 */
export enum STORE_EVENT_TYPE {
  CREATED = 'created', // 创建成功
  UPDATE_BEFORE = 'updateBefore', // 更新之前
  UPDATED = 'updated', // 更新成功
  RENDERED = 'rendered', // 渲染成功（每次渲染后都会执行，即创建+更新）
  DESTROY_BEFORE = 'destroyBefore' // 销毁之前
}
