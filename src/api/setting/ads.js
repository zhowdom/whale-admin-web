// App 启动页、广告之类
import request from '@/utils/request';

const urls = {
  startPageQuery: '/setting/startPage/query',                                   // 获取app启动页配置 - get
  startPageUpdate: '/setting/startPage/update',                                 // 更新app启动页配置 - post

  advertPage: '/setting/advert/page', // app弹窗广告配置分页列表 - get
  advertDelete: '/setting/advert/delete', // 删除app弹窗广告配置 - post
  advertSave: '/setting/advert/save', // 新增app弹窗广告配置 - post
  advertUpdate: '/setting/advert/update', // 编辑app弹窗广告配置 - post
  advertDetail: '/setting/advert/get', // 查询弹窗广告详情 - get
}


export const startPageQuery = data => request({url: urls.startPageQuery, method: 'get', params: data});          // 获取app启动页配置 - get
export const startPageUpdate = data => request({url: urls.startPageUpdate, method: 'post', data});               // 更新app启动页配置 - post

export const advertPage = data => request({url: urls.advertPage, method: 'get', params: data});             // app弹窗广告配置分页列表 - get
export const advertDetail = data => request({url: urls.advertDetail, method: 'get', params: data});         // 查询弹窗广告详情 - get
export const advertDelete = data => request({url: urls.advertDelete, method: 'post', data});                // 删除app弹窗广告配置 - post
export const advertSave = data => request({url: urls.advertSave, method: 'post', data});                    // 新增app弹窗广告配置 - post
export const advertUpdate = data => request({url: urls.advertUpdate, method: 'post', data});                // 编辑app弹窗广告配置 - post
