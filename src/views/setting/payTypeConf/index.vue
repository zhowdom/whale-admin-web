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
      tabActive: 'old',
      tabs: [
        {
          label: `鲸丽生活App`,
          name: 'old',
          component: resolve => import('./old.vue').then(resolve),
          permission: ['setting:pay:list']
        },
        {
          label: '新App',
          name: 'new',
          component: resolve => import('./new.vue').then(resolve),
          permission: ['setting:pay:list']
        },
        {
          label: '小程序',
          name: 'mini',
          component: resolve => import('./mini.vue').then(resolve),
          permission: ['setting:pay:list']
        }
      ]
    }
  },
  created () {},
  methods: {}
}
</script>
