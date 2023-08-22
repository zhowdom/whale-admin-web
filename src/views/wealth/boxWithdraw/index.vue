<template>
  <el-tabs class="box-withdraw" type="border-card" v-model="tabActive" @tab-click="changeTabHandle">
    <template v-for="({name, label, status, component, permission}, index) in tabs">
      <el-tab-pane
        :key="index"
        :name="name"
        v-if="isAuth.isPermi(permission)"
        :label="name=='all'?label:`${label}（${count(status)}）`">
          <component v-if="tabActive==name" :is="component" @update="updateHandle"></component>
      </el-tab-pane>
    </template>
  </el-tabs>
</template>

<script>
import { statistic } from "@/api/wealth/boxWithdraw";

export default {
  name: 'BoxWithdraw',
  data () {
    return {
      tabActive: 'waitingAuditCount',
      tabs: [
        {
          status: 1,
          label: `待审核`,
          name: 'waitingAuditCount',
          component: resolve => import('./willAudit.vue').then(resolve),
          permission: ['financial:blindBoxWithdraw:page']
        },
        {
          status: 2,
          label: '审核失败',
          name: 'auditNotPassedCount',
          component: resolve => import('./failedAudit.vue').then(resolve),
          permission: ['financial:blindBoxWithdraw:page']
        },
        {
          status: 3,
          label: '打款中',
          name: 'auditCounting',
          component: resolve => import('./auditCounting.vue').then(resolve),
          permission: ['financial:blindBoxWithdraw:page']
        },
        {
          status: 5,
          label: '转账失败',
          name: 'payFailedCount',
          component: resolve => import('./failedTransfer.vue').then(resolve),
          permission: ['financial:blindBoxWithdraw:page']
        },
        {
          status: 4,
          label: '转账成功',
          name: 'paySuccessCount',
          component: resolve => import('./succeedTransfer.vue').then(resolve),
          permission: ['financial:blindBoxWithdraw:page']
        },
        {
          status: null,
          label: '全部',
          name: 'all',
          component: resolve => import('./all.vue').then(resolve),
          permission: ['financial:blindBoxWithdraw:page']
        }
      ],
      statusList: [],
    }
  },
  computed: {
    count() {
      return sts => {
        let num = 0;
        this.statusList?.some(({status, count}) => {
          if (status == sts) {
            num = count || 0;
            return true;
          }
        });

        return num;
      }
    }
  },
  created () {
    let permi = ['financial:blindBoxWithdraw:statistics']; // 状态统计权限
    this.isAuth.isPermi(permi) && this.getStateReq();
  },
  methods: {
    // 更新状态数据
    updateHandle() {
      this.getStateReq();
    },
    // tab切换更新状态数据
    changeTabHandle() {
      this.getStateReq();
    },
    // 获取状态数据
    async getStateReq() {
      try {
        const {code, data, message} = await statistic();

        if (code == 200) {
          this.statusList = data?.list || [];
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        throw error;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .box-withdraw {
    margin:20px 20px 0 20px;
  }
</style>
