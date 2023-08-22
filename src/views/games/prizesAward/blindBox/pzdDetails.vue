<template>
  <div class="prize-distribution-details">
    <!-- <h3 class="state">{{deliverType==1?'已发货':'未发货'}}</h3> -->

    <h3>奖品信息</h3>
    <p class="item">当前期编号：{{info.currentPeriodNo||'-'}}</p>
    <p class="item">盲盒系列：{{info.blindBoxSerie||'-'}}</p>
    <p class="item">盲盒描述：{{info.blindBoxDesc||'-'}}</p>
    <p class="item">期数：第{{info.periodNum||'-'}}期</p>
    <p class="item">昵称：{{info.memberName||'-'}}</p>
    <p class="item">手机号：{{info.phone||'-'}}</p>

    <h3>收货地址</h3>
    <template v-if="deliverType!=3">
      <p class="item">收货人姓名：{{detailData.deliveryMemberName||'-'}}</p>
      <p class="item">手机号：{{detailData.deliveryPhone||'-'}}</p>
      <p class="item">收货地址：{{detailData.address||'-'}}</p>
    </template>
    <template v-else>
      <p class="item">暂无数据</p>
    </template>

    <h3>快递单号</h3>
    <template v-if="deliverType==1">
      <p class="item">快递公司：{{detailData.logisticsName||'-'}}</p>
      <p class="item">快递单号：{{detailData.logisticsNum||'-'}}</p>
    </template>
    <template v-else>
      <p class="item">暂无数据</p>
    </template>
  </div>
</template>

<script>
  import {detail} from "@/api/games/bbPrizesAward.js";

  export default {
    name: 'PrizeDistributionDetails',
    props: ['id', 'info'],
    data() {
      return {
        detailData: {},
        deliverType: '', // 1 已发货 2 未发货已添加地址 3 未发货未添加地址
      }
    },
    mounted() {
      this.detailReq();
    },
    methods: {
      // 详情
      async detailReq() {
        try {
          const {code, data, message} = await detail({
            id: this.id
          });

          if (code == 200) {
            this.detailData = data;
            this.deliverType = data?.deliverType;
          } else {
            this.$message.error(message);
          }
        } catch (error) {
          throw error;
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .prize-distribution-details {
    .state {
      padding: 6px;
      border-radius: 5px;
      background:rgba(242,239,239,1);
    }
    .item {
      margin-left: 30px;
    }
  }
</style>
