import request from '@/utils/request'
import { sys } from '@/common/constant'

export function getPostList() {
  return request({
    url: sys + '/post/findAll',
    method: 'get'
  })
}

export function getPostPageList(data) {
  return request({
    url: sys + '/post/pageList',
    method: 'post',
    data
  })
}

export function savePost(data) {
  return request({
    url: sys + '/post/save',
    method: 'post',
    data
  })
}

export function delPost(id) {
  return request({
    url: sys + '/post/delete',
    method: 'post',
    data: { 'id': id }
  })
}

/**
 * 检验编码信息
 * @param {*} data
 */
export function checkCode(data) {
  return request({
    url: sys + '/post/checkCode',
    method: 'post',
    data: data
  })
}
