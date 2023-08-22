<template>
  <div class="top-tab">
    <div class="hi-left" @click="switchArrowHandle(1)">
      <i class="el-icon-d-arrow-right" v-show="isShowLeft"></i>
    </div>
    <div class="title">
      <div class="desc" v-show="isShowLeft">
        <div class="text">模块配置-顶部tab分页</div>
        <div class="btn" @click="addFormItemHandle"><el-button size="mini" type="primary">增加</el-button></div>
      </div>
    </div>
    <div class="body" v-show="isShowLeft">
      <template v-for="(formitem,findex) in formsArr">
        <div class="item" :key="formitem.fid">
          <el-form :model="formitem" ref="atomform" :key="formitem.fid" class="custom-from" :rules="rules">
            <el-form-item prop="text" label="标签: ">
              <el-input v-model="formitem.text" clearable placeholder="请输入"></el-input>
            </el-form-item>
            <div class="divider-tips">配置参数: </div>
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
          </el-form>
          <div class="tools">
            <img @click="upFormItemHandle(formitem, findex)"  v-if="findex!=0" class="image" :src="Conf.arrowupIcon">
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

export default {
  name: "TopTab",
  data() {
    return {
      Conf,
      isShowLeft: true,
      formsArr: [
        {
          text: '',
          list: [
            {
              name: 'categoryId',
              value: '',
              remark: '分类id',
            },
          ],
          fid: uuid().substr(0, 8),
        },
      ],
      routesIn: [],
      routesOut: [],
      rules: {
        text: [
          {required: true, message: '标签名称不能为空', trigger: 'blur'},
        ],
      },
    };
  },
  methods: {
    // 添加菜单
    addFormItemHandle() {
      const item = {
        text: '',
        fid: uuid().substr(0, 8),
        list: [
          {
            name: 'categoryId',
            value: '',
            remark: '分类id',
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
    },
    // 重置表单
    resetHandle() {
      const {formsArr} = this.$options.data();
      this.formsArr = formsArr;

      this.$emit('update', {
        type: 'topTab',
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
          type: 'topTab',
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
.top-tab {
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
