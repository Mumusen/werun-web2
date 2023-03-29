<!--
 * @Author       : linxiao
 * @Date         : 2023-03-24 16:18:46
 * @LastEditors  : linxiao
 * @LastEditTime : 2023-03-29 18:42:50
 * @FilePath     : /src/views/Dept/index.vue
 * @Description  : Dept
 * Copyright 2023 OBKoro1, All Rights Reserved. 
 * 2023-03-24 16:18:46
-->
<script setup>
import deptJson from './dept.json'
onMounted(async () => {
  // 获取部门一级列表
  deptGetChildren({
    editShow: false,
    id: 21,
    num: 9,
    rightShow: false,
    selectFlag: true,
    team_name: '無効グループ'
  })
})

// const deptData = ref(null)
const deptDataInit = ref(null)

// // 获取下级部门 - API
const deptGetChildren = () => {
  const deptData = deptJson.data
  deptDataInit.value = toNewArr(deptData, 'nodes')
  console.log('to=>', deptDataInit)
  // const { club, nodes } = deptTree
  // deptData.value = club
  // deptDataItems.value = deptTree.nodes.nodes
  // deptDataItems.value = nodes.nodes.map(item => ({
  //   key: 1,
  //   club_id: item.club_id,
  //   parent_id: item.parent_id,
  //   team_id: item.team_id,
  //   nodes: item.nodes,
  //   team_name: item.team_name,
  //   oldName: item.team_name,
  //   editShowFlag: true,
  //   editShow: false,
  //   editState: 0
  // }))
  // console.log('deptDataItems =>', toRaw(deptDataItems.value))
}
// 递归循环
const toNewArr = arr => {
  arr.forEach((e, k) => {
    e.editShow = false
    e.editState = 0
    e.k = k
    if (e.nodes.length > 0) {
      toNewArr(e.nodes)
    }
  })
  return arr
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
    <div class="dept-box">
      <template v-if="deptDataInit">
        <dept-item :deptItem="deptDataInit" />
      </template>
    </div>
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
.dept-box {
  @apply bg-[var(--color-bg-1)] relative;
  border-radius: 6px;
  height: calc(100vh - 333px);
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
  overflow-y: scroll;
}
</style>
