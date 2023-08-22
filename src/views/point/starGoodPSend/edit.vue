<template>
  <div class="star-goodp-send-edit-page">
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="top-guid-bar">任务信息</div>
      </el-col>
      <el-col :span="14">
        <el-form :model="mainForm" :rules="rules" ref="mainForm" label-width="200px" class="mt100">
          <el-form-item label="任务同时运行最大数量：" prop="limitQuantity">
            <el-input class="input-class" v-model.number="mainForm.limitQuantity"><template slot="append">个</template></el-input>
            <div class="input-tips">同时运行的最大数量</div>
          </el-form-item>

          <el-form-item label="总奖励Candy：" prop="income">
            <el-input class="input-class" v-model="mainForm.income">
              <template slot="append">个</template>
            </el-input>
            <div class="input-tips">35天周期总共奖励的Candy</div>
          </el-form-item>
          <el-form-item label="每天可做任务次数：" prop="dayToDo">
            <el-input class="input-class" v-model.number="mainForm.dayToDo">
              <template slot="append">次</template>
            </el-input>
          </el-form-item>
          <el-form-item label="任务券周期：" prop="expireDayAfter">
            <el-input class="input-class" v-model.number="mainForm.expireDayAfter">
              <template slot="append">天</template>
            </el-input>
            <div class="input-tips">35天过期后即过期，没有延长时间</div>
          </el-form-item>
          <el-form-item label="升级条件变化：" prop="desc">
            <!-- <el-input class="input-class" type="textarea" :autosize="{minRows: 5, maxRows: 8}" v-model="mainForm.desc"></el-input> -->
            <div class="input-class desc-class">35任务周期结束后，用户升级制度按<span>“降级后再升级”</span>的条件来算</div>
            <div class="input-tips">固定条件</div>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="4">
        <div class="top-guid-bar">任务UI配置-任务商店</div>
      </el-col>
      <el-col :span="14">
        <el-form :model="uiForm1" :rules="rules" ref="uiForm1" label-width="200px" class="mt100">
          <el-form-item label="字体/按钮颜色：">
            <el-input class="input-class" v-model="uiForm1.fontColor" placeholder="请输入字体颜色"></el-input>
            <div class="input-tips">填写颜色编码，也可以粘贴过来</div>
          </el-form-item>

          <el-form-item label="背景图片：">
            <el-upload
              ref="upload1"
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
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="4">
        <div class="top-guid-bar">任务UI配置-进行中</div>
      </el-col>
      <el-col :span="14">
        <el-form :model="uiForm2" :rules="rules" ref="uiForm2" label-width="200px" class="mt100">
          <el-form-item label="字体/按钮颜色：">
            <el-input class="input-class" v-model="uiForm2.fontColorProcess" placeholder="请输入字体颜色"></el-input>
            <div class="input-tips">填写颜色编码，也可以粘贴过来</div>
          </el-form-item>

          <el-form-item label="背景图片：">
            <el-upload
              ref="upload2"
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
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="4">
        <div class="top-guid-bar">任务UI配置-已完成</div>
      </el-col>
      <el-col :span="14">
        <el-form :model="uiForm3" :rules="rules" ref="uiForm3" label-width="200px" class="mt100">
          <el-form-item label="字体/按钮颜色：">
            <el-input class="input-class" v-model="uiForm3.fontColorComplete" placeholder="请输入字体颜色"></el-input>
            <div class="input-tips">填写颜色编码，也可以粘贴过来</div>
          </el-form-item>

          <el-form-item label="背景图片：">
            <el-upload
              ref="upload3"
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
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12" :offset="7">
        <div class="form-btns">
          <el-button type="primary" @click="cancelSubmit">取消</el-button>
          <el-button type="primary" @click="resetForm">重置</el-button>
          <el-button type="primary" @click="submitForm" v-hasPermi="['integral:task:update:asterisk']">保存</el-button>
        </div>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import {getCertificate, upload} from "@/api/system/userlist";
import {updateAsterisk, taskInfo} from '@/api/pointsMgmt/starTasks';
import {compareVersion, replaceUnitlPrefixStr} from '@/utils/index';

