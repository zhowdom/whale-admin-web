<template>
  <div class="seeInfosEachissueBox">


    <el-form :model="nLevelqueryParams" :rules="nLevelrules" ref="nLevelqueryForm" :inline="true">
      <el-form-item label="用户ID" prop="memberId">
        <el-input
          v-model.trim="nLevelqueryParams.memberId"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 100px"
        />
      </el-form-item>
      <el-form-item label="真实姓名" prop="realName">
        <el-input
          v-model.trim="nLevelqueryParams.realName"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 100px"
        />
      </el-form-item>
      <el-form-item label="期数" prop="periods">
        <el-input
          v-model.trim="nLevelqueryParams.periods"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item label="抢购时间" prop="redbacktime">
        <el-date-picker
          v-model="nLevelqueryParams.redbacktime"
          type="daterange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="主订单号" prop="orderNo">
        <el-input
          v-model.trim="nLevelqueryParams.orderNo"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 150px"
        />
      </el-form-item>
      
       <!-- <el-form-item label="开启复投">
        <el-select v-model="nLevelqueryParams.status" clearable placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="已开启" :value="1"></el-option>
          <el-option label="已禁用" :value="2"></el-option>
        </el-select>
    </el-form-item> -->

      <el-form-item>
        <el-button v-hasPermi="['blindBox:order:purchaseInfo']" type="primary" :loading="loading" icon="el-icon-search" @click="searchnLevel(1)">查询</el-button>
      </el-form-item>
    </el-form>
  <el-table :data="nLevelData" border>
    <el-table-column property="orderNo" label="主订单号"></el-table-column>
    <el-table-column property="periods" label="期数"></el-table-column>
    <el-table-column property="memberId" label="用户ID"></el-table-column>
    <el-table-column property="realName" label="真实姓名"></el-table-column>
    <el-table-column property="num" label="抢购份数">
        <template scope="scope">
        <p @click="bugFirstClick(scope.row)" style="color:#1890ff;cursor:pointer;text-decoration:underline;">{{scope.row.num || 0}}</p>
      </template>
    </el-table-column>
    <el-table-column property="payType" label="支付方式">
      <template scope="scope">
        <p v-if="+scope.row.payType === 1">支付宝</p>
        <p v-else-if="+scope.row.payType === 2">微信</p>
        <p v-else-if="+scope.row.payType === 3">余额</p>
        <p v-else-if="+scope.row.payType === 4">Candy</p>
        <p v-else-if="+scope.row.payType === 5">支付宝 + Candy</p>
        <p v-else-if="+scope.row.payType === 6">微信 + Candy</p>
        <p v-else-if="+scope.row.payType === 7">余额 + Candy</p>
      </template>
    </el-table-column>
    <el-table-column property="payWay" label="支付渠道">
      <template scope="scope">
        <p v-if="+scope.row.payWay === 1">自由支付</p>
        <p v-else-if="+scope.row.payWay === 2">现金+Candy支付</p>
        <p v-else-if="+scope.row.payWay === 3">纯Candy支付</p>
      </template>
    </el-table-column>
    <el-table-column property="payAmount" label="支付现金"></el-table-column>
    <el-table-column property="whalePeas" label="支付Candy"></el-table-column>
    <el-table-column property="whalePeasDeductionAmount" label="Candy抵扣（USDT）"></el-table-column>
    <el-table-column property="whalePeasDeductionNum" label="Candy抵扣（扣减：Candy）"></el-table-column>

    <el-table-column property="createTime" label="抢购时间">
      <template slot-scope="{row}">
        {{row.createTime ? $dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    style="padding-top:20px;"
    @current-change="searchnLevel"
    :page-sizes="[10, 20, 30]"
    @size-change="handleSizeChangenLevel"
    :current-page.sync="pageIndexnLevel"
    :page-size="pageSizenLevel"
    layout="total, sizes, prev, pager, next, jumper"
    :total="totalPagenLevel">
    </el-pagination>

    <!--通用型Dialog-s-->
    <el-dialog :title="`盲盒实物(期数：${curClickRowData.periods})`" :visible.sync="cmbTableVisible">
      <el-form :model="cm_nLevelqueryParams" :rules="nLevelrules" ref="nLevelqueryForm" :inline="true">
        <el-form-item label="子订单号" prop="orderItemNo">
          <el-input
            v-model.trim="cm_nLevelqueryParams.orderItemNo"
            placeholder="请输入"
            clearable
            size="small"
            style="width: 100px"
          />
        </el-form-item>
        <el-form-item label="货号" prop="itemNo">
          <el-input
            v-model.trim="cm_nLevelqueryParams.itemNo"
            placeholder="请输入"
            clearable
            size="small"
            style="width: 100px"
          />
        </el-form-item>
        <el-form-item label="实物名称" prop="itemName">
          <el-input
            v-model.trim="cm_nLevelqueryParams.itemName"
            placeholder="请输入"
            clearable
            size="small"
            style="width: 100px"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="loading" @click="cmbTableSearch(1)" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="cmbTableData" border>
        <el-table-column property="itemNo" label="序号" width="100"></el-table-column>
        <el-table-column property="orderItemNo" label="子订单号" width="150"></el-table-column>
        <el-table-column property="itemNo" label="货号" width="200"></el-table-column>
        <el-table-column property="itemName" label="实物名称"></el-table-column>
        <el-table-column property="img" label="图片">
          <template scope="scope">
            <img :src="scope.row.img" style="width:80px;height:80px;">
          </template>
        </el-table-column>
        <el-table-column property="costPrice" label="成本价（USDT）"></el-table-column>
        <el-table-column property="itemNum" label="数量"></el-table-column>
      </el-table>
      <el-pagination
        style="margin-top:10px;"
        @current-change="cmbTableSearch"
        :page-sizes="[10, 20, 30]"
        @size-change="cmbTablehandleSizeChange"
        :current-page.sync="cmbTablepageIndex"
        :page-size="cmbTablepageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="cmbTabletotalPage">
      </el-pagination>
    </el-dialog>
  <!--通用型Dialog-d-->



  </div>
</template>

<script>
import { blindBoxDetailspurchaseInfo, blindBoxDetailsGetByLockPage, blindBoxPurchaseInfoItemQuery, takejewelCodeList, zzJoyPoorTotalSwitchList } from "@/api/games";
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
        // 盲盒通用table-s
        cmbTableVisible: false,
        cmbTableData: [],
        cm_nLevelqueryParams: {
          orderItemNo: '',
          itemNo: '',
          itemName: ''
        },
        cmbTablepageIndex: 1,
        cmbTablepageSize: 10,
        cmbTabletotalPage: 0,
        // 盲盒通用table-d
        nLevelrules: {
          phone: [
            { validator: validatePhone, trigger: 'blur' }
          ]
        },
        nLevelqueryParams: {
          memberId: '',
          realName: '',
          periods: '',
          redbacktime: '',
          orderNo: '',
          blindBoxType: ''
        },
        nLevelPrizeTitle: '',
        pageIndexnLevel: 1,
        pageSizenLevel: 10,
        totalPagenLevel: 0,
        nLevelData: [],
        nLevelPrizesVisible: false,
        loading: false,
        curClickRowData: {}
      }
    },
    mounted () {
      this.searchnLevel(1)
    },
    watch: {},
    methods: {
      // 盲盒实物查询弹窗
      cmbTableSearch (pgi) {
        this.$refs['nLevelqueryForm'].validate((valid) => {
          if (valid) {
            // todo...
            if (pgi) this.cmbTablepageIndex = pgi
            let _params = {
              currentPage: this.cmbTablepageIndex,
              itemName: this.cm_nLevelqueryParams.itemName, // 实物名称
              itemNo: this.cm_nLevelqueryParams.itemNo, // 货号
              orderItemNo: this.cm_nLevelqueryParams.orderItemNo, // 子订单编号
              pageSize: this.cmbTablepageSize,
              orderId: this.curClickRowData.id,
            }
            this.loading = true
            blindBoxPurchaseInfoItemQuery(_params).then(response => {
              if (response.code === 200) {
                this.cmbTableData = response.data.list
                this.cmbTabletotalPage = response.data.total
                this.loading = false
              } else {
                this.cmbTableData = []
                this.cmbTabletotalPage = 0
                this.cmbTablepageSize = 10
                this.loading = false
                this.$message.error(response.message)
              }
            }).catch(e => {
              this.loading = false
            })
          }
        })
      },
      cmbTablehandleSizeChange (val) {
        this.cmbTablepageSize = val
        this.cmbTablepageIndex = 1
        this.cmbTableSearch()
      },
      // 盲盒通用table-d
      bugFirstClick (row) {
        this.cmbTableVisible = true
        this.curClickRowData = Object.assign({}, row)
        this.cmbTableSearch(1)
      },
      nLevelPrizeInfosClick (row) {
        this.nLevelPrizesVisible = true
        this.nLevelPrizeTitle = '二等奖管理（期数：200902）'
      },
      searchnLevel (pgi) {
        this.$refs['nLevelqueryForm'].validate((valid) => {
          if (valid) {
            // todo...
            if (pgi) this.pageIndexnLevel = pgi

            let datetime = []
            datetime = this.nLevelqueryParams.redbacktime
            let _params = {
              blindBoxNo: this.$route.query.blindBoxNo,
              currentPage: this.pageIndexnLevel,
              endTime: datetime ? this.$dayjs(datetime[1]).format('YYYY-MM-DD') : '',
              memberId: this.nLevelqueryParams.memberId,
              orderNo: this.nLevelqueryParams.orderNo,
              pageSize: this.pageSizenLevel,
              periods: this.nLevelqueryParams.periods,
              realName: this.nLevelqueryParams.realName,
              startTime: datetime ? this.$dayjs(datetime[0]).format('YYYY-MM-DD') : '',
              blindBoxType: this.$route.query.blindBoxType,
            }
            this.loading = true
            blindBoxDetailspurchaseInfo(_params).then(response => {
              if (response.code === 200) {
                this.nLevelData = response.data.list
                this.totalPagenLevel = response.data.total
                this.loading = false
              } else {
                this.nLevelData = []
                this.totalPagenLevel = 0
                this.pageSizenLevel = 10
                this.loading = false
                this.$message.error(response.message)
              }
            }).catch(e => {
              this.loading = false
            })
          }
        })
      },
      handleSizeChangenLevel (val) {
        this.pageSizenLevel = val
        this.pageIndexnLevel = 1
        this.isAuth.isPermi(['game:lottery:pool:getByPage']) && this.searchnLevel()
      },
    }
  }
</script>

<style lang="scss" scoped>
.seeInfosEachissueBox{}
</style>

