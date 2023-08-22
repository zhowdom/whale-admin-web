<template>
  <div class="cont_Wrapper">
    <div class="topshow">
      <el-form :model="queryParams" ref="queryForm" :rules="rules" :inline="true" class="mytopformstyle">
        <el-form-item label="发起方邀请码" prop="memberInviteCode" >
          <el-input clearable v-model="queryParams.memberInviteCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="发起方昵称" prop="memberNickName">
            <el-input clearable v-model="queryParams.memberNickName" placeholder="请输入"></el-input>
        </el-form-item>
        
        <el-form-item label="区号" prop="memberAreaCode">
          <el-select v-model="queryParams.memberAreaCode" clearable placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, index) in telPerfixArr" :label="item.label" :value="item.value" :key="index"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="" prop="memberPhone">
            <el-input clearable v-model="queryParams.memberPhone" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="发起方邮箱" prop="memberEmail">
            <el-input clearable v-model="queryParams.memberEmail" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item label="币种：" prop="coinName">
          <el-select v-model="queryParams.coinName" clearable placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, index) in daiCoinSettingArr" :label="item" :value="item" :key="index"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="接收方邀请码" prop="receiveMemberInviteCode" >
          <el-input clearable v-model="queryParams.receiveMemberInviteCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="接收方昵称" prop="receiveMemberNickName">
            <el-input clearable v-model="queryParams.receiveMemberNickName" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item label="区号" prop="receiveMemberAreaCode">
          <el-select v-model="queryParams.receiveMemberAreaCode" clearable placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, index) in telPerfixArr" :label="item.label" :value="item.value" :key="index"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="" prop="receiveMemberPhone">
            <el-input clearable v-model="queryParams.receiveMemberPhone" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="接收方邮箱" prop="receiveMemberEmail">
            <el-input clearable v-model="queryParams.receiveMemberEmail" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item label="转账时间" prop="jointimeSelected">
          <el-date-picker
            v-model="jointimeSelected"
            type="daterange"
            value-format="timestamp"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="" style="border:none;">
            <el-button v-hasPermi="['whale:platform_transfer_record:page']" :loading="loading" type="primary" icon="el-icon-search" @click="search(1)">查询</el-button>
            <!-- <el-button @click="resetForm()">重置</el-button> -->
        </el-form-item>
        
      </el-form>
    </div>
    <div class="task-table">
      <!--table-->
      <el-table
      :data="tableData"
      v-loading="loading"
      style="width: 100%">
        <el-table-column prop="serialNumber" label="订单号" align="center" min-width="120"></el-table-column>
        <el-table-column prop="memberInviteCode" label="发起方邀请码" align="center" min-width="120"></el-table-column>
        <el-table-column prop="memberNickName" label="发起方昵称" align="center" min-width="120"></el-table-column>
        <el-table-column prop="memberPhone" label="发起方账号" align="center" min-width="130"> </el-table-column>
        <el-table-column prop="memberEmail" label="发起方邮箱" align="center" min-width="130"> </el-table-column>
        <el-table-column prop="coinName" label="币种" align="center" min-width="130"> </el-table-column>
        <el-table-column prop="actualAmount" label="交易金额" align="center" min-width="130"> </el-table-column>
        <el-table-column prop="serviceFee" label="手续费" align="center" min-width="130"> </el-table-column>
        <el-table-column prop="gasFeeDesc" label="Gas fee" align="center" min-width="130"> </el-table-column>
        <el-table-column prop="dedicateWorth" label="荣耀值" align="center" min-width="130"> </el-table-column>
        <el-table-column prop="transferAmount" label="实际到账" align="center" min-width="130"> </el-table-column>
        <el-table-column prop="receiveMemberInviteCode" label="接收方邀请码" align="center" min-width="130"> </el-table-column>
        <el-table-column prop="receiveMemberNickName" label="接收方昵称" align="center" min-width="130"> </el-table-column>
        <el-table-column prop="receiveMemberPhone" label="接收方账号" align="center" min-width="130"> </el-table-column>
        <el-table-column prop="receiveMemberEmail" label="接收方邮箱" align="center" min-width="130"> </el-table-column>
        <el-table-column prop="createTime" label="转账时间" align="center" min-width="130">
          <template slot-scope="{row}">
            {{row.createTime ? $dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center" min-width="130"> </el-table-column>

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
import { flashCashDetailsPage, exchangeSettingList, daiCoinSettingList, insideTransferLog } from "@/api/xhgjSpark_api/daiCoinSetting.js";
import {userAreaPhone} from '@/api/pointsMgmt/starTasks';
  export default {
    data () {
      return {
        loading: false,
        queryParams: {
          memberInviteCode: '',
          memberNickName: '',
          memberAreaCode: '',
          memberPhone: '',
          memberEmail: '',
          coinName: '',
          receiveMemberInviteCode: '',
          receiveMemberNickName: '',
          receiveMemberAreaCode: '',
          receiveMemberPhone: '',
          receiveMemberEmail: '',
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
        jointimeSelected: '',
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
        exchangeSettingList({}).then(response => {
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
          memberInviteCode: '',
          memberNickName: '',
          memberAreaCode: '',
          memberPhone: '',
          memberEmail: '',
          coinName: '',
          receiveMemberInviteCode: '',
          receiveMemberNickName: '',
          receiveMemberAreaCode: '',
          receiveMemberPhone: '',
          receiveMemberEmail: '',
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
        let datetime = []
        datetime = this.jointimeSelected
        let newParam = Object.assign({}, this.queryParams);
        delete newParam.types;
        let _params = {
          currentPage: this.pageIndex,
          pageSize: this.pageSize,
          endTime: datetime ? this.$dayjs(datetime[1]).format('YYYY-MM-DD') : '',
          startTime: datetime ? this.$dayjs(datetime[0]).format('YYYY-MM-DD') : '',
          ...newParam
        }
        this.loading = true
        insideTransferLog(_params).then(response => {
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

