<template>
  <div class="coupons-details-wrap">

    <!-- 优惠券明细 -->
    <el-card class="box-card" shadow="always">
      <template slot="header">
        <i class="el-icon-info"></i>
        优惠券明细
      </template>
      <el-table :data="basicInfo1" border style="width: 100%">
        <el-table-column align="center" :formatter="formatter" prop="name" label="优惠券名称"></el-table-column>

        
          <el-table-column v-if="$route.query.from === 'game'" align="center" prop="type" label="优惠券类型">
            <template scope="scope">
              <p v-if="+scope.row.type === 1">游戏用户群赠送优惠券</p>
              <p v-else>-</p>
            </template>
          </el-table-column>
          <el-table-column v-if="$route.query.from === 'game'" align="center" prop="givingType" label="到券方式">
            <template scope="scope">
              <p v-if="+scope.row.givingType === 2">游戏赠送</p>
              <p v-else>-</p>
            </template>
          </el-table-column>
          <el-table-column v-if="$route.query.from === 'game'" align="center" prop="applyUserType" label="适合用户">
            <template scope="scope">
              <p v-if="+scope.row.applyUserType.findIndex(v => +v === 0) !== -1">参与本期游戏的用户</p>
              <p v-else>-</p>
            </template>
          </el-table-column>
        

        
          <el-table-column v-if="$route.query.from !== 'game'" align="center" :formatter="formatter" prop="type" label="优惠券类型"></el-table-column>
          <el-table-column v-if="$route.query.from !== 'game'" align="center" :formatter="formatter" prop="givingType" label="到券方式"></el-table-column>
          <el-table-column v-if="$route.query.from !== 'game'" align="center" :formatter="formatter" prop="applyUserType" label="适合用户"></el-table-column>
        
        

        <el-table-column align="center" :formatter="formatter" prop="applyGoodsType" label="可使用商品"></el-table-column>
        <el-table-column align="center" :formatter="formatter" prop="useStr" label="使用门槛"></el-table-column>
        <el-table-column align="center" :formatter="formatter" prop="couponAmount" label="面值"></el-table-column>
      </el-table>

      <br><br>

      <el-table :data="basicInfo2" border style="width: 100%">
        <el-table-column align="center" :formatter="formatter" prop="status" label="状态"></el-table-column>
        <el-table-column align="center" :formatter="formatter" prop="effectiveStr" label="有效期"></el-table-column>
        <el-table-column align="center" :formatter="formatter" prop="stock" label="总发行量"></el-table-column>
        <el-table-column align="center" :formatter="formatter" prop="receivedNumber" label="已领取"></el-table-column>
        <el-table-column align="center" :formatter="formatter" prop="waitReceivedNumber" label="待领取"></el-table-column>
        <el-table-column align="center" :formatter="formatter" prop="useNumber" label="已使用"></el-table-column>
        <el-table-column align="center" :formatter="formatter" prop="notUseNumber" label="未使用"></el-table-column>
      </el-table>
    </el-card>

    <!-- 数据列表 -->
    <el-card class="box-card" shadow="always">
      <template slot="header">
        <i class="el-icon-s-management"></i>
        数据列表
      </template>

      <div class="top-search">
        <el-form ref="mainForm" inline :model="mainForm" label-width="105px">
          <el-form-item label="订单编号：">
            <el-input class="input-class" v-model="mainForm.orderNo" clearable placeholder="请输入点单编号"></el-input>
          </el-form-item>

          <el-form-item label="使用状态：">
            <el-select v-model="mainForm.status" clearable placeholder="请选择使用状态">
              <el-option label="全部" :value='-1'></el-option>
              <el-option label="已使用" :value='1'></el-option>
              <el-option label="未使用" :value='0'></el-option>
              <el-option label="已过期" :value='2'></el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="fr mr0">
            <el-button size="small" type="primary" @click="onSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="record" border>
        <el-table-column align="center" :formatter="formatter" prop="couponNo" label="优惠券编号" width="180"></el-table-column>
        <el-table-column align="center" :formatter="formatter" prop="memberId" label="领取会员ID"></el-table-column>
        <el-table-column align="center" :formatter="formatter" prop="givingType" label="领取方式"></el-table-column>
        <el-table-column align="center" :formatter="formatter" prop="givingAt" label="领取时间"></el-table-column>
        <el-table-column align="center" :formatter="formatter" prop="status" label="当前状态"></el-table-column>
        <el-table-column align="center" :formatter="formatter" prop="useAt" label="使用时间"></el-table-column>
        <el-table-column align="center" :formatter="formatter" prop="orderNo" label="订单编号"></el-table-column>
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
    </el-card>

    <div class="form-btns">
      <el-button type="warning" @click="goBack2List">返回</el-button>
    </div>
  </div>
