<template>
  <div class="edit-task-store">
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="top-guid-bar">任务信息</div>
      </el-col>
      <el-col :span="14">
        <el-form :model="mainForm" :rules="rules" ref="mainForm" label-width="215px" class="mt100">
          <el-form-item label="任务券名称：" prop="taskName">
            <el-input class="input-class" v-model="mainForm.taskName" placeholder="请输入任务券名称" />
          </el-form-item>
          <el-form-item label="请选择任务券类型" prop="taskType">
            <template v-if="isEdit">
              <div class="input-class gray-txt">
                {{mainForm.taskType?'需要兑换的任务券':'赠送的任务券'}}
              </div>
            </template>
            <template v-else>
              <el-radio-group class="radio-class" @change="switchTaskType" v-model="mainForm.taskType">
                <el-radio :label="1">需要兑换的任务券</el-radio>
                <el-radio :label="0">赠送的任务券</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>
          <el-form-item label="任务同时运行最大数量" prop="limitQuantity">
            <el-input class="input-class" v-model.number="mainForm.limitQuantity">
              <template slot="append">个</template>
            </el-input>
            <div class="input-tips">同时运行的最大数量</div>
          </el-form-item>

          <template v-if="!mainForm.taskType">
            <el-form-item label="总奖励Candy：" prop="income">
              <el-input class="input-class" v-model="mainForm.income">
                <template slot="append">个</template>
              </el-input>
              <div class="input-tips">35天周期总共奖励的Candy</div>
            </el-form-item>
          </template>

          <template v-else>
            <el-form-item label="兑换任务成本" prop="needWhalePeas">
              <el-input class="input-class" v-model="mainForm.needWhalePeas">
                <template slot="append">颗</template>
              </el-input>
              <div class="input-tips">CandyCandy</div>
            </el-form-item>
            <el-form-item label="收益率" prop="earningsRate">
              <el-input class="input-class" v-model.number="mainForm.earningsRate">
                <template slot="append">%</template>
              </el-input>
              <div class="input-tips">基于“兑换任务成本”的收益率，最大收益率不超过39%</div>
            </el-form-item>
            <el-form-item class="long-input-tips-form-item" label="周期收益每个任务券周期递减" prop="earningsRateCycleReduce">
              <el-input class="input-class" v-model="mainForm.earningsRateCycleReduce">
                <template slot="append">%</template>
              </el-input>
              <div class="input-tips">月收益率，按任务型周期，每个周期减产0.5%。天数，也按任务型周期，每个周期递增2天（按照每个任务券数量为周期，例如初级任务，一个任务总共可以兑换8个，以8个结束为1个周期结束）</div>
            </el-form-item>
            <el-form-item label="每个周期递增" prop="completeCycleIncrease">
              <el-input class="input-class" v-model.number="mainForm.completeCycleIncrease">
                <template slot="append">天</template>
              </el-input>
            </el-form-item>
          </template>

          <el-form-item label="每天可做任务次数" prop="dayToDo">
            <el-input class="input-class" v-model.number="mainForm.dayToDo">
              <template slot="append">次</template>
            </el-input>
          </el-form-item>
          <el-form-item label="任务券周期" prop="completeCycleMin">
            <el-input class="input-class" v-model.number="mainForm.completeCycleMin">
              <template slot="append">天</template>
            </el-input>
          </el-form-item>
          <template v-if="!mainForm.taskType">
            <el-form-item label="是否限制任务券过期时间">
              <el-radio-group class="radio-class" @change="noLimitChange" v-model="checked">
                <el-radio :label="true">限制</el-radio>
                <el-radio :label="false">不限制</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="long-input-tips-form-item" label="任务券过期时间" prop="expireDayAfter" key="1">
              <el-input class="input-class" v-model="mainForm.expireDayAfter" :disabled="!checked">
                <template slot="append">天</template>
              </el-input>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item class="long-input-tips-form-item" label="任务券过期时间" prop="expireDayAfter" key="2">
              <el-input class="input-class" v-model="mainForm.expireDayAfter">
                <template slot="append">天</template>
              </el-input>
            </el-form-item>
          </template>
        </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="4">
        <div class="top-guid-bar">基础活跃值配置</div>
      </el-col>
      <el-col :span="14">
        <el-form :model="subForm" :rules="rules" ref="subForm" label-width="200px" class="mt100">
          <el-form-item label="排序" prop="sort">
            <el-input class="input-class" v-model.number="subForm.sort" ></el-input>
            <div class="input-tips">排序不可以重复，前端显示按排序从低到高排序</div>
          </el-form-item>

          <el-form-item label="基础活跃值" prop="activeWorth">
            <el-input class="input-class" v-model.number="subForm.activeWorth">
              <template slot="append">个</template>
            </el-input>
            <div class="input-tips">
              {{mainForm.taskType?'兑换时产生':'领取时产生'}}，可用于统计团队活跃值
            </div>
          </el-form-item>
          <el-form-item label="基础活跃值失效时间" prop="activeWorthExpireDayAfter">
            <el-input class="input-class" v-model="subForm.activeWorthExpireDayAfter">
              <template slot="append">天</template>
            </el-input>
            <div class="input-tips">
              <span class="red-class">推广活跃值失效时间 与 基础活跃值失效时间一致</span>
            </div>
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
          <el-form-item label="字体/按钮颜色" prop="fontColor">
            <el-input class="input-class" v-model="uiForm1.fontColor" placeholder="请输入字体颜色"></el-input>
            <div class="input-tips">填写颜色编码，也可以粘贴过来</div>
          </el-form-item>

          <el-form-item label="背景图片" prop="imgUrl">
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
          <el-form-item label="字体/按钮颜色" prop="fontColorProcess">
            <el-input class="input-class" v-model="uiForm2.fontColorProcess" placeholder="请输入字体颜色"></el-input>
            <div class="input-tips">填写颜色编码，也可以粘贴过来</div>
          </el-form-item>

          <el-form-item label="背景图片" prop="imgUrlProcess">
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
          <el-form-item label="字体/按钮颜色" prop="fontColorComplete">
            <el-input class="input-class" v-model="uiForm3.fontColorComplete" placeholder="请输入字体颜色"></el-input>
            <div class="input-tips">填写颜色编码，也可以粘贴过来</div>
          </el-form-item>

          <el-form-item label="背景图片" prop="imgUrlComplete">
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
import math from '@/utils/math';
import {getCertificate, upload} from '@/api/system/userlist';
import {taskInfo, saveStore, updateStore} from '@/api/pointsMgmt/starTasks';
import {compareVersion, replaceUnitlPrefixStr} from '@/utils/index';

