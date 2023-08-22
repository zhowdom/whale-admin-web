// 星火国际-xhgjSpark web管理后台相关接口
import request from '@/utils/request'

/**
 * 
 * ++用户资产-3
 */

// 用户资产明细查询
export function xhgjSpark_userwealthList(data) {
  return request({
    url: '/whale-bcwallet/internal/wallet/coin/userassets/searchUserInfo',
    method: 'post',
    data: data
  })
}
// 用户资产汇总查询
export function xhgjSpark_userwealthTofu(query) {
  return request({
    url: '/whale-bcwallet/internal/wallet/coin/userassets/totalAssets',
    method: 'get',
    params: query
  })
}

/**
 * 
 * ++代币相关配置-6
 */

// USDT提现配置查询
export function xhgjSpark_usdtQuery(data) {
  return request({
    url: '/wallet/coin/config/settings/queryWithdrawSettings',
    method: 'post',
    data: data
  })
}
// USDT提现配置保存
export function xhgjSpark_usdtSave(data) {
  return request({
    url: '/wallet/coin/config/settings/editWithdrawSettings',
    method: 'post',
    data: data
  })
}
// 转账网络配置查询
export function xhgjSpark_transferNetQuery(query) {
  return request({
    url: '/wallet/coin/config/settings/listTransactionNetwork',
    method: 'get',
    params: query
  })
}
// 转账网络配置保存
export function xhgjSpark_transferNetSave(data) {
  return request({
    url: '/wallet/coin/config/settings/updateTransactionNetwork',
    method: 'post',
    data: data
  })
}
/**
 * 
 * ++平台钱包-5
 */

// 平台钱包-查询
export function xhgjSpark_walletQuery(query) {
  return request({
    url: '/whale-bcwallet/internal/wallet/coin/config/hot/list',
    method: 'get',
    params: query
  })
}
// 平台钱包-新增钱包
export function xhgjSpark_walletAdd(data) {
  return request({
    url: '/whale-bcwallet/internal/wallet/coin/config/hot/save',
    method: 'post',
    data: data
  })
}
// 平台钱包-删除
export function xhgjSpark_walletDel(query) {
  return request({
    url: '/whale-bcwallet/internal/wallet/coin/config/hot/delete',
    method: 'get',
    params: query
  })
}
// 平台钱包-状态更改
export function xhgjSpark_walletStatusSet(data) {
  return request({
    url: '/whale-bcwallet/internal/wallet/coin/config/hot/enable',
    method: 'post',
    data: data
  })
}
// 平台钱包-查询合约信息（待zb确认用途）
export function xhgjSpark_walletlistContract(data) {
  return request({
    url: '/whale-bcwallet/internal/wallet/coin/config/hot/listContract',
    method: 'post',
    data: data
  })
}
/**
 * 3/30接口对接
 * 平台钱包模块
 */
// 查询列表--按钮：已充值点击刷新
export function xhgjSpark_platWalletRefresh(data) {
  return request({
    url: '/wallet/coin/config/hot/recoverWalletStatus',
    method: 'post',
    data: data
  })
}
// 查询列表
export function xhgjSpark_platWalletList(data) {
  return request({
    url: '/wallet/coin/config/hot/list',
    method: 'post',
    data: data
  })
}
// 新增
export function xhgjSpark_platWalletAdd(data) {
  return request({
    url: '/wallet/coin/config/hot/save',
    method: 'post',
    data: data
  })
}

// 删除
export function xhgjSpark_platWalletDel(data) {
  return request({
    url: '/wallet/coin/config/hot/delete',
    method: 'post',
    data: data
  })
}
// 状态更改启用、禁用前校验
export function xhgjSpark_platWalletSwitchValid(data) {
  return request({
    url: '/wallet/coin/config/hot/checkEnable',
    method: 'post',
    data: data
  })
}

// 状态更改启用、禁用
export function xhgjSpark_platWalletSwitch(data) {
  return request({
    url: '/wallet/coin/config/hot/enable',
    method: 'post',
    data: data
  })
}

// 代币下拉种类集合
export function xhgjSpark_platWalletDaiCoinMaps(data) {
  return request({
    url: '/wallet/coin/config/hot/listContract',
    method: 'post',
    data: data
  })
}

// 代币下拉种类集合
export function xhgjSpark_platWalletSendCode(query) {
  return request({
    url: '/wallet/coin/config/hot/sendCode',
    method: 'get',
    params: query
  })
}
/**
 * 充提明细模块(拆分成2个页面（体现明细、充值明细）)
 */
