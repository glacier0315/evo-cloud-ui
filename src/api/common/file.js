import request from '@/utils/request'
import { commonWeb } from '@/common/constant'

/**
 * 查询用户
 * @param {*} data
 */
export function uploadFile(data) {
  return request({
    url: commonWeb + '/dfs/upload',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    data
  })
}

export function deleteFile(data) {
  return request({
    url: commonWeb + '/dfs/delete',
    method: 'post',
    data
  })
}