</template>

<script>
import {citeDetails, givingDetails, recordPage} from '@/api/coupons/index';
import {givingDetails as gameDetails} from '@/api/coupons/game';

export default {
  name: 'CouponsDetails',
  data () {
    return {
      // 0:所有用户 1:普通用户 2:VIP会员 3:新用户 4:老用户 5:一星达人 6:二星达人 7:三星达人 8:四星达人 9:城市服务商 10:合伙人 11:团长 12:高级团长
      users: [
        {
          type: 0,
          label: '所有用户',
        },
        {
          type: 1,
          label: '普通用户',
        },
        {
          type: 2,
          label: 'VIP用户',
        },
        {
          type: 3,
          label: '新用户',
        },
        {
          type: 4,
          label: '老用户',
        },
        {
          type: 5,
          label: '一星达人',
        },
        {
          type: 6,
          label: '二星达人',
        },
        {
          type: 7,
          label: '三星达人',
        },
        {
          type: 8,
          label: '四星达人',
        },
        {
          type: 9,
          label: '城市服务商',
        },
        {
          type: 10,
          label: '合伙人',
        },
        {
          type: 11,
          label: '团长',
        },
        {
          type: 12,
          label: '高级团长',
        },
      ],
      // 0:全场通用 1:指定商品 2:指定分类 3:指定供应商 4:指定自营店
      goods: [
        {
          type: 0,
          label: '全场通用',
        },
        {
          type: 1,
          label: '指定商品',
        },
        {
          type: 2,
          label: '指定分类',
        },
        {
          type: 3,
          label: '指定供应商',
        },
        // {
        //   type: 4,
        //   label: '指定自营店',
        // },
      ],
      mainForm: {
        status: '', // 状态
        orderNo: '', // 订单编号
      },
      type: {
        0: '一体化优惠券',
        1: '配用优惠券'
      },
      status: {
        0: '未使用',
        1: '已使用',
        2: '已过期'
      },
      givingType: {
        0: '自动赠送',
        1: '配置引用'
      },
      basicInfo1: [],
      basicInfo2: [],
      record: [],
      pager: {
        curPage: 1,
        size: 10,
        total: 0,
      },
      id: '',             // 订单id
      // isGiving: false,
      isGiving: ''
    }
  },
  mounted () {
    this.id = this.$route.query.id;
    // this.isGiving = this.$route.query.from == 'giving';
    this.isGiving = this.$route.query.from;
    this.detailsReq();
    this.recordPageReq();
  },
  methods: {
    //设置基本信息
    setBasicInfo (data) {
      let {
        name, type, givingType, applyUserType, applyGoodsType, useStr, couponAmount,
        status, effectiveStr, stock, receivedNumber, waitReceivedNumber, useNumber, notUseNumber
      } = data;

      // 设置数据、兼容处理
      this.$set(this.basicInfo1, 0, {
        name, type, givingType, applyUserType, applyGoodsType, useStr, couponAmount
      });
      this.$set(this.basicInfo2, 0, {
        status, effectiveStr, stock, receivedNumber, waitReceivedNumber, useNumber, notUseNumber
      });
    },
    // 获取优惠券详情
    async detailsReq () {
      try {
        const couponId = this.id;
        // const reqHandler = this.isGiving ? givingDetails : citeDetails;
        let reqHandler = ''
        if (this.isGiving == 'giving') {
          reqHandler = givingDetails
        } else if (this.isGiving == 'cite') {
          reqHandler = citeDetails
        } else if (this.isGiving == 'game') {
          reqHandler = gameDetails
        }
        const {data} = await reqHandler({couponId});

        // 设置基本信息
        this.setBasicInfo(data);
      } catch (error) {
        throw error;
      }
    },
    // 查询分页数据
    async recordPageReq () {
      try {
        const {code, message, data: {list, pageSize, total}} = await recordPage({
          ...this.mainForm,
          couponId: this.id,
          pageSize: this.pager.size,
          currentPage: this.pager.curPage,
          // configurationType: this.isGiving ? 0 : 1,
          configurationType: (() => {
            if (this.isGiving == 'giving') {
              return 0
            } else if (this.isGiving == 'cite') {
              return 1
            } else if (this.isGiving == 'game') {
              return 2
            }
          })(),
        });
        if (code == 200) {
          this.record = list;
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
      this.recordPageReq();
    },
    // 分页数量修改
    handleSizeChange(val) {
      this.pager.size = val;
      this.recordPageReq();
    },
    // 跳转当前页
    handleCurrentChange(val) {
      this.pager.curPage = val;
      this.recordPageReq();
    },
    // 格式日期功能
    formatDate (date, format = 'YYYY-MM-DD', def = '') {
      return date ? this.$dayjs(date).format(format) : def;
    },
    // 格式化
    formatter (row, column) {
      let key = column.property;

      if (key == 'type' || key == 'givingType' || key == 'status') {
        const val = row[key];
        const obj = key == 'type' ? this.type
          : key == 'givingType' ? this.givingType
          : key == 'status' ? this.status
          : '-';
        const item = obj[val] || '-';

        return item;
      } else if (key == 'applyUserType') {
        const item = [];
        const val = row[key];

        this.users.map(({type, label}) => {
          if (val?.includes(type)) item.push(label);
        });
        return item.length ? item.join('、') : '-';
      } else if (key == 'applyGoodsType') {
        let item;
        const val = row[key];

        this.goods.map(({type, label}) => {
          if (val == type) (item = label);
        });
        return item || '-';
      } else if (key == 'couponAmount') {
        return row[key] ? row[key] + 'USDT' : '-';
      } else if (
        key == 'stock'
        || key == 'useNumber'
        || key == 'notUseNumber'
        || key == 'receivedNumber'
        || key == 'waitReceivedNumber'
      ) {
        return isNaN(row[key]) ? '-' : row[key];
      } else if (key == 'givingAt' || key == 'useAt') {
        const time = row[key];
        return this.formatDate(time, 'YYYY-MM-DD HH:mm:ss', '-');
      } else {
        return row[key] || '-';
      }
    },
    // 返回
    goBack2List () {
      const curView = this.$route;
      const path = 'couponsList';

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          this.$router.replace({path}); // 返回列表页
        });
      });
    },
  }
}
</script>

