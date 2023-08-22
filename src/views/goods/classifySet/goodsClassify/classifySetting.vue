<template>
  <div class="classifySettingBox">
    
    <el-dialog
      :title="curActionType === 'add' ? '添加' : ' 编辑'"
      :visible.sync="sendTochildBridgeData.visible"
      width="39%"
      :before-close="handleClose">

    <el-form ref="ruleFormClassSet" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="分类名称：" prop="categoryName" class="clsLabelCus">
        <el-input maxlength="10" style="width:80%" v-model.trim="form.categoryName"></el-input>
      </el-form-item>
      <el-form-item label="属性类型：" prop="goodsAttrId">
        <el-select v-model="form.goodsAttrId" placeholder="请选择属性类型" clearable>
          <el-option
            v-for="item in goodsAttrIdArr"
            :key="item.value"
            :label="item.attributeName"
            :value="item.attributeId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序：" prop="sort">
        <el-input-number step-strictly :step="1" :min="1" v-model="form.sort" controls-position="right" @change="handleChange" @blur="handleBlur"></el-input-number>
      </el-form-item>
      <el-form-item label="是否显示：" prop="showStatus">
        <el-switch v-model="form.showStatus"></el-switch>
      </el-form-item>
      <el-form-item label="是否显示在导航栏：" prop="displayOnNavigationBar">
        <el-switch v-model="form.displayOnNavigationBar"></el-switch>
      </el-form-item>
      

      <el-form-item label="分类图标：" prop="iconUrl">
       
        <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :http-request="handleAvatarSuccessRUN.bind(file, 'ICON')">
            <img v-if="form.iconUrl" :src="form.iconUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>

          <i @click="handleRemove('ICON')" v-if="form.iconUrl" class="el-icon-delete afterUploadDelBtn"></i>
          
      </el-form-item>

      <el-form-item label="分类广告图片：" prop="advertPicUrl">
       
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :http-request="handleAvatarSuccessRUN.bind(file, 'PIC')">
            <img v-if="form.advertPicUrl" :src="form.advertPicUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>

            <i @click="handleRemove('PIC')" v-if="form.advertPicUrl" class="el-icon-delete afterUploadDelBtn"></i>
      </el-form-item>


      <el-form-item label="分类描述：" prop="describe">
        <el-input
           style="width:80%"
          type="textarea"
          placeholder="请输入内容"
          v-model.trim="form.describe"
          maxlength="30"
          show-word-limit
        >
        </el-input>
      </el-form-item>

      <el-form-item style="text-align:right;">
        <el-button :loading="loadingSave" type="primary" @click="onSubmit('ruleFormClassSet')">保存</el-button>
        <el-button @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>

    </el-dialog>

  </div>
</template>

