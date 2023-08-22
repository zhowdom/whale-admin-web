import request from '@/utils/request'
// 套餐列表
export function adsRent_packageList(query) {
  return request({
    url: '/internal/ad/space/list',
    method: 'get',
    params: query
  })
}
// 展示位置列表
export function adsRent_addressList(query) {
  return request({
    url: '/internal/ad/space/position/list',
    method: 'get',
    params: query
  })
}

// 广告位-列表
export function adsRent_query(query) {
  return request({
    url: '/internal/ad/space/page',
    method: 'get',
    params: query
  })
}

// 广告位-新增
export function adsRent_add(data) {
  return request({
    url: '/internal/ad/space/save',
    method: 'post',
    data: data
  })
}

// 广告位-编辑
export function adsRent_edit(data) {
  return request({
    url: '/internal/ad/space/update',
    method: 'post',
    data: data
  })
}
// 广告位-状态
export function adsRent_switch(data) {
  return request({
    url: '/internal/ad/space/change',
    method: 'post',
    data: data
  })
}
// 申请记录
export function adsRent_applyLog(query) {
  return request({
    url: '/ad/space/order/page',
    method: 'get',
    params: query
  })
}
// 奖励记录
export function adsRent_bonusLog(query) {
  return request({
    url: '/ad/space/reward/page',
    method: 'get',
    params: query
  })
}
// 奖励记录-明细
export function adsRent_bonusLogDialog(query) {
  return request({
    url: '/ad/space/reward/invite/page',
    method: 'get',
    params: query
  })
}
// 使用记录
export function adsRent_useLog(query) {
  return request({
    url: '/ad/space/order/use/record/page',
    method: 'get',
    params: query
  })
}