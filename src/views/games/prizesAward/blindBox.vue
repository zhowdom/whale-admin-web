<template>
  <div class="blind-box">
    <el-form :model="mainForm" :rules="rules" ref="mainForm" size="small" :inline="true">
      <el-form-item class="mr20" label="昵称" prop="memberName">
        <el-input
          v-model="mainForm.memberName" placeholder="输入昵称" clearable
        />
      </el-form-item>
      <el-form-item class="mr20" label="手机号" prop="phone">
        <el-input
          v-model="mainForm.phone" placeholder="输入手机号" clearable maxlength="11"
        />
      </el-form-item>
      <el-form-item class="mr20" label="盲盒编号" prop="blindBoxNo">
        <el-input
          v-model="mainForm.blindBoxNo" placeholder="请输入" clearable
        />
      </el-form-item>
      <el-form-item class="mr20" label="当前期编号" prop="currentPeriodNo">
        <el-input
          v-model="mainForm.currentPeriodNo" placeholder="请输入" clearable
        />
      </el-form-item>
      <el-form-item class="mr20" label="盲盒系列" prop="blindBoxSerie">
        <el-input
          v-model="mainForm.blindBoxSerie" placeholder="请输入" clearable
        />
      </el-form-item>
      <el-form-item class="mr20" label="盲盒描述" prop="blindBoxDesc">
        <el-input
          v-model="mainForm.blindBoxDesc" placeholder="请输入" clearable
        />
      </el-form-item>
      <el-form-item class="mr20" label="发货状态" prop="deliverType">
        <el-select clearable v-model="mainForm.deliverType" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="未发货" :value="0"></el-option>
          <el-option label="已发货" :value="1"></el-option>
          <el-option label="部分发货" :value="2"></el-option>
          <el-option label="出售中" :value="3"></el-option>
          <el-option label="已出售" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="mr20" label="添加收获信息" prop="addAddressType">
        <el-select clearable v-model="mainForm.addAddressType" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="已添加" :value="1"></el-option>
          <el-option label="未添加" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="mr20" label="盲盒类型" prop="blindBoxType">
        <el-select clearable v-model="mainForm.blindBoxType" placeholder="请选择">
          <el-option label="全部" :value="-1"></el-option>
          <el-option label="魔力盲盒专场" :value="1"></el-option>
          <el-option label="Candy销毁专场" :value="2"></el-option>
          <el-option label="魔力小盲盒" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="mr20" label="更新时间">
        <el-date-picker
          type="daterange"
          :editable="false"
          :clearable="true"
          v-model="range"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item class="fr mr0">
        <el-button v-hasPermi="['blindBox:distribution:listByPage']" type="primary" :loading="loading" icon="el-icon-search" @click="onSearch">查询</el-button>
        <el-button v-hasPermi="['game:prizeDistribution:exportExcel']" type="primary" :loading="loading" icon="el-icon-download" @click="exportOrder">导出</el-button>
        <el-button v-hasPermi="['blindBox:distribution:batchListByPage']" type="primary" :loading="loading" icon="el-icon-receiving" @click="batchHandle">批量发货</el-button>
      </el-form-item>
    </el-form>

    <el-table
      border
      :data="tableData"
      v-loading="loading"
    >
      <el-table-column prop="blindBoxType" label="类型" align="center" width="120">
        <template slot-scope="{row:{blindBoxType}}">
          {{blindBoxType==1?'魔力盲盒专场':blindBoxType==2?'Candy销毁专场':''}}
        </template>
      </el-table-column>
      <el-table-column prop="currentPeriodNo" label="当前期编号" align="center" width="100"></el-table-column>
      <el-table-column prop="blindBoxNo" label="盲盒编号" align="center" width="100"></el-table-column>
      <el-table-column prop="blindBoxSerie" label="盲盒系列" align="center" width="100"></el-table-column>
      <el-table-column prop="prizeSource" label="奖品来源" align="center">
        <template slot-scope="{row}">盲盒抢购</template>
      </el-table-column>
      <el-table-column prop="blindBoxDesc" label="盲盒描述" align="center"></el-table-column>
      <el-table-column prop="periodNum" label="期数" align="center" width="100">
        <template slot-scope="{row}">
          <p v-if="row.periodNum" v-hasPermi="['blindBox:distribution:itemInfo']" class="underline-class" @click="showBoxList(row)">第{{row.periodNum}}期</p>
        </template>
      </el-table-column>
      <el-table-column prop="blindBoxNum" label="盲盒实物数量" align="center" width="100"></el-table-column>
      <el-table-column prop="memberName" label="昵称" align="center" width="120"></el-table-column>
      <el-table-column prop="phone" label="手机号" align="center" width="130"></el-table-column>
      <el-table-column prop="addAddressType" label="添加收货信息" align="center">
        <template slot-scope="{row:{addAddressType}}">{{addAddressType?'是':'否'}}</template>
      </el-table-column>
      <el-table-column prop="address" label="收货地址" align="center">
        <template slot-scope="{row:{deliveryMemberName,deliveryPhone,provinceName,cityName,areaName,address}}">
          <div class="text-left">
            联系人：{{deliveryMemberName}} <br>
            手机号：{{deliveryPhone}} <br>
            地址：{{provinceName+cityName+areaName+address}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="deliverType" label="发货状态" align="center">
        <template slot-scope="{row:{deliverType}}">
          {{deliverType==0?'未发货':deliverType==1?'已发货':deliverType==2?'部分发货':deliverType==3?'出售中':deliverType==4?'已出售':''}}
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" align="center" width="160">
        <template slot-scope="{row:{updateTime}}">{{format(updateTime)}}</template>
      </el-table-column>
      <el-table-column prop="operName" label="操作人" align="center"></el-table-column>
      <el-table-column label="操作" width="160" align="center">
        <template slot-scope="{row}">
          <el-button type="text" @click="seeDetailClick(row)">查看</el-button>
          <template v-if="(row.deliverType==0||row.deliverType==2)&&row.addAddressType==1">
            <el-button type="text" v-hasPermi="['blindBox:distribution:addAddress']" @click="addOrEditAddressClick(row)">编辑收件地址</el-button>
            <el-button type="text" v-hasPermi="['blindBox:distribution:batchAddLogisticsNum']" @click="singleOrderPost(row)">添加快递单号</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="text-right mt20"
      :total="pager.total"
      :page-size="pager.size"
      :page-sizes="[10, 20, 30]"
      :current-page="pager.curPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <!-- 发货弹窗 -->
    <el-dialog
      center
      :width="diaWidth"
      :title="diaTitle"
      ref="postdiaForm"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :visible.sync="shwoPostDia"
      :before-close="postCancelDia">
      <!-- 盲盒实物列表 -->
      <box-list
        v-if="diaType==1"
        :id="postModelId"
        @updateModel="postCancelDia"
      />
      <!-- 查看发货详情组件 -->
      <pzd-details
        v-if="diaType==2"
        :id="postModelId"
        :info="curRow"
        @updateModel="postCancelDia"
      />
      <!-- 收货地址地址 -->
      <edit-addr
        v-if="diaType==3"
        :id="postModelId"
        :info="curRow"
        @updateModel="postCancelDia"
      />
      <!-- 发货组件 -->
      <post-list
        v-if="diaType==4"
        :id="postModelId"
        :range="range"
        :search="mainForm"
        @updateModel="postCancelDia"
      />
    </el-dialog>
  </div>
</template>

<script>
  import {saveAs} from 'file-saver';
  import PostList from './blindBox/shippingList.vue';
  import BoxList from './blindBox/boxList.vue';
  import PzdDetails from './blindBox/pzdDetails.vue';
  import EditAddr from './blindBox/editAddr.vue';
  import {list, exportExcel} from '@/api/games/bbPrizesAward.js';

  export default {
    name: 'BlindBox',
    components: {
      PostList, BoxList, PzdDetails, EditAddr
    },
    data () {
      return {
        range: [],
        mainForm: {
          memberName: '',
          phone: '',
          currentPeriodNo: '',
          blindBoxNo: '',
          blindBoxDesc: '',
          blindBoxSerie: '',
          addAddressType: '',
          deliverType: '',
          blindBoxType: -1,
        },
        pager: {
          size: 10,
          total: 0,
          curPage: 1,
        },
        tableData: [],
        loading: false,
        shwoPostDia: false,
        postModelId: null,
        diaType: 0, // 初始0 盲盒列表1 查看2 编辑3 发货4
        diaTitle: '',
        diaWidth: '50%',
        curRow: {},
        pickerOptions: {
          disabledDate(time) {
            let now = new Date();
            let m = now.getMonth();
            let m_3 = new Date(now.setMonth(m - 3));
            return time.getTime() < m_3.getTime();
          },
        },
        rules: {
          phone: [
            { required: false, pattern: /^1\d{10}$/, message: '手机号格式有误', trigger: 'blur' }
          ]
        }
      }
    },
    // 内置组件激活
    activated () {
      this.listReq();
    },
    methods: {
      // 时间格式化
      format(time, f = 'YYYY-MM-DD HH:mm:ss', d = '-') {
        return time ? this.$dayjs(time).format(f): d;
      },
      // 列表搜索
      async listReq() {
        this.loading = true;
        try {
          let [updateStartTime, updateEndTime] = this.range || ['', ''];
          updateEndTime = this.format(updateEndTime, 'YYYY-MM-DD', '');
          updateStartTime = this.format(updateStartTime, 'YYYY-MM-DD', '');

          const rqData = {
            ...this.mainForm,
            updateEndTime,
            updateStartTime,
            pageSize: this.pager.size,
            currentPage: this.pager.curPage,
          };
          const {code, message, data} = await list(rqData);

          if (code == 200) {
            this.tableData = data?.list || [];
            this.pager.size = data?.pageSize;
            this.pager.total = data?.total;
          } else {
            this.$message.error(message);
          };
          this.loading = false;
        } catch (error) {
          this.loading = false;
          throw error;
        }
      },
      // 条件搜索
      onSearch () {
        this.pager.curPage = 1;
        this.pager.size = 10;
        this.listReq();
      },
      // 取消弹窗发货
      postCancelDia () {
        this.shwoPostDia = false;
        this.diaType = 0;
        this.diaTitle = '';
        this.postModelId = null;
        this.listReq();
      },
      // 批量-发货
      batchHandle () {
        this.diaType = 4;
        this.diaTitle = '发货';
        this.diaWidth = '86%';
        this.shwoPostDia = true;
      },
      // 单个订单-发货
      singleOrderPost ({id}) {
        this.diaType = 4;
        this.diaWidth = '86%';
        this.postModelId = id;
        this.diaTitle = '发货';
        this.shwoPostDia = true;
      },
      // 查看某期的-盲盒列表
      showBoxList({currentPeriodNo, periodNum}) {
        this.diaType = 1;
        this.diaWidth = '86%';
        this.postModelId = currentPeriodNo;
        this.diaTitle = `盲盒实物(第${periodNum}期)`;
        this.shwoPostDia = true;
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
                vm.orderExportReq(cb, done);
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
      // 订单导出
      async orderExportReq (cb, done) {
        try {
          let [updateStartTime, updateEndTime] = this.range || ['', ''];
          updateEndTime = this.format(updateEndTime, 'YYYY-MM-DD', '');
          updateStartTime = this.format(updateStartTime, 'YYYY-MM-DD', '');
          const reqData = {...this.mainForm, updateEndTime, updateStartTime};
          const {data, status, filename} = await exportExcel(reqData);

          if (status == 200) {
            let bob = new Blob([data], {type: 'application/vnd.ms-excel'});
            saveAs(bob, filename);
            this.$message.success('导出成功');
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
      // 分页条数修改
      handleSizeChange(val) {
        this.pager.size = val;
        this.listReq();
      },
      // 跳转当前页
      handleCurrentChange(val) {
        this.pager.curPage = val;
        this.listReq();
      },
      // 查看详情
      seeDetailClick(row) {
        this.diaType = 2;
        this.curRow = row;
        this.diaWidth = '50%';
        this.diaTitle = '查看奖品发放管理详情';
        this.postModelId = row.id;
        this.shwoPostDia = true;
      },
      // 编辑
      addOrEditAddressClick(row) {
        this.diaType = 3;
        this.curRow = row;
        this.diaWidth = '50%';
        this.diaTitle = '编辑收货地址';
        this.postModelId = row.id;
        this.shwoPostDia = true;
      },
    }
  }
</script>

<style lang="scss" scoped>
  .blind-box {
    padding: 20px;
    .underline-class {
      color:#1890ff;
      cursor: pointer;
      text-decoration: underline;
    }
  }
</style>
