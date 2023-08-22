<template>
  <div class="audit-list-wrap" v-loading="showReturn">
    <!-- 批量审核 -->
    <el-form ref="shipping" inline :model="shippingForm">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="退款处理备注" prop="reason">
            <el-input class="normal-width" clearable v-model.trim="shippingForm.reason" placeholder="请输入退款处理备注"></el-input>
          </el-form-item>
          <el-button class="mr10" type="primary" @click="quickSetting">批量设置</el-button>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item class="fr mr0">
            <el-button class="mr10" type="primary" @click="quickClear">一键清空备注</el-button>
            <el-button type="primary" v-hasPermi="['operation:returnrefund:batchCheckRefund']" @click="handleMultOrder">批量审核</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table border row-key="orderNo" ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="refundNo" align="center" label="服务单号" :formatter="formatter"></el-table-column>
      <el-table-column prop="createTime" align="center" label="申请时间" :formatter="formatter"></el-table-column>
      <el-table-column prop="memberAccount" align="center" label="用户账号" :formatter="formatter"></el-table-column>
      <el-table-column prop="refundAmount" align="center" label="退款金额" :formatter="formatter"></el-table-column>
      <el-table-column prop="itemPayWhalePeas" align="center" label="退还Candy">
        <template slot-scope="{row}">
          <p>{{(row.itemPayWhalePeas === undefined || row.itemPayWhalePeas === null) ? '-' : row.itemPayWhalePeas}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="refundDescribe" align="center" label="退款描述" :formatter="formatter"></el-table-column>
      <el-table-column prop="refundReason" align="center" label="退款原因" :formatter="formatter"></el-table-column>
      <el-table-column prop="operTime" align="center" label="处理时间" :formatter="formatter"></el-table-column>
      <!-- 带有校验输入框的表格列 -->
      <el-table-column
        align="center"
        v-for="{name: pname, label, width} in tHeader"
        :key="pname" :prop="pname" :label="label" :width="width"
      >
        <span slot="header" class="required">{{label}}</span>
        <template slot-scope="{row}">
          <el-form :model="row" :rules="rules" ref="rowForm">
            <el-form-item prop="auditReason" class="mb15 mt15">
              <el-input v-model="row.auditReason" clearable placeholder="请输入"></el-input>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="{row,$index}">
          <el-button class="mb5" size="mini" type="primary" v-hasPermi="['operation:returnrefund:batchCheckRefund']" @click="handleSingleOrder(row, $index)">审核</el-button>
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
import {returnrefundPage, batchCheckRefund} from '@/api/order/afterSale';

export default {
  name: 'AuditList',
  props: ['range', 'refundNo'],
  data () {
    return {
      pager: {
        size: 10,
        total: 0,
        curPage: 1,
      },
      shippingForm: {
        reason: '系统操作退款',       // 原因
      },
      tHeader: [
        {
          width: 320,
          name: 'auditReason',
          label: '退款处理备注'
        },
      ],
      rules: {
        auditReason: [
          { required: true, message: '输入不能为空', trigger: 'blur'},
          { type: 'string', min: 1, max: 300, message: '输入长度1-300个字符', trigger: 'blur' },
        ],
      },
      tableData: [],
      multipleSel: [],
      showReturn: true,
    }
  },
  mounted () {
    this.returnrefundPageReq();
    setTimeout(() => {
      this.showReturn = false;
    }, 700);
  },
  methods: {
    // 批量设置
    quickSetting() {
      const {reason} = this.shippingForm;
      const rowForms = this.$refs.rowForm;
      if (!reason) return;

      rowForms.map(form => {
        const model = form.model;
        if (!!!model['auditReason'] && reason) {
          this.$set(model, 'auditReason', reason);
        }
      });
    },
    // 一键清空
    quickClear() {
      const rowForms = this.$refs.rowForm || [];
      this.shippingForm.reason = '';
      rowForms?.map(form => form.resetFields());
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
    async returnrefundPageReq () {
      try {
        let refundNo = this.refundNo;
        let [startTime, endTime] = this.range || ['', ''];
        let {size: pageSize, curPage: currentPage} = this.pager;

        const reqData = {
          startTime,
          endTime,
          refundNo,
          pageSize,
          status: 0,
          currentPage,
        };
        const {code, message, data} = await returnrefundPage(reqData);

        if (code == 200) {
          this.tableData = data?.list || [];
          this.pager.size = data?.pageSize;
          this.pager.total = data?.total;
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        throw error;
      }
    },
    // 退款（单个/批量）请求
    async batchCheckRefundReq (data, cb, done) {
      try {
        const {code, message} = await batchCheckRefund({
          batchCheckRefunds: data
        });

        if (code == 200) {
          done();
          this.returnrefundPageReq(); // 更新退款列表
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

      if (key == 'createTime' || key == 'operTime') {
        return this.formatDate(row[key], 'YYYY-MM-DD HH:mm:ss', '-');
      } else if (key == 'refundAmount') {
        let value = Number(row[key] || 0);
        return value ? '￥' + value.toFixed(2) : 0;
      } else {
        return row[key] || '-';
      }
    },
    // 格式日期功能
    formatDate (date, format = 'YYYY-MM-DD', def = '') {
      return date ? this.$dayjs(date).format(format) : def;
    },
    // 分页数量修改
    handleSizeChange(val) {
      this.pager.size = val;
      this.returnrefundPageReq();
    },
    // 跳转当前页
    handleCurrentChange(val) {
      this.pager.curPage = val;
      this.returnrefundPageReq();
    },
    // 单个退款按钮操作
    handleSingleOrder (row, index) {
      let reqData = [];
      let {auditReason, id} = row;
      let rowForms = [this.$refs.rowForm[index]];
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

      reqData.push({
        id: id || '',
        reason: auditReason || ''
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
          if (el.id == id) selIdxs.push(index);
        });
      });

      allRowForms.map((el, index) => {
        selIdxs.map(cl => {
          if (index == cl) selRowForms.push(el);
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
      this.multipleSel.map(({auditReason, id}) => {
        reqData.push({
          id: id || '',
          reason: auditReason || ''
        });
      });

      this.diaConfirm(reqData);
    },
    // 弹框确认
    diaConfirm (reqData) {
      const vm = this;
      const h = this.$createElement;
      const style = {fontSize: '15px', display: 'block', padding: '10px 10px 30px'};
      const message = h('strong', {style}, '是否确定通过此订单退款审核？');

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
              vm.batchCheckRefundReq(reqData, cb, done);
            }, 1200);
          } else {
            done();
          }
        }
      }).then(() => {
        this.$message.success('退款审核成功');
      }).catch(() => {
        this.$message.info('取消退款审核');
      });
    },
  }
}
</script>

<style lang="scss" scoped>
  .audit-list-wrap {
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

