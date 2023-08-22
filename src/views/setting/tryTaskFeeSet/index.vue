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
      tabActive: 'practiceTaskFee',
      tabs: [
        {
          label: `试练任务费用`,
          name: 'practiceTaskFee',
          component: resolve => import('./practiceTaskFee.vue').then(resolve),
          permission: ['otc:conf:list']
        },
        {
          label: '试练任务奖励',
          name: 'practiceTaskBouns',
          component: resolve => import('./practiceTaskBouns.vue').then(resolve),
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
