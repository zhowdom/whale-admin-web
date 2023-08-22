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
      tabActive: 'normal',
      tabs: [
        {
          label: `常规收益提现设置`,
          name: 'normal',
          component: resolve => import('./normal.vue').then(resolve),
          permission: []
        },
        {
          label: '盲盒收益提现设置',
          name: 'blindBox',
          component: resolve => import('./blindBox.vue').then(resolve),
          permission: []
        }
      ]
    }
  },
  created () {},
  methods: {}
}
</script>
