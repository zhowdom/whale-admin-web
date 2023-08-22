<template>
  <!-- 指定商品 -->
  <div class="goods">
    <div class="goods-wrap">
      <div class="init-table">
        <div class="mb15">
          <pure-search label="添加商品:" placeholder="请输入商品名称/商品货号" @search="searchHandle"/>
        </div>

        <div class="table-header">
          <div class="table-tips">
            最多可以添加{{maxCount}}件商品  已选中
            &nbsp;<span class="text-danger">{{addedTable.length}}</span>&nbsp;件商品
          </div>
          <el-button size="mini" type="primary" v-hasPermi="['']" @click="handleMultAdd">批量添加</el-button>
        </div>

        <el-table border row-key="id" ref="initTable" :data="initTable" @selection-change="initSelectionChange">
          <el-table-column type="selection" :selectable="selectableInit" width="55"></el-table-column>
          <el-table-column prop="name" align="center" label="商品名称" :formatter="formatter"></el-table-column>
          <el-table-column prop="primaryImage" align="center" label="商品图片" width="140" :formatter="formatter"></el-table-column>
          <el-table-column prop="itemNo" align="center" label="货号" :formatter="formatter"></el-table-column>
          <el-table-column align="center" label="操作" width="100">
            <template slot-scope="{row}">
              <el-button type="text" v-if="transBtn(row.id)" v-hasPermi="['']" @click="handleSingleAdd(row)">添加</el-button>
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
            购买以下商品可使用优惠券抵扣金额  已选中
            &nbsp;<span class="text-danger">{{addedTable.length}}</span>&nbsp;件商品
            </div>
          <el-button size="mini" type="danger" v-hasPermi="['']" @click="handleMultRemove">批量移除</el-button>
        </div>

        <el-table border row-key="id" ref="addedTable" :data="transAddTableData" @selection-change="addedSelectionChange">
          <el-table-column type="selection" :selectable="selectableAdd" width="55"></el-table-column>
          <el-table-column prop="name" align="center" label="商品名称" :formatter="formatter"></el-table-column>
          <el-table-column prop="primaryImage" align="center" label="商品图片" width="140" :formatter="formatter"></el-table-column>
          <el-table-column prop="itemNo" align="center" label="货号" :formatter="formatter"></el-table-column>
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
  </div>
</template>

<script>
import {goodsList, goods500List} from '@/api/coupons';
import PureSearch from '@/components/PureSearch';

export default {
  name: 'Goods',
  props: ['maxCount', 'itemIds'],
  components: {PureSearch},
  computed: {
    transBtn () {
      return rowId => {
        return this.addedTable.findIndex(({id}) => id == rowId) == -1;
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
    },
  },
  data () {
    return {
      keywords: '',
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
    this.goodsListReq();
    this.goodsSelectedListReq();
  },
  methods: {
    // 商品列表
    async goodsListReq () {
      try {
        const {initTable} = this.$refs;
        const {code, message, data: {list, pageSize, total}} = await goodsList({
          keywords: this.keywords,
          pageSize: this.pagerInit.size,
          currentPage: this.pagerInit.curPage,
        });
        if (code == 200) {
          this.initTable = list;
          this.pagerInit.size = pageSize;
          this.pagerInit.total = total;

          if (this.itemIds?.length) {
            this.initTable.map(row => {
              if (this.itemIds.includes(row.id)) {
                this.$nextTick(() => initTable.toggleRowSelection(row, true));
                this.$set(row, 'selected', true);
              }
            });
          };
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        throw error;
      }
    },
    // 查询选中的商品
    async goodsSelectedListReq () {
      try {
        if (!this.itemIds?.length) return;
        const {code, message, data: {list}} = await goods500List({
          productIds: this.itemIds.join(',')
        });
        if (code == 200) {
          list.map(el => el['selected'] = true);
          this.addedTable = list;
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        throw error;
      }
    },
    // 搜索功能
    searchHandle (str) {
      this.keywords = str;
      this.pagerInit.curPage = 1;
      this.goodsListReq();
    },
    // 跳转当前页 - init
    handleInitCurrentChange(val) {
      this.pagerInit.curPage = val;
      this.goodsListReq();
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
      const h = this.$createElement;

      if (key == 'primaryImage') {
        let src = row[key];
        let fit = 'cover';
        let style = {textAlign: 'center', color: '#c0c4cc'};
        const imgCell = h('el-image', {props: {src, fit}}, [
          h('div', {slot: 'placeholder', style}, '加载中...')
        ]);

        return imgCell;
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
      if (arrList.length > 1) return this.$message.error('只能添加单个商品');
      const hasSame = this.initTableSel.some(({id}) => id == row.id);
      if (!hasSame) initTable.toggleRowSelection(row, true);
      this.$set(row, 'selected', true);
      this.addedTable.push(row);
    },
    // 批量添加按钮操作
    handleMultAdd () {
      const arrList = this.initTableSel.filter(el => el['selected'] == false);
      if (!arrList.length) return this.$message.error('请选择批量添加的商品！');
      arrList.map(el => this.$set(el, 'selected', true));
      this.initTableSel.map(el => {
        if (this.addedTable.every(({id}) => id != el.id)) this.addedTable.push(el);
      });
    },
    // 单个移除按钮操作
    handleSingleRemove (row) {
      const {initTable} = this.$refs;
      const arrList = this.addedTableSel.filter(({selected}) => selected == true);
      if (arrList.length > 1) return this.$message.error('只能移除单个商品');
      let index = this.addedTable.findIndex(({id}) => id == row.id);
      // 编辑时因为原始数据与添加的数据不同源，所以修改原始数据
      this.initTable.map(el => {
        if (el.id == row.id) {
          initTable.toggleRowSelection(el, false);
          this.$set(el, 'selected', false);
        }
      });
      this.addedTable.splice(index, 1);
    },
    // 批量移除按钮操作
    handleMultRemove () {
      const {initTable} = this.$refs;
      if (!this.addedTableSel.length) return this.$message.error('请选择批量移除的商品！');
      this.addedTableSel.map(el => {
        let index = this.addedTable.findIndex(cl => el.id == cl.id);
        if (index >= 0) {
          // 编辑时因为原始数据与添加的数据不同源，所以修改原始数据
          this.initTable.map(cl => {
            if (cl.id == el.id) {
              initTable.toggleRowSelection(cl, false);
              this.$set(cl, 'selected', false);
            }
          });
          this.addedTable.splice(index, 1);
        };
      });
    },
    // 设置ids
    getComsIds () {
      return this.addedTable.map(({id}) => id);
    },
  }
}
</script>

<style lang="scss" scoped>
  .goods {
    .goods-wrap {
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
    .form-btns {
      text-align: center;
      margin-top: 65px;
    }
  }
</style>
