/* 首页模块化需要的配置文件 */

export default {
  // 缩略彩图
  topNavNail: require('@images/nails/img_home_nav@2x.png'),                       // 缩略彩图 - 顶部导航
  topTabNail: require('@images/nails/img_home_menu@2x.png'),                      // 缩略彩图 - 顶部tab分页
  bigBannerNail: require('@images/nails/img_home_bigbanner@2x.png'),              // 缩略彩图 - 大banner
  kingNail: require('@images/nails/img_home_jingang@2x.png'),                     // 缩略彩图 - 金刚区
  smallBannerNail: require('@images/nails/img_home_smallbanner@2x.png'),          // 缩略彩图 - 小banner
  bottomTabNail: require('@images/nails/img_homeplace_tabpaging@2x.png'),         // 缩略彩图 - 商品tab列表
  bottomNavNail: require('@images/nails/img_home_tabber@2x.png'),                 // 缩略彩图 - 底部导航
  card1pNail: require('@images/nails/img_home_card0@2x.png'),                     // 缩略彩图 - 卡片1图
  card3pNail: require('@images/nails/img_home_card3@2x.png'),                     // 缩略彩图 - 卡片3图
  card4pNail: require('@images/nails/img_home_card2@2x.png'),                     // 缩略彩图 - 卡片4图
  // 缩略彩图-
  myNails1: require('@images/nails/myNails1.png'),                     // 缩略彩图 - 卡片4图
  myNails2: require('@images/nails/myNails2.png'),                     // 缩略彩图 - 卡片4图
  myNails3: require('@images/nails/myNails3.png'),                     // 缩略彩图 - 卡片4图
  myNails4: require('@images/nails/myNails4.png'),                     // 缩略彩图 - 卡片4图

  // 原子菜单占位图
  topNav: require('@images/placeholder/img_homeplace_nav@2x.png'),                // 占位图 - 顶部导航
  topTab: require('@images/placeholder/img_homeplace_menu@2x.png'),               // 占位图 - 顶部tab分页
  bigBanner: require('@images/placeholder/img_homeplace_bigbanner@2x.png'),       // 占位图 - 大banner
  king: require('@images/placeholder/img_homeplace_jingang@2x.png'),              // 占位图 - 金刚区
  smallBanner: require('@images/placeholder/img_homeplace_smallbanner@2x.png'),   // 占位图 - 小banner
  bottomTab: require('@images/placeholder/img_homeplace_tabpaging@2x.png'),       // 占位图 - 商品tab列表
  card1p: require('@images/placeholder/img_homeplace_deduction@2x.png'),          // 占位图 - 卡片1图
  card3p: require('@images/placeholder/img_homeplace_deduction3@2x.png'),         // 占位图 - 卡片3图
  card4p: require('@images/placeholder/img_homeplace_card2@2x.png'),              // 占位图 - 卡片4图

  tabPage: require('@images/placeholder/tabPage.png'),                             // 占位图 - tab分页
  bannerNew: require('@images/placeholder/bannerNew.png'),                        // 占位图 - banner新
  classifyType: require('@images/placeholder/classifyType.png'),                             // 占位图 - 分类
  bottomNav: require('@images/placeholder/img_homeplace_tabbar@2x.png'),          // 占位图 - 底部导航

  // 操作图标
  upIcon: require('@images/ic_webhome_up@2x.png'),                                // 操作图标 - 上移
  downIcon: require('@images/ic_webhome_down@2x.png'),                            // 操作图标 - 下移
  editIcon: require('@images/ic_webhome_edit@2x.png'),                            // 操作图标 - 编辑
  deleteIcon: require('@images/ic_webhome_delete@2x.png'),                        // 操作图标 - 删除
  arrowupIcon: require('@images/ic_webhome_totop@2x.png'),                        // 操作图标 - 上移2
  closeIcon: require('@images/ic_webhome_close@2x.png'),                          // 操作图标 - 删除2
  rightIcon: require('@images/ic_home_classification@2x.png'),                    // 顶部tab - 右侧图标


  // 其他例图
  goodsCase: require('@images/cases/goods.png'),                                  // 例图 - 商品
  leftkk: require('@images/cases/kkk.png'),                                       // 例图 - 卡片1图左侧连接


  // banner 类型
  bannerType: [
    {
      type: 1,
      name: '小banner',
    },
    {
      type: 2,
      name: '大banner',
    },
    {
      type: 3,
      name: '长banner'
    }
  ],
  // banner 位置
  bannerPosition: [
    {
      code: 'homeBanner',
      name: '桌面轮播',
    },
    {
      code: 'selfSupportHomeBanner',
      name: '自营首页',
    },
    {
      code: 'homeAdvertise',
      name: '桌面小banner',
    },
    {
      code: 'searchAdvertise',
      name: '搜索页面小banner',
    },
    {
      code: 'selfSupportSearchBanner',
      name: '自营搜索页面小banner',
    },
    {
      code: 'myAdvertise',
      name: '我的页面小banner',
    },
    {
      code: 'discoverAdvertise',
      name: '发现页小banner',
    },
  ],
}