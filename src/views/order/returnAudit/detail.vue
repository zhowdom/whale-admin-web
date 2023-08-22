<template>
  <div class="return-audit-detail-wrap">
    <el-card class="box-card" shadow="always" header="服务单信息">
      <el-row class="info-item" :gutter="20">
        <el-col class="item-label" :span="3">服务单号:</el-col>
        <el-col :span="15">{{info.refundNo||'-'}}</el-col>
      </el-row>
      <el-row class="info-item" :gutter="20">
        <el-col class="item-label" :span="3">申请状态:</el-col>
        <el-col :span="15">{{info.status==1?'已通过':info.status==2?'已拒绝':'-'}}</el-col>
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
      <br>
      <el-row class="info-item top-border" :gutter="20">
        <el-col class="item-label" :span="3">订单支付（Candy）:</el-col>
        <el-col :span="15">{{info.itemPayWhalePeas||'-'}}</el-col>
      </el-row>
      <el-row class="info-item" :gutter="20">
        <el-col class="item-label" :span="3">确认退还（Candy）:</el-col>
        <el-col :span="15">{{info.itemPayWhalePeas}}</el-col>
      </el-row>
      
      <el-row class="info-item" :gutter="20">
        <el-col class="item-label" :span="3">订单金额:</el-col>
        <el-col :span="15">{{info.refundAmount?'￥'+info.refundAmount:'-'}}</el-col>
      </el-row>
      <el-row class="info-item" :gutter="20">
        <el-col class="item-label" :span="3">确认退款金额:</el-col>
        <el-col :span="15">{{info.orderAmount?'￥'+info.orderAmount:'-'}}</el-col>
      </el-row>
      
      <el-row class="info-item" :gutter="20">
        <el-col class="item-label" :span="3">退款方式:</el-col>
        <el-col :span="15">退回到原支付渠道</el-col>
      </el-row>
      <el-row class="info-item" :gutter="20">
        <el-col class="item-label" :span="3">退款类型:</el-col>
        <el-col :span="15">取消订单</el-col>
      </el-row>
      <el-row class="info-item" :gutter="20">
        <el-col class="item-label" :span="3">退款原因:</el-col>
        <el-col :span="15">{{info.refundReason||'-'}}</el-col>
      </el-row>
    </el-card>

    <el-card class="box-card" shadow="always" header="处理结果">
      <el-row class="info-item" :gutter="20">
        <el-col class="item-label" :span="3">处理人员:</el-col>
        <el-col :span="15">{{info.operMemberName||'-'}}</el-col>
      </el-row>
      <el-row class="info-item" :gutter="20">
        <el-col class="item-label" :span="3">处理时间:</el-col>
        <el-col :span="15">{{formatDate(info.operTime)}}</el-col>
      </el-row>
      <el-row class="info-item" :gutter="20">
        <el-col class="item-label" :span="3">操作备注:</el-col>
        <el-col :span="15">{{info.operDesc||'-'}}</el-col>
      </el-row>
    </el-card>

    <div class="form-btns">
      <el-button type="warning" @click="goBackList">返回</el-button>
    </div>
  </div>
</template>

<script>
import {returnrefundDetail} from '@/api/order/afterSale';

export default {
  name: 'ReturnAuditDetail',
  data () {
    return {
      info: {},
      id: '',
    }
  },
  mounted () {
    this.id = this.$route.query.id;
    this.returnrefundDetailReq();
  },
  methods: {
    // 格式日期功能
    formatDate (date, format = 'YYYY-MM-DD HH:mm:ss', def = '-') {
      return date ? this.$dayjs(date).format(format) : def;
    },
    // 查询详情
    async returnrefundDetailReq () {
      try {
        const {data} = await returnrefundDetail(this.id);
        this.info = data;
      } catch (error) {
        throw error;
      }
    },
    // 查看
    checkDetail() {
      let path = 'orderDetail';
      let curView = this.$route;
      let {orderId, id} = this.info;
      let from = 'returnAuditDetail';
      let query = {id: orderId, fromId: id, from};

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          this.$router.replace({path, query});
        });
      });
    },
    // 返回
    goBackList () {
      const curView = this.$route;

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          this.$router.replace({path: 'returnAudit'}); // 返回列表页
        });
      });
    },
  }
}
</script>

<style lang="scss" scoped>
  .return-audit-detail-wrap {
    min-width: 1200px;
    padding: 25px 40px 0;
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


