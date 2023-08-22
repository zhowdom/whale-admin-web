<template>
  <div class="order-tracking-wrap" v-loading="loading">
    <template v-if="detail.length">
      <div class="mms-result">
        <div class="txt mb10">{{stateDesc}}</div>
        <div class="mms-no mb10">
          {{companyName}}
          <span class="mr5" v-if="nu">：{{nu}}</span>
          <i v-if="nu" class="el-icon-copy-document pointer green-txt-btn" id="copy-code" :data-clipboard-text="nu" @click="oneKeyCopy"></i>
        </div>
        <div class="mms-tel mb20">
          官方电话：
          <span class="text-success">-</span>
        </div>
      </div>
      <el-divider></el-divider>
      <div class="order-steps">
        <el-steps direction="vertical" :active="activeSteps" :space="100" process-status="finish">
          <el-step v-for="({ftime, context}) in detail" :key="ftime" :title="context" :description="ftime"></el-step>
        </el-steps>
      </div>
    </template>

    <template v-else>
      <div class="no-mms">
        <el-empty description="未查到物流信息"></el-empty>
      </div>
    </template>
    <div class="form-btns">
      <el-button type="warning" @click="goBackList">返回</el-button>
    </div>
  </div>
</template>

<script>
import Clipboard from 'clipboard';
import {orderExpress} from '@/api/order/list';

export default {
  name: 'OrderTracking',
  data () {
    return {
      activeSteps: 0,
      detail: [],
      companyName: '',
      nu: '',
      stateDesc: '',
      id: '',
      loading: true,
    }
  },
  mounted () {
    this.id = this.$route.query.id;
    this.orderExpressReq();
  },
  methods: {
    // 获取快递信息
    async orderExpressReq () {
      try {
        const {data, code, message} = await orderExpress({
          id: this.id,
        });

        if (code == 200) {
          const {detail, companyName, nu, stateDesc} = data;
          this.nu = nu || '-';
          this.detail = detail || [];
          this.companyName = companyName || '-';
          this.stateDesc = stateDesc || '-';
        } else {
          this.$message.warning(message);
        };

        setTimeout(() => {
          this.loading = false;
        }, 1000);
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    // 一键复制
    oneKeyCopy () {
      const clipboard = new Clipboard('#copy-code');

      clipboard.on('success', e => {
        this.$message.success('复制成功');
        clipboard.destroy(); // 释放内存
      });

      clipboard.on('error', e => {
        this.$message.warning('手机权限不支持复制功能');
        clipboard.destroy(); // 释放内存
      })
    },
    // 返回
    goBackList () {
      const curView = this.$route;

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          // this.$router.replace({path: 'orderList'}); // 返回列表页
          this.$router.replace({path: 'orderList', query: { originFlag: 'returnButon' }}); // 返回列表页
        });
      });
    },
  }
}
</script>

<style lang="scss" scoped>
  .order-tracking-wrap {
    padding: 20px;
    .mms-result {
      width: 800px;
      margin: 30px auto 0;
      font-size: 14px;
      .txt {
        color: #FF9900;
        font-size: 16px;
        font-weight: 500;
      }
      .mms-no,
      .mms-tel {
        color: #999;
      }
    }
    .order-steps {
      width: 800px;
      min-height: 300px;
      margin: 30px auto 0;
      text-align: center;
      ::v-deep {
        .el-steps {
          .el-step__line {
            bottom: -2px;
            background: #d9d9d9;
          }
          .is-finish {
            .el-step__icon {
              width: 20px;
              height: 20px;
              background: #8ddece;
              color: #8ddece;
              border-color: #8ddece;
              margin: 0 2px;
              .el-step__icon-inner {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: #30bc9c;
                color: transparent;
              }
            }
          }
          .is-wait {
            .el-step__icon {
              width: 16px;
              height: 16px;
              background: #d9d9d9;
              color: #d9d9d9;
              border-color: #d9d9d9;
              .el-step__icon-inner {
                color: #d9d9d9;
                display: none;
              }
            }
          }
          .el-step__main {
            .el-step__title.is-wait {
              color: #999;
              font-size: 13px;
            }
            .el-step__description.is-wait {
              color: #ccc;
            }
            .el-step__title.is-finish {
              color: #FF9900;
              font-size: 13px;
            }
            .el-step__description.is-finish {
              color: #ccc;
            }
          }
        }
      }
    }
    .no-mms {
      width: 800px;
      margin: 30px auto 0;
      color: #999;
      text-align: center;
      font-size: 14px;
      ::v-deep .el-empty__image {
        width: 220px;
      }
    }
    .form-btns {
      text-align: center;
      margin-top: 35px;
      margin-bottom: 30px;
      button {
        min-width: 98px;
      }
    }
  }
</style>
