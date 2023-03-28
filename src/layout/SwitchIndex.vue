<!--
 * @Author       : linxiao
 * @Date         : 2023-03-27 09:53:48
 * @LastEditors  : linxiao
 * @LastEditTime : 2023-03-28 18:05:05
 * @FilePath     : /src/layout/SwitchIndex.vue
 * @Description  : 模式切换
 * Copyright 2023 OBKoro1, All Rights Reserved. 
 * 2023-03-27 09:53:48
-->
<script setup>
import switchLayoutList from '@/layout/switch/index.js'
import { useSystemStore } from '@/stores/system'

const systemStore = useSystemStore()

// 初始化布局列表
systemStore.initSwitchLayout(switchLayoutList)
</script>

<template>
  <div class="switch-index">
    <component :is="systemStore.currentSwitchlayout" />
  </div>
</template>

<style scoped>
.switch-index {
  background-color: #f8f7fa;
}
</style>
