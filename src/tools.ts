import type { CompareFunction } from './types'

/**
 * always return not equal
 */
export const notCompare: CompareFunction = () => false

/**
 * All-equal comparison of two parameters
 */
export const fullEqual: CompareFunction = (a: any, b: any): boolean => {
  return a === b ? a !== 0 || b !== 0 || 1 / a === 1 / b : a !== a && b !== b
}

/**
 * A shallow equal comparison of two parameters
 *
 * Note: Attributes named starting with `_` will be ignored in the comparison
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
 * Compare two values in depth
 *
 * Note: Attributes named starting with `_` will be ignored in the comparison
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

export const COMPARE_METHOD_MAP = {
  is: fullEqual,
  deep: deepEqual,
  shallow: shallowEqual,
  not: notCompare,
}

const RANDOM_INI_CHARS = 'acdefghijkmnprstuvwxyz'

const RANDOM_SUF_CHARS = '0123456789' + RANDOM_INI_CHARS

/**
 * Generate random string
 */
export function random(length: number = 12) {
  let str: string = ''
  for (let i = 0; i < length; i++) {
    if (i === 0) {
      str += RANDOM_INI_CHARS.charAt(
        Math.floor(Math.random() * RANDOM_INI_CHARS.length)
      )
    } else {
      str += RANDOM_SUF_CHARS.charAt(
        Math.floor(Math.random() * RANDOM_SUF_CHARS.length)
      )
    }
  }
  return str
}

/**
 * Set default values for fields in data that are null or undefined
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
