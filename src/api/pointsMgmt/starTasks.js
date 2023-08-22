// 星级达人任务管理
import request from '@/utils/request'

const urls = {
  taskInfo: '/task/info',                                       // 任务明细
  taskPage: '/task/page',                                       // 分页数据
  saveAsterisk: '/task/save/asterisk',                          // 新增星级任务
  saveFacilitator: '/task/save/facilitator',                    // 新增服务商任务
  savePrerogative: '/task/save/prerogative',                    // 新增特权任务
  saveStore: '/task/save/store',                                // 新增商店任务
  statusChange: '/task/status/change',                          // 商店兑换任务状态修改
  updateAsterisk: '/task/update/asterisk',                      // 修改星级任务
  updateFacilitator: '/task/update/facilitator',                // 修改服务商任务
  updatePrerogative: '/task/update/prerogative',                // 修改特权任务
  updateStore: '/task/update/store',                            // 修改商店任务
  changePrerogative: '/task/status/change/prerogative',         // 修改任务券状态
  saveVip: '/task/save/vip',                                    // 新增vip任务券
  updateVip: '/task/update/vip',                                // 修改VIP任务
  pageStore: '/task/page/store',                                // 商店任务分页数据
  modifyLog: '/task/modify/log',                                // 修改记录-任务id查询 - get
  taskNodeListQuery: '/task/node/list',                                // node数据List-(国际节点、一级节点、二级节点、三级节点等下拉数据查询) - get
  taskPageV2: '/task/node/page',                                       // node状态切换
  taskPageSwitch: '/task/node/status/change',                                       // 分页数据状态切换
  userAreaPhone: '/member/auth/member/phone/area',                                       // 手机区号列表
  apiEnableStatus_page: '/wallet/sys/interface/verify/page',                                       // 接口状态分页
  apiEnableStatus_status: '/wallet/sys/interface/verify/change',                                       // 接口状态更改
  apiEnableStatus_tips: '/wallet/sys/interface/verify/update',                                       // 接口状态提示语
  giveDaiCoin_page: '/vip/buy/give/page',                                       // 赠送代币配置-分页
  giveDaiCoin_add: '/vip/buy/give/save',                                       // 赠送代币配置-add
  giveDaiCoin_edit: '/vip/buy/give/update',                                       // 赠送代币配置-edit
  giveDaiCoin_del: '/vip/buy/give/delete',                                       // 赠送代币配置-del
  giveDaiCoin_status: '/vip/buy/give/change',                                       // 赠送代币配置-status
  giveDaiCoinVIP_page: '/vip/buy/give/list',                                       // VIP集合-下拉
  giveDaiCoinSelect_page: '/coin/award/setting/list',                                       // 代币配置奖励List-下来
}


export const taskInfo = data => request({url: urls.taskInfo, method: 'get', params: data});               // 任务明细
export const taskPage = data => request({url: urls.taskPage, method: 'get', params: data});               // 分页数据
export const saveAsterisk = data => request({url: urls.saveAsterisk, method: 'post', data});              // 新增星级任务
export const saveFacilitator = data => request({url: urls.saveFacilitator, method: 'post', data});        // 新增服务商任务
export const savePrerogative = data => request({url: urls.savePrerogative, method: 'post', data});        // 新增特权任务
export const saveStore = data => request({url: urls.saveStore, method: 'post', data});                    // 新增商店任务
export const statusChange = data => request({url: urls.statusChange, method: 'post', data});              // 商店兑换任务状态修改
export const updateAsterisk = data => request({url: urls.updateAsterisk, method: 'post', data});          // 修改星级任务
export const updateFacilitator = data => request({url: urls.updateFacilitator, method: 'post', data});    // 修改服务商任务
export const updatePrerogative = data => request({url: urls.updatePrerogative, method: 'post', data});    // 修改特权任务
export const updateStore = data => request({url: urls.updateStore, method: 'post', data});                // 修改商店任务
export const changePrerogative = data => request({url: urls.changePrerogative, method: 'post', data});    // 修改任务券状态
export const saveVip = data => request({url: urls.saveVip, method: 'post', data});                        // 新增vip任务券
export const updateVip = data => request({url: urls.updateVip, method: 'post', data});                    // 修改VIP任务
export const pageStore = data => request({url: urls.pageStore, method: 'get', params: data});             // 商店任务分页数据
export const modifyLog = data => request({url: urls.modifyLog, method: 'get', params: data});             // 修改记录-任务id查询
export const taskNodeListQuery = data => request({url: urls.taskNodeListQuery, method: 'get', params: data});             // 修改记录-任务id查询
export const taskPageV2 = data => request({url: urls.taskPageV2, method: 'get', params: data});             // 分页数据
export const userAreaPhone = data => request({url: urls.userAreaPhone, method: 'get', params: data});             // 手机区号列表
export const taskPageSwitch = data => request({url: urls.taskPageSwitch, method: 'post', data});                    // node状态切换
export const apiEnableStatus_page = data => request({url: urls.apiEnableStatus_page, method: 'get', params: data});             // 接口状态分页
export const apiEnableStatus_status = data => request({url: urls.apiEnableStatus_status, method: 'post', data});                    // 接口状态更改
export const apiEnableStatus_tips = data => request({url: urls.apiEnableStatus_tips, method: 'post', data});                    // 接口状态提示语
export const giveDaiCoin_page = data => request({url: urls.giveDaiCoin_page, method: 'get', params: data});             // 赠送代币配置-分页
export const giveDaiCoin_add = data => request({url: urls.giveDaiCoin_add, method: 'post', data});                    // 赠送代币配置-add
export const giveDaiCoin_edit = data => request({url: urls.giveDaiCoin_edit, method: 'post', data});                    // 赠送代币配置-edit
export const giveDaiCoin_del = data => request({url: urls.giveDaiCoin_del, method: 'post', data});                    // 赠送代币配置-del
export const giveDaiCoin_status = data => request({url: urls.giveDaiCoin_status, method: 'post', data});                    // 赠送代币配置-status
export const giveDaiCoinVIP_page = data => request({url: urls.giveDaiCoinVIP_page, method: 'get', params: data});             // VIP集合-下拉
export const giveDaiCoinSelect_page = data => request({url: urls.giveDaiCoinSelect_page, method: 'get', params: data});             // 代币配置奖励List-下来
