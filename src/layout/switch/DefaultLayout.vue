<!--
 * @Author       : linxiao
 * @Date         : 2023-03-14 15:12:18
 * @LastEditors  : linxiao
 * @LastEditTime : 2023-03-29 15:58:34
 * @FilePath     : /src/layout/switch/DefaultLayout.vue
 * @Description  : Layout 2
 * Copyright 2023 OBKoro1, All Rights Reserved. 
 * 2023-03-14 15:12:18
-->
<script>
import IconRiLayout5Fill from '~icons/ri/layout-5-fill'
export default {
  name: 'DefaultLayout',
  icon: IconRiLayout5Fill,
  lang: 'defaultLayout'
}
</script>

<script setup>
import UserPic from '@/assets/img/user_pic.png'
// 侧边栏收缩状态
const collapsed = ref(false)
// 侧边栏收缩触发事件
const handleCollapse = val => {
  // const content = type === 'responsive' ? '响应式触发' : '点击触发'
  // console.log(`${content}侧边栏，当前状态：${val}`)
  collapsed.value = val
}
</script>

<template>
  <div class="sidebar-layout">
    <a-layout :style="{ height: '100vh' }">
      <a-layout-sider
        breakpoint="lg"
        :width="260"
        collapsible
        :collapsed="collapsed"
        @collapse="handleCollapse"
      >
        <Logo />
        <Menu mode="vertical" />
      </a-layout-sider>
      <a-layout>
        <a-layout-header :style="{ margin: '16px 26px' }">
          <Navbar>
            <template #right>
              <SwitchMode />
              <SwitchLocale />
              <a-image width="30" class="user-img" :src="UserPic" />
            </template>
          </Navbar>
        </a-layout-header>
        <a-layout-content>
          <a-layout-content class="min-h-[calc(100vh-207px)] mx-26px">
            <router-view v-slot="{ Component }">
              <transition name="fade-x">
                <component :is="Component" />
              </transition>
            </router-view>
          </a-layout-content>
        </a-layout-content>
        <a-layout-footer>
          <Footer />
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </div>
</template>

<style scoped>
.sidebar-layout {
  height: 100vh;
}
.sidebar-layout :deep(.arco-layout-header),
.sidebar-layout :deep(.arco-layout-footer),
.sidebar-layout :deep(.arco-layout-content) {
  @apply text-[var(--color-text-1)] text-14px;
}
.sidebar-layout :deep(.arco-layout-header) {
  @apply h-58px;
  @apply bg-[var(--color-bg-3)]  border-b-[var(--color-border-1)] border-b-solid border-b-width-1px box-border;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.08);
}
.sidebar-layout :deep(.arco-layout-footer) {
  @apply w-full flex justify-center items-center;
  @apply border-t-[var(--color-border-1)] border-t-solid border-t-width-1px box-border;
  @apply bg-[var(--color-bg-2)] text-[var(--color-text-1)] text-14px;
}
.sidebar-layout :deep(.arco-layout-sider),
.sidebar-layout :deep(.arco-layout-sider-trigger) {
  @apply border-r-[var(--color-border-1)] border-r-solid border-r-width-1px box-border;
}
.user-img {
  top: -8px;
  margin-left: 10px;
}
</style>
