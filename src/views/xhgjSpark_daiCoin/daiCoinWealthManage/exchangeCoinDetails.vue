<template>
  <div class="cont_Wrapper">
    <div class="topshow">
      <el-form :model="queryParams" ref="queryForm" :rules="rules" :inline="true" class="mytopformstyle">
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
        <el-form-item label="类型：">
          <el-select v-model="queryParams.types" clearable placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, index) in exchangeSettingArr" :label="item.label" :value="item.label" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="扣减币种：">
          <el-select v-model="queryParams.outName" clearable placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, index) in daiCoinSettingArr" :label="item" :value="item" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="获得币种：">
          <el-select v-model="queryParams.inName" clearable placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, index) in daiCoinSettingArr" :label="item" :value="item" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单号：">
          <el-input v-model="queryParams.serialNumber"></el-input>
        </el-form-item>
        <el-form-item label="更新时间：">
          <el-date-picker v-model="queryParams.startTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="-">
          <el-date-picker v-model="queryParams.endTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="" style="border:none;">
            <el-button v-hasPermi="['whale:exchange_dh_record:page']" :loading="loading" type="primary" icon="el-icon-search" @click="search(1)">查询</el-button>
            <el-button @click="resetForm()">重置</el-button>
        </el-form-item>
        <el-form-item>
          （查询【账号】前，需选择 【注册类型】）
        </el-form-item>
      </el-form>
    </div>
    <div class="task-table">
      <!--table-->
      <el-table
      :data="tableData"
      v-loading="loading"
      style="width: 100%">
        <el-table-column prop="inviteCode" label="邀请码" align="center" min-width="120"></el-table-column>
        <el-table-column prop="nickname" label="昵称" align="center" min-width="120"></el-table-column>
        <el-table-column align="center" min-width="100" label="注册类型">
            <template scope="scope">
              <span v-if="scope.row.registeredType == 1">手机号</span>
              <span v-else-if="scope.row.registeredType == 2">邮箱</span>
            </template>
        </el-table-column>
        <el-table-column prop="phone" label="账号" align="center" min-width="130">
          <template scope="scope">
            <p v-if="+scope.row.registeredType === 1">
              {{scope.row.account}}
            </p>
            <p v-else-if="+scope.row.registeredType === 2">
              {{scope.row.email}}
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="collectLimit" label="类型" align="center" min-width="120">
          <template slot-scope="{row}">
            <span v-if="row.transferOutName">{{row.transferOutName}}</span>
            <span v-if="row.transferInName"> - {{row.transferInName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="transferOutRate" label="汇率" align="center" min-width="120">
          <template slot-scope="{row}">
            <span v-if="row.transferOutRate">{{row.transferOutRate}}</span>
            <span v-if="row.transferInRate"> : {{row.transferInRate}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="transferOutName" label="扣减币种" align="center" min-width="120"></el-table-column>
        <el-table-column prop="transferOutAmount" label="扣减数量" align="center" min-width="120"></el-table-column>
        <el-table-column prop="transferInName" label="获得币种" align="center" min-width="120"></el-table-column>
        <el-table-column prop="transferInAmount" label="获得数量" align="center" min-width="120"></el-table-column>
        <el-table-column prop="dedicateWorth" label="扣减荣耀值" align="center" min-width="120"></el-table-column>
        <el-table-column prop="serviceFeeRate" label="手续费" align="center" min-width="120">
          <template slot-scope="{row}">
            {{row.serviceFeeRate || row.serviceFeeRate == 0 ? row.serviceFeeRate + '%' : ''}}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" min-width="120">
          <template slot-scope="{row}">
            {{row.status ? '兑换成功' : '兑换失败'}}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="更新时间" align="center" min-width="160">
          <template slot-scope="{row}">
            {{row.createTime ? $dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
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
import { flashCashDetailsPage, exchangeConfigList, exchangeSettingList, daiCoinSettingList, convertWalletExchangeDetailLog } from "@/api/xhgjSpark_api/daiCoinSetting.js";
import {userAreaPhone} from '@/api/pointsMgmt/starTasks';
  export default {
    data () {
      return {
        loading: false,
        queryParams: {
          inviteCode: '',
          nickname: '',
          registeredType: 1,
          phone: '',
          areaCode: '',
          email: '',
          memberId: '',
          types: '',
          outName: '',
          inName: '',
          serialNumber: '',
          startTime: '',
          endTime: '',
        },
        tableData: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        rules: {
          
        },
        exchangeSettingArr: [],
        daiCoinSettingArr: [],
        telPerfixArr: [],
      }
    },
    mounted () {
      this.exchangeSettingList();
      this.daiCoinSettingList();
      this.search();
      this.getAreaCode();
    },
    methods: {
      getAreaCode() {
        userAreaPhone().then(response => {
          if (+response.code === 200) {
            this.telPerfixArr = response.data.list || [];
          }
        })
      },
      exchangeSettingList() {
        // exchangeSettingList
        exchangeConfigList({}).then(response => {
          if (response.code === 200) {
            this.exchangeSettingArr = JSON.parse(JSON.stringify(response.data.list))
          } else {
            this.exchangeSettingArr = []
            this.$message.error(response.message)
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
      resetForm() {
        this.queryParams = {
          inviteCode: '',
          nickname: '',
          registeredType: 1,
          phone: '',
          areaCode: '',
          email: '',
          memberId: '',
          types: '',
          outName: '',
          inName: '',
          serialNumber: '',
          startTime: '',
          endTime: '',
        };
        this.pageIndex = 1;
        this.loading = false;
        this.search();
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
      // 数据查询
      search (pgi) {
        if (pgi) this.pageIndex = pgi
        let typesArr = [];
        if(this.queryParams.types) {
          typesArr = this.queryParams.types.split(' -> ');
        }
        let newParam = Object.assign({}, this.queryParams);
        delete newParam.types;
        let _params = {
          currentPage: this.pageIndex,
          pageSize: this.pageSize,
          leftName: typesArr[0] ? typesArr[0] : '',
          rightName: typesArr[1] ? typesArr[1] : '',
          ...newParam
        }
        this.loading = true
        convertWalletExchangeDetailLog(_params).then(response => {
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
      // 
      handleOutName(val) {
        this.setDisAble(val, this.queryParams.inName);
      },
      handleInName(val) {
        this.setDisAble(val, this.queryParams.outName);
      },
      setDisAble(num, str) {
        this.daiCoinSettingArr.forEach(item => {
          if(item.label == num) {
            item.disable = true;
          }else if(item.label == str) {
            item.disable = true;
          }else{
            item.disable = false;
          }
        })
      }
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

