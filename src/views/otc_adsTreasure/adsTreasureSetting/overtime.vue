<template>
  <div class="shareAddManagebox" style="padding:20px;">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

      <div class="clearfix">
        <el-form-item label="确认付款时间" prop="day1" class="fl">
          <el-input-number :min="0" :max="365" v-model="ruleForm.day1" :step="1" step-strictly controls-position="right"></el-input-number><span class="mmUnit">天</span>
        </el-form-item>
        <el-form-item label="" prop="hour1" class="nlItem fl">
          <el-input-number :min="0" :max="23" v-model="ruleForm.hour1" :step="1" step-strictly controls-position="right"></el-input-number><span class="mmUnit">时</span>
        </el-form-item>
        <el-form-item label="" prop="minute1" class="nlItem fl">
          <el-input-number :min="0" :max="59" v-model="ruleForm.minute1" :step="1" step-strictly controls-position="right"></el-input-number><span class="mmUnit">分</span>
        </el-form-item>
        <el-form-item label="" prop="second1" class="nlItem fl">
          <el-input-number :min="0" :max="59" v-model="ruleForm.second1" :step="1" step-strictly controls-position="right"></el-input-number><span class="mmUnit">秒</span>
        </el-form-item>
      </div>

      <div class="clearfix">
        <p style="color:#817d7d;margin-left:102px;font-size:13px;margin-bottom:30px;">超过 “确认付款时间”，此订单将自动关闭</p>
        <el-form-item label="确认收款时间" prop="day2" class="fl">
          <el-input-number :min="0" :max="365" v-model="ruleForm.day2" :step="1" step-strictly controls-position="right"></el-input-number><span class="mmUnit">天</span>
        </el-form-item>
        <el-form-item label="" prop="hour2" class="nlItem fl">
          <el-input-number :min="0" :max="23" v-model="ruleForm.hour2" :step="1" step-strictly controls-position="right"></el-input-number><span class="mmUnit">时</span>
        </el-form-item>
        <el-form-item label="" prop="minute2" class="nlItem fl">
          <el-input-number :min="0" :max="59" v-model="ruleForm.minute2" :step="1" step-strictly controls-position="right"></el-input-number><span class="mmUnit">分</span>
        </el-form-item>
        <el-form-item label="" prop="second2" class="nlItem fl">
          <el-input-number :min="0" :max="59" v-model="ruleForm.second2" :step="1" step-strictly controls-position="right"></el-input-number><span class="mmUnit">秒</span>
        </el-form-item>
      </div>

      <p style="color:#817d7d;margin-left:102px;font-size:13px;margin-bottom:30px;">超过 “确认收款时间”，购买方可以发起申诉</p>
      <el-form-item label="是否启用" prop="qijinyong1">
        <el-switch v-model="ruleForm.qijinyong1"></el-switch>
      </el-form-item>

      <el-form-item>
        <el-button v-hasPermi="['otc:conf:saveorupdate']" type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
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
          callback(new Error('请输入0-365的整数'));
        }
        callback()
      };
      var validatehour1 = (rule, value, callback) => {
        if (value === '' || value === undefined) {
          callback(new Error('请输入0-23的整数'));
        }
        callback()
      };
      var validatesecond1 = (rule, value, callback) => {
        if (value === '' || value === undefined) {
          callback(new Error('请输入0-59的整数'));
        }
        callback()
      };
      var validateminute1 = (rule, value, callback) => {
        if (value === '' || value === undefined) {
          callback(new Error('请输入0-59的整数'));
        }
        callback()
      };

      var validateday2 = (rule, value, callback) => {
        if (value === '' || value === undefined) {
          callback(new Error('请输入0-365的整数'));
        }
        callback()
      };
      var validatehour2 = (rule, value, callback) => {
        if (value === '' || value === undefined) {
          callback(new Error('请输入0-23的整数'));
        }
        callback()
      };
      var validatesecond2 = (rule, value, callback) => {
        if (value === '' || value === undefined) {
          callback(new Error('请输入0-59的整数'));
        }
        callback()
      };
      var validateminute2 = (rule, value, callback) => {
        if (value === '' || value === undefined) {
          callback(new Error('请输入0-59的整数'));
        }
        callback()
      };
     
      return {
        isId: null,
        ruleForm: {
          day1: '',
          hour1: '',
          second1: '',
          minute1: '',
          day2: '',
          hour2: '',
          second2: '',
          minute2: '',
          qijinyong1: false,
        },
        rules: {
          day1: [
            { validator: validateday1, trigger: 'blur' }
          ],
          hour1: [
            { validator: validatehour1, trigger: 'blur' }
          ],
          second1: [
            { validator: validatesecond1, trigger: 'blur' }
          ],
          minute1: [
            { validator: validateminute1, trigger: 'blur' }
          ],
          day2: [
            { validator: validateday2, trigger: 'blur' }
          ],
          hour2: [
            { validator: validatehour2, trigger: 'blur' }
          ],
          second2: [
            { validator: validatesecond2, trigger: 'blur' }
          ],
          minute2: [
            { validator: validateminute2, trigger: 'blur' }
          ]
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
          type: 0
        }).then(response => {
          if (+response.code === 200) {
            this.ruleForm = {
              day1: response.data.condition ? response.data.condition.paymentTimeBody.day : null,
              hour1: response.data.condition ? response.data.condition.paymentTimeBody.hour : null,
              second1: response.data.condition ? response.data.condition.paymentTimeBody.seconds : null,
              minute1: response.data.condition ? response.data.condition.paymentTimeBody.minute : null,
              day2: response.data.condition ? response.data.condition.gatheringTimeBody.day : null,
              hour2: response.data.condition ? response.data.condition.gatheringTimeBody.hour : null,
              second2: response.data.condition ? response.data.condition.gatheringTimeBody.seconds : null,
              minute2: response.data.condition ? response.data.condition.gatheringTimeBody.minute : null,
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
                  paymentTimeBody: {
                    day: this.ruleForm.day1,
                    hour: this.ruleForm.hour1,
                    minute: this.ruleForm.minute1,
                    seconds: this.ruleForm.second1
                  },
                  gatheringTimeBody: {
                    day: this.ruleForm.day2,
                    hour: this.ruleForm.hour2,
                    minute: this.ruleForm.minute2,
                    seconds: this.ruleForm.second2
                  }
                },
                enabled: this.ruleForm.qijinyong1,
                id: this.isId,
                type: 0
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
.nlItem .el-form-item__content{
  margin-left: 0!important;
}
</style>

