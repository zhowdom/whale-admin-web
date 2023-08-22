<template>
  <div class="userpower_Wrapper">
    <div class="topshow">
      <el-form :model="queryParams" ref="queryForm" :rules="rules" :inline="true" class="mytopformstyle">
        <el-form-item label="邀请码" prop="inviteCode" style="padding-bottom:20px;">
          <el-input clearable v-model="queryParams.inviteCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
            <el-input clearable v-model="queryParams.nickname" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="注册类型" prop="registeredType">
          <el-select v-model="queryParams.registeredType" clearable placeholder="请选择" @change="handleChangeType">
            <el-option label="手机号" :value="1"></el-option>
            <el-option label="邮箱" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <template v-if="queryParams.registeredType == 1">
          <el-form-item label="区号" prop="areaCode">
            <el-select v-model="queryParams.areaCode" clearable placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(item, index) in telPerfixArr" :label="item.label" :value="item.value" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账号" prop="phone">
            <el-input clearable  v-model="queryParams.phone" placeholder="请输入"></el-input>
          </el-form-item>
        </template>
        <el-form-item label="账号" prop="email" v-if="queryParams.registeredType == 2">
          <el-input clearable  v-model="queryParams.email" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="转账平台" prop="platformName">
          <el-select v-model="queryParams.platformName" clearable placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, key, index) in transferList" :label="item" :value="key" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="代币" prop="coinName">
            <el-select v-model="queryParams.coinName" clearable placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(item, index) of daiCoinSettingList" :label="item" :value="item" :key="index"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="更新时间" prop="jointimeSelected">
          <el-date-picker
            v-model="jointimeSelected"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="" style="border:none;">
            <el-button v-hasPermi="['wallet:member:blockchain:page']" :loading="loading" type="primary" icon="el-icon-search" @click="search(1)">查询</el-button>
            <el-button v-hasPermi="['wallet:member:blockchain:capital:pooling:batch']" :loading="loading" type="primary" :disabled="batchBool" @click="handleBatchEdit">批量归集</el-button>
        </el-form-item>
        <el-form-item>
          （查询【账号】前，需选择 【注册类型】）
        </el-form-item>
      </el-form>
    </div>
    <div class="task-table">
      <!--table-->
      <el-table
      :data="tableData"
      v-loading="loading"
      @selection-change="handleSelectionChange"
      style="width: 100%">
        <el-table-column type="selection" width="55" :selectable="selectable"></el-table-column>
        <el-table-column prop="inviteCode" label="邀请码" align="center" min-width="120"></el-table-column>
        <el-table-column prop="nickname" label="昵称" align="center" min-width="120"></el-table-column>
        <el-table-column align="center" min-width="100" label="注册类型">
            <template scope="scope">
              <span v-if="scope.row.registeredType == 1">手机号</span>
              <span v-else-if="scope.row.registeredType == 2">邮箱</span>
            </template>
        </el-table-column>
        <el-table-column prop="phone" label="账号" align="center" min-width="120">
          <template scope="scope">
            <p v-if="+scope.row.registeredType === 1">
              {{scope.row.account}}
            </p>
            <p v-else-if="+scope.row.registeredType === 2">
              {{scope.row.email}}
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="platformName" label="转账平台" align="center" min-width="120">
          <template slot-scope="{row}">
            {{transferList[row.platformName]}}
          </template>
        </el-table-column>
        <el-table-column prop="coinName" label="代币" align="center" min-width="120"></el-table-column>
        <el-table-column prop="balance" label="代币余额" align="center" min-width="120"></el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" align="center" min-width="160">
          <template slot-scope="{row}">
            {{row.updatedAt ? $dayjs(row.updatedAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template scope="scope">
            <el-button v-hasPermi="['wallet:member:blockchain:capital:pooling:batch']" v-if="scope.row.balance != 0" type="text" size="mini" @click="handelEdit(scope.row)">手动归集</el-button>
            <el-button v-hasPermi="['wallet:member:blockchain:capital:pooling:page']" type="text" size="mini" @click="handelDetails(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--table-->
      <div class="table-pagination text-right mt10">
        <el-pagination
        @current-change="search"
        :page-sizes="[10, 20, 30]"
        @size-change="handleSizeChange"
        :current-page.sync="pageIndex"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
        </el-pagination>
      </div>
    </div>
    <!--批量归集Dialog-->
    <el-dialog width="20%" title="提示" :visible.sync="dialogFormVisible">
      <h2 class="text-center">
        确定要归集？
      </h2>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm()" :loading="submitLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { transferListPlatform, daiCoinSettingList, blockchainPage, batchCashsweepModify } from "@/api/xhgjSpark_api/daiCoinSetting.js";
import {userAreaPhone} from '@/api/pointsMgmt/starTasks';
  export default {
    components: {},
    data () {
      return {
        loading: false,
        submitLoading: false,
        tableData: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dialogFormVisible: false,
        transferList: {},
        daiCoinSettingList: [],
        jointimeSelected: '',
        queryParams: {
          inviteCode: '',
          nickname: '',
          registeredType: 1,
          phone: '',
          coinName: '',
          areaCode: '',
          email: '',
          platformName: '',
        },
        rules: {
          
        },
        multipleSelection: [],
        selectId: '',
        singleUpdata: false,
        batchBool: true,
        telPerfixArr: [],
      }
    },
    mounted () {
      // this.search();
      this.getTransferList();
      this.getDaiCoinSettingList();
      this.getAreaCode();
    },
    watch: {},
    methods: {
      getAreaCode() {
        userAreaPhone().then(response => {
          if (+response.code === 200) {
            this.telPerfixArr = response.data.list || [];
          }
        })
      },
      getTransferList() {
        transferListPlatform({}).then(response => {
          if (response.code === 200) {
            this.transferList = response.data
          } else {
            this.transferList = {}
            this.$message.error(response.message)
          }
        })
      },
      getDaiCoinSettingList() {
        daiCoinSettingList({}).then(response => {
          if (response.code === 200) {
            this.daiCoinSettingList = response.data
          } else {
            this.daiCoinSettingList = []
            this.$message.error(response.message)
          }
        })
      },
      // 选择注册类型
      handleChangeType() {
        this.queryParams.areaCode = '';
        this.queryParams.phone = '';
        this.queryParams.email = '';
      },
      handelEdit(row) {
        this.dialogFormVisible = true;
        this.singleUpdata = true;
        this.selectId = row.bid;
      },
      handleBatchEdit(row) {
        this.dialogFormVisible = true;
        this.singleUpdata = false;
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.search()
      },
      // 数据查询
      search (pgi) {
        this.$refs['queryForm'].validate((valid) => {
          if (valid) {
            if (pgi) this.pageIndex = pgi;
            let datetime = [];
            datetime = this.jointimeSelected;
            let _params = {
              currentPage: this.pageIndex,
              pageSize: this.pageSize,
              startTime: datetime ? datetime[0] : '',
              endTime: datetime ? datetime[1] : '',
              ...this.queryParams
            }
            this.loading = true
            blockchainPage(_params).then(response => {
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
      selectable(row, index) {
        return row.balance == 0 ? false : true;
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        if(this.multipleSelection.length > 0) {
          this.batchBool = false;
        }else {
          this.batchBool = true;
        }
      },
      submitForm() {
        let arr = [];
        if(this.singleUpdata) {
          arr.push(this.selectId);
        }else {
          this.multipleSelection.forEach(item => {
            arr.push(item.bid);
          })
        }
        let _params = {
          datas: arr,
        }
        batchCashsweepModify(_params).then(response => {
          if (response.code === 200) {
            this.msgSuccess(`归集指令已提交，等待矿工确认`)
            this.search(1);
          } else {
            this.msgSuccess(response.message)
          }
          this.dialogFormVisible = false;
          this.singleUpdata = false;
          setTimeout(() => {
            this.submitLoading = false;
          },1000)
        })
      },
      // 查看
      handelDetails(row) {
        const query = {
          memberId: '',
          platformName: '',
          coinName: '',
          nickname: '',
          inviteCode: row.inviteCode,
          routePath: 'moneyCollectLog',
        };
        const curView = this.$route;
        const path = 'moneyCollectLogForDetails';

        this.$store.dispatch('tagsView/delView', curView).then(() => {
          this.$nextTick(() => {
            this.$router.replace({path, query});
          });
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
.userpower_Wrapper{
  padding: 20px;
}
</style>
