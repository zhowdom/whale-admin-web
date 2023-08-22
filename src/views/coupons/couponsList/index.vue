<template>
  <div class="coupons-list">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-tabs class="coupons-card-tabs" v-model="activeName" type="card">
          <el-tab-pane label="引用优惠券" name=0 v-hasPermi="['coupon:reference:page']">
            <cite-coupons v-if="activeName=='0'"/>
          </el-tab-pane>
          <el-tab-pane label="赠送优惠券" name=1 v-hasPermi="['coupon:giving:page']">
            <giving-coupons v-if="activeName=='1'"/>
          </el-tab-pane>
          <el-tab-pane label="游戏优惠券" name=2 v-hasPermi="['coupon:game:page']">
            <game-coupons v-if="activeName=='2'"/>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'CouponsList',
  components: {
    CiteCoupons: () => import('./citeCoupons/index.vue'),
    GivingCoupons: () => import('./givingCoupons/index.vue'),
    GameCoupons: () => import('./gameCoupons/index.vue')
  },
  data () {
    return {
      activeName: '0',
    }
  },
  beforeRouteEnter (to, from, next) {
    const {path, query} = from;
    const isGivingType = query?.from == 'giving'
      || path == '/promotion/addGivingCoupon'
      || path == '/promotion/addGivingCoupons';

    next(vm => {
      if (query?.from == 'game' || path == '/promotion/addGameCoupon' || path == '/promotion/addGameCoupons') {
        vm.activeName = '2'
      } else {
        vm.activeName = isGivingType ? '1' : '0';
      }
      return true;
    })
  },
  methods: {
    update () {
      this.activeName = '0';
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/element-variables.scss";

  .coupons-list {
    padding: 20px;
    position: relative;
    & .coupons-card-tabs {
      ::v-deep .el-tabs__header {
        border: none;
        & .el-tabs__item {
          border-bottom-color: #dfe4ed !important;
          &.is-active {
            background-color: $--color-primary;
            color: #fff;
          }
        }
      }
    }
  }
</style>
