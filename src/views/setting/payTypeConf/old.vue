<template>
  <!-- 支付方式配置 -->
  <div class="pay-type-config">
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="top-guid-bar">支付方式配置</div>
      </el-col>
      <el-col :span="18">
        <el-form :model="mainForm" ref="mainForm" class="mt100 custom-form">
          <!-- 支付方式 -->
          <el-form-item class="mb0" v-for="(item, index) in mainForm.list" :key="item.type">
            <el-form-item class="mb20" label-width="180px" :prop="'list.'+index+'.pays'" :label="item.type|transLabel" :rules="rules.pays">
              <el-checkbox-group v-model="item.pays">
                <el-checkbox v-for="subitem in payTypes" :key="subitem.id" :label="subitem.id">{{subitem.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item class="mb20" label-width="180px" :prop="'list.'+index+'.recommend'" :label="item.type|transLabelRe" :rules="rules.recommend">
              <el-select class="input-long-class" v-model="item.recommend" clearable @clear="item.recommend=null" placeholder="请选择推荐支付方式">
                <el-option v-for="{id, name} in payTypes" :key="id" :label="name" :value="id"></el-option>
              </el-select>
            </el-form-item>
          </el-form-item>

          <el-form-item label-width="180px">
            <div class="form-btns">
              <el-button type="primary" v-hasPermi="['setting:pay:saveorupdate']" @click="submitForm">保存</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {payList, payUpdate} from '@/api/setting/fee';

export default {
  name: 'PayTypeConfig',
  data () {
    return {
      payTypes: [
        {
          id: 1,
          name: '支付宝',
          label: '启用支付宝支付',
        },
        {
          id: 2,
          name: '微信',
          label: '启用微信支付',
        },
        {
          id: 3,
          name: '余额',
          label: '启用余额支付',
        },
      ],
      mainForm: {
        list: [
          {
            id: '',
            type: 1,
            pays: [],
            recommend: null,
            // label: '实名认证支付',
          },
          {
            id: '',
            type: 2,
            pays: [],
            recommend: null,
            // label: '购买VIP支付',
          },
          {
            id: '',
            type: 3,
            pays: [],
            recommend: null,
            // label: '购物支付',
          },
          {
            id: '',
            type: 4,
            pays: [],
            recommend: null,
            // label: '盲盒购物支付',
          },
        ]
      },
      rules: {
        pays: [
          { required: true, type: 'array', message: '选择不能为空', trigger: 'change'},
        ],
        recommend: [
          { required: true, message: '选择不能为空', trigger: 'change'},
        ]
      },
    }
  },
  filters: {
    transLabel (type) {
      console.log(type, 's2s')
      let label = type == 1 ? '实名认证支付：'
        : type == 2 ? '购买VIP支付：'
        : type == 3 ? '购物支付：'
        : type == 4 ? '盲盒购物支付：'
        : '';

      return label;
    },
    transLabelRe (type) {
      console.log(type, 'ss')
      let label = type == 1 ? '实名认证推荐支付方式：'
        : type == 2 ? '购买VIP推荐支付方式：'
        : type == 3 ? '购物推荐支付方式：'
        : type == 4 ? '盲盒购物推荐支付方式：'
        : '';

      return label;
    },
  },
  mounted () {
    this.payListReq();
  },
  methods: {
    // 获取支付列表
    async payListReq () {
      try {
        let {data: {list}} = await payList({platformType: 1});

        list = list || [];

        list.map(({id, type, pays, recommend}) => {
          this.mainForm.list.map(el => {
            if (el.type == type) {
              this.$set(el, 'id', id);
              this.$set(el, 'pays', pays);
              this.$set(el, 'recommend', recommend);
            }
          })
        });
      } catch (error) {
        throw error;
      }
    },
    // 修改支付方式
    async payUpdateReq (cb) {
      try {
        let _arr = (this.mainForm.list || []).map(val => {
          val.platformType = 1
          return val
        })
        await payUpdate(_arr);
        setTimeout(() => {
          cb.close();
          this.$message.success('更新成功');
          this.payListReq();  // 更新id
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
          this.payUpdateReq(cb);
        } else {
          const h = this.$createElement;
          const style = {fontSize: '15px', padding: '20px 10px'};
          const message = h('p', {style}, [
            h('span', null, '每种支付配置'),
            h('span', {style: 'color:red;font-weight:500'}, `“必须启用”`),
            h('span', {style: 'color:red;'}, '至少一个支付方式')
          ]);

          this.$msgbox({
            title: '温馨提示',
            message,
            center: true,
            showClose: false,
            closeOnClickModal: false,
            showCancelButton: false,
            confirmButtonText: '确定',
            callback: () => {}
          });

          return false;
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
  .pay-type-config {
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
