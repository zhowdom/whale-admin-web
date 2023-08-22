<template>
  <div class="redBackDetailsBox">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="昵称" prop="nickname">
        <el-input
          v-model="queryParams.nickname"
          placeholder="输入昵称"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="注册-区号" prop="areaCode">
        <el-select v-model="queryParams.areaCode" clearable placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(item, index) in telPerfixArr" :label="item.label" :value="item.value" :key="index"></el-option>
        </el-select>
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
      <el-form-item label="任务券名称" prop="taskName">
        <el-input
          v-model="queryParams.taskName"
          placeholder="输入任务券名称"
          clearable
          maxlength="11"
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button v-hasPermi="['integral:task:member:statistic:page']" type="primary" :loading="loading" icon="el-icon-search" @click="search(1)">查询</el-button>
        <el-button type="primary" :loading="reflashLoading" icon="el-icon-refresh" plain @click="reflash()">刷新</el-button>
      </el-form-item>
    </el-form>

    <el-table
    :data="tableData"
    @sort-change="sortChange"
    v-loading="loading"
    border
    style="width: 100%">
      <el-table-column
        prop="nickname"
        label="昵称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="areaCode"
        label="注册-区号"
        width="120"
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
        prop="taskName"
        label="任务券名称"
        width="120"
        align="center">
      </el-table-column>
      <el-table-column
        prop="receiveTotal"
        label="持有此任务券总数量"
        width="180"
        sortable="custom"
        align="center">
        <template slot-scope="{row}">
          <p v-hasPermi="['integral:task:member:page']" style="color:#1890ff;cursor:pointer;">
            <span @click="searchInner(row)">{{row.receiveTotal}}</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column
        prop="firstStartAt"
        width="180"
        label="首次启用任务券日期"
        align="center">
        <template slot-scope="{row}">
          {{row.firstStartAt ? $dayjs(row.firstStartAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="todoTotal"
        label="累计持有任务券数量"
        align="center">
      </el-table-column>
      <el-table-column
        prop="totalIncome"
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

    <!--Dialog details-->
    <el-dialog width="92%" title="持有任务券详情" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column property="taskName" label="任务券名称" width="130"></el-table-column>
        <el-table-column property="taskTypeSource" label="任务券来源" width="130"></el-table-column>
        <el-table-column prop="createAt" width="160" label="兑换时间" align="center">
          <template slot-scope="{row}">
            {{row.createAt ? $dayjs(row.createAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
          </template>
        </el-table-column>
        <el-table-column width="120" property="statusType" label="任务券状态">
          <template scope="scope">
            <p v-if="+scope.row.statusType === 1">进行中</p>
            <p v-if="+scope.row.statusType === 2">完成</p>
            <p v-if="+scope.row.statusType === 3">延期</p>
          </template>
        </el-table-column>
        <el-table-column width="130" property="needWhalePeas" label="兑换任务所需Candy"></el-table-column>
        <el-table-column width="130" property="income" label="总奖励Candy"></el-table-column>
        <el-table-column property="awardCondition" label="每天奖励Candy条件"></el-table-column>
        <el-table-column property="dayToDo" label="每天需要做任务次数">
          <template scope="scope">
              <p>{{scope.row.dayToDo}}次</p>
            </template>
        </el-table-column>
        <el-table-column width="130" property="incomePerDay" label="每天奖励Candy">
          <template scope="scope">
              <p>{{scope.row.incomePerDay}}个</p>
            </template>
        </el-table-column>
        <el-table-column property="completeCycleMin" label="可做任务总次数">
          <template scope="scope">
            <p>{{scope.row.completeCycleMin}}次</p>
          </template>
        </el-table-column>
        <el-table-column property="expireDayAfter" label="可做任务总天数">
          <template scope="scope">
            <p v-if="+scope.row.expireDayAfter === 0">无限制</p>
            <p v-else>{{scope.row.expireDayAfter}}天</p>
          </template>
        </el-table-column>
        <el-table-column width="130" property="activeWorth" label="赠送基础活跃值">
          <template scope="scope">
          <p>{{scope.row.activeWorth}}个</p>
        </template>
        </el-table-column>
        <el-table-column property="remainToDo" label="剩余任务总次数">
          <template scope="scope">
            <p>{{scope.row.remainToDo}}次</p>
          </template>
        </el-table-column>
        <el-table-column property="remainDay" label="剩余任务总天数">
          <template scope="scope">
            <p v-if="+scope.row.remainDay === -1">无限制</p>
            <p v-else>{{scope.row.remainDay}}天</p>
          </template>
        </el-table-column>

        <el-table-column width="160" label="已兑换/可兑换数量">
          <template scope="scope">
            <span>{{scope.row.quantity}}/{{scope.row.limitQuantity}}</span>
          </template>
        </el-table-column>
        <el-table-column property="completeCycle" label="已完成任务数">
          <template scope="scope">
            <p>{{scope.row.completeCycle}}次</p>
          </template>
        </el-table-column>
        <el-table-column width="130" property="incomeReceived" label="已领取Candy">
          <template scope="scope">
            <p>{{scope.row.incomeReceived}}个</p>
          </template>
        </el-table-column>
        <el-table-column width="160" property="expireAt" label="结束时间">
          <template slot-scope="{row}">
            <div v-if="row.expireAt">
              {{row.expireAt ? $dayjs(row.expireAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
            </div>
            <div v-else>
              无限制
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
      style="padding-top:20px;"
      @current-change="searchInner"
      :page-sizes="[10, 20, 30]"
      @size-change="handleSizeChangeInner"
      :current-page.sync="pageIndexInner"
      :page-size="pageSizeInner"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPageInner">
      </el-pagination>
    </el-dialog>
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
          prop="nickname"
          label="昵称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="areaCode"
          label="注册-区号"
          width="120"
          align="center">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号"
          width="120"
          align="center">
        </el-table-column>
        <el-table-column
          prop="taskName"
          label="任务券名称"
          width="120"
          align="center">
        </el-table-column>
        <el-table-column
          prop="receiveTotal"
          label="持有此任务券总数量"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="firstStartAt"
          width="180"
          label="首次启用任务券日期"
          align="center">
          <template slot-scope="{row}">
            {{row.firstStartAt ? $dayjs(row.firstStartAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="outputTime"
          width="220"
          label="产出Candy日期"
          align="center">
        </el-table-column>
        <el-table-column
          prop="todoTotal"
          label="此日期内任务券数量"
          align="center">
        </el-table-column>
        <el-table-column
          prop="totalIncome"
          label="此日期内产出Candy"
          align="center">
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { tcoList, tcoListStatistic, getSingleList, reflashData } from "@/api/om/white";
import {userAreaPhone} from '@/api/pointsMgmt/starTasks';
  export default {
    components: {},
    data () {
      return {
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        pageIndexInner: 1,
        pageSizeInner: 10,
        totalPageInner: 0,
        queryParams: {
          taskName: '',
          nickname: '',
          phone: '',
          email: '',
          areaCode: '',
          orderItems:[]
        },
        tableData: [],
        loading: false,
        dialogTableVisible: false,
        gridData: [],
        rangeData: [],
        rangeLoading: false,
        rangeParams: {
          redbacktime: [],
          memberId: '',
          taskInfoId: ''
        },
        rangeVisible: false,
        telPerfixArr: [],
        reflashLoading: false
      }
    },
    mounted () {
      // this.search();
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
              ...this.queryParams
            }
            this.loading = true
            tcoListStatistic(_params).then(response => {
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
      searchInner (row) {
        this.dialogTableVisible = true
        this.loadingInner = true
        let _params = {
          currentPage: this.pageIndexInner,
          pageSize: this.pageSizeInner,
          memberId: row.memberId,
          taskInfoId: row.taskInfoId
        }
        tcoList(_params).then(response => {
          if (response.code === 200) {
            this.gridData = response.data.list
            this.totalPageInner = response.data.total
            this.loadingInner = false
          } else {
            this.gridData = []
            this.totalPageInner = 0
            this.pageSizeInner = 10
            this.loadingInner = false
            this.$message.error(response.message)
          }
        })
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.search()
      },
      handleSizeChangeInner (val) {
        this.pageSizeInner = val
        this.pageIndexInner = 1
        this.searchInner()
      },
      handleSee(row) {
        this.rangeParams.memberId = row.memberId;
        this.rangeParams.taskInfoId = row.taskInfoId;
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
          memberId: this.rangeParams.memberId,
          taskInfoId: this.rangeParams.taskInfoId
        }
        this.rangeData = [];
        this.rangeLoading = true
        getSingleList(_params).then(response => {
          if (response.code === 200) {
            this.rangeData.push(response.data);
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
      reflash() {
        this.reflashLoading = true;
        reflashData().then(response => {
          if (response.code === 200) {
            this.$message.success('操作成功');
            this.reflashLoading = false;
          } else {
            this.reflashLoading = false;
            this.$message.error(response.message)
          }
        }).catch(err => {
          this.reflashLoading = false;
        })
      }
    }
  }
</script>

<style lang="scss">
.redBackDetailsBox{
  padding: 20px;
}
</style>
