const Mock = require('mockjs')
const { posts } = require('./data/post')
const { sys } = require('../constant')

const Random = Mock.Random

module.exports = [
  {
    url: sys + '/post/findAll',
    type: 'get',
    response: _ => {
      return {
        code: '20000',
        data: posts
      }
    }
  },

  {
    url: sys + '/post/findPage',
    type: 'post',
    response: config => {
      const { params, pageNum = 1, pageSize = 20 } = config.body

      const { name, code, status } = params

      const mockList = posts.filter(item => {
        if (name && item.name !== name) return false
        if (code && item.code !== code) return false
        if (status && item.status !== status) return false
        return true
      })

      const pageList = mockList.filter((item, index) => index < pageSize * pageNum && index >= pageSize * (pageNum - 1))

      return {
        code: '20000',
        data: {
          pageNum: pageNum,
          pageSize: pageSize,
          total: mockList.length,
          list: pageList
        }
      }
    }
  },

  {
    url: sys + '/post/save',
    type: 'post',
    response: config => {
      const post = config.body
      if (post.id) {
        // 更新
        posts.forEach((item, index) => {
          if (post && post.id && item.id === post.id) {
            posts.splice(index, 1, post)
          }
        })
      } else {
        // 新增
        post.id = Random.id()
        posts.push(post)
      }
      return {
        code: '20000',
        data: 'success'
      }
    }
  },

  {
    url: sys + '/post/delete',
    type: 'post',
    response: config => {
      const { id } = config.body
      posts.forEach((item, index) => {
        if (id && item.id === id) {
          posts.splice(index, 1)
        }
      })
      return {
        code: '20000',
        data: 'success'
      }
    }
  },

  {
    url: sys + '/post/checkCode',
    type: 'post',
    response: config => {
      return {
        code: '20000',
        data: false
      }
    }
  }
]
