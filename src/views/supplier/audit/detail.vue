<template>
  <div class="audit-detail">
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
        <el-row class="info-item" :gutter="20">
          <el-col :span="4">备注</el-col>
          <el-col :span="10">{{info.remark||'-'}}</el-col>
        </el-row>
      </div>
    </el-card>

    <el-card class="detail-card" shadow="always" v-if="!(status==3&&source==1)">
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
      <el-button type="info" size="large" @click="goBackList">返回</el-button>
    </div>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

  </div>
</template>

<script>
import {supplierDetail} from '@/api/supplier/supplier';

export default {
  name: 'AuditDetail',
  data () {
    return {
      info: {},
      dialogImageUrl: '',
      dialogVisible: false,
      id: '',
      source: '',
      status: '',
    }
  },
  mounted () {
    this.info = {};
    this.id = this.$route.query.id;
    this.status = this.$route.query.status;
    this.source = this.$route.query.source;
    this.supplierDetailRequest();
  },
  methods: {
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
    // 返回
    goBackList () {
      const curView = this.$route;
      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          // 返回列表页
          this.$router.replace({path: `audit`});
        });
      });
    }
  }
}
</script>

<style lang="scss" scoped>
  .audit-detail {
    padding: 50px 80px 0;
    min-width: 1200px;
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
  }
</style>
