<template>
  <div class="withdrawSet">
    <el-form v-loading="loading" :model="sumbitForm" :rules="rules" ref="ruleForm" label-width="100px">

    <el-form-item label="" prop="minValue">
    <div class="topbarFlag" style="margin-top:20px;">提现限额配置</div>
    <div class="enterVal" style="text-align:center;">
      <span>最小提现金额：</span>
      <el-input-number :precision="2" v-model="sumbitForm.minValue" controls-position="right" @change="handleChange" :min="0" @blur="((ev)=>{handleBlur(ev, 'minValue')})"></el-input-number><span class="unit">USDT</span>
      <el-checkbox v-model="sumbitForm.enabledMinValue">禁用</el-checkbox>
    </div>
    </el-form-item>

    <el-form-item label="" prop="maxValue">
    <div class="enterVal" style="text-align:center;">
      <span>单笔最大提现金额：</span>
      <el-input-number :precision="2" v-model="sumbitForm.maxValue" controls-position="right" @change="handleChange" :min="0" @blur="((ev)=>{handleBlur(ev, 'maxValue')})"></el-input-number><span class="unit">USDT</span>
      <el-checkbox v-model="sumbitForm.enabledMaxValue">禁用</el-checkbox>
    </div>
    </el-form-item>

    <el-form-item label="" prop="serviceBalance">
    <div class="topbarFlag" style="margin-top:20px;">提现手续费配置</div>
    <div class="enterVal" style="text-align:center;">
      <span>每笔提现手续费：</span>
      <el-input-number :precision="2" v-model="sumbitForm.serviceBalance" controls-position="right" @change="handleChange" :min="0" @blur="((ev)=>{handleBlur(ev, 'serviceBalance')})"></el-input-number><span class="unit">USDT</span>
      <el-checkbox v-model="sumbitForm.enabledServiceBalance">禁用</el-checkbox>
    </div>
    </el-form-item>

    <el-form-item label="" prop="dayWithdrawLimit">
    <div class="topbarFlag" style="margin-top:20px;">提现周期配置</div>
    <div class="enterVal" style="text-align:center;">
      <span>每天限次数：</span>
      <el-input-number step-strictly :precision="0" v-model="sumbitForm.dayWithdrawLimit" controls-position="right" @change="handleChange" :min="0" :max="100" @blur="((ev)=>{handleBlur(ev, 'dayWithdrawLimit')})"></el-input-number><span class="unit">次</span>
      <el-checkbox v-model="sumbitForm.enabledDayWithdrawLimit">禁用</el-checkbox>
    </div>
    </el-form-item>

    <el-form-item label="" prop="monthWithdrawLimit">
    <div class="enterVal" style="text-align:center;">
      <span>每月提现次数：</span>
      <el-input-number step-strictly :precision="0" v-model="sumbitForm.monthWithdrawLimit" controls-position="right" @change="handleChange" :min="0" :max="100" @blur="((ev)=>{handleBlur(ev, 'monthWithdrawLimit')})"></el-input-number><span class="unit">次</span>
      <el-checkbox v-model="sumbitForm.enabledMonthWithdrawLimit">禁用</el-checkbox>
    </div>
    </el-form-item>

    <el-form-item label="" prop="beginDayInMonth">
    <div class="enterVal" style="text-align:center;">
      <span>每月提现日期：</span>
      <el-input-number class="mockSlotStyle customW" :controls="false" step-strictly :precision="0" v-model="sumbitForm.beginDayInMonth" controls-position="right" @change="handleChange" :min="1" :max="31" @blur="((ev)=>{handleBlur(ev, 'beginDayInMonth')})"></el-input-number>
      <svg style="margin:0 10 0 15px;" t="1618216387708" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10632" width="12" height="12"><path d="M63.6 489.6h896.7v44.8H63.6z" p-id="10633" fill="#8a8a8a"></path></svg>
      <el-input-number class="mockSlotStyle customW" :controls="false" step-strictly :precision="0" v-model="sumbitForm.endDayInMonth" controls-position="right" @change="handleChange" :min="1" :max="31" @blur="((ev)=>{handleBlur(ev, 'endDayInMonth')})"></el-input-number>
      <el-checkbox style="margin-left:19px;" v-model="sumbitForm.enabledTimeRange">禁用</el-checkbox>
    </div>
    </el-form-item>

    <div style="text-align:center;padding-top:20px;padding-bottom:50px;">
      <el-button style="margin:0 20px 0 30px;" type="primary" @click="resetForm('ruleForm')">重置</el-button>
      <el-button v-hasPermi="['financial:withdraw:save']" type="primary" :loading="btnloading" @click="saveClick('ruleForm')">保存</el-button>
    </div>
  </el-form>
  </div>
</template>

