/**
 * 校验身份证号
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export const idCardValidator = (rule, value, callback) => {
  const reg15 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$/
  const reg18 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  const length = value ? value.length : 0
  if (length !== 15 && length !== 18) {
    callback(new Error('身份证号不合法，长度为15位或者18位!'))
    return
  }
  if (value.length === 15 && !reg15.test(value)) {
    callback(new Error('身份证号不合法!'))
    return
  }
  if (value.length === 18 && !reg18.test(value)) {
    callback(new Error('身份证号不合法!'))
    return
  }
  callback()
}

/**
 * 校验邮箱
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export const emailValidator = (rule, value, callback) => {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (!reg.test(value)) {
    callback(new Error('邮箱不合法!'))
    return
  }
  callback()
}

/**
 * 校验手机号
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export const mobileValidator = (rule, value, callback) => {
  const reg = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/
  if (!reg.test(value)) {
    callback(new Error('手机号不合法，长度为11位!'))
    return
  }
  callback()
}
