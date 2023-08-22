<template>
  <div class="seeInfosEachissueBox">


    <el-form :model="nLevelqueryParams" :rules="nLevelrules" ref="nLevelqueryForm" :inline="true">
      <!-- <el-form-item label="用户ID" prop="memberId">
        <el-input
          v-model.trim="nLevelqueryParams.memberId"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 100px"
        />
      </el-form-item>
      <el-form-item label="真实姓名" prop="realName">
        <el-input
          v-model.trim="nLevelqueryParams.realName"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 100px"
        />
      </el-form-item>
      <el-form-item label="期数" prop="periodsNum">
        <el-input
          v-model.trim="nLevelqueryParams.periodsNum"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 150px"
        />
      </el-form-item> -->
      <el-form-item label="时间" prop="redbacktime">
        <el-date-picker
          v-model="nLevelqueryParams.redbacktime"
          type="daterange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button v-hasPermi="['game:lottery:pool:apportionPage']" type="primary" :loading="loading" icon="el-icon-search" @click="searchnLevel(1)">查询</el-button>
      </el-form-item>
    </el-form>
  <el-table :data="nLevelData">
    <el-table-column property="apportionNo" label="编号"></el-table-column>
    <el-table-column property="serviceApportion" label="手续费分红（Candy）"></el-table-column>
    <el-table-column property="ratio" label="奖池分红比例"></el-table-column>
    <el-table-column property="apportion" label="奖池分红（Candy）"></el-table-column>
    <el-table-column property="createTime" label="时间">
      <template slot-scope="{row}">
        {{row.createTime ? $dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    style="padding-top:20px;"
    @current-change="searchnLevel"
    :page-sizes="[10, 20, 30]"
    @size-change="handleSizeChangenLevel"
    :current-page.sync="pageIndexnLevel"
    :page-size="pageSizenLevel"
    layout="total, sizes, prev, pager, next, jumper"
    :total="totalPagenLevel">
    </el-pagination>



  </div>
</template>

<script>
import { takejewelCodeList, zzJoyPoorRedbackList } from "@/api/games";
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
        nLevelrules: {
          phone: [
            { validator: validatePhone, trigger: 'blur' }
          ]
        },
        nLevelqueryParams: {
          code: '',
          name: '',
          phone: '',
          memberId: '',
          realName: '',
          periodsNum: '',
          redbacktime: ''
        },
        nLevelPrizeTitle: '',
        pageIndexnLevel: 1,
        pageSizenLevel: 10,
        totalPagenLevel: 0,
        nLevelData: [],
        nLevelPrizesVisible: false,
        loading: false,
      }
    },
    mounted () {
      this.isAuth.isPermi(['game:lottery:pool:apportionPage']) && this.searchnLevel(1)
    },
    watch: {},
    methods: {
      nLevelPrizeInfosClick (row) {
        this.nLevelPrizesVisible = true
        this.nLevelPrizeTitle = '二等奖管理（期数：200902）'
      },
      searchnLevel (pgi) {
        this.$refs['nLevelqueryForm'].validate((valid) => {
          if (valid) {
            // todo...
            if (pgi) this.pageIndexnLevel = pgi

            let datetime = []
            datetime = this.nLevelqueryParams.redbacktime
            let _params = {
              endTime: datetime ? this.$dayjs(datetime[1]).format('YYYY-MM-DD') : '',
              startTime: datetime ? this.$dayjs(datetime[0]).format('YYYY-MM-DD') : '',
              currentPage: this.pageIndexnLevel,
              pageSize: this.pageSizenLevel,
            }
            this.loading = true
            zzJoyPoorRedbackList(_params).then(response => {
              if (response.code === 200) {
                this.nLevelData = response.data.list
                this.totalPagenLevel = response.data.total
                this.loading = false
              } else {
                this.nLevelData = []
                this.totalPagenLevel = 0
                this.pageSizenLevel = 10
                this.loading = false
                this.$message.error(response.message)
              }
            }).catch(e => {
              this.loading = false
            })
          }
        })
      },
      handleSizeChangenLevel (val) {
        this.pageSizenLevel = val
        this.pageIndexnLevel = 1
        this.isAuth.isPermi(['game:lottery:pool:apportionPage']) && this.searchnLevel()
      },
    }
  }
</script>

<style lang="scss" scoped>
.seeInfosEachissueBox{}
</style>

