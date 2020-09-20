import request from '@/utils/request'
import { gen } from '@/common/constant'

export function findPage(data) {
  return request({
    url: gen + '/table/findPage',
    method: 'post',
    data
  })
}

export function save(data) {
  return request({
    url: gen + '/table/save',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: gen + '/table/delete',
    method: 'post',
    data: { 'id': id }
  })
}
