<template>
  <div class="refund-audit-wrap">
    <div class="top-search">
      <el-row class="mb20">
        <el-col class="top-tab" :span="24">
          <el-button @click="changeTab('')" :type="curType('')" size="medium">
            全部申请(<span :class="curClass('')">{{numSts.all||0}}</span>)
          </el-button>
          <el-button @click="changeTab(1)" :type="curType(1)" size="medium">
            待处理(<span :class="curClass(1)">{{numSts.audit||0}}</span>)
          </el-button>
          <el-button @click="changeTab(3)" :type="curType(3)" size="medium">
            退货退款中(<span :class="curClass(3)">{{numSts.returnIng||0}}</span>)
          </el-button>
          <el-button @click="changeTab(6)" :type="curType(6)" size="medium">
            换货中(<span :class="curClass(6)">{{numSts.exchange||0}}</span>)
          </el-button>
          <el-button @click="changeTab(4)" :type="curType(4)" size="medium">
            已完成(<span :class="curClass(4)">{{numSts.completed||0}}</span>)
          </el-button>
          <el-button @click="changeTab(5)" :type="curType(5)" size="medium">
            已拒绝(<span :class="curClass(5)">{{numSts.refuse||0}}</span>)
          </el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form ref="mainForm" inline :model="mainForm" label-width="90px">

            <el-form-item label="服务单号:">
              <el-input class="align-width" v-model="mainForm.returnRefundReturnItemNo" clearable placeholder="请输入服务单号"></el-input>
            </el-form-item>

            <el-form-item label="用户账户:">
              <el-input class="align-width" v-model="mainForm.memberAccount" clearable placeholder="请输入用户账户"></el-input>
            </el-form-item>

            <el-form-item label="售后方式:">
              <el-select class="align-width" clearable v-model="mainForm.type" placeholder="请选择售后方式">
                <el-option label="换货" :value='2'></el-option>
                <el-option label="退货退款" :value='3'></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="订单来源:">
              <el-select class="align-width" clearable v-model="mainForm.source" placeholder="请选择订单来源">
                <el-option label="供应商" :value='1'></el-option>
                <el-option label="自营" :value='2'></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="申请时间:">
              <el-date-picker
                clearable
                type="daterange"
                class="align-width"
                v-model="range"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item class="fr mr0">
              <el-button type="primary" @click="onSearch" v-hasPermi="['operation:returnRefundReturnItem:listByPage']">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>

    <div class="mgmt-table">
      <el-table border :data="tableData">
        <el-table-column prop="returnRefundReturnItemNo" align="center" label="服务单号" :formatter="formatter"></el-table-column>
        <el-table-column prop="source" align="center" label="商品订单来源" :formatter="formatter"></el-table-column>
        <el-table-column prop="createTime" align="center" label="申请时间" :formatter="formatter" width="170"></el-table-column>
        <el-table-column prop="memberAccount" align="center" label="用户账号" :formatter="formatter"></el-table-column>
        <el-table-column prop="refundAmount" align="center" label="退款金额" :formatter="formatter"></el-table-column>
        <el-table-column prop="itemPayWhalePeas" align="center" label="退还Candy"></el-table-column>
        <el-table-column prop="memberNickName" align="center" label="联系人" :formatter="formatter"></el-table-column>
        <el-table-column prop="type" align="center" label="申请类型" :formatter="formatter"></el-table-column>
        <el-table-column prop="status" align="center" label="申请状态" :formatter="formatter" width="170"></el-table-column>
        <el-table-column prop="operTime" align="center" label="处理时间" :formatter="formatter" width="170"></el-table-column>
        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="{row}">
            <el-button size="mini" type="primary" v-if="row.status==1" @click="handleTabBtn(row, 'Audit')">审核</el-button>
            <el-button size="mini" type="warning" @click="handleTabBtn(row, 'Detail')">查看</el-button>
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
  </div>
</template>

<script>
import {statusNum, pageList} from '@/api/order/refund';
// 1待审核 2审核通过-待买家填写物流信息 3退货退款中 4已完成 5以拒绝 6换货中-用户已填写

export default {
  name: 'RefundAudit',
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
      mainForm: {
        source: '', // 订单来源 1:供应商 2:自营
        status: '',
        type: '', // 申请类型 3退货退款 2换货
        memberAccount: '',
        startTime: '',
        endTime: '',
        returnRefundReturnItemNo: '',
      },
      range: [],
      numSts: {},
      pager: {
        size: 10,
        total: 0,
        curPage: 1,
      },
      tableData: [],
    }
  },
  mounted () {
    this.pageListReq();
    this.statusNumReq();
  },
  methods: {
    // 修改搜索状态值
    changeTab (status, count) {
      this.tableData = [];
      this.mainForm.status = status;
      this.pageListReq();
    },
    // 格式化
    formatter (row, column) {
      let key = column.property;
      const h = this.$createElement;

      if (key == 'createTime' || key == 'operTime') {
        return this.formatDate(row[key], 'YYYY-MM-DD HH:mm:ss', '-');
      } else if (key == 'refundAmount') {
        let type = row['type'];
        let value = Number(row[key] || 0);
        return type == 2 ? '-' : (value ? '￥' + value.toFixed(2) : 0);
      } else if (key == 'status') {
        let value = row[key];
        let mainTxt = value == 1 ?'待审核'
          : value == 2 ? '审核通过'
          : value == 3 ? '退货退款中'
          : value == 4 ? '已完成'
          : value == 5 ? '已拒绝'
          : value == 6 ? '换货中'
          : '-';
        let hasSubTxt = value == 2 || value == 3 || value == 6;

        let subTxt = value == 2 ? '待买家填写物流信息'
          : value == 3 || value == 6 ? '用户已填写'
          : '';

        let subTxtSty = {
          color: value == 2 ? '#1ABC9C'
          : value == 3 || value == 6 ? '#FF9900'
          : '',
        };

        let cell = h('div', [
          h('div', mainTxt),
          hasSubTxt ? h('div', {style: subTxtSty}, subTxt) : null
        ]);

        return cell;
      } else if (key == 'type') {
        return row[key] == 2 ? '换货' : '退货退款';
      } else if (key == 'source') {
        return row[key] == 1 ? '供应商' : '自营';
      } else {
        return row[key] || '-';
      }
    },
    // 格式日期功能
    formatDate (date, format = 'YYYY-MM-DD', def = '') {
      return date ? this.$dayjs(date).format(format) : def;
    },
    // 状态统计
    async statusNumReq () {
      try {
        const {data} = await statusNum();
        this.numSts = data || {};
      } catch (error) {
        throw error;
      }
    },
    // 获取待审核商品列表
    async pageListReq () {
      try {
        let [startTime, endTime] = this.range || [];
        this.mainForm.startTime = startTime || '';
        this.mainForm.endTime = endTime || '';

        const {code, message, data: {list, pageSize, total}} = await pageList({
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
        throw error;
      }
    },
    // 条件搜索
    onSearch () {
      this.pager.curPage = 1;
      this.pageListReq();
    },
    // 分页数量修改
    handleSizeChange(val) {
      this.pager.size = val;
      this.pageListReq();
    },
    // 跳转当前页
    handleCurrentChange(val) {
      this.pager.curPage = val;
      this.pageListReq();
    },
    // 查看-审核
    handleTabBtn({id}, arg) {
      const curView = this.$route;
      const query = {id};
      const path = arg == 'Audit' ? 'refundAuditHandle' : 'refundAuditDetail';

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          this.$router.replace({path, query});
        });
      });
    },
  }
}
</script>

<style lang="scss" scoped>
  .refund-audit-wrap {
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

