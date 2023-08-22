// 订单 - 发货点信息管理
import request from '@/utils/request';

const urls = {
  shippingPointList: '/operation/deliverAddressManager/page',                       // 发货点信息列表 - get
  shippingPointDel: '/operation/deliverAddressManager/del',                         // 删除发货点 - post
  shippingPointUpdate: '/operation/deliverAddressManager/inserOrUpdate',            // 新增/编辑发货点 - post
  shippingPointDetail: '/operation/deliverAddressManager/details',            // 发货点详情 - get
}

export const shippingPointList = data => request({url: urls.shippingPointList, method: 'get', params: data});          // 发货点信息列表 - get
export const shippingPointDel = data => request({url: urls.shippingPointDel, method: 'post', data});                   // 删除发货点 - post
export const shippingPointUpdate = data => request({url: urls.shippingPointUpdate, method: 'post', data});             // 新增/编辑发货点 - post
export const shippingPointDetail = data => request({url: urls.shippingPointDetail, method: 'get', params: data});      // 发货点详情 - get
