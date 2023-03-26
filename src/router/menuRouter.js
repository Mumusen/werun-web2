/*
 * @Author       : linxiao
 * @Date         : 2023-03-14 15:12:18
 * @LastEditors  : linxiao
 * @LastEditTime : 2023-03-24 16:19:55
 * @FilePath     : /src/router/menuRouter.js
 * @Description  :
 * Copyright 2023 OBKoro1, All Rights Reserved.
 * 2023-03-14 15:12:18
 */
import IconMaterialSymbolsCodeBlocksOutline from '~icons/material-symbols/code-blocks-outline'

export const menuRouter = [
  // {
  //   path: 'devtools',
  //   name: 'DevTools',
  //   meta: {
  //     title: '工具',
  //     icon: markRaw(IconMaterialSymbolsCodeBlocksOutline)
  //   },
  //   redirect: { name: 'RegularPage' },
  //   children: [
  //     {
  //       path: 'regular',
  //       name: 'RegularPage',
  //       meta: {
  //         title: '正则在线校验'
  //       },
  //       component: () => import('@/views/RegularPage/index.vue')
  //     }
  //   ]
  // },
  {
    path: 'dept',
    name: 'Dept',
    meta: {
      title: '部门管理',
      icon: markRaw(IconMaterialSymbolsCodeBlocksOutline)
    },
    component: () => import('@/views/Dept/index.vue')
  }
]

/**
 * @param { Array } router 路由数组
 * @param { String } parentPath 父级路由 path
 * @description 菜单路由数组 format
 * @return { Array }
 * @Date 2022-11-13 20:18:30
 * @Author isboyjc
 */
export const menuRouterFormat = (router, parentPath) => {
  return router.map(item => {
    // 拼接路由，例：'devtools' -> '/devtools'  'regular' -> '/devtools/regular'
    item.path = parentPath ? `${parentPath}/${item.path}` : `/${item.path}`

    // 存在 children 属性，且 children 数组长度大于 0，开始递归
    if (item.children && item.children.length > 0) {
      item.children = menuRouterFormat(item.children, item.path)
    }

    return Object.assign({}, item, item.meta || {})
  })
}

// 解析后 路由菜单列表
export const menuRouterFormatList = menuRouterFormat([...menuRouter])
