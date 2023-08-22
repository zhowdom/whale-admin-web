<template>
  <div class="edit-sub-banner">
    <el-row :gutter="20">
      <el-col :span="18" :offset="4">
        <el-form :model="mainForm" :rules="rules" ref="mainForm" label-width="200px" class="mt100">

          <el-form-item label="banner位置：" prop="dictCode">
            <el-select class="input-class" v-model="mainForm.dictCode" placeholder="请选择banner位置">
               <el-option v-for="{dictName, dictCode} in positions" :key="dictCode" :label="dictName" :value='dictCode'></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="banner名称：" prop="bannerName">
            <el-input class="input-class" v-model="mainForm.bannerName" placeholder="请输入banner名称"></el-input>
            <div class="input-tips">banner名称只是作为辨别多个banner条目之用，并不显示在APPbanner中</div>
          </el-form-item>

          <el-form-item label="banner起止时间" prop="startEndTime">
            <el-date-picker
              class="input-class"
              v-model="mainForm.startEndTime"
              :editable="false"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :default-time="['00:00:00', '23:59:59']"
              :picker-options="opts">
            </el-date-picker>
            <div class="input-tips">若不填，代表发布时开始生效，结束时间“无限制”</div>
          </el-form-item>

          <el-form-item label="排序：" prop="sort">
            <el-input class="input-class" v-model.number="mainForm.sort"></el-input>
          </el-form-item>

          <el-form-item label="上线/下线：" prop="enabled">
            <el-radio-group class="input-class" v-model="mainForm.enabled">
              <el-radio :label="true">上线</el-radio>
              <el-radio :label="false">下线</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="banner图片：" prop="pictUrl">
            <el-upload
              ref="upload"
              class="input-class inline"
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

          <el-form-item label="banner备注：" prop="remark">
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

          <el-form-item prop="urlType">
            <div style="margin-top: 20px">
              <el-radio-group v-model="mainForm.urlType" size="medium">
                <el-radio-button :label="2">内链</el-radio-button>
                <el-radio-button :label="1">外链</el-radio-button>
              </el-radio-group>
            </div>
          </el-form-item>

          <template v-if="mainForm.urlType==1">
            <el-form-item label="banner外链：" prop="clickUrl">
              <el-input class="input-class" v-model="mainForm.clickUrl" placeholder="请输入banner外链"></el-input>
            </el-form-item>
          </template>

          <template v-else>
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
        </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12" :offset="7">
        <div class="form-btns">
          <el-button type="primary" @click="cancelSubmit">取消</el-button>
          <el-button type="primary" @click="resetForm">重置</el-button>
          <template v-if="type=='Add'">
            <el-button type="primary" v-hasPermi="['operation:banner:save']" @click="submitForm">保存</el-button>
          </template>
          <template v-else>
            <el-button type="primary" v-hasPermi="['operation:banner:edit']" @click="submitForm">保存</el-button>
          </template>
        </div>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import {getCertificate, upload} from '@/api/system/userlist';
import {bannerDictCodes, bannerEdit, saveBanner, bannerDetail} from '@/api/om/banner';
import {compareVersion, replaceUnitlPrefixStr} from '@/utils/index';

