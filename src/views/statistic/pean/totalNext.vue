<template>
  <div class="redBackDetailsBox">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="真实姓名next" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="输入真实姓名"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="输入手机号"
          clearable
          maxlength="11"
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="分红时间" prop="redbacktime">
        <el-date-picker
          v-model="queryParams.redbacktime"
          type="daterange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="LV等级" prop="userName">
        <el-select clearable v-model="queryParams.lv" placeholder="请选择">
          <el-option
            v-for="item in optionsLV"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分红来源" prop="userName">
        <el-select clearable v-model="queryParams.lv" placeholder="请选择">
          <el-option
            v-for="item in optionsLV"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

    
      <el-form-item>
        <el-button v-hasPermi="['agora:white:dividend:log:page']" type="primary" :loading="loading" icon="el-icon-search" @click="search(1)">查询</el-button>
        <el-button v-hasPermi="['agora:white:dividend:log:page']" type="primary" :loading="loading" @click="toBack">返回</el-button>
      </el-form-item>
    </el-form>

    <el-table
    :data="tableData"
    @sort-change="sortChange"
    @selection-change="handleSelectionChange"
    v-loading="loading"
    border
    style="width: 100%">
    <el-table-column
      type="selection"
      :selectable="checkboxSelect"
      width="55">
    </el-table-column>
    <el-table-column
      prop="memberId"
      label="用户ID"
      align="center">
    </el-table-column>
    <el-table-column
      prop="userName"
      label="真实姓名"
      align="center">
    </el-table-column>
    <el-table-column
      prop="phone"
      label="手机号"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      prop="levelName"
      width="130"
      label="星级等级"
      align="center">
    </el-table-column>
    <el-table-column
      prop="dividendSource"
      sortable="custom"
      width="150"
      label="分红来源"
      align="center">
    </el-table-column>
    <el-table-column
      prop="createAt"
      sortable="custom"
      label="分红计算时间"
      width="100"
      align="center">
      <template slot-scope="{row}">
        {{row.createAt ? $dayjs(row.createAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
    </el-table-column>
    <el-table-column
      prop="percent"
      sortable="custom"
      width="170"
      label="分红比例"
      align="center">
    </el-table-column>
    <el-table-column
      prop="totalWhalePeas"
      width="120"
      sortable="custom"
      label="分红总Candy"
      align="center">
    </el-table-column>
    <el-table-column
      prop="totalDividendMember"
      width="150"
      sortable="custom"
      label="参与分红人数"
      align="center">
    </el-table-column>
    <el-table-column
      prop="whalePeas"
      width="120"
      sortable="custom"
      label="所分Candy"
      align="center">
    </el-table-column>
    <el-table-column
      prop="dateString"
      width="160"
      sortable="custom"
      label="分红时间"
      align="center">
      <template slot-scope="{row}">
        {{row.dateString ? $dayjs(row.dateString).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
    </el-table-column>
  </el-table>
  <div style="padding-top:18px;display:inline-block;">
    <el-button :disabled="multipleSelection.length <= 0" type="primary" :loading="loading" @click="enableClick()">批量启用</el-button>
    <el-button :disabled="multipleSelection.length <= 0" type="primary" :loading="loading" @click="disabledClick()">批量停用</el-button>
    <el-button :disabled="multipleSelection.length <= 0" type="primary" :loading="loading" @click="delectClick()">批量删除</el-button>
  </div>
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
import { fluidList, queryStartTypes } from "@/api/om/white";
  export default {
    components: {},
    data () {
      return {
        multipleSelection: [],
        levelTag: [],
        clickCount_1: 0,
        clickCount_2: 0,
        clickCount_3: 0,
        clickCount_4: 0,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        queryParams: {
          userName: '',
          phone: '',
          redbacktime: '',
          selectedLevelTag: '',
          orderItems: []
        },
        tableData: [],
        loading: false
      }
    },
    mounted () {
      this.queryParams.phone = this.$route.query.phone || ''
      this.search()
      queryStartTypes().then(response => {
        if (response.code === 200) {
          this.levelTag = response.data.list || []
        } else {
          this.$message.error(response.message)
        }
      })
    },
    watch: {},
    methods: {
      toBack () {
        this.$router.push('/statistics/totalPean')
      },
      handleSelectionChange (val) {
        this.totalWithdrawArr = []
        this.totalChargeArr = []
        this.totalAmountArr = []
        this.multipleSelection = val
        console.log(val, 'val')
      },
      sortChange ({column, prop, order}) {
        this.queryParams.orderItems = [{ asc: order === 'ascending', column: prop.replace(/([A-Z])/g, '_$1').toLowerCase() }]
        this.search()
      },
      search (pgi) {
        if (pgi) this.pageIndex = pgi
        let datetime = []
        datetime = this.queryParams.redbacktime
        let _params = {
          currentPage: this.pageIndex,
          endTime: datetime ? datetime[1] : '',
          inviteCode: '', // 原型上没有此过滤条件
          levelTag: this.queryParams.selectedLevelTag,
          orderItems: this.queryParams.orderItems,
          pageSize: this.pageSize,
          phone: this.queryParams.phone,
          startTime: datetime ? datetime[0] : '',
          userName: this.queryParams.userName
        }
        this.loading = true
        fluidList(_params).then(response => {
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
