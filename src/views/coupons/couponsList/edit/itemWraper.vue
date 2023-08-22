<template>
  <div class="promotion-content">
    <el-divider></el-divider>
    <div class="goods-drawer">
      <div :class="`drawer-wraper ${this.hasBlur?'':'no-blur'}`">
        <!-- 指定商品 -->
        <template v-if="drawerType==1">
          <goods ref="goods" :max-count="maxCount" :item-ids="pids"/>
        </template>

        <!-- 指定分类 -->
        <template v-if="drawerType==2">
          <categories ref="categories" :max-count="maxCount" :item-ids="pids"/>
        </template>

        <!-- 指定供应商 -->
        <template v-if="drawerType==3">
          <suppliers ref="suppliers" :max-count="maxCount" :item-ids="pids"/>
        </template>

        <!-- 指定自营店 -->
        <template v-if="drawerType==4">
          <shops ref="shops" :max-count="maxCount" :item-ids="pids"/>
        </template>
      </div>
    </div>
    <el-divider></el-divider>
  </div>
</template>

<script>

export default {
  // 可使用优惠券的商品
  name: 'PromotionContent',
  props: ['ptype', 'pids'],
  data () {
    return {
      hasBlur: true,
      maxCount: 100,
    }
  },
  components: {
    Goods: () => import('./items/goods.vue'),
    Shops: () => import('./items/shops.vue'),
    Suppliers: () => import('./items/suppliers.vue'),
    Categories: () => import('./items/categories.vue'),
  },
  computed: {
    drawerType () { return this.ptype },
  },
  mounted () {
    setTimeout(() => {this.hasBlur = false}, 10);
  },
  methods: {
    // 关闭drawer
    handleCheckIds () {
      let target, name, comsIds;

      switch (this.drawerType) {
        case 1: target = 'goods', name = '商品'; break;
        case 2: target = 'categories', name = '商品分类'; break;
        case 3: target = 'suppliers', name = '供应商'; break;
        case 4: target = 'shops', name = '自营店'; break;
        case 5: target = 'goods', name = '商品'; break;
        default: throw '未知类型';
      };
      comsIds = this.$refs[target].getComsIds();
      if (!comsIds.length) {
        this.$message.error(`添加指定的${name}不能为空`);
        return false;
      };
      if (comsIds?.length > this.maxCount) {
        this.$message.error(`添加指定的${name}不能超过最大阈值${this.maxCount}`);
        return false;
      };
      return comsIds;
    },
  }
}
</script>

<style>
  .goods-drawer {
    width: 1050px !important;
  }
</style>

<style lang="scss" scoped>
  .promotion-content {
    margin: 50px auto;
    .drawer-wraper {
      padding: 15px;
      transition: all 1.2s ease-in-out;
      filter: blur(5px);
    }
    .no-blur {
      filter: blur(0px);
    }
  }
</style>
