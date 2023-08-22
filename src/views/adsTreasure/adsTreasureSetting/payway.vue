<template>
  <div class="shareAddManagebox" style="padding:20px;">
<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm">
  <p>
    <span style="margin-left:121px;">收款方式</span>
    <span style="margin-left:59px;">是否启用</span>
  </p>
  
  <el-form-item label="支付宝" prop="qijinyong1">
      <el-switch v-model="ruleForm.qijinyong1" style="margin-left:51px;"></el-switch>
    </el-form-item>
  <el-form-item label="微信" prop="qijinyong2">
      <el-switch v-model="ruleForm.qijinyong2" style="margin-left:51px;"></el-switch>
    </el-form-item>
  <el-form-item label="银联" prop="qijinyong3">
      <el-switch v-model="ruleForm.qijinyong3" style="margin-left:51px;"></el-switch>
    </el-form-item>

  <el-form-item>
        <el-button v-hasPermi="['advertising:treasure:saveorupdate']" type="primary" @click="submitForm('ruleForm')">保存</el-button>
      </el-form-item>

</el-form>

  </div>
</template>

<script>
import { atSave, atQuery } from "@/api/adsTreasure";
  export default {
    components: {},
    data () {
      return {
        isId: null,
        ruleForm: {
          qijinyong1: false,
          qijinyong2: false,
          qijinyong3: false,
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
        atQuery({
          type: 7
        }).then(response => {
          if (+response.code === 200) {
            this.ruleForm = {
              qijinyong1: response.data.condition ? response.data.condition.aliPay : false,
              qijinyong2: response.data.condition ? response.data.condition.unionPay : false,
              qijinyong3: response.data.condition ? response.data.condition.wechatPay : false,
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
                  aliPay: this.ruleForm.qijinyong1,
                  unionPay: this.ruleForm.qijinyong2,
                  wechatPay: this.ruleForm.qijinyong3,
                },
                enabled: true, // 原型上没有对应此参数，默认传true给后端
                id: this.isId,
                type: 7
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

