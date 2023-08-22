<template>
  <div class="template-wrap">
    <div class="top-search">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form ref="mainForm" inline :model="mainForm" label-width="90px">

            <el-form-item label="模板名称:">
              <el-input class="align-width" v-model="mainForm.name" placeholder="请输入模板名称"></el-input>
            </el-form-item>

            <el-form-item label="计价方式:">
              <el-select class="align-width" clearable v-model="mainForm.method" clearable placeholder="请选择计价方式">
                <el-option v-for="{value, label} in valuationWay" :key="value" :label="label" :value='value'></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="是否包邮:">
              <el-select class="align-width" clearable v-model="mainForm.shippingType" clearable placeholder="请选择包邮方式">
                <el-option v-for="{value, label} in shippingTypes" :key="value" :label="label" :value='value'></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="运费模版来源:" label-width="105px">
              <el-select class="align-width" clearable v-model="mainForm.source" clearable placeholder="请选择运费模板来源">
                <el-option v-for="{id, name} in suppliers" :key="id" :label="name" :value='id'></el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="fr mr0">
              <el-button type="primary" @click="onSearch" v-hasPermi="['goods:admin_shipping_template:list']">查询</el-button>
              <el-button class="ml20" type="primary" v-hasPermi="['goods:admin_shipping_template:save']" @click="onAdd">添加模板</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div class="audit-table">
      <el-table border :data="tableData" style="width: 100%">
        <el-table-column prop="id" align="center" label="模板编号" :formatter="formatter"></el-table-column>
        <el-table-column prop="name" align="center" label="模板名称" :formatter="formatter"></el-table-column>
        <el-table-column prop="sourceName" align="center" label="运费模板来源" :formatter="formatter"></el-table-column>
        <el-table-column prop="shippingType" align="center" label="是否包邮" :formatter="formatter"></el-table-column>
        <el-table-column prop="method" align="center" label="计价方式" :formatter="formatter"></el-table-column>
        <el-table-column align="center" label="操作" width="170">
          <template slot-scope="{row}">
            <el-button size="mini" v-if="row.source!=0" v-hasPermi="['goods:admin_shipping_template:detail']" type="warning" @click="handleTabBtn(row, 'Detail')">查看</el-button>
            <el-button size="mini" v-if="row.source==0" v-hasPermi="['goods:admin_shipping_template:edit']" type="primary" @click="handleTabBtn(row, 'Edit')">编辑</el-button>
            <el-button size="mini" v-if="row.source==0" v-hasPermi="['goods:admin_shipping_template:del']" type="danger" @click="delFailureAudit(row)">删除</el-button>
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
import {templs, templDel} from '@/api/goods/index';
import {supplierList} from '@/api/supplier/supplier';


export default {
  name: 'FreightTemplate',
  data () {
    return {
      valuationWay: [
        {
          value: 1,
          label: '按照件数',
        },
        {
          value: 2,
          label: '按照重量',
        },
        {
          value: 3,
          label: '按照体积',
        },
      ],
      shippingTypes: [
        {
          value: 1,
          label: '卖家承担运费/包邮',
        },
        {
          value: 2,
          label: '自定义运费',
        },
      ],
      mainForm: {
        name: '',
        method: '',
        source: '',
        shippingType: '',
      },
      tableData: [],
      suppliers: [],
      pager: {
        size: 10,
        total: 0,
        curPage: 1,
      },
    }
  },
  mounted () {
    this.templsRequest();
    this.supplierListReq();
  },
  methods: {
    // 格式化
    formatter (row, column) {
      let key = column.property;

      if (key == 'method' || key == 'shippingType') {
        let types = key == 'method' ? this.valuationWay : this.shippingTypes;
        let cell = types.filter(e => row[key] == e.value);
        let label = cell.length ? cell[0].label : '-';
        if (key == 'method' && row['shippingType'] == 1) {
          label = '-';
        };

        return label;
      } else {
        return row[key] || '-';
      };
    },
    // 删除操作
    delFailureAudit ({id}) {
      this.$confirm('确定要删除该模板吗？', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.templDelRequest(id);
      }).catch(() => {
        this.$message({type: 'info', message: '已取消删除'});
      });
    },
    // 获取供应商列表（不分页）
    async supplierListReq () {
      try {
        let {data: {list}} = await supplierList();
        list = list || [];
        list.unshift({id: 0, name: '平台'});
        this.suppliers = list;
      } catch (error) {
        throw error;
      }
    },
    // 查询分页数据
    async templsRequest () {
      try {
        const {code, message, data: {list, pageSize, total}} = await templs({
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
        // ...
      }
    },
    // 删除供应商审核记录
    async templDelRequest (id) {
      try {
        const {code, message} = await templDel({id});
        if (code == 200) {
          this.$message.success('删除成功！');
          this.templsRequest();
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
    // 添加模板
    onAdd () {
      const curView = this.$route;

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          this.$router.replace({path: 'addTemplate'});
        });
      });
    },
    // 条件搜索
    onSearch () {
      this.pager.curPage = 1;
      this.templsRequest();
    },
    // 分页数量修改
    handleSizeChange(val) {
      this.pager.size = val;
      this.templsRequest();
    },
    // 跳转当前页
    handleCurrentChange(val) {
      this.pager.curPage = val;
      this.templsRequest();
    },
    // 编辑
    handleTabBtn({id}, type) {
      const query = {id};
      const curView = this.$route;
      const path = type == 'Edit' ? 'editTemplate' : 'templateDetail';

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
  .template-wrap {
    padding: 20px;
    .top-search  {
      .el-form-item {
        margin-right: 20px;
        ::v-deep .el-form-item__label {
          font-weight: 400;
        }
      }
    }
  }
</style>
