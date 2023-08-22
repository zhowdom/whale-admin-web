<template>
  <div class="supplier-mgmt-edit">
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="top-guid-bar">基本信息</div>
      </el-col>
      <el-col :span="18">
        <el-form :model="mainForm" :rules="rules" ref="mainForm" label-width="200px" class="mt100">
          <el-form-item label="供应商名称" prop="name">
            <el-input class="input-class" v-model="mainForm.name" placeholder="请输入供应商名称"></el-input>
            <div class="input-tips">供应商名称只能由平台统一修改</div>
          </el-form-item>

          <el-form-item label="联系人" prop="contactPerson">
            <el-input class="input-class" v-model="mainForm.contactPerson" placeholder="请输入联系人"></el-input>
          </el-form-item>

          <el-form-item label="联系电话" prop="contactTelephone">
            <el-input class="input-class" v-model="mainForm.contactTelephone" placeholder="请输入联系电话"></el-input>
          </el-form-item>

          <el-form-item label="所在地" prop="selectedArr">
            <el-cascader
              clearable
              ref="cascader"
              class="input-class"
              v-model="mainForm.selectedArr"
              :options="citysData"
              :props="{value:'id'}"
              @change="handleChange">
            </el-cascader>
          </el-form-item>

          <el-form-item label="详细地址" prop="address">
            <el-input class="input-class" type="textarea" :rows="4" v-model="mainForm.address" placeholder="请输入详细地址长度2-50字符"></el-input>
          </el-form-item>

          <el-form-item label="供应商logo" prop="logo">
            <div class="uploader-txt">（只能上传 PNG/JPG/JPEG/GIF 格式的图片，且不超过300KB）</div>
            <el-upload
              ref="upload0"
              :file-list="uploadConf.fileList0"
              :http-request="handleRequest.bind(file, 0)"
              :action="uploadConf.action"
              :limit="uploadConf.limit"
              :auto-upload="uploadConf.auto"
              :accept="uploadConf.accept"
              :list-type="uploadConf.type"
              :show-file-list="uploadConf.showList"
              :on-remove="handleRemove.bind(file, 0)">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>

          <el-form-item label="上传相关证件" prop="businessLicenseImage">
            <div class="uploader-txt">（只能上传 PNG/JPG/JPEG/GIF 格式的图片，且不超过500KB）</div>
            <el-upload
              ref="upload1"
              class="audit-uploader mb20"
              :file-list="uploadConf.fileList1"
              :http-request="handleRequest.bind(file, 1)"
              :action="uploadConf.action"
              :limit="uploadConf.limit"
              :auto-upload="uploadConf.auto"
              :accept="uploadConf.accept"
              :list-type="uploadConf.type"
              :show-file-list="uploadConf.showList"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove.bind(file, 1)">
              <div class="uploader-tips">
                <i class="el-icon-plus"></i>
                <p>营业执照</p>
              </div>
              <div slot="tip" class="uploader-bottom-txt">营业执照</div>
            </el-upload>

            <el-upload
              ref="upload2"
              class="audit-uploader mb20"
              :file-list="uploadConf.fileList2"
              :http-request="handleRequest.bind(file, 2)"
              :action="uploadConf.action"
              :limit="uploadConf.limit"
              :auto-upload="uploadConf.auto"
              :accept="uploadConf.accept"
              :list-type="uploadConf.type"
              :show-file-list="uploadConf.showList"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove.bind(file, 2)">
              <div class="uploader-tips">
                <i class="el-icon-plus"></i>
                <p>安全生产许可证</p>
              </div>
              <div slot="tip" class="uploader-bottom-txt">安全生产许可证</div>
            </el-upload>

            <el-upload
              ref="upload3"
              class="audit-uploader mb20"
              :file-list="uploadConf.fileList3"
              :http-request="handleRequest.bind(file, 3)"
              :action="uploadConf.action"
              :limit="uploadConf.limit"
              :auto-upload="uploadConf.auto"
              :accept="uploadConf.accept"
              :list-type="uploadConf.type"
              :show-file-list="uploadConf.showList"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove.bind(file, 3)">
              <div class="uploader-tips">
                <i class="el-icon-plus"></i>
                <p>保证书</p>
              </div>
              <div slot="tip" class="uploader-bottom-txt">保证书</div>
            </el-upload>

            <el-upload
              ref="upload4"
              class="audit-uploader mb20"
              :file-list="uploadConf.fileList4"
              :http-request="handleRequest.bind(file, 4)"
              :action="uploadConf.action"
              :limit="uploadConf.limit"
              :auto-upload="uploadConf.auto"
              :accept="uploadConf.accept"
              :list-type="uploadConf.type"
              :show-file-list="uploadConf.showList"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove.bind(file, 4)">
              <div class="uploader-tips">
                <i class="el-icon-plus"></i>
                <p>其它证件</p>
              </div>
              <div slot="tip" class="uploader-bottom-txt">其它证件</div>
            </el-upload>
          </el-form-item>

          <el-form-item label="供应商介绍" prop="description">
            <el-input class="input-class description" type="textarea" v-model="mainForm.description" :rows="7" maxlength="200" show-word-limit placeholder="请输入供应商介绍"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="4">
        <div class="top-guid-bar">账号信息</div>
      </el-col>
      <el-col :span="18">
        <el-form :model="supplierForm" :rules="rules" label-width="200px" class="mt100" ref="supplierForm">
          <el-form-item label="供应商账号" prop="account">
            <el-input class="input-class" v-model="supplierForm.account" autocomplete="new-password" placeholder="请输入供应商账号"></el-input>
          </el-form-item>
          <el-form-item label="供应商密码" prop="password">
            <el-input class="input-class" type="password" autocomplete="new-password" v-model="supplierForm.password" placeholder="请输入供应商密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="passwordConfirm">
            <el-input class="input-class" type="password" autocomplete="new-password" v-model="supplierForm.passwordConfirm" placeholder="请输入供应商密码"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input class="input-class" type="textarea" v-model="supplierForm.remark" :rows="5" maxlength="200" show-word-limit placeholder="请输入"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12" :offset="7">
        <div class="form-btns">
          <el-button type="primary" @click="cancelSubmit">取消</el-button>
          <el-button type="primary" @click="resetForm">重置</el-button>
          <el-button type="primary" v-hasPermi="['seller:seller:save']" @click="submitForm">保存</el-button>
        </div>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import citys from '@/utils/provinceCity';
