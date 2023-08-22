
import request from '@/utils/request'

/**
 * +++@商品分类+++
 * v-hasPermi="['goods:product:sku']"
 */

// 删除商品分类｜goods/category/delete｜goods:category:del
export function delCategory(data) {
  return request({
    url: '/goods/category/delete',
    method: 'post',
    data
  })
}

// 商品分类分页列表|goods/category/list|goods:category:list
export function categoryList(query) {
  return request({
    url: '/goods/category/list',
    method: 'get',
    params: query
  })
}
// 添加商品分类｜goods/category/save｜goods:category:save
export function addCategory(data) {
  return request({
    url: '/goods/category/save',
    method: 'post',
    data
  })
}
// 修改商品分类｜goods/category/update｜goods:category:edit
export function editCategory(data) {
  return request({
    url: '/goods/category/update',
    method: 'post',
    data
  })
}
// 属性类型｜goods/attribute
export function goodsAttributeList(query) {
  return request({
    url: '/goods/attribute/all',
    method: 'get',
    params: query
  })
}
/**
 * +++@属性类型+++
 */
// 商品属性类型分页列表|goods/attribute/list|goods:attribute:list
export function gdsAttrsList(query) {
  return request({
    url: '/goods/attribute/list',
    method: 'get',
    params: query
  })
}
// 添加商品属性类型|goods/attribute/save|goods:attribute:save
export function gdsAttrsAdd(data) {
  return request({
    url: '/goods/attribute/save',
    method: 'post',
    data
  })
}
// 修改商品属性类型|goods/attribute/update|goods:attribute:edit
export function gdsAttrsAlter(data) {
  return request({
    url: '/goods/attribute/update',
    method: 'post',
    data
  })
}
// 删除商品属性类型|goods/attribute/delete|goods:attribute:del
export function gdsAttrsDel(data) {
  return request({
    url: '/goods/attribute/delete',
    method: 'post',
    data
  })
}
/**
 * +++@属性分类-内页列表查询+++
 */
// 商品属性类型详情分页列表|goods/attribute/item/list|goods:attribute_item:list
export function gdsAttrsInnerList(query) {
  return request({
    url: '/goods/attribute/item/list',
    method: 'get',
    params: query
  })
}
// 添加商品属性类型|goods/attribute/item/save|goods:attribute_item:save
export function gdsAttrsInnerAdd(data) {
  return request({
    url: '/goods/attribute/item/save',
    method: 'post',
    data
  })
}
// 修改商品属性类型|goods/attribute/item/update|goods:attribute_item:update
export function gdsAttrsInnerAlter(data) {
  return request({
    url: '/goods/attribute/item/update',
    method: 'post',
    data
  })
}
// 商品属性类型规格List｜goods/attribute/item
export function goodsAttributeItemList(query) { // not used yet.
  return request({
    url: '/goods/attribute/item',
    method: 'get',
    params: query
  })
}
// 删除商品属性类型详情|goods/attribute/item/delete|goods:attribute_item:del
export function gdsAttrsInnerDel(data) {
  return request({
    url: '/goods/attribute/item/delete',
    method: 'post',
    data
  })
}
/**
 * +++@商品品牌+++
 */
// 商品品牌分页列表｜goods/brand/list|goods:brand:list
export function gdBrandsList(query) {
  return request({
    url: '/goods/brand/list',
    method: 'get',
    params: query
  })
}
// 商品品牌列表(no page)｜goods/brand
export function gdBrandsSelectMap(query) {
  return request({
    url: '/goods/brand/all',
    method: 'get',
    params: query
  })
}
// 删除商品品牌｜goods/brand/delete|goods:brand:del
export function gdBrandsDel(data) {
  return request({
    url: '/goods/brand/delete',
    method: 'post',
    data
  })
}
// 添加商品品牌｜goods/brand/save|goods:brand:save
export function gdBrandsAdd(data) {
  return request({
    url: '/goods/brand/save',
    method: 'post',
    data
  })
}
// 修改商品品牌｜goods/brand/update|goods:brand:edit
export function gdBrandsAlter(data) {
  return request({
    url: '/goods/brand/update',
    method: 'post',
    data
  })
}
/**
 * +++@商品列表+++
 */
