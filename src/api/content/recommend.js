// 好物推荐
import request from '@/utils/request';

const urls = {
  recommendPage: '/good/recommend/page',                                              // 好物分页 - get
  recommendSave: '/good/recommend/addProduct',                                        // 好物添加 - post
  recommendCancle: '/good/recommend/cancelRecommend',                                 // 取消好物 - post
  recommendSort: '/good/recommend/updateSort',                                        // 好物排序 - post
  recommendList: '/goods/product/good/recommend/list',                                // 好物推荐列表添加商品 - get
}


export const recommendPage = data => request({url: urls.recommendPage, method: 'get', params: data});          // 好物分页 - get
export const recommendSave = data => request({url: urls.recommendSave, method: 'post', data});                 // 好物添加 - post
export const recommendCancle = data => request({url: urls.recommendCancle, method: 'post', data});             // 取消好物 - post
export const recommendSort = data => request({url: urls.recommendSort, method: 'post', data});                 // 好物排序 - post
export const recommendList = data => request({url: urls.recommendList, method: 'get', params: data});          // 好物推荐列表添加商品 - get
