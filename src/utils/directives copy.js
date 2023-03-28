/*
 * @Author       : linxiao
 * @Date         : 2023-03-28 16:06:15
 * @LastEditors  : linxiao
 * @LastEditTime : 2023-03-28 16:06:16
 * @FilePath     : /src/utils/directives copy.js
 * @Description  :
 * Copyright 2023 OBKoro1, All Rights Reserved.
 * 2023-03-28 16:06:15
 */
/*
 * @Author       : linxiao
 * @Date         : 2023-03-28 11:11:16
 * @LastEditors  : linxiao
 * @LastEditTime : 2023-03-28 15:56:31
 * @FilePath     : /src/utils/directives.js
 * @Description  : 自定义事件
 * Copyright 2023 OBKoro1, All Rights Reserved.
 * 2023-03-28 11:11:16
 */
// 点击元素以外事件
const clickOutSide = {
  beforeMount(el, binding) {
    function documentHandler(e) {
      console.log('e', el, e.target)
      //   console.log('el=>', el.className)
      //   if (el.contains(e.target)) return false
      //   console.log('判断是否绑定函数', binding)
      //   if (binding.value) {
      //     console.log('有绑定')
      //     binding.value(e)
      //   }

      if (el.contains(e.target)) {
        return false
      }
      let isReturn = false
      console.log('binding', binding)
      // binding.arg.map(item => {
      //   if (!document.querySelector('#' + item)) return
      //   if (document.querySelector('#' + item).contains(e.target)) {
      //     isReturn = true
      //   }
      // })
      if (isReturn) return false
      if (binding.value) binding.value(e)
    }
    el.__vueClickOutside__ = documentHandler
    document.addEventListener('click', documentHandler)
  },
  unmounted(el) {
    document.removeEventListener('click', el.__vueClickOutSide__)
    delete el.__vueClickOutside__
  }
}
export default {
  install: function (app) {
    app.directive('clickOutSide', clickOutSide)
  }
}
