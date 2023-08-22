<template>
  <div class="seeInfosEachissueBox bbStatisticBox" style="padding:20px;">

    <el-form :model="nsqueryParams" :rules="nLevelrules" ref="nLevelqueryForm" :inline="true">
      <el-form-item label="类型">
        <el-select v-model="nsqueryParams.statusType" clearable placeholder="请选择">
          <el-option label="全部" :value="-1"></el-option>
          <el-option label="未审核" :value="0"></el-option>
          <el-option label="审核成功" :value="1"></el-option>
          <el-option label="审核失败" :value="2"></el-option>
        </el-select>
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
    <el-form-item label="邮箱" prop="email">
        <el-input
          v-model.trim="nsqueryParams.email"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 130px"
        />
      </el-form-item>

      <el-form-item label="真实姓名" prop="userName">
        <el-input
          v-model.trim="nsqueryParams.userName"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 130px"
        />
      </el-form-item>
      
      <el-form-item>
        <el-button v-hasPermi="['internal:member:remain:page']" type="primary" :loading="loading" icon="el-icon-search" @click="searchnLevel(1)">查询</el-button>
        <el-button v-hasPermi="['internal:member:remain:audit']" v-show="multipleSelection.length > 0" style="margin-right:20px;" :disabled="multipleSelection.length <= 0" type="primary" @click="auditClickBatchCclick">批量审核</el-button>
      </el-form-item>
    </el-form>
  <el-table :data="nLevelData" @selection-change="handleSelectionChange">
    <!-- <el-table-column
      type="selection"
      :selectable="selectableInit"
      width="55">
    </el-table-column> -->
    <el-table-column property="id" label="序号"></el-table-column>
    <el-table-column property="phone" label="手机号"></el-table-column>
    <el-table-column property="email" label="邮箱"></el-table-column>
    <el-table-column property="userName" label="真实姓名" width="120"></el-table-column>
    <el-table-column property="controlScore" label="管制分"></el-table-column>
    <el-table-column property="historyTaskName" label="历史最高阶任务"></el-table-column>
    <el-table-column property="tallerTaskName" label="达标后兑换更高阶任务券"></el-table-column>
    <el-table-column property="modifyAt" label="更新时间">
      <template slot-scope="{row}">
        {{row.modifyAt ? $dayjs(row.modifyAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
    </el-table-column>
    <el-table-column property="statusType" label="状态">
      <template scope="scope">
        <p v-if="+scope.row.statusType === 0">未审核</p>
        <p v-else-if="+scope.row.statusType === 1">审核成功</p>
        <p v-else-if="+scope.row.statusType === 2">审核失败</p>
      </template>
    </el-table-column>
    <el-table-column property="remark" label="备注"></el-table-column>
    
    <el-table-column label="操作">
       <template scope="scope">
        <p v-hasPermi="['internal:member:remain:audit']" v-show="+scope.row.statusType === 0" @click="auditClick(scope.row)" style="color:#1890ff;cursor:pointer;text-decoration:underline;">审核</p>
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
        <el-form-item label="子订单号" prop="phone">
          <el-input
            v-model.trim="nLevelqueryParams.phone"
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
  :title="+batchSumbit.statusType === 1 ? '确定审核通过？' : '确定审核失败？'"
  :visible.sync="dialogVisibleAudit"
  width="30%"
  >
  <div style="text-align:center;">
    <p v-show="+batchSumbit.statusType === 1" style="font-size:16px;"><i class="el-icon-question" style="color:#1890ff;"></i>审核通过后，将成功解锁”须保持"</p>
    <p v-show="+batchSumbit.statusType === 2" style="font-size:16px;"><i class="el-icon-question" style="color:#1890ff;"></i>审核失败后，用户需重发起解锁申请</p>
    <el-radio-group v-model="batchSumbit.statusType" style="padding:20px 0 39px 0;">
      <el-radio :label="1">审核通过</el-radio>
      <el-radio :label="2">审核不通过</el-radio>
    </el-radio-group>
    <div v-show="batchSumbit.statusType === 2" class="clearfix">
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
    <el-button v-if="batchSumbit.statusType === 1" type="primary" @click="batchAuditSave">确 定</el-button>
    <el-button v-else :disabled="!batchSumbit.remark" type="primary" @click="batchAuditSave">确 定</el-button>
  </span>
</el-dialog>


  </div>
</template>

<script>
import { needHoldList, needHoldAudit, blindBoxTFAudit, blindBoxTFList, takejewelCodeList, zzJoyPoorTotalSwitchList } from "@/api/games";
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
        cmbTableData: [],
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
          phone: '',
          realName: '',
          periodsNum: '',
          redbacktime: '' ,
          redbacktime2: '',
          redbacktime3: '',
        },
        nsqueryParams: {
          phone: '',
          statusType: '',
          userName: '',
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
          realName: '',
          status: 1,
          thirdTradeNo: '',
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
          remark: '',
          statusType: 1,
          id: ''
        },
      }
    },
    mounted () {
      this.isAuth.isPermi(['internal:member:remain:page']) && this.searchnLevel(1)
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
        this.batchSumbit.remark = ''
        this.batchSumbit.statusType = 3
        this.isBatchType = 0
        this.curChoosedId = row.id
        this.batchSumbit.statusType = 1
      },
      // 批量审核
      auditClickBatchCclick () {
        this.dialogVisibleAudit = true
        this.batchSumbit.remark = ''
        this.batchSumbit.statusType = 3
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
        // if (this.isBatchType === 0) {
        //   this.batchSumbit.ids = [this.curChoosedId]
        // } else {
        //   this.batchSumbit.ids = this.multipleSelection
        // }
        this.batchSumbit.id = this.curChoosedId
        needHoldAudit(this.batchSumbit).then(response => {
          this.dialogVisibleAudit = false
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
        let _params = {
          phone: this.nsqueryParams.phone,
          statusType: this.nsqueryParams.statusType,
          userName: this.nsqueryParams.userName,
          currentPage: this.pageIndexnLevel,
          pageSize: this.pageSizenLevel,
        }
        this.loading = true
        needHoldList(_params).then(response => {
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
        this.isAuth.isPermi(['internal:member:remain:page']) && this.searchnLevel()
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

