<template>
  <div class="order-return-list-wrap" v-loading="showReturn">
    <!-- 批量退款 -->
    <el-form ref="shipping" inline :model="shippingForm">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="退款原因" prop="type">
            <el-select clearable v-model="shippingForm.type" placeholder="请选择退款原因">
              <el-option v-for="{id, causeType} in reasons" :key="id" :label="causeType" :value='id'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="退款描述" prop="desc">
            <el-input class="normal-width" clearable v-model.trim="shippingForm.desc" placeholder="请输入退款描述"></el-input>
          </el-form-item>
          <el-button class="mr10" type="primary" @click="quickSetting">批量设置</el-button>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item class="fr mr0">
            <el-button class="mr10" type="primary" @click="quickClear(1)">一键清空退款原因</el-button>
            <el-button class="mr10" type="primary" @click="quickClear(2)">一键清空退款描述</el-button>
            <el-button type="primary" v-hasPermi="['operation:returnrefund:batchRefund']" @click="handleMultOrder">批量退款</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table border row-key="orderNo" ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="orderNo" align="center" label="主订单编号" :formatter="formatter"></el-table-column>
      <el-table-column prop="itemName" align="center" label="商品名称" :formatter="formatter" width="170"></el-table-column>
      <el-table-column prop="memberNickName" align="center" label="下单人" :formatter="formatter"></el-table-column>
      <el-table-column prop="memberPhone" align="center" label="下单人手机号" :formatter="formatter"></el-table-column>
      <el-table-column prop="createTime" align="center" label="提交时间" :formatter="formatter"></el-table-column>
      <el-table-column prop="payType" align="center" label="支付方式">
        <template scope="scope">
          <p v-if="+scope.row.payType === 1">支付宝</p>
          <p v-else-if="+scope.row.payType === 2">微信</p>
          <p v-else-if="+scope.row.payType === 3">余额支付</p>
          <p v-else-if="+scope.row.payType === 4">Candy</p>
          <p v-else-if="+scope.row.payType === 5">支付宝 + Candy</p>
          <p v-else-if="+scope.row.payType === 6">微信 + Candy</p>
          <p v-else-if="+scope.row.payType === 7">余额 + Candy</p>
        </template>
      </el-table-column>
      <el-table-column prop="orderPayWhalePeas" align="center" label="订单金额（Candy）"></el-table-column>
      <el-table-column prop="orderAmount" align="center" label="订单金额（USDT）" :formatter="formatter"></el-table-column>
      <!-- 带有校验输入框的表格列 -->
      <el-table-column
        align="center"
        v-for="{name: pname, label, width} in tHeader"
        :key="pname" :prop="pname" :label="label" :width="width"
      >
        <span slot="header" :class="{'required':pname=='refundReasonId'}">
          {{label}}
        </span>
        <template slot-scope="{row}">
          <el-form :model="row" :rules="rules" ref="rowForm">
            <el-form-item prop="refundReasonId" class="mb15 mt15" v-if="pname=='refundReasonId'">
              <el-select clearable v-model="row.refundReasonId" placeholder="请选择">
                <el-option v-for="{id, causeType} in reasons" :key="id" :label="causeType" :value='id'></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="refundDescribe" class="mb15 mt15" v-if="pname=='refundDescribe'">
              <el-input v-model="row.refundDescribe" clearable placeholder="请输入"></el-input>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="{row,$index}">
          <el-button class="mb5" size="mini" type="primary" v-hasPermi="['operation:returnrefund:batchRefund']" @click="handleSingleOrder(row, $index)">退款</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="table-pagination text-right mt10">
      <el-pagination
        :total="pager.total"
        :page-size="pager.size"
        :page-sizes="[10, 20, 30]"
        :current-page="pager.curPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {orderList, batchRefund, getRefundReason} from '@/api/order/list';

