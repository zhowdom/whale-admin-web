<template>
  <div class="shareAddManagebox" style="padding:20px;">


    <el-form :model="nLevelqueryParams" ref="nLevelqueryForm" :inline="true">

      <el-form-item label="手机号" prop="phone">
        <el-input v-model.trim="queryParams.phone" placeholder="请输入内容" :maxlength="11" clearable></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="phone">
        <el-input v-model.trim="queryParams.email" placeholder="请输入内容" clearable></el-input>
      </el-form-item>
      <el-form-item label="邀请码" prop="inviteCode">
          <el-input v-model.trim="queryParams.inviteCode" placeholder="请输入内容" clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-button v-hasPermi="['otc:ubusiness_conf:list']" type="primary" :loading="loading" @click="searchnLevel(1)">查询</el-button>
        <el-button v-hasPermi="['otc:ubusiness_conf:storage']" type="primary" :loading="loading" icon="el-icon-plus" @click="addClick(1)">新增</el-button>
      </el-form-item>
    </el-form>
  <el-table :data="nLevelData">
    <el-table-column property="phone" label="手机号"></el-table-column>
    <el-table-column property="email" label="邮箱"></el-table-column>
    <el-table-column property="inviteCode" label="邀请码"></el-table-column>
    <el-table-column property="nickName" label="昵称"></el-table-column>
    
    <el-table-column property="enabled" label="状态">
      <template scope="scope">
          <el-switch
          v-hasPermi="['otc:ubusiness_conf:status']"
          v-model="scope.row.enabled"
          @change="watchChange(scope.row)"
          class="customSwitchStyle"
          active-color="#00A854"
          active-text="已开启"
          inactive-color="#F04134"
          inactive-text="已禁用"
          />
        </template>
    </el-table-column>
    <el-table-column label="操作">
      <template scope="scope">
        <el-button v-show="!scope.row.enabled" v-hasPermi="['otc:ubusiness_conf:storage']" type="text" @click="editClick(scope.row)">编辑</el-button>
        <!-- <el-button v-if="!scope.row.status" v-hasPermi="['advertising:prop:delete']" type="text" @click="removeClick(scope.row)">删除</el-button> -->
      </template>
    </el-table-column>

  </el-table>
  <el-pagination
    style="padding-top:20px;"
    @current-change="searchnLevel"
    :page-sizes="[10, 20, 30]"
    @size-change="handleSizeChangenLevel"
    :current-page.sync="pageIndexnLevel"
    :page-size="pageSizenLevel"
    layout="total, sizes, prev, pager, next, jumper"
    :total="totalPagenLevel">
    </el-pagination>

<!--新增编辑弹窗-->
<el-dialog title="" :visible.sync="dialogFormVisible" width="45%">
  <el-form :model="certifyform" :rules="rules" ref="ruleForm">
  
  <el-form-item class="requiredStyle rela" label="手机号" :label-width="formLabelWidth" style="width:500px;">
    <el-input v-model.trim="certifyform.phone" @blur="((e) => checkBlur(e, certifyform.phone, 'phone'))" placeholder="请输入手机号" clearable :maxlength="11"></el-input>
  </el-form-item>

  <el-form-item class="requiredStyle rela" label="邮箱" :label-width="formLabelWidth" style="width:500px;">
    <el-input v-model.trim="certifyform.email" @blur="((e) => checkBlur(e, certifyform.email, 'email'))" placeholder="请输入邮箱" clearable></el-input>
  </el-form-item>

  <el-form-item class="requiredStyle rela" label="邀请码" :label-width="formLabelWidth" style="width:500px;">
    <el-input v-model.trim="certifyform.inviteCode" @blur="((e) => checkBlur(e, certifyform.inviteCode, 'code'))" clearable placeholder="请输入邀请码"></el-input>
  </el-form-item>

  <el-form-item class="requiredStyle rela" label="" label-width="30px" style="width:500px;">
    <div style="font-size:12px;padding-left:60px;">
        注：<br>
          <span style="padding-left:12px;display:inline-block;">1. 指定U商，即可以发布广告或购买出售均不受【持有100 糖果包】限制</span><br>
          <span style="padding-left:12px;display:inline-block;">2.用户与U商发布广告发生交易，则此用户不受【持有100 糖果包】限制。</span><br>
          <span style="padding-left:12px;display:inline-block;">3. U商发布广告与购买出售的限制，需取U商的相关配置；</span><br>
          <span style="padding-left:12px;display:inline-block;">4. 除【广告宝配置】中的【广告商发布配置】【购买出售配置】【OTC权限配置】，对U商不起作用，其他生效</span>
 
    </div>
  </el-form-item>
    
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" :loading="loadingAlter" @click="saveClick">确 定</el-button>
  </div>
</el-dialog>



  </div>
</template>

