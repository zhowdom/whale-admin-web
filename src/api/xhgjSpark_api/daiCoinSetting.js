// 星火国际-xhgjSpark web管理后台相关接口
import request from '@/utils/request'

/**
 * 
 * 代币配置
 */

// 代币列表
export function daiCoinSettingList(query) {
    return request({
        url: '/wallet/config/coin/list',
        method: 'get',
        params: query
    })
}

// 资金归集配置
export function cashsweepConfigPage(query) {
    return request({
        url: '/wallet/config/collect/page',
        method: 'get',
        params: query
    })
}

// 转账网络列表
export function transferList(query) {
    return request({
        url: '/wallet/config/network/list',
        method: 'get',
        params: query
    })
}

// 转账平台列表
export function transferListPlatform(query) {
    return request({
        url: '/wallet/config/platform/list',
        method: 'get',
        params: query
    })
}

// 资金归集配置编辑
export function cashsweepConfigModify(data) {
  return request({
    url: '/wallet/config/collect/modify',
    method: 'post',
    data: data
  })
}

// 链上账户列表
export function blockchainPage(query) {
    return request({
        url: '/wallet/member/blockchain/page',
        method: 'get',
        params: query
    })
}

// 账户归集记录列表
export function cashsweepConfigRecordPage(query) {
    return request({
        url: '/wallet/member/blockchain/capital/pooling/page',
        method: 'get',
        params: query
    })
}

// 批量归集
export function batchCashsweepModify(data) {
    return request({
      url: '/wallet/member/blockchain/capital/pooling/batch',
      method: 'post',
      data: data
    })
}

// 代币功能配置列表表头
export function tokensConfigList(query) {
    return request({
        url: '/wallet/coin/setting/func/list',
        method: 'get',
        params: query
    })
}

// 代币功能配置列表page
export function rechargeTransferList(query) {
    return request({
        url: '/wallet/coin/setting/selectList',
        method: 'get',
        params: query
    })
}

// 代币业务配置列表
export function coinServiceList(query) {
    return request({
        url: '/wallet/coin/setting/service/list',
        method: 'get',
        params: query
    })
}

// 代币功能编辑
export function editCoinSetting(data) {
    return request({
      url: '/wallet/coin/setting/update',
      method: 'post',
      data: data
    })
}

// 币分页查询
export function tokensConfigPage(query) {
    return request({
        url: '/wallet/coin/config/settings/page',
        method: 'get',
        params: query
    })
}

//  币修改
export function editTokensConfig(data) {
    return request({
      url: '/wallet/coin/config/settings/update',
      method: 'post',
      data: data
    })
}

// 币精度列表
export function scaleList(query) {
    return request({
        url: '/wallet/coin/config/settings/scaleList',
        method: 'get',
        params: query
    })
}

// 闪兑币种List
export function exchangeList(query) {
    return request({
        url: '/wallet/config/coin/list',
        method: 'get',
        params: query
    })
}

// 闪兑币对配置列表
export function exchangePage(query) {
    return request({
        url: '/wallet/exchange/rule/page',
        method: 'get',
        params: query
    })
}

//  新增闪兑币对配置
export function exchangeSave(data) {
    return request({
      url: '/wallet/exchange/rule/save',
      method: 'post',
      data: data
    })
}

//  修改闪兑币对配置
export function exchangeUpdate(data) {
    return request({
      url: '/wallet/exchange/rule/update',
      method: 'post',
      data: data
    })
}

//  启用关闭闪兑币对配置
export function exchangeChange(data) {
    return request({
      url: '/wallet/exchange/rule/status/change',
      method: 'post',
      data: data
    })
}

// 闪兑币种配置List
export function exchangeSettingList(query) {
    return request({
        url: '/wallet/exchange/setting/list',
        method: 'get',
        params: query
    })
}

// 闪兑币对配置列表
export function exchangeSettingPage(query) {
    return request({
        url: '/wallet/exchange/setting/page',
        method: 'get',
        params: query
    })
}

//  新增闪兑币对配置
export function exchangeSettingSave(data) {
    return request({
      url: '/wallet/exchange/setting/save',
      method: 'post',
      data: data
    })
}

//  修改闪兑币对配置
export function exchangeSettingUpdate(data) {
    return request({
      url: '/wallet/exchange/setting/update',
      method: 'post',
      data: data
    })
}

//  启用关闭闪兑币对配置
export function exchangeSettingChange(data) {
    return request({
      url: '/wallet/exchange/setting/status/change',
      method: 'post',
      data: data
    })
}

// 闪兑明细列表
export function flashCashDetailsPage(query) {
    return request({
        url: '/wallet/exchange/record/page',
        method: 'get',
        params: query
    })
}

// 兑换币对配置列表
export function exchangeCurrencyPage(query) {
    return request({
        url: '/wallet/convert/rule/page',
        method: 'get',
        params: query
    })
}

//  新增兑换币对配置
export function exchangeCurrencySave(data) {
    return request({
      url: '/wallet/convert/rule/save',
      method: 'post',
      data: data
    })
}

//  修改兑换币对配置
export function exchangeCurrencyUpdate(data) {
    return request({
      url: '/wallet/convert/rule/update',
      method: 'post',
      data: data
    })
}

//  启用关闭兑换币对配置
export function exchangeCurrencyChange(data) {
    return request({
      url: '/wallet/convert/rule/status/change',
      method: 'post',
      data: data
    })
}


