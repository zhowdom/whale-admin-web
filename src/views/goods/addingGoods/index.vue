<template>
  <div class="add-goods">
    <el-steps :active="active" class="custom-steps mb75">
      <el-step title="选择商品分类"></el-step>
      <el-step title="填写商品信息"></el-step>
      <el-step title="填写商品属性"></el-step>
    </el-steps>

    <div class="step-base">
      <keep-alive>
        <fill-goods-sort v-if="active==1" @updateStep="updateStep"/>
        <fill-goods-info v-if="active==2" @updateStep="updateStep"/>
        <fill-goods-attrs v-if="active==3" @updateStep="updateStep"/>
      </keep-alive>
    </div>

  </div>
</template>

<script>
  import {session} from '@/utils/storage';
  import FillGoodsSort from './fillGoodsSort';
  import FillGoodsInfo from './fillGoodsInfo';
  import FillGoodsAttrs from './fillGoodsAttrs';

  export default {
    data() {
      return {
        active: 1,
      };
    },
    components: {
      FillGoodsSort,
      FillGoodsInfo,
      FillGoodsAttrs,
    },
    mounted () {
      this.clearCache();
    },
    methods: {
      // 清空缓存
      clearCache () {
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
      // 更新step
      updateStep (arg) {
        this.active = arg;

        if (this.active == 1) {
          this.clearCache();
        };

        if (this.active == 2) {
          session.remove('part2');
          session.remove('part3');
        };
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
