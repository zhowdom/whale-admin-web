<template>
  <div class="shareAddManagebox" style="padding:20px;">
<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm">
  <h3>时间配置</h3>
  <el-form-item label="当天开市时间" prop="day1">

    <el-time-picker
    v-model="ruleForm.day1"
    value-format="timestamp"
    :picker-options="{
      selectableRange: '00:00:01 - 23:59:59'
    }"
    placeholder="">
  </el-time-picker>

    <!-- <el-input-number :min="0" :max="10000" v-model="ruleForm.day1" :precision="0" :step="1" step-strictly controls-position="right"></el-input-number><span class="mmUnit">个</span> -->
  </el-form-item>
  <el-form-item label="当天收市时间" prop="day2">
    <el-time-picker
    v-model="ruleForm.day2"
    value-format="timestamp"
    :picker-options="{
      selectableRange: '00:00:01 - 23:59:59'
    }"
    placeholder="">
  </el-time-picker>
    
    <!-- <el-input-number :min="0" :max="10000" v-model="ruleForm.day2" :precision="0" :step="1" step-strictly controls-position="right"></el-input-number><span class="mmUnit">个</span> -->
  </el-form-item>
   <h3>开市配置</h3>
  <el-form-item label="开市配置">
    
    <!-- <el-radio v-model="ruleForm.radio" label="1">周一至周五</el-radio>
    <el-radio v-model="ruleForm.radio" label="2">周六日</el-radio>
    <el-radio v-model="ruleForm.radio" label="3">国家节假日</el-radio> -->

    <el-checkbox v-model="ruleForm.checked1">周一至周五</el-checkbox>
    <el-checkbox v-model="ruleForm.checked2">周六日</el-checkbox>
    <el-checkbox v-model="ruleForm.checked3">国家节假日</el-checkbox>

    <p>
      <span style="color:red;">*</span> 选中，且启用，被勾选的，当天即开市 ，国家节假日优先，<br>
      （1）如果只勾选【国家节假日】，没有勾选【周一至周五】或【周六日】，在【国家节假日】当天开市。<br>
      （2）如果只勾选【周一至周五】或【周六日】，没有勾选【 国家节假日】的，在【周一至周五】或【周六日】中，有【国家节假日】当天不开市。
    </p>
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
          day1: 1648483201000, // +1000,就是多1秒
          day2: 1648569599000,
          qijinyong1: false,
          radio: '1',
          checked1: false,
          checked2: false,
          checked3: false,
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
      console.log('默认当天00:00:01的时间戳：', Date.parse(new Date('2022-3-29 00:00:01')))
      console.log('默认当天23:59:59的时间戳：', Date.parse(new Date('2022-3-29 23:59:59')))
      this.query()
    },
    watch: {},
    methods: {
      query () {
        atQuery({
          type: 9
        }).then(response => {
          if (+response.code === 200) {
            this.ruleForm = {
              day1: response.data.condition ? response.data.condition.startTime : null,
              day2: response.data.condition ? response.data.condition.endTime : null,

              checked1: response.data.condition?.workingOpenMarket,
              checked2: response.data.condition?.weekendOpenMarket,
              checked3: response.data.condition?.holidayOpenMarket,

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
            if (!this.ruleForm.checked1 && !this.ruleForm.checked2 && !this.ruleForm.checked) {
              this.$message.warning('开市配置必须勾选一项')
              return false
            }
            atSave(
              {
                condition: {
                  startTime: this.ruleForm.day1,
                  endTime: this.ruleForm.day2,
                  workingOpenMarket: this.ruleForm.checked1,
                  weekendOpenMarket: this.ruleForm.checked2,
                  holidayOpenMarket: this.ruleForm.checked3,
                },
                enabled: this.ruleForm.qijinyong1,
                id: this.isId,
                type: 9
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

