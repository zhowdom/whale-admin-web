<template>
  <div class="jdtDetailBox">
    <ul class="tofuJdt clearfix">
      <li>
        <p>总锁仓</p>
        <h3>{{reMap.totalLock || 0}}</h3>
      </li>
      <li>
        <p>总可用（包含生息）</p>
        <h3>{{reMap.totalAvailable || 0}}</h3>
      </li>
      <li>
        <p>总生息</p>
        <h3>{{reMap.totalInterest || 0}}</h3>
      </li>
    </ul>
    <el-form :model="queryParams" :rules="rules" ref="queryForm" :inline="true">
      <el-form-item label="邀请码" prop="inviteCode">
        <el-input
          v-model.trim="queryParams.inviteCode"
          placeholder="请输入"
          maxlength="7"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>

      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model.trim="queryParams.phone"
          maxlength="11"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>

      <el-form-item label="来源" prop="sourceType">
        <el-select v-model="queryParams.sourceType" clearable placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="盲盒赠送" :value="1"></el-option>
          <el-option label="锁仓释放" :value="2"></el-option>
          <el-option label="持币生息" :value="3"></el-option>
        </el-select>
    </el-form-item>
      
      <el-form-item label="昵称">
        <el-input
          v-model.trim="queryParams.nickName"
          placeholder="请输入"
          clearable
          maxlength="11"
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="时间" prop="regtime">
        <el-date-picker
          v-model="queryParams.regtime"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" :loading="loading" icon="el-icon-search" @click="search(1)">查询</el-button>
        <!-- <el-button v-show="false" type="primary" :loading="loading" icon="el-icon-download" @click="export2Excel.currentPage(ctx, 'add')">导出</el-button> -->
      </el-form-item>
    </el-form>


    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="序号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="inviteCode"
        label="邀请码"
        width="180">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="账号">
      </el-table-column>
      <el-table-column
        prop="nickName"
        label="昵称">
      </el-table-column>
      <el-table-column
        prop="sourceType"
        label="来源">
        <template scope="scope">
          <div v-if='scope.row.sourceType === 1'>盲盒赠送</div>
          <div v-else-if='scope.row.sourceType === 2'>锁仓释放</div>
          <div v-else-if='scope.row.sourceType === 3'>持币生息</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="jdtValue"
        label="数量">
      </el-table-column>
      <el-table-column
        prop="createdAt"
        label="时间">
        <template slot-scope="{row}">
          {{row.createdAt ? $dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top:10px;"
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
import { jdtDetailList, jdtDetailToufu, jdtSetMdf, jdtSetAdd, jdtSetList, jdtSetInfo } from "@/api/lockWarehouse";
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
        reMap: {},
        rules: {
          phone: [
            { validator: validatePhone, trigger: 'blur' }
          ]
        },
        loading: false,
        queryParams: {
          inviteCode: '',
          phone: '',
          sourceType: '',
          nickName: '',
          regtime: []
        },
        pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
        tableData: []
      }
    },
    created () {
      jdtDetailToufu().then(response => {
        if (+response.code === 200) {
          this.reMap = {
            totalAvailable: response.data ?. totalAvailable ?? 0,
            totalInterest: response.data ?. totalInterest ?? 0,
            totalLock: response.data ?. totalLock ?? 0,
          }
        } else {
          this.$message.error(response.message)
        }
      })
    },
    mounted () {
      this.search(1)
    },
    watch: {},
    methods: {
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
            datetime = this.queryParams.regtime
            let _params = {
              transType: 2,
              createdEndAt: datetime ? datetime[1] : '',
              createdStartAt: datetime ? datetime[0] : '',
              pageSize: this.pageSize,
              currentPage: this.pageIndex,
              ...this.queryParams
            }
            this.loading = true
            jdtDetailList(_params).then(response => {
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
            })
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
.tofuJdt{
  li{
    width:200px;
    height:100px;
    border-radius: 10px;
    text-align: center;
    border: 1px solid #eaeefb;
    float: left;
    margin-right: 20px;
  }
}
</style>

