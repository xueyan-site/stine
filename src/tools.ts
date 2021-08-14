import type { CompareFunction } from './types'

/**
 * 对两个参数进行全等比较
 */
export const fullEqual: CompareFunction = (a: any, b: any): boolean => {
  return a === b ? a !== 0 || b !== 0 || 1 / a === 1 / b : a !== a && b !== b
}

/**
 * 对两个参数进行浅等比较
 *
 * 注：以`_`开头命名的属性，会在比较时被忽略
 */
export const shallowEqual: CompareFunction = (a: any, b: any): boolean => {
  if (fullEqual(a, b)) {
    return true
  }
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false
  }
  const keys: string[] = Object.keys(a)
  if (keys.length !== Object.keys(b).length) {
    return false
  }
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (key[0] !== '_') {
      if (!Object.prototype.hasOwnProperty.call(b, key) || !fullEqual(a[key], b[key])) {
        return false
      }
    }
  }
  return true
}

/**
 * 对两个值进行深等比较
 *
 * 注：以`_`开头命名的属性，会在比较时被忽略
 */
export const deepEqual: CompareFunction = (a: any, b: any): boolean => {
  if (fullEqual(a, b)) {
    return true
  }
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false
  }
  const keys: string[] = Object.keys(a)
  if (keys.length !== Object.keys(b).length) {
    return false
  }
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (key[0] !== '_') {
      if (!Object.prototype.hasOwnProperty.call(b, key) || !deepEqual(a[key], b[key])) {
        return false
      }
    }
  }
  return true
}

/**
 * 对data中为null或者undefined的字段，设置默认值
 *
 * ```typescript
 * merge(
 *   { a: 33, b: null, d: 66 },
 *   { a: 0, b: 44, c: 55 }
 * )
 * >> { a: 33, b: 44, c: 55, d: 66 }
 * ```
 */
export function merge<T>(data: any, defaultData: T): T {
  if (data === null || data === undefined) {
    return defaultData
  }
  if (
    typeof data === 'object' &&
    typeof defaultData === 'object' &&
    defaultData !== null
  ) {
    const keys = Object.keys(defaultData)
    for (let i = 0; i < keys.length; i++) {
      const currKey = keys[i]
      data[currKey] = merge(data[currKey], (defaultData as any)[currKey])
    }
  }
  return data
}
