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
      tabActive: 'releaseSet',
      tabs: [
        {
          label: `锁仓释放配置`,
          name: 'releaseSet',
          component: resolve => import('./releaseSet.vue').then(resolve),
          permission: ['coin:lock_release_conf:page']
        },
        // {
        //   label: '可用生息配置',
        //   name: 'useableSet',
        //   component: resolve => import('./useableSet.vue').then(resolve),
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
