import request from '@/utils/request'

// 查询用户列表
export function searchUserListFilter(query) {
  return request({
    url: '/member/filter',
    method: 'get',
    params: query
  })
}
// 查询用户列表
export function searchUserList(query) {
  return request({
    url: '/member/list',
    method: 'get',
    params: query
  })
}
// 审核通过、拒绝
export function refuseOrApprove(data) {
  return request({
    url: '/member/rpAuth/audit',
    method: 'post',
    data: data
  })
}
// 审核资料提交
export function save(data) {
  return request({
    url: '/member/rpAuth/saveAuth',
    method: 'post',
    data: data
  })
}
// 账号启用｜禁用
export function statusChange(data) {
  return request({
    url: '/member/status',
    method: 'post',
    data: data
  })
}
// 账号启用｜禁用（批量操作）
export function statusBatchChange(data) {
  return request({
    url: '/member/status/batchUpdate',
    method: 'post',
    data: data
  })
}
// 查询某一个用户的实名认证情况
export function someoneCertifyResult(query) {
  return request({
    url: '/member/rpAuth/auth',
    method: 'get',
    params: query
  })
}
// 获取图片上传认证信息
export function getCertificate(query) {
  return request({
    url: 'oss/sts',
    method: 'get',
    params: query
  })
}
// 图片上传
export async function upload(certificateInfos, file) {
  // certificateInfos:获取凭证信息
  return new Promise((resolve, reject) => {
    let OSS = require('ali-oss')
    let client = new OSS({
      endpoint: certificateInfos.endpoint,
      accessKeyId: certificateInfos.stsAccessKeyId,
      accessKeySecret: certificateInfos.stsAccessKeySecret,
      bucket: certificateInfos.bucketName,
      stsToken: certificateInfos.stsToken
    });
    // 上传执行
    // 支持File对象、Blob数据以及OSS Buffer。
    const data = file;
    // or const data = new Blob('content');
    // or const data = new OSS.Buffer('content'));
    async function putObject () {
      try {
        // object-key可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
        let result = await client.put(`${certificateInfos.fileName}/${file.name}`, data)
        resolve(result)
      } catch (e) {
        console.log(e)
      }
    }
    putObject()
  })
}
// 认证费用管理-退款[没配权限]
export function drawbackMoney(query) {
  return request({
    url: '/operation/payment/return',
    method: 'get',
    params: query
  })
}
// 认证费用管理-列表分页[没配权限]
export function drawbackMoneyList(query) {
  return request({
    url: '/member/auth/list',
    method: 'get',
    params: query
  })
}
// 认证费用管理-警告信息查询
export function drawbackMoneyWarnInfos(query) {
  return request({
    url: '/operation/payment/record',
    method: 'get',
    params: query
  })
}
/**
 * 增加国际区域
 */
// 国家/地区--select下拉列表接
export function countryRegionList(query) {
  return request({
    url: '/operation/areacode/list', // 接口已经移除
    method: 'get',
    params: query
  })
}
// 国家/地区--table列表查询
export function countryRegionPageQuery(query) {
  // member:areacode:page
  return request({
    url: '/operation/areacode/page',
    method: 'get',
    params: query
  })
}
// 国家/地区--启用｜停用
export function countryRegionStatusSwitch(data) {
  // member:areacode:status
  return request({
    url: '/operation/areacode/status',
    method: 'post',
    data: data
  })
}
// 国家/地区--删除
export function countryRegionDelete(query) {
  // member:areacode:delete
  return request({
    url: '/operation/areacode/delete',
    method: 'get',
    params: query
  })
}
// 国家/地区--新增
export function countryRegionAdd(data) {
  // member:areacode:add
  return request({
    url: '/operation/areacode/add',
    method: 'post',
    data: data
  })
}