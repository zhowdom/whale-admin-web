<template>
  <div class="edit-parameter">
    <el-card class="parameter-card center" shadow="always">
      <el-form :model="mainForm" :rules="rules" ref="mainForm" label-width="110px" class="main-form">
        <el-form-item label="商品分类:" prop="ids">
          <el-cascader class="input-class" v-model="mainForm.ids" :options="cascaderData" clearable>
            <template slot-scope="{node, data}">
              <span>{{data.label}}</span>&nbsp;&nbsp;
              <span v-if="!node.isLeaf">(
                <span class="text-danger">{{data.children.length}}</span>
              )</span>
            </template>
          </el-cascader>
        </el-form-item>

        <el-form-item label="参数列表字段: ">
          <el-form-item
            class="input-class custom-width"
            v-for="(item, index) in mainForm.params"
            :key="item.key"
            :prop="'params.' + index + '.value'"
            :rules="{
              type: 'string', min: 1, max: 20, message: '参数字段字符长度1-20', trigger: 'blur'
            }"
          >
            <el-input v-model="item.value" clearable placeholder="请输入参数字段"></el-input>
            <el-button type="primary" v-if="index==0" @click.prevent="addParam">增加</el-button>
            <el-button type="danger" v-else @click.prevent="removeParam(index)">删除</el-button>
          </el-form-item>
          <div class="input-tips">一行代表一个可选值，在添加商品里选择可选值代表一个表格字段</div>
        </el-form-item>

        <el-form-item>
          <div class="form-btns">
            <el-button type="warning" @click="cancelSubmit">取消</el-button>
            <el-button type="default" @click="resetForm">重置</el-button>
            <el-button type="primary" @click="submitForm">保存</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { uuid } from '@/utils/index';
import {paramsSave, paramsUpdate, categoryTree} from '@/api/goods/index';

export default {
  name: 'EditParameter',
  data () {
    return {
      mainForm: {
        ids: [],
        params: [
          {
            key: uuid(),
            value: '',
          }
        ],
      },
      rules: {},
      cascaderData: [],
      id: '',
      cid: '',
      isEdit: false,
    }
  },
  async mounted () {
    await this.categoryTreeRequest();
    this.id = this.$route.query.id;
    if (this.id >= 0) {
      this.isEdit = true;
      this.cid = this.$route.query.cid;
      const arr = this.$route.query.strArr.split(',');

      arr.forEach((el, index) => {
        let item = {key: uuid(), value: el};
        this.$set(this.mainForm.params, index, item);
      });

      this.cascaderData.some(pl => {
        if (pl.value == this.cid) {
          this.$set(this.mainForm.ids, 0, pl.value);
          return true;
        };
        if (pl.children) {
          pl.children.some(cl => {
            if (cl.value == this.cid) {
              this.$set(this.mainForm.ids, 0, pl.value);
              this.$set(this.mainForm.ids, 1, cl.value);
              return true;
            };
          });
        };
      });
    };
  },
  methods: {
    // 增加参数
    addParam () {
      this.mainForm.params.push({
        key: uuid(),
        value: '',
      });
    },
    // 删除参数
    removeParam (index) {
      this.mainForm.params.splice(index, 1);
    },
    // 查询商品分类
    async categoryTreeRequest () {
      try {
        const {code, message, data} = await categoryTree();
        if (code == 200) {

          function formatData(arr) {
            arr.map(el => {
              el.value = el.categoryId;
              el.label = el.categoryName;
              if (el.child.length) {
                el.children = el.child;
                formatData(el.child);
              }
            });
          };
          formatData(data.list);

          this.cascaderData = data.list;
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
    // 添加、编辑 参数字段
    async submitData () {
      try {
        let paramsInfo = [];
        const {ids, params} = this.mainForm;
        const goodsCategoryId = ids.length ? ids[ids.length - 1] : '';
        params.map(el => {if (el.value) {paramsInfo.push(el.value)}});
        paramsInfo = [...new Set(paramsInfo)];

        if (goodsCategoryId === '') return this.$message.error('商品分类不能为空！');
        if (!paramsInfo.length) return this.$message.error('参数列表字段不能为空！');
        const reqFn = this.isEdit ? paramsUpdate : paramsSave;
        const reqData = this.isEdit ? {goodsCategoryId, paramsInfo, paramsId: this.id} : {goodsCategoryId, paramsInfo}
        const {code, message} = await reqFn(reqData);
        if (code == 200) {
          this.$message.success('提交成功');
          this.closeTagFn();
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
          this.$router.replace({path: 'parameterType'}); // 返回列表页
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
      this.$refs.mainForm.resetFields();
    },
    // 提交
    submitForm() {
      this.$refs.mainForm.validate(valid => {
        if (valid) {
          this.submitData();
        } else {
          console.log('表单验证错误');
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
  .edit-parameter {
    min-width: 1200px;
    padding: 30px 40px 0;
    .parameter-card {
      margin-top: 60px;
      .input-class {
        width: 320px;
      }
      .custom-width {
        margin-bottom: 25px;
        ::v-deep .el-form-item__content {
          .el-input {
            width: 240px;
          }
          .el-button {
            float: right;
          }
        }
      }
      .main-form {
        width: 650px;
        margin: 0 auto;
        margin-top: 60px;
        .input-tips {
          color: #9ca7b5;
          vertical-align: middle;
          line-height: 22px;
        }
        ::v-deep .el-form-item__label {
          font-weight: normal;
        }
        .form-btns {
          margin-top: 15px;
          button+button {
            margin-left: 50px;
          }
        }
      }
    }
  }
</style>
