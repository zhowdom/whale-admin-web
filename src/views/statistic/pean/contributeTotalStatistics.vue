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
        <el-button v-hasPermi="['dedicate:worth:statistic:page']" type="primary" :loading="loading" icon="el-icon-search" @click="search(1)">查询</el-button>
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
      prop="dedicateWorthMax"
      sortable="custom"
      width="150"
      label="荣耀值最高记录"
      align="center">
    </el-table-column>
    <el-table-column
      prop="dedicateWorthTask"
      sortable="custom"
      width="150"
      label="做任务转化荣耀值"
      align="center">
    </el-table-column>
    <el-table-column
      prop="dedicateWorthReceive"
      sortable="custom"
      label="获赠转化荣耀值"
      width="150"
      align="center">
    </el-table-column>
    
    <el-table-column
      prop="dedicateWorthRead"
      width="120"
      sortable="custom"
      label="看视频收益"
      align="center">
    </el-table-column>
    <el-table-column
      prop="dedicateWorthAsterisk"
      width="120"
      sortable="custom"
      label="星级分红"
      align="center">
    </el-table-column>
    <el-table-column
      prop="dedicateWorthCity"
      width="160"
      sortable="custom"
      label="城市服务商分红"
      align="center">
    </el-table-column>
    <el-table-column
      prop="dedicateWorthWhile"
      width="130"
      sortable="custom"
      label="市场部分红"
      align="center">
    </el-table-column>
    <el-table-column
      prop="dedicateWorthPrerogative"
      width="150"
      sortable="custom"
      label="特权赠送荣耀值"
      align="center">
    </el-table-column>
    <el-table-column
      prop="dedicateWorthOrder"
      width="150"
      sortable="custom"
      label="下单赠送荣耀值"
      align="center">
    </el-table-column>
    <el-table-column
      prop="dedicateWorth"
      width="150"
      sortable="custom"
      label="剩余荣耀值"
      align="center">
      <template scope="scope">
        <p>{{scope.row.dedicateWorth}}</p>
      </template>
    </el-table-column>
    <el-table-column
      prop="dedicateWorthTransfer"
      width="150"
      sortable="custom"
      label="转赠消耗荣耀值"
      align="center">
      <template scope="scope">
        <!-- <p @click="seeDetails(scope.row)">{{scope.row.whalePeas}}</p> -->
        <p>{{scope.row.dedicateWorthTransfer}}</p>
      </template>
    </el-table-column>
    <el-table-column
      prop="dedicateWorthPrerogativeDeduct"
      width="150"
      sortable="custom"
      label="特权削减荣耀值"
      align="center">
    </el-table-column>
    <el-table-column
      prop="dedicateWorthExtract"
      width="150"
      label="提现Candy消耗荣耀值"
      align="center">
    </el-table-column>
    <el-table-column
      prop="dedicateWorthOrderDeduct"
      width="150"
      sortable="custom"
      label="下单消耗荣耀值"
      align="center">
    </el-table-column>
    <el-table-column
      prop="dedicateWorthAdExchange"
      width="150"
      label="广告宝兑换"
      align="center">
    </el-table-column>
    <el-table-column
      prop="dedicateWorthAdDecompose"
      width="150"
      label="广告宝拆解"
      align="center">
    </el-table-column>
    <!-- <el-table-column
      prop="whalePeasPurchase"
      width="150"
      sortable="custom"
      label="提现消耗荣耀值"
      align="center">
    </el-table-column> -->
    
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
import { contributeTotalList } from "@/api/pean/index";
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
              let _params = {
                currentPage: this.pageIndex,
                orderItems: this.queryParams.orderItems,
                pageSize: this.pageSize,
                phone: this.queryParams.phone,
                email: this.queryParams.email,
                userName: this.queryParams.userName,
              }
              this.loading = true
              contributeTotalList(_params).then(response => {
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
