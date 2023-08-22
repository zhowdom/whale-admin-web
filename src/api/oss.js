import request from '@/utils/request';

const OSS = require('ali-oss');

// 获取图片上传认证信息 -- (类型license:证件(默认), product:商品)
export const getCertificate = (type = 'license') => request({url: '/goods/oss/sts', method: 'get', params: {type}});

/** 图片上传
 * @param {上传的凭证} CAs
 * @param {内容} data
 * @param {类型 默认是文件类型} type
 * @returns
 */
export const upload = (CAs, data, type = 'file') => {
  let reqData;            // 上传的数据
  let reqName;            // 上传的名称

  const {
    endpoint,
    stsToken,
    fileName,
    bucketName: bucket,
    stsAccessKeyId: accessKeyId,
    stsAccessKeySecret: accessKeySecret,
  } = CAs;

  const client = new OSS({
    endpoint,
    bucket,
    stsToken,
    accessKeyId,
    accessKeySecret,
  });

  // 支持File对象、Blob数据以及OSS Buffer。
  // let data = file;
  // or const data = new Blob('content');
  // or const data = new OSS.Buffer('content'));

  switch (type) {
    case 'file':
      reqData = data;
      reqName = `${fileName}/${data.name}`;
      break;
    case 'content':
      reqData = new OSS.Buffer(data);
      reqName = `${fileName}-detail.html`;
    default:
      break;
  }

  return client.put(reqName, reqData)
  .then(
    res => res
  ).catch(error => {
    throw error;
  });
}
