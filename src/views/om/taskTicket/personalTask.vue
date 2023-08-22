<template>
  <div class="personal-task-ticket">
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
              <el-button type="primary" @click="onSearch" v-hasPermi="['integral:task:info:page']">查询</el-button>
            </el-form-item>
            <el-form-item class="fr mr0">
              <el-button type="primary" @click="onAdd" v-hasPermi="['integral:task:save:prerogative']">新增</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div class="task-table">
      <el-table border :data="tableData" style="width: 100%">
        <el-table-column label="序号" align="center" type="index" width="60"></el-table-column>
        <el-table-column prop="taskName" align="center" label="任务券品牌"></el-table-column>
        <el-table-column prop="limitQuantity" align="center" label="任务券同时运行最大数量" width="120"></el-table-column>
        <el-table-column prop="income" align="center" label="总奖励Candy">
          <template slot-scope="{row}">{{Number(row.income||0).toFixed(6)}}</template>
        </el-table-column>
        <el-table-column prop="dayToDo" align="center" label="每天可做任务次数" width="130"></el-table-column>
        <el-table-column prop="completeCycleMin" align="center" label="可做任务总次数" width="130"></el-table-column>
        <el-table-column prop="completeCycleMin" align="center" label="最小完成周期次数" width="130"></el-table-column>
        <el-table-column prop="income" align="center" label="做任务前提" width="120">
          <template slot-scope="scope">签到</template>
        </el-table-column>
        <el-table-column prop="activateDeadline" align="center" label="使用期限" width="110"></el-table-column>
        <el-table-column prop="receiveCondition" align="center" label="触发条件" width="150">
          <template slot-scope="{row}">{{(row.receiveCondition&&(row.receiveCondition!='VIP0'))?active[row.receiveCondition]:'无条件'}}</template>
        </el-table-column>
        <el-table-column prop="remark" align="center" label="产出公式" width="150">
          <template slot-scope="{row}">{{row.remark||'-'}}</template>
        </el-table-column>
        <el-table-column prop="modifyAt" align="center" label="最后操作时间" width="160">
          <template slot-scope="{row}">
            {{row.modifyAt?$dayjs(row.modifyAt).format('YYYY-MM-DD HH:mm:ss'):'-'}}
          </template>
        </el-table-column>
        <el-table-column prop="executor" align="center" label="操作人" width="130">
          <template slot-scope="{row}">{{row.executor||'-'}}</template>
        </el-table-column>
        <el-table-column prop="state" align="center" label="状态" width="160">
          <template slot-scope="{row}">
            <!-- 状态 0 未启用 1启用 -->
            <el-switch v-hasPermi="['integral:task:status:change:prerogative']" @change="swChange(row)" class="table-switch" :value="row.statusType" :width="70" active-text="禁用" inactive-text="启用" :active-value="1" :inactive-value="0"></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="170">
          <template slot-scope="{row}">
            <el-button v-if="row.statusType==0" size="mini" type="primary" v-hasPermi="['integral:task:update:prerogative']" @click="handleTabBtn(row, 'Edit')">编辑</el-button>
            <el-button v-if="row.statusType==1" size="mini" type="warning" v-hasPermi="['integral:task:info']" @click="handleTabBtn(row, 'Detail')">查看</el-button>
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
import types from '@/utils/taskTypes';
import {taskPage, changePrerogative} from '@/api/pointsMgmt/starTasks';
import {activeTypeList} from '@/api/om/task';


export default {
  name: 'PersonalTaskTicket',
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
      active: {}
    }
  },
  mounted () {
    this.taskPageRequest();
    this.activeTypeListRequest();
  },
  methods: {
    // 激活条件
    async activeTypeListRequest () {
      try {
        const {code, message, data} = await activeTypeList({id: 0});
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
    async taskPageRequest () {
      try {
        const rqData = {
          ...this.taskForm,
          pageSize: this.pager.size,
          currentPage: this.pager.curPage,
          taskType: this.taskTypes['特权任务'],
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
    // 修改任务券状态
    async changePrerogativeRequest (statusType, id) {
      try {
        const {code, message} = await changePrerogative({id, statusType});
        if (code == 200) {
          this.taskPageRequest();
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
      this.taskPageRequest();
    },
    // 新增任务
    onAdd () {
      const curView = this.$route
      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          // 跳转页面到新增
          this.$router.replace({
            path: `taskAdd`,
            query: {
              type: 'Add'
            }
          });
        })
      });
    },
    // 状态切换功能
    swChange ({statusType, id}) {
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
        this.changePrerogativeRequest(val, id);
      }).catch(() => {
        // 取消
        this.$message({type: 'info', message});
      });
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
    handleTabBtn(row, info) {
      const curView = this.$route;
      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          // 跳转页面到编辑/详情
          this.$router.replace({
            path: `task${info}`,
            query: {
              id: row.id,
              type: info,
            }
          })
        })
      });
    },
  }
}
</script>

<style lang="scss" scoped>
  .personal-task-ticket {
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
  }
</style>>
