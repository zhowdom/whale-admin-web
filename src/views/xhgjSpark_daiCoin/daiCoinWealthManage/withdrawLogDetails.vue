<template>
  <div class="userpower_Wrapper">
    <!--提现明细页面-->
    <div class="toufuTopBox">
      <ul class="clearfix">
        <li>
          <span>{{myTofu.waitAudit}}</span>
          <h3>待审核</h3>
        </li>
        <li>
          <span>{{myTofu.audited}}</span>
          <h3>审核通过</h3>
        </li>
        <li>
          <span>{{myTofu.auditReject}}</span>
          <h3>审核拒绝</h3>
        </li>
        <li>
          <span>{{myTofu.waitConfirm}}</span>
          <h3>已上链，待确认</h3>
        </li>
        <li>
          <span>{{myTofu.completed}}</span>
          <h3>确认成功</h3>
        </li>
        <li>
          <span>{{myTofu.fail}}</span>
          <h3>提现失败</h3>
        </li>
        <li>
          <span>{{myTofu.totalCount}}</span>
          <h3>全部</h3>
        </li>
      </ul>
    </div>
    <div class="topshow">
      <el-form :model="queryParams" ref="queryForm" :inline="true" class="mytopformstyle">
        <el-form-item label="邀请码" prop="inviteCode" style="padding-bottom:20px;">
          <el-input clearable v-model="queryParams.inviteCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
            <el-input clearable v-model="queryParams.nickname" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="注册类型" prop="registeredType">
          <el-select v-model="queryParams.registeredType" clearable placeholder="请选择" @change="handleChangeType">
            <el-option label="手机号" :value="1"></el-option>
            <el-option label="邮箱" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <template v-if="queryParams.registeredType == 1">
          <el-form-item label="区号" prop="areaCode">
            <el-select v-model="queryParams.areaCode" clearable placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(item, index) in telPerfixArr" :label="item.label" :value="item.value" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账号" prop="phone">
            <el-input clearable  v-model="queryParams.phone" placeholder="请输入"></el-input>
          </el-form-item>
        </template>
        <el-form-item label="账号" prop="email" v-if="queryParams.registeredType == 2">
          <el-input clearable  v-model="queryParams.email" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="转账网络" prop="transactionNetworkName">
          <el-select v-model="queryParams.transactionNetworkName" clearable placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, index) in transferListArr" :label="item" :value="item" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="币种" prop="coinName">
          <el-select v-model="queryParams.coinName" clearable placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, index) of daiCoinSettingArr" :label="item" :value="item" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="更新时间" prop="jointimeSelected">
          <el-date-picker
            v-model="jointimeSelected"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" clearable placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="待审核" :value="0"></el-option>
            <el-option label="审核通过" :value="1"></el-option>
            <el-option label="审核被拒绝" :value="2"></el-option>
            <el-option label="待执行链上提现" :value="3"></el-option>
            <el-option label="已经提交上链,等待矿工确认" :value="4"></el-option>
            <el-option label="确认成功" :value="5"></el-option>
            <el-option label="提现失败" :value="6"></el-option>
            <el-option label="用户取消" :value="7"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提现区间">
          <el-select v-model="queryParams.rangeVal" clearable placeholder="请选择">
            <el-option label="全部" value="-"></el-option>
            <el-option label="0-100" value="0-100"></el-option>
            <el-option label="100-500" value="100-500"></el-option>
            <el-option label="500-1000" value="500-1000"></el-option>
            <el-option label="1000-2000" value="1000-2000"></el-option>
            <el-option label="2000-5000" value="2000-5000"></el-option>
            <el-option label="5000-10000" value="5000-10000"></el-option>
            <el-option label="10000-1000000" value="10000-1000000"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="From钱包地址" prop="fromAddress">
          <el-input clearable v-model="queryParams.fromAddress" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="To钱包地址" prop="toAddress">
          <el-input clearable v-model="queryParams.toAddress" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="TxID" prop="txnHash">
          <el-input clearable v-model="queryParams.txnHash" placeholder="请输入"></el-input>
        </el-form-item>
        <!-- <el-form-item label="交易类型" prop="type">
          <el-select v-model="queryParams.type" clearable placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="充值" :value="1"></el-option>
            <el-option label="提现" :value="2"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="" style="border:none;">
          <el-button v-hasPermi="['wallet:coin:transaction:withdraw:page']" :loading="loading" type="primary" icon="el-icon-search" @click="search(1)">查询</el-button>
          <el-button :loading="loading" type="primary" plain @click="resetQuery()">重置</el-button>
          <el-button type="primary" @click="auditClick({}, true)" plain>批量审核</el-button>
        </el-form-item>
        <el-form-item>
          （查询【账号】前，需选择 【注册类型】）
        </el-form-item>
        <div class="clearfix"></div>
        <div class="toufuTopBox jk2">
            <ul class="clearfix">
              <li style="margin-left:33px;">
                <span>{{myTofu2.count}}</span>
                <h3>选中笔数</h3>
              </li>
              <li>
                <span>{{myTofu2.money}}</span>
                <h3>提现金额</h3>
              </li>
            </ul>
          </div>

      </el-form>
    </div>
    <!--table-->
    <el-table
    :data="tableData"
    border
    v-loading="loading"
    @selection-change="handleSelectionChange"
    class="userpowerbox"
    style="width: 100%">
      <el-table-column
        type="selection"
        :selectable="checkboxSelect"
        align="center"
        width="55">
      </el-table-column>
      <el-table-column
        prop="inviteCode"
        align="center"
        min-width="100"
        label="邀请码">
      </el-table-column>
      <el-table-column
        align="center"
        prop="nickname"
        min-width="120"
        label="昵称">
      </el-table-column>
      <el-table-column
        align="center"
        min-width="100"
        label="注册类型">
          <template scope="scope">
            <span v-if="scope.row.registeredType == 1">手机号</span>
            <span v-else-if="scope.row.registeredType == 2">邮箱</span>
          </template>
      </el-table-column>
      <el-table-column
        prop="account"
        align="center"
        min-width="120"
        label="账号">
        <template scope="scope">
          <p v-if="+scope.row.registeredType === 1">
            {{scope.row.account}}
          </p>
          <p v-else-if="+scope.row.registeredType === 2">
            {{scope.row.email}}
          </p>
        </template>
      </el-table-column>
      <el-table-column
          prop="transactionNetworkName"
          align="center"
          min-width="100"
          label="转账网络">
      </el-table-column>
      <el-table-column
          prop="coinName"
          align="center"
          min-width="100"
          label="币种">
      </el-table-column>
      <el-table-column
          prop="originalBalance"
          align="center"
          min-width="120"
          label="交易前余额">
      </el-table-column>
      <el-table-column
          prop="disposeBalance"
          align="center"
          min-width="120"
          label="交易后余额">
      </el-table-column>
      <el-table-column
          prop="type"
          align="center"
          min-width="100"
          label="交易类型">
          <template scope="scope">{{+scope.row.type === 1 ? '充值' : '提现'}}</template>
      </el-table-column>
      <el-table-column
          prop="totalAmount"
          align="center"
          min-width="120"
          label="交易金额">
      </el-table-column>
      <el-table-column
          prop="serverFee"
          align="center"
          min-width="100"
          label="手续费">
      </el-table-column>
      <el-table-column
          prop="gasFee"
          align="center"
          min-width="100"
          label="Gas fee">
          <template slot-scope="{row}">
            {{row.gasFee}}{{row.gasFeeType == 1 ? ' (本币)' : (row.gasFeeType == 2 ? ' (USDT)' : '')}}
          </template>
      </el-table-column>
      <el-table-column
          prop="dedicateWorth"
          align="center"
          min-width="100"
          label="荣耀值">
      </el-table-column>
      <el-table-column
          prop="amount"
          align="center"
          min-width="100"
          label="实际到账">
      </el-table-column>
      <el-table-column
          prop="status"
          align="center"
          min-width="120"
          label="状态">
          <template scope="scope">
            <p v-if="+scope.row.status === 0">已申请待审核</p>
            <p v-else-if="+scope.row.status === 1">审核通过</p>
            <p v-else-if="+scope.row.status === 2">审核被拒绝</p>
            <p v-else-if="+scope.row.status === 3">审核通过待转账</p>
            <p v-else-if="+scope.row.status === 4">已转账待确认</p>
            <p v-else-if="+scope.row.status === 5">已成功</p>
            <p v-else-if="+scope.row.status === 6">提现失败</p>
            <p v-else-if="+scope.row.status === 7">用户取消</p>
          </template>
      </el-table-column>
      <el-table-column
          prop="memberStatus"
          align="center"
          min-width="120"
          label="账号状态">
          <template scope="scope">
            <p v-if="+scope.row.memberStatus === 1">正常</p>
            <p v-else-if="+scope.row.memberStatus === 2">禁用</p>
            <p v-else-if="+scope.row.memberStatus === 3">注销</p>
          </template>
      </el-table-column>
      <el-table-column
          prop="fromAddress"
          align="center"
          min-width="150"
          label="From">
      </el-table-column>
      <el-table-column
          prop="toAddress"
          align="center"
          min-width="150"
          label="To">
      </el-table-column>
      <el-table-column
          prop="txnHash"
          align="center"
          min-width="150"
          label="TxID">
      </el-table-column>
      <el-table-column
          prop="updatedAt"
          align="center"
          min-width="160"
          label="更新时间">
          <template slot-scope="{row}">
            {{row.updatedAt ? $dayjs(row.updatedAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
          </template>
      </el-table-column>
      <el-table-column
          prop="remark"
          align="center"
          min-width="120"
          label="备注">
      </el-table-column>
      <el-table-column
        align="center"
        maxlength="11"
        fixed="right"
        label="操作">
          <template scope="scope">
            <el-button v-if="+scope.row.status === 0" type="primary" size="mini" @click="auditClick(scope.row, false)">审核</el-button>
          </template>
      </el-table-column>
    </el-table>
    <!--table-->
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
    <!--审核-->
    <el-dialog title="审核" :visible.sync="dialogFormAuditVisible">
      <el-form :model="formitpAudit">
        <el-form-item label="" :label-width="formLabelWidth">
          <el-radio-group v-model="formitpAudit.auditStatus">
              <el-radio :label="1">审核通过</el-radio>
              <el-radio :label="2">审核不通过</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" v-if="+formitpAudit.auditStatus === 2">
          <el-input clearable v-model="formitpAudit.auditMessage" type="textarea" :rows="2" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-select v-model="formitpAudit.phoneOrder" clearable placeholder="请选择">
              <el-option v-for="(item, key, index) in phoneObj" :label="item" :value="Number(key)" :key="index"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="验证码1" :label-width="formLabelWidth" prop="code">
          <div>
            <el-input maxlength="6" v-model="formitpAudit.verificationCode" autocomplete="off" style="width:150px;margin-right:10px;"></el-input>
            <el-button @click="sendCode">获取验证码</el-button>
          </div>
          <span v-show="showCodeBox">验证码已发送至：{{phoneNumber}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormAuditVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveformitpAudit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { cgQuery, txQuery, txQueryToufu, xhgjSpark_wdlist, xhgjSpark_audit, xhgjSpark_auditBatch, xhgjSpark_platWalletSendCode } from "@/api/xhgjSpark_api";
import { daiCoinSettingList, transferList, getPhone } from "@/api/xhgjSpark_api/daiCoinSetting.js";
import {userAreaPhone} from '@/api/pointsMgmt/starTasks';
  export default {
    data () {
      return {
        myTofu2: {
          money: 0,
          count: 0,
        },
        myTofu: {
          waitAudit: 0,
          audited: 0,
          auditReject: 0,
          waitConfirm: 0,
          completed: 0,
          fail: 0,
          totalCount: 0
        },
        formitpAudit: {
          auditStatus: 1,
          phoneOrder: '1',
          auditMessage: '',
          verificationCode: '',
        },
        formLabelWidth: '120px', // 新增修改ed
        loading: false,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        queryParams: {
          rangeVal: '-',
          inviteCode: '',
          nickname: '',
          registeredType: 1,
          phone: '',
          coinName: '',
          areaCode: '',
          email: '',
          account: '',
          memberId: '',
          transactionNetworkName: '',
          status: '',
          fromAddress: '',
          toAddress: '',
          txnHash: '',
          type: '',
        },
        jointimeSelected: '',
        tableData: [],
        showCodeBox: false,
        phoneNumber: '',
        curRow: {},
        dialogFormAuditVisible: false,
        daiCoinSettingArr: [],
        transferListArr: [],
        telPerfixArr: [],
        multipleSelection: [], // 选中数据
        phoneObj: {}
      }
    },
    mounted () {
      this.search();
      this.daiCoinSettingList();
      this.transferList();
      this.getAreaCode();
      this.getPhone();
      this.isAuth.isPermi(['wallet:coin:transaction:withdraw:page']) && this.toufuQuery()
    },
    watch: {},
    methods: {
      // 豆腐块统计
      toufuQuery () {
        txQueryToufu().then(response => {
          if (+response.code === 200 && response.data) {
            this.myTofu = response.data
          } else {
            this.$message.error(response.message)
          }
        })
      },
      getPhone() {
        getPhone().then(response => {
          if (+response.code === 200) {
            this.phoneObj = response.data || {};
          }
        })
      },
      getAreaCode() {
        userAreaPhone().then(response => {
          if (+response.code === 200) {
            this.telPerfixArr = response.data.list || [];
          }
        })
      },
      // 转账网络
      transferList() {
        transferList({}).then(response => {
          if (response.code === 200) {
            this.transferListArr = JSON.parse(JSON.stringify(response.data))
          } else {
            this.transferListArr = []
            this.$message.error(response.message)
          }
        })
      },
      // 代币列表
      daiCoinSettingList() {
        daiCoinSettingList({}).then(response => {
          if (response.code === 200) {
            this.daiCoinSettingArr = JSON.parse(JSON.stringify(response.data))
          } else {
            this.daiCoinSettingArr = []
            this.$message.error(response.message)
          }
        })
      },
      sendCode () {
        xhgjSpark_platWalletSendCode({phoneOrder: this.formitpAudit.phoneOrder}).then(response => {
          if (+response.code === 200 && response.data) {
            this.$message.success("发送成功")
            let phoneNum = response.data.phone.substr(0,3) + '****' + response.data.phone.substr(7,response.data.phone.length);
              this.showCodeBox = true;
              this.phoneNumber = phoneNum;
          } else {
            this.$message.error(response.message)
          }
        })
      },
      saveformitpAudit () {
        if(this.batchBool == true) {
          let snList = [];
          this.multipleSelection.forEach(item => {
            snList.push(item.sn);
          })
          xhgjSpark_auditBatch(
            Object.assign(this.formitpAudit, {snList: snList})
            ).then(response => {
              if (+response.code === 200) {
              this.$message({
                  message: '操作成功',
                  type: 'success',
                  'duration': 1000,
                  onClose: () => {
                    this.search()
                    this.dialogFormAuditVisible = false
                  }
                })
            } else {
              this.$message.error(response.message)
            }
          })
        }else {
          xhgjSpark_audit(
            Object.assign(this.formitpAudit, this.curRow)
            ).then(response => {
              if (+response.code === 200) {
              this.$message({
                  message: '操作成功',
                  type: 'success',
                  'duration': 1000,
                  onClose: () => {
                    this.search()
                    this.dialogFormAuditVisible = false
                  }
                })
            } else {
              this.$message.error(response.message)
            }
          })
        }
      },
      auditClick (row, isBool) {
        if(isBool == true) {
          if(this.multipleSelection.length <= 0) {
            this.$message.error("请选择数据");
            return;
          }
        }else {
          this.curRow = {sn: row.sn}
        }
        this.dialogFormAuditVisible = true
        this.formitpAudit = {
          auditStatus: 1,
          phoneOrder: 1,
          auditMessage: '',
          verificationCode: '',
        }
        this.batchBool = isBool;
      },
      checkboxSelect (row, rowIndex) {
        // 能够批量启用的行数据
        return row.status === 0;
      },
      // 批量选择
      handleSelectionChange(val) {
        this.multipleSelection = val
        this.myTofu2.count = this.multipleSelection.length || 0
        this.myTofu2.money = this.multipleSelection.reduce((prev, cre) => {
          return prev + cre.totalAmount
        }, 0)
        this.myTofu2.money = this.myTofu2.money.toFixed(6)
        console.log(this.multipleSelection, 'this.multipleSelection')
      },
      // 重置
      resetQuery() {
        this.queryParams = {
          rangeVal: '-',
          inviteCode: '',
          nickname: '',
          registeredType: 1,
          phone: '',
          coinName: '',
          areaCode: '',
          email: '',
          account: '',
          memberId: '',
          transactionNetworkName: '',
          status: '',
          fromAddress: '',
          toAddress: '',
          txnHash: '',
          type: '',
        }
        this.jointimeSelected = '';
        this.search(1);
      },
      // 选择注册类型
      handleChangeType() {
        this.queryParams.areaCode = '';
        this.queryParams.phone = '';
        this.queryParams.email = '';
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.search()
      },
      search (pgi) {
        this.$refs['queryForm'].validate((valid) => {
          if (valid) {
            if (pgi) this.pageIndex = pgi
            let datetime = []
            datetime = this.jointimeSelected
            let _params = {
              currentPage: this.pageIndex,
              pageSize: this.pageSize,
              endTime: datetime ? datetime[1] : '',
              startTime: datetime ? datetime[0] : '',
              intervalMax: this.queryParams.rangeVal.split('-')[1],
              intervalMin: this.queryParams.rangeVal.split('-')[0],
              ...this.queryParams
            }
            this.loading = true
            txQuery(_params).then(response => {
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
            }).catch(e => {
              this.loading = false
              this.$message.error(response.message)
            })
          }
        })
      }
    }
  }
</script>

<style>
.userpower_Wrapper{
    padding: 20px;
}
 .userpower_Wrapper .topshow ul{
     margin-left: -36px;
 }
 .userpower_Wrapper .topshow li{
    padding: 5px;
    float: left;
    list-style: none;
    margin-right: 10px;
    border: 1px solid #ccc;
    border-radius:3px;
    margin-bottom: 10px;
    font-size: 13px;
 }
 .userpower_Wrapper .el-form-item{
   margin-bottom: 0!important;
   border: 1px solid #ccc;
   border-bottom: none;
 }
 .userpower_Wrapper .el-form-item:last-child{
   border-bottom: 1px solid #ccc;
 }
 .userpower_Wrapper .el-form-item__label,.userpower_Wrapper .el-form-item__content{
   padding: 10px!important;
 }
 .userpower_Wrapper .notP .el-form-item__content{
   padding: 0!important;
 }
 .mytopformstyle .el-form-item{
   border: none;
 }
 .toufuTopBox ul li {
  width:120px;
  border-radius: 5px;
  border: 1px solid #ccc;
  text-align: center;
  color: #333;
  float: left;
  margin-right: 20px;
  padding: 10px 0;
 }
  .toufuTopBox ul li h3{
    padding: 0;
    margin: 0;
    margin-top:10px;
    font-size: 13px;
  }
 .toufuTopBox.jk2 ul li {
  border: 1px solid #1890ff;
  color: #1890ff;
 }
</style>

