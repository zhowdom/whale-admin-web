// 商品评价
import request from '@/utils/request';

const urls = {
  evaluationList: '/goods/evaluate/list',                           // 商品评价分页列表 - get
  deleteEvaluation: '/goods/evaluate/delete',                       // 删除商品评价 - post
  addEvaluation: '/goods/evaluate/save',                            // 添加商品评价 - post
  evaluationStateUpdate: '/goods/evaluate/update',                  // 修改商品评价显示/隐藏状态 - post
  evaluationDetail: '/goods/evaluate/view',                         // 查看商品评价详情 - get
  responseEvaluation: '/goods/evaluate/answer',                     // 回复商品评价 - post
  deleteEvResponse: '/goods/evaluate/delAnswer',                    // 删除回复商品评价 - post
}

export const evaluationList = data => request({url: urls.evaluationList, method: 'get', params: data});                     // 商品评价分页列表 - get
export const deleteEvaluation = data => request({url: urls.deleteEvaluation, method: 'post', data});                        // 删除商品评价 - post
export const addEvaluation = data => request({url: urls.addEvaluation, method: 'post', data});                              // 添加商品评价 - post
export const evaluationStateUpdate = data => request({url: urls.evaluationStateUpdate, method: 'post', data});              // 修改商品评价显示/隐藏状态 - post
export const evaluationDetail = data => request({url: urls.evaluationDetail, method: 'get', params: data});                 // 查看商品评价详情 - get
export const responseEvaluation = data => request({url: urls.responseEvaluation, method: 'post', data});                    // 回复商品评价 - post
export const deleteEvResponse = data => request({url: urls.deleteEvResponse, method: 'post', data});                        // 删除回复商品评价 - post
