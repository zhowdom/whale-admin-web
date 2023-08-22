<template>
  <div class="refund-audit-detail-wrap">
    <el-card class="box-card" shadow="always" :header="type==2?'换货商品':'退货商品'">
      <el-table :data="refundOrExchangeGoods" border style="width: 100%">
        <el-table-column align="center" :formatter="formatter" prop="img" label="商品图片" width="180"></el-table-column>
        <el-table-column align="center" :formatter="formatter" prop="title" label="商品名称" width="180"></el-table-column>
        <el-table-column align="center" :formatter="formatter" prop="brandName" label="品牌" width="210"></el-table-column>
        <el-table-column align="center" :formatter="formatter" prop="itemNo" label="价格/货号" width="210"></el-table-column>
        <el-table-column align="center" prop="saleWhalePeas" label="销售价（Candy）" width="210"></el-table-column>
        <el-table-column align="center" :formatter="formatter" prop="props" label="属性" width="190"></el-table-column>
        <el-table-column align="center" :formatter="formatter" prop="num" label="数量"></el-table-column>
        <el-table-column align="center" :formatter="formatter" fixed="right" prop="subtotal" label="小计（USDT）"></el-table-column>
         <el-table-column align="center" fixed="right" prop="subtotalWhalePeas" label="小计（Candy）"></el-table-column>
      </el-table>

      <div class="summary-txt">合计：￥{{total}}，Candy：{{countTotalWhalePeas || 0}}</div>
    </el-card>

    <el-card class="box-card" shadow="always" header="服务单信息">
      <el-row class="info-item" :gutter="20">
        <el-col class="item-label" :span="3">服务单号:</el-col>
        <el-col :span="15">{{info.returnRefundReturnItemNo||'-'}}</el-col>
      </el-row>
      <el-row class="info-item" :gutter="20">
        <el-col class="item-label" :span="3">申请状态:</el-col>
        <el-col :span="15">
          {{transStatus(info.status)}}
          <el-button class="ml10 green2-txt-btn" type="text" v-if="info.status==2">待买家填写物流信息</el-button>
          <el-button class="ml10 green2-txt-btn" type="text" v-if="info.status==3||info.status==6">用户已填写</el-button>
        </el-col>
      </el-row>
      <el-row class="info-item" :gutter="20">
        <el-col class="item-label" :span="3">订单编号:</el-col>
        <el-col :span="15">
          {{info.orderNo||'-'}}
          <el-button class="ml10 green2-txt-btn" type="text" v-if="info.orderNo" @click="checkDetail">查看</el-button>
        </el-col>
      </el-row>
      <el-row class="info-item" :gutter="20">
        <el-col class="item-label" :span="3">申请时间:</el-col>
        <el-col :span="15">{{formatDate(info.createTime)}}</el-col>
      </el-row>
      <el-row class="info-item" :gutter="20">
        <el-col class="item-label" :span="3">用户账户:</el-col>
        <el-col :span="15">{{info.memberAccount||'-'}}</el-col>
      </el-row>
      <el-row class="info-item" :gutter="20">
        <el-col class="item-label" :span="3">联系人:</el-col>
        <el-col :span="15">{{info.memberNickName||'-'}}</el-col>
      </el-row>
      <el-row class="info-item" :gutter="20">
        <el-col class="item-label" :span="3">联系电话:</el-col>
        <el-col :span="15">{{info.phone||'-'}}</el-col>
      </el-row>
      <el-row class="info-item" :gutter="20">
        <el-col class="item-label" :span="3">{{type==3?'退货退款原因':'换货原因'}}:</el-col>
        <el-col :span="15">{{info.reason||'-'}}</el-col>
      </el-row>
      <el-row class="info-item" :gutter="20">
        <el-col class="item-label" :span="3">问题描述:</el-col>
        <el-col :span="15">{{info.describe||'-'}}</el-col>
      </el-row>
      <el-row class="info-item img-item" :gutter="20">
        <el-col class="item-label" :span="3">凭证照片:</el-col>
        <el-col :span="15">
          <el-image
            v-for="(src, index) in imgs"
            :key="index"
            style="width: 180px; display: block; padding: 8px 0"
            :src="src"
            :preview-src-list="imgs">
          </el-image>
        </el-col>
      </el-row>

      <br>

      <template v-if="status!=5">
        <el-row class="info-item top-border" :gutter="20">
          <el-col class="item-label" :span="3">订单（金额）:</el-col>
          <el-col :span="15">{{info.orderAmount?'￥'+info.orderAmount:'-'}}</el-col>
        </el-row>
        <el-row class="info-item" :gutter="20">
          <el-col class="item-label" :span="3">订单支付（Candy）:</el-col>
          <el-col :span="15">{{info.itemPayWhalePeas}}</el-col>
        </el-row>
        
        
        <!-- 若是换货，不显示此信息 -->
        <template v-if="type==3">
          <el-row class="info-item" :gutter="20">
            <el-col class="item-label" :span="3">申请退款金额:</el-col>
            <el-col :span="15">{{info.refundAmount?'￥'+info.refundAmount:'-'}}</el-col>
          </el-row>
          
          <el-row class="info-item" :gutter="20">
            <el-col class="item-label" :span="3">确认退还（Candy）:</el-col>
            <el-col :span="15">{{info.itemPayWhalePeas}}</el-col>
          </el-row>
        </template>
        <el-row class="info-item" :gutter="20">
          <el-col class="item-label" :span="3">收货人姓名:</el-col>
          <el-col :span="15">{{deliverInfo.deliverUserName||'-'}}</el-col>
        </el-row>
        <el-row class="info-item" :gutter="20">
          <el-col class="item-label" :span="3">收货地址:</el-col>
          <el-col :span="15">{{transAddress}}</el-col>
        </el-row>
        <el-row class="info-item" :gutter="20">
          <el-col class="item-label" :span="3">联系电话:</el-col>
          <el-col :span="15">{{deliverInfo.phone||'-'}}</el-col>
        </el-row>
        <br>
      </template>

      <template v-if="status==3||status==6">
        <el-row class="info-item custom-wt top-border" :gutter="20">
          <el-col class="item-label" :span="3">用户返回物流:</el-col>
          <el-col :span="15">{{info.logisticsName||'-'}}</el-col>
        </el-row>
        <el-row class="info-item custom-wt" :gutter="20">
          <el-col class="item-label" :span="3">用户返回单号:</el-col>
          <el-col :span="15">{{info.logisticsNum||'-'}}</el-col>
        </el-row>
        <br>
      </template>

      <el-row class="info-item top-border" :gutter="20">
        <el-col class="item-label" :span="3">处理人员:</el-col>
        <el-col :span="15">{{info.operMemberName||'-'}}</el-col>
      </el-row>
      <el-row class="info-item" :gutter="20">
        <el-col class="item-label" :span="3">处理时间:</el-col>
        <el-col :span="15">{{formatDate(info.operTime)}}</el-col>
      </el-row>
      <el-row class="info-item img-item" v-if="status!=3" :gutter="20">
        <el-col class="item-label" :span="3">处理备注:</el-col>
        <el-col :span="15">{{info.remark||'-'}}</el-col>
      </el-row>

      <br>

      <template v-if="status==4">
        <el-row class="info-item top-border" :gutter="20">
          <el-col class="item-label" :span="3">收货人员:</el-col>
          <el-col :span="15">{{info.confirmMemberName||'-'}}</el-col>
        </el-row>
        <el-row class="info-item" :gutter="20">
          <el-col class="item-label" :span="3">收货时间:</el-col>
          <el-col :span="15">{{formatDate(info.confirmTime)}}</el-col>
        </el-row>
        <el-row class="info-item img-item" :gutter="20">
          <el-col class="item-label" :span="3">收货备注:</el-col>
          <el-col :span="15">{{info.confirmRemark||'-'}}</el-col>
        </el-row>
      </template>
    </el-card>

    <el-card v-if="status==3||status==6" class="box-card" shadow="always" header="收货备注">
      <el-form class="custom-form" :model="confirmReceipt" :rules="rules" ref="confirmReceipt" label-width="120px">
        <el-form-item prop="remark" label="处理备注:">
          <el-input
            type="textarea"
            :maxlength="50"
            show-word-limit
            :autosize="{minRows:5}"
            placeholder="请输入备注"
            v-model="confirmReceipt.remark"
          />
        </el-form-item>
      </el-form>
    </el-card>

    <div class="form-btns">
      <el-button type="warning" @click="goBackList">返回</el-button>
      <el-button type="primary" v-if="status==3||status==6" v-hasPermi="['operation:returnRefundReturnItem:confirm']" @click="confirmReceiptHandle">确认收货</el-button>
    </div>
  </div>