<script>
import { delCategory, categoryList, addCategory, editCategory, goodsAttributeList } from "@/api/goods/goodsAbout";
import { getCertificate, upload } from "@/api/system/userlist";
import {compareVersion, replaceUnitlPrefixStr} from '@/utils/index';
  export default {
    props: ['sendTochildBridgeData'],
    components: {},
    data () {
      let imgValidator = (rule, value, callback) => {
        if (!/\S/.test(value)) {
          callback(new Error('请上传图片'))
        } else {
          callback()
        }
      }
      let categoryNameValidator = (rule, value, callback) => {
        if (!/\S/.test(value) || !value) {
          callback(new Error('分类名称不能为空'))
        } else {
          callback()
        }
      }
      return {
        goodsAttrIdArr: [],
        curActionType: 'add',
        loadingSave: false,
        file: {},
        form: {
          categoryName: '', // must
          goodsAttrId: '',
          sort: '',
          showStatus: true, // must
          displayOnNavigationBar: true, // must
          describe: '',
          advertPicUrl: '',
          iconUrl: '',
          parentId: '' // must,1级新增，不用传
        },
        rules: {
          categoryName: [
            { validator: categoryNameValidator, trigger: 'blur' },
            { min: 1, max: 10, message: '长度在1到10个字符', trigger: 'blur' }
          ],
          iconUrl: [
            // { validator: imgValidator, trigger: 'blur,change' }
          ],
          advertPicUrl: [
            // { validator: imgValidator, trigger: 'blur,change' }
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
              ategoryName: '',
              goodsAttrId: '',
              sort: '',
              showStatus: true,
              displayOnNavigationBar: true,
              describe: '',
              advertPicUrl: '',
              iconUrl: '',
              parentId: newVal.data.parentId
            }
            // this.form.categoryName = newVal.data.categoryName
          } else if (newVal.actionType === 'edit'){
            this.curActionType = 'edit'
            this.form = {
              categoryId: newVal.rowData.categoryId, // 编辑时候，需多传一个分类ID参数
              categoryName: newVal.rowData.categoryName,
              goodsAttrId: newVal.rowData.goodsAttrId,
              sort: newVal.rowData.sort,
              showStatus: newVal.rowData.showStatus,
              displayOnNavigationBar: newVal.rowData.displayOnNavigationBar,
              describe: newVal.rowData.describe,
              advertPicUrl: newVal.rowData.advertPicUrl,
              iconUrl: newVal.rowData.iconUrl,
              parentId: newVal.data.parentId
            }
          }
          this.$nextTick(() => {
            this.$refs.ruleFormClassSet.clearValidate()
          })
        },
        deep: true
      }
    },
    computed: {},
    created () {
      this.goodsAttributeListRun()
    },
    mounted () {
      this.getCertificateRun()
    },
    methods: {
      handleRemove(type) {
        if (type === 'ICON') {
          this.form.iconUrl = ''
        } else {
          this.form.advertPicUrl = ''
        }
      },
      goodsAttributeListRun () {
        goodsAttributeList().then(response => {
            if (response.code === 200) {
            this.goodsAttrIdArr = response.data.list
            } else {
            this.goodsAttrIdArr = []
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
      async handleAvatarSuccessRUN (type, file) { // the order of the parameters here must be reversed.
        let _valid = this.beforeAvatarUpload(file.file, type)
        if (type === 'ICON') {
          if (!_valid.isNOtJPGPNG && !_valid.isGT200K) await this.put(file.file, type)
        } else if (type === 'PIC'){
          if (!_valid.isNOtJPGPNG && !_valid.isGt2M) await this.put(file.file, type)
        }
      },
      beforeAvatarUpload(file, uploadType) {
        const isNOtJPGPNG = file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png'
        const isGt2M = file.size / 1024 / 1024 > 5
        const isGT200K = file.size > 200 * 1024
        if (isNOtJPGPNG) {
          this.$message.error('请上传是 jpg、png、jpeg 格式的图片!')
        } else if (isGt2M && uploadType === 'PIC') {
          this.$message.error('上传图片大小不能超过 5MB!')
        } else if (isGT200K && uploadType === 'ICON') {
          this.$message.error('上传图标大小不能超过 200kb!')
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
            case 'PIC':
              this.form.advertPicUrl = ossFileUrl
              this.$refs['ruleFormClassSet'].clearValidate('advertPicUrl')
              break;
            case 'ICON':
              this.form.iconUrl = ossFileUrl
              this.$refs['ruleFormClassSet'].clearValidate('iconUrl')
              break;
          }
        } catch (e) {
          console.log(e)
        }
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 保存提交
            this.loadingSave = true
            let _form = Object.assign({}, this.form)
            _form.showStatus = this.form.showStatus
            _form.displayOnNavigationBar = this.form.displayOnNavigationBar
            _form.parentId = this.form.parentId === '' ? 0 : this.form.parentId
            const _api = this.curActionType === 'add' ? addCategory : editCategory
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
        this.$refs.ruleFormClassSet.clearValidate()
      },
      handleBlur (ev) {
        // blur后若输入内容为空，处理为显示对应特权类型的最小默认值
        if (ev.target.ariaValueNow === 'undefined') ev.target.value = ev.target.ariaValueMin
      },
      handleChange (value) {
        this.$forceUpdate()
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
<style>
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
.clsLabelCus .el-form-item__label{
  position: relative;
}
.clsLabelCus .el-form-item__label::after{
  content: "*";
  position: absolute;
  top:2px;
  right: 89px;
  color: red;
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

