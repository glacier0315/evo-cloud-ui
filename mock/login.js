
const tokens = {
  admin: {
    code: '20000',
    access_token: 'admin-token',
    refresh_token: 'admin-token',
    expires_in: 5
  },
  editor: {
    code: '20000',
    access_token: 'editor-token',
    refresh_token: 'admin-token',
    expires_in: 5
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

module.exports = [
  // user login
  {
    url: '/uas/oauth/token',
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
      return token
    }
  },

  // get user info
  {
    url: '/sys/oauth/userInfo\.*',
    type: 'get',
    response: config => {
      const { authorization } = config.headers
      const token = authorization.substring('Bearer '.length, authorization.length)
      const info = users[token]

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
    url: '/uas/logout',
    type: 'post',
    response: _ => {
      return {
        code: '20000',
        data: 'success'
      }
    }
  }
]
