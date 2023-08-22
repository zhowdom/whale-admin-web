<template>
  <div class="add-nice-recommend-wrap">
    <div class="top-search">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form ref="mainForm" inline :model="mainForm" label-width="90px">

            <el-form-item label="商品名称:">
              <el-input class="align-width" v-model="mainForm.name" placeholder="请输入商品名称"></el-input>
            </el-form-item>

            <el-form-item label="供应商:">
              <el-select class="align-width" clearable v-model="mainForm.supplierId" placeholder="请选择供应商">
                <el-option v-for="{name, id} in suppliers" :key="id" :label="name" :value='id'></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="自营:">
              <el-select class="align-width" clearable v-model="mainForm.source" placeholder="请选择">
                <!-- <el-option label="全部" :value='2'></el-option> -->
                <el-option label="本平台自营" value='2'></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="商品分类:">
              <el-cascader class="align-width" v-model="categoryIds" :options="categories" clearable placeholder="请选择商品分类"></el-cascader>
            </el-form-item>

            <el-form-item class="fr mr0">
              <el-button type="primary" @click="onSearch">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>

    <div class="mgmt-table">
      <div class="text-muted mb5 ft14">一次最多可以添加30件商品  已选中 <span class="text-danger">{{multipleSel.length}}</span> 件商品</div>
      <el-table border :data="tableData" row-key="id" ref="multipleTable" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" align="center" label="商品名称" :formatter="formatter"></el-table-column>
        <el-table-column prop="primaryImage" align="center" label="商品图片" :formatter="formatter" width="170"></el-table-column>
        <el-table-column prop="sellerName" align="center" label="供应商" :formatter="formatter"></el-table-column>
        <el-table-column prop="categoryName" align="center" label="商品分类" :formatter="formatter"></el-table-column>
        <el-table-column prop="itemNo" align="center" label="货号" :formatter="formatter"></el-table-column>
        <el-table-column align="center" label="操作" width="100">
          <template slot-scope="{row}">
            <el-button size="mini" type="warning" v-hasPermi="['goods:productrecommend:add']" @click="handleSingleAdd(row)">添加</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-pagination text-right mt10">
        <el-button type="success" class="fl" v-hasPermi="['goods:productrecommend:add']" @click="handleMultAdd">批量添加推荐</el-button>
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


      <div class="form-btns">
        <el-button type="warning" @click="goBackList">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {categoryTree} from '@/api/goods/index';
import {supplierList} from '@/api/supplier/supplier';
import {recommendList, recommendSave} from '@/api/content/recommend';

export default {
  name: 'AddNiceRecommend',
  data () {
    return {
      suppliers: [],
      categories: [],
      mainForm: {
        name: '',
        source: '',
        supplierId: '',
      },
      categoryIds: [],
      pager: {
        size: 10,
        total: 0,
        curPage: 1,
      },
      tableData: [],
      productId: '',
      multipleSel: [],
    }
  },
  mounted () {
    this.recommendListReq();
    this.supplierListReq();
    this.categoryTreeReq();
  },
  methods: {
    // 多选改变
    handleSelectionChange(value) {
      this.multipleSel = value;
    },
    // 单个添加推荐操作
    handleSingleAdd (row) {
      let hasSameOrder = this.multipleSel.findIndex(({id}) => id == row.id);
      if (hasSameOrder == -1) this.$refs.multipleTable.toggleRowSelection(row);
      if (this.multipleSel.length > 1) return this.$message.error('只能对单个商品进行添加操作');
      let productIds = this.multipleSel.map(({id}) => id);

      this.diaConfirm(productIds);
    },
    // 批量添加推荐操作
    handleMultAdd () {
      if (!this.multipleSel.length) return this.$message.error('请选择批量添加的好物推荐！');
      let productIds = this.multipleSel.map(({id}) => id);

      this.diaConfirm(productIds);
    },
    // 加载loading
    loadLoading (target) {
      const loadinger = this.$loading({
        target,
        lock: true,
        text: '添加中...',
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
      const message = h('strong', {style, class: 'block'}, '是否确定添加推荐？');

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
              vm.recommendSaveReq(reqData, cb, done);
            }, 1200);
          } else {
            done();
          }
        }
      }).then(() => {
        this.$message.success('添加推荐成功');
      }).catch(() => {});
    },
    // 格式化
    formatter (row, column) {
      let key = column.property;
      const h = this.$createElement;

      if (key == 'primaryImage') {
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
          firstCategoryId, secondCategoryId
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
      } else if (key == 'status') {
        let status = row['status'];
        let upAt = row['upAt'] || 0;
        let now = Date.now();
        let isUp = (status == 3) && (now >= upAt);
        let style = isUp ? {} : {color: '#AEAEAE'};
        let txt = isUp ? '已上架' : '已下架';
        let cell = h('span', {style}, txt);

        return cell;
      } else {
        return row[key] || '-';
      }
    },
    // 格式日期功能
    formatDate (date, format = 'YYYY-MM-DD', def = '') {
      return date ? this.$dayjs(date).format(format) : def;
    },
    // 添加推荐
    async recommendSaveReq (productIds, cb, done) {
      try {
        await recommendSave({productIds});
        this.recommendListReq();
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
    // 获取商品列表
    async recommendListReq () {
      try {
        const categoryId = this.categoryIds[this.categoryIds.length - 1];

        const {code, message, data: {list, pageSize, total}} = await recommendList({
          ...this.mainForm,
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
      this.recommendListReq();
    },
    // 分页数量修改
    handleSizeChange(val) {
      this.pager.size = val;
      this.recommendListReq();
    },
    // 跳转当前页
    handleCurrentChange(val) {
      this.pager.curPage = val;
      this.recommendListReq();
    },
    // 返回
    goBackList () {
      const curView = this.$route;

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          this.$router.replace({path: 'niceRecommend'}); // 返回列表页
        });
      });
    },
  }
}
</script>

<style lang="scss" scoped>
  .add-nice-recommend-wrap {
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
    .form-btns {
      text-align: center;
      margin-top: 35px;
      margin-bottom: 30px;
    }
  }
</style>
