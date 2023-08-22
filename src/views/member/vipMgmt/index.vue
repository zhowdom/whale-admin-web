<template>
  <div class="vip-management">
    <div class="top-search">
      <el-form ref="vipForm" inline :rules="rules" :model="vipForm" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="用户真实姓名" prop="userName">
              <el-input class="align-width" v-model="vipForm.userName" clearable placeholder="请输入用户真实姓名"></el-input>
            </el-form-item>
            <el-form-item label="注册手机号" prop="phone">
              <el-input class="align-width" v-model="vipForm.phone" clearable placeholder="请输入注册手机号"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input class="align-width" v-model="vipForm.email" clearable placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item label="最后一次会员到期时间" label-width="170px" prop="expire">
              <el-date-picker
                class="align-width"
                v-model="expire"
                type="daterange"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="VIP过期状态" prop="statusType">
              <el-select class="align-width" v-model="vipForm.statusType" placeholder="请选择VIP过期状态">
                <el-option v-for="{label, value} in statusType" :label="label" :value='value' :key="value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="fr mr0">
              <el-button type="primary" @click="onSearch" v-hasPermi="['vip:info:page']">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="vip-management-table">
      <el-table border :data="vipTableData" style="width: 100%" @sort-change="vipTableSort">
        <el-table-column prop="memberId" align="center" label="用户ID" width="100" :formatter="formatter"></el-table-column>
        <el-table-column prop="registerAt" align="center" :formatter="formatter" label="注册时间"></el-table-column>
        <el-table-column prop="userName" align="center" label="用户真实姓名" :formatter="formatter"></el-table-column>
        <el-table-column prop="phone" align="center" label="注册手机号" :formatter="formatter"></el-table-column>
        <el-table-column prop="email" align="center" label="邮箱" :formatter="formatter"></el-table-column>
        <el-table-column prop="buyCount" align="center" label="购买VIP次数" :formatter="formatter" width="100"></el-table-column>
        <el-table-column prop="expireAt" align="center" sortable="custom" :formatter="formatter" label="VIP到期时间"></el-table-column>
        <el-table-column prop="firstBuyAt" align="center" sortable="custom" :formatter="formatter" label="最早成为VIP时间"></el-table-column>
        <el-table-column prop="lastBuyAt" align="center" sortable="custom" :formatter="formatter" label="最后购买VIP时间"></el-table-column>
        <el-table-column prop="totalPay" align="center" sortable="custom" label="购买VIP所花总金额（USDT）" :formatter="formatter" width="190px"></el-table-column>
        <el-table-column prop="statusType" align="center" label="VIP过期状态" :formatter="formatter" width="120"></el-table-column>
      </el-table>
      <div class="table-pagination text-right mt10">
        <el-pagination
          :current-page="pager.curPage"
          :page-sizes="[10, 20, 30]"
          :page-size="pager.size"
          :total="pager.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
      <el-dialog center :close-on-click-modal="false" title="购买记录" :visible.sync="showBuyTable" width="60%">
        <el-table border :data="buyTableData" style="width: 100%" @sort-change="buyTableSort">
          <el-table-column prop="vipItemTitle" align="center" label="购买VIP套餐" :formatter="formatter"></el-table-column>
          <el-table-column prop="payPrice" align="center" label="购买VIP金额（USDT）" :formatter="formatter"></el-table-column>
          <el-table-column prop="payWay" align="center" label="支付方式" :formatter="formatter"></el-table-column>
          <el-table-column prop="serialId" align="center" label="支付订单号" :formatter="formatter"></el-table-column>
          <el-table-column prop="buyAt" align="center" sortable="custom" :formatter="formatter" label="购买VIP时间"></el-table-column>
          <el-table-column prop="expireAt" align="center" sortable="custom" :formatter="formatter" label="VIP到期时间"></el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import payWays from '@/utils/payWay';
import {logPage, vipPage} from '@/api/setting/vip';

