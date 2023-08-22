// supplier 供应商
import axios from 'axios';
import request from '@/utils/request';

const urls = {
  templs: '/goods/shipping/template/list',                        // 获取我所有的运费模版 - get（分页）
  templsAll: '/goods/shipping/template/all',                      // 获取我所有的运费模版 - get（不分页）
  templDel: '/goods/shipping/template/delete',                    // 删除运费模板 - post
  templDetail: '/goods/shipping/template/detail',                 // 运费模版详情 - get
  templEdit: '/goods/shipping/template/update',                   // 编辑运费模版 - post
  templSave: '/goods/shipping/template/save',                     // 保存运费模版 - post

  paramsList: '/goods/params/list',         // 商品参数分页列表 - get
  paramsDelete: '/goods/params/delete',     // 删除商品参数 - post
  paramsSave: '/goods/params/save',         // 添加商品参数 - post
  paramsUpdate: '/goods/params/update',     // 修改商品参数 - post
  paramsDetail: '/goods/params/detail',     // 根据条件查询商品参数列表 - get
  noPageCategory: '/goods/category/all',    // 商品分类List(无分页) - get
  categoryTree: '/goods/category/tree',     // 商品父子分类Tree - get
  attrByCateId: '/goods/attribute/relation',// 根据分类id查询商品属性类型 - get
  attributeItem: '/goods/attribute/item',   // 根据属性类型获取属性规格 - get
  productSave: '/goods/product/save',       // 新建商品 - post
  productEdit: '/goods/product/update',     // 编辑商品 - post
  productDetail: '/goods/product/detail',   // 商品详情 - get
}

export const templs = data => request({url: urls.templs, method: 'get', params: data});                     // 获取我所有的运费模版 - get (分页)
export const templsAll = data => request({url: urls.templsAll, method: 'get', params: data});               // 获取我所有的运费模版 - get （不分页）
export const templDel = data => request({url: urls.templDel, method: 'post', data});                        // 删除模板 - post
export const templDetail = data => request({url: urls.templDetail, method: 'get', params: data});           // 运费模版详情 - get
export const templEdit = data => request({url: urls.templEdit, method: 'post', data});                      // 编辑运费模版 - post
export const templSave = data => request({url: urls.templSave, method: 'post', data});                      // 保存运费模版 - post

export const paramsList = data => request({url: urls.paramsList, method: 'get', params: data}); // 商品参数分页列表 - get
export const paramsDelete = data => request({url: urls.paramsDelete, method: 'post', data}); // 删除商品参数 - post
export const paramsSave = data => request({url: urls.paramsSave, method: 'post', data}); // 添加商品参数 - post
export const paramsUpdate = data => request({url: urls.paramsUpdate, method: 'post', data}); // 修改商品参数 - post
export const paramsDetail = data => request({url: urls.paramsDetail, method: 'get', params: data}); // 根据条件查询商品参数列表 - get
export const noPageCategory = data => request({url: urls.noPageCategory, method: 'get', params: data}); // 商品分类List(无分页) - get
export const categoryTree = data => request({url: urls.categoryTree, method: 'get', params: data}); // 商品父子分类Tree - get
export const attrByCateId = data => request({url: urls.attrByCateId, method: 'get', params: data}); // 根据分类id查询商品属性类型 - get
export const attributeItem = data => request({url: urls.attributeItem, method: 'get', params: data}); // 根据属性类型获取属性规格 - get
export const descHtml = url => axios({url, method: 'get', params: null});  // 特殊的获取商品描述html代码

export const productSave = data => request({url: urls.productSave, method: 'post', data});                      // 新建商品 - post
export const productEdit = data => request({url: urls.productEdit, method: 'post', data});                      // 编辑商品 - post
export const productDetail = data => request({url: urls.productDetail, method: 'get', params: data});           // 商品详情 - get
