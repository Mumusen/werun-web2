/*
 * @Author       : linxiao
 * @Date         : 2023-03-27 09:53:48
 * @LastEditors  : linxiao
 * @LastEditTime : 2023-03-31 16:42:05
 * @FilePath     : /src/main.js
 * @Description  :
 * Copyright 2023 OBKoro1, All Rights Reserved.
 * 2023-03-27 09:53:48
 */
/*
 * @LastEditors: isboyjc
 * @Description: 入口文件
 * @Date: 2022-09-17 14:35:02
 * @LastEditTime: 2022-11-29 07:01:20
 * @Author: isboyjc
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
// 引入 Pinia 状态持久化插件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import '@/styles/normalize.css'
// 导入Unocss样式
import 'uno.css'

// 公共样式
import '@arco-design/web-vue/dist/arco.less'
import '@/assets/css/index.css'

import { getConfig } from '@/config/index'
console.log(getConfig('appCode'))
console.log(getConfig('projectName'))
console.log(import.meta.env.VITE_APP_ENV)
// 国际化
import zhCN from '@/locales/zh-CN.js'
import enUs from '@/locales/en-US.js'
import jaJP from '@/locales/ja-JP.js'
const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  // locale: localStorage.getItem('lang') || 'ja-JP',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUs,
    'ja-JP': jaJP
  }
})

import App from './App.vue'
import router from './router'

const app = createApp(App)

// 创建 Pinia 实例
const pinia = createPinia()
// 使用 Pinia 状态持久化插件
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(i18n)
app.use(router)
app.mount('#app')
