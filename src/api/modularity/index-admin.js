// 首页模块化
import request from '@/utils/request';

const urls = {
  // moduleCopy: '/setting/home/module/copy',                            // 模板复制 - post
  // moduleDetail: '/setting/home/module/detail',                        // 获取模板详情 - get
  // modulePage: '/setting/home/module/page',                            // 模板分页 - get
  // moduleRename: '/setting/home/module/rename',                        // 模板重命名 - post
  // moduleSave: '/setting/home/module/save',                            // 新增模板 - post
  // moduleStatusChange: '/setting/home/module/status/change',           // 模板启用禁用 - post
  // moduleUpdate: '/setting/home/module/update',                        // 模板编辑 - post
  // routeLinks: '/setting/link/route/group',                             // 获取路由名称列表 - get
  
  moduleCopy: '/nft/setting/home/module/copy',                            // 模板复制 - post(针对NFT模块区分)
  moduleDetail: '/nft/setting/home/module/detail',                        // 获取模板详情 - get(针对NFT模块区分)
  modulePage: '/nft/setting/home/module/page',                            // 模板分页 - get(针对NFT模块区分)√
  moduleRename: '/nft/setting/home/module/rename',                        // 模板重命名 - post(针对NFT模块区分)√
  moduleSave: '/nft/setting/home/module/save',                            // 新增模板 - post(针对NFT模块区分)√
  moduleStatusChange: '/nft/setting/home/module/status/change',           // 模板启用禁用 - post(针对NFT模块区分)
  moduleUpdate: '/nft/setting/home/module/update',                        // 模板编辑 - post(针对NFT模块区分)√
  routeLinks: '/nft/setting/link/route/group',                             // 获取路由名称列表 - get(针对NFT模块区分)√

  categoryTypeInfo: '/nft/series/category/detail',                      // 类别详情
  categoryListArr: '/nft/series/category/list',                      // 类别List列表
  nftSeriesInfo: '/nft/series/detail',                      // 系列详情
  nftSeriesList: '/nft/series/list',                      // 系列List列表
}

export const modulePage = data => request({url: urls.modulePage, method: 'get', params: data});             // 模板分页 - get
export const moduleCopy = data => request({url: urls.moduleCopy, method: 'post', data});                    // 模板复制 - post
export const moduleRename = data => request({url: urls.moduleRename, method: 'post', data});                // 模板重命名 - post
export const moduleStatusChange = data => request({url: urls.moduleStatusChange, method: 'post', data});    // 模板启用禁用 - post
export const moduleSave = data => request({url: urls.moduleSave, method: 'post', data});                    // 新增模板 - post
export const moduleUpdate = data => request({url: urls.moduleUpdate, method: 'post', data});                // 模板编辑 - post
export const moduleDetail = data => request({url: urls.moduleDetail, method: 'get', params: data});         // 获取模板详情 - get
export const routeLinks = data => request({url: urls.routeLinks, method: 'get', params: data});             // 获取路由名称列表 - get

export const categoryTypeInfo = data => request({url: urls.categoryTypeInfo, method: 'get', params: data});             // 类别详情
export const categoryListArr = data => request({url: urls.categoryListArr, method: 'get', params: data});             // 类别List列表
export const nftSeriesInfo = data => request({url: urls.nftSeriesInfo, method: 'get', params: data});             // 系列详情
export const nftSeriesList = data => request({url: urls.nftSeriesList, method: 'get', params: data});             // 系列List列表
