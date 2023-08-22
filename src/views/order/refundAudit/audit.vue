<template>
  <div class="refund-audit-handle-wrap">
    <!-- 退货退款商品/退货商品-->
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
        <el-col :span="15">{{transStatus(info.status)}}</el-col>
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
        <el-col class="item-label" :span="3">退货退款原因:</el-col>
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
      
    </el-card>

    <el-card class="box-card" shadow="always" header="审核">
      
      <el-form class="custom-form" :model="auditForm" :rules="rules" ref="auditForm" label-width="150px">
         <el-form-item prop="orderAmount" label="订单支付（Candy）:">
          {{info.itemPayWhalePeas}}
        </el-form-item>
         <el-form-item prop="orderAmount" label="确认退还（Candy）:" v-if="type==3">
          {{info.itemPayWhalePeas}}
        </el-form-item>

        <el-form-item prop="orderAmount" label="订单（金额）:">
          {{info.orderAmount?'￥'+info.orderAmount:'-'}}
        </el-form-item>
        

        <el-form-item prop="refundAmount" label="确认退款金额:" v-if="type==3">
          {{info.refundAmount?'￥'+info.refundAmount:'-'}}
        </el-form-item>

        <el-form-item prop="deliverAddressId" label="选择收货点:">
          <el-select class="input-class" clearable v-model="auditForm.deliverAddressId" @change="changeShippingPoint" placeholder="请选择收货点">
            <el-option v-for="item in shippingList" :key="item.id" :label="item.deliverName" :value='item.id'></el-option>
          </el-select>
        </el-form-item>

        <template v-if="auditForm.deliverAddressId">
          <el-form-item label="收货人姓名:">
            {{shippingInfo.deliverUserName||'-'}}
          </el-form-item>

          <el-form-item label="收货人地址:">
            {{transAddress}}
          </el-form-item>

          <el-form-item label="详细地址:">
            {{shippingInfo.address||'-'}}
          </el-form-item>

          <el-form-item label="联系电话:">
            {{shippingInfo.phone||'-'}}
          </el-form-item>
        </template>

        <el-form-item prop="remark" label="处理备注:">
          <el-input
            class="input-class"
            type="textarea"
            :maxlength="50"
            show-word-limit
            :autosize="{minRows:3}"
            placeholder="请输入备注"
            v-model="auditForm.remark"
          />
          <div class="input-tips">
            可填写审核通过或审失败的原因，若审核失败此原因会返回到前端
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="form-btns">
      <el-button type="warning" @click="goBackList">返回</el-button>
      <el-button type="primary" v-hasPermi="['operation:returnRefundReturnItem:audit']" @click="confirmReturn">通过审核</el-button>
      <el-button type="danger" v-hasPermi="['operation:returnRefundReturnItem:audit']" @click="refuseReturn">审核失败</el-button>
    </div>
  </div>
</template>

<script>
import citys from '@/utils/provinceCity';
import {details, audit, addressList} from '@/api/order/refund';


export default {
  name: 'RefundAuditHandle',
  data () {
    return {
      info: {},
      auditForm: {
        remark: '',
        deliverAddressId: '',
      },
      rules: {
        deliverAddressId: [
          { required: true, message: '选择收货点不能为空', trigger: 'change' },
        ],
        remark: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { type: 'string', min: 1, max: 50, message: '输入长度1-50个字符', trigger: 'blur' },
        ],
      },
      id: '',
      type: '', // 申请类型 3 退货退款 2 换货
      total: '',
      countTotalWhalePeas: '',
      imgs: [],
      sellerId: '', // 自营/供应商id
      shippingList: [],
      shippingInfo: {},
      refundOrExchangeGoods: [], // 换货、退货商品
    }
  },
  computed: {
    transStatus () {
      return value => {
        return value == 1 ?'待审核'
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
      let {provinceCode, cityCode, areaCode} = this.shippingInfo;

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
      return labels.length ? labels.join(' ') : '-';
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
    // 修改发货地点
    changeShippingPoint (val) {
      if (!val) this.shippingInfo = {};
      this.shippingList.some(el => {
        if (el.id == val) {
          this.shippingInfo = el;
          return true;
        }
      });
    },
    // 查看
    checkDetail() {
      let path = 'orderDetail';
      let curView = this.$route;
      let {orderId} = this.info;
      let from = 'refundAuditHandle';
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
    // 收货点信息列表
    async addressListReq () {
      try {
        const {data} = await addressList({sellerId: this.sellerId});
        this.shippingList = data || [];
        this.shippingList.some(el => {
          let {deliverReturn, id} = el;
          if (!deliverReturn) {
            this.shippingInfo = el;
            this.auditForm.deliverAddressId = id;
            return true;
          }
        });
      } catch (error) {
        throw error;
      }
    },
    // 查询详情
    async detailsReq () {
      try {
        const {data} = await details({id: this.id});
        this.info = data;
        // 申请类型 3 退货退款 2 换货
        this.type = data.type;
        // 自营/供应商 id
        this.sellerId = data.sellerId;
        // 发货点信息管理列表
        this.addressListReq();
        // 换货、退货商品
        this.getRefundOrExchangeGoods(data);
        // 合计字段
        this.total = data.countTotal;
        this.countTotalWhalePeas = data.countTotalWhalePeas;
        // 凭证图片
        this.imgs = data.imgs || [];
      } catch (error) {
        throw error;
      }
    },
    // 审核
    async auditReq (arg, cb, done) {
      try {
        const {deliverAddressId, remark} = this.auditForm;
        await audit({
          remark,
          id: this.id,
          audit: arg == 1,
          deliverAddressId
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
    // 审核弹框
    auditTips (arg) {
      const vm = this;
      const h = this.$createElement;
      const isExchange = this.type == 2; // 申请类型 3 退货退款 2 换货
      const style = {fontSize: '14px', padding: '10px 10px 15px'};

      const message = arg ? h('div', {style}, [
        h('strong', {style: {fontSize: '15px'}}, '是否确定审核通过？'),
        h('p', '审核通过后需要买家填写物流信息'),
        h('p', `商家确认收货后，才能${isExchange ? '换货' : '退款'}给用户`)
      ]) : h('div', {style}, [
        h('strong', {style: {fontSize: '15px'}}, '是否确定审核失败？'),
        h('p', `审核失败后，将拒绝此${isExchange ? '换货' : '退货退款'}请求`)
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
            vm.auditReq(arg, loading, done);
          } else {
            done();
          }
        }
      }).then(() => {
        this.goBackList();
        this.$message.success('审核成功');
      }).catch(() => {
        this.$message.info('已取消审核');
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
    // 确认退款
    confirmReturn () {
      this.$refs.auditForm.validate(valid => {
        if (valid) {
          this.auditTips(1);
        } else {
          return false;
        }
      });
    },
    // 拒绝退款
    refuseReturn () {
      this.$refs.auditForm.validate(valid => {
        if (valid) {
          this.auditTips(0);
        } else {
          return false;
        }
      });
    },
  }
}
</script>

<style lang="scss" scoped>
  .refund-audit-handle-wrap {
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
    .text-sum {
      color: #ed5565;
      font-weight: 600;
      font-size: 16px;
    }
    .custom-form {
      width: 530px;
      margin: 30px auto 60px;
      .el-form-item {
        ::v-deep .el-form-item__label {
          font-weight: normal;
        }
        .input-class {
          width: 360px;
        }
        .input-tips {
          color: #9ca7b5;
          font-size: 13px;
          line-height: 26px;
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

