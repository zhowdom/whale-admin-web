<template>
  <div class="userlistwapper">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="输入用户ID" prop="memberId">
        <el-input
          v-model="queryParams.memberId"
          placeholder="输入用户ID"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="用户名" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="输入用户名"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="邀请码" prop="inviteCode">
        <el-input
          v-model="queryParams.inviteCode"
          placeholder="输入邀请码"
          maxlength="7"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="输入手机号"
          clearable
          maxlength="11"
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="注册时间" prop="regtime">
        <el-date-picker
          v-model="queryParams.regtime"
          type="daterange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="审核情况" prop="authStatus">
        <el-select v-model="queryParams.authStatus" placeholder="">
          <el-option
            v-for="item in auditingChoose"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

    <el-form-item label="城市" prop="cityName">
        <el-cascader
          size="large"
          :options="options"
          v-model="selectedOptions"
          @change="addressChange">
        </el-cascader>
    </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" icon="el-icon-search" @click="search(1)">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- table-->
    <el-table highlight-current-row
      border
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      :default-sort = "{prop: 'date', order: 'descending'}"
      >
      <el-table-column
        header-align="center"
        align="center"
        prop="memberId"
        label="用户ID">
        <template scope="scope">
          <div>{{scope.row.memberId}}</div>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        width="160"
        header-align="center"
        align="center"
        prop="registeredAt"
        label="注册时间">
        <template scope="scope">
          <div>{{scope.row.registeredAt}}</div>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="platform"
        label="注册来源">
        <template scope="scope">
          <div v-if='scope.row.platform === 1'>H5</div>
          <div v-else-if='scope.row.platform === 2'>Android</div>
          <div v-else-if='scope.row.platform === 3'>IOS</div>
          <div v-else-if='scope.row.platform === 4'>小程序</div>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="cityName"
        label="城市">
        <template scope="scope">
          <div>{{scope.row.cityName}}</div>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="nickName"
        label="用户名">
        <template scope="scope">
          <div>{{scope.row.nickName}}</div>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="120"
        prop="phone"
        label="注册手机">
        <template scope="scope">
          <div>{{scope.row.phone}}</div>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="inviteCode"
        label="邀请码">
        <template scope="scope">
          <div>{{scope.row.inviteCode}}</div>
        </template>
      </el-table-column>
      <el-table-column
        width="120"
        header-align="center"
        align="center"
        prop="recommendPhone"
        label="邀请人手机号">
        <template scope="scope">
          <div>{{scope.row.recommendPhone}}</div>
        </template>
      </el-table-column>
      <el-table-column
        width="110"
        header-align="center"
        align="center"
        prop="authStatus"
        label="实名认证情况">
        <template scope="scope">
          <div class="certifyResbox">
          <div v-if='scope.row.authStatus === -1' @click="clickCertifyResult(scope.row.memberId)" style="color:blue;text-decoration: underline;">未认证</div>
          <div v-else-if='scope.row.authStatus === 1' @click="clickCertifyResult(scope.row.memberId)" style="color:green;text-decoration: underline;">认证成功</div>
          <div v-else-if='scope.row.authStatus === 2' @click="clickCertifyResult(scope.row.memberId)" style="color:gray;text-decoration: underline;">认证失败</div>
          <div v-else-if='scope.row.authStatus === 4' @click="clickCertifyResult(scope.row.memberId)" style="color:red;text-decoration: underline;">待审核</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        width="160"
        header-align="center"
        align="center"
        prop="lastLoginAt"
        label="最后登陆时间">
        <template scope="scope">
          <div>{{scope.row.lastLoginAt}}</div>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="status"
        label="账户状态">
        <template scope="scope">
          <div v-if='scope.row.status === 1'>正常使用</div>
          <div v-else-if='scope.row.status === 2'>禁用</div>
          <!-- <el-switch
            class="radioStyleSet"
            v-model="scope.row.statusTransfered"
            inactive-text="禁用"
            active-text="正常"
            :width='80'
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch> -->
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template>
          <el-button type="primary" size="mini">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="search"
      :page-sizes="[10, 20, 30]"
      @size-change="handleSizeChange"
      :current-page.sync="pageIndex"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage">
    </el-pagination>
    <!--实名认证dialog-->
    <el-dialog custom-class="certifyForm" title="实名认证审核" :visible.sync="dialogFormVisible">
      <div class="twoBtns">
        <el-button :disabled="certifyform.statusType === 1" type="primary" @click="approveOrRefuseClick(1)">审核通过</el-button>
        <el-button :disabled="certifyform.statusType === 1" @click="approveOrRefuseClick(2)">审核不通过</el-button>
      </div>
      <el-form :model="certifyform" :rules="rules" ref="ruleForm">
        <el-form-item label="真实姓名：" :label-width="formLabelWidth" prop="userName">
          <el-input maxlength="10" v-model="certifyform.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码：" :label-width="formLabelWidth" prop="idCardNumber">
          <el-input v-model="certifyform.idCardNumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="customUploadBox" label="身份证正面：" :label-width="formLabelWidth" prop="imageUrlSuccessFRONT">
          <svg v-show="!certifyform.imageUrlSuccessFRONT" t="1615980994965" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2841" width="200" height="200"><path d="M847.0528 491.52H532.48V176.9472c0-11.264-9.216-20.48-20.48-20.48s-20.48 9.216-20.48 20.48V491.52H176.9472c-11.264 0-20.48 9.216-20.48 20.48s9.216 20.48 20.48 20.48H491.52v314.5728c0 11.264 9.216 20.48 20.48 20.48s20.48-9.216 20.48-20.48V532.48h314.5728c11.264 0 20.48-9.216 20.48-20.48s-9.216-20.48-20.48-20.48z" p-id="2842"></path></svg>
          <input type="file" @change="getFileObj($event, 'FRONT')">
          <h2 v-show="false">path:{{ path }}</h2>
          <div class="uploadSuccessed">
            <img v-if="certifyform.imageUrlSuccessFRONT" :src="certifyform.imageUrlSuccessFRONT">
          </div>
          <!-- <a @click="put">上传</a> -->
        </el-form-item>
        <el-form-item class="customUploadBox" label="身份证反面：" :label-width="formLabelWidth" prop="imageUrlSuccessBACK">
          <svg v-show="!certifyform.imageUrlSuccessBACK" t="1615980994965" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2841" width="200" height="200"><path d="M847.0528 491.52H532.48V176.9472c0-11.264-9.216-20.48-20.48-20.48s-20.48 9.216-20.48 20.48V491.52H176.9472c-11.264 0-20.48 9.216-20.48 20.48s9.216 20.48 20.48 20.48H491.52v314.5728c0 11.264 9.216 20.48 20.48 20.48s20.48-9.216 20.48-20.48V532.48h314.5728c11.264 0 20.48-9.216 20.48-20.48s-9.216-20.48-20.48-20.48z" p-id="2842"></path></svg>
          <input type="file" @change="getFileObj($event, 'BACK')">
          <h2 v-show="false">path:{{ path }}</h2>
          <div class="uploadSuccessed">
            <img v-if="certifyform.imageUrlSuccessBACK" :src="certifyform.imageUrlSuccessBACK">
          </div>
          <!-- <a @click="put">上传</a> -->
        </el-form-item>
        <el-form-item class="customUploadBox" label="手持身份证正面：" :label-width="formLabelWidth" prop="imageUrlSuccessHAND">
          <svg v-show="!certifyform.imageUrlSuccessHAND" t="1615980994965" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2841" width="200" height="200"><path d="M847.0528 491.52H532.48V176.9472c0-11.264-9.216-20.48-20.48-20.48s-20.48 9.216-20.48 20.48V491.52H176.9472c-11.264 0-20.48 9.216-20.48 20.48s9.216 20.48 20.48 20.48H491.52v314.5728c0 11.264 9.216 20.48 20.48 20.48s20.48-9.216 20.48-20.48V532.48h314.5728c11.264 0 20.48-9.216 20.48-20.48s-9.216-20.48-20.48-20.48z" p-id="2842"></path></svg>
          <input type="file" @change="getFileObj($event, 'HAND')">
          <h2 v-show="false">path:{{ path }}</h2>
          <div class="uploadSuccessed">
            <img v-if="certifyform.imageUrlSuccessHAND" :src="certifyform.imageUrlSuccessHAND">
          </div>
          <!-- <a @click="put">上传</a> -->
        </el-form-item>
        <el-form-item label="认证结果：" :label-width="formLabelWidth">
          <span style="color:red;" v-if="certifyform.statusType === 4">待审核</span>
          <span style="color:green;" v-else-if="certifyform.statusType === 1">已认证</span>
          <span style="color:red;" v-else-if="certifyform.statusType === -1">未认证</span>
          <span style="color:gray;" v-else-if="certifyform.statusType === 2">认证失败</span>
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
import { someoneCertifyResult, searchUserList, getCertificate, upload, refuseOrApprove, save } from "@/api/system/userlist";
import { regionData, CodeToText } from 'element-china-area-data'
import { checkIDCard } from '@/utils/validate'
import {compareVersion, replaceUnitlPrefixStr} from '@/utils/index';
export default {
  data() {
    let userNameValidator = (rule, value, callback) => {
      if (!/\S/.test(value)) {
        callback(new Error('不能为空'))
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
    let imgValidator = (rule, value, callback) => {
      if (!/\S/.test(value)) {
        callback(new Error('请上传图片'))
      } else {
        callback()
      }
    }
    return {
      path: '',
      file: {},
      options: regionData,
      selectedOptions: [],
      imageUrl: '',
      certifyform: {
        userName: '',
        idCardNumber: '',
        statusType: -1,
        imageUrlSuccessBACK: '',
        imageUrlSuccessFRONT: '',
        imageUrlSuccessHAND: '',
      },
      rules: {
        userName: [
          { validator: userNameValidator, trigger: 'blur' }
        ],
        idCardNumber: [
          { validator: idCardNumberValidator, trigger: 'blur' }
        ],
        imageUrlSuccessHAND: [
          { validator: imgValidator, trigger: 'change,blur' }
        ],
        imageUrlSuccessBACK: [
          { validator: imgValidator, trigger: 'blur,change' }
        ],
        imageUrlSuccessFRONT: [
          { validator: imgValidator, trigger: 'blur,change' }
        ]
      },
      formLabelWidth: '130px',
      dialogFormVisible: false,
      loading: false,
      timeZone: 1,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      tableData: [],
      auditingChoose: [
        {
          value: '',
          label: '请选择'
        },
        {
          value: 4,
          label: '待审核'
        },
        {
          value: 1,
          label: '已认证'
        },
        {
          value: -1,
          label: '未认证'
        },
        {
          value: 2,
          label: '认证失败'
        }
      ],
      queryParams: {
        memberId: '',
        nickName: '',
        inviteCode: '',
        phone: '',
        regtime: '',
        authStatus: '', // 审核情况
        cityName: ''
      },
      clickedUserId: '' // 当前点中的用户ID
    }
  },
  created() {
    this.search()
    this.getCertificateRun()
  },
  methods: {
    search (pgi) {
      if (pgi) this.pageIndex = pgi
      let datetime = []
      datetime = this.queryParams.regtime
      let _params = {
        memberId: this.queryParams.memberId,
        name: this.queryParams.nickName,
        inviteCode: this.queryParams.inviteCode,
        phone: this.queryParams.phone,
        registeredEndTime: datetime ? datetime[1] : '',
        registeredStartTime: datetime ? datetime[0] : '',
        authStatus: this.queryParams.authStatus, // 审核情况
        cityName: this.queryParams.cityName,
        pageSize: this.pageSize,
        currentPage: this.pageIndex
      }
      this.loading = true
      searchUserList(_params).then(response => {
        if (response.code === 200) {
          this.tableData = JSON.parse(JSON.stringify(response.data.list))
          this.totalPage = response.data.total
          for (let [k, s] of Object.entries(this.tableData || [])) {
            this.$set(this.tableData[k], 'statusTransfered', s.status === 1 ? true : false)
          }
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
    },
    clickCertifyResult (id) {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields()
      })
      this.queryCertifyResultStatus(id)
      this.clickedUserId = id
    },
    queryCertifyResultStatus (id) {
      someoneCertifyResult({
        memberId: id
      }).then(response => {
        if (!response.data) {
          this.certifyform.imageUrlSuccessFRONT = ''
          this.certifyform.imageUrlSuccessBACK = ''
          this.certifyform.imageUrlSuccessHAND = ''
          this.certifyform.userName = ''
          this.certifyform.idCardNumber = ''
          this.certifyform.statusType = -1
        } else {
          this.certifyform.imageUrlSuccessFRONT = response.data.frontImgUrl
          this.certifyform.imageUrlSuccessBACK = response.data.backImgUrl
          this.certifyform.imageUrlSuccessHAND = response.data.handHoldImgUrl
          this.certifyform.userName = response.data.userName
          this.certifyform.idCardNumber = response.data.idCardNumber
          this.certifyform.statusType = response.data.statusType
        }
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.search()
    },
    addressChange(arr) {
      this.queryParams.cityName = CodeToText[arr[0]] + CodeToText[arr[1]] + CodeToText[arr[2]]
    },
    approveOrRefuseClick (type) {
      let _desc = type === 1 ? '通过' : '不通过'
      this.$confirm(`确认审核${_desc}吗？`, '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.certifyform.statusType = type
        let _params = {
          frontImgUrl:this.certifyform.imageUrlSuccessFRONT,
          backImgUrl: this.certifyform.imageUrlSuccessBACK,
          handHoldImgUrl: this.certifyform.imageUrlSuccessHAND,
          memberId: this.clickedUserId,
          userName: this.certifyform.userName,
          idCardNumber: this.certifyform.idCardNumber,
          statusType: this.certifyform.statusType
        }
        refuseOrApprove(_params).then(response => {
          if (response.code === 200) {
            this.msgSuccess(`操作成功`)
            this.search()
          } else {
            this.msgSuccess(response.message)
          }
        })
      }).catch(() => {})
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
    async put (type) {
      try {
        let _res = await upload(this.certificateInfos, this.file)
        let ossFileUrl = _res.res.requestUrls[0]
        //如果CDN域名不为空，则替换成CDN域名
        if(this.certificateInfos.bucketCdnUrl){
          ossFileUrl = replaceUnitlPrefixStr(ossFileUrl, this.certificateInfos.endpoint, this.certificateInfos.bucketCdnUrl);
        }
        switch(type) {
          case 'BACK':
            this.certifyform.imageUrlSuccessBACK = ossFileUrl
            this.$refs['ruleForm'].clearValidate('imageUrlSuccessBACK')
            break;
          case 'FRONT':
            this.certifyform.imageUrlSuccessFRONT = ossFileUrl
            this.$refs['ruleForm'].clearValidate('imageUrlSuccessFRONT')
            break;
          case 'HAND':
            this.certifyform.imageUrlSuccessHAND = ossFileUrl
            this.$refs['ruleForm'].clearValidate('imageUrlSuccessHAND')
            break;
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 选择文件
    getFileObj (e, type) {
      this.path = e.target.value;
      this.file = e.target.files[0]
      this.put(type)
    },
    // 实名认证资料提交保存
    saveMdfClick (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let _params = {
            frontImgUrl:this.certifyform.imageUrlSuccessFRONT,
            backImgUrl: this.certifyform.imageUrlSuccessBACK,
            handHoldImgUrl: this.certifyform.imageUrlSuccessHAND,
            memberId: this.clickedUserId,
            userName: this.certifyform.userName,
            idCardNumber: this.certifyform.idCardNumber,
            statusType: this.certifyform.statusType
          }
          save(_params).then(response => {
            if (response.code === 200) {
              this.msgSuccess(`保存成功`)
              this.dialogFormVisible = false
            } else {
              this.msgSuccess(response.message)
              this.dialogFormVisible = false
            }
          })
        }
      })
    }
  }
};
</script>
<style>
.userlistwapper{padding: 20px;}
.userlistwapper .el-pagination{
  text-align: right;
  padding-top: 10px;
}
/*upload style*/
.userlistwapper .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.userlistwapper .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.userlistwapper .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.userlistwapper .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.userlistwapper .certifyForm{
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
.customUploadBox input{
  width: 190px;
  height: 190px;
  opacity: 0;
  z-index: 102;
  position: absolute;
  top:5px;
  left: 5px;
  cursor: pointer;
}
.customUploadBox svg{
  position: absolute;
  top:87px;
  left: 87px;
  height: 30px;
  width:30px;
  z-index: 101;
}
.twoBtns{
  text-align: right;
  padding: 15px 20px;
}
.certifyResbox {color: blue;cursor: pointer;}
</style>
