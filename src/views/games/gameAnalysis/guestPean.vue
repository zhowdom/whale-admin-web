<template>
  <div class="gamesWraper">
    <el-form :inline="true">
      <el-form-item label="代币类型">
          <el-select v-model="coinName" placeholder="请选择" @change="changeTokenSelect">
            <el-option v-for="(item, index) in gameCoinList" :label="item" :value="item" :key="index"></el-option>
          </el-select>
        </el-form-item>
    </el-form>
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
          <p>
            盈亏
            <el-tooltip placement="top">
              <div slot="content">
                1.盈亏 = 游戏开始时平台进账 - 游戏结束时平台出账<br/>
                2.当盈亏值大于0，即为盈利
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </p>
          <h3 style="text-align:center;">{{bigStatistic.profitWhalePeas === null ? '--' : bigStatistic.profitWhalePeas}}</h3>
        </li>
        <li>
          <p>
            门票收入
            <el-tooltip placement="top">
              <div slot="content">
                门票收入 = 真实用户产生的门票
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </p>
          <h3 style="text-align:center;">{{bigStatistic.totalTicketWhalePeas === null ? '--' : bigStatistic.totalTicketWhalePeas}}</h3>
        </li>
        <li>
          <p>
            累计参与人数
            <el-tooltip placement="top">
              <div slot="content">
                只统计首次玩此游戏的用户
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </p>
          <h3 style="text-align:center;">{{bigStatistic.totalHeadcount === null ? '--' : bigStatistic.totalHeadcount}}</h3>
        </li>
        <li>
          <p>
            累计局数
            <el-tooltip placement="top">
              <div slot="content">
                统计所有场次
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </p>
          <h3 style="text-align:center;">{{bigStatistic.totalGameRoom === null ? '--' : bigStatistic.totalGameRoom}}</h3>
        </li>
      </ul>
    </div>
    <h3 class="gmTitlebox" style="margin-top:40px;">管理列表</h3>
    <el-form :inline="true" :model="queryParams" ref="queryForm" :rules="rulesTop">
      <el-form-item label="用户昵称" prop="name">
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
          placeholder="输入手机号"
          maxlength="11"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="queryParams.email"
          placeholder="输入手机号"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="每局编号" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="输入编号"
          maxlength="32"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="场次">
        <el-select v-model="queryParams.turn" clearable placeholder="请选择">
          <el-option label="全部" :value="-1"></el-option>
          <el-option v-for="(item, index) in queryAllGameDeskListArr" :key="index" :label="item.ruleName" :value="item.id"></el-option>
        </el-select>
    </el-form-item>

    <el-form-item label="是否猜中">
        <el-select v-model="queryParams.binggo" clearable placeholder="请选择">
          <el-option label="全部" :value="-1"></el-option>
          <el-option label="是" :value="1"></el-option>
          <el-option label="否" :value="0"></el-option>
        </el-select>
    </el-form-item>

      <el-form-item>
        <el-button v-hasPermi="['game:member:log:page']" type="primary" :loading="loading" icon="el-icon-search" @click="search(1)">查询</el-button>
        <!-- <el-button type="primary">重置</el-button> -->
      </el-form-item>

    </el-form>

    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="邀请码"
        width="130">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="用户昵称"
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
        prop="roomSerial"
        label="每局编号">
      </el-table-column>
      <el-table-column
        prop="ruleName"
        label="场次">
      </el-table-column>
      <el-table-column
        prop="entryWhalePeas"
        label="每局所需">
      </el-table-column>
      <el-table-column
        prop="headcount"
        label="每局参与人数">
        <template slot="header" slot-scope="scope">
          每局参与人数
          <el-tooltip
          class="item"
          effect="dark"
          content="是指每局需要达到的人数,才可以开启游戏,包括机器人数量"
          placement="top">
          <i class="el-icon-info"></i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="ticketWhalePeas"
        label="门票">
      </el-table-column>
      <el-table-column
        prop="statusType"
        label="是否猜中">
        <template scope="scope">
          <span v-if="+scope.row.statusType === 0">未中奖</span>
          <span v-else-if="+scope.row.statusType === 1">中奖</span>
          <span v-else-if="+scope.row.statusType === 2">待开奖</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="awardWhalePeas"
        label="猜中奖励">
        <template slot="header" slot-scope="scope">
          猜中奖励
          <el-tooltip
          class="item"
          effect="dark"
          content="猜中奖励 = (每局所需Candy - 门票) x 每局参与人数"
          placement="top">
          <i class="el-icon-info"></i>
          </el-tooltip>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="phone"
        label="团长收益">
      </el-table-column> -->
      <el-table-column
        prop="createAt"
        label="组局时间">
        <template slot-scope="{row}">
          {{row.createAt ? $dayjs(row.createAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template scope="scope">
          <el-button type="text" @click="seeDetails(scope.row)">查看</el-button>
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
<el-dialog title="查看" :visible.sync="dialogTableVisible" width="59%">
  <div class="clearfix">
    <div class="fl" style="width:309px;">
      <h3 class="gmTitlebox" sty>每局详情</h3>
      <div class="ells">代币类型：<span>{{cliclRowData.coinName || coinName}}</span></div>
      <div class="ells">每局编号：<span>{{cliclRowData.roomSerial}}</span></div>
      <div class="ells">组局时间：<span>{{cliclRowData.createAt ? $dayjs(cliclRowData.createAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}</span></div>
      <div class="ells">场次名称：<span>{{cliclRowData.ruleName}}</span></div>
      <div class="ells">所需：<span>{{cliclRowData.entryWhalePeas}}</span></div>
      <div class="ells">门票：<span>{{cliclRowData.ticketWhalePeas}}</span></div>
      <div class="ells">是否猜中：<span>{{cliclRowData.statusType ? '是' : '否'}}</span></div>
      <div class="ells">猜中奖励：<span>{{cliclRowData.awardWhalePeas}}</span></div>
    </div>
    <div class="fr gmTable" style="width: calc(100% - 350px)">
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

  </div>
</template>

<script>
import { roomstatistic, gameDesk, roomlistQuery } from "@/api/games";
import { getGameCoinList } from "@/api/games";
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
        cliclRowData: {},
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
          turn: -1,
          binggo:-1,
          name: '',
          phone: '',
          email: '',
          code: ''
        },
        tableData: [],
        gridData: [],
        dialogTableVisible: false,
        loading: false,
        coinName: 'CANDY', //代币类型
        gameCoinList: [] //游戏代币类型列表
      }
    },
    created () {
      this.isAuth.isPermi(['game:rule:page']) && this.queryAllGameDeskList()
      this.isAuth.isPermi(['game:room:statistic']) && this.searchStatistic()
      this.getGameCoinList();
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
      // 获取游戏代币类型列表
      getGameCoinList(){
        let params = {
            gameType: this.sendTochildBridgeData.totalInformation.gameType,
          };
          getGameCoinList(params)
            .then((res) => {
              if (res.code === 200) {
                this.gameCoinList = res.data || [];
              } else {
                this.gameCoinList = [];
                this.$message.error(response.message);
              }
            })
            .catch((e) => {
            });
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
          gameType: this.sendTochildBridgeData.totalInformation.gameType,
          pageSize: 10000,
          statusType: -1,
          coinName: this.coinName
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
                gameType: this.sendTochildBridgeData.totalInformation.gameType,
                gameRuleId: this.queryParams.turn,
                pageSize: this.pageSize,
                phone: this.queryParams.phone,
                email: this.queryParams.email,
                roomSerial: this.queryParams.code,
                statusType: this.queryParams.binggo,
                userName: this.queryParams.name,
                coinName: this.coinName
              }
              this.loading = true
              roomlistQuery(_params).then(response => {
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
        let _params = {
          startTime: this.queryDate && this.$dayjs(this.queryDate[0]).format('YYYY-MM-DD'),
          endTime: this.queryDate && this.$dayjs(this.queryDate[1]).format('YYYY-MM-DD'),
          gameType: this.sendTochildBridgeData.totalInformation.gameType,
          coinName: this.coinName
        }
        this.loading = true
        roomstatistic(_params).then(response => {
          if (response.code === 200) {
            this.bigStatistic = response.data
            this.loading = false
          } else {
            this.bigStatistic = {
              totalTicketWhalePeas: 0,
              profitWhalePeas: 0,
              totalHeadcount: 0,
              totalGameRoom: 0
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
      // 代币类型变化回调
      changeTokenSelect(e){
        this.coinName = e.a || this.coinName;
        this.searchStatistic();
        this.queryAllGameDeskList();
        this.search(1);
      }
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

