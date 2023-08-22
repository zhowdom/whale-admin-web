<template>
  <div class="tab-content">
    <div class="mb30 text-muted ft14">
      <p>节点奖励 ： 是指成为指定节点后，额外赠送相应的激励包 至 【我的卡券】，且达到相应的解锁条件，才可激活</p>
    </div>
    <div class="task-table">
      <!--table-->
      <el-table
      :data="tableData"
      v-loading="loading"
      style="width: 100%">
        <el-table-column prop="nodeType" label="代理节点" align="center" min-width="160">
          <template slot-scope="{row}">
            {{row.nodeType ? nodeTypeObj[row.nodeType] : ''}}
          </template>
        </el-table-column>
        <el-table-column prop="vipLevel" label="解锁条件" align="center" min-width="120">
          <template slot-scope="{row}">
            {{row.vipLevel ? vipLevelObj[row.vipLevel] : '暂无'}}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="激励包" align="center" min-width="120"></el-table-column>
        <el-table-column prop="term" label="协议期限(月)" align="center" min-width="120"></el-table-column>
        <el-table-column prop="name" label="送券数据" align="center" min-width="120">
          <template slot-scope="{row}">
            <span v-if="row.systemDefault == true || row.systemDefault == 'true'">手动送券数据</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" align="center" min-width="120">
          <template slot-scope="{row}">
            {{row.updateTime ? $dayjs(row.updateTime).format('YYYY-MM-DD HH:mm:ss') : $dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss')}}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" min-width="120">
          <template slot-scope="{row}">
            <el-switch v-hasPermi="['task:node_setting_status:change']" v-model="row.status" @change="handleSetType(row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template scope="scope">
            <el-button v-hasPermi="['task:node_setting_reward:update']" type="primary" size="mini" @click="handelEdit(scope.row)" :disabled="scope.row.status">编辑</el-button>
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
    <el-dialog custom-class="certifyForm" title="节点奖励配置" :visible.sync="dialogFormVisible" :width="'600px'">
      <el-form :model="certifyform" :rules="rules" ref="ruleForm">
        <el-form-item label="代理节点：" :label-width="formLabelWidth" prop="nodeType">
          <el-select v-model="certifyform.nodeType" disabled placeholder="请选择">
            <el-option v-for="(item, key, index) in nodeTypeObj" :key="index" :label="item" :value="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="激励包：" :label-width="formLabelWidth" prop="taskInfoId">
          <el-select v-model="certifyform.taskInfoId" placeholder="请选择">
            <template v-for="(item, index) of rewardArr">
              <el-option v-if="item.statusType" :key="index" :label="item.desc" :value="item.code"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          （选项：取节点激励包配置的【启用】的激励包）
        </el-form-item>
        <el-form-item label="解锁条件：" :label-width="formLabelWidth" prop="vipLevel">
          <el-select v-model="certifyform.vipLevel" placeholder="请选择">
            <el-option v-for="(item, index) of asteriskTypesArr" :key="index" :label="item.msg" :value="item.type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          （选中及其以下，假设选中为【三星达人】，则 三星达人，四星达人，五星达人均符合解锁条件 ）
        </el-form-item>
        <el-form-item label="协议期限：" :label-width="formLabelWidth" prop="term">
          <el-col :span="20">
            <el-input v-model.number="certifyform.term"></el-input>
          </el-col>
          <el-col :span="4" style="text-align: center;">
            月
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
import { rewardPage, editReward, changeNodeEquityReward, rewardList, asteriskTypes } from "@/api/member/nodeConfig";

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
          id: '',
          taskInfoId: '',
          vipLevel: '',
          term: null
        },
        rules: {
          vipLevel: [
            { required: true, message: '不能为空', trigger: 'change' }
          ],
          taskInfoId: [
            { required: true, message: '不能为空', trigger: 'change' }
          ],
          term: [
            { required: true, message: '不能为空', trigger: 'change' },
            { type: 'number',min: 1, max: 1000, message: '请填写大于等于1的值'}
          ],
        },
        formLabelWidth: '150px',
        nodeTypeObj: {9: '国际节点', 10: '一级节点', 11: '二级节点', 12: '三级节点'},
        vipLevelObj: {},// 1:' 一星达人', 2: '二星达人', 3: '三星达人', 4: '四星达人', 5: '五星达人'
        rewardArr: [],
        asteriskTypesArr: [],
      }
    },
    activated() {
      this.search();
      this.rewardList();
      this.asteriskTypes();
    },
    methods: {
      rewardList() {
        rewardList({}).then(response => {
          if (response.code === 200) {
            this.rewardArr = JSON.parse(JSON.stringify(response.data.list))
          } else {
            this.$message.error(response.message)
          }
        })
      },
      asteriskTypes() {
        asteriskTypes({}).then(response => {
          if (response.code === 200) {
            this.asteriskTypesArr = JSON.parse(JSON.stringify(response.data.list))
            this.asteriskTypesArr.forEach(item => {
              this.vipLevelObj[item.type] = item.msg;
            })
          } else {
            this.$message.error(response.message)
          }
        })
      },
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
        rewardPage(_params).then(response => {
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
      // 状态开关
      handleSetType(row) {
        let text = row.status == false ? "停用" : "启用";
        this.$confirm(`确认要${text}该配置?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          changeNodeEquityReward({id: row.id}).then(response => {
            if (response.code === 200) {
              this.msgSuccess(`保存成功`)
              this.search(this.pageIndex);
            } else {
              this.msgSuccess(response.message)
            }
          })
        }).catch(() => {
          if(row.status == false) {
            row.status = true
          } else{
            row.status = false
          }
        });
      },
      handelEdit(row) {
        this.certifyform = {};
        row.nodeType = String(row.nodeType)
        this.certifyform = Object.assign({}, row);
        this.dialogFormVisible = true;
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitLoading = true;
            editReward(this.certifyform).then(response => {
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
        })
      },
    }
  }
</script>

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

