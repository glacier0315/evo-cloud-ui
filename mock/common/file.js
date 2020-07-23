const Mock = require('mockjs')

const Random = Mock.Random

module.exports = [
  {
    url: '/web/dfs/upload',
    type: 'post',
    response: config => {
      return {
        code: '20000',
        data: Random.url('http')
      }
    }
  },

  {
    url: '/web/dfs/delete',
    type: 'post',
    response: config => {
      return {
        code: '20000',
        data: 'success'
      }
    }
  }
]

