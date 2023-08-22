<template>
  <div class="userpower_Wrapper">
    <div class="topshow">
      <el-form :model="queryParams" ref="queryForm" :inline="true" class="mytopformstyle">
        <el-form-item label="角色" prop="status">
          <el-select v-model="queryParams.memberType" clearable placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="普通用户" :value="0"></el-option>
            <el-option label="广告商" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邀请码" prop="inviteCode">
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
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" clearable placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="正常" :value="0"></el-option>
            <el-option label="限制交易" :value="1"></el-option>
            <el-option label="冻结账户" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="更新时间" prop="jointimeSelected">
          <el-date-picker
            v-model="jointimeSelected"
            type="daterange"
            value-format="timestamp"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="解封时间" prop="jointimeSelected2">
          <el-date-picker
            v-model="jointimeSelected2"
            type="daterange"
            value-format="timestamp"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="" style="border:none;">
            <el-button v-hasPermi="['advertising:violation:page']" :loading="loading" type="primary" icon="el-icon-search" @click="search(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--table-->
    <el-table
    :data="tableData"
    border
    v-loading="loading"
    class="userpowerbox"
    style="width: 100%">
      <el-table-column
        prop="inviteCode"
        align="center"
        label="邀请码">
      </el-table-column>
      <el-table-column
        align="center"
        prop="nickname"
        label="昵称">
      </el-table-column>
      <el-table-column
        align="center"
        label="注册类型">
          <template scope="scope">
            <span v-if="scope.row.registeredType == 1">手机号</span>
            <span v-else-if="scope.row.registeredType == 2">邮箱</span>
          </template>
      </el-table-column>
      <el-table-column
        prop="account"
        align="center"
        label="账号">
        <template scope="scope">
          <p v-if="+scope.row.registeredType === 1">
            {{scope.row.account}}
          </p>
          <p v-else-if="+scope.row.registeredType === 2">
            {{scope.row.email}}
          </p>
        </template>
      </el-table-column>
      <el-table-column
          prop="memberType"
          align="center"
          label="角色">
          <template scope="scope">
            <p v-if="+scope.row.memberType === 1">普通用户</p>
            <p v-else-if="+scope.row.memberType === 2">广告商</p>
          </template>
      </el-table-column>
      <el-table-column
          prop="limitCancelNum"
          align="center"
          maxlength="11"
          label="取消次数(限制)">
      </el-table-column>
      <el-table-column
          prop="frozenCancelNum"
          align="center"
          maxlength="11"
          label="取消次数（冻结）">
      </el-table-column>
      <el-table-column
          prop="limitTimeoutNotPayNum"
          align="center"
          maxlength="11"
          label="超时未支付次数（限制）">
      </el-table-column>
      <el-table-column
          prop="frozenTimeoutNotPayNum"
          align="center"
          maxlength="11"
          label="超时未付款次数（冻结）">
      </el-table-column>
      <el-table-column
          prop="limitAppealNum"
          align="center"
          maxlength="11"
          label="恶意申诉次数（限制）">
      </el-table-column>
      <el-table-column
          prop="frozenAppealNum"
          align="center"
          maxlength="11"
          label="恶意申诉次数（冻结）">
      </el-table-column>
      <el-table-column
          prop="modifyAt"
          align="center"
          width="180"
          label="更新时间">
          <template slot-scope="{row}">
            {{row.modifyAt ? $dayjs(row.modifyAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
          </template>
      </el-table-column>
      <el-table-column
          prop="type"
          align="center"
          maxlength="11"
          label="违规原因">
          <template scope="scope">
            <p v-if="+scope.row.type === 0">取消</p>
            <p v-else-if="+scope.row.type === 1">超时未付款</p>
            <p v-else-if="+scope.row.statypetus === 2">恶意申诉</p>
          </template>
      </el-table-column>
      <el-table-column
          prop="status"
          align="center"
          maxlength="11"
          label="状态">
          <template scope="scope">
            <p v-if="+scope.row.status === 0">正常</p>
            <p v-else-if="+scope.row.status === 1">限制交易</p>
            <p v-else-if="+scope.row.status === 2">冻结账户</p>
          </template>
      </el-table-column>
      <el-table-column
          prop="timeLength"
          align="center"
          maxlength="11"
          label="时长">
      </el-table-column>
      <el-table-column
          prop="unlockAt"
          align="center"
          width="180"
          label="解封时间">
          <template slot-scope="{row}">
            {{row.unlockAt ? $dayjs(row.unlockAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
          </template>
      </el-table-column>
      <el-table-column
          prop="remark"
          align="center"
          maxlength="11"
          label="备注">
      </el-table-column>
      <el-table-column
          prop="modifyBy"
          align="center"
          maxlength="11"
          label="操作人">
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button v-hasPermi="['advertising:violation:edit']" v-if="+scope.row.status !== 0" type="text" @click="handelClick(scope.row, 1)">解封</el-button>
          <el-button v-hasPermi="['advertising:violation:edit']" v-if="+scope.row.status === 0" type="text" @click="handelClick(scope.row, 2)">限制</el-button>
          <el-button v-hasPermi="['advertising:violation:edit']" v-if="+scope.row.status === 0" type="text" @click="handelClick(scope.row, 3)">冻结</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--table-->
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
import { atInfractionOperation, atInfractionQuery } from "@/api/adsTreasure";
import {userAreaPhone} from '@/api/pointsMgmt/starTasks';
  export default {
    components: {},
    data () {
      return {
        loading: false,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        input: '',
        queryParams: {
          inviteCode: '',
          nickname: '',
          registeredType: 1,
          phone: '',
          email: '',
          memberType: "",
          realName: "",
          status: "",
        },
        jointimeSelected: '',
        jointimeSelected2: '',
        tableData: [],
        telPerfixArr: [],
      }
    },
    mounted () {
      this.search()
      this.getAreaCode();
    },
    methods: {
      getAreaCode() {
        userAreaPhone().then(response => {
          if (+response.code === 200) {
            this.telPerfixArr = response.data.list || [];
          }
        })
      },
      // 操作
      handelClick (row, type) {
        // this.$confirm('确定要执行此操作吗？', {
        //   type: 'warning',
        //   showClose: false,
        //   closeOnClickModal: false,
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        // }).then(() => {
        //   atInfractionOperation({id: row.id, modifyBy: row.modifyBy, type}).then(response => {
        //     if (+response.code === 200) {
        //       this.$message.success(response.message)
        //       this.isAuth.isPermi(['lottery:task:list']) && this.search()
        //     } else {
        //       this.$message.error(response.message)
        //     }
        //   })
        // }).catch((e) => {})
        let _stus = ''
        if (+row.status === 0) {
          _stus = `当前账户状态为 :正常`
        } else if (+row.status === 1) {
          _stus = `当前账户状态为 :限制交易`
        } else if (+row.status === 2) {
          _stus = `当前账户状态为 :冻结账户`
        }
        let _str = ''
        if (+type === 1) {
          _str = `是否要解封？${_stus}`
        } else if (+type === 2) {
          _str = `是否要限制交易?${_stus}`
        } else if (+type === 3) {
          _str = `是否要冻结账户？${_stus}`
        }
        this.$prompt('备注：', _str, {
          inputValue: '',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: '',
          inputErrorMessage: ''
        }).then(({ value }) => {
          atInfractionOperation({id: row.id, modifyBy: row.modifyBy, type, remark: value}).then(response => {
          if (+response.code === 200) {
            this.$message.success(response.message)
            this.search()
          } else {
            this.$message.error(response.message)
          }
        })
        }).catch(() => {})
      },
      // 选择注册类型
      handleChangeType() {
        this.queryParams.areaCode = '';
        this.queryParams.phone = '';
        this.queryParams.email = '';
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.search()
      },
      search (pgi) {
        this.$refs['queryForm'].validate((valid) => {
          if (valid) {
            if (pgi) this.pageIndex = pgi
            let datetime = []
            let datetime2 = []
            datetime = this.jointimeSelected
            datetime2 = this.jointimeSelected2
            let _params = {
              currentPage: this.pageIndex,
              modifyAtEnd: datetime ? this.$dayjs(datetime[1]).format('YYYY-MM-DD') : '',
              modifyAtStart: datetime ? this.$dayjs(datetime[0]).format('YYYY-MM-DD') : '',
              unlockAtEnd: datetime2 ? this.$dayjs(datetime2[1]).format('YYYY-MM-DD') : '',
              unlockAtStart: datetime2 ? this.$dayjs(datetime2[0]).format('YYYY-MM-DD') : '',
              pageSize: this.pageSize,
              ...this.queryParams
            }
            this.loading = true
            atInfractionQuery(_params).then(response => {
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
      }
    }
  }
</script>

<style>
.tttfBox{
  padding-bottom: 20px;
}
.tttfBox ul li {
  padding: 10px;
  text-align: center;
  border:1px solid #ccc;
  border-radius: 3px;
  float: left;
  margin-right:20px;
}
.tttfBox ul li p{
  padding: 0;
  margin: 0;
  padding-bottom: 5px;
}
.userpower_Wrapper{
    padding: 20px;
}
 .userpower_Wrapper .topshow ul{
     margin-left: -36px;
 }
 .userpower_Wrapper .topshow li{
    padding: 5px;
    float: left;
    list-style: none;
    margin-right: 10px;
    border: 1px solid #ccc;
    border-radius:3px;
    margin-bottom: 10px;
    font-size: 13px;
 }
  .powerColumnStyle .cell,.powerColumnStyle{
    padding:0!important;
  }
 .powerColumnStyle .innershow{
   border-bottom: 1px solid #dfe6ec;
   height: 38px;
 }
 .powerColumnStyle .innershow:last-child{
   border-bottom: none;
 }
 .customStyle  .el-input{
   width:200px;
 }
 .userpower_Wrapper .codeLeft, .userpower_Wrapper .auditCenter, .userpower_Wrapper .auditRight{
   height: 80px;
 }
  .userpower_Wrapper .codeLeft{
    width:200px;
    padding-top: 20px;
    border-right:1px solid #ccc;
  }
  .userpower_Wrapper .auditRight{
    width:305px;
    padding-top: 10px;
  }
  .userpower_Wrapper .auditRight .el-textarea{
    width:229px;
    float: left;
  }
 .userpower_Wrapper .auditCenter{
   width:calc(100% - 539px);
   padding-top: 20px;
 }
 .userpower_Wrapper .el-form-item{
   margin-bottom: 0!important;
   border: 1px solid #ccc;
   border-bottom: none;
 }
 .userpower_Wrapper .el-form-item:last-child{
   border-bottom: 1px solid #ccc;
 }
 .customStyle .el-form-item__content{
   border-left: 1px solid #ccc;
 }
 .myAuditSetting ul{
   padding: 0!important;
   margin:0!important;
 }
  .myAuditSetting ul li:not(:last-child) {
    border-bottom: 1px solid #ccc;
  }
 .userpower_Wrapper .el-form-item__label,.userpower_Wrapper .el-form-item__content{
   padding: 10px!important;
 }
 .userpower_Wrapper .notP .el-form-item__content{
   padding: 0!important;
 }
 .txtC {
   text-align:center;
 }
 .mytopformstyle .el-form-item{
   border: none;
 }
 .confirmUserList .el-tag{
   margin-right:9px;
 }
</style>

