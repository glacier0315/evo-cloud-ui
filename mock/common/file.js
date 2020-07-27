const Mock = require('mockjs')
const { commonWeb } = require('../constant')

const Random = Mock.Random

module.exports = [
  {
    url: commonWeb + '/dfs/upload',
    type: 'post',
    response: config => {
      return {
        code: '20000',
        data: Random.url('http')
      }
    }
  },

  {
    url: commonWeb + '/dfs/delete',
    type: 'post',
    response: config => {
      return {
        code: '20000',
        data: 'success'
      }
    }
  }
]

