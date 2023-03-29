<!--
 * @Author       : linxiao
 * @Date         : 2023-03-24 16:18:46
 * @LastEditors  : linxiao
 * @LastEditTime : 2023-03-29 15:57:01
 * @FilePath     : /src/views/Dept/index.vue
 * @Description  : Dept
 * Copyright 2023 OBKoro1, All Rights Reserved. 
 * 2023-03-24 16:18:46
-->
<script setup>
import {
  getManagingClubs,
  getClubAllDeptTree,
  postDeptCreate,
  postDeptDelete,
  postDeptUpdate
} from '@/api/dept'
const deptData = ref([])
const stateData = ref({
  olevel: -1,
  okey: 0,
  oval: 0,
  deptDataEnd: false,
  loadingTwo: false,
  del: {}
})
const visibleShow = ref(false)
const delVisibleShow = ref(false)
const deptLoading = ref(false)
onMounted(async () => {
  // 获取部门一级列表
  let { clubs } = await getManagingClubs({
    user_id: '1c38e7c3-1af7-4fe5-a878-a57fddf141d6',
    request_id: ''
  })
  if (!clubs) return
  let newArr = {
    level: 1,
    petd_id: null,
    children: []
  }
  clubs.forEach(e => {
    if (e.id === 21) {
      newArr.children.push({
        id: e.id,
        selectFlag: false,
        team_name: e.name,
        rightShow: false
      })
    }
    return
  })
  deptData.value[0] = newArr
  deptGetChildren({
    editShow: false,
    id: 21,
    num: 9,
    rightShow: false,
    selectFlag: true,
    team_name: '無効グループ'
  })
})

