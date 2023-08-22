<template>
  <div class="redBackDetailsBox">
    <el-form :model="queryParams" ref="queryForm" :rules="rules" :inline="true">
      <el-form-item label="真实姓名" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="输入真实姓名"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="输入手机号"
          clearable
          maxlength="11"
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="queryParams.email"
          placeholder="输入邮箱"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>

      <el-form-item>
        <el-button v-hasPermi="['internal:whale:peas:transfer:page']" type="primary" :loading="loading" icon="el-icon-search" @click="search(1)">查询</el-button>
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
      prop="userName"
      width="120"
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
      prop="email"
      label="邮箱"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      prop="whalePeasMax"
      sortable="custom"
      width="130"
      label="Candy最高纪录"
      align="center">
    </el-table-column>
    <el-table-column
      prop="whalePeasTask"
      sortable="custom"
      width="150"
      label="任务奖励Candy"
      align="center">
    </el-table-column>
    <el-table-column
      prop="whalePeasReceive"
      sortable="custom"
      label="获赠Candy"
      width="100"
      align="center">
    </el-table-column>
    <el-table-column
      prop="whalePeasTopUp"
      sortable="custom"
      label="充值Candy"
      width="100"
      align="center">
    </el-table-column>
    <el-table-column
      prop="whalePeasActive"
      sortable="custom"
      width="160"
      :render-header="renderHeaderWhalePeasActive"
      align="center">
    </el-table-column>
    <el-table-column
      prop="whalePeasCityActive"
      width="160"
      sortable="custom"
      :render-header="renderHeaderWhalePeasCityActive"
      align="center">
    </el-table-column>
    <el-table-column
      prop="whalePeasRead"
      width="120"
      sortable="custom"
      label="看视频收益"
      align="center">
    </el-table-column>
    <el-table-column
      prop="whalePeasAsterisk"
      width="120"
      sortable="custom"
      label="星级分红"
      align="center">
    </el-table-column>
    <el-table-column
      prop="whalePeasCity"
      width="160"
      sortable="custom"
      label="城市服务商分红"
      align="center">
    </el-table-column>
    <el-table-column
      prop="whalePeasWhile"
      width="130"
      sortable="custom"
      label="市场部分红"
      align="center">
    </el-table-column>
    <el-table-column
      prop="whalePeasPrerogative"
      width="150"
      sortable="custom"
      label="特权赠送Candy"
      align="center">
    </el-table-column>
    <el-table-column
      prop="whalePeasOrder"
      width="150"
      sortable="custom"
      label="下单赠送Candy"
      align="center">
      <template scope="scope">
        <p>{{scope.row.whalePeasOrder}}</p>
      </template>
    </el-table-column>
    <el-table-column
      prop="whalePeas"
      width="120"
      sortable="custom"
      label="剩余Candy"
      align="center">
      <template scope="scope">
        <!-- <p @click="seeDetails(scope.row)">{{scope.row.whalePeas}}</p> -->
        <p>{{scope.row.whalePeas}}</p>
      </template>
    </el-table-column>
    <el-table-column
      prop="whalePeasPurchase"
      width="150"
      sortable="custom"
      label="兑换任务所花Candy"
      align="center">
    </el-table-column>
    <el-table-column
      prop="whalePeasTransfer"
      width="150"
      sortable="custom"
      label="已转赠Candy"
      align="center">
    </el-table-column>
    <el-table-column
      prop="whalePeasExtract"
      sortable="custom"
      label="提现Candy"
      width="100"
      align="center">
    </el-table-column>
    <el-table-column
      prop="whalePeasPrerogativeDeduct"
      sortable="custom"
      label="特权削减Candy"
      width="100"
      align="center">
    </el-table-column>
    <el-table-column
      prop="whalePeasOrderDeduct"
      width="150"
      sortable="custom"
      label="下单抵扣Candy"
      align="center">
      <template scope="scope">
        <p>{{scope.row.whalePeasOrderDeduct}}</p>
      </template>
    </el-table-column>
    <el-table-column
      prop="whalePeasGameDeduction"
      label="游戏扣减额">
      <template slot="header" slot-scope="scope">
        游戏扣减额
        <el-tooltip
        class="item"
        effect="dark"
        content="游戏扣减额 = 每局参与游戏所需的Candy"
        placement="top">
        <i class="el-icon-info"></i>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column
      prop="whalePeasGameAward"
      label="游戏增加额">
      <template slot="header" slot-scope="scope">
        游戏增加额
        <el-tooltip
        class="item"
        effect="dark"
        content="游戏增加额 = 猜中奖励"
        placement="top">
        <i class="el-icon-info"></i>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column
      prop="whalePeasGameExtraIncome"
      label="游戏收益">
      <template slot="header" slot-scope="scope">
        游戏收益
        <el-tooltip
        class="item"
        effect="dark"
        content="游戏收益 = 团长收益"
        placement="top">
        <i class="el-icon-info"></i>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column
      prop="whalePeasOrderPay"
      label="下单变动Candy"
      width="100"
      align="center">
    </el-table-column>
    <el-table-column
      prop="whalePeasAdExchange"
      label="广告宝兑换"
      width="100"
      align="center">
    </el-table-column>
    <el-table-column
      prop="whalePeasAdExchangeFee"
      label="广告宝兑换手续费"
      width="100"
      align="center">
    </el-table-column>
    <el-table-column
      prop="whalePeasAdDecompose"
      label="广告宝拆解"
      width="100"
      align="center">
    </el-table-column>
    <el-table-column
      prop="whalePeasAdReturnFee"
      label="广告宝退还手续费"
      width="100"
      align="center">
    </el-table-column>
    <el-table-column
      prop="whalePeasAdServiceFee"
      label="广告宝服务费"
      width="100"
      align="center">
    </el-table-column>
    <el-table-column
      prop="whalePeasAdReturnServiceFee"
      label="广告宝服务费退还"
      width="100"
      align="center">
    </el-table-column>
    <el-table-column
      prop="whalePeasOTCServiceFee"
      label="OTC 服务费"
      width="100"
      align="center">
    </el-table-column>
    <el-table-column
      prop="whalePeasOTCReturnServiceFee"
      label="OTC服务费退还"
      width="100"
      align="center">
    </el-table-column>
    
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
import { peanTotalList } from "@/api/pean/index";
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
          userName: '',
          phone: '',
          email: '',
          selectedLevelTag: '',
          orderItems: []
        },
        tableData: [],
        loading: false
      }
    },
    mounted () {
      // this.search()
    },
    watch: {},
    methods: {
      renderHeaderWhalePeasActive (h, { column, $index }) {
        return h('span', {
          attrs: {
            type: 'text'
          },
          domProps: {
            innerHTML: this.handleCore(1)
          }
        })
      },
      renderHeaderWhalePeasCityActive (h, { column, $index }) {
        return h('span', {
          attrs: {
            type: 'text'
          },
          domProps: {
            innerHTML: this.handleCore(2)
          }
        })
      },
      handleCore (type) {
        let _txt = ''
        switch(type) {
          case 1:
            _txt = '<p class="cstmHeader">推广活跃值转</p>换Candy数量'
            break;
          case 2:
            _txt = '<p class="cstmHeader">城市服务商推广活跃</p>值转换Candy数量'
            break;
        }
        return _txt
      },
      seeDetails (row) {
        // 跳转到Candy总统计->每一列对应子页面(原型暂未提供...)
        // this.$router.push('/statistics/totalNextPean')
      },
      sortChange ({column, prop, order}) {
        this.queryParams.orderItems = [{ asc: order === 'ascending', column: prop.replace(/([A-Z])/g, '_$1').toLowerCase() }]
        this.search()
      },
      search (pgi) {
        this.$refs['queryForm'].validate((valid) => {
          if (valid) {
            if (pgi) this.pageIndex = pgi
              let datetime = []
              let _params = {
                currentPage: this.pageIndex,
                orderItems: this.queryParams.orderItems,
                pageSize: this.pageSize,
                phone: this.queryParams.phone,
                email: this.queryParams.email,
                userName: this.queryParams.userName,
              }
              this.loading = true
              peanTotalList(_params).then(response => {
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
.redBackDetailsBox {
  & .cstmHeader {
    padding: 0;
    margin: 0;
  }
}
</style>
