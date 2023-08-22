<template>
  <div class="redBackDetailsBox">
    <el-form :model="queryParams" ref="queryForm" :rules="rules" :inline="true">
      
      
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

<el-form-item label="激活情况" prop="levelTag">
        <el-select clearable v-model="queryParams.jhInfos" placeholder="请选择">
          <el-option
            label="全部"
            :value="-1">
          </el-option>
          <el-option
            label="已激活"
            :value="1">
          </el-option>
          <el-option
            label="未激活"
            :value="0">
          </el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="当天任务完成情况" prop="levelTag">
        <el-select clearable v-model="queryParams.taskTodo" placeholder="请选择">
          <el-option
            label="全部"
            :value="-1">
          </el-option>
          <el-option
            label="已完成"
            :value="1">
          </el-option>
          <el-option
            label="未完成"
            :value="0">
          </el-option>
        </el-select>
    </el-form-item>
     <el-form-item label="用户帐号状态" prop="levelTag">
        <el-select clearable v-model="queryParams.userStatus" placeholder="请选择">
          <el-option
            label="全部"
            :value="-1">
          </el-option>
          <el-option
            label="正常"
            :value="1">
          </el-option>
          <el-option
            label="禁用"
            :value="2">
          </el-option>
          <el-option
            label="注销"
            :value="3">
          </el-option>
        </el-select>
    </el-form-item>
    

      <el-form-item>
        <el-button type="primary" :loading="loading" icon="el-icon-search" @click="search(1)">查询</el-button>
        <el-button type="primary" @click="reTurnBack">返回</el-button>
      </el-form-item>
    </el-form>

    <el-table
    :data="tableData"
    @sort-change="sortChange"
    v-loading="loading"
    border
    style="width: 100%">
    <el-table-column
      prop="userName"
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
      prop="inviterAt"
      width="120"
      sortable="custom"
      label="邀请时间"
      align="center">
      <template slot-scope="{row}">
        {{row.inviterAt ? $dayjs(row.inviterAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
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
      prop="inviteCode"
      label="邀请码"
      align="center">
    </el-table-column>
    <el-table-column
      prop="wechat"
      label="微信号"
      align="center">
    </el-table-column>
    <el-table-column
      prop="activeWorth"
      sortable="custom"
      label="基础活跃值"
      align="center">
    </el-table-column>
    <el-table-column
      prop="activeTeamWorth"
      sortable="custom"
      label="团队总活跃值"
      align="center">
    </el-table-column>
    <el-table-column
      prop="activateType"
      label="激活情况"
      align="center">
      <template scope="scope">
        <p v-if="+scope.row.activateType === 0">未激活</p>
        <p v-else-if="+scope.row.activateType === 1">已激活</p>
      </template>
    </el-table-column>
    <el-table-column
      prop="taskToDoType"
      label="当天任务完成情况"
      align="center">
      <template scope="scope">
        <p v-if="+scope.row.taskToDoType === 0">未完成</p>
        <p v-else-if="+scope.row.taskToDoType === 1">已完成</p>
      </template>
    </el-table-column>
<el-table-column
      prop="status"
      label="用户帐号状态"
      align="center">
      <template scope="scope">
        <p v-if="+scope.row.status === 1">正常</p>
        <p v-else-if="+scope.row.status === 2">禁用</p>
        <p v-else-if="+scope.row.status === 3">注销</p>
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
import { hyList, queryStartTypes, hyTeams } from "@/api/pean/index";
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
          jhInfos: '',
          userStatus: '',
          taskTodo: '',
          selectedLevelTag: -1,
          orderItems: []
        },
        tableData: [],
        loading: false,
        jointimeSelected: ''
      }
    },
    mounted () {
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
      reTurnBack () {
        this.$router.push('/statistics/hyStatistics')
      },
      seeDetails (row) {
        // 跳转到Candy总统计->每一列对应子页面(原型暂未提供...)
        // this.$router.push('/statistics/totalNextPean')
      },
      sortChange ({column, prop, order}) {
        this.queryParams.orderItems = [{ asc: order === 'ascending', column: prop.replace(/([A-Z])/g, '_$1').toLowerCase() }]
        this.search()
      },
      seeDetails () {},
      seeTeams () {},
      search (pgi) {
        this.$refs['queryForm'].validate((valid) => {
          if (valid) {
            if (pgi) this.pageIndex = pgi
              let _params = {
                activateType: this.queryParams.jhInfos,
                currentAsteriskType: this.queryParams.selectedLevelTag === '' ? -1 : this.queryParams.selectedLevelTag,
                currentPage: this.pageIndex,
                orderItems: this.queryParams.orderItems,
                pageSize: this.pageSize,
                phone: this.queryParams.phone,
                recommendId: +this.$route.query.recommendId,
                status: this.queryParams.userStatus,
                taskToDoType: this.queryParams.taskTodo,
                userName: this.queryParams.userName
              }
              this.loading = true
              hyTeams(_params).then(response => {
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
