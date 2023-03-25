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
const deptData = ref([
  {
    level: 1,
    petd_id: 1,
    children: [
      {
        id: 1,
        name: 'Human Resource',
        count: 3
      },
      {
        id: 2,
        name: 'Human Resource',
        count: 3
      },
      {
        id: 3,
        name: 'Human Resource',
        rightShow: false,
        count: 2
      }
    ]
  },
  {
    level: 2,
    petd_id: 1,
    addShowFlag: true,
    addShow: false,
    addVal: '',
    children: [
      {
        club_id: 15,
        count: 6,
        teamId: 86,
        parentId: 119,
        name: 'Human Resource-2.1',
        oldName: 'Human Resource-2.1',
        childrenNum: 3,
        editShowFlag: true,
        editShow: false,
        editState: 0
      },
      {
        club_id: 15,
        count: 6,
        teamId: 86,
        parentId: 120,
        name: 'Human Resource-2.2',
        oldName: 'Human Resource-2.2',
        childrenNum: 3,
        editShowFlag: true,
        editShow: false,
        editState: 0
      },
      {
        club_id: 15,
        count: 6,
        teamId: 86,
        parentId: 121,
        name: 'Human Resource-2.3',
        oldName: 'Human Resource-2.3',
        childrenNum: 3,
        editShowFlag: true,
        editShow: false,
        editState: 0
      }
    ]
  },
  {
    level: 3,
    petd_id: 3,
    addShowFlag: true,
    addShow: false,
    addVal: '',
    children: [
      {
        club_id: 16,
        count: 6,
        teamId: 861,
        parentId: 1119,
        name: 'Human Resource-3.1',
        oldName: 'Human Resource-3.1',
        editShowFlag: true,
        editShow: false,
        editState: 0
      },
      {
        club_id: 16,
        count: 6,
        teamId: 861,
        parentId: 1120,
        name: 'Human Resource-3.2',
        oldName: 'Human Resource-3.2',
        editShowFlag: true,
        editShow: false,
        editState: 0
      },
      {
        club_id: 16,
        count: 6,
        teamId: 861,
        parentId: 1121,
        name: 'Human Resource-3.3',
        oldName: 'Human Resource-3.3',
        editShowFlag: true,
        editShow: false,
        editState: 0
      }
    ]
  }
])
const stateData = ref({
  level: -1,
  key: 0,
  val: 0,
  nLevel: 0,
  nKey: 0,
  nVal: 0
})
const visibleShow = ref(false)
// 新增-状态切换
const deptOpenAdd = (row, t) => {
  row.addShow = t
  console.log('row', row)
}
// 新增当前列部门 - API
const deptAdd = (row, t) => {
  row.addShow = t
  const data = toRaw(row)
  console.log('deptAddClick', data)
}

