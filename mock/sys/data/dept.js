const Mock = require('mockjs')

const Random = Mock.Random

const depts = []
for (let i = 0; i < 10; i++) {
  // 一级机构
  const dept1 = Mock.mock({
    'id': Random.id(),
    'name': Random.ctitle(4),
    'code': Random.word(8),
    'type': 1,
    'status': 1,
    'orderNum|+1': 1
  })
  depts.push(dept1)
  // 设置子类
  for (let i = 0; i < Random.natural(4, 7); i++) {
    // 二级机构
    const dept2 = Mock.mock({
      'id': Random.id(),
      'name': Random.ctitle(4),
      'code': Random.word(8),
      'parentId': dept1.id,
      'parentName': dept1.name,
      'type|1': 2,
      'status|1': [1, 2],
      'orderNum|+1': 100
    })
    depts.push(dept2)
    if (dept2.type === 1) {
      for (let i = 0; i < Random.natural(4, 7); i++) {
        // 添加三级机构
        const dept3 = Mock.mock({
          'id': Random.id(),
          'name': Random.ctitle(4),
          'code': Random.word(8),
          'parentId': dept2.id,
          'parentName': dept2.name,
          'type|1': 3,
          'status|1': [1, 2],
          'orderNum|+1': 200
        })
        depts.push(dept3)
      }
    }
  }
}

module.exports = {
  depts
}
