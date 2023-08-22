<template>
  <!-- 指定分类 -->
  <div class="categories">
    <div class="init-table">
      <div class="mb15">
        <div class="input-tips inline-block mr5">搜索分类</div>
        <el-cascader
          clearable
          class="input-class"
          :options="options"
          :props="cprops"
          ref="ocascader"
          @change="handleChange"
          placeholder="选择分类名称"
        >
        </el-cascader>
      </div>

      <div class="table-header">
        <div class="table-tips">
          最多可以添加{{maxCount}}个分类  已选中
          &nbsp;<span class="text-danger">{{addedTable.length}}</span>&nbsp;个分类
        </div>
        <el-button size="mini" type="primary" v-hasPermi="['']" @click="handleMultAdd">批量添加</el-button>
      </div>

      <el-table border row-key="categoryId" ref="initTable" :data="initTable" @selection-change="initSelectionChange">
        <el-table-column type="selection" :selectable="selectableInit" width="55"></el-table-column>
        <el-table-column prop="categoryName" align="center" label="分类名称" :formatter="formatter"></el-table-column>
        <el-table-column align="center" label="操作" width="100">
          <template slot-scope="{row}">
            <el-button type="text" v-if="transBtn(row.categoryId)" v-hasPermi="['']" @click="handleSingleAdd(row)">添加</el-button>
            <div v-else class="text-muted lht36">已添加</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-pagination text-right mt10">
        <el-pagination
          background
          :total="pagerInit.total"
          :page-size="pagerInit.size"
          :current-page="pagerInit.curPage"
          layout="total, prev, pager, next"
          @current-change="handleInitCurrentChange">
        </el-pagination>
      </div>
    </div>

    <div class="added-table">
      <div class="table-header">
        <div class="table-tips">
          购买以下分类商品可使用优惠券抵扣金额  已选中
          &nbsp;<span class="text-danger">{{addedTable.length}}</span>&nbsp;个分类
          </div>
        <el-button size="mini" type="danger" v-hasPermi="['']" @click="handleMultRemove">批量移除</el-button>
      </div>

      <el-table border row-key="id" ref="addedTable" :data="transAddTableData" @selection-change="addedSelectionChange">
        <el-table-column type="selection" :selectable="selectableAdd" width="55"></el-table-column>
        <el-table-column prop="categoryName" align="center" label="分类名称" :formatter="formatter"></el-table-column>
        <el-table-column align="center" label="操作" width="100">
          <template slot-scope="{row}">
            <el-button class="red-txt-btn" type="text" v-hasPermi="['']" @click="handleSingleRemove(row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-pagination text-right mt10">
        <el-pagination
          background
          :total="transAddedTotal"
          :page-size="pagerAdd.size"
          :current-page="pagerAdd.curPage"
          layout="total, prev, pager, next"
          @current-change="handleAddCurrentChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {categoryTree, categoryList} from '@/api/coupons';

