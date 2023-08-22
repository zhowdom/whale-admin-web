// 盲盒提现
import request from '@/utils/request';

const urls = {
  audit: '/blindBox/withdraw/audit',                                  // 提现审核 - post
  importExcel: '/blindBox/withdraw/import',                           // 导入数据 - post
  page: '/blindBox/withdraw/page',                                    // 分页数据 - get
  smsSend: '/blindBox/withdraw/sms/send',                             // 发送验证码 - post
  smsVerify: '/blindBox/withdraw/sms/verify',                         // 校验验证码 - post
  downloadTempl: '/blindBox/withdraw/template',                       // 下载模板 - get
  statistic: '/blindBox/withdraw/statistics',                         // 统计数据 - get
  verPhone: '/blindBox/withdraw/sms/receive',                         // 脱敏手机号 - get
  del: '/blindBox/withdraw/delete',                                   // 删除 - post
}


export const audit = data => request({url: urls.audit, method: 'post', data, timeout: 30000});                          // 提现审核
export const importExcel = data => request({url: urls.importExcel, method: 'post', data, headers: {'content-type': 'multiple/form-data'}});              // 导入数据
export const page = data => request({url: urls.page, method: 'get', params: data});                     // 分页数据
export const smsSend = data => request({url: urls.smsSend, method: 'post', data});                      // 发送验证码
export const smsVerify = data => request({url: urls.smsVerify, method: 'post', data});                  // 校验验证码
export const downloadTempl = data => request({url: urls.downloadTempl, method: 'get', params: data, responseType: 'blob', timeout: 30000,});   // 下载模板
export const statistic = data => request({url: urls.statistic, method: 'get', params: data});           // 统计数据 - get
export const verPhone = data => request({url: urls.verPhone, method: 'get', params: data});
export const del = data => request({url: urls.del, method: 'post', data});
