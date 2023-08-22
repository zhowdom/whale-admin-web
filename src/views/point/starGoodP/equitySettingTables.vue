<template>
  <div class="equity-setting-tables">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="序号" align="center" width="80">
        <template slot-scope="scope">
          <span>{{scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="levelName" align="center" label="等级名称" width="150"></el-table-column>
      <el-table-column prop="levelTag" align="center" label="等级标识" width="150"></el-table-column>
      <el-table-column label="权益" align="center">
        <el-table-column label="任务券" align="center">
          <el-table-column prop="taskName" align="center" label="任务券" width="150">
            <template slot-scope="{row}">{{row.taskName||'-'}}</template>
          </el-table-column>
          <el-table-column prop="taskQuantity" align="center" label="数量" width="100"></el-table-column>
        </el-table-column>
        <el-table-column label="用户转赠手续费分红" align="center">
          <el-table-column prop="transferWhalePeasProfitRate" align="center" label="可分配比例" width="250">
            <template slot-scope="{row}">
              {{math.multiply(row.transferWhalePeasProfitRate, 100)+'%'}}
            </template>
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="modifyAt" align="center" label="最近操作时间" width="250">
        <template slot-scope="{row}">
          {{row.modifyAt?$dayjs(row.modifyAt).format('YYYY-MM-DD HH:mm:ss'):'-'}}
        </template>
      </el-table-column>
      <el-table-column prop="executor" align="center" label="操作人">
        <template slot-scope="{row}">{{row.executor||'-'}}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import math from '@/utils/math';
import {benefitList} from '@/api/pointsMgmt/starTalent';

export default {
  name: 'EquitySettingTables',
  props: {
    updateModal: Function,
    shouldUpdate: Boolean
  },
  data() {
    return {
      math,
      tableData: [],
    }
  },
  mounted () {
    this.benefitListRequest();
  },
  methods: {
    // 获取权益配置清单
    async benefitListRequest() {
      try {
        const {code, message, data} = await benefitList();
        if (code == 200) {
          this.tableData = data.list;
        } else {
          this.$message({type: 'error', message});
        }
      } catch (error) {
        // ...
      }
    },
    // 编辑操作
    handleEdit(index, row) {
      this.$emit('updateModal', {
        name: 2,
        data: row,
      });
    }
  },
  watch: {
    shouldUpdate: function (value) {
      value && this.benefitListRequest();
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
