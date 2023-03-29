<!--
 * @Author       : linxiao
 * @Date         : 2023-03-29 15:21:32
 * @LastEditors  : linxiao
 * @LastEditTime : 2023-03-29 15:21:32
 * @FilePath     : /src/layout/switch/DefaultLayout copy.vue
 * @Description  : 
 * Copyright 2023 OBKoro1, All Rights Reserved. 
 * 2023-03-29 15:21:32
-->
<!--
 * @Author       : linxiao
 * @Date         : 2023-03-14 15:12:18
 * @LastEditors  : linxiao
 * @LastEditTime : 2023-03-29 15:12:02
 * @FilePath     : /src/layout/switch/DefaultLayout.vue
 * @Description  : Layout 1
 * Copyright 2023 OBKoro1, All Rights Reserved. 
 * 2023-03-14 15:12:18
-->
<script>
import IconRiLayoutTopFill from '~icons/ri/layout-top-fill'
export default {
  name: 'DefaultLayout',
  icon: IconRiLayoutTopFill,
  lang: 'defaultLayout'
}
</script>

<script setup>
import UserPic from '@/assets/img/user_pic.png'
</script>
<template>
  <div>
    <div class="default-layout">
      <a-layout>
        <a-affix>
          <a-layout-header>
            <Navbar>
              <!-- left插槽 -->
              <template #left>
                <Logo />
              </template>

              <!-- 默认插槽和center插槽，默认插槽可不加template直接写内容，作用同center插槽 -->
              <template #center>
                <Menu />
              </template>

              <!-- right插槽 -->
              <template #right>
                <SwitchMode />
                <SwitchLocale />
                <SwitchLayout />
                <a-image width="30" class="user-img" :src="UserPic" />
              </template>
            </Navbar>
          </a-layout-header>
        </a-affix>
        <a-layout-content class="min-h-[calc(100vh-107px)]">
          <router-view v-slot="{ Component }">
            <transition name="fade-x">
              <component :is="Component" />
            </transition>
          </router-view>
        </a-layout-content>
        <a-layout-footer>
          <Footer />
        </a-layout-footer>
      </a-layout>
    </div>
  </div>
</template>

<style scoped>
.default-layout :deep(.arco-layout-header),
.default-layout :deep(.arco-layout-footer),
.default-layout :deep(.arco-layout-content) {
  @apply text-[var(--color-text-1)] text-14px;
}

.default-layout :deep(.arco-layout-header) {
  @apply w-full h-58px overflow-hidden;
  @apply bg-[var(--color-bg-3)]  border-b-[var(--color-border-1)] border-b-solid border-b-width-1px box-border;
}
.default-layout :deep(.arco-layout-content) {
  @apply flex flex-col items-center;
  /* @apply bg-[var(--color-bg-1)] relative; */
}
.default-layout :deep(.arco-layout-footer) {
  @apply w-full flex justify-center items-center;
  @apply border-t-[var(--color-border-1)] border-t-solid border-t-width-1px box-border;
  @apply bg-[var(--color-bg-2)] text-[var(--color-text-1)] text-14px;
}
.user-img {
  top: -8px;
  margin-left: 10px;
}
</style>
