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
    url: '/ad/conf/saveorupdate',
    method: 'post',
    data: data
  })
}
// 广告宝-配置设置-查询
export function atQuery(query) {
  return request({
    url: '/ad/conf/list',
    method: 'get',
    params: query
  })
}
// 广告宝-订单-查询
export function atOrderQuery(query) {
  return request({
    url: '/ad/order/page',
    method: 'get',
    params: query
  })
}
// 广告宝-订单-查看
export function atOrderSeeIn(query) {
  return request({
    url: '/ad/order/details',
    method: 'get',
    params: query
  })
}
// 广告宝-订单-审核
export function atOrderAudit(data) {
  return request({
    url: '/ad/order/audit',
    method: 'post',
    data: data
  })
}
// 广告宝-订单-分页统计
export function atOrderStatistics(query) {
  return request({
    url: '/ad/order/statistics',
    method: 'get',
    params: query
  })
}
// 广告宝-违规记录-操作
export function atInfractionOperation(data) {
  return request({
    url: '/ad/violation/edit',
    method: 'post',
    data: data
  })
}
// 广告宝-违规记录-分页
export function atInfractionQuery(query) {
  return request({
    url: '/ad/violation/page',
    method: 'get',
    params: query
  })
}
// 广告宝-道具配置-删除
export function atPropDel(data) {
  return request({
    url: '/internal/ad/prop/delete',
    method: 'post',
    data: data
  })
}
// 广告宝-道具配置-详情
export function atPropInfos(query) {
  return request({
    url: '/internal/ad/prop/detail',
    method: 'get',
    params: query
  })
}
// 广告宝-道具配置-分页
export function atPropQuery(query) {
  return request({
    url: '/internal/ad/prop/page',
    method: 'get',
    params: query
  })
}
// 广告宝-道具配置-新增
export function atPropAdd(data) {
  return request({
    url: '/internal/ad/prop/save',
    method: 'post',
    data: data
  })
}
// 广告宝-道具配置-状态变更
export function atPropStatus(data) {
  return request({
    url: '/internal/ad/prop/status/change',
    method: 'post',
    data: data
  })
}
// 广告宝-道具配置-编辑
export function atPropEdit(data) {
  return request({
    url: '/internal/ad/prop/update',
    method: 'post',
    data: data
  })
}
// 广告宝-广告宝市场-分页
export function atMarketQuery(query) {
  return request({
    url: '/internal/ad/market/page',
    method: 'get',
    params: query
  })
}
// 广告宝-管理-查询用户可使用广告表List
export function atManaOperList(query) {
  return request({
    url: '/internal/ad/oper/list',
    method: 'get',
    params: query
  })
}
// 广告宝-管理-分页
export function atManaQuery(query) {
  return request({
    url: '/internal/ad/oper/page',
    method: 'get',
    params: query
  })
}
// 广告宝-管理-标记
export function atManaMark(data) {
  return request({
    url: '/internal/ad/oper/sign',
    method: 'post',
    data: data
  })
}
// 广告宝-管理-统计
export function atManastatistics(query) {
  return request({
    url: '/internal/ad/oper/statistics',
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
    url: '/internal/ad/prop/list',
    method: 'get',
    params: query
  })
}
// 广告宝-账户-列表
export function atAccountList(query) {
  return request({
    url: '/ad/account/page',
    method: 'get',
    params: query
  })
}
// 广告宝-账户-查看
export function atAccountSee(query) {
  return request({
    url: '/ad/account/details/page',
    method: 'get',
    params: query
  })
}

// 广告宝-管理-编辑发布价格
export function editRelease(data) {
  return request({
    url: '/internal/ad/prop/edit/release',
    method: 'post',
    data: data
  })
}

// 广告宝-背景颜色
export function getBackground(query) {
  return request({
    url: '/internal/ad/prop/background/color/down',
    method: 'get',
    params: query
  })
}
// 广告宝-市场批量下架
export function ggb_downBatchC(data) {
  return request({
    url: '/internal/ad/market/batch/down',
    method: 'post',
    data: data
  })
}

/**
 * 广告宝-服务费配置-新需求
 * at: 9/19
 */
// 列表查询
export function ggb_serviceFeeSetNew_list(query) {
  return request({
    url: '/ad/conf/serviceFee/page',
    method: 'get',
    params: query
  })
}
// 新增修改
export function ggb_serviceFeeSetNew_alter(data) {
  return request({
    url: '/ad/conf/serviceFee/storage',
    method: 'post',
    data: data
  })
}
// 状态修改
export function ggb_serviceFeeSetNew_status(data) {
  return request({
    url: '/ad/conf/serviceFee/status/update',
    method: 'post',
    data: data
  })
}
// 列表删除
export function ggb_serviceFeeSetNew_del(query) {
  return request({
    url: '/ad/conf/serviceFee/delete',
    method: 'get',
    params: query
  })
}