import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/sys/role/list',
    method: 'get',
    params: data
  })
}

export function add(data) {
  return request({
    url: '/sys/role/add',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: `/sys/role/update`,
    method: 'put',
    data
  })
}

export function del(id) {
  return request({
    url: `/sys/role/delete`,
    method: 'delete',
    params: { 'id': id }
  })
}
