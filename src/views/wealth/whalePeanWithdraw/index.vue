<template>
  <el-tabs type="border-card"
   style="margin:20px 20px 0 20px;"
    v-model="tabActive">
    <el-tab-pane
      v-for="(item, index) in tabs"
      :key="index"
      v-if="item.name !== 'all' && isAuth.isPermi(item.permission)"
      :label="`${item.label}(${countMap[item.name]})`"
      :name="item.name">
        <keep-alive>
          <component v-if="tabActive === item.name" :is="item.component"></component>
        </keep-alive>
    </el-tab-pane>
    <el-tab-pane
      v-for="(item, index) in tabs"
      :key="index"
      v-if="item.name === 'all' && isAuth.isPermi(item.permission)"
      :label="item.label"
      :name="item.name">
        <keep-alive>
          <component v-if="tabActive === item.name && isAuth.isPermi(item.permission)" :is="item.component"></component>
        </keep-alive>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { withdrawCount } from "@/api/wealth/withdrawSet";
export default {
  data () {
    return {
      tabActive: 'waitingAuditCount',
      tabs: [
        {
          label: `待审核`,
          name: 'waitingAuditCount',
          component: resolve => import('./willAudit.vue').then(resolve),
          permission: ['financial:withdraw:withdrawPage']
        },
        {
          label: '审核失败',
          name: 'auditNotPassedCount',
          component: resolve => import('./failedAudit.vue').then(resolve),
          permission: ['financial:withdraw:withdrawPage']
        },
        {
          label: '转账失败',
          name: 'payFailedCount',
          component: resolve => import('./failedTransfer.vue').then(resolve),
          permission: ['financial:withdraw:withdrawPage']
        },
        {
          label: '转账成功',
          name: 'paySuccessCount',
          component: resolve => import('./successesTransfer.vue').then(resolve),
          permission: ['financial:withdraw:withdrawPage']
        },
        {
          label: '全部',
          name: 'all',
          component: resolve => import('./all.vue').then(resolve),
          permission: ['financial:withdraw:withdrawPage']
        }
      ],
      countMap: {
        waitingAuditCount: 0, // 待审核
        auditNotPassedCount: 0, // 审核失败
        payFailedCount: 0, // 转账失败
        paySuccessCount: 0 // 转账成功
      }
    }
  },
  created () {
    withdrawCount().then((response) => {
      if (response.code === 200) {
        this.countMap = response.data
      } else {
        this.$message.error(response.message)
      }
    }).catch(({ error }) => {
      if (error) this.$message.error(error.message)
    })
  },
  methods: {
  }
}
</script>
