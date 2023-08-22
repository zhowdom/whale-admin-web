<template>
  <div class="gamesWraper">
    <h3 class="gmTitlebox">报表分析</h3>
    <el-form :inline="true">
      <el-form-item label="时间">
        <el-date-picker
          v-model="queryDate"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          value-format="timestamp"
          ref="dateRange">
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button v-hasPermi="['game:room:statistic']" type="primary" :loading="loading" icon="el-icon-search" @click="searchStatistic">查询</el-button>
      </el-form-item>

    </el-form>



    <div class="popoBoxs">
      <ul>
        <li>
          <p>盈亏(Candy)
            <el-tooltip placement="top">
              <div slot="content">
                1. 盈亏 = 累计兑换Candy - 累计已发放奖励<br />
                2. 大于0为盈,小于0 为亏<br />
                3. 其中发放奖励是统计税后的奖励
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </p>
          <h3 style="text-align:center;">{{bigStatistic.profit === null ? '--' : bigStatistic.profit}}</h3>
        </li>
        <li>
          <p>
            累计兑换(Candy)
            <el-tooltip placement="top">
              <div slot="content">
                统计参与游戏，兑换奖码所支付Candy的数量
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </p>
          <h3 style="text-align:center;">{{bigStatistic.total === null ? '--' : bigStatistic.total}}</h3>
        </li>
        <!-- <li>
          <p>
            可分配奖池(Candy)
            <el-tooltip placement="top">
              <div slot="content">
                可分配奖池 = Candy管理中手续费分红（奖池分红）+ 累计兑换（Candy）+ 可分配奖池注入 + 每期底注 + 上期未分配置奖池 - 每期奖池
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </p>
          <h3 style="text-align:center;">{{bigStatistic.allocating === null ? '--' : bigStatistic.allocating}}</h3>
        </li> -->
        
      </ul>
    </div>
    <h3 class="gmTitlebox" style="margin-top:40px;">管理列表</h3>
    <el-form :inline="true" :model="queryParams" ref="queryForm" :rules="rulesTop">
      <el-form-item label="真实姓名" prop="name">
        <el-input
          v-model.trim="queryParams.name"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model.trim="queryParams.phone"
          placeholder="请输入"
          maxlength="11"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model.trim="queryParams.email"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="期数" prop="periodsNum">
        <el-input
          v-model.trim="queryParams.periodsNum"
          placeholder="请输入"
          maxlength="32"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="公布中奖码" prop="winningNumber">
        <el-input
          v-model.trim="queryParams.winningNumber"
          placeholder="请输入"
          maxlength="32"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>

    <!-- <el-form-item label="中奖状态">
        <el-select v-model="queryParams.isPrize" clearable placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="待开奖" :value="0"></el-option>
          <el-option label="未中奖" :value="1"></el-option>
          <el-option label="已中奖" :value="2"></el-option>
        </el-select>
    </el-form-item> -->
    <el-form-item label="奖金状态">
        <el-select v-model="queryParams.gameStatus" clearable placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="已兑换" :value="1"></el-option>
          <el-option label="待兑换" :value="2"></el-option>
        </el-select>
    </el-form-item>
    <!-- <el-form-item label="Candy发放状态">
        <el-select v-model="queryParams.gameStatus" clearable placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="未发放(未兑换)" :value="0"></el-option>
          <el-option label="已发放" :value="1"></el-option>
          <el-option label="锁仓中" :value="2"></el-option>
          <el-option label="已作废" :value="3"></el-option>
          <el-option label="失效" :value="4"></el-option>
        </el-select>
    </el-form-item> -->
    

      <el-form-item>
        <el-button v-hasPermi="['game:lottery:getByPage']" type="primary" :loading="loading" icon="el-icon-search" @click="search(1)">查询</el-button>
        <!-- <el-button type="primary">重置</el-button> -->
      </el-form-item>

    </el-form>

    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="memberId"
        label="用户ID"
        width="130">
      </el-table-column>
      <el-table-column
        prop="realName"
        label="真实姓名"
        width="130">
      </el-table-column>
      <el-table-column
        prop="phone"
        width="160"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="email"
        width="160"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="periodsNum"
        label="期数"
        width="180">
      </el-table-column>
      <el-table-column
        prop="num"
        label="我的奖码"
        width="180">
        <template slot-scope="{row}">
        <p @click="nLevelPrizeInfosClick(row)" style="color:#1890ff;text-decoration:underline;cursor:pointer;">{{row.num}}</p>
      </template>
      </el-table-column>
      
      <el-table-column
        prop="publicWinningNumber"
        label="公布中奖码"
        width="180">
      </el-table-column>
      <el-table-column
        prop="acquirePrizeWhalePeas"
        label="获得奖金(Candy)"
        width="180">
      </el-table-column>
      <el-table-column
        prop="sendPrizeWhalePeas"
        label="已发放奖金(Candy)"
        width="180">
      </el-table-column>
      <el-table-column
        prop="lockPrizeWhalePeas"
        label="锁仓中奖金(Candy)"
        width="180">
      </el-table-column>
      <el-table-column
        prop="trashPrizeWhalePeas"
        label="已作废奖金(Candy)"
        width="180">
      </el-table-column>
      <!-- <el-table-column
        prop="isWin"
        label="中奖状态"
        width="180">
          <template slot-scope="{row}">
          <p v-if="+row.isWin === 0">待开奖</p>
          <p v-else-if="+row.isWin === 1">未中奖</p>
          <p v-else-if="+row.isWin === 2">已中奖</p>
          <p v-else-if="!row.isWin">-</p>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="prizeStatus"
        label="奖金状态"
        width="180">
          <template slot-scope="{row}">
            <div v-if="+row.isWin === 0">-</div>
            <div v-else>
              <p v-if="+row.prizeStatus === 1">已兑换</p>
              <p v-else-if="+row.prizeStatus === 2">待兑换</p>
              <p v-else-if="!row.prizeStatus">-</p>
            </div>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="prizeStatus"
        label="Candy发放状态"
        width="180">
          <template slot-scope="{row}">
          <p v-if="+row.prizeStatus === 0">未发放(未兑换)</p>
          <p v-else-if="+row.prizeStatus === 1">已发放</p>
          <p v-else-if="+row.prizeStatus === 2">锁仓中</p>
          <p v-else-if="+row.prizeStatus === 3">已作废</p>
          <p v-else-if="+row.prizeStatus === 4">失效</p>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="exchangeTime"
        label="奖金兑换时间">
        <template slot-scope="{row}">
          {{row.exchangeTime ? $dayjs(row.exchangeTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
      </el-table-column>

      <el-table-column
        label="操作">
        <template slot-scope="{row}">
        <p @click="jumpToEachissuePage(row)" style="color:#1890ff;text-decoration:underline;cursor:pointer;">查看</p>
      </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="fr"
      style="margin-top:20px;"
      @current-change="search"
      :page-sizes="[10, 20, 30]"
      @size-change="handleSizeChange"
      :current-page.sync="pageIndex"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage">
    </el-pagination>

<!--弹窗-->
<el-dialog title="查看" :visible.sync="dialogTableVisible">
  <div class="clearfix">
    <div class="fl" style="width:200px;">
      <h3 class="gmTitlebox" sty>每局详情</h3>
      <div class="ells">每局编号：<span>{{cliclRowData.roomSerial}}</span></div>
      <div class="ells">组局时间：<span>{{cliclRowData.createAt ? $dayjs(cliclRowData.createAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}</span></div>
      <div class="ells">场次名称：<span>{{cliclRowData.ruleName}}</span></div>
      <div class="ells">所需：<span>{{cliclRowData.entryWhalePeas}}</span></div>
      <div class="ells">门票：<span>{{cliclRowData.ticketWhalePeas}}</span></div>
      <div class="ells">是否猜中：<span>{{cliclRowData.statusType ? '是' : '否'}}</span></div>
      <div class="ells">猜中奖励：<span>{{cliclRowData.awardWhalePeas}}</span></div>
    </div>
    <div class="fr gmTable">
      <h3 class="gmTitlebox">参局明细</h3>
      <el-table :data="gridData" >
        <el-table-column prop="memberId" label="用户ID" width="150"></el-table-column>
        <el-table-column prop="statusType" label="是否猜中" width="200">
          <template scope="scope">
            <span v-if="+scope.row.statusType === 0">未中奖</span>
            <span v-else-if="+scope.row.statusType === 1">中奖</span>
            <span v-else-if="+scope.row.statusType === 2">待开奖</span>
          </template>
        </el-table-column>
        <el-table-column prop="awardWhalePeas" label="猜中奖励"></el-table-column>
      </el-table>
    </div>
    
  </div>
  
</el-dialog>

<!--夺宝码-->
<el-dialog title="我的夺宝码" :visible.sync="dialogCodeVisible">
  <h3>第{{periodsNumCur}}期</h3>
  夺宝码：<el-input style="width:200px;" v-model="tickCodeEntered" placeholder="请输入内容"></el-input><el-button style="margin-left:10px;" type="primary" @click="searchCode(1)">查询</el-button>
  <el-table :data="gridCodeData" style="margin-top:10px;">
    <el-table-column property="createAt" label="时间">
      <template slot-scope="{row}">
        {{row.createAt ? $dayjs(row.createAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
    </el-table-column>
    <el-table-column property="tickCode" label="夺宝码"></el-table-column>
  </el-table>
  <el-pagination
      style="margin-top:20px;"
      @current-change="searchCode"
      :page-sizes="[10, 20, 30]"
      @size-change="handleSizeChangeCode"
      :current-page.sync="pageIndexCode"
      :page-size="pageSizeCode"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPageCode">
    </el-pagination>
</el-dialog>


<!--N等奖管理弹窗-->
<el-dialog :title="nLevelPrizeTitle" :visible.sync="nLevelPrizesVisible">
  <el-form :model="nLevelqueryParams" :rules="nLevelrules" ref="nLevelqueryForm" :inline="true">
      <el-form-item label="奖码" prop="describe">
        <el-input
          v-model.trim="nLevelqueryParams.code"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 100px"
        />
      </el-form-item>
      <el-form-item label="中奖等级">
        <el-select v-model="nLevelqueryParams.level" clearable placeholder="请选择">
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
    </el-form-item>
      

      <el-form-item>
        <el-button v-hasPermi="['game:lottery:getByCodePage']" type="primary" :loading="loading" icon="el-icon-search" @click="searchnLevel(1)">查询</el-button>
      </el-form-item>
    </el-form>
  <el-table :data="nLevelData">
    <el-table-column property="createAt" label="奖码获取时间">
      <template slot-scope="{row}">
        {{row.createAt ? $dayjs(row.createAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
    </el-table-column>
    <el-table-column property="tickCode" label="奖码"></el-table-column>
    <el-table-column property="winningLevel" label="中奖等级">
      <template slot-scope="{row}">
        <p v-if="+row.winningLevel > 0">{{row.winningLevel}}等奖</p>
        <p v-else-if="+row.winningLevel === 0">未中奖</p>
        <p v-else-if="+row.winningLevel === -1">已注销</p>
      </template>
    </el-table-column>
    <el-table-column property="sendWhalePeas" label="奖金（Candy）"></el-table-column>
    <el-table-column property="taskTypeDesc" label="奖码来源"></el-table-column>
    <!-- <el-table-column property="taskType" label="奖码来源">
      <template slot-scope="{row}">
        <p v-if="+row.taskType === 0">邀请新用户</p>
        <p v-else-if="+row.taskType === 1">看福利视频</p>
        <p v-else-if="+row.taskType === 2">星级达人</p>
        <p v-else-if="+row.taskType === 3">Candy兑换</p>
        <p v-else-if="+row.taskType === 4">自营下单</p>
        <p v-else-if="+row.taskType === 5">签到</p>
        <p v-else-if="+row.taskType === 6">安慰赠送</p>
        <p v-else-if="+row.taskType === 7">失效奖码</p>
        <p v-else-if="+row.taskType === 99">机器人</p>

      </template>
    </el-table-column> -->
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
</el-dialog>


  </div>
</template>

<script>
import { roomstatistic, gameDesk, roomlistQuery, takejewelQueryList, takejewelTofuBlockList, takejewelTofuBlock, takejewelCodeList, zzJoystatisticsTofu, zzJoystatisticsOuterList, zzJoystatisticsMyCodeList } from "@/api/games";
  export default {
    props: ['sendTochildBridgeData'],
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
          level: ''
        },
        nLevelPrizeTitle: '',
        pageIndexnLevel: 1,
        pageSizenLevel: 10,
        totalPagenLevel: 0,
        nLevelData: [],
        nLevelPrizesVisible: false,
        periodsNumCur: '',
        tickCodeEntered: '',
        dialogCodeVisible: false,
        gridCodeData: [],
        cliclRowData: {},
        pageIndexCode: 1,
        pageSizeCode: 10,
        totalPageCode: 0,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        rulesTop: {
          phone: [
            { validator: validatePhone, trigger: 'blur' }
          ]
        },
        queryAllGameDeskListArr: [],
        pickerOptions: {
          shortcuts: [{
            text: '近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        bigStatistic: {},
        queryDate: '',
        regtime: '',
        queryParams: {
          level: '',
          turn: '',
          binggo: '',
          winningNumber: '',
          periodsNum: '',
          isPrize: '',
          gameStatus: '',
          name: '',
          phone: '',
          email: '',
          code: ''
        },
        tableData: [],
        gridData: [],
        dialogTableVisible: false,
        loading: false,
        clickCurRowID: '',
        clickCurRowMemberId: '',
        nLevelClickRowData: {}
      }
    },
    created () {
      this.isAuth.isPermi(['game:rule:page']) && this.queryAllGameDeskList()
      this.isAuth.isPermi(['game:room:statistic']) && this.searchStatistic()
    },
    mounted () {
      this.isAuth.isPermi(['game:lottery:getByPage']) && this.search(1)
    },
    watch: {
      'sendTochildBridgeData': {
        handler: function (newVal, oldVal) {
          console.log(newVal, oldVal)
        },
        deep: true
      }
    },
    methods: {
      nLevelPrizeInfosClick (row) {
        this.nLevelPrizesVisible = true
        this.nLevelPrizeTitle = `我的奖码（第${row.periodsNum}期）`
        this.nLevelClickRowData = Object.assign({}, row)
        this.nLevelqueryParams.code = ''
        this.nLevelqueryParams.level = ''
        this.isAuth.isPermi(['game:lottery:getByCodePage']) && this.searchnLevel(1)
      },
      searchnLevel (pgi) {
        this.$refs['queryForm'].validate((valid) => {
          if (valid) {
            if (pgi) this.pageIndexnLevel = pgi
            let _params = {
              currentPage: this.pageIndexnLevel,
              pageSize: this.pageSizenLevel,
              code: this.nLevelqueryParams.code,
              level: this.nLevelqueryParams.level,
              periodsNum: this.nLevelClickRowData.periodsNum,
              memberId: this.nLevelClickRowData.memberId
            }
            this.loading = true
            zzJoystatisticsMyCodeList(_params).then(response => {
              if (response.code === 200) {
                this.nLevelData = response.data.list
                this.totalPagenLevel = response.data.total
              } else {
                this.nLevelData = []
                this.totalPagenLevel = 0
                this.pageSizenLevel = 10
                this.$message.error(response.message)
              }
              this.loading = false
            }).catch(e => {
              this.loading = false
            })
            
          }
        })
      },
      handleSizeChangenLevel (val) {
        this.pageSizenLevel = val
        this.pageIndexnLevel = 1
        this.isAuth.isPermi(['game:lottery:getByCodePage']) && this.searchnLevel()
      },
      jumpToEachissuePage (row) {
        // 夺宝游戏id、期数periodsNum
        this.$router.push({ path: "/games/whirligigJoyEachIssueInfos", query: {id:row.gameWhalePeasSeizeTreasureId, periodsNum: row.periodsNum || ''}})
      },
      handleSizeChangeCode (val) {
        this.pageSizeCode = val
        this.pageIndexCode = 1
        this.searchCode()
      },
      showCodeDialog (row) {
        this.tickCodeEntered = ''
        this.dialogCodeVisible = true
        this.periodsNumCur = row.periodsNum
        this.clickCurRowID = row.id
        this.clickCurRowMemberId = row.memberId
        this.searchCode()
      },
      searchCode (pgi) {
        // dialogCodeVisible: false,
        // gridCodeData: [],
        if (pgi) this.pageIndexCode = pgi
        let _params = {
          currentPage: this.pageIndexCode,
          pageSize: this.pageSizeCode,
          itemId: '',
          memberId: this.clickCurRowMemberId,
          serialId: this.clickCurRowID,
          statusType: '',
          tickCode: this.tickCodeEntered
        }
        this.loading = true
        takejewelCodeList(_params).then(response => {
          if (response.code === 200) {
            this.gridCodeData = response.data.list
            this.totalPageCode = response.data.total
          } else {
            this.gridCodeData = []
            this.totalPageCode = 0
            this.pageSizeCode = 10
            this.$message.error(response.message)
          }
          this.loading = false
        }).catch(e => {
          this.loading = false
        })
      },
      seeDetails (row) {
        this.dialogTableVisible = true
        this.cliclRowData = Object.assign({}, row)
        this.isAuth.isPermi(['game:member:log:page']) && this.searchDetails(row)
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.isAuth.isPermi(['game:lottery:getByPage']) && this.search()
      },
      // 查询所有游戏场次列表
      queryAllGameDeskList () {
        let _params = {
          currentPage: 1, // 下拉列表
          gameInfoId: this.sendTochildBridgeData.totalInformation.id,
          pageSize: 10000,
          statusType: -1
        }
        gameDesk(_params).then(response => {
          if (response.code === 200) {
            this.queryAllGameDeskListArr = response.data.list
            this.loading = false
          } else {
            this.queryAllGameDeskListArr = []
            this.loading = false
            this.$message.error(response.message)
          }
        }).catch(e => {
          this.loading = false
        })
      },
      searchDetails (row) {
        let _params = {
          currentPage: 1,
          gameInfoId: row.gameInfoId,
          gameRuleId: row.gameRuleId,
          pageSize: 10000,
          // phone: this.queryParams.phone,
          roomSerial: row.roomSerial
          // statusType: this.queryParams.binggo,
          // userName: this.queryParams.name
        }
        this.loading = true
        roomlistQuery(_params).then(response => {
          if (response.code === 200) {
            this.gridData = response.data.list
          } else {
            this.gridData = []
            this.$message.error(response.message)
          }
          this.loading = false
        }).catch(e => {
          this.loading = false
        })
      },
      search (pgi) {
        this.$refs['queryForm'].validate((valid) => {
            if (valid) {
              if (pgi) this.pageIndex = pgi

              let _params = {
                realName: this.queryParams.name,
                phone: this.queryParams.phone,
                email: this.queryParams.email,
                periodsNum: this.queryParams.periodsNum,
                publicWinningNumber: this.queryParams.winningNumber,
                isWin: this.queryParams.isPrize,
                prizeStatus: this.queryParams.gameStatus,
                // gameStatus: this.queryParams.gameStatus,
                currentPage: this.pageIndex,
                pageSize: this.pageSize,
              }
              this.loading = true
              zzJoystatisticsOuterList(_params).then(response => {
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
              }).catch(e => {
                this.loading = false
              })
            }
        })
      },
      searchStatistic () {
        this.loading = true
        zzJoystatisticsTofu(
          {
            startTime: this.queryDate && this.$dayjs(this.queryDate[0]).format('YYYY-MM-DD'),
            endTime: this.queryDate && this.$dayjs(this.queryDate[1]).format('YYYY-MM-DD'),
          }
        ).then(response => {
          if (response.code === 200) {
            this.bigStatistic = response.data
            this.loading = false
          } else {
            this.bigStatistic = {
              profit: 0,
              allocating: 0,
              total: 0
            }
            this.loading = false
            this.$message.error(response.message)
          }
        }).catch(e => {
          this.loading = false
        })
      },
      setDateFn (type) { // useless
        if (type === 'today') {
          // 今日
          this.regtime = [new Date().getTime(), new Date().getTime()]
        } else if (type === 'limit100') {
          // 今日之前3个月
          this.regtime = [new Date().getTime() - 3600 * 1000 * 24 * 90, new Date().getTime()]
        } else if (type === 'limit30') {
          // 今日之前1个月
          this.regtime = [new Date().getTime() - 3600 * 1000 * 24 * 30, new Date().getTime()]
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
.gamesWraper{
  padding: 10px 20px;
  .gmTables{
    width:calc(100% - 200px);
  }
  .ells{
    padding-bottom: 10px;
  }
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

