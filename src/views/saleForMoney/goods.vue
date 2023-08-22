<template>
  <div class="seeInfosEachissueBox bbStatisticBox" style="padding:20px;">

    <el-form :model="nsqueryParams" :rules="nLevelrules" ref="nLevelqueryForm" :inline="true">
      <el-form-item label="订单号" prop="orderNo">
        <el-input
          v-model.trim="nsqueryParams.orderNo"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 130px"
        />
      </el-form-item>
      <el-form-item label="当前期编号" prop="currentPeriodNo">
        <el-input
          v-model.trim="nsqueryParams.currentPeriodNo"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 130px"
        />
      </el-form-item>
      <el-form-item label="盲盒编号" prop="blindBoxNo">
        <el-input
          v-model.trim="nsqueryParams.blindBoxNo"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 130px"
        />
      </el-form-item>
      <el-form-item label="用户ID" prop="memberId">
        <el-input
          v-model.trim="nsqueryParams.memberId"
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
      <el-form-item label="真实姓名" prop="realName">
        <el-input
          v-model.trim="nsqueryParams.realName"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 130px"
        />
      </el-form-item>

      <el-form-item label="状态">
        <el-select v-model="nsqueryParams.status" clearable placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="未发布" :value="1"></el-option>
          <el-option label="售卖中" :value="2"></el-option>
          <el-option label="已售" :value="3"></el-option>
        </el-select>
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

      
      

      <el-form-item>
        <el-button v-hasPermi="['blindBox:product_platform:page']" type="primary" :loading="loading" icon="el-icon-search" @click="searchnLevel(1)">查询</el-button>
        <el-button v-hasPermi="['blindBox:product_platform:buy']" v-show="multipleSelection.length > 0" style="margin-right:20px;" :disabled="multipleSelection.length <= 0" type="primary" @click="bugIn(1)">批量买入</el-button>
      </el-form-item>
    </el-form>
  <el-table :data="nLevelData" @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      :selectable="selectableInit"
      width="55">
    </el-table-column>
    <el-table-column property="orderNo" label="订单号"></el-table-column>
    <el-table-column property="currentPeriodNo" label="当前期编号"></el-table-column>
    <el-table-column property="blindBoxNo" label="盲盒编号" width="120">
      <template scope="scope">
        <el-button @click="jumpToEachissuePage(scope.row)" type="text">{{scope.row.blindBoxNo}}</el-button>
      </template>
    </el-table-column>
    <el-table-column property="memberId" label="用户ID"></el-table-column>
    <el-table-column property="phone" label="手机号"></el-table-column>
    <el-table-column property="realName" label="真实姓名"></el-table-column>
    <el-table-column property="num" label="抢购份数"></el-table-column>
    <el-table-column property="unitPrice" label="每份单价"></el-table-column>
    <el-table-column property="totalSalesPrice" label="总售价"></el-table-column>
    <el-table-column label="更新时间">
      <template slot-scope="{row}">
        <p>{{row.createTime ? $dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}</p>
      </template>
    </el-table-column>
    <el-table-column property="status" label="状态">
      <template scope="scope">
        <p v-if="+scope.row.status === 1">未发布</p>
        <p v-else-if="+scope.row.status === 2">售卖中</p>
        <p v-else-if="+scope.row.status === 3">已售罄</p>
      </template>
    </el-table-column>
    
    <el-table-column property="createAt" label="操作">
       <template scope="scope">
        <p v-show="+scope.row.status === 2" v-hasPermi="['blindBox:product_platform:buy']" @click="bugIn(0, scope.row)" style="color:#1890ff;cursor:pointer;text-decoration:underline;">买入</p>
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
    <p v-show="+batchSumbit.auditStatus === 3" style="font-size:16px;"><i class="el-icon-question" style="color:#1890ff;"></i>审核通过后，将成功解锁”须保持"</p>
    <p v-show="+batchSumbit.auditStatus === 2" style="font-size:16px;"><i class="el-icon-question" style="color:#1890ff;"></i>审核失败后，用户需重发起解锁申请</p>
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
import { saleforBalanceGoodsList, saleforBalanceGoodsBugIn, blindBoxTFAudit, blindBoxTFList, takejewelCodeList, zzJoyPoorTotalSwitchList } from "@/api/games";
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
          blindBoxNo: '',
          currentPage: '',
          currentPeriodNo: '',
          memberId: '',
          orderNo: '',
          pageSize: '',
          phone: '',
          realName: '',
          status: '',
          redbacktime: '' ,
          redbacktime2: '',
          redbacktime3: '',
          createdEndAt: '',
          createdStartAt: '',
          memberPhone: '',
          payType: '',
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
          auditErrorReason: '',
          auditStatus: 3,
          ids: ''
        },
      }
    },
    mounted () {
      this.isAuth.isPermi(['blindBox:product_platform:page']) && this.searchnLevel(1)
    },
    watch: {},
    methods: {
      jumpToEachissuePage (row) {
        // 进入盲盒详情统计页面，盲盒编号必传
        this.$router.push({ path: "/games/blindBoxEachIssueInfos", query: {blindBoxNo: row.blindBoxNo, blindBoxType: row.blindBoxType}})
      },
      // 买入
      bugIn (type, row) {
        this.$confirm('确定后，用户【卖了换钱-余额】账上就会增加出售盲盒实物获得的收益', '确定买入?', {
          type: 'warning',
          showClose: false,
          closeOnClickModal: false,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          let ids = []
          if (type) {
            ids = this.multipleSelection
          } else {
            ids = [row.id]
          }
          saleforBalanceGoodsBugIn({ ids }).then(response => {
            if (+response.code === 200) {
              this.$message.success(response.message)
              this.searchnLevel()
            } else {
              this.$message.error(response.message)
            }
          })
        }).catch((e) => {})
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
        return +row['status'] === 2
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
          endTime: datetime ? this.$dayjs(datetime[1]).format('YYYY-MM-DD') : '',
          memberId: this.nsqueryParams.memberId,
          orderNo: this.nsqueryParams.orderNo,
          pageSize: this.pageSizenLevel,
          phone: this.nsqueryParams.phone,
          realName: this.nsqueryParams.realName,
          startTime: datetime ? this.$dayjs(datetime[0]).format('YYYY-MM-DD') : '',
          status: this.nsqueryParams.status,
        }

        this.loading = true
        saleforBalanceGoodsList(_params).then(response => {
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
        this.isAuth.isPermi(['blindBox:product_platform:page']) && this.searchnLevel()
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

