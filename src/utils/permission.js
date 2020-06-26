import store from '@/store'

/**
 * 判断角色权限
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export function checkRole(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const hasRoles = value

    const hasRole = roles.some(role => {
      return hasRoles.includes(role)
    })
    return hasRole
  } else {
    console.error(`need roles! Like v-hasRole="['admin','editor']"`)
    return false
  }
}

/**
 * 判断权限
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const permissions = store.getters && store.getters.permissions
    const hasPermisions = value

    const hasPermision = permissions.some(permission => {
      return hasPermisions.includes(permission)
    })

    if (!hasPermision) {
      return false
    }
    return true
  } else {
    console.error(`need permissions! Like v-hasPermision="['sys:user:edit','sys:user:view']"`)
    return false
  }
}
