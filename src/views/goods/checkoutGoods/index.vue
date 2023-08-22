<template>
  <div class="add-goods">
    <el-steps :active="active" class="custom-steps mb75">
      <el-step title="查看商品分类"></el-step>
      <el-step title="查看商品信息"></el-step>
      <el-step title="查看商品属性"></el-step>
    </el-steps>

    <div class="step-base">
      <keep-alive>
        <goods-sort v-if="active==1" @updateStep="updateStep"/>
        <goods-info v-if="active==2" @updateStep="updateStep"/>
        <goods-attrs v-if="active==3" @updateStep="updateStep"/>
      </keep-alive>
    </div>

  </div>
</template>

<script>
  import {session} from '@/utils/storage';

  export default {
    data() {
      return {
        active: 0,
      };
    },
    components: {
      GoodsSort: () => import('./sort.vue'),
      GoodsInfo: () => import('./info.vue'),
      GoodsAttrs: () => import('./attrs.vue'),
    },
    beforeMount () {
      session.remove('pname');
      session.remove('cname');
      session.remove('part1');
      session.remove('part2');
      session.remove('part3');
      session.remove('part1Info');
      session.remove('part2Info');
      session.remove('part3Info');
      session.remove('productId');
    },
    mounted () {
      const productId = this.$route.query.id;
      if (productId >= 0) {
        session.set('productId', productId);
        this.active = 1;
      } else {
        this.$alert('缺少商品id ！！', '警告', {
          customClass: 'wth360',
          confirmButtonText: '返回首页',
          cancelButtonText: '取消',
          type: 'error',
          center: true,
          showClose: false,
          showCancelButton: false,
          showConfirmButton: true,
        }).then(() => {
          this.goIndex();
        }).catch(() => {
        });
      }
    },
    methods: {
      updateStep (arg) {
        this.active = arg;
      },
      goIndex() {
        const curView = this.$route;
        this.$store.dispatch('tagsView/delView', curView).then(() => {
          this.$nextTick(() => {
            session.remove('productId');
            this.$router.replace({path: '/'});
          });
        });
      },
    },
  }
</script>

<style lang="scss" scoped>
  .add-goods {
    min-width: 1200px;
    padding: 25px 40px 0;
    .custom-steps {
      ::v-deep .el-step__title {
        font-weight: bold;
      }
      ::v-deep.el-step__head {
        margin-left: 22px;
        .el-step__line {
          top: 24px;
        }
        .el-step__icon.is-text {
          width: 48px;
          height: 48px;
          font-size: 24px;
        }
        &.is-finish {
          .el-step__icon.is-text {
            background: #1890ff;
            color: #fff;
          }
        }
      }
    }
    .step-base {
      width: 1100px;
      margin: 0 auto;
      min-height: 380px;
    }
  }
</style>
