const Mock = require('mockjs')
const { menus } = require('./data/menu')
const { asyncRoutes } = require('../data/route')

const Random = Mock.Random

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
  },
  {
    url: '/sys/menu/list',
    type: 'get',
    response: config => {
      return {
        code: '20000',
        data: menus
      }
    }
  },

  {
    url: '/sys/menu/add',
    type: 'post',
    response: config => {
      const menu = config.body
      menu.id = Random.id()
      menus.push(menu)
      return {
        code: '20000',
        data: 'success'
      }
    }
  },

  {
    url: '/sys/menu/update',
    type: 'put',
    response: config => {
      const menu = config.body
      menus.forEach((item, index) => {
        if (menu && menu.id && item.id === menu.id) {
          menus.splice(index, 1, menu)
        }
      })
      return {
        code: '20000',
        data: 'success'
      }
    }
  },

  {
    url: '/sys/menu/delete',
    type: 'delete',
    response: config => {
      const id = config.query.id
      menus.forEach((item, index) => {
        if (id && item.id === id) {
          menus.splice(index, 1)
        }
      })
      return {
        code: '20000',
        data: 'success'
      }
    }
  }
]
