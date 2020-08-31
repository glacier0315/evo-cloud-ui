const Mock = require('mockjs')
const { roles } = require('./data/role')
const { sys } = require('../constant')

const Random = Mock.Random

module.exports = [
  {
    url: sys + '/role/findAll',
    type: 'get',
    response: _ => {
      return {
        code: '20000',
        data: roles
      }
    }
  },

  {
    url: sys + '/role/pageList',
    type: 'post',
    response: config => {
      const { params, pageNum = 1, pageSize = 20 } = config.body

      const { name, code, status } = params

      const mockList = roles.filter(item => {
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
    url: sys + '/role/save',
    type: 'post',
    response: config => {
      const role = config.body
      if (role.id) {
        // 更新
        roles.forEach((item, index) => {
          if (role && role.id && item.id === role.id) {
            roles.splice(index, 1, role)
          }
        })
      } else {
        // 新增
        role.id = Random.id()
        roles.push(role)
      }
      return {
        code: '20000',
        data: 'success'
      }
    }
  },

  {
    url: sys + '/role/delete',
    type: 'post',
    response: config => {
      const { id } = config.body
      roles.forEach((item, index) => {
        if (id && item.id === id) {
          roles.splice(index, 1)
        }
      })
      return {
        code: '20000',
        data: 'success'
      }
    }
  },

  {
    url: sys + '/menu/findByRole',
    type: 'get',
    response: config => {
      const id = config.query.roleId
      let menus = []
      roles.forEach(item => {
        if (id && item.id === id) {
          menus = item.menus
        }
      })
      return {
        code: '20000',
        data: menus
      }
    }
  },

  {
    url: sys + '/dept/findByRole',
    type: 'get',
    response: config => {
      const id = config.query.roleId
      let depts = []
      roles.forEach(item => {
        if (id && item.id === id) {
          depts = item.depts
        }
      })
      return {
        code: '20000',
        data: depts
      }
    }
  }
]
