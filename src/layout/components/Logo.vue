<!--
 * @Author       : linxiao
 * @Date         : 2023-03-14 15:12:18
 * @LastEditors  : linxiao
 * @LastEditTime : 2023-03-24 16:04:55
 * @FilePath     : /src/layout/components/Logo.vue
 * @Description  : 
 * Copyright 2023 OBKoro1, All Rights Reserved. 
 * 2023-03-14 15:12:18
-->
<script setup>
import logoSrc from '@/assets/img/logo_with_text.png'
const route = useRoute()
const title = useTitle()

watchEffect(() => {
  title.value = route.meta.title || 'WERUN'
})
</script>
<template>
  <div
    class="h-full flex items-center text-16px font-700 text-shadow-sm cursor-pointer"
    @click="$router.push('/')"
  >
    <div
      class="w-128px h-36px rounded-[50%] flex justify-center items-center mr-2px cursor-pointer"
      hover="bg-[var(--color-fill-1)]"
    >
      <img :src="logoSrc" style="width: 100%" />
    </div>
  </div>
</template>

<style scoped></style>
