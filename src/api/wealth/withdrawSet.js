import request from '@/utils/request'

// 保存提现配置
export function saveWithdrawSetting(data) {
  return request({
    url: '/withdraw/save',
    method: 'post',
    data: data
  })
}
// 获取提现配置
export function queryWithdrawSetting(query) {
  return request({
    url: '/withdraw/withdrawConf',
    method: 'get',
    params: query
  })
}
// 提现列表查询
export function queryWithdrawList(data) {
  return request({
    url: '/withdraw/withdrawPage',
    method: 'post',
    data: data
  })
}

// 提现条数统计
export function withdrawCount(query) {
  return request({
    url: '/withdraw/statistic',
    method: 'get',
    params: query
  })
}

// 提现审核
export function withdrawAudit(data) {
  return request({
    url: '/withdraw/withdrawAudit',
    method: 'post',
    data: data
  })
}