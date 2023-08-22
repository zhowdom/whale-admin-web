<template>
  <div class="mgmt-wrap">
    <div class="top-search">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form ref="searchForm" inline :model="searchForm" label-width="120px">

            <el-form-item label="供应商名称">
              <el-input class="align-width" v-model="searchForm.name" placeholder="请输入供应商名称"></el-input>
            </el-form-item>

            <el-form-item label="初始联系电话">
              <el-input class="align-width" v-model="searchForm.contactTelephone" placeholder="请输入初始联系电话"></el-input>
            </el-form-item>

            <el-form-item label="联系电话">
              <el-input class="align-width" v-model="searchForm.sellerPhone" placeholder="请输入联系电话"></el-input>
            </el-form-item>

            <el-form-item label="商户状态">
              <el-select class="align-width" clearable v-model="searchForm.status" placeholder="请选择商户状态">
                <el-option v-for="{label, value} in supplierStatus" :key="value" :label="label" :value='value'></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="账号状态">
              <el-select class="align-width" clearable v-model="searchForm.accountStatus" placeholder="请选择账号状态">
                <el-option v-for="{label, value} in accountStatus" :key="value" :label="label" :value='value'></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="供应商来源">
              <el-select class="align-width" clearable v-model="searchForm.source" placeholder="请选择供应商来源">
                <el-option v-for="{label, value} in supplierSource" :key="value" :label="label" :value='value'></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="成为供应商时间">
              <el-date-picker
                class="align-width"
                v-model="createAt"
                type="daterange"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item class="fr mr0">
              <el-button type="primary" @click="onSearch" v-hasPermi="['seller:seller:list']" class="mr20">查询</el-button>
              <el-button type="primary" @click="onAdd" v-hasPermi="['seller:seller:save']">添加</el-button>
            </el-form-item>

          </el-form>
        </el-col>
      </el-row>
    </div>

    <div class="mgmt-table">
      <el-table border :data="tableData" style="width: 100%">
        <el-table-column prop="id" align="center" label="供应商ID" :formatter="formatter"></el-table-column>
        <el-table-column prop="source" align="center" label="供应商来源" :formatter="formatter"></el-table-column>
        <el-table-column prop="name" align="center" label="供应商名称" :formatter="formatter" width="170"></el-table-column>
        <el-table-column prop="contactPerson" align="center" label="联系人" :formatter="formatter"></el-table-column>
        <el-table-column prop="contactTelephone" align="center" label="初始联系电话" :formatter="formatter"></el-table-column>
        <el-table-column prop="sellerPhone" align="center" label="联系电话" :formatter="formatter"></el-table-column>
        <el-table-column prop="createdAt" align="center" label="成为供应商时间" :formatter="formatter" width="170"></el-table-column>
        <el-table-column prop="productCount" align="center" label="上架商品数" :formatter="formatter"></el-table-column>
        <el-table-column prop="orderCount" align="center" label="总产生订单数" :formatter="formatter" width="110"></el-table-column>
        <el-table-column prop="accountStatus" align="center" label="账号状态" :formatter="formatter" width="95"></el-table-column>
        <el-table-column prop="status" align="center" label="商户状态" :formatter="formatter" width="95"></el-table-column>
        <el-table-column prop="updatedBy" align="center" label="操作人" :formatter="formatter"></el-table-column>
        <el-table-column prop="updatedAt" align="center" label="最后操作时间" :formatter="formatter" width="170"></el-table-column>
        <el-table-column align="center" label="操作" width="170">
          <template slot-scope="{row}">
            <el-button size="mini" type="warning" v-hasPermi="['seller:seller:detail']" @click="handleTabBtn(row, 'Detail')">查看</el-button>
            <el-button size="mini" type="primary" v-hasPermi="['seller:seller:status']" @click="handleTabBtn(row, 'Edit')">编辑状态</el-button>
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
  </div>
</template>

<script>
import {sellerList} from '@/api/supplier/supplier';

export default {
  name: 'SupplierAudit',
  data () {
    return {
      supplierStatus: [
        {
          value: 1,
          label: '正常',
        },
        {
          value: 2,
          label: '冻结',
        },
      ],
      supplierSource: [
        {
          value: 1,
          label: 'APP前端提交',
        },
        {
          value: 2,
          label: '供应商后台注册',
        },
        {
          value: 3,
          label: '后台录入',
        },
      ],
      accountStatus: [
        {
          value: 1,
          label: '正常',
        },
        {
          value: 2,
          label: '冻结',
        },
      ],
      searchForm: {
        contactPerson: '',
        sellerPhone: '',
        contactTelephone: '',
        endCreatedAt: '',
        name: '',
        source: '',
        startCreatedAt: '',
        status: '',
        accountStatus: '',
        orderItemList: [
          {
            asc: false,
            column: 'createdAt'
          }
        ],
      },
      createAt: [],
      pager: {
        curPage: 1,
        size: 10,
        total: 0,
      },
      tableData: [],
    }
  },
  mounted () {
    this.sellerListRequest();
  },
  methods: {
    onAdd () {
      const curView = this.$route;

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          // 跳转页面到新增
          this.$router.replace({
            path: 'addSupplier',
            query: {type: 'add'}
          });
        })
      });
    },
    // 格式化
    formatter (row, column) {
      let key = column.property;

      if (key == 'status' || key == 'source' || key == 'accountStatus') {
        let list = key == 'status' ? this.supplierStatus
                    : key == 'source' ? this.supplierSource
                      : this.accountStatus;

        let cell = list.filter(e => row[key] == e.value);
        let label = cell.length ? cell[0].label : '-';
        return label;
      } else if (key == 'updatedAt' || key == 'createdAt') {
        return this.formatDate(row[key], 'YYYY-MM-DD HH:mm:ss', '-');
      } else if (key == 'productCount' || key == 'orderCount') {
        return row[key] || 0;
      } else {
        return row[key] || '-';
      }
    },
    // 格式日期功能
    formatDate (date, format = 'YYYY-MM-DD', def = '') {
      return date ? this.$dayjs(date).format(format) : def;
    },
    // 查询分页数据
    async sellerListRequest () {
      try {
        const [startCreatedAt, endCreatedAt] = this.createAt || [];

        this.searchForm.startCreatedAt = startCreatedAt;
        this.searchForm.endCreatedAt = endCreatedAt;

        const {code, message, data: {list, pageSize, total}} = await sellerList({
          ...this.searchForm,
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
      this.sellerListRequest();
    },
    // 分页数量修改
    handleSizeChange(val) {
      this.pager.size = val;
      this.sellerListRequest();
    },
    // 跳转当前页
    handleCurrentChange(val) {
      this.pager.curPage = val;
      this.sellerListRequest();
    },
    // 查看
    handleTabBtn({id}, type) {
      const query = {id};
      const curView = this.$route;
      const path = type == 'Edit' ? 'editSupplier' : 'supplierDetail';

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
  .mgmt-wrap {
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
      .el-form-item {
        button {
          padding: 10px 30px;
        }
      }
    }
  }
</style>
