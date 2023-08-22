<template>
  <div class="redBackDetailsBox">
    <el-form :model="queryParams" ref="queryForm" :rules="rules" :inline="true">
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
      <el-form-item label="申请提现日期" prop="withdrawDate">
        <el-date-picker
          v-model="queryParams.withdrawDate"
          type="daterange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>

    <el-form-item label="分佣等级" prop="plusLevel">
      <el-select v-model="queryParams.plusLevel" placeholder="请选择">
        <el-option label="全部" value=""></el-option>
        <el-option label="合伙人" :value="1"></el-option>
        <el-option label="团长" :value="8"></el-option>
        <el-option label="高级团长" :value="16"></el-option>
      </el-select>
    </el-form-item>

      <el-form-item label="账号状态" prop="memberStatus">
      <el-select v-model="queryParams.memberStatus" placeholder="请选择">
        <el-option label="全部" value=""></el-option>
        <el-option label="正常" :value="1"></el-option>
        <el-option label="禁用" :value="2"></el-option>
        <el-option label="注销" :value="3"></el-option>
      </el-select>
    </el-form-item>

      <el-form-item label="提现流水号" prop="tradeNo">
        <el-input
          v-model="queryParams.tradeNo"
          placeholder="提现流水号"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>

      <el-form-item label="付款流水号" prop="channelTradeNo">
        <el-input
          v-model="queryParams.channelTradeNo"
          placeholder="输入付款流水号"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>

      <el-form-item>
        <el-button v-hasPermi="['financial:withdraw:withdrawPage']" type="primary" :loading="loading" icon="el-icon-search" @click="search(1)">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
    :data="tableData"
    @sort-change="sortChange"
    @selection-change="handleSelectionChange"
    v-loading="loading"
    border
    style="width: 100%">
    <el-table-column
      type="selection"
      :selectable="checkboxSelect"
      width="55">
    </el-table-column>
    <el-table-column
    width="100"
      prop="tradeNo"
      label="提现流水ID"
      align="center">
    </el-table-column>
    <el-table-column
      prop="channelTradeNo"
      width="100"
      label="付款流水号"
      align="center">
    </el-table-column>
    <el-table-column
      prop="createdAt"
      sortable="custom"
      label="提现申请时间"
      width="180"
      align="center">
      <template slot-scope="{row}">
        {{row.createdAt ? $dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
    </el-table-column>
    <el-table-column
      prop="phone"
      label="手机号"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      prop="plusLevel"
      label="分佣等级"
      align="center">
      <template scope="scope">
        <p v-if="+scope.row.plusLevel === 1">合伙人</p>
        <p v-if="+scope.row.plusLevel === 8">团长</p>
        <p v-if="+scope.row.plusLevel === 16">高级团长</p>
      </template>
    </el-table-column>
    <el-table-column
      prop="beforeAmount"
      width="150"
      sortable="custom"
      label="提现前账户余额"
      align="center">
    </el-table-column>
    <el-table-column
      prop="totalAmount"
      sortable="custom"
      width="130"
      label="提现金额"
      align="center">
    </el-table-column>
    <el-table-column
      prop="serviceAmount"
      label="提现手续费"
      width="100"
      align="center">
    </el-table-column>
    <el-table-column
      prop="afterAmount"
      sortable="custom"
      label="提现后账户余额"
      width="140"
      align="center">
    </el-table-column>
    <el-table-column
      prop="userName"
      label="支付宝姓名"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      prop="alipayAccount"
      label="支付宝账号"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      prop="memberStatus"
      label="账户状态"
      align="center">
      <template scope="scope">
        <p v-if="+scope.row.memberStatus === 1">正常</p>
        <p v-if="+scope.row.memberStatus === 2">禁用</p>
        <p v-if="+scope.row.memberStatus === 3">注销</p>
      </template>
    </el-table-column>
  <el-table-column
      prop="completedAt"
      width="180"
      sortable="custom"
      label="打款状态返回时间"
      align="center">
      <template slot-scope="{row}">
        {{row.completedAt ? $dayjs(row.completedAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
    </el-table-column>

    <!-- <el-table-column
      prop="status"
      label="提现状态"
      align="center">
      <template scope="scope">
        <p v-if="+scope.row.status === 1">等待审核</p>
        <p v-if="+scope.row.status === 2">审核失败</p>
        <p v-if="+scope.row.status === 3" @click="showStatusDialog(scope.row)" style="text-decoration:underline;color:blue;cursor:pointer;">打款中</p>
        <p v-if="+scope.row.status === 4" @click="showStatusDialog(scope.row)" style="text-decoration:underline;color:green;cursor:pointer;">转账成功</p>
        <p v-if="+scope.row.status === 5" @click="showStatusDialog(scope.row, 'failed')" style="text-decoration:underline;color:red;cursor:pointer;">转账失败</p>
      </template>
    </el-table-column>
    <el-table-column
      prop="refundStatus"
      label="是否已退回"
      align="center">
      <template scope="scope">
        <p v-if="+scope.row.refundStatus === 1">已提现</p>
        <p v-if="+scope.row.refundStatus === 2">已退回</p>
      </template>
    </el-table-column>
    <el-table-column
      label="操作"
      align="center">
      <template scope="scope">
        <el-button :disabled="+scope.row.status !== 1" type="primary" size="mini" @click="auditClick(scope.row)">审核</el-button>
      </template>
    </el-table-column> -->
    
  </el-table>
  <div style="padding-top:20px;font-size:14px;">
    <el-button v-hasPermi="['financial:withdraw:withdrawAudit']" v-show="multipleSelection.length > 0" style="margin-right:20px;" :disabled="multipleSelection.length <= 0" type="primary" size="mini" @click="auditClickBatchCclick">批量审核</el-button>
    <span v-if="multipleSelection.length > 0">提现金额总计：<span style="color:red;">{{totalWithdraw.toFixed(2)}}</span></span>
    <span v-if="multipleSelection.length > 0" style="padding:0 20px;">提现手续费总计：<span style="color:red;">{{totalCharge.toFixed(2)}}</span></span>
    <span v-if="multipleSelection.length > 0">提现到账金额总计：<span style="color:red;">{{totalAmount.toFixed(2)}}</span></span>
  </div>
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

<el-dialog
  title="状态记录"
  :visible.sync="dialogVisible"
  width="39%"
  >
  <div>
    <p><span style="padding-right:10px;">状态返回时间:</span><span>{{clickCurItemData.completedAt ? $dayjs(clickCurItemData.completedAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}</span></p>
    <p v-if="clickCurItemData.auditRemark"><span style="padding-right:10px;">转账失败原因:</span><span>{{clickCurItemData.auditRemark}}</span></p>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>

<el-dialog
  title=""
  :visible.sync="dialogVisibleAudit"
  width="30%"
  >
  <div style="text-align:center;">
    <p style="font-size:16px;"><i class="el-icon-question" style="color:#1890ff;"></i>是否确定审核通过？审核通过后现金额将转给用户</p>
    <el-radio-group v-model="batchSumbit.status" style="padding:20px 0 39px 0;">
      <el-radio :label="3">审核通过</el-radio>
      <el-radio :label="2">审核不通过</el-radio>
    </el-radio-group>
    <div v-show="batchSumbit.status === 2" class="clearfix">
      <span class="fl"><span style="color:red;">*</span>审核不通过原因：</span>
      <el-input
        type="textarea"
        placeholder="请输入内容"
        v-model.trim="batchSumbit.auditRemark"
        maxlength="20"
        class="fl"
        style="width:239px;"
        show-word-limit
      ></el-input>
    </div>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisibleAudit = false">取 消</el-button>
    <el-button v-if="batchSumbit.status === 3" type="primary" @click="batchAuditSave">确 定</el-button>
    <el-button v-else :disabled="!batchSumbit.auditRemark" type="primary" @click="batchAuditSave">确 定</el-button>
  </span>
</el-dialog>


  </div>
</template>

<script>
import { saveWithdrawSetting, queryWithdrawSetting, queryWithdrawList, withdrawCount, withdrawAudit } from "@/api/wealth/withdrawSet";
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
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        queryParams: {
          phone: '',
          withdrawDate: '', // 日期
          status: 4,
          plusLevel: '',
          memberStatus: '',
          tradeNo: '',
          channelTradeNo: '',
          refundStatus: '',
          orderItems: []
        },
        tableData: [],
        multipleSelection: [],
        loading: false,
        dialogVisible: false,
        dialogVisibleAudit: false,
        clickCurItemData: {
          completedAt: '',
          auditRemark: ''
        },
        totalWithdraw: 0,
        totalCharge: 0,
        totalWithdrawArr: [],
        totalChargeArr: [],
        totalAmount: 0,
        totalAmountArr: [],
        batchSumbit: {
          auditRemark: '',
          status: 3,
          ids: ''
        },
        isBatchType: '',
        curChoosedId: ''
      }
    },
    mounted () {
      this.search(1)
    },
    watch: {},
    methods: {
      auditClickBatchCclick () {
        this.dialogVisibleAudit = true
        this.batchSumbit.auditRemark = ''
        this.batchSumbit.status = 3
        this.isBatchType = 1
      },
      checkboxSelect (row, rowIndex) {
        if (+row.status === 1) {
          return true // 不禁用
        } else {
          return false // 禁用
        }
      },
      handleSelectionChange (val) {
        this.totalWithdrawArr = []
        this.totalChargeArr = []
        this.totalAmountArr = []
        this.multipleSelection = val.map((val, index, arr) => {
          this.totalWithdrawArr.push(val.totalAmount)
          this.totalChargeArr.push(val.serviceAmount)
          this.totalAmountArr.push(val.amount)
          return val.id
        })
        this.totalWithdraw = this.totalWithdrawArr.reduce((prev, cur, index, arr) => {
          return prev + cur
        }, 0)
        this.totalCharge = this.totalChargeArr.reduce((prev, cur, index, arr) => {
          return prev + cur
        }, 0)
        this.totalAmount = this.totalAmountArr.reduce((prev, cur, index, arr) => {
          return prev + cur
        }, 0)
      },
      batchAuditSave () {
        this.withdrawAuditRunner()
      },
      withdrawAuditRunner () {
        if (this.isBatchType === 0) {
          this.batchSumbit.ids = [this.curChoosedId]
        } else {
          this.batchSumbit.ids = this.multipleSelection
        }
        withdrawAudit(this.batchSumbit).then(response => {
          this.dialogVisibleAudit = false
          if (response.code === 200) {
            this.$message({
              message: '保存成功',
              type: 'success',
              'duration': 1000,
              onClose: () => {
                this.search(1)
              }
            })
          } else {
            this.dialogVisibleAudit = false
            this.$message.error(response.message)
          }
        }).catch(({ error }) => {
          this.dialogVisibleAudit = false
          if (error) this.$message.error(error.message)
        })
      },
      // 审核
      auditClick (row) {
        this.dialogVisibleAudit = true
        this.batchSumbit.auditRemark = ''
        this.batchSumbit.status = 3
        this.isBatchType = 0
        this.curChoosedId = row.id
      },
      // 状态记录dialog
      showStatusDialog (row, type) {
        this.dialogVisible = true
        this.clickCurItemData.completedAt = row.completedAt
        this.clickCurItemData.auditRemark = row.auditRemark || ''
      },
      sortChange ({column, prop, order}) {
        let _blooean = order === 'ascending'
        this.queryParams.orderItems = [{ asc: _blooean, column: prop }]
        this.search()
      },
      search (pgi) {
        this.$refs['queryForm'].validate((valid) => {
          if (valid) {
            if (pgi) this.pageIndex = pgi
            let datetime = []
            datetime = this.queryParams.withdrawDate
            let _params = {
              currentPage: this.pageIndex,
              endCreateDate: datetime ? datetime[1] : '',
              memberStatus: this.queryParams.memberStatus,
              pageSize: this.pageSize,
              phone: this.queryParams.phone,
              plusLevel: this.queryParams.plusLevel,
              startCreateDate: datetime ? datetime[0] : '',
              status: this.queryParams.status,
              tradeNo: this.queryParams.tradeNo,
              channelTradeNo: this.queryParams.channelTradeNo,
              refundStatus: this.queryParams.refundStatus,
              orderItems: this.queryParams.orderItems
            }
            this.loading = true
            queryWithdrawList(_params).then(response => {
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
            }).catch(({ error }) => {
              this.loading = false
              if (error) this.$message.error(error.message)
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
</style>
