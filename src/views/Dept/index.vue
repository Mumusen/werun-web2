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
import ajaxJson from './ajaxJson.json'
import {
  getClubAllDeptTree,
  postDeptCreate,
  postDeptDelete,
  postDeptUpdate
} from '@/api/dept'
const deptData = ref([])
const stateData = ref({
  level: -1,
  key: 0,
  val: 0,
  nLevel: 0,
  nKey: 0,
  nVal: 0
})
const visibleShow = ref(false)

// 获取部门一级列表
const getManagingClubs = () => {
  const data = ajaxJson.GetManagingClubs
  let newArr = {
    level: 1,
    petd_id: null,
    children: []
  }
  data.forEach(e => {
    newArr.children.push({
      id: e.id,
      team_name: e.name,
      rightShow: false
    })
  })
  deptData.value[0] = newArr
}
getManagingClubs()
// 新增-状态切换
const deptOpenAdd = (row, t) => {
  row.addShow = t
}
// 新增当前列部门 - API loading
const deptAdd = (row, t) => {
  const data = toRaw(row)
  const ajaxData = {
    request_id: '',
    operator_id: '1c38e7c3-1af7-4fe5-a878-a57fddf141d6',
    dept: {
      club_id: data.club_id,
      name: data.addVal,
      data_body: ''
    }
  }
  if (data.team_id) ajaxData.dept.parent_id = data.team_id
  postDeptCreate(ajaxData).then(res => {
    if (res && res.data) {
      const ajaxData = res.data
      const newData = {
        club_id: ajaxData.club_id,
        count: 0,
        children: [],
        nodes: [],
        team_id: ajaxData.id,
        parent_id: ajaxData.parent_id,
        team_name: ajaxData.name,
        oldName: ajaxData.name,
        editShowFlag: true,
        editShow: false,
        editState: 0
      }
      deptData.value[row.level].children.push(newData)
      // 更新第一列存值
      if (data.level === 2) {
        updateDeptData(1, newData, data.team_id)
      }
      if (data.level === 3) {
        updateDeptData(1, newData, data.parent_id, data.team_id)
      }
      row.addShow = t
      row.addVal = ''
      if (row.level > 1) {
        console.log(deptData.value[row.level - 1])
        deptData.value[row.level - 1].children.forEach(e => {
          if (e.team_id === data.team_id) e.count++
        })
      }
    }
  })
}
// 本地数据更新
const updateDeptData = (t, obj, a, b) => {
  // t：新增or删除，obj:any, a:2；b:3
  console.log('updateDeptData', t, obj, a, b)
  deptData.value[1].children.forEach(e => {
    if (e.team_id === a) {
      if (!b) {
        if (t) {
          e.children.push(obj)
        } else {
          e.children.splice(obj, 1)
          console.log(e.children, obj)
        }
        return
      }
      e.children.forEach((n, nk) => {
        if (n.team_id === b) {
          if (t) {
            e.children[nk].nodes.push(obj)
          } else {
            e.children[nk].splice.push(obj)
          }
        }
      })
    }
  })
  console.log(toRaw(deptData.value[1]))
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
    if (data.team_name !== data.oldName) {
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
  postDeptUpdate({
    request_id: '',
    operator_id: '1c38e7c3-1af7-4fe5-a878-a57fddf141d6',
    club_id: data.clubId,
    dept_id: data.teamId,
    new_dept: {
      club_id: data.clubId,
      parent_id: data.parentId,
      name: data.team_name,
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
    oldData.team_name = data.oldName
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
const deptNameCheck = (row, level, key) => {
  const data = toRaw(row)
  console.log('deptNameCheck', data)
  if (data.team_name === data.oldName) {
    row.editState = 0
    row.editShow = false
    return
  }
  if (!data.team_name) {
    AMessage.warning('This is a warning message!')
    return
  }
  postDeptUpdate({
    request_id: '',
    operator_id: '1c38e7c3-1af7-4fe5-a878-a57fddf141d6',
    club_id: data.club_id,
    dept_id: data.team_id,
    new_dept: {
      club_id: data.club_id,
      parent_id: data.parentId,
      name: data.team_name,
      data_body: ''
    }
  }).then(res => {
    if (res.dept && res.dept.create_time) {
      row.oldName = row.team_name
      row.editState = 0
      row.editShow = false
      if (level === 2) updateDeptDataName(row, key)
      if (level === 3) updateDeptDataName(row, key, 1)
      AMessage.success('This is a success message!')
    } else {
      AMessage.error('This is a normal message!')
    }
  })
}
const updateDeptDataName = (row, key, t) => {
  console.log('updateDeptDataName', deptData.value[1].children, toRaw(row))
  if (t) {
    deptData.value[1].children.forEach(e => {
      if (e.team_id === row.delId) {
        e.children.forEach(n => {
          if (n.team_id === row.parent_id) {
            n.nodes[key].team_name = row.team_name
          }
        })
      }
    })
    return
  }
  deptData.value[1].children.forEach(e => {
    if (e.team_id === row.parent_id) {
      e.children[key].team_name = row.team_name
    }
  })
  // console.log(deptData.value[1].children, row, level)
}
const updateDeptDataDel = (k, aId, bId, cId) => {
  console.log('updateDeptDataDel', k, aId, bId, cId)
  if (!bId) {
    deptData.value[1].children.splice(k, 1)
    return
  }
  deptData.value[1].children.forEach(a => {
    if (a.team_id === aId) {
      if (cId) {
        a.children.forEach(b => {
          if (b.team_id === bId) {
            b.nodes.splice(k, 1)
          }
        })
        return
      }
      a.children.splice(k, 1)
    }
  })
  console.log('updateDeptDataDel end', deptData)
}
// 删除单个部门 - API
const deptDel = (row, data, k, level) => {
  // console.log('deptDel=>', level, toRaw(data), toRaw(deptData.value))
  postDeptDelete({
    request_id: '',
    operator_id: '1c38e7c3-1af7-4fe5-a878-a57fddf141d6',
    club_id: data.club_id,
    dept_id: data.team_id
  }).then(res => {
    if (res.club_id) {
      row.splice(k, 1)
      if (level > 1) {
        if (level === 1) {
          updateDeptDataDel(k, data.team_id)
        }
        if (level === 2) {
          updateDeptDataDel(k, data.parent_id, data.team_id)
        }
        if (level === 3) {
          updateDeptDataDel(k, data.delId, data.parent_id, data.team_id)
        }
        deptData.value[level - 1].children.forEach(e => {
          if (e.team_id === data.parent_id) {
            e.count--
          }
        })
      }
      AMessage.success('This is a success message!')
    } else {
      AMessage.error('This is a normal message!')
    }
  })
}
// // 获取下级部门 - API
const deptGetChildren = row => {
  getClubAllDeptTree({
    club_id: row.id,
    request_id: ''
  }).then(res => {
    console.log(res, res.club, res.nodes.nodes)
    if (res && res.club && res.nodes.nodes) {
      const children = res.nodes.nodes
      const clubData = res.club
      let newArr = {
        level: 2,
        club_id: clubData.id,
        // petd_id: row.id,
        addShowFlag: true,
        addShow: false,
        addVal: '',
        children: []
      }
      // 更新第一列
      row.num = children.length
      // 更新第二列
      if (children.length > 0) {
        children.forEach(e => {
          newArr.children.push({
            club_id: e.club_id,
            count: e.nodes.length,
            children: e.nodes,
            team_id: e.team_id,
            parent_id: e.parent_id,
            team_name: e.team_name,
            oldName: e.team_name,
            editShowFlag: true,
            editShow: false,
            editState: 0
          })
        })
      }
      deptData.value[1] = newArr
    }
  })
}
// 获取部门列
const openChildren = (k, row) => {
  const rowData = toRaw(row)
  console.log('rowData', rowData)
  let newArr = {
    level: k + 1,
    club_id: rowData.club_id,
    parent_id: rowData.parent_id,
    team_id: rowData.team_id,
    addShowFlag: true,
    addShow: false,
    addVal: '',
    children: []
  }
  if (rowData.children.length > 0) {
    rowData.children.forEach(e => {
      newArr.children.push({
        club_id: e.club_id,
        count: e.nodes.length,
        children: e.nodes,
        team_id: e.team_id,
        parent_id: e.parent_id,
        delId: rowData.parent_id,
        team_name: e.team_name,
        oldName: e.team_name,
        editShowFlag: true,
        editShow: false,
        editState: 0
      })
    })
  }
  deptData.value[k + 1] = newArr
  if (k == 1 && deptData.value[3]) {
    deptData.value[3] = {
      petd_id: null,
      addShowFlag: false,
      children: []
    }
    deptData.value[3].children = []
  }
}
</script>

<template>
  <div class="max-w-1200px w-full p-20px box-border">
    <div class="flex dept-warp">
      <div class="dept-box">
        <div class="dept-box-title">LEVEL - 1</div>
        <div class="dept-box-min">
          <template v-if="deptData[0] && deptData[0].children.length > 0">
            <div
              class="dept-box-item h-32px lh-32px"
              v-for="(deptItem, index) in deptData[0].children"
              :key="index"
              :class="!deptItem.selectFlag ? 'dept-box-item-select' : ''"
            >
              <div class="dept-box-item-l">
                <div
                  class="dept-box-item-name"
                  @click="deptGetChildren(deptItem)"
                  @mouseenter="itemMouseenter(deptItem)"
                  @mouseleave="itemMouseleave(deptItem)"
                  v-show="!deptItem.editState"
                >
                  <i class="dept-box-item-ico"></i>
                  {{ deptItem.team_name }}
                </div>
                <a-input
                  v-if="deptItem.editShowFlag && deptItem.editState === 1"
                  :default-value="deptItem.team_name"
                />
              </div>
              <div class="dept-box-item-r" v-if="deptItem.count">
                <span>{{ deptItem.count || '' }}</span>
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
            :disabled="!deptData[0].clubId"
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
              class="dept-box-item h-32px lh-32px"
              v-for="(deptItem, index) in deptData[1].children"
              :key="index"
              :class="!deptItem.selectFlag ? 'dept-box-item-select' : ''"
              @mouseenter="itemMouseenter(deptItem)"
              @mouseleave="itemMouseleave(deptItem)"
            >
              <div class="dept-box-item-l">
                <div
                  v-show="!deptItem.editState"
                  class="dept-box-item-name"
                  @click="openChildren(1, deptItem)"
                >
                  <i class="dept-box-item-ico"></i>
                  {{ deptItem.team_name }}
                </div>
                <a-input
                  v-if="deptItem.editShowFlag && deptItem.editState"
                  v-model="deptItem.team_name"
                  :default-value="deptItem.team_name"
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
                      @click="deptDel(deptData[1].children, deptItem, index, 1)"
                    />
                  </div>
                </template>
              </div>
            </div>
          </template>
          <template v-if="deptData[1] && deptData[1].children.length === 0">
            <div>No department yet</div>
          </template>
        </div>
        <div class="p-20px" v-if="deptData[1] && deptData[1].addShowFlag">
          <a-button
            type="outline"
            long
            v-if="!deptData[1].addShow"
            :disabled="!deptData[1].club_id"
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
              class="dept-box-item h-32px lh-32px"
              v-for="(deptItem, index) in deptData[2].children"
              :key="index"
              :class="!deptItem.selectFlag ? 'dept-box-item-select' : ''"
              @mouseenter="itemMouseenter(deptItem)"
              @mouseleave="itemMouseleave(deptItem)"
            >
              <div class="dept-box-item-l">
                <div
                  v-show="!deptItem.editState"
                  class="dept-box-item-name"
                  @click="openChildren(2, deptItem)"
                >
                  <i class="dept-box-item-ico"></i>
                  {{ deptItem.team_name }}
                </div>
                <a-input
                  v-if="deptItem.editShowFlag && deptItem.editState"
                  v-model="deptItem.team_name"
                  :default-value="deptItem.team_name"
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
                      @click="deptNameCheck(deptItem, 2, index)"
                    />
                    <icon-ri:delete-bin-6-line
                      class="text-20px"
                      @click="deptDel(deptData[2].children, deptItem, index, 2)"
                    />
                  </div>
                </template>
              </div>
            </div>
          </template>
          <template v-if="deptData[2] && deptData[2].children.length === 0">
            <div>No department yet</div>
          </template>
        </div>
        <div class="p-20px" v-if="deptData[2] && deptData[2].addShowFlag">
          <a-button
            type="outline"
            long
            v-if="!deptData[2].addShow"
            :disabled="!deptData[2].team_id"
            @click="deptOpenAdd(deptData[2], true)"
            >+ New Dept.</a-button
          >
          <div class="flex justify-center items-center" v-else>
            <a-input v-model="deptData[2].addVal" />
            <icon-material-symbols:check-circle-outline-rounded
              class="text-20px pl-10px"
              @click="deptAdd(deptData[2], false)"
            />
          </div>
        </div>
      </div>
      <div class="dept-box">
        <div class="dept-box-title">LEVEL - 4</div>
        <div class="dept-box-min">
          <template v-if="deptData[3] && deptData[3].children.length > 0">
            <div
              class="dept-box-item h-32px lh-32px"
              v-for="(deptItem, index) in deptData[3].children"
              :key="index"
              :class="!deptItem.selectFlag ? 'dept-box-item-select' : ''"
              @mouseenter="itemMouseenter(deptItem)"
              @mouseleave="itemMouseleave(deptItem)"
            >
              <div class="dept-box-item-l">
                <div v-show="!deptItem.editState" class="dept-box-item-name">
                  <i class="dept-box-item-ico"></i>
                  {{ deptItem.team_name }}
                </div>
                <a-input
                  v-if="deptItem.editShowFlag && deptItem.editState"
                  v-model="deptItem.team_name"
                  :default-value="deptItem.team_name"
                />
              </div>
              <div class="dept-box-item-r">
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
                      @click="deptNameCheck(deptItem, 3, index)"
                    />
                    <icon-ri:delete-bin-6-line
                      class="text-20px"
                      @click="deptDel(deptData[3].children, deptItem, index, 3)"
                    />
                  </div>
                </template>
              </div>
            </div>
          </template>
          <template v-if="deptData[3] && deptData[3].children.length === 0">
            <div>No department yet</div>
          </template>
        </div>
        <div class="p-20px" v-if="deptData[3] && deptData[3].addShowFlag">
          <a-button
            type="outline"
            long
            v-if="!deptData[3].addShow"
            :disabled="!deptData[3].parent_id"
            @click="deptOpenAdd(deptData[3], true)"
            >+ New Dept.</a-button
          >
          <div class="flex justify-center items-center" v-else>
            <a-input v-model="deptData[3].addVal" />
            <icon-material-symbols:check-circle-outline-rounded
              class="text-20px pl-10px"
              @click="deptAdd(deptData[3], false)"
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
  box-sizing: border-box;
  height: calc(100vh - 138px);
  box-shadow: 0 0 10px #0000001a;
}

.dept-box {
  display: flex;
  flex-direction: column;
  flex: 1;
  border-right: 1px solid rgba(233, 233, 231);
}
.dept-box:last-child {
  border-right: 0;
}

.dept-box-title {
  border-bottom: 1px solid rgba(233, 233, 231);
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dept-box-item-ico {
  float: left;
  width: 5px;
  height: 5px;
  border: 1px solid rgb(var(--arcoblue-6));
  /* border: 1px solid rgba(110, 101, 235); */
  border-radius: 50%;
  margin: 11px 10px 0 0;
}
.dept-box-item-r {
  flex: 0 0 50px;
  margin-left: 10px;
  text-align: right;
}
.dept-box-btn {
  color: rgb(var(--arcoblue-6));
}
</style>
