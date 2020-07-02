/**
 * @param {string} url
 * @returns {Object}
 */
function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * 组装子元素
 * @param {父类} parent
 * @param {待分析数组} array
 */
const buildChildren = (parent, array) => {
  const children = []
  if (parent &&
    parent.id &&
    typeof array === Array &&
    array.length > 0) {
    array.forEach((item, index) => {
      if (item.parentId &&
        item.parentId === parent.id) {
        const element = Object.assign({}, item)
        // 从数组中删除元素
        array.splice(index, 1)
        buildChildren(element, array)
        children.push(element)
      }
    })
    parent.children = children
  }
}

const buildTree = (array) => {
  const tree = []
  const children = []
  if (typeof array === Array &&
    array.length > 0) {
    // 查找顶级元素
    array.forEach(element => {
      if (element.parentId &&
        element.parentId !== '0' &&
        element.parentId.length > 0) {
        children.push(element)
      } else {
        tree.push(Object.assign({}, element))
      }
    })
    // 组装子元素
    tree.forEach(element => {
      buildChildren(element, children)
    })
  }

  return tree
}

module.exports = {
  param2Obj,
  deepClone,
  buildTree
}
