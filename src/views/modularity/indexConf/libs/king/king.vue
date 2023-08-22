<template>
  <div class="king">
    <div class="hi-left" @click="switchArrowHandle(1)">
      <i class="el-icon-d-arrow-right" v-show="isShowLeft"></i>
    </div>
    <div class="title">
      <div class="desc" v-show="isShowLeft">
        <div class="text">模块配置-金刚区</div>
      </div>
    </div>
    <div class="body" v-show="isShowLeft">
      <div class="content" >
        <!-- 金刚区配置 -->
        <div class="header-wrap">
          <div class="header">
            <div class="text">
              金刚区配置
              <div class="tips-wrap">
                <div class="tips-content">
                  <span>每个轮播页最多两行</span><br>
                  <span>每行最多5个导航入口</span>
                </div>
              </div>
            </div>
            <div class="btns">
              <el-button size="mini" v-if="formsArr.length>1" @click="removeCarouselHandle" type="danger">移除</el-button>
              <el-button size="mini" @click="addCarouselHandle" type="primary">增加轮播页</el-button>
            </div>
          </div>
          <div class="tag-tabs">
            <div class="tags">
              <el-tag
                class="custom-tag"
                v-for="(formitem,findex) in formsArr"
                :key="formitem.fid"
                @click="tagHandle(findex)"
                :type="formitem.active?'':'info'">
                {{findex + 1}}
              </el-tag>
            </div>
            <div class="btn">
              <el-button size="mini" @click="addFormItemHandle" type="primary">增加</el-button>
            </div>
          </div>
        </div>
        <template v-for="(formitem,findex) in formsArr">
          <div class="tag-items-wrap" v-show="formitem.active" :key="formitem.fid">
            <div class="tag-item" v-for="(pformitem,pindex) in formitem.pages" :key="pformitem.cid">
              <el-form class="custom-from" :model="formitem" ref="atomform" :key="formitem.fid" :rules="rules">
                <el-form-item required label-width="60px" :prop="'pages.' + pindex + '.title'" label="主标: " :rules="rules.title">
                  <el-input v-model="pformitem.title" clearable placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label-width="60px" prop="subtitle" label="副标: ">
                  <el-input v-model="pformitem.subtitle" clearable placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item required label-width="60px" :prop="'pages.' + pindex + '.order'" label="排序: " :rules="rules.order">
                  <el-input v-model="pformitem.order" clearable placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item required label-width="60px" :prop="'pages.' + pindex + '.src'" label="图标: " :rules="rules.src">
                  <el-upload
                    ref="uploadItem"
                    :key="pformitem.cid"
                    class="row-uploader"
                    :file-list="uploadConfItem.fileList"
                    :action="uploadConfItem.action"
                    :limit="uploadConfItem.limit"
                    :auto-upload="uploadConfItem.auto"
                    :accept="uploadConfItem.accept"
                    :list-type="uploadConfItem.type"
                    :show-file-list="uploadConfItem.showList"
                    :http-request="(file) => handleRequestItem(file, 'uploadItem', findex, pindex)"
                    :on-remove="(file, fileList) => handleRemove(file, fileList, 'uploadItem', findex, pindex)">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                </el-form-item>
                <div class="divider-tips">配置链接: </div>
                <el-form-item required label-width="100px" :prop="'pages.' + pindex + '.source'" label="渠道来源: " :rules="rules.source">
                  <el-select v-model="pformitem.source" placeholder="请选择" @change="(value) => sourceChangeHandle(value,pformitem)">
                    <el-option label="内链" :value="2"></el-option>
                    <el-option label="外链" :value="1"></el-option>
                    <el-option label="不添加" :value="3"></el-option>
                  </el-select>
                </el-form-item>
                <template v-if="pformitem.source!=3">
                  <el-form-item required label-width="100px" :prop="'pages.' + pindex + '.routerName'" label="路由名称: " :rules="rules.routerName">
                    <el-select v-model="pformitem.routerName" placeholder="请选择" @change="(value) => routeChangeHandle(value,pformitem)">
                      <template v-if="pformitem.source==1">
                        <el-option
                          :key="jumpLinkId"
                          :label="routeName"
                          :value="uniqueIdent"
                          :disabled="!status"
                          v-for="({routeName,jumpLinkId,uniqueIdent,status}) in routesOut"
                        ></el-option>
                      </template>
                      <template v-if="pformitem.source==2">
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
                    <el-row class="form-row" v-for="(item,index) in pformitem.list" :key="index">
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
                <img @click="removeFormItemHandle(findex, pindex)" v-if="pindex!=0" class="image" :src="Conf.closeIcon">
              </div>
            </div>
          </div>
        </template>
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
  name: "King",
  data() {
    return {
      Conf,
      uploadConfItem: {
        size: 200,
        limit: 1,
        action: '',
        auto: true,
        fileList: [],
        showList: true,
        type: 'picture-card',
        accept: '.png,.jpg,.jpeg',
        arr: ['image/png', 'image/jpeg', 'image/jpg'],
      },
      isShowLeft: true,
      formsArr: [
        {
          pages: [
            {
              src: '',
              order: 1,
              title: '',
              source: '',
              subtitle: '',
              routerName: '',
              list: [
                {
                  name: '',
                  value: '',
                  remark: '',
                },
              ],
              cid: uuid().substr(0, 8),
            },
          ],
          active: true,
          fid: uuid().substr(0, 8),
        }
      ],
      routesIn: [],
      routesOut: [],
      file:  null,
      rules: {
        title: [
          {required: true, message: '输入不能为空', trigger: ['blur', 'change']},
        ],
        src: [
          {required: true, message: '图标不能为空', trigger: 'change'},
        ],
        order: [
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
    computIndex(fdx, cdx) {
      let items = [...this.$refs.uploadItem];
      let curcid = this.formsArr[fdx].pages[cdx].cid;
      let index = items?.findIndex(el => el.$vnode.key == curcid);

      return index;
    },
    // 添加金刚区菜单功能
    addFormItemHandle() {
      let curIdx = this.formsArr.findIndex(el => el.active);

      const item = {
        src: '',
        order: 1,
        title: '',
        source: '',
        subtitle: '',
        routerName: '',
        list: [
          {
            name: '',
            value: '',
            remark: '',
          },
        ],
        cid: uuid().substr(0, 8),
      };

      const {pages} = this.formsArr[curIdx];

      if (pages.length > 10) return this.$message.error('每个轮播页最多10个菜单');

      this.formsArr[curIdx]['pages'].push(item);
    },
    // 移除操作
    removeFormItemHandle(index, curdex) {
      const len = this.formsArr[index]['pages'].length;
      if (len <= 1) {
        this.$message.error('至少保留一个菜单');
      } else {
        this.formsArr[index]['pages'].splice(curdex, 1);
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
    // 渠道来源选中变化
    sourceChangeHandle(val, item) {
      const {formsArr} = this.$options.data();
      const {pages} = formsArr[0];
      const {routerName, list} = pages[0];
      this.$set(item, 'list', list);
      this.$set(item, 'routerName', routerName);
    },
    // 路由名称选中变化
    routeChangeHandle(val, item) {
      const {formsArr} = this.$options.data();
      const {pages} = formsArr[0];
      const {list} = pages[0];
      const source = item.source;
      const routes = source == 1 ? this.routesOut : source == 2 ? this.routesIn : [];
      let {params} = routes.find(({uniqueIdent}) => uniqueIdent == val) || {};
      params = JSON.parse(JSON.stringify(params));

      if (params.length) {
        this.$set(item, 'list', params);
      } else {
        this.$set(item, 'list', list);
      }
    },
    // 点击tag切换当前金刚轮播菜单
    tagHandle(ndx) {
      this.formsArr.map((el, index) => {
        this.$set(el, 'active', false);
        if (index == ndx) this.$set(el, 'active', true);
      });
    },
    // 添加轮播页
    addCarouselHandle() {
      this.formsArr.push({
        pages: [
          {
            src: '',
            order: 1,
            title: '',
            source: '',
            subtitle: '',
            routerName: '',
            list: [
              {
                name: '',
                value: '',
                remark: '',
              },
            ],
            cid: uuid().substr(0, 8),
          },
        ],
        active: false,
        fid: uuid().substr(0, 8),
      });

      this.formsArr.map((el, index) => {
        el['active'] = false;
        if (index == this.formsArr.length - 1) {
          el['active'] = true;
        }
      });
    },
    // 移除轮播页
    removeCarouselHandle() {
      let curIdx = this.formsArr.findIndex(el => el.active);
      this.formsArr.splice(curIdx, 1);
      this.$set(this.formsArr[0], 'active', true);
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
    handleRemove(file, fileList, ref, fdx, cdx) {
      const curIdx = this.computIndex(fdx, cdx);
      this.$refs[ref][curIdx].uploadFiles.splice(0, 1);
      this.switchUploader(ref, curIdx, 'inline-block');
    },
    // 重写提交方法
    handleRequestItem ({file}, ref, fdx, cdx) {
      const curIdx = this.computIndex(fdx, cdx);
      const hasValid = this.beforeuploadItem(file);
      if (hasValid) {
        this.uploadRequset(file, ref, fdx, cdx, curIdx);
      } else {
        this.file = null;
        this.$refs[ref][curIdx].uploadFiles.splice(0, 1);
      }
    },
    // 发起图片上传请求
    async uploadRequset (file, ref, fdx, cdx, index) {
      this.switchUploader(ref, index, 'none');
      try {
        const {data: certificates} = await getCertificate('product');
        const {res: {status, statusCode, requestUrls}} = await upload(certificates, file);
        if (status == 200 && statusCode == 200) {
          const img = requestUrls[0];
          this.$set(this.formsArr[fdx]['pages'][cdx], 'src', img);
          this.$message.success('图片上传成功！');
        } else {
          this.switchUploader(ref, index, 'inline-block');
          this.$message.error('图片上传失败');
        }
      } catch (e) {
        this.switchUploader(ref, index, 'inline-block');
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
        this.formsArr.map(({pages}, index) => {
          pages.map(({src}, cdx) => {
            if (src) {
              const curIdx = this.computIndex(index, cdx);
              const uploadFiles = this.$refs.uploadItem[curIdx]?.uploadFiles;

              if (src) {
                uploadFiles.length = 0;
                uploadFiles.push({url: src, uid: Date.now()});
                this.switchUploader('uploadItem', curIdx, 'none');
              }
            }
          });
        });
      });
    },
    // 重置表单
    resetHandle() {
      const {formsArr} = this.$options.data();
      this.formsArr = formsArr; // 执行初始化

      this.$emit('update', {
        type: 'king',
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
          type: 'king',
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
.king {
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
    .content {
      width: 450px;
      .header-wrap {
        .header {
          width: 430px;
          height: 50px;
          display: flex;
          margin: 10px;
          padding-left: 10px;
          flex-direction: row;
          align-items: center;
          background-color: #F8F8F8;
          justify-content: space-between;
          border-bottom: 1px solid #eee;
          .text {
            color: #333;
            font-size: 16px;
            font-weight: 700;
            .tips-wrap {
              color: #999;
              display: inline-block;
              .tips-content {
                line-height: 16px;
                text-align: center;
                display: inline-block;
                vertical-align: middle;
                span {
                  font-size: 14px;
                  font-weight: 500;
                }
              }
              &::before, &::after {
                display: inline-block;
              }
              &::before {
                content: '(';
                margin-right: 3px;
              }
              &::after {
                content: ')';
                margin-left: 3px;
              }
            }
          }
        }
        .tag-tabs {
          margin: 10px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          .tags {
            flex: 1;
            .custom-tag {
              cursor: pointer;
              transition: all 0.3s;
              margin: 5px;
            }
          }
          .btn {
            width: 57px;
          }
        }
      }
      .tag-items-wrap {
        .tag-item {
          position: relative;
          .custom-from {
            width: 430px;
            margin: 10px;
            padding: 10px;
            border: 1px solid #ccc;
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
            bottom: 0;
            right: -50px;
            width: 52px;
            position: absolute;
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
