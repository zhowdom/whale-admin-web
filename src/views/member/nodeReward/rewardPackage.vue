<template>
  <div class="tab-content">
    <div class="mb30 text-muted ft14">
      <p>节点奖励包 ： 创建不同激励包 ，根据条件去选配置</p>
      <!-- <div style="float:right;margin-top: -42px">
        <el-button v-hasPermi="['wallet:contract:add']" icon="el-icon-plus" type="primary" @click="handleAdd()">新增</el-button>
      </div> -->
    </div>
    <div class="task-table">
      <!--table-->
      <el-table
      :data="tableData"
      v-loading="loading"
      style="width: 100%">
        <el-table-column prop="taskName" label="任务劵名称" align="center" min-width="160"></el-table-column>
        <el-table-column prop="limitQuantity" label="数量" align="center" min-width="120"></el-table-column>
        <el-table-column prop="income" label="总奖励（个）" align="center" min-width="120"></el-table-column>
        <el-table-column prop="dayToDo" label="每天任务次数" align="center" min-width="120"></el-table-column>
        <el-table-column prop="completeCycleMin" label="周期（天）" align="center" min-width="120"></el-table-column>
        <el-table-column prop="executor" label="操作人员" align="center" min-width="120"></el-table-column>
        <el-table-column prop="modifyAt" label="更新时间" align="center" min-width="120">
          <template slot-scope="{row}">
            {{row.modifyAt ? $dayjs(row.modifyAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
          </template>
        </el-table-column>
        <el-table-column prop="statusType" label="状态" align="center" min-width="120">
          <template slot-scope="{row}">
            <el-switch v-hasPermi="['task:node_setting_status:change']" v-model="row.statusType" :active-value="1" :inactive-value="0" @change="handleSetType(row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template scope="scope">
            <el-button v-hasPermi="['integral:task_node_reward:update']" type="primary" size="mini" @click="handelEdit(scope.row)" :disabled="scope.row.statusType == 1">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--table-->
      <div class="table-pagination text-right mt10">
        <el-pagination
        @current-change="search"
        :page-sizes="[10, 20, 30]"
        @size-change="handleSizeChange"
        :current-page.sync="pageIndex"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
        </el-pagination>
      </div>
    </div>
    <!--新增/编辑dialog-->
    <el-dialog custom-class="certifyForm" title="节点激励包配置" :visible.sync="dialogFormVisible" :width="'800px'">
      <el-form :model="certifyform" :rules="rules" ref="ruleForm" class="form-box">
        <el-form-item :label-width="formLabelWidth" label="任务券名称：" prop="taskName">
          <el-col :span="13">
            <el-input v-model="certifyform.taskName" placeholder="请输入任务券名称"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="任务同时运行最大数量：" prop="limitQuantity">
          <el-col :span="13">
            <el-input v-model.number="certifyform.limitQuantity">
              <template slot="append">个</template>
            </el-input>
          </el-col>
          <el-col :span="11">
            <div class="input-tips">同时运行的最大数量</div>
          </el-col>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="总奖励Candy：" prop="income">
          <el-col :span="13">
            <el-input v-model="certifyform.income">
              <template slot="append">个</template>
            </el-input>
          </el-col>
          <el-col :span="11">
            <div class="input-tips">35天周期总共奖励的Candy</div>
          </el-col>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="每天可做任务次数：" prop="dayToDo">
          <el-col :span="13">
            <el-input v-model.number="certifyform.dayToDo">
              <template slot="append">次</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="任务券周期：" prop="completeCycleMin">
          <el-col :span="13">
            <el-input v-model.number="certifyform.completeCycleMin">
              <template slot="append">天</template>
            </el-input>
          </el-col>
          <el-col :span="11">
            <div class="input-tips">35天过期后即过期，没有延长时间</div>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { rewardPackagePage, editRewardPackage } from "@/api/member/nodeConfig";
import { taskPageSwitch } from '@/api/pointsMgmt/starTasks';

  export default {
    components: {},
    data () {
      return {
        loading: false,
        submitLoading: false,
        tableData: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dialogFormVisible: false,
        certifyform: {
          taskName: '',
          limitQuantity: 1,
          income: '1.000000',
          dayToDo: 1,
          completeCycleMin: 35,
        },
        rules: {
          taskName: [
            { required: true, message: '任务券名称不能为空', trigger: 'blur' },
          ],
          limitQuantity: [
            { required: true, message: '任务同时运行最大数量不能为空', trigger: 'blur' },
            { pattern: /^[1-9]\d*$/, message: '任务同时运行最大数量为正整数', trigger: 'blur' }
          ],
          income: [
            { required: true, message: '总奖励Candy不能为空', trigger: 'blur' },
            { pattern: /^\d+(\.\d{6})$/, message: '总奖励Candy为6位小数精度的数字', trigger: 'blur' }
          ],
          dayToDo: [
            { required: true, message: '每天可做任务次数不能为空', trigger: 'blur' },
            { pattern: /^[1-9]\d*$/, message: '每天可做任务次数为正整数', trigger: 'blur' }
          ],
          completeCycleMin: [
            { required: true, message: '任务券周期不能为空', trigger: 'blur' },
            { pattern: /^[1-9]\d*$/, message: '任务券周期为正整数', trigger: 'blur' }
          ],
        },
        formLabelWidth: '180px',
      }
    },
    activated() {
      this.search();
    },
    methods: {
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.search()
      },
      // 数据查询
      search (pgi) {
        if (pgi) this.pageIndex = pgi
        let _params = {
          currentPage: this.pageIndex,
          pageSize: this.pageSize,
        }
        this.loading = true
        rewardPackagePage(_params).then(response => {
          if (response.code === 200) {
            this.tableData = JSON.parse(JSON.stringify(response.data.list))
            this.totalPage = response.data.total
            this.loading = false
          } else {
            this.tableData = []
            this.totalPage = 0
            this.pageSize = 10
            this.loading = false
            this.$message.error(response.message)
          }
        })
      },
      handleAdd() {
        this.certifyform = {
          taskName: '',
          limitQuantity: null,
          income: '',
          dayToDo: null,
          completeCycleMin: null,
        }
        if(this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields();
        this.dialogFormVisible = true;
      },
      // 状态开关
      handleSetType(row) {
        let text = row.statusType == 0 ? "停用" : "启用";
        this.$confirm(`确认要${text}该配置?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          taskPageSwitch({id: row.id}).then(response => {
            if (response.code === 200) {
              this.msgSuccess(`保存成功`)
              this.search(this.pageIndex);
            } else {
              this.msgSuccess(response.message)
            }
          })
        }).catch(() => {
          if(row.statusType == 0) {
            row.statusType = 1
          } else{
            row.statusType = 0
          }
        });
      },
      handelEdit(row) {
        this.certifyform = {};
        this.certifyform = Object.assign({}, row);
        this.dialogFormVisible = true;
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let _params = {
              id: this.certifyform.id,
              taskName: this.certifyform.taskName,
              limitQuantity: this.certifyform.limitQuantity,
              income: this.certifyform.income,
              dayToDo: this.certifyform.dayToDo,
              completeCycleMin: this.certifyform.completeCycleMin,
              activateDeadline: this.certifyform.completeCycleMin,
              taskType: this.certifyform.taskType,
              expireDayAfter: this.certifyform.completeCycleMin,
              taskAttribute: {
                imgUrlProcess: "",
                fontColorProcess: "",
                imgUrlComplete: "",
                fontColorComplete: ""
              },
            }
            this.submitLoading = true;
            if(this.certifyform.id) {
              editRewardPackage(_params).then(response => {
                if (response.code === 200) {
                  this.msgSuccess(`保存成功`)
                  this.dialogFormVisible = false;
                  this.search(this.pageIndex);
                } else {
                  this.msgSuccess(response.message)
                  this.dialogFormVisible = false
                }
                setTimeout(() => {
                  this.submitLoading = false;
                },1000)
              }).catch(err => {
                this.submitLoading = false;
              })
            }else {
              editRewardPackage(_params).then(response => {
                if (response.code === 200) {
                  this.msgSuccess(`保存成功`)
                  this.dialogFormVisible = false;
                  this.search(this.pageIndex);
                } else {
                  this.msgSuccess(response.message)
                  this.dialogFormVisible = false
                }
                setTimeout(() => {
                  this.submitLoading = false;
                },1000)
              }).catch(err => {
                this.submitLoading = false;
              })
            }
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
.tab-content{
  .form-box{
    .input-tips {
      display: inline-block;
      margin-left: 20px;
      color: #9ca7b5;
      vertical-align: middle;
      line-height: 22px;
    }
  }
}
</style>
<style lang="scss">
.tab-content{
  form{
    padding-right:40px;
  }
  .el-form-item__content{
    position: relative;
    .el-select{
      width: 100%;
    }
  }
}
</style>

