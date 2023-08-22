<template>
  <div class="cont_Wrapper">
    <div class="topshow">
      <el-form :model="queryParams" ref="queryForm" :rules="rules" :inline="true" class="mytopformstyle">
        <el-form-item label="账号：">
          <el-input v-model="queryParams.account" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户ID：">
          <el-input v-model="queryParams.memberId" clearable></el-input>
        </el-form-item>
        <el-form-item label="类型：">
          <el-select v-model="queryParams.pledgeType" clearable placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="活期" :value="1"></el-option>
            <el-option label="定期" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="扣减币种：">
          <el-select v-model="queryParams.coinNameFrom" clearable placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, key, index) in transferList" :label="item" :value="key" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="获得币种：">
          <el-select v-model="queryParams.coinNameTo" clearable placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, key, index) in transferList" :label="item" :value="key" :key="index"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="订单号：">
          <el-input v-model="queryParams.sourceId" clearable></el-input>
        </el-form-item>
        <el-form-item label="名称：">
          <el-input v-model="queryParams.miningName" clearable></el-input>
        </el-form-item>
        <el-form-item label="更新时间：">
          <el-date-picker v-model="queryParams.updatedStartAt" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="-">
          <el-date-picker v-model="queryParams.updatedEndAt" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="" style="border:none;">
            <el-button :loading="loading" type="primary" icon="el-icon-search" @click="search(1)">查询</el-button>
            <el-button @click="resetForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="task-table">
      <!--table-->
      <el-table
      :data="tableData"
      v-loading="loading"
      style="width: 100%">
        <el-table-column prop="memberId" label="用户ID" align="center" min-width="120" fixed="left"></el-table-column>
        <el-table-column prop="nickName" label="昵称" align="center" min-width="120" fixed="left"></el-table-column>
        <el-table-column prop="account" label="账号" align="center" min-width="120"></el-table-column>
        <el-table-column prop="miningName" label="名称" align="center" min-width="120"></el-table-column>
        <el-table-column prop="pledgeWayName" label="方式" align="center" min-width="120"></el-table-column>
        <el-table-column prop="pledgeTypeName" label="类型" align="center" min-width="120"></el-table-column>
        <el-table-column prop="pledgeAmount" label="质押本金" align="center" min-width="120"></el-table-column>
        <el-table-column prop="apr" label="年化" align="center" min-width="120"></el-table-column>
        <el-table-column prop="dayNumber" label="定期天数" align="center" min-width="120"></el-table-column>
        <el-table-column prop="forecastAmount" label="预估挖矿收益" align="center" min-width="120"></el-table-column>
        <el-table-column prop="actualAmount" label="真实挖矿收益" align="center" min-width="120"></el-table-column>
        <el-table-column prop="feeRatio" label="收割手续费" align="center" min-width="120"></el-table-column>
        <el-table-column prop="pledgeEarningsAmount" label="收割获得收益" align="center" min-width="120"></el-table-column>
        <el-table-column prop="pledgeOriginAmount" label="收割本金退还" align="center" min-width="120"></el-table-column>
        <el-table-column prop="sourceId" label="订单号" align="center" min-width="120"></el-table-column>
        <el-table-column prop="harvestStatusName" label="状态" align="center" min-width="120">
          <template slot-scope="{row}">
            {{row.harvestStatusName}}
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" align="center" min-width="160">
          <template slot-scope="{row}">
            {{row.updatedAt ? $dayjs(row.updatedAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
          </template>
        </el-table-column>
      </el-table>
      <!--table-->
      <div class="table-pagination text-right mt10">
        <el-pagination
        @current-change="search"
        :page-sizes="[10, 20, 30]"
        @size-change="handleSizeChange"
        :current-page.sync="pageIndex"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { miningRecordPage, miningDetails } from "@/api/miningManage";
  export default {
    components: {},
    data () {
      return {
        loading: false,
        queryParams: {},
        tableData: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        rules: {
          
        },
      }
    },
    mounted () {
      this.search();
    },
    methods: {
      resetForm() {
        this.queryParams = {};
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.search()
      },
      // 数据查询
      search (pgi) {
        if (pgi) this.pageIndex = pgi
        let _params = {
          currentPage: this.pageIndex,
          pageSize: this.pageSize,
          ...this.queryParams
        }
        this.loading = true
        miningRecordPage(_params).then(response => {
          if (response.code === 200) {
            this.tableData = JSON.parse(JSON.stringify(response.data.list))
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
      },
    }
  }
</script>

<style lang="scss" scoped>
.cont_Wrapper{
  padding: 20px;
  .line{
    text-align: center;
  }
}
</style>