export default {
  name: 'OrderReturnList',
  props: ['memberOPhone', 'range', 'orderOName', 'sellerId'],
  data () {
    return {
      pager: {
        size: 10,
        total: 0,
        curPage: 1,
      },
      shippingForm: {
        type: '',               // 退款原因
        desc: '系统操作退款',     // 退款描述
      },
      tHeader: [
        {
          name: 'refundReasonId',
          width: 180,
          label: '退款原因'
        },
        {
          name: 'refundDescribe',
          width: 180,
          label: '退款描述'
        },
      ],
      reasons: [],
      tableData: [],
      rules: {
        refundReasonId: [
          { required: true, message: '选择不能为空', trigger: 'change' },
        ],
      },
      multipleSel: [],
      showReturn: true,
      payType: {
        1: '支付宝',
        2: '微信',
        3: '余额'
      },
      orderSource: {
        0: 'app订单',
        1: 'pc端订单',
      },
    }
  },
  mounted () {
    this.orderListReq();
    this.getRefundReasonReq();
    setTimeout(() => {
      this.showReturn = false;
    }, 700);
  },
  methods: {
    // 批量设置
    quickSetting() {
      const {type, desc} = this.shippingForm;
      const rowForms = this.$refs.rowForm;
      if (!type && !desc) return;

      rowForms.map(form => {
        const model = form.model;
        if (!!!model['refundReasonId'] && type) {
          this.$set(model, 'refundReasonId', type);
        }

        if (!!!model['refundDescribe'] && desc) {
          this.$set(model, 'refundDescribe', desc);
        }
      });
    },
    // 一键清空
    quickClear(flag) {
      const rowForms = this.$refs.rowForm || [];
      if (flag == 1) { // 一键清空退款原因
        this.shippingForm.type = '';
        rowForms?.map((form, index) => {
          if (index % 2 == 0) form.resetFields();
        });
      } else { // 一键清空退款描述
        this.shippingForm.desc = '';
        rowForms?.map((form, index) => {
          if (index % 2 == 1) form.resetFields();
        });
      }
    },
    // 多选改变
    handleSelectionChange(value) {
      this.multipleSel = value;
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
    // 获取退款列表
    async orderListReq () {
      try {
        let [startTime, endTime] = this.range || ['', ''];

        const reqData = {
          startTime,
          endTime,
          orderStatus: 20,
          sellerId: this.sellerId,
          pageSize: this.pager.size,
          currentPage: this.pager.curPage,
          memberPhoneOrName: this.memberOPhone,
          orderNoOrProductName: this.orderOName,
        };
        const {code, message, data: {list, pageSize, total}} = await orderList(reqData);

        if (code == 200) {
          this.tableData = list;
          this.pager.size = pageSize;
          this.pager.total = total;
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        throw error;
      }
    },
    // 获取退款原因
    async getRefundReasonReq () {
      try {
        const {code, message, data} = await getRefundReason();

        if (code == 200) {
          this.reasons = data || [];
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        throw error;
      }
    },
    // 退款（单个/批量）请求
    async batchRefundReq (data, cb, done) {
      try {
        const {code, message} = await batchRefund({
          batchRefunds: data
        });

        if (code == 200) {
          done();
          this.orderListReq(); // 更新退款列表
        } else {
          this.$message.error(message);
        };
        cb.close();

      } catch (error) {
        cb.close();
        throw error;
      }
    },
    // 格式化
    formatter (row, column) {
      let key = column.property;
      const h = this.$createElement;

      if (key == 'createTime') {
        return this.formatDate(row[key], 'YYYY-MM-DD HH:mm:ss', '-');
      } else if (key == 'orderAmount') {
        let value = Number(row[key] || 0);
        return value ? '￥' + value.toFixed(2) : '￥' + 0.00;
      } else if (key == 'payType') {
        return this.payType[row[key]] || '-';
      } else if (key == 'orderSource') {
        return this.orderSource[row[key]] || '-';
      } else {
        return row[key] || '-';
      };
    },
    // 格式日期功能
    formatDate (date, format = 'YYYY-MM-DD', def = '') {
      return date ? this.$dayjs(date).format(format) : def;
    },
    // 分页数量修改
    handleSizeChange(val) {
      this.pager.size = val;
      this.orderListReq();
    },
    // 跳转当前页
    handleCurrentChange(val) {
      this.pager.curPage = val;
      this.orderListReq();
    },
    // 单个退款按钮操作
    handleSingleOrder (row, index) {
      let reqData = [];
      let returnRefundReasonDesc;
      let {refundReasonId, refundDescribe, orderNo} = row;
      let rowForms = this.$refs.rowForm.slice(index * 2, (index + 1) * 2);
      let result = rowForms.every(form => {
        let validRst = false;
        form.validate(valid => validRst = valid);
        return validRst;
      });

      // 校验不通过不执行
      if (!result) return this.$message.error('表格输入校验不通过');

      let hasSameOrder = this.multipleSel.findIndex(({id}) => id == row.id);
      if (hasSameOrder == -1)  this.$refs.multipleTable.toggleRowSelection(row);
      if (this.multipleSel.length > 1) return this.$message.error('只能对单个订单退款');

      this.reasons.some(({causeType, id}) => {
        if (id == refundReasonId) {
          returnRefundReasonDesc = causeType;
          return true;
        }
      });

      reqData.push({
        orderNo: orderNo || '',
        refundDescribe: refundDescribe || '',
        refundReasonId: refundReasonId || '',
        returnRefundReasonDesc: returnRefundReasonDesc || '',
      });

      this.diaConfirm(reqData);
    },
    // 批量退款按钮操作
    handleMultOrder () {
      let selIdxs = [];
      let reqData = [];
      let selRowForms = [];
      let allRowForms = this.$refs.rowForm;
      if (!this.multipleSel.length) return this.$message.error('请选择批量退款的订单！');

      this.multipleSel.map(el => {
        this.tableData.map(({id}, index) => {
          if (el.id == id) {
            selIdxs.push(index);
          }
        });
      });

      allRowForms.map((el, index) => {
        selIdxs.map(cl => {
          let start = cl * 2;
          let end = (cl + 1) * 2;
          if (index >= start && index < end) {
            selRowForms.push(el);
          }
        })
      });

      // 校验选中行中的表单
      const result = selRowForms.every(form => {
        let validRst = false;
        form.validate(valid => validRst = valid);
        return validRst;
      });

      // 校验不通过不执行
      if (!result) return this.$message.error('表格输入校验不通过');

      // 组合数据
      this.multipleSel.map(({refundReasonId, refundDescribe, orderNo}) => {
        let returnRefundReasonDesc;
        this.reasons.some(({causeType, id}) => {
        if (id == refundReasonId) {
          returnRefundReasonDesc = causeType;
          return true;
        }
      });

        reqData.push({
          orderNo: orderNo || '',
          refundDescribe: refundDescribe || '',
          refundReasonId: refundReasonId || '',
          returnRefundReasonDesc: returnRefundReasonDesc || '',
        });
      });

      this.diaConfirm(reqData);
    },
    // 弹框确认
    diaConfirm (reqData) {
      const vm = this;
      const h = this.$createElement;
      const style = {fontSize: '15px', display: 'block', padding: '10px 10px 30px'};
      const message = h('strong', {style}, '是否确定此订单退款？');

      this.$alert(message, '', {
        center: true,
        showClose: false,
        closeOnClickModal: false,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonClass: 'ml25',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            const target = instance.$el.firstChild;
            const cb = vm.loadLoading(target);
            // 发送请求
            setTimeout(() => {
              vm.batchRefundReq(reqData, cb, done);
            }, 1200);
          } else {
            done();
          }
        }
      }).then(() => {
        this.$message.success('退款成功');
      }).catch(() => {
        this.$message.info('取消退款');
      });
    },
  }
}
</script>

<style lang="scss" scoped>
  .order-return-list-wrap {
    padding: 20px;
    .form-btns {
      text-align: center;
      margin-top: 35px;
      margin-bottom: 30px;
      button {
        min-width: 98px;
        margin-right: 50px;
      }
    }
    .normal-width {
      width: 340px;
    }
  }
</style>

