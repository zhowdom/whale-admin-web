<template>
  <div class="vip-ticket">
    <div class="top-search">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form ref="vipForm" inline :model="vipForm" label-width="90px">
            <el-form-item label="任务券名称">
              <el-input v-model="vipForm.taskName" placeholder="请输入任务券名称"></el-input>
            </el-form-item>
            <!-- <el-form-item label="选用情况">
              <el-select v-model="vipForm.statusType" placeholder="请选择">
                <el-option label="全部" :value='-1'></el-option>
                <el-option label="已选用" :value='0'></el-option>
                <el-option label="未选用" :value='1'></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item>
              <el-button type="primary" @click="onSearch" v-hasPermi="['integral:task:info:page']">查询</el-button>
            </el-form-item>
            <el-form-item class="fr mr0">
              <el-button type="primary" @click="onAdd" v-hasPermi="['integral:task:save:vip']">新增</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div class="vipForm-table">
      <el-table border :data="tableData" style="width: 100%">
        <el-table-column label="序号" align="center" width="60" type="index" :formatter="formatter"></el-table-column>
        <el-table-column prop="taskName" align="center" label="任务券名称" width="120" :formatter="formatter"></el-table-column>
        <el-table-column prop="income" align="center" label="总奖励Candy" width="110" :formatter="formatter"></el-table-column>
        <el-table-column prop="dayToDo" align="center" label="每天可做任务次数" width="130" :formatter="formatter"></el-table-column>
        <el-table-column prop="completeCycleMin" align="center" label="可做任务总次数" width="130" :formatter="formatter"></el-table-column>
        <el-table-column prop="condition" align="center" label="做任务前提" width="120" :formatter="formatter"></el-table-column>
        <el-table-column prop="activateDeadline" align="center" label="使用期限" width="80" :formatter="formatter"></el-table-column>
        <el-table-column prop="remark" align="center" label="产出公式" :formatter="formatter"></el-table-column>
        <el-table-column prop="modifyAt" align="center" label="最后操作时间" :formatter="formatter"></el-table-column>
        <el-table-column prop="executor" align="center" label="操作人" width="130" :formatter="recordFormatter"></el-table-column>
        <el-table-column prop="state" align="center" label="选用情况" width="120" :formatter="recordFormatter"></el-table-column>
        <el-table-column align="center" label="操作" width="250">
          <template slot-scope="{row}">
            <!-- <el-button size="mini" type="primary" v-hasPermi="['integral:task:update:global']" @click="handleTabBtn(row, 'Edit')">编辑</el-button> -->
            <el-button size="mini" type="warning" v-hasPermi="['integral:task:info']" @click="handleTabBtn(row, 'Detail')">查看</el-button>
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
          <el-table-column prop="taskName" align="center" label="任务券名称" :formatter="recordFormatter"></el-table-column>
          <el-table-column prop="income" align="center" label="总奖励Candy" :formatter="recordFormatter"></el-table-column>
          <el-table-column prop="dayToDo" align="center" label="每天可做任务次数" :formatter="recordFormatter"></el-table-column>
          <el-table-column prop="completeCycleMin" align="center" label="可做任务总次数" :formatter="recordFormatter"></el-table-column>
          <el-table-column prop="activateDeadline" align="center" label="使用期限(天)" width="105" :formatter="recordFormatter"></el-table-column>
          <el-table-column prop="executor" align="center" label="操作人" :formatter="recordFormatter"></el-table-column>
          <el-table-column prop="createAt" align="center" label="操作时间" width="170" :formatter="recordFormatter"></el-table-column>
        </el-table>

        <div class="mt40 mb10 init-txt">初始记录</div>
        <el-table border :data="initTableData" style="width: 100%">
          <el-table-column prop="taskName" align="center" label="任务券名称" :formatter="recordFormatter"></el-table-column>
          <el-table-column prop="income" align="center" label="总奖励Candy" :formatter="recordFormatter"></el-table-column>
          <el-table-column prop="dayToDo" align="center" label="每天可做任务次数" :formatter="recordFormatter"></el-table-column>
          <el-table-column prop="completeCycleMin" align="center" label="可做任务总次数" :formatter="recordFormatter"></el-table-column>
          <el-table-column prop="activateDeadline" align="center" label="使用期限(天)" width="105" :formatter="recordFormatter"></el-table-column>
          <el-table-column prop="executor" align="center" label="操作人" :formatter="recordFormatter"></el-table-column>
          <el-table-column prop="createAt" align="center" label="操作时间" width="170" :formatter="recordFormatter"></el-table-column>
        </el-table>
      </el-dialog>

      <!--新增-->
      <el-dialog :visible.sync="vipTicket_addVisible" width="1200px">
        <addcomp :myType="curRowType" :queryParentList="taskPageRequest" @close_comsp="close_comspHandle" />
      </el-dialog>
      <!--详情-->
      <el-dialog :visible.sync="vipTicket_editVisible" width="1200px">
        <detailcomp :passedID="curRowID" :myType="curRowType" :queryParentList="taskPageRequest" @close_comsp="close_comspHandle" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import types from '@/utils/taskTypes';
