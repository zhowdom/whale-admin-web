<template>
  <div class="checking-goods-wrap">
    <div class="top-search">
      <el-row class="mb10" v-hasPermi="['goods:wait_audit_product:statistics']">
        <el-col class="top-tab" :span="24">
          <template v-for="({count, name, status}) in auditSts">
            <el-button @click="changeTab(status)" :type="curType(status)" size="small">
              {{name}}(<span :class="curClass(status)">{{count}}</span>)
            </el-button>
          </template>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form ref="mainForm" inline :model="mainForm" label-width="90px">

            <el-form-item label="商品名称:">
              <el-input class="align-width" v-model="mainForm.name" placeholder="请输入商品名称"></el-input>
            </el-form-item>

            <el-form-item label="供应商:">
              <el-select class="align-width" clearable v-model="mainForm.supplierId" clearable placeholder="请选择供应商">
                <el-option v-for="{name, id} in suppliers" :key="id" :label="name" :value='id'></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="商品分类:">
              <el-cascader class="align-width" v-model="categoryIds" :options="categories" clearable placeholder="请选择商品分类"></el-cascader>
            </el-form-item>

            <el-form-item label="商品品牌:">
              <el-select class="align-width" clearable v-model="mainForm.brandId" placeholder="请选择品牌">
                <el-option v-for="{brandName, brandId} in brands" :key="brandId" :label="brandName" :value='brandId'></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="时间筛选:">
              <el-date-picker
                class="align-width"
                v-model="daterange"
                type="daterange"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item class="fr mr0">
              <el-button type="primary" @click="onSearch" v-hasPermi="['goods:wait_audit_product:list']">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>

    <div class="mgmt-table">
      <el-table border :data="tableData" :default-sort="{prop:'createdAt',order:'descending'}" @sort-change="sortFunction">
        <el-table-column prop="id" align="center" label="商品编号" :formatter="formatter"></el-table-column>
        <el-table-column prop="createdAt" align="center" sortable="custom" label="添加时间" :formatter="formatter" width="110"></el-table-column>
        <el-table-column prop="primaryImage" align="center" label="商品图片" :formatter="formatter" width="170"></el-table-column>
        <el-table-column prop="name" align="center" label="商品名称" :formatter="formatter"></el-table-column>
        <el-table-column prop="categoryName" align="center" label="分类" :formatter="formatter"></el-table-column>
        <el-table-column prop="sellerName" align="center" label="供应商" :formatter="formatter"></el-table-column>
        <el-table-column prop="brandId" align="center" label="商品品牌" :formatter="formatter"></el-table-column>
        <el-table-column prop="itemNo" align="center" label="货号" :formatter="formatter"></el-table-column>
        <el-table-column prop="sku" align="center" label="SKU">
          <template slot-scope="{row}">
            <el-button type="text" v-hasPermi="['goods:product:sku']" @click="checkSku(row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="status" align="center" label="状态" :formatter="formatter" width="130"></el-table-column>
        <el-table-column prop="stock" align="center" label="库存" :formatter="formatter" width="90"></el-table-column>
        <el-table-column align="center" label="操作" width="100">
          <template slot-scope="{row}">
            <el-button size="mini" type="primary" v-if="row.status==2||row.status==4" v-hasPermi="['goods:product:detail']" @click="handleTabBtn(row, 'Audit')">审核</el-button>
            <el-button size="mini" type="warning" v-else v-hasPermi="['goods:product:detail']" @click="handleTabBtn(row, 'Detail')">查看</el-button>
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

    <el-dialog center :close-on-click-modal="false" @close="closeSkuDio" title="货品信息" :visible.sync="showSku" width="1200px">
      <p>商品货号：{{itemNo?'No'+itemNo:'-'}}</p>
      <el-table border row-key="key" :data="skuData" style="width: 100%">
        <template v-if="showSkuSign==1">
          <el-table-column
            v-for="({prop, label, width}, index) in skuHeader"
            align="center"
            :key="index"
            :prop="prop"
            :label="label"
            :width="width"
            :formatter="formatter">
          </el-table-column>
        </template>

        <template v-if="showSkuSign==2">
          <el-table-column
            v-for="({prop, label, width}, index) in skuEditedHeader"
            align="center"
            :key="index"
            :prop="prop"
            :label="label"
            :width="width"
            :formatter="formatter">
          </el-table-column>
        </template>
      </el-table>

      <div class="table-pagination text-right mt10">
        <el-pagination
          :total="skuPager.total"
          :page-size="skuPager.size"
          :page-sizes="[10, 20, 30]"
          :current-page="skuPager.curPage"
          @size-change="handleSkuSizeChange"
          @current-change="handleSkuCurrentChange"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {uuid} from '@/utils/index';
import {categoryTree} from '@/api/goods/index';
import {gdBrandsSelectMap} from '@/api/goods/goodsAbout';
import {auditList, supplierList, productSku, productStatus, auditStatistics} from '@/api/supplier/supplier';