// 商品品牌分页列表｜goods/product/list|goods:product:list
 export function goodsListQuery(query) {
  return request({
    url: '/goods/product/list',
    method: 'get',
    params: query
  })
}
// 商品父子分类Tree｜goods/category/tree
export function gdCategoryTreeList(query) {
  return request({
    url: '/goods/category/tree',
    method: 'get',
    params: query
  })
}
// 商品推荐列表List｜goods/product/recommend
export function gdProductRecoList(query) {
  return request({
    url: '/goods/product/recommend',
    method: 'get',
    params: query
  })
}
// 商品供应商列表List｜goods/product/supplier
export function gdsSupplierList(query) {
  return request({
    url: '/goods/product/supplier',
    method: 'get',
    params: query
  })
}
// 商品审核记录｜goods/product/audit/history
export function applyAuditDetails(query) {
  return request({
    url: '/goods/product/audit/history',
    method: 'get',
    params: query
  })
}
// 商品分页列表状态统计｜/goods/product/statistics|goods:product:statistics
export function applyGoodsStatistics(query) {
  return request({
    url: '/goods/product/statistics',
    method: 'get',
    params: query
  })
}
//编辑商品sku|goods/product/sku/edit|goods:product_sku:edit
export function applySkuListSave(data) {
  return request({
    url: '/goods/product/sku/edit',
    method: 'post',
    data
  })
}
// 商品sku分页列表｜/goods/product/sku|goods:product:sku
export function applySkuListQuery(query) {
  return request({
    url: '/goods/product/sku',
    method: 'get',
    params: query
  })
}
// 商品sku分页列表｜/goods/product/sku|goods:product:sku
export function applySkuListQuery2(query) {
  return request({
    url: '/goods/product/sku/realSales', // 真实销量
    method: 'get',
    params: query
  })
}
// 商品sku分页列表｜/goods/product/status|
export function goodsStatus(query) {
  return request({
    url: '/goods/product/status',
    method: 'get',
    params: query
  })
}
// 提交商品上架审核｜/goods/product/up｜goods:product:up
export function goodsUp(data) {
  return request({
    url: '/goods/product/up',
    method: 'post',
    data
  })
}
// 提交商品下架审核｜/goods/product/down｜goods:product:down
export function goodsDown(data) {
  return request({
    url: '/goods/product/down',
    method: 'post',
    data
  })
}
// 基础销量编辑
export function editBaseSell(data) {
  return request({
    url: '/goods/product/virSales',
    method: 'post',
    data
  })
}
// 订单相关超时处理
export function orderDelayQuery(query) {
  return request({
    url: '/order/timeoutSetting/list',
    method: 'get',
    params: query
  })
}
export function orderDelayAlter(data) {
  return request({
    url: '/order/timeoutSetting/update',
    method: 'post',
    data
  })
}
/**
 * Candy抵扣
 */
// 配置清单
export function whalePeanDiscList(query) {
  return request({
    url: '/whale/deduction/setting/list',
    method: 'get',
    params: query
  })
}
// 配置更新或新增
export function whalePeanDiscUpdate(data) {
  return request({
    url: '/whale/deduction/setting/updateorsave',
    method: 'post',
    data
  })
}
/**
 * 试练任务费用配置
 */
// 查询配置结果信息
export function tryTaskFeeSet_info(query) {
  return request({
    url: '/internal/task/payinfo/setting/get',
    method: 'get',
    params: query
  })
}
// 更新试练任务奖励
export function tryTaskFeeSet_BonusSave(data) {
  return request({
    url: '/internal/task/payinfo/setting/reward',
    method: 'post',
    data
  })
}
// 配置保存
export function tryTaskFeeSet_save(data) {
  return request({
    url: '/internal/task/payinfo/setting/storage',
    method: 'post',
    data
  })
}
// 人机验证（人机校验费）-查询
export function fireOilFeeQuery(query) {
  return request({
    url: '/task/fuel/fee/setting',
    method: 'get',
    params: query
  })
}
// 人机验证（人机校验费）-修改
export function fireOilFeeAlter(query) {
  return request({
    url: '/task/fuel/fee/setting/update',
    method: 'get',
    params: query
  })
}