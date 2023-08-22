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
      tabActive: 'month',
      tabs: [
        {
          label: `手续费月统计`,
          name: 'month',
          component: resolve => import('./month.vue').then(resolve),
          permission: ['internal:platformFee:stat:statOfMonthPage']
        },
        {
          label: '手续费来源统计',
          name: 'origin',
          component: resolve => import('./origin.vue').then(resolve),
          permission: ['internal:platformFee:stat:sourcePage']
        },
        {
          label: '手续费总统计',
          name: 'total',
          component: resolve => import('./total.vue').then(resolve),
          permission: ['internal:platformFee:stat:totalStatPage']
        }
      ]
    }
  },
  created () {},
  methods: {
  }
}
</script>
