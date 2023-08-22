<template>
  <div class="edit-pop-ads">
    <el-card class="wrap-card" shadow="always">
      <el-form :model="mainForm" :rules="rules" ref="mainForm" label-width="200px" class="mt40">

        <el-form-item label="弹框广告位置：" prop="position">
          <el-select class="input-class" v-model="mainForm.position" placeholder="请选择弹框广告位置" clearable>
            <el-option v-for="{label, type} in positions" :key="type" :label="label" :value='type'></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="弹框广告名称：" prop="name">
          <el-input class="input-class" v-model="mainForm.name" placeholder="请输入弹框广告名称"></el-input>
          <div class="input-tips">弹框广告名称只是作为辨别多个弹框广告之用，并不显示在APP中</div>
        </el-form-item>

        <el-form-item label="弹框广告条件:" prop="type">
          <el-radio-group class="custom-radio-grop" v-model="mainForm.type">
            <el-radio v-for="{label, type} in conditions" :key="type" :label="type">{{label}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="弹框广告起止时间" prop="startEndTime">
          <el-date-picker
            class="input-class"
            v-model="mainForm.startEndTime"
            :editable="false"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :default-time="['00:00:00', '23:59:59']"
            :picker-options="opts">
          </el-date-picker>
          <div class="input-tips">只要在此时间段内，打开APP满足广告位置的某个页面，即可弹出</div>
        </el-form-item>

        <el-form-item label="上线/下线：" prop="online">
          <el-radio-group class="custom-radio-grop" v-model="mainForm.online">
            <el-radio :label="true">上线</el-radio>
            <el-radio :label="false">下线</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="弹框广告图片：" prop="imgUrl">
          <el-upload
            ref="upload"
            class="input-class"
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

        <el-form-item  label="弹窗广告链接：" prop="linkType">
          <el-radio-group v-model="mainForm.linkType">
            <el-radio :label="1">外链</el-radio>
            <el-radio :label="2">内链</el-radio>
          </el-radio-group>
        </el-form-item>

        <template v-if="mainForm.linkType==1">
          <el-form-item label="弹框广告外链：" prop="clickUrl">
            <el-input class="input-class" v-model="mainForm.clickUrl" placeholder="请输入弹框广告外链"></el-input>
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

        <el-form-item label="弹框广告备注：" prop="remark">
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

        <el-form-item>
          <div class="form-btns">
            <el-button type="primary" @click="goBack2List">取消</el-button>
            <el-button type="primary" @click="resetForm">重置</el-button>
            <el-button type="primary" v-hasPermi="['setting:popup_advert:edit', 'setting:popup_advert:save']" @click="submitForm">保存</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import {getCertificate, upload} from '@/api/system/userlist';
import {advertSave, advertUpdate, advertDetail} from '@/api/setting/ads';

export default {
  name: 'EditPopAds',
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
      positions: [
        {
          type: 0,
          label: '不限页面',
        },
        {
          type: 1,
          label: '首页',
        },
        {
          type: 4,
          label: '我的',
        }
      ],
      conditions: [
        {
          type: 99,
          label: '所有用户',
        },
        {
          type: 0,
          label: '新注册用户',
        },
        {
          type: 1,
          label: '一星达人',
        },
        {
          type: 2,
          label: '二星达人',
        },
        {
          type: 3,
          label: '三星达人',
        },
        {
          type: 4,
          label: '四星达人',
        },
        {
          type: 5,
          label: '合伙人',
        },
        {
          type: 6,
          label: '团长',
        },
        {
          type: 7,
          label: '高级团长',
        },
      ],
      mainForm: {
        name: '',
        clickUrl: '',
        position: '',
        startEndTime: [],
        online: true,
        imgUrl: '',
        remark: '',
        linkType: 1,
        type: ''
      },
      params: [{}],
      rules: {
        name: [
          { required: true, message: '弹窗广告名称不能为空', trigger: 'blur' },
        ],
        position: [
          { required: true, message: '弹窗广告位置不能为空', trigger: 'change' },
        ],
        imgUrl: [
          { required: true, message: '弹窗广告图片不能为空', trigger: 'change' }
        ],
        type: [
          { required: true, message: '弹窗广告弹出条件不能为空', trigger: 'change' }
        ],
        startEndTime: [
          { required: true, type: 'array', message: '弹框广告起止时间不能为空', trigger: 'change' }
        ]
      },
      opts: {
        disabledDate(time) {
          return time.getTime() <= Date.now() - 1000 * 3600 * 24;
        },
      },
      id: '',                 // 弹窗广告id
      dialogImageUrl: '',
      dialogVisible: false,
      file: {},
      isEdit: '',
    }
  },
  mounted () {
    this.isEdit = this.$route.query.type == 'Edit';
    if (this.isEdit) {
      this.id = this.$route.query.id;
      this.advertDetailReq();
    };
  },
  methods: {
    // 移除参数
    removeParam (index) {
      if (this.params.length > 1) {
        this.params.splice(index, 1);
      }
    },
    // 添加参数
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
    // 转化为字符串或数字
    transValue (value) {
      if (isNaN(value)) return value;
      return Number(value);
    },
    // 发起图片上传请求
    async uploadRequset (file) {
      try {
        const certs = await this.getCertificateRequest();
        const {res: {status, statusCode, requestUrls}} = await upload(certs, file);
        if (status == 200 && statusCode == 200) {
          this.mainForm.imgUrl = requestUrls[0];
          this.$refs.mainForm.clearValidate('imgUrl');
          this.switchUploader('upload', 'none');
          this.$message.success('图片上传成功');
        } else {
          this.$message.error('图片上传失败');
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 获取详情
    async advertDetailReq () {
      try {
        let keys;
        let startEndTime;
        let {code, message, data: {
          name, position, online, remark, params, clickUrl, imgUrl, linkType, startTime, endTime, type
        }} = await advertDetail({id: this.id});

        if (code == 200) {
          params = params || {};
          linkType = linkType || 1;
          keys = Object.keys(params);
          endTime = new Date(endTime);
          startTime = new Date(startTime);
          startEndTime = [startTime, endTime];

          this.mainForm = {
            name, position, online, remark, clickUrl, imgUrl, linkType, type, startEndTime
          };
          this.params = keys.length ? keys.map(key => ({key, value: params[key]})) : [{}];
          this.uploadConf.fileList = imgUrl ? [{name: '', url: imgUrl}] : [];
          imgUrl && this.switchUploader('upload', 'none');
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        throw error;
      }
    },
    // 发送添加/修改弹出广告请求
    async saveOrUpdateReq (cb) {
      try {
        let endTime;
        let startTime;
        let params = {};
        let id = this.id;
        let length = this.params.length;
        let {
          name, position, online, remark,
          clickUrl, imgUrl, linkType, type, startEndTime
        } = this.mainForm;
        if (linkType == 2 && length) this.params.map(({key, value}) => Object.assign(params, {[key]: this.transValue(value)}));

        [startTime, endTime] = startEndTime || [];

        const formatData = {
          params, startTime, endTime,
          name, position, online, remark,
          clickUrl, imgUrl, linkType, type,
        };

        const reqFn = this.isEdit ? advertUpdate : advertSave;
        const reqData = this.isEdit ? {id, ...formatData} : formatData;
        const {code, message} = await reqFn(
          Object.assign(reqData, {applicationPackageType: 3})
        );
        if (code == 200) {
          this.$message.success('提交成功');
          this.goBack2List();
        } else {
          this.$message.error(message);
        }
        cb.close();
      } catch (error) {
        cb.close();
        throw error;
      }
    },
    // 取消功能
    goBack2List () {
      const curView = this.$route;
      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          this.$router.replace({path: 'popAdsMgmt', query: {tabActive: 'mini'}}); // 返回列表页
        });
      });
    },
    // 重置功能
    resetForm() {
      this.file = null;
      this.dialogImageUrl = '';
      this.$refs.upload.clearFiles();

      this.$refs.mainForm.resetFields();
      this.switchUploader('upload', 'inline-block');
    },
    // 提交
    submitForm() {
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
          setTimeout(() => this.saveOrUpdateReq(cb), 800);
        } else {
          return false;
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
  .edit-pop-ads {
    min-width: 1200px;
    padding: 80px 20px 20px;
    .wrap-card {
      width: 800px;
      margin: 0 auto;
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
        line-height: 22px;
      }
      .custom-radio-grop {
        display: block;
        ::v-deep .el-radio {
          min-width: 125px;
          line-height: 36px;
        }
      }
      ::v-deep {
        .el-form-item__label {
          font-weight: 400;
        }
        .el-input-group__append {
          padding: 0 12px;
        }
      }
      .form-btns {
        margin-top: 25px;
        button {
          margin-right: 50px;
        }
      }
    }
  }
</style>
