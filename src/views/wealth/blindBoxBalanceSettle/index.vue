<template>
  <div class="bbStatisticBox">
    <div class="popoBoxs">
      <!-- <h3 class="gmTitlebox">报表分析</h3> -->
      <el-form :model="otParams" ref="nLevelqueryForm" :inline="true">
      <el-form-item label="日期" prop="redbacktime">
        <el-date-picker
          v-model="otParams.redbacktime"
          type="daterange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="otSearch" type="primary" icon="el-icon-search">查询</el-button>
      </el-form-item>
    </el-form>
      <ul>
        <li>
          <p>
            结算中（USDT）
          </p>
          <h3 style="text-align:center;">{{bigStatistic.waitAmount === null ? '--' : bigStatistic.waitAmount}}</h3>
        </li>
        <li>
          <p>
            结算失败（USDT）
          </p>
          <h3 style="text-align:center;">{{bigStatistic.amountError === null ? '--' : bigStatistic.amountError}}</h3>
        </li>
        <li>
          <p>
            结算成功（USDT）
          </p>
          <h3 style="text-align:center;">{{bigStatistic.amountSuccess === null ? '--' : bigStatistic.amountSuccess}}</h3>
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
            <component v-if="tabActive === item.name" :is="item.component" @copyMsgFromChild="copyMsgFromChild($event)"></component>
        </el-tab-pane>
      </el-tabs>
  </div>
</template>

<script>
import { blindBoxSettlementTofu, blindBoxTFstatistics } from "@/api/games";
// 夺宝游戏：table每行查看点击按钮的详情页
export default {
  data () {
    return {
      bigStatistic: {
        amountError: 0,
        amountSuccess: 0,
        waitAmount: 0
      },
      otParams: {
        redbacktime: ''
      },
      tabActive: 'pending',
      tabs: [
        {
          label: `结算中`,
          name: 'pending',
          component: resolve => import('./pending.vue').then(resolve),
          permission: []
        },
        {
          label: '结算失败',
          name: 'reject',
          component: resolve => import('./reject.vue').then(resolve),
          permission: []
        },
        {
          label: '结算成功',
          name: 'fulfilled',
          component: resolve => import('./fulfilled.vue').then(resolve),
          permission: []
        }
      ]
    }
  },
  created () {
    this.otSearch()
  },
  methods: {
    copyMsgFromChild (ev) {
      this.tabs[0].label = `结算中(${ev.waitAmount || 0}USDT)`
      this.tabs[1].label = `结算失败(${ev.amountError || 0}USDT)`
      this.tabs[2].label = `结算成功(${ev.amountSuccess || 0}USDT)`
    },
    otSearch () {
      // todo...
      let datetime = []
      datetime = this.otParams.redbacktime
      let _params = {
        updateEndTime: datetime ? this.$dayjs(datetime[1]).format('YYYY-MM-DD') : '',
        updateStartTime: datetime ? this.$dayjs(datetime[0]).format('YYYY-MM-DD') : '',
      }
      this.loading = true
      blindBoxSettlementTofu(_params).then(response => {
        if (response.code === 200) {
          this.bigStatistic = {
            amountError: response.data.amountError || 0,
            amountSuccess: response.data.amountSuccess || 0,
            waitAmount: response.data.waitAmount || 0,
          }
        } else {
          this.bigStatistic = {
            amountError: 0,
            amountSuccess: 0,
            waitAmount: 0
          }
        }
      }).catch(e => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.bbStatisticBox {
  .gmTitlebox{
    position: relative;
    padding-left: 20px;
    &::after{
      position: absolute;
      left: 0;
      top:6px;
      content: '';
      height: 10px;
      width:3px;
      background: red;
    }
  }
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
