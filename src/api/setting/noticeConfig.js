
// web管理后台相关接口
import request from '@/utils/request'

// 获取公告分页列表List
export function noticePage(query) {
    return request({
        url: '/notice/manage/page',
        method: 'get',
        params: query
    })
}

// 新增公告
export function addNotice(data) {
    return request({
        url: '/notice/manage/save',
        method: 'post',
        data: data
    })
}

// 编辑公告
export function editNotice(data) {
    return request({
        url: '/notice/manage/update',
        method: 'post',
        data: data
    })
}

// 公告开关切换
export function changeNotice(data) {
    return request({
        url: '/notice/manage/status/change',
        method: 'post',
        data: data
    })
}

// 删除公告
export function deleteNotice(data) {
    return request({
        url: '/notice/manage/delete',
        method: 'post',
        data: data
    })
}