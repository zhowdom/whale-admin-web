<template>
  <div class="redBackDetailsBox">
    <el-form :model="queryParams" :rules="rules" ref="queryForm" :inline="true">

      <el-form-item label="月份">
        <el-date-picker
          v-model="queryParams.yearMonth"
          type="month"
          placeholder="选择月">
        </el-date-picker>
    </el-form-item>

    
      <!-- <el-form-item label="真实姓名" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="输入真实姓名"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item> -->

    <el-form-item label="币种类型">
      <el-select v-model="queryParams.coinName" placeholder="请选择" clearable>
        <el-option v-for="(item, index) in daiCoinSettingArr" :label="item" :value="item" :key="index"></el-option>
      </el-select>
    </el-form-item>


      <el-form-item>
        <el-button v-hasPermi="['internal:platformFee:stat:sourcePage']" type="primary" :loading="loading" icon="el-icon-search" @click="search(1)">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
    :data="tableData"
    v-loading="loading"
    border
    style="width: 100%">
    <el-table-column
      prop="coinName"
      label="币种"
      align="center">
    </el-table-column>
    <el-table-column
      prop="fee"
      label="手续费"
      align="center">
    </el-table-column>
    <el-table-column
      prop="sourceTypeDesc"
      label="来源"
      align="center">
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
          yearMonth: new Date(),
          // userName: '',
          coinName: '',
          month: '',
          year: '',
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
            if (this.queryParams.yearMonth) {
              this.queryParams.year = this.$dayjs(this.queryParams.yearMonth).format('YYYY-MM').split('-')[0]
              this.queryParams.month = this.$dayjs(this.queryParams.yearMonth).format('YYYY-MM').split('-')[1]
            } else {
              this.$message.error('请选择日期')
              return false
            }
            let _params = {
              currentPage: this.pageIndex,
              pageSize: this.pageSize,
              ...this.queryParams,
            }
            this.loading = true
            mmfee_originQuery(_params).then(response => {
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