// 按钮显示 隐藏
const itemMouseenter = row => {
  row.editShow = true
}
const itemMouseleave = row => {
  row.editShow = false
}
// 编辑模式切换
const deptNameTab = (row, level, key, id) => {
  const state = stateData.value
  state.nLevel = level
  state.nKey = key
  state.nVal = id
  if (state.level === -1) {
    row.editState = 1
    state.level = level
    state.key = key
    state.val = id
  } else {
    if (state.val === id) {
      row.editState = 1
      state.level = level
      state.key = key
      return
    }
    const data = toRaw(deptData.value[state.level].children[state.key])
    if (data.name !== data.oldName) {
      visibleShow.value = true
    } else {
      deptData.value[state.level].children[state.key].editState = 0
      deptData.value[level].children[key].editState = 0
      row.editState = 1
      state.level = level
      state.key = key
      state.val = id
    }
  }
}
// 弹窗确认
const visibleOk = () => {
  const data = toRaw(
    deptData.value[stateData.value.level].children[stateData.value.key]
  )
  deptUpdate({
    request_id: '',
    operator_id: '1c38e7c3-1af7-4fe5-a878-a57fddf141d6',
    club_id: data.clubId,
    dept_id: data.teamId,
    new_dept: {
      club_id: data.clubId,
      parent_id: data.parentId,
      name: data.teamName,
      data_body: ''
    }
  }).then(res => {
    if (res.dept && res.dept.create_time) {
      visibleCancel()
      AMessage.success('This is a success message!')
    } else {
      AMessage.error('This is a normal message!')
    }
  })
}
// 弹窗-关闭
const visibleCancel = t => {
  const oldData =
    deptData.value[stateData.value.level].children[stateData.value.key]
  if (t) {
    let data = toRaw(oldData)
    oldData.name = data.oldName
  }
  oldData.editState = 0
  stateData.value.level = stateData.value.nLevel
  stateData.value.key = stateData.value.nKey
  stateData.value.val = stateData.value.nVal
  const newData =
    deptData.value[stateData.value.nLevel].children[stateData.value.nKey]
  newData.editState = 1
}
// 提交更新
const deptNameCheck = row => {
  const data = toRaw(row)
  if (!data.name) {
    AMessage.warning('This is a warning message!')
    return
  }
  console.log(data)
  deptUpdate({
    request_id: '',
    operator_id: '1c38e7c3-1af7-4fe5-a878-a57fddf141d6',
    club_id: data.clubId,
    dept_id: data.teamId,
    new_dept: {
      club_id: data.clubId,
      parent_id: data.parentId,
      name: data.teamName,
      data_body: ''
    }
  }).then(res => {
    if (res.dept && res.dept.create_time) {
      row.oldName = row.name
      row.editState = 0
      row.editShow = false
      AMessage.success('This is a success message!')
    } else {
      AMessage.error('This is a normal message!')
    }
  })
}
// 展开具体
const itemClick = row => {
  console.log('row', row)
}
// 删除单个部门 - API
const deptDel = (row, k) => {
  console.log(row, k)
  deptApiDel({
    request_id: '',
    operator_id: '1c38e7c3-1af7-4fe5-a878-a57fddf141d6',
    club_id: row.clubId,
    dept_id: row.deptId
  }).then(res => {
    if (res.club_id) {
      row.splice(k, 1)
      AMessage.success('This is a success message!')
    } else {
      AMessage.error('This is a normal message!')
    }
  })
}
// // 更新当前列 - API
// const deptListUpdate = row => {
//   console.log('deptListUpdate', row)
// }
// // 更新部门名称 - API
const deptUpdate = row => {
  console.log('deptUpdate', row)
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        dept: {
          id: 129,
          club_id: 15,
          parent_id: 89,
          name: 'test_name11',
          data_body: '',
          count: 0,
          create_time: '2023-03-23T16:31:37+09:00',
          children_count: 0,
          parent: {
            id: 89,
            club_id: 15,
            parent: 0,
            name: 'xingki',
            count: 5,
            children_count: 6,
            rgt: 21,
            lft: 4
          },
          rgt: 6,
          lft: 5,
          depth: 1
        }
      })
    })
  })
  // deptListUpdate()
}
// // 删除部门 - API
const deptApiDel = row => {
  console.log('deptUpdateClick', row)
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ club_id: 15, parent_id: 89 })
    })
  })
  // deptListUpdate()
}
// // 获取下级部门 - API
// const deptGetChildren = row => {
//   console.log('deptGetChildren', row)
// }
</script>

