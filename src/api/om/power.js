import request from '@/utils/request'

// 列表数据
export function searchUserPowerList(query) {
  return request({
    url: '/member/prerogative/page',
    method: 'get',
    params: query
  })
}
//  会员搜索-通过手机号查询
export function searchUserByPhone(query) {
  return request({
    url: '/member/auth/member/search',
    method: 'get',
    params: query
  })
}
//  特权类型匹配
export function searchAuditTypes(query) {
  return request({
    url: '/member/prerogative/types',
    method: 'get',
    params: query
  })
}
//  赠送任务券查询（taskType传4）4：特权任务类型下的券查询
/**
 * 赠送任务券的type值：7
 * 值id:14
 * taskName: "特权券"
 */
export function searchTaskCouponList(query) {
  return request({
    url: '/task/page',
    method: 'get',
    params: query
  })
}
//  新增特权
export function addAuditPower(data) {
  return request({
    url: '/member/prerogative/save',
    method: 'post',
    data: data
  })
}
//  修改编辑特权
export function editAuditPower(data) {
  return request({
    url: '/member/prerogative/update',
    method: 'post',
    data: data
  })
}
//  批量审核
export function auditingBatch(data) {
  return request({
    url: '/member/prerogative/audit',
    method: 'post',
    data: data
  })
}
//  批量删除
export function deletBatch(data) {
  return request({
    url: '/member/prerogative/delete/batch',
    method: 'post',
    data: data
  })
}
// 统计数据
export function totalDataInfos(query) {
  return request({
    url: '/member/prerogative/statistic',
    method: 'get',
    params: query
  })
}