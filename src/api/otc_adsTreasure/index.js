import request from '@/utils/request'
/**
 * 
 * ************************
 * @@广告宝@@
 * ************************
 * 
 */
// 广告宝-配置设置-修改
export function atSave(data) {
  return request({
    url: '/otc/conf/saveorupdate',
    method: 'post',
    data: data
  })
}
// 广告宝-配置设置-查询
export function atQuery(query) {
  return request({
    url: '/otc/conf/list',
    method: 'get',
    params: query
  })
}
// 广告宝-订单-查询
export function atOrderQuery(query) {
  return request({
    url: '/otc/order/page',
    method: 'get',
    params: query
  })
}
// 广告宝-订单-查看
export function atOrderSeeIn(query) {
  return request({
    url: '/otc/order/details',
    method: 'get',
    params: query
  })
}
// 广告宝-订单-审核
export function atOrderAudit(data) {
  return request({
    url: '/otc/order/audit',
    method: 'post',
    data: data
  })
}
// 广告宝-订单-分页统计
export function atOrderStatistics(query) {
  return request({
    url: '/otc/order/statistics',
    method: 'get',
    params: query
  })
}
// 广告宝-违规记录-操作
export function atInfractionOperation(data) {
  return request({
    url: '/otc/violation/edit',
    method: 'post',
    data: data
  })
}
// 广告宝-违规记录-分页
export function atInfractionQuery(query) {
  return request({
    url: '/otc/violation/page',
    method: 'get',
    params: query
  })
}
// 广告宝-道具配置-删除
export function atPropDel(data) {
  return request({
    url: '/internal/otc/prop/delete',
    method: 'post',
    data: data
  })
}
// 广告宝-道具配置-详情
export function atPropInfos(query) {
  return request({
    url: '/internal/otc/prop/detail',
    method: 'get',
    params: query
  })
}
// 广告宝-道具配置-分页
export function atPropQuery(query) {
  return request({
    url: '/internal/otc/prop/page',
    method: 'get',
    params: query
  })
}
// 广告宝-道具配置-新增
export function atPropAdd(data) {
  return request({
    url: '/internal/otc/prop/save',
    method: 'post',
    data: data
  })
}
// 广告宝-道具配置-状态变更
export function atPropStatus(data) {
  return request({
    url: '/internal/otc/prop/status/change',
    method: 'post',
    data: data
  })
}
// 广告宝-道具配置-编辑
export function atPropEdit(data) {
  return request({
    url: '/internal/otc/prop/update',
    method: 'post',
    data: data
  })
}
// 广告宝-广告宝市场-分页
export function atMarketQuery(query) {
  return request({
    url: '/internal/otc/market/page',
    method: 'get',
    params: query
  })
}
// 广告宝-管理-查询用户可使用广告表List
export function atManaOperList(query) {
  return request({
    url: '/internal/otc/oper/list',
    method: 'get',
    params: query
  })
}
// 广告宝-管理-分页
export function atManaQuery(query) {
  return request({
    url: '/internal/otc/oper/page',
    method: 'get',
    params: query
  })
}
// 广告宝-管理-标记
export function atManaMark(data) {
  return request({
    url: '/internal/otc/oper/sign',
    method: 'post',
    data: data
  })
}
// 广告宝-管理-统计
export function atManastatistics(query) {
  return request({
    url: '/internal/otc/oper/statistics',
    method: 'get',
    params: query
  })
}
// 广告宝-管理-标记已使用（邀请码、手机号，输入任意一项，匹配另外一项接口）
export function atManaCatchOneBy(query) {
  return request({
    url: '/member/member/info',
    method: 'get',
    params: query
  })
}
// 广告宝-名称-列表下拉集合
export function atNameLists(query) {
  return request({
    url: '/internal/otc/prop/list',
    method: 'get',
    params: query
  })
}
// 广告宝-账户-列表
export function atAccountList(query) {
  return request({
    url: '/otc/account/page',
    method: 'get',
    params: query
  })
}
// 广告宝-账户-查看
export function atAccountSee(query) {
  return request({
    url: '/otc/account/details/page',
    method: 'get',
    params: query
  })
}
// 币种下拉
export function coinSelectNews(query) {
  return request({
    url: '/wallet/coin/config/settings/coinlist',
    method: 'get',
    params: query
  })
}
// OTC-编辑价格发布
export function coinEditfb(data) {
  return request({
    url: '/internal/otc/prop/edit/release',
    method: 'post',
    data: data
  })
}
// otc-发布配置列表
export function otcFBsetList(query) {
  return request({
    url: '/otc/conf/release/list',
    method: 'get',
    params: query
  })
}
// otc-发布配置列表-修改
export function otcFBsetListAlter(data) {
  return request({
    url: '/otc/conf/release/storage',
    method: 'post',
    data: data
  })
}
// otc-发布配置列表-状态修改
export function otcFBsetListAlterStatus(data) {
  return request({
    url: '/otc/conf/release/status/update',
    method: 'post',
    data: data
  })
}
// otc-购买出售列表
export function otcBugSellList(query) {
  return request({
    url: '/otc/conf/buy/sale/list',
    method: 'get',
    params: query
  })
}
// otc-购买出售列表-修改
export function otcBugSellListAlter(data) {
  return request({
    url: '/otc/conf/buy/sale/storage',
    method: 'post',
    data: data
  })
}
// otc-购买出售列表-状态修改
export function otcBugSellListAlterStatus(data) {
  return request({
    url: '/otc/conf/buy/sale/status',
    method: 'post',
    data: data
  })
}
// otc-订单管理-取消订单
export function otcOrderManaCancel(data) {
  return request({
    url: '/otc/order/cancel',
    method: 'post',
    data: data
  })
}
// otc-市场管理-下架批量
export function downBatchC(data) {
  return request({
    url: '/internal/otc/market/batch/down',
    method: 'post',
    data: data
  })
}
// U商列表查询
export function usListQuery(query) {
  return request({
    url: '/otc/conf/ubusiness/permissions/list',
    method: 'get',
    params: query
  })
}
// U商列表-状态更改
export function usStatusAlter(data) {
  return request({
    url: '/otc/conf/ubusiness/permissions/status/update',
    method: 'post',
    data: data
  })
}
// U商-新增编辑
export function usAddOrEdit(data) {
  return request({
    url: '/otc/conf/ubusiness/permissions/storage',
    method: 'post',
    data: data
  })
}
// U商-手机号、邀请码联动查询
export function usPhoneLinkQueryCode(query) {
  return request({
    url: '/member/member/info',
    method: 'get',
    params: query
  })
}