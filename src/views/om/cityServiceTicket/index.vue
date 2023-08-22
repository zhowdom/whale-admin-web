<template>
<keep-alive>
  <div class="city-service-ticket">
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="top-guid-bar">城市服务任务券配置</div>
      </el-col>
      <el-col :span="18">
        <el-form :model="mainForm" :rules="rules" ref="mainForm" label-width="200px" class="mt100">

          <el-form-item label="任务券类型：">
            <el-select disabled v-model="matchedValueForginer" placeholder="请选择">
              <el-option
                v-for="item in optionsForginer"
                :key="item.code"
                :label="item.desc"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="任务券名称：" prop="taskName">
            <el-input :disabled="acactionType == 'see'" class="input-class" v-model="mainForm.taskName" placeholder="请输入任务券名称"></el-input>
          </el-form-item>

          <el-form-item label="任务同时运行最大数量：" prop="limitQuantity">
            <el-input :disabled="acactionType == 'see'" class="input-class" v-model.number="mainForm.limitQuantity">
              <template slot="append">个</template>
            </el-input>
            <div class="input-tips">同时运行的最大数量</div>
          </el-form-item>

          <el-form-item label="总奖励Candy：" prop="income">
            <el-input :disabled="acactionType == 'see'" class="input-class" v-model="mainForm.income">
              <template slot="append">个</template>
            </el-input>
            <div class="input-tips">35天周期总共奖励的Candy</div>
          </el-form-item>
          <el-form-item label="每天可做任务次数：" prop="dayToDo">
            <el-input class="input-class" :disabled="acactionType == 'see'" v-model.number="mainForm.dayToDo">
              <template slot="append">次</template>
            </el-input>
          </el-form-item>
          <el-form-item label="任务券周期：" prop="completeCycleMin">
            <el-input class="input-class" :disabled="acactionType == 'see'" v-model.number="mainForm.completeCycleMin">
              <template slot="append">天</template>
            </el-input>
            <div class="input-tips">35天过期后即过期，没有延长时间</div>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="4">
        <div class="top-guid-bar">任务UI配置-进行中</div>
      </el-col>
      <el-col :span="18">
        <el-form :model="uiForm1" :rules="rules" ref="uiForm1" label-width="200px" class="mt100">
          <el-form-item label="字体/按钮颜色：" prop="fontColorProcess">
            <el-input :disabled="acactionType == 'see'" class="input-class" v-model="uiForm1.fontColorProcess" placeholder="请输入字体颜色"></el-input>
            <div class="input-tips">填写颜色编码，也可以粘贴过来</div>
          </el-form-item>

          <el-form-item label="背景图片：" prop="imgUrlProcess">
            <el-upload
              ref="upload1"
              :disabled="acactionType == 'see'"
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
        <div class="top-guid-bar">任务UI配置-已完成</div>
      </el-col>
      <el-col :span="18">
        <el-form :model="uiForm2" :rules="rules" ref="uiForm2" label-width="200px" class="mt100">
          <el-form-item label="字体/按钮颜色：" prop="fontColorComplete">
            <el-input :disabled="acactionType == 'see'" class="input-class" v-model="uiForm2.fontColorComplete" placeholder="请输入字体颜色"></el-input>
            <div class="input-tips">填写颜色编码，也可以粘贴过来</div>
          </el-form-item>

          <el-form-item label="背景图片：" prop="imgUrlComplete">
            <el-upload
              ref="upload2"
              :disabled="acactionType == 'see'"
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
      <el-col :span="12" :offset="7">
        <div class="form-btns">
          <!-- <el-button type="primary" @click="resetForm">重置</el-button> -->
          <el-button type="primary" @click="goBack">返回</el-button>
          <el-button type="primary" v-show="acactionType !== 'see'" v-hasPermi="['integral:task:update:facilitator']" @click="submitForm">保存</el-button>
        </div>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
  </keep-alive>
</template>

<script>
import taskType from '@/utils/taskTypes';
import {getCertificate, upload} from '@/api/system/userlist';
import {taskPage, taskPageV2, taskInfo, updateFacilitator, taskNodeListQuery} from '@/api/pointsMgmt/starTasks';
import {compareVersion, replaceUnitlPrefixStr} from '@/utils/index';

