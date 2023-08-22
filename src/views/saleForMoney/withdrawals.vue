<template>
  <div class="seeInfosEachissueBox bbStatisticBox" style="padding:20px;">

    <el-form :model="nsqueryParams" :rules="nLevelrules" ref="nLevelqueryForm" :inline="true">

      <el-form-item label="用户ID" prop="memberId">
        <el-input
          v-model.trim="nsqueryParams.memberId"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 130px"
        />
      </el-form-item>

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
                style="width: 130px"
              />
            </el-form-item>

      <el-form-item label="提现渠道">
        <el-select v-model="nsqueryParams.withdrawalChannel" clearable placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="支付宝" :value="1"></el-option>
          <el-option label="微信" :value="2"></el-option>
          <el-option label="余额" :value="3"></el-option>
        </el-select>
    </el-form-item>

    <el-form-item label="状态">
        <el-select v-model="nsqueryParams.status" clearable placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="待审核" :value="1"></el-option>
          <el-option label="审核失败" :value="2"></el-option>
          <el-option label="打款中" :value="3"></el-option>
          <el-option label="转账成功" :value="4"></el-option>
          <el-option label="转账失败" :value="5"></el-option>
        </el-select>
    </el-form-item>

    <el-form-item label="第三方支付账号" prop="payAccount">
        <el-input
          v-model.trim="nsqueryParams.payAccount"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 130px"
        />
      </el-form-item>

      <el-form-item label="提现流水号" prop="tradeNo">
        <el-input
          v-model.trim="nsqueryParams.tradeNo"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 130px"
        />
      </el-form-item>
      
      <el-form-item label="付款流水号" prop="channelTradeNo">
        <el-input
          v-model.trim="nsqueryParams.channelTradeNo"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 130px"
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

 <el-form-item label="申请时间" prop="redbacktime2">
        <el-date-picker
          v-model="nsqueryParams.redbacktime2"
          type="daterange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      
      

      <el-form-item>
        <el-button v-hasPermi="['blindBox:withdraw_account_record:page']" type="primary" :loading="loading" icon="el-icon-search" @click="searchnLevel(1)">查询</el-button>
        <!-- <el-button v-hasPermi="['blindBox:withdraw_account_record:export']" type="primary" :loading="loading" icon="el-icon-download" @click="exportClick">导出</el-button> -->

        
        <!-- <el-button v-hasPermi="['blindBox:withdraw_account_record:batch_transfer_success']" v-show="multipleSelection.length > 0" style="margin-right:20px;" :disabled="multipleSelection.length <= 0" type="primary" @click="batchSuccessTransfer">批量设置为"转账成功"</el-button> -->
        <el-button v-hasPermi="['blindBox:withdraw_account_record:audit']" v-show="multipleSelection.length > 0" style="margin-right:20px;" :disabled="multipleSelection.length <= 0" type="primary" @click="auditClickBatchCclick">批量审核</el-button>
      </el-form-item>
    </el-form>
  <el-table :data="nLevelData" @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      :selectable="selectableInit"
      width="55">
    </el-table-column>
    <el-table-column property="memberId" label="用户ID"></el-table-column>
    <el-table-column property="phone" label="手机号"></el-table-column>
    <el-table-column property="realName" label="真实姓名" width="120"></el-table-column>

    <el-table-column property="beforeAmount" label="提现前余额"></el-table-column>
    <el-table-column property="totalAmount" label="提现金额"></el-table-column>
    <el-table-column property="serviceAmount" label="提现手续费"></el-table-column>

    <el-table-column property="afterAmount" label="提现后余额"></el-table-column>
    <el-table-column property="withdrawalChannel" label="提现渠道">
      <template scope="scope">
        <p v-if="+scope.row.withdrawalChannel === 1">支付宝</p>
        <p v-else-if="+scope.row.withdrawalChannel === 2">微信</p>
        <p v-else-if="+scope.row.withdrawalChannel === 3">余额</p>
      </template>
    </el-table-column>
    <el-table-column property="receiverAccount" label="第三方支付账号"></el-table-column>
    <el-table-column property="tradeNo" label="提现流水ID"></el-table-column>
    <el-table-column property="createdAt" label="申请时间">
      <template slot-scope="{row}">
        {{row.createdAt ? $dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
    </el-table-column>
    <el-table-column property="channelTradeNo" label="付款流水号"></el-table-column>
    <el-table-column property="updatedAt" label="更新时间">
      <template slot-scope="{row}">
        {{row.updatedAt ? $dayjs(row.updatedAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
    </el-table-column>
    <el-table-column property="statusDesc" label="状态"></el-table-column>
    <el-table-column property="remark" label="备注"></el-table-column>
    
    <el-table-column property="createAt" label="操作">
       <template scope="scope">
        <p v-hasPermi="['blindBox:withdraw_account_record:audit']" v-show="+scope.row.status === 1" @click="auditClick(scope.row)" style="color:#1890ff;cursor:pointer;text-decoration:underline;">审核</p>
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
    <el-dialog :visible.sync="cmbTableVisible">
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
          <el-button v-hasPermi="['game:lottery:pool:getByPage']" type="primary" :loading="loading" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="cmbTableData">
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
    <p v-show="+batchSumbit.auditStatus === 3" style="font-size:16px;"><i class="el-icon-question" style="color:#1890ff;"></i>审核通过后，现金将转给用户</p>
    <p v-show="+batchSumbit.auditStatus === 2" style="font-size:16px;"><i class="el-icon-question" style="color:#1890ff;"></i>审核失败后，用户需重新提交</p>
    <el-radio-group v-model="batchSumbit.auditStatus" style="padding:20px 0 39px 0;">
      <el-radio :label="3">审核通过</el-radio>
      <el-radio :label="2">审核不通过</el-radio>
    </el-radio-group>
    <div v-show="batchSumbit.auditStatus === 2" class="clearfix">
      <span class="fl"><span style="color:red;">*</span>审核不通过原因：</span>
      <el-input
        type="textarea"
        placeholder="请输入内容"
        v-model.trim="batchSumbit.remark"
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
    <el-button v-else :disabled="!batchSumbit.remark" type="primary" @click="batchAuditSave">确 定</el-button>
  </span>
</el-dialog>

<el-dialog
  title="提示"
  :visible.sync="dialogVisibleSuccess"
  width="30%">
  <p>确定将 [待审核] 状态调整为 [转账成功] ?</p>
  <el-form>
    <el-form-item label="备注：" label-width="60px">
      <el-input
          type="text"
          placeholder="请输入"
          v-model="batchTransferSuccessMemo"
          maxlength="50"
          show-word-limit>
        </el-input>
    </el-form-item>
  </el-form>

  
  
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisibleSuccess = false">取 消</el-button>
    <el-button type="primary" @click="batchTransferSuccessSumbit">确 定</el-button>
  </span>
</el-dialog>


  </div>
</template>

<script>
import { prizesAwardExport, saleForMoneyExoprt, saleForMoneyBatchTransfer, saleforWithdraList, saleforWithdraAudit, blindBoxTFAudit, blindBoxTFList, takejewelCodeList, zzJoyPoorTotalSwitchList } from "@/api/games";
import {saveAs} from 'file-saver';
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
          channelTradeNo: '' ,
          redbacktime: '' ,
          redbacktime2: '',
          memberId: '',
          payAccount: '',
          phone: '',
          realName: '',
          remark: '',
          tradeNo: '',
          status: '',
          withdrawalChannel: '',

          redbacktime: '' ,
          redbacktime2: '',
          redbacktime3: '',
          blindBoxNo: '',
          createdEndAt: '',
          createdStartAt: '',
          currentPage: '',
          currentPeriodNo: '',
          memberPhone: '',
          pageSize: '',
          payType: '',
          thirdTradeNo: '',
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
        dialogVisibleSuccess: false,
        batchTransferSuccessMemo: '',
        batchSumbit: {
          remark: '',
          auditStatus: 3,
          ids: ''
        },
      }
    },
    mounted () {
      this.isAuth.isPermi(['blindBox:withdraw_account_record:page']) && this.searchnLevel(1)
    },
    watch: {},
    methods: {
      // 订单导出
      async orderExportReq (reqData, cb, done) {
        try {
          const {data, status, filename} = await saleForMoneyExoprt(reqData);

          if (status == 200) {
            let bob = new Blob([data], {type: 'application/vnd.ms-excel'});
            saveAs(bob, filename);
            this.$message.success('导出成功');
          } else {
            this.$message.error('导出错误');
          };
          cb.close();
          done();
        } catch (error) {
          cb.close();
          throw error;
        }
      },
      // 订单导出
      execDownload (cb, done) {
        
        let datetime = []
        let datetime2 = []
        datetime = this.nsqueryParams.redbacktime
        datetime2 = this.nsqueryParams.redbacktime2

        let _data = {
          channelTradeNo: this.nsqueryParams.channelTradeNo,
          createdEndAt: datetime2 ? this.$dayjs(datetime2[1]).format('YYYY-MM-DD') : '',
          createdStartAt: datetime2 ? this.$dayjs(datetime2[0]).format('YYYY-MM-DD') : '',
          currentPage: this.pageIndexnLevel,
          memberId: this.nsqueryParams.memberId,
          pageSize: this.pageSizenLevel,
          payAccount: this.nsqueryParams.payAccount,
          phone: this.nsqueryParams.phone,
          realName: this.nsqueryParams.realName,
          remark: this.nsqueryParams.remark,
          tradeNo: this.nsqueryParams.tradeNo,
          updatedEndAt: datetime ? this.$dayjs(datetime[1]).format('YYYY-MM-DD') : '',
          updatedStartAt: datetime ? this.$dayjs(datetime[0]).format('YYYY-MM-DD') : '',
          withdrawalChannel: this.nsqueryParams.withdrawalChannel,

        }

        // 导出数据方法
        this.orderExportReq(_data, cb, done);
      },
      exportClick () {
        const vm = this;
        const h = this.$createElement;
        const noData = this.nLevelData.length == 0;
        const style = {fontSize: '15px', display: 'block', padding: '10px 10px 30px'};
        const message = h('strong', {style}, '当前支持三个月内的数据导出！');
        if (noData) return this.$message.warning('当前查询条件暂无数据');

        this.$msgbox({
          title: '',
          message,
          center: true,
          showClose: false,
          closeOnClickModal: false,
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          confirmButtonClass: 'ml30',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              const target = instance.$el.firstChild;
              const cb = this.$loading({
                target,
                lock: true,
                text: '导出中...',
                spinner: 'el-icon-sunny',
                customClass: 'loadingAnim',
              });
              // 发送请求
              setTimeout(() => {
                vm.execDownload(cb, done);
              }, 1200);
            } else {
              done();
            }
          }
        }).then(() => {
          // this.$message.success('订单导出成功');
        }).catch(() => {
          this.$message.info('已取消导出');
        });
      },
      // 审核
      auditClick (row) {
        this.dialogVisibleAudit = true
        this.batchSumbit.remark = ''
        this.isBatchType = 0
        this.batchSumbit.auditStatus = 3
        this.curChoosedId = row.id
      },
      jumpToEachissuePage (row) {
        // 进入盲盒详情统计页面，盲盒编号必传
        this.$router.push({ path: "/games/blindBoxEachIssueInfos", query: {blindBoxNo: row.blindBoxNo}})
      },
      // 批量审核
      auditClickBatchCclick () {
        this.dialogVisibleAudit = true
        this.batchSumbit.remark = ''
        this.batchSumbit.auditStatus = 3
        this.isBatchType = 1
      },
      batchSuccessTransfer () {
        this.dialogVisibleSuccess = true
      },
      batchTransferSuccessSumbit () {
        saleForMoneyBatchTransfer({
          ids: this.multipleSelection || [],
          remark: this.batchTransferSuccessMemo
        }).then(response => {
          this.dialogVisibleSuccess = false
          if (response.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              'duration': 1000,
              onClose: () => {
                this.searchnLevel(1)
              }
            })
          } else {
            this.$message.error(response.message)
          }
        }).catch(({ error }) => {
          this.dialogVisibleSuccess = false
          if (error) this.$message.error(error.message)
        })
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
        saleforWithdraAudit(this.batchSumbit).then(response => {
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
        let datetime2 = []
        datetime = this.nsqueryParams.redbacktime
        datetime2 = this.nsqueryParams.redbacktime2

        let _params = {
          channelTradeNo: this.nsqueryParams.channelTradeNo,
          createdEndAt: datetime2 ? this.$dayjs(datetime2[1]).format('YYYY-MM-DD') : '',
          createdStartAt: datetime2 ? this.$dayjs(datetime2[0]).format('YYYY-MM-DD') : '',
          currentPage: this.pageIndexnLevel,
          memberId: this.nsqueryParams.memberId,
          pageSize: this.pageSizenLevel,
          payAccount: this.nsqueryParams.payAccount,
          phone: this.nsqueryParams.phone,
          status: this.nsqueryParams.status,
          realName: this.nsqueryParams.realName,
          remark: this.nsqueryParams.remark,
          tradeNo: this.nsqueryParams.tradeNo,
          updatedEndAt: datetime ? this.$dayjs(datetime[1]).format('YYYY-MM-DD') : '',
          updatedStartAt: datetime ? this.$dayjs(datetime[0]).format('YYYY-MM-DD') : '',
          withdrawalChannel: this.nsqueryParams.withdrawalChannel,

        }

        this.loading = true
        saleforWithdraList(_params).then(response => {
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
      },
      handleSizeChangenLevel (val) {
        this.pageSizenLevel = val
        this.pageIndexnLevel = 1
        this.isAuth.isPermi(['blindBox:withdraw_account_record:page']) && this.searchnLevel()
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

