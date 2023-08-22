module.exports = {
  title: 'Candy Pocket',

  /**
   * 侧边栏主题 深色主题theme-dark，浅色主题theme-light
   */
  sideTheme: 'theme-dark',

  /**
   * 是否系统布局配置
   */
  showSettings: false,

  /**
   * 是否显示 tagsView
   */
  tagsView: true,

  /**
   * 是否固定头部
   */
  fixedHeader: false,

  /**
   * 是否显示logo
   */
  sidebarLogo: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production',
  /**
   * 发布的应用市场
   * 1. app stroe  2. 苹果企业签名  3.华为市场 4.应用宝 5.oppo 6.小米
   */
  marketList: [
    {
      value: 1,
      label: 'App Stroe'
    },
    {
      value: 2,
      label: '苹果企业签名'
    },
    {
      value: 3,
      label: '华为市场'
    },
    {
      value: 4,
      label: '应用宝'
    },
    {
      value: 5,
      label: 'oppo'
    },
    {
      value: 6,
      label: '小米'
    },
  ],
}
