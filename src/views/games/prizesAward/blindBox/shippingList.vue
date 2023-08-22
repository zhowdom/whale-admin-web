<template>
  <div class="order-shipping-list-wrap" v-loading="showPost">
    <el-form ref="shipping" inline :model="shippingForm" size="small">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="批量配送方式" prop="type">
            <el-select class="align-width" clearable v-model="shippingForm.type" placeholder="请选择配送方式">
              <el-option v-for="{code, name} in mms" :key="code" :label="name" :value='code'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="批量物流单号" prop="number">
            <el-input class="normal-width" clearable v-model.trim="shippingForm.number" placeholder="请输入物流单号"></el-input>
          </el-form-item>
          <el-button size="small" class="mr10" type="primary" @click="quickSetting">批量设置</el-button>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item class="fr mr0">
            <el-button class="mr10" type="primary" @click="quickClear(1)">一键清空配送方式</el-button>
            <el-button class="mr10" type="primary" @click="quickClear(2)">一键清空物流单号</el-button>
            <el-button type="primary" v-hasPermi="['blindBox:distribution:batchAddLogisticsNum']" @click="handleMultOrder">批量发货</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table border row-key="id" ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="orderNo" align="center" label="主订单号" :formatter="formatter"></el-table-column>
      <el-table-column prop="orderItemNo" align="center" label="子订单号" :formatter="formatter"></el-table-column>
      <el-table-column prop="itemNo" align="center" label="货号" :formatter="formatter"></el-table-column>
      <el-table-column prop="itemName" align="center" label="实物名称" :formatter="formatter"></el-table-column>
      <el-table-column prop="img" align="center" label="图片" width="110">
        <template slot-scope="{row}">
          <el-image class="image" :src="row.img" fit="fit"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="itemNum" align="center" label="数量" :formatter="formatter"></el-table-column>
      <el-table-column prop="deliveryMemberName" align="center" label="收货人" :formatter="formatter"></el-table-column>
      <el-table-column prop="deliveryPhone" align="center" label="手机号" :formatter="formatter"></el-table-column>
      <el-table-column prop="address" align="center" label="收货地址" :formatter="formatter"></el-table-column>
      <!-- 带有校验输入框的表格列 -->
      <el-table-column
        align="center"
        v-for="item in mmsHeader"
        :key="item.name"
        :prop="item.name"
        :label="item.label"
        :width="item.width"
      >
        <span
          slot="header"
          :class="{
            'required': item.name=='logisticsCode'|| item.name=='logisticsNum'
          }"
        >
          {{item.label}}
        </span>
        <template slot-scope="{row}">
          <el-form :model="row" :rules="rules" ref="rowForm">
            <el-form-item prop="logisticsCode" class="mb15 mt15" v-if="item.name=='logisticsCode'">
              <el-select class="align-width" clearable v-model="row.logisticsCode" placeholder="请选择">
                <el-option v-for="{code, name} in mms" :key="code" :label="name" :value='code'></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="logisticsNum" class="mb15 mt15" v-if="item.name=='logisticsNum'">
              <el-input class="align-width" v-model="row.logisticsNum" clearable placeholder="请输入"></el-input>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="{row,$index}">
          <el-button class="mb5" size="mini" type="primary" v-hasPermi="['blindBox:distribution:batchAddLogisticsNum']" @click="handleSingleOrder(row, $index)">发货</el-button>
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
import mms from '@/utils/mss';
import {batchList, batchAdd} from "@/api/games/bbPrizesAward.js";

