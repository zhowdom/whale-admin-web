<template>
  <div class="redBackDetailsBox">
    <el-form :model="queryParams" :rules="rules" ref="queryForm" :inline="true">

  <el-form-item label="昵称" prop="nickName">
      <el-input
        v-model="queryParams.nickName"
        placeholder="请输入"
        clearable
        size="small"
        style="width: 240px"
      />
    </el-form-item>

    <el-form-item label="钱包地址">
      <el-input
        v-model="queryParams.walletAddress"
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
      prop="id"
      label="用户ID"
      align="center">
    </el-table-column>
    <el-table-column
      prop="walletAddress"
      label="钱包地址"
      align="center">
    </el-table-column>
    <el-table-column
      prop="nickName"
      label="用户名"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      prop="projectNum"
      label="项目"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      prop="seriesNum"
      label="系列"
      width="120"
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
import { nft_projectStaticlist} from "@/api/NFTMoudleManage";
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
          nickName: '',
          walletAddress: '',

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
    created () {},
    mounted () {
      this.search(1)
    },
    watch: {},
    methods: {
      search (pgi) {
        this.$refs['queryForm'].validate((valid) => {
          if (valid) {
            if (pgi) this.pageIndex = this.pageIndex
            let _params = {
              currentPage: this.pageIndex,
              pageSize: this.pageSize,
              ...this.queryParams,
            }
            this.loading = true
            nft_projectStaticlist(_params).then(response => {
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
