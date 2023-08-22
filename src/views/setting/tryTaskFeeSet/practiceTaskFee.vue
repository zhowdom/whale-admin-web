<template>
  <div class="tryTaskFeeSetBox" style="padding:30px;">
    <div class="topperBox clearfix">
      <div class="fl">试练任务费用：</div>
      <div class="fl">
        <ul>
          <li v-for="(item, index) in taskMap" :key="index" style="margin-bottom:10px;">
            <el-checkbox v-model="item.enabled">{{item.payWay}} 支付</el-checkbox>
            <el-input-number @blur="((ev) => {handleBlur(ev, index)})" v-model="item.price" :precision="6" :min="0.000001" :step="1" controls-position="right" style="width:259px;margin-left:10px;"></el-input-number>
          </li>
        </ul>
        <p style="font-size:13px;color:#3c3c3c;margin-left:63px;">
          1. 默认勾选 Candy 支付 ， 可多选；<br>
          2. 输入值不可为0 ，小数精度为 6 位，最大10000 。<br>
          3. 选择candy 支付，不受转赠逻辑影响<br>
          4. 如果勾选2个，糖果商店列表默认展示Candy，在支付时，可选择不同的支付方式
        </p>
      </div>
    </div>
    <div class="bottomBox clearfix" style="padding-left:64px;margin-top:20px;">
      <div class="fl" style="margin-right:42px;">状态：</div>
      <div class="fl">
        <el-switch
        v-model="valueStatus"
        active-color="#13ce66"
        inactive-color="#bcb8b8">
      </el-switch>
      <span style="font-size:13px;color:#3c3c3c;margin-left:10px;">启用后，则展示需要收取费用为 0 </span>
      </div>
    </div>
  
     <el-button v-hasPermi="['integral:task:payinfo:setting:storage']" type="primary" @click="sava" style="margin-top:59px;margin-left:200px;">保存</el-button>
    
  </div>
</template>

<script>
import { tryTaskFeeSet_info, tryTaskFeeSet_save } from "@/api/goods/goodsAbout";
  export default {
    data () {
      return {
        curID: null,
        valueStatus: false,
        taskMap: [
          {
            payWay: '',
            price: '',
            enabled: false
          },
          {
            payWay: '',
            price: '',
            enabled: false
          }
        ],
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
      handleBlur (ev, index) {
        // blur后若输入内容为空，处理为显示对应特权类型的最小默认值
        if (ev.target.ariaValueNow === 'undefined') {
          this.taskMap[index]['price'] = ev.target.value = ev.target.ariaValueMin
        }
      },
      sava () {
        let _res = this.taskMap.every(item => {
          return item.enabled == false
        })
        if (_res) {
          this.$message.error('至少勾选一个支付方式')
          return false
        }
        tryTaskFeeSet_save(
          {
            enabled: this.valueStatus,
            id: this.curID,
            payInfo: this.taskMap
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
            if (response.data.payInfo == null) {
              this.taskMap = [
                {
                  payWay: 'USDT',
                  price: '',
                  enabled: false
                },
                {
                  payWay: 'CANDY',
                  price: '',
                  enabled: false
                }
              ]
            } else if (response.data.payInfo.length == 1) {
              this.taskMap = [
                response.data.payInfo[0],
                {
                  payWay: response.data.payInfo[0]['payWay'] == 'USDT' ? 'CANDY' : 'USDT',
                  price: '',
                  enabled: false
                }
              ]
            } else if (response.data.payInfo.length >= 2) {
              this.taskMap = response.data.payInfo
            }
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


