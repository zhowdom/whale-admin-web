<template>
  <div class="changephone_Wrapper">
    <div class="topshow">
      <el-form :model="queryParams" ref="queryForm" :inline="true" class="mytopformstyle" style="padding-bottom: 20px;">
        <el-form-item label="" style="border:none;">
            <el-button v-hasPermi="['member:change:saveorupdate']" type="primary" icon="el-icon-plus" @click="addChangePhoneClick">创建</el-button>
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
          <el-table-column
              prop="voucherThird"
              width="150"
              align="center"
              label="凭证1">
              <template slot-scope="{row}">
                <el-image 
                  style="width: 100px; height: 100px"
                  :src="row.voucherThird" 
                  :preview-src-list="[row.voucherThird]">
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
              prop="voucherFirst"
              width="150"
              align="center"
              label="凭证3">
              <template slot-scope="{row}">
                <el-image 
                  style="width: 100px; height: 100px"
                  :src="row.voucherFirst" 
                  :preview-src-list="[row.voucherFirst]">
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
    <!--添加更换手机号dialog-->
    <el-dialog custom-class="certifyForm" title="创建" :visible.sync="dialogFormVisible">
      <el-form :model="certifyform" :rules="rules" ref="ruleForm">
        <el-form-item label="邀请码：" :label-width="formLabelWidth" prop="inviteCode">
          <el-input maxlength="10" v-model.trim="certifyform.inviteCode" autocomplete="off" clearable @blur="((ev) => hanldeInviteCode(ev, 'code'))"></el-input>
        </el-form-item>
        <!-- <el-form-item label="真实姓名：" :label-width="formLabelWidth" prop="userName">
          <el-input maxlength="10" v-model="certifyform.userName" autocomplete="off" clearable @blur="hanldeInviteCode"></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="身份证号码：" :label-width="formLabelWidth" prop="idCardNumber">
          <el-input v-model="certifyform.idCardNumber" autocomplete="off" clearable @blur="hanldeInviteCode"></el-input>
        </el-form-item> -->
         <el-radio-group v-model="certifyform.changeType" @change="watchRadio" style="padding: 0 0 20px 60px;">
          <el-radio :label="1">手机</el-radio>
          <el-radio :label="2">邮箱</el-radio>
        </el-radio-group>

        <el-form-item :label="`${certifyform.changeType == 1 ? '旧手机号：' : '旧邮箱：'}`" :label-width="formLabelWidth">
          <el-input v-model.trim="certifyform.oldPhoneEmail" autocomplete="off" clearable @blur="((ev) => hanldeInviteCode(ev, 'oldPhoneOrEmail'))"></el-input>
        </el-form-item>
        <el-form-item :label="`${certifyform.changeType == 1 ? '新手机号：' : '新邮箱：'}`" :label-width="formLabelWidth">
          <el-input v-model.trim="certifyform.newPhoneEmail" autocomplete="off" clearable></el-input>
        </el-form-item>

        <!-- <el-form-item v-show="certifyform.changeType == 2" label="旧邮箱：" :label-width="formLabelWidth" prop="oldEmail">
          <el-input v-model.trim="certifyform.oldEmail" autocomplete="off" clearable @blur="((ev) => hanldeInviteCode(ev, 'oldEmail'))"></el-input>
        </el-form-item>
        <el-form-item v-show="certifyform.changeType == 2" label="新邮箱：" :label-width="formLabelWidth" prop="newEmail">
          <el-input v-model.trim="certifyform.newEmail" autocomplete="off" clearable></el-input>
        </el-form-item> -->

        <el-form-item label="凭证1：" :label-width="formLabelWidth" prop="voucherFirst">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :http-request="handleAvatarSuccessRUN.bind(file, 'FRONT')">
            <img v-if="certifyform.voucherFirst" :src="certifyform.voucherFirst" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="凭证2：" :label-width="formLabelWidth" prop="voucherSecond">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :http-request="handleAvatarSuccessRUN.bind(file, 'BACK')">
            <img v-if="certifyform.voucherSecond" :src="certifyform.voucherSecond" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="凭证3：" :label-width="formLabelWidth" prop="voucherThird">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :http-request="handleAvatarSuccessRUN.bind(file, 'HAND')">
            <img v-if="certifyform.voucherThird" :src="certifyform.voucherThird" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="问题描述：" :label-width="formLabelWidth" prop="description">
          <el-input type="textarea" placeholder="请输入" v-model="certifyform.description" maxlength="200" rows="4" show-word-limit ></el-input>
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
import { upload, getCertificate } from "@/api/system/userlist";
import { searchChangePhoneList, searchInfoData, addChangePhone } from "@/api/om/changePhone";
import { checkIDCard } from '@/utils/validate'
import {compareVersion, replaceUnitlPrefixStr} from '@/utils/index';
  export default {
    components: {},
    data () {
      var validatePhone = (rule, value, callback) => {
        if (value == '') {
          return callback(new Error('请输入手机号码'))
        } else if (!(/^1[3456789]\d{9}$/.test(value))) {
          return callback(new Error('请输入正确的手机号码'))
        }
        callback()
      }
      var validateEmail = (rule, value, callback) => {
        if (value == '') {
          return callback(new Error('请输入邮箱'))
        } else if (!(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$/.test(value))) {
          return callback(new Error('请输入正确的邮箱'))
        }
        callback()
      }
      let imgValidator = (rule, value, callback) => {
        if (!/\S/.test(value)) {
          callback(new Error('请上传图片'))
        } else {
          callback()
        }
      }
      let idCardNumberValidator = (rule, value, callback) => {
        if (!checkIDCard(value)) {
          callback(new Error('请输入正确的身份证号码'))
        } else {
          callback()
        }
      }
      let userNameValidator = (rule, value, callback) => {
        if (!/\S/.test(value)) {
          callback(new Error('不能为空'))
        } else {
          callback()
        }
      }
      return {
        dialogFormVisible: false,
        certifyform: {
          inviteCode: '',
          oldPhoneEmail: '',
          newPhoneEmail: '',
          changeType: 1,
          newAreaCode: '+86',
          voucherThird: '',
          voucherSecond: '',
          voucherFirst: '',
          description: ''
        },
        rules: {
          inviteCode: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          // userName: [
          //   { required: true, validator: userNameValidator, trigger: 'blur' }
          // ],
          // idCardNumber: [
          //   { required: true, validator: idCardNumberValidator, trigger: 'blur' }
          // ],
          oldPhone: [
            { required: true, validator: validatePhone, trigger: 'blur' }
          ],
          newPhone: [
            { required: true, validator: validatePhone, trigger: 'blur' }
          ],
          oldEmail: [
            { required: true, validator: validateEmail, trigger: 'blur' }
          ],
          newEmail: [
            { required: true, validator: validateEmail, trigger: 'blur' }
          ],
          voucherThird: [
            { required: true, validator: imgValidator, trigger: 'blur,change' }
          ],
          voucherSecond: [
            { required: true, validator: imgValidator, trigger: 'blur,change' }
          ],
          voucherFirst: [
            { required: true, validator: imgValidator, trigger: 'blur,change' }
          ],
          description: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
        },
        formLabelWidth: '130px', // 新增修改ed
        loading: false,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        queryParams: {
          status: -1,
          inviteCode: ''
        },
        tableData: [],
        file: '',
        curSwitchType: 1,
      }
    },
    created () {
      
    },
    mounted () {
      this.isAuth.isPermi(['member:change:page']) && this.search()
      this.getCertificateRun()
    },
    watch: {},
    methods: {
      watchRadio (v) {
        // 2:邮箱 1:手机
        this.curSwitchType = v
        this.certifyform = {
          inviteCode: '',
          oldPhoneEmail: '',
          newPhoneEmail: this.certifyform.newPhoneEmail,
          changeType: this.certifyform.changeType,
          newAreaCode: '+86',
          voucherThird: this.certifyform.voucherThird,
          voucherSecond: this.certifyform.voucherSecond,
          voucherFirst: this.certifyform.voucherFirst,
          description: this.certifyform.description
        }
        // this.$refs['ruleForm'].clearValidate(['oldPhone','newPhone','oldEmail','newEmail'])
      },
      // 联动查询
      hanldeInviteCode(ev, type) {
        if (type == 'code' && !this.certifyform.inviteCode) {
          return false
        } else if (!this.certifyform.oldPhoneEmail && !this.certifyform.inviteCode) {
          return false
        }
        let _params = {
          inviteCode: this.certifyform.inviteCode,// 2102535
          oldPhone: this.certifyform.oldPhoneEmail,// 17200000131
          oldEmail: this.certifyform.oldPhoneEmail,
        }
        if (this.curSwitchType == 2) {
          Reflect.deleteProperty(_params, 'oldPhone')
        } else if (this.curSwitchType == 1) {
          Reflect.deleteProperty(_params, 'oldEmail')
        }
        searchInfoData(_params).then(response => {
          if (response.code == 200) {
            this.certifyform = {
              inviteCode: response.data.inviteCode,
              oldPhoneEmail: this.curSwitchType == 2 ? response.data.oldEmail : response.data.oldPhone,
              newPhoneEmail: this.certifyform.newPhoneEmail,
              changeType: this.certifyform.changeType,
              newAreaCode: '+86',
              voucherThird: this.certifyform.voucherThird,
              voucherSecond: this.certifyform.voucherSecond,
              voucherFirst: this.certifyform.voucherFirst,
              description: this.certifyform.description
            }
          } else {
            this.$message.error(response.message)
          }
        })
      },
      // 向您搭建的STS服务获取临时访问凭证。
      getCertificateRun () {
        return new Promise((resolve, reject) => {
          getCertificate().then(response => {
            this.certificateInfos = response.data
            resolve(this.certificateInfos)
          })
        })
      },
      // 图片上传
      async handleAvatarSuccessRUN (type, file) { // the order of the parameters here must be reversed.
        let _valid = this.beforeAvatarUpload(file.file)
        if (!_valid) await this.put(file.file, type)
      },
      beforeAvatarUpload(file) {
        const isNOtJPGPNG = file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png'
        const isGt2M = file.size / 1024 / 1024 > 5
        if (isNOtJPGPNG) {
          this.$message.error('请上传是 jpg、png、jpeg 格式的图片!')
        }
        if (isGt2M) {
          this.$message.error('上传图片大小不能超过 5MB!')
        }
        return isNOtJPGPNG || isGt2M
      },
      async put (file, type) {
        try {
          let _res = await upload(this.certificateInfos, file)
          let ossFileUrl = _res.res.requestUrls[0]
          //如果CDN域名不为空，则替换成CDN域名
          if(this.certificateInfos.bucketCdnUrl){
            ossFileUrl = replaceUnitlPrefixStr(ossFileUrl, this.certificateInfos.endpoint, this.certificateInfos.bucketCdnUrl);
          }
          switch(type) {
            case 'BACK':
              this.certifyform.voucherSecond = ossFileUrl
              this.$refs['ruleForm'].clearValidate('voucherSecond')
              break;
            case 'FRONT':
              this.certifyform.voucherFirst = ossFileUrl
              this.$refs['ruleForm'].clearValidate('voucherFirst')
              break;
            case 'HAND':
              this.certifyform.voucherThird = ossFileUrl
              this.$refs['ruleForm'].clearValidate('voucherThird')
              break;
          }
        } catch (e) {
          console.log(e)
        }
      },
      addChangePhoneClick () {
        this.certifyform = {
          inviteCode: '',
          // userName: '',
          // idCardNumber: '',
          oldPhone: '',
          changeType: 1,
          newPhone: '',
          newAreaCode: '+86',
          voucherThird: '',
          voucherSecond: '',
          voucherFirst: '',
          description: ''
        }
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
        })
      },
      // 更换手机号提交保存
      saveMdfClick (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            for(let key in this.certifyform) {
              if(this.certifyform[key] == '--') {
                this.certifyform[key] = '';
              }
            }
            // return;
            let _params = Object.assign({}, this.certifyform, {
              oldPhone: this.curSwitchType == 1 ? this.certifyform.oldPhoneEmail : null,
              newPhone: this.curSwitchType == 1 ? this.certifyform.newPhoneEmail : null,
              oldEmail: this.curSwitchType == 2 ? this.certifyform.oldPhoneEmail : null,
              newEmail: this.curSwitchType == 2 ? this.certifyform.newPhoneEmail : null,
            })
            addChangePhone(_params).then(response => {
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
              inviteCode: ''
            }
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
.changephone_Wrapper{
    padding: 20px;
}
 .changephone_Wrapper .topshow ul{
     margin-left: -36px;
 }
 .changephone_Wrapper .topshow li{
    padding: 5px;
    float: left;
    list-style: none;
    margin-right: 10px;
    border: 1px solid #ccc;
    border-radius:3px;
    margin-bottom: 10px;
    font-size: 13px;
 }
 /* .changephone_Wrapper .el-form-item{
   margin-bottom: 0!important;
   border-bottom: none;
 }
 .changephone_Wrapper .el-form-item__label,.changephone_Wrapper .el-form-item__content{
   padding: 10px!important;
 }
 .mytopformstyle .el-form-item{
   border: none;
 } */
 /*upload style*/
.changephone_Wrapper .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.changephone_Wrapper .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.changephone_Wrapper .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.changephone_Wrapper .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.changephone_Wrapper .certifyForm{
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

