import http from './base'

const baseUrl = '/role/'

// 查询所有角色
export const pageQuery = (currentPage, pageSize, role) => {
  return http.requestQuickGet(baseUrl + 'pageQuery?currentPage=' + currentPage + '&pageSize=' + pageSize + '&role=' + role)
}

// 删除
export const deleteRoleById = (id) => {
  return http.requestDelete(baseUrl + 'deleteById/' + id)
}

// 新增
export const add = (role) => {
  return http.requestPost(baseUrl + 'insert', role)
}

// 修改
export const update = (role) => {
  return http.requestPut(baseUrl + 'update', role)
}
