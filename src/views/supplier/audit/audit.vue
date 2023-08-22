<template>
  <div class="audit-supplier">
    <el-card class="detail-card" v-if="source==1" shadow="always">
      <div class="cityInfo">
        <el-row class="info-item" :gutter="20">
          <el-col :span="4">当前用户真实姓名</el-col>
          <el-col :span="10">{{info.userName||'-'}}</el-col>
        </el-row>
        <el-row class="info-item" :gutter="20">
          <el-col :span="4">当前用户手机号</el-col>
          <el-col :span="10">{{info.phone||'-'}}</el-col>
        </el-row>
      </div>
    </el-card>

    <el-card class="detail-card" shadow="always">
      <div class="cityInfo">
        <el-row class="info-item" :gutter="20">
          <el-col :span="4">供应商名称</el-col>
          <el-col :span="10">{{info.name||'-'}}</el-col>
        </el-row>
        <el-row class="info-item" :gutter="20">
          <el-col :span="4">联系人</el-col>
          <el-col :span="10">{{info.contactPerson||'-'}}</el-col>
        </el-row>
        <el-row class="info-item" :gutter="20">
          <el-col :span="4">初始联系电话</el-col>
          <el-col :span="10">{{info.contactTelephone||'-'}}</el-col>
        </el-row>
        <el-row class="info-item" :gutter="20">
          <el-col :span="4">联系电话</el-col>
          <el-col :span="10">{{info.sellerPhone||'-'}}</el-col>
        </el-row>
        <el-row class="info-item" :gutter="20">
          <el-col :span="4">所在地址</el-col>
          <el-col :span="10">{{info.provinceName||'-'}} {{info.cityName||'-'}} {{info.districtName||'-'}}</el-col>
        </el-row>
        <el-row class="info-item" :gutter="20">
          <el-col :span="4">详细地址</el-col>
          <el-col :span="10">{{info.address||'-'}}</el-col>
        </el-row>
      </div>
    </el-card>

    <el-card class="detail-card" shadow="always" v-if="source==2">
      <div class="cityInfo">
        <el-row class="info-item" :gutter="20">
          <el-col :span="4">供应商logo</el-col>
          <el-col :span="10">
            <div class="supplier-logo" v-if="info.logo">
              <img :src="info.logo" alt="供应商logo">
            </div>
            <span class="no-img" v-else>无图片</span>
          </el-col>
        </el-row>
        <el-row class="info-item" :gutter="20">
          <el-col :span="4">供应商账号</el-col>
          <el-col :span="10">{{info.account||'-'}}</el-col>
        </el-row>
        <el-row class="info-item" :gutter="20">
          <el-col :span="4">供应商密码</el-col>
          <el-col :span="10">*****</el-col>
        </el-row>
      </div>
    </el-card>

    <el-card class="detail-card" shadow="always">
      <div class="cityInfo">
        <el-row class="info-item mb28" :gutter="20">
          <el-col :span="4">营业执照</el-col>
          <el-col :span="10">
            <div class="img-mask" v-if="info.businessLicenseImage">
              <img class="img" crossorigin="anonymous" :src="info.businessLicenseImage" alt="营业执照" srcset="">
              <i @click="handlePictureCardPreview(info.businessLicenseImage)" class="el-icon-circle-plus"></i>
            </div>
            <div class="inline" v-if="info.businessLicenseImage">
              <el-button size="mini" type="primary" icon="el-icon-download" @click="downloadIamge('营业执照', info.businessLicenseImage, info.name)">下载</el-button>
            </div>
            <span class="no-img" v-else>无图片</span>
          </el-col>
        </el-row>

        <el-divider></el-divider>

        <el-row class="info-item mb28" :gutter="20">
          <el-col :span="4">安全生产许可证</el-col>
          <el-col :span="10">
            <div class="img-mask" v-if="info.safetyProductionLicenceImage">
              <img class="img" crossorigin="anonymous" :src="info.safetyProductionLicenceImage" alt="安全生产许可证" srcset="">
              <i @click="handlePictureCardPreview(info.safetyProductionLicenceImage)" class="el-icon-circle-plus"></i>
            </div>
            <div class="inline" v-if="info.safetyProductionLicenceImage">
              <el-button size="mini" type="primary" icon="el-icon-download" @click="downloadIamge('安全生产许可证', info.safetyProductionLicenceImage, info.name)">下载</el-button>
            </div>
            <span class="no-img" v-else>无图片</span>
          </el-col>
        </el-row>

        <el-divider></el-divider>

        <el-row class="info-item mb28" :gutter="20">
          <el-col :span="4">保证书</el-col>
          <el-col :span="10">
            <div class="img-mask" v-if="info.guaranteeLicenceImage">
              <img class="img" crossorigin="anonymous" :src="info.guaranteeLicenceImage" alt="保证书" srcset="">
              <i @click="handlePictureCardPreview(info.guaranteeLicenceImage)" class="el-icon-circle-plus"></i>
            </div>
            <div class="inline" v-if="info.guaranteeLicenceImage">
              <el-button size="mini" type="primary" icon="el-icon-download" @click="downloadIamge('保证书', info.guaranteeLicenceImage, info.name)">下载</el-button>
            </div>
            <span class="no-img" v-else>无图片</span>
          </el-col>
        </el-row>

        <el-divider></el-divider>

        <el-row class="info-item mb28" :gutter="20">
          <el-col :span="4">其它证件</el-col>
          <el-col :span="10">
            <div class="img-mask" v-if="info.otherLicenceImage">
              <img class="img" crossorigin="anonymous" :src="info.otherLicenceImage" alt="其它证件" srcset="">
              <i @click="handlePictureCardPreview(info.otherLicenceImage)" class="el-icon-circle-plus"></i>
            </div>
            <div class="inline" v-if="info.otherLicenceImage">
              <el-button size="mini" type="primary" icon="el-icon-download" @click="downloadIamge('其它证件', info.otherLicenceImage, info.name)">下载</el-button>
            </div>
            <span class="no-img" v-else>无图片</span>
          </el-col>
        </el-row>

        <el-divider></el-divider>

        <el-row class="info-item" :gutter="20">
          <el-col :span="4">供应商介绍</el-col>
          <el-col :span="15">
            <div class="item-border">{{info.description||'-'}}</div>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <div class="form-btns">
      <el-button type="warning" size="large" @click="goBackList">返回</el-button>
      <el-button type="info" size="large" @click="auditHandle(3)">审核失败</el-button>
      <el-button type="primary" size="large" @click="auditHandle(2)">转为正式供应商</el-button>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

    <el-dialog :visible.sync="auditVisible" :close-on-click-modal="false" center width="700px" class="auditDio" :before-close="cancelSubmit">
      <template slot="title">
        <span v-if="auditSign==3" class="red-dot">*</span>
        {{auditSign==3?'备注':'"审核通过"转为正式供应商'}}
      </template>

      <el-form v-if="auditSign==3" :model="auditForm1" :rules="rules" class="auditForm1" key="3" ref="auditForm1">
        <el-form-item prop="remark1">
          <el-input type="textarea" v-model="auditForm1.remark1" :rows="5" maxlength="200" show-word-limit placeholder="请描述审核失败原因"></el-input>
        </el-form-item>
      </el-form>

      <el-form v-if="auditSign==2" :model="auditForm2" :rules="rules" label-width="160px" key="2" class="auditForm2" ref="auditForm2">
        <template v-if="source!=2">
          <el-form-item label="供应商logo" prop="logo">
            <el-upload
              ref="upload"
              :file-list="uploadConf.fileList"
              :http-request="handleRequest.bind(file)"
              :action="uploadConf.action"
              :limit="uploadConf.limit"
              :auto-upload="uploadConf.auto"
              :accept="uploadConf.accept"
              :list-type="uploadConf.type"
              :show-file-list="uploadConf.showList"
              :on-remove="handleRemove.bind(file)">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>

          <el-form-item label="分配供应商账号" prop="account">
            <el-input v-model.trim="auditForm2.account" placeholder="请输入供应商账号"></el-input>
          </el-form-item>
          <el-form-item label="分配供应商账号密码" prop="password">
            <el-input type="password" v-model.trim="auditForm2.password" placeholder="请输入供应商密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="passwordConfirm">
            <el-input type="password" v-model.trim="auditForm2.passwordConfirm" placeholder="请输入供应商密码"></el-input>
          </el-form-item>
        </template>

        <el-form-item label="备注" prop="remark2">
          <el-input type="textarea" v-model="auditForm2.remark2" :rows="5" maxlength="200" show-word-limit placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelSubmit">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {getCertificate, upload} from '@/api/system/userlist';
