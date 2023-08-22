<template>
  <div class="return-audit-handle-wrap">
    <el-card class="box-card" shadow="always" header="服务单信息">
      <el-row class="info-item" :gutter="20">
        <el-col class="item-label" :span="3">服务单号:</el-col>
        <el-col :span="15">{{info.refundNo||'-'}}</el-col>
      </el-row>
      <el-row class="info-item" :gutter="20">
        <el-col class="item-label" :span="3">申请状态:</el-col>
        <el-col :span="15">待处理</el-col>
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

    <el-dialog
      center
      width="520px"
      ref="returnAudit"
      :title="diaTitle"
      :close-on-click-modal="false"
      :visible.sync="shwoDia"
      :before-close="cancelDia">
      <el-form class="mb0" :model="diaForm" :rules="rules" ref="diaForm">
        <el-form-item prop="operDesc" class="mb0">
          <el-input
            type="textarea"
            :maxlength="300"
            show-word-limit
            :autosize="{minRows:6}"
            placeholder="请输入备注"
            v-model="diaForm.operDesc"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="mr20" @click="cancelDia">取 消</el-button>
        <el-button type="primary" @click="confirmDia">确 定</el-button>
      </span>
    </el-dialog>

    <div class="form-btns">
      <el-button type="warning" @click="goBackList">返回</el-button>
      <el-button type="success" @click="confirmReturn(1)" v-hasPermi="['operation:returnrefund:handler']">确认退款</el-button>
      <!-- <el-button type="success" @click="confirmReturn(2)">拒绝退款</el-button> -->
    </div>
  </div>
</template>

<script>
import {returnrefundDetail, returnrefundHandler} from '@/api/order/afterSale';


export default {
  name: 'ReturnAuditHandle',
  data () {
    return {
      info: {},
      shwoDia: false,
      diaTitle: '',
      diaForm: {
        operDesc: '',
      },
      rules: {
        operDesc: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { type: 'string', min: 1, max: 300, message: '输入长度1-300个字符', trigger: 'blur' },
        ],
      },
      id: '',
      checkType: false, // true 同意 false 拒绝
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
    // 退款提交
    async returnrefundHandlerReq (cb) {
      try {
        await returnrefundHandler({
          id: this.id,
          checkType: this.checkType,
          operDesc: this.diaForm.operDesc,
        });
        cb.close();
        this.shwoDia = false;
        this.diaTitle = '';
        this.checkType = false;
        this.$message.success('提交成功');
        this.goBackList();
      } catch (error) {
        cb.close();
        throw error;
      }
    },
    // 查看
    checkDetail() {
      let path = 'orderDetail';
      let curView = this.$route;
      let {orderId, id} = this.info;
      let from = 'returnAuditHandle';
      let query = {id: orderId, fromId: id, from};

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          this.$router.replace({path, query});
        });
      });
    },
    // 取消弹窗
    cancelDia () {
      this.shwoDia = false;
      this.diaTitle = '';
      this.$refs.diaForm.resetFields();
    },
    // 加载loading
    loadLoading () {
      const target = this.$refs.returnAudit.$el.firstChild;

      const loadinger = this.$loading({
        target,
        lock: true,
        text: '提交中...',
        spinner: 'el-icon-sunny',
        customClass: 'loadingAnim',
      });

      return loadinger;
    },
    // 确认弹窗
    confirmDia () {
      this.$refs.diaForm.validate(valid => {
        if (valid) {
          const cb = this.loadLoading();
          this.returnrefundHandlerReq(cb);
        } else {
          return false;
        }
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
    // 确认退款
    confirmReturn (num) {
      this.diaTitle = num == 1 ? '确认退款处理备注' : '拒绝退款处理备注';
      this.checkType = num == 1; // true 同意 false 拒绝
      this.shwoDia = true;
    },
  }
}
</script>

<style lang="scss" scoped>
  .return-audit-handle-wrap {
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

