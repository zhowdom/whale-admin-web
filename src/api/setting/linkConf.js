// 跳转链接配置
import request from '@/utils/request'

const urls = {
  del: '/setting/link/delete',                            // 跳转链接配置-删除 post
  page: '/setting/link/page',                                // 跳转链接配置-分页列表 get
  save: '/setting/link/save',                                // 跳转链接配置-新增 post
  change: '/setting/link/status/change',                     // 跳转链接配置-状态修改 post
  update: '/setting/link/update',                            // 跳转链接配置-编辑 post

  del_NFT: '/nft/setting/link/delete',                            // 跳转链接配置-删除 post(针对NFT模块区分)
  page_NFT: '/nft/setting/link/page',                                // 跳转链接配置-分页列表 get(针对NFT模块区分)
  save_NFT: '/nft/setting/link/save',                                // 跳转链接配置-新增 post(针对NFT模块区分)
  change_NFT: '/nft/setting/link/status/change',                     // 跳转链接配置-状态修改 post(针对NFT模块区分)
  update_NFT: '/nft/setting/link/update',                            // 跳转链接配置-编辑 post(针对NFT模块区分)


}


export const page = data => request({url: urls.page, method: 'get', params: data});          // 跳转链接配置-分页列表 get
export const save = data => request({url: urls.save, method: 'post', data});                 // 跳转链接配置-新增 post
export const del = data => request({url: urls.del, method: 'post', data});                    // 跳转链接配置-删除 post
export const update = data => request({url: urls.update, method: 'post', data});              // 跳转链接配置-编辑 post
export const change = data => request({url: urls.change, method: 'post', data});              // 跳转链接配置-状态修改 post

export const page_NFT = data => request({url: urls.page_NFT, method: 'get', params: data});          // 跳转链接配置-分页列表 get(针对NFT模块区分)
export const save_NFT = data => request({url: urls.save_NFT, method: 'post', data});                 // 跳转链接配置-新增 post(针对NFT模块区分)
export const del_NFT = data => request({url: urls.del_NFT, method: 'post', data});                    // 跳转链接配置-删除 post(针对NFT模块区分)
export const update_NFT = data => request({url: urls.update_NFT, method: 'post', data});              // 跳转链接配置-编辑 post(针对NFT模块区分)
export const change_NFT = data => request({url: urls.change_NFT, method: 'post', data});              // 跳转链接配置-状态修改 post(针对NFT模块区分)
