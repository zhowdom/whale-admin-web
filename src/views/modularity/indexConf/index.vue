<template>
  <div class="index-conf">
    <div class="top-search">
      <el-form ref="mainForm" inline :model="mainForm" size="small" label-width="90px">
        <el-form-item label="模板名称:">
          <el-input class="align-width" v-model="mainForm.name" clearable placeholder="请输入模板名称"></el-input>
        </el-form-item>

        <el-form-item class="fr mr0">
          <el-button type="primary" @click="onSearch" v-hasPermi="['setting:home_module:page']">查询</el-button>
          <el-button type="primary" @click="addTemplHandle" v-hasPermi="['setting:home_module:save']">新增模板</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="templates">
      <div class="container">
        <div class="item" v-for="(item,index) in modelList" :key="index">
          <div class="title">
            <div class="text">{{item.templName}}</div>
            <i class="el-icon-edit-outline" v-hasPermi="['setting:home_module:reName']" @click="modifyTitleHandle(item)"></i>
          </div>
          <div class="content">
            <el-card class="templ">
              <div class="outer">
                <div class="box">
                  <div class="normal">
                    <!-- 搜索栏 -->
                    <!-- <img class="image" :src="Conf.topNavNail" > -->
                    <img class="image" :src="Conf.myNails1" >
                    <template v-for="(iitem,iindex) in item.templData">
                      <!-- 菜单栏 -->
                      <!-- <img v-if="iitem.type=='topTab'" :key="iindex" class="image" :src="Conf.topTabNail" > -->
                      <!-- 大banner -->
                      <!-- <img v-if="iitem.type=='bigBanner'" :key="iindex" class="image" :src="Conf.bigBannerNail" > -->
                      <!-- 金刚区 -->
                      <!-- <img v-if="iitem.type=='king'" :key="iindex" class="image" :src="Conf.kingNail" > -->
                      <!-- 卡片1图 -->
                      <!-- <img v-if="iitem.type=='card1p'" :key="iindex" class="image" :src="Conf.card1pNail" > -->
                      <!-- 小banner -->
                      <!-- <img v-if="iitem.type=='smallBanner'" :key="iindex" class="image" :src="Conf.smallBannerNail" > -->
                      <!-- 卡片4图 -->
                      <!-- <img v-if="iitem.type=='card4p'" :key="iindex" class="image" :src="Conf.card4pNail" > -->
                      <!-- 卡片3图 -->
                      <!-- <img v-if="iitem.type=='card3p'" :key="iindex" class="image" :src="Conf.card3pNail" > -->
                      <!-- 商品列表 -->
                      <!-- <img v-if="iitem.type=='bottomTab'" :key="iindex" class="image" :src="Conf.bottomTabNail" > -->

                      <img v-if="iitem.type=='bannerNew'" :key="iindex" class="image" :src="Conf.myNails2" >
                      <img v-if="iitem.type=='classifyType'" :key="iindex" class="image" :src="Conf.myNails3" >
                      
                    </template>
                  </div>
                  <div class="fix">
                    <!-- 底部导航 -->
                    <!-- <img class="image" :src="Conf.bottomNavNail" > -->
                    <img class="image" :src="Conf.myNails4" >
                  </div>
                </div>
              </div>
            </el-card>
            <div class="handle-bar">
              <!-- 预览 -->
              <!-- <el-button type="primary" size="mini" @click="priviewHandle(item)" v-hasPermi="['setting:home_module:detail']">预览</el-button> -->
              <!-- 复制 -->
              <el-button type="primary" size="mini" @click="moduleCopyReq(item)" v-hasPermi="['setting:home_module:copy']">复制</el-button>
              <!-- 编辑 -->
              <el-button type="primary" size="mini" @click="editTemplHandle(item)" v-hasPermi="['setting:home_module:update']">编辑</el-button>
            </div>
          </div>
          <div class="select">
            <div class="text1">应用</div>
            <div class="text2">
              <el-select style="opacity:0;" disabled @change="(value)=>selectChgHandle(value, item)" v-model="item.appPackageType" size="small" placeholder="请选择">
                <el-option
                  v-for="(appitem,appindex) in appTypes"
                  :key="appindex"
                  :label="appitem.label"
                  :value="appitem.type"
                  :disabled="appitem.type!=1"
                ></el-option>
              </el-select>
            </div>
            <div class="text3" v-hasPermi="['setting:home_module:changeStatus']">
              <el-switch :value="item.status" @change="switchHandle(item)"></el-switch>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页组件 -->
      <div class="text-center mt50">
        <el-pagination
          background
          :total="pager.total"
          :page-size="pager.size"
          :current-page="pager.curPage"
          @current-change="handleCurrentChange"
          layout="total, prev, pager, next">
        </el-pagination>
      </div>
    </div>

    <!-- 预览功能 -->
    <el-dialog
      width="456px"
      top="32vh"
      :title="templName"
      destroy-on-close
      @close="closeDiaHandle"
      @open="openDiaHandle"
      custom-class="priview-model"
      :close-on-click-modal="false"
      :visible.sync="showPriview"
    >
      <priview-com ref="priview" :templ-id="templId"/>
    </el-dialog>
  </div>
