<!--
 * @Author       : linxiao
 * @Date         : 2023-03-30 11:51:52
 * @LastEditors  : linxiao
 * @LastEditTime : 2023-03-30 11:51:53
 * @FilePath     : /src/views/Dept/DeptItem copy.vue
 * @Description  : 
 * Copyright 2023 OBKoro1, All Rights Reserved. 
 * 2023-03-30 11:51:52
-->
<!--
 * @Author       : linxiao
 * @Date         : 2023-03-29 17:06:45
 * @LastEditors  : linxiao
 * @LastEditTime : 2023-03-30 11:34:47
 * @FilePath     : /src/views/Dept/DeptItem.vue
 * @Description  : 部门组件
 * Copyright 2023 OBKoro1, All Rights Reserved. 
 * 2023-03-29 17:06:45
-->
<script setup>
// 接收数据
const deptData = defineProps({
  deptItem: {
    type: Array
  },
  keyIndex: {
    type: Number,
    require: true
  }
})
// const { keyIndex, deptItem } = toRefs(deptData)
const emit = defineEmits(['children'])
// 按钮显示 隐藏
const itemMouseenter = row => {
  row.editShow = true
  return
}
const itemMouseleave = row => {
  row.editShow = false
  return
}
const openChildren = row => {
  deptData.deptItem.forEach(e => {
    if (e.team_id === row.team_id) {
      e.selectFlag = true
    } else {
      e.selectFlag = false
    }
  })
  emit('children', row)
}
// 模式切换
const deptNameTab = row => {
  console.log('deptNameTab=>', row)
}
</script>
<template>
  <div class="dept-box" v-if="deptData.keyIndex">
    <div class="dept-box-title h-48px lh-48px">
      LEVEL - {{ deptData.keyIndex }}
    </div>
    <div class="dept-box-min">
      <div
        class="dept-box-item h-36px lh-36px"
        v-for="(item, index) in deptData.deptItem"
        :key="index"
        :class="item.selectFlag ? 'dept-box-item-select' : ''"
        @mouseenter="itemMouseenter(item)"
        @mouseleave="itemMouseleave(item)"
      >
        <div class="dept-box-item-l">
          <div
            v-show="!item.editState"
            class="dept-box-item-name"
            @click="openChildren(item)"
          >
            <i class="dept-box-item-ico"></i>
            {{ item.team_name }}
          </div>
          <a-input
            v-if="item.editShowFlag && item.editState"
            v-model="item.team_name"
            :default-value="item.team_name"
          />
        </div>
        <div class="dept-box-item-r flex justify-center items-center">
          <span v-show="!item.editShow && !item.editState">{{
            item.count || ''
          }}</span>
          <template v-if="item.editShow">
            <icon-ri:edit-box-line
              class="text-20px color-#746CE8"
              v-if="item.editState === 0"
              @click="deptNameTab(item, 2, index, item.team_id)"
            />
            <icon-material-symbols:check-circle-outline-rounded
              v-if="item.editState === 1"
              class="text-20px color-#746CE8"
              @click="deptNameCheck(item, 2, index)"
            />
            <icon-ri:delete-bin-6-line
              class="text-20px color-#746CE8"
              @click="deptDel(deptData[2].children, deptItem, index, 2)"
            />
          </template>
        </div>
      </div>
      <!-- <template v-if="deptData.deptItem.length === 0">
        <div class="p-20px">No department yet</div>
      </template> -->
    </div>
    <div class="p-20px">
      <a-button type="outline" long>+ New Dept.</a-button>
    </div>
  </div>
</template>
<style scoped>
.dept-box {
  width: 260px;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.dept-box-title {
  font-size: 15px;
  border-bottom: 1px solid #d7d8de;
  text-align: center;
}
.dept-box-min {
  padding-top: 10px;
  flex-grow: 2;
}
.dept-box-item {
  cursor: pointer;
  display: flex;
  padding: 7px 10px 7px 20px;
  border-left: 2px solid transparent;
}
.dept-box-item:hover,
.dept-box-item:hover .dept-box-item-ico,
.dept-box-item-select,
.dept-box-item-select .dept-box-item-ico {
  color: #746ce8;
  border-color: #746ce8;
  background-color: rgba(134, 146, 208, 0.16);
  /* background-color: rgb(var(--arcoblue-1)); */
}

.dept-box-item-name {
  flex: 1;
}

.dept-box-item-num {
  flex: 0 0 20px;
}
.dept-box-item-l {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dept-box-item-ico {
  float: left;
  width: 7px;
  height: 7px;
  border: 2px solid #4b465c;
  border-radius: 50%;
  margin: 13px 10px 0 0;
}
.dept-box-item-r {
  flex: 0 0 50px;
  margin-left: 5px;
}
</style>
