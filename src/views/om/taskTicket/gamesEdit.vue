<template>
  <div class="all-platforms-ticket-edit">

    <el-row :gutter="20">
      <el-col :span="4">
        <div class="top-guid-bar">赠送条件</div>
      </el-col>
      <el-col :span="18">
        <el-form :model="topForm" :rules="rules" ref="topForm" label-width="200px" class="mt100">

          <!-- <el-form-item label="赠送条件：" prop="giveCondition">
            <el-select class="input-class" clearable v-model="topForm.giveCondition" placeholder="请选择赠送条件">
              <el-option v-for="(value, key) in giveList" :label="value" :value="key" :key="key"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="赠送条件：">
            <el-select class="input-class" v-model="topForm.giveCondition" placeholder="请选择赠送条件">
              <el-option label="抢夺失败" :value="1" ></el-option>
            </el-select>
          </el-form-item>

          <!-- <el-form-item label="开始时间设定：" prop="activeStartAt">
            <el-date-picker
              class="input-class"
              v-model="topForm.activeStartAt"
              :editable="false"
              type="datetime"
              placeholder="请选择开始时间"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :default-time="'00:00:00'"
              :picker-options="opts"
            >
            </el-date-picker>
          </el-form-item> -->

          <!-- <el-form-item label="赠送期限：" prop="giveDeadline">
            <el-input class="input-class" v-model.number="topForm.giveDeadline">
              <template slot="append">天</template>
            </el-input>
          </el-form-item> -->
        </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="4">
        <div class="top-guid-bar">任务信息</div>
      </el-col>
      <el-col :span="18">
        <el-form :model="mainForm" :rules="rules" ref="mainForm" label-width="200px" class="mt100">
          <el-form-item label="任务券名称：" prop="taskName">
            <el-input class="input-class" v-model="mainForm.taskName" placeholder="请输入任务券名称"></el-input>
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
          <el-form-item label="任务券周期：" prop="completeCycleMin">
            <el-input class="input-class" v-model.number="mainForm.completeCycleMin">
              <template slot="append">天</template>
            </el-input>
            <div class="input-tips">35天过期后即过期，没有延长时间</div>
          </el-form-item>
          <el-form-item label="激活期限：" prop="activateDeadline">
            <el-input class="input-class" v-model.number="mainForm.activateDeadline">
              <template slot="append">天</template>
            </el-input>
            <div class="input-tips align">
              从此券到券日，期至此券“激活前”失效的时间（需要在特定时间期限内激活）。
              前端显示年 月 日，从到券日期-失效日期
            </div>
          </el-form-item>
          <!-- <el-form-item label="触发条件：" prop="receiveCondition">
            <el-select class="input-class" clearable v-model="mainForm.receiveCondition" placeholder="请选择触发条件">
              <el-option v-for="(value, key) in activeList" :label="value" :value="key" :key="key"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="触发条件：" prop="receiveCondition">
            <el-select class="input-class" v-model="mainForm.receiveCondition" placeholder="请选择触发条件">
              <el-option label="无条件" :value="1" ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="4">
        <div class="top-guid-bar">任务UI配置-未使用</div>
      </el-col>
      <el-col :span="18">
        <el-form :model="uiForm1" :rules="rules" ref="uiForm1" label-width="200px" class="mt100">
          <el-form-item label="字体/按钮颜色：" prop="fontColor">
            <el-input class="input-class" v-model="uiForm1.fontColor" placeholder="请输入字体颜色"></el-input>
            <div class="input-tips">填写颜色编码，也可以粘贴过来</div>
          </el-form-item>

          <el-form-item label="背景图片：" prop="imgUrl">
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
      <el-col :span="18">
        <el-form :model="uiForm2" :rules="rules" ref="uiForm2" label-width="200px" class="mt100">
          <el-form-item label="字体/按钮颜色：" prop="fontColorProcess">
            <el-input class="input-class" v-model="uiForm2.fontColorProcess" placeholder="请输入字体颜色"></el-input>
            <div class="input-tips">填写颜色编码，也可以粘贴过来</div>
          </el-form-item>

          <el-form-item label="背景图片：" prop="imgUrlProcess">
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
        <div class="top-guid-bar">任务UI配置-已完成/已失效</div>
      </el-col>
      <el-col :span="18">
        <el-form :model="uiForm3" :rules="rules" ref="uiForm3" label-width="200px" class="mt100">
          <el-form-item label="字体/按钮颜色：" prop="fontColorComplete">
            <el-input class="input-class" v-model="uiForm3.fontColorComplete" placeholder="请输入字体颜色"></el-input>
            <div class="input-tips">填写颜色编码，也可以粘贴过来</div>
          </el-form-item>

          <el-form-item label="背景图片：" prop="imgUrlComplete">
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
          <template v-if="type=='Add'">
            <el-button type="primary" v-hasPermi="['integral:task:save:game']" @click="submitForm">保存</el-button>
          </template>
          <template v-else>
            <el-button type="primary" v-hasPermi="['integral:task:update:game']" @click="submitForm">保存</el-button>
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
import {saveGlobal, updateGlobal, saveGoods, saveGoods_forGameGift, updateGoods, updateGoods_forGameGift, typeList, activeTypeList, taskInfo} from '@/api/om/task';
import math from '../../../utils/math';
import {compareVersion, replaceUnitlPrefixStr} from '@/utils/index';

