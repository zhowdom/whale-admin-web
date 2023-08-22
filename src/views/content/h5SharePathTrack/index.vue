<template>
  <div class="prizesPoorManageBox">

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
import { zzJoyPoorManaStatistics } from "@/api/games";
export default {
  data () {
    return {
      tabActive: 'life',
      tabs: [
        {
          label: `鲸丽生活`,
          name: 'life',
          component: resolve => import('./life.vue').then(resolve),
          permission: ['member:sharerecord:page']
        },
        {
          label: '新APP',
          name: 'newApp',
          component: resolve => import('./newApp.vue').then(resolve),
          permission: ['member:sharerecord:page']
        },
        {
          label: '小程序',
          name: 'mini',
          component: resolve => import('./mini.vue').then(resolve),
          permission: ['member:sharerecord:page']
        }
      ]
    }
  },
  created () {},
  methods: {}
}
</script>
<style lang="scss" scoped></style>
