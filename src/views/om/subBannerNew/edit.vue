<template>
  <div class="edit-main-banner">
    <el-row>
      <el-col>
        <el-form :model="mainForm" :rules="rules" ref="mainForm" label-width="200px" class="mt100">

          <el-form-item label="banner位置：" prop="dictCode">
            <el-select class="input-class" v-model="mainForm.dictCode" placeholder="请选择banner位置">
               <el-option v-for="{name, code} in positions" :key="code" :label="name" :value='code'></el-option>
            </el-select>

          </el-form-item>

          <el-form-item label="banner名称：" prop="bannerName">
            <el-input class="input-class" v-model="mainForm.bannerName" placeholder="请输入banner名称"></el-input>
            <div class="input-tips">banner名称只是作为辨别多个banner条目之用，并不显示在APPbanner中</div>
          </el-form-item>

          <el-form-item label="banner起止时间：" prop="startEndTime">
            <el-date-picker
              class="input-class"
              v-model="mainForm.startEndTime"
              :editable="false"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
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

          <el-form-item label="渠道来源：" prop="urlType">
            <el-radio-group @change="((ev) => {handleRadioChange(ev, mainForm.jumpLinkId, mainForm.jumpLinkId_inner)})" v-model="mainForm.urlType" size="medium">
              <el-radio :label="2">内链</el-radio>
              <el-radio :label="1">外链</el-radio>
              <el-radio :label="null">不添加链接</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="路由名称：" prop="jumpLinkId" v-show="+mainForm.urlType === 1">
            <el-select @change="handleSelectChange" class="input-class" v-model="mainForm.jumpLinkId" placeholder="请选择路由名称">
               <el-option :disabled="!item.status" v-for="(item, index) in jumpLinkArr" :key="index" :label="item.routeName" :value='item.jumpLinkId'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="路由名称：" prop="jumpLinkId" v-show="+mainForm.urlType === 2">
            <el-select @change="handleSelectChange" class="input-class" v-model="mainForm.jumpLinkId_inner" placeholder="请选择路由名称">
               <el-option :disabled="!item.status" v-for="(item, index) in jumpLinkArr_Inner" :key="index" :label="item.routeName" :value='item.jumpLinkId'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="参数名-参数值：" v-show="+mainForm.urlType === 1">
            <ul style="margin:0;padding:0;">
              <li class="clearfix" style="padding-bottom:10px;" v-for="(item, index) in paramsList" :key="index">
                <el-input class="fl" style="width:150px;" :disabled="true" v-model="item.name" placeholder="请输入商品ID"></el-input>
                <span class="fl" style="padding:0 10px;">-</span>
                <el-input type="textarea" class="fl mjtextarea" style="width:305px;" v-model="item.value" placeholder="请输入参数值"></el-input>
                <span class="fl" style="margin-left:10px;font-size:12px;color:#333;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;width:333px;display:inline-block;">{{item.remark}}</span>
              </li>
            </ul>
          </el-form-item>
          <el-form-item label="参数名-参数值：" v-show="+mainForm.urlType === 2">
            <ul style="margin:0;padding:0;">
              <li class="clearfix" style="padding-bottom:10px;" v-for="(item, index) in paramsList_Inner" :key="index">
                <el-input class="fl" style="width:150px;" :disabled="true" v-model="item.name" placeholder="请输入商品ID"></el-input>
                <span class="fl" style="padding:0 10px;">-</span>
                <el-input type="textarea" class="fl mjtextarea" style="width:305px;" v-model="item.value" placeholder="请输入参数值"></el-input>
                <span class="fl" style="margin-left:10px;font-size:12px;color:#333;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;width:333px;display:inline-block;">{{item.remark}}</span>
              </li>
            </ul>
          </el-form-item>



          

          <!-- <template v-if="mainForm.urlType==1">
            <el-form-item label="banner外链-clickUrl：" prop="clickUrl">
              <el-input class="input-class" v-model="mainForm.clickUrl" placeholder="请输入banner外链"></el-input>
            </el-form-item>
          </template>

          <template v-else>
            <el-form-item label="内链路由-clickUrl：" prop="clickUrl">
              <el-input class="input-class" v-model="mainForm.clickUrl" placeholder="请输入内链路由"></el-input>
            </el-form-item>

            <el-form-item class="input-long-class" label="参数名-参数值-params：" v-for="(item, index) in params" :key="index">
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
          </template> -->
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
import { bigOrSmallBannerDetailQueryById, setRoutLinkList, bigOrSmallBannerAdd, bigOrSmallBannerAlter, bigOrSmallBannerDel, bigOrSmallBannerListQuery, bigOrSmallBannerPositionQuery } from "@/api/games";
import {compareVersion, replaceUnitlPrefixStr} from '@/utils/index';
export default {
  name: 'editSubBannerNew',
  data () {
    return {
      value2: '',
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
      jumpLinkArr: [],
      jumpLinkArr_Inner: [],
      paramsList: [],
      paramsList_Inner: [],
      mainForm: {
        bannerName: '',
        dictCode: '',
        startEndTime: [],
        clickUrl: '', // 新版本-移除该参数
        enabled: true,
        pictUrl: '',
        remark: '',
        sort: '',
        urlType: 1,
        dictType: 2,
        // 新加参数-s
        jumpLinkId: '',
        jumpLinkId_inner: '', // 内链时候对应的“路由名称”的ID
        params: []
        // 新加参数-s
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
      items: [
        { type: 'info', label: '标签二', theme: 'light' },
        { type: 'info', label: '标签三', theme: 'light' },
        { type: 'warning', label: '标签五', theme: 'dark' }
      ],
      myCachePoor: {},
      switchedRadioParams: {}
    }
  },
  async mounted () {
    await this.jumpLinkArrQuery()
    // mainForm.urlType
    this.type = this.$route.query.type;
    if (this.type != 'Add') {
      this.id = this.$route.query.id;
      this.bannerDetailRequest();
    };
    this.bannerDictCodesRequest();
  },
  methods: {
    handleRadioChange (ev, jumpLinkId, jumpLinkId_inner) {
      this.switchedRadioParams = {
        radio_value: ev,
        radio_jumpLinkId: jumpLinkId,
        radio_jumpLinkId_inner: jumpLinkId_inner
      }
      this.handleSelectChange()
    },
    handleSelectChange (val) {
      if (val === undefined) {
        // val为undefined代表切换渠道来源radio选项，不是切换路由名称select
        if (+this.mainForm.urlType === 1) {
          if (this.switchedRadioParams.radio_jumpLinkId == this.myCachePoor.jumpLinkId) {
            this.paramsList = this.myCachePoor.params
          } else {
            this.paramsList = (this.jumpLinkArr.length > 0 && this.mainForm.jumpLinkId) ? (this.jumpLinkArr.find(v => +v.jumpLinkId === +this.mainForm.jumpLinkId)).params : []
          }
        } else if (+this.mainForm.urlType === 2) {
          if (this.switchedRadioParams.radio_jumpLinkId_inner == this.myCachePoor.jumpLinkId) {
            this.paramsList_Inner = this.myCachePoor.params
          } else {
            this.paramsList_Inner = (this.jumpLinkArr_Inner.length > 0 && this.mainForm.jumpLinkId_inner) ? (this.jumpLinkArr_Inner.find(v => +v.jumpLinkId === +this.mainForm.jumpLinkId_inner)).params : []
          }
        } else if (this.mainForm.urlType === null) {
          console.log(this.mainForm.urlType)
        }
      } else {
        // val不为undefined代表是切换路由名称select，不是切换渠道来源radio选项
        if (+this.mainForm.urlType === 1) {
          if (val == this.myCachePoor.jumpLinkId) {
            this.paramsList = this.myCachePoor.params
          } else {
            this.paramsList = (this.jumpLinkArr.length > 0 && this.mainForm.jumpLinkId) ? (this.jumpLinkArr.find(v => +v.jumpLinkId === +this.mainForm.jumpLinkId)).params : []
          }
        } else if (+this.mainForm.urlType === 2) {
          if (val == this.myCachePoor.jumpLinkId) {
            this.paramsList_Inner = this.myCachePoor.params
          } else {
            this.paramsList_Inner = (this.jumpLinkArr_Inner.length > 0 && this.mainForm.jumpLinkId_inner) ? (this.jumpLinkArr_Inner.find(v => +v.jumpLinkId === +this.mainForm.jumpLinkId_inner)).params : []
          }
        } else if (this.mainForm.urlType === null) {
          console.log(this.mainForm.urlType)
        }
      }
    },
    jumpLinkArrQuery () {
      return new Promise((resolve, reject) => {
        // linkType: 1外链2内链
        setRoutLinkList({linkType: 1, appPackageType: this.$route.query.appPackageType }).then(response => {
          if (+response.code === 200) {
            this.jumpLinkArr = response.data.list || []
            this.mainForm.jumpLinkId = response.data.list.length > 0 ? response.data.list[0].jumpLinkId : '' // 不能为空，故处理为选中默认第一项
            this.handleSelectChange()
          } else {
            this.jumpLinkArr = []
          }
        }).catch(e => {})
        setRoutLinkList({linkType: 2, appPackageType: this.$route.query.appPackageType }).then(response => {
          if (+response.code === 200) {
            this.jumpLinkArr_Inner = response.data.list || []
            this.mainForm.jumpLinkId_inner = response.data.list.length > 0 ? response.data.list[0].jumpLinkId : ''
            this.handleSelectChange()
          } else {
            this.jumpLinkArr_Inner = []
          }
        }).catch(e => {})
        resolve('Done')
      })
    },
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
        // const {code, message, data} = await bannerDetail({
        //   id: this.id,
        //   dictType: 2,
        // });
        const {code, message, data} = await bigOrSmallBannerDetailQueryById({
          id: this.id
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
          this.mainForm = {...this.mainForm, ...data};
          this.mainForm.startEndTime = [data.startTime ? new Date(data.startTime) : '', data.endTime ? new Date(data.endTime) : '']
          this.uploadConf.fileList = [{name: '', url: data.pictUrl}];
          this.switchUploader('upload', 'none');
          setTimeout(() => {
            if (+data.urlType === 2) {
              this.mainForm.jumpLinkId_inner = data.jumpLinkId
              this.paramsList_Inner = data.params
              this.mainForm.jumpLinkId = ''
            } else if (+data.urlType === 1) {
              this.mainForm.jumpLinkId = data.jumpLinkId
              this.paramsList = data.params
              this.mainForm.jumpLinkId_inner = ''
            } else {
              this.mainForm.jumpLinkId = ''
              this.mainForm.jumpLinkId_inner = ''
            }
            this.myCachePoor = {
              jumpLinkId: data.jumpLinkId,
              params: data.params
            }
            console.log('force write--')
          }, 500)
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
        // let params = {};

        // if (this.mainForm.urlType == 1) {
        //   params = {};
        // } else {
        //   const len = this.params.length;
        //   if (len) {
        //     this.params.map(({key, value}) => {
        //       params[key] = value;
        //     });
        //   } else {
        //     params = {};
        //   }
        // };

        let formatData = {
          // params,
          bannerName: this.mainForm.bannerName,
          dictCode: this.mainForm.dictCode,
          // clickUrl: this.mainForm.clickUrl,
          enabled: this.mainForm.enabled,
          pictUrl: this.mainForm.pictUrl,
          remark: this.mainForm.remark,
          sort: this.mainForm.sort,
          urlType: this.mainForm.urlType,
          // dictType: this.mainForm.dictType,
          type: 1,
          appPackageType: this.$route.query.appPackageType,
        }
        if (+this.mainForm.urlType === 1) {
          formatData.jumpLinkId = this.mainForm.jumpLinkId
          formatData.params = this.paramsList
        } else {
          formatData.jumpLinkId = this.mainForm.jumpLinkId_inner
          formatData.params = this.paramsList_Inner
        }

        const startEndTime = this.mainForm.startEndTime || [];
        const startTime = new Date(startEndTime[0]);
        const endTime = new Date(startEndTime[1]);
        const timeDate = startEndTime.length ? {startTime, endTime} : {};

        

        // const reqFn = this.type == 'Add' ? saveBanner : bannerEdit;
        const reqFn = this.type == 'Add' ? bigOrSmallBannerAdd : bigOrSmallBannerAlter;
        const reqData = this.type == 'Add' ? {...formatData, ...timeDate} : {...formatData, ...timeDate, id: this.id};
        const {code, message} = await reqFn(reqData);
        if (code == 200) {
          this.$message({type: 'success', message: '提交成功'});
          this.cancelSubmit();
        } else {
          this.$message({type: 'error', message});
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 获取banner位置列表
    async bannerDictCodesRequest () {
      try {
        // const {code, message, data} = await bannerDictCodes({
        //   dictType: 2
        // });
        const {code, message, data} = await bigOrSmallBannerPositionQuery({
          type: 1, // 小Banner
          appPackageType: this.$route.query.appPackageType
        });
        if (code == 200) {
          this.positions = data.list;
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
          this.$router.replace({name: 'SubBannerNew', query: { appPackageType: this.$route.query.appPackageType }}); // 返回列表页
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
      this.dialogImageUrl = '';
      this.$refs.upload.clearFiles();

      this.$refs.mainForm.resetFields();
      this.switchUploader('upload', 'inline-block');
    },
    // 提交
    submitForm() {
      this.$refs['mainForm'].validate((valid) => {
        if (valid) {
          this.submitData()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .edit-main-banner {
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
    .tag-class {
      &.el-tag--info {
        font-weight: 500;
        color: #333;
      }
      &.el-tag--warning.el-tag--dark {
        font-weight: 800;
      }
    }
  }
</style>
<style>
.mjtextarea .el-textarea__inner{
    height: 36px!important;
}
</style>
