<template>
  <div class="userpower_Wrapper">
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
        <el-form-item label="转账平台" prop="platformName">
          <el-select v-model="queryParams.platformName" clearable placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, key, index) in transferList" :label="item" :value="key" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="代币" prop="coinName">
            <el-select v-model="queryParams.coinName" clearable placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(item, index) of daiCoinSettingList" :label="item" :value="item" :key="index"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="归集ID" prop="id">
          <el-input clearable v-model="queryParams.id" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="发起时间" prop="startTime">
          <el-date-picker
            v-model="queryParams.startTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="queryParams.endTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" clearable placeholder="请选择">
              <el-option label="全部" :value="-1"></el-option>
              <el-option label="进行中" :value="0"></el-option>
              <el-option label="成功" :value="1"></el-option>
              <el-option label="失败" :value="2"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="" style="border:none;">
            <el-button v-hasPermi="['advertising:user_oper:page']" :loading="loading" type="primary" icon="el-icon-search" @click="search(1)">查询</el-button>
            <el-button type="info" size="large" @click="goBackList">返回</el-button>
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
        <el-table-column prop="phone" label="账号" align="center" min-width="120">
          <template scope="scope">
            <p v-if="+scope.row.registeredType === 1">
              {{scope.row.account}}
            </p>
            <p v-else-if="+scope.row.registeredType === 2">
              {{scope.row.email}}
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="归集ID" align="center" min-width="120"></el-table-column>
        <el-table-column prop="transactionNetworkName" label="转账平台" align="center" min-width="120">
          <template slot-scope="{row}">
            {{transferList[row.platformName]}}
          </template>
        </el-table-column>
        <el-table-column prop="coinName" label="代币" align="center" min-width="120"></el-table-column>
        <el-table-column prop="amount" label="归集金额" align="center" min-width="120"></el-table-column>
        <el-table-column prop="createdAt" label="发起时间" align="center" min-width="160">
          <template slot-scope="{row}">
            {{row.createdAt ? $dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="结束时间" align="center" min-width="160">
          <template slot-scope="{row}">
            {{row.updatedAt ? $dayjs(row.updatedAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
          </template>
        </el-table-column>
        <el-table-column prop="progressStatus" label="状态" align="center" min-width="160">
          <template slot-scope="{row}">
            <span v-if="row.progressStatus == 0">进行中</span>
            <span v-else-if="row.progressStatus == 1">成功</span>
            <span v-else-if="row.progressStatus == 2">失败</span>
            <span v-else>--</span>
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
import { transferListPlatform, daiCoinSettingList, cashsweepConfigRecordPage } from "@/api/xhgjSpark_api/daiCoinSetting.js";
import {userAreaPhone} from '@/api/pointsMgmt/starTasks';
  export default {
    components: {},
    data () {
      return {
        loading: false,
        tableData: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        transferList: {},
        daiCoinSettingList: [],
        queryParams: {
          inviteCode: '',
          nickname: '',
          registeredType: 1,
          phone: '',
          coinName: '',
          areaCode: '',
          email: '',
          id: '',
          memberId: '',
          status: '',
          startTime: '',
          endTime: '',
          platformName: '',
        },
        rules: {
          
        },
        routePath: '',
        telPerfixArr: [],
      }
    },
    created () {
      
    },
    mounted () {
      this.queryParams.memberId = this.$route.query.memberId;
      this.queryParams.platformName = this.$route.query.platformName;
      this.queryParams.coinName = this.$route.query.coinName;
      this.queryParams.nickname = this.$route.query.nickname;
      this.queryParams.inviteCode = this.$route.query.inviteCode;
      this.routePath = this.$route.query.routePath;
      this.search();
      this.getTransferList();
      this.getDaiCoinSettingList();
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
      getTransferList() {
        transferListPlatform({}).then(response => {
          if (response.code === 200) {
            this.transferList = response.data
          } else {
            this.transferList = {}
            this.$message.error(response.message)
          }
        })
      },
      getDaiCoinSettingList() {
        daiCoinSettingList({}).then(response => {
          if (response.code === 200) {
            this.daiCoinSettingList = response.data
          } else {
            this.daiCoinSettingList = []
            this.$message.error(response.message)
          }
        })
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
        this.$refs['queryForm'].validate((valid) => {
          if (valid) {
            if (pgi) this.pageIndex = pgi;
            let _params = {
              currentPage: this.pageIndex,
              pageSize: this.pageSize,
              ...this.queryParams
            }
            this.loading = true
            cashsweepConfigRecordPage(_params).then(response => {
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
              this.loading = false
            })
          }
        })
      },
      // 返回
      goBackList () {
        const curView = this.$route;
        this.$store.dispatch('tagsView/delView', curView).then(() => {
          this.$nextTick(() => {
            // 返回列表页
            this.$router.replace({path: `${this.routePath}`});
          });
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
.userpower_Wrapper{
  padding: 20px;
}
</style>
