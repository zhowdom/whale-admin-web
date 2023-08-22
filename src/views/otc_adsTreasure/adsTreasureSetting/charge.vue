<template>
  <div class="shareAddManagebox" style="padding:20px;">
<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm">
  <el-form-item label="合伙人服务费" prop="day1">
    <el-input-number :min="0" v-model="ruleForm.day1" :precision="6" :step="1" controls-position="right"></el-input-number><span class="mmUnit">candy</span>
  </el-form-item>
  <el-form-item label="团长服务费" prop="day2">
    <el-input-number :min="0" v-model="ruleForm.day2" :precision="6" :step="1" controls-position="right"></el-input-number><span class="mmUnit">candy</span>
  </el-form-item>
  <el-form-item label="高级服务费" prop="day3">
    <el-input-number :min="0" v-model="ruleForm.day3" :precision="6" :step="1" controls-position="right"></el-input-number><span class="mmUnit">candy</span>
  </el-form-item>
  <el-form-item label="是否启用" prop="qijinyong1">
      <el-switch v-model="ruleForm.qijinyong1"></el-switch>
    </el-form-item>

<p style="color:#817d7d;margin-left:145px;font-size:13px;margin-bottom:30px;">* 服务费是按次收取，只向出售方收取，即用户出售或广告商发布卖单</p>
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
          callback(new Error('请输入'));
        }
        callback()
      };
      var validateday2 = (rule, value, callback) => {
        if (value === '' || value === undefined) {
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
          type: 5
        }).then(response => {
          if (+response.code === 200) {
            this.ruleForm = {
              day1: response.data.condition ? response.data.condition.partnerAmount : null,
              day2: response.data.condition ? response.data.condition.vpAmount : null,
              day3: response.data.condition ? response.data.condition.svpAmount : null,
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
                  partnerAmount: this.ruleForm.day1,
                  vpAmount: this.ruleForm.day2,
                  svpAmount: this.ruleForm.day3,
                },
                enabled: this.ruleForm.qijinyong1,
                id: this.isId,
                type: 5
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

