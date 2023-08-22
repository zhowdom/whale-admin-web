<template>
  <div class="goodsClassfyWrapper classifySettingBox">
    
    <el-dialog
      :title="curActionType === 'add' ? '添加' : ' 编辑'"
      :visible.sync="sendTochildBridgeData.visible"
      width="50%"
      :before-close="handleClose">

    <el-form ref="gdBrandsform" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="品牌名称：" prop="brandName" class="mockRequired" style="width:500px;">
        <el-input maxlength="10" v-model.trim="form.brandName"></el-input>
      </el-form-item>
      <el-form-item label="品牌首字母：" style="width:500px;" prop="brandInitials">
        <el-input maxlength="1" v-model.trim="form.brandInitials"></el-input>
      </el-form-item>
      <el-form-item label="品牌故事：" style="width:500px;">
        <el-input type="textarea" v-model.trim="form.brandStory" show-word-limit maxlength="200"></el-input>
      </el-form-item>
      <el-form-item label="排序：">
        <el-input-number controls-position="right" v-model="form.sort" :step="1" :min="1" :max="999" step-strictly @blur="handleBlur"></el-input-number>
      </el-form-item>
      <el-form-item label="是否显示：" class="clearfix">
        <el-switch v-model="form.showStatus" class="fl" style="margin-top:8px;"></el-switch>

        <el-tooltip style="margin-left:10px;margin-top:8px;" class="item fl" effect="dark" content="当品牌下还没有商品的时候，分类页的品牌区将不会显示该品牌" placement="top-start">
          <i style="font-size: 19px;" class="el-icon-question"></i>
        </el-tooltip>

      </el-form-item>
      <el-form-item label="品牌制造商：">
        <el-switch v-model="form.manufacturerType"></el-switch>
      </el-form-item>
      

      <el-form-item label="品牌LOGO：" class="mockRequired logo_Set" prop="brandLogoUrl">

        <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :http-request="handleAvatarSuccessRUN.bind(file, 'LOGO')">
            <img v-if="form.brandLogoUrl" :src="form.brandLogoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>

          <i @click="handleRemove('LOGO')" v-if="form.brandLogoUrl" class="el-icon-delete afterUploadDelBtn"></i>
          <div style="color:#999;font-size:12px;">只能上传jpg/png格式文件，文件不能超过200KB</div>
      </el-form-item>

      <el-form-item label="品牌专区大图：" prop="brandBigPicUrl">

        <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :http-request="handleAvatarSuccessRUN.bind(file, 'BIGPIC')">
            <img v-if="form.brandBigPicUrl" :src="form.brandBigPicUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>

          <i @click="handleRemove('BIGPIC')" v-if="form.brandBigPicUrl" class="el-icon-delete afterUploadDelBtn"></i>

          <div style="color:#999;font-size:12px;">只能上传jpg/png格式文件，文件不能超过5M</div>

      </el-form-item>

      <el-form-item style="text-align:right">
        <el-button v-hasPermi="['goods:brand:edit']" :loading="loadingSave" type="primary" @click="onSubmit('gdBrandsform')">保存</el-button>
        <el-button @click="sendTochildBridgeData.visible = false">取消</el-button>
      </el-form-item>
    </el-form>

    </el-dialog>

  </div>
</template>

