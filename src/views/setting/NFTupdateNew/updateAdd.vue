<template>
  <div class="update-add">
    <el-row :gutter="16">
      <el-col :offset="5" :span="18">
        <el-form :model="updateForm" :rules="rules" ref="updateForm" label-width="200px" class="mt50">

          <el-form-item label="平台" prop="platform">
            <el-select class="input-class" @change="getHistoryLatest" v-model="updateForm.platform" placeholder="请选择平台">
              <el-option v-for="(key, value) in platforms" :label="value" :value="key" :key="key"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="审核未通过的应用市场" prop="auditMarketTypeList">
            <el-checkbox-group class="input-class group" v-model="updateForm.auditMarketTypeList">
              <template v-for="{label, value} in marketList">
                <el-checkbox
                  :label="value"
                  :key="value"
                  v-if="showMarket(updateForm.platform, value)"
                >
                  {{label}}
                </el-checkbox>
              </template>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="最新版本号" prop="versionNo">
            <el-input class="input-class" v-model="updateForm.versionNo" placeholder="请输入最新版本号(必须大于历史最新版本)"></el-input>
            <div class="input-tips">历史最新版本为: {{latestVer||'-'}}</div>
          </el-form-item>

          <el-form-item label="最小支持版本号" prop="compatibleVersion" :error="selectError">
            <el-select
              ref="minVersion"
              remote
              clearable
              filterable
              reserve-keyword
              class="input-class"
              @blur="displayError"
              v-model="updateForm.compatibleVersion"
              placeholder="请选择最小支持版本号"
              :remote-method="remoteHistoryVersion"
              :loading="showSelectLoading">
              <el-option
                v-for="{historyVersion} in history"
                :label="historyVersion"
                :value="historyVersion"
                :key="historyVersion"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="package-item" label="填写下载地址或上传安装包" prop="upgradeLink">
            <el-input class="input-class" key="2" v-if="updateForm.platform!=3" clearable placeholder="请输入下载地址或上传app更新包" v-model="updateForm.upgradeLink" @input="uploadInputChange"></el-input>
            <el-input class="input-class" key="3" v-else disabled placeholder="请输入下载地址或上传app更新包" v-model="updateForm.upgradeLink" @input="uploadInputChange"></el-input>
            <el-upload
              v-show="updateForm.platform!=3"
              class="input-tips align"
              :disabled="loading"
              :file-list="uploadConf.fileList"
              :http-request="handleRequest.bind(file)"
              :action="uploadConf.action"
              :limit="uploadConf.limit"
              :auto-upload="uploadConf.auto"
              :accept="uploadConf.accept"
              :show-file-list="uploadConf.showList"
              :on-remove="handleRemove.bind(file)">
              <el-tooltip effect="dark" placement="top-start">
                <template #content>
                  只能上传 apk / ipa文件，且不超过{{uploadConf.size / 1024}}MB
                </template>
                <el-button size="small" type="primary" :loading="loading">点击上传</el-button>
              </el-tooltip>
            </el-upload>
            <template v-if="updateForm.upgradeLink">
              <el-alert class="input-url" v-if="updateForm.platform==3" type="info" :closable="false" :title="updateForm.upgradeOssLink ? updateForm.upgradeOssLink : updateForm.upgradeLink"></el-alert>
              <el-alert class="input-url" v-if="updateForm.platform!=3" @close="handleRemove(null, [])" type="info" :title="updateForm.upgradeOssLink ? updateForm.upgradeOssLink : updateForm.upgradeLink"></el-alert>
            </template>
          </el-form-item>

          <el-form-item label="版本更新描述" prop="description">
            <el-input class="input-class" type="textarea" placeholder="请输入版本更新描述" :rows="6" v-model="updateForm.description"></el-input>
          </el-form-item>
          <el-form-item label="版本更新英文描述" prop="enDescription">
            <el-input class="input-class" type="textarea" placeholder="请输入版本更新英文描述" :rows="6" v-model="updateForm.enDescription"></el-input>
          </el-form-item>

          <el-form-item>
            <div class="form-btns">
              <el-button type="primary" @click="cancelSubmit">取消</el-button>
              <el-button type="primary" @click="resetForm">重置</el-button>
              <el-button type="primary" v-hasPermi="['setting:version:save']" @click="submitForm(0)">保存</el-button>
              <el-button type="success" v-hasPermi="['setting:version:save']" @click="submitForm(1)">发布</el-button>
            </div>
          </el-form-item>

        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
const {marketList} = require('@/settings.js');
import platforms from '@/utils/platform';
import {compareVersion, replaceUnitlPrefixStr} from '@/utils/index';
import {NFThistoryVersion as historyVersion, NFTversionSave as versionSave,} from '@/api/setting/version';
import {getCertificate, upload} from '@/api/system/userlist';

