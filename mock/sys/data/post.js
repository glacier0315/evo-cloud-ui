const Mock = require('mockjs')

const Random = Mock.Random
const posts = []

for (let i = 0; i < 97; i++) {
  posts.push(Mock.mock({
    'id': Random.id(),
    'name': Random.ctitle(5),
    'code': Random.string('lower', 6),
    'status|1': [1, 2],
    description: Random.paragraph()
  }))
}

module.exports = {
  posts
}
