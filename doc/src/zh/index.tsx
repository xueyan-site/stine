import React from 'react'
import { PageDoc } from 'com/page-doc'
import { ClassIcon, FunctionIcon, HookFunctionIcon } from 'sicon'
import pkg from '../../../package.json'
import type { PageProps } from 'sdin-react'
import type { Collection } from 'ark-doc'

const FUNCTION_ICON = <FunctionIcon color="var(--orange)" />
const CLASS_ICON = <ClassIcon color="var(--red)" />
const HOOK_ICON = <HookFunctionIcon color="var(--green)" />

const COLLECTIONS: Collection<string,string>[] = [
  {
    value: '9999',
    label: '指南',
    contents: [
      {
        value: '0001',
        label: '介绍',
        content: () => import('./0001')
      },
      {
        value: '0007',
        label: '用法',
        content: () => import('./0007')
      }
    ]
  },
  {
    value: '9998',
    label: '接口文档',
    contents: [
      {
        value: '0002',
        label: 'Store',
        icon: CLASS_ICON,
        content: () => import('./0002')
      },
      {
        value: '0003',
        label: 'Hooks',
        icon: HOOK_ICON,
        content: () => import('./0003')
      },
      {
        value: '0004',
        label: '供应器',
        icon: FUNCTION_ICON,
        content: () => import('./0004')
      },
      {
        value: '0005',
        label: '上下文',
        icon: FUNCTION_ICON,
        content: () => import('./0005')
      },
      {
        value: '0006',
        label: '工具箱',
        icon: FUNCTION_ICON,
        content: () => import('./0006')
      }
    ]
  }
]

export default function Index(props: PageProps) {
  return (
    <PageDoc 
      {...props}
      language="zh"
      version={pkg.version}
      collections={COLLECTIONS}
      name={pkg.name}
      description={pkg.description}
    />
  )
}
