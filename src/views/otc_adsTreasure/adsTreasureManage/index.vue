<template>
  <div class="userpower_Wrapper">
        <div class="topshow">
            <el-form :model="queryParams" ref="queryForm" :rules="rules" :inline="true" class="mytopformstyle">
              <el-form-item label="真实姓名" prop="realName">
                <el-input clearable  maxlength="7" v-model="queryParams.realName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone" style="padding-bottom:20px;">
                <el-input clearable  maxlength="11" v-model="queryParams.phone" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="邀请码" prop="inviteCode">
                <el-input clearable  maxlength="7" v-model="queryParams.inviteCode" placeholder="请输入"></el-input>
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
            <el-form-item label="名称" prop="name">
              <el-select v-model="queryParams.name" clearable placeholder="请选择">
                <el-option v-for="(its, index) in atNameListsResult" :key="index" :label="its.label" :value="its.value"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="行为" prop="operMode">
              <el-select v-model="queryParams.operMode" clearable placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option label="兑换" :value="1"></el-option>
                <el-option label="购买" :value="2"></el-option>
                <el-option label="拆解" :value="3"></el-option>
                <el-option label="出售" :value="4"></el-option>
                <el-option label="已使用" :value="5"></el-option>
              </el-select>
          </el-form-item>
          <!-- <el-form-item label="来源" prop="source">
              <el-select v-model="queryParams.source" clearable placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option label="自行兑换" :value="2"></el-option>
                <el-option label="市场购买" :value="3"></el-option>
              </el-select>
          </el-form-item> -->
            
            <el-form-item label="" style="border:none;">
                <el-button v-hasPermi="['advertising:user_oper:page']" :loading="loading" type="primary" icon="el-icon-search" @click="search(1)">查询</el-button>
                <el-button v-hasPermi="['advertising:user_oper:sign']" :loading="loading" type="primary" @click="signClick">标识为已使用</el-button>
            </el-form-item>
            </el-form>
        </div>

        <div class="tttfBox clearfix">
          <ul>
            <li v-for="(item, index) in addMapList" :key="index">
              <p>{{item.name}}</p>
              <span>{{item.count || 0}}</span>
            </li>
          </ul>
        </div>
        <!--table-->
        <el-table
        :data="tableData"
        border
        v-loading="loading"
        class="userpowerbox"
        style="width: 100%">
            <el-table-column
                prop="realName"
                align="center"
                label="真实姓名">
            </el-table-column>
            <el-table-column
                align="center"
                prop="phone"
                label="手机号">
            </el-table-column>
            <el-table-column
                prop="inviteCode"
                align="center"
                label="邀请码">
            </el-table-column>
            <el-table-column
                prop="exchangeCode"
                align="center"
                label="兑换单号">
            </el-table-column>
            <el-table-column
                prop="num"
                align="center"
                maxlength="11"
                label="数量">
            </el-table-column>
            <el-table-column
                prop="name"
                align="center"
                maxlength="11"
                label="名称">
            </el-table-column>
            <el-table-column
                prop="operMode"
                align="center"
                maxlength="11"
                label="行为">
                <template scope="scope">
                  <p v-if="+scope.row.operMode === 1">兑换</p>
                  <p v-else-if="+scope.row.operMode === 2">购买</p>
                  <p v-else-if="+scope.row.operMode === 3">拆解</p>
                  <p v-else-if="+scope.row.operMode === 4">出售</p>
                  <p v-else-if="+scope.row.operMode === 5">已使用</p>
                </template>
            </el-table-column>
            <el-table-column
                prop="processFee"
                align="center"
                maxlength="11"
                label="手续费（candy）">
            </el-table-column>
            <el-table-column
                prop="dedicateWorth"
                align="center"
                maxlength="11"
                label="贡献值">
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
                prop="createTime"
                align="center"
                width="180"
                label="更新时间">
                <template slot-scope="{row}">
                  {{row.createTime ? $dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
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

        <!--标识为已使用-->
        <el-dialog title="标识为已使用" :visible.sync="dialogFormVisible">
          <el-form :model="formitp">
            <el-form-item label="邀请码" :label-width="formLabelWidth">
              <el-input clearable  @blur="((ev)=>{handleChangeItp(ev, 'code')})" :minlength="7" :maxlength="7" v-model="formitp.myInviteCode" autocomplete="off" ></el-input>
            </el-form-item>
            <el-form-item label="手机号" :label-width="formLabelWidth">
              <el-input clearable  @blur="((ev)=>{handleChangeItp(ev, 'phone')})" :minlength="11" :maxlength="11" v-model="formitp.myPhone" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="OTC来源" :label-width="formLabelWidth">
              <el-select v-model="formitp.source" placeholder="">
                <el-option label="自行兑换" :value="1"></el-option>
                <el-option label="市场购买" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="使用的OTC" :label-width="formLabelWidth">
              <el-select v-model="formitp.marketId" placeholder="" @change="handleChangeSelected">
                <el-option v-for="(its, index) in useableAdsListMap" :key="index" :label="its.name" :value="its.id"></el-option>
              </el-select>
              <el-button style="margin-left:10px;" :disabled="useableAds_disabled" @click="useableAdsList">查询</el-button>
            </el-form-item>
            <el-form-item label="使用数量" :label-width="formLabelWidth">
              <el-input clearable :disabled="true" v-model="formitp.num" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth">
              <el-input clearable v-model="formitp.remark" type="textarea" :rows="2" autocomplete="off"></el-input>
            </el-form-item>
            <p>* 标识为已使用，对OTC的数量增减 ，具体的使用权益，线下统计</p>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveformitp">确 定</el-button>
          </div>
        </el-dialog>

  </div>
</template>

<script>
import { deleteRun, pageRun, saveRun } from "@/api/om/white";
import { searchUserByPhone } from "@/api/om/power";
import { atNameLists, atManaOperList, atManaQuery, atManaMark, atManastatistics, atManaCatchOneBy } from "@/api/otc_adsTreasure";
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
        addMapList: [],
        dialogFormVisible: false,
        formitp: {
          myInviteCode: '',
          myPhone: '',
          source: 1,
          marketId: '',
          num: '',
          remark: ''
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
            realName: '',
            phone: '',
            inviteCode: '',
            name: '',
            operMode: '',
            source: '',
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
        findedId: null,
        useableAds_disabled: true,
        useableAdsListMap: [],
        atNameListsResult: [],
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
      atNameListsRun () {
        atNameLists().then(response => {
          if (+response.code === 200) {
            this.atNameListsResult = response.data.list || []
          } else {
            this.atNameListsResult = []
            this.$message.error(response.message)
          }
        })
      },
      signClick () {
        this.dialogFormVisible = true
        this.useableAdsListMap = []
        this.formitp = {
          myInviteCode: '',
          myPhone: '',
          source: 1,
          marketId: '',
          num: '',
          remark: ''
        }
      },
      saveformitp () {
        let _params = Object.assign({}, this.formitp, {memberId: this.findedId})
        atManaMark(_params).then(response => {
            if (+response.code === 200) {
            this.$message({
                message: '操作成功',
                type: 'success',
                'duration': 1000,
                onClose: () => {
                  this.search()
                  this.dialogFormVisible = false
                }
              })
          } else {
            this.$message.error(response.message)
          }
        })
      },
      handleChangeSelected (val) {
        console.log(val)
        let _res = this.useableAdsListMap.find(v => {
          return v.id == val
        })
        this.formitp.num = _res.num || 1
      },
      useableAdsList () {
        atManaOperList({
            memberId: this.findedId,
            source: this.formitp.source
          }).then(response => {
          if (+response.code === 200) {
            this.useableAdsListMap = response.data.list || []
          } else {
            this.useableAdsListMap = []
            this.$message.error(response.message)
          }
        })
      },
      handleChangeItp (val, type) {
        let _val = val.target.value
        if (type === 'code') {
          if (_val == '' || _val.length < 7) {
            this.$message.error('请输入正确的邀请码')
          } else {
            this.findOtherResultByOne(
              {
                inviteCode: _val,
                phone: ''
              }
            )
          }
        } else if (type === 'phone') {
          if (_val == '' || _val.length < 11 || !(/^1[3456789]\d{9}$/.test(_val))) {
            this.$message.error('请输入正确的手机号')
          } else {
            this.findOtherResultByOne(
              {
                inviteCode: '',
                phone: _val,
              }
            )
          }
        }
      },
      // 根据邀请码和手机号，输入任意一项匹配另外一项结果
      findOtherResultByOne (obj) {
        atManaCatchOneBy({
            inviteCode: obj.inviteCode,
            phone: obj.phone
          }).then(response => {
          if (+response.code === 200) {
            this.findedId = response.data.id || ''
            this.formitp.myInviteCode = response.data.inviteCode || ''
            this.formitp.myPhone = response.data.phone || ''
            this.useableAds_disabled = false
          } else {
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
                  this.search()
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
                name: response.data.userName,
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
                    name: response.data.userName,
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
            atManaQuery(_params).then(response => {
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
            atManastatistics().then(response => {
                if (response.code === 200) {
                  this.addMapList = response.data.list || []
                } else {
                  this.addMapList = []
                this.$message.error(response.message)
              }
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
  font-size: 12px;
  margin-bottom: 10px;
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

