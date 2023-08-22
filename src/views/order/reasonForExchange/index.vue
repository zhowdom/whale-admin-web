<template>
  <div class="reason-for-exchange-wrap">
    <el-button v-hasPermi="['order:return_refund_reason:del']" type="danger" @click="batchDelHandle">批量删除</el-button>
    <el-button class="fr mb15" v-hasPermi="['order:return_refund_reason:save']" type="primary" @click="onAddHandle">添加</el-button>

    <div class="shipping-point-table">
      <el-table border :data="tableData" ref="multipleTable" @selection-change="handleSelectionChange" style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="causeType" align="center" label="原因类型" :formatter="formatter"></el-table-column>
        <el-table-column prop="sort" align="center" label="排序" :formatter="formatter"></el-table-column>
        <el-table-column prop="enable" align="center" label="是否启用" :formatter="formatter"></el-table-column>
        <el-table-column prop="createdAt" align="center" label="添加时间" :formatter="formatter"></el-table-column>
        <el-table-column align="center" label="操作" width="170">
          <template slot-scope="{row}">
            <el-button size="mini" v-hasPermi="['order:return_refund_reason:edit']" type="primary" @click="editHandle(row, 'Edit')">编辑</el-button>
            <el-button size="mini" v-hasPermi="['order:return_refund_reason:del']" type="danger" @click="singleDelHandle(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

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

    <el-dialog
      center
      ref="exchange"
      width="520px"
      :title="`${isEdit?'编辑':'添加'}换货原因`"
      :close-on-click-modal="false"
      :visible.sync="shwoDia"
      :before-close="cancelDia">
      <el-form :model="diaForm" :rules="rules" ref="diaForm" label-width="100px">
        <el-form-item label="原因类型" prop="causeType">
          <el-input type="textarea" :rows="6" :maxlength="300" :minlength="1" show-word-limit placeholder="请输入原因类型" v-model="diaForm.causeType" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input placeholder="请输入排序" v-model.trim="diaForm.sort" />
        </el-form-item>
        <el-form-item label="是否启用" prop="enable">
          <el-switch
            :width="60"
            class="custom-switcher"
            active-text="是"
            inactive-text="否"
            :active-value="true"
            :inactive-value="false"
            v-model="diaForm.enable"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDia">取 消</el-button>
        <el-button type="primary" @click="confirmDia">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {returnRefundReasonList, returnRefundReasonSave, returnRefundReasonUpdate, returnRefundReasonDelete} from '@/api/order/afterSale';