<script>
import { saveWithdrawSetting, queryWithdrawSetting, queryWithdrawList, withdrawCount, withdrawAudit  } from "@/api/wealth/withdrawSet";
  export default {
    components: {},
    data () {
      let validateBeginDayInMonth = (rule, value, callback) => {
        if (!/\S/.test(this.sumbitForm.beginDayInMonth) || !/\S/.test(this.sumbitForm.endDayInMonth)) {
          return callback(new Error('不能为空'))
        }
        if (+this.sumbitForm.beginDayInMonth > +this.sumbitForm.endDayInMonth) {
          return callback(new Error('请输入正确的提现日期区间'))
        }
        callback()
      }
      return {
        redBackPercent: 0,
        loading: false,
        btnloading: false,
        resId: '',
        sumbitForm: {
          enabledMinValue: false,
          enabledMaxValue: false,
          enabledServiceBalance: false,
          enabledDayWithdrawLimit: false,
          enabledMonthWithdrawLimit: false,
          enabledTimeRange: false,
          minValue: '',
          maxValue: '',
          serviceBalance: '',
          dayWithdrawLimit: '',
          monthWithdrawLimit: '',
          beginDayInMonth: '',
          endDayInMonth: '',
          withdrawalType: 1
        },
        rules: {
          beginDayInMonth: [
            { validator: validateBeginDayInMonth, trigger: 'blur' }
          ]
        }
      }
    },
    mounted () {
      this.queryWithdrawSettingRun()
    },
    watch: {},
    methods: {
      saveClick (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.btnloading = this.loading = true
            let _params = Object.assign({}, this.sumbitForm)
            _params.enabledMinValue = this.sumbitForm.enabledMinValue ? false : true
            _params.enabledMaxValue = this.sumbitForm.enabledMaxValue ? false : true
            _params.enabledServiceBalance = this.sumbitForm.enabledServiceBalance ? false : true
            _params.enabledDayWithdrawLimit = this.sumbitForm.enabledDayWithdrawLimit ? false : true
            _params.enabledMonthWithdrawLimit = this.sumbitForm.enabledMonthWithdrawLimit ? false : true
            _params.enabledTimeRange = this.sumbitForm.enabledTimeRange ? false : true
            _params.withdrawalType = 1
            saveWithdrawSetting(_params).then((response) => {
              this.btnloading = this.loading = false
              if (response.code === 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  'duration': 1000,
                  onClose: () => {
                    this.queryWithdrawSettingRun()
                  }
                })
              } else {
                this.$message.error(response.message)
              }
            }).catch(({ error }) => {
              this.btnloading = this.loading = false
              if (error) this.$message.error(error.message)
            })
          }
        })
      },
      // 查询
      queryWithdrawSettingRun () {
        queryWithdrawSetting({
          withdrawalType: 1
        }).then(response => {
          if (response.code === 200) {
            this.sumbitForm = Object.assign(response.data, {
              enabledMinValue: response.data.enabledMinValue ? false : true,
              enabledMaxValue: response.data.enabledMaxValue ? false : true,
              enabledServiceBalance: response.data.enabledServiceBalance ? false : true,
              enabledDayWithdrawLimit: response.data.enabledDayWithdrawLimit ? false : true,
              enabledMonthWithdrawLimit: response.data.enabledMonthWithdrawLimit ? false : true,
              enabledTimeRange: response.data.enabledTimeRange ? false : true
            })
          } else {
            this.$message.error(response.message)
          }
        })
      },
      handleChange (value) {
        this.$forceUpdate()
        // console.log(`current modified value:${value}`)
      },
      handleBlur (ev, prop) {
        // blur后若输入内容为空，处理为显示对应特权类型的最小默认值
        if (ev.target.ariaValueNow === 'undefined') this.sumbitForm[`${prop}`] = ev.target.value = ev.target.ariaValueMin
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
        this.sumbitForm.endDayInMonth = 1
        this.sumbitForm.enabledMinValue = false
        this.sumbitForm.enabledMaxValue = false
        this.sumbitForm.enabledServiceBalance = false
        this.sumbitForm.enabledDayWithdrawLimit = false
        this.sumbitForm.enabledMonthWithdrawLimit = false
        this.sumbitForm.enabledTimeRange = false
      }
    }
  }
</script>

<style lang="scss" scoped>
$myColor: #8b939c;
.redbackSetPage{
  padding: 20px;
}
.topbarFlag{
  position: relative;
  background: #9ca7b5;
  height: 50px;
  width: 200px;
  line-height: 50px;
  text-align: center;
  color: #FFF;
  font-weight: 500;
  &:after {
    content: " ";
    height: 1px;
    width: 1px;
    display: inline-block;
    border: 25px solid transparent;
    border-left-color: #9ca7b5;
    position: absolute;
    right: -50px;
  }
}
.enterVal{
  padding: 29px 67px;
  & .unit{
    color: $myColor;
    padding:0 10px 0 10px;
  }
}
</style>
<style lang="scss">
.withdrawSet{
  & .enterVal {
    padding: 29px 67px 0 67px;
  }
  & .customW {
    width:139px;
    & .el-input::after{
      right:-55px;
      content: '日';
    }
  }
  .el-form-item__error{
    width:100%;
    text-align: center;
    padding-top: 10px;
  }
}
</style>

