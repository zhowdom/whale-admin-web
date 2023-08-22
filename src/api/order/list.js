// 订单 - 订单列表
import axios from 'axios';
import request from '@/utils/request';

const urls = {
  orderStatisticToday: 'operation/order/today/statistics', // 今日订单统计查询
  orderStatisticPrevious: 'operation/order/previous/statistics', // 往期订单统计查询
  statusNum: '/operation/order/totalOrderStatusNum',        // 订单状态数据 - get
  orderList: '/operation/order/page',                       // 订单列表 - get
  orderInfo: '/operation/order/info',                       // 订单详情 - get
  deliverPage: '/operation/order/deliverPage',              // 发货列表 - get
  batchDeliver: '/operation/order/batchDeliver',            // 发货 - post
  orderExport: '/operation/order/export',                   // 订单导出 - get
  getLogisticsInfo: '/operation/order/getLogisticsInfo',    // 获取运单信息 - get
  updateLogisticsNum: 'operation/order/updateLogisticsNum', // 跟新运单号 - post
  batchRefund: '/operation/order/returnrefund/batchRefund', // 批量退款处理 - post
  getRefundReason: '/operation/order/returnrefund/getRefundReason',  // 退款原因 - get

  orderExpress: '/operation/order/express',                 // 查询物流信息 - get
}

export const orderStatisticToday = data => request({url: urls.orderStatisticToday, method: 'post', data});           // 今日订单统计查询 - get
export const orderStatisticPrevious = data => request({url: urls.orderStatisticPrevious, method: 'post', data});           // 往期订单统计查询 - get
export const statusNum = data => request({url: urls.statusNum, method: 'get', params: data});           // 订单状态数据 - get
export const orderList = data => request({url: urls.orderList, method: 'get', params: data});           // 订单列表 - post
export const orderInfo = data => request({url: urls.orderInfo, method: 'get', params: data});           // 订单详情 - post
export const deliverPage = data => request({url: urls.deliverPage, method: 'get', params: data});       // 发货列表 - get
export const batchDeliver = data => request({url: urls.batchDeliver, method: 'post', data});            // 发货 - post
export const orderExport = data => request({url: urls.orderExport, method: 'get', params: data, responseType: 'blob', timeout: 300000,});       // 订单导出 - get
export const getLogisticsInfo = data => request({url: urls.getLogisticsInfo, method: 'get', params: data});       // 获取运单信息 - get
export const updateLogisticsNum = data => request({url: urls.updateLogisticsNum, method: 'post', data});          // 跟新运单号 - post

export const orderExpress = data => request({url: urls.orderExpress, method: 'get', params: data});       // 查询物流信息 - get

export const batchRefund = data => request({url: urls.batchRefund, method: 'post', data, timeout: 30000}); // 批量退款处理 - post
export const getRefundReason = data => request({url: urls.getRefundReason, method: 'get', params: data});        // 批量原因 - get

