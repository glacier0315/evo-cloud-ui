const Mock = require('mockjs')
const { fdfs } = require('../constant')

const Random = Mock.Random

module.exports = [
  {
    url: fdfs + '/dfs/upload',
    type: 'post',
    response: config => {
      return {
        code: '20000',
        data: Random.url('http')
      }
    }
  },

  {
    url: fdfs + '/dfs/delete',
    type: 'post',
    response: config => {
      return {
        code: '20000',
        data: 'success'
      }
    }
  }
]

