<template>
  <div class="redBackDetailsBox">
    <div class="clearfix topperDataBox" v-hasPermi="['integral:task:statistic:page']" style="margin-bottom:30px;margin-top:10px;">
      <el-tag class="fl">所有券昨日产出的Candy（{{topperData.yesterdayTotalIncome}}）</el-tag>
      <el-tag class="fl" style="margin-left:30px;">当月所有券产出的Candy（{{topperData.monthTotalIncome}}）</el-tag>
    </div>
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="任务券名称" prop="taskName" class="copNms">
        <el-input
          v-model="queryParams.taskName"
          placeholder="输入任务券名称"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="任务券来源" prop="taskType">
        <el-select clearable v-model="queryParams.taskType" placeholder="请选择">
          <el-option label="全部" :value="-1"></el-option>
          <el-option
            v-for="item in levelTag"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-hasPermi="['integral:task:statistic:page']" type="primary" :loading="loading" icon="el-icon-search" @click="search(1)">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
    :data="tableData"
    @sort-change="sortChange"
    v-loading="loading"
    border
    style="width: 100%">
      <el-table-column
        prop="taskName"
        label="任务券名称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="limitDesc"
        label="此任务券数量"
        align="center">
      </el-table-column>
      <el-table-column
        prop="firstStartAt"
        label="任务券首次启用日期"
        sortable="custom"
        width="180"
        align="center">
        <template slot-scope="{row}">
          {{row.firstStartAt ? $dayjs(row.firstStartAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="taskTypeSource"
        width="159"
        label="任务券来源"
        align="center">
      </el-table-column>
      <el-table-column
        prop="totalMember"
        width="190"
        sortable="custom"
        label="累计持有人数"
        align="center">
      </el-table-column>
      <el-table-column
        prop="totalIncome"
        width="160"
        sortable="custom"
        label="累计产出Candy"
        align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template scope="scope">
          <el-button type="text" size="mini" @click="handleSee(scope.row)">查询范围</el-button>
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
    <!-- 范围查询 -->
    <el-dialog width="75%" :visible.sync="rangeVisible">
      <el-form :model="rangeParams" :inline="true">
        <el-form-item label="产出Candy日期时间段" prop="redbacktime">
          <el-date-picker
            v-model="rangeParams.redbacktime"
            type="daterange"
            value-format="timestamp"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="rangeLoading" icon="el-icon-search" @click="getSingleList()">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
      :data="rangeData"
      :loading="rangeLoading"
      border
      style="width: 100%">
        <el-table-column
          prop="taskName"
          label="任务券名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="limitDesc"
          label="此任务券数量"
          align="center">
        </el-table-column>
        <el-table-column
          prop="firstStartAt"
          label="任务券首次启用日期"
          width="180"
          align="center">
          <template slot-scope="{row}">
            {{row.firstStartAt ? $dayjs(row.firstStartAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="taskTypeSource"
          width="159"
          label="任务券来源"
          align="center">
        </el-table-column>
        <el-table-column
          prop="outputTime"
          label="产出Candy日期"
          width="200"
          align="center">
        </el-table-column>
        <el-table-column
          prop="totalMember"
          width="190"
          label="此日期内持有人数"
          align="center">
        </el-table-column>
        <el-table-column
          prop="totalIncome"
          width="160"
          label="此日期内产出Candy"
          align="center">
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { alltaskStatus, alltaskOrigin, alltaskList, getSingleTaskList } from "@/api/om/white";
  export default {
    components: {},
    data () {
      return {
        topperData: {
          monthTotalIncome: 0,
          yesterdayTotalIncome: 0
        },
        levelTag: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        queryParams: {
          taskName: '',
          taskType: -1,
          redbacktime: '',
          orderItems: []
        },
        tableData: [],
        loading: false,
        rangeData: [],
        rangeLoading: false,
        rangeParams: {
          redbacktime: [],
          id: '',
        },
        rangeVisible: false,
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
      this.isAuth.isPermi(['integral:task:statistic:page']) && alltaskStatus().then(response => {
        if (response.code === 200) {
          if (response.data) {
            this.topperData = response.data
          }
        } else {
          this.$message.error(response.message)
        }
      })
    },
    mounted () {
      this.search()
      alltaskOrigin().then(response => {
        if (response.code === 200) {
          if (response.data) {
            this.levelTag.length = 0
            for (let s in response.data) {
              this.levelTag.push({
                value: s,
                label: response.data[s]
              })
            }
          } else {
            this.levelTag = []
          }
        } else {
          this.levelTag = []
          this.$message.error(response.message)
        }
      })
    },
    watch: {},
    methods: {
      sortChange ({column, prop, order}) {
        this.queryParams.orderItems = [{ asc: order === 'ascending', column: prop.replace(/([A-Z])/g, '_$1').toLowerCase() }]
        this.search()
      },
      search (pgi) {
        this.$refs['queryForm'].validate((valid) => {
          if (valid) {
            if (pgi) this.pageIndex = pgi
            let _params = {
              currentPage: this.pageIndex,
              pageSize: this.pageSize,
              orderItems: this.queryParams.orderItems,
              taskName: this.queryParams.taskName,
              taskType: this.queryParams.taskType,
            }
            this.loading = true
            alltaskList(_params).then(response => {
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
            }).catch(e => {
              this.loading = false
            })
          }
        })
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.search()
      },
      handleSee(row) {
        this.rangeParams.id = row.id;
        this.getSingleList();
        this.rangeVisible = true;
      },
      getSingleList() {
        let datetime = []
        datetime = this.rangeParams.redbacktime.length > 0 ? this.rangeParams.redbacktime : false;
        let _params = {
          currentPage: this.pageIndex,
          pageSize: this.pageSize,
          startTime: datetime ? this.$dayjs(datetime[0]).format('YYYY-MM-DD') : '',
          endTime: datetime ? this.$dayjs(datetime[1]).format('YYYY-MM-DD') : '',
          id: this.rangeParams.id,
        }
        this.rangeData = [];
        this.rangeLoading = true
        getSingleTaskList(_params).then(response => {
          if (response.code === 200) {
            this.rangeData.push(response.data)
            this.rangeLoading = false;
          } else {
            this.rangeData = [];
            this.rangeLoading = false;
            this.$message.error(response.message)
          }
        }).catch(err => {
          this.rangeLoading = false;
        })
      },
    }
  }
</script>

<style lang="scss">
.redBackDetailsBox{
  padding: 20px;
}
.copNms .el-form-item__content,.copNms .el-input{
  width:159px!important;
}
.topperDataBox .el-tag{
  font-size: 14px;
}
</style>
