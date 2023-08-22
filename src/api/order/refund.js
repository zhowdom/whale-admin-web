// 订单 - 退货申请处理
import request from '@/utils/request';

const urls = {
  statusNum: '/operation/returnRefundReturnItem/getTotalNum',        // 退货数量查询 - get
  pageList: '/operation/returnRefundReturnItem/listByPage',          // 退货分页查询 - get
  details: '/operation/returnRefundReturnItem/getDetails',           // 退货详情查询 - get
  audit: '/operation/returnRefundReturnItem/audit',                  // 审核 - post
  addressList: '/operation/returnRefundReturnItem/getDeliverAddressList', // 收货点列表 - get
  confirm: '/operation/returnRefundReturnItem/confirm',              // 确认收货 - post

  listByPage: '/operation/returnExchangeItem/listByPage',            // 换货分页查询 - get
  totalNum: '/operation/returnExchangeItem/getTotalNum',             // 数量查询 - get
  returnExchangeDeliverPage: '/operation/returnExchangeItem/returnExchangeItemDeliverPage', // 换货列表 - get
  returnExchangeDetails: '/operation/returnExchangeItem/returnExchangeItemDetails',   // 详情 - get
  batchDeliver: '/operation/returnExchangeItem/batchDeliver',         // 单个换货|批量换货 - post
}

export const statusNum = data => request({url: urls.statusNum, method: 'get', params: data});         // 退货数量查询 - get
export const pageList = data => request({url: urls.pageList, method: 'get', params: data});           // 退货分页查询 - get
export const details = data => request({url: urls.details, method: 'get', params: data});             // 退货详情查询 - get
export const audit = data => request({url: urls.audit, method: 'post', data});                 // 审核 - post
export const addressList = data => request({url: urls.addressList, method: 'get', params: data});     // 收货点列表 - get
export const confirm = data => request({url: urls.confirm, method: 'post', data});                 // 确认收货 - post

export const listByPage = data => request({url: urls.listByPage, method: 'get', params: data});       // 换货分页查询 - get
export const totalNum = data => request({url: urls.totalNum, method: 'get', params: data});           // 数量查询 - get
export const returnExchangeDeliverPage = data => request({url: urls.returnExchangeDeliverPage, method: 'get', params: data});     // 换货列表 - get
export const returnExchangeDetails = data => request({url: urls.returnExchangeDetails, method: 'get', params: data});     // 详情 - get
export const batchDeliver = data => request({url: urls.batchDeliver, method: 'post', data});          // 单个换货|批量换货 - post
