<template>
  <div class="userpower_Wrapper">
        <div class="topshow">
            <el-form :model="queryParams" ref="queryForm" :rules="rules" :inline="true" class="mytopformstyle">
            <el-form-item label="发布编号" prop="code">
                <el-input clearable v-model="queryParams.code" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="真实姓名" prop="realName">
                <el-input clearable  maxlength="7" v-model="queryParams.realName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone" >
                <el-input clearable  maxlength="11" v-model="queryParams.phone" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email" >
                <el-input clearable v-model="queryParams.email" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="邀请码" prop="inviteCode">
                <el-input clearable  maxlength="7" v-model="queryParams.inviteCode" placeholder="请输入"></el-input>
            </el-form-item>
            
          <el-form-item label="名称" prop="name">
              <el-select v-model="queryParams.name" clearable placeholder="请选择">
                <el-option v-for="(its, index) in atNameListsResult" :key="index" :label="its.label" :value="its.value"></el-option>
              </el-select>
          </el-form-item>
            <el-form-item label="发布方向" prop="type">
              <el-select v-model="queryParams.type" clearable placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option label="卖单" :value="1"></el-option>
                <el-option label="买单" :value="2"></el-option>
              </el-select>
          </el-form-item>
            <!-- <el-form-item label="来源" prop="source">
              <el-select v-model="queryParams.source" clearable placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option label="自行兑换" :value="1"></el-option>
                <el-option label="市场购买" :value="2"></el-option>
              </el-select>
          </el-form-item> -->
            <el-form-item label="发布时间" prop="jointimeSelected">
              <el-date-picker
                v-model="jointimeSelected"
                type="daterange"
                value-format="timestamp"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <!-- <el-form-item label="兑换单号" prop="exchangeCode">
                <el-input clearable  maxlength="7" v-model="queryParams.exchangeCode" placeholder="请输入"></el-input>
            </el-form-item> -->
            
            <el-form-item label="" style="border:none;">
                <el-button v-hasPermi="['otc:market:page']" :loading="loading" type="primary" icon="el-icon-search" @click="search(1)">查询</el-button>
                <el-button :disabled="multipleSelection.length <= 0" :loading="downLoading" v-hasPermi="['otc:market:batch_down']" @click="downClic('multi')">批量下架</el-button>
            </el-form-item>
            </el-form>
        </div>
        <!--table-->
        <el-table
        :data="tableData"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        border
        v-loading="loading"
        class="userpowerbox"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
            <el-table-column
                prop="serialNo"
                align="center"
                label="发布编号">
            </el-table-column>
            <!-- <el-table-column
                prop="exchangeCode"
                align="center"
                label="兑换单号">
            </el-table-column> -->
            <el-table-column
                align="center"
                prop="name"
                label="名称">
            </el-table-column>
            <el-table-column
                align="center"
                prop="image"
                label="图片">
                <template scope="scope">
                  <img :src="scope.row.image" style="height:50px;width:50px;border-radius:50px;" />
                </template>
            </el-table-column>
            <el-table-column
                prop="type"
                align="center"
                label="发布方向">
                <template scope="scope">
                  <p v-if="+scope.row.type === 1">卖单</p>
                  <p v-else-if="+scope.row.type === 2">买单</p>
                </template>
            </el-table-column>
            <el-table-column
                prop="availableNum"
                align="center"
                label="数量">
            </el-table-column>
            <el-table-column
                prop="completeDesc"
                align="center"
                label="成交状态">
            </el-table-column>
            <el-table-column
                prop="price"
                align="center"
                maxlength="11"
                label="单价（元）">
            </el-table-column>
            <el-table-column
                prop="totalPrice"
                align="center"
                maxlength="11"
                label="总价（元）">
            </el-table-column>
            <el-table-column
                prop="serviceCharge"
                align="center"
                maxlength="11"
                label="服务费（candy）">
            </el-table-column>
            <!-- <el-table-column
                prop="source"
                align="center"
                maxlength="11"
                label="来源">
                <template scope="scope">
                  <p v-if="+scope.row.source === 1">自行兑换</p>
                  <p v-else-if="+scope.row.source === 2">市场购买</p>
                </template>
            </el-table-column> -->
            <el-table-column
                prop="realName"
                align="center"
                label="真实姓名">
            </el-table-column>
            <el-table-column
                prop="phone"
                align="center"
                label="手机号">
            </el-table-column>
            <el-table-column
                prop="email"
                align="center"
                label="邮箱">
            </el-table-column>
            <el-table-column
                prop="inviteCode"
                align="center"
                maxlength="11"
                label="邀请码">
            </el-table-column>
            <el-table-column
                prop="createTime"
                align="center"
                width="180"
                label="发布时间">
                <template slot-scope="{row}">
                  {{row.createTime ? $dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                maxlength="11"
                label="操作">
                <template scope="scope">
                  <el-button :loading="downLoading" v-hasPermi="['otc:market:batch_down']" @click="downClic('single', scope.row)">下架</el-button>
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
        <!--权益设置新增Dialog-->
        <el-dialog width="60%" title="添加至白名单" :visible.sync="auditSettingVisible">
          <el-form :model="auditSettingform_for_ADD" ref="addAuditPowerForm">

            <el-form-item label="用户名" :label-width="formLabelWidth" class="customStyle usernameItem">
              <span class="fl">用户手机号：</span>
              <el-input maxlength="11" class="fl" v-model.trim="auditSettingform_for_ADD.phone" autocomplete="off"></el-input>
              <el-button :disabled="!/^1[3456789]\d{9}$/.test(auditSettingform_for_ADD.phone)" type="primary" :loading="loadingSearchPhone" icon="el-icon-search" style="margin-left:10px;" @click="searchUserByPhoneClick">搜索</el-button>
            </el-form-item>

            <el-form-item label="确定用户" :label-width="formLabelWidth" class="customStyle">
              <div class="confirmUserList">
                <el-tag
                  v-for="user in auditSettingform_for_ADD.confirmUsers"
                  :key="user.name"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(user)"
                  :type="user.type">
                  {{user.name}}
                </el-tag>
              </div>
            </el-form-item>
            
              <el-form-item style="text-align:right;">
              <el-button @click="cancelAuditPower('addAuditPowerForm')">取 消</el-button>
              <el-button @click="saveAuditPower">确 定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>

  </div>
</template>

<script>
import { deleteRun, pageRun, saveRun } from "@/api/om/white";
import { searchUserByPhone } from "@/api/om/power";
import { atNameLists, atMarketQuery, downBatchC } from "@/api/otc_adsTreasure";
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
        auditSettingform_for_edit: {
          confirmUsers: [],
          phone: ''
        },
        auditSettingform_for_ADD: {
          confirmUsers: [],
          phone: ''
        },
        auditTypeMapData_original: [],
        auditSettingVisible: false,
        auditSettingVisible_edit: false,
        formLabelWidth: '120px', // 新增修改ed
        loading: false,
        loadingSearchPhone: false,
          pageIndex: 1,
          pageSize: 10,
          totalPage: 0,
          input: '',
          queryParams: {
            inviteCode: '',
            phone: '',
            email: '',
            code: '',
            realName: '',
            name: '',
            type: '',
            source: '',
            exchangeCode: '',
          },
          jointimeSelected: '',
          tableData: [
            {
              memberId: '123',
              name: 'hahah',
              phone: '13797091175',
              jointime: '2021-3-29',
              redBack: 130.39,
              start: '一星',
              inviteCode: 45789
            },
            {
              memberId: '123',
              name: 'hahah',
              phone: '13797091175',
              jointime: '2021-3-29',
              redBack: 130.39,
              start: '一星',
              inviteCode: 45789
            }
          ],
          curClickedUserId: '',
          current_dialog_type: 'add',
          finallyCheckedIndexList: [], // 存储每次最终勾选了的特权名称，与原始特权集合，匹配到了的位置索引的集合
          multipleSelection: [],
          ids: [],
        cachePoor: {},
        hadValidedUser_STATUS: false,
        atNameListsResult: [],
        multipleSelection: [],
        downLoading: false
      }
    },
    created () {
      this.atNameListsRun()
    },
    mounted () {
      this.search()
    },
    watch: {},
    methods: {
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      downClic (type, row) {
        this.$confirm(`确认要执行此操作吗？`, '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.downClicRunner(type, row)
        }).catch((e) => {
          console.log(e)
        })
      },
      downClicRunner (type, row) {
        let ids = []
        if (type == 'multi') {
          ids = this.multipleSelection.map(v => v.id)
        } else {
          ids = [row.id]
        }
        this.downLoading = true
        downBatchC({ids}).then((response) => {
          if (response.code == 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              'duration': 1000,
              onClose: () => {
                this.search()
              }
            })
          } else {
            this.$message.error(response.message)
          }
          this.downLoading = false
        }).catch(e => {
          this.downLoading = false
          console.log(e)
        })
      },
      atNameListsRun () {
        atNameLists().then(response => {
          if (+response.code === 200) {
            this.atNameListsResult = (response.data.list || []).map(v => {
              let {label, value, ...a} = v
              return {
                value: label == '全部' ? '' : label,
                label,
                ...a
              }
            })
          } else {
            this.atNameListsResult = []
            this.$message.error(response.message)
          }
        })
      },
      jumpToRedbackStatistic (phone) {
        // 跳转到：分红流水统计
        this.isAuth.isPermi(['agora:white:dividend:log:page']) && this.$router.push({
          path: `/statistics/redBackStatistic`,
          query: {
            phone
          }
        })
      },
      removeClick (row) {
        this.$confirm(`确认要执行此操作吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // do here ...
          deleteRun(
            {id: row.id}
          ).then(response => {
            if (response.code === 200) {
              this.$message({
                message: '移除成功',
                type: 'success',
                'duration': 1000,
                onClose: () => {
                  this.search(1)
                }
              })
            } else {
              this.$message.error(response.message)
            }
          }).catch(({ error }) => {
            if (error) this.$message.error(error.message)
          })
        }).catch(() => {})
      },
      collect_ids () {
        this.ids = this.multipleSelection.map((val ,index, arr) => {
          return val.id
        })
      },
      cancelAuditPower (formName) {
        this.auditSettingVisible = false
        this.$refs[formName].resetFields()
      },
      // 新增提交
      saveAuditPower () {
        let _params = {
          memberIds: this.auditSettingform_for_ADD.confirmUsers.map((val, index, arr) => {
            return val.memberId
          })
        }
        if (_params.memberIds.length <= 0) {
          this.$message({
            type: 'warning',
            message: '请添加用户'
          })
          return false
        }
        console.log('add sumbit params:', _params)
        saveRun(_params).then(response => {
          if (response.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              'duration': 1000,
              onClose: () => {
                this.search()
              }
            })
          } else {
            this.$message.error(response.message)
          }
          this.auditSettingVisible = false
        }).catch(({ error }) => {
          this.auditSettingVisible = false
          if (error) this.$message.error(error.message)
        })
      },
      handleClose (tag) {
        if (this.current_dialog_type === 'edit') {
          this.auditSettingform_for_edit.confirmUsers.splice(this.auditSettingform_for_edit.confirmUsers.indexOf(tag), 1)
        } else {
          this.auditSettingform_for_ADD.confirmUsers.splice(this.auditSettingform_for_ADD.confirmUsers.indexOf(tag), 1)
        }
        Reflect.deleteProperty(this.cachePoor, [`sid${tag.memberId}`])
      },
      // 新增
      addAuditPowerClick () {
        // clear cachePoor
        this.cachePoor = {}
        this.auditSettingVisible = true
        this.current_dialog_type = 'add'
        this.finallyCheckedIndexList = []
      
        this.auditSettingform_for_ADD = {
            confirmUsers: [],
            phone: ''
        }
      },
      searchUserByPhoneClick () {
        // here will emit the search method
        let phone
        if (this.current_dialog_type === 'edit') {
          phone = this.auditSettingform_for_edit.phone
        } else {
          phone = this.auditSettingform_for_ADD.phone // 18820476343
        }
        this.loadingSearchPhone = true
        searchUserByPhone({ phone }).then(response => {
            if (response.code === 200) {
            this.loadingSearchPhone = false
            if (this.current_dialog_type === 'edit') {
              this.auditSettingform_for_edit.confirmUsers = [{ // 此处其实按钮已经禁止点击查询了
                name: response.data.code,
                phone: response.data.phone,
                memberId: response.data.memberId,
                type: 'warning'
              }]
            } else {
              if (this.auditSettingform_for_ADD.confirmUsers.length < 14) {
                if (this.cachePoor[`sid${response.data.memberId}`]) {
                  console.log('Do not add user repeatedly.')
                } else {
                  this.cachePoor[`sid${response.data.memberId}`] = response.data.memberId
                  this.auditSettingform_for_ADD.confirmUsers.push({
                    name: response.data.code,
                    phone: response.data.phone,
                    memberId: response.data.memberId,
                    type: 'warning'
                  })
                }
              } else if (this.auditSettingform_for_ADD.confirmUsers.length >= 14){
                this.auditSettingform_for_ADD.confirmUsers.length = 14
                this.$message({
                  type: 'warning',
                  message: '亲，最多允许添加14个用户哦'
                })
                return false
              }
            }
          } else {
            this.loadingSearchPhone = false
            this.$message.error(response.message)
          }
        }).catch(({ error }) => {
          this.loadingSearchPhone = false
          if (error) this.$message.error(error.message)
        })
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
            datetime = this.jointimeSelected
            let _params = {
              currentPage: this.pageIndex,
              endTime: datetime ? this.$dayjs(datetime[1]).format('YYYY-MM-DD') : '',
              pageSize: this.pageSize,
              startTime: datetime ? this.$dayjs(datetime[0]).format('YYYY-MM-DD') : '',
              ...this.queryParams
            }
            this.loading = true
            atMarketQuery(_params).then(response => {
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

