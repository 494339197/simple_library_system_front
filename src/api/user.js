import request from '@/utils/request'

/**
 * 用户登录
 * @param {Object} data - 登录信息
 * @param {string} data.username - 用户名
 * @param {string} data.userpassword - 密码
 * @param {number} data.isadmin - 角色标识（0-读者，1-管理员）
 */
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

/**
 * 获取用户信息
 * @param {string} token - 登录令牌
 */
export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

/**
 * 用户登出
 * @param {string} token - 登录令牌
 */
export function logout(token) {
  return request({
    url: '/user/logout',
    method: 'get',
    params: { token }
  })
}

/**
 * 用户注册
 * @param {Object} data - 注册信息
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 */
export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

/**
 * 修改密码
 * @param {Object} data - 修改参数
 */
export function alterPassword(data) {
  return request({
    url: '/user/alterPassword',
    method: 'post',
    data
  })
}

/**
 * 读者修改密码
 * @param {Object} data - 修改参数
 */
export function readerAlterPassword(data) {
  return request({
    url: '/user/reader/alterPassword',
    method: 'post',
    data
  })
}

/**
 * 获取用户总数（管理员）
 */
export function getUserCount() {
  return request({
    url: '/user/getCount',
    method: 'get'
  })
}

/**
 * 分页查询用户（管理员）
 * @param {Object} params - 查询参数
 */
export function queryUsersByPage(params) {
  return request({
    url: '/user/queryUsersByPage',
    method: 'get',
    params
  })
}

/**
 * 添加用户（管理员）
 * @param {Object} data - 用户信息
 */
export function addUser(data) {
  return request({
    url: '/user/addUser',
    method: 'post',
    data
  })
}

/**
 * 删除用户（管理员）
 * @param {Object} data - 包含 userid
 */
export function deleteUser(data) {
  return request({
    url: '/user/deleteUser',
    method: 'delete',
    data
  })
}

/**
 * 批量删除用户（管理员）
 * @param {Array} data - 用户ID数组
 */
export function deleteUsers(data) {
  return request({
    url: '/user/deleteUsers',
    method: 'delete',
    data
  })
}

/**
 * 更新用户（管理员）
 * @param {Object} data - 用户信息
 */
export function updateUser(data) {
  return request({
    url: '/user/updateUser',
    method: 'put',
    data
  })
}