export default {
  name: 'VipManagement',
  data () {
    return {
      expire: [],
      vipForm: {
        userName: '',
        phone: '',
        email: '',
        statusType: -1,
        expireStart: '',
        expireEnd: '',
        orderItems: [
          // {
          //   asc: true,
          //   column: 'expire_at',
          // },
          // {
          //   asc: true,
          //   column: 'first_buy_at',
          // },
          // {
          //   asc: true,
          //   column: 'last_buy_at',
          // },
          // {
          //   asc: true,
          //   column: 'total_pay',
          // },
        ],
      },
      buyForm: {
        phone: '',
        email: '',
        userName: '',
        orderItems: [
          // {
          //   asc: true,
          //   column: 'expire_at',
          // },
          // {
          //   asc: true,
          //   column: 'buy_at',
          // }
        ],
      },
      rules: {
        phone: [
          {required: false, pattern: /^1[0-9]{10}$/, message: '手机号格式有误', trigger: 'blur'}
        ],
      },
      statusType: [
        {
          value: -1,
          label: '全部',
        },
        {
          value: 0,
          label: '已过期',
        },
        {
          value: 1,
          label: '未过期',
        },
      ],
      pager: {
        curPage: 1,
        size: 10,
        total: 0,
      },
      vipTableData: [],
      buyTableData: [],
      showBuyTable: false,
    }
  },
  mounted () {
    this.vipPageRequest();
  },
  methods: {
    // 格式化
    formatter (row, column) {
      let payWay = [];
      let statusType = [];
      let key = column.property;

      if (key == 'totalPay' || key == 'payPrice') {
        return row[key] || 0;
      } else if (key == 'buyCount') {
        const h = this.$createElement;
        const on = {click: () => this.handleClickData(row)};
        const style = {padding: '6px', borderBottom: '1px solid #57d092', cursor: 'pointer', display: 'inline-block'};

        return row[key] ? h('div', {style, on}, row[key]) : 0;
      } else if (key == 'statusType') {
        statusType = this.statusType.filter(e => e.value == row[key]);
        return statusType.length ? statusType[0].label : '-';
      } else if (key == 'payWay') {
        payWay = payWays.filter(e => e.value == row[key]);
        return payWay.length ? payWay[0].label : '-';
      } else if (key == 'registerAt' || key == 'firstBuyAt' || key == 'lastBuyAt' || key == 'buyAt' || key == 'expireAt') {
        return this.formatDate(row[key], 'YYYY-MM-DD HH:mm:ss', '-');
      } else {
        return row[key] || '-';
      }
    },
    // vip用户管理表格排序
    vipTableSort ({prop, order}) {
      const asc = order == 'ascending'; // 是否升序
      const column = this.formatStr(prop); // 格式字符串
      this.$set(this.vipForm.orderItems, 0, {column, asc});
      this.vipPageRequest();
    },
    // vip购买记录表格排序
    buyTableSort ({prop, order}) {
      const asc = order == 'ascending'; // 是否升序
      const column = this.formatStr(prop); // 格式字符串
      this.$set(this.buyForm.orderItems, 0, {column, asc});
      this.logPageRequest();
    },
    // 格式日期功能
    formatDate (date, format = 'YYYY-MM-DD', def = '') {
      return date ? this.$dayjs(date).format(format) : def;
    },
    // 格式小驼峰为下划线功能
    formatStr (str) {
      return str ? str.replace(/([A-Z])/g, "_$1").toLowerCase() : '';
    },
    // 处理表格点击时产生的数据
    handleClickData ({userName, phone}) {
      this.buyTableData = [];
      this.buyForm = {...this.buyForm, userName, phone};
      this.logPageRequest();
      this.showBuyTable = true;
    },
    // 查询vip用户分页数据
    async vipPageRequest () {
      try {
        const [expireStart, expireEnd] = this.expire || [];
        this.vipForm.expireEnd = expireEnd || '';
        this.vipForm.expireStart = expireStart || '';

        const rqData = {
          ...this.vipForm,
          pageSize: this.pager.size,
          currentPage: this.pager.curPage
        };

        const {code, message, data: {list, pageSize, total}} = await vipPage(rqData);
        if (code == 200) {
          this.vipTableData = list;
          this.pager.size = pageSize;
          this.pager.total = total;
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
    // 查询vip购买记录分页数据
    async logPageRequest () {
      try {
        const {code, message, data: {list}} = await logPage(this.buyForm);
        if (code == 200) {
          this.buyTableData = list;
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
      this.$refs.vipForm.validate(valid => {
        if (valid) {
          this.vipPageRequest();
        } else {
          this.$message({type: 'error', message: '手机号格式有误！'});
          return false;
        }
      });
    },
    // 分页数量修改
    handleSizeChange(val) {
      this.pager.curPage = 1;
      this.pager.size = val;
      this.vipPageRequest();
    },
    // 跳转当前页
    handleCurrentChange(val) {
      this.pager.curPage = val;
      this.vipPageRequest();
    },
  }
}
</script>

<style lang="scss" scoped>
  .vip-management {
    padding: 20px;
    .top-search  {
      .align-width {
        width: 270px;
      }
      .el-form-item {
        margin-right: 36px;
        ::v-deep .el-form-item__label {
          font-weight: 400;
        }
        button {
          padding: 10px 30px;
        }
      }
    }
  }
</style>
