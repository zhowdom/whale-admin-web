import request from '@/utils/request'

const urls = {
  addGivingCoupon: '/coupon/giving/add',                  // 新增赠送优惠券
  addCiteAddCoupon: '/coupon/reference/add',              // 新增引用优惠券
  memberSearch: '/member/auth/member/search',             // 实名会员搜索

  goodsList: '/goods/product/list',                       // 商品列表
  categoryTree: '/goods/category/tree',                   // 商品分类 - 无分页
  categoryList: '/goods/category/list',                   // 商品分类 - 分页
  sellerList: '/seller/list',                             // 供应商分页

  citePage: '/coupon/reference/page',                     // 引用-优惠券列表
  citeEnable: '/coupon/reference/update/enable',          // 引用-启用-停用优惠券
  citeDelete: '/coupon/reference/delete',                 // 引用-删除优惠券
  citeDetails: '/coupon/reference/details',               // 引用-优惠券详情（详情页面）
  citeEditDetails: '/coupon/reference/get',               // 引用-优惠券编辑页详情
  citeEditUpdate: '/coupon/reference/edit',               // 引用-优惠券编辑更新

  givingPage: '/coupon/giving/page',                      // 赠送-优惠券列表
  givingEnable: '/coupon/giving/update/enable',           // 赠送-启用-停用优惠券
  givingDelete: '/coupon/giving/delete',                  // 赠送-删除优惠券
  givingDetails: '/coupon/giving/details',                // 赠送-优惠券详情（详情页面）
  givingEditDetails: '/coupon/giving/get',                // 赠送-优惠券编辑页详情
  givingEditUpdate: '/coupon/giving/edit',                // 赠送-优惠券编辑更新

  goods500List: '/goods/product/page/list',               // 商品列表 500 条分页
  category500List: '/goods/category/page/list',           // 商品分类列表 500 条分页
  seller500List: '/seller/page/list',                     // 供应商列表 500 条分页

  citeList: '/coupon/reference/list',                     // 无门槛优惠券列表
  recordPage: '/coupon/record/page',                      // 引用/赠送-优惠券记录分页列表（详情页面）
}


export const addGivingCoupon = data => request({url: urls.addGivingCoupon, method: 'post', data});              // 新增赠送优惠券
export const addCiteAddCoupon = data => request({url: urls.addCiteAddCoupon, method: 'post', data});            // 新增引用优惠券

export const memberSearch = data => request({url: urls.memberSearch, method: 'get', params: data});             // 实名会员搜索
export const goodsList = data => request({url: urls.goodsList, method: 'get', params: data});                   // 商品列表
export const categoryTree = data => request({url: urls.categoryTree, method: 'get', params: data});             // 商品分类 - 无分页
export const categoryList = data => request({url: urls.categoryList, method: 'get', params: data});             // 商品分类 - 分页
export const sellerList = data => request({url: urls.sellerList, method: 'post', data});                        // 供应商分页


export const citePage = data => request({url: urls.citePage, method: 'get', params: data});                     // 引用-优惠券列表
export const citeEnable = data => request({url: urls.citeEnable, method: 'post', data});                        // 引用-启用-停用优惠券
export const citeDelete = data => request({url: urls.citeDelete, method: 'post', data});                        // 引用-删除优惠券
export const citeDetails = data => request({url: urls.citeDetails, method: 'get', params: data});               // 引用-优惠券详情（详情页面）
export const citeEditDetails = data => request({url: urls.citeEditDetails, method: 'get', params: data});       // 引用-优惠券编辑页详情
export const citeEditUpdate = data => request({url: urls.citeEditUpdate, method: 'post', data});                // 引用-优惠券编辑更新

export const givingPage = data => request({url: urls.givingPage, method: 'get', params: data});                 // 赠送-优惠券列表
export const givingEnable = data => request({url: urls.givingEnable, method: 'post', data});                    // 赠送-启用-停用优惠券
export const givingDelete = data => request({url: urls.givingDelete, method: 'post', data});                    // 赠送-删除优惠券
export const givingDetails = data => request({url: urls.givingDetails, method: 'get', params: data});           // 赠送-优惠券详情（详情页面）
export const givingEditDetails = data => request({url: urls.givingEditDetails, method: 'get', params: data});   // 赠送-优惠券编辑页详情
export const givingEditUpdate = data => request({url: urls.givingEditUpdate, method: 'post', data});            // 赠送-优惠券编辑更新

export const recordPage = data => request({url: urls.recordPage, method: 'get', params: data});                 // 引用/赠送-优惠券记录分页列表（详情页面）

export const goods500List = data => request({url: urls.goods500List, method: 'get', params: data});             // 商品列表 500 条分页
export const category500List = data => request({url: urls.category500List, method: 'get', params: data});       // 商品分类列表 500 条分页
export const seller500List = data => request({url: urls.seller500List, method: 'get', params: data});           // 供应商列表 500 条分页
export const citeList = data => request({url: urls.citeList, method: 'get', params: data});                     // 无门槛优惠券列表