</template>

<script>
import citys from '@/utils/provinceCity';
import {details, confirm} from '@/api/order/refund';

export default {
  name: 'RefundAuditDetail',
  data () {
    return {
      info: {},
      confirmReceipt: {
        remark: '',
      },
      rules: {
        remark: [
          { required: false, message: '输入不能为空', trigger: 'blur' },
          { type: 'string', min: 1, max: 50, message: '输入长度1-50个字符', trigger: 'blur' },
        ],
      },
      refundOrExchangeGoods: [],
      status: '',
      type: '', // 申请类型 3 退货退款 2 换货
      id: '',
      total: '',
      countTotalWhalePeas: '',
      imgs: [],
      deliverInfo: {}, // 收货人信息
    }
  },
  computed: {
    transStatus () {
      return value => {
        return value == 1 ?'待处理'
          : value == 2 ? '审核通过'
          : value == 3 ? '退货退款中'
          : value == 4 ? '已完成'
          : value == 5 ? '已拒绝'
          : value == 6 ? '换货中'
          : '-';
      }
    },
    transAddress () {
      let labels = [];
      let {provinceCode, cityCode, areaCode, address} = this.deliverInfo;

      citys.forEach(e => {
        if (provinceCode == e.adCode) labels.push(e.label);
        if (e.children && e.children.length) {
          e.children.forEach(o => {
            if (cityCode == o.adCode) labels.push(o.label);
            if (o.children && o.children.length) {
              o.children.forEach(c => {
                if (areaCode == c.adCode) labels.push(c.label);
              });
            };
          });
        };
      });

      labels = [...new Set(labels)]; // 去重
      return labels.length ? labels.join(' ') + address : address;
    }
  },
  mounted () {
    this.id = this.$route.query.id;
    this.detailsReq();
  },
  methods: {
    // 格式日期功能
    formatDate (date, format = 'YYYY-MM-DD HH:mm:ss', def = '-') {
      return date ? this.$dayjs(date).format(format) : def;
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
        // 设置价格
        let price = Number(row['price'] || 0);
        price = price ? '￥' + price.toFixed(2) : 0;
        // 设置货号
        let itemNo = row['itemNo'];
        itemNo = itemNo ? 'No' + itemNo : '-';
        // 设置cell
        let cell = h('div', {style}, [
          h('p', `价格：${price}`),
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
      } else if (key == 'num' || key == 'stock') {
        return row[key] || 0;
      } else if (key == 'marketPrice' || key == 'price' || key == 'salaPrice' || key == 'supplyPrice' || key == 'subtotal') {
        let value = Number(row[key] || 0);
        return value ? '￥' + value.toFixed(2) : 0;
      } else {
        return row[key] || '-';
      }
    },
    // 查看
    checkDetail() {
      let path = 'orderDetail';
      let curView = this.$route;
      let {orderId} = this.info;
      let from = 'refundAuditDetail';
      let query = {id: orderId, fromId: this.id, from};

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          this.$router.replace({path, query});
        });
      });
    },
    // 获取退货、换货商品
    getRefundOrExchangeGoods ({orderProductResp}) {
      this.$set(this.refundOrExchangeGoods, 0, orderProductResp);
    },
    // 查询详情
    async detailsReq () {
      try {
        const {data} = await details({id: this.id});
        this.info = data;
        // 申请类型 3 退货退款 2 换货
        this.type = data.type;
        // 1待审核 2审核通过-待买家填写物流信息 3退货退款中 4已完成 5以拒绝 6换货中-用户已填写
        this.status = data.status;
        // 换货、退货商品
        this.getRefundOrExchangeGoods(data);
        // 合计字段
        this.total = data.countTotal;
        this.countTotalWhalePeas = data.countTotalWhalePeas;
        // 凭证图片
        this.imgs = data.imgs || [];
        // 收货人信息
        this.deliverInfo = data.deliverAddressListPageResp;
      } catch (error) {
        throw error;
      }
    },
    // 确认收货
    async confirmReq (cb, done) {
      try {
        const {remark} = this.confirmReceipt;
        await confirm({
          remark,
          id: this.id,
        });
        // loading 回调
        setTimeout(() => {
          cb.close();
          done();
        }, 900);
      } catch (error) {
        cb.close();
        throw error;
      }
    },
    // 加载loading
    loadLoading (target) {
      const loadinger = this.$loading({
        target,
        lock: true,
        text: '更新中...',
        spinner: 'el-icon-sunny',
        customClass: 'loadingAnim',
      });

      return loadinger;
    },
    // 确认收货弹框
    confirmTips () {
      const vm = this;
      const h = this.$createElement;
      const style = {fontSize: '14px', padding: '10px 10px 15px'};
      // 申请类型 3 退货退款 2 换货
      const message = this.type == 3 ? h('div', {style}, [
        h('strong', {style: {fontSize: '15px'}}, '是否确认收货？'),
        h('p', '确认收货后，退款将会退给用户')
      ]) : h('div', {style}, [
        h('strong', {style: {fontSize: '15px'}}, '是否确认收货？'),
        h('p', '确认收货后，请及时给用户发货“所换商品”')
      ]);

      this.$msgbox({
        title: '',
        message,
        center: true,
        showClose: true,
        closeOnClickModal: false,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'mr10',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            const target = instance.$el.firstChild;
            const loading = vm.loadLoading(target);
            // 发起请求
            vm.confirmReq(loading, done);
          } else {
            done();
          }
        }
      }).then(() => {
        this.$message.success('确认收货成功');
        this.goBackList();
      }).catch(() => {
        this.$message.info('已取消确认收货');
      });
    },
    // 返回
    goBackList () {
      const curView = this.$route;

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          this.$router.replace({path: 'refundAudit'}); // 返回列表页
        });
      });
    },
    // 确认收货
    confirmReceiptHandle () {
      this.$refs.confirmReceipt.validate(valid => {
        if (valid) {
          this.confirmTips();
        } else {
          return false;
        }
      });
    },
  }
}
</script>

<style lang="scss" scoped>
  .refund-audit-detail-wrap {
    min-width: 1200px;
    padding: 25px 40px 0;
    .el-image {
      ::v-deep .el-image__error {
        height: 90px;
      }
      &.table {
        ::v-deep .el-image__error {
          height: 90px;
          background: unset;
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
    .box-card {
      margin-top: 60px;
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
    .custom-form {
      width: 830px;
      margin: 30px auto 60px;
      .el-form-item {
        ::v-deep .el-form-item__label {
          font-weight: normal;
        }
      }
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