import {taskPage} from '@/api/pointsMgmt/starTasks';
import {modifyLog} from '@/api/om/task';
import addcomp from './add.vue';
import detailcomp from './detail.vue';

export default {
  components: {
    addcomp,
    detailcomp
  },
  name: 'VipTicket',
  data () {
    return {
      curRowID: null,
      curRowType: 'Add',
      vipTicket_addVisible: false,
      vipTicket_editVisible: false,
      taskTypes: types,
      vipForm: {
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
    this.taskPageRequest();
  },
  methods: {
    // 修改记录格式化
    recordFormatter (row, column) {
      let key = column.property;

      if (key == 'dayToDo' || key == 'completeCycleMin' || key == 'activateDeadline') {
        return row[key] || 0;
      } if (key == 'income') {
        return Number(row[key] || 0).toFixed(6);
      } else if (key == 'createAt') {
        return this.formatDate(row[key], 'YYYY-MM-DD HH:mm:ss', '-');
      } else {
        return row[key] || '-';
      }
    },
    // 主表格式化
    formatter (row, column) {
      let key = column.property;

      if (key == 'dayToDo' || key == 'completeCycleMin' || key == 'activateDeadline') {
        return row[key] || 0;
      } else if (key == 'state') {
        return '-'; // 暂时
      } if (key == 'income') {
        return Number(row[key] || 0).toFixed(6);
      } else if (key == 'condition') {
        return '每天做完任务';
      } else if (key == 'modifyAt') {
        return this.formatDate(row[key], 'YYYY-MM-DD HH:mm:ss', '-');
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
    // 查询分页数据
    async taskPageRequest () {
      try {
        const rqData = {
          ...this.vipForm,
          pageSize: this.pager.size,
          currentPage: this.pager.curPage,
          taskType: this.taskTypes['会员任务'],
        }
        const {code, message, data: {list, pageSize, total}} = await taskPage(rqData);
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
      this.taskPageRequest();
    },
    // 新增任务
    onAdd () {
      // const curView = this.$route
      // this.$store.dispatch('tagsView/delView', curView).then(() => {
      //   this.$nextTick(() => {
      //     // 跳转页面到新增
      //     this.$router.replace({
      //       path: 'addVipTicket',
      //       query: {type: 'Add'}
      //     });
      //   })
      // });
      // 需求交互更变
      this.curRowType = 'Add'
      this.vipTicket_addVisible = true
    },
    // 分页数量修改
    handleSizeChange(val) {
      this.pager.size = val;
      this.taskPageRequest();
    },
    // 跳转当前页
    handleCurrentChange(val) {
      this.pager.curPage = val;
      this.taskPageRequest();
    },
    // 表格中按钮功能
    handleTabBtn({id}, type) {
      // const curView = this.$route;
      // const path = type == 'Edit' ? 'editVipTicket' : 'vipTicketDetail';

      // this.$store.dispatch('tagsView/delView', curView).then(() => {
      //   this.$nextTick(() => {
      //     // 跳转页面到编辑/详情
      //     this.$router.replace({
      //       path,
      //       query: {id, type}
      //     })
      //   })
      // });
      // 需求交互变更
      this.curRowType = type
      this.curRowID = id
      this.vipTicket_editVisible = true
    },
    close_comspHandle (boolean) {
      this.vipTicket_addVisible = this.vipTicket_editVisible = boolean
    },
  }
}
</script>

<style lang="scss" scoped>
  .vip-ticket {
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
    .vip-table {
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
  }
</style>>