import {getCertificate, upload} from "@/api/system/userlist";
import {sellerSave} from '@/api/supplier/supplier';
import {compareVersion, replaceUnitlPrefixStr} from '@/utils/index';

export default {
  name: 'SupplierMgmtEdit',
  components: {
    Editor: () => import('@/components/Editor')
  },
  computed: {
    citysData: () => {
      citys.map(el => {
        if (el.children.length) {
          el.children.map(ol => {
            if (ol.children && ol.children.length) {
              ol.children.map(cl => {
                if (cl.children && !cl.children.length) {
                  Reflect.deleteProperty(cl, 'children');
                }
              });
            } else {
              Reflect.deleteProperty(ol, 'children');
            }
          });
        } else {
          Reflect.deleteProperty(el, 'children');
        }
      });
      return citys;
    }
  },
  data () {
    const vm = this;
    return {
      uploadConf: {
        size: 500,
        showList: true,
        auto: true,
        action: '',
        limit: 1,
        fileList0: [],
        fileList1: [],
        fileList2: [],
        fileList3: [],
        fileList4: [],
        type: 'picture-card',
        accept: '.png,.jpg,.jpeg,.gif',
        arr: ['image/png', 'image/jpeg', 'image/gif', 'image/jpg'],
      },
      mainForm: {
        name: '',
        contactPerson: '',
        contactTelephone: '',
        selectedArr: [],
        address: '',
        description: '',
        logo: '',
        otherLicenceImage: '',
        businessLicenseImage: '',
        guaranteeLicenceImage: '',
        safetyProductionLicenceImage: '',
        provinceId: '',
        cityId: '',
        districtId: '',
      },
      supplierForm: {
        account: '',
        password: '',
        passwordConfirm: '',
        remark: '',
      },
      rules: {
        name: [
          { required: true, message: '供应商名称不能为空', trigger: 'blur' },
        ],
        contactPerson: [
          { required: true, message: '联系人不能为空', trigger: 'blur' },
          { type: 'string', min: 2, max: 8, message: '联系人长度限定2-8个字符', trigger: 'blur' },
        ],
        contactTelephone: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' },
          { pattern: /(^0\d{2,3}\-\d{7,8}$)|(^1[3|4|5|6|7|8]\d{9}$)/, message: '联系电话格式不正确(国内固话或手机号)', trigger: 'blur' }
        ],
        selectedArr: [
          { required: true, message: '所在地不能为空', trigger: ['blur', 'change'] },
        ],
        address: [
          { required: true, message: '详细地址不能为空', trigger: 'blur' },
          { type: 'string', min: 2, max: 50, message: '详细地址长度限定2-50个字符', trigger: 'blur' },
        ],
        businessLicenseImage: [
          { validator: (rule, value, callback) => {
              let {
                businessLicenseImage: src1,
                guaranteeLicenceImage: src2,
                safetyProductionLicenceImage: src3,
                otherLicenceImage: src4,
              } = vm.mainForm;

              if (src1 || src2 || src3 || src4) {
                callback();
              } else {
                callback(new Error('请至少上传一张图片'));
              }
            },
            required: true,
            trigger: 'blur'
          }
        ],
        description: [
          { required: true, message: '供应商介绍不能为空', trigger: 'blur' },
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
              let password = vm.supplierForm.password;

              if (val !== password) {
                callback(new Error('确认密码必须与原密码保持一致'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        remark: [
          { required: true, message: '备注不能为空', trigger: 'blur' },
        ],
      },
      dialogImageUrl: '',
      dialogVisible: false,
      certificateInfos: {},
      file: {},
    }
  },
  methods: {
    // 级联组件值改变
    handleChange(value) {
      if (value.length) {
        let {provinceId, cityId, districtId} = {};
        let checkedNodes = this.$refs.cascader.getCheckedNodes()[0].pathNodes;
        let city = checkedNodes[1].data;
        let province = checkedNodes[0].data;
        let district = checkedNodes[2].data;

        console.log(checkedNodes, '选中城市id');

        cityId = city.id;
        provinceId = province.id;
        districtId = district.id;

        this.mainForm.provinceId = provinceId;
        this.mainForm.cityId = cityId;
        this.mainForm.districtId = districtId;
      }
    },
    // 移除上传
    handleRemove(type, file, fileList) {
      switch(type) {
        case 0:
          this.mainForm.logo = '';
          this.uploadConf.fileList0 = fileList;
          this.switchUploader('upload0', 'inline-block');
          break;
        case 1:
          this.mainForm.businessLicenseImage = '';
          this.uploadConf.fileList1 = fileList;
          this.switchUploader('upload1', 'inline-block');
          this.$refs.mainForm.validateField('businessLicenseImage');
          break;
        case 2:
          this.mainForm.safetyProductionLicenceImage = '';
          this.uploadConf.fileList2 = fileList;
          this.switchUploader('upload2', 'inline-block');
          this.$refs.mainForm.validateField('safetyProductionLicenceImage');
          break;
        case 3:
          this.mainForm.guaranteeLicenceImage = '';
          this.uploadConf.fileList3 = fileList;
          this.switchUploader('upload3', 'inline-block');
          this.$refs.mainForm.validateField('guaranteeLicenceImage');
          break;
        case 4:
          this.mainForm.otherLicenceImage = '';
          this.uploadConf.fileList4 = fileList;
          this.switchUploader('upload4', 'inline-block');
          this.$refs.mainForm.validateField('otherLicenceImage');
          break;
      };
      console.log(file, fileList);
    },
    // 预览上传
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 上传前校验
    beforeUpload(file, type) {
      let size;
      if (type === 0) { // logo上传 300k
        size = 300;
      } else { // 其他上传 500k
        size = 500;
      };

      const isLt = file.size / 1024 < size;
      const isRightFormat = this.uploadConf.arr.includes(file.type);

      if (!isRightFormat) {
        this.$message.error('上传图片只能是 JPG，PNG，GIF 格式!');
      }

      if (!isLt) {
        this.$message.error(`上传图片大小不能超过 ${size}KB!`);
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
    async handleRequest (type, {file}) {
      const hasValid = this.beforeUpload(file, type);
      if (hasValid) {
        await this.uploadRequset(file, type);
      } else {
        this.file = null;
        this.dialogImageUrl = '';
        this.handleRemove(type, null, []);
      }
    },
    // 切换上传组件显示状态
    switchUploader (ref, arg) {
      this.$nextTick(() => {
        const uploader = this.$refs[ref].$el.querySelector('.el-upload');
        uploader.style.display = arg;
      });
    },
    // 发起图片上传请求
    async uploadRequset (file, type) {
      try {
        await this.getCertificateRequest();
        const {res: {status, statusCode, requestUrls}} = await upload(this.certificateInfos, file);
        let ossFileUrl = requestUrls[0]
        //如果CDN域名不为空，则替换成CDN域名
        if(this.certificateInfos.bucketCdnUrl){
          ossFileUrl = replaceUnitlPrefixStr(ossFileUrl, this.certificateInfos.endpoint, this.certificateInfos.bucketCdnUrl);
        }
        if (status == 200 && statusCode == 200) {

          switch(type) {
            case 0:
              this.mainForm.logo = ossFileUrl;
              this.$refs.mainForm.clearValidate('logo');
              this.switchUploader('upload0', 'none');
              break;
            case 1:
              this.mainForm.businessLicenseImage = ossFileUrl;
              this.$refs.mainForm.clearValidate('businessLicenseImage');
              this.switchUploader('upload1', 'none');
              break;
            case 2:
              this.mainForm.safetyProductionLicenceImage = ossFileUrl;
              this.$refs.mainForm.clearValidate('safetyProductionLicenceImage');
              this.switchUploader('upload2', 'none');
              break;
            case 3:
              this.mainForm.guaranteeLicenceImage = ossFileUrl;
              this.$refs.mainForm.clearValidate('guaranteeLicenceImage');
              this.switchUploader('upload3', 'none');
              break;
            case 4:
              this.mainForm.otherLicenceImage = ossFileUrl;
              this.$refs.mainForm.clearValidate('otherLicenceImage');
              this.switchUploader('upload4', 'none');
              break;
          };

          this.$message.success('图片上传成功！');
        } else {
          this.$message.error('图片上传失败');
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 发送添加/修改任务券请求
    async submitData () {
      try {
        const reqData = {...this.mainForm, ...this.supplierForm};
        Reflect.deleteProperty(reqData, 'selectedArr')
        const {code, message} = await sellerSave(reqData);

        if (code == 200) {
          this.$message.success('提交成功');
          this.cancelSubmit();
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
          this.$router.replace({path: 'mgmt'}); // 返回列表页
        });
      });
    },
    // 取消功能
    cancelSubmit () {
      this.closeTagFn();
      this.resetForm();
    },
    // 重置功能
    resetForm() {
      this.file = null;
      this.dialogImageUrl = '';
      this.supplierForm.description = '';

      this.$refs.mainForm.resetFields();
      this.$refs.supplierForm.resetFields();

      this.$refs.upload0.clearFiles();
      this.$refs.upload1.clearFiles();
      this.$refs.upload2.clearFiles();
      this.$refs.upload3.clearFiles();
      this.$refs.upload4.clearFiles();

      this.switchUploader('upload0', 'inline-block');
      this.switchUploader('upload1', 'inline-block');
      this.switchUploader('upload2', 'inline-block');
      this.switchUploader('upload3', 'inline-block');
      this.switchUploader('upload4', 'inline-block');
    },
    // 提交
    submitForm() {
      let num = 0;
      this.$refs.mainForm.validate(valid => valid ? (num += 1/2) : false);
      this.$refs.supplierForm.validate(valid => valid ? (num += 1/2) : false);
      if (num == 1) this.submitData();
    }
  }
}
</script>

<style lang="scss" scoped>
  .supplier-mgmt-edit {
    min-width: 1200px;
    padding: 80px 20px 20px;
    .top-guid-bar {
      position: relative;
      background: #9ca7b5;
      height: 50px;
      width: 200px;
      line-height: 50px;
      text-align: center;
      color: #FFF;
      font-weight: 500;
      &::after {
        content: ' ';
        height: 1px;
        width: 1px;
        display: inline-block;
        border: 25px solid transparent;
        border-left-color: #9ca7b5;
        position: absolute;
        right: -50px;
      }
    }
    .input-class {
      width: 360px;
    }
    .input-tips {
      display: inline-block;
      margin-left: 20px;
      color: #9ca7b5;
      vertical-align: middle;
      width: 320px;
      line-height: 22px;
    }
    .align {
      position: absolute;
    }
    .form-btns {
      margin-top: 15px;
      margin-left: 20px;
      button {
        margin-right: 50px;
        padding: 10px 30px;
      }
    }
    .el-form-item {
      .audit-uploader {
        ::v-deep .el-upload.el-upload--picture-card {
          line-height: normal;
          .uploader-tips {
            height: 56px;
            margin-top: 45px;
          }
        }
        ::v-deep .el-upload-list {
          .el-upload-list__item {
            display: block;
            margin-bottom: 0;
          }
        }
      }
      ::v-deep .el-form-item__label {
        font-weight: normal;
      }
      .description {
        width: 560px;
      }
      .uploader-txt {
        font-size: 12px;
        color: #606266;
        font-weight: 500;
      }
      .uploader-bottom-txt {
        font-size: 12px;
        color: #606266;
        width: 146px;
        text-align: center;
        line-height: 25px;
        font-style: italic;
      }
    }
  }
</style>
