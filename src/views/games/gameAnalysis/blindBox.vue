<template>
  <div class="seeInfosEachissueBox bbStatisticBox">

    <div class="popoBoxs">
      <h3 class="gmTitlebox">报表分析</h3>
      <el-form :model="nLevelqueryParams" ref="nLevelqueryForm" :inline="true">
        <el-form-item label="日期" prop="redbacktime">
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
          <el-button type="primary" icon="el-icon-search" :loading="topLoading" @click="searchTop">查询</el-button>
        </el-form-item>
      </el-form>
      <ul>
        <li>
          <p>
            盈亏(Candy)
            <el-tooltip placement="top">
              <div slot="content">
                盈亏 = 支付Candy + 收益Candy - 退还Candy
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </p>
          <h3 style="text-align:center;">{{bigStatistic.whalePeas === null ? '--' : bigStatistic.whalePeas}}</h3>
        </li>
        <li>
          <p>
            收益（USDT）
            <el-tooltip placement="top">
              <div slot="content">
                1. 收益=总抢购额现金部分 -  退还(现金部分（包括Candy抵扣的现金 ）)-参与补贴 - 持券收益 - 服务商收益 -平台分佣<br>
                2. 此处暂不统计实物成本<br>
                3. 针对于"Candy抵扣" 退还是否为退还现金，如果当前期状态为 "抢购失败"，即原路退回 ；否则退还等值现金
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </p>
          <h3 style="text-align:center;">{{bigStatistic.profit === null ? '--' : bigStatistic.profit}}</h3>
        </li>
        <li>
          <p>
            赠送奖励(Candy)
            <el-tooltip placement="top">
              <div slot="content">
                1. 赠送奖励是指，赠送的任务券预计产出的Candy的累计<br>
                2.只需统计发放任务券时预计产出的Candy；中途已失效的不作处理
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </p>
          <h3 style="text-align:center;">{{bigStatistic.giveAward === null ? '--' : bigStatistic.giveAward}}</h3>
        </li>
        
      </ul>
    </div>

    <h3 class="gmTitlebox" style="margin-top:40px;">管理列表</h3>
    <el-form :model="nLevelqueryParams" :rules="nLevelrules" ref="nLevelqueryForm" :inline="true">
      <el-form-item label="真实姓名" prop="realName">
        <el-input
          v-model.trim="nLevelqueryParams.realName"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 100px"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model.trim="nLevelqueryParams.phone"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model.trim="nLevelqueryParams.email"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item label="当前期单号" prop="currentPeriodNo">
        <el-input
          v-model.trim="nLevelqueryParams.currentPeriodNo"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item label="盲盒编号" prop="blindBoxNo">
        <el-input
          v-model.trim="nLevelqueryParams.blindBoxNo"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item label="盲盒系列" prop="blindBoxSerie">
        <el-input
          v-model.trim="nLevelqueryParams.blindBoxSerie"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item label="盲盒描述" prop="blindBoxDesc">
        <el-input
          v-model.trim="nLevelqueryParams.blindBoxDesc"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 150px"
        />
      </el-form-item>
  
      <el-form-item label="盲盒状态">
        <el-select v-model="nLevelqueryParams.blindBoxStatus" clearable placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="进行中" :value="1"></el-option>
          <el-option label="已结束-未达标" :value="4"></el-option>
          <el-option label="已结束-达标" :value="5"></el-option>
          <el-option label="已结束-抢购失败" :value="3"></el-option>
        </el-select>
    </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="nLevelqueryParams.blindBoxType" clearable placeholder="请选择">
          <el-option label="全部" :value="-1"></el-option>
          <el-option label="魔力盲盒专场" :value="1"></el-option>
          <el-option label="Candy销毁专场" :value="2"></el-option>
          <el-option label="魔力小盲盒" :value="3"></el-option>
        </el-select>
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
       

      <el-form-item>
        <el-button type="primary" :loading="loading" icon="el-icon-search" @click="searchnLevel(1)">查询</el-button>
      </el-form-item>
    </el-form>
  <el-table :data="nLevelData" border>
    <el-table-column property="blindBoxType" label="类型">
      <template scope="scope">
        <p v-if="+scope.row.blindBoxType === 1">魔力盲盒专场</p>
        <p v-else-if="+scope.row.blindBoxType === 2">Candy销毁专场</p>
        <p v-else-if="+scope.row.blindBoxType === 3">魔力小盲盒</p>
      </template>
    </el-table-column>
    <el-table-column property="memberId" label="用户ID"></el-table-column>
    <el-table-column property="realName" label="真实姓名"></el-table-column>
    <el-table-column property="memberPhone" label="手机号"></el-table-column>
    <el-table-column property="memberEmail" label="邮箱"></el-table-column>
    <el-table-column property="currentPeriodNo" label="当前期编号"></el-table-column>
    <el-table-column property="blindBoxNo" label="盲盒编号"></el-table-column>
    <el-table-column property="blindBoxSerie" label="盲盒系列"></el-table-column>
    <el-table-column property="blindBoxDesc" label="盲盒描述"></el-table-column>
    <el-table-column property="periods" label="当前期数"></el-table-column>
    <el-table-column property="blindBoxStatus" label="当前期状态">
      <template scope="scope">
        <p v-if="+scope.row.blindBoxStatus === 1">进行中</p>
        <p v-else-if="+scope.row.blindBoxStatus === 4">已结束-未达标</p>
        <p v-else-if="+scope.row.blindBoxStatus === 5">已结束-达标</p>
        <p v-else-if="+scope.row.blindBoxStatus === 3">已结束-抢购失败</p>
      </template>
    </el-table-column>
    <el-table-column property="num" label="抢购份数">
      <template scope="scope">
          <p @click="bugFirstClick(scope.row)" style="color:#1890ff;cursor:pointer;text-decoration:underline;">{{scope.row.num}}</p>
        </template>
    </el-table-column>
    <el-table-column property="payAmount" label="支付现金（USDT）"></el-table-column>
    <el-table-column property="payWhalePeas" label="支付Candy"></el-table-column>
    <!-- <el-table-column property="whalePeasDeductionAmount" label="Candy抵扣（USDT）"></el-table-column>
    <el-table-column property="whalePeasDeductionNum" label="Candy抵扣（扣减Candy）"></el-table-column> -->
    <el-table-column property="updateTime" label="更新时间">
      <template slot-scope="{row}">
        {{row.updateTime ? $dayjs(row.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
    </el-table-column>
    <el-table-column label="操作">
       <template scope="scope">
          <p @click="jumpToEachissuePage(scope.row)" style="color:#1890ff;cursor:pointer;text-decoration:underline;">查看</p>
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
    <el-dialog :title="`盲盒实物(期数：${curClickRowData.periods})`" :visible.sync="cmbTableVisible">
      <el-form :model="queryParamsDT" :inline="true">
        <el-form-item label="子订单号" prop="orderItemNo">
          <el-input
            v-model.trim="queryParamsDT.orderItemNo"
            placeholder="请输入"
            clearable
            size="small"
            style="width: 100px"
          />
        </el-form-item>
        <el-form-item label="货号" prop="itemNo">
          <el-input
            v-model.trim="queryParamsDT.itemNo"
            placeholder="请输入"
            clearable
            size="small"
            style="width: 100px"
          />
        </el-form-item>
        <el-form-item label="实物名称" prop="itemName">
          <el-input
            v-model.trim="queryParamsDT.itemName"
            placeholder="请输入"
            clearable
            size="small"
            style="width: 100px"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="loading" icon="el-icon-search" @click="cmbTableSearch(1)">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="cmbTableData" border>
        <el-table-column property="itemNo" label="序号" width="150"></el-table-column>
        <el-table-column property="orderItemNo" label="子订单号" width="150"></el-table-column>
        <el-table-column property="itemNo" label="货号" width="200"></el-table-column>
        <el-table-column property="itemName" label="实物名称"></el-table-column>
        <el-table-column property="img" label="图片">
          <template scope="scope">
            <img :src="scope.row.img" style="width:80px;height:80px;">
          </template>
        </el-table-column>
        <el-table-column property="costPrice" label="成本价（USDT）"></el-table-column>
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



  </div>
</template>

<script>
import { blindBoxPurchaseInfoItemQuery, blindBoxStatisticsList, blindBoxStatisticsListByPage, takejewelCodeList, zzJoyPoorTotalSwitchList } from "@/api/games";
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
        queryParamsDT: {
          orderItemNo: '',
          itemNo: '',
          itemName: ''
        },
        topLoading: false,
        bigStatistic: {
          giveAward: 0,
          profit: 0,
          whalePeas: 0
        },
        // 盲盒通用table-s
        cmbTableVisible: false,
        cmbTableData: [],
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
          name: '',
          memberId: '',
          periodsNum: '',
          redbacktime: '',
          currentPeriodNo: '',

          blindBoxStatus: '',
          blindBoxDesc: '',
          blindBoxSerie: '',
          blindBoxNo: '',
          orderNo: '',
          phone: '',
          email: '',
          realName: '',
          blindBoxType: ''
        },
        nLevelPrizeTitle: '',
        pageIndexnLevel: 1,
        pageSizenLevel: 10,
        totalPagenLevel: 0,
        nLevelData: [],
        nLevelPrizesVisible: false,
        loading: false,
        curClickRowData: {}
      }
    },
    mounted () {
      this.searchTop()
      this.searchnLevel(1)
    },
    watch: {},
    methods: {
      jumpToEachissuePage (row) {
        // 进入盲盒详情统计页面，盲盒编号必传
        this.$router.push({ path: "/games/blindBoxEachIssueInfos", query: {blindBoxNo: row.blindBoxNo, blindBoxType: row.blindBoxType}})
      },
      // 盲盒通用table-s
      cmbTableSearch (pgi) {
        if (pgi) this.cmbTablepageIndex = pgi
        this.loading = true
        blindBoxPurchaseInfoItemQuery({
          currentPage: this.cmbTablepageIndex,
          itemName: this.queryParamsDT.itemName, // 实物名称
          itemNo: this.queryParamsDT.itemNo, // 货号
          orderItemNo: this.queryParamsDT.orderItemNo, // 子订单编号
          pageSize: this.cmbTablepageSize,
          currentPeriodNo: this.curClickRowData.currentPeriodNo,
        }).then(response => {
          if (+response.code === 200) {
            this.cmbTableData = JSON.parse(JSON.stringify(response.data.list))
            this.cmbTabletotalPage = response.data.total
          } else {
            this.cmbTableData = []
            this.cmbTabletotalPage = 0
            this.cmbTablepageSize = 10
          }
          this.loading = false
        }).catch(e => {
          this.loading = false
        })
      },
      cmbTablehandleSizeChange (val) {
        this.cmbTablepageSize = val
        this.cmbTablepageIndex = 1
        this.cmbTableSearch()
      },
      // 盲盒通用table-d
      bugFirstClick (row) {
        this.cmbTableVisible = true
        this.curMemberId = row.memberId
        this.curClickRowData = Object.assign({}, row)
        this.cmbTableSearch(1)
      },
      nLevelPrizeInfosClick (row) {
        this.nLevelPrizesVisible = true
        this.nLevelPrizeTitle = '二等奖管理（期数：200902）'
      },
      searchnLevel (pgi) {
        this.$refs['nLevelqueryForm'].validate((valid) => {
          if (valid) {
            // todo...test
            if (pgi) this.pageIndexnLevel = pgi
            // let datetime = []
            // datetime = this.nLevelqueryParams.redbacktime
            let _params = {
              currentPeriodNo: this.nLevelqueryParams.currentPeriodNo,
              blindBoxDesc: this.nLevelqueryParams.blindBoxDesc,
              blindBoxNo: this.nLevelqueryParams.blindBoxNo,
              blindBoxSerie: this.nLevelqueryParams.blindBoxSerie,
              blindBoxStatus: this.nLevelqueryParams.blindBoxStatus,
              isRebirth: this.nLevelqueryParams.isRebirth,
              orderNo: this.nLevelqueryParams.orderNo,
              phone: this.nLevelqueryParams.phone,
              email: this.nLevelqueryParams.email,
              realName: this.nLevelqueryParams.realName,
              currentPage: this.pageIndexnLevel,
              pageSize: this.pageSizenLevel,
              blindBoxType: this.nLevelqueryParams.blindBoxType,
            }
            this.loading = true
            blindBoxStatisticsListByPage(_params).then(response => {
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
        this.searchnLevel()
      },
      searchTop () {
        this.topLoading = true
        let datetime = []
        datetime = this.nLevelqueryParams.redbacktime
        blindBoxStatisticsList({
          endTime: datetime ? this.$dayjs(datetime[1]).format('YYYY-MM-DD') : '',
          startTime: datetime ? this.$dayjs(datetime[0]).format('YYYY-MM-DD') : '',
        }).then(response => {
          if (+response.code === 200) {
            this.bigStatistic = {
              giveAward: response.data.giveAward || 0,
              profit: response.data.profit || 0,
              whalePeas: response.data.whalePeas || 0
            }
          } else {
            this.bigStatistic = {
              giveAward: 0,
              profit: 0,
              whalePeas: 0
            }
          }
          this.topLoading = false
        }).catch(e => {
          this.topLoading = false
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.bbStatisticBox {
  .gmTitlebox{
    position: relative;
    padding-left: 20px;
    &::after{
      position: absolute;
      left: 0;
      top:6px;
      content: '';
      height: 10px;
      width:3px;
      background: red;
    }
  }
  .popoBoxs{
    padding-left:20px;
    padding-top: 20px;
      ul{
        padding: 0;
        margin: 0;
      }
      li{
        border: 1px solid #ccc;
        display: inline-block;
        border-radius:5px;
        padding: 16px;
        margin-right:30px;
        p,h3{
          margin:0;
          padding: 0;
        }
        h3{
          padding-top: 6px;
        }
      }
    }
}
</style>

