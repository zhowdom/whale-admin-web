<template>
  <div class="order-list-wrap">
    <div class="top-search">
      <el-row class="mb20">
        <el-col class="top-tab" :span="24">
          <el-button @click="changeTab('')" :type="curType('')" size="medium">
            全部订单(<span :class="curClass('')">{{orderSts.allNum}}</span>)
          </el-button>
          <el-button @click="changeTab(10)" :type="curType(10)" size="medium">
            待付款(<span :class="curClass(10)">{{orderSts.waitPayNum}}</span>)
          </el-button>
          <el-button @click="changeTab(20)" :type="curType(20)" size="medium">
            待发货(<span :class="curClass(20)">{{orderSts.waitDeliver}}</span>)
          </el-button>
          <el-button @click="changeTab(40)" :type="curType(40)" size="medium">
            已发货(<span :class="curClass(40)">{{orderSts.endDeliver}}</span>)
          </el-button>
          <el-button @click="changeTab(80)" :type="curType(80)" size="medium">
            已完成(<span :class="curClass(80)">{{orderSts.completeNum}}</span>)
          </el-button>
          <el-button @click="changeTab(90)" :type="curType(90)" size="medium">
            已关闭(<span :class="curClass(90)">{{orderSts.closeNum}}</span>)
          </el-button>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form ref="mainForm" inline :model="mainForm" label-width="90px">

            <el-form-item label="输入搜索:">
              <el-input class="align-width" v-model="mainForm.orderNoOrProductName" clearable placeholder="订单号/商品名称"></el-input>
            </el-form-item>

            <el-form-item label="下单人:">
              <el-input class="align-width" v-model="mainForm.memberPhoneOrName" clearable placeholder="下单人姓名/手机"></el-input>
            </el-form-item>

            <el-form-item label="供应商:">
              <el-select class="align-width" clearable v-model="mainForm.sellerId" placeholder="请选择供应商">
                <el-option v-for="{id, name} in suppliers" :key="id" :label="name" :value='id'></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="自营:">
              <el-select class="align-width" clearable v-model="mainForm.businessId" placeholder="请选择">
                <el-option label="本平台自营" value='0'></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="提交时间:">
              <el-date-picker
                class="align-width"
                v-model="registerAt"
                type="daterange"
                :editable="false"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item class="fr mr0">
              <el-button type="primary" :loading="loadingTable" @click="onSearch" v-hasPermi="['operation:order:page']">查询</el-button>
              <el-button type="primary" :loading="loadingTable" @click="batchHandle" v-hasPermi="['operation:order:deliverPage']">批量发货</el-button>
              <el-button type="primary" v-if="mainForm.orderStatus==20" :loading="loadingTable" @click="batchReturnHandle" v-hasPermi="['operation:returnrefund:batchRefund']">批量退款</el-button>
              <el-button type="primary" :loading="loadingTable" @click="exportOrder" v-hasPermi="['operation:order:export']">导出订单</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>

    <div class="mgmt-table">
      <el-table border :data="tableData" v-loading="loadingTable">
        <el-table-column prop="orderNo" align="center" label="主订单编号" :formatter="formatter"></el-table-column>
        <!-- <el-table-column prop="itemOrderNo" align="center" label="子订单编号" :formatter="formatter"></el-table-column> -->
        <el-table-column prop="itemName" align="center" label="商品名称" :formatter="formatter" width="170"></el-table-column>
        <el-table-column prop="memberNickName" align="center" label="下单人" :formatter="formatter"></el-table-column>
        <el-table-column prop="memberPhone" align="center" label="下单人手机号" :formatter="formatter"></el-table-column>
        <el-table-column prop="createTime" align="center" label="提交时间" :formatter="formatter"></el-table-column>
        <!-- <el-table-column prop="memberAccount" align="center" label="用户账号" :formatter="formatter"></el-table-column> -->
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
        <el-table-column prop="payWay" align="center" label="支付类型">
          <template scope="scope">
            <p v-if="+scope.row.payWay === 1">自由支付</p>
            <p v-else-if="+scope.row.payWay === 2">现金+Candy支付</p>
            <p v-else-if="+scope.row.payWay === 3">纯Candy支付</p>
          </template>
        </el-table-column>
        <el-table-column prop="orderPayWhalePeas" align="center" label="订单金额（Candy）"></el-table-column>
        <el-table-column prop="orderAmount" align="center" label="订单金额（USDT）" :formatter="formatter"></el-table-column>
        <el-table-column prop="sellerName" align="center" label="供应商" :formatter="formatter"></el-table-column>
        <el-table-column prop="orderSource" align="center" label="订单来源" :formatter="formatter"></el-table-column>
        <el-table-column prop="orderStatus" align="center" label="订单状态" :formatter="formatter"></el-table-column>
        <el-table-column align="center" label="操作" width="230">
          <template slot-scope="{row}">
            <el-button class="mb5" size="mini" type="primary" v-hasPermi="['operation:order:info']" @click="handleTabBtn(row, 1)">查看订单</el-button>
            <el-button class="mb5" size="mini" v-if="row.orderStatus==20&&row.source==2" type="success" v-hasPermi="['operation:order:deliverPage']" @click="singleOrderPost(row)">订单发货</el-button>
            <el-button class="mb5" size="mini" v-if="![10,20,70,90].includes(row.orderStatus)" type="info" v-hasPermi="['operation:order:express']" @click="handleTabBtn(row, 3)">订单跟踪</el-button>
            <el-button class="mb5" size="mini" v-if="row.orderStatus==40" type="danger" v-hasPermi="['operation:order:updateLogisticsNum']" @click="editmmsNo(row)">修改运单</el-button>
            <!-- <el-button class="mb5" size="mini" v-if="row.orderStatus==90" type="danger" v-hasPermi="['']" @click="handleDelBtn(row, 5)">删除订单</el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <div class="table-pagination text-right mt10">
        <el-pagination
          v-if="pageShow"
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

    <!-- 修改运单号弹窗 -->
    <el-dialog
      center
      ref="diaForm"
      width="420px"
      title="修改物流单号"
      :close-on-click-modal="false"
      :visible.sync="shwoDia"
      :before-close="cancelDia">

      <el-form class="custom-form" :model="editMmsNo" :rules="rules" ref="editMmsNo" label-width="100px">
        <el-form-item label="物流公司" prop="logisticsCode">
          <el-select class="align-width" clearable v-model="editMmsNo.logisticsCode" placeholder="请选择">
            <el-option v-for="{code, name} in mms" :key="code" :label="name" :value='code'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号" prop="logisticsNum">
          <el-input class="align-width" v-model="editMmsNo.logisticsNum" clearable placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDia">取 消</el-button>
        <el-button type="primary" @click="confirmDia">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 发货弹窗 -->
    <el-dialog
      center
      ref="postdiaForm"
      width="86%"
      title="发货"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :visible.sync="showPostDia"
      :before-close="postCancelDia">
      <!-- 发货组件 -->
      <post-list
        v-if="showPostDia"
        :id="postModelId"
        :range="registerAt"
        :member-o-phone="mainForm.memberPhoneOrName"
        :order-o-name="mainForm.orderNoOrProductName"
        :seller-id="mainForm.sellerId"
        @updateModel="postCancelDia"
      />
    </el-dialog>

    <!-- 退款弹窗 -->
    <el-dialog
      center
      width="86%"
      title="退款"
      ref="returndiaForm"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :visible.sync="showReturnDia"
      :before-close="returnCancelDia">
      <!-- 退款组件 -->
      <return-list
        v-if="showReturnDia"
        :range="registerAt"
        :seller-id="mainForm.sellerId"
        @updateModel="returnCancelDia"
        :member-o-phone="mainForm.memberPhoneOrName"
        :order-o-name="mainForm.orderNoOrProductName"
      />
    </el-dialog>
  </div>
