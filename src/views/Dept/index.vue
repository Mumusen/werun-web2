<!--
 * @Author       : linxiao
 * @Date         : 2023-03-24 16:18:46
 * @LastEditors  : linxiao
 * @LastEditTime : 2023-03-31 11:48:42
 * @FilePath     : /src/views/Dept/index.vue
 * @Description  : Dept
 * Copyright 2023 OBKoro1, All Rights Reserved. 
 * 2023-03-24 16:18:46
-->
<script setup>
import {
  // getManagingClubs,
  getClubAllDeptTree,
  postDeptCreate,
  postDeptDelete,
  postDeptUpdate
} from '@/api/dept'
// import deptJson from './dept.json'
const deptDataRender = ref([])
// const deptDataInit = ref(null)
const visibleNameShow = ref(false)
const stateObject = ref({})
const stateNum = ref(0)
const deptLoading = ref(false)
const delVisibleShow = ref(false)
const stateObjectDel = ref({})
onMounted(async () => {
  // 获取部门一级列表
  deptGetInit({
    club_id: 21,
    request_id: ''
  })
})
// // 获取下级部门 - API
const deptGetInit = row => {
  getClubAllDeptTree(row).then(res => {
    console.log('allDeptTree', res)
    const { nodes, club } = res
    console.log('club', club, nodes)
    // let newArr = [{}]
    // deptDataRender.value = newArr
    deptDataRender.value = [
      {
        club_id: club.id,
        team_name: club.name,
        oName: club.name,
        nodes: toNewArr(nodes.nodes)
      }
    ]
    console.log('deptDataRender', toRaw(deptDataRender.value))
  })
}
const openChildren = row => {
  // 接收 选中当前对象 含有nodes
  // 判断渲染数组是否含有对象，返回下坐标
  // 删除 Y or N：
  // Y: 下坐标 === 渲染数组长度通过下坐标进行渲染数组后面删除，再进行执行N
  // N: 直接加入对象，进行渲染
  const { data, key, nk } = row
  if (key === deptDataRender.value.length - 1) {
    deptDataRender.value.push(data)
  } else {
    deptDataRender.value.splice(key + 1, deptDataRender.value.length - 1)
    deptDataRender.value.push(data)
  }
  // 循环遍历选中样式
  arrTo(deptDataRender.value[key].nodes)
  console.log('deptDataRender.value', row, deptDataRender.value)
  deptDataRender.value[key].nodes[nk].selectFlag = true
}
const arrTo = arr => {
  arr.forEach(e => {
    e.selectFlag = false
    if (e.nodes.length > 0) arrTo(e.nodes)
  })
}
// 关闭子级
const showChildren = key => {
  console.log('key', key)
  console.log(toRaw(deptDataRender.value), toRaw(deptDataRender.value[key]))
  deptDataRender.value[key].nodes.forEach((e, k) => {
    e.selectFlag = false
    if (e.team_id && e.editShow) {
      if (e.team_name !== e.oName) {
        updateName({
          data: e,
          key: key,
          nk: k
        })
      } else {
        e.editShow = false
        e.editState = 0
      }
    }
  })
  deptDataRender.value.splice(key + 1, deptDataRender.value.length - 1)
}
// 递归循环-初始化
const toNewArr = arr => {
  arr.forEach(e => {
    e.editShow = false
    e.editState = 0
    e.editShowFlag = false
    e.selectFlag = false
    e.nId = `${e.club_id}:${e.parent_id}:${e.team_id}`
    e.oName = e.team_name
    if (e.nodes.length > 0) {
      toNewArr(e.nodes)
    }
  })
  return arr
}
// 修改名称
const updateName = row => {
  const { data, key, nk } = row
  if (!data.oName) {
    // Add AJAX
    const ajaxData = {
      request_id: '',
      operator_id: '1c38e7c3-1af7-4fe5-a878-a57fddf141d6',
      dept: {
        club_id: data.club_id,
        parent_id: data.parent_id,
        name: data.team_name,
        data_body: ''
      }
    }
    postDeptCreate(ajaxData).then(res => {
      if (res && res.data) {
        const { parent_id, id } = res.data
        deptLoading.value = true
        deptDataRender.value[key].nodes[nk].oName = data.team_name
        deptDataRender.value[key].nodes[nk].team_id = id
        deptDataRender.value[key].nodes[nk].parent_id = parent_id
        deptDataRender.value[key].nodes[nk].editState = 0
        stateNum.value++
        openChildren({
          data: deptDataRender.value[key].nodes[nk],
          key: key,
          nk
        })
      }
    })
  } else {
    console.log('update', toRaw(data.value))
    deptDataRender.value[key].nodes[nk].oName = data.team_name
    deptDataRender.value[key].nodes[nk].editState = 0
    stateNum.value++
    // openChildren({
    //   data: data,
    //   key: key,
    //   nk
    // })
    // Ajax
    postDeptUpdate({
      request_id: '',
      operator_id: '1c38e7c3-1af7-4fe5-a878-a57fddf141d6',
      club_id: data.club_id,
      dept_id: data.team_id,
      new_dept: {
        club_id: data.club_id,
        parent_id: data.parent_id,
        name: data.team_name,
        data_body: ''
      }
    }).then(res => {
      if (res.dept && res.dept.create_time) {
        deptDataRender.value[key].nodes[nk].oName = data.team_name
        deptDataRender.value[key].nodes[nk].editState = 0
        stateNum.value++
        AMessage.success('This is a success message!')
      } else {
        AMessage.error('This is a normal message!')
      }
    })
  }
}
// 弹窗-修改名称
const stateOverlapping = row => {
  const { data, nData, key, k, nk } = row
  visibleNameShow.value = true
  stateObject.value = {
    data,
    nData,
    k,
    key,
    nk
  }
}
const visibleNameOk = () => {
  const { data, key, k, nk } = toRaw(stateObject.value)
  updateName({
    data: data,
    key: key,
    nk: nk
  })
  deptDataRender.value[key].nodes[k].editState = 1
}
const visibleNameCancel = () => {
  const { data, key, k, nk } = toRaw(stateObject.value)
  deptDataRender.value[key].nodes[nk].team_name = data.oName
  deptDataRender.value[key].nodes[nk].editState = 0
  deptDataRender.value[key].nodes[nk].editShow = false
  deptDataRender.value[key].nodes[k].editState = 1
}
// 删除部门逻辑
const delTxt = ref(null)
const openDel = row => {
  const { data, key, nk } = row
  delVisibleShow.value = true
  delTxt.value = data.team_name
  stateObjectDel.value = {
    data,
    key,
    nk
  }
}
const delVisibleCancel = () => {
  delVisibleShow.value = false
  stateObjectDel.value = {}
}
const delVisibleOk = () => {
  console.log('stateObjectDel', toRaw(stateObjectDel.value))
  const { data, key, nk } = toRaw(stateObjectDel.value)
  // AJAX delete
  deptDataRender.value[key].nodes.splice(nk, 1)
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
      AMessage.success('This is a success message!')
    } else {
      AMessage.error('This is a normal message!')
    }
  })
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
    <div class="dept-box-warp">
      <div class="inline-flex h-100%">
        <dept-item
          v-for="(item, index) in deptDataRender"
          :key="index"
          :deptKey="index"
          :deptData="item"
          :stateNum="stateNum"
          @children="openChildren"
          @showChildren="showChildren"
          @updateName="updateName"
          @stateOverlapping="stateOverlapping"
          @openDel="openDel"
        />
      </div>
    </div>
    <a-modal
      v-model:visible="visibleNameShow"
      @ok="visibleNameOk"
      @cancel="visibleNameCancel"
    >
      <template #title> {{ $t('win.title_1') }} </template>
      <div>{{ $t('win.text_1') }}</div>
    </a-modal>
    <a-modal
      v-model:visible="delVisibleShow"
      @ok="delVisibleOk"
      @cancel="delVisibleCancel"
    >
      <template #title> {{ $t('win.title_1') }} </template>
      <div>{{ $t('win.text_2', { msg: delTxt }) }}</div>
    </a-modal>
  </div>
</template>

<style scoped>
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
.dept-box-warp {
  @apply bg-[var(--color-bg-1)] relative;
  border-radius: 6px;
  height: calc(100vh - 333px);
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
  overflow-x: auto;
}
</style>
