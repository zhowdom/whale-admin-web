<template>
  <div class="card3p">
    <div class="hi-left" @click="switchArrowHandle(1)">
      <i class="el-icon-d-arrow-right" v-show="isShowLeft"></i>
    </div>
    <div class="title">
      <div class="desc" v-show="isShowLeft">
        <div class="text">模块配置-卡片3图</div>
      </div>
    </div>
    <div class="body" v-show="isShowLeft">
      <div class="item" v-for="(formitem,findex) in formsArr" :key="findex">
        <el-form :model="formitem" ref="atomform" :key="findex" class="custom-from" :rules="rules">
          <!-- 竖版banner配置 -->
          <div class="vertical-banner">
            <div class="tag-items-wrap">
              <div class="tag-item" v-for="(banitem,banindex) in formitem.banners" :key="banindex">
                <div class="divider-tips">配置参数: </div>
                <template v-for="(bitem,bindex) in banitem.banlist">
                  <el-form-item v-if="bitem.name=='type'" :key="bindex+'a'" label-width="120px" :prop="'banners.'+banindex+'.banlist.'+bindex+'.value'" label="banner类型: " :rules="rules.type1">
                    <el-select v-model="bitem.value" placeholder="请选择">
                      <el-option label="小banner" :value="1"></el-option>
                      <el-option label="大banner" :value="2"></el-option>
                      <el-option label="长banner" :value="3"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-if="bitem.name=='code'" :key="bindex+'b'" label-width="120px" :prop="'banners.'+banindex+'.banlist.'+bindex+'.value'" label="banner位置: " :rules="rules.code">
                    <el-input v-model="bitem.value" clearable placeholder="请输入"></el-input>
                  </el-form-item>
                </template>
              </div>
            </div>
          </div>
          <!-- icons配置 -->
          <div class="top-header">
            <div class="icon-item" v-for="(iconitem,iindex) in formitem.icons" :key="iconitem.cid">
              <el-form-item required label-width="90px" :prop="'icons.' + iindex + '.type'" label="主标类型: " :rules="rules.type">
                <el-select v-model="iconitem.type" placeholder="请选择" @change="mainChangeHandle(iconitem)">
                  <el-option label="图片" :value="1"></el-option>
                  <el-option label="文字" :value="2"></el-option>
                </el-select>
              </el-form-item>
              <template v-if="iconitem.type==1">
                <el-form-item
                  required
                  label="主标: "
                  label-width="60px"
                  :rules="rules.mainsrc1"
                  :key="iconitem.cid+'a'"
                  :prop="'icons.' + iindex + '.mainsrc'"
                  >
                  <el-upload
                    ref="uploadMain"
                    class="icon-uploader"
                    :key="iconitem.cid"
                    :file-list="uploadConfImage.fileList"
                    :action="uploadConfImage.action"
                    :limit="uploadConfImage.limit"
                    :auto-upload="uploadConfImage.auto"
                    :accept="uploadConfImage.accept"
                    :list-type="uploadConfImage.type"
                    :show-file-list="uploadConfImage.showList"
                    :http-request="(file) => handleRequest(file, 'uploadMain', iindex)"
                    :on-remove="(file, fileList) => handleRemove(file, fileList, 'uploadMain', iindex)">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                </el-form-item>
              </template>
              <template v-else>
                <el-form-item
                  :key="iconitem.cid+'b'"
                  required
                  label="主标: "
                  label-width="60px"
                  :rules="rules.mainsrc2"
                  :prop="'icons.' + iindex + '.mainsrc'"
                >
                  <el-input v-model="iconitem.mainsrc" clearable placeholder="请输入"></el-input>
                </el-form-item>
              </template>
              <el-form-item label-width="60px" :prop="'icons.' + iindex + '.title'" label="内容: ">
                <el-input v-model="iconitem.title" clearable placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label-width="60px" :prop="'icons.' + iindex + '.subtitle'" label="副标: ">
                <el-input v-model="iconitem.subtitle" clearable placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label-width="60px" label="背景: ">
                <el-row class="form-row" :gutter="15">
                  <el-col :span="9">
                    <el-input class="input-width" v-model="iconitem.bgColor[0]" clearable placeholder="请输入"></el-input>
                  </el-col>
                  <el-col class="line" :span="1">-</el-col>
                  <el-col :span="9">
                    <el-input class="input-width" v-model="iconitem.bgColor[1]" clearable placeholder="请输入"></el-input>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label-width="60px" label="图片: ">
                <el-upload
                  ref="uploadImage"
                  class="icon-uploader"
                  :key="iconitem.cid"
                  :file-list="uploadConfImage.fileList"
                  :action="uploadConfImage.action"
                  :limit="uploadConfImage.limit"
                  :auto-upload="uploadConfImage.auto"
                  :accept="uploadConfImage.accept"
                  :list-type="uploadConfImage.type"
                  :show-file-list="uploadConfImage.showList"
                  :http-request="(file) => handleRequest(file, 'uploadImage', iindex)"
                  :on-remove="(file, fileList) => handleRemove(file, fileList, 'uploadImage', iindex)">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-form-item>
              <div class="divider-tips">配置链接: </div>
              <el-form-item required label-width="100px" :prop="'icons.' + iindex + '.source'" :rules="rules.source" label="渠道来源: ">
                <el-select v-model="iconitem.source" placeholder="请选择" @change="(value) => sourceChangeHandle(value,iconitem)">
                  <el-option label="内链" :value="2"></el-option>
                  <el-option label="外链" :value="1"></el-option>
                  <el-option label="不添加" :value="3"></el-option>
                </el-select>
              </el-form-item>
              <template v-if="iconitem.source!=3">
                <el-form-item required label-width="100px" :prop="'icons.' + iindex + '.routerName'" :rules="rules.routerName" label="路由名称: ">
                  <el-select v-model="iconitem.routerName" placeholder="请选择" @change="(value) => routeChangeHandle(value,iconitem)">
                    <template v-if="iconitem.source==1">
                      <el-option
                        :key="jumpLinkId"
                        :label="routeName"
                        :value="uniqueIdent"
                        :disabled="!status"
                        v-for="({routeName,jumpLinkId,uniqueIdent,status}) in routesOut"
                      ></el-option>
                    </template>
                    <template v-if="iconitem.source==2">
                      <el-option
                        :key="jumpLinkId"
                        :label="routeName"
                        :value="uniqueIdent"
                        :disabled="!status"
                        v-for="({routeName,jumpLinkId,uniqueIdent,status}) in routesIn"
                      ></el-option>
                    </template>
                  </el-select>
                </el-form-item>
                <el-form-item label-width="120px" label="参数名-参数值: ">
                  <el-row class="form-row" v-for="(item,index) in iconitem.list" :key="index">
                    <el-col :span="11">
                      <el-input class="input-width" disabled v-model="item.remark" placeholder="备注"></el-input>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                      <el-input class="input-width" v-model="item.value" clearable placeholder="请输入"></el-input>
                    </el-col>
                  </el-row>
                </el-form-item>
              </template>
              <div class="tools">
                <img @click="upFormItemHandle(iconitem, iindex)" v-if="iindex!=0" class="image" :src="Conf.arrowupIcon">
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <div class="footer" v-show="isShowLeft">
      <el-button @click="resetHandle" size="small">重置</el-button>
      <el-button @click="saveHandle" size="small" type="primary">保存</el-button>
    </div>
    <div class="hi-right" @click="switchArrowHandle(-1)">
      <i class="el-icon-d-arrow-left" v-show="!isShowLeft"></i>
    </div>
  </div>