</template>

<script>
import mms from '@/utils/mss';
import {saveAs} from 'file-saver';
import PostList from './shippingList.vue';
import ReturnList from './returnList.vue';
import {supplierList} from '@/api/supplier/supplier';
import {statusNum, orderList, orderExport, getLogisticsInfo, updateLogisticsNum} from '@/api/order/list';

export default {
  name: 'OrderList',
  components: {PostList, ReturnList},
  computed: {
    curType: function () {
      return arg => this.mainForm.orderStatus === arg ? 'primary' : '';
    },
    curClass: function () {
      return arg => this.mainForm.orderStatus === arg ? '' : 'red-dot';
    }
  },
  data () {
    return {
      mms,
      orderSts: {},
      source: {
        1: '供应商',
        2: '自营',
      },
      payType: {
        1: '支付宝',
        2: '微信',
        3: '余额'
      },
      platformType: {
        0: '自己的管理后台',
        1: '供应商后台',
      },
      orderSource: {
        0: 'app订单',
        1: 'pc端订单',
      },
      mainForm: {
        orderNoOrProductName: '',
        memberPhoneOrName: '',
        sellerId: null,
        businessId: null,
        startTime: null,
        endTime: null,
        orderStatus: '',
        // 订单状态 10待付款 20待发货 40待收货 50已收货-待评价 60已评价 70售后中 80已完成 90已关闭
      },
      editMmsNo: {
        logisticsCode: '',
        logisticsNum: '',
      },
      shwoDia: false,
      registerAt: [],
      suppliers: [],
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
      rules: {
        logisticsCode: [
          { required: true, message: '选择不能为空', trigger: 'change' },
        ],
        logisticsNum: [
          { required: true, message: '输入不能为空', trigger: 'blur'},
          { type: 'string', min: 1, max: 20, message: '输入长度1-20个字符', trigger: 'blur' },
        ],
      },
      curMmsInfo: {},
      showPostDia: false,
      postModelId: null,
      pageShow: false,
      loadingTable: false,
      showReturnDia: false,
    }
  },
  mounted () {
    this.statusNumReq();
    // 判断上一次的查询状态
    if (this.$route.query.originFlag === 'returnButon') {

      this.mainForm.orderNoOrProductName = this.$store.getters.orderlistBeforeSearchStatus.orderNoOrProductName
      this.mainForm.memberPhoneOrName = this.$store.getters.orderlistBeforeSearchStatus.memberPhoneOrName
      this.mainForm.sellerId = this.$store.getters.orderlistBeforeSearchStatus.sellerId
      this.mainForm.businessId = this.$store.getters.orderlistBeforeSearchStatus.businessId
      this.mainForm.orderStatus = this.$store.getters.orderlistBeforeSearchStatus.orderStatus
      this.pager.size = this.$store.getters.orderlistBeforeSearchStatus.pageSize
      this.pager.curPage = this.$store.getters.orderlistBeforeSearchStatus.currentPage

      if (!this.$store.getters.orderlistBeforeSearchStatus.startTime || !this.$store.getters.orderlistBeforeSearchStatus.endTime) {
        this.registerAt = []
      } else {
        this.registerAt = [
          this.$store.getters.orderlistBeforeSearchStatus.startTime,
          this.$store.getters.orderlistBeforeSearchStatus.endTime,
        ]
      }
      this.orderListReq(this.$store.getters.orderlistBeforeSearchStatus);

    } else {
      this.orderListReq();
    }
    this.supplierorderListReq();
  },
  methods: {
    // 获取供应商列表（不分页）
    async supplierorderListReq () {
      try {
        let {data: {list}} = await supplierList();
        list = list || [];
        list.unshift({id: ' ', name: '全部'});
        this.suppliers = list;
      } catch (error) {
        throw error;
      }
    },
    // 订单状态数据
    async statusNumReq () {
      try {
        const {data} = await statusNum();
        this.orderSts = data;
      } catch (error) {
        throw error;
      }
    },
    // 订单导出
    async orderExportReq (reqData, cb, done) {
      try {
        const {data, status, filename} = await orderExport(reqData);

        if (status == 200) {
          let bob = new Blob([data], {type: 'application/vnd.ms-excel'});
          saveAs(bob, filename);
          this.$message.success('订单导出成功');
        } else {
          this.$message.error('导出错误');
        };
        cb.close();
        done();
      } catch (error) {
        cb.close();
        throw error;
      }
    },
    // 获取订单列表
    async orderListReq (_params) {
      try {
        this.loadingTable = true
        this.pageShow = false
        let [startTime, endTime] = this.registerAt || [];
        this.mainForm.startTime = startTime || '';
        this.mainForm.endTime = endTime || '';

        const {code, message, data: {list, pageSize, total, pageNum}} = await orderList(_params || {
          ...this.mainForm,
          pageSize: this.pager.size,
          currentPage: this.pager.curPage,
        });

        if (code == 200) {
          this.tableData = list;
          this.pager.size = pageSize;
          this.pager.total = total;
          this.pager.curPage = pageNum;
          this.$nextTick(() => {
            this.pageShow = true
          })
        } else {
          this.$message.error(message);
        }
        this.loadingTable = false
      } catch (error) {
        this.loadingTable = false
        throw error;
      }
    },
    // 获取运单号
    async getLogisticsInfoReq (orderNo) {
      try {
        let {data: {logisticsCode, logisticsNum, id}} = await getLogisticsInfo({orderNo});
        logisticsCode = logisticsCode || '';
        logisticsNum = logisticsNum || '';
        this.curMmsInfo = {...this.curMmsInfo, id};
        this.editMmsNo = {...this.editMmsNo, logisticsCode, logisticsNum};
      } catch (error) {
        throw error;
      }
    },
    // 更新运单号
    async updateLogisticsNumReq (cb) {
      try {
        let logisticsName;
        this.mms.some(({code, name}) => {
          if (code == this.editMmsNo.logisticsCode) {
            logisticsName = name;
            return true;
          }
        });
        await updateLogisticsNum({
          ...this.curMmsInfo,
          ...this.editMmsNo,
          logisticsName,
        });
        setTimeout(() => {
          cb.close();
          this.cancelDia();
          this.orderListReq();
        }, 1000);
      } catch (error) {
        cb.close();
        throw error;
      }
    },
    // 弹出修改运单弹窗
    editmmsNo ({orderNo}) {
      this.shwoDia = true;
      this.curMmsInfo = {orderNo};
      this.getLogisticsInfoReq(orderNo);
    },
    // 取消弹窗
    cancelDia () {
      this.shwoDia = false;
      this.curMmsInfo = {};
      this.$refs.editMmsNo.resetFields();
    },
    // 加载loading
    loadLoading (tg) {
      const target = this.$refs[tg].$el.firstChild;

      const loadinger = this.$loading({
        target,
        lock: true,
        text: '更新中...',
        spinner: 'el-icon-sunny',
        customClass: 'loadingAnim',
      });

      return loadinger;
    },
    // 确认弹窗
    confirmDia () {
      this.$refs.editMmsNo.validate(valid => {
        if (valid) {
          const loadinger = this.loadLoading('diaForm');
          this.updateLogisticsNumReq(loadinger);
        } else {
          return false;
        }
      });
    },
    // 取消弹窗发货
    postCancelDia () {
      this.showPostDia = false;
      this.postModelId = null;
      this.statusNumReq();
      this.orderListReq();
    },
    // 取消退货弹窗
    returnCancelDia() {
      this.showReturnDia = false;
      this.statusNumReq();
      this.orderListReq();
    },
    // 修改搜索状态值
    changeTab (status) {
      this.tableData = [];
      this.mainForm.orderStatus = status;
      this.pager.curPage = 1;
      this.orderListReq();
      this.$store.dispatch('setorderlistBeforeSearchStatus', {
        ...this.mainForm,
        pageSize: this.pager.size,
        currentPage: this.pager.curPage,
        orderStatus: this.mainForm.orderStatus
      })
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
      } else if (key == 'orderStatus') {
        // 订单状态 10待付款 20待发货 40待收货 50已收货-待评价 60已评价 70售后中 80已完成 90已关闭
        let value = row[key];
        let mainTxt = value == 10 ?'待付款'
          : value == 20 ? '待发货'
          : value == 40 ? '已发货'
          : value == 50 ? '已收货-待评价'
          : value == 60 ? '已评价'
          : value == 70 ? '售后中'
          : value == 80 ? '已完成'
          : value == 90 ? '已关闭'
          : '-';

        let style = {
          color: value == 20 ? '#51C1FF'
          : value == 40 || value == 80 || value == 90 ? '#999'
          : '',
        };

        let cell = h('div', {style}, mainTxt);

        return cell;
      } else if (key == 'n12') {
        return row[key] == 1 ? '换货' : '退货退款';
      } else {
        return row[key] || '-';
      };
    },
    // 格式日期功能
    formatDate (date, format = 'YYYY-MM-DD', def = '') {
      return date ? this.$dayjs(date).format(format) : def;
    },
    // 条件搜索
    onSearch () {
      this.pager.curPage = 1;
      this.orderListReq();
      this.$store.dispatch('setorderlistBeforeSearchStatus', {
        ...this.mainForm,
        pageSize: this.pager.size,
        currentPage: this.pager.curPage,
        orderStatus: this.mainForm.orderStatus
      })
    },
    // 分页数量修改
    handleSizeChange(val) {
      this.pager.size = val;
      this.orderListReq();
      this.$store.dispatch('setorderlistBeforeSearchStatus', {
        ...this.mainForm,
        pageSize: this.pager.size,
        currentPage: this.pager.curPage,
        orderStatus: this.mainForm.orderStatus
      })
    },
    // 跳转当前页
    handleCurrentChange(val) {
      this.pager.curPage = val;
      this.orderListReq();
      this.$store.dispatch('setorderlistBeforeSearchStatus', {
        ...this.mainForm,
        pageSize: this.pager.size,
        currentPage: this.pager.curPage,
        orderStatus: this.mainForm.orderStatus
      })
    },
    // 删除订单
    handleDelBtn ({id}) {
      this.$confirm('确定要删除该订单吗？', {
        type: 'warning',
        showClose: false,
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        // this.shippingPointDelReq(id);
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    // 批量发货
    batchHandle () {
      this.showPostDia = true;
    },
    // 批量退款
    batchReturnHandle() {
      this.showReturnDia = true;
    },
    // 单个订单发货
    singleOrderPost ({id}) {
      this.postModelId = id;
      this.showPostDia = true;
    },
    // 订单导出
    execDownload (cb, done) {
      let [startTime, endTime] = this.registerAt || [];
      this.mainForm.startTime = startTime || '';
      this.mainForm.endTime = endTime || '';
      let data = {...this.mainForm};

      // 导出数据方法
      this.orderExportReq(data, cb, done);
    },
    // 导出订单
    exportOrder () {
      const vm = this;
      const h = this.$createElement;
      const noData = this.tableData.length == 0;
      const style = {fontSize: '15px', display: 'block', padding: '10px 10px 30px'};
      const message = h('strong', {style}, '当前支持三个月内的订单导出！');
      if (noData) return this.$message.warning('当前查询条件暂无数据');

      this.$msgbox({
        title: '',
        message,
        center: true,
        showClose: false,
        closeOnClickModal: false,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonClass: 'ml30',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            const target = instance.$el.firstChild;
            const cb = this.$loading({
              target,
              lock: true,
              text: '导出中...',
              spinner: 'el-icon-sunny',
              customClass: 'loadingAnim',
            });
            // 发送请求
            setTimeout(() => {
              vm.execDownload(cb, done);
            }, 1200);
          } else {
            done();
          }
        }
      }).then(() => {
        // this.$message.success('订单导出成功');
      }).catch(() => {
        this.$message.info('已取消订单导出');
      });
    },
    // 查看
    handleTabBtn({id}, type) {
      const query = {id};
      const curView = this.$route;
      const path = type == 1 ? 'orderDetail'
        : 'orderTracking';

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
  .order-list-wrap {
    padding: 20px;
    .align-width {
      width: 250px;
    }
    .top-search  {
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

