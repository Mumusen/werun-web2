/*
 * @LastEditors: isboyjc
 * @Description: 路由配置
 * @Date: 2022-09-17 14:35:02
 * @LastEditTime: 2022-11-16 02:36:37
 * @Author: isboyjc
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import { menuRouter } from './menuRouter'

const router = createRouter({
  mode: 'hash',
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'SwitchLayout',
      component: () => import('@/layout/SwitchIndex.vue'),
      redirect: 'dept',
      children: [
        // {
        //   path: '/',
        //   name: 'HomePage',
        //   meta: {
        //     title: 'WERUN'
        //   },
        //   component: () => import('@/views/HomePage.vue')
        // },
        ...menuRouter
      ]
    }
  ]
})

export default router
