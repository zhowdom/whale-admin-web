<template>
  <div class="return-audit-wrap">
    <div class="top-search">
      <el-row class="mb20">
        <el-col class="top-tab" :span="24">
          <el-button @click="changeTab('')" :type="curType('')" size="medium">
            全部申请(<span :class="curClass('')">{{numSts.allNum||0}}</span>)
          </el-button>
          <el-button @click="changeTab(0)" :type="curType(0)" size="medium">
            待处理(<span :class="curClass(0)">{{numSts.waitHandleNum||0}}</span>)
          </el-button>
          <el-button @click="changeTab(1)" :type="curType(1)" size="medium">
            已处理(<span :class="curClass(1)">{{numSts.alreadyHandleNum||0}}</span>)
          </el-button>
          <!-- <el-button @click="changeTab(2)" :type="curType(2)" size="medium">
            已拒绝(<span :class="curClass(2)">{{numSts.alreadyRefuseNum||0}}</span>)
          </el-button> -->
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form ref="mainForm" inline :model="mainForm" label-width="90px">

            <el-form-item label="服务单号:">
              <el-input class="align-width" v-model="mainForm.refundNo" clearable placeholder="请输入服务单号"></el-input>
            </el-form-item>

            <el-form-item label="申请时间:">
              <el-date-picker
                clearable
                class="align-width"
                v-model="timeAt"
                type="daterange"
                :editable="false"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item class="fr mr0">
              <el-button type="primary" @click="onSearch" v-hasPermi="['operation:returnrefund:page']">查询</el-button>
              <el-button v-if="mainForm.status===0" type="primary" @click="batchAuditHandle" v-hasPermi="['operation:returnrefund:batchCheckRefund']">批量审核</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>

    <div class="mgmt-table">
      <el-table border :data="tableData">
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
        <el-table-column prop="status" align="center" label="申请状态" :formatter="formatter"></el-table-column>
        <el-table-column prop="operTime" align="center" label="处理时间" :formatter="formatter"></el-table-column>
        <el-table-column align="center" label="操作" width="100">
          <template slot-scope="{row}">
            <el-button size="mini" type="primary" v-if="row.status==0" @click="handleTabBtn(row, 'Audit')">审核</el-button>
            <el-button size="mini" type="warning" v-else @click="handleTabBtn(row, 'Detail')">查看</el-button>
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

    <!-- 审核弹窗 -->
    <el-dialog
      center
      width="86%"
      title="审核"
      ref="auditdiaForm"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :visible.sync="showAuditDia"
      :before-close="auditCancelDia">
      <!-- 审核组件 -->
      <audit-list
        v-if="showAuditDia"
        :range="timeAt"
        :refund-no="mainForm.refundNo"
        @updateModel="auditCancelDia"
      />
    </el-dialog>
  </div>
</template>

<script>
import AuditList from './auditList.vue';
import {returnrefundPage, returnrefundNum} from '@/api/order/afterSale';

export default {
  name: 'ReturnAudit',
  components: {AuditList},
  computed: {
    curType: function () {
      return arg => this.mainForm.status === arg ? 'primary' : '';
    },
    curClass: function () {
      return arg => this.mainForm.status === arg ? '' : 'red-dot';
    }
  },
  data () {
    return {
      numSts: {},
      timeAt: [],
      mainForm: {
        refundNo: '',
        startTime: '',
        endTime: '',
        status: '', // 0 - 待处理 1 - 已处理 2 - 已拒绝
      },
      pager: {
        size: 10,
        total: 0,
        curPage: 1,
      },
      tableData: [],
      showAuditDia: false,
    }
  },
  mounted () {
    this.returnrefundPageReq();
    this.returnrefundNumReq();
  },
  methods: {
    // 修改搜索状态值
    changeTab (status) {
      this.tableData = [];
      this.mainForm.status = status;
      this.pager.curPage = 1;
      this.returnrefundPageReq();
    },
    // 格式化
    formatter (row, column) {
      let key = column.property;

      if (key == 'createTime' || key == 'operTime') {
        return this.formatDate(row[key], 'YYYY-MM-DD HH:mm:ss', '-');
      } else if (key == 'refundAmount') {
        let value = Number(row[key] || 0);
        return value ? '￥' + value.toFixed(2) : 0;
      } else if (key == 'status') {
        let value = row[key];
        return value == 0 ? '待处理' : value == 1 ? '已处理' : value == 2 ? '已拒绝' : '-';
      } else {
        return row[key] || '-';
      }
    },
    // 格式日期功能
    formatDate (date, format = 'YYYY-MM-DD', def = '') {
      return date ? this.$dayjs(date).format(format) : def;
    },
    // 退款状态统计
    async returnrefundNumReq () {
      try {
        const {data} = await returnrefundNum();
        this.numSts = data;
      } catch (error) {
        throw error;
      }
    },
    // 获取退款列表
    async returnrefundPageReq () {
      try {
        let [startTime, endTime] = this.timeAt || [];
        this.mainForm.startTime = startTime || '';
        this.mainForm.endTime = endTime || '';

        const {code, message, data: {list, pageSize, total}} = await returnrefundPage({
          ...this.mainForm,
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
        // ...
      }
    },
    // 条件搜索
    onSearch () {
      this.pager.curPage = 1;
      this.returnrefundPageReq();
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
    // 查看-审核
    handleTabBtn({id}, type) {
      const query = {id};
      const curView = this.$route;
      const path = type == 'Audit' ? 'returnAuditHandle' : 'returnAuditDetail';

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          this.$router.replace({path, query});
        });
      });
    },
    // 取消批量审核
    auditCancelDia() {
      this.showAuditDia = false;
      this.returnrefundNumReq();
      this.returnrefundPageReq();
    },
    // 批量审核
    batchAuditHandle() {
      this.showAuditDia = true;
    }
  }
}
</script>

<style lang="scss" scoped>
  .return-audit-wrap {
    padding: 20px;
    .top-search  {
      .align-width {
        width: 250px;
      }
      .el-form-item {
        margin-right: 20px;
        ::v-deep .el-form-item__label {
          font-weight: 400;
        }
      }
      .red-dot {
        color: #f56c6c;
        vertical-align: middle;
      }
      .top-tab {
        .el-button:hover {
          span.red-dot {
            color: #1890ff !important;
          }
        }
      }
    }
  }
</style>