<template>
  <div class="max-w-1200px w-full p-20px box-border">
    <div class="flex dept-warp">
      <div class="dept-box">
        <div class="dept-box-title">LEVEL - 1</div>
        <div class="dept-box-min">
          <template v-if="deptData[0] && deptData[0].children.length > 0">
            <div
              class="dept-box-item h-30px lh-30px"
              v-for="(deptItem, index) in deptData[0].children"
              :key="index"
              :class="!deptItem.selectFlag ? 'dept-box-item-select' : ''"
            >
              <div class="dept-box-item-l">
                <div
                  class="dept-box-item-name"
                  @click="itemClick(deptItem.id)"
                  @mouseenter="itemMouseenter(deptItem)"
                  @mouseleave="itemMouseleave(deptItem)"
                  v-show="!deptItem.editState"
                >
                  <i class="dept-box-item-ico"></i>
                  {{ deptItem.name }}
                </div>
                <a-input
                  v-if="deptItem.editShowFlag && deptItem.editState === 1"
                  :default-value="deptItem.name"
                />
              </div>
              <div class="dept-box-item-r">
                <span>{{ deptItem.count }}</span>
                <template v-if="deptItem.editShowFlag">
                  <div
                    v-if="deptItem.editShow"
                    class="dept-box-btn flex justify-start items-center"
                  >
                    <icon-ri:edit-box-line class="text-20px" />
                    <icon-ri:delete-bin-6-line class="text-20px" />
                  </div>
                </template>
              </div>
            </div>
          </template>
        </div>
        <div class="p-20px" v-if="deptData[0].addShowFlag">
          <a-button
            type="outline"
            long
            v-if="deptData[0].addShow"
            :disabled="deptData[0] && !deptData[0].petd_id"
            @click="deptOpenAdd(deptData[0], true)"
            >+ New Dept.</a-button
          >
          <div class="flex justify-center items-center" v-else>
            <a-input v-model="deptData[0].addVal" />
            <icon-material-symbols:check-circle-outline-rounded
              class="text-20px pl-10px"
              @click="deptAdd(deptData[0], false)"
            />
          </div>
        </div>
      </div>
      <div class="dept-box">
        <div class="dept-box-title">LEVEL - 2</div>
        <div class="dept-box-min">
          <template v-if="deptData[1] && deptData[1].children.length > 0">
            <div
              class="dept-box-item h-30px lh-30px"
              v-for="(deptItem, index) in deptData[1].children"
              :key="index"
              :class="!deptItem.selectFlag ? 'dept-box-item-select' : ''"
              @mouseenter="itemMouseenter(deptItem)"
              @mouseleave="itemMouseleave(deptItem)"
            >
              <div class="dept-box-item-l">
                <div v-show="!deptItem.editState" class="dept-box-item-name">
                  <i class="dept-box-item-ico"></i>
                  {{ deptItem.name }}
                </div>
                <a-input
                  v-if="deptItem.editShowFlag && deptItem.editState"
                  v-model="deptItem.name"
                  :default-value="deptItem.name"
                />
              </div>
              <div class="dept-box-item-r">
                <span v-show="!deptItem.editShow && !deptItem.editState">{{
                  deptItem.count
                }}</span>
                <template v-if="deptItem.editShowFlag">
                  <div
                    v-if="deptItem.editShow || deptItem.editState"
                    class="dept-box-btn flex items-center"
                  >
                    <icon-ri:edit-box-line
                      class="text-20px"
                      v-if="deptItem.editState === 0"
                      @click="
                        deptNameTab(deptItem, 1, index, deptItem.parentId)
                      "
                    />
                    <icon-material-symbols:check-circle-outline-rounded
                      v-if="deptItem.editState === 1"
                      class="text-20px"
                      @click="deptNameCheck(deptItem)"
                    />
                    <icon-ri:delete-bin-6-line
                      class="text-20px"
                      @click="deptDel(deptData[1].children, index)"
                    />
                  </div>
                </template>
              </div>
            </div>
          </template>
        </div>
        <div class="p-20px" v-if="deptData[1].addShowFlag">
          <a-button
            type="outline"
            long
            v-if="!deptData[1].addShow"
            :disabled="deptData[1] && !deptData[1].petd_id"
            @click="deptOpenAdd(deptData[1], true)"
            >+ New Dept.</a-button
          >
          <div class="flex justify-center items-center" v-else>
            <a-input v-model="deptData[1].addVal" />
            <icon-material-symbols:check-circle-outline-rounded
              class="text-20px pl-10px"
              @click="deptAdd(deptData[1], false)"
            />
          </div>
        </div>
      </div>
      <div class="dept-box">
        <div class="dept-box-title">LEVEL - 3</div>
        <div class="dept-box-min">
          <template v-if="deptData[2] && deptData[2].children.length > 0">
            <div
              class="dept-box-item h-30px lh-30px"
              v-for="(deptItem, index) in deptData[2].children"
              :key="index"
              :class="!deptItem.selectFlag ? 'dept-box-item-select' : ''"
              @mouseenter="itemMouseenter(deptItem)"
              @mouseleave="itemMouseleave(deptItem)"
            >
              <div class="dept-box-item-l">
                <div v-show="!deptItem.editState" class="dept-box-item-name">
                  <i class="dept-box-item-ico"></i>
                  {{ deptItem.name }}
                </div>
                <a-input
                  v-if="deptItem.editShowFlag && deptItem.editState"
                  v-model="deptItem.name"
                  :default-value="deptItem.name"
                />
              </div>
              <div class="dept-box-item-r">
                <span v-show="!deptItem.editShow && !deptItem.editState">{{
                  deptItem.count
                }}</span>
                <template v-if="deptItem.editShowFlag">
                  <div
                    v-if="deptItem.editShow || deptItem.editState"
                    class="dept-box-btn flex items-center"
                  >
                    <icon-ri:edit-box-line
                      class="text-20px"
                      v-if="deptItem.editState === 0"
                      @click="
                        deptNameTab(deptItem, 1, index, deptItem.parentId)
                      "
                    />
                    <icon-material-symbols:check-circle-outline-rounded
                      v-if="deptItem.editState === 1"
                      class="text-20px"
                      @click="deptNameCheck(deptItem)"
                    />
                    <icon-ri:delete-bin-6-line
                      class="text-20px"
                      @click="deptDel(deptData[2].children, index)"
                    />
                  </div>
                </template>
              </div>
            </div>
          </template>
        </div>
        <div class="p-20px" v-if="deptData[2] && deptData[2].addShowFlag">
          <a-button
            type="outline"
            long
            v-if="!deptData[2].addShow"
            :disabled="deptData[2] && !deptData[2].petd_id"
            @click="deptOpenAdd(deptData[2], true)"
            >+ New Dept.</a-button
          >
          <div class="flex justify-center items-center" v-else>
            <a-input v-model="deptData[2].addVal" />
            <icon-material-symbols:check-circle-outline-rounded
              class="text-20px pl-10px"
              @click="deptAdd(deptData[1], false)"
            />
          </div>
        </div>
      </div>
    </div>
    <a-modal
      v-model:visible="visibleShow"
      @ok="visibleOk"
      @cancel="visibleCancel(1)"
    >
      <template #title> Title </template>
      <div>是否提交已变更的内容？</div>
    </a-modal>
  </div>
</template>

<style>
.dept-warp {
  border: 1px solid;
  box-sizing: border-box;
  height: calc(100vh - 138px);
}

.dept-box {
  display: flex;
  flex-direction: column;
  flex: 1;
  border-right: 1px solid;
}
.dept-box:last-child{
  border-right: 0;
}

.dept-box-title {
  border-bottom: 1px solid;
  padding: 20px;
  text-align: center;
}
.dept-box-min {
  flex-grow: 2;
  padding: 20px 20px 10px 20px;
}

.dept-box-item {
  cursor: pointer;
  margin-bottom: 10px;
  display: flex;
}

.dept-box-item-select:hover {
  color: rgb(var(--arcoblue-6));
}

.dept-box-item-name {
  flex: 1;
}

.dept-box-item-num {
  flex: 0 0 20px;
}
.dept-box-item-l {
  flex: 1;
}
.dept-box-item-ico {
  float: left;
  width: 5px;
  height: 5px;
  border: 1px solid;
  border-radius: 50%;
  margin: 11px 10px 0 0;
}
.dept-box-item-r {
  flex: 0 0 50px;
  margin-left: 10px;
  text-align: right;
}
</style>
