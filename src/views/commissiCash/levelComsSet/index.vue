<template>
  <div>
    <!-- <p style="padding-left:20px;">CPS 与自营用户身份管理</p>
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
  </el-tabs> -->

  <p style="padding-left:20px;padding-top:20px;">魔力盲盒用户身份管理</p>
  <el-tabs type="border-card"
   style="margin:20px 20px 0 20px;"
    v-model="tabActive_blindBox">
    <el-tab-pane
      v-for="(item, index) in tabs_blindBox"
      :key="index"
      v-if="isAuth.isPermi(item.permission)"
      :label="`${item.label}`"
      :name="item.name">
        <keep-alive>
          <component v-if="tabActive_blindBox === item.name" :is="item.component"></component>
        </keep-alive>
    </el-tab-pane>
  </el-tabs>
  </div>
  
</template>

<script>
export default {
  data () {
    return {
      tabActive: 'partner',
      tabs: [
        {
          label: `合伙人`,
          name: 'partner',
          component: resolve => import('./partner.vue').then(resolve),
          permission: ['commission:plus:get']
        },
        {
          label: '团长',
          name: 'leader',
          component: resolve => import('./leader.vue').then(resolve),
          permission: ['commission:plus:get']
        },
        {
          label: '高级团长',
          name: 'seniorLeader',
          component: resolve => import('./seniorLeader.vue').then(resolve),
          permission: ['commission:plus:get']
        }
      ],
      tabActive_blindBox: 'partner_blindBox',
      tabs_blindBox: [
        {
          label: `合伙人`,
          name: 'partner_blindBox',
          component: resolve => import('./partner_blindBox.vue').then(resolve),
          permission: ['commission:plus:get']
        },
        {
          label: '团长',
          name: 'leader_blindBox',
          component: resolve => import('./leader_blindBox.vue').then(resolve),
          permission: ['commission:plus:get']
        },
        {
          label: '高级团长',
          name: 'seniorLeader_blindBox',
          component: resolve => import('./seniorLeader_blindBox.vue').then(resolve),
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
