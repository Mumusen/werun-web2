<!--
 * @Author       : linxiao
 * @Date         : 2023-03-29 17:06:45
 * @LastEditors  : linxiao
 * @LastEditTime : 2023-04-03 10:55:32
 * @FilePath     : /src/views/Dept/DeptItem.vue
 * @Description  : 部门组件
 * Copyright 2023 OBKoro1, All Rights Reserved. 
 * 2023-03-29 17:06:45
-->
<script>
export default {
  directives: {
    focus: {
      mounted(el) {
        el.children[0].focus()
      }
    },
    inputSelect: {
      mounted(el) {
        el.children[0].select()
      }
    }
  }
}
</script>
<script setup>
const deptProps = defineProps(['deptData', 'deptKey', 'stateNum'])
const itemsData = ref([])
const stateObj = ref({})
const stateObjNk = ref(null)
const stateSelect = ref(null)
const addFlag = ref(true)
const addObj = ref({
  show: false
})
onMounted(() => {
  const { deptData } = deptProps
  itemsData.value = deptData.nodes
  console.log('子组件', toRaw(deptData))
})
const emit = defineEmits([
  'children',
  'showChildren',
  'updateName',
  'stateOverlapping',
  'openDel'
])
const openChildren = (row, key) => {
  stateSelect.value = false
  itemsData.value.forEach(e => {
    if (e.nId === row.nId) {
      e.selectFlag = true
      stateSelect.value = e
    } else {
      e.selectFlag = false
    }
  })
  emit('children', {
    data: row,
    key: deptProps.deptKey,
    nk: key
  })
}
watchEffect(() => {
  const { deptData } = deptProps
  itemsData.value = deptData.nodes
  console.log('deptProps.stateNum', deptProps.stateNum)
  stateObj.value = {}
  addObj.value = {
    show: false
  }
  // addFlag.value = false
  let addF = false
  itemsData.value.forEach((e, k) => {
    if (e.editState) {
      stateObj.value = e
      stateObjNk.value = k
      addF = true
    }
  })
  if (!addF) addFlag.value = true
})
// 空白区域交互，通知父，关闭子
const outSideClick = ev => {
  if (!ev.target.closest('.dept-box-item')) {
    emit('showChildren', deptProps.deptKey)
  }
  // 关闭底部
  if (addObj.value.show) {
    console.log('addObj.value', addObj.value)
    addObj.value = {
      show: false
    }
    addFlag.value = true
  }
}
// 新增
const addItemClick = () => {
  // 当前层级是否有部门选中，如有选中则
  const { deptData } = deptProps
  console.log('deptData', deptData, stateSelect)
  const { club_id, team_id, nodes } = deptData
  nodes.push({
    club_id: club_id,
    nodes: [],
    parent_id: team_id,
    // team_id: team_id,
    team_name: 'New Dept',
    oName: '',
    editShow: false,
    editState: 1,
    editShowFlag: true,
    selectFlag: false,
    nId: '21:157:158'
  })
  addFlag.value = false
  // if (!addFlag.value) return
  // if (stateSelect.value) {
  //   nodes.push({
  //     club_id: club_id,
  //     nodes: [],
  //     parent_id: team_id,
  //     // team_id: team_id,
  //     team_name: 'New Dept',
  //     oName: '',
  //     editShow: false,
  //     editState: 1,
  //     editShowFlag: true,
  //     selectFlag: false,
  //     nId: `${club_id}:${team_id}`
  //   })
  // } else {
  //   addObj.value = {
  //     show: true,
  //     club_id: club_id,
  //     nodes: [],
  //     parent_id: team_id,
  //     // team_id: team_id,
  //     team_name: 'New Dept',
  //     oName: '',
  //     editShow: false,
  //     editState: 1,
  //     editShowFlag: true,
  //     selectFlag: false,
  //     nId: `${club_id}:${team_id}`
  //   }
  // }
  // addFlag.value = false
}

