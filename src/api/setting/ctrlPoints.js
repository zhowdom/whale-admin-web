// 盲盒管制
import request from '@/utils/request';

const urls = {
  settingList: '/blindbox/control/reward/setting/list',                                    // 列表 - get
  settingSaveOrUpdate: '/blindbox/control/reward/setting/saveOrUpdate',                    // 修改或者添加 - post
  settingEnabled: '/blindbox/control/reward/setting/enabled',                              // 停用或者启用 - post
}


export const settingList = data => request({url: urls.settingList, method: 'get', params: data});                       // 列表 - get
export const settingSaveOrUpdate = data => request({url: urls.settingSaveOrUpdate, method: 'post', data});              // 修改或者添加 - post
export const settingEnabled = data => request({url: urls.settingEnabled, method: 'post', data});                        // 停用或者启用 - post
