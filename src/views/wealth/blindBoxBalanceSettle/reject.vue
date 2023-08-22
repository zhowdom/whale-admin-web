<template>
  <div class="seeInfosEachissueBox bbStatisticBox" style="padding:20px;">

    <el-form :model="nsqueryParams" :rules="nLevelrules" ref="nLevelqueryForm" :inline="true">
      <el-form-item label="真实姓名" prop="realName">
        <el-input
          v-model.trim="nsqueryParams.realName"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 130px"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model.trim="nsqueryParams.phone"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item label="当前期编号" prop="currentPeriodNo">
        <el-input
          v-model.trim="nsqueryParams.currentPeriodNo"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item label="盲盒编号" prop="blindBoxNo">
        <el-input
          v-model.trim="nsqueryParams.blindBoxNo"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item label="更新时间" prop="redbacktime">
        <el-date-picker
          v-model="nsqueryParams.redbacktime"
          type="daterange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结算订单号" prop="thirdTradeNo">
        <el-input
          v-model.trim="nsqueryParams.thirdTradeNo"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item label="结算渠道">
        <el-select v-model="nsqueryParams.payType" clearable placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="支付宝" :value="1"></el-option>
          <el-option label="微信" :value="2"></el-option>
        </el-select>
    </el-form-item>

      <el-form-item label="期数" prop="periods">
        <el-input
          v-model.trim="nsqueryParams.periods"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 130px"
        />
      </el-form-item>
      
      <!-- <el-form-item label="状态">
        <el-select v-model="nsqueryParams.status" clearable placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="待审核" :value="1"></el-option>
          <el-option label="审核失败" :value="2"></el-option>
          <el-option label="转账中" :value="3"></el-option>
          <el-option label="转账失败" :value="4"></el-option>
          <el-option label="转账成功" :value="5"></el-option>
        </el-select>
    </el-form-item> -->
    <!-- <el-form-item label="操作时间" prop="redbacktime2">
        <el-date-picker
          v-model="nsqueryParams.redbacktime2"
          type="daterange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item> -->
      <!-- <el-form-item label="状态返回时间" prop="redbacktime3">
        <el-date-picker
          v-model="nsqueryParams.redbacktime3"
          type="daterange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item> -->

      <el-form-item>
        <el-button v-hasPermi="['game:lottery:pool:getByPage']" type="primary" :loading="loading" icon="el-icon-search" @click="searchnLevel(1)">查询</el-button>
        <!-- <el-button v-hasPermi="['financial:withdraw:withdrawAudit']" v-show="multipleSelection.length > 0" style="margin-right:20px;" :disabled="multipleSelection.length <= 0" type="primary" @click="auditClickBatchCclick">批量审核</el-button> -->
      </el-form-item>
    </el-form>
  <el-table :data="nLevelData" @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      :selectable="selectableInit"
      width="55">
    </el-table-column>
    <el-table-column property="memberId" label="用户ID"></el-table-column>
    <el-table-column property="realName" label="真实姓名"></el-table-column>
    <el-table-column property="phone" label="手机号" width="120"></el-table-column>
    <el-table-column property="currentPeriodNo" label="当前期编号"></el-table-column>

    <el-table-column property="blindBoxNo" label="盲盒编号">
      <template scope="scope">
        <p @click="jumpToEachissuePage(scope.row)" style="color:#1890ff;cursor:pointer;text-decoration:underline;">{{scope.row.blindBoxNo}}</p>
      </template>
    </el-table-column>
    <el-table-column property="period" label="期数"></el-table-column>
    <el-table-column property="thirdTradeNo" label="结算订单号"></el-table-column>
    <el-table-column property="amount" label="结算金额（USDT）"></el-table-column>
    <el-table-column property="payType" label="结算渠道">
      <template scope="scope">
        <p v-if="+scope.row.payType === 1">支付宝</p>
        <p v-else-if="+scope.row.payType === 2">微信</p>
        <p v-else-if="+scope.row.payType === 3">余额</p>
      </template>
    </el-table-column>
   
    <el-table-column property="updateAt" label="更新时间">
      <template slot-scope="{row}">
        {{row.updateAt ? $dayjs(row.updateAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
    </el-table-column>
    <el-table-column property="settlementReason" label="结算失败（原因）"></el-table-column>
    <!-- <el-table-column property="auditErrorReason" label="转账失败原因"></el-table-column>
    <el-table-column property="transferResponseAt" label="状态返回时间">
      <template slot-scope="{row}">
        {{row.transferResponseAt ? $dayjs(row.transferResponseAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
    </el-table-column> -->

    <!-- <el-table-column property="createAt" label="操作">
       <template scope="scope">
        <p v-show="+scope.row.status === 1" @click="auditClick(scope.row)" style="color:#1890ff;cursor:pointer;text-decoration:underline;">审核</p>
      </template>
    </el-table-column> -->
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
    <el-dialog title="" :visible.sync="cmbTableVisible">
      <el-form :model="nLevelqueryParams" :rules="nLevelrules" ref="nLevelqueryForm" :inline="true">
        <el-form-item label="子订单号" prop="memberId">
          <el-input
            v-model.trim="nLevelqueryParams.memberId"
            placeholder="请输入"
            clearable
            size="small"
            style="width: 100px"
          />
        </el-form-item>
        <el-form-item label="货号" prop="realName">
          <el-input
            v-model.trim="nLevelqueryParams.realName"
            placeholder="请输入"
            clearable
            size="small"
            style="width: 100px"
          />
        </el-form-item>
        <el-form-item label="实物名称">
          <el-select v-model="nLevelqueryParams.status" clearable placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="手机" :value="1"></el-option>
            <el-option label="充电线" :value="2"></el-option>
          </el-select>
      </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="loading" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="cmbTableData">
        <el-table-column property="period" label="期数" width="120"></el-table-column>
        <el-table-column property="date" label="序号" width="150"></el-table-column>
        <el-table-column property="date" label="子订单号" width="150"></el-table-column>
        <el-table-column property="name" label="货号" width="200"></el-table-column>
        <el-table-column property="address" label="实物名称"></el-table-column>
        <el-table-column property="address" label="图片"></el-table-column>
        <el-table-column property="address" label="成本价（USDT）"></el-table-column>
        <el-table-column property="address" label="数量"></el-table-column>
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


<el-dialog
  title=""
  :visible.sync="dialogVisibleAudit"
  width="30%"
  >
  <div style="text-align:center;">
    <p style="font-size:16px;"><i class="el-icon-question" style="color:#1890ff;"></i>是否确定审核通过？审核通过后现金额将转给用户</p>
    <el-radio-group v-model="batchSumbit.auditStatus" style="padding:20px 0 39px 0;">
      <el-radio :label="3">审核通过</el-radio>
      <el-radio :label="2">审核不通过</el-radio>
    </el-radio-group>
    <div v-show="batchSumbit.auditStatus === 2" class="clearfix">
      <span class="fl"><span style="color:red;">*</span>审核不通过原因：</span>
      <el-input
        type="textarea"
        placeholder="请输入内容"
        v-model.trim="batchSumbit.auditErrorReason"
        maxlength="20"
        class="fl"
        style="width:239px;"
        show-word-limit
      ></el-input>
    </div>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisibleAudit = false">取 消</el-button>
    <el-button v-if="batchSumbit.auditStatus === 3" type="primary" @click="batchAuditSave">确 定</el-button>
    <el-button v-else :disabled="!batchSumbit.auditErrorReason" type="primary" @click="batchAuditSave">确 定</el-button>
  </span>
</el-dialog>


  </div>
</template>

<script>
import { blindBoxSettlementList, blindBoxTFAudit, blindBoxTFList, takejewelCodeList, zzJoyPoorTotalSwitchList } from "@/api/games";
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
        dialogVisibleAudit: false,
        multipleSelection: [],
        bigStatistic: {
          apportionTotal: 0,
          injectTotal: 0,
          periodsInjectTotal: 0,
          shareTotal: 0,
          total: 0
        },
        // 盲盒通用table-s
        cmbTableVisible: false,
        cmbTableData: [
          {
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }
        ],
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
          code: '',
          name: '',
          phone: '',
          memberId: '',
          realName: '',
          periodsNum: '',
          redbacktime: '' ,
          redbacktime2: '',
          redbacktime3: '',
        },
        nsqueryParams: {
          periods: '',
          payType: '',
          thirdTradeNo: '',
          redbacktime: '' ,
          blindBoxNo: '',
          currentPeriodNo: '',
          phone: '',
          realName: '',
          redbacktime2: '',
          redbacktime3: '',
          createdEndAt: '',
          createdStartAt: '',
          currentPage: '',
          memberPhone: '',
          pageSize: '',
          status: 4,
          tradeNo: '',
          transferEndAt: '',
          transferResponseEndAt: '',
          transferResponseStartAt: '',
          transferStartAt: '',
        },
        nLevelPrizeTitle: '',
        pageIndexnLevel: 1,
        pageSizenLevel: 10,
        totalPagenLevel: 0,
        nLevelData: [],
        nLevelPrizesVisible: false,
        loading: false,
        isBatchType: '',
        batchSumbit: {
          auditErrorReason: '',
          auditStatus: 3,
          ids: ''
        },
      }
    },
    mounted () {
      this.isAuth.isPermi(['game:lottery:pool:getByPage']) && this.searchnLevel(1)
    },
    watch: {},
    methods: {
      jumpToEachissuePage (row) {
        // 进入盲盒详情统计页面，盲盒编号必传
        this.$router.push({ path: "/games/blindBoxEachIssueInfos", query: {blindBoxNo: row.blindBoxNo}})
      },
      // 审核
      auditClick (row) {
        this.dialogVisibleAudit = true
        this.batchSumbit.auditErrorReason = ''
        this.batchSumbit.auditStatus = 3
        this.isBatchType = 0
        this.curChoosedId = row.id
      },
      // 批量审核
      auditClickBatchCclick () {
        this.dialogVisibleAudit = true
        this.batchSumbit.auditErrorReason = ''
        this.batchSumbit.auditStatus = 3
        this.isBatchType = 1
      },
      // 否可选择
      selectableInit (row, index) {
        return +row['status'] === 1
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
        blindBoxTFAudit(this.batchSumbit).then(response => {
          this.dialogVisibleAudit = false
          if (response.code === 200) {
            this.$message({
              message: '保存成功',
              type: 'success',
              'duration': 1000,
              onClose: () => {
                this.searchnLevel(1)
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
      handleSelectionChange(val) {
        this.multipleSelection = val.map(v => v.id)
      },
      // 盲盒通用table-s
      cmbTableSearch () {},
      cmbTablehandleSizeChange (val) {
        this.cmbTablepageSize = val
        this.cmbTablepageIndex = 1
        this.cmbTableSearch()
      },
      // 盲盒通用table-d
      bugFirstClick () {
        this.cmbTableVisible = true
      },
      nLevelPrizeInfosClick (row) {
        this.nLevelPrizesVisible = true
        this.nLevelPrizeTitle = '二等奖管理（期数：200902）'
      },
      searchnLevel (pgi) {
        // todo...
        if (pgi) this.pageIndexnLevel = pgi

        let datetime = []
        datetime = this.nsqueryParams.redbacktime

        let _params = {
          blindBoxNo: this.nsqueryParams.blindBoxNo,
          currentPage: this.pageIndexnLevel,
          currentPeriodNo: this.nsqueryParams.currentPeriodNo,
          memberId: this.nsqueryParams.memberId,
          pageSize: this.pageSizenLevel,
          payType: this.nsqueryParams.payType,
          periods: this.nsqueryParams.periods,
          phone: this.nsqueryParams.phone,
          realName: this.nsqueryParams.realName,
          settlementStatus: 2,
          thirdTradeNo: this.nsqueryParams.thirdTradeNo,
          updateEndTime: datetime ? this.$dayjs(datetime[1]).format('YYYY-MM-DD') : '',
          updateStartTime: datetime ? this.$dayjs(datetime[0]).format('YYYY-MM-DD') : '',
        }

        this.loading = true
        blindBoxSettlementList(_params).then(response => {
          if (response.code === 200) {
            this.nLevelData = response.data.pageRes.list
            this.totalPagenLevel = response.data.pageRes.total
            this.loading = false
            this.$emit('copyMsgFromChild', {
              amountError: response.data.settlementStatisticsResp.amountError || 0,
              amountSuccess: response.data.settlementStatisticsResp.amountSuccess || 0,
              waitAmount: response.data.settlementStatisticsResp.waitAmount || 0,
            })
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
.bbStatisticBox {
  .gmTitlebox{
    position: relative;
    padding-left: 20px;
    &::after{
      position: absolute;
      left: 0;
      top:6px;
      content: '';
      height: 10px;
      width:3px;
      background: red;
    }
  }
  .popoBoxs{
    padding-left:20px;
    padding-top: 20px;
      ul{
        padding: 0;
        margin: 0;
      }
      li{
        border: 1px solid #ccc;
        display: inline-block;
        border-radius:5px;
        padding: 16px;
        margin-right:30px;
        p,h3{
          margin:0;
          padding: 0;
        }
        h3{
          padding-top: 6px;
        }
      }
    }
}
</style>

