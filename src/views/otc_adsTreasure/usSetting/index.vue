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
      tabActive: 'usPermissionSet',
      tabs: [
        {
          label: 'U商权限配置',
          name: 'usPermissionSet',
          component: resolve => import('./usPermissionSet.vue').then(resolve),
          permission: ['otc:ubusiness_conf:list']
        },
        {
          label: 'U商发布配置',
          name: 'usPublicSet',
          component: resolve => import('./usPublicSet.vue').then(resolve),
          permission: ['otc:release_conf:list']
        },
        {
          label: 'U商购买出售配置',
          name: 'usSellBugSet',
          component: resolve => import('./usSellBugSet.vue').then(resolve),
          permission: ['otc:release_conf:list']
        },
      ]
    }
  },
  created () {},
  methods: {
  }
}
</script>
