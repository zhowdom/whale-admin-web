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
      tabActive: 'foruserSetm',
      tabs: [
        {
          label: '针对用户配置',
          name: 'foruserSetm',
          component: resolve => import('./foruserSetm.vue').then(resolve),
          permission: ['member:dedicate:send:setting']
        },
        {
          label: '兑换赠送荣耀值配置',
          name: 'honourVal',
          component: resolve => import('./honourVal.vue').then(resolve),
          permission: ['task:dedicate:rate:list']
        },
      ]
    }
  },
  created () {},
  methods: {
  }
}
</script>
