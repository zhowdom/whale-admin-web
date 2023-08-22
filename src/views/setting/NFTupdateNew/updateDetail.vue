<template>
  <div class="update-detail">
    <el-row :gutter="16">
      <el-col :offset="5" :span="18">
        <el-form :model="updateForm" :rules="rules" ref="updateForm" label-width="200px" class="mt50">

          <el-form-item label="平台" prop="platform">
            <el-select disabled class="input-class" clearable v-model="updateForm.platform" placeholder="请选择平台">
              <el-option v-for="(key, value) in platforms" :label="value" :value="key" :key="key"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="审核未通过的应用市场" prop="auditMarketTypeList">
            <el-checkbox-group disabled class="input-class group" v-model="updateForm.auditMarketTypeList">
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
            <el-input disabled class="input-class" v-model="updateForm.versionNo" placeholder="请选择最新版本号"></el-input>
          </el-form-item>

          <el-form-item label="最小支持版本号" prop="compatibleVersion">
            <el-select disabled class="input-class" clearable v-model="updateForm.compatibleVersion" placeholder="请选择最小支持版本号">
              <el-option v-for="{historyVersion} in history" :label="historyVersion" :value="historyVersion" :key="historyVersion"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="package-item" label="填写下载地址或上传安装包" prop="upgradeLink">
            <el-input disabled class="input-class" clearable placeholder="请输入下载地址或上传app更新包" v-model="updateForm.upgradeLink"></el-input>
            <div class="input-url">{{updateForm.upgradeLink}}</div>
          </el-form-item>

          <el-form-item label="版本更新描述" prop="description">
            <el-input disabled class="input-class" type="textarea" placeholder="请输入版本更新描述" :rows="6" v-model="updateForm.description"></el-input>
          </el-form-item>
          <el-form-item label="版本更新英文描述" prop="enDescription">
            <el-input disabled class="input-class" type="textarea" placeholder="请输入版本更新英文描述" :rows="6" v-model="updateForm.enDescription"></el-input>
          </el-form-item>

          <el-form-item>
            <div class="form-btns">
              <el-button type="primary" @click="cancelSubmit">取消</el-button>
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
import {NFTversionInfo as versionInfo, NFThistoryVersion as historyVersion} from '@/api/setting/version';

export default {
  name: 'UpdateDetail',
  data () {
    return {
      platforms,
      marketList,
      updateForm: {
        versionNo: '',
        compatibleVersion: '',
        platform: '',
        description: '',
        enDescription: '',
        upgradeLink: '',
        auditMarketTypeList: [],
      },
      rules: {},
      history: [],
    }
  },
  computed: {
    showMarket () {
      return (platform, market) => {
        if (platform == 3) {
          return market == 1 || market == 2;
        } else {
          return market != 1 && market != 2;
        };
      }
    }
  },
  async mounted () {
    await this.versionInfoRequest();
    await this.historyVersionRequest();
  },
  methods: {
    // 获取最小支持版本
    async historyVersionRequest () {
      try {
        const {code, message, data} = await historyVersion({
          platform: this.updateForm.platform,
          applicationPackageType: 2 // old app 1 new app 2
        });
        if (code == 200) {
          this.history = data;
        } else {
          this.$message({type: 'error', message});
        }
      } catch (error) {
        // ...
      }
    },
    // 获取详情
    async versionInfoRequest () {
      try {
        const id = this.$route.query.id;
        const {code, message, data} = await versionInfo(
          Object.assign(
            {id},
            {
              applicationPackageType: 2 // old app 1 new app 2
            }
          )
        );
        if (code == 200) {
          this.updateForm = {...this.updateForm, ...data};
        } else {
          this.$message({type: 'error', message});
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
          this.$router.replace({path: 'NFTversionUpdateNew'});
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
      this.$refs.updateForm.resetFields();
    },
  }
}
</script>

<style lang="scss" scoped>
  .update-detail {
    min-width: 1200px;
    padding: 80px 20px 20px;
    .input-class {
      width: 330px;
      &.group {
        .el-radio {
          line-height: 36px;
        }
        ::v-deep .el-checkbox__label,
        ::v-deep .el-radio__label {
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
      width: 330px;
      line-height: 22px;
      ul.el-upload-list {
        margin-top: 25px;
      }
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
      margin-top: 5px;
      word-break: break-all;
    }
    .el-form-item {
      ::v-deep .el-form-item__label {
        font-weight: normal;
      }
    }
    .form-btns {
      margin-top: 15px;
      button {
        padding: 10px 25px;
      }
    }
  }
</style>
