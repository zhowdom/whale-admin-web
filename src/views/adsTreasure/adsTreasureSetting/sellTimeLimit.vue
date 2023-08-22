<template>
  <div class="shareAddManagebox excFeeSetbox" style="padding:20px;">
<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm">

  
  <el-form-item label="" prop="day1">
    <span style="margin-right:10px;">出售失效限制：</span>

    <el-input-number :min="0" :max="10000" v-model="ruleForm.day1" :precision="0" :step="1" controls-position="right"></el-input-number><span class="mmUnit">时</span>
    <el-input-number :min="0" :max="10000" v-model="ruleForm.day1_minu" :precision="0" :step="1" controls-position="right"></el-input-number><span class="mmUnit">分</span>

  </el-form-item>

    

  
  <el-form-item label="" prop="day2">
    <span style="margin-right:10px;">发布预售时效限制：</span>
    <el-input-number :min="0" :max="10000" v-model="ruleForm.day2" :precision="0" :step="1" controls-position="right"></el-input-number><span class="mmUnit">时</span>
    <el-input-number :min="0" :max="10000" v-model="ruleForm.day2_minu" :precision="0" :step="1" controls-position="right"></el-input-number><span class="mmUnit">分</span>
  </el-form-item>
    
  
  <el-form-item label="状态" prop="qijinyong1" style="margin-left:45px;">
    <el-switch v-model="ruleForm.qijinyong1"></el-switch>
  </el-form-item>

  <div style="padding-left:210px;font-size:13px;">
    注：<br>
    <span style="padding-left:20px;">1.</span> 只针对【二级市场】获得的NFT，【发布预售】或【出售】时，受此时间限制 ；<br>
    <span style="padding-left:20px;">2.</span>可以输入正整数，可以为0 ，0-10000<br>
    <span style="padding-left:20px;"></span>样例：<br>
    <span style="padding-left:20px;"></span>假设配置 ： 72:12<br>
    <span style="padding-left:20px;">1.</span> 用户A，在【买卖】获得的NFT，获得后的 72时12分，在【收藏】点击【发布预售】，不可发布成功，提示：72时12分后方可发布预售 ；<br>
    <span style="padding-left:20px;">2.</span>用户A，在【买卖】获得的NFT，获得后的72时12分，在【买卖】点击【卖出】，不可卖出，提示：72时12分后方可卖出 。提示时间，取配置
  </div>

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
          day1_minu: '',
          day2: '',
          day2_minu: '',
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
          type: 14
        }).then(response => {
          if (+response.code === 200) {
            this.ruleForm = {
              day1: response.data.condition ? response.data.condition.saleHour : null,
              day1_minu: response.data.condition ? response.data.condition.saleMinute : null,
              day2: response.data.condition ? response.data.condition.releaseSaleHour : null,
              day2_minu: response.data.condition ? response.data.condition.releaseSaleMinute : null,
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
                  saleHour: this.ruleForm.day1,
                  saleMinute: this.ruleForm.day1_minu,
                  releaseSaleHour: this.ruleForm.day2,
                  releaseSaleMinute: this.ruleForm.day2_minu,
                  },
                enabled: this.ruleForm.qijinyong1,
                id: this.isId,
                type: 14
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

