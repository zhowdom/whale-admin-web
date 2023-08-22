import request from '@/utils/request'

// 列表数据
export function searchChangePhoneList(query) {
  return request({
    url: '/member/change/page',
    method: 'get',
    params: query
  })
}
//  创建更换手机号
export function addChangePhone(data) {
  return request({
    url: '/member/change/saveorupdate',
    method: 'post',
    data: data
  })
}
//  查询关联数据
export function searchInfoData(query) {
  return request({
    url: '/member/change/search',
    method: 'get',
    params: query
  })
}
// 审核更换手机号
export function examineChangePhone(data) {
  return request({
    url: '/member/change/audit',
    method: 'post',
    data: data
  })
}