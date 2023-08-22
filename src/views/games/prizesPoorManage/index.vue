<template>
  <div class="prizesPoorManageBox">
    <div class="popoBoxs">
      <ul>
        <li>
          <p>
            可分配奖池(Candy)
            <el-tooltip placement="top">
              <div slot="content">
                可分配奖池  = Candy管理-手续费分红(奖池分红) + 累计兑换(Candy) + 可分配奖池注入 +每期底注 + 上期未分配置奖池- 每期奖池
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </p>
          <h3 style="text-align:center;">{{bigStatistic.apportionTotal === null ? '--' : bigStatistic.apportionTotal}}</h3>
        </li>
        <li>
          <p>
            累计兑换(Candy)
            <el-tooltip placement="top">
              <div slot="content">
                统计参与游戏,兑换奖码所支付Candy的数量
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </p>
          <h3 style="text-align:center;">{{bigStatistic.total === null ? '--' : bigStatistic.total}}</h3>
        </li>
        <li>
          <p>
            奖池分红(Candy)
            <el-tooltip placement="top">
              <div slot="content">
                取值路径: Candy管理 - 手续费分红 - 奖池分红
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </p>
          <h3 style="text-align:center;">{{bigStatistic.shareTotal === null ? '--' : bigStatistic.shareTotal}}</h3>
        </li>
        <li>
          <p>
            累计可分配奖池注入(Candy)
            <el-tooltip placement="top">
              <div slot="content">
                是指,注入可分配奖池,为增加额
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </p>
          <h3 style="text-align:center;">{{bigStatistic.injectTotal === null ? '--' : bigStatistic.injectTotal}}</h3>
        </li>
        <li>
          <p>
            累计每期注入(Candy)
            <el-tooltip placement="top">
              <div slot="content">
                是指注入每期奖池,从可分配奖池中扣减
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </p>
          <h3 style="text-align:center;">{{bigStatistic.periodsInjectTotal === null ? '--' : bigStatistic.periodsInjectTotal}}</h3>
        </li>
      </ul>
    </div>


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
  </div>
  
</template>

<script>
import { zzJoyPoorManaStatistics } from "@/api/games";
// 夺宝游戏：table每行查看点击按钮的详情页
export default {
  data () {
    return {
      bigStatistic: {
        apportionTotal: 0,
        injectTotal: 0,
        periodsInjectTotal: 0,
        shareTotal: 0,
        total: 0
      },
      tabActive: 'totalSwitch',
      tabs: [
        {
          label: `累计兑换`,
          name: 'totalSwitch',
          component: resolve => import('./totalSwitch.vue').then(resolve),
          permission: []
        },
        {
          label: '奖池分红',
          name: 'poorRedback',
          component: resolve => import('./poorRedback.vue').then(resolve),
          permission: []
        },
        {
          label: '可分配奖池注入',
          name: 'handleInject',
          component: resolve => import('./handleInject.vue').then(resolve),
          permission: []
        },
        {
          label: '每期注入',
          name: 'everyIssueInject',
          component: resolve => import('./everyIssueInject.vue').then(resolve),
          permission: []
        },
        {
          label: '每期底注',
          name: 'everyDownInject',
          component: resolve => import('./everyDownInject.vue').then(resolve),
          permission: []
        }
      ]
    }
  },
  created () {
    zzJoyPoorManaStatistics().then(response => {
      if (+response.code === 200) {
        this.bigStatistic = {
          apportionTotal: response.data.apportionTotal,
          injectTotal: response.data.injectTotal,
          periodsInjectTotal: response.data.periodsInjectTotal,
          shareTotal: response.data.shareTotal,
          total: response.data.total
        }
      } else {
        this.$message.error(response.message)
      }
    })
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.prizesPoorManageBox{

  .popoBoxs{
    padding-left:20px;
    padding-top: 20px;
      ul{
        padding: 0;
        margin: 0;
      }
      li{
        border: 1px solid #ccc;
        display: inline-block;
        border-radius:5px;
        padding: 16px;
        margin-right:30px;
        p,h3{
          margin:0;
          padding: 0;
        }
        h3{
          padding-top: 6px;
        }
      }
    }
}
</style>
