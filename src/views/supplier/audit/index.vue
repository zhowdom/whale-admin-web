<template>
  <div class="audit-wrap">
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

            <el-form-item label="审核状态">
              <el-select class="align-width" clearable v-model="searchForm.status" placeholder="请选择审核状态">
                <el-option v-for="{label, value} in auditStatus" :key="value" :label="label" :value='value'></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="供应商来源">
              <el-select class="align-width" clearable v-model="searchForm.source" placeholder="请选择供应商来源">
                <el-option v-for="{label, value} in supplierSource" :key="value" :label="label" :value='value'></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="提交时间">
              <el-date-picker
                class="align-width"
                v-model="createdAt"
                type="daterange"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="供应商账号">
              <el-input class="align-width" v-model="searchForm.account" placeholder="请输入供应商账号"></el-input>
            </el-form-item>

            <el-form-item class="fr mr0">
              <el-button type="primary" @click="onSearch" v-hasPermi="['seller:sellerApply:list']">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div class="audit-table">
      <el-table border :data="tableData" style="width: 100%">
        <el-table-column prop="source" align="center" label="供应商来源" :formatter="formatter"></el-table-column>
        <el-table-column prop="account" align="center" label="供应商账号" :formatter="formatter"></el-table-column>
        <el-table-column prop="createdAt" align="center" label="提交时间" width="170" :formatter="formatter"></el-table-column>
        <el-table-column prop="name" align="center" label="供应商名称" :formatter="formatter"></el-table-column>
        <el-table-column prop="contactPerson" align="center" label="联系人" :formatter="formatter"></el-table-column>
        <el-table-column prop="contactTelephone" align="center" label="初始联系电话" :formatter="formatter"></el-table-column>
        <el-table-column prop="sellerPhone" align="center" label="联系电话" :formatter="formatter"></el-table-column>
        <el-table-column prop="status" align="center" label="状态" width="145" :formatter="formatter"></el-table-column>
        <el-table-column prop="auditorName" align="center" label="操作人" :formatter="formatter"></el-table-column>
        <el-table-column prop="updatedAt" align="center" label="最后操作时间" width="170" :formatter="formatter"></el-table-column>
        <el-table-column align="center" label="操作" width="170">
          <template slot-scope="{row}">
            <el-button size="mini" v-if="row.status==1" type="primary" v-hasPermi="['seller:sellerApply:audit']" @click="handleTabBtn(row, 'Audit')">审核</el-button>
            <el-button size="mini" v-if="row.status!=1" type="warning" v-hasPermi="['seller:sellerApply:audit']" @click="handleTabBtn(row, 'Detail')">查看</el-button>
            <el-button size="mini" v-if="row.status==3" type="danger" v-hasPermi="['seller:sellerApply:delete']" @click="delFailureAudit(row)">删除</el-button>
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
import {supplierDelete, supplierAuditList} from '@/api/supplier/supplier';


export default {
  name: 'SupplierAudit',
  data () {
    return {
      auditStatus: [
        {
          value: 1,
          label: '待审核',
        },
        {
          value: 2,
          label: '审核通过',
        },
        {
          value: 3,
          label: '审核失败',
        },
        {
          value: 4,
          label: '未提交资料'
        }
      ],
      supplierSource: [
        {
          value: 1,
          label: 'APP前端提交',
        },
        {
          value: 2,
          label: '供应商后台注册',
        }
      ],
      searchForm: {
        name: '',
        sellerPhone: '',
        contactTelephone: '',
        status: '',
        source: '',
        startCreatedAt: '',
        endCreatedAt: '',
        account: '',
        orderItemList: [
          {
            asc: false,
            column: 'createdAt'
          }
        ],
      },
      createdAt: [],
      pager: {
        curPage: 1,
        size: 10,
        total: 0,
      },
      tableData: [],
    }
  },
  mounted () {
    this.supplierAuditListRequest();
  },
  methods: {
    // 格式化
    formatter (row, column) {
      let key = column.property;

      if (key == 'status') {
        const h = this.$createElement;
        const {label, value} = this.auditStatus.filter(e => row[key] == e.value)[0];
        const style = {color: value === 1 ? '#51C1FF' : value === 3 ? '#999' : ''};
        const span = h('span', {style}, label);
        return span || '-';
      } else if (key == 'source') {
        const {label} = this.supplierSource.filter(e => row[key] == e.value)[0];
        return label || '-';
      } else if (key == 'updatedAt' || key == 'createdAt') {
        return this.formatDate(row[key], 'YYYY-MM-DD HH:mm:ss', '-');
      } else {
        return row[key] || '-';
      }
    },
    // 删除操作
    delFailureAudit ({id}) {
      this.$confirm('确定要删除该记录吗？', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.supplierDeleteRequest(id);
      }).catch(() => {
        this.$message({type: 'info', message: '已取消删除'});
      });
    },
    // 格式日期功能
    formatDate (date, format = 'YYYY-MM-DD', def = '') {
      return date ? this.$dayjs(date).format(format) : def;
    },
    // 查询分页数据
    async supplierAuditListRequest () {
      try {
        const [startCreatedAt, endCreatedAt] = this.createdAt || [];

        this.searchForm.startCreatedAt = startCreatedAt;
        this.searchForm.endCreatedAt = endCreatedAt;

        const {code, message, data: {list, pageSize, total}} = await supplierAuditList({
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
    // 删除供应商审核记录
    async supplierDeleteRequest (id) {
      try {
        const {code, message} = await supplierDelete({id});
        if (code == 200) {
          this.$message.success('删除成功！');
          this.supplierAuditListRequest();
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
      this.supplierAuditListRequest();
    },
    // 分页数量修改
    handleSizeChange(val) {
      this.pager.size = val;
      this.supplierAuditListRequest();
    },
    // 跳转当前页
    handleCurrentChange(val) {
      this.pager.curPage = val;
      this.supplierAuditListRequest();
    },
    // 查看、审核
    handleTabBtn({id, source, status}, type) {
      const query = {id, source, status};
      const curView = this.$route;
      if (status == 4 && type == 'Detail') {
        this.$alert('暂无可查看资料！', '', {
          center: true,
          confirmButtonText: '确定',
          showConfirmButton: false,
          callback: action => {}
        });
      } else {
        const path = type == 'Audit' ? 'auditSupplier' : 'auditDetail';

        this.$store.dispatch('tagsView/delView', curView).then(() => {
          this.$nextTick(() => {
            this.$router.replace({path, query});
          });
        });
      }
    },
  }
}
</script>

<style lang="scss" scoped>
  .audit-wrap {
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
      .el-form-item {
        button {
          padding: 10px 30px;
        }
      }
    }
  }
</style>
