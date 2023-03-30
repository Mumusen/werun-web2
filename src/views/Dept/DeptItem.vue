<!--
 * @Author       : linxiao
 * @Date         : 2023-03-29 17:06:45
 * @LastEditors  : linxiao
 * @LastEditTime : 2023-03-30 18:25:02
 * @FilePath     : /src/views/Dept/DeptItem.vue
 * @Description  : 部门组件
 * Copyright 2023 OBKoro1, All Rights Reserved. 
 * 2023-03-29 17:06:45
-->
<script setup>
// 接收数据
const deptProps = defineProps(['deptData', 'deptKey', 'stateNum'])
const itemsData = ref([])
const stateObj = ref({})
const stateObjNk = ref(null)
onMounted(() => {
  const { deptData } = deptProps
  itemsData.value = deptData.nodes
  console.log('子组件', toRaw(deptData))
})
const emit = defineEmits([
  'children',
  'showChildren',
  'updateName',
  'stateOverlapping'
])
const openChildren = row => {
  itemsData.value.forEach(e => {
    if (e.nId === row.nId) {
      e.selectFlag = true
    } else {
      e.selectFlag = false
    }
  })
  emit('children', {
    data: row,
    key: deptProps.deptKey
  })
}
watchEffect(() => {
  const { deptData } = deptProps
  itemsData.value = deptData.nodes
  console.log('deptProps.stateNum', deptProps.stateNum)
  stateObj.value = {}
})
// 空白区域交互，通知父，关闭子
const outSideClick = ev => {
  if (!ev.target.closest('.dept-box-item')) {
    emit('showChildren', deptProps.deptKey)
  }
}
// 新增
const addItemClick = () => {
  const { deptData } = deptProps
  const { club_id, parent_id, team_id, nodes } = deptData
  nodes.push({
    club_id: club_id,
    nodes: [],
    parent_id: parent_id,
    team_id: team_id,
    team_name: 'New Dept',
    oName: '',
    editShow: false,
    editState: 1,
    editShowFlag: true,
    selectFlag: false,
    nId: '21:157:158'
  })
}

// 按钮显示 隐藏
const itemMouseenter = row => {
  if (row.editState) return
  row.editShow = true
  return
}
const itemMouseleave = row => {
  if (row.editState) return
  row.editShow = false
  return
}
// 提交名称
const deptNameCheck = (row, k) => {
  console.log('editShow', row)
  // if (!row.oName) {}
  if (row.team_name === row.oName) {
    row.editState = 0
  } else {
    emit('updateName', {
      data: row,
      key: deptProps.deptKey,
      nk: k
    })
  }
}
const deptNameTab = (row, k) => {
  if (!stateObj.value.team_name) {
    row.editState = 1
    stateObj.value = row
    stateObjNk.value = k
    console.log('stateObj', stateObj)
  } else {
    const obj = {
      data: toRaw(stateObj.value),
      nData: toRaw(row),
      k,
      key: deptProps.deptKey,
      nk: stateObjNk.value
    }
    console.log('obj', obj)
    emit('stateOverlapping', obj)
  }
}
const deptDel = () => {}
</script>
<template>
  <div class="dept-box">
    <div class="dept-box-title h-48px lh-48px">
      LEVEL - {{ deptProps.deptKey + 1 }}
    </div>
    <div class="dept-box-min" @click.capture="outSideClick">
      <div
        class="dept-box-item h-36px lh-36px"
        v-for="(deptItem, index) in itemsData"
        :key="index"
        :class="deptItem.selectFlag ? 'dept-box-item-select' : ''"
        @mouseenter="itemMouseenter(deptItem)"
        @mouseleave="itemMouseleave(deptItem)"
      >
        <div class="dept-box-item-l">
          <div
            v-show="!deptItem.editState"
            class="dept-box-item-name"
            @click="openChildren(deptItem)"
          >
            <i class="dept-box-item-ico"></i>
            {{ deptItem.team_name }}
          </div>
          <a-input
            v-if="deptItem.editState"
            v-model="deptItem.team_name"
            :default-value="deptItem.team_name"
            @press-enter="deptNameCheck(deptItem, index)"
          />
        </div>
        <div
          class="dept-box-item-r flex justify-center items-center"
          v-if="!deptItem.editState"
        >
          <span v-show="!deptItem.editShow && !deptItem.editState">{{
            deptItem.nodes.length || ''
          }}</span>
          <template v-if="deptItem.editShow">
            <icon-ri:edit-box-line
              class="text-20px color-#746CE8"
              @click="deptNameTab(deptItem, index)"
            />
            <icon-ri:delete-bin-6-line
              class="text-20px color-#746CE8"
              @click="deptDel(deptItem)"
            />
          </template>
        </div>
      </div>
      <template v-if="itemsData.length === 0">
        <div class="p-20px">No department yet</div>
      </template>
    </div>
    <div class="p-20px">
      <a-button type="outline" long @click="addItemClick">+ New Dept.</a-button>
    </div>
  </div>
</template>
<style scoped>
.dept-box {
  width: 260px;
  display: flex;
  flex-direction: column;
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