<script>
import { getCertificate, upload } from "@/api/system/userlist";
import { gdBrandsList, gdBrandsDel, gdBrandsAdd, gdBrandsAlter } from "@/api/goods/goodsAbout";
import {compareVersion, replaceUnitlPrefixStr} from '@/utils/index';
  export default {
    props: ['sendTochildBridgeData'],
    components: {},
    data () {
      let validateItembrandName = (rule, value, callback) => {
        if (!/\S/.test(value) || !value) {
          callback(new Error('品牌名称不能为空'))
        } else {
          callback()
        }
      }
      let validateItembrandLogo = (rule, value, callback) => {
        if (!/\S/.test(value) || !value) {
          callback(new Error('品牌LOGO不能为空'))
        } else {
          callback()
        }
      }
      let validateItembrandFirst = (rule, value, callback) => {
        if (!/^[a-zA-Z]?$/.test(value) && /\S/.test(value) && value !== null) {
          callback(new Error('品牌首字母格式不正确'))
        } else {
          callback()
        }
      }
      return {
        loadingSave: false,
        curActionType: 'add',
        file: {},
        form: {
          brandName: '',
          brandInitials: '',
          sort: '',
          brandLogoUrl: '',
          brandBigPicUrl: '',
          brandStory: '',
          manufacturerType: true,
          showStatus: true,
          brandId: '' // only edit
        },
        rules: {
          brandName: [
             { validator: validateItembrandName, trigger: 'blur' },
             { min: 1, max: 10, message: '长度在1到10个字符', trigger: 'blur' }
          ],
          brandLogoUrl: [
             { validator: validateItembrandLogo, trigger: 'blur' }
          ],
          brandInitials: [
             { validator: validateItembrandFirst, trigger: 'blur' }
          ]
        },
      }
    },
    filters: {},
    watch: {
      'sendTochildBridgeData': {
        handler: function (newVal, oldVal) {
          if (newVal.actionType === 'add') {
            this.curActionType = 'add'
            this.form = {
              brandName: '',
              brandInitials: '',
              sort: '',
              brandLogoUrl: '',
              brandBigPicUrl: '',
              brandStory: '',
              manufacturerType: true,
              showStatus: true,
              brandId: ''
            }
          } else if (newVal.actionType === 'edit'){
            this.curActionType = 'edit'
            this.form = {
              brandName: newVal.rowData.brandName,
              brandInitials: newVal.rowData.initials,
              sort: newVal.rowData.sort,
              brandLogoUrl: newVal.rowData.logoUrl,
              brandBigPicUrl: newVal.rowData.bigPicUrl,
              brandStory: newVal.rowData.story,
              manufacturerType: newVal.rowData.manufacturerType,
              showStatus: newVal.rowData.showStatus,
              brandId: newVal.data.brandId
            }
          }
          this.$nextTick(() => {
            this.$refs.gdBrandsform.clearValidate()
          })
        },
        deep: true
      }
    },
    computed: {},
    mounted () {
      this.getCertificateRun()
    },
    methods: {
      handleRemove(type) {
        if (type === 'LOGO') {
          this.form.brandLogoUrl = ''
        } else {
          this.form.brandBigPicUrl = ''
        }
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
      async handleAvatarSuccessRUN (type, file) { // the order of the parameters here must be reversed.
        let _valid = this.beforeAvatarUpload(file.file, type)
        if (type === 'LOGO') {
          if (!_valid.isNOtJPGPNG && !_valid.isGT200K) await this.put(file.file, type)
        } else if (type === 'BIGPIC'){
          if (!_valid.isNOtJPGPNG && !_valid.isGt2M) await this.put(file.file, type)
        }
      },
      beforeAvatarUpload(file, uploadType) {
        const isNOtJPGPNG = file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png'
        const isGt2M = file.size / 1024 / 1024 > 5
        const isGT200K = file.size > 200 * 1024
        if (isNOtJPGPNG) {
          this.$message.error('请上传是 jpg、png、jpeg 格式的图片!')
        } else if (isGt2M && uploadType === 'BIGPIC') {
          this.$message.error('上传图片大小不能超过 5MB!')
        } else if (isGT200K && uploadType === 'LOGO') {
          this.$message.error('上传Logo大小不能超过 200kb!')
        }
        return {
          isNOtJPGPNG,
          isGt2M,
          isGT200K
        }
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
            case 'BIGPIC':
              this.form.brandBigPicUrl = ossFileUrl
              this.$refs['gdBrandsform'].clearValidate('brandBigPicUrl')
              break;
            case 'LOGO':
              this.form.brandLogoUrl = ossFileUrl
              this.$refs['gdBrandsform'].clearValidate('brandLogoUrl')
              break;
          }
        } catch (e) {
          console.log(e)
        }
      },
      handleBlur (ev) {
        // blur后若输入内容为空，处理为显示对应特权类型的最小默认值
        if (ev.target.ariaValueNow === 'undefined') this.sumbitForm.count = ev.target.value = ev.target.ariaValueMin
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 保存提交
            this.loadingSave = true
            let _form = Object.assign({}, this.form)
            _form.showStatus = this.form.showStatus
            _form.manufacturerType = this.form.manufacturerType
            _form.brandInitials = this.form.brandInitials || null
            if (this.curActionType === 'add') {
              Reflect.deleteProperty(_form, 'brandId')
            }
            const _api = this.curActionType === 'add' ? gdBrandsAdd : gdBrandsAlter
            _api(_form).then(response => {
                if (response.code === 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  'duration': 1000,
                  onClose: () => {
                    this.handleClose()
                    this.loadingSave = false
                    this.sendTochildBridgeData.search()
                   }
                 })
                } else {
                this.$message({
                  type: 'error',
                  message: response.message
                })
                this.loadingSave = false
              }
            }).catch(() => {
              this.loadingSave = false
            })
            // emit data to parent
            // this.$emit('emitToParentMsg', this.form)
          }
        })
      },
      handleClose() {
        this.sendTochildBridgeData.visible = false
      }
    }
  }
</script>

<style lang="scss" scoped>
.goodsClassfyWrapper{
  padding: 20px;
  .goodsIMG{
    height: 50px;
    width: 50px;
    margin: 0 auto;
    & img{
      height: 100%;
      width: 100%;
      overflow: hidden;
      border-radius: 3px;
    }
  }
}
</style>
<style lang="scss">
.mockRequired label.el-form-item__label{
  position: relative;
}
.mockRequired label.el-form-item__label:before{
  position: absolute;
  top:0;
  right:86px;
  content: '*';
  color: red;
  }
  .mockRequired.logo_Set label.el-form-item__label:before{
    right:100px;
  }
  /*upload style*/
.classifySettingBox .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.classifySettingBox .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.classifySettingBox .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.classifySettingBox .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.classifySettingBox .certifyForm{
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
/*delete upload icon*/
.afterUploadDelBtn{
  position: absolute;
  height: 180px;
  width:180px;
  top:0;
  left: 0;
  z-index: 11;
  color:#fff;
  font-size:18px;
  opacity: 0;
  cursor: pointer;
}
.afterUploadDelBtn::after{
  position: absolute;
  top:0;
  right:0;
  left:0;
  bottom: 0;
  z-index: 10;
  height: 180px;
  width: 180px;
  display: block;
  content: '';
}
.afterUploadDelBtn::before{
  line-height: 180px;
  margin-left: 76px;
}
.afterUploadDelBtn:hover{
  opacity: 1;
  background: rgba(0,0,0,.5);
  border-radius: 3px;
}
</style>

