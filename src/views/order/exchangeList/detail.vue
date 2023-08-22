<template>
  <div class="exchange-detail-wrap">
    <!-- 收货人信息 -->
    <el-card class="box-card" shadow="always">
      <template slot="header">
        <i class="el-icon-s-custom"></i>
        收货人信息
      </template>
      <el-table :data="receiverInfo" border style="width: 100%">
        <el-table-column align="center" prop="name" label="收货人"></el-table-column>
        <el-table-column align="center" prop="phone" label="手机号码"></el-table-column>
        <el-table-column align="center" prop="address" label="收货地址"></el-table-column>
      </el-table>
    </el-card>

    <!-- 购买商品信息 -->
    <el-card class="box-card" shadow="always">
      <template slot="header">
        <i class="el-icon-s-goods"></i>
        购买的商品
      </template>
      <el-table :data="goodsInfo" border style="width: 100%">
        <el-table-column align="center" :formatter="formatter" prop="img" label="商品图片" width="180"></el-table-column>
        <el-table-column align="center" :formatter="formatter" prop="title" label="商品名称" width="180"></el-table-column>
        <el-table-column align="center" :formatter="formatter" prop="itemNo" label="价格/货号" width="210"></el-table-column>
        <el-table-column align="center" prop="saleWhalePeas" label="销售价（Candy）" width="210"></el-table-column>
        <el-table-column align="center" :formatter="formatter" prop="props" label="属性" width="190"></el-table-column>
        <el-table-column align="center" :formatter="formatter" prop="num" label="数量"></el-table-column>
        <el-table-column align="center" :formatter="formatter" fixed="right" prop="subtotal" label="小计（USDT）"></el-table-column>
        <el-table-column align="center" fixed="right" prop="subtotalWhalePeas" label="小计（Candy）"></el-table-column>
      </el-table>

      <div class="summary-txt">合计：￥{{total}}，Candy：{{subtotalWhalePeas || 0}}</div>
    </el-card>

    <div class="form-btns">
      <el-button type="warning" @click="goBackList">返回</el-button>
    </div>
  </div>
</template>

<script>
import {returnExchangeDetails} from '@/api/order/refund';

export default {
  name: 'ExchangeDetail',
  data () {
    return {
      id: '',
      total: '',
      subtotalWhalePeas: '',
      goodsInfo: [],
      receiverInfo: [],
    }
  },
  mounted () {
    const {id} = this.$route.query;
    this.id = id;

    this.returnExchangeDetailsReq();
  },
  methods: {
    // 设置收货人信息
    setReciverInfo (data) {
      let {name, phone, address} = data;

      name = name || '-';
      phone = phone || '-';
      address = address || '-';

      // 设置数据、兼容处理
      this.$set(this.receiverInfo, 0, {name, phone, address});
    },
    // 设置商品信息
    setGoodsInfo (data) {
      this.$set(this.goodsInfo, 0, data);
    },
    // 获取订单详情
    async returnExchangeDetailsReq () {
      try {
        let {data} = await returnExchangeDetails({id: this.id});

        // 商品合计
        this.total = data.countTotal;
        this.subtotalWhalePeas = data.countTotalWhalePeas || 0
        // 设置收货人信息
        this.setReciverInfo(data);
        // 设置商品信息
        this.setGoodsInfo(data.orderProductResp);
      } catch (error) {
        throw error;
      }
    },
    // 格式化
    formatter (row, column) {
      let key = column.property;
      const h = this.$createElement;

      if (key == 'img') {
        let src = row[key];
        let fit = 'fit';
        let style = {
          textAlign: 'center',
          color: '#c0c4cc',
        };
        const imgCell = h('el-image', {props: {src, fit}, class: 'block table'}, [
          h('div', {slot: 'placeholder', style}, '加载中...')
        ]);

        return imgCell;
      } else if (key == 'itemNo') {
        let style = {textAlign: 'left',};
        // 设置销售价（USDT）
        let price = Number(row['price'] || 0);
        price = price ? '￥' + price.toFixed(2) : 0;
        // 设置货号
        let itemNo = row['itemNo'];
        itemNo = itemNo ? 'No' + itemNo : '-';
        // 设置销售价（Candy）
        let pricePeas = row['saleWhalePeas'];
        // 设置cell
        let cell = h('div', {style}, [
          h('p', `销售价（USDT）：${price}`),
          // h('p', `销售价（Candy）：${pricePeas}`),
          h('p', `货号：${itemNo}`),
        ]);

        return cell;
      } else if (key == 'props') {
        let cells = [];
        let props = row[key];
        let style = {textAlign: 'left',};
        // 设置cells
        props.map(({name, value}) => {
          let cell = name ? h('p', `${name}：${value || '-'}`) : null;
          cell && cells.push(cell);
        });

        return props.length ? h('div', {style}, cells) : '-';
      } else if (key == 'num') {
        return row[key] || 0;
      } else if (key == 'subtotal') {
        let value = Number(row[key] || 0);
        return value ? '￥' + value.toFixed(2) : 0;
      } else {
        return row[key] || '-';
      }
    },
    // 返回
    goBackList () {
      const curView = this.$route;

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          this.$router.replace({path: 'exchangeList'}); // 返回列表页
        });
      });
    },
  }
}
</script>

<style lang="scss" scoped>
  .exchange-detail-wrap {
    min-width: 1200px;
    padding: 25px 40px 0;
    .el-image.table {
      ::v-deep .el-image__error {
        height: 90px;
        background: unset;
      }
    }
    .box-card {
      margin: 0 auto;
      margin-top: 30px;
      ::v-deep .el-card__header {
        padding: 0 12px;
        min-height: unset;
        font-size: 16px;
        height: 50px;
        line-height: 50px;
        color: #666;
        background-color: rgba(243, 243, 243, 1);
      }
      .info-item {
        min-height: 48px;
        line-height: 48px;
        font-size: 14px;
        border-bottom: 1px solid #e4e4e4;
        &:first-child {
          border-top: 1px solid #e4e4e4;
        }
        &.top-border {
          border-top: 1px solid #e4e4e4;
        }
        &.custom-wt {
          font-size: 15px;
          font-weight: 800;
        }
        &.img-item {
          display: flex;
        }
        .item-label {
          color: #666;
          text-align: right;
          background: #f9fafc;
        }
        .text-normal {
          color: #6699ff;
        }
        .text-block {
          color: #ff6600;
        }
      }
    }
    .summary-txt {
      height: 60px;
      background: #f9fafc;
      margin-top: 20px;
      line-height: 60px;
      text-align: right;
      color: #ed5565;
      font-weight: 600;
      font-size: 16px;
      padding: 0 15px;
    }
    .form-btns {
      text-align: center;
      margin-top: 35px;
      margin-bottom: 30px;
      button {
        min-width: 98px;
        margin-right: 50px;
      }
    }
  }
</style>