export default {
  name: 'OrderShippingList',
  props: ['id', 'range', 'search'],
  data () {
    return {
      mms,
      pager: {
        size: 10,
        total: 0,
        curPage: 1,
      },
      shippingForm: {
        type: '',       // 配送方式
        number: '',     // 物流单号
      },
      mmsHeader: [
        {
          name: 'logisticsCode',
          width: 180,
          label: '配送方式'
        },
        {
          name: 'logisticsNum',
          width: 180,
          label: '物流单号'
        },
      ],
      tableData: [],
      rules: {
        logisticsCode: [
          { required: true, message: '选择不能为空', trigger: 'change' },
        ],
        logisticsNum: [
          { required: true, message: '输入不能为空', trigger: 'blur'},
          { type: 'string', min: 1, max: 20, message: '输入长度1-20个字符', trigger: 'blur' },
        ],
      },
      multipleSel: [],
      showPost: true,
    }
  },
  mounted () {
    this.batchListReq();
    setTimeout(() => {
      this.showPost = false;
    }, 700);
  },
  methods: {
    // 批量设置
    quickSetting() {
      const {type, number} = this.shippingForm;
      const rowForms = this.$refs.rowForm;
      if (!type && !number) return;

      rowForms.map(form => {
        const model = form.model;
        if (!!!model['logisticsCode'] && type) {
          this.$set(model, 'logisticsCode', type);
        }

        if (!!!model['logisticsNum'] && number) {
          this.$set(model, 'logisticsNum', number);
        }
      });
    },
    // 一键清空
    quickClear(flag) {
      const rowForms = this.$refs.rowForm || [];
      if (flag == 1) { // 一键清空配送方式
        this.shippingForm.type = '';
        rowForms?.map((form, index) => {
          if (index % 2 == 0) form.resetFields();
        });
      } else { // 一键清空物流单号
        this.shippingForm.number = '';
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
    // 时间格式化
    format(time, f = 'YYYY-MM-DD HH:mm:ss', d = '-') {
      return time ? this.$dayjs(time).format(f): d;
    },
    // 获取发货列表
    async batchListReq () {
      try {
        let [updateStartTime, updateEndTime] = this.range || ['', ''];
        let {
          memberName, phone, currentPeriodNo, blindBoxNo, blindBoxDesc, blindBoxSerie
        } = this.search;
        updateEndTime = this.format(updateEndTime, 'YYYY-MM-DD', '');
        updateStartTime = this.format(updateStartTime, 'YYYY-MM-DD', '');

        const reqData = this.id ? {
          id: this.id,
          pageSize: this.pager.size,
          currentPage: this.pager.curPage,
        } : {
          phone,
          memberName,
          blindBoxNo,
          blindBoxDesc,
          blindBoxSerie,
          updateEndTime,
          updateStartTime,
          currentPeriodNo,
          pageSize: this.pager.size,
          currentPage: this.pager.curPage,
        };
        const {code, message, data} = await batchList(reqData);

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
    // 发货（单个/批量）请求
    async batchAddReq (datas, cb, done) {
      try {
        const {code, message} = await batchAdd({datas});

        if (code == 200) {
          done();
          this.batchListReq(); // 更新发货列表
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

      return row[key] || '-';
    },
    // 分页数量修改
    handleSizeChange(val) {
      this.pager.size = val;
      this.batchListReq();
    },
    // 跳转当前页
    handleCurrentChange(val) {
      this.pager.curPage = val;
      this.batchListReq();
    },
    // 单个发货按钮操作
    handleSingleOrder (row, index) {
      let reqData = [];
      let logisticsName;
      let {
        currentPeriodNo, itemNo, memberId, orderItemNo,
        orderNo, logisticsCode, logisticsNum, id,
      } = row;
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
      if (this.multipleSel.length > 1) return this.$message.error('只能对单个订单发货');

      this.mms.some(({name, code}) => {
        if (code == logisticsCode) {
          logisticsName = name;
          return true;
        }
      });

      reqData.push({
        itemNo: itemNo || '',
        orderNo: orderNo || '',
        memberId: Number(memberId),
        orderItemNo: orderItemNo || '',
        logisticsNum: logisticsNum || '',
        logisticsName: logisticsName || '',
        logisticsCode: logisticsCode || '',
        gamePrizeDistributionId: Number(id),
        currentPeriodNo: currentPeriodNo || '',
      });

      this.diaConfirm(reqData);
    },
    // 批量发货按钮操作
    handleMultOrder () {
      let selIdxs = [];
      let reqData = [];
      let selRowForms = [];
      let allRowForms = this.$refs.rowForm;
      if (!this.multipleSel.length) return this.$message.error('请选择批量发货的订单！');

      this.multipleSel.map(el => {
        this.tableData.map(({id}, index) => {
          if (el.id == id) selIdxs.push(index);
        });
      });

      allRowForms.map((el, index) => {
        selIdxs.map(cl => {
          let start = cl * 2;
          let end = (cl + 1) * 2;
          if (index >= start && index < end) selRowForms.push(el);
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
      this.multipleSel.map(({
        currentPeriodNo, itemNo, memberId, orderItemNo,
        orderNo, logisticsCode, logisticsNum, id,
      }) => {
        let logisticsName;
        this.mms.some(({name, code}) => {
          if (code == logisticsCode) {
            logisticsName = name;
            return true;
          }
        });

        reqData.push({
          itemNo: itemNo || '',
          orderNo: orderNo || '',
          memberId: Number(memberId),
          orderItemNo: orderItemNo || '',
          logisticsNum: logisticsNum || '',
          logisticsName: logisticsName || '',
          logisticsCode: logisticsCode || '',
          gamePrizeDistributionId: Number(id),
          currentPeriodNo: currentPeriodNo || '',
        });
      });

      this.diaConfirm(reqData);
    },
    // 弹框确认
    diaConfirm (reqData) {
      const vm = this;
      const h = this.$createElement;
      const style = {fontSize: '15px', display: 'block', padding: '10px 10px 30px'};
      const message = h('strong', {style}, '是否确定此订单发货？');

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
              vm.batchAddReq(reqData, cb, done);
            }, 1200);
          } else {
            done();
          }
        }
      }).then(() => {
        this.$message.success('发货成功');
      }).catch(() => {
        this.$message.info('取消发货');
      });
    },
  }
}
</script>

<style lang="scss" scoped>
  .order-shipping-list-wrap {
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
    .image {
      width: 80px;
      height: 80px;
      border-radius: 5px;
    }
  }
</style>

