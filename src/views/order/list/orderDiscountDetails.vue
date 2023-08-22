<template>
  <div class="redBackDetailsBox">
    <el-form :model="queryParams" :rules="rules" ref="queryForm" :inline="true">
      <el-form-item label="真实姓名：" prop="realName">
        <el-input
          v-model="queryParams.realName"
          placeholder="输入真实姓名"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="手机号：" prop="mobileNumber">
        <el-input
          v-model="queryParams.mobileNumber"
          placeholder="输入手机号"
          clearable
          maxlength="11"
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="订单号：" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="输入订单号"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
       <el-form-item label="下单福利项" prop="orderWelfare">

        <el-select clearable v-model="queryParams.orderWelfare" placeholder="请选择">
          <el-option
            v-for="item in welfareArr"
            :key="item.type"
            :label="item.desc"
            :value="item.type">
          </el-option>
        </el-select>

    </el-form-item>

    <el-form-item label="下单使用优惠类型" prop="useCouponType">
        <el-select clearable v-model="queryParams.useCouponType" placeholder="请选择">
          <el-option
            v-for="item in usedDiscountArr"
            :key="item.value"
            :label="item.msg"
            :value="item.value">
          </el-option>
        </el-select>
    </el-form-item>

      <el-form-item label="下单时间：" prop="redbacktime">
        <el-date-picker
          v-model="queryParams.redbacktime"
          type="daterange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button v-hasPermi="['order:offer_detail:list']" type="primary" :loading="loading" icon="el-icon-search" @click="search(1)">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
    :data="tableData"
    @sort-change="sortChange"
    v-loading="loading"
    border
    style="width: 100%">
    <el-table-column
      prop="memberId"
      label="用户ID"
      align="center">
    </el-table-column>
    <el-table-column
      prop="realName"
      label="真实姓名"
      align="center">
    </el-table-column>
    <el-table-column
      prop="phone"
      label="手机号"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      prop="orderNo"
      label="订单号"
      width="189"
      align="center">
      <template scope="scope">
        <p v-hasPermi="['operation:order:info']" @click="jumpToOrderDetails(scope.row)" style="text-decoration: underline;color:#1890ff;cursor:pointer;">{{scope.row.orderNo}}</p>
      </template>
    </el-table-column>
    <el-table-column
      prop="createTime"
      label="下单时间"
      sortable="custom"
      width="160"
      align="center">
      <template slot-scope="{row}">
        {{row.createTime ? $dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
    </el-table-column>
    <el-table-column prop="orderAmount" align="center" label="订单金额（USDT）"></el-table-column>
    <el-table-column prop="orderPayWhalePeas" align="center" label="订单金额（Candy）"></el-table-column>
    <!-- <el-table-column
      prop="orderSourceAmount"
      label="订单原售价金额"
      align="center">
    </el-table-column> -->
    <el-table-column
      prop="orderGiveWhalePeas"
      label="下单赠送Candy"
      align="center">
    </el-table-column>
    <el-table-column
      prop="whalePeasDeductionNum"
      label="下单抵扣Candy"
      width="130"
      sortable="custom"
      align="center">
      <template scope="scope">

        <el-popover
        placement="right"
        width="400"
        trigger="hover">
        <p>下单抵扣Candy：{{scope.row.whalePeasDeductionNum}}</p>
        <p>所抵扣金额：{{scope.row.whalePeasDeduction}}</p>
        <p>剩余Candy：{{scope.row.surplusWhalePeas}}</p>
        <span slot="reference" style="text-decoration: underline;color:#1890ff;">{{scope.row.whalePeasDeductionNum}}</span>
      </el-popover>
      
      </template>
    </el-table-column>
    <el-table-column
      prop="contributionNum"
      label="下单赠送荣耀值"
      sortable="custom"
      align="center">
    </el-table-column>
    <el-table-column
      prop="orderShareNum"
      label="下单赠送分享值"
      sortable="custom"
      align="center">
    </el-table-column>
    <el-table-column
      prop="orderReadNum"
      label="下单赠送阅读值"
      sortable="custom"
      align="center">
    </el-table-column>
    <el-table-column
      prop="platformCouponAmount"
      label="平台优惠券金额"
      sortable="custom"
      align="center">
      <template scope="scope">
        <p>{{scope.row.platformCouponAmount || 0}}</p>
      </template>
    </el-table-column>
    <el-table-column
      prop="productCouponAmount"
      label="商品优惠券金额"
      sortable="custom"
      align="center">
      <template scope="scope">
        <p>{{scope.row.productCouponAmount || 0}}</p>
      </template>
    </el-table-column>
    <!-- <el-table-column
      prop="useCouponType"
      label="使用优惠券类型"
      align="center">
      <template scope="scope">
        <p v-if="+scope.row.useCouponType === 1">无门槛券</p>
        <p v-else-if="scope.row.useCouponType === null || scope.row.useCouponType === undefined">-</p>
        <p v-else-if="+scope.row.useCouponType === 0">满减券</p>
      </template>
    </el-table-column> -->
    <!-- <el-table-column
      prop="useCouponAmount"
      label="使用优惠券金额"
      sortable="custom"
      align="center">
    </el-table-column> -->
    <!-- <el-table-column
      prop="payAmount"
      label="订单实际支付金额"
      sortable="custom"
      align="center">
    </el-table-column> -->
    <el-table-column prop="orderPayAmountNum" align="center" label="实际支付（USDT）"></el-table-column>
    <el-table-column prop="orderWhalePeas" align="center" label="实际支付（Candy）"></el-table-column>

  </el-table>
  <el-pagination
  style="float:right;padding-top:20px;"
  @current-change="search"
  :page-sizes="[10, 20, 30]"
  @size-change="handleSizeChange"
  :current-page.sync="pageIndex"
  :page-size="pageSize"
  layout="total, sizes, prev, pager, next, jumper"
  :total="totalPage">
  </el-pagination>


  </div>
</template>

<script>
  import { productWelfareQueryList, orderDiscountDetailsList } from "@/api/presents";
  export default {
    components: {},
    data () {
      var validatePhone = (rule, value, callback) => {
        if (!(/^1[3456789]\d{9}$/.test(value)) && value !== '') {
          return callback(new Error('请输入正确的手机号码'))
        }
        callback()
      }
      return {
        usedDiscountArr: [
          {
            value: 0,
            msg: '满减券'
          },
          {
            value: 1,
            msg: '无门槛券'
          }
        ],
        welfareArr: [],
        rules: {
          phone: [
            { validator: validatePhone, trigger: 'blur' }
          ]
        },
        levelTag: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        queryParams: {
          realName: '',
          mobileNumber: '',
          orderNo: '',
          orderWelfare: '',
          useCouponType: '',
          redbacktime: '',
          orderItems: [] // ?
        },
        fhTypesArray: [],
        tableData: [],
        loading: false,
        gridData: [],
        cloneRowData: {},
        curSort: null
      }
    },
    filters: {
      valTransfer (val) {
        if (val === null || val === '') {
          return '-'
        } else {
          return `${((val * 100).toFixed(2) + '').replace(/(?:\.0*|(\.\d+?)0+)$/, '$1')}%`
        }
      }
    },
    created () {},
    mounted () {
      this.queryParams.phone = this.$route.query.phone || ''
      this.search()
      this.productWelfareQueryListRun()
    },
    watch: {},
    methods: {
      jumpToOrderDetails (row) {
        const query = {id: row.id, orderNo: row.orderNo, from: 'orderDiscountDetails'}
        this.$store.dispatch('tagsView/delView', this.$route).then(() => {
          this.$nextTick(() => {
            this.$router.replace({path: 'orderDetail', query})
          })
        })
      },
      productWelfareQueryListRun () {
        productWelfareQueryList().then(response => {
          if (response.code === 200) {
            this.welfareArr = response.data.list
          } else {
            this.welfareArr = []
            this.$message.error(response.message)
          }
        })
      },
      sortChange ({column, prop, order}) {
        switch (prop) {
          case 'createTime':
            this.curSort = order === 'ascending' ? 1 : 2
            break;
          case 'whalePeasDeductionNum':
            this.curSort = order === 'ascending' ? 3 : 4
            break;
          case 'contributionNum':
            this.curSort = order === 'ascending' ? 5 : 6
            break;
          case 'orderShareNum':
            this.curSort = order === 'ascending' ? 7 : 8
            break;
          case 'orderReadNum':
            this.curSort = order === 'ascending' ? 9 : 10
            break;
          case 'useCouponAmount':
            this.curSort = order === 'ascending' ? 11 : 12
            break;
          case 'payAmount':
            this.curSort = order === 'ascending' ? 13 : 14
            break;
        }
        this.search()
      },
      search (pgi, sort) {
        this.$refs['queryForm'].validate((valid) => {
          if (valid) {
            if (pgi) this.pageIndex = pgi
            let datetime = []
            datetime = this.queryParams.redbacktime
            let _params = {
              currentPage: this.pageIndex,
              endTime: datetime ? this.$dayjs(datetime[1]).format('YYYY-MM-DD') : '',
              mobileNumber: this.queryParams.mobileNumber,
              orderNo: this.queryParams.orderNo,
              orderWelfare: this.queryParams.orderWelfare,
              pageSize: this.pageSize,
              sort: this.curSort,
              realName: this.queryParams.realName,
              startTime: datetime ? this.$dayjs(datetime[0]).format('YYYY-MM-DD') : '',
              useCouponType: this.queryParams.useCouponType
            }
            this.loading = true
            orderDiscountDetailsList(_params).then(response => {
              if (response.code === 200) {
                this.tableData = response.data.list
                this.totalPage = response.data.total
                this.loading = false
              } else {
                this.tableData = []
                this.totalPage = 0
                this.pageSize = 10
                this.loading = false
                this.$message.error(response.message)
              }
            }).catch( e => {
              this.loading = false
            })
          }
        })
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.search()
      }
    }
  }
</script>

<style lang="scss">
.redBackDetailsBox{
  padding: 20px;
}
</style>
