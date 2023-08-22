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
      tabActive: 'lockSummary',
      tabs: [
        {
          label: `锁仓汇总`,
          name: 'lockSummary',
          component: resolve => import('./lockSummary.vue').then(resolve),
          permission: ['coin:lock_release_record:page']
        },
        {
          label: `锁仓明细`,
          name: 'lockDetial',
          component: resolve => import('./lockDetial.vue').then(resolve),
          permission: ['coin:lock_release_record:page']
        },
        // {
        //   label: '可用明细',
        //   name: 'useableDetial',
        //   component: resolve => import('./useableDetial.vue').then(resolve),
        //   permission: ['']
        // }
      ]
    }
  },
  created () {},
  methods: {
  }
}
</script>
