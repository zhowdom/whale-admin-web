// 星火国际-xhgjSpark web管理后台相关接口
import request from '@/utils/request'

/**
 * 
 * Banner管理
 */

// APP Banner位置展示配置列表
export function bannerConfigAppPage(query) {
    return request({
        url: '/banner/final/app/position/page',
        method: 'get',
        params: query
    })
}

// APP Banner位置展示下拉List
export function bannerConfigAppSelect(query) {
    return request({
        url: '/banner/final/app/position/list',
        method: 'get',
        params: query
    })
}

// DAPP Banner位置展示配置列表
export function bannerConfigDappPage(query) {
    return request({
        url: '/banner/final/dapp/position/page',
        method: 'get',
        params: query
    })
}

// DAPP Banner位置展示下拉List
export function bannerConfigDappSelect(query) {
    return request({
        url: '/banner/final/dapp/position/list',
        method: 'get',
        params: query
    })
}

// APP-DAPP 位置展示状态切换
export function changeBannerPosition(data) {
    return request({
        url: '/banner/final/position/status/change',
        method: 'post',
        data: data
    })
}

//APP-DAPP Banner配置分页列表
export function bannerConfigPage(query) {
    return request({
        url: '/banner/final/setting/page',
        method: 'get',
        params: query
    })
}

// APP-DAPP 新增Banner配置
export function addBannerConfig(data) {
    return request({
        url: '/banner/final/setting/save',
        method: 'post',
        data: data
    })
}

// APP-DAPP 编辑Banner配置
export function editBannerConfig(data) {
    return request({
        url: '/banner/final/setting/update',
        method: 'post',
        data: data
    })
}

// APP-DAPP 编辑Banner配置状态切换
export function changeBannerConfig(data) {
    return request({
        url: '/banner/final/setting/status/change',
        method: 'post',
        data: data
    })
}


// APP-DAPP 删除Banner配置
export function deleteBannerConfig(data) {
    return request({
        url: '/banner/final/setting/delete',
        method: 'post',
        data: data
    })
}

//DAPP Banner配置业务类型List
export function bizTypeList(query) {
    return request({
        url: '/banner/final/setting/biz/type/list',
        method: 'get',
        params: query
    })
}
/**
 * 广告位相关-banner配置及审核
 */
// bannner配置及审核-分页
export function adSetAudit_page(query) {
    return request({
        url: '/internal/ad/space/member/page',
        method: 'get',
        params: query
    })
}
// bannner配置及审核-审核
export function adSetAudit_audit(data) {
    return request({
        url: '/internal/ad/space/member/audit',
        method: 'post',
        data: data
    })
}
// bannner配置及审核-新增
export function adSetAudit_add(data) {
    return request({
        url: '/internal/ad/space/member/save',
        method: 'post',
        data: data
    })
}
// bannner配置及审核-编辑
export function adSetAudit_alter(data) {
    return request({
        url: '/internal/ad/space/member/update',
        method: 'post',
        data: data
    })
}
// bannner配置及审核-查看空档
export function adSetAudit_free(query) {
    return request({
        url: '/internal/ad/space/member/scheduling',
        method: 'get',
        params: query
    })
}
// bannner配置及审核-已购套餐
export function adSetAudit_buged(query) {
    return request({
        url: '/internal/ad/space/member/order/get',
        method: 'get',
        params: query
    })
}