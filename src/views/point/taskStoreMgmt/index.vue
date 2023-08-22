<template>
  <div class="task-store-mgmt">
    <div class="top-search">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form ref="taskForm" inline :model="taskForm" label-width="90px">
            <el-form-item label="任务券名称">
              <el-input v-model="taskForm.taskName" placeholder="请输入任务券名称"></el-input>
            </el-form-item>
            <el-form-item label="任务券状态">
              <el-select v-model="taskForm.statusType" placeholder="请选择任务券状态">
                <el-option label="全部" :value='-1'></el-option>
                <el-option label="已停用" :value='0'></el-option>
                <el-option label="已启用" :value='1'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSearch" v-hasPermi="['integral:task:info:page:store']">查询</el-button>
            </el-form-item>
            <el-form-item class="fr mr0">
              <el-button type="primary" @click="onAdd" v-hasPermi="['integral:task:save:store']">新增</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div class="task-table">
      <el-table border :data="tableData" style="width: 100%">
        <el-table-column label="序号" type="index" align="center" width="60"></el-table-column>
        <el-table-column :formatter="formatter" prop="taskName" align="center" label="任务券名称" width="120"></el-table-column>
        <el-table-column :formatter="formatter" prop="limitQuantity" align="center" label="任务券同时运行最大数量"></el-table-column>
        <el-table-column :formatter="formatter" prop="sort" align="center" label="排序" width="110"></el-table-column>
        <el-table-column :formatter="formatter" prop="needWhalePeas" align="center" label="兑换任务券成本" width="120"></el-table-column>
        <el-table-column :formatter="formatter" prop="income" align="center" label="总奖励Candy" width="110"></el-table-column>
        <el-table-column :formatter="formatter" prop="earningsRate" align="center" label="收益率" width="130"></el-table-column>
        <el-table-column :formatter="formatter" prop="earningsRateCycleReduce" align="center" label="周期减产" width="150"></el-table-column>
        <el-table-column :formatter="formatter" prop="completeCycleIncrease" align="center" label="周期递增天数(天)" width="120"></el-table-column>
        <el-table-column :formatter="formatter" prop="activeWorth" align="center" label="基础活跃值" width="100"></el-table-column>
        <el-table-column :formatter="formatter" prop="dayToDo" align="center" label="每天可做任务次数" width="130"></el-table-column>
        <el-table-column :formatter="formatter" prop="completeCycleMin" align="center" label="可做任务总次数" width="130"></el-table-column>
        <el-table-column :formatter="formatter" prop="activeWorthExpireDayAfter" align="center" label="基础活跃值失效时间(天)"></el-table-column>
        <el-table-column :formatter="formatter" prop="condition" label="做任务前提" align="center"></el-table-column>
        <el-table-column :formatter="formatter" prop="remark" label="产出公式" align="center" width="135"></el-table-column>
        <el-table-column :formatter="formatter" prop="modifyAt" align="center" label="最后操作时间" width="170"></el-table-column>
        <el-table-column :formatter="formatter" prop="executor" align="center" label="操作人" width="130"></el-table-column>
        <el-table-column prop="statusType" align="center" label="状态" width="140">
          <template slot-scope="{row}">
            <!-- 状态 0 未启用 1启用 -->
            <el-switch v-hasPermi="['integral:task:status:change']" @change="statusChangeCell(row)" class="table-switch" :value="row.statusType" :width="83" active-text="已开启" inactive-text="已禁用" :active-value="1" :inactive-value="0"></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="170">
          <template slot-scope="{row}">
            <el-button v-if="row.statusType==0" size="mini" type="primary" v-hasPermi="['integral:task:update:store']" @click="handleTabBtn(row, 'Edit')">编辑</el-button>
            <el-button v-if="row.statusType==1" size="mini" type="warning" v-hasPermi="['integral:task:info']" @click="handleTabBtn(row, 'Detail')">查看</el-button>
            <el-button size="mini" type="info" v-hasPermi="['integral:task:global:page']" @click="handleRecordBtn(row, 'Recording')">修改记录</el-button>
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

      <el-dialog center :close-on-click-modal="false" title="修改记录" :visible.sync="showRecordTable" width="1200px">
        <el-table border :data="recordTableData" style="width: 100%">
          <el-table-column :formatter="formatter" prop="taskName" align="center" label="任务券名称" width="120"></el-table-column>
          <el-table-column :formatter="formatter" prop="needWhalePeas" align="center" label="兑换任务券成本" width="120"></el-table-column>
          <el-table-column :formatter="formatter" prop="income" align="center" label="总奖励Candy" width="90"></el-table-column>
          <el-table-column :formatter="formatter" prop="earningsRate" align="center" label="收益率" width="70"></el-table-column>
          <el-table-column :formatter="formatter" prop="earningsRateCycleReduce" align="center" label="周期减产" width="80"></el-table-column>
          <el-table-column :formatter="formatter" prop="completeCycleIncrease" align="center" label="周期递增天数(天)" width="120"></el-table-column>
          <el-table-column :formatter="formatter" prop="activeWorth" align="center" label="基础活跃值" width="90"></el-table-column>
          <el-table-column :formatter="formatter" prop="dayToDo" align="center" label="每天可做任务次数" width="128"></el-table-column>
          <el-table-column :formatter="formatter" prop="completeCycleMin" align="center" label="可做任务总次数" width="120"></el-table-column>
          <el-table-column :formatter="formatter" prop="activeWorthExpireDayAfter" align="center" label="基础活跃值失效时间(天)"></el-table-column>
          <el-table-column :formatter="formatter" prop="executor" align="center" label="操作人" width="100"></el-table-column>
          <el-table-column :formatter="formatter" prop="createAt" align="center" label="最后操作时间" width="170"></el-table-column>
        </el-table>

        <div class="mt40 mb10 init-txt">初始记录</div>
        <el-table border :data="initTableData" style="width: 100%">
          <el-table-column :formatter="formatter" prop="taskName" align="center" label="任务券名称" width="120"></el-table-column>
          <el-table-column :formatter="formatter" prop="needWhalePeas" align="center" label="兑换任务券成本" width="120"></el-table-column>
          <el-table-column :formatter="formatter" prop="income" align="center" label="总奖励Candy" width="90"></el-table-column>
          <el-table-column :formatter="formatter" prop="earningsRate" align="center" label="收益率" width="70"></el-table-column>
          <el-table-column :formatter="formatter" prop="earningsRateCycleReduce" align="center" label="周期减产" width="80"></el-table-column>
          <el-table-column :formatter="formatter" prop="completeCycleIncrease" align="center" label="周期递增天数(天)" width="120"></el-table-column>
          <el-table-column :formatter="formatter" prop="activeWorth" align="center" label="基础活跃值" width="90"></el-table-column>
          <el-table-column :formatter="formatter" prop="dayToDo" align="center" label="每天可做任务次数" width="128"></el-table-column>
          <el-table-column :formatter="formatter" prop="completeCycleMin" align="center" label="可做任务总次数" width="120"></el-table-column>
          <el-table-column :formatter="formatter" prop="activeWorthExpireDayAfter" align="center" label="基础活跃值失效时间(天)"></el-table-column>
          <el-table-column :formatter="formatter" prop="executor" align="center" label="操作人" width="100"></el-table-column>
          <el-table-column :formatter="formatter" prop="createAt" align="center" label="最后操作时间" width="170"></el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import math from '@/utils/math';
