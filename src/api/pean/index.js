import request from '@/utils/request'

// Candy转赠统计数据
export function peanDetailStatistic(query) {
  return request({
    url: '/internal/whale/peas/transfer/statistic',
    method: 'get',
    params: query
  })
}
// Candy转赠明细列表
export function peanDetailList(data) {
  return request({
    url: '/internal/whale/peas/transfer/page',
    method: 'post',
    data: data
  })
}
// Candy总统计列表
export function peanTotalList(data) {
  return request({
    url: '/internal/whale/peas/statistic/page',
    method: 'post',
    data: data
  })
}
// LV等级列表
export function lvList(query) {
  return request({
    url: '/share/worth/use/setting/name/list',
    method: 'get',
    params: query
  })
}
// 荣耀值总统计列表
export function contributeTotalList(data) {
  return request({
    url: '/dedicate/worth/statistic/page',
    method: 'post',
    data: data
  })
}
// 活跃值总统计
export function hyList(data) {
  return request({
    url: '/active/statistic/page',
    method: 'post',
    data: data
  })
}
export function hyTypes(data) {
  return request({
    url: '/active/types',
    method: 'post',
    data: data
  })
}
export function hyTeams(data) {
  return request({
    url: '/active/team/member/page',
    method: 'post',
    data: data
  })
}
export function hyDetails(query) {
  return request({
    url: '/active/worth/log/page',
    method: 'get',
    params: query
  })
}
// 星级等级类型(下拉数据)
export function queryStartTypes(data) {
  return request({
    url: '/asterisk/types',
    method: 'post',
    data: data
  })
}
/**
 * 领取定位统计接口
 */
// 豆腐块数据
export function lccToufuInfo(query) {
  return request({
    url: '/member/data/agg/info',
    method: 'get',
    params: query
  })
}

// 查询范围
export function lccFanweiInfo(query) {
  return request({
    url: '/member/data/agg/history',
    method: 'get',
    params: query
  })
}

// 对象列表
export function lccDXlist(query) {
  return request({
    url: '/member/data/agg/option/list',
    method: 'get',
    params: query
  })
}