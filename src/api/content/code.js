// 提取码
import request from '@/utils/request'

const urls = {
  accessCodeInfo: '/content/accessCode',                                              // 提取码详情 get
  accessCodeSave: '/content/accessCode/save',                                         // 提取码保存 post
}


export const accessCodeInfo = data => request({url: urls.accessCodeInfo, method: 'get', params: data});          // 提取码详情
export const accessCodeSave = data => request({url: urls.accessCodeSave, method: 'post', data});                 // 提取码保存
