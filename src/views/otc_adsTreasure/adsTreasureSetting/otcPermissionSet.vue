<template>
  <div class="shareAddManagebox" style="padding:20px;">
<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm">
  <h3 style="font-weight:500;font-size:14px;text-indent: 75px;">1、对于 【OTC购买】【OTC出售】权限配置</h3> 
  <el-form-item label="持有糖果包消耗值" prop="day1">
    <el-input-number v-model="ruleForm.day1" :step="1" step-strictly controls-position="right"></el-input-number>
  </el-form-item>
  <el-form-item label="状态" prop="qijinyong1">
      <el-switch v-model="ruleForm.qijinyong1"></el-switch>
    </el-form-item>

  <h3 style="font-weight:500;font-size:14px;text-indent: 75px;">2、对于 【OTC发布买单】【OTC发布卖单】权限配置</h3> 
    <el-form-item label="持有糖果包消耗值" prop="day2">
    <el-input-number v-model="ruleForm.day2" :step="1" step-strictly controls-position="right"></el-input-number>
  </el-form-item>
  <el-form-item label="状态" prop="qijinyong2">
      <el-switch v-model="ruleForm.qijinyong2"></el-switch>
    </el-form-item>


  <p style="color:#817d7d;margin-left:78px;font-size:13px;margin-bottom:30px;">
    注释：<br>
     1. 对于持有的糖果包，只针对【进行中】的糖果包<br>
     2. 进行中的所有糖果包中，需有1个糖果包消耗值大于或等于【配置值】，才可以操作OTC交易<br>
     3. 默认是禁用状态，当为禁用状态，则OTC 交易没有限制<br>
  </p>
  <el-form-item>
        <el-button v-hasPermi="['otc:conf:saveorupdate']" type="primary" :loading="loadingBtn" @click="submitForm('ruleForm')">保存</el-button>
      </el-form-item>

</el-form>

  </div>
</template>

<script>
import { atSave, atQuery } from "@/api/otc_adsTreasure";
  export default {
    components: {},
    data () {
      var validateday1 = (rule, value, callback) => {
        if (this.ruleForm.qijinyong1) {
          if (value === '' || value === undefined) {
            callback(new Error('不能为空'));
          }
          if (value <= 0) {
            callback(new Error('请输入大于0的正整数'));
          }
        }
        callback()
      };
      var validateday2 = (rule, value, callback) => {
        if (this.ruleForm.qijinyong2) {
          if (value === '' || value === undefined) {
            callback(new Error('不能为空'));
          }
          if (value <= 0) {
            callback(new Error('请输入大于0的正整数'));
          }
        }
        callback()
      };
      return {
        loadingBtn: false,
        isId: null,
        ruleForm: {
          day1: '',
          qijinyong1: false,
          day2: '',
          qijinyong2: false,
        },
        isEnabled: '',
        rules: {
          day1: [
            { validator: validateday1, trigger: 'blur' }
          ],
          day2: [
            { validator: validateday2, trigger: 'blur' }
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
          type: 11
        }).then(response => {
          if (+response.code === 200) {
            this.ruleForm = {
              day1: response.data?.condition?.buySaleExpendNumber || null,
              qijinyong1: response.data?.condition?.buySalePermission,
              day2: response.data?.condition?.releaseExpendNumber || null,
              qijinyong2: response.data?.condition?.releasePermission,
            }
            this.isEnabled = response.data?.enabled
            this.isId = response.data?.id
          } else {
            this.isId = null
          }
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loadingBtn = true
            atSave(
              {
                condition: {
                  buySaleExpendNumber: this.ruleForm.day1,
                  buySalePermission: this.ruleForm.qijinyong1,
                  releaseExpendNumber: this.ruleForm.day2,
                  releasePermission: this.ruleForm.qijinyong2,
                },
                enabled: this.isEnabled,
                id: this.isId,
                type: 11
              }).then(response => {
              if (+response.code === 200) {
                this.msgSuccess(`操作成功`)
                this.query()
              } else {
                this.$message.error(response.message)
              }
              this.loadingBtn = false
            }).catch(e => {
              console.log(e)
              this.loadingBtn = false
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

