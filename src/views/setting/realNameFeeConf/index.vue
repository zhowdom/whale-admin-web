<template>
  <!-- 实名认证费用配置 -->
  <div class="real-name-fee-config">
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="top-guid-bar">实名认证费用设置</div>
      </el-col>
      <el-col :span="18">
        <el-form :model="mainForm" :rules="rules" ref="mainForm" label-width="180px" class="mt100 custom-form">
          <el-form-item prop="type" label="费用选择：">
            <el-radio-group class="input-long-class" v-model="mainForm.type">
              <el-radio v-for="item in feeTypes" :key="item.id" :label="item.id">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 浮动费用 -->
          <el-form-item required v-if="mainForm.type==1" key="1" label="实名认证费用浮动区间：">
            <div class="inline-block">
              <el-form-item prop="startFee">
                <el-input class="input-class" v-model="mainForm.startFee" placeholder="请输入内容">
                  <template slot="append">USDT</template>
                </el-input>
              </el-form-item>
            </div>
            <div class="line inline-block"></div>
            <div class="inline-block">
              <el-form-item prop="endFee">
                <el-input class="input-class" v-model="mainForm.endFee" placeholder="请输入内容">
                  <template slot="append">USDT</template>
                </el-input>
              </el-form-item>
            </div>
          </el-form-item>

          <!-- 固定费用 -->
          <el-form-item v-if="mainForm.type==2" key="2" prop="authFee" label="实名认证固定费用：">
            <el-input class="input-class" v-model="mainForm.authFee" placeholder="请输入内容">
              <template slot="append">USDT</template>
            </el-input>
          </el-form-item>

          <!-- 免费用 -->
          <el-form-item v-if="mainForm.type==3" key="3">
            <br>
          </el-form-item>

          <el-form-item>
            <div class="form-btns">
              <el-button type="primary" v-hasPermi="['setting:auth:saveorupdate']" @click="submitForm">保存</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {authGet, authUpdate} from '@/api/setting/fee';

export default {
  name: 'RealameFeeConfig',
  data () {
    const vm = this;
    return {
      reg: /^(1\.[6-9][0-9]?|2(\.0{1,2})?)$/, // 输入数字范围为1.6-2.0最多2位小数
      mainForm: {
        type: 1,          // 类型 1:启用浮动区间 2:固定费用 3:免费
        startFee: 1.6,    // 区间费用 - start
        endFee: 2.0,      // 区间费用 - end
        authFee: 0        // 其他认证费用
      },
      id: '',
      feeTypes: [
        {
          id: 1,
          label: '启用浮动区间',
        },
        {
          id: 2,
          label: '启用固定区间',
        },
        {
          id: 3,
          label: '启用免费',
        },
      ],
      rules: {
        type: [
          { required: true, message: '选择不能为空', trigger: 'change' },
        ],
        startFee: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { pattern: /^0(\.[1-9]\d?|\.\d[1-9])?$|^[1-9]\d*(\.\d{1,2})?$/, message: '输入为非负整数或1-2位小数', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              if (value > vm.mainForm.endFee) {
                return callback('左区间值不能大于右区间值');
              };
              callback();
            },
            trigger: 'blur',
          }
        ],
        endFee: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { pattern: /^0(\.[1-9]\d?|\.\d[1-9])?$|^[1-9]\d*(\.\d{1,2})?$/, message: '输入为非负整数或1-2位小数', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              if (value < vm.mainForm.startFee) {
                return callback('右区间值不能小于左区间值');
              };
              callback();
            },
            trigger: 'blur',
          }
        ],
        authFee: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { pattern: /^0(\.[1-9]\d?|\.\d[1-9])?$|^[1-9]\d*(\.\d{1,2})?$/, message: '输入为非负整数或1-2位小数', trigger: 'blur' }
        ],
      },
    }
  },
  mounted () {
    this.authGetReq();
  },
  methods: {
    // 查询实名认证费用
    async authGetReq () {
      try {
        const {data: {authFee, type, startFee, endFee, id}} = await authGet();
        this.mainForm.type = type;
        this.mainForm.authFee = authFee;
        this.mainForm.startFee = startFee;
        this.mainForm.endFee = endFee;
        this.id = id;
      } catch (error) {
        throw error;
      }
    },
    // 修改实名认证费用
    async authUpdateReq (cb) {
      try {
        let reqData = {};
        let id = this.id;
        let {authFee, type, startFee, endFee} = this.mainForm;
        if (type == 1) reqData = {id, startFee, endFee, type};
        if (type == 2) reqData = {id, authFee, type};
        if (type == 3) reqData = {id, type};
        await authUpdate(reqData);

        setTimeout(() => {
          cb.close();
          this.$message.success('更新成功');
          this.authGetReq(); // 更新id
        }, 1000);
      } catch (error) {
        cb.close();
        throw error;
      }
    },
    // 加载loading
    loadLoading () {
      const loadinger = this.$loading({
        lock: true,
        text: '更新中...',
        fullscreen: true,
        spinner: 'el-icon-sunny',
        customClass: 'custom-loading',
      });

      return loadinger;
    },
    // 提交请求
    submitForm () {
      this.$refs.mainForm.validate(valid => {
        if (valid) {
          const cb = this.loadLoading();
          this.authUpdateReq(cb);
        } else {
          return false;
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
  .real-name-fee-config {
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
    .custom-form {
      .input-long-class {
        width: 360px;
      }
      .input-class {
        width: 200px;
      }
      .line {
        width: 50px;
        vertical-align: middle;
        &::after {
          content: '';
          width: 70%;
          height: 1px;
          display: block;
          margin: 0 auto;
          border-top: 1px solid #666;
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
      ::v-deep {
        .el-form-item__label {
          font-weight: 400;
        }
        .el-input-group__append {
          padding: 0 12px;
        }
      }
    }
    .form-btns {
      margin-top: 15px;
    }
  }
</style>
