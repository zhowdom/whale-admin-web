<template>
  <div class="gamesWraper">
    <h3 class="gmTitlebox">报表分析</h3>
    <!-- <el-form :inline="true">
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

    </el-form> -->



    <div class="popoBoxs">
      <ul>
        <li>
          <p>
            总参与Candy
            <el-tooltip placement="top">
              <div slot="content">
                总参与Candy = 达标已扣减Candy + 进行中鲸
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </p>
          <h3 style="text-align:center;">{{bigStatistic.countWhalePeas === null ? '--' : bigStatistic.countWhalePeas}}</h3>
        </li>
        <li>
          <p>
            未达标回补的Candy
            <el-tooltip placement="top">
              <div slot="content">
                游戏开始时，参与夺宝后即扣除Candy，在游戏结束后，<br/>
                未达标或已下架的游戏，导致Candy回补
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </p>
          <h3 style="text-align:center;">{{bigStatistic.returnWhalePeas === null ? '--' : bigStatistic.returnWhalePeas}}</h3>
        </li>
        <li>
          <p>
            已达标期数
            <el-tooltip placement="top">
              <div slot="content">
                游戏期间内,只要达到要求的份数,即为已达标
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </p>
          <h3 style="text-align:center;">{{bigStatistic.periodsNumEnd === null ? '--' : bigStatistic.periodsNumEnd}}</h3>
        </li>
        <li>
          <p>
            累计期数
            <el-tooltip placement="top">
              <div slot="content">
                累计期数 = 已结束期数(包括已达标,未达标,已下架) + 进行中期数
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </p>
          <h3 style="text-align:center;">{{bigStatistic.countPeriodsNum === null ? '--' : bigStatistic.countPeriodsNum}}</h3>
        </li>
        <li>
          <p>
            进行中期数
            <el-tooltip placement="top">
              <div slot="content">
                指游戏已开始,未结束
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </p>
          <h3 style="text-align:center;">{{bigStatistic.countPeriodsIngNum === null ? '--' : bigStatistic.countPeriodsIngNum}}</h3>
        </li>
      </ul>
    </div>
    <h3 class="gmTitlebox" style="margin-top:40px;">管理列表</h3>
    <el-form :inline="true" :model="queryParams" ref="queryForm" :rules="rulesTop">
      <el-form-item label="真实姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入"
          maxlength="11"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="queryParams.email"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="期数" prop="periodsNum">
        <el-input
          v-model="queryParams.periodsNum"
          placeholder="请输入"
          maxlength="32"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="中奖码" prop="winningNumber">
        <el-input
          v-model="queryParams.winningNumber"
          placeholder="请输入"
          maxlength="32"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>

    <el-form-item label="是否中奖">
        <el-select v-model="queryParams.isPrize" clearable placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="是" :value="1"></el-option>
          <el-option label="否" :value="0"></el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="状态">
        <el-select v-model="queryParams.gameStatus" clearable placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="进行中-等待开奖" :value="0"></el-option>
          <el-option label="开奖" :value="1"></el-option>
          <el-option label="游戏结束-未达标" :value="2"></el-option>
          <el-option label="游戏结束-下架" :value="3"></el-option>
          <el-option label="售罄-达标" :value="4"></el-option>
          <el-option label="已完成-待发货" :value="5"></el-option>
          <el-option label="已完成-已发货" :value="6"></el-option>
        </el-select>
    </el-form-item>
    

      <el-form-item>
        <el-button v-hasPermi="['game:order:page']" type="primary" :loading="loading" icon="el-icon-search" @click="search(1)">查询</el-button>
        <!-- <el-button type="primary">重置</el-button> -->
      </el-form-item>

    </el-form>

    <el-table
      :data="tableData"
      style="width: 100%">
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
        width="130">
      </el-table-column>
      <el-table-column
        prop="mainImg"
        label="商品主图"
        width="180">
         <template scope="scope">
          <img style="width:88px;height:88px;" :src="scope.row.mainImg" />
        </template>
      </el-table-column>
      <el-table-column
        prop="itemDesc"
        label="商品描述"
        width="180">
      </el-table-column>
      <el-table-column
        prop="num"
        label="夺宝码（个）"
        width="180">
        <template scope="scope">
          <p @click="showCodeDialog(scope.row)" style="color:#1890ff;text-decoration:underline;cursor:pointer;">{{scope.row.num}}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="gameStatus"
        label="状态"
        width="180">
        <template scope="scope">
          <p v-if="+scope.row.gameStatus === 0">进行中-等待开奖</p>
          <p v-else-if="+scope.row.gameStatus === 1">开奖</p>
          <p v-else-if="+scope.row.gameStatus === 2">游戏结束-未达标</p>
          <p v-else-if="+scope.row.gameStatus === 3">游戏结束-下架</p>
          <p v-else-if="+scope.row.gameStatus === 4">售罄-达标</p>
          <p v-else-if="+scope.row.gameStatus === 5">已完成-待发货</p>
          <p v-else-if="+scope.row.gameStatus === 6">已完成-已发货</p>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="publicWinningNumber"
        label="公布中奖码"
        width="180">
      </el-table-column> -->
      <el-table-column
        prop="isPrize"
        label="是否中奖"
        width="180">
        <template scope="scope">
          <p>{{+scope.row.isPrize === 0 ? '否' : '是'}}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="winningNumber"
        label="中奖码"
        width="180">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        width="180">
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

  </div>
</template>

<script>
import { roomstatistic, gameDesk, roomlistQuery, takejewelQueryList, takejewelTofuBlockList, takejewelTofuBlock, takejewelCodeList } from "@/api/games";
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
        clickCurRowMemberId: ''
      }
    },
    created () {
      this.isAuth.isPermi(['game:rule:page']) && this.queryAllGameDeskList()
      this.isAuth.isPermi(['game:room:statistic']) && this.searchStatistic()
    },
    mounted () {
      this.isAuth.isPermi(['game:member:log:page']) && this.search(1)
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
      jumpToEachissuePage (row) {
        // 夺宝游戏id、期数periodsNum
        this.$router.push({ path: "/games/seeInfosEachissue", query: {id:row.gameWhalePeasSeizeTreasureId, periodsNum: row.periodsNum || ''}})
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
        this.search()
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
                currentPage: this.pageIndex,
                gameStatus: this.queryParams.gameStatus,
                isPrize: this.queryParams.isPrize,
                name: this.queryParams.name,
                pageSize: this.pageSize,
                periodsNum: this.queryParams.periodsNum,
                phone: this.queryParams.phone,
                email: this.queryParams.email,
                winningNumber: this.queryParams.winningNumber
              }
              this.loading = true
              takejewelTofuBlockList(_params).then(response => {
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
        takejewelTofuBlock().then(response => {
          if (response.code === 200) {
            this.bigStatistic = response.data
            this.loading = false
          } else {
            this.bigStatistic = {
              countPeriodsIngNum: 0,
              countPeriodsNum: 0,
              countWhalePeas: 0,
              periodsNumEnd: 0,
              returnWhalePeas: 0
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

