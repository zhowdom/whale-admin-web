<template>
  <div class="orderStatisticBox">
    <span>日期：</span>
    <el-date-picker
      v-model="value1"
      type="daterange"
      value-format="timestamp"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
    <el-button type="primary" @click="queryToday" :loading="loading" style="margin-left:10px;">查询</el-button>

  <div class="clearfix" style="padding-top:20px;">
    <div class="eachToufuODS clearfix fl">
      <div class="fl">
        <i class="el-icon-shopping-cart-full"></i>
      </div>
      <div class="fl infos">
        <p>订单总数</p>
        <p>{{obj1.orderNumber || 0}}</p>
      </div>
    </div>

    <div class="eachToufuODS clearfix fl">
      <div class="fl">
        <i class="el-icon-bank-card"></i>
      </div>
      <div class="fl infos">
        <p>销售总额（USDT）</p>
        <p>{{obj1.price || 0}}</p>
      </div>
    </div>
    <div class="eachToufuODS clearfix fl">
      <div class="fl">
        <i class="el-icon-soccer"></i>
      </div>
      <div class="fl infos">
        <p>销售总额(鲸豆)</p>
        <p>{{obj1.whalePeas || 0}}</p>
      </div>
    </div>
  </div>


<div class="clearfix btnmss" style="width:600px;margin-top:30px;">
    <div class="eachToufuODS clearfix fl">
      <div class="fl">
        <i class="el-icon-s-finance"></i>
      </div>
      <div class="fl infos">
        <p>昨日销售总额（USDT）</p>
        <p>{{obj2.yesterDayPrice || 0}}</p>
      </div>
    </div>

    <div class="eachToufuODS clearfix fl">
      <div class="fl">
        <i class="el-icon-s-marketing"></i>
      </div>
      <div class="fl infos">
        <p>近7天销售总额（USDT）</p>
        <p>{{obj2.sevenDayPrice || 0}}</p>
      </div>
    </div>
    <div class="eachToufuODS clearfix fl">
      <div class="fl">
        <i class="el-icon-s-data"></i>
      </div>
      <div class="fl infos">
        <p>昨日销售总额（USDT）</p>
        <p>{{obj2.yesterDayWhalePeas || 0}}</p>
      </div>
    </div>
     <div class="eachToufuODS clearfix fl">
      <div class="fl">
        <i class="el-icon-soccer"></i>
      </div>
      <div class="fl infos">
        <p>近7天销售总额(鲸豆)</p>
        <p>{{obj2.sevenDayWhalePeas || 0}}</p>
      </div>
    </div>
  </div>


  </div>
</template>

<script>
import {orderStatisticToday, orderStatisticPrevious} from '@/api/order/list';

export default {
  computed: {},
  data () {
    return {
      loading: false,
      value1: [(new Date()).getTime(), (new Date()).getTime()],
      obj1: {
        orderNumber: 0,
        price: 0,
        whalePeas: 0.000000
      },
      obj2: {
        yesterDayPrice: 0,
        sevenDayPrice: 0,
        yesterDayWhalePeas: 0.000000,
        sevenDayWhalePeas: 0.000000
      },
    }
  },
  created () {
    this.queryToday()
    this.queryPrevious()
  },
  mounted () {},
  methods: {
    queryToday () {
      this.loading = true
      orderStatisticToday({
        startTime: this.value1 && this.value1[0] || '',
        endTime: this.value1 && this.value1[1] || ''
      }).then(response => {
        this.loading = false
        if (response.code === 200) {
          let {orderNumber, price, whalePeas} = response.data
          this.obj1 = {
            orderNumber: orderNumber || 0,
            price: price || 0,
            whalePeas: whalePeas || 0.000000
          }
        } else {
          this.$message.error(response.message)
        }
      }).catch(({ error }) => {
        this.loading = false
        if (error) this.$message.error(error.message)
      })
    },
    queryPrevious () {
      orderStatisticPrevious(
        {}
      ).then(response => {
        if (response.code === 200) {
          let {yesterDayPrice, sevenDayPrice, yesterDayWhalePeas, sevenDayWhalePeas} = response.data
          this.obj2 = {
            yesterDayPrice: yesterDayPrice || 0,
            sevenDayPrice: sevenDayPrice || 0,
            yesterDayWhalePeas: yesterDayWhalePeas || 0.000000,
            sevenDayWhalePeas: sevenDayWhalePeas || 0.000000
          }
        } else {
          this.$message.error(response.message)
        }
      }).catch(({ error }) => {
        if (error) this.$message.error(error.message)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.orderStatisticBox{
  padding: 20px;
  .btnmss .eachToufuODS{
    margin-bottom: 30px;
  }
  .eachToufuODS{
    width:230px;
    border-radius: 6px;
    background: #fff;
    border:1px solid #ccc;
    margin-right:30px;
    box-shadow: 10px 10px 5px #888;
    i{
      color: #409eff;
      font-size: 39px;
      margin-top:23px;
      margin-left: 10px;
    }
  }
}
</style>
<style>
.orderStatisticBox .eachToufuODS .infos{
  width: calc(100% - 49px);
}
.orderStatisticBox .eachToufuODS .infos p{
  text-align: center;
}
</style>

