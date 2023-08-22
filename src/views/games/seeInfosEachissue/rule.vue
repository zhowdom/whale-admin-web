<template>
  <div class="seeInfosEachissueBox">
    <el-form :model="formck" ref="queryForm" class="requiredStart">

        <h3 v-show="+editOrSeeStatus === 0">期数：第{{formck.periodsNum}}期</h3>


        <el-form-item label="产品图片:" :label-width="formLabelWidthck" class="lab1">
          <el-image style="height:88px;width:88px;" v-for="(item, index) in formck.images" :key="index" :src="item"></el-image>
        </el-form-item>

        <el-form-item label="商品描述:" :label-width="formLabelWidthck" prop="describe" class="lab1">
          <el-input style="width:600px;" type="textarea" :disabled="true" v-model.trim="formck.describe" autocomplete="off" maxlength="60"></el-input>
        </el-form-item>

        <el-form-item label="商品价格:" :label-width="formLabelWidthck" prop="price"  class="lab1">
          <el-input-number :disabled="true" v-model="formck.price" :min="0.02" :precision="2" controls-position="right"></el-input-number><span style="padding-left:10px;">USDT</span>
        </el-form-item>
        <el-form-item label="成本价:" :label-width="formLabelWidthck" prop="costPrice">
          <el-input-number :disabled="true" v-model="formck.costPrice" :min="0.01" :precision="2" controls-position="right"></el-input-number><span style="padding-left:10px;">USDT</span>
        </el-form-item>
        <el-form-item label="每份最小单位:" :label-width="formLabelWidthck" prop="unitWhalePeas" class="lab6">
          <el-input-number :disabled="true" :precision="6" v-model="formck.unitWhalePeas" :step="1" :min="0.000001" controls-position="right"></el-input-number><span style="padding-left:10px;">Candy</span>
        </el-form-item>
        <el-form-item label="总份数:" :label-width="formLabelWidthck" prop="totalNum" class="lab0">
          <el-input-number :disabled="true" :precision="0" v-model="formck.totalNum" :step="1" :min="1" controls-position="right"></el-input-number><span style="padding-left:10px;">份</span>
        </el-form-item>
        <el-form-item label="预估总需Candy:" :label-width="formLabelWidthck" prop="join">
          <el-input
            style="width:200px;"
            placeholder=""
            v-model="formck.totalWhalePeas"
            :disabled="true">
          </el-input><span style="padding-left:10px;">Candy</span>
        </el-form-item>
        <h3>规则配置</h3>
        <el-form-item label="起始时间:" :label-width="formLabelWidthck" prop="jewelRuleDate" class="lab1">
          <el-date-picker
            v-model="formck.jewelRuleDate"
            ref="jeweldateRange"
            :disabled="true"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="每人最大可认购份数:" :label-width="formLabelWidthck" prop="maxBuyNum" class="lab4">
          <el-input-number :disabled="true" @blur="((ev)=>{handleBlur(ev, 'maxBuyNum')})" :precision="0" v-model="formck.maxBuyNum" :step="1" :min="1" controls-position="right"></el-input-number><span style="padding-left:10px;">份</span>
        </el-form-item>
        <el-form-item label="公布中奖时间:" :label-width="formLabelWidthck" class="lab6 jewelenterVal">
          <el-input-number :disabled="true" style="width:109px;" step-strictly :precision="0" v-model="countDown.day" controls-position="right" :min="0" :max="200"></el-input-number><span style="padding:0 10px;" class="unit">天</span>
          <el-input-number :disabled="true" style="width:109px;" step-strictly :precision="0" v-model="countDown.hour" controls-position="right" :min="0" :max="23"></el-input-number><span style="padding:0 10px;" class="unit">时</span>
          <el-input-number :disabled="true" style="width:109px;" step-strictly :precision="0" v-model="countDown.min" controls-position="right" :min="0" :max="59"></el-input-number><span style="padding:0 10px;" class="unit">分</span>
          <el-input-number :disabled="true" style="width:109px;" step-strictly :precision="0" v-model="countDown.sec" controls-position="right" :min="0" :max="59"></el-input-number><span style="padding-left:10px;" class="unit">秒</span>
        </el-form-item>
        <el-form-item label="排序:" :label-width="formLabelWidthck" prop="sort" class="lab01">
          <el-input-number :disabled="true" :precision="0" v-model="formck.sort" :step="1" :min="1" controls-position="right"></el-input-number>
        </el-form-item>
        <h3>奖品配置</h3>
        <div style="padding-left:91px;">
          <p style="color:red;"><i class="el-icon-warning"></i>未中奖者获得的奖品,针对参与用户而言，与认购的份数无关; 可多选,非必填</p>
        <p>
          未中奖者获得奖品：优惠券
        </p>
        <p>
          优惠券编号：{{formck.couponNo}}
           <el-button v-hasPermi="['coupon:game:details']" :disabled="!formck.couponNo" type="primary" size="mini" @click="showCouponInfos(formck.couponId)">查看详情</el-button>
        </p>
        </div>
        


      </el-form>
      
      <!--优惠券详情-->
      <el-dialog
      title="优惠券详情"
      :visible.sync="dialogVisibleCoupon"
      width="39%">

      <p>
        到券方式：<span>游戏赠送</span>
      </p>
      <p>
        优惠券类型：<span>游戏用户群赠送优惠券</span>
      </p>
      <p>
        适用用户：<span>{{+gridDataCoupon.applyUserType === 0 ? '参与本期游戏用户' : '其他用户'}}</span>
      </p>
      <p>
        优惠券名称：<span>{{gridDataCoupon.name}}</span>
      </p>
      <!-- <p>
        总发行量：<span>{{+gridDataCoupon.stock}}</span>
      </p> -->
      <p>
        每人限领：<span>{{gridDataCoupon.limitNumber}}</span>
      </p>
      <p>
        使用门槛：<span>{{gridDataCoupon.useStr}}</span>
      </p>
      <p>
        有效期：<span>{{gridDataCoupon.effectiveStr}}</span>
      </p>
      <p>
        可使用商品：<span v-if="+gridDataCoupon.applyGoodsType === 0">全场通用</span>
        <span v-else-if="+gridDataCoupon.applyGoodsType === 1">指定商品</span>
        <span v-else-if="+gridDataCoupon.applyGoodsType === 2">指定分类</span>
        <span v-else-if="+gridDataCoupon.applyGoodsType === 3">指定供应商/指定自营店</span>
      </p>


      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisibleCoupon = false">取 消</el-button> -->
        <el-button type="primary" @click="dialogVisibleCoupon = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { jewelEachissueRuleDetails, jewelGameCouponsInfos } from "@/api/games";
