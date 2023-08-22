// web管理后台相关接口
import request from '@/utils/request'

/**
 * 
 * 节点配置
 */

// 节点配置分页列表
export function nodeConfigPage(query) {
    return request({
        url: '/city/facilitator/node/setting/page',
        method: 'get',
        params: query
    })
}

// 新增节点配置
export function addNodeConfig(data) {
    return request({
        url: '/city/facilitator/node/setting/save',
        method: 'post',
        data: data
    })
}

// 编辑节点配置
export function editNodeConfig(data) {
    return request({
        url: '/city/facilitator/node/setting/update',
        method: 'post',
        data: data
    })
}

// 节点配置状态切换
export function changeNodeConfig(data) {
    return request({
        url: '/city/facilitator/node/setting/change/status',
        method: 'post',
        data: data
    })
}

// 节点权益编辑
export function editEquityNodeConfig(data) {
    return request({
        url: '/city/facilitator/node/setting/equity',
        method: 'post',
        data: data
    })
}

// 一键开启配置
export function changeAllConfigEnable(data) {
    return request({
        url: '/city/facilitator/node/setting/enable',
        method: 'post',
        data: data
    })
}

// 一键关闭配置
export function changeAllConfigDisable(data) {
    return request({
        url: '/city/facilitator/node/setting/disable',
        method: 'post',
        data: data
    })
}

// 节点奖励包配置分页
export function rewardPackagePage(query) {
    return request({
        url: '/task/node/reward/page',
        method: 'get',
        params: query
    })
}

// 编辑节点奖励包配置
export function editRewardPackage(data) {
    return request({
        url: '/task/node/reward/update',
        method: 'post',
        data: data
    })
}

// 节点奖励分页列表
export function rewardPage(query) {
    return request({
        url: '/task/node/setting/reward/page',
        method: 'get',
        params: query
    })
}

// 编辑节点奖励
export function editReward(data) {
    return request({
        url: '/task/node/setting/reward/update',
        method: 'post',
        data: data
    })
}

// 节点权益分页列表
export function nodeEquityPage(query) {
    return request({
        url: '/task/node/setting/equity/page',
        method: 'get',
        params: query
    })
}

// 编辑节点权益
export function editNodeEquity(data) {
    return request({
        url: '/task/node/setting/equity/update',
        method: 'post',
        data: data
    })
}


// 节点奖励状态、权益切换
export function changeNodeEquityReward(data) {
    return request({
        url: '/task/node/setting/status/change',
        method: 'post',
        data: data
    })
}

// 奖励包数据List
export function rewardList(query) {
    return request({
        url: '/task/node/reward/list',
        method: 'get',
        params: query
    })
}

// 星级类型清单
export function asteriskTypes(data) {
    return request({
        url: '/asterisk/types',
        method: 'post',
        data: data
    })
}