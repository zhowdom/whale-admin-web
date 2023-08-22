// 费用相关
import request from '@/utils/request';

const urls = {
  // payList: '/pay/setting/list', // (旧)                                          // 支付设置列表 - get
  payList: '/pay/setting/v1/list', // (新)                                         // 支付设置列表 - get
  payUpdate: '/pay/setting/saveorupdate',                                 // 修改支付方式 - post
  authGet: '/setting/auth/get',                                           // 实名认证费用查询 - get
  authUpdate: '/setting/auth/saveorupdate',                               // 实名认证费用设置 - post
}


export const payList = data => request({url: urls.payList, method: 'get', params: data});          // 支付设置列表 - get
export const payUpdate = data => request({url: urls.payUpdate, method: 'post', data});             // 修改支付方式 - post
export const authGet = data => request({url: urls.authGet, method: 'get', params: data});          // 实名认证费用查询 - get
export const authUpdate = data => request({url: urls.authUpdate, method: 'post', data});           // 实名认证费用设置 - post
