<template>
  <div class="seeInfosEachissueBox">


    <el-form :model="nLevelqueryParams" :rules="nLevelrules" ref="nLevelqueryForm" :inline="true">
      <el-form-item label="当前期编号" prop="currentPeriodNo">
        <el-input
          v-model.trim="nLevelqueryParams.currentPeriodNo"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 100px"
        />
      </el-form-item>
      <el-form-item label="盲盒编号" prop="blindBoxNo">
        <el-input
          v-model.trim="nLevelqueryParams.blindBoxNo"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 100px"
        />
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="nLevelqueryParams.blindBoxType" clearable placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="魔力盲盒专场" :value="1"></el-option>
          <el-option label="Candy管制专场" :value="2"></el-option>
          <el-option label="魔力小盲盒" :value="3"></el-option>
        </el-select>
    </el-form-item>
      <el-form-item label="用户ID" prop="memberId">
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
      
      <el-form-item label="更新时间" prop="redbacktime">
        <el-date-picker
          v-model="nLevelqueryParams.redbacktime"
          type="daterange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="VIP权益">

        <el-select clearable v-model="nLevelqueryParams.giveId" placeholder="请选择">
          <el-option
            v-for="item in gameCouponsArrGive"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

    </el-form-item>
      
       

      <el-form-item>
        <el-button v-hasPermi="['blindBox:order_give:all_page']" type="primary" :loading="loading" icon="el-icon-search" @click="searchnLevel(1)">查询</el-button>
      </el-form-item>
    </el-form>
    <p style="color:#3c3c3c;font-size:13px;">
      累计VIP券（张)：<span style="font-weight:bold;color:orange;">{{giveNumTotal}}</span>
    </p>
  <el-table :data="nLevelData" border>
    <el-table-column property="currentPeriodNo" label="当前期编号"></el-table-column>
    <el-table-column property="blindBoxType" label="类型">
      <template scope="scope">
        <p v-if="+scope.row.blindBoxType === 1">魔力盲盒专场</p>
        <p v-else-if="+scope.row.blindBoxType === 2">Candy销毁专场</p>
        <p v-else-if="+scope.row.blindBoxType === 3">魔力小盲盒</p>
      </template>
    </el-table-column>
    <el-table-column property="blindBoxNo" label="盲盒编号"></el-table-column>
    <el-table-column property="period" label="期数"></el-table-column>
    <el-table-column property="memberId" label="用户ID"></el-table-column>
    <el-table-column property="realName" label="真实姓名"></el-table-column>
    <el-table-column property="giveNum" label="VIP券（张）"></el-table-column>
    <el-table-column property="giveName" label="VIP类型"></el-table-column>

    <el-table-column property="updateTime" label="更新时间">
      <template slot-scope="{row}">
        {{row.updateTime ? $dayjs(row.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
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
    <el-dialog :title="`盲盒实物(第${curClickRowData.periods}期)`" :visible.sync="cmbTableVisible">
      <el-form :model="cm_nLevelqueryParams" :rules="nLevelrules" ref="nLevelqueryForm" :inline="true">
        <el-form-item label="子订单号" prop="orderItemNo">
          <el-input
            v-model.trim="cm_nLevelqueryParams.orderItemNo"
            placeholder="请输入"
            clearable
            size="small"
            style="width: 100px"
          />
        </el-form-item>
        <el-form-item label="货号" prop="itemNo">
          <el-input
            v-model.trim="cm_nLevelqueryParams.itemNo"
            placeholder="请输入"
            clearable
            size="small"
            style="width: 100px"
          />
        </el-form-item>
        <el-form-item label="实物名称" prop="itemName">
          <el-input
            v-model.trim="cm_nLevelqueryParams.itemName"
            placeholder="请输入"
            clearable
            size="small"
            style="width: 100px"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="loading" @click="cmbTableSearch(1)" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="cmbTableData">
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
import { blindBoxRuleAddCouponsGive, earningsRewardLimitStatistics_taskVip, blindBoxRuleAddCoupons, blindBoxDetailsProfit, blindBoxDetailsGetByLockPage, blindBoxPurchaseInfoItemQuery, takejewelCodeList, zzJoyPoorTotalSwitchList } from "@/api/games";
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
        cmbTableData: [],
        cm_nLevelqueryParams: {
          orderItemNo: '',
          itemNo: '',
          itemName: ''
        },
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
          giveId: '',
          currentPeriodNo: '',
          blindBoxType: '',
          blindBoxNo: '',
          memberId: '',
          realName: '',
          periods: '',
          redbacktime: '',
          repeatRule: '',
          repeatFlag: ''

        },
        nLevelPrizeTitle: '',
        pageIndexnLevel: 1,
        pageSizenLevel: 10,
        totalPagenLevel: 0,
        nLevelData: [],
        nLevelPrizesVisible: false,
        loading: false,
        curClickRowData: {},
        whalePeas: '',
        giveNumTotal: '',
        thirdPayPrice: '',
        gameCouponsArr: [],
        gameCouponsArrGive: [],
      }
    },
    mounted () {
      this.searchnLevel(1)
      // this.blindBoxRuleAddCouponsRun()
      this.blindBoxRuleAddCouponsRunGive()
    },
    watch: {},
    methods: {
      // [give:赠送VIP权益]下拉数据
      blindBoxRuleAddCouponsRunGive () {
        blindBoxRuleAddCouponsGive({
          itemType: 3 // 赠送VIP权益
        }).then(response => {
          if (+response.code === 200) {
            this.gameCouponsArrGive = (response.data.list || []).map(v => {
              let {id, signTime, signUnit} = v
              let _unitDes = ''
              switch (signUnit)
              {
                case 'd':
                  _unitDes = '天'
                  break;
                case 'M':
                  _unitDes = '月'
                  break;
                case 'y':
                  _unitDes = '年'
                  break;
              }
              return {
                value: id,
                label: signTime + _unitDes
              }
            })
          } else {
            this.gameCouponsArrGive = []
          }
        }).catch(e => {
          console.log(e)
        })
      },
      // 赠送盲盒奖励券下拉数据
      blindBoxRuleAddCouponsRun () {
        blindBoxRuleAddCoupons({
          currentPage: 1,
          pageSize: 30,
          statusType: 1,
          taskType: 8
        }).then(response => {
          if (+response.code === 200) {
            this.gameCouponsArr = (response.data.list || []).map(v => {
              let {id, taskName} = v
              return {
                value: id,
                label: taskName
              }
            })
          } else {
            this.gameCouponsArr = []
          }
        }).catch(e => {
          console.log(e)
        })
      },
      // 盲盒通用table-s
      cmbTableSearch (pgi) {
        this.$refs['nLevelqueryForm'].validate((valid) => {
          if (valid) {
            // todo...
            if (pgi) this.cmbTablepageIndex = pgi
            let _params = {
              currentPage: this.cmbTablepageIndex,
              pageSize: this.cmbTablepageSize,
              memberId: this.curClickRowData.memberId,
              currentPeriodNo: this.curClickRowData.currentPeriodNo,
              blindBoxType: this.curClickRowData.blindBoxType,
              blindBoxNo: this.curClickRowData.blindBoxNo,
              periods: this.curClickRowData.periods,
              itemName: this.cm_nLevelqueryParams.itemName,
              itemNo: this.cm_nLevelqueryParams.itemNo,
              orderItemNo: this.cm_nLevelqueryParams.orderItemNo
            }
            this.loading = true
            blindBoxPurchaseInfoItemQuery(_params).then(response => {
              if (response.code === 200) {
                this.cmbTableData = response.data.list
                this.cmbTabletotalPage = response.data.total
                this.loading = false
              } else {
                this.cmbTableData = []
                this.cmbTabletotalPage = 0
                this.cmbTablepageSize = 10
                this.loading = false
                this.$message.error(response.message)
              }
            }).catch(e => {
              this.loading = false
            })
          }
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
        this.curClickRowData = Object.assign({}, row)
      },
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
              // blindBoxNo: this.$route.query.blindBoxNo,
              giveId: this.nLevelqueryParams.giveId,
              blindBoxNo: this.nLevelqueryParams.blindBoxNo,
              blindBoxType: this.nLevelqueryParams.blindBoxType,
              currentPage: this.pageIndexnLevel,
              currentPeriodNo: this.nLevelqueryParams.currentPeriodNo,
              memberId: this.nLevelqueryParams.memberId,
              pageSize: this.pageSizenLevel,
              realName: this.nLevelqueryParams.realName,
              giveType: 2,
              endTime: datetime ? this.$dayjs(datetime[1]).format('YYYY-MM-DD') : '',
              startTime: datetime ? this.$dayjs(datetime[0]).format('YYYY-MM-DD') : '',
            }
            this.loading = true
            earningsRewardLimitStatistics_taskVip(_params).then(response => {
              if (response.code === 200) {
                this.nLevelData = response.data.pageRes.list
                this.giveNumTotal = response.data.giveNum || 0
                this.totalPagenLevel = response.data.pageRes.total
                this.loading = false
              } else {
                this.nLevelData = []
                this.giveNumTotal = 0
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
    }
  }
</script>

<style lang="scss" scoped>
.seeInfosEachissueBox{}
</style>