export default {
  name: 'CityServiceTicket',
  data () {
    return {
      acactionType: '',
      optionsForginer: [],
      matchedValueForginer: '',
      uploadConf: {
        size: 200,
        showList: true,
        auto: true,
        action: '',
        limit: 1,
        fileList1: [],
        fileList2: [],
        type: 'picture-card',
        accept: '.png,.jpg,.jpeg,.gif',
        arr: ['image/png', 'image/jpeg', 'image/gif', 'image/jpg'],
      },
      mainForm: {
        taskName: '',
        limitQuantity: 1,
        income: '1.000000',
        dayToDo: 1,
        completeCycleMin: 35,
        activateDeadline: 35,
        expireDayAfter: 35,
        taskType: 3,          // 城市服务商任务券
      },
      uiForm1: {              // 任务UI配置-进行中
        imgUrlProcess: '',    // 背景图片
        fontColorProcess: '', // 字体/按钮颜色
      },
      uiForm2: {              // 任务UI配置-已完成
        imgUrlComplete: '',   // 背景图片
        fontColorComplete: '',// 字体/按钮颜色
      },
      rules: {
        taskName: [
          { required: true, message: '任务券名称不能为空', trigger: 'blur' },
        ],
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
        completeCycleMin: [
          { required: true, message: '任务券周期不能为空', trigger: 'blur' },
          { pattern: /^[1-9]\d*$/, message: '任务券周期为正整数', trigger: 'blur' }
        ],
        imgUrlProcess: [
          { type: 'string', required: false, message: '背景图片地址不能为空', trigger: 'change' }
        ],
        fontColorProcess: [
          { required: false, message: '字体颜色不能为空', trigger: 'blur' },
          { pattern: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, message: '字体颜色格式不正确', trigger: 'blur' }
        ],
        imgUrlComplete: [
          { type: 'string', required: false, message: '背景图片地址不能为空', trigger: 'change' }
        ],
        fontColorComplete: [
          { required: false, message: '字体颜色不能为空', trigger: 'blur' },
          { pattern: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, message: '字体颜色格式不正确', trigger: 'blur' }
        ],
      },
      id: '',                 // 任务券id
      dialogImageUrl: '',
      dialogVisible: false,
      certificateInfos: {},
      file: {},
      tableData: [],
      taskType: '',
    }
  },
  activated () {
    this.taskPageRequestV2()
    taskNodeListQuery().then(response => {
      if (+response.code === 200) {
        this.optionsForginer = response.data.list || []
        let _res = this.optionsForginer.find(item => {
          return +item.code === +this.$route.query.taskType
        })
        this.matchedValueForginer = _res.code
      } else {
        this.optionsForginer = []
        this.matchedValueForginer = ''
      }
    })
    this.acactionType = this.$route.query.actionType
  },
  created () {},
  mounted () {
    // this.taskPageRequest();
    this.taskPageRequestV2()
    taskNodeListQuery().then(response => {
      if (+response.code === 200) {
        this.optionsForginer = response.data.list || []
        let _res = this.optionsForginer.find(item => {
          return +item.code === +this.$route.query.taskType
        })
        this.matchedValueForginer = _res.code
      } else {
        this.optionsForginer = []
        this.matchedValueForginer = ''
      }
    })
    this.acactionType = this.$route.query.actionType
  },
  methods: {
    // 查询分页数据
    async taskPageRequest() {
      try {
        const {code, message, data: {list}} = await taskPage({
          taskType: taskType['城市服务商'],
        });
        if (code == 200) {
          this.id = list[0].id;
          this.taskInfoRequest();
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
    taskPageRequestV2 () {
      this.taskInfoRequest();
    },
    // 获取详情
    async taskInfoRequest () {
      try {
        const {code, message, data} = await taskInfo({id: this.$route.query.id});
        if (code == 200) {
          const {
            limitQuantity, income,
            dayToDo, completeCycleMin,
            activateDeadline,
            taskType, taskName,
            expireDayAfter,
            taskAttribute
          } = data;
          
          let getSetMessage = {
            imgUrlProcess: taskAttribute?.imgUrlProcess??'',
            fontColorProcess: taskAttribute?.fontColorProcess??'',
            imgUrlComplete: taskAttribute?.imgUrlComplete??'',
            fontColorComplete: taskAttribute?.fontColorComplete??'',
          }

          this.mainForm = {
            ...this.mainForm,
            limitQuantity, income,
            dayToDo, completeCycleMin,
            activateDeadline, taskType,
            taskName, expireDayAfter
          };
          console.log(this.mainForm, 'mainForm')
          this.uiForm1 = {...this.uiForm1, imgUrlProcess: getSetMessage.imgUrlProcess, fontColorProcess: getSetMessage.fontColorProcess};
          this.uiForm2 = {...this.uiForm2, imgUrlComplete: getSetMessage.imgUrlComplete, fontColorComplete: getSetMessage.fontColorComplete};

          this.uploadConf.fileList1 = getSetMessage.imgUrlProcess ? [{name: '', url: getSetMessage.imgUrlProcess}] : [];
          this.uploadConf.fileList2 = getSetMessage.imgUrlComplete ? [{name: '', url: getSetMessage.imgUrlComplete}] : [];
          getSetMessage.imgUrlProcess && this.switchUploader('upload1', 'none');
          getSetMessage.imgUrlComplete && this.switchUploader('upload2', 'none');
        } else {
          this.$message({type: 'error', message});
        }
      } catch (error) {
        console.log(error, 'error')
        // ...
      }
    },
    // 发送修改城市服务商任务券请求
    async submitData () {
      try {
        this.mainForm.expireDayAfter = this.mainForm.completeCycleMin;
        const taskAttribute = {...this.uiForm1, ...this.uiForm2};
        const reqData = {...this.mainForm, taskAttribute, id: this.$route.query.id};
        const {code, message} = await updateFacilitator(reqData);
        if (code == 200) {
          this.$message({type: 'success', message: '操作成功'});
          this.$router.replace({path: '/om/cityServiceTicket'});
        } else {
          this.$message({type: 'error', message});
        }
      } catch (error) {
        // ...
      }
    },
    goBack () {
      this.$router.replace({path: '/om/cityServiceTicket'});
    },
    // 移除上传
    handleRemove(type, file, fileList) {
      switch(type) {
        case 1:
          this.uiForm1.imgUrlProcess = '';
          this.uploadConf.fileList1 = fileList;
          this.switchUploader('upload1', 'inline-block');
          this.$refs.uiForm1.validateField('imgUrlProcess');
          break;
        case 2:
          this.uiForm2.imgUrlComplete = '';
          this.uploadConf.fileList2 = fileList;
          this.switchUploader('upload2', 'inline-block');
          this.$refs.uiForm2.validateField('imgUrlComplete');
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
              this.uiForm1.imgUrlProcess = ossFileUrl;
              this.$refs.uiForm1.clearValidate('imgUrlProcess');
              this.switchUploader('upload1', 'none');
              break;
            case 2:
              this.uiForm2.imgUrlComplete = ossFileUrl;
              this.$refs.uiForm2.clearValidate('imgUrlComplete');
              this.switchUploader('upload2', 'none');
              break;
          }
        } else {
          this.$message({type: 'error', message: '图片上传失败'});
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 重置功能
    resetForm() {
      this.file = null;
      this.dialogImageUrl = ''
      this.$refs.upload1.clearFiles();
      this.$refs.upload2.clearFiles();

      this.$refs.mainForm.resetFields();
      this.$refs.uiForm1.resetFields();
      this.$refs.uiForm2.resetFields();

      this.switchUploader('upload1', 'inline-block');
      this.switchUploader('upload2', 'inline-block');
    },
    // 提交
    submitForm() {
      let num = 0;
      this.$refs.mainForm.validate(valid => valid ? (num += 1/3) : false);
      this.$refs.uiForm1.validate(valid => valid ? (num += 1/3) : false);
      this.$refs.uiForm2.validate(valid => valid ? (num += 1/3) : false);
      if (num == 1) this.submitData();
    }
  }
}
</script>

<style lang="scss" scoped>
  .city-service-ticket {
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
    .form-btns {
      margin-top: 15px;
      margin-left: 20px;
      button {
        margin-right: 50px;
      }
    }
  }
</style>
