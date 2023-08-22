<template>
  <!-- 开屏页配置 -->
  <div class="start-screen-config">
    <el-card class="wrap-card" shadow="always">
      <el-form :model="mainForm" :rules="rules" ref="mainForm" label-width="150px" class="custom-form">
        <el-form-item label="开屏页图片：" prop="openScreenImg">
          <el-upload
            ref="upload"
            class="input-class inline-block"
            :file-list="uploadConf.fileList"
            :http-request="handleRequest.bind(file)"
            :action="uploadConf.action"
            :limit="uploadConf.limit"
            :auto-upload="uploadConf.auto"
            :accept="uploadConf.accept"
            :list-type="uploadConf.type"
            :show-file-list="uploadConf.showList"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove.bind(file)">
            <i class="el-icon-plus"></i>
          </el-upload>
          <div class="input-tips">支持上传gif/jpg/png格式文件，文件不能超过300kb</div>
        </el-form-item>

        <el-form-item label="开屏页图片链接：" prop="linkType">
          <el-radio-group v-model="mainForm.linkType">
            <el-radio :label="1">外链</el-radio>
            <el-radio :label="2">内链</el-radio>
          </el-radio-group>
        </el-form-item>

        <template v-if="mainForm.linkType==1">
          <el-form-item label="开屏页外链：" prop="clickUrl">
            <el-input class="input-class" v-model="mainForm.clickUrl" placeholder="请输入开屏页外链"></el-input>
          </el-form-item>
        </template>

        <template v-if="mainForm.linkType==2">
          <el-form-item label="内链路由：" prop="clickUrl">
            <el-input class="input-class" v-model="mainForm.clickUrl" placeholder="请输入内链路由"></el-input>
          </el-form-item>

          <el-form-item class="input-long-class" label="参数名-参数值：" v-for="(item, index) in params" :key="index">
            <el-col :span="7" class="input-col-7 key">
              <el-input v-model="item.key" placeholder="请输入参数名"></el-input>
            </el-col>
            <el-col :span="1" class="input-col-1">-</el-col>
            <el-col :span="7" class="input-col-7 value">
              <el-input v-model="item.value" placeholder="请输入参数值"></el-input>
            </el-col>
            <el-col :span="3" class="input-col-3">
              <el-button v-if="index==0" type="primary" icon="el-icon-plus" @click.prevent="addParam"></el-button>
              <el-button v-else class="remove" type="danger" icon="el-icon-minus" @click.prevent="removeParam(index)"></el-button>
            </el-col>
          </el-form-item>
        </template>
        <br><br><br>

        <el-form-item label="开屏页倒计时：" prop="duration">
          <el-input class="input-class" v-model.number="mainForm.duration">
            <template slot="append">秒</template>
          </el-input>
        </el-form-item>

        <el-form-item label="开屏页备注：" prop="remark">
          <el-input
            rows="3"
            resize="none"
            type="textarea"
            class="input-class"
            maxlength="20"
            show-word-limit
            v-model="mainForm.remark"
          >
          </el-input>
        </el-form-item>

        <el-form-item label-width="150px">
          <div class="form-btns">
            <el-button type="primary" v-hasPermi="['setting:start_page:update']" @click="submitForm">发布</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import {getCertificate, upload} from '@/api/oss';
import {startPageQuery, startPageUpdate} from '@/api/setting/ads';

