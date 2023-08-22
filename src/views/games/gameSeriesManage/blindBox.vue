<template>
  <div class="seeInfosEachissueBox" style="padding:20px;">


    <el-form :model="nLevelqueryParams" :rules="nLevelrules" ref="nLevelqueryForm" :inline="true">
      <el-form-item label="当前期编号" prop="currentPeriodNo">
        <el-input
          v-model.trim="nLevelqueryParams.currentPeriodNo"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item label="盲盒编号" prop="code">
        <el-input
          v-model.trim="nLevelqueryParams.code"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item label="盲盒系列" prop="name">
        <el-input
          v-model.trim="nLevelqueryParams.name"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item label="盲盒描述" prop="describe">
        <el-input
          v-model.trim="nLevelqueryParams.describe"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 150px"
        />
      </el-form-item>
      <!-- <el-form-item label="时间" prop="redbacktime">
        <el-date-picker
          v-model="nLevelqueryParams.redbacktime"
          type="daterange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item> -->
       <el-form-item label="下一期公示方式">
        <el-select v-model="nLevelqueryParams.nextPublicityType" clearable placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="自动开放" :value="1"></el-option>
          <el-option label="手动开放" :value="2"></el-option>
        </el-select>
    </el-form-item>
       
       <el-form-item label="当前期状态">
        <el-select v-model="nLevelqueryParams.status" clearable placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="进行中" :value="2"></el-option>
          <el-option label="抢购失败" :value="3"></el-option>
          <el-option label="已结束(未达标)" :value="4"></el-option>
          <el-option label="已结束(已达标)" :value="5"></el-option>
        </el-select>
    </el-form-item>
       <el-form-item label="下一期状态">
        <el-select v-model="nLevelqueryParams.nextPublicityStatus" clearable placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="待开放" :value="2"></el-option>
          <el-option label="已开放" :value="1"></el-option>
        </el-select>
    </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="nLevelqueryParams.blindBoxType" clearable placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="魔力盲盒专场" :value="1"></el-option>
          <el-option label="Candy销毁专场" :value="2"></el-option>
          <el-option label="魔力小盲盒" :value="3"></el-option>
        </el-select>
    </el-form-item>

      <el-form-item>
        <el-button v-hasPermi="['blindBox:product_series:page']" type="primary" :loading="loading" icon="el-icon-search" @click="searchnLevel(1)">查询</el-button>
      </el-form-item>
    </el-form>
  <el-table :data="nLevelData" border>
    <el-table-column property="id" label="序号"></el-table-column>
    <el-table-column property="blindBoxType" label="类型">
        <template scope="scope">
          <p v-if="+scope.row.blindBoxType === 1">魔力盲盒专场</p>
          <p v-else-if="+scope.row.blindBoxType === 2">Candy销毁专场</p>
          <p v-else-if="+scope.row.blindBoxType === 3">魔力小盲盒</p>
        </template>
      </el-table-column>
    <el-table-column property="currentPeriodNo" label="当前期编号"></el-table-column>
    <el-table-column property="code" label="盲盒编号"></el-table-column>
    <el-table-column property="name" label="盲盒系列"></el-table-column>
    <el-table-column property="primaryImage" label="盲盒主物">
      <template scope="scope">
        <img :src="scope.row.primaryImage" style="width:80px;height:80px;">
      </template>
    </el-table-column>
    <el-table-column property="describe" label="盲盒描述"></el-table-column>
    <el-table-column property="periodNum" label="期数"></el-table-column>
    <el-table-column property="totalNum" label="总份数"></el-table-column>
    <el-table-column property="amount" label="每份最小单位（USDT）"></el-table-column>
    <el-table-column property="integral" label="每份最小单位（Candy）"></el-table-column>
    <!-- <el-table-column property="singleCost" label="每份预估成本（USDT）"></el-table-column> -->
    <!-- <el-table-column property="jfdk" label="Candy抵扣"></el-table-column> -->
    <el-table-column property="minBuyNum" label="最小抢购份额"></el-table-column>
    <el-table-column property="maxBuyNum" label="最大抢购份额"></el-table-column>
    <el-table-column property="reborn" label="轮回期"></el-table-column>
    <el-table-column property="startTime" label="开始时间">
      <template slot-scope="{row}">
        {{row.startTime ? $dayjs(row.startTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
    </el-table-column>
    <el-table-column property="endTime" label="固定结束时间">
      <template slot-scope="{row}">
        {{row.endTime ? $dayjs(row.endTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
    </el-table-column>
    <el-table-column property="nextGrowthRate" label="总份额增长比列">
      <template scope="scope">
        <p v-if="scope.row.nextGrowthRate !== null || scope.row.nextGrowthRate !== ''">{{scope.row.nextGrowthRate}}%</p>
        <p v-else>-</p>
      </template>
    </el-table-column>
    <el-table-column property="nextPublicityType" label="下一期开放方式">
      <template scope="scope">
        <p v-if="+scope.row.nextPublicityType === 1">自动开放</p>
        <p v-else-if="+scope.row.nextPublicityType === 2">手动开放</p>
        <p v-else>-</p>
      </template>
    </el-table-column>

    <el-table-column property="status" label="当前期状态">
      <template scope="scope">
        <p v-if="+scope.row.status === 2">进行中</p>
        <p v-else-if="+scope.row.status === 3">抢购失败</p>
        <p v-else-if="+scope.row.status === 4">已结束(未达标)</p>
        <p v-else-if="+scope.row.status === 5">已结束(已达标)</p>
        <p v-else>-</p>
      </template>
    </el-table-column>
    <el-table-column property="nextPublicityStatus" label="下一期状态">
      <template scope="scope">
        <div v-if="+scope.row.status !== 3">
          <p v-if="+scope.row.nextPublicityStatus === 1">已开放</p>
          <p v-else-if="+scope.row.nextPublicityStatus === 2">待开放</p>
          <p v-else>-</p>
        </div>
        <div v-else>-</div>
      </template>
    </el-table-column>
    <el-table-column property="whalePeas" label="操作" width="200px">
      <template scope="scope">
        <el-button @click="jumpToEachissuePage(scope.row)" type="text">查看</el-button>
        <el-button v-hasPermi="['blindBox:product_series:open']" v-if="+scope.row.blindBoxType !== 3 && +scope.row.status === 4 && +scope.row.nextPublicityStatus === 2 && +scope.row.nextPublicityType === 2" type="text" @click="blindBoxOpenClick(scope.row)">公示</el-button>
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

    <!--通用型Dialog-s-->
    <el-dialog title="" :visible.sync="cmbTableVisible">
      <el-form :model="nLevelqueryParams" :rules="nLevelrules" ref="nLevelqueryForm" :inline="true">
        <el-form-item label="子订单号" prop="memberId">
          <el-input
            v-model.trim="nLevelqueryParams.memberId"
            placeholder="请输入"
            clearable
            size="small"
            style="width: 100px"
          />
        </el-form-item>
        <el-form-item label="货号" prop="realName">
          <el-input
            v-model.trim="nLevelqueryParams.realName"
            placeholder="请输入"
            clearable
            size="small"
            style="width: 100px"
          />
        </el-form-item>
        <el-form-item label="实物名称">
          <el-select v-model="nLevelqueryParams.status" clearable placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="手机" :value="1"></el-option>
            <el-option label="充电线" :value="2"></el-option>
          </el-select>
      </el-form-item>

        <el-form-item>
          <el-button v-hasPermi="['game:lottery:pool:getByPage']" type="primary" :loading="loading" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="cmbTableData">
        <el-table-column property="date" label="序号" width="150"></el-table-column>
        <el-table-column property="orderItemNo" label="子订单号" width="150"></el-table-column>
        <el-table-column property="name" label="货号" width="200"></el-table-column>
        <el-table-column property="address" label="实物名称"></el-table-column>
        <el-table-column property="address" label="图片"></el-table-column>
        <el-table-column property="address" label="成本价（USDT）"></el-table-column>
        <el-table-column property="itemNum" label="数量"></el-table-column>
      </el-table>
      <el-pagination
        style="margin-top:10px;"
        @current-change="cmbTableSearch"
        :page-sizes="[10, 20, 30]"
        @size-change="cmbTablehandleSizeChange"
        :current-page.sync="cmbTablepageIndex"
        :page-size="cmbTablepageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="cmbTabletotalPage">
      </el-pagination>
    </el-dialog>
  <!--通用型Dialog-d-->

  <!--公示时间弹窗-->
  <el-dialog title="" :visible.sync="dialogFormVisibleOpen" width="30%">
    <p>确认要将此系列盲盒开放?</p>
    <el-form :model="formOpen">
      <el-form-item label="开始时间" label-width="200">
        <el-date-picker
          v-model="formOpen.startTime"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisibleOpen = false">取 消</el-button>
      <el-button :disabled="!formOpen.startTime" type="primary" @click="blindBoxOpenClickRun">确 定</el-button>
    </div>
  </el-dialog>



  </div>
</template>

<script>
import { blindBoxSeriesOpen, blindBoxSeriesPage, takejewelCodeList, zzJoyPoorTotalSwitchList } from "@/api/games";
import { whalePeanSetQueryList } from "@/api/presents";
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
        // 盲盒通用table-s
        cmbTableVisible: false,
        cmbTableData: [
          {
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }
        ],
        cmbTablepageIndex: 1,
        cmbTablepageSize: 10,
        cmbTabletotalPage: 0,
        // 盲盒通用table-d
        nLevelrules: {
          phone: [
            { validator: validatePhone, trigger: 'blur' }
          ]
        },
        nLevelqueryParams: {
          code: '',
          currentPeriodNo: '',
          describe: '',
          name: '',
          nextPublicityStatus: '',
          nextPublicityType: '',
          status: '',
          redbacktime: '',
          blindBoxType: ''
        },
        nLevelPrizeTitle: '',
        pageIndexnLevel: 1,
        pageSizenLevel: 10,
        totalPagenLevel: 0,
        nLevelData: [],
        nLevelPrizesVisible: false,
        loading: false,
        dialogFormVisibleOpen: false,
        formOpen: {
          startTime: ''
        },
        curClickRowId: '',
        discoMoneyArray: [],
      }
    },
    created () {
      this.whalePeanSetQueryListRun()
    },
    mounted () {
      this.isAuth.isPermi(['game:lottery:pool:getByPage']) && this.searchnLevel(1)
    },
    watch: {},
    methods: {
      // 盲盒通用table-s
      cmbTableSearch () {},
      cmbTablehandleSizeChange (val) {
        this.cmbTablepageSize = val
        this.cmbTablepageIndex = 1
        this.cmbTableSearch()
      },
      // 盲盒通用table-d
      bugFirstClick () {
        this.cmbTableVisible = true
      },
      nLevelPrizeInfosClick (row) {
        this.nLevelPrizesVisible = true
        this.nLevelPrizeTitle = '二等奖管理（期数：200902）'
      },
      whalePeanSetQueryListRun () {
        whalePeanSetQueryList().then(response => {
          if (response.code === 200) {
            this.discoMoneyArray = (response.data.list || []).map(val => {
              let {deductionWorth, id, whalePeas} = val
              return {
                value: id,
                label: deductionWorth + 'USDT',
                whalePeas
              }
            })
          } else {
            this.discoMoneyArray = []
            this.$message.error(response.message)
          }
        })
      },
      searchnLevel (pgi) {
        this.$refs['nLevelqueryForm'].validate((valid) => {
          if (valid) {
            // todo...
            if (pgi) this.pageIndexnLevel = pgi

            let datetime = []
            datetime = this.nLevelqueryParams.redbacktime
            let _params = {
              code: this.nLevelqueryParams.code,
              currentPage: this.pageIndexnLevel,
              currentPeriodNo: this.nLevelqueryParams.currentPeriodNo,
              describe: this.nLevelqueryParams.describe,
              name: this.nLevelqueryParams.name,
              nextPublicityStatus: this.nLevelqueryParams.nextPublicityStatus,
              nextPublicityType: this.nLevelqueryParams.nextPublicityType,
              pageSize: this.pageSizenLevel,
              status: this.nLevelqueryParams.status,
              blindBoxType: this.nLevelqueryParams.blindBoxType
            }
            this.loading = true
            blindBoxSeriesPage(_params).then(response => {
              if (response.code === 200) {
                this.nLevelData = response.data.list.map(v => {
                  // let {deductSetting, ...a} = v
                  // let jfdk = null
                  // if (deductSetting === null) {
                  //   jfdk = ''
                  // } else {
                  //   if (deductSetting.id !== null) {
                  //     let _res = this.discoMoneyArray.find(items => items.value === deductSetting.id)
                  //     jfdk = _res ? _res.label : ''
                  //   } else {
                  //     jfdk = ''
                  //   }
                  // }
                  let jfdk = ''
                  return {
                    // deductSetting,
                    jfdk,
                    ...v
                  }
                })
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
        this.isAuth.isPermi(['game:lottery:pool:getByPage']) && this.searchnLevel()
      },
      blindBoxOpenClick (row) {
        this.dialogFormVisibleOpen = true
        this.formOpen.startTime = ''
        this.curClickRowId = row.id
      },
      blindBoxOpenClickRun () {
        blindBoxSeriesOpen({
          id: this.curClickRowId,
          startTime: this.formOpen.startTime && this.$dayjs((this.formOpen.startTime).getTime()).format('YYYY-MM-DD HH:mm:ss'),
        }).then(response => {
          if (response.code === 200) {
            this.$message.success(response.message);
            this.searchnLevel()
          } else {
            this.$message.error(response.message)
          }
          this.dialogFormVisibleOpen = false
        }).catch(e => {})
      },
      jumpToEachissuePage (row) {
        // 进入盲盒详情统计页面，盲盒编号必传
        this.$router.push({ path: "/games/blindBoxEachIssueInfos", query: {blindBoxNo: row.code, blindBoxType: row.blindBoxType}})
      },
    }
  }
</script>

<style lang="scss" scoped>
.seeInfosEachissueBox{}
</style>

