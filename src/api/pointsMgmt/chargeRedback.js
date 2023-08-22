import request from '@/utils/request'

// query
export function queryRun(query) {
  return request({
    url: '/internal/dividend/setting/list',
    method: 'get',
    params: query
  })
}
// update
export function updateRun(data) {
  return request({
    url: '/internal/dividend/setting/update',
    method: 'post',
    data: data
  })
}
// infos box
export function infosBox(query) {
  return request({
    url: '/internal/dividend/statistic/today',
    method: 'get',
    params: query
  })
}
// status modify
export function modifyStatus(data) {
  return request({
    url: '/internal/dividend/setting/status/change',
    method: 'post',
    data: data
  })
}