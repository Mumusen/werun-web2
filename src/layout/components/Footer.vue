<!--
 * @Author       : linxiao
 * @Date         : 2023-03-14 15:12:18
 * @LastEditors  : linxiao
 * @LastEditTime : 2023-03-28 10:26:19
 * @FilePath     : /src/layout/components/Footer.vue
 * @Description  : Footer
 * Copyright 2023 OBKoro1, All Rights Reserved. 
 * 2023-03-14 15:12:18
-->
<script setup>
import { getConfig } from '@/config'
</script>
<template>
  <div class="w-1200px flex justify-between items-center min-h-48px">
    <div class="w-full h-48px flex justify-center items-center">
      <a-trigger
        position="top"
        auto-fit-position
        :unmount-on-close="false"
        :popup-offset="10"
        :show-arrow="true"
      >
        <a-link :href="getConfig('me.gzhUrl')" target="_blank">
          {{ getConfig('me.gzhName') }}
        </a-link>
        <template #content>
          <a-image width="100" :src="getConfig('me.gzhUrl')" />
        </template>
      </a-trigger>
      <span> Copyright ⓒ 2023</span>
      <a-link target="_blank">
        {{ getConfig('icp') }}
      </a-link>
    </div>
  </div>
</template>
