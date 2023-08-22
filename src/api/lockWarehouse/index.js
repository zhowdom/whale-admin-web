import request from '@/utils/request'
/**
 * 
 * ************************
 * @@锁仓挖矿配置@@
 * ************************
 * 
 */
// 查询币种锁仓释放明细
export function coinLockList(query) {
  return request({
    url: '/coin/lock/release/record/page',
    method: 'get',
    params: query
  })
}

// 查询币种锁仓释放明细 统计
export function coinLockStatistics(query) {
  return request({
    url: '/coin/lock/release/record/statistics',
    method: 'get',
    params: query
  })
}

// 查询 币种锁仓释放 列表
export function lockSetList(query) {
  return request({
    url: '/coin/lock/release/conf/list',
    method: 'get',
    params: query
  })
}


// JDT明细-豆腐块
export function jdtDetailToufu(query) {
  return request({
    url: '/jdt/record/statistics',
    method: 'get',
    params: query
  })
}
// 编辑 币种锁仓释放
export function lockSetMdf(data) {
  return request({
    url: '/coin/lock/release/conf/update',
    method: 'post',
    data
  })
}
// 新增 币种锁仓释放
export function lockSetAdd(data) {
  return request({
    url: '/coin/lock/release/conf/add',
    method: 'post',
    data
  })
}
// JDT配置-详情
export function jdtSetInfo(query) {
  return request({
    url: '/blindBox/jdt/conf/get',
    method: 'get',
    params: query
  })
}
