<!--
 * @Author       : linxiao
 * @Date         : 2023-03-27 12:02:09
 * @LastEditors  : linxiao
 * @LastEditTime : 2023-03-27 14:13:33
 * @FilePath     : /src/layout/components/SwitchLocale.vue
 * @Description  : 语言切换
 * Copyright 2023 OBKoro1, All Rights Reserved. 
 * 2023-03-27 12:02:09
-->
<script setup>
import { useSystemStore } from '@/stores/system.js'
import { useI18n } from 'vue-i18n'
const systemStore = useSystemStore()
const { langueMode, langueList } = storeToRefs(systemStore)
const { locale } = useI18n()
// console.log('locale', locale)
// 初始化模式
systemStore.initMode()

// 下拉菜单选中事件
// const handleSelect = val => (langueMode.value = val)
const handleSelect = val => {
  langueMode.value = val
  locale.value = val.name
  localStorage.setItem('lang', val.name)
}
const { next } = useCycleList(langueList.value, {
  initialValue: langueMode
})
</script>

<template>
  <a-dropdown @select="handleSelect" trigger="hover" class="mode-dropdown">
    <a-button type="text" @click="next()">
      <template #icon>
        <component
          :is="langueMode.icon"
          class="text-[var(--color-text-1)] text-16px"
        ></component>
      </template>
    </a-button>
    <template #content>
      <a-doption v-for="item of langueList" :key="item.name" :value="item">
        <template #icon v-if="langueMode.name === item.name">
          <icon-material-symbols-check-small
            class="text-[var(--color-text-1)] text-14px"
          />
        </template>
        <template #default>{{ item.title }}</template>
      </a-doption>
    </template>
  </a-dropdown>
</template>

<style scoped>
.mode-dropdown .arco-dropdown-option {
  @apply flex justify-end items-center;
}
</style>
