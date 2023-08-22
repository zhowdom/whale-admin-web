import request from '@/utils/request'
/**
 * 
 * ************************
 * @@大转盘-猜数字赢Candy游戏@@
 * ************************
 * 
 */

// 游戏列表|game:info:page
export function allGamesList(data) {
  return request({
    url: '/game/info/page',
    method: 'post',
    data: data
  })
}
// 游戏房间报表统计|game:room:statistic
export function roomstatistic(query) {
  return request({
    url: '/game/room/statistic',
    method: 'get',
    params: query
  })
}
// 参与记录分页接口(管理列表)|game:member:log:page
export function roomlistQuery(data) {
  return request({
    url: '/game/member/log/page',
    method: 'post',
    data: data
  })
}
// 添加游戏|game:info:add
export function creatGame(data) {
  return request({
    url: '/game/info/add',
    method: 'post',
    data: data
  })
}
// 编辑游戏|game:info:update
export function alterGame(data) {
  return request({
    url: '/game/info/update',
    method: 'post',
    data: data
  })
}
// 游戏场次查询列表
export function gameDesk(data) {
  return request({
    url: '/game/rule/page',
    method: 'post',
    data: data
  })
}
// 参数列表
export function gamePropsList(query) {
  return request({
    url: '/game/info/field/list',
    method: 'get',
    params: query
  })
}
// 游戏状态变更
export function gameStatusChange(data) {
  return request({
    url: '/game/info/status/change',
    method: 'post',
    data: data
  })
}
// 游戏删除
export function gameRemove(data) {
  return request({
    url: '/game/info/remove',
    method: 'post',
    data: data
  })
}
// 游戏规则增加
export function gameRuleAdd(data) {
  return request({
    url: '/game/rule/add',
    method: 'post',
    data: data
  })
}
// 游戏规则修改
export function gameRuleUpdate(data) {
  return request({
    url: '/game/rule/update',
    method: 'post',
    data: data
  })
}
// 游戏规则删除
export function gameRuleDel(data) {
  return request({
    url: '/game/rule/remove',
    method: 'post',
    data: data
  })
}
// 游戏规则状态更新
export function gameRuleStatusChange(data) {
  return request({
    url: '/game/rule/status/change',
    method: 'post',
    data: data
  })
}
/**
 * @游戏奖品发放管理
 */
// 分页列表
export function prizesAwardQueryList(query) {
  return request({
    url: '/game/prizeDistribution/listByPage',
    method: 'get',
    params: query
  })
}
// 详情
export function prizesAwardDetails(query) {
  return request({
    url: '/game/prizeDistribution/getById',
    method: 'get',
    params: query
  })
}
// 导出
export function prizesAwardExport(query) {
  return request({
    url: '/game/prizeDistribution/exportExcel',
    method: 'get',
    params: query,
    responseType: 'blob',
    timeout: 300000,
  })
}
// 添加快递单号
export function prizesAwardAddPostCode(data) {
  return request({
    url: '/game/prizeDistribution/addLogisticsNum',
    method: 'post',
    data: data
  })
}
// 添加收货地址|编辑
export function prizesAwardAddOrEditAddress(data) {
  return request({
    url: '/game/prizeDistribution/addAddress',
    method: 'post',
    data: data
  })
}
/**
 * @游戏商品模板
 */
// 模板添加
 export function gameTemplateAdd(data) {
  return request({
    url: '/game/goods/template/save',
    method: 'post',
    data: data
  })
}
// 模板修改
export function gameTemplateAlter(data) {
  return request({
    url: '/game/goods/template/update',
    method: 'post',
    data: data
  })
}
// 模板分页
export function gameTemplateQueryList(query) {
  return request({
    url: '/game/goods/template/list',
    method: 'get',
    params: query
  })
}
// 模板删除
export function gameTemplateDelete(data) {
  return request({
    url: '/game/goods/template/delete',
    method: 'post',
    data: data
  })
}
// 游戏模版被引用次数
export function refNums(query) {
  return request({
    url: '/game/goods/template/ref',
    method: 'get',
    params: query
  })
}
// [游戏类型]创建游戏时候，选择能够创建的游戏下拉列表
export function allGamesTypeslist(query) {
  return request({
    url: '/game/info/types',
    method: 'get',
    params: query
  })
}
/**
 * *******************
 *     @@Candy夺宝@@
 * *******************
 */
