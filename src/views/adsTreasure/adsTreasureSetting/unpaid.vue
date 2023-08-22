<template>
  <div class="shareAddManagebox" style="padding:20px;">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
      <h3>对于普通用户</h3>
      <el-form-item label="惩罚" prop="publish1">
        <el-checkbox v-model="ruleForm.publish1">限制交易</el-checkbox>
      </el-form-item>

      <el-form-item label="统计时间" prop="tongji_day1">
        <span class="mmUnit">近</span><el-input-number :min="0" :max="365" v-model="ruleForm.tongji_day1" :step="1" step-strictly controls-position="right"></el-input-number><span class="mmUnit">天</span>
      </el-form-item>

      <el-form-item label="超时未支付累计次数" prop="unpaid_count1">
        <el-input-number :min="0" :max="100" v-model="ruleForm.unpaid_count1" :step="1" step-strictly controls-position="right"></el-input-number><span class="mmUnit">次</span>
      </el-form-item>

      <div class="clearfix">
        <el-form-item label="限制天数" prop="day1" class="fl">
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

      <el-form-item label="惩罚" prop="dj_publish1">
        <el-checkbox v-model="ruleForm.dj_publish1">冻结账户</el-checkbox>
      </el-form-item>

      <el-form-item label="统计时间" prop="dj_tongji_day1">
        <span class="mmUnit">近</span><el-input-number :min="0" :max="365" v-model="ruleForm.dj_tongji_day1" :step="1" step-strictly controls-position="right"></el-input-number><span class="mmUnit">天</span>
      </el-form-item>

      <el-form-item label="超时未支付累计次数" prop="dj_unpaid_count1">
        <el-input-number :min="0" :max="100" v-model="ruleForm.dj_unpaid_count1" :step="1" step-strictly controls-position="right"></el-input-number><span class="mmUnit">次</span>
      </el-form-item>


      <div class="clearfix">
        <el-form-item label="冻结天数" prop="day2" class="fl">
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


      <h3>对于广告商</h3>
      <el-form-item label="惩罚" prop="publish1_ads">
        <el-checkbox v-model="ruleForm.publish1_ads">限制交易</el-checkbox>
      </el-form-item>

      <el-form-item label="统计时间" prop="tongji_day1_ads">
        <span class="mmUnit">近</span><el-input-number :min="0" :max="365" v-model="ruleForm.tongji_day1_ads" :step="1" step-strictly controls-position="right"></el-input-number><span class="mmUnit">天</span>
      </el-form-item>

      <el-form-item label="超时未支付累计次数" prop="unpaid_count1_ads">
        <el-input-number :min="0" :max="100" v-model="ruleForm.unpaid_count1_ads" :step="1" step-strictly controls-position="right"></el-input-number><span class="mmUnit">次</span>
      </el-form-item>

      <div class="clearfix">
        <el-form-item label="限制天数" prop="day1_ads" class="fl">
          <el-input-number :min="0" :max="365" v-model="ruleForm.day1_ads" :step="1" step-strictly controls-position="right"></el-input-number><span class="mmUnit">天</span>
        </el-form-item>
        <el-form-item label="" prop="hour1_ads" class="nlItem fl">
          <el-input-number :min="0" :max="23" v-model="ruleForm.hour1_ads" :step="1" step-strictly controls-position="right"></el-input-number><span class="mmUnit">时</span>
        </el-form-item>
        <el-form-item label="" prop="minute1_ads" class="nlItem fl">
          <el-input-number :min="0" :max="59" v-model="ruleForm.minute1_ads" :step="1" step-strictly controls-position="right"></el-input-number><span class="mmUnit">分</span>
        </el-form-item>
        <el-form-item label="" prop="second1_ads" class="nlItem fl">
          <el-input-number :min="0" :max="59" v-model="ruleForm.second1_ads" :step="1" step-strictly controls-position="right"></el-input-number><span class="mmUnit">秒</span>
        </el-form-item>
      </div>

      <el-form-item label="惩罚" prop="dj_publish1_ads">
        <el-checkbox v-model="ruleForm.dj_publish1_ads">冻结账户</el-checkbox>
      </el-form-item>

      <el-form-item label="统计时间" prop="dj_tongji_day1_ads">
        <span class="mmUnit">近</span><el-input-number :min="0" :max="365" v-model="ruleForm.dj_tongji_day1_ads" :step="1" step-strictly controls-position="right"></el-input-number><span class="mmUnit">天</span>
      </el-form-item>

      <el-form-item label="超时未支付累计次数" prop="dj_unpaid_count1_ads">
        <el-input-number :min="0" :max="100" v-model="ruleForm.dj_unpaid_count1_ads" :step="1" step-strictly controls-position="right"></el-input-number><span class="mmUnit">次</span>
      </el-form-item>


      <div class="clearfix">
        <el-form-item label="冻结天数" prop="day2_ads" class="fl">
          <el-input-number :min="0" :max="365" v-model="ruleForm.day2_ads" :step="1" step-strictly controls-position="right"></el-input-number><span class="mmUnit">天</span>
        </el-form-item>
        <el-form-item label="" prop="hour2_ads" class="nlItem fl">
          <el-input-number :min="0" :max="23" v-model="ruleForm.hour2_ads" :step="1" step-strictly controls-position="right"></el-input-number><span class="mmUnit">时</span>
        </el-form-item>
        <el-form-item label="" prop="minute2_ads" class="nlItem fl">
          <el-input-number :min="0" :max="59" v-model="ruleForm.minute2_ads" :step="1" step-strictly controls-position="right"></el-input-number><span class="mmUnit">分</span>
        </el-form-item>
        <el-form-item label="" prop="second2_ads" class="nlItem fl">
          <el-input-number :min="0" :max="59" v-model="ruleForm.second2_ads" :step="1" step-strictly controls-position="right"></el-input-number><span class="mmUnit">秒</span>
        </el-form-item>
      </div>

      <el-form-item label="是否启用" prop="qijinyong1">
        <el-switch v-model="ruleForm.qijinyong1"></el-switch>
      </el-form-item>

      <p style="color:#817d7d;margin-left:145px;font-size:13px;margin-bottom:30px;">
        * 对于普通用户，<br>
        1.  对于普通用户，限制交易<br>
            （1）是指不可以在【市场】上重新操作【买入】 或【卖出】的行为 ；<br>
            （2）但可以【发布广告】，【兑换】，【拆解 】 等行为；<br>
            （3）未处理完结的订单可以继续处理，只是不可发起新订单。<br><br>

        2.  对于广告商，限制交易<br>
            （1）是指不可以【发布广告】的行为 ；<br>
            （2）但可以【市场】【买入】 或【卖出】，【兑换】，【拆解 】 等行为；<br>
            （3）未处理完结的订单可以继续处理，只是不可发起新订单。<br><br>

        3. 冻结账户<br>
            （1）是指不可以在【广告宝】模块，操作任何行为；<br>
            （2）未处理完结的订单可以继续处理，只是不可操作其他行为；<br><br>

        4. 限制交易或冻结账户严重程度排序， 冻结账户严重程度较高。<br><br>

        5. 限制交易或冻结账户的时长<br>
            如出现多个【冻结行为】，取【冻结账户】 违规行为最长的时间。<br>
      </p>

      <el-form-item>
        <el-button v-hasPermi="['advertising:treasure:saveorupdate']" type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { atSave, atQuery } from "@/api/adsTreasure";
  export default {
    components: {},
    data () {
      var validatetongji_day1 = (rule, value, callback) => {
        if ((value === '' || value === undefined) && this.ruleForm.publish1) {
          callback(new Error('请输入0-365的整数'));
        }
        callback()
      };
      var validatedj_tongji_day1 = (rule, value, callback) => {
        if ((value === '' || value === undefined) && this.ruleForm.dj_publish1) {
          callback(new Error('请输入0-365的整数'));
        }
        callback()
      };
      var validateunpaid_count1 = (rule, value, callback) => {
        if ((value === '' || value === undefined) && this.ruleForm.publish1) {
          callback(new Error('请输入0-100的整数'));
        }
        callback()
      };
      var validatedj_unpaid_count1 = (rule, value, callback) => {
        if ((value === '' || value === undefined) && this.ruleForm.dj_publish1) {
          callback(new Error('请输入0-100的整数'));
        }
        callback()
      };
      var validateday1 = (rule, value, callback) => {
        if ((value === '' || value === undefined) && this.ruleForm.publish1) {
          callback(new Error('请输入0-365的整数'));
        }
        callback()
      };
      var validatehour1 = (rule, value, callback) => {
        if ((value === '' || value === undefined) && this.ruleForm.publish1) {
          callback(new Error('请输入0-23的整数'));
        }
        callback()
      };
      var validatesecond1 = (rule, value, callback) => {
        if ((value === '' || value === undefined) && this.ruleForm.publish1) {
          callback(new Error('请输入0-59的整数'));
        }
        callback()
      };
      var validateminute1 = (rule, value, callback) => {
        if ((value === '' || value === undefined) && this.ruleForm.publish1) {
          callback(new Error('请输入0-59的整数'));
        }
        callback()
      };

      var validateday2 = (rule, value, callback) => {
        if ((value === '' || value === undefined) && this.ruleForm.dj_publish1) {
          callback(new Error('请输入0-365的整数'));
        }
        callback()
      };
      var validatehour2 = (rule, value, callback) => {
        if ((value === '' || value === undefined) && this.ruleForm.dj_publish1) {
          callback(new Error('请输入0-23的整数'));
        }
        callback()
      };
      var validatesecond2 = (rule, value, callback) => {
        if ((value === '' || value === undefined) && this.ruleForm.dj_publish1) {
          callback(new Error('请输入0-59的整数'));
        }
        callback()
      };
      var validateminute2 = (rule, value, callback) => {
        if ((value === '' || value === undefined) && this.ruleForm.dj_publish1) {
          callback(new Error('请输入0-59的整数'));
        }
        callback()
      };
      // 广告商
      var validatetongji_day1_ads = (rule, value, callback) => {
        if ((value === '' || value === undefined) && this.ruleForm.publish1_ads) {
          callback(new Error('请输入0-365的整数'));
        }
        callback()
      };
      var validatedj_tongji_day1_ads = (rule, value, callback) => {
        if ((value === '' || value === undefined) && this.ruleForm.dj_publish1_ads) {
          callback(new Error('请输入0-365的整数'));
        }
        callback()
      };
      var validateunpaid_count1_ads = (rule, value, callback) => {
        if ((value === '' || value === undefined) && this.ruleForm.publish1_ads) {
          callback(new Error('请输入0-100的整数'));
        }
        callback()
      };
      var validatedj_unpaid_count1_ads = (rule, value, callback) => {
        if ((value === '' || value === undefined) && this.ruleForm.dj_publish1_ads) {
          callback(new Error('请输入0-100的整数'));
        }
        callback()
      };
      var validateday1_ads = (rule, value, callback) => {
        if ((value === '' || value === undefined) && this.ruleForm.publish1_ads) {
          callback(new Error('请输入0-365的整数'));
        }
        callback()
      };
      var validatehour1_ads = (rule, value, callback) => {
        if ((value === '' || value === undefined) && this.ruleForm.publish1_ads) {
          callback(new Error('请输入0-23的整数'));
        }
        callback()
      };
      var validatesecond1_ads = (rule, value, callback) => {
        if ((value === '' || value === undefined) && this.ruleForm.publish1_ads) {
          callback(new Error('请输入0-59的整数'));
        }
        callback()
      };
      var validateminute1_ads = (rule, value, callback) => {
        if ((value === '' || value === undefined) && this.ruleForm.publish1_ads) {
          callback(new Error('请输入0-59的整数'));
        }
        callback()
      };

      var validateday2_ads = (rule, value, callback) => {
        if ((value === '' || value === undefined) && this.ruleForm.dj_publish1_ads) {
          callback(new Error('请输入0-365的整数'));
        }
        callback()
      };
      var validatehour2_ads = (rule, value, callback) => {
        if ((value === '' || value === undefined) && this.ruleForm.dj_publish1_ads) {
          callback(new Error('请输入0-23的整数'));
        }
        callback()
      };
      var validatesecond2_ads = (rule, value, callback) => {
        if ((value === '' || value === undefined) && this.ruleForm.dj_publish1_ads) {
          callback(new Error('请输入0-59的整数'));
        }
        callback()
      };
      var validateminute2_ads = (rule, value, callback) => {
        if ((value === '' || value === undefined) && this.ruleForm.dj_publish1_ads) {
          callback(new Error('请输入0-59的整数'));
        }
        callback()
      };
     
      return {
        isId: null,
        ruleForm: {
          publish1: true,
          dj_publish1: true,
          tongji_day1: '',
          dj_tongji_day1: '',
          unpaid_count1: '',
          dj_unpaid_count1: '',
          day1: '',
          hour1: '',
          second1: '',
          minute1: '',
          day2: '',
          hour2: '',
          second2: '',
          minute2: '',
          qijinyong1: false,
          publish1_ads: true,
          dj_publish1_ads: true,
          tongji_day1_ads: '',
          dj_tongji_day1_ads: '',
          unpaid_count1_ads: '',
          dj_unpaid_count1_ads: '',
          day1_ads: '',
          hour1_ads: '',
          second1_ads: '',
          minute1_ads: '',
          day2_ads: '',
          hour2_ads: '',
          second2_ads: '',
          minute2_ads: '',
        },
        rules: {
          tongji_day1: [
            { validator: validatetongji_day1, trigger: 'blur' }
          ],
          dj_tongji_day1: [
            { validator: validatedj_tongji_day1, trigger: 'blur' }
          ],
          unpaid_count1: [
            { validator: validateunpaid_count1, trigger: 'blur' }
          ],
          dj_unpaid_count1: [
            { validator: validatedj_unpaid_count1, trigger: 'blur' }
          ],
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
          ], // 广告商
          tongji_day1_ads: [
            { validator: validatetongji_day1_ads, trigger: 'blur' }
          ],
          dj_tongji_day1_ads: [
            { validator: validatedj_tongji_day1_ads, trigger: 'blur' }
          ],
          unpaid_count1_ads: [
            { validator: validateunpaid_count1_ads, trigger: 'blur' }
          ],
          dj_unpaid_count1_ads: [
            { validator: validatedj_unpaid_count1_ads, trigger: 'blur' }
          ],
          day1_ads: [
            { validator: validateday1_ads, trigger: 'blur' }
          ],
          hour1_ads: [
            { validator: validatehour1_ads, trigger: 'blur' }
          ],
          second1_ads: [
            { validator: validatesecond1_ads, trigger: 'blur' }
          ],
          minute1_ads: [
            { validator: validateminute1_ads, trigger: 'blur' }
          ],
          day2_ads: [
            { validator: validateday2_ads, trigger: 'blur' }
          ],
          hour2_ads: [
            { validator: validatehour2_ads, trigger: 'blur' }
          ],
          second2_ads: [
            { validator: validatesecond2_ads, trigger: 'blur' }
          ],
          minute2_ads: [
            { validator: validateminute2_ads, trigger: 'blur' }
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
          type: 1
        }).then(response => {
          if (+response.code === 200) {
            this.ruleForm = {
              publish1: response.data.condition ? response.data.condition.pLimitTradeStatus : false,
              tongji_day1: response.data.condition ? response.data.condition.pLimitDayNum : null,
              unpaid_count1: response.data.condition ? response.data.condition.pLimitNumber : null,
              day1: response.data.condition ? response.data.condition.pLimitTimeBody.day : null,
              hour1: response.data.condition ? response.data.condition.pLimitTimeBody.hour : null,
              minute1: response.data.condition ? response.data.condition.pLimitTimeBody.minute : null,
              second1: response.data.condition ? response.data.condition.pLimitTimeBody.seconds: null,
              dj_publish1: response.data.condition ? response.data.condition.pFrozenAccountStatus : false,
              dj_tongji_day1: response.data.condition ? response.data.condition.pFrozenDayNum : null,
              dj_unpaid_count1: response.data.condition ? response.data.condition.pFrozenNumber : null,
              day2: response.data.condition ? response.data.condition.pFrozenTimeBody.day : null,
              hour2: response.data.condition ? response.data.condition.pFrozenTimeBody.hour : null,
              minute2: response.data.condition ? response.data.condition.pFrozenTimeBody.minute : null,
              second2: response.data.condition ? response.data.condition.pFrozenTimeBody.seconds: null,

              publish1_ads: response.data.condition ? response.data.condition.gLimitTradeStatus : false,
              tongji_day1_ads: response.data.condition ? response.data.condition.gLimitDayNum : null,
              unpaid_count1_ads: response.data.condition ? response.data.condition.gLimitNumber : null,
              day1_ads: response.data.condition ? response.data.condition.gLimitTimeBody.day : null,
              hour1_ads: response.data.condition ? response.data.condition.gLimitTimeBody.hour : null,
              minute1_ads: response.data.condition ? response.data.condition.gLimitTimeBody.minute : null,
              second1_ads: response.data.condition ? response.data.condition.gLimitTimeBody.seconds : null,
              dj_publish1_ads: response.data.condition ? response.data.condition.gFrozenAccountStatus : false,
              dj_tongji_day1_ads: response.data.condition ? response.data.condition.gFrozenDayNum : null,
              dj_unpaid_count1_ads: response.data.condition ? response.data.condition.gFrozenNumber : null,
              day2_ads: response.data.condition ? response.data.condition.gFrozenTimeBody.day: null,
              hour2_ads: response.data.condition ? response.data.condition.gFrozenTimeBody.hour: null,
              minute2_ads: response.data.condition ? response.data.condition.gFrozenTimeBody.minute: null,
              second2_ads: response.data.condition ? response.data.condition.gFrozenTimeBody.seconds: null,

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
                  pLimitTradeStatus: this.ruleForm.publish1,
                  pLimitDayNum: this.ruleForm.tongji_day1,
                  pLimitNumber: this.ruleForm.unpaid_count1,
                  pLimitTimeBody: {
                    day: this.ruleForm.day1,
                    hour: this.ruleForm.hour1,
                    minute: this.ruleForm.minute1,
                    seconds: this.ruleForm.second1
                  },
                  pFrozenAccountStatus: this.ruleForm.dj_publish1,
                  pFrozenTimeBody: {
                    day: this.ruleForm.day2,
                    hour: this.ruleForm.hour2,
                    minute: this.ruleForm.minute2,
                    seconds: this.ruleForm.second2
                  },
                  pFrozenDayNum: this.ruleForm.dj_tongji_day1,
                  pFrozenNumber: this.ruleForm.dj_unpaid_count1,
                  gLimitTradeStatus: this.ruleForm.publish1_ads,
                  gLimitDayNum: this.ruleForm.tongji_day1_ads,
                  gLimitNumber: this.ruleForm.unpaid_count1_ads,
                  gLimitTimeBody: {
                    day: this.ruleForm.day1_ads,
                    hour: this.ruleForm.hour1_ads,
                    minute: this.ruleForm.minute1_ads,
                    seconds: this.ruleForm.second1_ads
                  },
                  gFrozenAccountStatus: this.ruleForm.dj_publish1_ads,
                  gFrozenTimeBody: {
                    day: this.ruleForm.day2_ads,
                    hour: this.ruleForm.hour2_ads,
                    minute: this.ruleForm.minute2_ads,
                    seconds: this.ruleForm.second2_ads,
                  },
                  gFrozenDayNum: this.ruleForm.dj_tongji_day1_ads,
                  gFrozenNumber: this.ruleForm.dj_unpaid_count1_ads,
                },
                enabled: this.ruleForm.qijinyong1,
                id: this.isId,
                type: 1
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

