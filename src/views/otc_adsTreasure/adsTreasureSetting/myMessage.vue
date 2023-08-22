<template>
  <div class="shareAddManagebox" style="padding:20px;">
<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm">
  <h3>通知方式配置</h3>
  <el-form-item label="" prop="day1">

    <el-checkbox v-model="ruleForm.day1">站内信通知</el-checkbox>

    <!-- <el-input-number :min="0" :max="10000" v-model="ruleForm.day1" :precision="0" :step="1" step-strictly controls-position="right"></el-input-number><span class="mmUnit">个</span> -->
  </el-form-item>
  
  <el-form-item label="是否启用" prop="qijinyong1">
      <el-switch v-model="ruleForm.qijinyong1"></el-switch>
    </el-form-item>

  <el-form-item>
        <el-button v-hasPermi="['otc:conf:saveorupdate']" type="primary" @click="submitForm('ruleForm')">保存</el-button>
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
        if (value === '' || value === undefined) {
          callback(new Error('请输入0-10000正整数'));
        }
        callback()
      };
      var validateday2 = (rule, value, callback) => {
        if (value === '' || value === undefined) {
          callback(new Error('请输入0-10000正整数'));
        }
        callback()
      };
      return {
        isId: null,
        ruleForm: {
          day1: false,
          qijinyong1: false,
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
          type: 10
        }).then(response => {
          if (+response.code === 200) {
            this.ruleForm = {
              day1: response.data.condition ? response.data.condition.internalNotice : false,
              qijinyong1: response.data.enabled
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
                  internalNotice: this.ruleForm.day1,
                },
                enabled: this.ruleForm.qijinyong1,
                id: this.isId,
                type: 10
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

