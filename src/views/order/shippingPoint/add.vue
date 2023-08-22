<template>
  <div class="add-shipping-point-wrap">
    <el-card class="box-card" shadow="always">
      <el-form :model="mainForm" :rules="rules" ref="mainForm" label-width="150px" class="mt40 custom-form">
        <el-form-item label="发货点名称:" prop="deliverName">
          <el-input class="input-class" v-model="mainForm.deliverName" placeholder="请输入发货点名称"></el-input>
        </el-form-item>

        <el-form-item label="发货人姓名:" prop="deliverUserName">
          <el-input class="input-class" v-model="mainForm.deliverUserName" placeholder="请输入发货人姓名"></el-input>
        </el-form-item>

        <el-form-item label="所在区域:" prop="area">
          <el-cascader
            clearable
            class="input-class"
            ref="cascader"
            :props="{value:'adCode'}"
            v-model="mainForm.area"
            :options="citysData"
            placeholder="请选择所在区域"
          >
          </el-cascader>
        </el-form-item>

        <el-form-item label="详细地址:" prop="address">
          <el-input
            class="input-class"
            type="textarea"
            :rows="4"
            maxlength="300"
            show-word-limit
            v-model="mainForm.address"
            placeholder="请输入详细地址"
          ></el-input>
        </el-form-item>

        <el-form-item label="联系电话:" prop="phone">
          <el-input class="input-class" v-model="mainForm.phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>

        <el-form-item label="默认为发货点:" prop="deliverType">
          <el-switch
            :width="60"
            class="custom-switcher"
            active-text="是"
            inactive-text="否"
            :active-value="0"
            :inactive-value="1"
            v-model="mainForm.deliverType"
          >
          </el-switch>
        </el-form-item>

        <el-form-item label="默认为退货点:" prop="deliverReturn">
          <el-switch
            :width="60"
            class="custom-switcher"
            active-text="是"
            inactive-text="否"
            :active-value="0"
            :inactive-value="1"
            v-model="mainForm.deliverReturn"
          >
          </el-switch>
        </el-form-item>
      </el-form>

      <div class="form-btns">
        <el-button @click="cancelSubmit">取消</el-button>
        <el-button type="primary" @click="resetForm">重置</el-button>
        <el-button type="primary" v-hasPermi="['operation:deliverAddressManager:inserOrUpdate']" @click="submitForm">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import citys from '@/utils/provinceCity';
import {shippingPointUpdate} from '@/api/order/shippingPoint';

export default {
  name: 'AddShippingPoint',
  data () {
    return {
      mainForm: {
        deliverName: '',
        deliverUserName: '',
        address: '',
        phone: '',
        deliverType: 0,
        deliverReturn: 0,
        area: [],
      },
      rules: {
        deliverName: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { type: 'string', min: 1, max: 24, message: '输入长度1-24个字符', trigger: 'blur' },
        ],
        deliverUserName: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { type: 'string', min: 1, max: 24, message: '输入长度1-24个字符', trigger: 'blur' },
        ],
        address: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { type: 'string', min: 1, max: 300, message: '输入长度1-300个字符', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { pattern: /^1[0-9]{10}$/, message: '手机号格式有误', trigger: 'blur'}
        ],
        area: [
          { required: true, type: 'array', message: '所在区域不能为空', trigger: 'change'},
        ],
      },
    }
  },
  computed: {
    citysData() {
      citys.forEach(e => {
        if (e.children && e.children.length) {
          e.children.forEach(o => {
            if (o.children && o.children.length) {
              o.children.forEach(c => {
                if (c.children && !c.children.length) delete c.children;
              });
            } else {
              delete o.children;
            }
          });
        } else {
          delete e.children;
        };
      });
      return citys;
    }
  },
  methods: {
    // 新增发货点
    async shippingPointUpdateReq () {
      try {
        let {
          deliverName,
          deliverUserName,
          address,
          phone,
          deliverType,
          deliverReturn,
          area
        } = this.mainForm;

        let provinceCode = area[0];
        let cityCode = area[1];
        let areaCode = area[2] || null;

        const {code, message} = await shippingPointUpdate({
          deliverName,
          deliverUserName,
          address,
          phone,
          deliverType,
          deliverReturn,
          provinceCode,
          cityCode,
          areaCode,
        });

        if (code == 200) {
          this.$message.success('提交成功！');
          this.cancelSubmit();
        } else {
          this.$message.error(message);
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
          this.$router.replace({path: 'shippingPoint'}); // 返回列表页
        });
      });
    },
    // 取消功能
    cancelSubmit () {
      this.closeTagFn();
    },
    // 重置功能
    resetForm() {
      this.$refs.mainForm.resetFields();
    },
    // 提交
    submitForm() {
      this.$refs.mainForm.validate(valid => {
        if (valid) {
          this.shippingPointUpdateReq();
        } else {
          console.error('表单校验失败！');
        }
      });
    },
  },
}
</script>

<style lang="scss" scoped>
  .add-shipping-point-wrap {
    min-width: 1200px;
    padding: 25px 40px 0;
    .box-card {
      margin-top: 60px;
      .custom-form {
        width: 530px;
        margin: 30px auto 60px;
        .el-form-item {
          ::v-deep .el-form-item__label {
            font-weight: normal;
          }
          .input-class {
            width: 360px;
          }
          .input-tips {
            color: #9ca7b5;
            &.txt {
              font-size: 14px;
              line-height: 20px;
              margin-left: 150px;
              margin-bottom: 6px;
            }
          }
        }
      }
      .form-btns {
        text-align: center;
        margin-top: 35px;
        margin-left: 20px;
        button {
          margin-right: 50px;
          padding: 10px 30px;
        }
      }
    }
    .custom-switcher {
      ::v-deep .el-switch__label--left,
      ::v-deep .el-switch__label--right {
        position: absolute;
        z-index: -1;
        font-size: 14px;
      }
      ::v-deep .el-switch__label--left {
        margin-right: 10px;
        right: 0;
        color: #999;
      }
      ::v-deep .el-switch__label--right {
        margin-right: 0px;
        left: 0px;
        color: #fff;
      }
      ::v-deep .el-switch__label.is-active {
        z-index: 20;
      }
      ::v-deep .el-switch__core {
        height: 26px;
        border-radius: 24px;
      }
      ::v-deep .el-switch__core:after {
        border-radius: 24px;
        width: 26px;
        height: 26px;
        margin-left: -2px;
        box-shadow: -3px 0px 1px #888;
        top: -1px;
      }
      &.is-checked ::v-deep .el-switch__core:after {
        margin-left: -25px;
        box-shadow: 3px 0px 1px #888;
      }
    }
  }
</style>
