const { deepClone } = require('../utils')
const { asyncRoutes, constantRoutes } = require('./route')

const routes = deepClone([...constantRoutes, ...asyncRoutes])

module.exports = [
  // mock get all routes form server
  {
    url: '/sys/menu/getRouters',
    type: 'get',
    response: _ => {
      return {
        code: '20000',
        data: routes
      }
    }
  },
  // mock get all permissions form server
  {
    url: '/sys/menu/getPermissions',
    type: 'get',
    response: _ => {
      return {
        code: '20000',
        data: []
      }
    }
  }
]
