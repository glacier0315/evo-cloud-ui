
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
    array.forEach(item => {
      if (item.parentId &&
        item.parentId === parent.id) {
        const element = Object.assign({}, item)
        // 设置父级名称
        element.parentName = parent.name
        buildChildren(element, array)
        children.push(element)
      }
    })
    // 排序
    children.sort(treeSort)
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
      if (element.parentId) {
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
  // 排序
  tree.sort(treeSort)
  return tree
}

const treeSort = (a, b) => {
  // 默认为0
  const orderNum1 = a.orderNum || 0
  const orderNum2 = b.orderNum || 0
  return orderNum1 - orderNum2
}

module.exports = {
  buildTree
}
