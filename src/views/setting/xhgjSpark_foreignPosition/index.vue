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
      tabActive: 'country',
      tabs: [
        {
          label: `国家城市配置`,
          name: 'country',
          component: resolve => import('./country.vue').then(resolve),
          permission: ['abroad:district_country:page']
        },
        // {
        //   label: '区/县配置',
        //   name: 'county',
        //   component: resolve => import('./county.vue').then(resolve),
        //   permission: ['advertising:treasure:list']
        // }
      ]
    }
  },
  created () {},
  methods: {
  }
}
</script>