// 统计分析夺宝列表分页查询
 export function takejewelQueryList(query) {
  return request({
    url: '/game/goods/treasure/list', // 这个地址不对，后端漏掉了这个借口，
    method: 'get',
    params: query
  })
}
// 夺宝规则管理的列表
export function takejewelRulelist(query) {
  return request({
    url: '/game/goods/treasure/list',
    method: 'get',
    params: query
  })
}
// 夺宝规则管理的列表--新增[添加夺宝商品]
export function takejewelRulelistAdd(data) {
  return request({
    url: '/game/goods/treasure/save',
    method: 'post',
    data: data
  })
}
// 夺宝规则管理的列表--编辑[添加夺宝商品]
export function takejewelRulelistUpdate(data) {
  return request({
    url: '/game/goods/treasure/update',
    method: 'post',
    data: data
  })
}
// 夺宝规则下架
export function takejewelDown(data) {
  return request({
    url: '/game/goods/treasure/down',
    method: 'post',
    data: data
  })
}
// 夺宝规则上架
export function takejewelUp(data) {
  return request({
    url: '/game/goods/treasure/up',
    method: 'post',
    data: data
  })
}
// 夺宝规则删除
export function takejewelDelete(data) {
  return request({
    url: '/game/goods/treasure/delete',
    method: 'post',
    data: data
  })
}
// 夺宝规则优惠券状态开关
export function takejewelSwitch(data) {
  return request({
    url: '/game/goods/treasure/coupon/switch',
    method: 'post',
    data: data
  })
}
// 夺宝规则优惠券[修改]
export function takejewelCouponChange(data) {
  return request({
    url: '/game/goods/treasure/coupon/change',
    method: 'post',
    data: data
  })
}
// 夺宝规则优惠券[新增]
export function takejewelCouponAdd(data) {
  return request({
    url: '/game/goods/treasure/coupon/setting',
    method: 'post',
    data: data
  })
}

/**
 * 夺宝游戏统计分析，豆腐块
 */
 export function takejewelTofuBlock(query) {
  return request({
    url: '/game/prizeDistribution/statistics',
    method: 'get',
    params: query
  })
}
/**
 * 夺宝游戏统计分析，豆腐块下面列表
 */
 export function takejewelTofuBlockList(query) {
  return request({
    url: '/game/order/page',
    method: 'get',
    params: query
  })
}
// 夺宝号码分页清单
export function takejewelCodeList(query) {
  return request({
    url: '/indiana/member/log/page',
    method: 'get',
    params: query
  })
}
/**
 * 公布中奖管理
 */
export function takejewelWinQuery(query) {
  return request({
    url: '/game/goods/winning/list',
    method: 'get',
    params: query
  })
}
export function takejewelWinSet(data) {
  return request({
    url: '/game/goods/winning/setting',
    method: 'post',
    data: data
  })
}
// 查看夺宝规则详情[每一期夺宝详情点击查看按钮]
export function jewelEachissueRuleDetails(query) {
  return request({
    url: '/game/goods/treasure/view',
    method: 'get',
    params: query
  })
}
// 游戏优惠券详情（By id）
export function jewelGameCouponsInfos(query) {
  return request({
    // url: '/coupon/game/get',
    url: '/coupon/game/details',
    method: 'get',
    params: query
  })
}
// 优惠券列表-游戏优惠券-游戏引用次数点击弹窗
export function gameCouponsRefsCounts(query) {
  return request({
    // url: '/coupon/game/get',
    url: '/game/goods/treasure/citations/page',
    method: 'get',
    params: query
  })
}
// 夺宝游戏排序更改
export function takejewelSortChange(data) {
  return request({
    url: '/game/goods/treasure/sort/change',
    method: 'post',
    data: data
  })
}
// 夺宝游戏公布中奖管理-修改中奖码
export function takejewelWinCodeChange(data) {
  return request({
    url: '/game/goods/winning/change',
    method: 'post',
    data: data
  })
}
// 夺宝游戏公布中奖管理-取消中奖码
export function takejewelWinCodeCancel(data) {
  return request({
    url: '/game/goods/winning/cancel',
    method: 'post',
    data: data
  })
}
/**
 * *******************
 * @@转转乐（体彩）游戏@@
 * *******************
 */
