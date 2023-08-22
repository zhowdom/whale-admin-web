import request from '@/utils/request'

// 手续费统计-月统计
export function mmfee_monthQuery(query) {
  return request({
    url: '/internal/platform_fee/stat/month_page',
    method: 'get',
    params: query
  })
}
// 手续费统计-来源统计
export function mmfee_originQuery(query) {
  return request({
    url: '/internal/platform_fee/stat/source_page',
    method: 'get',
    params: query
  })
}
// 手续费统计-总统计
export function mmfee_totalQuery(query) {
  return request({
    url: '/internal/platform_fee/stat/total_page',
    method: 'get',
    params: query
  })
}
// 节点分红管理、星级达人分红管理-配置分页
export function mmStartPoint_settingQuery(query) {
  return request({
    url: '/internal/fee_bonus/setting/page',
    method: 'get',
    params: query
  })
}
// 节点分红管理、星级达人分红管理-手续费类型分页
export function mmStartPoint_feeTypeQuery(query) {
  return request({
    url: '/internal/fee_bonus/setting/type/list',
    method: 'get',
    params: query
  })
}
// 节点分红管理、星级达人分红管理-分红统计
export function mmStartPoint_profitQuery(query) {
  return request({
    url: '/internal/fee_bonus/share/stat/page',
    method: 'get',
    params: query
  })
}
// 节点分红管理、星级达人分红管理-分红明细
export function mmStartPoint_profitDetail(query) {
  return request({
    url: '/internal/fee_bonus/share/log/page',
    method: 'get',
    params: query
  })
}
// 节点分红管理、星级达人分红管理-新增
export function mmStartPoint_add(data) {
  return request({
    url: '/internal/fee_bonus/setting/add',
    method: 'post',
    data: data
  })
}
// 节点分红管理、星级达人分红管理-修改
export function mmStartPoint_alter(data) {
  return request({
    url: '/internal/fee_bonus/setting/update',
    method: 'post',
    data: data
  })
}