import {pageStore, statusChange, modifyLog} from '@/api/pointsMgmt/starTasks';

export default {
  name: 'TaskStoreMgmt',
  data () {
    return {
      taskForm: {
        taskName: '',
        statusType: -1
      },
      pager: {
        curPage: 1,
        size: 10,
        total: 0,
      },
      tableData: [],
      recordTableData: [],
      initTableData: [],
      showRecordTable: false,
    }
  },
  mounted () {
    this.pageStoreRequest();
  },
  methods: {
    // 主表格式化
    formatter (row, column) {
      let key = column.property;
      let emptyCell = [
        'limitQuantity',
        'dayToDo',
        'completeCycleMin',
        'activateDeadline',
        'completeCycleIncrease',
        'activeWorth',
        'needWhalePeas',
        'activeWorthExpireDayAfter',
      ];

      if (emptyCell.includes(key)) {
        return row[key] || 0;
      } else if (key == 'earningsRateCycleReduce') {
        return row[key] ? math.multiply(row[key], 100, 2).toFixed(2) + '%' : 0;
      } else if (key == 'earningsRate') {
        return row[key] ? math.multiply(row[key], 100, 2) + '%' : 0;
      } else if (key == 'condition') {
        return '每天做完任务';
      } else if (key == 'income') {
        return Number(row[key] || 0).toFixed(6);
      } else if (key == 'modifyAt' || key == 'createAt') {
        return this.formatDate(row[key], 'YYYY-MM-DD HH:mm:ss', '-');
      } else if (key == 'remark') {
        return '每天可做任务次数*任务券每天产出系数';
      } else {
        return row[key] || '-';
      }
    },
    // 格式日期功能
    formatDate (date, format = 'YYYY-MM-DD', def = '') {
      return date ? this.$dayjs(date).format(format) : def;
    },
    // 查看记录按钮
    handleRecordBtn ({id}) {
      this.initTableData = [];
      this.recordTableData = [];
      this.showRecordTable = true;
      this.modifyLogRequest(id);
    },
    // 状态切换功能
    statusChangeCell ({statusType, id}) {
      let val = statusType ? 0 : 1;
      let message = statusType ? '已取消禁用' : '已取消启用';
      let tips = statusType ? '确定要禁用此任务吗？' : '确定要启用此任务吗？';

      this.$confirm(tips, {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        // 操作
        this.statusChangeRequest(val, id);
      }).catch(() => {
        // 取消
        this.$message({type: 'info', message});
      });
    },
    // 查询分页数据
    async pageStoreRequest () {
      try {
        const rqData = {
          ...this.taskForm,
          pageSize: this.pager.size,
          currentPage: this.pager.curPage,
        }
        const {code, message, data: {list, pageSize, total}} = await pageStore(rqData);
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
    // 查询修改记录数据
    async modifyLogRequest (id) {
      try {
        const {code, message, data: {list}} = await modifyLog({id});
        if (code == 200) {
          if (list.length) {
            const initData = list.pop();
            this.initTableData = [initData];
            this.recordTableData = list;
          }
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
    // 修改任务状态
    async statusChangeRequest (statusType, id) {
      try {
        const {code, message} = await statusChange({id, statusType});
        if (code == 200) {
          this.pageStoreRequest();
          this.$message({type: 'success', message: '修改成功'});
        } else {
          this.$message({type: 'error', message});
        }
      } catch (error) {
        // ...
      }
    },
    // 条件搜索
    onSearch () {
      this.pager.curPage = 1;
      this.pageStoreRequest();
    },
    // 新增任务
    onAdd () {
      const curView = this.$route
      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          // 跳转页面到新增
          this.$router.replace({
            path: 'addTaskStore',
            query: {type: 'Add'}
          });
        })
      });
    },
    // 分页数量修改
    handleSizeChange(val) {
      this.pager.size = val;
      this.pageStoreRequest();
    },
    // 跳转当前页
    handleCurrentChange(val) {
      this.pager.curPage = val;
      this.pageStoreRequest();
    },
    // 表格中按钮功能
    handleTabBtn({id}, type) {
      const curView = this.$route;
      const curPath = type == 'Edit' ? 'editTaskStore' : 'taskStoreDetail';

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          // 跳转页面到编辑/详情
          this.$router.replace({
            path: curPath,
            query: {id, type}
          });
        });
      });
    },
  }
}
</script>

