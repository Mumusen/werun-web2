import request from '@/utils/http'

const Api = {
  Login: 'LoginByUsername',
  GetUser: 'Get',
  GetManagingClubs: 'GetManagingClubs',
  GetClubAllDeptTree: 'GetClubAllDeptTree',
  DeptCreate: 'DeptCreate',
  DeptDelete: 'DeptDelete',
  DeptUpdate: 'DeptUpdate'
}

/**
 * 登录
 * @param {*} dataObj
 * @returns
 */
export const loginApi = function (dataObj) {
  return request({
    method: 'post',
    data: dataObj,
    headers: {
      'X-RPCX-ServiceMethod': Api.Login,
      'X-RPCX-ServicePath': 'auth'
    }
  })
}

/**
 * 获取用户信息
 * @param {*} dataObj
 * @returns
 */
export const getUserData = function (dataObj) {
  return request({
    method: 'post',
    data: dataObj,
    headers: {
      'X-RPCX-ServiceMethod': Api.Login,
      'X-RPCX-ServicePath': 'user'
    }
  })
}

/**
 * 获取部门树
 * @param {*} dataObj
 * @returns
 */
export const getClubAllDeptTree = function (dataObj) {
  return request({
    method: 'post',
    data: dataObj,
    headers: {
      'X-RPCX-ServiceMethod': Api.GetClubAllDeptTree,
      'X-RPCX-ServicePath': 'club-dept'
    }
  })
}

/**
 * 创建部门
 * @param {*} dataObj
 * @returns
 */
export const postDeptCreate = function (dataObj) {
  return request({
    method: 'post',
    data: dataObj,
    headers: {
      'X-RPCX-ServiceMethod': Api.DeptCreate,
      'X-RPCX-ServicePath': 'club-dept'
    }
  })
}

/**
 * 删除部门
 * @param {*} dataObj
 * @returns
 */
export const postDeptDelete = function (dataObj) {
  return request({
    method: 'post',
    data: dataObj,
    headers: {
      'X-RPCX-ServiceMethod': Api.DeptDelete,
      'X-RPCX-ServicePath': 'club-dept'
    }
  })
}
/**
 * 更新部门
 * @param {*} dataObj
 * @returns
 */
export const postDeptUpdate = function (dataObj) {
  return request({
    method: 'post',
    data: dataObj,
    headers: {
      'X-RPCX-ServiceMethod': Api.DeptUpdate,
      'X-RPCX-ServicePath': 'club-dept'
    }
  })
}
