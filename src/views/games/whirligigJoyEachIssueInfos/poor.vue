<template>
  <div class="seeInfosEachissueBox">
    
    <h3>期数：{{$route.query.periodsNum}}奖池信息</h3>
    <el-table
      :data="tableDataName"
      style="width: 100%">
      
      <el-table-column
        prop="dateTime"
        label="开奖日期">
        <template slot-scope="{row}">
        {{row.dateTime ? $dayjs(row.dateTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
      </el-table-column>
      <el-table-column
        prop="winCode"
        label="中奖号码">
      </el-table-column>
      <el-table-column
        prop="localPool"
        label="本期奖池（Candy）">
      </el-table-column>
      <el-table-column
        prop="localSend"
        label="本期发放（Candy）">
      </el-table-column>
      <el-table-column
        prop="poolNext"
        label="累计至下一期（Candy）">
      </el-table-column>
      <el-table-column
        prop="tickCode"
        label="状态">
        <template scope="scope">
          <p>{{+scope.row.status === 0 ? '未开奖' : '已开奖'}}</p>
        </template>
      </el-table-column>
    </el-table>
    <h3>奖项概述</h3>
    <!-- <span>夺宝码：</span>
    <el-input
      style="width:300px;"
      placeholder="请输入夺宝码"
      v-model="inputSearch"
      clearable>
    </el-input>
     <el-button type="primary" size="small" @click="searchAll(1)" style="margin-left:10px;">查询</el-button> -->

    <el-table
      :data="tableDataLog"
      style="width: 100%;margin-top:20px;">
      
      <el-table-column
        prop="winningLevel"
        label="奖项">
        <template scope="scope">
          <p>{{scope.row.winningLevel}}等奖</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="rate"
        label="比例">
      </el-table-column>
      <el-table-column
        prop="winTotal"
        label="奖项总金额">
      </el-table-column>
      <el-table-column
        prop="winNum"
        label="中奖（奖码数量：注）">
      </el-table-column>
      <el-table-column
        prop="realWinNum"
        label="真实中奖（奖码数量：注）">
      </el-table-column>
      <el-table-column
        prop="prize"
        label="每注奖金（Candy）">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { takejewelCodeList, zzJoystatisticsSEEPoorList, zzJoystatisticsSEECodeList } from "@/api/games";
  export default {
    components: {},
    data () {
      return {
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        pageIndexAll: 1,
        pageSizeAll: 10,
        totalPageAll: 0,
        tableDataName: [],
        tableDataLog: [],
        inputSearch: ''
      }
    },
    mounted () {
      this.isAuth.isPermi(['game:lottery:poolManage']) && this.search(1)
    },
    watch: {},
    methods: {
      search (pgi) {
        if (pgi) this.pageIndex = pgi
        let _params = {
          periodsNum: this.$route.query.periodsNum, // 期数（必传）
        }
        this.loading = true
        zzJoystatisticsSEEPoorList(_params).then(response => {
          if (response.code === 200) {
            this.tableDataName = [response.data.poolInfo]
            this.tableDataLog = response.data.poolInfoLists
            this.totalPage = response.data.total
          } else {
            this.tableDataName = []
            this.tableDataLog = []
            this.totalPage = 0
            this.pageSize = 10
            this.$message.error(response.message)
          }
          this.loading = false
        }).catch(e => {
          this.loading = false
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.seeInfosEachissueBox{}
</style>

