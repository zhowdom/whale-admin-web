<template>
  <div class="order-setting">

    <el-form ref="form" v-loading="loading" :model="form" label-width="223px">
      <el-form-item label="抢购订单超过：" class="clearfix rela" required>
        <el-input-number class="mockSlotStyle customW juforDays fl thisW" :controls="false" :precision="0" v-model="form.rushShopping.d" controls-position="right" @change="handleChange" :min="0" :max="7" @blur="((ev)=>{handleBlur(ev, 1, 'd')})"></el-input-number>
        <el-input-number class="mockSlotStyle customW HounrSet fl thisW" :controls="false" :precision="0" v-model="form.rushShopping.h" controls-position="right" @change="handleChange" :min="0" :max="23" @blur="((ev)=>{handleBlur(ev, 1, 'h')})"></el-input-number>
        <el-input-number class="mockSlotStyle customW minuteSet fl thisW" :controls="false" :precision="0" v-model="form.rushShopping.m" controls-position="right" @change="handleChange" :min="0" :max="59" @blur="((ev)=>{handleBlur(ev, 1, 'm')})"></el-input-number>
        <span class="warnTipsSet fl">未付款，订单自动关闭（最小10分钟~最大7天）</span>
        <i class="errMsg" v-show="ifError1" ref="er1"></i>
      </el-form-item>

      <el-form-item label="正常订单超过：" class="clearfix" required>
        <el-input-number class="mockSlotStyle customW juforDays fl thisW" :controls="false" :precision="0" v-model="form.normalOrder.d" controls-position="right" @change="handleChange" :min="0" :max="7" @blur="((ev)=>{handleBlur(ev, 2, 'd')})"></el-input-number>
        <el-input-number class="mockSlotStyle customW HounrSet fl thisW" :controls="false" :precision="0" v-model="form.normalOrder.h" controls-position="right" @change="handleChange" :min="0" :max="23" @blur="((ev)=>{handleBlur(ev, 2, 'h')})"></el-input-number>
        <el-input-number class="mockSlotStyle customW minuteSet fl thisW" :controls="false" :precision="0" v-model="form.normalOrder.m" controls-position="right" @change="handleChange" :min="0" :max="59" @blur="((ev)=>{handleBlur(ev, 2, 'm')})"></el-input-number>
        <span class="warnTipsSet fl">未付款，订单自动关闭（最小30分钟~最大7天）</span>
        <i class="errMsg" v-show="ifError2" ref="er2"></i>
      </el-form-item>

      <el-form-item label="“待发货”订单退款超过：" class="clearfix" required>
        <el-input-number class="mockSlotStyle customW juforDays fl thisW" :controls="false" :precision="0" v-model="form.willDeliver.d" controls-position="right" @change="handleChange" :min="3" :max="7" @blur="((ev)=>{handleBlur(ev, 3, 'd')})"></el-input-number>
        <el-input-number class="mockSlotStyle customW HounrSet fl thisW" :controls="false" :precision="0" v-model="form.willDeliver.h" controls-position="right" @change="handleChange" :min="0" :max="23" @blur="((ev)=>{handleBlur(ev, 3, 'h')})"></el-input-number>
        <el-input-number class="mockSlotStyle customW minuteSet fl thisW" :controls="false" :precision="0" v-model="form.willDeliver.m" controls-position="right" @change="handleChange" :min="0" :max="59" @blur="((ev)=>{handleBlur(ev, 3, 'm')})"></el-input-number>
        <span class="warnTipsSet fl">未发货，系统自动退款（最小3天~最大7天）</span>
        <i class="errMsg" v-show="ifError3" ref="er3"></i>
      </el-form-item>

       <el-form-item label="收货超过：" class="clearfix" required>
        <el-input-number class="mockSlotStyle customW juforDays fl" :controls="false" :precision="0" v-model="form.deliverDelay.d" controls-position="right" @change="handleChange" :min="7" :max="30" @blur="((ev)=>{handleBlur(ev, 4, 'd')})"></el-input-number>
        <span class="warnTipsSet fl">未收货，订单自动完成（最小7天~最大30天）</span>
        <i class="errMsg" v-show="ifError4" ref="er4"></i>
      </el-form-item>

      <el-form-item label="订单完成超过：" class="clearfix" required>
        <el-input-number class="mockSlotStyle customW juforDays fl" :controls="false" :precision="0" v-model="form.complateDelay.d" controls-position="right" @change="handleChange" :min="15" :max="31" @blur="((ev)=>{handleBlur(ev, 5, 'd')})"></el-input-number>
        <span class="warnTipsSet fl">自动结束交易，不能申请售后（最小15天~最大31天）</span>
        <i class="errMsg" v-show="ifError5" ref="er5"></i>
      </el-form-item>

      <el-form-item label="自动好评：" class="clearfix" required>
        <el-input-number class="mockSlotStyle customW juforDays fl" :controls="false" :precision="0" v-model="form.autoComment.d" controls-position="right" @change="handleChange" :min="16" :max="32" @blur="((ev)=>{handleBlur(ev, 6, 'd')})"></el-input-number>
        <span class="warnTipsSet fl">自动五星好评（最小16天~最大32天）</span>
      </el-form-item>

      <el-form-item label="退款（无需退货）处理超时：" class="clearfix" required>
        <el-input-number class="mockSlotStyle customW juforDays fl" :controls="false" :precision="0" v-model="form.refund.d" controls-position="right" @change="handleChange" :min="5" :max="15" @blur="((ev)=>{handleBlur(ev, 7, 'd')})"></el-input-number>
        <span class="warnTipsSet fl">超时后，前端显示“商家处理超时”（最小5天~最大15天）</span>
      </el-form-item>

      <el-form-item label="退货退款处理超时" class="clearfix" required>
        <el-input-number class="mockSlotStyle customW juforDays fl" :controls="false" :precision="0" v-model="form.returnGoods.d" controls-position="right" @change="handleChange" :min="5" :max="15" @blur="((ev)=>{handleBlur(ev, 9, 'd')})"></el-input-number>
        <span class="warnTipsSet fl">超时后，前端显示“商家处理超时”（最小5天~最大15天）</span>
      </el-form-item>

      <el-form-item label="换货处理超时：" required class="clearfix">
        <el-input-number class="mockSlotStyle customW juforDays fl" :controls="false" :precision="0" v-model="form.replaceGoods.d" controls-position="right" @change="handleChange" :min="5" :max="15" @blur="((ev)=>{handleBlur(ev, 8, 'd')})"></el-input-number>
        <span class="warnTipsSet fl">超时后，前端显示“商家处理超时”（最小5天~最大15天）</span>
      </el-form-item>

      <el-form-item label="售后上传寄回凭证超时：" required class="clearfix">
        <el-input-number class="mockSlotStyle customW juforDays fl" :controls="false" :precision="0" v-model="form.uploadTimeOut.d" controls-position="right" @change="handleChange" :min="5" :max="15" @blur="((ev)=>{handleBlur(ev, 10, 'd')})"></el-input-number>
        <span class="warnTipsSet fl">超时后,前端显示 "超时未上传寄回凭证"(最小5 天 ~ 最大15天)</span>
      </el-form-item>

      <el-form-item class="clearfix">
        <el-button style="margin-left:59px;margin-top:39px;" class="fl" v-hasPermi="['order:timeout_setting:update']" :loading="btnLoading" type="primary" @click="saveClick">提交</el-button>
      </el-form-item>


    </el-form>

  </div>