</template>

<script>
import Conf from '@/utils/indexConf';
import PriviewCom from './preview.vue';
import {
  modulePage, moduleCopy, moduleRename, moduleStatusChange
} from '@/api/modularity/index-admin';

export default {
  name: 'IndexConf',
  components: {PriviewCom},
  data() {
    return {
      Conf,
      appTypes: [
        {
          type: 1,
          label: '鲸丽生活app'
        },
        {
          type: 2,
          label: '鲸丽社区app'
        },
      ],
      mainForm: {
        name: '' , // 模板名称
      },
      pager: {
        size: 2,
        total: 0,
        curPage: 1,
      },
      templName: '',
      templId: '',
      appType: -1,
      modelList: [],
      showPriview: false,
    }
  },
  mounted() {
    this.modulePageReq();
  },
  methods: {
    // 查询分页数据
    async modulePageReq () {
      try {
        const {code, message, data: {list, total}} = await modulePage({
          ...this.mainForm,
          pageSize: this.pager.size,
          currentPage: this.pager.curPage,
        });
        if (code == 200) {
          console.log(list, 'LIST')
          this.modelList = list;
          this.pager.total = total;
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
    // 修改模板名称请求
    async moduleRenameReq() {
      try {
        const {code, message} = await moduleRename({
          templId: this.templId,
          templName: this.templName,
        });

        if (code == 200) {
          this.$message.success('修改成功');

          this.modulePageReq(); // 刷新列表
          this.templId = '';    // 初始化模板id
          this.templName = '';  // 初始化模板名称
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
    // 启用禁用模板请求
    async moduleStatusChangeReq() {
      try {
        const {code, message} = await moduleStatusChange({
          id: this.templId,
          // type: this.appType,
        });

        if (code == 200) {
          this.$message.success('设置成功');

          this.modulePageReq(); // 刷新列表
          this.templId = '';    // 初始化模板id
          this.appType = -1;;   // 初始化应用平台
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
    // 快捷复制模板请求
    async moduleCopyReq({templId}) {
      try {
        const {code, message} = await moduleCopy({
          id: templId,
        });

        if (code == 200) {
          this.$message.success('复制成功');

          this.modulePageReq(); // 刷新列表
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
    // 修改模板名称
    modifyTitleHandle(item) {
      this.templId = item.templId;
      this.templName = item.templName;

      this.$prompt('请输入新的模板名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputValue: this.templName,
        closeOnClickModal: false,
        inputErrorMessage: '输入不能为空',
        customClass: 'custom-prompt',
      }).then(({value}) => {
        this.templName = value;
        this.moduleRenameReq();
      }).catch(() => {
        this.$message.info('取消修改');
      });
    },
    // 修改下拉选项
    selectChgHandle(value, item) {
      this.$set(item, 'appPackageType', value);
    },
    // 开关按钮提示
    switchHandle({appPackageType, templId}) {
      // if (!appPackageType) return this.$message.error('请先选择平台');
      this.templId = templId;
      this.appType = appPackageType;

      this.$msgbox({
        title: '确认使用此模板?',
        message: '确定后，将更换之前的模板',
        center: true,
        showClose: false,
        closeOnClickModal: false,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonClass: 'ml30',
      }).then(() => {
        this.moduleStatusChangeReq();
      }).catch(() => {
        this.$message.info('已取消');
      });
    },
    // 跳转当前页
    handleCurrentChange(val) {
      this.pager.curPage = val;
      this.modulePageReq();
    },
    // 条件搜索
    onSearch () {
      this.pager.curPage = 1;
      this.modulePageReq();
    },
    // 新增模板
    addTemplHandle() {
      const curView = this.$route;

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          // 跳转到新增页面
          this.$router.replace({path: 'indexConfEdit'});
        });
      });
    },
    // 编辑模板
    editTemplHandle({templId, appPackageType}) {
      const curView = this.$route;

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          // 跳转到新增页面
          this.$router.replace({
            path: 'indexConfEdit',
            query: {
              id: templId,
              type: appPackageType
            }
          });
        });
      });
    },
    // 预览模板
    priviewHandle({templId, templName}) {
      this.templId = templId;
      this.templName = templName;
      this.showPriview = true;
    },
    // 打开预览弹窗的回调
    openDiaHandle() {
      this.$nextTick(() => {
        this.$refs.priview?.moduleDetailReq();
      });
    },
    // 关闭预览弹窗的回调
    closeDiaHandle() {
      this.templId = '';    // 初始化模板id
      this.templName = '';  // 初始化模板名称
    }
  }
}
</script>
<style lang="scss">
  .priview-model {
    background: #F8F8F8;
    .el-dialog__header {
      padding: 0;
      .el-dialog__title {
        text-align: center;
        padding: 5px 0;
        font-size: 16px;
        display: block;
        color: #666;
        letter-spacing: 2px;
        text-shadow: 0px 0px 2px #666;
      }
      .el-dialog__headerbtn {
        top: 10px;
        right: -35px;
        width: 26px;
        height: 26px;
        border: 2px solid #d81e07;
        border-radius: 50%;
        font-size: 14px;
        .el-dialog__close {
          color: #d81e07;
          font-weight: 600;
        }
      }
    }
    .el-dialog__body {
      padding: 3px;
    }
  }
  .custom-prompt {
    .el-message-box__header {
      text-align: center;
    }
    .el-message-box__btns {
      text-align: center;
      .el-button+.el-button {
        margin-left: 15px;
      }
    }
  }
</style>

<style lang="scss" scoped>
  .index-conf {
    padding: 20px;
    .top-search  {
      margin-bottom: 30px;
      .align-width {
        width: 250px;
      }
    }
    .templates {
      .container {
        text-align: center;
        .item {
          width: 390px;
          height: 600px;
          margin: 0 100px 30px;
          display: inline-block;
          .title {
            width: 310px;
            margin: 0 0 10px;
            text-align: center;
            .text {
              color: #666;
              display: inline-block;
            }
            i {
              cursor: pointer;
              margin-left: 10px;
              color: #707070;
            }
          }
          .content {
            margin-bottom: 10px;
            position: relative;
            .templ {
              width: 310px;
              ::v-deep .el-card__body {
                height: 520px;
                padding: 0;
              }
              .outer {
                position: relative;
                .box {
                  height: 520px;
                  overflow: auto;
                  &::-webkit-scrollbar {
                    display: none; /* Chrome Safari */
                  }
                  .normal {
                    margin-bottom: 65px;
                  }
                  .fix {
                    width: 100%;
                    position: absolute;
                    left: 0px;
                    bottom: 0px;
                    z-index: 1;
                  }
                  .image {
                    width: 100%;
                    display: block;
                  }
                }
              }
            }
            .handle-bar {
              position: absolute;
              top: 0px;
              right: 0;
              button {
                display: block;
                margin: 0;
                &+button {
                  margin-top: 15px;
                }
              }
            }
          }
          .select {
            width: 310px;
            .text1 {
              color: #666;
              margin-right: 10px;
              display: inline-block;
            }
            .text2 {
              margin-right: 10px;
              display: inline-block;
            }
            .text3 {
              display: inline-block;
            }
          }
        }
      }
    }
  }
</style>
