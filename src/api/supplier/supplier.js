// supplier 供应商
import request from '@/utils/request';

const urls = {
  supplierAudit: '/sellerApply/audit',                            // 审核供应商 - post
  supplierDelete: '/sellerApply/delete',                          // 删除供应商审核记录 - post
  supplierDetail: '/sellerApply/detail',                          // 供应商审核详情 - get
  supplierAuditList: '/sellerApply/list',                         // 供应商审核分页 - post
  sellerDetail: '/seller/detail',                                 // 供应商详情 - post
  sellerList: '/seller/list',                                     // 供应商分页 - post
  sellerSave: '/seller/save',                                     // 新增供应商 - post
  sellerStatus: '/seller/seller/status',                          // 供应商禁用-启用 - post
  sellerAccountStatus: '/seller/sellerAccount/status',            // 供应商账号禁用-启用 - post

  auditList: '/goods/product/wait/audit/list',                    // 待审核商品列表 - get
  auditStatistics: '/goods/product/wait/audit/statistics',        // 待审核商品状态统计 - get
  productAudit: '/goods/product/audit',                           // 商品审核 - post
  auditHistory: '/goods/product/audit/history',                   // 商品审核记录 - get
  productDetail: '/goods/product/detail',                         // 商品详情信息 - get
  supplierList: '/goods/product/supplier',                        // 商品供应商列表List（不分页） - get
  productStatus: '/goods/product/status',                         // 商品状态列表 - get
  productSku: '/goods/product/sku',                               // 商品sku分页列表 - get
  templateAll: '/goods/shipping/template/all',                    // admin运费模板列表 - get
  recommend: '/goods/product/recommend',                          // 商品推荐列表List - get
  auditedList: '/goods/product/audited/list',                     // 供应商商品列表 - get
  auditedEdit: '/goods/product/audited/edit',                     // 供应商商品列表]商品编辑 - post
}


export const supplierAudit = data => request({url: urls.supplierAudit, method: 'post', data});                          // 供应商审核
export const supplierDelete = data => request({url: urls.supplierDelete, method: 'post', data});                        // 删除供应商审核记录
export const supplierAuditList = data => request({url: urls.supplierAuditList, method: 'post', data});                  // 供应商审核详情
export const supplierDetail = data => request({url: urls.supplierDetail, method: 'get', params: data});                 // 供应商审核分页

export const sellerDetail = data => request({url: urls.sellerDetail, method: 'post', data});                            // 供应商详情
export const sellerList = data => request({url: urls.sellerList, method: 'post', data});                                // 供应商分页
export const sellerSave = data => request({url: urls.sellerSave, method: 'post', data});                                // 新增供应商

export const sellerStatus = data => request({url: urls.sellerStatus, method: 'post', data});                            // 供应商禁用-启用
export const sellerAccountStatus = data => request({url: urls.sellerAccountStatus, method: 'post', data});              // 供应商账号禁用-启用

export const auditList = data => request({url: urls.auditList, method: 'get', params: data});                            // 待审核商品列表
export const auditStatistics = data => request({url: urls.auditStatistics, method: 'get', params: data});                // 待审核商品状态统计
export const productAudit = data => request({url: urls.productAudit, method: 'post', data});                             // 商品审核
export const auditHistory = data => request({url: urls.auditHistory, method: 'get', params: data});                      // 商品审核记录
export const productDetail = data => request({url: urls.productDetail, method: 'get', params: data});                    // 商品详情信息
export const supplierList = data => request({url: urls.supplierList, method: 'get', params: data});                      // 商品供应商列表List
export const productStatus = data => request({url: urls.productStatus, method: 'get', params: data});                    // 商品状态List
export const productSku = data => request({url: urls.productSku, method: 'get', params: data});                          // 商品sku分页列表
export const templateAll = data => request({url: urls.templateAll, method: 'get', params: data});                        // admin运费模板列表
export const recommend = data => request({url: urls.recommend, method: 'get', params: data});                            // 商品推荐列表List
export const auditedList = data => request({url: urls.auditedList, method: 'get', params: data});                        // 供应商商品列表
export const auditedEdit = data => request({url: urls.auditedEdit, method: 'post', data});                               // 供应商商品列表]商品编辑
