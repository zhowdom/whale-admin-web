<template>
  <div class="parameter-type-wrap">
    <div class="top-search">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form ref="searchForm" inline :model="searchForm">
            <el-form-item label="分类名称:">
              <el-input v-model="searchForm.categoryName" placeholder="请输入分类名称"></el-input>
            </el-form-item>
            <el-form-item class="fr mr0">
              <el-button type="primary" @click="onSearch" v-hasPermi="['goods:params:save']">查询</el-button>
              <el-button type="primary" @click="onAdd" v-hasPermi="['goods:params:list']">添加</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div class="audit-table">
      <el-table border :data="tableData" style="width: 100%">
        <el-table-column prop="paramsId" align="center" label="编号" :formatter="formatter"></el-table-column>
        <el-table-column prop="paramsNum" align="center" label="参数量" :formatter="formatter"></el-table-column>
        <el-table-column prop="categoryName" align="center" label="分类名称" :formatter="formatter"></el-table-column>
        <el-table-column prop="paramsInfo" align="center" label="可选值列表" width="420">
          <template slot-scope="{row}">
            <el-tooltip popper-class="wth460" effect="dark" :content="row.paramsInfo.join(',')" placement="top-start">
              <div class="fix-width">{{row.paramsInfo.join(',')}}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="updatedBy" align="center" label="操作人" :formatter="formatter"></el-table-column>
        <el-table-column prop="updatedAt" align="center" label="操作时间" :formatter="formatter" width="170"></el-table-column>
        <el-table-column align="center" label="操作" width="170">
          <template slot-scope="{row}">
            <el-button size="mini" type="primary" v-hasPermi="['goods:params:edit']" @click="handleTabBtn(row)">编辑</el-button>
            <el-button size="mini" type="danger" v-hasPermi="['goods:params:del']" @click="delFailureAudit(row)">删除</el-button>
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
  </div>
</template>

<script>
import {paramsList, paramsDelete, categoryTree} from '@/api/goods/index';

export default {
  name: 'ParameterType',
  data () {
    return {
      searchForm: {
        categoryName: '',
      },
      tableData: [],
      cascaderData: [],
      pager: {
        curPage: 1,
        size: 10,
        total: 0,
      },
    }
  },
  async mounted () {
    await this.paramsListRequest();
    await this.categoryTreeRequest();
  },
  methods: {
    // 格式化
    formatter (row, column) {
      let key = column.property;

      if (key == 'paramsNum') {
        return row['paramsInfo'].length || 0;
      } else if (key == 'updatedAt') {
        return this.formatDate(row[key], 'YYYY-MM-DD HH:mm:ss', '-');
      } else if (key == 'categoryName') {
        let cell = '';
        const cid = row['categoryId'];

        this.cascaderData.some(pl => {
          if (pl.value == cid) {
            cell = pl.label;
            return true;
          };
          if (pl.children) {
            pl.children.some(cl => {
              if (cl.value == cid) {
                cell = `${pl.label} > ${cl.label}`;
                return true;
              };
            });
          };
        });

        return row['categoryId'] ? cell : '-';
      } else {
        return row[key] || '-';
      }
    },
    // 删除操作
    delFailureAudit ({paramsId}) {
      this.$confirm('确定要删除该数据吗？', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.paramsDeleteRequest(paramsId);
      }).catch(() => {
        this.$message({type: 'info', message: '已取消删除'});
      });
    },
    // 格式日期功能
    formatDate (date, format = 'YYYY-MM-DD', def = '') {
      return date ? this.$dayjs(date).format(format) : def;
    },
    // 查询分页数据
    async paramsListRequest () {
      try {
        const {code, message, data: {list, pageSize, total}} = await paramsList({
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
    // 查询商品分类
    async categoryTreeRequest () {
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

          this.cascaderData = data.list;
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
    // 删除参数类型
    async paramsDeleteRequest (paramsId) {
      try {
        const {code, message} = await paramsDelete({paramsId});
        if (code == 200) {
          this.$message.success('删除成功！');
          this.paramsListRequest();
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
      this.paramsListRequest();
    },
    // 分页数量修改
    handleSizeChange(val) {
      this.pager.size = val;
      this.paramsListRequest();
    },
    // 跳转当前页
    handleCurrentChange(val) {
      this.pager.curPage = val;
      this.paramsListRequest();
    },
    // 编辑功能
    handleTabBtn({categoryId, paramsId, paramsInfo}) {
      const path = 'edit';
      const query = {id: paramsId, cid: categoryId, strArr: paramsInfo.toString()};
      const curView = this.$route;

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          this.$router.replace({path, query});
        });
      });
    },
    // 添加功能
    onAdd() {
      const curView = this.$route;

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          // 跳转页面到新增
          this.$router.replace({path: 'add'});
        })
      });
    },
  }
}
</script>

<style lang="scss" scoped>
  .parameter-type-wrap {
    padding: 20px;
    .top-search  {
      .el-form-item {
        margin-right: 20px;
        ::v-deep .el-form-item__label {
          font-weight: 400;
        }
      }
      .el-form-item {
        button+button {
          margin-left: 15px;
        }
      }
    }
    ::v-deep .fix-width {
      width: 400px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
</style>