export default {
  name: 'ReasonForExchange',
  data () {
    return {
      tableData: [],
      diaForm: {
        causeType: '',
        enable: true,
        sort: '',
      },
      shwoDia: false,
      isEdit: false,
      loadinger: null,
      id: null,
      multipleSel: [],
      pager: {
        size: 10,
        total: 0,
        curPage: 1,
      },
      rules: {
        causeType: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { type: 'string', min: 1, max: 300, message: '输入长度1-300个字符', trigger: 'blur' },
        ],
        sort: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { pattern: /^(0|[1-9]\d*)$/, message: '输入必须为非负数', trigger: 'blur'}
        ],
        enable: [
          { required: true, message: '是否启用不能为空', trigger: 'blur' }
        ],
      }
    }
  },
  mounted () {
    this.returnRefundReasonListReq();
  },
  methods: {
    // 换货列表
    async returnRefundReasonListReq () {
      try {
        const {code, message, data: {list, pageSize, total}} = await returnRefundReasonList({
          type: 2,
          pageSize: this.pager.size,
          currentPage: this.pager.curPage,
        });
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
    // 添加换货原因
    async returnRefundReasonSaveReq () {
      try {
        await returnRefundReasonSave({
          type: 2,
          ...this.diaForm,
        });
        this.$message.success('添加成功！');
        this.loadinger.close();
        this.cancelDia();
        this.returnRefundReasonListReq();
      } catch (error) {
        this.loadinger.close();
        throw error;
      }
    },
    // 编辑换货原因
    async returnRefundReasonUpdateReq () {
      try {
        await returnRefundReasonUpdate({
          type: 2,
          id: this.id,
          ...this.diaForm,
        });

        this.$message.success('编辑成功！');
        this.loadinger.close();
        this.cancelDia();
        this.returnRefundReasonListReq();
      } catch (error) {
        this.loadinger.close();
        throw error;
      }
    },
    // 删除请求
    async returnRefundReasonDeleteReq (ids) {
      try {
        const {code, message} = await returnRefundReasonDelete({ids});
        if (code == 200) {
          this.$message.success('删除成功');
          this.returnRefundReasonListReq();
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
    // 格式化
    formatter (row, column) {
      let key = column.property;

      if (key == 'enable') {
        return row[key] ? '是' : '否';
      } else if (key == 'createdAt') {
        return this.formatDate(row[key], 'YYYY-MM-DD HH:mm:ss');
      } else if (key == 'sort') {
        return row[key];
      } else {
        return row[key] || '-';
      };
    },
    // 格式日期功能
    formatDate (date, format = 'YYYY-MM-DD', def = '-') {
      return date ? this.$dayjs(date).format(format) : def;
    },
    // 添加发货点
    onAddHandle () {
      this.shwoDia = true;
      this.isEdit = false;
    },
    // 编辑
    editHandle({id, causeType, enable, sort}) {
      this.shwoDia = true;
      this.isEdit = true;
      this.id = id;
      this.diaForm = {
        ...this.diaForm,
        causeType,
        enable,
        sort
      };
    },
    // 多选
    handleSelectionChange(value) {
      this.multipleSel = value;
    },
    // 批量删除操作
    batchDelHandle () {
      if (!this.multipleSel.length) return this.$message.error('请选择批量删除的换货原因！');
      let ids = this.multipleSel.map(({id}) => id);

      this.$confirm('确定要删除这些换货原因？', {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.returnRefundReasonDeleteReq(ids);
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    // 单个删除操作
    singleDelHandle (row) {
      let rId = row.id;
      let hasSameOrder = this.multipleSel.findIndex(({id}) => id == rId);
      if (hasSameOrder == -1) this.$refs.multipleTable.toggleRowSelection(row);
      if (this.multipleSel.length > 1) return this.$message.error('只能删除一条记录');

      this.$confirm('确定要删除该换货原因吗？', {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.returnRefundReasonDeleteReq([rId]);
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    // 取消弹窗
    cancelDia () {
      this.shwoDia = false;
      this.isEdit = false;
      this.id = null;
      this.$refs.diaForm.resetFields();
    },
    // 加载loading
    loadLoading () {
      const target = this.$refs.exchange.$el.firstChild;

      this.loadinger = this.$loading({
        target,
        lock: true,
        text: '更新中...',
        spinner: 'el-icon-sunny',
        customClass: 'loadingAnim',
      });
    },
    // 确认弹窗
    confirmDia () {
      this.$refs.diaForm.validate(valid => {
        if (valid) {
          this.loadLoading();
          // 发起请求
          if (this.isEdit) {
            this.returnRefundReasonUpdateReq();
          } else {
            this.returnRefundReasonSaveReq();
          };
        } else {
          return false;
        }
      });
    },
    // 分页数量修改
    handleSizeChange(val) {
      this.pager.size = val;
      this.returnRefundReasonListReq();
    },
    // 跳转当前页
    handleCurrentChange(val) {
      this.pager.curPage = val;
      this.returnRefundReasonListReq();
    },
  }
}
</script>

<style lang="scss" scoped>
  .reason-for-exchange-wrap {
    padding: 20px;
    .custom-switcher {
      ::v-deep .el-switch__label--left,
      ::v-deep .el-switch__label--right {
        position: absolute;
        z-index: -1;
        font-size: 14px;
      }
      ::v-deep .el-switch__label--left {
        margin-right: 10px;
        right: 0;
        color: #999;
      }
      ::v-deep .el-switch__label--right {
        margin-right: 0px;
        left: 0px;
        color: #fff;
      }
      ::v-deep .el-switch__label.is-active {
        z-index: 20;
      }
      ::v-deep .el-switch__core {
        height: 26px;
        border-radius: 24px;
      }
      ::v-deep .el-switch__core:after {
        border-radius: 24px;
        width: 26px;
        height: 26px;
        margin-left: -2px;
        box-shadow: -3px 0px 1px #888;
        top: -1px;
      }
      &.is-checked ::v-deep .el-switch__core:after {
        margin-left: -25px;
        box-shadow: 3px 0px 1px #888;
      }
    }
  }
</style>