<style lang="scss" scoped>
  .coupons-details-wrap {
    padding: 25px 40px 0;
    .box-card {
      margin: 0 auto;
      margin-top: 30px;
      ::v-deep .el-card__header {
        padding: 0 12px;
        min-height: unset;
        font-size: 16px;
        height: 50px;
        line-height: 50px;
        color: #666;
        background-color: rgba(243, 243, 243, 1);
      }
      .info-item {
        min-height: 48px;
        line-height: 48px;
        font-size: 14px;
        border-bottom: 1px solid #e4e4e4;
        &:first-child {
          border-top: 1px solid #e4e4e4;
        }
        &.top-border {
          border-top: 1px solid #e4e4e4;
        }
        &.custom-wt {
          font-size: 15px;
          font-weight: 800;
        }
        &.img-item {
          display: flex;
        }
        .item-label {
          color: #666;
          text-align: right;
          background: #f9fafc;
        }
        .text-normal {
          color: #6699ff;
        }
        .text-block {
          color: #ff6600;
        }
      }
    }
    .form-btns {
      text-align: center;
      margin-top: 35px;
      margin-bottom: 30px;
      button {
        min-width: 98px;
        margin-right: 50px;
      }
    }
    .info-item {
      min-height: 48px;
      line-height: 48px;
      font-size: 14px;
      border-bottom: 1px solid #e4e4e4;
      &:first-child {
        border-top: 1px solid #e4e4e4;
      }
      &.top-border {
        border-top: 1px solid #e4e4e4;
      }
      &.img-item {
        display: flex;
      }
      .item-label {
        color: #666;
        text-align: right;
        background: #f9fafc;
      }
      .text-normal {
        color: #6699ff;
      }
      .text-block {
        color: #ff6600;
      }
    }
  }
</style>
