const { asyncRoutes } = require('../route')

module.exports = [
  // mock get all routes form server
  {
    url: '/sys/menu/getRouters',
    type: 'get',
    response: _ => {
      return {
        code: '20000',
        data: asyncRoutes
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
