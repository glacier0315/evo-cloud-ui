const Mock = require('mockjs')
const { asyncRoutes } = require('../data/route')

const Random = Mock.Random
const routes = asyncRoutes

const roles = [
  {
    key: 'admin',
    name: 'admin',
    description: 'Super Administrator. Have access to view all pages.',
    routes: routes
  },
  {
    key: 'editor',
    name: 'editor',
    description: 'Normal Editor. Can see all pages except permission page',
    routes: routes.filter(i => i.path !== '/permission')// just a mock
  },
  {
    key: 'visitor',
    name: 'visitor',
    description: 'Just a visitor. Can only see the home page and the document page',
    routes: [{
      path: '',
      redirect: 'dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          meta: { title: 'dashboard', icon: 'dashboard' }
        }
      ]
    }]
  }
]

module.exports = [
  // mock get all routes form server
  {
    url: '/vue-element-admin/routes',
    type: 'get',
    response: _ => {
      return {
        code: '20000',
        data: routes
      }
    }
  },

  // mock get all roles form server
  {
    url: '/vue-element-admin/roles',
    type: 'get',
    response: _ => {
      return {
        code: '20000',
        data: roles
      }
    }
  },

  // add role
  {
    url: '/vue-element-admin/role',
    type: 'post',
    response: config => {
      const role = config.body
      role.key = Random.id()
      roles.push(role)
      return {
        code: '20000',
        data: 'success'
      }
    }
  },

  // update role
  {
    url: '/vue-element-admin/role',
    type: 'put',
    response: config => {
      const role = config.body
      console.log('role1', role)
      roles.forEach((item, index) => {
        if (role && role.key && item.key === role.key) {
          roles.splice(index, 1, role)
        }
      })
      return {
        code: '20000',
        data: 'success'
      }
    }
  },

  // delete role
  {
    url: '/vue-element-admin/role',
    type: 'delete',
    response: config => {
      const key = config.query.key
      roles.forEach((item, index) => {
        if (key && item.key === key) {
          roles.splice(index, 1)
        }
      })
      return {
        code: '20000',
        data: 'success'
      }
    }
  }
]