<script>
import { getCertificate, upload } from "@/api/system/userlist";
import { usListQuery, usStatusAlter, usAddOrEdit, atPropDel, coinSelectNews, usPhoneLinkQueryCode } from "@/api/otc_adsTreasure";
import {compareVersion, replaceUnitlPrefixStr} from '@/utils/index';
  export default {
    components: {},
    data () {
      let pictUrlValidator = (rule, value, callback) => {
        if (!/\S/.test(value)) {
          callback(new Error('请上传图片！'))
        } else {
          callback()
        }
      }
      let phoneValidator = (rule, value, callback) => {
        if (!/\S/.test(value) || value === undefined) {
          callback(new Error('请输入'))
        } else {
          callback()
        }
      }
      let inviteCodeValidator = (rule, value, callback) => {
        if (!/\S/.test(value) || value === undefined) {
          callback(new Error('请输入'))
        } else {
          callback()
        }
      }
      let emailValidator = (rule, value, callback) => {
        if (!/\S/.test(value) || value === undefined) {
          callback(new Error('请输入'))
        } else {
          callback()
        }
      }
      let legalRightValidator = (rule, value, callback) => {
        if (!/\S/.test(value) || value === undefined) {
          callback(new Error('权益不能为空！'))
        } else {
          callback()
        }
      }
      let priceValidator = (rule, value, callback) => {
        if (!/\S/.test(value) || value === undefined) {
          callback(new Error('单价不能为空！'))
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
      var validatePhone = (rule, value, callback) => {
        if (!(/^1[3456789]\d{9}$/.test(value)) && value !== '') {
          return callback(new Error('请输入正确的手机号码'))
        }
        callback()
      }
      let conditionValidator = (rule, value, callback) => {
        // if ((value == ''|| value == null || value == undefined) && value != 0 ) {
        //   callback(new Error('不能为空'))
        // }else 
        if(value < 0 || value > 100000) {
          callback(new Error('请输入0 ~ 100000数字'))
        } else {
          callback()
        }
      }
      return {
        loadingAlter: false,
        queryParams: {
          phone: '',
          inviteCode: ''
        },
        submitLoading: false,
        condition: {
          id: '',
          buyMaxPrice: null,
          buyMinPrice: null,
          saleMaxPrice: null,
          saleMinPrice: null
        },
        dialogEditRelease: false,
        coinIdMaps: [],
        certifyform: {
          coinName: '',
          email: '',
          feeRate: 0,
          id: '',
          type: ''
        },
        rulesRelease: {
          buyMaxPrice: [
            { required: false, validator: conditionValidator, trigger: 'blur' }
          ],
          buyMinPrice: [
            { required: false, validator: conditionValidator, trigger: 'blur' }
          ],
          saleMaxPrice: [
            { required: false, validator: conditionValidator, trigger: 'blur' }
          ],
          saleMinPrice: [
            { required: false, validator: conditionValidator, trigger: 'blur' }
          ],
        },
        rules: {
          phone: [
            { validator: phoneValidator, trigger: 'blur' }
          ],
          inviteCode: [
            { validator: inviteCodeValidator, trigger: 'blur' }
          ],
          email: [
            { validator: emailValidator, trigger: 'blur' }
          ]
        },
        nLevelrules: {
          phone: [
            { validator: validatePhone, trigger: 'blur' }
          ]
        },
        nLevelqueryParams: {
          code: '',
          name: '',
          phone: '',
          memberId: '',
          realName: '',
          periodsNum: '',
          redbacktime: ''
        },
        nLevelPrizeTitle: '',
        pageIndexnLevel: 1,
        pageSizenLevel: 10,
        totalPagenLevel: 0,
        nLevelData: [],
        nLevelPrizesVisible: false,
        loading: false,
        dialogFormVisible: false,
        formLabelWidth: '130px',
        path: '',
        file: {},
        curActType: '',
      }
    },
    created () {
      this.coinIdMapsSelect()
    },
    mounted () {
      this.getCertificateRun()
      this.isAuth.isPermi(['otc:buy_sale_conf:list']) && this.searchnLevel(1)
    },
    watch: {},
    methods: {
      checkBlur (e, v, type) {
        let _params
        if (type == 'phone') {
          _params = {
            inviteCode: '',
            email: '',
            phone: v
          }
        } else if (type == 'email') {
          _params = {
            inviteCode: '',
            email: v,
            phone: ''
          }
        } else if (type == 'code') {
          _params = {
            inviteCode: v,
            email: '',
            phone: ''
          }
        }
        if (!_params.email && !_params.phone) return false
        usPhoneLinkQueryCode(_params).then(response => {
          if (response.code == 200) {
            this.certifyform.inviteCode = response.data?.inviteCode
            this.certifyform.phone = response.data?.phone
            this.certifyform.email = response.data?.email
          } else {
            this.$message.error(response.message)
          }
        })
      },
      handleBlur (ev, type) {
        // blur后若输入内容为空，处理为显示对应特权类型的最小默认值
        if (ev.target.ariaValueNow === 'undefined') {
          ev.target.value = ev.target.ariaValueMin
          this.certifyform[type] = ev.target.ariaValueMin
        }
      },
      coinIdMapsSelect () {
        coinSelectNews().then((response) => {
          if (response.code == 200) {
            this.coinIdMaps = (response.data.list || []).map(v => {
              let {id, coinName, imgUrl, enable} = v
              return {
                id: coinName,
                coinName,
                enable,
                imgUrl
              }
            })
          } else {
            this.coinIdMaps = []
          }
        })
      },
      editClick (row) {
        this.dialogFormVisible = true
        this.curActType = 'edit'
        this.certifyform = Object.assign({}, row)
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
        })
      },
      saveClick () {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            if (!this.certifyform.email && !this.certifyform.phone) {
              this.$message.error('请输入手机号或邮箱')
              return false
            }
            this.loadingAlter = true
            let _params = {
              roleType: 2,
              ...this.certifyform
            }
            if (this.curActType === 'edit') {
              Reflect.deleteProperty(_params, 'createAt')
              Reflect.deleteProperty(_params, 'enabled')
              Reflect.deleteProperty(_params, 'modifyAt')
              Reflect.deleteProperty(_params, 'nickName')
              Reflect.deleteProperty(_params, 'status')
            } else {
              Reflect.deleteProperty(_params, 'id')
            }
            usAddOrEdit(_params).then(response => {
              if (+response.code === 200) {
                this.msgSuccess(`操作成功`)
                this.isAuth.isPermi(['otc:buy_sale_conf:list']) && this.searchnLevel()
              } else {
                this.$message.error(response.message)
              }
              this.dialogFormVisible = false
              this.loadingAlter = false
            }).catch(e => {
              console.log(e)
              this.loadingAlter = false
            })
          }
        })
      },
      addClick () {
        this.dialogFormVisible = true
        this.curActType = 'add'
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
          this.certifyform = {
            inviteCode: '',
            phone: '',
            id: '',
          }
        })
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
            case 'FRONT':
              this.certifyform.image = ossFileUrl
              this.$refs['ruleForm'].clearValidate('image')
              break;
          }
        } catch (e) {
          console.log(e)
        }
      },
      async handleAvatarSuccessRUN (type, file) { // the order of the parameters here must be reversed.
        let _valid = this.beforeAvatarUpload(file.file)
        if (!_valid) await this.put(file.file, type)
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
      removeClick (val) {
        this.$confirm(`确认要执行此操作吗？`, '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _params = {}
          _params.id = val.id
          atPropDel(_params).then(response => {
            if (response.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                'duration': 1000,
                onClose: () => {
                  this.isAuth.isPermi(['otc:buy_sale_conf:list']) && this.searchnLevel(1)
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
      watchChange (val) {
        this.$confirm(`确认要执行此操作吗？`, '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _params = {}
          _params.id = val.id
          _params.enabled = val.enabled
          usStatusAlter(_params).then(response => {
            if (response.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                'duration': 1000,
                onClose: () => {
                  this.isAuth.isPermi(['otc:buy_sale_conf:list']) && this.searchnLevel(1)
                }
              })
            } else {
              val.enabled = !val.enabled
              this.$message.error(response.message)
            }
          }).catch(({ error }) => {
            val.enabled = !val.enabled
            if (error) this.$message.error(error.message)
          })
        }).catch(() => {
          val.enabled = !val.enabled
        })
      },
      nLevelPrizeInfosClick (row) {
        this.nLevelPrizesVisible = true
        this.nLevelPrizeTitle = '二等奖管理（期数：200902）'
      },
      searchnLevel (pgi) {
        this.$refs['nLevelqueryForm'].validate((valid) => {
          if (valid) {
            if (pgi) this.pageIndexnLevel = pgi
            let _params = {
              roleType: 2,
              phone: this.queryParams.phone,
              email: this.queryParams.email,
              inviteCode: this.queryParams.inviteCode,
              currentPage: this.pageIndexnLevel,
              pageSize: this.pageSizenLevel,
            }
            this.loading = true
            usListQuery(_params).then(response => {
              if (response.code === 200) {
                this.nLevelData = (response.data.list || []).map(v => {
                  let {status, ...a} = v
                  return {
                    status: +status === 1,
                    ...a
                  }
                })
                this.totalPagenLevel = response.data.total
                this.loading = false
              } else {
                this.nLevelData = []
                this.totalPagenLevel = 0
                this.pageSizenLevel = 10
                this.loading = false
                this.$message.error(response.message)
              }
            }).catch(e => {
              this.loading = false
            })
          }
        })
      },
      handleSizeChangenLevel (val) {
        this.pageSizenLevel = val
        this.pageIndexnLevel = 1
        this.isAuth.isPermi(['otc:buy_sale_conf:list']) && this.searchnLevel()
      },
    }
  }
</script>

<style lang="scss" scoped>
</style>
<style>
/*upload style*/
.shareAddManagebox .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.shareAddManagebox .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.shareAddManagebox .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.shareAddManagebox .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>


