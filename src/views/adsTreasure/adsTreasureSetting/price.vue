<template>
  <div class="shareAddManagebox" style="padding:20px;">
<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm">
  <el-form-item label="发布买单，单价不得高于当日均价" prop="day1">
    <el-input-number :min="0" :max="100" v-model="ruleForm.day1" :precision="0" :step="1" step-strictly controls-position="right"></el-input-number><span class="mmUnit">%</span>
  </el-form-item>
  <el-form-item label="发布卖单，单价不得低于当日均价" prop="day2">
    <el-input-number :min="0" :max="100" v-model="ruleForm.day2" :precision="0" :step="1" step-strictly controls-position="right"></el-input-number><span class="mmUnit">%</span>
  </el-form-item>
  <el-form-item label="是否启用" prop="qijinyong1">
      <el-switch v-model="ruleForm.qijinyong1"></el-switch>
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
      var validateday1 = (rule, value, callback) => {
        if (value === '' || value === undefined) {
          callback(new Error('请输入0-100正整数'));
        }
        callback()
      };
      var validateday2 = (rule, value, callback) => {
        if (value === '' || value === undefined) {
          callback(new Error('请输入0-100正整数'));
        }
        callback()
      };
      return {
        isId: null,
        ruleForm: {
          day1: '',
          day2: '',
          qijinyong1: false,
        },
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
          type: 6
        }).then(response => {
          if (+response.code === 200) {
            this.ruleForm = {
              day1: response.data.condition ? response.data.condition.buyRatio : null,
              day2: response.data.condition ? response.data.condition.saleRatio : null,
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
                  buyRatio: this.ruleForm.day1,
                  saleRatio: this.ruleForm.day2,
                },
                enabled: this.ruleForm.qijinyong1,
                id: this.isId,
                type: 6
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

