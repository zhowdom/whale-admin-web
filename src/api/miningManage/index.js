import request from '@/utils/request'
/**
 * 
 * ************************
 * @@挖矿@@
 * ************************
 * 
 */
// 挖矿类型配置分页-查询
export function miningConfigPage(query) {
  return request({
    url: '/wallet/mining/conf/page',
    method: 'get',
    params: query
  })
}

//挖矿类型配置-新增
export function miningConfigAdd(data) {
  return request({
    url: '/wallet/mining/conf/add',
    method: 'post',
    data: data
  })
}

//挖矿类型配置-修改
export function miningConfigTypeEdit(data) {
  return request({
    url: '/wallet/mining/conf/edit',
    method: 'post',
    data: data
  })
}

//挖矿类型配置-切换
export function miningConfigChange(data) {
  return request({
    url: '/wallet/mining/conf/edit/status',
    method: 'post',
    data: data
  })
}

// 挖矿收益配置分页-查询
export function miningProfitPage(query) {
  return request({
    url: '/wallet/mining/conf/item/page',
    method: 'get',
    params: query
  })
}

//挖矿收益配置-修改
export function miningConfigEdit(data) {
  return request({
    url: '/wallet/mining/conf/earning/edit',
    method: 'post',
    data: data
  })
}

// 挖矿记录分页-查询
export function miningRecordPage(query) {
  return request({
    url: '/wallet/mining/record/page',
    method: 'get',
    params: query
  })
}

// 挖矿详情
export function miningDetails(query) {
  return request({
    url: '/wallet/mining/conf/details',
    method: 'get',
    params: query
  })
}

//启用-停用 币种质押
export function pledgeStatus(data) {
  return request({
    url: '/wallet/mining/conf/edit/pledgeStatus',
    method: 'post',
    data: data
  })
}

//启用-停用 币种收割
export function harvestStatus(data) {
  return request({
    url: '/wallet/mining/conf/edit/harvestStatus',
    method: 'post',
    data: data
  })
}