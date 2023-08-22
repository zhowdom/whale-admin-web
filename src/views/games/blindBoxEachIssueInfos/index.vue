<template>
  <div class="prizesPoorManageBox">
    <div class="popoBoxs">
      <h3 class="gmTitlebox">报表分析，盲盒编号：{{URL_blindBoxNo}}</h3>
      <el-form :model="nLevelqueryParams" ref="nLevelqueryForm" :inline="true">
        <el-form-item label="日期" prop="redbacktime">
          <el-date-picker
            v-model="nLevelqueryParams.redbacktime"
            type="daterange"
            value-format="timestamp"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" :loading="topLoading" @click="searchTop">查询</el-button>
        </el-form-item>
      </el-form>
      <ul>
        <li>
          <p>
            盈亏(Candy)
            <el-tooltip placement="top">
              <div slot="content">
                盈亏 = 支付Candy + 收益Candy - 退还Candy
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </p>
          <h3 style="text-align:center;">{{bigStatistic.whalePeas === null ? '--' : bigStatistic.whalePeas}}</h3>
        </li>
        <li>
          <p>
            收益（USDT）
            <el-tooltip placement="top">
              <div slot="content">
                1. 收益=总抢购额现金部分 -  退还(现金部分（包括Candy抵扣的现金 ）)-参与补贴 - 持券收益 - 服务商收益 -平台分佣<br>
                2. 此处暂不统计实物成本<br>
                3. 针对于"Candy抵扣" 退还是否为退还现金，如果当前期状态为 "抢购失败"，即原路退回 ；否则退还等值现金
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </p>
          <h3 style="text-align:center;">{{bigStatistic.profit === null ? '--' : bigStatistic.profit}}</h3>
        </li>
        <li>
          <p>
            赠送奖励(Candy)
            <el-tooltip placement="top">
              <div slot="content">
                1. 赠送奖励是指，赠送的任务券预计产出的Candy的累计<br>
                2.只需统计发放任务券时预计产出的Candy；中途已失效的不作处理
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </p>
          <h3 style="text-align:center;">{{bigStatistic.giveAward === null ? '--' : bigStatistic.giveAward}}</h3>
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
import { blindBoxStatisticsList, zzJoyPoorManaStatistics } from "@/api/games";
// 夺宝游戏：table每行查看点击按钮的详情页
export default {
  data () {
    return {
      URL_blindBoxNo: '',
      topLoading: false,
      nLevelqueryParams: {
        code: '',
        name: '',
        phone: '',
        memberId: '',
        realName: '',
        periodsNum: '',
        redbacktime: ''
      },
      bigStatistic: {
        giveAward: 0,
        profit: 0,
        whalePeas: 0
      },
      tabActive: 'willOpen',
      tabs: [
        {
          label: `待解封盒机`,
          name: 'willOpen',
          component: resolve => import('./willOpen.vue').then(resolve),
          permission: []
        },
        {
          label: '已解封盒机',
          name: 'opened',
          component: resolve => import('./opened.vue').then(resolve),
          permission: []
        },
        {
          label: '赠送奖励',
          name: 'bonus',
          component: resolve => import('./bonus.vue').then(resolve),
          permission: []
        },
        {
          label: '收益明细',
          name: 'profitDetail',
          component: resolve => import('./profitDetail.vue').then(resolve),
          permission: []
        },
        {
          label: '抢购明细',
          name: 'bugDetail',
          component: resolve => import('./bugDetail.vue').then(resolve),
          permission: []
        },
        {
          label: '赠送VIP券',
          name: 'vip',
          component: resolve => import('./vip.vue').then(resolve),
          permission: []
        },
        {
          label: '管制分',
          name: 'control',
          component: resolve => import('./control.vue').then(resolve),
          permission: []
        },
        {
          label: '可参与',
          name: 'couldJoin',
          component: resolve => import('./couldJoin.vue').then(resolve),
          permission: []
        },
        {
          label: '机器人抢购统计',
          name: 'robot',
          component: resolve => import('./robot.vue').then(resolve),
          permission: []
        },
        {
          label: '赠送荣耀值',
          name: 'contribute',
          component: resolve => import('./contribute.vue').then(resolve),
          permission: []
        },
        {
          label: '赠送Pizza',
          name: 'bonusPizza',
          component: resolve => import('./bonusPizza.vue').then(resolve),
          permission: ['product:coin_record:page']
        },
        {
          label: '赠送代币',
          name: 'commongivecoinComp',
          component: resolve => import('./commongivecoinComp.vue').then(resolve),
          permission: ['product:coin_record:page']
        }
      ]
    }
  },
  created () {
    this.URL_blindBoxNo = this.$route.query.blindBoxNo
    this.searchTop()
  },
  methods: {
    searchTop () {
      this.topLoading = true
      let datetime = []
      datetime = this.nLevelqueryParams.redbacktime
      blindBoxStatisticsList({
        blindBoxNo: this.$route.query.blindBoxNo,
        blindBoxType: this.$route.query.blindBoxType,
        endTime: datetime ? this.$dayjs(datetime[1]).format('YYYY-MM-DD') : '',
        startTime: datetime ? this.$dayjs(datetime[0]).format('YYYY-MM-DD') : '',
      }).then(response => {
        if (+response.code === 200) {
          this.bigStatistic = {
            giveAward: response.data.giveAward || 0,
            profit: response.data.profit || 0,
            whalePeas: response.data.whalePeas || 0
          }
        } else {
          this.bigStatistic = {
            giveAward: 0,
            profit: 0,
            whalePeas: 0
          }
        }
        this.topLoading = false
      }).catch(e => {
        this.topLoading = false
      })
    }
  }
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