// 新增-状态切换
const deptOpenAdd = (row, t) => {
  row.addShow = t
}
// 新增当前列部门 - API loading
const deptAdd = row => {
  console.log('add =>', row)
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
  deptLoading.value = true
  postDeptCreate(ajaxData).then(res => {
    if (res && res.data) {
      updateDeptDataV2(res.data, row)
      row.addShow = false
      row.addVal = null
      deptLoading.value = false
    }
  })
}
// new-创建更新数组
const updateDeptDataV2 = (row, f) => {
  // 存值、count、选中状态?
  const newData = {
    club_id: row.club_id,
    team_id: row.id,
    count: 0,
    children: [],
    nodes: [],
    team_name: row.name,
    oldName: row.name,
    editShowFlag: true,
    editShow: false,
    editState: 0
  }
  if (row.parent_id) {
    // log
    newData.parent_id = row.parent_id
    if (!row.parent.parent) {
      deptData.value[2].children.push(newData)
      deptData.value[1].children.forEach(e => {
        if (e.team_id === row.parent_id) {
          e.count++
          e.children.push(newData)
        }
      })
      openChildren(2, newData)
    } else {
      deptData.value[3].children.push(newData)
      deptData.value[1].children.forEach(e => {
        if (e.team_id === f.parent_id) {
          e.children.forEach(n => {
            if (n.team_id === row.parent_id) {
              n.count++
              n.children.push(newData)
            }
          })
        }
      })
      openChildren(3, newData)
    }
  } else {
    deptData.value[1].children.push(newData)
    openChildren(1, newData)
  }
  console.log('row', deptData)
}
// 按钮显示 隐藏
const itemMouseenter = row => {
  row.editShow = true
  return
}
const itemMouseleave = row => {
  row.editShow = false
  return
}
// 编辑模式切换
const deptNameTab = (row, level, key, id) => {
  const state = stateData.value
  if (state.olevel === -1) {
    row.editState = 1
    state.olevel = level
    state.okey = key
    state.oval = id
  } else {
    if (state.val === id) {
      row.editState = 1
      state.olevel = level
      state.okey = key
      state.oval = id
      return
    }
    const data = toRaw(deptData.value[state.olevel].children[state.okey])
    if (data.team_name !== data.oldName) {
      visibleShow.value = true
    } else {
      deptData.value[state.olevel].children[state.okey].editState = 0
      deptData.value[level].children[key].editState = 0
      row.editState = 1
      state.olevel = level
      state.okey = key
      state.oval = id
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
const updateDeptDataDel = (level, k, aId, bId, cId) => {
  console.log('updateDeptDataDel', level, k, aId, bId, cId)
  if (!bId) {
    console.log('del-lvel-1 star', deptData)
    deptData.value[2] = null
    deptData.value[3] = null
    // deptData.value[1].children.splice(1, 1)
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
        console.log('del-1')
        a.children.splice(k, 1)
      } else {
        console.log('del-2')
        a.children.splice(k, 1)
      }
    }
  })
  if (level === 2) {
    deptData.value[3] = null
  }
}
const delVisibleOk = () => {
  console.log('delVisibleOk=> ')
  const { row, data, k, level } = toRaw(stateData.value.del)
  console.log('row, data, k, level', row, data, k, level)
  console.log('ajax', {
    request_id: '',
    operator_id: '1c38e7c3-1af7-4fe5-a878-a57fddf141d6',
    club_id: data.club_id,
    dept_id: data.team_id
  })
  postDeptDelete({
    request_id: '',
    operator_id: '1c38e7c3-1af7-4fe5-a878-a57fddf141d6',
    club_id: data.club_id,
    dept_id: data.team_id
  }).then(res => {
    if (res.club_id) {
      row.splice(k, 1)
      if (level === 1) {
        console.log('init deptData=>', toRaw(deptData))
        updateDeptDataDel(1, k, data.team_id)
      }
      if (level === 2) {
        updateDeptDataDel(2, k, data.parent_id, data.team_id)
      }
      if (level === 3) {
        updateDeptDataDel(3, k, data.delId, data.parent_id, data.team_id)
      }
      deptData.value[level - 1].children.forEach(e => {
        if (e.team_id === data.parent_id) {
          e.count--
        }
      })
      AMessage.success('This is a success message!')
    } else {
      AMessage.error('This is a normal message!')
    }
  })
}
// 取消删除
const delVisibleCancel = () => {
  delVisibleShow.value = false
}
// 删除单个部门 - 弹窗
const deptDel = (row, data, k, level) => {
  delVisibleShow.value = true
  stateData.value.del = {
    row,
    data,
    k,
    level
  }
}
// // 获取下级部门 - API
const deptGetChildren = row => {
  console.log('row', row)
  deptLoading.value = true
  // 更新第三、四列
  deptData.value[2] = null
  deptData.value[3] = null
  getClubAllDeptTree({
    club_id: row.id,
    request_id: ''
  }).then(res => {
    console.log('allDeptTree', res)
    const { club, nodes } = res
    if (club && nodes.nodes) {
      const children = nodes.nodes
      const clubData = club
      let newArr = {
        level: 2,
        club_id: clubData.id,
        // petd_id: row.id,
        addShowFlag: true,
        addShow: false,
        addVal: null,
        children: []
      }
      // 更新第一列
      deptData.value[0].children.forEach(e => {
        e.selectFlag = false
        if (e.id === row.id) {
          row.num = children.length
          e.selectFlag = true
        }
      })
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
    deptLoading.value = false
  })
}
// 获取部门列
const openChildren = (k, row) => {
  const { club_id, parent_id, team_id, children } = toRaw(row)
  const newChildren = children.map(child => ({
    club_id: child.club_id,
    count: child.nodes.length,
    children: child.nodes,
    team_id: child.team_id,
    parent_id: child.parent_id,
    delId: parent_id,
    team_name: child.team_name,
    oldName: child.team_name,
    editShowFlag: true,
    editShow: false,
    editState: 0
  }))
  deptData.value[k + 1] = {
    level: k + 1,
    club_id,
    parent_id,
    team_id,
    addShowFlag: true,
    addShow: false,
    addVal: null,
    children: newChildren
  }
  deptData.value[k].children.forEach(e => {
    e.selectFlag = e.team_id === team_id
  })
  if (k === 1 && deptData.value[3]) {
    deptData.value[3] = null
  }
  stateData.value.deptDataEnd = true
}

const outSideClick = (ev, k) => {
  if (!ev.target.closest('.dept-box-item')) {
    deptData.value[k] = null
    if (k === 2) {
      deptData.value[1].children.forEach(e => (e.selectFlag = false))
    } else if (k === 3) {
      deptData.value[2].children.forEach(e => (e.selectFlag = false))
    }
  }
}
</script>

<template>
  <div class="w-full box-border">
    <div class="header-txt mb-20px">
      <h3>Department Hierarchy</h3>
      <p>
        Departments are units for team division in team competitions. They are
        usually created according to the organization of the company or group.
        For example, if there are 10 subsidiaries and 10 departments in each
        subsidiary, create 10 subsidiaries on level-1, and then click on each
        subsidiary to create the departments below it.
      </p>
      <ul>
        <li>
          Departments can be created freely as units such as region/activity
          level/close friends.
        </li>
        <li>
          You can also create/edit them in WeRUN app. There are no restrictions
          on the number of departments or levels to be created.
        </li>
      </ul>
    </div>
    <a-spin :loading="deptLoading" dot class="w-100%">
      <div class="flex dept-warp">
        <div class="dept-box" v-if="false">
          <div class="dept-box-title">LEVEL - 1</div>
          <div class="dept-box-min">
            <a-skeleton class="p-20px" animation v-if="deptData.length === 0">
              <a-space
                direction="vertical"
                :style="{ width: '100%' }"
                size="large"
              >
                <a-skeleton-line :rows="5" />
              </a-space>
            </a-skeleton>
            <template
              v-else-if="deptData[0] && deptData[0].children.length > 0"
            >
              <div
                class="dept-box-item h-36px lh-36px"
                v-for="(deptItem, index) in deptData[0].children"
                :key="index"
                :class="deptItem.selectFlag ? 'dept-box-item-select' : ''"
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
          <!-- <div
          class="p-20px"
          v-if="deptData.length > 0 && deptData[0].addShowFlag"
        >
          <a-button
            type="outline"
            long
            v-if="deptData[0].addShow"
            :disabled="!deptData[0].clubId"
            @click="deptOpenAdd(deptData[0], true)"
            >+ New Dept.</a-button
          >
          <div class="flex justify-center items-center" v-else>
            <a-input v-model="deptData[0].addVal" default-value="New dept" />
            <icon-material-symbols:check-circle-outline-rounded
              class="text-20px pl-10px"
              @click="deptAdd(deptData[0], false)"
            />
          </div>
        </div> -->
        </div>
        <!-- <a-skeleton
          class="p-20px"
          animation
          v-if="deptData.length === 0 || stateData.loadingTwo"
        >
          <a-space
            direction="vertical"
            :style="{ width: '100%' }"
            size="large"
          >
            <a-skeleton-line :rows="5" />
          </a-space>
        </a-skeleton> -->
        <div
          class="dept-box"
          v-if="deptData[1] && deptData[1].children.length > 0"
        >
          <div class="dept-box-title">LEVEL - 1</div>
          <div class="dept-box-min" @click.capture="outSideClick($event, 2)">
            <div
              class="dept-box-item h-36px lh-36px"
              v-for="(deptItem, index) in deptData[1].children"
              :key="index"
              :class="deptItem.selectFlag ? 'dept-box-item-select' : ''"
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
                  @press-enter="deptNameCheck(deptItem)"
                />
              </div>
              <div class="dept-box-item-r flex justify-center items-center">
                <span v-show="!deptItem.editShow && !deptItem.editState">{{
                  deptItem.count || ''
                }}</span>
                <template
                  v-if="
                    deptItem.editShowFlag &&
                    (deptItem.editShow || deptItem.editState)
                  "
                >
                  <icon-ri:edit-box-line
                    class="text-20px color-#746CE8"
                    v-if="deptItem.editState === 0"
                    @click="deptNameTab(deptItem, 1, index, deptItem.team_id)"
                  />
                  <!-- <icon-material-symbols:check-circle-outline-rounded
                    v-if="deptItem.editState === 1"
                    class="text-20px color-#746CE8"
                    @click="deptNameCheck(deptItem)"
                  /> -->
                  <icon-ri:delete-bin-6-line
                    class="text-20px color-#746CE8"
                    @click="deptDel(deptData[1].children, deptItem, index, 1)"
                  />
                </template>
              </div>
            </div>
            <template v-if="deptData[1] && deptData[1].children.length === 0">
              <div class="p-20px">No department yet</div>
            </template>
          </div>
          <div
            class="p-20px"
            v-if="deptData.length > 0 && deptData[1] && deptData[1].addShowFlag"
          >
            <a-button
              type="outline"
              long
              v-if="!deptData[1].addShow"
              :disabled="!deptData[1].club_id"
              @click="deptOpenAdd(deptData[1], true)"
              >+ New Dept.</a-button
            >
            <div class="flex justify-center items-center" v-else>
              <a-input
                default-value="New dept"
                v-model="deptData[1].addVal"
                @press-enter="deptAdd(deptData[1], false)"
              />
              <!-- <icon-material-symbols:check-circle-outline-rounded
                class="text-20px pl-10px color-#746CE8"
                @click="deptAdd(deptData[1], false)"
              /> -->
            </div>
          </div>
        </div>
        <div class="dept-box" v-if="deptData[2]">
          <div class="dept-box-title">LEVEL - 2</div>
          <div class="dept-box-min" @click.capture="outSideClick($event, 3)">
            <div
              class="dept-box-item h-36px lh-36px"
              v-for="(deptItem, index) in deptData[2].children"
              :key="index"
              :class="deptItem.selectFlag ? 'dept-box-item-select' : ''"
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
              <div class="dept-box-item-r flex justify-center items-center">
                <span v-show="!deptItem.editShow && !deptItem.editState">{{
                  deptItem.count || ''
                }}</span>

                <template
                  v-if="
                    deptItem.editShowFlag &&
                    (deptItem.editShow || deptItem.editState)
                  "
                >
                  <icon-ri:edit-box-line
                    class="text-20px color-#746CE8"
                    v-if="deptItem.editState === 0"
                    @click="deptNameTab(deptItem, 2, index, deptItem.team_id)"
                  />
                  <icon-material-symbols:check-circle-outline-rounded
                    v-if="deptItem.editState === 1"
                    class="text-20px color-#746CE8"
                    @click="deptNameCheck(deptItem, 2, index)"
                  />
                  <icon-ri:delete-bin-6-line
                    class="text-20px color-#746CE8"
                    @click="deptDel(deptData[2].children, deptItem, index, 2)"
                  />
                </template>
              </div>
            </div>
            <template v-if="deptData[2] && deptData[2].children.length === 0">
              <div class="p-20px">No department yet</div>
            </template>
          </div>
          <div
            class="p-20px"
            v-if="deptData && deptData[2] && deptData[2].addShowFlag"
          >
            <a-button
              type="outline"
              long
              v-if="!deptData[2].addShow"
              :disabled="!deptData[2].team_id"
              @click="deptOpenAdd(deptData[2], true)"
              >+ New Dept.</a-button
            >
            <div class="flex justify-center items-center" v-else>
              <a-input v-model="deptData[2].addVal" default-value="New dept" />
              <icon-material-symbols:check-circle-outline-rounded
                class="text-20px pl-10px color-#746CE8"
                @click="deptAdd(deptData[2], false)"
              />
            </div>
          </div>
        </div>
        <div class="dept-box" v-if="deptData[3]">
          <div class="dept-box-title">LEVEL - 3</div>
          <div class="dept-box-min">
            <div
              v-for="(deptItem, index) in deptData[3].children || []"
              :key="index"
            >
              <div
                class="dept-box-item h-36px lh-36px"
                :class="deptItem.selectFlag ? 'dept-box-item-select' : ''"
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
                <div class="dept-box-item-r flex justify-center items-center">
                  <template
                    v-if="
                      deptItem.editShowFlag &&
                      (deptItem.editShow || deptItem.editState)
                    "
                  >
                    <icon-ri:edit-box-line
                      class="text-20px color-#746CE8"
                      v-if="deptItem.editState === 0"
                      @click="deptNameTab(deptItem, 3, index, deptItem.team_id)"
                    />
                    <icon-material-symbols:check-circle-outline-rounded
                      v-if="deptItem.editState === 1"
                      class="text-20px color-#746CE8"
                      @click="deptNameCheck(deptItem, 3, index)"
                    />
                    <icon-ri:delete-bin-6-line
                      class="text-20px color-#746CE8"
                      @click="deptDel(deptData[3].children, deptItem, index, 3)"
                    />
                  </template>
                </div>
              </div>
            </div>
            <template
              v-if="
                deptData[3] &&
                stateData.deptDataEnd &&
                deptData[3].children.length === 0
              "
            >
              <div class="p-20px">No department yet</div>
            </template>
          </div>
          <div
            class="p-20px"
            v-if="deptData && deptData[3] && deptData[3].addShowFlag"
          >
            <a-button
              type="outline"
              long
              v-if="!deptData[3].addShow"
              :disabled="!deptData[3].parent_id"
              @click="deptOpenAdd(deptData[3], true)"
              >+ New Dept.</a-button
            >
            <div class="flex justify-center items-center" v-else>
              <a-input v-model="deptData[3].addVal" default-value="New dept" />
              <icon-material-symbols:check-circle-outline-rounded
                class="text-20px pl-10px color-#746CE8"
                @click="deptAdd(deptData[3], false)"
              />
            </div>
          </div>
        </div>
      </div>
    </a-spin>
    <a-modal
      v-model:visible="visibleShow"
      @ok="visibleOk"
      @cancel="visibleCancel(1)"
    >
      <template #title> {{ $t('win.title_1') }} </template>
      <div>{{ $t('win.text_1') }}</div>
    </a-modal>
    <a-modal
      v-model:visible="delVisibleShow"
      @ok="delVisibleOk"
      @cancel="delVisibleCancel(1)"
    >
      <template #title> {{ $t('win.title_1') }} </template>
      <div>{{ $t('win.text_2') }}</div>
    </a-modal>
  </div>
</template>

<style>
.header-txt {
  color: #4b465c;
}
.header-txt h3 {
  font-size: 18px;
}
.header-txt ul {
  padding-left: 30px;
}
.header-txt ul li::marker {
  font-size: 12px;
}
.arco-spin {
  @apply bg-[var(--color-bg-1)] relative;
  border-radius: 6px;
}
.dept-warp {
  box-sizing: border-box;
  height: calc(100vh - 333px);
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.08);
  border-radius: 6px;
}

.dept-box {
  max-width: 260px;
  display: flex;
  flex-direction: column;
  flex: 1;
  border-right: 1px solid #d7d8de;
}
/* .dept-box:last-child {
  border-right: 0;
} */

.dept-box-title {
  font-size: 15px;
  border-bottom: 1px solid #d7d8de;
  padding: 20px;
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
.dept-box-btn {
  color: #746ce8;
}
</style>
