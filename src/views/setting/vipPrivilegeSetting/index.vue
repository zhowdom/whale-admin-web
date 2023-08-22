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
      tabActive: 'vipRightSet',
      tabs: [
        {
          label: 'VIP赠送权益配置',
          name: 'vipRightSet',
          component: resolve => import('./vipRightSet.vue').then(resolve),
          permission: ['advertising:treasure:list']
        },
        {
          label: '赠送代币配置',
          name: 'giveDaiCoin',
          component: resolve => import('./giveDaiCoin.vue').then(resolve),
          permission: ['vip:buy_give:page']
        },
        {
          label: '赠送任务券配置',
          name: 'giveTaskSet',
          component: resolve => import('./giveTaskSet.vue').then(resolve),
          permission: ['advertising:treasure:list']
        },
        {
          label: 'VIP任务券配置',
          name: 'vipTaskSet',
          component: resolve => import('./vipTicket/index.vue').then(resolve),
          permission: ['advertising:treasure:list']
        }
      ]
    }
  },
  created () {},
  methods: {
  }
}
</script>