</template>

<script>
  import { orderDelayQuery, orderDelayAlter } from "@/api/goods/goodsAbout";
  import handleNumPow from '@/utils/handleNumPow';
  export default {
    components: {},
    data () {
      return {
        ifError5: false,
        ifError4: false,
        ifError3: false,
        ifError2: false,
        ifError1: false,
        btnLoading: false,
        loading: false,
        form: {
          rushShopping: {
            id: '',
            type: 1, // 抢购订单超过
            d: 0,
            h: 0,
            m: 0
          },
          normalOrder: {
            id: '',
            type: 2, // 正常订单超过
            d: 0,
            h: 0,
            m: 0
          },
          willDeliver: {
            id: '',
            type: 3, // 待发货订单退款超过
            d: 0,
            h: 0,
            m: 0
          },
          deliverDelay: {
            id: '',
            type: 4, // 收货超过
            d: 0
          },
          complateDelay: {
            id: '',
            type: 5, // 订单完成超过
            d: 0
          },
          autoComment: {
            id: '',
            type: 6, // 自动好评
            d: 0
          },
          refund: {
            id: '',
            type: 7, // 退款(无需退货)处理超时
            d: 0
          },
          returnGoods: {
            id: '',
            type: 9, // 退货退款处理超时
            d: 0
          },
          replaceGoods: {
            id: '',
            type: 8, // 换货处理超时
            d: 0
          },
          uploadTimeOut: {
            id: '',
            type: 10, // 售后上传寄回凭证超时
            d: 0
          }
        }
      }
    },
    mounted () {
      this.search()
    },
    watch: {},
    methods: {
      // validate form
      validateForm () {
        return new Promise((resolve, reject) => {
          let count_errs = 0
          this.ifError1 = this.ifError2 = this.ifError3 = this.ifError4 = this.ifError5 = false
          // 抢购订单超过
          if (this.form.rushShopping.d === 7 && this.form.rushShopping.h !== 0 || this.form.rushShopping.d === 7 && this.form.rushShopping.m !== 0) {
            // this.$message.error('最大不能超过7天哦')
            this.$refs['er1'].innerHTML = '最大不能超过7天哦'
            this.ifError1 = true
            count_errs++
          }
          else if (this.form.rushShopping.d === 0 && this.form.rushShopping.h === 0 && this.form.rushShopping.m < 10) {
            // this.$message.error('最小不能小于10分钟哦')
            this.$refs['er1'].innerHTML = '最小不能小于10分钟哦'
            this.ifError1 = true
            count_errs++
          }
          // 正常订单超过
          if (this.form.normalOrder.d === 7 && this.form.normalOrder.h !== 0 || this.form.normalOrder.d === 7 && this.form.normalOrder.m !== 0) {
            // this.$message.error('最大不能超过7天哦')
            this.$refs['er2'].innerHTML = '最大不能超过7天哦'
            this.ifError2 = true
            count_errs++
          }
          else if (this.form.normalOrder.d === 0 && this.form.normalOrder.h === 0 && this.form.normalOrder.m < 30) {
            // this.$message.error('最小不能小于30分钟哦')
            this.$refs['er2'].innerHTML = '最小不能小于30分钟哦'
            this.ifError2 = true
            count_errs++
          }
          // 待发货订单退款超过
          if (this.form.willDeliver.d === 7 && this.form.willDeliver.h !== 0 || this.form.willDeliver.d === 7 && this.form.willDeliver.m !== 0) {
            // this.$message.error('最大不能超过7天哦.')
            this.$refs['er3'].innerHTML = '最大不能超过7天哦'
            this.ifError3 = true
            count_errs++
          }
          // 收货超过<订单完成超过<自动好评[form.deliverDelay.d < form.complateDelay.d < form.autoComment.d]
          if (this.form.autoComment.d <= this.form.complateDelay.d || this.form.autoComment.d <= this.form.deliverDelay.d) {
            // this.$message.error('自动好评时间不能小于订单完成超过、收货超过时间')
            this.$refs['er5'].innerHTML = '自动好评时间不能小于等于订单完成超过、收货超过时间'
            this.ifError5 = true
            count_errs++
          }
          if (this.form.complateDelay.d <= this.form.deliverDelay.d) {
            // this.$message.error('订单完成超过时间不能小于收货超过时间')
            this.$refs['er4'].innerHTML = '订单完成超过时间不能小于等于收货超过时间'
            this.ifError4 = true
            count_errs++
          }
          resolve(count_errs)
        })
      },
      async saveClick () {
        let _res = await this.validateForm()
        if (+_res === 0) {
          this.handleChange()
          this.btnLoading = true
          const _arr = []
          for (let s in this.form) {
            _arr.push({
              id: this.form[s].id,
              timeBody: {
                day: this.form[s].d,
                hour: this.form[s].h,
                minute: this.form[s].m
              },
              type: this.form[s].type
            })
          }
          orderDelayAlter({
            datas: _arr
          }).then(response => {
            if (response.code === 200) {
              this.msgSuccess(`提交成功`)
              this.search()
            } else {
              this.$message.error(response.message)
            }
            this.btnLoading = false
          }).catch(e => {
            this.btnLoading = false
          })
        }
      },
      search () {
        this.loading = this.btnLoading = true
        orderDelayQuery().then(response => {
          if (response.code === 200) {
            if (response.data.list.length > 0) {
              const _cachePoor = {}
              response.data.list.forEach(item => _cachePoor[`type${item.type}`] = item)
              this.form = {
                rushShopping: {
                  id: _cachePoor[`type1`] ? _cachePoor[`type1`].id : '',
                  type: 1, // 抢购订单超过
                  d: _cachePoor[`type1`] ? _cachePoor[`type1`].timeBody.day : 0,
                  h: _cachePoor[`type1`] ? _cachePoor[`type1`].timeBody.hour : 0,
                  m: _cachePoor[`type1`] ? _cachePoor[`type1`].timeBody.minute : 0
                },
                normalOrder: {
                  id: _cachePoor[`type2`] ? _cachePoor[`type2`].id : '',
                  type: 2, // 正常订单超过
                  d: _cachePoor[`type2`] ? _cachePoor[`type2`].timeBody.day : 0,
                  h: _cachePoor[`type2`] ? _cachePoor[`type2`].timeBody.hour : 0,
                  m: _cachePoor[`type2`] ? _cachePoor[`type2`].timeBody.minute : 0
                },
                willDeliver: {
                  id: _cachePoor[`type3`] ? _cachePoor[`type3`].id : '',
                  type: 3, // 待发货订单退款超过
                  d: _cachePoor[`type3`] ? _cachePoor[`type3`].timeBody.day : 0,
                  h: _cachePoor[`type3`] ? _cachePoor[`type3`].timeBody.hour : 0,
                  m: _cachePoor[`type3`] ? _cachePoor[`type3`].timeBody.minute : 0
                },
                deliverDelay: {
                  id: _cachePoor[`type4`] ? _cachePoor[`type4`].id : '',
                  type: 4, // 收货超过
                  d: _cachePoor[`type4`] ? _cachePoor[`type4`].timeBody.day : 0
                },
                complateDelay: {
                  id: _cachePoor[`type5`] ? _cachePoor[`type5`].id : '',
                  type: 5, // 订单完成超过
                  d: _cachePoor[`type5`] ? _cachePoor[`type5`].timeBody.day : 0
                },
                autoComment: {
                  id: _cachePoor[`type6`] ? _cachePoor[`type6`].id : '',
                  type: 6, // 自动好评
                  d: _cachePoor[`type6`] ? _cachePoor[`type6`].timeBody.day : 0
                },
                refund: {
                  id: _cachePoor[`type7`] ? _cachePoor[`type7`].id : '',
                  type: 7, // 退款(无需退货)处理超时
                  d: _cachePoor[`type7`] ? _cachePoor[`type7`].timeBody.day : 0
                },
                returnGoods: {
                  id: _cachePoor[`type9`] ? _cachePoor[`type9`].id : '',
                  type: 9, // 退货退款处理超时
                  d: _cachePoor[`type9`] ? _cachePoor[`type9`].timeBody.day : 0
                },
                replaceGoods: {
                  id: _cachePoor[`type8`] ? _cachePoor[`type8`].id : '',
                  type: 8, // 换货处理超时
                  d: _cachePoor[`type8`] ? _cachePoor[`type8`].timeBody.day : 0
                },
                uploadTimeOut: {
                  id: _cachePoor[`type10`] ? _cachePoor[`type10`].id : '',
                  type: 10, // 换货处理超时
                  d: _cachePoor[`type10`] ? _cachePoor[`type10`].timeBody.day : 0
                }
              }
            }
            this.loading = this.btnLoading = false
          } else {
            this.loading = this.btnLoading = false
            this.$message.error(response.message)
          }
        }).catch(e => {
          this.loading = this.btnLoading = false
        })
      },
      handleChange(value) {
        this.$forceUpdate()
      },
      async handleBlur (ev, type, key) {
        // blur后若输入内容为空，处理为显示对应特权类型的最小默认值
        if (ev.target.ariaValueNow === 'undefined') {
          ev.target.value = ev.target.ariaValueMin
          let _autoMatch = ''
          switch(type){
            case 1:
              _autoMatch = 'rushShopping'
              break;
            case 2:
              _autoMatch = 'normalOrder'
              break;
            case 3:
              _autoMatch = 'willDeliver'
              break;
            case 4:
              _autoMatch = 'deliverDelay'
              break;
            case 5:
              _autoMatch = 'complateDelay'
              break;
            case 6:
              _autoMatch = 'autoComment'
              break;
            case 7:
              _autoMatch = 'refund'
              break;
            case 8:
              _autoMatch = 'replaceGoods'
              break;
            case 9:
              _autoMatch = 'returnGoods'
              break;
            case 10:
              _autoMatch = 'uploadTimeOut'
              break;
          }
          this.form[`${_autoMatch}`][`${key}`] = ev.target.ariaValueMin
        }
        await this.validateForm()
      }
    }
  }
