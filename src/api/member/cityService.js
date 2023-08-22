// 城市服务商管理
import request from '@/utils/request'

const urls = {
  facilitatorPage: '/city/facilitator/page',              // 分页数据
  facilitatorInfo: '/city/facilitator/info',              // 明细
  facilitatorSave: '/city/facilitator/save',              // 保存
  statusChange: '/city/facilitator/status/change',        // 状态变更
  facilitatorUpdate: '/city/facilitator/update',          // 更新
  memberSearch: '/member/auth/member/search',             // 实名会员搜索
  memberSearchv2: '/member/auth/member/account/search',             // 实名会员搜索v2
  abroadFacilitator: '/abroad/district/city/facilitator/options',             // 城市服务商合约城市下拉列表数据
}


export const facilitatorPage = data => request({url: urls.facilitatorPage, method: 'post', data});              // 分页数据
export const facilitatorInfo = data => request({url: urls.facilitatorInfo, method: 'get', params: data});     // 明细
export const facilitatorSave = data => request({url: urls.facilitatorSave, method: 'post', data});            // 保存
export const statusChange = data => request({url: urls.statusChange, method: 'post', data});                  // 状态变更
export const facilitatorUpdate = data => request({url: urls.facilitatorUpdate, method: 'post', data});        // 更新
export const memberSearch = data => request({url: urls.memberSearch, method: 'get', params: data});          // 实名会员搜索
export const abroadFacilitator = data => request({url: urls.abroadFacilitator, method: 'get', params: data});          // 城市服务商合约城市下拉列表数据
export const memberSearchv2 = data => request({url: urls.memberSearchv2, method: 'get', params: data});          // 实名会员搜索v2
