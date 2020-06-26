import store from '@/store'

function checkRole(el, binding) {
  const { value } = binding
  const roles = store.getters && store.getters.roles

  if (value && value instanceof Array) {
    if (value.length > 0) {
      const hasRoles = value

      const hasRole = roles.some(role => {
        return hasRoles.includes(role)
      })

      if (!hasRole) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  } else {
    throw new Error(`need roles! Like v-hasRole="['admin','editor']"`)
  }
}

export default {
  inserted(el, binding) {
    checkRole(el, binding)
  },
  update(el, binding) {
    checkRole(el, binding)
  }
}
