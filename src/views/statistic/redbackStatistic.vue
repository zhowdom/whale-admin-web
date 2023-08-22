<template>
  <div class="redBackDetailsBox">
    <el-form :model="queryParams" :rules="rules" ref="queryForm" :inline="true">
      <el-form-item label="真实姓名" prop="userName">
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
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="queryParams.email"
          placeholder="输入邮箱"
          clearable
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

    <el-form-item label="星级等级" prop="levelTag">

        <el-select clearable v-model="queryParams.selectedLevelTag" placeholder="请选择">
          <el-option
            v-for="item in levelTag"
            :key="item.value"
            :label="item.msg"
            :value="item.tag">
          </el-option>
        </el-select>

    </el-form-item>

    <el-form-item label="分红来源" prop="dividendType">
        <el-select clearable v-model="queryParams.dividendType" placeholder="请选择">
          <el-option
            label="全部"
            :value="-1">
          </el-option>
          <el-option
            v-for="item in fhTypesArray"
            :key="item.value"
            :label="item.msg"
            :value="item.value">
          </el-option>
        </el-select>
    </el-form-item>

      <el-form-item>
        <el-button v-hasPermi="['integral:dividend:log:page']" type="primary" :loading="loading" icon="el-icon-search" @click="search(1)">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
    :data="tableData"
    @sort-change="sortChange"
    v-loading="loading"
    border
    style="width: 100%">
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
      prop="email"
      label="邮箱"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      prop="currentAsteriskTag"
      label="星级等级"
      align="center">
    </el-table-column>
    <el-table-column
      prop="dividendType"
      width="159"
      label="分红来源"
      align="center">
      <template slot-scope="{row}">
        <div v-hasPermi="['integral:dividend:log:source:list']" @click="seeDetailsClick(row)" style="color:#61affe;cursor:pointer;text-decoration: underline;">
          <p v-if="row.dividendType === 1">星级分红</p>
          <p v-else-if="row.dividendType === 2">城市分红</p>
          <p v-else-if="row.dividendType === 3">市场部白名单分红</p>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      prop="dividendDateString"
      label="分红计算时间"
      sortable="custom"
      width="160"
      align="center">
      <template slot-scope="{row}">
        {{row.dividendDateString ? $dayjs(row.dividendDateString).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
    </el-table-column>
    
    <el-table-column
      prop="totalWhalePeas"
      width="159"
      sortable="custom"
      label="今日总共所分Candy"
      align="center">
    </el-table-column>
    
    <el-table-column
      prop="createAt"
      width="160"
      label="分红时间"
      align="center">
      <template slot-scope="{row}">
        {{row.createAt ? $dayjs(row.createAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
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

<!--Dialog details-->
<el-dialog title="分红详细情况" :visible.sync="dialogTableVisible">
  <p v-if="cloneRowData.dividendType === 1">分红来源：星级分红</p>
  <p v-else-if="cloneRowData.dividendType === 2">分红来源：城市分红</p>
  <p v-else-if="cloneRowData.dividendType === 3">分红来源：市场部白名单分红</p>
  <el-table :data="gridData">
    <el-table-column property="dividendLevel" label="分红级别" width="150"></el-table-column>
    <el-table-column property="totalWhalePeas" label="分红总Candy" width="200"></el-table-column>
    <el-table-column property="rate" label="分红比例">
      <template scope="scope">
        <p>{{scope.row.rate|valTransfer}}</p>
      </template>
    </el-table-column>
    <el-table-column property="dividendMemberTotal" label="参与分红人数"></el-table-column>
    <el-table-column property="whalePeas" label="所分Candy"></el-table-column>
  </el-table>
</el-dialog>


  </div>
</template>

<script>
import { fluidList, fluidListNEW, fluidListDialog, diviSourcesTyps, queryStartTypes } from "@/api/om/white";
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
        levelTag: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        queryParams: {
          userName: '',
          phone: '',
          email: '',
          redbacktime: '',
          selectedLevelTag: '',
          dividendType: -1,
          orderItems: []
        },
        fhTypesArray: [],
        tableData: [],
        loading: false,
        dialogTableVisible: false,
        gridData: [],
        cloneRowData: {}
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
      this.diviSourcesTypsRun()
    },
    mounted () {
      this.queryParams.phone = this.$route.query.phone || ''
      // this.search()
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
      seeDetailsClick (row) {
        this.cloneRowData = Object.assign({}, row)
        let _params = {
          currentPage: 1,
          dividendDateString: row.dividendDateString,
          memberId: row.memberId,
          pageSize: 10,
          dividendType: row.dividendType
        }
        fluidListDialog(_params).then(response => {
          this.dialogTableVisible = true
          if (response.code === 200) {
            this.gridData = response.data.list || []
          } else {
            this.$message.error(response.message)
          }
        })
      },
      diviSourcesTypsRun () {
        diviSourcesTyps().then(response => {
          if (response.code === 200) {
            let OriginalData = Object.assign({}, response.data || {})
            Object.keys(OriginalData).forEach(val => {
              this.fhTypesArray.push({
                msg: response.data[val],
                value: val
              })
            })
          } else {
            this.$message.error(response.message)
          }
        })
      },
      sortChange ({column, prop, order}) {
        this.queryParams.orderItems = [{ asc: order === 'ascending', column: prop.replace(/([A-Z])/g, '_$1').toLowerCase() }]
        this.search()
      },
      search (pgi) {
        this.$refs['queryForm'].validate((valid) => {
          if (valid) {
            if (pgi) this.pageIndex = pgi
            let datetime = []
            datetime = this.queryParams.redbacktime
            let _params = {
              currentPage: this.pageIndex,
              endTime: datetime ? this.$dayjs(datetime[1]).format('YYYY-MM-DD') : '',
              // levelTag: this.queryParams.selectedLevelTag,
              currentAsteriskTag: this.queryParams.selectedLevelTag,
              dividendType: this.queryParams.dividendType,
              orderItems: this.queryParams.orderItems,
              pageSize: this.pageSize,
              phone: this.queryParams.phone,
              email: this.queryParams.email,
              startTime: datetime ? this.$dayjs(datetime[0]).format('YYYY-MM-DD') : '',
              userName: this.queryParams.userName
            }
            this.loading = true
            fluidListNEW(_params).then(response => {
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
      // ...del
      dispatchClick () {
        this.$store.dispatch('setMs', {
          name: Math.random() + 1
        });
      },
      commitClick () {
        this.$store.commit('SET_MS', {
          name: Math.random() + 1
        });
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
