<template>
  <div class="shareAddManagebox excFeeSetbox" style="padding:20px;">
<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm">

  
  <el-form-item label="" prop="day1">
    <div style="margin-top:30px;padding-bottom:30px;">1、发布认购 ， 收取发布方手续费  <span style="font-size:13px;color:rgb(129, 125, 125);">(发布认购是指， 用户在【收藏】直接【发布认购】)</span></div>
    <span style="margin-right:10px;">按比例收取手续费</span>
    <el-input-number :min="0" :max="100" v-model="ruleForm.day1" :precision="0" :step="1" controls-position="right"></el-input-number><span class="mmUnit">%</span>
  </el-form-item>
    <div style="padding-left:211px;font-size:13px;color:rgb(129, 125, 125);">
    <p>
       1. 0-100 正整数，包头包尾 ； 是额外收取   （扣支付本币）<br>
          需实际扣除数量 =  广告宝价值 + 广告宝价值 ×手续费比例<br><br>

       2. 样例 ：<br>
          <span style="padding-left:45px;">假设广告宝A价值  100  USDT,  配置 15%</span><br>
          <span style="padding-left:45px;">则购买广告宝 A , 需要支付的 USDT = 100 ×15% + 100 = 115</span><br><br>
       3. APP 资产列表展示 ：【认购NFT】  【认购NFT手续费】  <br><br>
      </p>
    </div>
    <span style="margin-left:206px;">状态：</span><el-switch v-model="ruleForm.switchStatus"></el-switch>

  
  <el-form-item label="" prop="day2">
    <div style="margin-top:30px;padding-bottom:30px;">2、发布预售 ， 收取发布方手续费  <span style="font-size:13px;color:rgb(129, 125, 125);">(发布预售是指， 用户在【收藏】直接【发布预售】)</span></div>
    <span style="margin-right:10px;">按比例收取手续费</span>
    <el-input-number :min="0" :max="100" v-model="ruleForm.day2" :precision="0" :step="1" controls-position="right"></el-input-number><span class="mmUnit">%</span>
  </el-form-item>
    <div style="padding-left:211px;font-size:13px;color:rgb(129, 125, 125);">
    <p>
       1. 0-100 正整数，包头包尾 ；<br>
          出售成功后，扣除手续费后，剩余的数量才到用户账上，<br>
          （单位为扣除实际到账的币种）<br><br>

          需实际获得数量 =  广告宝价值 - 广告宝价值 × 手续费比例<br><br>

        2. 样例 ：<br>
          <span style="padding-left:45px;">假设广告宝A价值  100  USDT,  配置 15%</span><br>
          <span style="padding-left:45px;">则出售广告宝 A , 得到的 USDT = 100  - 100 ×15% = 85</span><br><br><br>
        3. APP 资产列表展示 ：【预售NFT】  【预售NFT手续费】 <br><br> 
      </p>
    </div>
    <span style="margin-left:206px;">状态：</span><el-switch v-model="ruleForm.switchStatus2"></el-switch>


  
  <el-form-item v-show="false" label="状态" prop="qijinyong1" style="margin-left:45px;">
      <el-switch v-model="ruleForm.qijinyong1"></el-switch>
    </el-form-item>

  <el-form-item style="padding-top:30px;">
    <el-button style="margin-left:45px;" v-hasPermi="['advertising:treasure:saveorupdate']" type="primary" @click="submitForm('ruleForm')">保存</el-button>
  </el-form-item>

</el-form>

  </div>
</template>

<script>
import { atSave, atQuery } from "@/api/adsTreasure";
  export default {
    components: {},
    data () {
      var validateday1 = (rule, value, callback) => {
        if (this.ruleForm.switchStatus && (value === '' || value === undefined)) {
          callback(new Error('请输入'));
        }
        callback()
      };
      var validateday2 = (rule, value, callback) => {
        if (this.ruleForm.switchStatus2 && (value === '' || value === undefined)) {
          callback(new Error('请输入'));
        }
        callback()
      };
      var validateday3 = (rule, value, callback) => {
        if (value === '' || value === undefined) {
          callback(new Error('请输入'));
        }
        callback()
      };
      return {
        isId: null,
        ruleForm: {
          day1: '',
          day2: '',
          day3: '',
          qijinyong1: false,
          switchStatus: false,
          switchStatus2: false
        },
        rules: {
          day1: [
            { validator: validateday1, trigger: 'blur' }
          ],
          day2: [
            { validator: validateday2, trigger: 'blur' }
          ],
          day3: [
            { validator: validateday3, trigger: 'blur' }
          ],
        }
      }
    },
    mounted () {
      this.query()
    },
    watch: {},
    methods: {
      query () {
        atQuery({
          type: 13
        }).then(response => {
          if (+response.code === 200) {
            this.ruleForm = {
              day1: response.data.condition ? response.data.condition.buyFeeRito : null,
              switchStatus: response.data.condition ? response.data.condition.buyFeeStatus : false,
              day2: response.data.condition ? response.data.condition.sellFeeRito : null,
              switchStatus2: response.data.condition ? response.data.condition.sellFeeStatus : false,
              qijinyong1: response.data.enabled,
            }
            this.isId = response.data.id
          } else {
            this.isId = null
          }
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            atSave(
              {
                condition: {
                  buyFeeStatus: this.ruleForm.switchStatus,
                  sellFeeStatus: this.ruleForm.switchStatus2,
                  buyFeeRito: this.ruleForm.day1,
                  sellFeeRito: this.ruleForm.day2,
                  },
                // enabled: this.ruleForm.qijinyong1,
                enabled: true, // 固定传true
                id: this.isId,
                type: 13
              }).then(response => {
              if (+response.code === 200) {
                this.msgSuccess(`操作成功`)
                this.query()
              } else {
                this.$message.error(response.message)
              }
            })
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style lang="scss" scoped>
.mmUnit{
  padding:0 10px;color:#817d7d;
}
</style>
<style>
.excFeeSetbox .el-form-item__error{
  margin-left:125px;
}
</style>