import {supplierAudit, supplierDetail} from '@/api/supplier/supplier';
import {compareVersion, replaceUnitlPrefixStr} from '@/utils/index';

export default {
  name: 'Audit',
  data () {
    const vm = this;
    return {
      uploadConf: {
        size: 300,
        showList: true,
        auto: true,
        action: '',
        limit: 1,
        fileList: [],
        type: 'picture-card',
        accept: '.png,.jpg,.jpeg,.gif',
        arr: ['image/png', 'image/jpeg', 'image/gif', 'image/jpg'],
      },
      info: {},
      dialogImageUrl: '',
      dialogVisible: false,
      auditVisible: false,
      auditSign: null,
      auditForm1: {
        remark1: ''
      },
      auditForm2: {
        logo: '',
        account: '',
        password: '',
        passwordConfirm: '',
        remark2: '',
      },
      rules: {
        remark1: [
          { required: true, message: '审核失败原因不能为空', trigger: 'blur' },
        ],
        account: [
          { required: true, message: '供应商账号不能为空', trigger: 'blur' },
          { type: 'string', min: 6, max: 20, message: '供应商账号长度6-20个字符', trigger: 'blur' },
          { pattern: /[^\u4e00-\u9fa5]/, message: '供应商账号不能包含中文', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '供应商密码不能为空', trigger: 'blur' },
          { type: 'string', min: 6, max: 20, message: '供应商密码长度6-20个字符', trigger: 'blur' },
          { pattern: /[^\u4e00-\u9fa5]/, message: '供应商密码不能包含中文', trigger: 'blur' },
        ],
        passwordConfirm: [
          { required: true, message: '供应商确认密码不能为空', trigger: 'blur' },
          { type: 'string', min: 6, max: 20, message: '供应商确认密码长度6-20个字符', trigger: 'blur' },
          { pattern: /[^\u4e00-\u9fa5]/, message: '供应商确认密码不能包含中文', trigger: 'blur' },
          { validator: (rule, value, callback) => {
              let val = value;
              let password = vm.auditForm2.password;

              if (val !== password) {
                callback(new Error('确认密码必须与原密码保持一致'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        remark2: [
          { required: true, message: '备注不能为空', trigger: 'blur' },
        ],
      },
      certificateInfos: {},
      file: {},
      id: '',
      source: '',
    }
  },
  mounted () {
    this.info = {};
    this.id = this.$route.query.id;
    this.source = this.$route.query.source;
    this.supplierDetailRequest();
  },
  methods: {
    // 移除上传
    handleRemove(file, fileList) {
      this.auditForm2.logo = '';
      this.uploadConf.fileList = fileList;
      this.switchUploader('upload', 'inline-block');
      this.$refs.auditForm2.validateField('logo');

      console.log(file, fileList);
    },
    // 上传前校验
    beforeUpload(file) {
      const isLt = file.size / 1024 < this.uploadConf.size;
      const isRightFormat = this.uploadConf.arr.includes(file.type);

      if (!isRightFormat) {
        this.$message.error('上传图片只能是 JPG，PNG，GIF 格式!');
      }
      if (!isLt) {
        this.$message.error(`上传图片大小不能超过 ${this.uploadConf.size}KB!`);
      };
      return isRightFormat && isLt;
    },
    // 向您搭建的STS服务获取临时访问凭证
    async getCertificateRequest () {
      try {
        const {code, data, message} = await getCertificate();
        if (code == 200) {
          this.certificateInfos = data;
        } else {
          this.$message.error(message);
        };
      } catch (error) {
        // ...
      }
    },
    // 重写提交方法
    async handleRequest ({file}) {
      const hasValid = this.beforeUpload(file);
      if (hasValid) {
        await this.uploadRequset(file);
      } else {
        this.file = null;
        this.handleRemove(null, []);
      }
    },
    // 发起图片上传请求
    async uploadRequset (file) {
      try {
        await this.getCertificateRequest();
        const {res: {status, statusCode, requestUrls}} = await upload(this.certificateInfos, file);
        let ossFileUrl = requestUrls[0]
        //如果CDN域名不为空，则替换成CDN域名
        if(this.certificateInfos.bucketCdnUrl){
          ossFileUrl = replaceUnitlPrefixStr(ossFileUrl, this.certificateInfos.endpoint, this.certificateInfos.bucketCdnUrl);
        }
        if (status == 200 && statusCode == 200) {
          this.$message.success('图片上传成功');

          this.auditForm2.logo = ossFileUrl;
          this.$refs.auditForm2.clearValidate('logo');
          this.switchUploader('upload', 'none');

        } else {
          this.$message.error('图片上传失败');
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 切换上传组件显示状态
    switchUploader (ref, arg) {
      this.$nextTick(() => {
        const uploader = this.$refs[ref].$el.querySelector('.el-upload');
        uploader.style.display = arg;
      });
    },
    // 审核操作
    auditHandle(sign) {
      this.auditSign = sign;
      this.auditVisible = true;
    },
    // 下载图片
    downloadIamge(type, imgsrc, supplier) {
      let image = new Image();
      let downloadName = supplier + '_' + type + '_' + new Date().getTime();
      // 解决跨域 Canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous');
      image.onload = function() {
        let canvas = document.createElement('canvas');
        let {naturalWidth, naturalHeight, src} = image;
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        let context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, naturalWidth, naturalHeight);
        // 获取图片后缀名
        let ext = src.substring(src.lastIndexOf('.') + 1).toLowerCase();
        // 某些图片 url 可能没有后缀名，默认是 png
        let url = canvas.toDataURL('image/' + ext, 1);
        let a = document.createElement('a');
        let event = new MouseEvent('click');
        a.download = (downloadName || 'photo') + '.' + ext;
        a.href = url;
        a.dispatchEvent(event);
      };
      image.src = imgsrc;
    },
    // 查看图片
    handlePictureCardPreview(url) {
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    // 查询详情
    async supplierDetailRequest () {
      try {
        const {code, message, data} = await supplierDetail({id: this.id});
        if (code == 200) {
          if (Object.keys(data).length) {
            let businessLicenseImage = data.businessLicenseImage || '';
            let safetyProductionLicenceImage = data.safetyProductionLicenceImage || '';
            let guaranteeLicenceImage = data.guaranteeLicenceImage || '';
            let otherLicenceImage = data.otherLicenceImage || '';

            this.info = {
              ...data,
              businessLicenseImage,
              safetyProductionLicenceImage,
              guaranteeLicenceImage,
              otherLicenceImage,
            };
          } else {
            this.info = {};
          };
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
    // 审核请求
    async supplierAuditRequest () {
      try {
        let id = this.id;
        let status = this.auditSign;
        let baseData = {id, status};

        let {remark1} = this.auditForm1;
        let {logo, account, password, remark2} = this.auditForm2;

        let postData = status == 3
          ? {remark: remark1, ...baseData}
          : this.source == 2
            ? {remark: remark2, ...baseData}
            : {remark: remark2, logo, account, password, ...baseData};

        const {code, message, data} = await supplierAudit(postData);
        if (code == 200) {
          this.$message.success('审核成功！');
          this.cancelSubmit();
          this.closeTagFn();
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
    // 关闭tag标签
    closeTagFn () {
      const curView = this.$route;

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          this.id = '';
          this.$router.replace({path: 'audit'}); // 返回列表页
        });
      });
    },
    // 取消功能
    cancelSubmit () {
      if (this.auditSign == 3) {
        this.$refs.auditForm1.resetFields();
      } else {
        this.file = null;
        this.dialogImageUrl = '';
        if (this.source != 2) {
          this.$refs.upload.clearFiles();
          this.switchUploader('upload', 'inline-block');
        };
        this.$refs.auditForm2.resetFields();
      };
      this.auditVisible = false;
    },
    // 提交表单
    submitForm () {
      if (this.auditSign == 3) {
        this.$refs.auditForm1.validate(valid => valid ? this.supplierAuditRequest() : false);
      } else {
        this.$refs.auditForm2.validate(valid => valid ? this.supplierAuditRequest() : false);
      };
    },
    // 返回
    goBackList () {
      const curView = this.$route;

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          this.$router.replace({path: 'audit'}); // 返回列表页
        });
      });
    }
  }
}
</script>

<style lang="scss" scoped>
  .audit-supplier {
    min-width: 1200px;
    padding: 50px 80px 0;
    .detail-card {
      margin: 0 auto;
      margin-bottom: 46px;
      .detail-header {
        font-size: 18px;
        font-weight: 500;
      }
    }
    .cityInfo {
      .info-item {
        min-height: 48px;
        line-height: 48px;
        font-size: 14px;
        .img-mask {
          position: relative;
          width: 200px;
          border-radius: 14px;
          display: inline-block;
          vertical-align: middle;
          margin-right: 50px;
          .img {
            width: 100%;
            display: block;
            border-radius: 14px;
          }
          & i {
            position: absolute;
            font-size: 28px;
            z-index: 3;
            top: 56%;
            left: 50%;
            color: transparent;
            cursor: pointer;
            transition: all 0.2s;
            transform: translate(-50%, -50%);
          }
          &:hover {
            &::after {
              content: ' ';
              width: 200px;
              height: 100%;
              position: absolute;
              top: 0;
              left: 0;
              transition: all 0.6s;
              border-radius: 14px;
              background: rgba(125, 125, 125, 0.65);
            }
            i {
              top: 50%;
              color: #fff;
              transition: all 0.4s;
            }
          }
        }
        .supplier-logo {
          width: 100px;
          img {
            width: 100%;
          }
        }
        .no-img {
          color: #666;
          font-style: italic;
        }
        .item-border {
          width: 100%;
          border: 1px solid #e4e4e4;
          border-radius: 4px;
          padding: 10px;
          line-height: 18px;
          min-height: 300px;
          word-break: break-all;
        }
      }
    }
    .form-btns {
      text-align: center;
      margin-bottom: 80px;
      button+button {
        margin-left: 50px;
      }
    }
    .img-modal {
      ::v-deep .el-dialog {
        border-radius: 40px;
      }
      ::v-deep .el-dialog__header {
        padding: 0;
        .el-dialog__headerbtn .el-dialog__close {
          color: #fff;
          font-weight: 900;
        }
      }
      ::v-deep .el-dialog__body {
        padding: 1px;
        border-radius: 40px;
        img {
          border-radius: 14px;
          display: block;
        }
      }
    }

    .auditDio {
      .el-dialog__header {
        .red-dot {
          color: #f56c6c;
          vertical-align: middle;
        }
      }
      .el-dialog__body {
        .auditForm2 {
          width: 600px;
          margin: 0 auto;
          .el-form-item {
            ::v-deep .el-form-item__label {
              font-weight: normal;
            }
          }
        }
      }
      .el-dialog__footer {
        button+button {
          margin-left: 38px;
        }
      }
    }
  }
</style>
