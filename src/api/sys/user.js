import request from '@/utils/request'

export function getUserList(data) {
  return request({
    url: '/sys/user/list',
    method: 'get',
    params: data
  })
}

export function addUser(data) {
  return request({
    url: '/sys/user/add',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: `/sys/user/update`,
    method: 'put',
    data
  })
}

export function delUser(id) {
  return request({
    url: `/sys/user/delete`,
    method: 'delete',
    params: { 'id': id }
  })
}
