<template>
  <div class="small-banner">
    <div class="hi-left" @click="switchArrowHandle(1)">
      <i class="el-icon-d-arrow-right" v-show="isShowLeft"></i>
    </div>
    <div class="title">
      <div class="desc" v-show="isShowLeft">
        <div class="text">模块配置-小banner</div>
      </div>
    </div>
    <div class="body" v-show="isShowLeft">
      <!-- banner配置 -->
      <div class="banners">
        <div class="tag-items-wrap">
          <div class="tag-item" v-for="(formitem,findex) in formsArr" :key="findex">
            <el-form :model="formitem" ref="atomform">
              <div class="divider-tips">配置参数: </div>
              <template v-for="(item,index) in formitem.banlist">
                <el-form-item v-if="item.name=='type'" :key="index+'a'" label-width="120px" :prop="'banlist.'+index+'.value'" label="banner类型: " :rules="rules.type">
                  <el-select v-model="item.value" placeholder="请选择">
                    <el-option label="小banner" :value="1"></el-option>
                    <el-option label="大banner" :value="2"></el-option>
                    <el-option label="长banner" :value="3"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="item.name=='code'" :key="index+'b'" label-width="120px" :prop="'banlist.'+index+'.value'" label="banner位置: " :rules="rules.code">
                  <el-input v-model="item.value" clearable placeholder="请输入"></el-input>
                </el-form-item>
              </template>
            </el-form>
          </div>
        </div>
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
import Conf from '@/utils/indexConf';

export default {
  name: "SmallBanner",
  data() {
    return {
      Conf,
      isShowLeft: true,
      formsArr: [
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
      routesIn: [],
      routesOut: [],
      rules: {
        type: [
          {required: true, message: 'banner类型不能为空', trigger: 'change'},
        ],
        code: [
          {required: true, message: 'banner位置不能为空', trigger: 'blur'},
        ],
      },
    };
  },
  methods: {
    // 左上箭头切换按钮操作
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
      this.formsArr = formsArr; // 执行初始化

      this.$emit('update', {
        type: 'smallBanner',
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
          type: 'smallBanner',
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
.small-banner {
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
    .banners {
      position: relative;
      width: 430px;
      border: 1px solid #ccc;
      margin: 10px;
      padding: 10px;
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
      ::v-deep {
        .el-input {
          width: 170px;
        }
      }
      .input-width {
        width: 120px;
      }
      .form-row + .form-row {
        margin-top: 10px;
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
          width: 280px;
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
        width: 280px;
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
