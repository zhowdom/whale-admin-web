<template>
  <div class="allplatforms-task-ticket">
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
              <el-button type="primary" @click="onSearch" v-hasPermi="['integral:task:global:page']">查询</el-button>
            </el-form-item>
            <el-form-item class="fr mr0">
              <el-button type="primary" @click="onAdd" v-hasPermi="['integral:task:save:global']">新增</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div class="task-table">
      <el-table border :data="tableData" style="width: 100%" @sort-change="sortFunction">
        <el-table-column label="序号" type="index" align="center" width="60"></el-table-column>
        <el-table-column prop="taskName" align="center" label="任务券品牌" width="120" :formatter="formatter"></el-table-column>
        <el-table-column prop="income" align="center" label="总奖励Candy" width="110" :formatter="formatter"></el-table-column>
        <el-table-column prop="dayToDo" align="center" label="每天可做任务次数" width="130" :formatter="formatter"></el-table-column>
        <el-table-column prop="completeCycleMin" align="center" label="可做任务总次数" width="120" :formatter="formatter"></el-table-column>
        <el-table-column prop="condition" align="center" label="做任务前提" width="110" :formatter="formatter"></el-table-column>
        <el-table-column prop="activateDeadline" align="center" label="使用期限(天)" width="120" :formatter="formatter"></el-table-column>
        <el-table-column prop="receiveCondition" align="center" label="触发条件" width="100" :formatter="formatter"></el-table-column>
        <el-table-column prop="remark" align="center" label="产出公式" width="150" :formatter="formatter"></el-table-column>
        <el-table-column prop="activeStartAt" align="center" label="开始时间" :formatter="formatter"></el-table-column>
        <el-table-column prop="giveDeadline" align="center" label="赠送期限(天)" width="120" :formatter="formatter"></el-table-column>
        <el-table-column prop="activeEndAt" align="center" label="赠送截止日期" :formatter="formatter"></el-table-column>
        <el-table-column prop="modifyAt" align="center" label="最后操作时间" :formatter="formatter"></el-table-column>
        <el-table-column prop="executor" align="center" label="操作人" width="130" :formatter="formatter"></el-table-column>
        <el-table-column prop="statusType" align="center" label="状态" width="120">
          <template slot-scope="{row}">
            <!-- 状态 0 未启用 1启用 -->
            <el-switch v-hasPermi="['integral:task:status:change:global']" @change="statusChange(row)" class="table-switch" :value="row.statusType" :width="80" active-text="已启用" inactive-text="已禁用" :active-value="1" :inactive-value="0"></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="250">
          <template slot-scope="{row}">
            <el-button v-if="showBtns(row, 'Edit')" size="mini" type="primary" v-hasPermi="['integral:task:update:global']" @click="handleTabBtn(row, 'Edit')">编辑</el-button>
            <el-button v-if="showBtns(row, 'Detail')" size="mini" type="warning" v-hasPermi="['integral:task:info']" @click="handleTabBtn(row, 'Detail')">查看</el-button>
            <el-button v-if="showBtns(row, 'Recording')" size="mini" type="info" v-hasPermi="['integral:task:global:page']" @click="handleRecordBtn(row, 'Recording')">修改记录</el-button>
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
          <el-table-column prop="taskName" align="center" label="任务券品牌" :formatter="formatter"></el-table-column>
          <el-table-column prop="income" align="center" label="总奖励Candy" :formatter="formatter"></el-table-column>
          <el-table-column prop="dayToDo" align="center" label="每天可做任务次数" :formatter="formatter"></el-table-column>
          <el-table-column prop="completeCycleMin" align="center" label="可做任务总次数" :formatter="formatter"></el-table-column>
          <el-table-column prop="activateDeadline" align="center" label="使用期限(天)" width="105" :formatter="formatter"></el-table-column>
          <el-table-column prop="activeStartAt" align="center" label="开始时间" width="145" :formatter="formatter"></el-table-column>
          <el-table-column prop="giveDeadline" align="center" label="赠送期限(天)" :formatter="formatter"></el-table-column>
          <el-table-column prop="executor" align="center" label="操作人" :formatter="formatter"></el-table-column>
          <el-table-column prop="createAt" align="center" label="操作时间" width="145" :formatter="formatter"></el-table-column>
        </el-table>

        <div class="mt40 mb10 init-txt">初始记录</div>
        <el-table border :data="initTableData" style="width: 100%">
          <el-table-column prop="taskName" align="center" label="任务券品牌" :formatter="formatter"></el-table-column>
          <el-table-column prop="income" align="center" label="总奖励Candy" :formatter="formatter"></el-table-column>
          <el-table-column prop="dayToDo" align="center" label="每天可做任务次数" :formatter="formatter"></el-table-column>
          <el-table-column prop="completeCycleMin" align="center" label="可做任务总次数" :formatter="formatter"></el-table-column>
          <el-table-column prop="activateDeadline" align="center" label="使用期限(天)" width="105" :formatter="formatter"></el-table-column>
          <el-table-column prop="activeStartAt" align="center" label="开始时间" width="145" :formatter="formatter"></el-table-column>
          <el-table-column prop="giveDeadline" align="center" label="赠送期限(天)" :formatter="formatter"></el-table-column>
          <el-table-column prop="executor" align="center" label="操作人" :formatter="formatter"></el-table-column>
          <el-table-column prop="createAt" align="center" label="操作时间" width="145" :formatter="formatter"></el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>

