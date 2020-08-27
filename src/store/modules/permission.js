import { constantRoutes } from '@/router'
import { getPermissions, getRouters } from '@/api/sys/menu'
import Layout from '@/layout/index'

const state = {
  routes: [],
  addRoutes: [],
  permissions: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      // 向后端请求路由数据
      getRouters().then(res => {
        const accessedRoutes = filterAsyncRouter(res.data)

        console.log('accessedRoutes, ', accessedRoutes)
        // 404 必须放最后
        accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    })
  },
  generatePermissions({ commit }, roles) {
    return new Promise(resolve => {
      // 向后端请求路由数据
      getPermissions().then(res => {
        const permissions = res.data
        console.log('permissions, ', permissions)
        if (permissions && permissions instanceof Array && permissions.length > 0) {
          commit('SET_PERMISSIONS', permissions)
        }
        resolve(permissions)
      })
    })
  }
}

/**
 * 遍历后台传来的路由数组，转换为组件对象
 * @param {*} asyncRouterArray 路由数组
 */
function filterAsyncRouter(asyncRouterArray) {
  // 路由数组存在时
  if (asyncRouterArray && asyncRouterArray instanceof Array) {
    return asyncRouterArray.filter(route => {
      if (route.component) {
        // Layout组件特殊处理
        if (route.component === 'Layout') {
          route.component = Layout
        } else {
          route.component = loadView(route.component)
        }
      }
      if (route.children && route.children instanceof Array && route.children.length > 0) {
        route.children = filterAsyncRouter(route.children)
      }
      return true
    })
  }
  return []
}

/**
 * 路由懒加载
 * @param {*} view 视图组件
 */
export const loadView = (view) => {
  // 路由懒加载
  return (resolve) => require([`@/views/${view}`], resolve)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
