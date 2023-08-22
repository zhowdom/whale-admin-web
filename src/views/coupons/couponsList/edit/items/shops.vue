<template>
  <!-- 指定商店 -->
  <div class="shops">
    <div class="mb15">
      <div class="input-tips inline-block mr5">选择自营店</div>
      <el-select v-model="search" placeholder="请选择">
        <el-option label="本平台自营店" :value="1"></el-option>
        <el-option label="其他自营店" :value="2"></el-option>
      </el-select>
    </div>
    <div class="init-table">
      <div class="table-header">
        <div class="table-tips">
          最多可以添加{{maxCount}}个自营店  已选中
          &nbsp;<span class="text-danger">{{addedTable.length}}</span>&nbsp;个自营店
        </div>
        <el-button size="mini" type="primary" v-hasPermi="['']" @click="handleMultAdd">批量添加</el-button>
      </div>

      <el-table border row-key="id" ref="initTable" :data="initTable" @selection-change="initSelectionChange">
        <el-table-column type="selection" :selectable="selectableInit" width="55"></el-table-column>
        <el-table-column prop="n1" align="center" label="自营店铺名称" :formatter="formatter"></el-table-column>
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
          购买以下自营店的商品可使用优惠券抵扣金额  已选中
          &nbsp;<span class="text-danger">{{addedTable.length}}</span>&nbsp;个自营店
          </div>
        <el-button size="mini" type="danger" v-hasPermi="['']" @click="handleMultRemove">批量移除</el-button>
      </div>

      <el-table border row-key="id" ref="addedTable" :data="transAddTableData" @selection-change="addedSelectionChange">
        <el-table-column type="selection" :selectable="selectableAdd" width="55"></el-table-column>
        <el-table-column prop="n1" align="center" label="自营店铺名称" :formatter="formatter"></el-table-column>
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
          :page-size="pagerSel.size"
          :current-page="pagerSel.curPage"
          layout="total, prev, pager, next"
          @current-change="handleAddCurrentChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Shops',
  props: ['maxCount'],
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
    }
  },
  data () {
    return {
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
  methods: {
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
      if (!hasSame) initTable.toggleRowSelection(row);
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
      initTable.toggleRowSelection(row);
      this.$set(row, 'selected', false);
      this.addedTable.splice(index, 1);
    },
    // 批量移除按钮操作
    handleMultRemove () {
      const {initTable} = this.$refs;
      if (!this.addedTableSel.length) return this.$message.error('请选择批量移除的商品！');
      this.addedTableSel.map(el => {
        let index = this.addedTable.findIndex(cl => el.id == cl.id);
        if (index >= 0) {
          initTable.toggleRowSelection(el);
          this.$set(el, 'selected', false);
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
  .shops {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    .init-table, .added-table {
      width: 49.5%;
      margin-top: 12px;
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
