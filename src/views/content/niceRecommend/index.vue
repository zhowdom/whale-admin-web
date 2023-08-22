<template>
  <div class="nice-recommend-wrap">
    <div class="top-search">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form ref="mainForm" inline :model="mainForm" label-width="90px">

            <el-form-item label="商品标题:">
              <el-input class="align-width" v-model="mainForm.name" placeholder="请输入商品标题"></el-input>
            </el-form-item>

            <el-form-item label="供应商:">
              <el-select class="align-width" clearable v-model="mainForm.supplierId" clearable placeholder="请选择供应商">
                <el-option v-for="{name, id} in suppliers" :key="id" :label="name" :value='id'></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="自营:">
              <el-select class="align-width" clearable v-model="mainForm.source" placeholder="请选择">
                <!-- <el-option label="全部" value='2'></el-option> -->
                <el-option label="本平台自营" value='2'></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="商品分类:">
              <el-cascader class="align-width" v-model="categoryIds" :options="categories" clearable placeholder="请选择商品分类"></el-cascader>
            </el-form-item>

            <el-form-item label="添加至表格时间:" label-width="120px">
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
              <el-button type="primary" @click="onSearch" v-hasPermi="['goods:productrecommend:list']">查询</el-button>
              <el-button type="success" @click="addNiceRecommendHandle" v-hasPermi="['goods:productrecommend:add']">添加好物推荐</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>

    <div class="mgmt-table">
      <el-table border :data="tableData" row-key="id" ref="multipleTable" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="productId" align="center" label="商品编号" :formatter="formatter"></el-table-column>
        <el-table-column prop="primaryImage" align="center" label="商品图片" :formatter="formatter" width="170"></el-table-column>
        <el-table-column prop="productName" align="center" label="商品标题" :formatter="formatter"></el-table-column>
        <el-table-column prop="categoryName" align="center" label="商品分类" :formatter="formatter"></el-table-column>
        <el-table-column prop="sellerName" align="center" label="供应商" :formatter="formatter"></el-table-column>
        <el-table-column prop="sort" align="center" label="排序" width="90">
          <template slot-scope="{row}">
            <el-button type="text" class="green2-txt-btn" v-hasPermi="['goods:productrecommend:sort']" @click="setSortIdx(row)">{{row.sort||'-'}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="sku" align="center" label="SKU" width="90">
          <template slot-scope="{row}">
            <el-button type="text" class="green2-txt-btn" @click="checkInitSku(row, 1)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" align="center" label="添加至表格时间" :formatter="formatter" width="170"></el-table-column>
        <el-table-column prop="collect" align="center" label="收藏" :formatter="formatter" width="90"></el-table-column>
        <el-table-column prop="sales" align="center" label="真实销量" :formatter="formatter" width="90">
          <template slot-scope="{row}">
            <el-button type="text" class="green2-txt-btn" @click="checkInitSku(row, 2)">{{row.sales}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="{row}">
            <el-button size="mini" type="warning" v-hasPermi="['goods:productrecommend:cancel']" @click="handleSingleCancel(row)">取消推荐</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-pagination text-right mt10">
        <el-button type="success" class="fl" v-hasPermi="['goods:productrecommend:cancel']" @click="handleMultCancel">批量取消推荐</el-button>
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

    <!-- sku信息 -->
    <el-dialog
      center
      :width="skuWidth"
      :title="skuTitle"
      :close-on-click-modal="false"
      :visible.sync="showSku"
      @close="closeSkuDio"
    >
      <el-table border row-key="id" :data="skuData" style="width: 100%">
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

        <template v-if="showSkuSign==3">
          <el-table-column
            v-for="({prop, label, width}, index) in skuSalesHeader"
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
import {supplierList, productSku} from '@/api/supplier/supplier';
import {recommendPage, recommendCancle, recommendSort} from '@/api/content/recommend';

export default {
  name: 'NiceRecommend',
  data () {
    return {
      suppliers: [],
      categories: [],
      mainForm: {
        name: '',
        source: '',
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
      skuTitle: '',
      skuWidth: '',
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
          label: '销售价',
          prop: 'price',
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
      skuSalesHeader: [
        {
          label: 'SKU编号',
          prop: 'skuNo',
        },
        {
          label: '销量',
          prop: 'sales',
        }
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
          label: '销售价',
          prop: 'editPrice',
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
      productId: '',
      showSkuSign: 0, // 0 - 初始 1 - 原始sku 2 - 编辑过的sku 3 - 销量sku
      multipleSel: [],
    }
  },
  mounted () {
    this.recommendPageReq();
    this.supplierListReq();
    this.categoryTreeReq();
  },
  methods: {
    // 多选改变
    handleSelectionChange(value) {
      this.multipleSel = value;
    },
    // 单个取消推荐操作
    handleSingleCancel (row) {
      let hasSameOrder = this.multipleSel.findIndex(({id}) => id == row.id);
      if (hasSameOrder == -1) this.$refs.multipleTable.toggleRowSelection(row);
      if (this.multipleSel.length > 1) return this.$message.error('只能对单个好物推荐进行取消操作');
      let ids = this.multipleSel.map(({id}) => id);

      this.diaConfirm(ids);
    },
    // 批量取消推荐操作
    handleMultCancel () {
      if (!this.multipleSel.length) return this.$message.error('请选择批量取消的好物推荐！');
      let ids = this.multipleSel.map(({id}) => id);

      this.diaConfirm(ids);
    },
    // 加载loading
    loadLoading (target) {
      const loadinger = this.$loading({
        target,
        lock: true,
        text: '取消中...',
        spinner: 'el-icon-sunny',
        customClass: 'loadingAnim',
      });

      return loadinger;
    },
    // 弹框确认
    diaConfirm (reqData) {
      const vm = this;
      const h = this.$createElement;
      const style = {padding: '0px 10px 20px', verticalAlign: 'middle'};
      const message = h('div', {style}, [
        h('i', {class: 'el-icon-question text-success mr5 ft20 vt-middle'}),
        h('strong', '取消推荐后，此商品将从列表中移除'),
        h('strong', {class: 'block'}, '是否确定取消推荐？')
      ]);

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
              vm.recommendCancleReq(reqData, cb, done);
            }, 1200);
          } else {
            done();
          }
        }
      }).then(() => {
        this.$message.success('取消推荐成功');
      }).catch(() => {});
    },
    // 设置好物推荐排序
    setSortIdx({sort, id}) {
      let val = sort || null;
      this.$prompt('请输入排序值', '提示', {
        showClose: false,
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入排序值',
        inputPattern: /^[1-9]\d*$/,
        inputValue: val,
        inputErrorMessage: '排序值为非负整数',
      }).then(({value}) => {
        this.recommendSortReq(id, +value);
      }).catch(() => {});
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
        key == 'editPrice' ||
        key == 'collect' ||
        key == 'sales'
      ) {
        return row[key] || 0;
      } else if (key == 'createdAt') {
        return this.formatDate(row[key], 'YYYY-MM-DD HH:mm:ss', '-');
      } else {
        return row[key] || '-';
      }
    },
    // 查看供应商/编辑的sku
    checkInitSku ({productId, edited}, sign) {
      this.productId = productId;
      if (sign == 1) {
        // 原始、编辑过的sku
        if (edited) {
          this.showSkuSign = 2;
        } else {
          this.showSkuSign = 1;
        };
        this.skuTitle = 'SKU货品信息';
        this.skuWidth = '1200px';
      } else {
        // 显示销量的sku
        this.showSkuSign = 3;
        this.skuTitle = 'SKU销量信息';
        this.skuWidth = '800px';
      };

      this.productSkuReq();
    },
    // 关闭sku弹窗
    closeSkuDio () {
      const {skuHeader, skuSalesHeader, skuPager, skuEditedHeader} = this.$options.data();
      this.showSku = false;
      this.skuData = [];
      this.showSkuSign = 0;
      this.skuWidth = '';
      this.skuTitle = '';
      this.skuHeader = skuHeader;
      this.skuSalesHeader = skuSalesHeader;
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
          this.skuSalesHeader.unshift(...header);
          this.skuEditedHeader.unshift(...header);
          this.showSku = true;
        } else {
          this.$message.error(message);
        };
      } catch (error) {
        throw error;
      }
    },
    // 取消推荐
    async recommendCancleReq (ids, cb, done) {
      try {
        await recommendCancle({ids});
        this.recommendPageReq();
        cb.close();
        done();
      } catch (error) {
        cb.close();
        throw error;
      }
    },
    // 获取供应商列表（不分页）
    async supplierListReq () {
      try {
        const {data} = await supplierList();
        this.suppliers = data.list || [];
        this.suppliers.unshift({id: -1, name: '全部'});
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
    // 获取推荐商品列表
    async recommendPageReq () {
      try {
        const categoryId = this.categoryIds[this.categoryIds.length - 1];
        const [startTime, endTime] = this.daterange || [];

        const {code, message, data: {list, pageSize, total}} = await recommendPage({
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
    // 提交排序
    async recommendSortReq (id, sort) {
      try {
        await recommendSort({id, sort});
        this.$message.success('排序更新成功');
        this.recommendPageReq();
      } catch (error) {
        throw error;
      }
    },
    // 条件搜索
    onSearch () {
      this.pager.curPage = 1;
      this.recommendPageReq();
    },
    // 分页数量修改
    handleSizeChange(val) {
      this.pager.size = val;
      this.recommendPageReq();
    },
    // 跳转当前页
    handleCurrentChange(val) {
      this.pager.curPage = val;
      this.recommendPageReq();
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
    // 添加好物推荐
    addNiceRecommendHandle() {
      const curView = this.$route;
      const path = 'niceRecommendAdd';

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          this.$router.replace({path});
        });
      });
    },
  }
}
</script>

<style lang="scss" scoped>
  .nice-recommend-wrap {
    padding: 20px;
    .top-search  {
      .align-width {
        width: 240px;
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
