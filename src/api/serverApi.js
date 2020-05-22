import http from './base'

// 查询所有菜单(首页展示用)
export const menu_list = () => {
  return http.requestQuickGet('/menu/getAllMenu')
}

// 查询所有菜单(菜单管理界面用)
export const getMenuList = () => {
  return http.requestQuickGet('/menu/getMenuList')
}

