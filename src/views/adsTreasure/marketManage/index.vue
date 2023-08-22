<template>
  <div class="userpower_Wrapper">
    <div class="topshow">
      <el-form :model="queryParams" ref="queryForm" :inline="true" class="mytopformstyle">
        <el-form-item label="发布编号" prop="code">
            <el-input clearable v-model="queryParams.code" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="邀请码" prop="inviteCode">
          <el-input clearable v-model="queryParams.inviteCode" placeholder="请输入"></el-input>
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
        <el-form-item label="名称" prop="name">
            <el-select v-model="queryParams.name" clearable placeholder="请选择">
              <el-option v-for="(its, index) in atNameListsResult" :key="index" :label="its.label" :value="its.value"></el-option>
            </el-select>
        </el-form-item>
          <el-form-item label="发布方向" prop="type">
            <el-select v-model="queryParams.type" clearable placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="卖单" :value="1"></el-option>
              <el-option label="买单" :value="2"></el-option>
            </el-select>
        </el-form-item>
          <el-form-item label="来源" prop="source">
            <el-select v-model="queryParams.source" clearable placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="自行兑换" :value="1"></el-option>
              <el-option label="市场购买" :value="2"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="发布时间" prop="jointimeSelected">
          <el-date-picker
            v-model="jointimeSelected"
            type="daterange"
            value-format="timestamp"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="兑换单号" prop="exchangeCode">
            <el-input clearable  maxlength="7" v-model="queryParams.exchangeCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="" style="border:none;">
            <el-button v-hasPermi="['advertising:market:page']" :loading="loading" type="primary" icon="el-icon-search" @click="search(1)">查询</el-button>
            <el-button :disabled="multipleSelection.length <= 0" :loading="downLoading" v-hasPermi="['advertising:market:batch_down']" @click="downClic('multi')">批量下架</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--table-->
    <el-table
    :data="tableData"
    @selection-change="handleSelectionChange"
    border
    v-loading="loading"
    class="userpowerbox"
    style="width: 100%">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
      <el-table-column
          prop="code"
          align="center"
          label="发布编号">
      </el-table-column>
      <el-table-column
          prop="exchangeCode"
          align="center"
          label="兑换单号">
      </el-table-column>
      <el-table-column
          align="center"
          prop="name"
          label="名称">
      </el-table-column>
      <el-table-column
          align="center"
          prop="image"
          label="图片">
          <template scope="scope">
            <div style="display: inline-block;height:80px;width:80px;" :style="`background: ${scope.row.backgroundColor}`">
              <img :src="scope.row.image" style="height:120%;width:120%;margin-top: -10%;margin-left: -10%;" />
            </div>
          </template>
      </el-table-column>
      <el-table-column
          prop="type"
          align="center"
          label="发布方向">
          <template scope="scope">
            <p v-if="+scope.row.type === 1">卖单</p>
            <p v-else-if="+scope.row.type === 2">买单</p>
          </template>
      </el-table-column>
      <el-table-column
          prop="num"
          align="center"
          maxlength="11"
          label="数量">
      </el-table-column>
      <el-table-column
          prop="price"
          align="center"
          maxlength="11"
          label="单价（USDT）">
      </el-table-column>
      <el-table-column
          prop="totalPrice"
          align="center"
          maxlength="11"
          label="总价（USDT）">
      </el-table-column>
      <el-table-column
          prop="serviceCharge"
          align="center"
          maxlength="11"
          label="服务费（Candy）">
      </el-table-column>
      <el-table-column
          prop="source"
          align="center"
          maxlength="11"
          label="来源">
          <template scope="scope">
            <p v-if="+scope.row.source === 1">自行兑换</p>
            <p v-else-if="+scope.row.source === 2">市场购买</p>
          </template>
      </el-table-column>
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
          prop="createTime"
          align="center"
          width="180"
          label="发布时间">
          <template slot-scope="{row}">
            {{row.createTime ? $dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
          </template>
      </el-table-column>
      <el-table-column
          align="center"
          maxlength="11"
          label="操作">
          <template scope="scope">
            <el-button :loading="downLoading" v-hasPermi="['advertising:market:batch_down']" @click="downClic('single', scope.row)">下架</el-button>
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
import { atNameLists, atMarketQuery, ggb_downBatchC } from "@/api/adsTreasure";
import {userAreaPhone} from '@/api/pointsMgmt/starTasks';
  export default {
    components: {},
    data () {
      return {
        loading: false,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        queryParams: {
          inviteCode: '',
          registeredType: null,
          areaCode: '',
          phone: '',
          email: '',
          code: '',
          realName: '',
          name: '',
          type: '',
          source: '',
          exchangeCode: '',
        },
        jointimeSelected: '',
        tableData: [],
        atNameListsResult: [],
        telPerfixArr: [],
        multipleSelection: [],
        downLoading: false,
      }
    },
    created () {
      this.atNameListsRun()
    },
    mounted () {
      this.search()
      this.getAreaCode();
    },
    methods: {
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      downClic (type, row) {
        this.$confirm(`确认要执行此操作吗？`, '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.downClicRunner(type, row)
        }).catch((e) => {
          console.log(e)
        })
      },
      downClicRunner (type, row) {
        let ids = []
        if (type == 'multi') {
          ids = this.multipleSelection.map(v => v.id)
        } else {
          ids = [row.id]
        }
        this.downLoading = true
        ggb_downBatchC({ids}).then((response) => {
          if (response.code == 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              'duration': 1000,
              onClose: () => {
                this.search()
              }
            })
          } else {
            this.$message.error(response.message)
          }
          this.downLoading = false
        }).catch(e => {
          this.downLoading = false
          console.log(e)
        })
      },
      getAreaCode() {
        userAreaPhone().then(response => {
          if (+response.code === 200) {
            this.telPerfixArr = response.data.list || [];
          }
        })
      },
      atNameListsRun () {
        atNameLists().then(response => {
          if (+response.code === 200) {
            this.atNameListsResult = response.data.list || []
          } else {
            this.atNameListsResult = []
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
      search (pgi) {
        this.$refs['queryForm'].validate((valid) => {
          if (valid) {
            if (pgi) this.pageIndex = pgi;
            if(
              (this.queryParams.phone && this.queryParams.registeredType && this.queryParams.areaCode) ||
              (this.queryParams.email && this.queryParams.registeredType) ||
              (!this.queryParams.phone && !this.queryParams.registeredType && !this.queryParams.areaCode) ||
              (!this.queryParams.email && !this.queryParams.registeredType)
            ) {

            }else{
              this.$message.error(`注册类型、${this.queryParams.registeredType == 1 ? '区号、' : ''}账号必须同时填写或不填`);
              return;
            }
            let datetime = []
            datetime = this.jointimeSelected
            let _params = {
              currentPage: this.pageIndex,
              endTime: datetime ? this.$dayjs(datetime[1]).format('YYYY-MM-DD') : '',
              pageSize: this.pageSize,
              startTime: datetime ? this.$dayjs(datetime[0]).format('YYYY-MM-DD') : '',
              ...this.queryParams
            }
            this.loading = true
            atMarketQuery(_params).then(response => {
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
 .userpower_Wrapper .auditCenter{
   width:calc(100% - 539px);
   padding-top: 20px;
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

