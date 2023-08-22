<template>
  <div class="start-goodp-send">
    <el-table border :data="tableData" style="width: 100%">
      <el-table-column label="序号" align="center" width="60">
        <template slot-scope="scope">
          <span>{{scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taskName" align="center" label="项目名称">
        <template>鲸丽生活电商</template>
      </el-table-column>
      <el-table-column prop="taskName" align="center" label="任务券品牌" width="120"></el-table-column>
      <el-table-column prop="limitQuantity" align="center" label="任务券同时运行最大数量" width="165"></el-table-column>
      <el-table-column prop="income" align="center" label="总奖励Candy" width="180"></el-table-column>
      <el-table-column prop="dayToDo" align="center" label="每天可做任务次数" width="130"></el-table-column>
      <el-table-column prop="completeCycleMin" align="center" label="可做任务总次数" width="130"></el-table-column>
      <el-table-column prop="completeCycleMin" align="center" label="最小完成周期次数" width="130"></el-table-column>
      <el-table-column prop="income" align="center" label="做任务前提" width="120">
        <template slot-scope="scope">签到</template>
      </el-table-column>
      <el-table-column prop="remark" align="center" label="产出公式" width="150">
        <template slot-scope="{row}">{{row.remark||'-'}}</template>
      </el-table-column>
      <el-table-column prop="modifyAt" align="center" label="最后操作时间" width="160">
        <template slot-scope="{row}">
          {{row.modifyAt?$dayjs(row.modifyAt).format('YYYY-MM-DD HH:mm:ss'):'-'}}
        </template>
      </el-table-column>
      <el-table-column prop="executor" align="center" label="操作人">
        <template slot-scope="{row}">{{row.executor||'-'}}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="170">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" v-hasPermi="['integral:task:update:asterisk']" @click="handleTabBtn(row, 'Edit')">编辑</el-button>
          <el-button size="mini" type="warning" v-hasPermi="['integral:task:info']" @click="handleTabBtn(row, 'Detail')">查看</el-button>
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
</template>

<script>
import types from '@/utils/taskTypes';
import {taskPage} from '@/api/pointsMgmt/starTasks';

export default {
  name: 'StarGoodPSend',
  data() {
    return {
      types,
      tableData: [],
      pager: {
        curPage: 1,
        size: 10,
        total: 0,
      },
    }
  },
  mounted () {
    this.taskPageRequest();
  },
  methods: {
    // 查询分页数据
    async taskPageRequest () {
      try {
        const rqData = {
          pageSize: this.pager.size,
          currentPage: this.pager.curPage,
          taskType: this.types['星级赠送']
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
    // 分页数量修改
    handleSizeChange(val) {
      this.pager.size = val;
      this.taskPageRequest();
    },
    // 跳转当前页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pager.curPage = val;
      this.taskPageRequest();
    },
    // 表格中按钮功能
    handleTabBtn(row, info) {
      const curView = this.$route
      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          // 跳转页面到编辑/详情
          this.$router.replace({
            path: `starGoodPSend${info}`,
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
  .start-goodp-send {
    padding: 20px;
  }
</style>
