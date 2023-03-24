<!--
 * @Author       : linxiao
 * @Date         : 2023-03-24 16:18:46
 * @LastEditors  : linxiao
 * @LastEditTime : 2023-03-24 18:20:43
 * @FilePath     : /src/views/Dept/index.vue
 * @Description  : Dept
 * Copyright 2023 OBKoro1, All Rights Reserved. 
 * 2023-03-24 16:18:46
-->
<script setup>
const deptData = computed(() => {
  return [
    {
      level: 1,
      children: [
        {
          id: 1,
          name: 'Human Resource',
          rightShow: false,
          childrenNum: 3
        },
        {
          id: 2,
          name: 'Human Resource',
          rightShow: false,
          childrenNum: 3
        },
        {
          id: 3,
          name: 'Human Resource',
          rightShow: false,
          childrenNum: 2
        }
      ]
    },
    {
      level: 11,
      children: [
        {
          id: 11,
          name: 'Human Resource-2',
          rightShow: false,
          childrenNum: 3
        },
        {
          id: 21,
          name: 'Human Resource-2',
          rightShow: false,
          childrenNum: 3
        },
        {
          id: 31,
          name: 'Human Resource-2',
          rightShow: false,
          childrenNum: 3
        }
      ]
    }
  ]
})
const itemClick = row => {
  console.log('row', row)
}
const mousedown = row => {
  console.log('mousedown', row)
}
</script>

<template>
  <div class="max-w-1200px w-full p-20px box-border">
    <div class="flex dept-warp">
      <div class="dept-box dept-box-border-right">
        <div class="dept-box-title">LEVEL - 1</div>
        <div class="dept-box-min">
          <template v-if="deptData[0] && deptData[0].children.length > 0">
            <div
              class="dept-box-item"
              v-for="(deptItem, index) in deptData[0].children"
              :key="index"
              @click="itemClick(deptItem.id)"
              @mousedown="mousedown(deptItem)"
              @mouseleave="deptItem.rightShow = false"
            >
              {{ deptItem.name }} {{ deptItem.childrenNum }}
            </div>
          </template>
        </div>
      </div>
      <div class="dept-box dept-box-border-right">
        <div class="dept-box-title">LEVEL - 2</div>
        <div class="dept-box-min">
          <template v-if="deptData[1] && deptData[1].children.length > 0">
            <div
              class="dept-box-item"
              v-for="(deptItem, index) in deptData[1].children"
              :key="index"
              @click="itemClick(deptItem.id)"
              @mouseenter="deptItem.rightShow = true"
              @mouseleave="deptItem.rightShow = false"
            >
              <div class="dept-box-item-name">{{ deptItem.name }}</div>
              <div class="dept-box-item-right">
                <span v-show="!deptItem.rightShow">{{
                  deptItem.childrenNum
                }}</span>
                <div v-show="deptItem.rightShow">
                  <icon-ri:edit-box-line class="text-20px" />
                  <icon-ri:delete-bin-6-line class="text-20px" />
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="dept-box dept-box-border-right">
        <div class="dept-box-title">LEVEL - 3</div>
        <div class="dept-box-min">
          <template v-if="deptData[2] && deptData[2].children.length > 0">
            <div
              class="dept-box-item"
              v-for="(deptItem, index) in deptData[2].children"
              :key="index"
              @click="itemClick(deptItem.id)"
            >
              {{ deptItem.name }} {{ deptItem.childrenNum }}
            </div>
          </template>
        </div>
      </div>
      <div class="dept-box">
        <div class="dept-box-title">LEVEL - 4</div>
        <div class="dept-box-min">
          <template v-if="deptData[3] && deptData[3].children.length > 0">
            <div
              class="dept-box-item"
              v-for="(deptItem, index) in deptData[3].children"
              :key="index"
              @click="itemClick(deptItem.id)"
            >
              {{ deptItem.name }} {{ deptItem.childrenNum }}
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.dept-warp {
  border: 1px solid;
}
.dept-box {
  flex: 1;
}
.dept-box-border-right {
  border-right: 1px solid;
}
.dept-box-title {
  border-bottom: 1px solid;
  padding: 20px;
  text-align: center;
}
.dept-box-min {
  padding: 20px 20px 10px 20px;
}
.dept-box-item {
  cursor: pointer;
  margin-bottom: 10px;
  display: flex;
}
.dept-box-item:hover {
  color: rgb(var(--arcoblue-6));
  /* background-color: ; */
}
.dept-box-item-name {
  flex: 1;
}
.dept-box-item-num {
  flex: 0 0 20px;
}
</style>
