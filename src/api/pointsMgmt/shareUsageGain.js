import request from '@/utils/request'

/**
 * 分享值
 */
// 分享值使用（消耗）新增
export function shareUsageAdd(data) {
  return request({
    url: '/share/worth/use/setting/add',
    method: 'post',
    data: data
  })
}
// 分享值使用（消耗）列表
export function shareUsageList(query) {
  return request({
    url: '/share/worth/use/setting/list',
    method: 'get',
    params: query
  })
}
// 分享值使用（消耗）修改
export function shareUsageAlter(data) {
  return request({
    url: '/share/worth/use/setting/update',
    method: 'post',
    data: data
  })
}
// 分享值获得列表
export function shareGainList(query) {
  return request({
    url: '/share/worth/get/setting/list',
    method: 'get',
    params: query
  })
}
// 分享值获得修改
export function shareGainAlter(data) {
  return request({
    url: '/share/worth/get/setting/update',
    method: 'post',
    data: data
  })
}
/**
 * 荣耀值
 */
// 荣耀值获得列表
export function contributeGainList(query) {
  return request({
    url: '/dedicate/worth/get/setting/list',
    method: 'get',
    params: query
  })
}
// 荣耀值获得状态修改
export function contributeGainStatusAlter(data) {
  return request({
    url: '/dedicate/worth/get/setting/status/change',
    method: 'post',
    data: data
  })
}
// 荣耀值获得修改
export function contributeGainListAlter(data) {
  return request({
    url: '/dedicate/worth/get/setting/update',
    method: 'post',
    data: data
  })
}
// 荣耀值消耗列表
export function contributeUseList(query) {
  return request({
    url: '/dedicate/worth/use/setting/list',
    method: 'get',
    params: query
  })
}
// 荣耀值消耗修改
export function contributeUseListAlter(data) {
  return request({
    url: '/dedicate/worth/use/setting/update',
    method: 'post',
    data: data
  })
}
// 获得荣耀值新增
export function contributeGainAdd (data) {
  return request({
    url: '/dedicate/worth/get/setting/add',
    method: 'post',
    data: data
  })
}
// 获得荣耀值配置类型清单
export function contributeGainTypes (query) {
  return request({
    url: '/dedicate/worth/get/setting/type/list',
    method: 'get',
    params: query
  })
}
// 荣耀值消耗新增
export function contributeUsageAdd (data) {
  return request({
    url: '/dedicate/worth/use/setting/add',
    method: 'post',
    data: data
  })
}