export default {
  name: 'Categories',
  props: ['maxCount'],
  computed: {
    transBtn () {
      return rowId => {
        return this.addedTable.findIndex(({categoryId}) => categoryId == rowId) == -1;
      }
    },
    transAddedTotal () {
      return this.addedTable.length;
    },
    transAddTableData () {
      let {size, curPage} = this.pagerAdd;
      let start = (curPage - 1) * size;
      let end = curPage * size;
      let tableData = this.addedTable.slice(start, end);
      return tableData;
    }
  },
  data () {
    return {
      options: [],
      cprops: {
        children: 'child',
        value: 'categoryId',
        label: 'categoryName',
        checkStrictly: true
      },
      search: '',
      initTable: [],
      addedTable: [],
      initTableSel: [],
      addedTableSel: [],
      pagerInit: {
        size: 10,
        total: 0,
        curPage: 1,
      },
      pagerAdd: {
        size: 10,
        total: 0,
        curPage: 1,
      },
    }
  },
  mounted () {
    this.categoryTreeReq();
  },
  methods: {
    // 分类选择
    handleChange (arr) {
      this.initTable = [];
      const catsLen = arr.length;
      this.search = arr.length ? arr.slice(-1) + '' : '';
      if (catsLen == 1) this.categoryListReq();
      if (catsLen == 2) this.handlePreciseCdata();
      this.$refs.ocascader.dropDownVisible = false;
    },
    // 精确查询（二级）分类的数据处理
    handlePreciseCdata () {
      const cData = [];
      this.options.some(pl => {
        pl.child?.some(cl => {
          if (cl.categoryId == this.search) {
            cData.push(cl);
            return true;
          };
        });
      });
      this.initTable = cData;
      this.pagerInit.size = 10;
      this.pagerInit.total = cData.length;
    },
    // 递归处理分类
    handleCdata (arr) {
      arr?.map(el => {
        if (el?.child?.length) {
          this.handleCdata(el.child);
        } else {
          this.$delete(el, 'child');
        }
      });

      return arr;
    },
    // 获取分类列表不分页
    async categoryTreeReq () {
      try {
        const {data: {list}} = await categoryTree();
        const finalData = list?.length ? this.handleCdata(list) : [];
        this.options = finalData;
      } catch (error) {
        throw error;
      }
    },
    // 商品分类分页
    async categoryListReq () {
      try {
        const {code, message, data: {list, pageSize, total}} = await categoryList({
          parentId: this.search,
          pageSize: this.pagerInit.size,
          currentPage: this.pagerInit.curPage,
        });
        if (code == 200) {
          if (this.search && !list.length) {
            const cData = [];
            // 只有一级分类
            this.options.some(pl => {
              if (pl.categoryId == this.search) {
                cData.push(pl);
                return true;
              };
            });
            this.initTable = cData;
            this.pagerInit.size = 10;
            this.pagerInit.total = cData.length;
            return;
          };
          this.initTable = list;
          this.pagerInit.size = pageSize;
          this.pagerInit.total = total;
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        throw error;
      }
    },
    // 跳转当前页 - init
    handleInitCurrentChange(val) {
      this.pagerInit.curPage = val;
      this.categoryListReq();
    },
    // 跳转当前页 - added
    handleAddCurrentChange(val) {
      this.pagerAdd.curPage = val;
    },
    // 初始表格多选改变
    initSelectionChange(value) {
      this.initTableSel = value;
    },
    // 已添加的表格多选改变
    addedSelectionChange(value) {
      this.addedTableSel = value;
    },
    // 格式化
    formatter (row, column) {
      let key = column.property;

      if (key == 'categoryName') {
        let cell = '';
        const cid = row['categoryId'];

        this.options.some(pl => {
          if (pl.categoryId == cid) {
            cell = pl.categoryName;
            return true;
          };
          pl.child?.some(cl => {
            if (cl.categoryId == cid) {
              cell = `${pl.categoryName} > ${cl.categoryName}`;
              return true;
            };
          });
        });

        return cid ? cell : '-';
      }

      return row[key] || '-';
    },
    // init是否可选择
    selectableInit (row, index) {
      row['selected'] = row['selected'] || false;
      return !row['selected'];
    },
    // add是否可选择
    selectableAdd (row, index) {
      row['selected'] = row['selected'] || false;
      return row['selected'];
    },
    // 单个添加按钮操作
    handleSingleAdd (row) {
      const {initTable} = this.$refs;
      const arrList = this.initTableSel.filter(({selected}) => selected == false);
      if (arrList.length > 1) return this.$message.error('只能添加单个商品分类');
      const hasSame = this.initTableSel.some(({categoryId}) => categoryId == row.categoryId);
      if (!hasSame) initTable.toggleRowSelection(row);
      this.$set(row, 'selected', true);
      this.addedTable.push(row);
    },
    // 批量添加按钮操作
    handleMultAdd () {
      const arrList = this.initTableSel.filter(el => el['selected'] == false);
      if (!arrList.length) return this.$message.error('请选择批量添加的商品分类！');
      arrList.map(el => this.$set(el, 'selected', true));
      this.initTableSel.map(el => {
        if (this.addedTable.every(({categoryId}) => categoryId != el.categoryId)) this.addedTable.push(el);
      });
    },
    // 单个移除按钮操作
    handleSingleRemove (row) {
      const {initTable} = this.$refs;
      const arrList = this.addedTableSel.filter(({selected}) => selected == true);
      if (arrList.length > 1) return this.$message.error('只能移除单个商品分类');
      let index = this.addedTable.findIndex(({categoryId}) => categoryId == row.categoryId);
      initTable.toggleRowSelection(row);
      this.$set(row, 'selected', false);
      this.addedTable.splice(index, 1);
    },
    // 批量移除按钮操作
    handleMultRemove () {
      const {initTable} = this.$refs;
      if (!this.addedTableSel.length) return this.$message.error('请选择批量移除的商品分类！');
      this.addedTableSel.map(el => {
        let index = this.addedTable.findIndex(cl => el.categoryId == cl.categoryId);
        if (index >= 0) {
          initTable.toggleRowSelection(el);
          this.$set(el, 'selected', false);
          this.addedTable.splice(index, 1);
        };
      });
    },
    // 设置ids
    getComsIds () {
      return this.addedTable.map(({categoryId}) => categoryId);
    },
  }
}
</script>

<style lang="scss" scoped>
  .categories {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    .init-table, .added-table {
      width: 49.5%;
      margin-top: 12px;
    }
    .added-table {
      margin-top: 65px;
    }
    .input-class {
      width: 300px;
    }
    .input-tips {
      color: #9ca7b5;
      vertical-align: middle;
      line-height: 22px;
      font-size: 14px;
    }
    .table-header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 5px;
      .table-tips {
        color: #9ca7b5;
        font-size: 14px;
      }
    }
    .el-form-item {
      ::v-deep {
        .el-form-item__label {
          font-weight: 400;
        }
        .el-input-group__append {
          padding: 0 12px;
        }
      }
    }
  }
</style>
