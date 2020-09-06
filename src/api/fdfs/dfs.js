import request from '@/utils/request'
import { fdfs } from '@/common/constant'

/**
 * 查询用户
 * @param {*} data
 */
export function uploadFile(data) {
  return request({
    url: fdfs + '/dfs/upload',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    data
  })
}

export function deleteFile(data) {
  return request({
    url: fdfs + '/dfs/delete',
    method: 'post',
    data
  })
}
