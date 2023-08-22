// banner 管理
import request from '@/utils/request'

const urls = {
  pageGlobal: '/task/page/global',                      // 全局特权任务分页数据 - get
  pageGoods: '/task/page/product',                      // 商品特权任务分页数据 - get
  saveGlobal: '/task/save/global',                      // 新增全局特权任务 - post
  saveGoods: '/task/save/product',                      // 新增商品特权任务 - post
  updateGlobal: '/task/update/global',                  // 修改全局特权任务 - post
  updateGoods: '/task/update/product',                  // 修改商品特权任务 - post
  modifyLog: '/task/modify/log',                        // 修改记录-任务id查询 - get
  typeList: '/task/give/type/list',                     // 任务赠送条件清单 - get
  activeTypeList: '/task/receive/type/list',            // 任务激活条件清单 - get
  statusChangeGlobal: '/task/status/change/global',     // 全局特权任务状态修改 - post
  statusChangeGoods: '/task/status/change/product',     // 商品特权任务状态修改 - post
  taskInfo: '/task/info',                               // 任务明细 - get

  // 游戏赠送奖励券相关新增接口：
  pageGoods_forGameGift: '/task/page/game',                      // 游戏赠送奖励券（分页） - get
  saveGoods_forGameGift: '/task/save/game',                      // 游戏赠送奖励券（新增） - post
  statusChangeGoods_forGameGift: '/task/status/change/game',     // 游戏赠送奖励券（状态修改） - post
  updateGoods_forGameGift: '/task/update/game',                  // 游戏赠送奖励券（修改） - post
}


export const pageGlobal = data => request({url: urls.pageGlobal, method: 'get', params: data});               // 全局特权任务分页数据
export const pageGoods = data => request({url: urls.pageGoods, method: 'get', params: data});               // 商品特权任务分页数据
export const saveGlobal = data => request({url: urls.saveGlobal, method: 'post', data});                      // 新增全局特权任务
export const saveGoods = data => request({url: urls.saveGoods, method: 'post', data});                      // 新增商品特权任务
export const updateGlobal = data => request({url: urls.updateGlobal, method: 'post', data});                  // 修改全局特权任务
export const updateGoods = data => request({url: urls.updateGoods, method: 'post', data});                  // 修改商品特权任务
export const modifyLog = data => request({url: urls.modifyLog, method: 'get', params: data});                 // 修改记录-任务id查询
export const typeList = data => request({url: urls.typeList, method: 'get', params: data});                   // 任务赠送条件清单
export const activeTypeList = data => request({url: urls.activeTypeList, method: 'get', params: data});       // 任务激活条件清单
export const statusChangeGlobal = data => request({url: urls.statusChangeGlobal, method: 'post', data});      // 全局特权任务状态修改
export const statusChangeGoods = data => request({url: urls.statusChangeGoods, method: 'post', data});      // 商品特权任务状态修改
export const taskInfo = data => request({url: urls.taskInfo, method: 'get', params: data});                   // 任务明细

// 游戏赠送奖励券相关新增接口：
export const pageGoods_forGameGift = data => request({url: urls.pageGoods_forGameGift, method: 'get', params: data});
export const saveGoods_forGameGift = data => request({url: urls.saveGoods_forGameGift, method: 'post', data});
export const statusChangeGoods_forGameGift = data => request({url: urls.statusChangeGoods_forGameGift, method: 'post', data});
export const updateGoods_forGameGift = data => request({url: urls.updateGoods_forGameGift, method: 'post', data});
