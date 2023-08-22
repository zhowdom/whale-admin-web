<template>
  <div class="extraction-code">
    <el-card class="box-card" shadow="hover">
      <el-form :model="codeForm" :rules="rules" ref="codeForm" label-width="260px" class="mt50" size="large">

        <el-form-item label="提取码" prop="code">
          <el-input class="input-class" clearable placeholder="请输入提取码" v-model="codeForm.code"></el-input>
        </el-form-item>

        <el-form-item label="链接" prop="url">
          <el-input class="input-class" type="textarea" :rows="6" placeholder="请输入或粘贴链接" v-model="codeForm.url"></el-input>
        </el-form-item>

        <el-form-item>
          <div class="form-btns">
            <el-button type="default" @click="resetForm">重置</el-button>
            <el-button type="primary" v-hasPermi="['content:accessCode:save']" @click="submitForm">更新</el-button>
          </div>
        </el-form-item>

      </el-form>
    </el-card>
  </div>
</template>

<script>

import {accessCodeInfo, accessCodeSave} from '@/api/content/code';

export default {
  name: 'ExtractionCode',
  data () {
    return {
      codeForm: {
        code: '',
        url: '',
      },
      rules: {
        code: [
          { required: true, message: '提取码不能为空', trigger: 'blur' },
        ],
        url: [
          { required: true, message: '链接不能为空', trigger: 'blur' },
          { type: 'url', message: '链接格式不正确', trigger: 'blur' }
        ],
      },
    }
  },
  mounted () {
    this.accessCodeInfoRequest();
  },
  methods: {
    // 获取详情
    async accessCodeInfoRequest () {
      try {
        const {code, message, data} = await accessCodeInfo();
        if (code == 200) {
          this.codeForm = data;
        } else {
          this.$message({type: 'error', message});
        }
      } catch (error) {
        // ...
      }
    },
    // 更新请求
    async accessCodeSaveRequest () {
      try {
        const {code, message} = await accessCodeSave(this.codeForm);
        if (code == 200) {
          this.$message.success('更新成功');
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
    // 提交
    submitForm() {
      this.$refs.codeForm.validate(valid => {
        if (valid) {
          this.accessCodeSaveRequest();
        } else {
          return console.error('表单校验失败');
        };
      });
    },
    // 重置功能
    resetForm() {
      this.$refs.codeForm.resetFields();
      this.$refs.codeForm.clearValidate();
    },
  }
}
</script>

<style lang="scss" scoped>
  .extraction-code {
    min-width: 1200px;
    padding: 80px 20px 20px;
    .box-card {
      width: 980px;
      margin: 0 auto;

      .el-form-item {
        margin-bottom: 40px;

        ::v-deep .el-form-item__label {
          font-weight: normal;
        }

        .input-class {
          width: 430px;
        }

        .form-btns {
          margin-top: 15px;
          button {
            margin-right: 35px;
            padding: 10px 25px;
          }
        }
      }
    }
  }
</style>
