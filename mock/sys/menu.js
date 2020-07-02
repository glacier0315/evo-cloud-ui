const Mock = require('mockjs')
const { asyncRoutes } = require('../route')

const Random = Mock.Random

const menus = []
for (let i = 0; i < 10; i++) {
  // 一级菜单
  const menu1 = Mock.mock({
    'id': Random.id(),
    'name': Random.ctitle(4),
    'path': Random.word(5) + '/' + Random.word(5),
    'component': 'Layout',
    'icon': 'list',
    'permission': Random.word(8),
    'parentId': '',
    'parentName': '',
    'type': 1,
    'visible': 1,
    'orderNum|+1': 1
  })
  menus.push(menu1)
  // 设置子类
  for (let i = 0; i < Random.natural(4, 7); i++) {
    // 二级菜单
    const menu2 = Mock.mock({
      'id': Random.id(),
      'name': Random.ctitle(4),
      'path': Random.word(5) + '/' + Random.word(5),
      'component': Random.word(5) + '/' + Random.word(5),
      'icon': 'list',
      'permission': Random.word(8),
      'parentId': menu1.id,
      'parentName': menu1.name,
      'type|1': [1, 2, 3],
      'visible|1': [1, 2],
      'isFrame|1': [1, 2],
      'orderNum|+1': 100
    })
    menus.push(menu2)
    if (menu2.type === 1) {
      for (let i = 0; i < Random.natural(4, 7); i++) {
        // 目录 添加三级菜单
        const menu3 = Mock.mock({
          'id': Random.id(),
          'name': Random.ctitle(4),
          'path': Random.word(5) + '/' + Random.word(5),
          'component': Random.word(5) + '/' + Random.word(5),
          'icon': 'list',
          'permission': Random.word(8),
          'parentId': menu2.id,
          'parentName': menu2.name,
          'type|1': [2, 3],
          'visible|1': [1, 2],
          'isFrame|1': [1, 2],
          'orderNum|+1': 200
        })
        menus.push(menu3)
      }
    }
  }
}

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