// 体彩游戏规则-签到数据
export function zzJoySiginDataQuery(query) {
  // lottery:signin:list
  return request({
    url: '/game/lottery/rule/signin/list',
    method: 'get',
    params: query
  })
}
// 体彩游戏规则-签到数据-更改
export function zzJoySiginDataUpdate(data) {
  // lottery:signin:saveorupdate
  return request({
    url: '/game/lottery/rule/saveorupdate/signin',
    method: 'post',
    data: data
  })
}
// 体彩游戏规则-其他游戏任务-分页
export function zzJoyOtherTaskList(query) {
  // lottery:task:list
  return request({
    url: '/game/lottery/rule/task/list',
    method: 'get',
    params: query
  })
}
// 体彩游戏规则-添加其他游戏任务
export function zzJoyOtherTaskAdd(data) {
  // lottery:task:save
  return request({
    url: '/game/lottery/rule/save/task',
    method: 'post',
    data: data
  })
}
// 体彩游戏规则-修改其他游戏任务
export function zzJoyOtherTaskUpdate(data) {
  // lottery:task:update
  return request({
    url: '/game/lottery/rule/update/task',
    method: 'post',
    data: data
  })
}
// 体彩游戏规则-删除
export function zzJoyOtherTaskDelete(query) {
  // lottery:task:delete
  return request({
    url: '/game/lottery/rule/delete/task',
    method: 'get',
    params: query
  })
}
// 体彩游戏规则-启用停用
export function zzJoyOtherTaskStatusChange(data) {
  // lottery:task:enableordisable
  return request({
    url: '/game/lottery/rule/enableordisable/task',
    method: 'post',
    data: data
  })
}
// 体彩游戏公布中奖管理-分页
export function zzJoyWinnerPage(query) {
  // game:lottery:pool:getByPage
  return request({
    url: '/game/lottery/pool/win/getByPage',
    method: 'get',
    params: query
  })
}
// 体彩游戏公布中奖管理-中奖等级分页查询
export function zzJoyWinnerLevelPage(query) {
  // game:lottery:pool:getByLevelPage
  return request({
    url: '/game/lottery/pool/win/getByLevelPage',
    method: 'get',
    params: query
  })
}
// 体彩游戏统计分析-豆腐块
export function zzJoystatisticsTofu(query) {
  // none
  return request({
    url: '/game/lottery/statistics',
    method: 'get',
    params: query
  })
}
// 体彩游戏统计分析-列表分页
export function zzJoystatisticsOuterList(query) {
  // game:lottery:getByPage
  return request({
    url: '/game/lottery/getByPage',
    method: 'get',
    params: query
  })
}
// 体彩游戏统计分析-列表我的中奖码查询
export function zzJoystatisticsMyCodeList(query) {
  // game:lottery:getByCodePage
  return request({
    url: '/game/lottery/getByCodePage',
    method: 'get',
    params: query
  })
}
// 体彩游戏统计分析-【公共点击查看进入】-奖池管理分页
export function zzJoystatisticsSEEPoorList(query) {
  // game:lottery:poolManage
  return request({
    url: '/game/lottery/poolManage',
    method: 'get',
    params: query
  })
}
// 体彩游戏统计分析-【公共点击查看进入】-奖码管理分页
export function zzJoystatisticsSEECodeList(query) {
  // game:lottery:codeManage
  return request({
    url: '/game/lottery/codeManage',
    method: 'get',
    params: query
  })
}
/**
 * 体彩游戏-奖池管理
 */