// 按钮显示 隐藏
const itemMouseenter = row => {
  if (!row.editShow) row.editShow = true
}
const itemMouseleave = row => {
  if (row.editShow) row.editShow = false
}
// 提交名称
const deptNameCheck = (row, k) => {
  console.log('editShow', row)
  // if (!row.oName) {}
  if (row.team_name === row.oName) {
    row.editState = 0
    stateObj.value = {}
  } else {
    emit('updateName', {
      data: row,
      key: deptProps.deptKey,
      nk: k
    })
  }
}
// 点击编辑按钮
const deptNameTab = (row, k) => {
  // 1.当前是否有已打开的输入框
  // Y: 弹窗提示 N：打开输入框-set
  // 2.弹窗提示：
  //  2.1.是否修改
  //  Y：修改并提交AJAX，打开新的输入框-set
  //  N：恢复旧值，并打开新的输入框-set
  // console.log('deptNameTab', stateObj.value)
  if (!stateObj.value.team_name) {
    console.log('open input')
    row.editState = 1
    stateObj.value = row
    stateObjNk.value = k
  } else {
    const { team_id } = toRaw(row)
    console.log('xxx', team_id, stateObj.value.team_id)
    if (team_id !== stateObj.value.team_id) {
      console.log('不想等-弹窗')
      if (stateObj.value.team_name === stateObj.value.oName) {
        itemsData.value[stateObjNk.value].editState = 0
        itemsData.value[stateObjNk.value].editShow = false
        row.editState = 1
        stateObj.value = row
        stateObjNk.value = k
      } else {
        const obj = {
          data: toRaw(stateObj.value),
          nData: toRaw(row),
          k,
          key: deptProps.deptKey,
          nk: stateObjNk.value
        }
        emit('stateOverlapping', obj)
      }
    }
  }
}
const deptDel = (row, k) => {
  emit('openDel', {
    data: row,
    key: deptProps.deptKey,
    nk: k
  })
}
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
          <i class="dept-box-item-ico"></i>
          <div
            v-show="!deptItem.editState"
            class="dept-box-item-name"
            @click="openChildren(deptItem, index)"
          >
            {{ deptItem.team_name }}
          </div>
          <a-input
            v-if="deptItem.editState"
            v-focus
            v-inputSelect
            style="width: 190px; height: 22px"
            v-model="deptItem.team_name"
            :default-value="deptItem.team_name"
            @press-enter="deptNameCheck(deptItem, index)"
          />
        </div>
        <div class="dept-box-item-r text-right" v-if="!deptItem.editState">
          <span v-show="!deptItem.editShow && !deptItem.editState">{{
            deptItem.count || ''
          }}</span>
          <template v-if="deptItem.editShow">
            <div class="h-100% flex justify-center items-center">
              <icon-tabler-edit
                class="text-20px color-#746CE8"
                @click="deptNameTab(deptItem, index)"
              />
              <icon-tabler-trash
                class="text-20px color-#746CE8"
                @click="deptDel(deptItem, index)"
              />
            </div>
          </template>
        </div>
      </div>
      <template v-if="itemsData.length === 0">
        <div class="h-100% flex justify-center items-center">
          No department yet
        </div>
      </template>
    </div>
    <div class="p-20px">
      <a-button
        type="outline"
        v-if="!addObj.show"
        long
        @click="addItemClick"
        :disabled="!addFlag"
        >+ New Dept.</a-button
      >
      <a-input
        v-if="addObj.show"
        v-focus
        style="height: 22px"
        v-model="addObj.team_name"
        :default-value="addObj.team_name"
        @press-enter="deptNameCheck(addObj, 'add')"
      />
    </div>
  </div>
</template>
<style scoped>
.dept-box {
  width: 260px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #d7d8de;
  font-size: 15px;
}
.dept-box-title {
  font-size: 15px;
  border-bottom: 1px solid #d7d8de;
  text-align: center;
}
.dept-box-min {
  flex-grow: 2;
  overflow: auto;
}
.dept-box-item {
  cursor: pointer;
  display: flex;
  padding: 0 16px 0 22px;
  border-left: 2px solid transparent;
}
.dept-box-item:first-child {
  margin-top: 10px;
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
