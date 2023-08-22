<template>
  <div class="exchange-list-wrap">
    <div class="top-search">
      <el-row class="mb20">
        <el-col class="top-tab" :span="24">
          <el-button @click="changeTab('')" :type="curType('')" size="medium">
            全部(<span :class="curClass('')">{{orderSts.all}}</span>)
          </el-button>
          <el-button @click="changeTab(0)" :type="curType(0)" size="medium">
            待换货(<span :class="curClass(0)">{{orderSts.exchangeNum}}</span>)
          </el-button>
          <el-button @click="changeTab(1)" :type="curType(1)" size="medium">
            已换货(<span :class="curClass(1)">{{orderSts.exchangeEndNum}}</span>)
          </el-button>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form ref="mainForm" inline :model="mainForm" label-width="90px">

            <el-form-item label="原始订单号:">
              <el-input class="align-width" v-model="mainForm.orderNo" clearable placeholder="原始订单号"></el-input>
            </el-form-item>

            <el-form-item label="用户账号:">
              <el-input class="align-width" v-model="mainForm.memberAccount" clearable placeholder="用户账号"></el-input>
            </el-form-item>

            <el-form-item label="提交时间:">
              <el-date-picker
                class="align-width"
                v-model="range"
                type="daterange"
                :editable="false"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item class="fr mr0">
              <el-button type="primary" size="small" @click="onSearch" v-hasPermi="['operation:returnExchangeItem:listByPage']">查询</el-button>
              <el-button type="success" size="small" @click="batchHandle">批量换货</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>

    <div class="mgmt-table">
      <el-table border :data="tableData">
        <el-table-column prop="orderNo" align="center" label="订单编号" :formatter="formatter"></el-table-column>
        <el-table-column prop="operTime" align="center" label="状态生成时间" :formatter="formatter"></el-table-column>
        <el-table-column prop="memberAccount" align="center" label="用户账号" :formatter="formatter"></el-table-column>
        <el-table-column prop="status" align="center" label="订单状态" :formatter="formatter"></el-table-column>
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="{row}">
            <el-button class="mb5" size="mini" type="primary" @click="handleTabBtn(row)">查看</el-button>
            <el-button class="mb5" size="mini" type="success" v-if="row.status===0" @click="singleOrderPost(row)">换货</el-button>
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

    <!-- 发货弹窗 -->
    <el-dialog
      center
      width="86%"
      title="发货"
      ref="postdiaForm"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :visible.sync="shwoPostDia"
      :before-close="postCancelDia">
      <!-- 发货组件 -->
      <exchange-post-list
        v-if="shwoPostDia"
        :id="postModelId"
        :range="range"
        :member-o-phone="mainForm.memberAccount"
        :order-o-name="mainForm.orderNo"
        @updateModel="postCancelDia"
      />
    </el-dialog>
  </div>
</template>

<script>
import ExchangePostList from './shippingList.vue';
import {listByPage, totalNum} from '@/api/order/refund';

export default {
  name: 'ExchangeList',
  components: {ExchangePostList},
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
      orderSts: {},
      range: [],
      mainForm: {
        orderNo: '',
        memberAccount: '',
        startTime: null,
        endTime: null,
        status: '', // 0 待换货 1 已换货
      },
      pager: {
        size: 10,
        total: 0,
        curPage: 1,
      },
      tableData: [],
      pickerOptions: {
        disabledDate(time) {
          let now = new Date();
          let m = now.getMonth();
          let m_3 = new Date(now.setMonth(m - 3));
          return time.getTime() < m_3.getTime();
        },
      },
      curMmsInfo: {},
      shwoPostDia: false,
      postModelId: null,
    }
  },
  mounted () {
    this.totalNumReq();
    this.listByPageReq();
  },
  methods: {
    // 订单状态数据
    async totalNumReq () {
      try {
        const {data} = await totalNum();
        this.orderSts = data;
      } catch (error) {
        throw error;
      }
    },
    // 获取换货订单列表
    async listByPageReq () {
      try {
        let [startTime, endTime] = this.range || [];
        this.mainForm.startTime = startTime || '';
        this.mainForm.endTime = endTime || '';

        const {code, message, data: {list, pageSize, total}} = await listByPage({
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
    // 修改搜索状态值
    changeTab (status) {
      this.tableData = [];
      this.mainForm.status = status;
      this.pager.curPage = 1;
      this.listByPageReq();
    },
    // 格式化
    formatter (row, column) {
      let key = column.property;
      const h = this.$createElement;

      if (key == 'operTime') {
        return this.formatDate(row[key], 'YYYY-MM-DD HH:mm:ss', '-');
      } else if (key == 'status') {
        // 订单状态 0待换货 1已换货
        let mainTxt = row[key] === 0 ?'待换货'
          : row[key] === 1 ? '已换货'
          : '-';

        return h('div', null, mainTxt);
      } else {
        return row[key] || '-';
      };
    },
    // 格式日期功能
    formatDate (date, format = 'YYYY-MM-DD', def = '') {
      return date ? this.$dayjs(date).format(format) : def;
    },
    // 批量发货
    batchHandle () {
      this.shwoPostDia = true;
    },
    // 单个订单发货
    singleOrderPost ({id}) {
      this.postModelId = id;
      this.shwoPostDia = true;
    },
    // 取消弹窗发货
    postCancelDia () {
      this.shwoPostDia = false;
      this.postModelId = null;
      this.totalNumReq();
      this.listByPageReq();
    },
    // 条件搜索
    onSearch () {
      this.pager.curPage = 1;
      this.listByPageReq();
    },
    // 分页数量修改
    handleSizeChange(val) {
      this.pager.size = val;
      this.listByPageReq();
    },
    // 跳转当前页
    handleCurrentChange(val) {
      this.pager.curPage = val;
      this.listByPageReq();
    },
    // 查看
    handleTabBtn({id}) {
      const query = {id};
      const curView = this.$route;
      const path = 'exchangeDetail';

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
  .exchange-list-wrap {
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

