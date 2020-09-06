const user = require('./user')
const role = require('./role')
const userRole = require('./userRole')
const menu = require('./menu')
const dept = require('./dept')
const post = require('./post')

const sys = [
  ...user,
  ...menu,
  ...dept,
  ...role,
  ...post,
  ...userRole
]

module.exports = sys