export default {
  name: 'UpdateAdd',
  data () {
    const vm = this;
    return {
      platforms,
      marketList,
      uploadConf: {
        size: 300 * 1024,
        showList: false,
        auto: true,
        action: '',
        limit: 1,
        fileList: [],
        accept: '.apk,.ipa,',
        arr: ['application/vnd.android.package-archive', 'application/octet-stream.ipa'],
      },
      updateForm: {
        versionNo: '',
        platform: 3,
        description: '',
        enDescription: '',
        //cdn url
        upgradeLink: '',
        // oss url
        upgradeOssLink: '',
        compatibleVersion: '',
        auditMarketTypeList: [],
      },
      rules: {
        platform: [
          { required: true, message: '平台类型不能为空', trigger: 'change' },
        ],
        versionNo: [
          { required: true, message: '最新版本号不能为空', trigger: 'blur' },
          { pattern: /^(\d+)\.(\d+)\.(\d+)$/, message: '版本号为数字且格式必须符合x.x.x', trigger: 'blur' },
          { validator: (rule, value, callback) => {
              let curVer = value.trim();
              let latestVer = vm.latestVer;
              if (latestVer) {
                if (compareVersion(curVer, latestVer) != 1) {
                  callback(new Error('最新版本号必须大于历史最新版本号'));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        compatibleVersion: [
          { required: false, message: '最小支持版本号不能为空', trigger: 'blur' },
        ],
        description: [
          { required: true, message: '版本更新描述不能为空', trigger: 'blur' },
        ],
        enDescription: [
          { required: true, message: '版本更新英文描述不能为空', trigger: 'blur' },
        ],
        upgradeLink: [
          { required: true, message: '下载地址不能为空', trigger: 'blur' },
          { type: 'url', message: '下载地址格式不正确', trigger: 'blur' }
        ],
      },
      certificateInfos: {},
      file: {},
      history: [],
      loading: false,
      type: -1, // 保存 or 发布
      showSelectLoading: false,
      selectError: '', // 最小版本号错误信息
      latestVer: '',   // 历史最新版本
      iosUrl: 'https://apps.apple.com/cn/app/%E9%B2%B8%E4%B8%BD%E7%94%9F%E6%B4%BB/id1556568091'
    }
  },
  computed: {
    showMarket () {
      return (platform, market) => {
        if (platform == 3) {
          return (market == 1 || market == 2);
        } else {
          return (market != 1 && market != 2);
        };
      }
    }
  },
  mounted () {
    this.getHistoryLatest(this.updateForm.platform);
  },
  methods: {
    // 上传输入框修改
    uploadInputChange (str) {
      if (!str) this.handleRemove(null, []);
    },
    // 移除上传
    handleRemove(file, fileList) {
      this.updateForm.upgradeLink = '';
      this.updateForm.upgradeOssLink = '';
      this.uploadConf.fileList = fileList;
      this.$refs.updateForm.validateField('upgradeLink');
      console.log(file, fileList);
    },
    // 上传前校验
    beforeUpload(file) {
      const isLt300M = file.size / 1024 < this.uploadConf.size;
      const isRightFormat = this.uploadConf.arr.includes(file.type);

      if (!isRightFormat) {
        this.$message.error('只能上传Apk，Ipa 格式!');
      }
      if (!isLt300M) {
        this.$message.error(`大小不能超过 ${this.uploadConf.size / 1024}MB!`);
      };
      return isRightFormat && isLt300M;
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
    // 是否显示错误信息
    displayError () {
      if (this.selectError) {
        this.selectError = '';
      };
    },
    // 远程搜索最小版本号
    remoteHistoryVersion (query) {
      let reqData = {};
      let compatibleVersion = query;
      const reg = /^(\d+)\.(\d+)\.(\d+)$/g;
      const {versionNo, platform} = this.updateForm;

      if (compatibleVersion) {
        // 最小版本号不为空进行判断
        if (reg.test(compatibleVersion)) {
          if (compareVersion(versionNo, compatibleVersion) != -1) {
            this.$refs.minVersion.$refs.popper.$el.hidden = false;
            reqData = {
              platform,
              versionNo: compatibleVersion,
            };
            this.showSelectLoading = true;
          } else {
            this.selectError = '最小版本号不能大于最新版本号';
            this.$refs.minVersion.$refs.popper.$el.hidden = true;
            return;
          }
        } else {
          this.selectError = '最小版本号格式不正确';
          this.$refs.minVersion.$refs.popper.$el.hidden = true;
          return;
        }
      }

      this.selectError = '';
      this.historyVersionRequest(reqData);
    },
    // 获取历史最新版
    async getHistoryLatest (platform) {
      try {
        this.$refs.updateForm.clearValidate('upgradeLink');
        const defaultUrl = this.updateForm.platform == 3 ? this.iosUrl : '';
        this.updateForm.upgradeLink = defaultUrl;
        this.updateForm.upgradeOssLink = defaultUrl;

        // 平台切换时清空选中的市场
        this.updateForm.auditMarketTypeList = [];

        const {code, message, data} = await historyVersion(
          Object.assign({platform}, {applicationPackageType: 2}) // old app 1 new app 2
        );
        if (code == 200) {
          if (data.length) {
            data.sort((a, b) => compareVersion(b.historyVersion, a.historyVersion));
            this.latestVer = data[0].historyVersion;
          } else {
            this.latestVer = '0.0.0';
          }
        } else {
          this.$message({type: 'error', message});
        }
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
    // 发起上传请求
    async uploadRequset (file) {
      try {
        this.loading = true;
        await this.getCertificateRequest();
        const {res: {status, statusCode, requestUrls}} = await upload(this.certificateInfos, file);
        if (status == 200 && statusCode == 200) {
          this.$message({type: 'success', message: '文件上传成功'});
          var ossFileUrl = requestUrls[0];
          this.updateForm.upgradeOssLink = ossFileUrl;
          //如果CDN域名不为空，则替换成CDN域名
          if(this.certificateInfos.bucketCdnUrl){
            ossFileUrl = replaceUnitlPrefixStr(ossFileUrl, this.certificateInfos.endpoint, this.certificateInfos.bucketCdnUrl);
          }
          this.updateForm.upgradeLink = ossFileUrl;
          this.$refs.updateForm.clearValidate('upgradeLink');
          this.loading = false;
        } else {
          this.$message({type: 'error', message: '文件上传失败'});
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 获取最小支持版本
    async historyVersionRequest (reqData) {
      try {
        const {code, message, data} = await historyVersion(
          Object.assign(reqData, {applicationPackageType: 2}) // old app 1 new app 2
        );
        if (code == 200) {
          this.history = data;
          this.showSelectLoading = false;
        } else {
          this.$message({type: 'error', message});
        }
      } catch (error) {
        // ...
      }
    },
    // 发送添加请求
    async submitData (num) {
      try {
        let enabled = num == 1;
        let {compatibleVersion, versionNo} = this.updateForm;
        compatibleVersion = compatibleVersion || versionNo;
        const {code, message} = await versionSave(
          Object.assign(
            {...this.updateForm, compatibleVersion, enabled},
            {
              applicationPackageType: 2 // old app 1 new app 2
            }
          )
        );
        if (code == 200) {
          this.$message.success({
            message: enabled ? '发布成功' : '保存成功'
          });
          this.cancelSubmit();
        } else {
          this.$message({type: 'error', message});
        }
      } catch (error) {
        // ...
      }
    },
    // 版本发布
    releaseApp () {
      const vm = this;
      const h = this.$createElement;
      const {versionNo} = this.updateForm;
      const message = h('div', null, [
        h('p', '是否确定发布版本更新?'),
        h('p', [
          '更新版本号为: ',
          h('span', {style: versionNo ? 'color: red;' : ''}, versionNo || '-'),
        ])
      ]);

      this.$msgbox({
        message,
        type: 'warning',
        showClose: false,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'releaseBox',
        closeOnClickModal: false,
        iconClass: 'el-icon-question iconQ',
      }).then(() => {
        vm.submitData(1);
      }).catch(() => {
        vm.$message({type: 'info', message: '取消发布'});
      })
    },
    // 关闭tag标签
    closeTagFn () {
      const curView = this.$route;

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          this.$router.replace({path: 'NFTversionUpdateNew'});
          // 当前是发布时设置session 1 - 发布（进入版本管理0）  0 - 保存（进入待发布1） -1 - 保持
          window.sessionStorage.setItem('release', this.type);
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
      this.$refs.updateForm.resetFields();
      this.$refs.updateForm.clearValidate();
    },
    // 提交
    submitForm(num) {
      this.$refs.updateForm.validate(valid => {
        if (valid) {
          this.type = num;
          num ? this.releaseApp() : this.submitData(0);
        } else {
          console.error('表单校验失败');
          return;
        };
      });
    }
  }
}
</script>

<style lang="scss" scoped>
  .update-add {
    min-width: 1200px;
    padding: 80px 20px 20px;
    .input-class {
      width: 330px;
      &.group {
        ::v-deep .el-checkbox__label {
          display: inline-block;
          min-width: 120px;
        }
      }
    }
    .input-tips {
      display: inline-block;
      margin-left: 20px;
      color: #9ca7b5;
      vertical-align: top;
      width: 260px;
    }
    .package-item {
      min-height: 120px;
      position: relative;
      ::v-deep .el-form-item__error {
        top: 38px;
      }
      ::v-deep .el-upload-list {
        margin-top: 25px;
      }
    }
    .align {
      position: absolute;
    }
    .input-url {
      color: #9ca7b5;
      width: 330px;
      line-height: 16px;
      margin-top: 25px;
      word-break: break-all;
      ::v-deep .el-alert__content {
        padding-right: 16px;
        & .el-alert__closebtn {
          top: 10px;
          &::before {
            content: '\e79d' !important;
            font-size: 14px;
          }
        }
      }
    }
    .el-form-item {
      ::v-deep .el-form-item__label {
        font-weight: normal;
      }
    }
    .form-btns {
      margin-top: 15px;
      button {
        margin-right: 50px;
        padding: 10px 25px;
      }
    }
  }
</style>