// 兑换配置币种List
export function exchangeConfigList(query) {
    return request({
        url: '/wallet/convert/setting/list',
        method: 'get',
        params: query
    })
}

// 兑换配置列表
export function exchangeConfigPage(query) {
    return request({
        url: '/wallet/convert/setting/page',
        method: 'get',
        params: query
    })
}

//  新增兑换配置
export function exchangeConfigSave(data) {
    return request({
      url: '/wallet/convert/setting/save',
      method: 'post',
      data: data
    })
}

//  修改兑换配置
export function exchangeConfigUpdate(data) {
    return request({
      url: '/wallet/convert/setting/update',
      method: 'post',
      data: data
    })
}

//  启用关闭兑换配置
export function exchangeConfigChange(data) {
    return request({
      url: '/wallet/convert/setting/status/change',
      method: 'post',
      data: data
    })
}





// 区块链转账配置、提现配置分页查询
export function blockchainNewPage(query) {
    return request({
        url: '/wallet/coin/config/settings/cost/page',
        method: 'get',
        params: query
    })
}

//  区块链转账配置、提现配置新增
export function addDlockchain(data) {
    return request({
      url: '/wallet/coin/config/settings/cost/add',
      method: 'post',
      data: data
    })
}

//  区块链转账配置、提现配置编辑
export function editDlockchain(data) {
    return request({
      url: '/wallet/coin/config/settings/cost/update',
      method: 'post',
      data: data
    })
}

// 合约管理分页查询
export function contractManagePage(query) {
    return request({
        url: '/wallet/contract/page',
        method: 'get',
        params: query
    })
}

//  新增合约
export function addContractManage(data) {
    return request({
      url: '/wallet/contract/add',
      method: 'post',
      data: data
    })
}

//  编辑合约
export function editContractManage(data) {
    return request({
      url: '/wallet/contract/update',
      method: 'post',
      data: data
    })
}

// 平台转账配置分页查询
export function platformPage(query) {
    return request({
        url: '/wallet/platform/transfer/setting/page',
        method: 'get',
        params: query
    })
}

//  新增平台转账配置
export function addPlatform(data) {
    return request({
      url: '/wallet/platform/transfer/setting/save',
      method: 'post',
      data: data
    })
}

//  编辑平台转账配置
export function editPlatform(data) {
    return request({
      url: '/wallet/platform/transfer/setting/update',
      method: 'post',
      data: data
    })
}

//  变更状态-平台转账配置
export function changePlatform(data) {
    return request({
      url: '/wallet/platform/transfer/setting/status/change',
      method: 'post',
      data: data
    })
}

// 查询手机号列表
export function getPhone(query) {
    return request({
        url: '/wallet/coin/config/hot/list/phone',
        method: 'get',
        params: query
    })
}

// 订单类型清单
export function getOrderType(query) {
    return request({
        url: '/wallet/coin/userassets/orderType/list',
        method: 'get',
        params: query
    })
}
// 内部转账明细
export function insideTransferLog(query) {
    return request({
        url: '/wallet/platform/transfer/setting/record/page',
        method: 'get',
        params: query
    })
}
/**
 * 兑换任务赠送代币配置
 */
// 兑换任务赠送代币配置-分页
export function taskCouponsGiftCoin_list(query) {
	return request({
		url: '/task/coin/gift/list',
		method: 'get',
		params: query
	})
}
// 赠送代币模板-分页
export function giveDaiCoinTemp_list(query) {
	return request({
		url: '/coin/award/setting/page',
		method: 'get',
		params: query
	})
}
// 兑换任务赠送代币配置-增加
export function taskCouponsGiftCoin_add(data) {
	return request({
		url: '/task/coin/gift/add',
		method: 'post',
		data: data
	})
}
// 赠送代币模板-增加
export function giveDaiCoinTemp_add(data) {
	return request({
		url: '/coin/award/setting/add',
		method: 'post',
		data: data
	})
}
// 赠送代币模板-修改
export function giveDaiCoinTemp_alter(data) {
	return request({
		url: '/coin/award/setting/edit',
		method: 'post',
		data: data
	})
}
// 兑换任务赠送代币配置-修改
export function taskCouponsGiftCoin_alter(data) {
	return request({
		url: '/task/coin/gift/update',
		method: 'post',
		data: data
	})
}
// 兑换任务赠送代币配置-删除
export function taskCouponsGiftCoin_del(data) {
	return request({
		url: '/task/coin/gift/remove',
		method: 'post',
		data: data
	})
}
// 赠送代币模板-删除
export function giveDaiCoinTemp_del(query) {
	return request({
		url: '/coin/award/setting/delete',
		method: 'get',
		params: query
	})
}
// 兑换任务赠送代币配置-增加代币
export function taskCouponsGiftCoin_addCoin(data) {
	return request({
		url: '/wallet/coin/config/settings/add',
		method: 'post',
		data: data
	})
}
// 兑换任务赠送代币配置-分页
export function convertWalletExchangeDetailLog(query) {
	return request({
		url: '/wallet/convert/record/page',
		method: 'get',
		params: query
	})
}
// 针对用户配置-查询
export function forUserSet_set(data) {
	return request({
		url: '/task/coin/gift/setting/update',
		method: 'post',
		data: data
	})
}
// 针对用户配置-设置
export function forUserSet_list(query) {
	return request({
		url: '/task/coin/gift/setting',
		method: 'get',
		params: query
	})
}