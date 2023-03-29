<!--
 * @Author       : linxiao
 * @Date         : 2023-03-29 15:21:00
 * @LastEditors  : linxiao
 * @LastEditTime : 2023-03-29 15:21:01
 * @FilePath     : /src/layout/components/Navbar copy.vue
 * @Description  : 
 * Copyright 2023 OBKoro1, All Rights Reserved. 
 * 2023-03-29 15:21:00
-->
<template>
  <div class="w-full h-full flex px-20px box-border">
    <div class="h-full flex">
      <slot name="left" />
    </div>
    <div class="h-full flex-1">
      <slot />
      <slot name="center" />
    </div>
    <div class="h-full flex flex-shrink-0 items-center">
      <div>
        <slot name="right" />
      </div>
    </div>
  </div>
</template>
