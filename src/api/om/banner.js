// banner 管理
import request from '@/utils/request'

const urls = {
  bannerPageList: '/operation/banner/bannerPage',              // banner分页列表
  bannerDelete: '/operation/banner/delete',                    // banner 删除
  bannerEdit: '/operation/banner/edit',                        // banner 编辑
  saveBanner: '/operation/banner/saveBanner',                  // 保存banner
  bannerDictCodes: '/operation/banner/dictCodes',              // 获取banner位置列表
  bannerDetail: '/operation/banner/frontData',                 // 获取标单详情
}


export const bannerPageList = data => request({url: urls.bannerPageList, method: 'post', data});                  // banner分页列表
export const bannerDelete = data => request({url: urls.bannerDelete, method: 'post', data});                      // banner 删除
export const bannerEdit = data => request({url: urls.bannerEdit, method: 'post', data});                          // banner 编辑
export const saveBanner = data => request({url: urls.saveBanner, method: 'post', data});                          // 保存banner
export const bannerDictCodes = data => request({url: urls.bannerDictCodes, method: 'get', params: data});         // 获取banner位置列表
export const bannerDetail = data => request({url: urls.bannerDetail, method: 'get', params: data});               // 获取banner详情
