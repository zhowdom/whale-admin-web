<template>
  <div class="redBackDetailsBox">
      <h3>平台收益汇总</h3>
      <div>
        <span>更新时间：</span>
        <el-date-picker
          v-model="regtimeTop"
          type="datetimerange"
          :default-time="['00:00:00', '23:59:59']"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至" 
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-button v-hasPermi="['internal:feeBonus:share:log:page']" type="primary" @click="searchTop(1)" style="margin-left:10px;">查询</el-button>
      </div>
      <div class="ttofuBox">
        <ul>
          <li v-for="(item, index) in tofuData" :key="index">
            <span>{{item.coinName}}</span>
            <p>{{item.earningAmount}}</p>
          </li>
        </ul>
      </div>



    <el-form :model="queryParams" :rules="rules" ref="queryForm" :inline="true">
<h3>平台收益明细</h3>
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

    <el-form-item label="From">
        <el-input
          v-model="queryParams.fromAddress"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="To">
        <el-input
          v-model="queryParams.toAddress"
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
      prop="earningAmount"
      label="收益"
      align="center">
    </el-table-column>
    <el-table-column
      prop="coinName"
      label="单位（代币）"
      align="center">
    </el-table-column>
    <el-table-column
      prop="earningRatio"
      label="平台服务费比例"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      prop="activityType"
      label="类型"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      prop="projectName"
      label="项目名字"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      prop="num"
      label="数量"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      prop="fromAddress"
      label="From"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      prop="toAddress"
      label="To"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      label="更新时间"
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



  </div>
</template>

<script>
import { nft_platfromStatic, nft_platfromDetail, nft_daiCoinSettingList } from "@/api/NFTMoudleManage";
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
        queryParams: {
          projectName: '',
          coinName: '',
          fromAddress: '',
          toAddress: '',
          nickName: '',
          walletAddress: '',
          email: '',
          websiteUrl: '',
          regtime: '',
        },
        tableData: [],
        loading: false,
        cloneRowData: {},
        daiCoinSettingArr: [], //代币列表
        tofuData: [],
        regtimeTop: '',
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
      this.searchTop()
      this.daiCoinSettingList();
    },
    mounted () {
      this.search(1)
    },
    watch: {},
    methods: {
      searchTop () {
        let datetime = [];
        datetime = this.regtimeTop;
        nft_platfromStatic({
          createEndTime: datetime ? datetime[1] : "",
          createStartTime: datetime ? datetime[0] : "",
        }).then(response => {
          if (response.code == 200) {
            this.tofuData = response.data.list || []
          } else {
            this.tofuData = []
          }
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
              createEndTime: datetime ? datetime[1] : "",
              createStartTime: datetime ? datetime[0] : "",
              currentPage: this.pageIndex,
              pageSize: this.pageSize,
              ...this.queryParams,
            }
            this.loading = true
            nft_platfromDetail(_params).then(response => {
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
      }
    }
  }
</script>

<style lang="scss">
.redBackDetailsBox{
  padding: 20px;
  .ttofuBox{
    li{
      padding: 10px;
      display: inline-block;
      border-radius: 5px;
      border:1px solid #409eff;
      text-align: center;
      p{
        padding: 0;
        margin: 0;
        margin-top: 10px;
      }
    }
  }
}
</style>