export default {
  name: 'AllPlatformsTicketEdit',
  data () {
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
      topForm: {
        giveCondition: 1,
        activeStartAt: '',
        giveDeadline: 1,
      },
      mainForm: {
        taskName: '',
        income: '1.000000',
        dayToDo: 1,
        completeCycleMin: 35,
        activateDeadline: 90,
        expireDayAfter: 35,
        receiveCondition: 1,
        taskType: 6
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
        giveCondition: [
          { required: true, message: '赠送条件不能为空', trigger: 'blur' }
        ],
        activeStartAt: [
          { required: false, message: '开始时间设定不能为空', trigger: 'blur' }
        ],
        giveDeadline: [
          { required: false, message: '赠送期限不能为空', trigger: 'blur' },
          { pattern: /^[1-9]\d*$/, message: '赠送期限为大于1的整数', trigger: 'blur' }
        ],
        taskName: [
          { required: true, message: '任务名称不能为空', trigger: 'blur' },
        ],
        income: [
          { required: true, message: '总奖励Candy不能为空', trigger: 'blur' },
          { pattern: /^\d+(\.\d{6})$/, message: '总奖励Candy为6位小数精度的数字', trigger: 'blur' }
        ],
        dayToDo: [
          { required: true, message: '每天可做任务次数不能为空', trigger: 'blur' },
          { pattern: /^[1-9]\d*$/, message: '每天可做任务次数为正整数', trigger: 'blur' }
        ],
        completeCycleMin: [
          { required: true, message: '任务券周期不能为空', trigger: 'blur' },
          { pattern: /^[1-9]\d*$/, message: '任务券周期为正整数', trigger: 'blur' }
        ],
        activateDeadline: [
          { required: true, message: '激活期限不能为空', trigger: 'blur' },
          { pattern: /^[1-9]\d*$/, message: '激活期限为正整数', trigger: 'blur' }
        ],
        receiveCondition: [
          { required: true, message: '触发条件不能为空', trigger: 'change' }
        ],
        imgUrl: [
          // { type: 'string', required: true, message: '背景图片地址不能为空', trigger: 'change' }
        ],
        fontColor: [
          // { required: true, message: '字体颜色不能为空', trigger: 'blur' },
          { required: false, pattern: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, message: '字体颜色格式不正确', trigger: 'blur' }
        ],
        imgUrlProcess: [
          // { type: 'string', required: true, message: '背景图片地址不能为空', trigger: 'change' }
        ],
        fontColorProcess: [
          // { required: true, message: '字体颜色不能为空', trigger: 'blur' },
          { required: false, pattern: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, message: '字体颜色格式不正确', trigger: 'blur' }
        ],
        imgUrlComplete: [
          // { type: 'string', required: true, message: '背景图片地址不能为空', trigger: 'change' }
        ],
        fontColorComplete: [
          // { required: true, message: '字体颜色不能为空', trigger: 'blur' },
          { required: false, pattern: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, message: '字体颜色格式不正确', trigger: 'blur' }
        ],
      },
      opts: {
        disabledDate(time) {
          return time.getTime() <= Date.now() - 1000 * 3600 * 24;
        },
      },
      type: '',               // 当前操作类型
      id: '',                 // 任务券id
      dialogImageUrl: '',
      dialogVisible: false,
      certificateInfos: {},
      file: {},
      activeList: {},
      giveList: {}
    }
  },
  mounted () {
    this.type = this.$route.query.type;
    if (this.type != 'Add') {
      this.id = this.$route.query.id;
      this.taskInfoRequest();
    };
    this.typeListRequest();
    this.activeTypeListRequest();
  },
  methods: {
    // 格式日期功能
    formatDate (date, format = 'YYYY-MM-DD', def = '') {
      return date ? this.$dayjs(date).format(format) : def;
    },
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
    // 赠送条件列表
    async typeListRequest () {
      try {
        const {code, message, data} = await typeList();
        if (code == 200) {
          this.giveList = data;
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
    // 激活条件
    async activeTypeListRequest () {
      try {
        const {code, message, data} = await activeTypeList({id: 1});
        if (code == 200) {
          this.activeList = data;
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
    // 获取详情
    async taskInfoRequest () {
      try {
        const {code, message, data} = await taskInfo({id: this.id});
        if (code == 200) {
          let giveDeadline;
          let {
            income, dayToDo, completeCycleMin,
            activateDeadline, receiveCondition,
            taskType, taskName, expireDayAfter,
            taskAttribute, giveCondition,
            activeStartAt, activeEndAt
          } = data;

          // 重新计算开始，截止日期
          if (activeStartAt && activeEndAt) {
            activeStartAt = this.formatDate(activeStartAt, 'YYYY-MM-DD HH:mm');
            activeEndAt = this.formatDate(activeEndAt, 'YYYY-MM-DD HH:mm');
            giveDeadline = this.$dayjs(activeEndAt).diff(this.$dayjs(activeStartAt), 'day');

            this.topForm = {
              ...this.topForm,
              giveCondition: 1,
              activeStartAt,
              giveDeadline
            };

          } else {
            // console.error('开始时间或截止时间为空！！');
            // this.$message.error('开始时间或截止时间为空！！');
          };

          const {
            imgUrl, fontColor,
            imgUrlProcess, fontColorProcess,
            imgUrlComplete, fontColorComplete
          } = taskAttribute;

          this.mainForm = {
            ...this.mainForm,
            dayToDo, completeCycleMin,
            activateDeadline, taskType,
            taskName, expireDayAfter,
            receiveCondition: 1
          };

          this.mainForm.income = Number(income || 0).toFixed(6);
          this.uiForm1 = {...this.uiForm1, imgUrl, fontColor};
          this.uiForm2 = {...this.uiForm2, imgUrlProcess, fontColorProcess};
          this.uiForm3 = {...this.uiForm3, imgUrlComplete, fontColorComplete};

          this.uploadConf.fileList1 = imgUrl ? [{name: '', url: imgUrl}] : [];
          this.uploadConf.fileList2 = imgUrlProcess ? [{name: '', url: imgUrlProcess}] : [];
          this.uploadConf.fileList3 = imgUrlComplete ? [{name: '', url: imgUrlComplete}] : [];
          imgUrl && this.switchUploader('upload1', 'none');
          imgUrlProcess && this.switchUploader('upload2', 'none');
          imgUrlComplete && this.switchUploader('upload3', 'none');
        } else {
          this.$message({type: 'error', message});
        }
      } catch (error) {
        // ...
      }
    },
    // 发送添加/修改任务券请求
    async submitData () {
      try {
        let tempStart;
        let activeEndAt;
        let topForm = {};
        let id = this.id;
        let isAdd = this.type == 'Add';
        let {activeStartAt, giveCondition, giveDeadline} = this.topForm;

        // const reqFn = isAdd ? saveGlobal : updateGlobal;
        // const reqFn = isAdd ? saveGoods : updateGoods;
        const reqFn = isAdd ? saveGoods_forGameGift : updateGoods_forGameGift;
        const taskAttribute = {...this.uiForm1, ...this.uiForm2, ...this.uiForm3};
        this.mainForm.expireDayAfter = this.mainForm.completeCycleMin;

        // 提交时重新设计时间计算方式
        if (activeStartAt && giveDeadline) {
          // 格式化开始时间
          activeStartAt = this.formatDate(activeStartAt, 'YYYY-MM-DD HH:mm:00');
          // 计算 + 格式化结束时间
          tempStart = new Date(activeStartAt.replace(/-/g, '/'));
          activeEndAt = tempStart.setDate(tempStart.getDate() + Number(giveDeadline));
          activeEndAt = this.formatDate(activeEndAt, 'YYYY-MM-DD HH:mm:00');
          // 组合数据
          if (activeStartAt && activeEndAt) {
            topForm = {activeStartAt, activeEndAt, giveCondition};
          } else {
            this.$message.error('开始时间和结束时间不能为空！');
            return;
          }
        } else {
          // this.$message.error('开始时间和赠送期限不能为空！');
          // return;
        };

        const addSubmData = {...this.mainForm, ...topForm, taskAttribute};
        const reqData = isAdd ? addSubmData : {...addSubmData, id};

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
    // 关闭tag标签
    closeTagFn () {
      const curView = this.$route;

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          this.id = '';
          this.$router.replace({name: 'TaskTicket'}); // 返回列表页
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
      this.$refs.upload1.clearFiles();
      this.$refs.upload2.clearFiles();
      this.$refs.upload3.clearFiles();

      this.$refs.topForm.resetFields();
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
      this.$refs.topForm.validate(valid => valid ? (num += 1/2) : false);
      this.$refs.mainForm.validate(valid => valid ? (num += 1/2) : false);
      if (num == 1) this.submitData();
    }
  }
}
</script>

<style lang="scss" scoped>
  .all-platforms-ticket-edit {
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
      width: 290px;
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
    ::v-deep .el-form-item__label {
      font-weight: normal;
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
