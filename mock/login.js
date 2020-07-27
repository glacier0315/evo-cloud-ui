const { tokens } = require('./sys/data/token')
const { users } = require('./sys/data/user')
const { authorizationServer, sys } = require('./constant')

module.exports = [
  // user login
  {
    url: authorizationServer + '/oauth/token',
    type: 'post',
    response: config => {
      const { username } = config.query
      const token = tokens[username]
      // mock error
      if (!token) {
        return {
          code: '60204',
          message: 'Account and password are incorrect.'
        }
      }
      return {
        code: '20000',
        data: token
      }
    }
  },

  // get user info
  {
    url: sys + '/oauth/userInfo\.*',
    type: 'get',
    response: config => {
      const { authorization } = config.headers
      const token = authorization.substring('Bearer '.length, authorization.length)
      let info = {}
      users.forEach(item => {
        // 设置id和token  一致
        if (token && token === item.id) {
          info = Object.assign({}, item)
        }
      })

      // mock error
      if (!info) {
        return {
          code: '50008',
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: '20000',
        data: info
      }
    }
  },

  // user logout
  {
    url: authorizationServer + '/logout',
    type: 'post',
    response: _ => {
      return {
        code: '20000',
        data: 'success'
      }
    }
  }
]
