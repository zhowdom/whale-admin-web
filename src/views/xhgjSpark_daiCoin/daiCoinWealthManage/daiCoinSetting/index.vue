<template>
  <div>

    <el-tabs type="border-card"
   style="margin:20px 20px 0 20px;"
    v-model="tabActive">
    <template v-for="(item, index) in tabs">
      <el-tab-pane
        :key="index"
        v-if="isAuth.isPermi(item.permission)"
        :label="`${item.label}`"
        :name="item.name">
          <keep-alive>
            <component v-if="tabActive === item.name" :is="item.component"></component>
          </keep-alive>
      </el-tab-pane>
    </template>
  </el-tabs>
  </div>
  
</template>

<script>
export default {
  data () {
    return {
      tabActive: 'contractManage',
      tabs: [
        // {
        //   label: `USDT提现配置`,
        //   name: 'usdt',
        //   component: resolve => import('./usdt.vue').then(resolve),
        //   permission: ['advertising:treasure:list']
        // },
        {
          label: `合约管理`,
          name: 'contractManage',
          component: resolve => import('./contractManage.vue').then(resolve),
          permission: ['wallet:contract:page']
        },
        {
          label: `代币配置`,
          name: 'tokensConfig',
          component: resolve => import('./tokensConfig.vue').then(resolve),
          permission: ['wallet:coin:config:settings:page']
        },
        // {
        //   label: '转账网络配置',
        //   name: 'transfer',
        //   component: resolve => import('./transfer.vue').then(resolve),
        //   permission: ['advertising:treasure:list']
        // },
        // {
        //   label: '资金归集配置',
        //   name: 'cashsweep',
        //   component: resolve => import('./cashsweep.vue').then(resolve),
        //   permission: ['wallet:config:collect:page']
        // },
        {
          label: '功能配置',
          name: 'rechargeTransfer',
          component: resolve => import('./rechargeTransfer.vue').then(resolve),
          permission: ['wallet:config:collect:page'] // fake permission.Need repalce really permission
        },
        {
          label: '区块链转账配置',
          name: 'blockchain',
          component: resolve => import('./blockchain.vue').then(resolve),
          permission: ['wallet:coin:config:settings:cost:page']
        },
        {
          label: '平台转账配置',
          name: 'platform',
          component: resolve => import('./platform.vue').then(resolve),
          permission: ['whale:platform_transfer:page']
        },
        {
          label: '闪兑币对配置',
          name: 'flashExCurrency',
          component: resolve => import('./flashExCurrency.vue').then(resolve),
          permission: ['whale:exchange_rule:page']
        },
        {
          label: '闪兑配置',
          name: 'flashExchange',
          component: resolve => import('./flashExchange.vue').then(resolve),
          permission: ['whale:exchange_setting:page']
        },
        {
          label: '兑换币对配置',
          name: 'exchangeCurrencyConfig',
          component: resolve => import('./exchangeCurrencyConfig.vue').then(resolve),
          permission: ['whale:exchange_dh_rule:page']
        },
        {
          label: '兑换配置',
          name: 'exchangeConfig',
          component: resolve => import('./exchangeConfig.vue').then(resolve),
          permission: ['whale:exchange_dh_setting:page']
        },
      ]
    }
  },
  created () {},
  methods: {
  }
}
</script>