export default {
  name: 'EditTaskStore',
  data () {
    const vm = this;
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
        income: '1.000000',    // 总奖励Candy
        taskName: '',         // 任务名称
        taskType: 1,          // 任务类型
        limitQuantity: 1,     // 任务同时运行最大数量
        needWhalePeas: 1,    // 兑换任务成本
        earningsRate: 0,      // 收益率
        earningsRateCycleReduce: 0, // 减产比例
        completeCycleIncrease: 0, // 递增天数
        dayToDo: 1,           // 每天可做任务次数
        completeCycleMin: 35, // 最小完成周期数
        expireDayAfter: 70,    // 任务券过期时间
      },
      subForm: {
        sort: 0,                        // 排序
        activeWorth: 1,                 // 基础活跃值
        activeWorthExpireDayAfter:35,   // 基础活跃值失效时间
        activeWorthPromoteExpireDayAfter: 35, // 推广活跃值
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
        income: [
          { required: true, message: '总奖励Candy不能为空', trigger: 'blur' },
          { pattern: /^\d+(\.\d{6})$/, message: '总奖励Candy为6位小数精度的数字', trigger: 'blur' }
        ],
        taskName: [
          { required: true, message: '任务名称不能为空', trigger: 'blur' },
        ],
        taskType: [
          { required: true, message: '任务券类型不能为空', trigger: 'blur' }
        ],
        limitQuantity: [
          { required: true, message: '任务同时运行最大数量不能为空', trigger: 'blur' },
          { pattern: /^[1-9]\d*$/, message: '任务同时运行最大数量为正整数', trigger: 'blur' }
        ],
        needWhalePeas: [
          { required: true, message: '兑换任务成本不能为空', trigger: 'blur' },
          { pattern: /^[1-9]\d*$/, message: '兑换任务成本为正整数', trigger: 'blur' }
        ],
        earningsRate: [
          { required: true, message: '收益率不能为空', trigger: 'blur' },
          { type: 'number', min: 0, max: 39, message: '收益率范围0-39', trigger: ['blur', 'change'] }
        ],
        earningsRateCycleReduce: [
          { required: true, message: '减产比例不能为空', trigger: 'blur' },
          { pattern: /^\d+(\.\d{1,2})|0$/, message: '减产比例为1-2位小数的数字', trigger: 'blur' }
        ],
        completeCycleIncrease: [
          { required: true, message: '每个周期递增天数不能为空', trigger: 'blur' },
          { pattern: /^([1-9]\d*|0)$/, message: '每个周期递增天数为非负整数', trigger: 'blur' }
        ],
        dayToDo: [
          { required: true, message: '每天可做任务次数不能为空', trigger: 'blur' },
          { pattern: /^[1-9]\d*$/, message: '每天可做任务次数为正整数', trigger: 'blur' }
        ],
        completeCycleMin: [
          { required: true, message: '任务券周期不能为空', trigger: 'blur' },
          { pattern: /^[1-9]\d*$/, message: '任务券周期为正整数', trigger: 'blur' }
        ],
        expireDayAfter: [
          { required: true, message: '任务券过期时间不能为空', trigger: 'change' },
          { pattern: /^([1-9]\d*|0)$/, message: '任务券过期时间为非负整数', trigger: 'blur' },
          { validator: (rule, value, callback) => {
              let val = value;
              let checked = vm.checked;
              let taskType = vm.mainForm.taskType;
              let completeCycleMin = vm.mainForm.completeCycleMin;

              if (taskType) {
                if (val < completeCycleMin) {
                  callback(new Error('任务券过期天数不能小于任务券周期天数'));
                } else {
                  callback();
                }
              } else {
                if (checked) {
                  if (val < completeCycleMin) {
                    callback(new Error('任务券过期天数不能小于任务券周期天数'));
                  } else {
                    callback();
                  }
                } else {
                  callback();
                }
              }
            },
            trigger: 'blur'
          }
        ],
        sort: [
          { required: true, message: '排序值不能为空', trigger: 'change' },
          { type: 'number', min: 0, max: 100, message: '排序值为数字范围0-100', trigger: ['blur', 'change'] }
        ],
        activeWorth: [
          { required: true, message: '基础活跃值不能为空', trigger: 'change' },
          { pattern: /^[1-9]\d*$/, message: '基础活跃值为正整数', trigger: 'blur' }
        ],
        activeWorthExpireDayAfter: [
          { required: true, message: '基础活跃值失效时间不能为空', trigger: 'change' },
          { pattern: /^[1-9]\d*$/, message: '基础活跃值失效时间为正整数', trigger: 'blur' }
        ],
        imgUrl: [
          { type: 'string', required: false, message: '背景图片地址不能为空', trigger: 'change' }
        ],
        fontColor: [
          { required: false, message: '字体颜色不能为空', trigger: 'blur' },
          { pattern: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, message: '字体颜色格式不正确', trigger: 'blur' }
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
      isEdit: '',               // 当前操作类型
      id: '',                 // 任务券id
      dialogImageUrl: '',
      dialogVisible: false,
      certificateInfos: {},
      file: {},
      checked: true,         // 过期时间是否限制
    }
  },
  mounted () {
    this.isEdit = this.$route.query.type == 'Edit';
    if (this.isEdit) {
      this.id = this.$route.query.id;
      this.taskInfoRequest();
    };
  },
  methods: {
    // 转化百分比
    formatePercentage (data, def) {
      if (def == '%') {
        return math.divide(data || 0, 100, 4);
      } else {
        return math.multiply(data || 0, 100, 4);
      }
    },
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
    // 切换任务券类型时
    switchTaskType () {
      if (this.mainForm.taskType) {
        this.checked = true;
      };

      this.mainForm.income = '1.000000';
      this.mainForm.needWhalePeas = 0;
      this.mainForm.earningsRate = 0;
      this.mainForm.earningsRateCycleReduce = 0;
      this.mainForm.completeCycleIncrease = 0;
      this.mainForm.completeCycleMin = 35;
      this.mainForm.expireDayAfter = 70;
      this.$refs.mainForm.clearValidate('expireDayAfter');
      // 此处必须配合key来使vdom区分出两个（相同）表单的不同，从而触发vdom更新
    },
    // 切换过期时间无限制时的操作
    noLimitChange (bool) {
      if (bool) {
        this.mainForm.expireDayAfter = 70;
      } else {
        this.mainForm.expireDayAfter = 0;
      }
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
        const id = this.id;
        const {code, message, data} = await taskInfo({id});
        if (code == 200) {
          let manForm = {};
          let {
            income,
            taskName,
            limitQuantity,
            needWhalePeas,
            earningsRate,
            earningsRateCycleReduce,
            completeCycleIncrease,
            dayToDo,
            expireDayAfter,
            completeCycleMin,
            sort,
            taskType,
            activeWorth,
            activeWorthExpireDayAfter,
            activeWorthPromoteExpireDayAfter,
            taskAttribute,
          } = data;

          income = Number(income || 0).toFixed(6);
          earningsRate = this.formatePercentage(earningsRate, 'x');
          earningsRateCycleReduce = this.formatePercentage(earningsRateCycleReduce, 'x').toFixed(2);

          const {
            imgUrl, fontColor,
            imgUrlProcess, fontColorProcess,
            imgUrlComplete, fontColorComplete
          } = taskAttribute;

          this.subForm = {
            ...this.subForm,
            sort,
            activeWorth,
            activeWorthExpireDayAfter,
            activeWorthPromoteExpireDayAfter,
          };

          // 兑换任务券 taskType == 1 时手动计算总收益，赠送任务券 taskType == 0 时不需要手动计算
          manForm = taskType ? {
            income,                         // 总奖励Candy
            taskName,                       // 任务名称
            taskType,                       // 任务类型
            limitQuantity,                  // 任务同时运行最大数量
            needWhalePeas,                  // 兑换任务成本
            earningsRate,                   // 收益率
            earningsRateCycleReduce,        // 减产比例
            completeCycleIncrease,          // 递增天数
            dayToDo,                        // 每天可做任务次数
            expireDayAfter,                 // 任务券周期
            completeCycleMin,               // 最小完成周期数
          } : {
            income,                         // 总奖励Candy
            taskName,                       // 任务名称
            taskType,                       // 任务类型
            limitQuantity,                  // 任务同时运行最大数量
            dayToDo,                        // 每天可做任务次数
            expireDayAfter,                 // 任务券周期
            completeCycleMin,               // 最小完成周期数
          };

          this.checked = expireDayAfter != 0;
          this.mainForm = {...this.mainForm, ...manForm};
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
        let preDate = {};
        const id = this.id;
        const reqFn = this.isEdit ? updateStore : saveStore;
        const taskAttribute = {...this.uiForm1, ...this.uiForm2, ...this.uiForm3};
        let {
          income,                         // 总奖励Candy
          taskName,                       // 任务名称
          taskType,                       // 任务类型
          limitQuantity,                  // 任务同时运行最大数量
          needWhalePeas,                  // 兑换任务成本
          earningsRate,                   // 收益率
          earningsRateCycleReduce,        // 减产比例
          completeCycleIncrease,          // 递增天数
          dayToDo,                        // 每天可做任务次数
          expireDayAfter,                 // 任务券周期
          completeCycleMin,               // 最小完成周期数
        } = this.mainForm;

        earningsRate = this.formatePercentage(earningsRate, '%');
        earningsRateCycleReduce = this.formatePercentage(earningsRateCycleReduce, '%').toFixed(4);
        // 兑换任务券 taskType == 1 时手动计算总收益，赠送任务券 taskType == 0 时不需要手动计算
        if (taskType) {
          const rate = math.add(1, earningsRate, 6);
          income = math.multiply(needWhalePeas, rate, 6);
          preDate = {
            income,                         // 总奖励Candy
            taskName,                       // 任务名称
            taskType,                       // 任务类型
            limitQuantity,                  // 任务同时运行最大数量
            needWhalePeas,                  // 兑换任务成本
            earningsRate,                   // 收益率
            earningsRateCycleReduce,        // 减产比例
            completeCycleIncrease,          // 递增天数
            dayToDo,                        // 每天可做任务次数
            expireDayAfter,                 // 任务券周期
            completeCycleMin,               // 最小完成周期数
          };
        } else {
          preDate = {
            income,                         // 总奖励Candy
            taskName,                       // 任务名称
            taskType,                       // 任务类型
            limitQuantity,                  // 任务同时运行最大数量
            dayToDo,                        // 每天可做任务次数
            expireDayAfter,                 // 任务券周期
            completeCycleMin,               // 最小完成周期数
          };
        }

        this.subForm.activeWorthPromoteExpireDayAfter = this.subForm.activeWorthExpireDayAfter;
        const addSubmData = {...preDate, ...this.subForm, taskAttribute};
        const reqData = this.isEdit ? {...addSubmData, id} : addSubmData;

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
          this.$router.replace({path: 'taskStoreMgmt'}); // 返回列表页
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

      this.$refs.subForm.resetFields();
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
      this.$refs.mainForm.validate(valid => valid ? (num += 1/5) : false);
      this.$refs.subForm.validate(valid => valid ? (num += 1/5) : false);
      this.$refs.uiForm1.validate(valid => valid ? (num += 1/5) : false);
      this.$refs.uiForm2.validate(valid => valid ? (num += 1/5) : false);
      this.$refs.uiForm3.validate(valid => valid ? (num += 1/5) : false);
      if (num == 1) this.submitData();
    }
  },
}
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/element-variables.scss";

  .edit-task-store {
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
    span.red-class {
      color: red;
    }
    .input-class {
      width: 240px;
    }
    .input-tips {
      display: inline-block;
      margin-left: 20px;
      color: #9ca7b5;
      vertical-align: top;
      width: 340px;
    }
    ::v-deep .el-form-item__label {
      font-weight: normal;
    }
    .long-input-tips-form-item {
      .input-tips {
        line-height: 22px;
      }
      ::v-deep .el-form-item__error {
        top: 36px;
      }
    }
    .radio-class {
      label {
        height: 36px;
        line-height: 36px;
        margin-right: 40px;
        font-weight: normal;
      }
      ::v-deep .el-radio__inner {
        width: 18px;
        height: 18px;
        &:after {
          box-sizing: content-box;
          content: "";
          border: 1px solid #fff;
          border-left: 0;
          border-top: 0;
          height: 8px;
          left: 5px;
          position: absolute;
          top: 2px;
          transform: rotate(45deg) scaleY(0);
          width: 4px;
          border-radius: 0;
          background: none;
          transition: transform .15s ease-in .05s;
          transform-origin: center;
        }
      }
      ::v-deep .el-radio__input.is-checked .el-radio__inner:after {
        transform: rotate(45deg) scaleY(1);
      }
    }
    .form-btns {
      margin-top: 15px;
      margin-left: 20px;
      button {
        margin-right: 50px;
      }
    }
    .gray-txt {
      color: #C0C4CC;
      font-weight: 500;
    }
    .no-limit {
      line-height: 36px;
      ::v-deep label {
        height: 36px;
        line-height: 36px;
        font-weight: normal;
      }
    }
  }
</style>
