<template>
  <div class="userpower_Wrapper">
    <h3>用户资产汇总</h3>
    <el-date-picker
      v-model="jointimeSelectedTop"
      type="daterange"
      value-format="timestamp"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
    <el-button v-hasPermi="['advertising:user_oper:sign']" type="primary" icon="el-icon-search" @click="searchTop" style="margin-left:10px;">查询</el-button>
    <el-table
      :data="tableDataTop"
      border
      class="userpowerbox"
      style="width: 100%;margin-top:10px;">
      <el-table-column
        prop="coinName"
        align="center"
        maxlength="11"
        label="币种">
      </el-table-column>
      <el-table-column
        prop="totalBalance"
        align="center"
        maxlength="11"
        label="用户总资产">
      </el-table-column>
      <el-table-column
        prop="totalServerFee"
        align="center"
        maxlength="11"
        label="提现手续费">
      </el-table-column>
      <el-table-column
        prop="totalGasFee"
        align="center"
        maxlength="11"
        label="提现Gasfee">
      </el-table-column>
      <el-table-column
        align="center"
        maxlength="11"
        label="操作">
        <template>
          <el-button v-hasPermi="['advertising:user_oper:sign']" type="text" @click="havaAsee">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <h3>用户资产明细</h3>
    <div class="topshow">
      <el-form :model="queryParams" ref="queryForm" :rules="rules" :inline="true" class="mytopformstyle">
        <el-form-item label="邀请码" prop="inviteCode">
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
        <el-form-item label="余额" prop="balanceRange">
          <el-input clearable v-model="queryParams.balanceMin" placeholder="请输入" style="width:100px;"></el-input>
          <span style="margin:0 10px;">-</span>
          <el-input clearable v-model="queryParams.balanceMax" placeholder="请输入" style="width:100px;"></el-input>
        </el-form-item><br>
        <el-form-item label="" style="border:none;">
          <el-button v-hasPermi="['advertising:user_oper:page']" :loading="loading" type="primary" icon="el-icon-search" @click="search(1)">查询</el-button>
          <el-button :loading="loading" type="primary" plain @click="resetQuery()">重置</el-button>
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
        prop="balance"
        align="center"
        maxlength="11"
        label="余额">
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
      <el-table-column
        align="center"
        maxlength="11"
        label="操作">
        <template scope="scope">
          <el-button v-hasPermi="['advertising:user_oper:sign']" type="text" @click="havaAsee(scope.row)">查看</el-button>
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
  import { xhgjSpark_userWealthTotalQuery, xhgjSpark_userWealthDetailQuery } from "@/api/xhgjSpark_api";
  import { daiCoinSettingList } from "@/api/xhgjSpark_api/daiCoinSetting.js";
  import {userAreaPhone} from '@/api/pointsMgmt/starTasks';
  export default {
    components: {},
    data () {
      var validatePhone = (rule, value, callback) => {
        if (!(/^1[3456789]\d{9}$/.test(value)) && value !== '') {
          return callback(new Error('请输入正确的手机号码'))
        }
        callback()
      }
      var validateBalanceRange = (rule, value, callback) => {
        var reg = /^\d+(\.{0,1}\d{1,4}){0,1}$/;
        if ((this.queryParams.balanceMax !== '' && !reg.test(this.queryParams.balanceMax))
          || (this.queryParams.balanceMin !== '' && !reg.test(this.queryParams.balanceMin))) {
          return callback(new Error("余额格式错误,最多四位小数"));
        }
        return callback();
      }
      return {
        rules: {
          phone: [
            { validator: validatePhone, trigger: 'blur' }
          ],
          balanceRange: [
            { validator: validateBalanceRange, trigger: 'blur' }
          ]
        },
        formLabelWidth: '120px', // 新增修改ed
        loading: false,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        tableData: [],
        queryParams: {
          inviteCode: '',
          nickname: '',
          registeredType: 1,
          phone: '',
          coinName: '',
          areaCode: '',
          email: '',
          balanceMin: '',
          balanceMax: ''
        },
        jointimeSelected: '',
        jointimeSelectedTop: '',
        tableDataTop: [],
        daiCoinSettingArr: [],
        telPerfixArr: []
      }
    },
    mounted () {
      this.searchTop()
      // this.search()
      this.daiCoinSettingList();
      this.getAreaCode();
    },
    watch: {},
    methods: {
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
      havaAsee (row) {
        this.$router.push({ path: "/daiCoinWealthManage/userWealthForDetails", query: {memberId: row.memberId, account: row.account}})
      },
      searchTop () {
        xhgjSpark_userWealthTotalQuery().then(response => {
          if (+response.code === 200) {
            this.tableDataTop = response.data || []
          } else {
            this.tableDataTop = []
          }
        })
      },
      // 选择注册类型
      handleChangeType() {
        this.queryParams.areaCode = '';
        this.queryParams.phone = '';
        this.queryParams.email = '';
      },
      // 重置
      resetQuery() {
        this.queryParams = {
          inviteCode: '',
          nickname: '',
          registeredType: 1,
          phone: '',
          coinName: '',
          areaCode: '',
          email: '',
          balanceMin: '',
          balanceMax: ''
        }
        this.jointimeSelected = '';
        this.search(1);
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
              endUpdateAt: datetime ? datetime[1] : '',
              startUpdateAt: datetime ? datetime[0] : '',
              ...this.queryParams
            }
            this.loading = true
            xhgjSpark_userWealthDetailQuery(_params).then(response => {
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
  .userpower_Wrapper .el-form-item__label,.userpower_Wrapper .el-form-item__content{
    margin-bottom: 20px;
  }
  .userpower_Wrapper .notP .el-form-item__content{
    padding: 0!important;
  }
  .mytopformstyle .el-form-item{
    border: none;
  }
</style>

