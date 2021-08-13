/**
 * @package xueyan-react-store
 * @author xueyan-site <yang@xueyan.site>
 * @description package entry
 */

export { default } from './store'

export { getStore, getDataContext, getStoreContext } from './manager'

export { useData, useStore, useStoreCreator } from './hooks'

export { createProvider } from './providers'

export { merge, deepEqual, shallowEqual, fullEqual } from './tools'

export { STORE_EVENT_TYPE } from './constants'

export {
  CompareFunction,
  CompareType,
  EventListener,
  StoreOptions,
  StoreEventOptions,
  ProvideComponentProps
} from './types'
