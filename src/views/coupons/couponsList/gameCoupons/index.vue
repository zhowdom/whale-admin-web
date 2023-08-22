<template>
  <div class="giving-coupons-wrap">
    <div class="top-search">
      <el-form ref="mainForm" inline :model="mainForm" label-width="105px">
        <el-form-item label="优惠券名称：">
          <el-input class="input-class" v-model="mainForm.name" clearable placeholder="请输入优惠券名称"></el-input>
        </el-form-item>

        <el-form-item label="状态：">
          <el-select v-model="mainForm.status" clearable placeholder="请选择状态">
            <el-option label="全部" :value='-1'></el-option>
            <el-option label="已使用" :value='1'></el-option>
            <el-option label="未使用" :value='0'></el-option>
            <el-option label="已过期" :value='2'></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="适合用户：">
          <!-- <el-select v-model="mainForm.applyUserType" clearable placeholder="请选择适合用户">
            <el-option v-for="{label, type} in users" :key="type" :label="label" :value="type"></el-option>
          </el-select> -->
          <el-select v-model="mainForm.applyUserType" clearable placeholder="请选择适合用户">
            <el-option label="参与本期游戏的用户" :value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="优惠券类型：">
          <el-select v-model="mainForm.type" clearable placeholder="请选择优惠券类型">
            <!-- <el-option label="全部" :value='-1'></el-option> -->
            <!-- <el-option label="指定个人赠送优惠券" :value='0'></el-option>
            <el-option label="指定用户群赠送优惠券" :value='1'></el-option> -->
            <el-option label="游戏用户群赠送优惠券" :value='1'></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="可用商品：">
          <el-select v-model="mainForm.applyGoodsType" clearable placeholder="请选择可用商品">
            <el-option label="全部" :value='-1'></el-option>
            <el-option label="全场通用" :value='0'></el-option>
            <el-option label="指定商品" :value='1'></el-option>
            <el-option label="指定分类" :value='2'></el-option>
            <el-option label="指定供应商" :value='3'></el-option>
            <el-option label="指定自营店" :value='4'></el-option>
            <!-- <el-option label="指定活动" :value='5'></el-option> -->
          </el-select>
        </el-form-item>

        <el-form-item label="使用门槛：">
          <el-select v-model="mainForm.useType" clearable placeholder="请选择使用门槛">
            <el-option label="全部" :value='-1'></el-option>
            <el-option label="无限制" :value='0'></el-option>
            <el-option label="满减" :value='1'></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="禁用情况：">
          <el-select v-model="mainForm.enable" clearable placeholder="请选择禁用情况">
            <el-option label="全部" :value='-1'></el-option>
            <el-option label="已禁用" :value='0'></el-option>
            <el-option label="已启用" :value='1'></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="fr mr0">
          <el-button size="small" type="primary" @click="onSearch" v-hasPermi="['coupon:game:page']">查询</el-button>
          <el-button size="small" type="primary" @click="handleTabBtn(3, {})" v-hasPermi="['coupon:game:add']">添加优惠券</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="coupons-table">
      <el-table border :data="tableData" @sort-change="sortFunction">
        <el-table-column prop="couponNo" align="center" label="优惠券编号" :formatter="formatter" width="130"></el-table-column>
        <el-table-column prop="name" align="center" label="优惠券名称" :formatter="formatter" width="140"></el-table-column>
        <!-- <el-table-column prop="type" align="center" label="优惠券类型" :formatter="formatter" width="120"></el-table-column> -->
        <el-table-column prop="type" align="center" label="优惠券类型" width="120">
          <template scope="scope">
            <p v-if="+scope.row.type === 1">游戏用户群赠送优惠券</p>
            <p v-else>-</p>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="givingType" align="center" label="到券方式" :formatter="formatter"></el-table-column> -->
        <el-table-column prop="givingType" align="center" label="到券方式">
          <template scope="scope">
            <p v-if="+scope.row.givingType === 2">游戏赠送</p>
            <p v-else>-</p>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="applyUserType" align="center" label="适合用户" width="235" :formatter="formatter"></el-table-column> -->
        <el-table-column prop="applyUserType" align="center" label="适合用户" width="235">
          <template scope="scope">
            <p v-if="+scope.row.applyUserType.findIndex(v => +v === 0) !== -1">参与本期游戏的用户</p>
            <p v-else>-</p>
          </template>
        </el-table-column>
        <el-table-column prop="applyGoodsType" align="center" label="可使用商品" width="135" :formatter="formatter"></el-table-column>
        <el-table-column prop="useType" align="center" label="使用门槛" :formatter="formatter" min-width="105"></el-table-column>
        <el-table-column prop="couponAmount" align="center" label="面值" :formatter="formatter"></el-table-column>
        <el-table-column prop="givingAt" align="center" label="开始发放时间" width="190" :formatter="formatter"></el-table-column>
        <el-table-column prop="effectiveType" align="center" label="有效期" width="190" :formatter="formatter"></el-table-column>
        <el-table-column prop="status" align="center" label="状态" :formatter="formatter"></el-table-column>
        <el-table-column prop="gameReferenceNum" align="center" label="游戏引用次数">
          <template scope="scope">
            <p @click="seeGameReferenceNum(scope.row)" style="text-decoration:underline;cursor:pointer;">{{scope.row.gameReferenceNum}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="releaseTime" align="center" label="禁用情况" width="120">
          <template slot-scope="{row}">
            <el-switch
              :width="80"
              :active-value="1"
              :inactive-value="0"
              active-text="已开启"
              inactive-text="已禁用"
              @change="statusChange(row)"
              :value="row.enable"
              class="custom-switcher"
              v-hasPermi="['coupon:game:update_enable']"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="220">
          <template slot-scope="{row}">
            <el-button size="mini" type="warning" v-hasPermi="['coupon:game:details']" @click="handleTabBtn(1, row)">查看</el-button>
            <!-- <el-button size="mini" type="primary" v-if="!row.givingStatus" v-hasPermi="['coupon:game:edit']" @click="handleTabBtn(2, row)">编辑</el-button>
            <el-button size="mini" type="danger" v-if="!row.givingStatus" v-hasPermi="['coupon:game:delete']" @click="deleteCiteCoupons(row)">删除</el-button> -->
          </template>
        </el-table-column>
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

<!--游戏引用次数弹窗-->
<el-dialog title="引用次数" :visible.sync="gmRefsVisible">
  <el-table :data="gridDataGMrefs">
    <el-table-column property="citationsCouponTime" label="引用时间"></el-table-column>
    <el-table-column property="periodsNum" label="期数"></el-table-column>
  </el-table>
  <el-pagination
    style="padding-top:20px;"
    @current-change="searchGM"
    :page-sizes="[10, 20, 30]"
    @size-change="handleSizeChangeGM"
    :current-page.sync="pageIndexGM"
    :page-size="pageSizeGM"
    layout="total, sizes, prev, pager, next, jumper"
    :total="totalPageGM">
    </el-pagination>
</el-dialog>


  </div>
</template>

<script>
import {givingPage, givingEnable, givingDelete} from '@/api/coupons/game';
import { gameCouponsRefsCounts } from "@/api/games";

export default {
  name: 'GivingCoupons',
  data () {
    return {
      gridDataGMrefs: [],
      gmRefsVisible: false,
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
        name: '',
        applyGoodsType: '',       // 适用商品类型
        enable: '',           // 启用/停用状态 0:停用 1:启用
        status: '',     // 状态 0:未使用 1:已使用 2:已过期
        type: '',     // 类型 0:一体化优惠券 1:配用优惠券
        useType: '', // 使用门槛类型 0:无限制 1:满减
        applyUserType: '',   // 适合用户
      },
      pager: {
        curPage: 1,
        size: 10,
        total: 0,
      },
      type: {
        0: '指定个人赠送优惠券',
        1: '指定用户群赠送优惠券'
      },
      useType: {
        0: '无限制',
        1: '满减'
      },
      status: {
        0: '未使用',
        1: '已使用',
        2: '已过期'
      },
      enable: {
        0: '停用',
        1: '启用'
      },
      tableData: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      pageIndexGM: 1,
      pageSizeGM: 10,
      totalPageGM: 0,
      curGMRowData: {}
    }
  },
  mounted () {
    this.givingPageReq();
  },
  methods: {
    handleSizeChangeGM (val) {
      this.pageSizeGM = val
      this.pageIndexGM = 1
      this.searchGM()
    },
    searchGM (pgi) {
      if (pgi) this.pageIndexGM = pgi
      gameCouponsRefsCounts(
        {
          couponId: this.curGMRowData.id,
          currentPage: this.pageIndexGM,
          pageSize: this.pageSizeGM
        }
      ).then(response => {
        if (+response.code === 200) {
            this.gridDataGMrefs = response.data.list
            this.totalPageGM = response.data.total
        } else {
          this.gridDataGMrefs = []
          this.totalPageGM = 0
          this.pageSizeGM = 10
        }
      })
    },
    seeGameReferenceNum (row) {
      this.curGMRowData = Object.assign({}, row)
      // if (pgi) this.pageIndex = pgi
      this.gmRefsVisible = true
      this.searchGM(1)
    },
    // 状态切换功能
    statusChange ({id, enable}) {
      const h = this.$createElement;
      const style = {fontSize: '16px', padding: '10px 10px 8px', fontWeight: 600};
      const val = enable ? 0 : 1;
      const tips = enable ? '禁用' : '启用';
      const message = h('div', {style}, [
        h('p', {class: 'ml5'}, `确定要${tips}此优惠券吗？`),
        enable ? h('p', {style: 'font-size: 12px;color: #FF6600;'}, `禁用后用户将无法领取/使用此优惠券`) : null
      ]);

      this.$msgbox({
        message,
        type: 'warning',
        showClose: false,
        closeOnClickModal: false,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'coupons-msg',
        iconClass: 'el-icon-question iconQ',
      }).then(() => {
        this.givingEnableReq([id], val);
      }).catch(() => {
        this.$message.info(`已取消${tips}`);
      });
    },
    // 删除优惠券
    deleteCiteCoupons ({id}) {
      const h = this.$createElement;
      const style = {fontSize: '16px', padding: '10px 10px 8px'};
      const message = h('div', {style}, [
        h('p', {style: 'fontWeight: 600'}, '确定要删除此优惠券吗？'),
        h('p', {style: 'font-size: 12px;color: #FF6600;'}, `删除后用户将无法领取此优惠券`)
      ]);

      this.$msgbox({
        message,
        type: 'warning',
        showClose: false,
        closeOnClickModal: false,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'coupons-msg',
      }).then(() => {
        this.givingDeleteReq([id]);
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    // 格式化
    formatter (row, column) {
      let key = column.property;

      if (key == 'type' || key == 'status') {
        const val = row[key];
        const obj = key == 'type' ? this.type
          : key == 'status' ? this.status
          : '-';
        const item = obj[val] || '-';

        return item;
      } else if (key == 'givingType') {
        return '自动赠送';
      } else if (key == 'useType') {
        const val = row[key];
        const item = val == 0 ? '无限制'
          : val == 1 ? `满${row['fullReductionAmount']}USDT可用`
          : '-';
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
      } else if (key == 'effectiveType') {
        const {effectiveStartTime, effectiveEndTime} = row;
        if (row[key]) {
          return '-';
        } else {
          const s = this.formatDate(effectiveStartTime, 'YYYY-MM-DD', '-');
          const e = this.formatDate(effectiveEndTime, 'YYYY-MM-DD', '-');
          return s + '至' + e;
        };
      } else if (key == 'givingAt') {
        const time = row[key];
        return this.formatDate(time, 'YYYY-MM-DD HH:mm:ss', '-');
      } else {
        return row[key] || '-';
      }
    },
    // 排序
    sortFunction ({prop, order}) {
      const asc = order == 'ascending'; // 是否升序
      const column = this.formatStr(prop); // 格式字符串
      this.$set(this.mainForm.orderItemList, 0, {asc, column});
      this.givingPageReq();
    },
    // 格式日期功能
    formatDate (date, format = 'YYYY-MM-DD', def = '') {
      return date ? this.$dayjs(date).format(format) : def;
    },
    // 查询分页数据
    async givingPageReq () {
      try {
        const {code, message, data: {list, pageSize, total}} = await givingPage({
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
    // 启用禁用优惠券
    async givingEnableReq (couponIds, enable) {
      try {
        await givingEnable({couponIds, enable});
        this.$message.success('更新成功');
        this.givingPageReq();
      } catch (error) {
        throw error;
      }
    },
    // 删除优惠券
    async givingDeleteReq (couponIds) {
      try {
        await givingDelete({couponIds});
        this.$message.success('优惠券删除成功');
        this.givingPageReq();
      } catch (error) {
        throw error;
      }
    },
    // 条件搜索
    onSearch () {
      this.pager.curPage = 1;
      this.givingPageReq();
    },
    // 分页数量修改
    handleSizeChange(val) {
      this.pager.size = val;
      this.givingPageReq();
    },
    // 跳转当前页
    handleCurrentChange(val) {
      this.pager.curPage = val;
      this.givingPageReq();
    },
    // 新增引用优惠券
    onAdd () {
      const curView = this.$route
      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          // 跳转页面到新增
          this.$router.replace({path: 'addCoupons'});
        })
      });
    },
    // 添加、查看、编辑
    handleTabBtn(type, {id}) {
      const curView = this.$route;
      const path = type == 1 ? 'viewCoupons'
        : type == 2 ? 'editCoupons'
        : 'addGameCoupon';
      // const query = type == 3 ? {} : {id, from: 'giving'};
      const query = type == 3 ? {} : {id, from: 'game'};

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          // 详情
          this.$router.replace({path, query});
        })
      });
    },
  }
}
</script>

<style lang="scss" scoped>
  .giving-coupons-wrap {
    padding: 20px 0;
    .top-search {
      .el-form-item {
        ::v-deep .el-form-item__label {
          font-weight: 400;
        }
      }
    }
    .custom-switcher {
      height: 60px;
      ::v-deep {
        .el-switch__label--left,
        .el-switch__label--right {
          position: absolute;
          z-index: -1;
          font-size: 14px;
        }
        .el-switch__label--left {
          margin-right: 10px;
          right: 0;
          color: #999;
        }
        .el-switch__label--right {
          margin-right: 0px;
          left: 0px;
          color: #fff;
        }
        .el-switch__label.is-active {
          z-index: 20;
        }
        .el-switch__core {
          height: 26px;
          border-radius: 24px;
        }
        .el-switch__core:after {
          border-radius: 24px;
          width: 26px;
          height: 26px;
          margin-left: -2px;
          box-shadow: -3px 0px 1px #888;
          top: -1px;
        }
      }
      &.is-checked ::v-deep {
        .el-switch__core:after {
          margin-left: -25px;
          box-shadow: 3px 0px 1px #888;
        }
      }
    }
  }
</style>
