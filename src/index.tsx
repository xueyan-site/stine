/**
 * @package xueyan-react-store
 * @author xueyan <yang@xueyan.site>
 * @description 包入口 package entry
 */

export { default } from './store'

export { getStore, getDataContext, getStoreContext } from './manager'

export { useData, useStore, useCreateStore } from './hooks'

export { createProvider } from './providers'

export { STORE_EVENT_TYPE } from './constants'

export {
  CompareFunction,
  CompareType,
  EventListener,
  StoreOptions,
  StoreEventOptions,
  SetDataOptions,
  ProvideComponentProps
} from './types'
