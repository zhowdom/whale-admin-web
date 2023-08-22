
// web管理后台相关接口
import request from '@/utils/request'

// 菜单-tree数据
export function manualTreePage(query) {
    return request({
        url: '/setting/problem/manual/tree',
        method: 'get',
        params: query
    })
}

// 菜单-新增
export function addManual(data) {
    return request({
        url: '/setting/problem/manual/save',
        method: 'post',
        data: data
    })
}

// 编辑菜单
export function editManual(data) {
    return request({
        url: '/setting/problem/manual/update',
        method: 'post',
        data: data
    })
}

// 菜单开关切换
export function changeManual(data) {
    return request({
        url: '/setting/problem/manual/status/change',
        method: 'post',
        data: data
    })
}

// 删除菜单
export function deleteManual(data) {
    return request({
        url: '/setting/problem/manual/delete',
        method: 'post',
        data: data
    })
}

// 内容-分页列表
export function manualContentPage(query) {
    return request({
        url: '/setting/problem/manual/content/page',
        method: 'get',
        params: query
    })
}

// 内容-编辑
export function editManualContent(data) {
    return request({
        url: '/setting/problem/manual/content/update',
        method: 'post',
        data: data
    })
}