<script>
const now = Date.now();
import types from '@/utils/taskTypes';
import {pageGlobal, modifyLog, activeTypeList, statusChangeGlobal} from '@/api/om/task';

export default {
  name: 'AllplatformsTaskTicket',
  computed: {
    showBtns() {
      return (data, type) => {
        const {statusType, startAt} = data;
        const nowDateTime = this.$dayjs(now).format('YYYY-MM-DD').valueOf();
        const startDateTime = this.$dayjs(startAt).format('YYYY-MM-DD').valueOf();
        const isOpen = statusType == 1;
        const isBegin = nowDateTime >= startDateTime;

        if (type == 'Edit') return !(isBegin && isOpen);
        if (type == 'Detail') return true;
        if (type == 'Recording') return true;
      }
    }
  },
  data () {
    return {
      taskTypes: types,
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
      active: {}
    }
  },
  mounted () {
    this.pageGlobalRequest();
    this.activeTypeListRequest();
  },
  methods: {
    // 主表格式化
    formatter (row, column) {
      let key = column.property;

      if (key == 'dayToDo' || key == 'completeCycleMin' || key == 'activateDeadline') {
        return row[key] || 0;
      } else if (key == 'income') {
        return Number(row[key] || 0).toFixed(6);
      } else if (key == 'giveDeadline') {
        const hasValid = row['activeStartAt'] && row['activeEndAt'];
        if (hasValid) {
          const start = row['activeStartAt'];
          const end = row['activeEndAt'];
          const diff = this.$dayjs(end).diff(this.$dayjs(start), 'day');
          return diff;
        } else {
          return '-';
        }
      } else if (key == 'condition') {
        return '每天做完任务';
      } else if (key == 'receiveCondition') {
        return this.active[row[key]];
      } else if (key == 'activeStartAt' || key == 'activeEndAt' || key == 'modifyAt' || key == 'createAt') {
        return this.formatDate(row[key], 'YYYY-MM-DD HH:mm', '-');
      } else {
        return row[key] || '-';
      }
    },
    // 排序
    sortFunction ({prop, order}) {
      const asc = order == 'ascending'; // 是否升序
      const column = this.formatStr(prop); // 格式字符串
      this.$set(this.taskForm.orderItems, 0, {asc, column});
      this.pageGlobalRequest();
    },
    // 格式日期功能
    formatDate (date, format = 'YYYY-MM-DD', def = '') {
      return date ? this.$dayjs(date).format(format) : def;
    },
    // 格式小驼峰为下划线功能
    formatStr (str) {
      return str ? str.replace(/([A-Z])/g, "_$1").toLowerCase() : '';
    },
    // 查看记录按钮
    handleRecordBtn ({id}) {
      this.initTableData = [];
      this.recordTableData = [];
      this.showRecordTable = true;
      this.modifyLogRequest(id);
    },
    // 激活条件
    async activeTypeListRequest () {
      try {
        const {code, message, data} = await activeTypeList({id: 1});
        if (code == 200) {
          this.active = data;
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
    // 查询分页数据
    async pageGlobalRequest () {
      try {
        const rqData = {
          ...this.taskForm,
          pageSize: this.pager.size,
          currentPage: this.pager.curPage,
          taskType: this.taskTypes['全局特权'],
        }
        const {code, message, data: {list, pageSize, total}} = await pageGlobal(rqData);
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
    // 修改任务券状态
    async statusChangeGlobalRequest (statusType, id) {
      try {
        const {code, message} = await statusChangeGlobal({id, statusType});
        if (code == 200) {
          this.pageGlobalRequest();
          this.$message({type: 'success', message: '修改成功'});
        } else {
          this.$message({type: 'error', message});
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
    // 条件搜索
    onSearch () {
      this.pager.curPage = 1;
      this.pageGlobalRequest();
    },
    // 新增任务
    onAdd () {
      const curView = this.$route
      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          // 跳转页面到新增
          this.$router.replace({
            path: 'allPltTicketAdd',
            query: {type: 'Add'}
          });
        })
      });
    },
    // 状态切换功能
    statusChange ({statusType, id}) {
      let val = statusType ? 0 : 1;
      let message = statusType ? '已取消禁用' : '已取消启用';
      let tips = statusType ? '确定要禁用此任务券吗？' : '确定要启用此任务券吗？';

      this.$confirm(tips, {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        // 操作
        this.statusChangeGlobalRequest(val, id);
      }).catch(() => {
        // 取消
        this.$message({type: 'info', message});
      });
    },
    // 分页数量修改
    handleSizeChange(val) {
      this.pager.size = val;
      this.pageGlobalRequest();
    },
    // 跳转当前页
    handleCurrentChange(val) {
      this.pager.curPage = val;
      this.pageGlobalRequest();
    },
    // 表格中按钮功能
    handleTabBtn({id}, type) {
      const curView = this.$route;
      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          // 跳转页面到编辑/详情
          this.$router.replace({
            path: `allPltTicket${type}`,
            query: {id, type}
          })
        })
      });
    },
  }
}
</script>

<style lang="scss" scoped>
  .allplatforms-task-ticket {
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
          margin-left: -2px;
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
</style>>
