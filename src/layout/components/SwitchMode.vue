<!--
 * @Author       : linxiao
 * @Date         : 2023-03-27 09:53:48
 * @LastEditors  : linxiao
 * @LastEditTime : 2023-03-27 15:57:32
 * @FilePath     : /src/layout/components/SwitchMode.vue
 * @Description  : 主题切换
 * Copyright 2023 OBKoro1, All Rights Reserved. 
 * 2023-03-27 09:53:48
-->
<script setup>
import { useSystemStore } from '@/stores/system.js'
const systemStore = useSystemStore()
const { currentMode, modeList } = storeToRefs(systemStore)

// 初始化模式
systemStore.initMode()

// 下拉菜单选中事件
const handleSelect = val => (currentMode.value = val)

const { next } = useCycleList(modeList.value, {
  initialValue: currentMode
})
</script>

<template>
  <a-dropdown @select="handleSelect" trigger="hover" class="mode-dropdown">
    <a-button type="text" @click="next()">
      <template #icon>
        <component
          :is="currentMode.icon"
          class="text-[var(--color-text-1)] text-16px"
        ></component>
      </template>
    </a-button>
    <template #content>
      <a-doption v-for="item of modeList" :key="item.name" :value="item">
        <template #icon v-if="currentMode.name === item.name">
          <icon-material-symbols-check-small
            class="text-[var(--color-text-1)] text-14px"
          />
        </template>
        <template #default> {{ $t('system.' + item.name) }}</template>
      </a-doption>
    </template>
  </a-dropdown>
</template>

<style scoped>
.mode-dropdown .arco-dropdown-option {
  @apply flex justify-end items-center;
}
</style>
