<template>
  <div class="bottom-nav" v-loading="isLoading">
    <div class="hi-left" @click="switchArrowHandle(1)">
      <i class="el-icon-d-arrow-right" v-show="isShowLeft"></i>
    </div>
    <div class="title">
      <div class="desc" v-show="isShowLeft">
        <div class="text">模块配置-底部导航（最多5项）</div>
        <div class="btn" @click="addFormItemHandle">
          <el-button size="mini" :disabled="formsArr.length>=5" type="primary">增加</el-button>
        </div>
      </div>
    </div>
    <div class="body" v-show="isShowLeft">
      <template v-for="(formitem,findex) in formsArr">
        <div class="item" :key="formitem.fid">
          <el-form :model="formitem" :key="formitem.fid" ref="atomform" class="custom-from">
            <el-form-item required prop="name" label="中文名称: " :rules="rules.name">
              <el-input v-model="formitem.name" clearable placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item required prop="nameEn" label="英文名称: " :rules="rules.nameEn">
              <el-input v-model="formitem.nameEn" clearable placeholder="请输入"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="11">
                <el-form-item label="选中图标: ">
                  <el-upload
                    ref="uploadItemSel"
                    class="row-uploader"
                    :key="formitem.fid"
                    :file-list="uploadConfItem.fileList"
                    :action="uploadConfItem.action"
                    :limit="uploadConfItem.limit"
                    :auto-upload="uploadConfItem.auto"
                    :accept="uploadConfItem.accept"
                    :list-type="uploadConfItem.type"
                    :show-file-list="uploadConfItem.showList"
                    :http-request="(file) => handleRequestItem(file, 'uploadItemSel', findex)"
                    :on-remove="(file, fileList) => handleRemove(file, fileList, 'uploadItemSel', findex)"
                  >
                    <i class="el-icon-upload"></i>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="未选中图标: ">
                  <el-upload
                    ref="uploadItem"
                    class="row-uploader"
                    :key="formitem.fid"
                    :file-list="uploadConfItem.fileList"
                    :action="uploadConfItem.action"
                    :limit="uploadConfItem.limit"
                    :auto-upload="uploadConfItem.auto"
                    :accept="uploadConfItem.accept"
                    :list-type="uploadConfItem.type"
                    :show-file-list="uploadConfItem.showList"
                    :http-request="(file) => handleRequestItem(file, 'uploadItem', findex)"
                    :on-remove="(file, fileList) => handleRemove(file, fileList, 'uploadItem', findex)"
                  >
                    <i class="el-icon-upload"></i>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="divider-tips">配置链接: </div>
            <el-form-item required label-width="100px" prop="source" label="渠道来源: " :rules="rules.source">
              <el-select v-model="formitem.source" placeholder="请选择" @change="(value) => sourceChangeHandle(value,formitem)">
                <el-option label="内链" :value="2"></el-option>
                <el-option label="外链" :value="1"></el-option>
                <el-option label="不添加" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <template v-if="formitem.source!=3">
              <el-form-item required label-width="100px" prop="routerName" label="路由名称: " :rules="rules.routerName">
                <el-select v-model="formitem.routerName" placeholder="请选择" @change="(value) => routeChangeHandle(value,formitem)">
                  <template v-if="formitem.source==1">
                    <el-option
                      :key="jumpLinkId"
                      :label="routeName"
                      :value="uniqueIdent"
                      :disabled="!status"
                      v-for="({routeName,jumpLinkId,uniqueIdent,status}) in routesOut"
                    ></el-option>
                  </template>
                  <template v-if="formitem.source==2">
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
                <el-row class="form-row" v-for="(item,index) in formitem.list" :key="index">
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
          </el-form>
          <div class="tools">
            <img @click="upFormItemHandle(formitem, findex)" v-if="findex!=0" class="image" :src="Conf.arrowupIcon">
            <img @click="removeFormItemHandle(findex)" v-if="findex!=0||formsArr.length>1" class="image" :src="Conf.closeIcon">
          </div>
        </div>
      </template>
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
  name: "BottomNav",
  data() {
    return {
      Conf,
      uploadConfItem: {
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
          name: '',
          nameEn: '',
          src: '',
          source: '',
          selSrc: '',
          routerName: '',
          fid: uuid().substr(0, 8),
          list: [
            {
              name: '',
              value: '',
              remark: '',
            },
          ]
        },
      ],
      routesIn: [],
      routesOut: [],
      rules: {
        name: [
          {required: true, message: '中文名字不能为空', trigger: 'change'},
        ],
        nameEn: [
          {required: true, message: '英文名字不能为空', trigger: 'change'},
        ],
        source: [
          {required: true, message: '渠道来源不能为空', trigger: 'change'},
        ],
        routerName: [
          {required: true, message: '路由名称不能为空', trigger: 'change'},
        ],
      },
      file:  null,
      isLoading: false
    };
  },
  mounted () {
    this.isLoading = true
    setTimeout(() => {
      this.isLoading = false
    }, 500)
  },
  methods: {
    // 渠道来源选中变化
    sourceChangeHandle(val, item) {
      const {formsArr} = this.$options.data();
      const {routerName, list} = formsArr[0];
      this.$set(item, 'list', list);
      this.$set(item, 'routerName', routerName);
    },
    // 路由名称选中变化
    routeChangeHandle(val, item) {
      const {formsArr} = this.$options.data();
      const {list} = formsArr[0];
      const {source} = item;
      const routes = source == 1 ? this.routesOut : source == 2 ? this.routesIn : [];
      let {params} = routes.find(({uniqueIdent}) => uniqueIdent == val) || {};
      params = JSON.parse(JSON.stringify(params));

      if (params.length) {
        this.$set(item, 'list', params);
      } else {
        this.$set(item, 'list', list);
      }
    },
    // 计算当前是第几个uploader组件 fdx-父索引 cdx-子索引
    computIndex(ref, fdx) {
      let items = [...this.$refs[ref]];
      let curcid = this.formsArr[fdx].fid;
      let index = items?.findIndex(el => el.$vnode.key == curcid);

      return index;
    },
    // 添加导航菜单
    addFormItemHandle() {
      if (this.formsArr.length >= 5) return this.$message.warning('最多可添加5个菜单');

      const item = {
        name: '',
        nameEn: '',
        src: '',
        source: '',
        selSrc: '',
        routerName: '',
        fid: uuid().substr(0, 8),
        list: [
          {
            name: '',
            value: '',
            remark: '',
          },
        ]
      };

      this.formsArr.push(item);
    },
    // 移除操作
    removeFormItemHandle(index) {
      let len = this.formsArr.length;

      if (len <= 1) {
        this.$message.error('至少保留一个菜单');
      } else {
        this.formsArr.splice(index, 1);
      }
    },
    // 上移操作
    upFormItemHandle(item, index) {
      if (index == 0) {
        this.$message.error('第一个菜单无法移动');
      } else {
        this.formsArr.splice(index - 1, 0, item);
        this.formsArr.splice(index + 1, 1);
      }
    },
    // 切换按钮操作
    switchArrowHandle(arg) {
      if (arg == 1) {
        this.isShowLeft = false;
      } else {
        this.isShowLeft = true;
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
      const isLt = file.size / 1024 < this.uploadConfItem.size;
      const isRightFormat = this.uploadConfItem.arr.includes(file.type);
      if (!isRightFormat) this.$message.error('上传图片只能是 JPG，PNG，GIF 格式!');
      if (!isLt) this.$message.error(`上传图片大小不能超过 ${this.uploadConfItem.size}KB!`);
      return isRightFormat && isLt;
    },
    // 移除上传
    handleRemove(file, fileList, ref, index) {
      const curIndex = this.computIndex(ref, index);
      this.$refs[ref][curIndex].uploadFiles.splice(0, 1);
      this.switchUploader(ref, curIndex, 'inline-block');
    },
    // 重写提交方法
    handleRequestItem ({file}, ref, index) {
      const curIndex = this.computIndex(ref, index);
      const hasValid = this.beforeuploadItem(file);
      if (hasValid) {
        this.uploadRequset(file, ref, index, curIndex);
      } else {
        this.file = null;
        this.$refs[ref][curIndex].uploadFiles.splice(0, 1);
      }
    },
    // 发起图片上传请求
    async uploadRequset (file, ref, index, curIndex) {
      this.switchUploader(ref, curIndex, 'none');
      try {
        const {data: certificates} = await getCertificate('product');
        const {res: {status, statusCode, requestUrls}} = await upload(certificates, file);
        if (status == 200 && statusCode == 200) {
          const img = requestUrls[0];
          const key = ref == 'uploadItemSel' ? 'selSrc' : 'src';
          this.$set(this.formsArr[index], key, img);
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
      console.log(data, 'data')
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
        this.formsArr.map((el, index) => {
          const {src, selSrc} = el;
          const curIndex = this.computIndex('uploadItem', index);
          const curIndexSel = this.computIndex('uploadItemSel', index);
          const uploadFiles = this.$refs.uploadItem[curIndex].uploadFiles;
          const uploadFilesSel = this.$refs.uploadItemSel[curIndexSel].uploadFiles;

          if (src) {
            uploadFiles.length = 0;
            uploadFiles.push({url: src, uid: Date.now()});
            this.switchUploader('uploadItem', curIndex, 'none');
          }

          if (selSrc) {
            uploadFilesSel.length = 0;
            uploadFilesSel.push({url: selSrc, uid: Date.now()});
            this.switchUploader('uploadItemSel', curIndexSel, 'none');
          }
        });
      });
    },
    // 重置表单
    resetHandle() {
      const {formsArr} = this.$options.data();
      this.formsArr = formsArr; // 执行初始化

      this.$emit('update', {
        type: 'bottomNav',
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
        let _boolean_src = this.formsArr.some(v => v.src == '')
        let _boolean_selSrc = this.formsArr.some(v => v.selSrc == '')
        if (_boolean_src) {
          this.$message.error('选中图标不能为空');
          return false;
        } else if (_boolean_selSrc) {
          this.$message.error('未选中图标不能为空');
          return false;
        }
        this.$emit('update', {
          type: 'bottomNav',
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
.bottom-nav {
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
      .btn {
        button {
          font-weight: 700;
        }
      }
    }
  }
  .body {
    .item {
      position: relative;
      width: 450px;
      .custom-from {
        width: 430px;
        border: 1px solid #ccc;
        margin: 10px;
        padding: 10px;
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
      .tools {
        height: 28px;
        position: absolute;
        bottom: 0;
        right: -50px;
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
<style lang="scss">
.bottom-nav .el-form-item__label:before{
  color:#fff!important;
}
</style>
