// vip
import request from '@/utils/request'

const urls = {
  vipStatus: '/vip/entrance/status',                           // 状态查询
  statusChange: '/vip/entrance/status/change',                 // 状态更新
  batchUpdate: '/vip/item/batch/update',                       // 套餐更新
  vipList: '/vip/item/list',                                   // 套餐清单
  logPage: '/vip/info/buy/log/page',                           // 购买统计
  vipPage: '/vip/info/page',                                   // 分页数据
  benefitBatchUpdate:'/vip/benefit/batch/update',              // 权益批量更新
  benefitList:'/vip/benefit/list',                             // 权益查询
  transferRate:'/vip/benefit/transfer/rate',                   // 转赠手续费查询
  relieveBindEmail_query:'/member/email/unbind/list',
  transferRateUpdate:'/vip/benefit/transfer/rate/update',      // 转赠手续费更新
  relieveBindEmail_unbind:'/member/email/unbind',
  regGiveCoin_set:'/member/member/update/register_award_setting',
  regGiveCoin_query:'/member/member/register_award_setting',
  regGiveCoin_selectlist:'/coin/award/setting/list',
}


export const vipStatus = () => request({url: urls.vipStatus, method: 'post'});                                   // 状态查询
export const statusChange = data => request({url: urls.statusChange, method: 'post', data});                     // 状态更新
export const batchUpdate = data => request({url: urls.batchUpdate, method: 'post', data});                       // 套餐更新
export const vipList = data => request({url: urls.vipList, method: 'get', params: data});                        // 套餐清单
export const logPage = data => request({url: urls.logPage, method: 'post', data});                               // 购买统计
export const vipPage = data => request({url: urls.vipPage, method: 'post', data});                               // 分页数据
export const benefitBatchUpdate = data => request({url: urls.benefitBatchUpdate, method: 'post', data});         // 权益批量更新
export const benefitList = data => request({url: urls.benefitList, method: 'get', params: data});                // 权益查询
export const transferRate = data => request({url: urls.transferRate, method: 'get', params: data});              // 转赠手续费查询
export const relieveBindEmail_query = data => request({url: urls.relieveBindEmail_query, method: 'get', params: data});              // 解除绑定邮箱-查询
export const transferRateUpdate = data => request({url: urls.transferRateUpdate, method: 'post', data});
export const relieveBindEmail_unbind = data => request({url: urls.relieveBindEmail_unbind, method: 'post', data});         // 解除绑定邮箱-解除
export const regGiveCoin_set = data => request({url: urls.regGiveCoin_set, method: 'post', data});         // 注册赠送代币-设置
export const regGiveCoin_query = data => request({url: urls.regGiveCoin_query, method: 'get', params: data});
export const regGiveCoin_selectlist = data => request({url: urls.regGiveCoin_selectlist, method: 'get', params: data});