// 体彩游戏-奖池管理-统计分析豆腐块
 export function zzJoyPoorManaStatistics(query) {
   // none
  return request({
    url: '/game/lottery/pool/statistics',
    method: 'get',
    params: query
  })
}
// 体彩游戏-奖池管理-累计兑换分页查询
export function zzJoyPoorTotalSwitchList(query) {
  // game:lottery:pool:getByPage
  return request({
    url: '/game/lottery/pool/getByPage',
    method: 'get',
    params: query
  })
}
// 体彩游戏-奖池管理-奖池分红分页查询
export function zzJoyPoorRedbackList(query) {
  // game:lottery:pool:apportionPage
  return request({
    url: '/game/lottery/pool/apportionPage',
    method: 'get',
    params: query
  })
}
// 体彩游戏-奖池管理-可分配奖池分页查询
export function zzJoyPoorCanDivideList(query) {
  // game:lottery:pool:injectPage
  return request({
    url: '/game/lottery/pool/injectPage',
    method: 'get',
    params: query
  })
}
// 体彩游戏-奖池管理-每期底注分页查询
export function zzJoyPoorEachIssueList(query) {
  // game:lottery:pool:downLimitPage
  return request({
    url: '/game/lottery/pool/downLimitPage',
    method: 'get',
    params: query
  })
}
// 体彩游戏-奖池管理-手动|每期注入操作
export function zzJoyPoorEachIssueHandling(data) {
  // game:lottery:pool:inject
  return request({
    url: '/game/lottery/pool/inject',
    method: 'post',
    data: data
  })
}
// 体彩游戏-奖池管理-每期注入-状态更改
export function zzJoyPoorEachIssueStatusChange(data) {
  // game:lottery:pool:updateStatus
  return request({
    url: '/game/lottery/pool/updateStatus',
    method: 'post',
    data: data
  })
}
// 体彩游戏-奖池管理-每期注入-行数据编辑
export function zzJoyPoorEachIssueRowDataEdit(data) {
  // game:lottery:pool:updateById
  return request({
    url: '/game/lottery/pool/updateById',
    method: 'post',
    data: data
  })
}
// 体彩游戏-奖池管理-每期注入-行数据删除
export function zzJoyPoorEachIssueRowDataDel(data) {
  // game:lottery:pool:del
  return request({
    url: '/game/lottery/pool/del',
    method: 'post',
    data: data
  })
}
/**
 * H5分享路径追踪
 */
// H5分享-列表查询
export function h5SharePathTrackApi(query) {
  // member:sharerecord:page
  return request({
    url: '/operation/share/record/list',
    method: 'get',
    params: query
  })
}
/**
 * 内容-赠送统计
 */
// 内容-赠送统计分页
export function gifStatisticsListQuery(query) {
  // statistic:view:list
  return request({
    url: '/statistic/view/list',
    method: 'get',
    params: query
  })
}
// 内容-赠送统计--赠送行为下拉
export function gifStatisticsListBehavior(query) {
  return request({
    url: '/statistic/view/behavior/list',
    method: 'get',
    params: query
  })
}
// 内容-赠送统计--赠送平台清单下拉
export function gifStatisticsListPlatform(query) {
  return request({
    url: '/statistic/view/platform/list',
    method: 'get',
    params: query
  })
}
// 内容-赠送统计--赠送类型清单下拉
export function gifStatisticsListType(query) {
  // statistic:view:list
  return request({
    url: '/statistic/view/type/list',
    method: 'get',
    params: query
  })
}
/**
 * 海报管理
 */
// 海报管理-新增
export function myPostersAdd(data) {
  // operation:posters:save
  return request({
    url: '/operation/posters/save',
    method: 'post',
    data: data
  })
}
// 海报管理-编辑
export function myPostersEdit(data) {
  // operation:posters:edit
  return request({
    url: '/operation/posters/edit',
    method: 'post',
    data: data
  })
}
// 海报管理-删除
export function myPostersDel(data) {
  // operation:posters:delete
  return request({
    url: '/operation/posters/delete',
    method: 'post',
    data: data
  })
}
// 海报管理-状态更改
export function myPostersSwitchStatus(data) {
  // operation:posters:status
  return request({
    url: '/operation/posters/status',
    method: 'post',
    data: data
  })
}
// 海报管理-分页
export function myPostersList(data) {
  // operation:posters:page
  return request({
    url: '/operation/posters/page',
    method: 'post',
    data: data
  })
}
/**
 * 盲盒游戏--相关接口
 */
