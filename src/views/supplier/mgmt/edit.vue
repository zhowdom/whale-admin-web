<template>
  <div class="supplier-mgmt-detail">
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
        <el-row class="info-item" :gutter="20">
          <el-col :span="4">备注</el-col>
          <el-col :span="10">{{info.auditRemark||'-'}}</el-col>
        </el-row>
      </div>
    </el-card>

    <el-card class="detail-card" shadow="always">
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
            <div class="item-border" v-html="info.description||'-'"></div>
          </el-col>
        </el-row>

        <el-divider></el-divider>

        <el-row class="info-item mb28" :gutter="20" v-hasPermi="['seller:sellerAccount:status']">
          <el-col :span="4">账号状态</el-col>
          <el-col :span="3">
            <el-switch
              :width="70"
              class="custom-switcher"
              @change="accountStatusChange"
              active-text="正常"
              inactive-text="冻结"
              :value="accountStatus"
              :active-value="1"
              :inactive-value="2"
              >
            </el-switch>
          </el-col>
          <el-col :span="10" class="switcher-tips">
            账号冻结后商户也将被冻结，供应商将无法登陆账号！！
          </el-col>
        </el-row>

        <el-row class="info-item" :gutter="20" v-hasPermi="['seller:seller:status']">
          <el-col :span="4">商户状态</el-col>
          <el-col :span="3">
            <el-switch
              :width="70"
              class="custom-switcher"
              @change="statusChange"
              active-text="正常"
              inactive-text="冻结"
              :value="status"
              :active-value="1"
              :inactive-value="2"
              >
            </el-switch>
          </el-col>
          <el-col :span="10" class="switcher-tips">
            商户冻结后供应商只可以浏览供应商后台，操作发货，同时所有商品将被下架！！
          </el-col>
        </el-row>

      </div>
    </el-card>

    <div class="bottom-btns">
      <el-button type="primary" size="large" @click="goBackList">确定</el-button>
    </div>

    <el-dialog
      center
      width="700px"
      class="blockDio"
      lock-scroll
      :visible.sync="blockVisible"
      :close-on-click-modal="false"
      :before-close="cancelSubmit"
    >
      <template slot="title">
        <i class="el-icon-question primary-color"></i>
        <span v-if="targetAccountStatus==2&&status==1">
          确定要<span class="red-dot">“冻结”</span>该账号吗？<br>
          <span class="red-dot">冻结后，“商户状态”将同时被禁用</span>
        </span>
        <span v-if="accountStatus==1&&targetStatus==2">
          确定要<span class="red-dot">“冻结”</span>该商户吗？
        </span>
        <span v-if="targetAccountStatus==1&&status==2">
          确定要<span class="red-dot">“开启”</span>该账号吗？
        </span>
        <span v-if="accountStatus==2&&targetStatus==1">
          确定要<span class="red-dot">“开启”</span>该商户吗？<br>
          <span class="red-dot">开启后，“账号状态”将同时被开启</span>
        </span>
        <span v-if="targetAccountStatus==2&&status==2">
          确定要<span class="red-dot">“冻结”</span>该账号吗？
        </span>
        <span v-if="accountStatus==1&&targetStatus==1">
          确定要<span class="red-dot">“开启”</span>该商户吗？
        </span>
      </template>

      <el-form :model="blockForm" :rules="rules" class="blockForm" ref="blockForm">
        <el-form-item prop="remark" label="原因描述">
          <el-input
            :rows="5"
            type="textarea"
            maxlength="200"
            show-word-limit
            v-model="blockForm.remark"
            placeholder="请描述原因"
          >
          </el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelSubmit">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

  </div>
</template>

<script>
import {sellerDetail, sellerStatus, sellerAccountStatus} from '@/api/supplier/supplier';