export default {
  name: 'SendEdit',
  data() {
    return {
      uploadConf: {
        size: 200,
        showList: true,
        auto: true,
        action: '',
        limit: 1,
        fileList1: [],
        fileList2: [],
        fileList3: [],
        type: 'picture-card',
        accept: '.png,.jpg,.jpeg,.gif',
        arr: ['image/png', 'image/jpeg', 'image/gif', 'image/jpg'],
      },
      mainForm: {
        limitQuantity: 1,     // 任务同时运行最大数量
        income: '1.000000',   // 总奖励Candy
        dayToDo: 1,           // 每天可做任务次数
        expireDayAfter: 1,    // 任务券周期
        desc: '',             // 升级条件变化
        completeCycleMin: '', // 最小完成周期数
      },
      uiForm1: {              // 任务UI配置-任务商店
        imgUrl: '',           // 背景图片
        fontColor: '',        // 字体/按钮颜色
      },
      uiForm2: {              // 任务UI配置-进行中
        imgUrlProcess: '',    // 背景图片
        fontColorProcess: '', // 字体/按钮颜色
      },
      uiForm3: {              // 任务UI配置-已完成
        imgUrlComplete: '',   // 背景图片
        fontColorComplete: '',// 字体/按钮颜色
      },
      rules: {
        limitQuantity: [
          { required: true, message: '任务同时运行最大数量不能为空', trigger: 'blur' },
          { pattern: /^[1-9]\d*$/, message: '任务同时运行最大数量为正整数', trigger: 'blur' }
        ],
        income: [
          { required: true, message: '总奖励Candy不能为空', trigger: 'blur' },
          { pattern: /^\d+(\.\d{6})$/, message: '总奖励Candy为6位小数精度的数字', trigger: 'blur' }
        ],
        dayToDo: [
          { required: true, message: '每天可做任务次数不能为空', trigger: 'blur' },
          { pattern: /^[1-9]\d*$/, message: '每天可做任务次数为正整数', trigger: 'blur' }
        ],
        expireDayAfter: [
          { required: true, message: '任务券周期不能为空', trigger: 'blur' },
          { pattern: /^[1-9]\d*$/, message: '任务券周期为正整数', trigger: 'blur' }
        ],
        imgUrl: [
          { type: 'string', required: true, message: '背景图片地址不能为空', trigger: 'change' }
        ],
        fontColor: [
          { required: true, message: '字体颜色不能为空', trigger: 'blur' },
          { pattern: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, message: '字体颜色格式不正确', trigger: 'blur' }
        ],
        imgUrlProcess: [
          { type: 'string', required: true, message: '背景图片地址不能为空', trigger: 'change' }
        ],
        fontColorProcess: [
          { required: true, message: '字体颜色不能为空', trigger: 'blur' },
          { pattern: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, message: '字体颜色格式不正确', trigger: 'blur' }
        ],
        imgUrlComplete: [
          { type: 'string', required: true, message: '背景图片地址不能为空', trigger: 'change' }
        ],
        fontColorComplete: [
          { required: true, message: '字体颜色不能为空', trigger: 'blur' },
          { pattern: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, message: '字体颜色格式不正确', trigger: 'blur' }
        ],
      },
      dialogImageUrl: '',
      dialogVisible: false,
      certificateInfos: {},
      file: {},
      id: '',
    };
  },
  async mounted () {
    this.id = this.$route.query.id;
    await this.taskInfoRequest();
  },
  methods: {
    // 移除上传
    handleRemove(type, file, fileList) {
      switch(type) {
        case 1:
          this.uiForm1.imgUrl = '';
          this.uploadConf.fileList1 = fileList;
          this.switchUploader('upload1', 'inline-block');
          this.$refs.uiForm1.validateField('imgUrl');
          break;
        case 2:
          this.uiForm2.imgUrlProcess = '';
          this.uploadConf.fileList2 = fileList;
          this.switchUploader('upload2', 'inline-block');
          this.$refs.uiForm2.validateField('imgUrlProcess');
          break;
        case 3:
          this.uiForm3.imgUrlComplete = '';
          this.uploadConf.fileList3 = fileList;
          this.switchUploader('upload3', 'inline-block');
          this.$refs.uiForm3.validateField('imgUrlComplete');
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
    beforeUpload(file) {
      const isLt200K = file.size / 1024 < this.uploadConf.size;
      const isRightFormat = this.uploadConf.arr.includes(file.type);

      if (!isRightFormat) {
        this.$message.error('上传图片只能是 JPG，PNG，GIF 格式!');
      }
      if (!isLt200K) {
        this.$message.error('上传图片大小不能超过 200KB!');
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
    async handleRequest (type, {file}) {
      const hasValid = this.beforeUpload(file);
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
          this.$message({type: 'success', message: '图片上传成功'});
          switch(type) {
            case 1:
              this.uiForm1.imgUrl = ossFileUrl;
              this.$refs.uiForm1.clearValidate('imgUrl');
              this.switchUploader('upload1', 'none');
              break;
            case 2:
              this.uiForm2.imgUrlProcess = ossFileUrl;
              this.$refs.uiForm2.clearValidate('imgUrlProcess');
              this.switchUploader('upload2', 'none');
              break;
            case 3:
              this.uiForm3.imgUrlComplete = ossFileUrl;
              this.$refs.uiForm3.clearValidate('imgUrlComplete');
              this.switchUploader('upload3', 'none');
              break;
          }
        } else {
          this.$message({type: 'error', message: '图片上传失败'});
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 获取详情
    async taskInfoRequest () {
      try {
        const {code, message, data} = await taskInfo({id: this.id});
        if (code == 200) {
          const {taskAttribute, ...mainForm} = data;
          this.mainForm = {...this.mainForm, ...mainForm};
          const {
            imgUrl, fontColor,
            imgUrlProcess, fontColorProcess,
            imgUrlComplete, fontColorComplete
          } = taskAttribute;
          this.uiForm1 = {...this.uiForm1, imgUrl, fontColor};
          this.uiForm2 = {...this.uiForm2, imgUrlProcess, fontColorProcess};
          this.uiForm3 = {...this.uiForm3, imgUrlComplete, fontColorComplete};
          this.uploadConf.fileList1 = [{name: '', url: imgUrl}];
          this.uploadConf.fileList2 = [{name: '', url: imgUrlProcess}];
          this.uploadConf.fileList3 = [{name: '', url: imgUrlComplete}];
          this.switchUploader('upload1', 'none');
          this.switchUploader('upload2', 'none');
          this.switchUploader('upload3', 'none');
        } else {
          this.$message({type: 'error', message});
        }
      } catch (error) {
        // ...
      }
    },
    // 提交请求
    async updateAsteriskRequest () {
      try {
        this.mainForm.completeCycleMin = this.mainForm.expireDayAfter;
        const taskAttribute = {...this.uiForm1, ...this.uiForm2, ...this.uiForm3};
        const {code, message} = await updateAsterisk({
          id: this.id,
          taskAttribute,
          ...this.mainForm,
        });
        if (code == 200) {
          this.$message({type: 'success', message: '更新成功'});
          this.cancelSubmit(); // 返回列表页
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
          // 返回列表页
          this.$router.replace({
            name: 'StarGoodPSend'
          })
        })
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
      this.$refs.upload1.clearFiles();
      this.$refs.upload2.clearFiles();
      this.$refs.upload3.clearFiles();

      this.$refs.mainForm.resetFields();
      this.$refs.uiForm1.resetFields();
      this.$refs.uiForm2.resetFields();
      this.$refs.uiForm3.resetFields();

      this.switchUploader('upload1', 'inline-block');
      this.switchUploader('upload2', 'inline-block');
      this.switchUploader('upload3', 'inline-block');
    },
      // 提交
    submitForm() {
      let num = 0;
      this.$refs.mainForm.validate(valid => valid ? (num += 1/4) : false);
      this.$refs.uiForm1.validate(valid => valid ? (num += 1/4) : false);
      this.$refs.uiForm2.validate(valid => valid ? (num += 1/4) : false);
      this.$refs.uiForm3.validate(valid => valid ? (num += 1/4) : false);
      if (num == 1) this.updateAsteriskRequest();
    },
  }
}
</script>

<style lang="scss" scoped>
  .star-goodp-send-edit-page {
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
    .desc-class {
      font-weight: 500;
      height: 70px;
      min-height: 30px;
      border: 1px solid #DCDFE6;
      border-radius: 4px;
      padding: 5px 15px;
      display: inline-block;
      line-height: 22px;
      color: rgb(96, 98, 102);
      span {
        color: red;
      }
    }
    .input-class {
      width: 290px;
    }
    .input-tips{
      display: inline-block;
      margin-left: 20px;
      color: #9ca7b5;
      vertical-align: top;
      width: 280px;
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