// 盲盒规则新增
 export function blindBoxRuleAdd(data) {
  // blindBox:product_rule:save
  return request({
    url: '/blindBox/product/rule/save',
    method: 'post',
    data: data
  })
}
// 盲盒规则修改
export function blindBoxRuleEdit(data) {
  // blindBox:product_rule:update
  return request({
    url: '/blindBox/product/rule/update',
    method: 'post',
    data: data
  })
}
// 盲盒规则返回-查询
export function blindBoxRuleQueryReturn(query) {
  return request({
    url: '/blindBox/product/rule/generate',
    method: 'get',
    params: query
  })
}
// 赠送盲盒奖励券下拉数据
export function blindBoxRuleAddCoupons(query) {
  return request({
    url: '/task/page/game',
    method: 'get',
    params: query
  })
}
// 赠送盲盒奖励券下拉数据[give]
export function blindBoxRuleAddCouponsGive(query) {
  return request({
    url: '/vip/item/list',
    method: 'get',
    params: query
  })
}
// 盲盒规则列表数据-分页
// blindBox:product_rule:page
export function blindBoxRulePagesQuery(query) {
  return request({
    url: '/blindBox/product/rule/page',
    method: 'get',
    params: query
  })
}
// 盲盒模版添加
export function blindBoxTemplateAdd(data) {
  // blindBox:product_template:save
  return request({
    url: '/blindBox/product/template/save',
    method: 'post',
    data: data
  })
}
// 盲盒模版分页
// blindBox:product_template:page
export function blindBoxTemplateListPage(query) {
  return request({
    url: '/blindBox/product/template/page',
    method: 'get',
    params: query
  })
}
// 盲盒模版编辑
export function blindBoxTemplateEdit(data) {
  // blindBox:product_template:update
  return request({
    url: '/blindBox/product/template/update',
    method: 'post',
    data: data
  })
}
// 盲盒模版删除
export function blindBoxTemplateDel(data) {
  // blindBox:product_template:delete
  return request({
    url: '/blindBox/product/template/delete',
    method: 'post',
    data: data
  })
}
// 盲盒模版引用次数
// blindBox:product_template:reference
export function blindBoxTemplateRef(query) {
  return request({
    url: '/blindBox/product/template/ref',
    method: 'get',
    params: query
  })
}
// 盲盒统计分析
export function blindBoxStatisticsList(query) {
  return request({
    url: '/blindBox/order/statistics',
    method: 'get',
    params: query
  })
}
// 盲盒统计分析--下面列表
export function blindBoxStatisticsListByPage(query) {
  return request({
    url: '/blindBox/order/getByPage',
    method: 'get',
    params: query
  })
}
// 盲盒统计分析--下面列表里面的实物明细弹窗
export function blindBoxPurchaseInfoItemQuery(query) {
  return request({
    url: '/blindBox/order/purchaseInfoItem',
    method: 'get',
    params: query
  })
}
// 盲盒详情页-魔力盲盒-待解封-已解封
export function blindBoxDetailsGetByLockPage(query) {
  return request({
    url: '/blindBox/order/getByLockPage',
    method: 'get',
    params: query
  })
}
// 盲盒详情页-赠送奖励(与VIP权益共一个接口)
export function blindBoxDetailsgiveRewardByPage(query) {
  return request({
    url: '/blindBox/order/giveRewardByPage',
    method: 'get',
    params: query
  })
}
// 盲盒详情页-收益明细
export function blindBoxDetailsProfit(query) {
  return request({
    url: '/blindBox/order/earningsInfoByPage',
    method: 'get',
    params: query
  })
}
// 盲盒详情页-抢购明细
export function blindBoxDetailspurchaseInfo(query) {
  return request({
    url: '/blindBox/order/purchaseInfo',
    method: 'get',
    params: query
  })
}
// 盲盒退还--上方总统计数据豆腐块
export function blindBoxTFstatistics(query) {
  return request({
    url: '/blind/box/return/statistics',
    method: 'get',
    params: query
  })
}
// 盲盒退还--下方列表
export function blindBoxTFList(query) {
  return request({
    url: '/blind/box/return/page',
    method: 'get',
    params: query
  })
}
// 盲盒退还--审核
export function blindBoxTFAudit(data) {
  return request({
    url: '/blind/box/return/audit',
    method: 'post',
    data: data
  })
}
// 盲盒规则排序-修改
export function blindBoxSortAlter(data) {
  return request({
    url: '/blindBox/product/rule/sort/change',
    method: 'post',
    data: data
  })
}
// 盲盒规则-上架
export function blindBoxUpShlef(data) {
  return request({
    url: '/blindBox/product/rule/up',
    method: 'post',
    data: data
  })
}
// 盲盒规则-下架
export function blindBoxDownShlef(data) {
  return request({
    url: '/blindBox/product/rule/down',
    method: 'post',
    data: data
  })
}
// 盲盒规则-删除
export function blindBoxRulesDel(data) {
  return request({
    url: '/blindBox/product/rule/delete',
    method: 'post',
    data: data
  })
}
// 盲盒系列管理-操作开放
export function blindBoxSeriesOpen(data) {
  return request({
    url: '/blindBox/product/series/open',
    method: 'post',
    data: data
  })
}
// 盲盒系列管理-分页
export function blindBoxSeriesPage(query) {
  return request({
    url: '/blindBox/product/series/page',
    method: 'get',
    params: query
  })
}
/**
 * app跑马灯公示通知
 */