import handleNumPow from '@/utils/handleNumPow';
  export default {
    components: {},
    data () {
      return {
        gridDataCoupon: {},
        dialogVisibleCoupon: false,
        countDown: {
          day: '',
          hour: '',
          min: '',
          sec: 1
        },
        formLabelWidthck: '160px',
        clickRowData: '',
        editOrSeeStatus: 0, // 仅仅是查看，只读
        formck: {
          describe: '',
          price: '',
          costPrice: '',
          unitWhalePeas: '',
          totalNum: '',
          maxBuyNum: '',
          sort: '',
          totalWhalePeas: '',
          jewelRuleDate: '',
          productTemplateId: '',
          productTemplateId_cachedVal: ''
        }
      }
    },
    mounted () {
      this.queryInfos()
    },
    watch: {},
    methods: {
      // 优惠券详情
      showCouponInfos (couponId) {
        this.dialogVisibleCoupon = true
        jewelGameCouponsInfos({
            couponId
          }).then(response => {
          if (+response.code === 200) {
            this.gridDataCoupon = Object.assign({}, response.data)
          } else {
            this.$message.error(response.message)
          }
        })
      },
      queryInfos () {
        jewelEachissueRuleDetails({
          id: this.$route.query.id
        }).then(response => {
          if (+response.code === 200) {
            if (response.data) {
              this.formck = Object.assign({}, response.data)
              this.formck.jewelRuleDate = [
                new Date(response.data.startTime),
                new Date(response.data.endTime)
              ]
              this.countDown = {
                day: response.data.countDown.day,
                hour: response.data.countDown.hour,
                min: response.data.countDown.min,
                sec: response.data.countDown.sec
              }
            }
          } else {
            this.$message.error(response.message)
          }
        })
      }
      
    }
  }
</script>

<style lang="scss" scoped>
.seeInfosEachissueBox{}
</style>

