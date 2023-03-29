<!--
 * @Author       : linxiao
 * @Date         : 2023-03-27 12:02:09
 * @LastEditors  : linxiao
 * @LastEditTime : 2023-03-29 13:53:55
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
        <div class="icon-header flex justify-center">
          <img
            :src="'src/assets/locales/' + langueMode.icon + '.png'"
            class="icon-img-header"
          />
        </div>
      </template>
      <!-- <template #icon>
        <component
          :is="langueMode.icon"
          class="icon-img icon-img-header"
        ></component>
      </template> -->
    </a-button>
    <template #content>
      <a-doption v-for="item of langueList" :key="item.name" :value="item">
        <!-- <template #icon v-if="langueMode.name === item.name">
          <img
            :src="'src/assets/locales/' + item.icon + '.png'"
            class="icon-img icon-img-item"
          />
        </template>
        <template #default>{{ item.title }}</template> -->
        <img
          :src="'src/assets/locales/' + item.icon + '.png'"
          class="icon-img-item"
        />
      </a-doption>
    </template>
  </a-dropdown>
</template>

<style scoped>
.mode-dropdown .arco-dropdown-option {
  @apply flex justify-end items-center;
}
.icon-img-item {
  width: 20px;
  border-radius: 50%;
  margin-top: 10px;
}
.icon-img-header {
  width: 100%;
}
.icon-header {
  width: 20px;
  border-radius: 50%;
  box-shadow: 0 0 10px #0000001a;
  overflow: hidden;
}
</style>
