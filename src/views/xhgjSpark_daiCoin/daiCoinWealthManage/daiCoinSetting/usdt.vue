<template>
  <div class="shareAddManagebox" style="padding:20px;">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">


       <el-form-item label="单笔最小提现额" prop="singleMinWithdrawAmount">
        <el-input-number :min="0" :max="1000000" v-model="ruleForm.singleMinWithdrawAmount" :step="1" step-strictly controls-position="right"></el-input-number>
      </el-form-item>
       <el-form-item label="单笔最大提现额" prop="singleMaxWithdrawAmount">
        <el-input-number :min="0" :max="1000000" v-model="ruleForm.singleMaxWithdrawAmount" :step="1" step-strictly controls-position="right"></el-input-number>
      </el-form-item>
       <el-form-item label="当日最大可提现" prop="dayMaxWithdrawAmount">
        <el-input-number :min="0" :max="1000000" v-model="ruleForm.dayMaxWithdrawAmount" :step="1" step-strictly controls-position="right"></el-input-number>
      </el-form-item>
       <el-form-item label="手续费" prop="serverFee">
        <el-input-number :precision="2" :min="0" v-model="ruleForm.serverFee" :step="1" controls-position="right"></el-input-number><span class="mmUnit">%</span>
      </el-form-item>
       <el-form-item label="Gas fee" prop="gasFee">
        <el-input-number :precision="6" :min="0" v-model="ruleForm.gasFee" :step="1" controls-position="right"></el-input-number>
      </el-form-item>
      <el-form-item label="荣耀值">
        <div class="clearfix">
          <el-radio v-model="ruleForm.dedicateWorthType" label="1">按次收取</el-radio>
          <el-input-number :min="0" :max="1000000" v-model="ruleForm.ct1" :step="1" step-strictly controls-position="right"></el-input-number>
        </div>
        <div class="clearfix" style="padding-top:15px;">
          <el-radio v-model="ruleForm.dedicateWorthType" label="2">按比例收取</el-radio>
          <span>USDT</span> ： <span>荣耀值</span> = 
          <el-input-number :min="0" :max="100" v-model="ruleForm.ct2" :step="1" step-strictly controls-position="right"></el-input-number>
          <span style="padding:0 10px;">：</span>
          <el-input-number :min="0" :max="100" v-model="ruleForm.ct3" :step="1" step-strictly controls-position="right"></el-input-number>
        </div>
      </el-form-item>
       


      <el-form-item label="是否启用" prop="enable">
        <el-switch v-model="ruleForm.enable"></el-switch>
      </el-form-item>

      <el-form-item>
        <el-button v-hasPermi="['advertising:treasure:saveorupdate']" type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { xhgjSpark_usdtQuery, xhgjSpark_usdtSave, xhgjSpark_transferNetQuery, xhgjSpark_transferNetSave } from "@/api/xhgjSpark_api";
  export default {
    components: {},
    data () {
      var validatesingleMinWithdrawAmount = (rule, value, callback) => {
        if ((value === '' || value === undefined) && this.ruleForm.enable) {
          callback(new Error('请输入0-1000000的正整数'));
        }
        callback()
      };
      var validatesingleMaxWithdrawAmount = (rule, value, callback) => {
        if ((value === '' || value === undefined) && this.ruleForm.enable) {
          callback(new Error('请输入0-1000000的正整数'));
        }
        callback()
      };
      var validatedayMaxWithdrawAmount = (rule, value, callback) => {
        if ((value === '' || value === undefined) && this.ruleForm.enable) {
          callback(new Error('请输入0-1000000的正整数'));
        }
        callback()
      };
      var validateserverFee = (rule, value, callback) => {
        if ((value === '' || value === undefined) && this.ruleForm.enable) {
          callback(new Error('请输入0及以上的数值'));
        }
        callback()
      };
      var validategasFee = (rule, value, callback) => {
        if ((value === '' || value === undefined) && this.ruleForm.enable) {
          callback(new Error('请输入0及以上的数值'));
        }
        callback()
      };
     
      return {
        ruleForm: {
          singleMinWithdrawAmount: 0,
          singleMaxWithdrawAmount: 0,
          dayMaxWithdrawAmount: 0,
          serverFee: 0,
          gasFee: 0,
          dedicateWorthType: '1',
          dedicateWorth: '', // 提交与回显需要特殊处理
          enable: false,
          remark: '',
          id: null,
          ct1: 0,
          ct2: 0,
          ct3: 0,
        },
        rules: {
          singleMinWithdrawAmount: [
            { validator: validatesingleMinWithdrawAmount, trigger: 'blur' }
          ],
          singleMaxWithdrawAmount: [
            { validator: validatesingleMaxWithdrawAmount, trigger: 'blur' }
          ],
          dayMaxWithdrawAmount: [
            { validator: validatedayMaxWithdrawAmount, trigger: 'blur' }
          ],
          serverFee: [
            { validator: validateserverFee, trigger: 'blur' }
          ],
          gasFee: [
            { validator: validategasFee, trigger: 'blur' }
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
        xhgjSpark_usdtQuery({
          coinName: 'USDT'
        }).then(response => {
          if (+response.code === 200) {
            this.ruleForm = {
              singleMinWithdrawAmount: response.data.singleMinWithdrawAmount,
              singleMaxWithdrawAmount: response.data.singleMaxWithdrawAmount,
              dayMaxWithdrawAmount: response.data.dayMaxWithdrawAmount,
              serverFee: response.data.serverFee,
              gasFee: response.data.gasFee,
              dedicateWorthType: response.data.dedicateWorthType + '',
              dedicateWorth: response.data.dedicateWorth,
              enable: response.data.enable,
              remark: response.data.remark,
              id: response.data.id,
              ct1: 0,
              ct2: 0,
              ct3: 0,
            }
            if (this.ruleForm.dedicateWorth) {
              let res = this.ruleForm.dedicateWorth.indexOf(':')
              if (res != -1) {
                this.ruleForm.ct2 = this.ruleForm.dedicateWorth.split(':')[0]
                this.ruleForm.ct3 = this.ruleForm.dedicateWorth.split(':')[1]
              } else {
                this.ruleForm.ct1 = this.ruleForm.dedicateWorth
              }
            } else {
              this.ruleForm.ct1 = 0
            }
          }
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (+this.ruleForm.dedicateWorthType === 1) {
              if((this.ruleForm.ct1 === '' || this.ruleForm.ct1 === undefined) && this.ruleForm.enable) {
                this.$message.error('请输入荣耀值')
                return false
              } else {
                this.ruleForm.dedicateWorth = `${this.ruleForm.ct1}`
              }
            } else if (+this.ruleForm.dedicateWorthType === 2) {
              if((this.ruleForm.ct1 === '' || this.ruleForm.ct1 === undefined || this.ruleForm.ct2 === '' || this.ruleForm.ct2 === undefined) && this.ruleForm.enable) {
                this.$message.error('请输入荣耀值')
                return false
              } else {
                this.ruleForm.dedicateWorth = `${this.ruleForm.ct2}:${this.ruleForm.ct3}`
              }
            }
            xhgjSpark_usdtSave(
              this.ruleForm
            ).then(response => {
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
.nlItem .el-form-item__content{
  margin-left: 0!important;
}
</style>

