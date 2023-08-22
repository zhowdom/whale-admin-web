import hasRole from './hasRole'
import hasPermi from './hasPermi'
import inputFilter from './inputFilter'

const install = function(Vue) {
  Vue.directive('hasRole', hasRole);
  Vue.directive('hasPermi', hasPermi); // 在全局添加v-hasPermi的权限检测的自定义指令，不符合权限的组件不会被加载
  Vue.directive('inputFilter', inputFilter);
}

if (window.Vue) {
  // 在window对象上也添加上对于角色、权限的验证方法
  window['hasRole'] = hasRole
  window['hasPermi'] = hasPermi
  window['inputFilter'] = inputFilter
  Vue.use(install); // eslint-disable-line
}

export default install
