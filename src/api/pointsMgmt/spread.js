import request from '@/utils/request'
// 获得推广活跃值配置清单
export function spreadSetList(query) {
  return request({
    url: '/active/promote/get/setting/list',
    method: 'get',
    params: query
  })
}
// 获得推广活跃值配置更新
export function spreadSetAlter(data) {
  return request({
    url: '/active/promote/get/setting/batch/update',
    method: 'post',
    data: data
  })
}
// 消耗推广活跃值配置清单
export function spreadUseList(query) {
  return request({
    url: '/active/promote/use/setting/list',
    method: 'get',
    params: query
  })
}
// 消耗推广活跃值配置更新
export function spreadUseAlter(data) {
  return request({
    url: '/active/promote/use/setting/update',
    method: 'post',
    data: data
  })
}