</template>

<script>
import {uuid} from '@/utils/index';
import Conf from '@/utils/indexConf';
import {getCertificate, upload} from '@/api/oss';

export default {
  name: "Card3p",
  data() {
    return {
      Conf,
      uploadConfImage: {
        size: 200,
        showList: true,
        auto: true,
        action: '',
        limit: 1,
        fileList: [],
        type: 'picture-card',
        accept: '.png,.jpg,.jpeg',
        arr: ['image/png', 'image/jpeg', 'image/jpg'],
      },
      isShowLeft: true,
      formsArr: [
        {
          icons: [
            {
              type: 1,        // 图片 - 1 文字 - 2
              title: '',      // 内容
              subtitle: '',   // 副标
              mainsrc: '',    // 主标
              imagesrc: '',   // 图片
              source: '',
              routerName: '',
              cid: uuid().substr(0, 8),
              list: [
                {
                  name: '',
                  value: '',
                  remark: '',
                },
              ],
              bgColor: [],
            },
            {
              type: 1,        // 图片 - 1 文字 - 2
              title: '',      // 内容
              subtitle: '',   // 副标
              mainsrc: '',    // 主标
              imagesrc: '',   // 图片
              source: '',
              routerName: '',
              cid: uuid().substr(0, 8),
              list: [
                {
                  name: '',
                  value: '',
                  remark: '',
                },
              ],
              bgColor: [],
            },
          ],
          banners: [
            {
              banlist: [
                {
                  name: 'type',
                  value: '',
                  remark: 'banner类型',
                },
                {
                  name: 'code',
                  value: '',
                  remark: 'banner位置',
                },
              ],
            },
          ],
        },
      ],
      routesIn: [],
      routesOut: [],
      file:  null,
      rules: {
        type: [
          {required: true, message: '主标类型不能为空', trigger: ['blur', 'change']},
        ],
        type1: [
          {required: true, message: 'banner类型不能为空', trigger: 'change'},
        ],
        code: [
          {required: true, message: 'banner位置不能为空', trigger: 'blur'},
        ],
        mainsrc1: [
          {required: true, message: '主标不能为空', trigger: ['blur', 'change']},
        ],
        mainsrc2: [
          {required: true, message: '输入不能为空', trigger: ['blur', 'change']},
        ],
        source: [
          {required: true, message: '渠道来源不能为空', trigger: 'change'},
        ],
        routerName: [
          {required: true, message: '路由名称不能为空', trigger: 'change'},
        ],
      },
    };
  },
  methods: {
    // 计算当前是第几个uploader组件 fdx-父索引 cdx-子索引
    computIndex(ref, fdx) {
      let items = [...this.$refs[ref]];
      let curcid = this.formsArr[0].icons[fdx].cid;
      let index = items?.findIndex(el => el.$vnode.key == curcid);

      return index;
    },
    // 上移操作
    upFormItemHandle(item, index) {
      if (index == 0) {
        this.$message.error('第一个菜单无法移动');
      } else {
        this.formsArr[0]['icons'].splice(index - 1, 0, item);
        this.formsArr[0]['icons'].splice(index + 1, 1);
      }
    },
    // 左上箭头切换按钮操作
    switchArrowHandle(arg) {
      if (arg == 1) {
        this.isShowLeft = false;
      } else {
        this.isShowLeft = true;
      }
    },
    // 主标类型变化
    mainChangeHandle(item) {
      this.$set(item, 'mainsrc', '');
    },
    // 渠道来源选中变化
    sourceChangeHandle(val, item) {
      const {formsArr} = this.$options.data();
      const {icons} = formsArr[0];

      const {routerName, list} = icons[0];
      this.$set(item, 'list', list);
      this.$set(item, 'routerName', routerName);
    },
    // 路由名称选中变化
    routeChangeHandle(val, item) {
      const {formsArr} = this.$options.data();
      const {icons} = formsArr[0];
      const source = item.source;
      const routes = source == 1 ? this.routesOut : source == 2 ? this.routesIn : [];
      let {params} = routes.find(({uniqueIdent}) => uniqueIdent == val) || {};
      params = JSON.parse(JSON.stringify(params));

      const {list} = icons[0];
      if (params.length) {
        this.$set(item, 'list', params);
      } else {
        this.$set(item, 'list', list);
      }
    },
    // 切换上传组件显示状态
    switchUploader (ref, index, arg) {
      this.$nextTick(() => {
        const uploader = this.$refs[ref][index]?.$el.querySelector('.el-upload');
        !!uploader && (uploader.style.display = arg);
      });
    },
    // 上传前校验
    beforeuploadItem(file) {
      const conf = this.uploadConfImage;
      const isLt = file.size / 1024 < conf.size;
      const isFt = conf.arr.includes(file.type);
      if (!isFt) this.$message.error('上传图片只能是 JPG，PNG，GIF 格式!');
      if (!isLt) this.$message.error(`上传图片大小不能超过 ${conf.size}KB!`);
      return isFt && isLt;
    },
    // 移除上传
    handleRemove(file, fileList, ref, cdx) {
      let curIndex = this.computIndex(ref, cdx);
      this.$refs[ref][curIndex].uploadFiles.splice(0, 1);
      this.switchUploader(ref, curIndex, 'inline-block');
    },
    // 重写提交方法
    handleRequest ({file}, ref, cdx) {
      let curIndex = this.computIndex(ref, cdx);

      const hasValid = this.beforeuploadItem(file);
      if (hasValid) {
        this.uploadRequset(file, ref, cdx, curIndex);
      } else {
        this.file = null;
        this.$refs[ref][curIndex].uploadFiles.splice(0, 1);
      }
    },
    // 发起图片上传请求
    async uploadRequset (file, ref, cdx, curIndex) {
      this.switchUploader(ref, curIndex, 'none');
      try {
        const {data: certificates} = await getCertificate('product');
        const {res: {status, statusCode, requestUrls}} = await upload(certificates, file);
        if (status == 200 && statusCode == 200) {
          if (ref == 'uploadImage') {
            this.$set(this.formsArr[0]['icons'][cdx], 'imagesrc', requestUrls[0]);
          } else {
            this.$set(this.formsArr[0]['icons'][cdx], 'mainsrc', requestUrls[0]);
          }
          this.$message.success('图片上传成功！');
        } else {
          this.switchUploader(ref, curIndex, 'inline-block');
          this.$message.error('图片上传失败');
        }
      } catch (e) {
        this.switchUploader(ref, curIndex, 'inline-block');
        console.log(e)
      }
    },
    // 设置路由数据
    setRouteHandle(data) {
      data.map(({linkType, routes}) => {
        if (linkType == 1) this.routesOut = routes;
        if (linkType == 2) this.routesIn = routes;
      });
    },
    // 回显配置数据
    setDataHandle(data) {
      const {formsArr} = this.$options.data();
      this.formsArr = data.length ? data : formsArr;
      if (!data.length) return;

      this.$nextTick(() => {
        let {icons} = this.formsArr[0];

        icons.map(({imagesrc, mainsrc, type}, cdx) => {
          if (imagesrc) {
            const curIndex = this.computIndex('uploadImage', cdx);
            const uploadFiles = this.$refs.uploadImage[curIndex]?.uploadFiles;
            uploadFiles.length = 0;
            uploadFiles.push({url: imagesrc, uid: Date.now()});
            this.switchUploader('uploadImage', curIndex, 'none');
          }

          // 主标为图片类型
          if (mainsrc && type == 1) {
            const curIndex = this.computIndex('uploadMain', cdx);
            const uploadFiles = this.$refs.uploadMain[curIndex]?.uploadFiles;
            uploadFiles.length = 0;
            uploadFiles.push({url: mainsrc, uid: Date.now()});
            this.switchUploader('uploadMain', curIndex, 'none');
          }
        });
      });
    },
    // 重置表单
    resetHandle() {
      const {formsArr} = this.$options.data();
      this.formsArr = formsArr; // 执行初始化

      this.$emit('update', {
        type: 'card3p',
        content: []
      });
    },
    // 保存表单
    saveHandle() {
      const forms = this.$refs.atomform;
      const result = forms.every(form => {
        let validRst = false;
        form.validate(valid => validRst = valid);
        return validRst;
      });

      if (result) {
        this.$emit('update', {
          type: 'card3p',
          content: this.formsArr
        });
      } else {
        this.$message.error('必填字段不能为空');
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.card3p {
  position: relative;
  .hi-left {
    position: absolute;
    font-size: 23px;
    font-weight: bold;
    cursor: pointer;
    left: -28px;
  }
  .hi-right {
    position: absolute;
    font-size: 23px;
    font-weight: bold;
    cursor: pointer;
    top: 0px;
    right: 0px;
  }
  .title {
    .desc {
      width: 100%;
      height: 40px;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0 10px;
      justify-content: space-between;
      background-color: rgb(85, 85, 85);
      .text {
        color: #FFF;
        font-size: 16px;
        font-weight: 700;
      }
    }
  }
  .body {
    .item {
      width: 450px;
      .custom-from {
        width: 430px;
        ::v-deep {
          .el-input {
            width: 170px;
          }
        }
        .input-width {
          width: 120px;
        }
      }
      .form-row + .form-row {
        margin-top: 10px;
      }
      .vertical-banner {
        width: 100%;
        margin: 10px;
        padding: 10px;
        border: 1px solid #ccc;
        .header {
          width: 100%;
          height: 40px;
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 0 10px;
          justify-content: space-between;
          background-color: #F8F8F8;
          border-bottom: 1px solid #eee;
          margin-bottom: 10px;
          .text {
            color: #333;
            font-size: 16px;
            font-weight: 700;
          }
        }
        .tag-tabs {
          margin-bottom: 10px;
          .custom-tag {
            cursor: pointer;
            transition: all 0.3s;
            margin: 5px;
          }
        }
      }
      .top-header {
        .icon-item {
          width: 100%;
          margin: 10px;
          padding: 10px;
          position: relative;
          border: 1px solid #ccc;
          .tools {
            height: 28px;
            position: absolute;
            bottom: 0;
            right: -60px;
            width: 52px;
            .image {
              width: 24px;
              height: 24px;
              cursor: pointer;
              &:first-child {
                margin-right: 3px;
              }
            }
          }
        }
      }
    }
  }
  .footer {
    padding: 10px 0;
    text-align: center;
    button:first-child {
      margin-right: 10px;
    }
  }
  .row-uploader {
    ::v-deep {
      .el-upload-list {
        li {
          width: 167px;
          height: 250px;
          margin: 0;
          display: block;
          transition: unset;
        }
        .el-upload-list__item-status-label {
          display: none;
        }
      }
      .el-upload--picture-card {
        width: 167px;
        height: 250px;
        line-height: 250px;
      }
    }
  }
  .icon-uploader {
    ::v-deep {
      .el-upload-list {
        li {
          width: 60px;
          height: 60px;
          margin: 0;
          display: block;
          transition: unset;
        }
        .el-upload-list__item-status-label {
          display: none;
        }
      }
      .el-upload--picture-card {
        width: 60px;
        height: 60px;
        line-height: 60px;
      }
    }
  }
  .divider-tips {
    color: #333;
    font-size: 14px;
    margin-bottom: 10px;
    font-weight: 500;
  }
}
</style>
