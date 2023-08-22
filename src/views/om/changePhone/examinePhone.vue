<template>
  <div class="examinephone_Wrapper">
    <div class="topshow">
      <el-form :model="queryParams" ref="queryForm" :inline="true" class="mytopformstyle" style="padding-bottom: 20px;">
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择状态">
            <el-option label="全部" :value="-1"></el-option>
            <el-option label="审核中" :value="0"></el-option>
            <el-option label="同意" :value="1"></el-option>
            <el-option label="驳回" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邀请码" prop="inviteCode">
          <el-input maxlength="20" v-model="queryParams.inviteCode" placeholder="邀请码" clearable></el-input>
        </el-form-item>
        <el-form-item label="" style="border:none;">
          <el-button type="primary" v-hasPermi="['member:change:page']" @click="search(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="task-table">
      <el-table
      :data="tableData"
      v-loading="loading"
      class="userpowerbox"
      style="width: 100%">
          <el-table-column
              type="index"
              align="center"
              label="序号">
          </el-table-column>
          <el-table-column
              align="center"
              width="120"
              prop="inviteCode"
              label="邀请码">
          </el-table-column>
          <el-table-column
              prop="oldPhone"
              width="110"
              align="center"
              label="旧手机号">
          </el-table-column>
          <el-table-column
              prop="newPhone"
              width="110"
              align="center"
              label="新手机号">
          </el-table-column>
          <el-table-column
              prop="oldEmail"
              width="110"
              align="center"
              label="旧邮箱">
          </el-table-column>
          <el-table-column
              prop="newEmail"
              width="110"
              align="center"
              label="新邮箱">
          </el-table-column>
          <!-- <el-table-column
              prop="userName"
              width="110"
              align="center"
              label="真实姓名">
          </el-table-column>
          <el-table-column
              prop="idCardNumber"
              align="center"
              width="170"
              label="身份证号">
          </el-table-column> -->
          
          <el-table-column
              prop="voucherFirst"
              width="150"
              align="center"
              label="凭证1">
              <template slot-scope="{row}">
                <el-image 
                  style="width: 100px; height: 100px"
                  :src="row.voucherFirst" 
                  :preview-src-list="[row.voucherFirst]">
                </el-image>
              </template>
          </el-table-column>
          <el-table-column
              prop="voucherSecond"
              width="150"
              align="center"
              label="凭证2">
              <template slot-scope="{row}">
                <el-image 
                  style="width: 100px; height: 100px"
                  :src="row.voucherSecond" 
                  :preview-src-list="[row.voucherSecond]">
                </el-image>
              </template>
          </el-table-column>
          <el-table-column
              prop="voucherThird"
              width="150"
              align="center"
              label="凭证3">
              <template slot-scope="{row}">
                <el-image 
                  style="width: 100px; height: 100px"
                  :src="row.voucherThird" 
                  :preview-src-list="[row.voucherThird]">
                </el-image>
              </template>
          </el-table-column>
          <el-table-column
              prop="description"
              min-width="160"
              align="center"
              label="问题描述">
          </el-table-column>
          <el-table-column
              prop="remark"
              min-width="160"
              align="center"
              label="备注">
              <template slot-scope="{row}">
                <span v-if="!row.remark">--</span>
                <span v-else>{{row.remark}}</span>
              </template>
          </el-table-column>
          <el-table-column
              prop="status"
              width="110"
              align="center"
              label="状态">
              <template slot-scope="{row}">
                <span v-if="row.status == 1">同意</span>
                <span v-else-if="row.status == 2">驳回</span>
                <span v-else>审核中</span>
              </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            width="250"
            label="操作">
            <template scope="scope">
              <el-button v-if="scope.row.status === 1 || scope.row.status === 2" type="text" size="mini">已审核</el-button>
              <el-button v-else v-hasPermi="['member:change:audit']" type="primary" size="mini" @click="examineChangePhoneClick(scope.row)">审核</el-button>
            </template>
          </el-table-column>
      </el-table>
      <!--table-->
      <div class="table-pagination text-right mt10">
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
    </div>
    <!--审核更换手机号dialog-->
    <el-dialog custom-class="certifyForm" title="审核更换手机号" :visible.sync="dialogFormVisible">
      <el-form :model="certifyform" :rules="rules" ref="ruleForm">
        <el-form-item label="审核意见：" :label-width="formLabelWidth" prop="status">
          <el-radio v-model="certifyform.status" :label="1">同意</el-radio>
          <el-radio v-model="certifyform.status" :label="2">驳回</el-radio>
        </el-form-item>
        <el-form-item label="备注：" :label-width="formLabelWidth" prop="remark">
          <el-input type="textarea" placeholder="请输入" v-model="certifyform.remark" maxlength="200" rows="4" show-word-limit ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveMdfClick('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { searchChangePhoneList, examineChangePhone } from "@/api/om/changePhone";
  export default {
    components: {},
    data () {
      return {
        dialogFormVisible: false,
        certifyform: {
          status: '',
          remark: ''
        },
        rules: {
          status: [
            { required: true, message: '请选择审批意见', trigger: 'change' }
          ],
        },
        formLabelWidth: '120px', // 新增修改ed
        loading: false,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        queryParams: {
          status: -1,
          inviteCode: ''
        },
        tableData: [],
        id: '',
      }
    },
    created () {
      
    },
    mounted () {
      this.search();
    },
    watch: {},
    methods: {
      examineChangePhoneClick (row) {
        if(row.status === 1 || row.status === 2) {
          return;
        }else {
          this.certifyform = {
            status: '',
            remark: ''
          }
          this.dialogFormVisible = true;
          this.id = row.id;
        }
      },
      // 审核更换手机号提交保存
      saveMdfClick (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let _params = {
              id: this.id,
              remark: this.certifyform.remark,
              status: this.certifyform.status,
            }
            examineChangePhone(_params).then(response => {
              if (response.code === 200) {
                this.msgSuccess(`保存成功`)
                this.dialogFormVisible = false;
                this.search(1);
              } else {
                this.msgSuccess(response.message)
                this.dialogFormVisible = false
              }
            })
          }
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
            let _params = {
              currentPage: this.pageIndex,
              pageSize: this.pageSize,
              status: this.queryParams.status,// -1全部 0审核中 1通过 2驳回
              inviteCode: this.queryParams.inviteCode || ''
            }
            console.log(_params, this.pageIndex);
            this.loading = true
            searchChangePhoneList(_params).then(response => {
              if (response.code === 200) {
                this.tableData = JSON.parse(JSON.stringify(response.data.list))
                this.totalPage = response.data.total
                this.loading = false
              } else {
                this.tableData = []
                this.totalPage = 0
                this.pageSize = 10
                this.loading = false
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
.examinephone_Wrapper{
    padding: 20px;
}
 .examinephone_Wrapper .topshow ul{
     margin-left: -36px;
 }
 .examinephone_Wrapper .topshow li{
    padding: 5px;
    float: left;
    list-style: none;
    margin-right: 10px;
    border: 1px solid #ccc;
    border-radius:3px;
    margin-bottom: 10px;
    font-size: 13px;
 }
 /*upload style*/
.examinephone_Wrapper .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.examinephone_Wrapper .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.examinephone_Wrapper .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.examinephone_Wrapper .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.examinephone_Wrapper .certifyForm{
  width:600px;
}
.certifyForm form{
  padding-right:20px;
}
.uploadSuccessed {
  width:200px;
  height: 200px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
}
.uploadSuccessed img{
  height: 100%;
  width: 100%;
  cursor: pointer;
}
</style>

