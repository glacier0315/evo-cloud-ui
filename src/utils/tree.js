
/**
 * 组装子元素
 * @param {父类} parent
 * @param {待分析数组} array
 */
const buildChildren = (parent, array) => {
  const children = []
  if (parent &&
    parent.id &&
    array instanceof Array &&
    array.length > 0) {
    array.forEach((item, index) => {
      if (item.parentId &&
        item.parentId === parent.id) {
        const element = Object.assign({}, item)
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
  if (array instanceof Array &&
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
  buildTree
}
