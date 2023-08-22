<template>
  <div class="shareAddManagebox" style="padding:20px;">
    <el-form :model="ruleForm" status-icon ref="ruleForm" label-width="150px" class="demo-ruleForm">

        <p style="padding:10px 0;">充值转账网络:(在APP端显示)</p>

         <ul class="clearfix">
          <li class="fl" style="margin-right:20px;" v-for="(item, index) in ruleForm.rechargeTransactionNetwork" :key="index">
            <el-checkbox v-model="item.enable">{{item.name}}</el-checkbox>
          </li>
        </ul>

        <p style="padding:10px 0;">提现转账网络:(如果有[审核中]的记录的转账网络，突然被禁用，在提现时“审核通过”会报错)</p>

        <ul class="clearfix">
          <li class="fl" style="margin-right:20px;" v-for="(item, index) in ruleForm.withdrawTransactionNetwork" :key="index">
            <el-checkbox v-model="item.enable">{{item.name}}</el-checkbox>
          </li>
        </ul>

      <el-form-item>
        <el-button style="margin-top:20px;" v-hasPermi="['advertising:treasure:saveorupdate']" type="primary" @click="submitForm('ruleForm')">保存</el-button>
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
      return {
        ruleForm: {
          rechargeTransactionNetwork: [],
          withdrawTransactionNetwork: []
        },
        rules: {}
      }
    },
    mounted () {
      this.query()
    },
    watch: {},
    methods: {
      query () {
        xhgjSpark_transferNetQuery().then(response => {
          if (+response.code === 200) {
            this.ruleForm.rechargeTransactionNetwork = response.data.rechargeTransactionNetwork || []
            this.ruleForm.withdrawTransactionNetwork = response.data.withdrawTransactionNetwork || []
          }
        })
      },
      submitForm() {
        if(this.ruleForm.rechargeTransactionNetwork.every(v => !v.enable) && this.ruleForm.enable) {
          this.$message.error('请至少选择一个充值转账网络')
          return false
        } else if (this.ruleForm.withdrawTransactionNetwork.every(v => !v.enable) && this.ruleForm.enable) {
          this.$message.error('请至少选择一个提现转账网络')
          return false
        }
        xhgjSpark_transferNetSave(
          {
            updateTransactionNetworks: this.ruleForm.rechargeTransactionNetwork.concat(this.ruleForm.withdrawTransactionNetwork)
          }
        ).then(response => {
          if (+response.code === 200) {
            this.msgSuccess(`操作成功`)
            this.query()
          } else {
            this.$message.error(response.message)
          }
        })
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

