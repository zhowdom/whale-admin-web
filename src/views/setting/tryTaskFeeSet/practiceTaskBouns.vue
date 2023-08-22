<template>
  <div class="tryTaskFeeSetBox" style="padding:30px;">
    <div class="topperBox clearfix">
      <div class="fl">试练任务奖励：</div>
      <div class="fl">
        <ul>
          <li style="margin-bottom:10px;">
            <span>试练任务奖励分配比例</span>
            <el-input-number v-model="percent1" :precision="2" :min="0" :max="100" :step="1" controls-position="right" style="width:259px;margin-left:10px;"></el-input-number>
            <span style="margin-left:10px;">%</span>
          </li>
          <li style="margin-bottom:10px;">
            <span>直邀糖果包奖励比例</span>
            <el-input-number v-model="percent2" :precision="2" :min="0" :max="100" :step="1" controls-position="right" style="width:259px;margin-left:10px;"></el-input-number>
            <span style="margin-left:10px;">%</span>
          </li>
          <li style="margin-bottom:10px;">
            <span>间邀糖果包奖励比例</span>
            <el-input-number v-model="percent3" :precision="2" :min="0" :max="100" :step="1" controls-position="right" style="width:259px;margin-left:10px;"></el-input-number>
           <span style="margin-left:10px;">%</span>
          </li>
        </ul>
        <p style="font-size:13px;color:#3c3c3c;margin-left:63px;">
          注:<br>
            1. 以上输入框，均为百分比单位，可以为小数，小数点后2位；最大100，正整数；<br>
            2. 可以为 0 ，即奖励分配金额为 0 ，<br>
            3. 试练奖励分配金额  = 试练任务费用 * 试练任务奖励分配比例<br>
            4. 直邀糖果包奖励 = 试练奖励分配金额 * 直邀糖果包奖励比例<br>
            5. 间邀糖果包奖励 = 试练奖励分配金额 * 间邀糖果包奖励比例<br>
            6. 【Candy 资产】或【USDT资产】多一个类型 【直邀糖果包奖励 】【间邀糖果包奖励 】<br>
            7. 直邀：是指直接邀请，假设 A 邀请 B ，则 B 是 A 的直邀下级，B-A<br>
            8. 间邀：是指直邀下级B 再邀请 C ；则 C 是 B 的直邀下级 C-B， C是A的间邀下级  C-B-A<br>
            例：<br>
            假设：试练任务费用配置为 100 USDT ; 试练任务奖励分配比例配置为20%：直邀糖果包奖励比例：50% ; 间邀糖果包奖励比例：20% ; <br>
            A 邀请 B ，B 邀请 C  , 其中B 兑换一个试练任务，支付100 U；C 兑换一个试练任务,支付100 U<br><br>

            <span style="font-weight:bold;">对于A ，可获得的奖励</span><br>
            直邀糖果包奖励 = 100 × 20% × 50% = 10 USDT  (针对B 兑换行为而言)<br>
            间邀糖果包奖励 = 100 × 20% × 20% = 4 USDT  (针对C 兑换行为而言)<br>
            <span style="font-weight:bold;">对于B ，可获得的奖励</span><br>
            直邀糖果包奖励 = 100 × 20% × 50% = 10 USDT  (针对C 兑换行为而言)<br>
            <span style="font-weight:bold;">对于C ，可获得的奖励</span><br>
            本例未提及有下级，故没有奖励<br>
        </p>
      </div>
    </div>
    <!-- <div class="bottomBox clearfix" style="padding-left:64px;margin-top:20px;">
      <div class="fl" style="margin-right:42px;">状态：</div>
      <div class="fl">
        <el-switch
        v-model="valueStatus"
        active-color="#13ce66"
        inactive-color="#bcb8b8">
      </el-switch>
      <span style="font-size:13px;color:#3c3c3c;margin-left:10px;">启用后，则展示需要收取费用为 0 </span>
      </div>
    </div> -->
  
     <el-button v-hasPermi="['integral:task:payinfo:setting:reward']" type="primary" @click="sava" style="margin-top:59px;margin-left:200px;">保存</el-button>
    
  </div>
</template>

<script>
import { tryTaskFeeSet_info, tryTaskFeeSet_BonusSave } from "@/api/goods/goodsAbout";
  export default {
    data () {
      return {
        percent1: 0,
        percent2: 0,
        percent3: 0,
        curID: null,
        valueStatus: false,
        noChange: true,
        ifInitialization: true,
        loading: false,
        loadingBtn: false,
        submitParams: [
          {
            deductionType: 0,
            deductionWorth: 0,
            whalePeas: 0,
            id: null
          }
        ]
      }
    },
    mounted () {
      this.isAuth.isPermi(['integral:task:payinfo:setting:get']) && this.queryPayWay()
    },
    watch: {
      submitParams: {
        handler: function (newVal, oldVal) {  
          if (!this.ifInitialization) {
            this.noChange = false
          }
        },
        deep: true
      }
    },
    methods: {
      sava () {
        tryTaskFeeSet_BonusSave(
          {
            directRate: this.percent2,
            indirectRate: this.percent3,
            rate: this.percent1,
            id: this.curID,
          }).then(response => {
          if (response.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              'duration': 1000,
              onClose: async () => {
                this.queryPayWay()
              }
            })
          } else {
            this.$message.error(response.message)
          }
        })
      },
      queryPayWay () {
        tryTaskFeeSet_info().then(response => {
          if (response.code === 200) {
            this.valueStatus = response.data.enabled
            this.curID = response.data.id
            this.percent1 = response?.data?.rewardInfo?.rate || 0
            this.percent2 = response?.data?.rewardInfo?.directRate || 0
            this.percent3 = response?.data?.rewardInfo?.indirectRate || 0
            this.$forceUpdate()
          } else {
            this.$message.error(response.message)
          }
        })
      },
      
    }
  }
</script>
<style lang="scss" scoped>
$myColor: #8b939c;
.enterVal{
  padding: 29px 67px;
  & .unit{
    color: $myColor;
    padding:0 10px 0 10px;
  }
}
</style>


