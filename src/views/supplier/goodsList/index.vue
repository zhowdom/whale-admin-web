<template>
  <div class="goods-list-wrap">
    <div class="top-search">
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

            <el-form-item label="二次编辑状态:" label-width="105px">
              <el-select class="align-width" clearable v-model="mainForm.edited" clearable placeholder="请选择二次编辑状态">
                <el-option label="未编辑" :value='false'></el-option>
                <el-option label="已编辑" :value='true'></el-option>
              </el-select>
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
              <el-button type="primary" @click="onSearch" v-hasPermi="['goods:audited_product:list']">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>

    <div class="mgmt-table">
      <el-table border :data="tableData">
        <el-table-column prop="id" align="center" label="商品编号" :formatter="formatter"></el-table-column>
        <el-table-column prop="primaryImage" align="center" label="商品图片" :formatter="formatter" width="170"></el-table-column>
        <el-table-column prop="name" align="center" label="商品名称" :formatter="formatter"></el-table-column>
        <el-table-column prop="categoryName" align="center" label="分类" :formatter="formatter"></el-table-column>
        <el-table-column prop="sellerName" align="center" label="供应商" :formatter="formatter"></el-table-column>
        <el-table-column prop="brandId" align="center" label="商品品牌" :formatter="formatter"></el-table-column>
        <el-table-column prop="itemNo" align="center" label="货号" :formatter="formatter"></el-table-column>
        <el-table-column prop="sku" align="center" label="SKU">
          <template slot-scope="{row}">
            <el-button type="text" v-hasPermi="['goods:product:sku']" @click="checkInitSku(row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="edited" align="center" label="二次编辑状态" width="130">
          <template slot-scope="{row}">
            <div :style="{color:row['edited']?'#1890ff':'#666'}">
              {{row['edited']?'已编辑':'未编辑'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="stock" align="center" label="库存" :formatter="formatter" width="90"></el-table-column>
        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="{row}">
            <el-button size="mini" type="warning" v-hasPermi="['goods:product:detail']" @click="handleTabBtn(row, 'Detail')">查看</el-button>
            <el-button size="mini" type="primary" v-hasPermi="['goods:product:detail']" @click="handleTabBtn(row, 'Edit')">编辑</el-button>
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
import {auditedList, supplierList, productSku,} from '@/api/supplier/supplier';

export default {
  name: 'GoodsList',
  data () {
    return {
      suppliers: [],
      brands: [],
      categories: [],
      mainForm: {
        name: '',
        edited: '',
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
    this.auditedListReq();
    this.supplierListReq();
    this.categoryTreeReq();
    this.gdBrandsSelectMapReq();
  },
  methods: {
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
      } else if (
        key == 'stock' ||
        key == 'waring' ||
        key == 'marketPrice' ||
        key == 'price' ||
        key == 'editMarketPrice' ||
        key == 'editPrice'
      ) {
        return row[key] || 0;
      } else if (key == 'itemNo') {
        return row[key] ? '货号：' + row[key]: '-';
      } else {
        return row[key] || '-';
      }
    },
    // 查看供应商/编辑的sku
    checkInitSku ({itemNo, id, edited}) {
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
      this.skuEditedHeader = skuEditedHeader
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
    async auditedListReq () {
      try {
        const categoryId = this.categoryIds[this.categoryIds.length - 1];
        const [startTime, endTime] = this.daterange || [];

        const {code, message, data: {list, pageSize, total}} = await auditedList({
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
      this.auditedListReq();
    },
    // 分页数量修改
    handleSizeChange(val) {
      this.pager.size = val;
      this.auditedListReq();
    },
    // 跳转当前页
    handleCurrentChange(val) {
      this.pager.curPage = val;
      this.auditedListReq();
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
    handleTabBtn({id}, type) {
      const query = {productId: id};
      const curView = this.$route;
      const path = type == 'Edit' ? 'editOperationGoods' : 'operationGoodsDetail';

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
  .goods-list-wrap {
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