</script>
<style lang="scss" scoped>
$myColor: #8b939c;
.enterVal{
  padding: 29px 67px;
  & .unit{
    color: $myColor;
    padding:0 10px 0 10px;
  }
}
</style>
<style lang="scss">
$myColor: #8b939c;
.order-setting {
  width:929px;
  margin: 69px auto 0 auto;
  text-align: center;
  .warnTipsSet{
    padding-left: 30px;
    color: #909399;
    font-size: 13px;
  }
  .errMsg{
    position: absolute;
    top:27px;
    left: 0;
    font-style: normal;
    font-size: 12px;
    color: red;
  }
  .thisW{
    width:66px!important;
  }
  ul {
    padding: 0;
  }
  p{
    color: #909399;
    font-size:13px;
  }
  li{
    position: relative;
    margin-bottom: 19px;
    & .cliBtn {
      margin-left: 20px;
    }
    & :first-child .cliBtn{
      margin-left: 20px;
    }
    .cliBtnBox{
      position: absolute;
      top:0;
      right: 0;
    }
  }
  .separator {
    font-style: normal;
    padding: 0 39px;
    vertical-align: middle;
  }
  & .enterVal {
    padding: 29px 67px 0 67px;
  }
  & .customW {
    width:139px;
    & .el-input::after{
      right:-55px;
      content: '天'!important;
      text-align: center;
    }
  }
  & .HounrSet {
    margin-left:20px;
    & .el-input::after{
      content: '时'!important;
    }
  }
  & .minuteSet {
    margin-left:20px;
    & .el-input::after{
      content: '分'!important;
    }
  }
  .el-form-item__error{
    width:100%;
    text-align: center;
    padding-top: 10px;
  }
}
</style>

