// 售后 - 退款退货
import request from '@/utils/request';

const urls = {
  returnRefundReasonList: '/order/returnRefundReason/page', // 退款|换货|退货退款 原因分页列表 - get
  returnRefundReasonSave: '/order/returnRefundReason/save', // 添加 退款|换货|退货退款 原因 - post
  returnRefundReasonUpdate: '/order/returnRefundReason/update', // 修改 退款|换货|退货退款 原因 - post
  returnRefundReasonDelete: '/order/returnRefundReason/delete', // 删除 退款|换货|退货退款 原因 - post

  returnrefundPage: '/operation/order/returnrefund/page',       // 退款分页查询 - get
  returnrefundNum: '/operation/order/returnrefund/num',         // 退款状态数量 - get
  returnrefundHandler: 'operation/order/returnrefund/handler',  // 退款处理 - post
  returnrefundDetail: id => `operation/order/returnrefund/detail/${id}`,  // 查看详情 - get
  batchCheckRefund: '/operation/order/returnrefund/batchCheckRefund', // 批量审核 - post
}

export const returnRefundReasonList = data => request({url: urls.returnRefundReasonList, method: 'get', params: data});           // 退款|换货|退货退款 原因分页列表 - get
export const returnRefundReasonSave = data => request({url: urls.returnRefundReasonSave, method: 'post', data});                  // 添加 退款|换货|退货退款 原因 - post
export const returnRefundReasonUpdate = data => request({url: urls.returnRefundReasonUpdate, method: 'post', data});              // 修改 退款|换货|退货退款 原因 - post
export const returnRefundReasonDelete = data => request({url: urls.returnRefundReasonDelete, method: 'post', data});              // 删除 退款|换货|退货退款 原因 - post

export const returnrefundPage = data => request({url: urls.returnrefundPage, method: 'get', params: data});           // 退款分页查询 - get
export const returnrefundNum = data => request({url: urls.returnrefundNum, method: 'get', params: data});           // 退款状态数量 - get
export const returnrefundDetail = id => request({url: urls.returnrefundDetail(id), method: 'get', params: null});           // 退款处理 - post
export const returnrefundHandler = data => request({url: urls.returnrefundHandler, method: 'post', data});              // 查看详情 - get
export const batchCheckRefund = data => request({url: urls.batchCheckRefund, method: 'post', data, timeout: 30000}); // 批量审核 - post
