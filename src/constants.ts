import { fullEqual, deepEqual, shallowEqual } from './tools'

export const COMPARE_METHOD_MAP = {
  is: fullEqual,
  deep: deepEqual,
  shallow: shallowEqual
}

/**
 * store built-in event types
 */
export enum STORE_EVENT_TYPE {
  CREATED = 'created',
  UPDATE_BEFORE = 'updateBefore',
  UPDATED = 'updated',
  /** when created and updated */
  RENDERED = 'rendered',
  DESTROY_BEFORE = 'destroyBefore'
}

export const RANDOM_CHARS = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz'
