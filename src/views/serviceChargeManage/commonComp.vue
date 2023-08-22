<template>
  <div class="redBackDetailsBox">
    
    <el-table
    :data="tableData"
    v-loading="loading"
    highlight-current-row
    @current-change="handleCurrentChange"
    border
    style="width: 100%">
    <el-table-column
      prop="validMonth"
      label="生效月份"
      align="center">
    </el-table-column>
    <el-table-column
      prop="feeTypesDesc"
      label="分红手续费来源"
      align="center">
    </el-table-column>
    <el-table-column
      prop="coinsDesc"
      label="分红手续费币种"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      :label="bonusType == 1 ? '节点分红总拔比' : '星级达人总拔比'"
      width="120"
      align="center">
      <template scope="scope">
        <span v-if="scope.row.totalRate">{{scope.row.totalRate * 100}}%</span>
      </template>
    </el-table-column>
    <el-table-column
      label="节点分红条件"
      width="140"
      align="center">
      <template scope="scope">
        <div v-if="scope.row.shareCondition && scope.row.shareCondition.conditionOn">
          <p>有条件 - 
            <span v-if="scope.row.shareCondition.taskHold">
              进行中糖果包 {{scope.row.shareCondition.taskHold || 0}} Candy;
            </span>
            <span v-if="scope.row.shareCondition.asteriskLevel">
              {{{
              "1":"一星达人",
              "2":"二星达人",
              "3":"三星达人",
              "4":"四星达人",
              "5":"五星达人",
              }[scope.row.shareCondition.asteriskLevel]}}
            </span>
          </p>
        </div>
        <span v-else>无条件</span>
      </template>
    </el-table-column>
    <el-table-column
      label="节点分红方式"
      width="120"
      align="center">
      <template scope="scope">
        <span>{{scope.row.shareType ==1?'独立分红':'平均分红'}}</span>
      </template>
    </el-table-column>
    <el-table-column
      :label="bonusType == 1 ? '一级节点分红比例' : '一星达人节点分红比例'"
      align="center">
      <template scope="scope">
        <span v-if="scope.row.shareType ==2"> --</span>
        <span v-else-if="scope.row.levelRates">{{scope.row.levelRates[0] * 100}}%</span>
      </template>
    </el-table-column>
    <el-table-column
      :label="bonusType == 1 ? '二级节点分红比例' : '二星达人节点分公比例'"
      align="center">
      <template scope="scope">
        <span v-if="scope.row.shareType ==2"> --</span>
        <span v-else-if="scope.row.levelRates">{{scope.row.levelRates[1] * 100}}%</span>
      </template>
    </el-table-column>
    <el-table-column
      :label="bonusType == 1 ? '三级节点分红比例' : '三星达人节点分红比例'"
      align="center">
      <template scope="scope">
        <span v-if="scope.row.shareType ==2"> --</span>
        <span v-else-if="scope.row.levelRates">{{scope.row.levelRates[2] * 100}}%</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="nodeShare"
      :label="bonusType == 1 ? '国际节点分红比例' : '四星达人节点分红比例'"
      align="center">
      <template scope="scope">
        <span v-if="scope.row.shareType ==2"> --</span>
        <span v-else-if="scope.row.levelRates">{{scope.row.levelRates[3] * 100}}%</span>
      </template>
    </el-table-column>
    <el-table-column
      v-if="bonusType == 2"
      prop="nodeShare"
      label="五星达人节点分红比例"
      align="center">
      <template scope="scope">
        <span v-if="scope.row.levelRates">{{scope.row.levelRates[4] * 100}}%</span>
      </template>
    </el-table-column>
  
    
  </el-table>
  <el-button type="primary" @click="saveRefs" style="margin-top:20px;" :loading="loadingRefs">确定</el-button>
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
import { mmStartPoint_settingQuery, mmStartPoint_feeTypeQuery} from "@/api/serviceCharge";
  export default {
    components: {},
    props: ['bonusType'],
    data () {
      return {
        loadingRefs: false,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        queryParams: {
          yearMonth: new Date(),
          // userName: '',
          coinName: '',
          month: '',
          year: '',
        },
        tableData: [],
        loading: false,
        currentRow: null,
        originFeeArr: [],
      }
    },
    filters: {},
    created () {
      this.mmStartPoint_feeTypeQueryRun()
    },
    mounted () {
      this.search(1)
    },
    watch: {},
    methods: {
      mmStartPoint_feeTypeQueryRun() {
        mmStartPoint_feeTypeQuery({}).then((response) => {
          if (response.code === 200) {
            this.originFeeArr = JSON.parse(JSON.stringify(response.data));
          } else {
            this.originFeeArr = [];
            this.$message.error(response.message);
          }
        });
      },
      saveRefs () {
        if (!this.currentRow) {
          this.$message.error('请选择引用配置')
          return false
        }
        this.loadingRefs = true
        setTimeout(() => {
          this.loadingRefs = false
          this.$emit('bridgeFn', this.currentRow)
        }, this.rnd(3, 9) * 100)
      },
      rnd (n, m) {
        return Math.floor(Math.random() * (m - n) + n)
      },
      handleCurrentChange(val) {
        this.currentRow = val;
      },
      complexYearMonthFormat (o) {
        if (o['yearMonth']) {
          o['year'] = this.$dayjs(o['yearMonth']).format('YYYY-MM').split('-')[0]
          o['month'] = this.$dayjs(o['yearMonth']).format('YYYY-MM').split('-')[1]
          return true
        } else {
          this.$message.error('请选择日期')
          return false
        }
      },
      search (pgi) {
        if (pgi) this.pageIndex = this.pageIndex
        if (!this.complexYearMonthFormat(this.queryParams)) return false
        let _params = {
          bonusType: this.bonusType,
          currentPage: this.pageIndex,
          pageSize: this.pageSize,
          ...this.queryParams,
        }
        this.loading = true
        _params.month = ''
        _params.year = ''
        mmStartPoint_settingQuery(_params).then(response => {
          if (response.code === 200) {
            this.tableData = (response.data.list || []).map((v, index) => {
              let {coins, feeTypes, ...a} = v
              let feeTypesDesc = []
              feeTypes.forEach(item => feeTypesDesc.push(this.originFeeArr.find(s => s.type==item)?.desc))
              return {
                coins,
                feeTypes,
                coinsDesc: coins.join(';'),
                feeTypesDesc: feeTypesDesc.join(';'),
                ...a
              }
            })
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
  margin-bottom: 20px;
}
</style>
