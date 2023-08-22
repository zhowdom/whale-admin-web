<template>
  <el-tabs type="border-card"
   style="margin:20px 20px 0 20px;"
    v-model="tabActive">
    <el-tab-pane
      v-for="(item, index) in tabs"
      :key="index"
      :label="`${item.label}`"
      :name="item.name">
        <keep-alive>
          <component v-if="tabActive === item.name" :is="item.component"></component>
        </keep-alive>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
// 夺宝游戏：table每行查看点击按钮的详情页
export default {
  data () {
    return {
      tabActive: 'rule',
      tabs: [
        {
          label: `每期商品规则`,
          name: 'rule',
          component: resolve => import('./rule.vue').then(resolve),
          permission: []
        },
        {
          label: '夺宝记录',
          name: 'log',
          component: resolve => import('./log.vue').then(resolve),
          permission: []
        },
        {
          label: '奖品发放管理',
          name: 'prize',
          component: resolve => import('./prize.vue').then(resolve),
          permission: []
        }
      ]
    }
  },
  created () {},
  methods: {}
}
</script>
