const Mock = require('mockjs')
const { depts } = require('./data/dept')
const { sys } = require('../constant')

const Random = Mock.Random

module.exports = [
  {
    url: sys + '/dept/list',
    type: 'get',
    response: config => {
      return {
        code: '20000',
        data: depts
      }
    }
  },

  {
    url: sys + '/dept/save',
    type: 'post',
    response: config => {
      const dept = config.body
      if (dept.id) {
        // 更新
        depts.forEach((item, index) => {
          if (dept && dept.id && item.id === dept.id) {
            depts.splice(index, 1, dept)
          }
        })
      } else {
        // 新增
        dept.id = Random.id()
        depts.push(dept)
      }

      return {
        code: '20000',
        data: 'success'
      }
    }
  },

  {
    url: sys + '/dept/delete',
    type: 'post',
    response: config => {
      const { id } = config.body
      depts.forEach((item, index) => {
        if (id && item.id === id) {
          depts.splice(index, 1)
        }
      })
      return {
        code: '20000',
        data: 'success'
      }
    }
  }
]