// app跑马灯公示--列表
export function pmdList(query) {
  return request({
    url: '/setting/notice/content/page',
    method: 'get',
    params: query
  })
}
// app跑马灯公示--新增
export function pmdAdd(data) {
  return request({
    url: '/setting/notice/content/save',
    method: 'post',
    data: data
  })
}
// app跑马灯公示--修改
export function pmdUpdate(data) {
  return request({
    url: '/setting/notice/content/update',
    method: 'post',
    data: data
  })
}
// app跑马灯公示--删除
export function pmdDel(data) {
  return request({
    url: '/setting/notice/content/delete',
    method: 'post',
    data: data
  })
}
// app跑马灯公示--修改状态
export function pmdStatusChange(data) {
  return request({
    url: '/setting/notice/content/status/change',
    method: 'post',
    data: data
  })
}
// app跑马灯公示--获取开放位置下拉列表
export function pmdNoticeList(query) {
  return request({
    url: '/setting/notice/content/list',
    method: 'get',
    params: query
  })
}
// 须保持权益
export function needHoldList(query) {
  return request({
    url: '/internal/member/remain/page',
    method: 'get',
    params: query
  })
}
export function needHoldAudit(data) {
  return request({
    url: '/internal/member/remain/audit',
    method: 'post',
    data: data
  })
}
// 盲盒详情页-管制分分页查询
export function controlRcdPage(query) {
  return request({
    url: '/blindbox/member/control/score/record/page',
    method: 'get',
    params: query
  })
}
// 盲盒详情页-可参与分页查询
export function coudlJoinRcdPage(query) {
  return request({
    url: '/blindBox/product/control/page',
    method: 'get',
    params: query
  })
}
// 盲盒详情页-机器人抢购统计分页查询
export function robotRcdPage(query) {
  return request({
    url: '/blindBox/product/series/robot/info',
    method: 'get',
    params: query
  })
}
// 卖了换钱-商品-分页
export function saleforBalanceGoodsList(query) {
  return request({
    url: '/blindBox/product/platform/page',
    method: 'get',
    params: query
  })
}
// 卖了换钱-商品-买入
export function saleforBalanceGoodsBugIn(data) {
  return request({
    url: '/blindBox/product/platform/buy',
    method: 'post',
    data: data
  })
}
// 卖了换钱--用户余额--分页
export function saleforBalanceList(query) {
  return request({
    url: '/blindBox/exchange/account/page',
    method: 'get',
    params: query
  })
}
// 卖了换钱--用户余额--弹窗明细
export function saleforBalanceLog(query) {
  return request({
    url: '/blindBox/exchange/account/record/page',
    method: 'get',
    params: query
  })
}
// 卖了换钱--用户提现-列表
export function saleforWithdraList(query) {
  return request({
    url: '/blindBox/withdraw/account/record/page',
    method: 'get',
    params: query
  })
}
// 卖了换钱--用户提现-审核
export function saleforWithdraAudit(data) {
  return request({
    url: '/blindBox/withdraw/account/record/audit',
    method: 'post',
    data: data
  })
}
// 盲盒资金结算-分页
export function blindBoxSettlementList(query) {
  return request({
    url: '/blindBox/settlement/page',
    method: 'get',
    params: query
  })
}
// 盲盒资金结算--统计豆腐块
export function blindBoxSettlementTofu(query) {
  return request({
    url: '/blindBox/settlement/statistics',
    method: 'get',
    params: query
  })
}
// 导出--卖了换钱用户提现
export function saleForMoneyExoprt(query) {
  return request({
    url: '/blindBox/withdraw/account/record/export',
    method: 'get',
    params: query,
    responseType: 'blob',
    timeout: 300000,
  })
}
// 卖了换钱--用户提现-批量转账成功
export function saleForMoneyBatchTransfer(data) {
  return request({
    url: '/blindBox/withdraw/account/record/batch/transfer/success',
    method: 'post',
    data: data
  })
}
// 收益奖励限制统计-收益/补贴
export function earningsRewardLimitStatistics_profitDetail(query) {
  return request({
    url: '/blindBox/order/all/earningsInfoByPage',
    method: 'get',
    params: query
  })
}
// 收益奖励限制统计-管制
export function earningsRewardLimitStatistics_control(query) {
  return request({
    url: '/blindbox/member/control/score/record/all/page',
    method: 'get',
    params: query
  })
}
// 收益奖励限制统计-可参与上限
export function earningsRewardLimitStatistics_couldJoin(query) {
  return request({
    url: '/blindBox/product/control/all/page',
    method: 'get',
    params: query
  })
}
// 收益奖励限制统计-赠送任务券/赠送VIP券
export function earningsRewardLimitStatistics_taskVip(query) {
  return request({
    url: '/blindBox/order/give/all/Page',
    method: 'get',
    params: query
  })
}
// 大小banner获取路由名称集合
export function setRoutLinkList(query) {
  return request({
    url: '/setting/link/route',
    method: 'get',
    params: query
  })
}
// 大小banner获取路由名称集合(针对NFT模块区分)
export function setRoutLinkList_NFT(query) {
  return request({
    url: '/nft/setting/link/route',
    method: 'get',
    params: query
  })
}
// 大小banner新增保存
export function bigOrSmallBannerAdd(data) {
  return request({
    url: '/setting/banner/save',
    method: 'post',
    data: data
  })
}
// 大小banner修改保存
export function bigOrSmallBannerAlter(data) {
  return request({
    url: '/setting/banner/update',
    method: 'post',
    data: data
  })
}
// 大小banner删除
export function bigOrSmallBannerDel(data) {
  return request({
    url: '/setting/banner/delete',
    method: 'post',
    data: data
  })
}
// 大小banner分页列表
export function bigOrSmallBannerListQuery(query) {
  return request({
    url: '/setting/banner/page',
    method: 'get',
    params: query
  })
}
// 大小banner位置position位置列表
export function bigOrSmallBannerPositionQuery(query) {
  return request({
    url: '/setting/banner/position',
    method: 'get',
    params: query
  })
}
// 大小banner根据ID查询详情信息
export function bigOrSmallBannerDetailQueryById(query) {
  return request({
    url: '/setting/banner/info',
    method: 'get',
    params: query
  })
}
// 任务券-转赠手续费配置-数据列表
export function taskGiveCoupsPageList(query) {
  return request({
    url: '/task/transfer/rate/list',
    method: 'get',
    params: query
  })
}
// 荣耀值转赠-数据列表
export function taskGiveCoupsPageList_dedicate(query) {
  return request({
    url: '/task/dedicate/rate/list',
    method: 'get',
    params: query
  })
}
// 任务券-转赠手续费配置-添加
export function taskGiveCoupsAdd(data) {
  return request({
    url: '/task/transfer/rate/batch/add',
    method: 'post',
    data: data
  })
}
// 荣耀值转赠-添加
export function taskGiveCoupsAdd_dedicate(data) {
  return request({
    url: '/task/dedicate/rate/batch/add',
    method: 'post',
    data: data
  })
}
// 任务券-转赠手续费配置-删除
export function taskGiveCoupsDel(data) {
  return request({
    url: '/task/transfer/rate/remove',
    method: 'post',
    data: data
  })
}
// 荣耀值转赠-删除
export function taskGiveCoupsDel_dedicate(data) {
  return request({
    url: '/task/dedicate/rate/remove',
    method: 'post',
    data: data
  })
}
// 任务券-转赠手续费配置-任务券名称-下拉集合
export function taskGiveCoupsMapslist(query) {
  return request({
    url: '/task/page/store',
    method: 'get',
    params: query
  })
}
// app弹窗广告v2-列表
export function advertPOP_list(query) {
  return request({
    url: '/setting/advert/v2/page',
    method: 'get',
    params: query
  })
}
// app弹窗广告v2-根据ID获取详情
export function advertPOP_Detail(query) {
  return request({
    url: '/setting/advert/v2/get',
    method: 'get',
    params: query
  })
}
// app弹窗广告v2-删除
export function advertPOP_del(data) {
  return request({
    url: '/setting/advert/v2/delete',
    method: 'post',
    data: data
  })
}
// app弹窗广告v2-新增
export function advertPOP_add(data) {
  return request({
    url: '/setting/advert/v2/save',
    method: 'post',
    data: data
  })
}
// app弹窗广告v2-修改
export function advertPOP_alter(data) {
  return request({
    url: '/setting/advert/v2/update',
    method: 'post',
    data: data
  })
}
// app开屏页/启动页v2-获取详情
export function startPageV2_Query(query) {
  return request({
    url: '/setting/startPage/v2/page',
    method: 'get',
    params: query
  })
}
// app开屏页/启动页v2-修改更新
export function startPageV2_Alter(data) {
  return request({
    url: '/setting/startPage/v2/update',
    method: 'post',
    data: data
  })
}
// 小盲盒规则--查询虚拟销量
export function miniBlindBox_saleQuery(query) {
  return request({
    url: '/blindBox/product/series/sales',
    method: 'get',
    params: query
  })
}
// 小盲盒规则--设置虚拟销量
export function miniBlindBox_saleSet(data) {
  return request({
    url: '/blindBox/product/series/sales/setting',
    method: 'post',
    data: data
  })
}

