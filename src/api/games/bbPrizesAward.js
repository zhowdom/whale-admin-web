// 盲盒奖品发放
import request from '@/utils/request';

const urls = {
  list: '/blindBox/distribution/listByPage',                              // 分页查询 - get
  itemInfo: '/blindBox/distribution/itemInfo',                            // 盲盒实物信息 - get
  detail: '/blindBox/distribution/getById',                               // 详情 - get
  exportExcel: '/blindBox/distribution/exportExcel',                      // 导出 - get
  batchList: '/blindBox/distribution/batchListByPage',                    // 批量发货列表 - get
  batchAdd: '/blindBox/distribution/batchAddLogisticsNum',                // 批量添加快递单号 - post
  addLogNum: '/blindBox/distribution/addLogisticsNum',                    // 添加快递单号 - post
  addAddress: '/blindBox/distribution/addAddress',                        // 添加收货地址|编辑 - post
}

export const list = data => request({url: urls.list, method: 'get', params: data});                           // 分页查询 - get
export const itemInfo = data => request({url: urls.itemInfo, method: 'get', params: data});                   // 盲盒实物信息 - get
export const detail = data => request({url: urls.detail, method: 'get', params: data});                       // 详情 - get
export const batchList = data => request({url: urls.batchList, method: 'get', params: data});                 // 批量发货列表 - get
export const batchAdd = data => request({url: urls.batchAdd, method: 'post', data});                          // 批量添加快递单号 - post
export const exportExcel = data => request({url: urls.exportExcel, method: 'get', params: data, responseType: 'blob', timeout: 300000,});   // 导出 - get
export const addLogNum = data => request({url: urls.addLogNum, method: 'post', data});                        // 添加快递单号 - post
export const addAddress = data => request({url: urls.addAddress, method: 'post', data});                      // 添加收货地址|编辑 - post
