<template>
  <div class="redBackDetailsBox">
    <el-form :model="queryParams" ref="queryForm" :rules="rules" :inline="true">
      
      <el-form-item label="活跃值流水日期">
        <el-date-picker
          v-model="jointimeSelected"
          type="date"
          placeholder="选择活跃值流水日期"
          value-format="timestamp">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="活跃值类型">
        <el-select clearable v-model="queryParams.hyValueTypes" placeholder="请选择">
          <el-option
            label="全部"
            :value="-1">
          </el-option>
          <el-option
            v-for="item in hyValueTypesArr"
            :key="item.value"
            :label="item.msg"
            :value="item.type">
          </el-option>
        </el-select>
    </el-form-item>
     
      <el-form-item label="是否过期">
        <el-select clearable v-model="queryParams.selectedLevelTag" placeholder="请选择">
          <el-option
            label="全部"
            :value="-1">
          </el-option>
          <el-option
            label="未过期"
            :value="0">
          </el-option>
          <el-option
            label="已过期"
            :value="1">
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
      prop="createAt"
      sortable="custom"
      label="活跃值流水时间"
      align="center">
      <template slot-scope="{row}">
        {{row.createAt ? $dayjs(row.createAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
    </el-table-column>
    <el-table-column
      label="活跃值类型"
      align="center">
      <template scope="scope">
        <p>{{scope.row.activeType|valTransfer(curThis)}}</p>
      </template>
    </el-table-column>
    <el-table-column
      prop="remark"
      label="流水明细描述"
      align="center">
    </el-table-column>
    <el-table-column
      label="是否过期"
      align="center">
      <template scope="scope">
        <p v-if="scope.row.statusExpire">已过期</p>
        <p v-else>未过期</p>
      </template>
    </el-table-column>
    <el-table-column
      prop="activeWorth"
      label="明细数值"
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
import { hyList, queryStartTypes, hyTypes, hyDetails } from "@/api/pean/index";
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
        curThis: this,
        hyValueTypesArr: [],
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
      hyTypes().then(response => {
        if (response.code === 200) {
          this.hyValueTypesArr = (Object.entries(response.data)).map((val, index, arr) => {
            return {
              value: val[0],
              msg: val[1],
              type: val[0]
            }
          })
        } else {
          this.$message.error(response.message)
        }
      })
    },
    filters: {
      valTransfer (val, ctx) {
        let res = (ctx.hyValueTypesArr).find(item => +item.value === +val)
        if (res) {
          return res.msg
        } else {
          return '-'
        }
      }
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
            let datetime = []
            datetime = this.jointimeSelected
              let _params = {
                memberId: +this.$route.query.memberId,
                activeType: this.queryParams.hyValueTypes,
                createAt: datetime ? this.$dayjs(datetime).format('YYYY-MM-DD') : '',
                currentPage: this.pageIndex,
                pageSize: this.pageSize,
                sortCreateAtAsc: this.queryParams.orderItems.length > 0 ? this.queryParams.orderItems[0]['asc'] : false,
                statusExpire: this.queryParams.selectedLevelTag
              }
              this.loading = true
              hyDetails(_params).then(response => {
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
