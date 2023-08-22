<template>
  <div>

    <el-tabs type="border-card"
   style="margin:20px 20px 0 20px;"
    v-model="tabActive">
    <el-tab-pane
      v-for="(item, index) in tabs"
      :key="index"
      v-if="isAuth.isPermi(item.permission)"
      :label="`${item.label}`"
      :name="item.name">
        <keep-alive>
          <component v-if="tabActive === item.name" :is="item.component"></component>
        </keep-alive>
    </el-tab-pane>
  </el-tabs>
  </div>
  
</template>

<script>
export default {
  data () {
    return {
      tabActive: 'overtime',
      tabs: [
        {
          label: `超时配置`,
          name: 'overtime',
          component: resolve => import('./overtime.vue').then(resolve),
          permission: ['otc:conf:list']
        },
        {
          label: '超时未支付配置',
          name: 'unpaid',
          component: resolve => import('./unpaid.vue').then(resolve),
          permission: ['otc:conf:list']
        },
        {
          label: '恶意申诉配置',
          name: 'malice',
          component: resolve => import('./malice.vue').then(resolve),
          permission: ['otc:conf:list']
        },
        {
          label: '取消次数配置',
          name: 'cancel',
          component: resolve => import('./cancel.vue').then(resolve),
          permission: ['otc:conf:list']
        },
        {
          label: '未处理订单配置',
          name: 'todo',
          component: resolve => import('./todo.vue').then(resolve),
          permission: ['otc:conf:list']
        },
        {
          label: '服务费配置',
          name: 'charge',
          component: resolve => import('./charge.vue').then(resolve),
          permission: ['otc:conf:list']
        },
        // {
        //   label: '发布单价配置',
        //   name: 'price',
        //   component: resolve => import('./price.vue').then(resolve),
        //   permission: ['advertising:treasure:list']
        // },
        {
          label: '收款方式配置',
          name: 'payway',
          component: resolve => import('./payway.vue').then(resolve),
          permission: ['otc:conf:list']
        },
        // {
        //   label: '兑换数量配置',
        //   name: 'exchange',
        //   component: resolve => import('./exchange.vue').then(resolve),
        //   permission: ['advertising:treasure:list']
        // },
        {
          label: '开市配置',
          name: 'openMark',
          component: resolve => import('./openMark.vue').then(resolve),
          permission: ['otc:conf:list']
        },
        // {
        //   label: '短信配置',
        //   name: 'myMessage',
        //   component: resolve => import('./myMessage.vue').then(resolve),
        //   permission: ['advertising:treasure:list']
        // }
        {
          label: '广告商发布配置',
          name: 'otcPublicSet',
          component: resolve => import('./otcPublicSet.vue').then(resolve),
          permission: ['otc:release_conf:list']
        },
        {
          label: '购买出售配置',
          name: 'otcSellBugSet',
          component: resolve => import('./otcSellBugSet.vue').then(resolve),
          permission: ['otc:buy_sale_conf:list']
        },
        {
          label: 'OTC权限配置',
          name: 'otcPermissionSet',
          component: resolve => import('./otcPermissionSet.vue').then(resolve),
          permission: ['otc:conf:list']
        }
      ]
    }
  },
  created () {},
  methods: {
  }
}
</script>
