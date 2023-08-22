<template>
  <div class="redBackDetailsBox">
    <el-form :model="queryParams" ref="queryForm" :rules="rules" :inline="true">
      
      <el-form-item label="注册时间">
        <el-date-picker
          v-model="jointimeSelected"
          type="date"
          placeholder="选择注册时间"
          value-format="timestamp">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="真实姓名" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="输入用户姓名"
          clearable
          maxlength="11"
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
          placeholder="输入手机号"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
       
       <el-form-item label="用户星级" prop="levelTag">

        <el-select clearable v-model="queryParams.selectedLevelTag" placeholder="请选择">
          <el-option
            label="全部"
            :value="-1">
          </el-option>
          <el-option
            v-for="item in levelTag"
            :key="item.value"
            :label="item.msg"
            :value="item.type">
          </el-option>
        </el-select>

    </el-form-item>

      <el-form-item>
        <el-button v-hasPermi="['active:statistic:page']" type="primary" :loading="loading" icon="el-icon-search" @click="search(1)">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
    :data="tableData"
    @sort-change="sortChange"
    v-loading="loading"
    border
    style="width: 100%">
    <el-table-column
      prop="createdAt"
      sortable="custom"
      width="160"
      label="用户注册时间"
      align="center">
      <template slot-scope="{row}">
        {{row.createdAt ? $dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
    </el-table-column>
    <el-table-column
      prop="userName"
      width="120"
      label="用户真实姓名"
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
      prop="currentAsterisk"
      label="用户星级"
      width="120"
      align="center">
      <template scope="scope">
        <!-- <p v-if="scope.row.currentAsterisk === 'VIP0'">暂无</p>
        <p v-else-if="scope.row.currentAsterisk === 'VIP1'">一星</p>
        <p v-else-if="scope.row.currentAsterisk === 'VIP2'">二星</p>
        <p v-else-if="scope.row.currentAsterisk === 'VIP3'">三星</p>
        <p v-else-if="scope.row.currentAsterisk === 'VIP4'">四星</p>
        <p v-else-if="scope.row.currentAsterisk === 'VIP5'">五星</p>
        <p v-else-if="scope.row.currentAsterisk === 'VIP6'">六星</p>
        <p v-else-if="scope.row.currentAsterisk === 'VIP7'">七星</p> -->
        <p>{{scope.row.currentAsterisk}}</p>
      </template>
    </el-table-column>
    <el-table-column
      prop="totalActive"
      sortable="custom"
      label="总基础活跃值"
      align="center">
    </el-table-column>
    <el-table-column
      prop="totalActivePromotion"
      sortable="custom"
      label="总推广活跃值"
      align="center">
    </el-table-column>
    <el-table-column
      prop="teamTotal"
      sortable="custom"
      label="团队人数"
      align="center">
    </el-table-column>
    <el-table-column
      prop="activeTeamWorth"
      sortable="custom"
      label="团队活跃值"
      align="center">
    </el-table-column>
    <el-table-column
      prop="activeUnionWorth"
      sortable="custom"
      label="联盟活跃值"
      align="center">
    </el-table-column>
    <el-table-column
      prop="activeTribeWorth"
      sortable="custom"
      label="部落活跃值"
      align="center">
    </el-table-column>

    <el-table-column
      header-align="center"
      align="center"
      min-width="300"
      label="操作">
      <template scope="scope">
        <el-button v-hasPermi="['active:worth:log:page']" type="primary" size="mini" @click="seeDetails(scope.row)">查看活跃值明细</el-button>
        <el-button v-hasPermi="['active:team:member:page']" type="primary" size="mini" @click="seeTeams(scope.row)">查看团队用户</el-button>
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
import { hyList, queryStartTypes } from "@/api/pean/index";
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
        levelTag: [],
        rules: {
          phone: [
            { validator: validatePhone, trigger: 'blur' }
          ]
        },
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        queryParams: {
          userName: '',
          phone: '',
          email: '',
          selectedLevelTag: -1,
          orderItems: []
        },
        tableData: [],
        loading: false,
        jointimeSelected: ''
      }
    },
    mounted () {
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
      sortChange ({column, prop, order}) {
        this.queryParams.orderItems = [{ asc: order === 'ascending', column: prop.replace(/([A-Z])/g, '_$1').toLowerCase() }]
        this.search()
      },
      seeDetails (row) {
        this.$router.push({ path: "/statistics/hyDetails", query: { memberId: row.memberId}})
      },
      seeTeams (row) {
        this.$router.push({ path: "/statistics/hyTeam", query: { recommendId: row.memberId}})
      },
      search (pgi) {
        this.$refs['queryForm'].validate((valid) => {
          if (valid) {
            if (pgi) this.pageIndex = pgi
            let datetime = []
            datetime = this.jointimeSelected
              let _params = {
                createAt: datetime ? this.$dayjs(datetime).format('YYYY-MM-DD') : '',
                currentAsteriskType: this.queryParams.selectedLevelTag === '' ? -1 : this.queryParams.selectedLevelTag,
                currentPage: this.pageIndex,
                orderItems: this.queryParams.orderItems,
                pageSize: this.pageSize,
                phone: this.queryParams.phone,
                email: this.queryParams.email,
                userName: this.queryParams.userName,
              }
              this.loading = true
              hyList(_params).then(response => {
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
              }).catch((e) => {
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
.redBackDetailsBox {
  & .cstmHeader {
    padding: 0;
    margin: 0;
  }
}
</style>
