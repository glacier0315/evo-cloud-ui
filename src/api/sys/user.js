import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/sys/user/list',
    method: 'get',
    params: data
  })
}

export function add(data) {
  return request({
    url: '/sys/user/add',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: `/sys/user/update`,
    method: 'put',
    data
  })
}

export function del(id) {
  return request({
    url: `/sys/user/delete`,
    method: 'delete',
    params: { 'id': id }
  })
}
