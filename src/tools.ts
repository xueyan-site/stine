import { CompareFunction } from './types'

/**
 * 连接多个对象路径片段，转换成一个可索引的路径
 *
 * ```typescript
 * const path = concatObjectPath('a', 0, 'b', '1', 'c')
 * // path ==> 'a[0].b[1].c'
 * ```
 *
 * @param {string|number[]} pathList 路径列表
 */
export function pathListToString(pathList: (string | number)[]) {
  const numRegExp = /^[1-9]\d*|0$/
  let pathString: string = ''
  pathList.forEach(item => {
    pathString += numRegExp.test(item.toString())
      ? `[${item}]`
      : `${pathString ? '.' : ''}${item}`
  })
  return pathString
}

/**
 * 对两个参数进行全等比较
 *
 * @param a 传入的第一个参数，可以为任意类型
 * @param b 传入的第二个参数，可以为任意类型
 * @returns 返回true或者false
 */
export const fullEqual: CompareFunction = (a: any, b: any): boolean => {
  return a === b ? a !== 0 || b !== 0 || 1 / a === 1 / b : a !== a && b !== b
}

/**
 * 对两个参数进行浅等比较
 *
 * 当两个参数全等，或者它们的属性值全等时，即相等，返回为true
 *
 * 否则，返回不等时的属性路径
 *
 * 注：以`_`开头命名的属性，会在比较时被忽略
 *
 * @param a 第一个入参，可以为任意类型
 * @param b 第二个入参，可以为任意类型
 * @returns 返回true或者false
 */
export const shallowEqual: CompareFunction = (
  a: any,
  b: any,
  diff: string[][] = [],
  pathList: string[] = []
): boolean => {
  if (fullEqual(a, b)) {
    return true
  }
  if (
    typeof a !== 'object' ||
    a === null ||
    typeof b !== 'object' ||
    b === null
  ) {
    diff.push(pathList)
    return false
  }
  const keys: string[] = Object.keys(a)
  if (keys.length !== Object.keys(b).length) {
    diff.push(pathList)
    return false
  }
  let isEqual: boolean = true
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (key[0] !== '_') {
      if (
        !Object.prototype.hasOwnProperty.call(b, key) ||
        !fullEqual(a[key], b[key])
      ) {
        diff.push(pathList.concat(key))
        isEqual = false
      }
    }
  }
  return isEqual
}

/**
 * 对两个值进行深等比较
 *
 * 当两个参数全等，或者它们的属性值浅等时，即相等（需以递归的方式不断向下比较）
 *
 * 注：以`_`开头命名的属性，会在比较时被忽略
 *
 * @param a 第一个入参，可以为任意类型
 * @param b 第二个入参，可以为任意类型
 * @returns 返回true或者false
 */
export const deepEqual: CompareFunction = (
  a: any,
  b: any,
  diff: string[][] = [],
  pathList: string[] = []
): boolean => {
  if (fullEqual(a, b)) {
    return true
  }
  if (
    typeof a !== 'object' ||
    a === null ||
    typeof b !== 'object' ||
    b === null
  ) {
    diff.push(pathList)
    return false
  }
  const keys: string[] = Object.keys(a)
  if (keys.length !== Object.keys(b).length) {
    diff.push(pathList)
    return false
  }
  let isEqual: boolean = true
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (key[0] !== '_') {
      const keyPath = pathList.concat(key)
      if (!Object.prototype.hasOwnProperty.call(b, key)) {
        diff.push(keyPath)
        isEqual = false
        continue
      }
      if (!deepEqual(a[key], b[key], diff, keyPath)) {
        isEqual = false
      }
    }
  }
  return isEqual
}