export default {
  name: 'EditSubBanner',
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
        bannerName: '',
        dictCode: '',
        startEndTime: [],
        clickUrl: '',
        enabled: true,
        pictUrl: '',
        remark: '',
        sort: '',
        urlType: 1,
        dictType: 1,
      },
      params: [{}],
      rules: {
        bannerName: [
          { required: true, message: 'banner名称不能为空', trigger: 'blur' },
        ],
        dictCode: [
          { required: true, message: 'banner位置不能为空', trigger: 'blur' },
        ],
        pictUrl: [
          { required: true, message: 'banner图片不能为空', trigger: 'change' }
        ],
        sort: [
          { required: true, message: '排序字段不能为空', trigger: 'blur' },
          { type: 'number', min: 1, message: '排序为数字且必须大于等于1', trigger: 'blur' },
        ],
      },
      opts: {
        disabledDate(time) {
          return time.getTime() <= Date.now() - 1000 * 3600 * 24;
        },
      },
      positions: [],
      id: '',                 // bannerId
      dialogImageUrl: '',
      dialogVisible: false,
      certificateInfos: {},
      file: {},
      type: '',
    }
  },
  mounted () {
    this.type = this.$route.query.type;
    if (this.type != 'Add') {
      this.id = this.$route.query.id;
      this.bannerDetailRequest();
    };
    this.bannerDictCodesRequest();
  },
  methods: {
    // 格式日期功能
    formatDate (date, format = 'YYYY-MM-DD', def = '') {
      return date ? this.$dayjs(date).format(format) : def;
    },
    removeParam (index) {
      if (this.params.length > 1) {
        this.params.splice(index, 1);
      }
    },
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
      this.mainForm.pictUrl = '';
      this.uploadConf.fileList = fileList;
      this.switchUploader('upload', 'inline-block');
      this.$refs.mainForm.validateField('pictUrl');
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
      }  else {
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
        await this.getCertificateRequest();
        const {res: {status, statusCode, requestUrls}} = await upload(this.certificateInfos, file);
        let ossFileUrl = requestUrls[0]
        //如果CDN域名不为空，则替换成CDN域名
        if(this.certificateInfos.bucketCdnUrl){
          ossFileUrl = replaceUnitlPrefixStr(ossFileUrl, this.certificateInfos.endpoint, this.certificateInfos.bucketCdnUrl);
        }
        if (status == 200 && statusCode == 200) {
          this.mainForm.pictUrl = ossFileUrl;
          this.$refs.mainForm.clearValidate('pictUrl');
          this.switchUploader('upload', 'none');
          this.$message({type: 'success', message: '图片上传成功'});
        } else {
          this.$message({type: 'error', message: '图片上传失败'});
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 获取详情
    async bannerDetailRequest () {
      try {
        const {code, message, data} = await bannerDetail({
          id: this.id,
          dictType: 1,
        });

        if (code == 200) {
          const len = Object.keys(data.params).length;
          if (len) {
            this.params = [];
            Object.keys(data.params).map(item => {
              this.params.push({
                key: item,
                value: data.params[item],
              });
            });
          } else {
            this.params = [{}];
          }

          const startTime = this.formatDate(data.startTime, 'YYYY-MM-DD HH:mm', '');
          const endTime = this.formatDate(data.endTime, 'YYYY-MM-DD HH:mm', '');
          this.$set(this.mainForm.startEndTime, 0, startTime);
          this.$set(this.mainForm.startEndTime, 1, endTime);
          this.mainForm = {...this.mainForm, ...data};

          this.uploadConf.fileList = [{name: '', url: data.pictUrl}];;
          this.switchUploader('upload', 'none');
        } else {
          this.$message({type: 'error', message});
        }
      } catch (error) {
        // ...
      }
    },
    // 发送添加/修改banner请求
    async submitData () {
      try {
        let params = {};

        if (this.mainForm.urlType == 1) {
          params = {};
        } else {
          const len = this.params.length;
          if (len) {
            this.params.map(({key, value}) => {
              params[key] = value;
            });
          } else {
            params = {};
          }
        };

        const formatData = {
          params,
          bannerName: this.mainForm.bannerName,
          dictCode: this.mainForm.dictCode,
          clickUrl: this.mainForm.clickUrl,
          enabled: this.mainForm.enabled,
          pictUrl: this.mainForm.pictUrl,
          remark: this.mainForm.remark,
          sort: this.mainForm.sort,
          urlType: this.mainForm.urlType,
          dictType: this.mainForm.dictType,
        };

        const startEndTime = this.mainForm.startEndTime || [];
        const startTime = this.formatDate(startEndTime[0], 'YYYY-MM-DD HH:mm:ss');
        const endTime = this.formatDate(startEndTime[1], 'YYYY-MM-DD HH:mm:ss');
        const timeDate = startEndTime.length ? {startTime, endTime} : {};

        const reqFn = this.type == 'Add' ? saveBanner : bannerEdit;
        const reqData = this.type == 'Add' ? {...formatData, ...timeDate} : {...formatData, ...timeDate, id: this.id};
        const {code, message} = await reqFn(reqData);
        if (code == 200) {
          this.$message({type: 'success', message: '提交成功'});
          this.cancelSubmit();
        } else {
          this.$message({type: 'error', message});
        }
      } catch (error) {
        // ...
      }
    },
    // 获取banner位置列表
    async bannerDictCodesRequest () {
      try {
        const {code, message, data} = await bannerDictCodes({
          dictType: 1
        });
        if (code == 200) {
          this.positions = data;
        } else {
          this.$message({type: 'error', message});
        }
      } catch (error) {
        // ...
      }
    },
    // 关闭tag标签
    closeTagFn () {
      const curView = this.$route
      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          this.id = '';
          this.$router.replace({name: 'SubBanner'}); // 返回列表页
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
      this.dialogImageUrl = ''
      this.$refs.upload.clearFiles();

      this.$refs.mainForm.resetFields();
      this.switchUploader('upload', 'inline-block');
    },
    // 提交
    submitForm() {
      this.$refs.mainForm.validate(valid => valid ? this.submitData() : false);
    }
  }
}
</script>

<style lang="scss" scoped>
  .edit-sub-banner {
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
      margin-left: 20px;
      color: #9ca7b5;
      vertical-align: middle;
      width: 390px;
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
      }
    }
  }
</style>