<style lang="scss" scoped>
  .task-store-mgmt {
    padding: 20px;
    .top-search  {
      .el-form-item {
        margin-right: 36px;
        ::v-deep .el-form-item__label {
          font-weight: 400;
        }
      }
      .el-form-item {
        button {
          padding: 10px 30px;
        }
      }
      .el-form-item:last-child {
        margin-right: 0;
      }
    }
    .task-table {
      .table-switch {
        height: 60px;
        ::v-deep .el-switch__label--left,
        ::v-deep .el-switch__label--right {
          position: absolute;
          z-index: -1;
          font-size: 14px;
        }
        ::v-deep .el-switch__label--left {
          margin-right: 10px;
          right: 0;
          color: #999;
        }
        ::v-deep .el-switch__label--right {
          margin-right: 0px;
          left: 0px;
          color: #fff;
        }
        ::v-deep .el-switch__label.is-active {
          z-index: 20;
        }
        ::v-deep .el-switch__core {
          height: 26px;
          border-radius: 24px;
        }
        ::v-deep .el-switch__core:after {
          border-radius: 24px;
          width: 26px;
          height: 26px;
          margin-left: 0px;
          box-shadow: -3px 0px 1px #888;
          top: -1px;
        }
        &.is-checked ::v-deep .el-switch__core:after {
          margin-left: -25px;
          box-shadow: 3px 0px 1px #888;
        }
      }
    }
    .init-txt {
      font-size: 16px;
      font-weight: 600;
      color: #777;
      &::before {
        content: " ";
        width: 5px;
        height: 14px;
        background: #777;
        display: inline-block;
        margin-right: 5px;
        margin-bottom: -1px;
      }
    }
  }
</style>
