import request from '@/utils/request'
/**
 * 商品福利
 */
// 商品福利列表查询
export function welfareQueryList(query) {
  return request({
    url: '/goods/productWelfare/productWelfarePageList',
    method: 'get',
    params: query
  })
}
// 新增[请求商品page]
export function welfareQueryListInnerAdd(query) {
  return request({
    url: '/goods/productWelfare/searchPage',
    method: 'get',
    params: query
  })
}
// Candy抵扣配置清单
export function whalePeanSetQueryList(query) {
  return request({
    url: '/whale/deduction/setting/list',
    method: 'get',
    params: query
  })
}
// 福利类型List
export function productWelfareQueryList(query) {
  return request({
    url: '/goods/productWelfare/type',
    method: 'get',
    params: query
  })
}
// 新增[保存提交]
export function productWelfareAddSave(data) {
  return request({
    url: '/goods/productWelfare/save',
    method: 'post',
    data
  })
}
// 更新福利
export function productWelfareEditSave(data) {
  return request({
    url: '/goods/productWelfare/updateProductWelfare',
    method: 'post',
    data
  })
}
// 取消福利
export function cancelProductWelfare(query) {
  return request({
    url: '/goods/productWelfare/cancelProductWelfare',
    method: 'get',
    params: query
  })
}
// 订单优惠明细分页列表
export function orderDiscountDetailsList(query) {
  return request({
    url: '/order/offerDetail/list',
    method: 'get',
    params: query
  })
}