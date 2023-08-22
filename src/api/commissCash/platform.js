import request from '@/utils/request'

//  平台分佣设置分页
// [permission]channel:list
export function platformList(query) {
  return request({
    url: '/commission/channel/channelCommissionConf',
    method: 'get',
    params: query
  })
}
//  平台分佣设置保存
// [permission]channel:save
export function platformSave(data) {
  return request({
    url: '/commission/channel/saveChannelCommissionConf',
    method: 'post',
    data: data
  })
}
// 等级分佣设置查询(1合伙人\8团长\16高级团长)
// [permission]plus:get
export function layerSettingLIST(query) {
  return request({
    url: '/commission/plus/plusCommissionConf',
    method: 'get',
    params: query
  })
}
//  等级分佣设置保存
// [permission]plus:save
export function layerSettingSAVE(data) {
  return request({
    url: '/commission/plus/savePlusCommissionConf',
    method: 'post',
    data: data
  })
}
// @等级设置
// [permission]commission:growth:get
export function layerGrowthLIST(query) {
  return request({
    url: '/commission/growth/plusConf',
    method: 'get',
    params: query
  })
}
//  等级分佣设置保存
// [permission]commission:growth:save
export function layerGrowthSAVE(data) {
  return request({
    url: '/commission/growth/saveGrowthConf',
    method: 'post',
    data: data
  })
}