// 赠送币种查询列表
export function miniBlindBox_bonusJDTListQuery(query) {
  return request({
    url: '/product/coin/record/page',
    method: 'get',
    params: query
  })
}
// 新增代币类型
export function addGameCoin(data) {
  return request({
    url: '/game/coin/add',
    method: 'post',
    data
  })
}
// 更新代币类型
export function updateGameCoin(data) {
  return request({
    url: '/game/coin/update',
    method: 'post',
    data
  })
}
// 游戏代币列表
export function getGameCoinList(query) {
  return request({
    url: '/game/coin/list',
    method: 'get',
    params: query
  })
}
// 游戏代币类型配置
export function getGameCoinPage(query) {
  return request({
    url: '/game/coin/page',
    method: 'get',
    params: query
  })
}
// 绑定邮箱设置-保存
export function bindEmailSet_save(data) {
  return request({
    url: '/member/setting/storage',
    method: 'post',
    data: data
  })
}

// 绑定邮箱设置-查询
export function bindEmailSet_query(query) {
  return request({
    url: '/member/setting/1',
    method: 'get',
    params: query
  })
}
// VIP赠送权益配置-查询
export function vipRightSet_query(query) {
  return request({
    url: '/member/setting/2',
    method: 'get',
    params: query
  })
}
// 针对用户配置-保存
export function forUserSet_alter(data) {
  return request({
    url: '/member/dedicate/send/update',
    method: 'post',
    data: data
  })
}

// 针对用户配置-查询
export function forUserSet_query(query) {
  return request({
    url: '/member/dedicate/send/setting',
    method: 'get',
    params: query
  })
}