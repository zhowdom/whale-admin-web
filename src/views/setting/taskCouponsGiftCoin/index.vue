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
      tabActive: 'exchangeCoinSet',
      tabs: [
        {
          label: `兑换赠送币配置`,
          name: 'exchangeCoinSet',
          component: resolve => import('./exchangeCoinSet.vue').then(resolve),
          permission: ['setting:start_page_v2:query']
        },
        {
          label: '针对用户配置',
          name: 'forUserSet',
          component: resolve => import('./forUserSet.vue').then(resolve),
          permission: ['setting:start_page_v2:query']
        }
      ]
    }
  },
  created () {},
  methods: {}
}
</script>