export default {
  name: 'SupplierMgmtDetail',
  data () {
    return {
      id: '',
      info: {},
      dialogImageUrl: '',
      dialogVisible: false,
      blockVisible: false,
      blockForm: {
        remark: '',
      },
      rules: {
        remark: [
          { required: true, message: '冻结原因不能为空', trigger: 'blur' },
        ]
      },
      blockType: 1,                 // 1 -- 账号  2 -- 商户
      status: 1,
      accountStatus: 1,
      targetStatus: '',             // 商户切换时目标状态
      targetAccountStatus: '',      // 账号切换时目标状态
    }
  },
  mounted () {
    this.id = '';
    this.info = {};
    this.id = this.$route.query.id;
    this.sellerDetailRequest();
  },
  methods: {
    // 账号状态切换功能
    accountStatusChange (value) {
      this.targetAccountStatus = '';
      let message = value == 1 ? '已取消启用' : '已取消冻结';
      let tips = value == 1 ? '确定要启用此账号吗？' : '确定要冻结此账号吗？';

      this.$confirm(tips, {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.blockType = 1;
        this.targetAccountStatus = value;
        this.blockVisible = true;
      }).catch(() => {
        this.$message({type: 'info', message});
      });
    },
    // 商户状态切换功能
    statusChange (value) {
      this.targetStatus = '';
      let message = value == 1 ? '已取消启用' : '已取消冻结';
      let tips = value == 1 ? '确定要启用此商户吗？' : '确定要冻结此商户吗？';

      this.$confirm(tips, {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.blockType = 2;
        this.targetStatus = value;
        this.blockVisible = true;
      }).catch(() => {
        this.$message({type: 'info', message});
      });
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
    async sellerDetailRequest () {
      try {
        const {code, message, data} = await sellerDetail({id: this.id});
        if (code == 200) {
          if (Object.keys(data).length) {
            let logo = data.logo || '';
            let businessLicenseImage = data.businessLicenseImage || '';
            let safetyProductionLicenceImage = data.safetyProductionLicenceImage || '';
            let guaranteeLicenceImage = data.guaranteeLicenceImage || '';
            let otherLicenceImage = data.otherLicenceImage || '';

            this.info = {
              ...data,
              logo,
              businessLicenseImage,
              safetyProductionLicenceImage,
              guaranteeLicenceImage,
              otherLicenceImage,
            };

            this.status = data.status || 1;
            this.accountStatus = data.accountStatus || 1;
            this.targetStatus = '';
            this.targetAccountStatus = '';
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
    // 商户
    async sellerStatusRequest () {
      try {
        const baseData = {
          id: this.id,
          status: this.targetStatus,
          remark: this.blockForm.remark,
        };

        const {code, message} = await sellerStatus(baseData);
        if (code == 200) {
          this.status = this.targetStatus;
          if (this.targetStatus == 1 && this.accountStatus == 2) {
            this.targetAccountStatus = 1;
            this.sellerAccountStatusRequest();
          } else {
            this.cancelSubmit();
          };
          this.$message.success('商户操作成功！');
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
    // 账号
    async sellerAccountStatusRequest () {
      try {
        const baseData = {
          id: this.id,
          status: this.targetAccountStatus,
          remark: this.blockForm.remark,
        };

        const {code, message} = await sellerAccountStatus(baseData);
        if (code == 200) {
          this.accountStatus = this.targetAccountStatus;
          if (this.targetAccountStatus == 2 && this.status == 1) {
            this.targetStatus = 2;
            this.sellerStatusRequest();
          } else {
            this.cancelSubmit();
          };
          this.$message.success('账号操作成功！');
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
     // 取消功能
    cancelSubmit () {
      this.targetStatus = '';
      this.targetAccountStatus = '';

      this.blockVisible = false;
      this.$refs.blockForm.resetFields();
    },
    // 提交表单
    submitForm () {
      this.$refs.blockForm.validate(valid => {
        if (valid) {
          if (this.blockType == 1) {
            this.sellerAccountStatusRequest();
          } else {
            this.sellerStatusRequest();
          }
        } else {
          console.error('校验失败');
        }
      });
    },
    // 返回
    goBackList () {
      const curView = this.$route;
      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          // 返回列表页
          this.$router.replace({path: `mgmt`});
        });
      });
    }
  }
}
</script>

<style lang="scss" scoped>
  .supplier-mgmt-detail {
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
        }
        .custom-switcher {
          ::v-deep .el-switch__label--left,
          ::v-deep .el-switch__label--right {
            position: absolute;
            z-index: -1;
            font-size: 14px;
          }
          ::v-deep .el-switch__label--left {
            margin-right: 10px;
            right: 0;
            color: #999;
          }
          ::v-deep .el-switch__label--right {
            margin-right: 0px;
            left: 0px;
            color: #fff;
          }
          ::v-deep .el-switch__label.is-active {
            z-index: 20;
          }
          ::v-deep .el-switch__core {
            height: 26px;
            border-radius: 24px;
          }
          ::v-deep .el-switch__core:after {
            border-radius: 24px;
            width: 26px;
            height: 26px;
            margin-left: -2px;
            box-shadow: -3px 0px 1px #888;
            top: -1px;
          }
          &.is-checked ::v-deep .el-switch__core:after {
            margin-left: -25px;
            box-shadow: 3px 0px 1px #888;
          }
        }
        .switcher-tips {
          font-size: 12px;
          font-weight: 600;
          color: #666;
          text-shadow: 0px 0px 3px #aaa;
          &::before {
            content: '*';
            color: #FF0000;
            vertical-align: middle;
          }
        }
      }
    }
    .blockDio {
      .el-dialog__header {
        .red-dot {
          color: #ff4949;
        }
        .primary-color {
          color: #409EFF;
        }
      }
      .el-dialog__footer {
        button+button {
          margin-left: 38px;
        }
      }
    }
    .bottom-btns {
      text-align: center;
      margin-bottom: 80px;
    }
  }
</style>