export default {
  name: 'CheckingGoods',
  computed: {
    curType: function () {
      return arg => this.mainForm.status == arg ? 'primary' : '';
    },
    curClass: function () {
      return arg => this.mainForm.status == arg ? '' : 'red-dot';
    }
  },
  data () {
    return {
      suppliers: [],
      brands: [],
      categories: [],
      auditSts: [],
      statusList: [],
      mainForm: {
        sort: 2,
        name: '',
        status: 0,
        brandId: '',
        supplierId: '',
      },
      daterange: [],
      categoryIds: [],
      pager: {
        size: 10,
        total: 0,
        curPage: 1,
      },
      skuPager: {
        size: 10,
        total: 0,
        curPage: 1,
      },
      tableData: [],
      showSku: false,
      skuData: [],
      skuHeader: [
        {
          label: '供货价',
          prop: 'supplyPrice',
        },
        {
          label: '划线价',
          prop: 'marketPrice',
        },
        {
          label: '销售价（USDT）',
          prop: 'price',
        },
        {
          label: '销售价（Candy）',
          prop: 'whalePeas',
        },
        {
          label: '商品库存',
          prop: 'stock',
        },
        {
          label: '库存预警值',
          prop: 'waring',
        },
        {
          label: 'SKU编号',
          prop: 'skuNo',
        },
        {
          label: 'SKU名称',
          prop: 'name',
        },
        {
          label: '属性图',
          prop: 'image',
          width: 170,
        },
      ],
      skuEditedHeader: [
        {
          label: '供货价',
          prop: 'supplyPrice',
        },
        {
          label: '划线价',
          prop: 'editMarketPrice',
        },
        {
          label: '销售价（USDT）',
          prop: 'editPrice',
        },
        {
          label: '销售价（Candy）',
          prop: 'whalePeas',
        },
        {
          label: '商品库存',
          prop: 'stock',
        },
        {
          label: '库存预警值',
          prop: 'waring',
        },
        {
          label: 'SKU编号',
          prop: 'skuNo',
        },
        {
          label: 'SKU名称',
          prop: 'name',
        },
        {
          label: '属性图',
          prop: 'image',
          width: 170,
        },
      ],
      itemNo: '',
      productId: '',
      showSkuSign: 0, // 0 - 初始 1 - 原始sku 2 - 编辑过的sku
    }
  },
  mounted () {
    this.auditListReq();
    this.supplierListReq();
    this.categoryTreeReq();
    this.gdBrandsSelectMapReq();
    this.auditStatisticsReq();
    this.productStatusReq();
  },
  methods: {
    // 排序
    sortFunction ({order}) {
      const sort = order == 'ascending' ? 1 : 2; // 升序1 降序2
      this.$set(this.mainForm, 'sort', sort);
      this.auditListReq();
    },
    // 修改搜索状态值
    changeTab (status) {
      this.mainForm.status = status;
      this.auditListReq();
    },
    // 格式化
    formatter (row, column) {
      let key = column.property;
      const h = this.$createElement;

      if (key == 'primaryImage' || key == 'image') {
        const src = row[key];
        const fit = 'fit';
        const style = {
          width: '150px',
          height: '85px',
          display: 'block',
          borderRadius: '2px',
        };
        const props = {src, fit};
        const img = h('el-image', {style, props});
        return src ? img : '-';
      } else if (key == 'brandId') {
        let name;
        this.brands.some(({brandId, brandName}) => {
          if (brandId == row[key]) {
            name = brandName;
            return true;
          }
        });
        return name || '-';
      } else if (key == 'status') {
        let txt;
        let now = Date.now();
        let auto = new Date(row['autoUpTiming']).getTime();
        let isAutoUpTime = auto > now && row[key] == 3;
        let color = row[key] == 2 || row[key] == 4 ? '#51C1FF' :
          row[key] == 3 || row[key] == 6 ? '#1abc9c' :
          row[key] == 5 || row[key] == 7 ? '#999' : '';
        this.statusList.some(({code, desc}) => {
          if (code == row[key]) {
            txt = desc;
            return true;
          };
        });

        return h('div', [
          h('div', {style: {color}}, txt),
          isAutoUpTime ? h('div', {style: {color: '#FF9900'}}, '未到上架时间') : null,
        ]);
      } else if (key == 'categoryName') {
        let pname;
        let cname;
        const {
          firstCategoryId,
          secondCategoryId
        } = row;

        this.categories.map(pl => {
          if (pl.value == firstCategoryId) {
            pname = pl.label;
          };
          if (pl.children) {
            pl.children.map(cl => {
              if (cl.value == secondCategoryId) {
                cname = cl.label;
              };
            });
          };
        });

        if (pname) {
          if (cname) return pname + ' > ' + cname;
          return pname;
        } else {
          return cname ? cname : '';
        };
      } else if (key == 'createdAt') {
        return this.formatDate(row[key], 'YYYY-MM-DD', '-');
      } else if (key == 'stock' || key == 'waring') {
        return row[key] || 0;
      } else if (key == 'itemNo') {
        return row[key] ? '货号：' + row[key]: '-';
      } else {
        return row[key] || '-';
      }
    },
    // 查看sku
    checkSku ({itemNo, id, edited}) {
      this.itemNo = itemNo;
      this.productId = id;
      if (edited) {
        this.showSkuSign = 2;
      } else {
        this.showSkuSign = 1;
      };
      this.productSkuReq();
    },
    // 关闭sku弹窗
    closeSkuDio () {
      const {skuHeader, skuPager, skuEditedHeader} = this.$options.data();
      this.showSku = false;
      this.skuData = [];
      this.showSkuSign = 0;
      this.skuHeader = skuHeader;
      this.skuEditedHeader = skuEditedHeader;
      this.skuPager = skuPager;
    },
    // 格式日期功能
    formatDate (date, format = 'YYYY-MM-DD', def = '') {
      return date ? this.$dayjs(date).format(format) : def;
    },
    // 商品sku列表
    async productSkuReq () {
      try {
        const {code, message, data: {list, pageSize, total}} = await productSku({
          productId: this.productId,
          pageSize: this.skuPager.size,
          currentPage: this.skuPager.curPage,
        });

        if (code == 200) {
          let uuids = [];
          let header = [];
          list.map((el, index) => {
            const {props} = el;
            props.map(({name: label, value}, odx) => {
              if (index === 0) {
                let prop = uuid().substr(0, 8);
                el[prop] = value;
                uuids.push(prop);
                header.push({prop, label});
              } else {
                el[uuids[odx]] = value;
              };
            });
          });

          this.skuData = list || [];
          this.skuPager.size = pageSize;
          this.skuPager.total = total;
          this.skuHeader.unshift(...header);
          this.skuEditedHeader.unshift(...header);
          this.showSku = true;
        } else {
          this.$message.error(message);
        };
      } catch (error) {
        throw error;
      }
    },
    // 商品状态列表
    async productStatusReq () {
      try {
        const {data: {list}} = await productStatus();
        list.map(el => {
          if (el.code == 2) el.desc = '上架待审核';
          if (el.code == 3) el.desc = '上架审核成功';
          if (el.code == 4) el.desc = '下架待审核';
          if (el.code == 5) el.desc = '上架审核失败';
          if (el.code == 6) el.desc = '下架审核成功';
        });
        this.statusList = list || [];
      } catch (error) {
        throw error;
      }
    },
    // 待审核商品状态统计
    async auditStatisticsReq () {
      try {
        const {data} = await auditStatistics();
        this.auditSts = data.list || [];
      } catch (error) {
        throw error;
      }
    },
    // 获取供应商列表（不分页）
    async supplierListReq () {
      try {
        const {data} = await supplierList();
        this.suppliers = data.list || [];
      } catch (error) {
        throw error;
      }
    },
    // 查询商品分类（不分页）
    async categoryTreeReq () {
      try {
        const {code, message, data} = await categoryTree();
        if (code == 200) {

          function formatData(arr) {
            arr.map(el => {
              el.value = el.categoryId;
              el.label = el.categoryName;
              if (el.child.length) {
                el.children = el.child;
                formatData(el.child);
              }
            });
          };
          formatData(data.list);

          this.categories = data.list;
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        throw error;
      }
    },
    // 获取商品品牌（不分页）
    async gdBrandsSelectMapReq () {
      try {
        const queryHidden = false;
        const {data} = await gdBrandsSelectMap({queryHidden});
        this.brands = data.list || [];
      } catch (error) {
        throw error;
      }
    },
    // 获取待审核商品列表
    async auditListReq () {
      try {
        await this.auditStatisticsReq();
        const categoryId = this.categoryIds[this.categoryIds.length - 1];
        const [startTime, endTime] = this.daterange || [];

        const {code, message, data: {list, pageSize, total}} = await auditList({
          ...this.mainForm,
          startTime,
          endTime,
          categoryId,
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
      this.auditListReq();
    },
    // 分页数量修改
    handleSizeChange(val) {
      this.pager.size = val;
      this.auditListReq();
    },
    // 跳转当前页
    handleCurrentChange(val) {
      this.pager.curPage = val;
      this.auditListReq();
    },
    // sku分页数量修改
    handleSkuSizeChange(val) {
      this.skuPager.size = val;
      this.productSkuReq();
    },
    // sku跳转当前页
    handleSkuCurrentChange(val) {
      this.skuPager.curPage = val;
      this.productSkuReq();
    },
    // 查看-审核
    handleTabBtn({id, status}, type) {
      const query = {productId: id, status};
      const curView = this.$route;
      const path = type == 'Audit' ? 'checkingGoodsAudit' : 'checkingGoodsDetail';

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
  .checking-goods-wrap {
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
