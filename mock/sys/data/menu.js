const Mock = require('mockjs')

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
    'parentId': null,
    'parentName': null,
    'type': 1,
    'status': 1,
    'visible': 1,
    'noCache': 2,
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
      'status|1': [1, 2],
      'visible|1': [1, 2],
      'isFrame|1': [1, 2],
      'noCache|1': [1, 2],
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
          'status|1': [1, 2],
          'visible|1': [1, 2],
          'isFrame|1': [1, 2],
          'noCache|1': [1, 2],
          'orderNum|+1': 200
        })
        menus.push(menu3)
      }
    }
  }
}

module.exports = {
  menus
}
