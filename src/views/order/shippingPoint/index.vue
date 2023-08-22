<template>
  <div class="shipping-point-wrap">
    <el-button class="fr mb15" type="primary" @click="onAdd">添加</el-button>
    <el-button class="fl mb15" v-hasPermi="['operation:deliverAddressManager:del']" type="danger" @click="batchDel">批量删除</el-button>

    <div class="shipping-point-table">
      <el-table border row-key="id" :data="tableData" ref="multipleTable" @selection-change="handleSelectionChange" style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" align="center" label="单据编号" :formatter="formatter"></el-table-column>
        <el-table-column prop="deliverName" align="center" label="发货点名称" :formatter="formatter"></el-table-column>
        <el-table-column prop="deliverType" align="center" label="默认为发货点" :formatter="formatter"></el-table-column>
        <el-table-column prop="deliverReturn" align="center" label="默认为退货点" :formatter="formatter"></el-table-column>
        <el-table-column prop="deliverUserName" align="center" label="发货人姓名" :formatter="formatter"></el-table-column>
        <el-table-column prop="address" align="center" label="地址" :formatter="formatter"></el-table-column>
        <el-table-column prop="phone" align="center" label="联系电话" :formatter="formatter"></el-table-column>
        <el-table-column align="center" label="操作" width="170">
          <template slot-scope="{row}">
            <el-button size="mini" type="primary" @click="handleTabBtn(row, 'Edit')">编辑</el-button>
            <el-button size="mini" v-hasPermi="['operation:deliverAddressManager:del']" type="danger" @click="singleDelShippingPoint(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

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
import citys from '@/utils/provinceCity';
import {shippingPointList, shippingPointDel} from '@/api/order/shippingPoint';

export default {
  name: 'ShippingPoint',
  data () {
    return {
      tableData: [],
      pager: {
        size: 10,
        total: 0,
        curPage: 1,
      },
      multipleSel: [],
    }
  },
  mounted () {
    this.shippingPointListReq();
  },
  methods: {
    // 格式化
    formatter (row, column) {
      let key = column.property;

      if (key == 'address') {
        let address = row[key];
        let provinceCode = row['provinceCode'];
        let cityCode = row['cityCode'];
        let areaCode = row['areaCode'];
        let labels = [];

        citys.forEach(e => {
          if (provinceCode == e.adCode) labels.push(e.label);
          if (e.children && e.children.length) {
            e.children.forEach(o => {
              if (cityCode == o.adCode) labels.push(o.label);
              if (o.children && o.children.length) {
                o.children.forEach(c => {
                  if (areaCode == c.adCode) labels.push(c.label);
                });
              };
            });
          };
        });

        labels = [...new Set(labels)]; // 去重
        return labels.length ? labels.join('') + address : address;
      } else if (key == 'deliverReturn' || key == 'deliverType') {
        return row[key] == 0 ? '是' : '否';
      } else {
        return row[key] || '-';
      };
    },
    // 多选
    handleSelectionChange(value) {
      this.multipleSel = value;
    },
    // 批量删除操作
    batchDel () {
      if (!this.multipleSel.length) return this.$message.error('请选择批量删除的发货点！');
      let ids = this.multipleSel.map(({id}) => id);
      ids = ids.join(',');

      this.$confirm('确定要删除这些发货点吗？', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.shippingPointDelReq(ids);
      }).catch(() => {
        this.$message({type: 'info', message: '已取消删除'});
      });
    },
    // 单个删除操作
    singleDelShippingPoint (row) {
      let hasSameOrder = this.multipleSel.findIndex(({id}) => id == row.id);
      if (hasSameOrder == -1) this.$refs.multipleTable.toggleRowSelection(row);
      if (this.multipleSel.length > 1) return this.$message.error('只能删除一条记录');

      this.$confirm('确定要删除该发货点吗？', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.shippingPointDelReq(row.id);
      }).catch(() => {
        this.$message({type: 'info', message: '已取消删除'});
      });
    },
    // 查询分页数据
    async shippingPointListReq () {
      try {
        const {code, message, data: {list, pageSize, total}} = await shippingPointList({
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
    // 删除发货单
    async shippingPointDelReq (ids) {
      try {
        const {code, message} = await shippingPointDel({ids});
        if (code == 200) {
          this.$message.success('删除成功！');
          this.shippingPointListReq();
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
    // 添加发货点
    onAdd () {
      const curView = this.$route;

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          this.$router.replace({path: 'addShippingPoint'});
        });
      });
    },
    // 分页数量修改
    handleSizeChange(val) {
      this.pager.size = val;
      this.shippingPointListReq();
    },
    // 跳转当前页
    handleCurrentChange(val) {
      this.pager.curPage = val;
      this.shippingPointListReq();
    },
    // 编辑
    handleTabBtn({id}) {
      const query = {id};
      const curView = this.$route;
      const path = 'editShippingPoint';

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
  .shipping-point-wrap {
    padding: 20px;
  }
</style>
