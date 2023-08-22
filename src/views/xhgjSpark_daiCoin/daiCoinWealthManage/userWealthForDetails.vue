<template>
  <div class="userpower_Wrapper">
    <div>
      <ul class="clearfix">
        <li class="fl" v-for="(item, index) in tofuMaps" :key="index" style="display:inline-block;padding:10px 20px;background-color:#F5F7FA;border-radius:10px;border-color: #dfe4ed;text-align:center;margin-right:10px;">
          <p style="margin:0;padding:0;padding-bottom:10px;">{{item.coinName}}</p>
          <h3 style="margin:0;padding:0;padding-bottom:10px;">{{item.totalBalance}}</h3>
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
        <el-form-item label="币种" prop="coinName">
          <el-select v-model="queryParams.coinName" clearable placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, index) in daiCoinSettingArr" :label="item" :value="item" :key="index"></el-option>
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
        <el-form-item label="类型" prop="orderType">
          <el-select v-model="queryParams.orderType" clearable placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, key, index) in orderTypeArr" :label="item" :value="key" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" style="border:none;">
          <el-button v-hasPermi="['advertising:user_oper:page']" :loading="loading" type="primary" icon="el-icon-search" @click="search(1)">查询</el-button>
          <el-button :loading="loading" type="primary" @click="returnBack" plain>返回</el-button>
        </el-form-item>
        <el-form-item>
          （查询【账号】前，需选择 【注册类型】）
        </el-form-item>
      </el-form>
    </div>

    <!--table-->
    <el-table
    :data="tableData"
    border
    v-loading="loading"
    class="userpowerbox"
    style="width: 100%">
      <el-table-column
        prop="inviteCode"
        align="center"
        label="邀请码">
      </el-table-column>
      <el-table-column
        align="center"
        prop="nickname"
        label="昵称">
      </el-table-column>
      <el-table-column
        align="center"
        label="注册类型">
          <template scope="scope">
            <span v-if="scope.row.registeredType == 1">手机号</span>
            <span v-else-if="scope.row.registeredType == 2">邮箱</span>
          </template>
      </el-table-column>
      <el-table-column
        prop="account"
        align="center"
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
        prop="coinName"
        align="center"
        maxlength="11"
        label="币种">
      </el-table-column>
      <el-table-column
        prop="originalBalance"
        align="center"
        maxlength="11"
        label="交易前余额">
      </el-table-column>
      <el-table-column
        prop="orderTypeName"
        align="center"
        maxlength="11"
        label="类型">
        <!-- <template scope="scope">
          <p v-if="+scope.row.orderType === 1">充值</p>
          <p v-else-if="+scope.row.orderType === 2">冻结提现金额</p>
          <p v-else-if="+scope.row.orderType === 3">冻结提现手续费</p>
          <p v-else-if="+scope.row.orderType === 4">冻结提现燃油费</p>
          <p v-else-if="+scope.row.orderType === 5">退回提现金额</p>
          <p v-else-if="+scope.row.orderType === 6">退回提现手续费</p>
          <p v-else-if="+scope.row.orderType === 7">退回提现燃油费</p>
          <p v-else-if="+scope.row.orderType === 8">提现金额</p>
          <p v-else-if="+scope.row.orderType === 9">提现手续费</p>
          <p v-else-if="+scope.row.orderType === 10">提现燃油费</p>
          <p v-else-if="+scope.row.orderType === 11">盲盒购买</p>
          <p v-else-if="+scope.row.orderType === 12">盲盒购买退还</p>
          <p v-else-if="+scope.row.orderType === 13">盲盒参与补贴</p>
          <p v-else-if="+scope.row.orderType === 14">盲盒持券收益</p>
          <p v-else-if="+scope.row.orderType === 15">盲盒城市服务商收益</p>
        </template> -->
      </el-table-column>
      <el-table-column
        prop="amount"
        align="center"
        maxlength="11"
        label="交易金额">
      </el-table-column>
      <el-table-column
        prop="disposeBalance"
        align="center"
        maxlength="11"
        label="交易后余额">
      </el-table-column>
      <el-table-column
        prop="updatedAt"
        align="center"
        width="180"
        label="更新时间">
        <template slot-scope="{row}">
          {{row.updatedAt ? $dayjs(row.updatedAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
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
  </div>
</template>

<script>
import { xhgjSpark_userWealthTofuInnerQuery, xhgjSpark_userWealthDetailInnerQuery } from "@/api/xhgjSpark_api";
import { daiCoinSettingList, getOrderType } from "@/api/xhgjSpark_api/daiCoinSetting.js";
import {userAreaPhone} from '@/api/pointsMgmt/starTasks';
  export default {
    components: {},
    data () {
      return {
        formLabelWidth: '120px', // 新增修改ed
        loading: false,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        queryParams: {
          inviteCode: '',
          nickname: '',
          registeredType: 1,
          phone: '',
          coinName: '',
          areaCode: '',
          email: '',
          memberId: this.$route.query.memberId,
        },
        jointimeSelected: '',
        tableData: [],
        tofuMaps: [],
        daiCoinSettingArr: [],
        telPerfixArr: [],
        orderTypeArr: {}
      }
    },
    created () {
      xhgjSpark_userWealthTofuInnerQuery({memberId: this.$route.query.memberId || null}).then(response => {
        if (+response.code === 200) {
          this.tofuMaps = response.data || []
        } else {
          this.tofuMaps = []
        }
      })
    },
    mounted () {
      this.search()
      this.daiCoinSettingList();
      this.getAreaCode();
      this.getOrderType();
    },
    methods: {
      getOrderType() {
        getOrderType().then(response => {
          if (+response.code === 200) {
            this.orderTypeArr = response.data || {};
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
      returnBack () {
        this.$router.push({ path: "/daiCoinWealthManage/userWealth", query: {}})
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
              ...this.queryParams
            }
            this.loading = true
            xhgjSpark_userWealthDetailInnerQuery(_params).then(response => {
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
              console.log(e)
              this.loading = false
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
</style>

