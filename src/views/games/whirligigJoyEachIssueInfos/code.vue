<template>
  <div class="seeInfosEachissueBox">
    
    
    <h3>期数：{{$route.query.periodsNum}}夺宝记录</h3>
    <span>真是姓名：</span>
    <el-input
      style="width:300px;margin-top:20px;margin-right:10px;"
      placeholder="请输入"
      v-model="nameSearch"
      clearable>
    </el-input>
    <span>手机号：</span>
    <el-input
      style="width:300px;margin-top:20px;margin-right:10px;"
      placeholder="请输入"
      v-model="phoneSearch"
      clearable>
    </el-input>
    <span>奖码：</span>
    <el-input
      style="width:300px;margin-top:20px;margin-right:10px;"
      placeholder="请输入"
      v-model="codeSearch"
      clearable>
    </el-input>
    <span>奖码来源：</span>
    <el-select v-model="originSelected" placeholder="请选择" clearable style="margin-top:20px;margin-right:10px;">
      <el-option label="邀请新用户" :value="0"></el-option>
      <el-option label="看视频" :value="1"></el-option>
      <el-option label="星级达人" :value="2"></el-option>
      <el-option label="Candy兑换" :value="3"></el-option>
      <el-option label="自营下单" :value="4"></el-option>
      <el-option label="签到" :value="5"></el-option>
      <el-option label="安慰赠送" :value="6"></el-option>
      <el-option label="失效奖码" :value="7"></el-option>
      <el-option label="机器人" :value="99"></el-option>
  </el-select>
  <span>中奖等级：</span>
    <el-select v-model="levelSelected" placeholder="请选择" clearable style="margin-top:20px;margin-right:10px;">
      <el-option label="全部" value=""></el-option>
      <el-option label="1等奖" :value="1"></el-option>
      <el-option label="2等奖" :value="2"></el-option>
      <el-option label="3等奖" :value="3"></el-option>
      <el-option label="4等奖" :value="4"></el-option>
      <el-option label="5等奖" :value="5"></el-option>
      <el-option label="6等奖" :value="6"></el-option>
      <el-option label="未中奖" :value="0"></el-option>
      <el-option label="已注销" :value="-1"></el-option>
  </el-select>
     <el-button :loading="whirligigJoyInfosLoading" v-hasPermi="['game:lottery:codeManage']" type="primary" size="small" icon="el-icon-search" @click="searchAll(1)" style="margin-left:20px;margin-right:10px;">查询</el-button>

    <el-table
      :data="tableDataLog"
      v-loading="whirligigJoyInfosLoading"
      style="width: 100%;margin-top:20px;">
      
      <el-table-column
        prop="memberId"
        label="用户DI">
      </el-table-column>
      <el-table-column
        prop="realName"
        label="真实姓名">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="tickCode"
        label="奖码">
      </el-table-column>
      <el-table-column
        prop="taskTypeDesc"
        label="奖码来源">
      </el-table-column>
       <!-- <el-table-column
        prop="taskType"
        label="奖码来源">
        <template scope="scope">
          <p v-if="+scope.row.taskType === 0">邀请新用户</p>
          <p v-else-if="+scope.row.taskType === 1">看视频</p>
          <p v-else-if="+scope.row.taskType === 2">星级达人</p>
          <p v-else-if="+scope.row.taskType === 3">Candy兑换</p>
          <p v-else-if="+scope.row.taskType === 4">自营下单</p>
          <p v-else-if="+scope.row.taskType === 5">签到</p>
          <p v-else-if="+scope.row.taskType === 6">安慰赠送</p>
          <p v-else-if="+scope.row.taskType === 7">失效奖码</p>
          <p v-else-if="+scope.row.taskType === 99">机器人</p>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="winningAt"
        label="奖码获取时间">
        <template slot-scope="{row}">
        {{row.winningAt ? $dayjs(row.winningAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
      </el-table-column>
      <el-table-column
        prop="winningLevel"
        label="中奖等级">
        <template slot-scope="{row}">
          <p v-if="+row.winningLevel > 0">{{row.winningLevel}}等奖</p>
          <p v-else-if="+row.winningLevel === 0">未中奖</p>
          <p v-else-if="+row.winningLevel === -1">已注销</p>
        </template>
      </el-table-column>
       <el-table-column
        prop="prize"
        label="奖金">
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
import { takejewelCodeList, zzJoystatisticsSEEPoorList, zzJoystatisticsSEECodeList } from "@/api/games";
  export default {
    components: {},
    data () {
      return {
        pageIndexAll: 1,
        pageSizeAll: 10,
        totalPageAll: 0,
        tableDataLog: [],
        nameSearch: '',
        phoneSearch: '',
        codeSearch: '',
        originSelected: '',
        levelSelected: '',
        originArr: [],
        levelArr: [],
        whirligigJoyInfosLoading: false
      }
    },
    mounted () {
      this.isAuth.isPermi(['game:lottery:codeManage']) && this.searchAll(1)
    },
    watch: {},
    methods: {
      
      handleSizeChangeAll (val) {
        this.pageSizeAll = val
        this.pageIndexAll = 1
        this.isAuth.isPermi(['game:lottery:codeManage']) && this.searchAll()
      },
      searchAll (pgi) {
        this.whirligigJoyInfosLoading = true
        if (pgi) this.pageIndexAll = pgi
        let _params = {
          periodsNum: this.$route.query.periodsNum, // 期数（必传）
          currentPage: this.pageIndexAll,
          pageSize: this.pageSizeAll,
          phone: this.phoneSearch,
          realName: this.nameSearch,
          tickCode: this.codeSearch,
          taskType: this.originSelected,
          winningLevel: this.levelSelected
        }
        this.loading = true
        zzJoystatisticsSEECodeList(_params).then(response => {
          if (response.code === 200) {
            this.tableDataLog = response.data.list
            this.totalPageAll = response.data.total

          } else {
            this.tableDataLog = []
            this.totalPageAll = 0
            this.pageSizeAll = 10
            this.$message.error(response.message)
          }
          this.whirligigJoyInfosLoading = false
          this.loading = false
        }).catch(e => {
          this.loading = false
          this.whirligigJoyInfosLoading = false
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.seeInfosEachissueBox{}
</style>