// 充值列表
export function cgQuery(data) {
  return request({
    url: '/wallet/coin/transaction/recharge/page',
    method: 'post',
    data: data
  })
}
// 提现列表
export function txQuery(data) {
  return request({
    url: '/wallet/coin/transaction/withdraw/page',
    method: 'post',
    data: data
  })
}
// 提现统计豆腐块
export function txQueryToufu(query) {
  return request({
    url: '/wallet/coin/transaction/withdraw/statistic',
    method: 'get',
    params: query
  })
}
/**
 * 充提明细模块
 */
// 查询列表
export function xhgjSpark_wdlist(data) {
  return request({
    url: '/wallet/coin/transaction/searchRechargeAndWithdrawInfo',
    method: 'post',
    data: data
  })
}
// 查询列表(提现失败记录模块)
export function xhgjSpark_wdlistv2(data) {
  return request({
    url: '/wallet/coin/transaction/waitConfirm/page',
    method: 'post',
    data: data
  })
}
// 链上已到账(提现失败记录模块)
export function widSuccess(data) {
  return request({
    url: '/wallet/coin/transaction/confirm',
    method: 'post',
    data: data
  })
}
// 重置状态(提现失败记录模块)
export function widFail(data) {
  return request({
    url: '/wallet/coin/transaction/fail/reset',
    method: 'post',
    data: data
  })
}
// 提现审核（注意zb说批量的审核目前没有做，先只接单个的审核）
export function xhgjSpark_audit(data) {
  return request({
    url: '/wallet/coin/transaction/audit',
    method: 'post',
    data: data
  })
}
// 提现审核（注意zb说批量的审核目前没有做，先只接单个的审核）
export function xhgjSpark_auditBatch(data) {
  return request({
    url: '/wallet/coin/transaction/batchAudit',
    method: 'post',
    data: data
  })
}
// 提现审核-发送验证码
export function xhgjSpark_auditCode(query) {
  return request({
    url: '/wallet/coin/transaction/sendAuditVerificationCode',
    method: 'get',
    params: query
  })
}
/**
 * 用户资产模块
 */
// 用户资产汇总-查询
export function xhgjSpark_userWealthTotalQuery(query) {
  return request({
    url: '/wallet/coin/userassets/totalAssets',
    method: 'get',
    params: query
  })
}

// 用户资产明细-查询
export function xhgjSpark_userWealthDetailQuery(data) {
  return request({
    url: '/wallet/coin/userassets/searchUserInfo',
    method: 'post',
    data: data
  })
}

// 用户资产明细-查看-豆腐块-查询
export function xhgjSpark_userWealthTofuInnerQuery(query) {
  return request({
    url: '/wallet/coin/userassets/totalBalance',
    method: 'get',
    params: query
  })
}
// 用户资产明细-查看-列表-查询
export function xhgjSpark_userWealthDetailInnerQuery(data) {
  return request({
    url: '/wallet/coin/userassets/userOrderRecord',
    method: 'post',
    data: data
  })
}
/**
 * 国外定位配置模块
 */

// 国家列表下拉数据查询
export function xhgjSpark_fpCountrySelectQuery(query) {
  return request({
    url: '/abroad/district/options',
    method: 'get',
    params: query
  })
}
// 国家列表新增开启
export function xhgjSpark_fpCountryNewOpen(data) {
  return request({
    url: '/abroad/district/country/enable',
    method: 'post',
    data
  })
}
// 国家列表分页数据查询
export function xhgjSpark_fpCountryListQuery(query) {
  return request({
    url: '/abroad/district/country/page',
    method: 'get',
    params: query
  })
}
// 国家列表状态更改
export function xhgjSpark_fpCountryStatusAlter(data) {
  return request({
    url: '/abroad/district/country/status/change',
    method: 'post',
    data
  })
}
// 区县列表分页数据查询
export function xhgjSpark_fpCityListQuery(query) {
  return request({
    url: '/abroad/district/area/page',
    method: 'get',
    params: query
  })
}
// 区县列表新增
export function xhgjSpark_fpCityListAdd(data) {
  return request({
    url: '/abroad/district/area/save',
    method: 'post',
    data
  })
}
// 区县列表状态修改
export function xhgjSpark_fpCityListAlter(data) {
  return request({
    url: '/abroad/district/area/update',
    method: 'post',
    data
  })
}
// 区县下拉数据
export function xhgjSpark_fpCitySelectQuery(query) {
  return request({
    url: '/abroad/district/area/options',
    method: 'get',
    params: query
  })
}
// 区县编辑详情
export function xhgjSpark_fpCityDetails(query) {
  return request({
    url: '/abroad/district/area/detail',
    method: 'get',
    params: query
  })
}