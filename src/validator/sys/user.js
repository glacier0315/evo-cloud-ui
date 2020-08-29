/**
 * 校验用户名
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export const usernameValidator = (rule, value, callback) => {
  const reg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_]{5,20}$/
  if (!reg.test(value)) {
    callback(new Error('用户名不合法，长度是5到20位，支持(字母，数字，下划线)，不能以下划线开头结尾!'))
  }
}

/**
 * 校验昵称
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export const nicknameValidator = (rule, value, callback) => {
  const reg = /^(?!_)(?!.*?_$)[\u4e00-\u9fa5_a-zA-Z0-9_]{4,10}$/
  if (!reg.test(value)) {
    callback(new Error('昵称不合法，长度是4到10位，支持(中文，字母，数字，下划线)，不能以下划线开头结尾!'))
  }
}
