const Mock = require('mockjs')
const { asyncRoutes } = require('../route')

const Random = Mock.Random

const menus = []
for (let i = 0; i < 10; i++) {
  // 一级菜单
  const menu1 = Mock.mock({
    'id': Random.id(),
    'name': Random.word(6),
    'path': Random.word(5) + '/' + Random.word(5),
    'component': 'Layout',
    'title': Random.ctitle(4),
    'icon': 'list',
    'permission': Random.word(8),
    'parentId': '',
    'type': 1,
    'visible': 1,
    'isFrame': 2,
    'orderNum|+1': 1
  })
  menus.push(menu1)
  // 设置子类
  for (let i = 0; i < Random.natural(4, 7); i++) {
    // 二级菜单
    const menu2 = Mock.mock({
      'id': Random.id(),
      'name': Random.word(6),
      'path': Random.word(5) + '/' + Random.word(5),
      'component': 'Layout',
      'title': Random.ctitle(4),
      'icon': 'list',
      'permission': Random.word(8),
      'parentId': menu1.id,
      'type|1': [1, 2, 3],
      'visible|1': [1, 2],
      'isFrame|1': [1, 2],
      'orderNum|+1': 100
    })
    menus.push(menu2)
    if (menu1.type === 1) {
      for (let i = 0; i < Random.natural(4, 7); i++) {
        // 目录 添加三级菜单
        const menu3 = Mock.mock({
          'id': Random.id(),
          'name': Random.word(6),
          'path': Random.word(5) + '/' + Random.word(5),
          'component': 'Layout',
          'title': Random.ctitle(4),
          'icon': 'list',
          'permission': Random.word(8),
          'parentId': menu2.id,
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

// 递归组装shu
const buildTree = (menus) => {
  const treeData = []
  menus.forEach((item) => {
    if (item.parentId === '') {
      const menu = Object.assign({}, item)

      console.log('menu', menu)
      // 顶级菜单，查找子类
      menu.children = buildTreeChildren(menu, menus)
      treeData.push(menu)
    }
  })
  return treeData
}

const buildTreeChildren = (parent, menus) => {
  const treeData = []
  // 目录
  if (parent.type === 1) {
    menus.forEach((item) => {
      if (item.parentId === parent.id) {
        const menu = Object.assign({}, item)
        // 当前是目录 查找子类
        if (item.type === 1) {
          menu.children = buildTreeChildren(menu, menus)
        }
        treeData.push(menu)
      }
    })
  }
  return treeData
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
    url: '/sys/menu/tree',
    type: 'get',
    response: config => {
      const treeData = buildTree(menus)
      return {
        code: '20000',
        data: treeData
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
