<template>
  <div class="tryTaskFeeSetBox" style="padding:30px;">

    <div class="topperBox clearfix">
      <div class="fl itemTitle">启用人机校验费：</div>
      <div class="fl">
        <el-input-number v-model="price" :precision="6" :min="0.000001" :max="10000" :step="1" controls-position="right" style="width:259px;margin-left:10px;"></el-input-number>
        <span style="margin-left:10px;font-size:13px;color:#3c3c3c;">USDT</span>
      </div>
    </div>

    <div class="topperBox clearfix" style="margin-top:10px;">
      <div class="fl itemTitle" style="padding-left:42px;">赠送币种：</div>
      <div class="fl">
        <el-select v-model="coinSelectedName" placeholder="请选择" style="margin-left:10px;">
          <el-option v-for="(item, index) in coinMaps" :label="item" :value="item" :key="index"></el-option>
        </el-select>
      </div>
    </div>
    <div class="topperBox clearfix" style="margin-top:10px;">
      <div class="fl itemTitle" style="padding-left:42px;">数量：</div>
      <div class="fl">
        <el-input-number v-model="pizza" :precision="6" :min="0" :max="1000000" :step="1" controls-position="right" style="width:259px;margin-left:10px;"></el-input-number>
        <span style="margin-left:10px;font-size:13px;color:#3c3c3c;">个</span>
      </div>
    </div>
    <div class="topperBox clearfix" style="margin-top:10px;">
      <div class="fl itemTitle" style="padding-left:42px;">代币状态：</div>
      <div class="fl">
        <el-select placeholder="请选择" v-model="lock" style="margin-left:10px;">
            <el-option label="可用" :value="false"></el-option>
            <el-option label="锁仓" :value="true"></el-option>
          </el-select>
      </div>
    </div>
    <div class="bottomBox clearfix" style="margin-top:20px;">
      <div class="fl itemTitle" style="margin-right:10px;">状态：</div>
      <div class="fl">
        <el-switch
        v-model="valueStatus"
        active-color="#13ce66"
        inactive-color="#bcb8b8">
      </el-switch>
      <div style="padding-top:20px;">
        <span style="font-size:13px;color:#3c3c3c;margin-left:10px;">
        注：<br>
        <span style="padding-left:12px;display:inline-block;">1.</span>默认禁用状态，禁用状态，则无须支付【启用人机校验费】<br>
        <span style="padding-left:12px;display:inline-block;">2.</span>输入值不可为0，小数精度为6位，最大上限为10000.<br>
        <span style="padding-left:12px;display:inline-block;">3.</span>【启用人机校验费】为第一次【领取】Candy 时收取，只收取一次 </span>
      </div>
      
      </div>
    </div>
  
     <el-button v-hasPermi="['integral:task:fuel:fee:setting:update']" type="primary" @click="sava" style="margin-top:59px;margin-left:200px;">保存</el-button>
    
  </div>
</template>

<script>
import { fireOilFeeQuery, fireOilFeeAlter } from "@/api/goods/goodsAbout";
import { daiCoinSettingList} from "@/api/xhgjSpark_api/daiCoinSetting.js";
  export default {
    data () {
      return {
        coinSelectedName: '',
        coinMaps: [],
        coinName: '',
        price: '',
        pizza: '',
        lock:false,
        curID: null,
        valueStatus: 0, // 1正常，0关闭
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
    created () {
      this.daiCoinSettingListQuery()
    },
    mounted () {
      this.isAuth.isPermi(['integral:task:fuel:fee:setting']) && this.queryPayWay()
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
      daiCoinSettingListQuery () {
        daiCoinSettingList().then(response => {
          if (response.code == 200) {
            this.coinMaps = response.data || []
          } else {
            this.coinMaps = []
          }
        })
      },
      sava () {
        fireOilFeeAlter(
          {
            statusType: this.valueStatus ? 1 : 0,
            id: this.curID,
            payAmount: this.price,
            pizza: this.pizza,
            lock: this.lock,
            coinName: this.coinName,
            giveCoinName: this.coinSelectedName,
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
        fireOilFeeQuery().then(response => {
          if (response.code === 200) {
            this.curID = response.data?.id
            this.coinName = response.data?.coinName
            this.price = response.data?.payAmount
            this.pizza = response.data?.pizza
            this.lock = response.data?.lock;
            this.valueStatus = response.data.statusType == 1
            this.coinSelectedName = response.data.giveCoinName
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
.topperBox{
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.itemTitle{
   width: 200px;
    text-align: right;
  }
</style>