export default {
  name: 'StartScreenConfig',
  data () {
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
      mainForm: {
        clickUrl: '',       // 链接
        openScreenImg: '',  // 开屏图片
        remark: '',         // 备注
        duration: '',       // 倒计时
        linkType: 1,        // 1: 外链, 2: 内链
      },
      params: [{}],
      rules: {
        openScreenImg: [
          { required: true, message: '开屏页图片不能为空', trigger: 'change' }
        ],
        duration: [
          { required: true, message: '开屏页倒计时不能为空', trigger: 'blur' },
          { type: 'number', min: 3, message: '倒计时为数字且必须大于等于3', trigger: 'blur' },
        ],
      },
      dialogImageUrl: '',
      dialogVisible: false,
      file: {},
    }
  },
  mounted () {
    this.startPageQueryReq();
  },
  methods: {
    // 移除内链参数
    removeParam (index) {
      if (this.params.length > 1) {
        this.params.splice(index, 1);
      }
    },
    // 添加内链参数
    addParam () {
      const len = this.params.length;
      if (this.params[len - 1].key) {
        this.params.push({});
      } else {
        this.$message({type: 'info', message: '参数名不能为空！'});
      };
    },
    // 移除上传
    handleRemove(file, fileList) {
      this.mainForm.openScreenImg = '';
      this.uploadConf.fileList = fileList;
      this.switchUploader('upload', 'inline-block');
      this.$refs.mainForm.validateField('openScreenImg');
      console.log(file, fileList);
    },
    // 预览上传
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 上传前校验
    beforeUpload(file) {
      const isLt200K = file.size / 1024 < this.uploadConf.size;
      const isRightFormat = this.uploadConf.arr.includes(file.type);

      if (!isRightFormat) {
        this.$message.error('上传图片只能是 JPG，PNG，GIF 格式!');
      }
      if (!isLt200K) {
        this.$message.error(`上传图片大小不能超过 ${this.uploadConf.size}KB!`);
      };
      return isRightFormat && isLt200K;
    },
    // 向您搭建的STS服务获取临时访问凭证
    async getCertificateRequest () {
      try {
        const {code, data, message} = await getCertificate();
        if (code == 200) return data;
        this.$message.error(message);
      } catch (error) {
        throw error;
      }
    },
    // 重写提交方法
    async handleRequest ({file}) {
      const hasValid = this.beforeUpload(file);

      if (hasValid) {
        await this.uploadRequset(file);
      } else {
        this.file = null;
        this.dialogImageUrl = '';
        this.handleRemove(null, []);
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
    async uploadRequset (file) {
      try {
        const certs = await this.getCertificateRequest();
        const {res: {status, statusCode, requestUrls}} = await upload(certs, file);
        if (status == 200 && statusCode == 200) {
          this.mainForm.openScreenImg = requestUrls[0];
          this.$refs.mainForm.clearValidate('openScreenImg');
          this.switchUploader('upload', 'none');
          this.$message.success('图片上传成功');
        } else {
          this.$message.error('图片上传失败');
        }
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    // 加载loading
    loadLoading () {
      const loadinger = this.$loading({
        lock: true,
        text: '更新中...',
        fullscreen: true,
        spinner: 'el-icon-sunny',
        customClass: 'custom-loading',
      });

      return loadinger;
    },
    // 获取详情
    async startPageQueryReq () {
      try {
        let keys;
        let {code, message, data: {
          duration, linkType, openScreenImg, remark, params, clickUrl
        }} = await startPageQuery(
          {applicationPackageType: 2}
        );

        if (code == 200) {
          params = params || {};
          linkType = linkType || 1;
          keys = Object.keys(params);

          this.mainForm = {duration, linkType, remark, clickUrl, openScreenImg};
          this.params = keys.length ? keys.map(key => ({key, value: params[key]})) : [{}];
          this.uploadConf.fileList = openScreenImg ? [{name: '', url: openScreenImg}] : [];
          openScreenImg && this.switchUploader('upload', 'none');
        } else {
          this.$message({type: 'error', message});
        }
      } catch (error) {
        throw error;
      }
    },
    // 发送更新开屏页的请求
    async startPageUpdateReq (cb) {
      try {
        let params = {};
        let length = this.params.length;
        let {
          clickUrl, openScreenImg, remark, duration, linkType
        } = this.mainForm;
        if (linkType == 2 && length) this.params.map(({key, value}) => Object.assign(params, {[key]: value}));

        const {code, message} = await startPageUpdate({
          params, clickUrl, openScreenImg, remark, duration, linkType,
          applicationPackageType: 2
        });

        if (code == 200) {
          this.$message.success('更新成功');
          this.startPageQueryReq();
        } else {
          this.$message.error(message);
        }
        cb.close();
      } catch (error) {
        cb.close();
        throw error;
      }
    },
    // 提交请求
    submitForm () {
      this.$refs.mainForm.validate(valid => {
        if (valid) {
          // 同名检测
          if (this.mainForm.linkType == 2 && this.params.length) {
            let keys = this.params.map(({key}) => key);
            let hasSameKey = keys.some(pl => {
              let _arr = keys.filter(el => pl == el);
              return _arr.length >= 2;
            });
            if (hasSameKey) return this.$message.error('内链路由参数名不能相同');
          }
          const cb = this.loadLoading();
          setTimeout(() => this.startPageUpdateReq(cb), 800);
        } else {
          return false;
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
  .start-screen-config {
    min-width: 1200px;
    padding: 60px 20px 20px;
    .wrap-card {
      width: 800px;
      margin: 0 auto;
      .custom-form {
        margin-top: 60px;
        .input-class {
          width: 360px;
        }
        .input-long-class {
          ::v-deep .el-form-item__content {
            min-width: 427px;
            .input-col-7 {
              padding: 0px !important;
              &.key {width: 135px;}
              &.value {width: 200px;}
            }
            .input-col-1 {
              width: 25px;
              text-align: center;
              padding: 0px !important;
            }
            .input-col-3 {
              width: 57px;
              padding: 0 !important;
              margin-left: 10px !important;
              .remove {
                background: #f56c6c;
              }
            }
          }
        }
        .input-tips {
          display: inline-block;
          color: #9ca7b5;
          vertical-align: middle;
          width: 390px;
          line-height: 22px;
        }
        ::v-deep {
          .el-form-item__label {
            font-weight: 400;
          }
          .el-input-group__append {
            padding: 0 12px;
          }
        }
      }
    }
    .form-btns {
      margin-top: 15px;
    }
  }
</style>
