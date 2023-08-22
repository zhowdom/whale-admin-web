<template>
  <div class="vip-purchase">
    <div class="top-search">
      <el-form ref="vipForm" inline :rules="rules" :model="vipForm" label-width="90px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="购买VIP时间" prop="buy">
              <el-date-picker
                class="align-width"
                v-model="buy"
                type="daterange"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="到期时间" prop="expire">
              <el-date-picker
                class="align-width"
                v-model="expire"
                type="daterange"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="真实姓名" prop="userName">
              <el-input class="align-width" v-model="vipForm.userName" placeholder="请输入真实姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input class="align-width" v-model="vipForm.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input class="align-width" v-model="vipForm.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item label="支付方式" prop="payWay">
              <el-select class="align-width" v-model="vipForm.payWay" placeholder="请选择支付方式">
                <el-option v-for="{label, value} in payWays" :label="label" :value='value' :key="value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="fr mr0">
              <el-button type="primary" @click="onSearch" v-hasPermi="['vip:info:buy:log:page']">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="vip-table">
      <el-table border :data="tableData" style="width: 100%" @sort-change="sortFunction">
        <el-table-column prop="memberId" align="center" label="用户ID" width="100" :formatter="formatter"></el-table-column>
        <el-table-column prop="userName" align="center" label="真实姓名" :formatter="formatter"></el-table-column>
        <el-table-column prop="phone" align="center" label="手机号" :formatter="formatter"></el-table-column>
        <el-table-column prop="email" align="center" label="邮箱" :formatter="formatter"></el-table-column>
        <el-table-column prop="vipItemTitle" align="center" label="购买VIP套餐" :formatter="formatter" width="120"></el-table-column>
        <el-table-column prop="payPrice" align="center" sortable="custom" label="购买VIP金额（USDT）" :formatter="formatter"></el-table-column>
        <el-table-column prop="payWay" align="center" label="支付方式" :formatter="formatter" width="120"></el-table-column>
        <el-table-column prop="serialId" align="center" label="支付订单号" :formatter="formatter"></el-table-column>
        <el-table-column prop="buyAt" align="center" sortable="custom" :formatter="formatter" label="购买VIP时间"></el-table-column>
        <el-table-column prop="expireAt" align="center" sortable="custom" :formatter="formatter" label="VIP到期时间"></el-table-column>
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
    </div>
  </div>
</template>

<script>
import payWays from '@/utils/payWay';
import {logPage} from '@/api/setting/vip';

export default {
  name: 'VipPurchase',
  data () {
    return {
      payWays,
      expire: [],
      buy: [],
      vipForm: {
        userName: '',
        phone: '',
        email: '',
        payWay: '',
        expireStart: '',
        expireEnd: '',
        buyStart: '',
        buyEnd: '',
        orderItems: [
          // {
          //   asc: true,
          //   column: 'pay_price',
          // },
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
      pager: {
        curPage: 1,
        size: 10,
        total: 0,
      },
      tableData: [],
    }
  },
  mounted () {
    this.logPageRequest();
  },
  methods: {
    // 格式化
    formatter (row, column) {
      let payWay = [];
      let key = column.property;

      if (key == 'payPrice') {
        return row[key] || 0;
      } else if (key == 'payWay') {
        payWay = this.payWays.filter(e => e.value == row[key]);
        return payWay.length ? payWay[0].label : '-';
      } else if (key == 'buyAt' || key == 'expireAt') {
        return this.formatDate(row[key], 'YYYY-MM-DD HH:mm:ss', '-');
      } else {
        return row[key] || '-';
      }
    },
    // 排序
    sortFunction ({prop, order}) {
      const asc = order == 'ascending'; // 是否升序
      const column = this.formatStr(prop); // 格式字符串
      this.$set(this.vipForm.orderItems, 0, {asc, column});
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
    // 查询分页数据
    async logPageRequest () {
      try {
        const [buyStart, buyEnd] = this.buy || [];
        const [expireStart, expireEnd] = this.expire || [];

        this.vipForm.buyEnd = buyEnd || '';
        this.vipForm.buyStart = buyStart || '';
        this.vipForm.expireEnd = expireEnd || '';
        this.vipForm.expireStart = expireStart || '';

        const rqData = {
          ...this.vipForm,
          pageSize: this.pager.size,
          currentPage: this.pager.curPage
        };

        const {code, message, data: {list, pageSize, total}} = await logPage(rqData);
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
      this.$refs.vipForm.validate(valid => {
        if (valid) {
          this.logPageRequest();
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
      this.logPageRequest();
    },
    // 跳转当前页
    handleCurrentChange(val) {
      this.pager.curPage = val;
      this.logPageRequest();
    },
  }
}
</script>

<style lang="scss" scoped>
  .vip-purchase {
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
