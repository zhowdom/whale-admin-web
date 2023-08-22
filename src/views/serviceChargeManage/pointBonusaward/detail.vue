<template>
  <div class="redBackDetailsBox">
    <el-form :model="queryParams" :rules="rules" ref="queryForm" :inline="true">

      <el-form-item label="日期">
        <!-- <el-date-picker
          v-model="queryParams.yearMonth"
          type="date"
          placeholder="选择月">
        </el-date-picker> -->
        <el-date-picker
          v-model="queryParams.regtime"
          type="daterange" 
          value-format="yyyy-MM-dd" 
          range-separator="至" 
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>

    </el-form-item>

    <el-form-item label="币种类型">
      <el-select v-model="queryParams.coinName" placeholder="请选择" clearable>
        <el-option v-for="(item, index) in daiCoinSettingArr" :label="item" :value="item" :key="index"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="用户昵称" prop="nickName">
      <el-input
        v-model="queryParams.nickName"
        placeholder="请输入"
        clearable
        size="small"
        style="width: 240px"
      />
    </el-form-item>

    <el-form-item label="邀请码" prop="inviteCode">
        <el-input
          v-model="queryParams.inviteCode"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>

    <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入"
          clearable
          size="small"
          :maxlength="11"
          style="width: 240px"
        />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="queryParams.email"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>



      <el-form-item>
        <el-button v-hasPermi="['internal:feeBonus:share:log:page']" type="primary" :loading="loading" icon="el-icon-search" @click="search(1)">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
    :data="tableData"
    v-loading="loading"
    border
    style="width: 100%">
    <el-table-column
      prop="nickName"
      label="用户昵称"
      align="center">
    </el-table-column>
    <el-table-column
      prop="inviteCode"
      label="邀请码"
      align="center">
    </el-table-column>
    <el-table-column
      prop="phone"
      label="手机号"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      prop="email"
      label="邮箱"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      label="节点身份"
      align="center">
      <template scope="scope">
        <span>{{scope.row.levelDesc}}</span>
      </template>
    </el-table-column>
    <el-table-column
      width="159"
      label="分红币种"
      align="center">
      <template scope="scope">
        <span>{{scope.row.coinName}}</span>
      </template>
    </el-table-column>
    <el-table-column
      width="159"
      label="分红日期"
      align="center">
      <template scope="scope">
        <span>{{scope.row.bonusDate}}</span>
      </template>
    </el-table-column>
    <el-table-column
      width="159"
      label="分红数量"
      align="center">
      <template scope="scope">
        <span>{{scope.row.bonus}}</span>
      </template>
    </el-table-column>
    
    
  </el-table>
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
import { daiCoinSettingList } from "@/api/xhgjSpark_api/daiCoinSetting.js";
import { mmfee_monthQuery, mmfee_originQuery, mmfee_totalQuery, mmStartPoint_settingQuery, mmStartPoint_feeTypeQuery, mmStartPoint_profitQuery, mmStartPoint_profitDetail, mmStartPoint_add, mmStartPoint_alter } from "@/api/serviceCharge";
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
        rules: {
          phone: [
            { validator: validatePhone, trigger: 'blur' }
          ]
        },
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        queryParams: {
          // yearMonth: new Date(),
          regtime: '',
          bonusType: 1,
          coinName: '',
          month: '',
          year: '',
          nickName: '',
          inviteCode: '',
          phone: '',
          email: '',
        },
        tableData: [],
        loading: false,
        cloneRowData: {},
        daiCoinSettingArr: [], //代币列表
      }
    },
    filters: {
      valTransfer (val) {
        if (val === null || val === '') {
          return '-'
        } else {
          return `${((val * 100).toFixed(2) + '').replace(/(?:\.0*|(\.\d+?)0+)$/, '$1')}%`
        }
      }
    },
    created () {
      this.daiCoinSettingList();
    },
    mounted () {
      this.search(1)
    },
    watch: {},
    methods: {
      daiCoinSettingList() {
        daiCoinSettingList({}).then((response) => {
          if (response.code === 200) {
            this.daiCoinSettingArr = JSON.parse(JSON.stringify(response.data));
          } else {
            this.daiCoinSettingArr = [];
            this.$message.error(response.message);
          }
        });
      },
      search (pgi) {
        this.$refs['queryForm'].validate((valid) => {
          if (valid) {
            if (pgi) this.pageIndex = this.pageIndex
            // if (this.queryParams.yearMonth) {
            //   this.queryParams.year = this.$dayjs(this.queryParams.yearMonth).format('YYYY-MM').split('-')[0]
            //   this.queryParams.month = this.$dayjs(this.queryParams.yearMonth).format('YYYY-MM').split('-')[1]
            // } else {
            //   this.$message.error('请选择日期')
            //   return false
            // }
            let datetime = [];
            datetime = this.queryParams.regtime;
            let _params = {
              endTime: datetime ? datetime[1] : "",
              startTime: datetime ? datetime[0] : "",
              currentPage: this.pageIndex,
              pageSize: this.pageSize,
              ...this.queryParams,
            }
            this.loading = true
            mmStartPoint_profitDetail(_params).then(response => {
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
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.search()
      }
    }
  }
</script>

<style lang="scss">
.redBackDetailsBox{
  padding: 20px;
}
</style>
