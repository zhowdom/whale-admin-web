<template>
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
</template>

<script>
export default {
  data () {
    return {
      tabActive: 'levelSt',
      tabs: [
        {
          label: `等级分佣配置`,
          name: 'levelSt',
          component: resolve => import('./levelSt.vue').then(resolve),
          permission: ['commission:plus:get']
        },
        {
          label: '自营平台分佣配置',
          name: 'selfSt',
          component: resolve => import('./selfSt.vue').then(resolve),
          permission: ['commission:plus:get']
        }
      ]
    }
  },
  created () {},
  methods: {
  }
}
</script>
