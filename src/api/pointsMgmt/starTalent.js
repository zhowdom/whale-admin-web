// 星级达人管理
import request from '@/utils/request'

const urls = {
  benefitList: '/asterisk/list/benefit',              // 星级权益配置清单
  expertList: '/asterisk/list/expert',                // 星级成长配置清单
  saveBenefit: '/asterisk/save/benefit',              // 保存权益配置
  saveExpert: '/asterisk/save/expert',                // 保存成长配置
  updateBenefit: '/asterisk/update/benefit',          // 更新权益配置
  updateExpert: '/asterisk/update/expert',            // 更新成长配置
  asteriskTypes:'/asterisk/types',                    // 星级类型清单
}


export const benefitList = () => request({url: urls.benefitList, method: 'get'});               // 星级权益配置清单
export const expertList = data => request({url: urls.expertList, method: 'get', params: data});  // 星级成长配置清单
export const saveBenefit = data => request({url: urls.saveBenefit, method: 'post', data});        // 保存权益配置
export const saveExpert = data => request({url: urls.saveExpert, method: 'post', data});         // 保存成长配置
export const updateBenefit = data => request({url: urls.updateBenefit, method: 'post', data});      // 更新权益配置
export const updateExpert = data => request({url: urls.updateExpert, method: 'post', data});       // 更新成长配置
export const asteriskTypes = data => request({url: urls.asteriskTypes, method: 'post', data});      // 星级类型清单
