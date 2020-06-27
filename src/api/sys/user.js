import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/sys/user/list',
    method: 'get',
    data
  })
}

export function add(data) {
  return request({
    url: '/sys/user/add',
    method: 'post',
    data
  })
}

export function update(id, data) {
  return request({
    url: `/sys/user/update/${id}`,
    method: 'put',
    data
  })
}

export function del(id) {
  return request({
    url: `/sys/user/delete/${id}`,
    method: 'delete'
  })
}
