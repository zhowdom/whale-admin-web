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
      tabActive: 'set',
      tabs: [
        {
          label: `星级达人分红配置`,
          name: 'set',
          component: resolve => import('./set.vue').then(resolve),
          permission: ['internal:feeBonus:setting:page']
        },
        {
          label: '星级达人分红统计',
          name: 'statistic',
          component: resolve => import('./statistic.vue').then(resolve),
          permission: ['internal:feeBonus:share:stat:page']
        },
        {
          label: '星级达人分红明细',
          name: 'detail',
          component: resolve => import('./detail.vue').then(resolve),
          permission: ['internal:feeBonus:share:log:page']
        }
      ]
    }
  },
  created () {},
  methods: {
  }
}
</script>
