import request from '@/utils/request'

// delete
export function deleteRun(data) {
  return request({
    url: '/white/dividend/agora/delete',
    method: 'post',
    data: data
  })
}
// page
export function pageRun(query) {
  return request({
    url: '/white/dividend/agora/page',
    method: 'get',
    params: query
  })
}
// save
export function saveRun(data) {
  return request({
    url: '/white/dividend/agora/save',
    method: 'post',
    data: data
  })
}
// 分红流水统计
export function fluidList(data) {
  return request({
    url: '/white/dividend/agora/log/page',
    method: 'post',
    data: data
  })
}
// 分红详细情况弹窗｜integral:dividend:log:source:list
export function fluidListDialog(query) {
  return request({
    url: '/internal/dividend/log/source/list',
    method: 'get',
    params: query
  })
}
// 分红流水统计（新更换的接口）｜	integral:dividend:log:page
export function fluidListNEW(data) {
  return request({
    url: '/internal/dividend/log/page',
    method: 'post',
    data: data
  })
}
// 分红来源类型(下拉数据)｜none permission
export function diviSourcesTyps(query) {
  return request({
    url: '/internal/dividend/log/source/type/list',
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
// 查询白名单配置
export function queryWhiteSetting(query) {
  return request({
    url: '/white/dividend/agora/setting',
    method: 'get',
    params: query
  })
}
// 修改白名单配置
export function updateWhiteSetting(data) {
  return request({
    url: '/white/dividend/agora/setting/update',
    method: 'post',
    data: data
  })
}
/**
 * 总券统计
 */
// 状态统计｜integral:task:statistic:page
export function alltaskStatus(query) {
  return request({
    url: '/task/statistic/data',
    method: 'get',
    params: query
  })
}
// 任务券来源统计
export function alltaskOrigin(query) {
  return request({
    url: '/task/type/list',
    method: 'get',
    params: query
  })
}
// 列表分页|integral:task:statistic:page
export function alltaskList(data) {
  return request({
    url: '/task/statistic/page',
    method: 'post',
    data: data
  })
}
// 用户持有券列表分页数据(单个点击查询)
export function tcoList(query) {
  return request({
    url: '/internal/task/member/page',
    method: 'get',
    params: query
  })
}
// 用户持有券统计分页数据(大列表查询)
export function tcoListStatistic(data) {
  return request({
    url: '/internal/task/member/statistic/page',
    method: 'post',
    data: data
  })
}
// 用户持有单个券统计数据
export function getSingleList(query) {
  return request({
    url: '/internal/task/member/statistic/info',
    method: 'get',
    params: query
  })
}
// 用户持有券统数据刷新
export function reflashData(data) {
  return request({
    url: '/internal/task/member/statistic/reflash',
    method: 'post',
    data: data
  })
}
// 单个任务券统计
export function getSingleTaskList(query) {
  return request({
    url: '/task/statistic/info',
    method: 'get',
    params: query
  })
}
// 直属邀请IP统计
export function getInviteeIpStatPage(query) {
  return request({
    url: '/member/inviteeIpStatPage',
    method: 'get',
    params: query
  })
}