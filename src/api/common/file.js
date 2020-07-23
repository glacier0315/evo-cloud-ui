import request from '@/utils/request'

/**
 * 查询用户
 * @param {*} data
 */
export function uploadFile(data) {
  return request({
    url: '/web/dfs/upload',
    method: 'post',
    data
  })
}

export function deleteFile(data) {
  return request({
    url: '/web/dfs/delete',
    method: 'post',
    data
  })
}
