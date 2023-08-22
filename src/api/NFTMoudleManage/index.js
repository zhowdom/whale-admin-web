import request from '@/utils/request'

// NFT-用户列表
export function nft_userlist(query) {
  return request({
    url: '/nft/member/list',
    method: 'get',
    params: query
  })
}
// NFT-用户列表
export function nft_projectStaticlist(query) {
  return request({
    url: '/nft/member/project/static/page',
    method: 'get',
    params: query
  })
}
// NFT-平台收益汇总
export function nft_platfromStatic(query) {
  return request({
    url: '/nft/platform/earning/total',
    method: 'get',
    params: query
  })
}
// NFT-平台收益明细
export function nft_platfromDetail(query) {
  return request({
    url: '/nft/platform/earning/page',
    method: 'get',
    params: query
  })
}
// NFT-用户收益分页
export function nft_userDetail(query) {
  return request({
    url: '/nft/member/earning/page',
    method: 'get',
    params: query
  })
}
// NFT-用户收益明细分页
export function nft_userDetailIn(query) {
  return request({
    url: '/nft/member/earning/record/page',
    method: 'get',
    params: query
  })
}
// NFT-多语言列表
export function nft_lanList(query) {
  return request({
    url: '/language/setting/list',
    method: 'get',
    params: query
  })
}
// NFT-多语言列表-排序
export function nft_lanSort(data) {
  return request({
    url: '/language/setting/sort/change',
    method: 'post',
    data: data
  })
}
// NFT-多语言列表-启用
export function nft_lanEnable(data) {
  return request({
    url: '/language/setting/status/change',
    method: 'post',
    data: data
  })
}
// NFT-系列类别--类别下拉
export function nft_seriesTypeSelect(query) {
  return request({
    url: '/nft/series/category/list',
    method: 'get',
    params: query
  })
}
// NFT-系列类别--分页
export function nft_seriesTypePage(query) {
  return request({
    url: '/nft/series/category/page',
    method: 'get',
    params: query
  })
}
// NFT-系列类别--新增
export function nft_seriesTypeAdd(data) {
  return request({
    url: '/nft/series/category/save',
    method: 'post',
    data: data
  })
}
// NFT-系列类别--编辑
export function nft_seriesTypeEdit(data) {
  return request({
    url: '/nft/series/category/update',
    method: 'post',
    data: data
  })
}
// NFT-系列类别--状态
export function nft_seriesTypeStatus(data) {
  return request({
    url: '/nft/series/category/status/change',
    method: 'post',
    data: data
  })
}
// NFT-系列管理--分页
export function nft_seriesManagePage(query) {
  return request({
    url: '/nft/series/page',
    method: 'get',
    params: query
  })
}
// NFT-系列管理--状态
export function nft_seriesManageInfo(query) {
  return request({
    url: '/nft/series/detail',
    method: 'get',
    params: query
  })
}
// NFT-热门系列状态切换
export function nft_changePopular(data) {
  return request({
    url: '/nft/series/popular/change',
    method: 'post',
    data: data
  })
}
export function nft_projectPage(query) {
  return request({
    url: '/nft/series/project/page',
    method: 'get',
    params: query
  })
}
export function nft_projectRecordPage(query) {
  return request({
    url: '/nft/series/project/record/page',
    method: 'get',
    params: query
  })
}
// NFT-合约管理-网络配置-分页-nft_contractNet_page
export function nft_contractNet_page(query) {
  return request({
    url: '/nft/chain/network/page',
    method: 'get',
    params: query
  })
}
// NFT-合约管理-网络配置-修改-nft_contractNet_alter
export function nft_contractNet_alter(data) {
  return request({
    url: '/nft/chain/network/update',
    method: 'post',
    data: data
  })
}
// NFT-合约管理-网络配置-新增-nft_contractNet_add
export function nft_contractNet_add(data) {
  return request({
    url: '/nft/chain/network/save',
    method: 'post',
    data: data
  })
}
// NFT-合约管理-代币配置-分页-nft_contractCoin_page
export function nft_contractCoin_page(query) {
  return request({
    url: '/nft/currency/page',
    method: 'get',
    params: query
  })
}
// NFT-合约管理-代币配置-新增-nft_contractCoin_add
export function nft_contractCoin_add(data) {
  return request({
    url: '/nft/currency/save',
    method: 'post',
    data: data
  })
}
// NFT-合约管理-代币配置-修改-nft_contractCoin_alter
export function nft_contractCoin_alter(data) {
  return request({
    url: '/nft/currency/update',
    method: 'post',
    data: data
  })
}
// NFT-合约管理-代币配置-网络名称下拉集合-nft_contractNetname_list
export function nft_contractNetname_list(query) {
  return request({
    url: '/nft/chain/network/list',
    method: 'get',
    params: query
  })
}
// NFT-代币列表下拉
export function nft_daiCoinSettingList(query) {
  return request({
    url: '/nft/currency/list/symbol',
    method: 'get',
    params: query
  })
}