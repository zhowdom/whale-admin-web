<template>
  <div class="shareAddManagebox excFeeSetbox" style="padding:20px;">
<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm">

  
  <el-form-item label="">
    <el-radio v-model="ruleForm.switchStatus" label="1"><span>受转赠逻辑影响</span></el-radio>
    <p style="font-size:13px;color:rgb(129, 125, 125);">
      【转赠】逻辑，根据用户等级，确定扣除手续费比例 ，<br>
      需实际扣除数量 =  定义扣减数量 + 定义扣减数量 × 手续费比例<br>
      实际扣减贡献值  =  实际扣除数量 *  ( 实际扣除数量与贡献值 比例)<br>
    </p>
  </el-form-item>

  
  <el-form-item label="" prop="day1">
    <el-radio v-model="ruleForm.switchStatus" label="0"><span>不受转赠逻辑影响</span></el-radio>
    <div style="margin-top:30px;"></div>
    <span style="margin-right:10px;">按比例收取手续费</span>
    <el-input-number :min="0" :max="100" v-model="ruleForm.day1" :precision="0" :step="1" controls-position="right"></el-input-number><span class="mmUnit">%</span>
  </el-form-item>
    <div style="padding-left:211px;font-size:13px;color:rgb(129, 125, 125);">
    <p>
        1. 0-100 正整数，包头包尾； 是额外收取<br>
        <span style="padding-left:47px;">需实际扣除数量 =  定义扣减数量 + 定义扣减数量 × 手续费比例</span><br><br> 

        2. 样例：<br>
            <span style="padding-left:47px;">兑换数量 ： 100Candy ,  配置15%</span><br>
            <span style="padding-left:47px;">则扣除数量 = 100 × 15% + 100 = 115Candy</span><br>
      </p>
    </div>


  
  <el-form-item label="状态" prop="qijinyong1" style="margin-left:45px;">
      <el-switch v-model="ruleForm.qijinyong1"></el-switch>
    </el-form-item>

  <el-form-item>
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
        if (this.ruleForm.switchStatus == 0 && (value === '' || value === undefined)) {
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
          switchStatus: '1'
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
          type: 11
        }).then(response => {
          if (+response.code === 200) {
            this.ruleForm = {
              day1: response.data.condition ? response.data.condition.feeRito : null,
              switchStatus: response.data.condition ? (response.data.condition.giveAwayStatus ? '1' : '0') : '1',
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
                  feeRito: this.ruleForm.day1,
                  giveAwayStatus: this.ruleForm.switchStatus,
                },
                enabled: this.ruleForm.qijinyong1,
                id: this.isId,
                type: 11
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

