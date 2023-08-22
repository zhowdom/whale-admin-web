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
        <el-button @click="otSearch" v-hasPermi="['game:lottery:pool:getByPage']" type="primary" icon="el-icon-search">查询</el-button>
      </el-form-item>
    </el-form>
      <ul>
        <li>
          <p>
            支付宝待退还（USDT）
          </p>
          <h3 style="text-align:center;">{{bigStatistic.aliPayWaitPrice === null ? '--' : bigStatistic.aliPayWaitPrice}}</h3>
        </li>
        <li>
          <p>
            支付宝已退还（USDT）
          </p>
          <h3 style="text-align:center;">{{bigStatistic.aliPayReturnPrice === null ? '--' : bigStatistic.aliPayReturnPrice}}</h3>
        </li>
        <li>
          <p>
            微信待退还（USDT）
          </p>
          <h3 style="text-align:center;">{{bigStatistic.weChatWaitPrice === null ? '--' : bigStatistic.weChatWaitPrice}}</h3>
        </li>
        <li>
          <p>
            微信已退还（USDT）
          </p>
          <h3 style="text-align:center;">{{bigStatistic.weChatReturnPrice === null ? '--' : bigStatistic.weChatReturnPrice}}</h3>
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
import { blindBoxTFstatistics } from "@/api/games";
// 夺宝游戏：table每行查看点击按钮的详情页
export default {
  data () {
    return {
      bigStatistic: {
        aliPayReturnPrice: 0,
        aliPayWaitPrice: 0,
        weChatReturnPrice: 0,
        weChatWaitPrice: 0
      },
      otParams: {
        redbacktime: ''
      },
      tabActive: 'willAudit',
      tabs: [
        {
          label: `待审核`,
          name: 'willAudit',
          component: resolve => import('./willAudit.vue').then(resolve),
          permission: []
        },
        {
          label: '审核失败',
          name: 'auditFail',
          component: resolve => import('./auditFail.vue').then(resolve),
          permission: []
        },
        {
          label: '转账失败',
          name: 'transferFail',
          component: resolve => import('./transferFail.vue').then(resolve),
          permission: []
        },
        {
          label: '转账成功',
          name: 'transferSuccess',
          component: resolve => import('./transferSuccess.vue').then(resolve),
          permission: []
        },
        {
          label: '全部',
          name: 'all',
          component: resolve => import('./all.vue').then(resolve),
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
      this.tabs[0].label = `待审核(${ev.waitAuditAmount || 0})`
      this.tabs[1].label = `审核失败(${ev.auditErrorAmount || 0})`
      this.tabs[2].label = `转账失败(${ev.transferErrorAmount || 0})`
      this.tabs[3].label = `转账成功(${ev.transferSuccessAmount || 0})`
      this.tabs[4].label = `全部(${ev.allInAmount || 0})`
    },
    otSearch () {
      // todo...
      let datetime = []
      datetime = this.otParams.redbacktime
      let _params = {
        endTime: datetime ? this.$dayjs(datetime[1]).format('YYYY-MM-DD') : '',
        startTime: datetime ? this.$dayjs(datetime[0]).format('YYYY-MM-DD') : '',
      }
      blindBoxTFstatistics(_params).then(response => {
        if (response.code === 200) {
          this.bigStatistic = {
            aliPayReturnPrice: response.data.aliPayReturnPrice || 0,
            aliPayWaitPrice: response.data.aliPayWaitPrice || 0,
            weChatReturnPrice: response.data.weChatReturnPrice || 0,
            weChatWaitPrice: response.data.weChatWaitPrice || 0
          }
        } else {
          this.bigStatistic = {
            aliPayReturnPrice: 0,
            aliPayWaitPrice: 0,
            weChatReturnPrice: 0,
            weChatWaitPrice: 0
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
