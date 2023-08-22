// 星火国际-xhgjSpark web管理后台相关接口
import request from '@/utils/request'

/**
 * 
 * DApp管理
 */

// DApp配置分页列表
export function dappConfigPage(query) {
    return request({
        url: '/setting/dapp/page',
        method: 'get',
        params: query
    })
}

// 新增DApp配置
export function addDappConfig(data) {
    return request({
        url: '/setting/dapp/save',
        method: 'post',
        data: data
    })
}

// 编辑DApp配置
export function editDappConfig(data) {
    return request({
        url: '/setting/dapp/update',
        method: 'post',
        data: data
    })
}

// DApp配置状态切换
export function changeDappConfig(data) {
    return request({
        url: '/setting/dapp/status/change',
        method: 'post',
        data: data
    })
}

// 删除DApp配置
export function deleteDappConfig(data) {
    return request({
        url: '/setting/dapp/delete',
        method: 'post',
        data: data
    })
}

// 生态Tab配置分页列表
export function ecologyTabPage(query) {
    return request({
        url: '/setting/ecology/tab/page',
        method: 'get',
        params: query
    })
}

// 新增生态Tab配置
export function addEcologyTab(data) {
    return request({
        url: '/setting/ecology/tab/save',
        method: 'post',
        data: data
    })
}

// 编辑生态Tab配置
export function editEcologyTab(data) {
    return request({
        url: '/setting/ecology/tab/update',
        method: 'post',
        data: data
    })
}

// 生态Tab配置状态切换
export function changeEcologyTab(data) {
    return request({
        url: '/setting/ecology/tab/status/change',
        method: 'post',
        data: data
    })
}

// 删除Tab配置
export function deleteEcologyTab(data) {
    return request({
        url: '/setting/ecology/tab/delete',
        method: 'post',
        data: data
    })
}

// 生态Tab配置List
export function ecologyTabList(query) {
    return request({
        url: '/setting/ecology/tab/list',
        method: 'get',
        params: query
    })
}

// 生态内容配置分页列表
export function ecologyContentPage(query) {
    return request({
        url: '/setting/ecology/content/page',
        method: 'get',
        params: query
    })
}

// 新增生态Tab配置
export function addEcologyContent(data) {
    return request({
        url: '/setting/ecology/content/save',
        method: 'post',
        data: data
    })
}

// 编辑生态Tab配置
export function editEcologyContent(data) {
    return request({
        url: '/setting/ecology/content/update',
        method: 'post',
        data: data
    })
}

// 生态Tab配置状态切换
export function changeEcologyContent(data) {
    return request({
        url: '/setting/ecology/content/status/change',
        method: 'post',
        data: data
    })
}

// 删除Tab配置
export function deleteEcologyContent(data) {
    return request({
        url: '/setting/ecology/content/delete',
        method: 'post',
        data: data
    })
}


// 热门搜索配置分页列表
export function popularSearchPage(query) {
    return request({
        url: '/setting/ecology/hot/search/page',
        method: 'get',
        params: query
    })
}

// 新增热门搜索配置
export function addOPularSearch(data) {
    return request({
        url: '/setting/ecology/hot/search/save',
        method: 'post',
        data: data
    })
}

// 编辑热门搜索配置
export function editPularSearch(data) {
    return request({
        url: '/setting/ecology/hot/search/update',
        method: 'post',
        data: data
    })
}

// 热门搜索配置状态切换
export function changePularSearch(data) {
    return request({
        url: '/setting/ecology/hot/search/status/change',
        method: 'post',
        data: data
    })
}

// 删除热门搜索配置
export function deletePularSearch(data) {
    return request({
        url: 'setting/ecology/hot/search/delete',
        method: 'post',
        data: data
    })
}

// 热门搜索选择DAPP列表
export function ecologyList(query) {
    return request({
        url: '/setting/ecology/hot/search/list',
        method: 'get',
        params: query
    })
}
// DAPP配置-权限修改=setting:dapp_auth:change
export function dappPermissionAlter(data) {
    return request({
        url: '/setting/dapp/auth/change',
        method: 'post',
        data: data
    })
}
// 生态Ttab配置-权限修改=setting:ecology_tab_auth:change
export function dappPermissionAlter_tab(data) {
    return request({
        url: '/setting/ecology/tab/auth/change',
        method: 'post',
        data: data
    })
}
// 生态内容配置-权限修改=setting:ecology_content_auth:change
export function dappPermissionAlter_content(data) {
    return request({
        url: '/setting/ecology/content/auth/change',
        method: 'post',
        data: data
    })
}
