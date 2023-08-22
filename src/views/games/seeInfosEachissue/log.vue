<template>
  <div class="seeInfosEachissueBox">
    
    <h3>期数：{{$route.query.periodsNum}}中奖名单</h3>
    <el-table
      :data="tableDataName"
      style="width: 100%">
      
      <el-table-column
        prop="memberId"
        label="用户DI">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="真实姓名">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="createAt"
        label="时间">
        <template slot-scope="{row}">
        {{row.createAt ? $dayjs(row.createAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
      </el-table-column>
      <el-table-column
        prop="tickCode"
        label="夺宝码">
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top:20px;"
      @current-change="search"
      :page-sizes="[10, 20, 30]"
      @size-change="handleSizeChange"
      :current-page.sync="pageIndex"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage">
    </el-pagination>
    <h3>期数：{{$route.query.periodsNum}}夺宝记录</h3>
    <span>夺宝码：</span>
    <el-input
      style="width:300px;"
      placeholder="请输入夺宝码"
      v-model="inputSearch"
      clearable>
    </el-input>
     <el-button type="primary" size="small" @click="searchAll(1)" style="margin-left:10px;">查询</el-button>

    <el-table
      :data="tableDataLog"
      style="width: 100%;margin-top:20px;">
      
      <el-table-column
        prop="memberId"
        label="用户DI">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="真实姓名">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="createAt"
        label="时间">
        <template slot-scope="{row}">
        {{row.createAt ? $dayjs(row.createAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
      </el-table-column>
      <el-table-column
        prop="tickCode"
        label="夺宝码">
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top:20px;"
      @current-change="searchAll"
      :page-sizes="[10, 20, 30]"
      @size-change="handleSizeChangeAll"
      :current-page.sync="pageIndexAll"
      :page-size="pageSizeAll"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPageAll">
    </el-pagination>
  </div>
</template>

<script>
import { takejewelCodeList } from "@/api/games";
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
      this.searchAll(1)
      this.search(1)
    },
    watch: {},
    methods: {
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.search()
      },
      handleSizeChangeAll (val) {
        this.pageSizeAll = val
        this.pageIndexAll = 1
        this.searchAll()
      },
      searchAll (pgi) {
        if (pgi) this.pageIndexAll = pgi
        let _params = {
          currentPage: this.pageIndexAll,
          pageSize: this.pageSizeAll,
          itemId: this.$route.query.id, // 夺宝商品id, 必须传
          memberId: '',
          serialId: '', // 夺宝订单id, 目前没有用到
          statusType: -1, // -1全部 0未中奖 1已中奖 2游戏结束-未达标 3游戏结束-下架
          tickCode: this.inputSearch
        }
        this.loading = true
        takejewelCodeList(_params).then(response => {
          if (response.code === 200) {
            this.tableDataLog = response.data.list
            this.totalPageAll = response.data.total

          } else {
            this.tableDataLog = []
            this.totalPageAll = 0
            this.pageSizeAll = 10
            this.$message.error(response.message)
          }
          this.loading = false
        }).catch(e => {
          this.loading = false
        })
      },
      search (pgi) {
        if (pgi) this.pageIndex = pgi
        let _params = {
          currentPage: this.pageIndex,
          pageSize: this.pageSize,
          itemId: this.$route.query.id, // 夺宝商品id, 必须传
          memberId: '',
          serialId: '', // 夺宝订单id, 目前没有用到
          statusType: 1, // -1全部 0未中奖 1已中奖 2游戏结束-未达标 3游戏结束-下架
          tickCode: ''
        }
        this.loading = true
        takejewelCodeList(_params).then(response => {
          if (response.code === 200) {
            this.tableDataName = response.data.list
            this.totalPage = response.data.total
          } else {
            this.tableDataName = []
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

