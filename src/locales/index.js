/*
 * @Author       : linxiao
 * @Date         : 2023-03-27 11:35:30
 * @LastEditors  : linxiao
 * @LastEditTime : 2023-03-27 11:38:07
 * @FilePath     : /src/locales/index.js
 * @Description  :
 * Copyright 2023 OBKoro1, All Rights Reserved.
 * 2023-03-27 11:35:30
 */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enUSLocale from './en-US'
import zhCNLocale from './zh-CN'

Vue.use(VueI18n)
const messages = {
  enUS: {
    ...enUSLocale
  },
  zhCN: {
    ...zhCNLocale
  }
}

const i18n = new VueI18n({
  locale: localStorage.get('language') || 'zhCN',
  // set locale messages
  messages
})

export default i18n
