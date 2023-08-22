<template>
  <div class="redBackDetailsBox">
     
    <el-form :model="queryParams" :rules="rules" ref="queryForm" :inline="true">

      <el-form-item label="活动">
      <el-select v-model="queryParams.eventType" clearable placeholder="请选择">
        <el-option label="全部" :value="null"></el-option>
        <el-option label="铸造" :value="1"></el-option>
        <el-option label="刊登" :value="2"></el-option>
        <el-option label="销售" :value="3"></el-option>
        <el-option label="转移" :value="4"></el-option>
        <el-option label="删除" :value="5"></el-option>
        <el-option label="更换系列" :value="6"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="项目名字：">
      <el-input
        v-model="queryParams.projectName"
        placeholder="请输入"
        clearable
        size="small"
        style="width: 240px"
      />
    </el-form-item>

    <el-form-item label="单位（代币）">
      <el-select v-model="queryParams.coinName" clearable placeholder="请选择">
        <el-option label="全部" value=""></el-option>
        <el-option v-for="(item, index) in daiCoinSettingArr" :label="item" :value="item" :key="index"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="From：">
      <el-input
        v-model="queryParams.fromWalletAddr"
        placeholder="请输入"
        clearable
        size="small"
        style="width: 240px"
      />
    </el-form-item>

    <el-form-item label="To：">
      <el-input
        v-model="queryParams.toWalletAddr"
        placeholder="请输入"
        clearable
        size="small"
        style="width: 240px"
      />
    </el-form-item>

      <el-form-item label="更新时间">
        <el-date-picker
          v-model="queryParams.regtime"
          type="datetimerange"
          :default-time="['00:00:00', '23:59:59']"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至" 
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
    </el-form-item>
    


      <el-form-item>
        <el-button v-hasPermi="['internal:feeBonus:share:log:page']" type="primary" :loading="loading" icon="el-icon-search" @click="search(1)">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
    :data="tableData"
    v-loading="loading"
    border
    style="width: 100%">
    <el-table-column
      label="活动"
      align="center">
      <template scope="scope">
        <p v-if="scope.row.eventType == 1">铸造</p>
        <p v-else-if="scope.row.eventType == 2">刊登</p>
        <p v-else-if="scope.row.eventType == 3">销售</p>
        <p v-else-if="scope.row.eventType == 4">转移</p>
        <p v-else-if="scope.row.eventType == 5">删除</p>
        <p v-else-if="scope.row.eventType == 6">更换系列</p>
      </template>
    </el-table-column>
    <el-table-column
      prop="projectName"
      label="项目名字"
      align="center">
    </el-table-column>
    <el-table-column
      prop="projectDescribe"
      label="项目描述"
      align="center">
    </el-table-column>
    <el-table-column
      prop="seriesName"
      label="归属系列"
      align="center">
    </el-table-column>
    <el-table-column
      prop="tokenAddress"
      label="合约地址"
      align="center">
    </el-table-column>
    
    <el-table-column
      label="代币标准"
      align="center">
      <template scope="scope">
        <span v-if="scope.row.tokenType == 1">ERC20</span>
        <span v-else-if="scope.row.tokenType == 2">ERC721</span>
        <span v-else-if="scope.row.tokenType == 3">ERC1155</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="chainId"
      label="链"
      align="center">
    </el-table-column>
    <el-table-column
      prop="freezeMetadata"
      label="元数据"
      align="center">
      <template scope="scope">
        <span>{{scope.row.freezeMetadata ? '中心化' : '去中心化'}}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="创作者收益"
      align="center">
      <template scope="scope">
        <span>{{scope.row._calced}}%</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="fromMemberWalletAddr"
      label="From"
      align="center">
    </el-table-column>
    <el-table-column
      prop="toMemberWalletAddr"
      label="To"
      align="center">
    </el-table-column>
    
    <el-table-column
      label="创建时间"
      width="120"
      align="center">
      <template slot-scope="{row}">
        {{row.createTime ? $dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
    </el-table-column>
    
    
    
  </el-table>
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


<!--查看-->
<el-dialog title="" :visible.sync="visibleIn" width="80%">
  <el-form :model="queryParams2" :inline="true">
    <el-form-item label="钱包地址：">
        <el-input
          v-model="queryParams2.walletAddress"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="From项目名字：">
        <el-input
          v-model="queryParams2.projectName"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>

      <el-form-item label="创建日期">
        <el-date-picker
          v-model="queryParams2.regtime"
          type="datetimerange"
          :default-time="['00:00:00', '23:59:59']"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至" 
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
    </el-form-item>

      <el-form-item>
        <el-button v-hasPermi="['internal:feeBonus:share:log:page']" type="primary" icon="el-icon-search" @click="searchIn(1)">查询</el-button>
      </el-form-item>
    </el-form>

  <el-table :data="gridData">
    <el-table-column property="memberId" label="用户ID"></el-table-column>
    <el-table-column property="walletAddress" label="钱包地址"></el-table-column>
    <el-table-column property="coinName" label="单位（代币）"></el-table-column>
    <el-table-column property="creatorAmount" label="创作者收益"></el-table-column>
    <el-table-column property="earnAmount" label="赚取费用"></el-table-column>
    <el-table-column property="activityType" label="活动"></el-table-column>
    <el-table-column property="num" label="数量"></el-table-column>
    <el-table-column property="projectName" label="From项目名字"></el-table-column>
    <el-table-column property="createTime" label="更新时间" width="180">
      <template slot-scope="{row}">
        {{row.createTime ? $dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    style="padding-top:20px;"
    @current-change="searchIn"
    :page-sizes="[10, 20, 30]"
    @size-change="handleSizeChangeIn"
    :current-page.sync="pageIndexIn"
    :page-size="pageSizeIn"
    layout="total, sizes, prev, pager, next, jumper"
    :total="totalPageIn">
    </el-pagination>

</el-dialog>


  </div>
</template>

<script>
import { nft_projectRecordPage, nft_userDetailIn, nft_daiCoinSettingList } from "@/api/NFTMoudleManage";
import { daiCoinSettingList } from "@/api/xhgjSpark_api/daiCoinSetting.js";
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
        rules: {
          phone: [
            { validator: validatePhone, trigger: 'blur' }
          ]
        },
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        pageIndexIn: 1,
        pageSizeIn: 10,
        totalPageIn: 0,
        gridData: [],
        visibleIn: false,
        queryParams: {
          eventType: null,
          projectName: '',
          coinName: '',
          fromWalletAddr: '',
          toWalletAddr: '',
          regtime: '',
        },
        queryParams2: {
          walletAddress: '',
          projectName: '',
          regtime: '',
        },
        tableData: [],
        loading: false,
        cloneRowData: {},
        daiCoinSettingArr: [], //代币列表
        tofuData: [],
        regtimeTop: '',
        curInnerID: null,
      }
    },
    filters: {
      valTransfer (val) {
        if (val === null || val === '') {
          return '-'
        } else {
          return `${((val * 100).toFixed(2) + '').replace(/(?:\.0*|(\.\d+?)0+)$/, '$1')}%`
        }
      }
    },
    created () {
      this.daiCoinSettingList();
    },
    mounted () {
      this.search(1)
    },
    watch: {},
    methods: {
      havasee (id) {
        this.curInnerID = id
        this.visibleIn = true
        this.queryParams2 = {
          walletAddress: '',
          projectName: '',
          regtime: '',
        }
        this.searchIn(1)
      },
      searchIn (pgi) {
        if (pgi) this.pageIndexIn = this.pageIndexIn
        let datetime = [];
        datetime = this.queryParams2.regtime;
        let _params = {
          memberId: this.curInnerID,
          createEndTime: datetime ? datetime[1] : "",
          createStartTime: datetime ? datetime[0] : "",
          currentPage: this.pageIndexIn,
          pageSize: this.pageSizeIn,
          ...this.queryParams2,
        }
        nft_userDetailIn(_params).then(response => {
          if (response.code === 200) {
            this.gridData = response.data.list
            this.totalPageIn = response.data.total
          } else {
            this.gridData = []
            this.totalPageIn = 0
            this.pageSizeIn = 10
            this.$message.error(response.message)
          }
        }).catch( e => {
          console.log(e)
        })
      },
      daiCoinSettingList() {
        nft_daiCoinSettingList({}).then((response) => {
          if (response.code === 200) {
            this.daiCoinSettingArr = JSON.parse(JSON.stringify(response.data.list));
          } else {
            this.daiCoinSettingArr = [];
            this.$message.error(response.message);
          }
        });
      },
      search (pgi) {
        this.$refs['queryForm'].validate((valid) => {
          if (valid) {
            if (pgi) this.pageIndex = this.pageIndex
            let datetime = [];
            datetime = this.queryParams.regtime;
            let _params = {
              endTime: datetime ? datetime[1] : "",
              startTime: datetime ? datetime[0] : "",
              currentPage: this.pageIndex,
              pageSize: this.pageSize,
              ...this.queryParams,
            }
            this.loading = true
            nft_projectRecordPage(_params).then(response => {
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
            }).catch( e => {
              this.loading = false
            })
          }
        })
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.search()
      },
      handleSizeChangeIn (val) {
        this.pageSizeIn = val
        this.pageIndexIn = 1
        this.searchIn()
      }
    }
  }
</script>

<style lang="scss">
.redBackDetailsBox{
  padding: 20px;
}
</style>
