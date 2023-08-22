<template>
  <div class="evaluation">
    <div class="top-search">
      <el-form ref="mainForm" inline :model="mainForm">
        <el-form-item label="ID/商品名称: ">
          <el-input v-model="mainForm.keywords" placeholder="请输入ID/商品名称"></el-input>
        </el-form-item>
        <el-form-item label="评论内容: ">
          <el-input v-model="mainForm.content" placeholder="请输入评论内容"></el-input>
        </el-form-item>
        <el-form-item label="状态: ">
          <el-select v-model="mainForm.statusCode" placeholder="请选择状态" clearable>
            <el-option label="全部" :value="0"></el-option>
            <el-option label="未显示的评价" :value="1"></el-option>
            <el-option label="显示中的评价" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评论类型: ">
          <el-select v-model="mainForm.virtualCode" placeholder="请选择评论类型" clearable>
            <el-option label="全部" :value="0"></el-option>
            <el-option label="虚拟评论" :value="1"></el-option>
            <el-option label="真实评论" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="fr mr0">
          <el-button size="small" type="primary" @click="onSearch" v-hasPermi="['goods:evaluate:page']">查询</el-button>
          <el-button size="small" type="primary" @click="onAdd" v-hasPermi="['goods:evaluate:save']">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data">
      <el-table border :data="tableData" style="width: 100%">
        <el-table-column prop="productId" align="center" label="商品ID" :formatter="formatter"></el-table-column>
        <el-table-column prop="memberName" align="center" label="用户昵称" :formatter="formatter"></el-table-column>
        <el-table-column prop="productName" align="center" label="商品名称" :formatter="formatter"></el-table-column>
        <el-table-column prop="sellerName" align="center" label="供应商" :formatter="formatter"></el-table-column>
        <el-table-column prop="scoreLevel" align="center" label="评价星级">
          <template slot-scope="{row}">
            <el-rate v-model="row.scoreLevel||0" disabled></el-rate>
          </template>
        </el-table-column>
        <el-table-column prop="content" align="center" label="评论内容" :formatter="formatter"></el-table-column>
        <el-table-column prop="createTime" align="center" label="评论时间" :formatter="formatter" width="170"></el-table-column>
        <el-table-column prop="showStatus" align="center" label="是否显示">
          <template slot-scope="{row}">
            <el-switch
              :width="80"
              active-text="已显示"
              inactive-text="未显示"
              :value="row.showStatus"
              class="custom-switcher"
              @change="statusChange(row)"
              v-hasPermi="['goods:evaluate:update']"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="170">
          <template slot-scope="{row}">
            <el-button size="mini" type="primary" @click="handleTabBtn(row)">查看</el-button>
            <el-button size="mini" type="danger" v-hasPermi="['goods:evaluate:del']" @click="delFailureAudit(row)">删除</el-button>
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
import {evaluationList, deleteEvaluation, evaluationStateUpdate} from '@/api/goods/evaluation';

export default {
  name: 'Evaluation',
  data () {
    return {
      mainForm: {
        content: '',
        keywords: '',
        statusCode: '',
        virtualCode: '',
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
  mounted () {
    this.evaluationListReq();
  },
  methods: {
    // 状态切换功能
    statusChange ({id, showStatus}) {
      const h = this.$createElement;
      const tips = showStatus ? '关闭' : '打开';
      const style = {fontSize: '16px', padding: '10px 10px 8px', fontWeight: 500};
      const message = h('div', {style}, `确定要${tips}此评价吗？`);

      this.$msgbox({
        message,
        type: 'warning',
        showClose: false,
        closeOnClickModal: false,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'coupons-msg',
        iconClass: 'el-icon-question iconQ',
      }).then(() => {
        this.evaluationStateUpdateReq(id);
      }).catch(() => {
        this.$message.info(`已取消${tips}`);
      });
    },
    // 格式化
    formatter (row, column) {
      let key = column.property;

      if (key == 'scoreLevel') {
        return row[key] || '-';
      } else if (key == 'createTime') {
        return this.formatDate(row[key], 'YYYY-MM-DD HH:mm:ss', '-');
      } else {
        return row[key] || '-';
      }
    },
    // 删除操作
    delFailureAudit ({id}) {
      this.$confirm('确定要删除该数据吗？', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.deleteEvaluationReq(id);
      }).catch(() => {
        this.$message({type: 'info', message: '已取消删除'});
      });
    },
    // 格式日期功能
    formatDate (date, format = 'YYYY-MM-DD', def = '') {
      return date ? this.$dayjs(date).format(format) : def;
    },
    // 查询分页数据
    async evaluationListReq () {
      try {
        const {code, message, data: {list, pageSize, total}} = await evaluationList({
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
        throw error;
      }
    },
    // 切换评论显示状态
    async evaluationStateUpdateReq (id) {
      try {
        await evaluationStateUpdate({id});
        this.$message.success('更新成功');
        this.evaluationListReq();
      } catch (error) {
        throw error;
      }
    },
    // 删除评价
    async deleteEvaluationReq (id) {
      try {
        const {code, message} = await deleteEvaluation({id});
        if (code == 200) {
          this.$message.success('删除成功！');
          this.evaluationListReq();
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        throw error;
      }
    },
    // 条件搜索
    onSearch () {
      this.pager.curPage = 1;
      this.evaluationListReq();
    },
    // 分页数量修改
    handleSizeChange(val) {
      this.pager.size = val;
      this.evaluationListReq();
    },
    // 跳转当前页
    handleCurrentChange(val) {
      this.pager.curPage = val;
      this.evaluationListReq();
    },
    // 查看功能
    handleTabBtn({id}) {
      const query = {id};
      const path = 'checkEvaluation';
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
          this.$router.replace({path: 'addEvaluation'});
        })
      });
    },
  }
}
</script>

<style lang="scss" scoped>
  .evaluation {
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

    .custom-switcher {
      height: 60px;
      ::v-deep {
        .el-switch__label--left,
        .el-switch__label--right {
          position: absolute;
          z-index: -1;
          font-size: 14px;
        }
        .el-switch__label--left {
          margin-right: 10px;
          right: 0;
          color: #999;
        }
        .el-switch__label--right {
          margin-right: 0px;
          left: 0px;
          color: #fff;
        }
        .el-switch__label.is-active {
          z-index: 20;
        }
        .el-switch__core {
          height: 26px;
          border-radius: 24px;
        }
        .el-switch__core:after {
          border-radius: 24px;
          width: 26px;
          height: 26px;
          margin-left: -2px;
          box-shadow: -3px 0px 1px #888;
          top: -1px;
        }
      }
      &.is-checked ::v-deep {
        .el-switch__core:after {
          margin-left: -25px;
          box-shadow: 3px 0px 1px #888;
        }
      }
    }
  }
</style>
