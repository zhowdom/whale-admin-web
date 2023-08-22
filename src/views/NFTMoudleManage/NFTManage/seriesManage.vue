<template>
  <div class="redBackDetailsBox">
     
    <el-form :model="queryParams" :rules="rules" ref="queryForm" :inline="true">
      <el-form-item label="系列名字：">
          <el-input
            v-model="queryParams.name"
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

    <el-form-item label="创作者：">
      <el-input
        v-model="queryParams.walletAddr"
        placeholder="请输入"
        clearable
        size="small"
        style="width: 240px"
      />
    </el-form-item>

    <el-form-item label="类别：">
      <el-select v-model="queryParams.categoryId" clearable placeholder="请选择">
        <el-option label="全部" value=""></el-option>
        <el-option v-for="(item, index) in seriesTypeArr" :label="item.label" :disabled="item.disable" :value="item.value" :key="index"></el-option>
      </el-select>
    </el-form-item>

      <el-form-item label="更新时间：">
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
      prop="name"
      label="系列名字"
      align="center">
    </el-table-column>
    <el-table-column
      prop="describe"
      label="系列描述"
      align="center">
    </el-table-column>
    
    <el-table-column
      label="创作者收益"
      align="center">
      <template scope="scope">
        <span>{{scope.row._calced}}%</span>
      </template>
    </el-table-column>
    <el-table-column
      label="收益地址"
      align="center">
      <template scope="scope">
        <a @click="seeAddr(scope.row.creatorFee)" style="text-decoration:underline;color:#1890ff;">{{scope.row.creatorFee.length}}</a>
      </template>
    </el-table-column>
    <el-table-column
      prop="chainId"
      label="链"
      align="center">
    </el-table-column>
    <el-table-column
      prop="categoryName"
      label="类别"
      align="center">
    </el-table-column>
    <el-table-column
      label="项目"
      align="center">
      <template scope="scope">
        <span @click="jumpTo(scope.row)">{{scope.row.projectNum}}</span>
      </template>
    </el-table-column>
    
    <el-table-column
      prop="payCoinName"
      label="付款代币"
      align="center">
    </el-table-column>
    <el-table-column
      prop="memberWalletAddr"
      label="创作者"
      align="center">
    </el-table-column>
    <el-table-column
      label="是否属于热门系列"
      align="center">
      <template scope="scope">
        <a @click="popularChange(scope.row)" style="text-decoration:underline;color:#1890ff;">{{scope.row.popular ? '是' : '否'}}</a>
      </template>
    </el-table-column>

    <el-table-column
      label="创建日期"
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


  <el-dialog
  title=""
  :visible.sync="dialogVisible"
  width="20%">
  <span>热门系列：</span>
  <el-radio v-model="ispopular" label="1">是</el-radio>
  <el-radio v-model="ispopular" label="0">否</el-radio>
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="savepopular">确 定</el-button>
  </span>
</el-dialog>

<el-dialog
  title="收益地址"
  :visible.sync="dialogVisibleAddress"
  width="30%">
  <ul>
    <li v-for="(item, index) in addressArr" :key="index" class="clearfix" style="padding-bottom:10px;"><span class="fl">{{item.addr}}</span><span class="fr">{{item.ratio}}%</span></li>
  </ul>
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="dialogVisibleAddress = false">确 定</el-button>
  </span>
</el-dialog>



  </div>
</template>

<script>
import { nft_seriesTypeSelect, nft_seriesManagePage, nft_changePopular, nft_seriesManageInfo, nft_daiCoinSettingList } from "@/api/NFTMoudleManage";
import { daiCoinSettingList } from "@/api/xhgjSpark_api/daiCoinSetting.js";
import handleNumPow from '@/utils/handleNumPow';
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
        addressArr: [],
        dialogVisibleAddress: false,
        dialogVisible: false,
        ispopular: '0',
        seriesTypeArr: [],
        rules: {
          phone: [
            { validator: validatePhone, trigger: 'blur' }
          ]
        },
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        gridData: [],
        queryParams: {
          categoryId: '',
          walletAddr: '',
          name: '',
          coinName: '',
          fromAddress: '',
          toAddress: '',
          nickName: '',
          walletAddress: '',
          email: '',
          websiteUrl: '',
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
      this.nft_seriesTypeSelectRun();
    },
    mounted () {
      this.search(1)
    },
    watch: {},
    methods: {
      jumpTo (row) {
        // this.$router.push({
        //   path: '/NFT_MoudleManage/NFT_Manage/nftprojectManage',
        //   query: {
        //     id: ''
        //   }
        // })
      },
      seeAddr (arr) {
        this.addressArr = arr
        this.dialogVisibleAddress = true
      },
      savepopular () {
        nft_changePopular({
          id: this.curInnerID
        }).then((response) => {
          if (response.code === 200) {
            this.dialogVisible = false
            this.$message({
              message: '操作成功',
              type: 'success',
              'duration': 1000,
              onClose: () => {
                this.search(1)
              }
            })
          } else {
            this.$message.error(response.message);
          }
        });
      },
      popularChange (row) {
        this.curInnerID = row.id
        this.ispopular = row.popular+''
        this.dialogVisible = true
      },
      nft_seriesTypeSelectRun() {
        nft_seriesTypeSelect({}).then((response) => {
          if (response.code === 200) {
            this.seriesTypeArr = response.data.list || [];
          } else {
            this.seriesTypeArr = [];
            this.$message.error(response.message);
          }
        });
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
            nft_seriesManagePage(_params).then(response => {
              if (response.code === 200) {
                this.tableData = (response.data.list || []).map(v => {
                  let {creatorFee, categoryId, ...a} = v
                  let _calced = creatorFee.reduce((initalVal, cur) => {
                    return initalVal + cur.ratio
                  }, 0)
                  let _item = this.seriesTypeArr.find(ik => ik.value == categoryId)
                  return {
                    _calced: handleNumPow(_calced, 2),
                    creatorFee,
                    categoryName: _item.label,
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
}
</style>
