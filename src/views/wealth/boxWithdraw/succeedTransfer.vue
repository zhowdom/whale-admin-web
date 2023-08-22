<template>
  <div class="withdraw-container">
    <el-form :model="mainForm" ref="mainForm" :rules="rules" :inline="true">
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="mainForm.phone"
          placeholder="输入手机号"
          clearable
          maxlength="11"
          size="small"
        />
      </el-form-item>
      <el-form-item label="导入时间">
        <el-date-picker
          v-model="range"
          type="daterange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="提现流水号" prop="tradeNo">
        <el-input
          v-model="mainForm.tradeNo"
          placeholder="提现流水号"
          clearable
          size="small"
        />
      </el-form-item>

      <el-form-item label="付款流水号" prop="channelTradeNo">
        <el-input
          v-model="mainForm.channelTradeNo"
          placeholder="输入付款流水号"
          clearable
          size="small"
        />
      </el-form-item>

      <el-form-item>
        <el-button v-hasPermi="['financial:blindBoxWithdraw:page']" type="primary" :loading="loading" icon="el-icon-pageReq" @click="pageReq()">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
      border
      :data="tableData"
      v-loading="loading"
      @sort-change="sortChange"
    >
      <el-table-column prop="orderNo" label="订单号" align="center" width="100"></el-table-column>
      <el-table-column prop="tradeNo" label="提现流水ID" align="center" width="100"></el-table-column>
      <el-table-column prop="channelTradeNo" label="付款流水ID" align="center" width="100"></el-table-column>
      <el-table-column prop="phone" label="手机号" width="120" align="center"></el-table-column>
      <el-table-column prop="amount" label="提现金额" sortable="custom" align="center"></el-table-column>
      <el-table-column prop="payeeName" label="支付宝姓名" align="center"></el-table-column>
      <el-table-column prop="payeeAccount" label="支付宝账号" align="center"></el-table-column>
      <el-table-column prop="importBatch" label="导入批次" width="180" align="center"></el-table-column>
      <el-table-column prop="transferRemark" label="转账备注" align="center"></el-table-column>
      <el-table-column prop="createTime" label="导入时间" width="180" align="center">
        <template slot-scope="{row}">
          {{row.createTime ? $dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="completedTime" sortable="custom" label="打款状态返回时间" align="center" width="180">
        <template slot-scope="{row}">
          {{row.completedTime ? $dayjs(row.completedTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="fr mt20"
      @current-change="pageReq"
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
  import {page} from '@/api/wealth/boxWithdraw';

  export default {
    components: {},
    data () {
      return {
        rules: {
          phone: [
            {required: false, pattern: /^1\d{10}$/, message: '手机号格式有误', trigger: 'blur'}
          ]
        },
        range: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        mainForm: {
          phone: '',
          status: 4,
          tradeNo: '',
          channelTradeNo: '',
          orderItems: []
        },
        tableData: [],
        loading: false,
      }
    },
    mounted () {
      this.pageReq()
    },
    watch: {},
    methods: {
      sortChange ({column, prop, order}) {
        let _blooean = order === 'ascending'
        this.mainForm.orderItems = [{ asc: _blooean, column: prop }]
        this.pageReq()
      },
      async pageReq () {
        try {
          this.loading = true;
          let pageSize = this.pageSize;
          let currentPage = this.pageIndex;
          let {phone, status, tradeNo, channelTradeNo} = this.mainForm;
          let [startTime, endTime] = this.range || ['', ''];
          startTime = startTime ? this.$dayjs(startTime).format('YYYY-MM-DD') : '';
          endTime = endTime ? this.$dayjs(endTime).format('YYYY-MM-DD') : '';

          const {code, message, data} = await page({
            phone, status, tradeNo, endTime, startTime, channelTradeNo,
            pageSize, currentPage,
          });

          if (code == 200) {
            const {list, total} = data;
            this.totalPage = total;
            this.tableData = list || [];
          } else {
            this.$message.error(message);
          }
          this.loading = false;
        } catch (error) {
          this.loading = false;
          throw error;
        };
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.pageReq()
      }
    }
  }
</script>

<style lang="scss">
</style>
