<template>
  <div class="cont_Wrapper">
    <div class="mb20">
      <el-button v-hasPermi="['setting:ecology_tab:save']" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
    </div>
    <el-table
    :data="tableData"
    v-loading="loading"
    style="width: 100%">
      <el-table-column prop="name" label="tab名称" align="center" min-width="120"></el-table-column>
      <el-table-column prop="sort" label="排序" align="center" min-width="120"></el-table-column>
      <el-table-column prop="auth" label="权限" align="center" min-width="120">
        <template slot-scope="{row}">
          <a style="color:#1890ff;" @click="showAuthDialog(row)">{{row.auth ? '正常' : '暂未开放'}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center" min-width="120">
        <template slot-scope="{row}">
          <el-switch v-hasPermi="['setting:ecology_tab:change']" v-model="row.status"  @change="handleSetType(row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" align="center" min-width="160">
        <template slot-scope="{row}">
          {{row.updateTime ? $dayjs(row.updateTime).format('YYYY-MM-DD HH:mm:ss') : row.createTime ? $dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="updateBy" label="操作人" align="center" min-width="120">
        <template slot-scope="{row}">
          {{row.updateTime ? row.updateBy : row.createBy}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template scope="scope">
          <el-button v-hasPermi="['setting:ecology_tab:update']" type="primary" size="mini" @click="handleEdit(scope.row)" v-if="!scope.row.status">编辑</el-button>
          <el-button v-hasPermi="['setting:ecology_tab:delete']" type="primary" size="mini" @click="handleDelete(scope.row)" v-if="!scope.row.status">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--table-->
    <el-pagination
    style="float:right;padding-top:20px;"
    @current-change="search"
    :page-sizes="[10, 20, 30]"
    @size-change="handleSizeChange"
    :current-page.sync="pageIndex"
    :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="totalPage">
    </el-pagination>
    <!--新增/编辑dialog-->
    <el-dialog custom-class="certifyForm" title="新增/编辑" :visible.sync="dialogFormVisible" width="25%">
      <el-form :model="certifyform" :rules="rules" ref="ruleForm">
        <el-form-item label="名称：" :label-width="formLabelWidth" prop="name">
          <el-input maxlength="40" v-model="certifyform.name" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="排序：" :label-width="formLabelWidth" prop="sort">
          <el-input v-model.number="certifyform.sort" autocomplete="off" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="" :visible.sync="dialogFormVisibleAuth" width="30%">
      <el-form>
        <el-form-item label="权限：">
          <el-radio v-model="isAuthStatus" :label="true">正常</el-radio>
          <el-radio v-model="isAuthStatus" :label="false">暂未开放</el-radio>
        </el-form-item>
        <div style="font-size:13px;padding-left:60px;">
          注:<br/>
          1. 无论为【禁用】【启用】状态 ，此按钮均可配置<br/>
          2. 权限 - 正常，是指正常授权交互<br/>
          3. 权限 - 暂未开放，是指点击，提示“暂未开放”<br/>
          4. 默认：权限-【正常】
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAuth = false">取 消</el-button>
        <el-button v-hasPermi="['setting:ecology_tab_auth:change']" type="primary" :loading="isAuthLoading" @click="saveiSAuth">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { ecologyTabPage, addEcologyTab, editEcologyTab, changeEcologyTab, deleteEcologyTab, dappPermissionAlter_tab } from "@/api/dappManage";
  export default {
    components: {},
    data () {
      return {
        dialogFormVisibleAuth: false,
        isAuthStatus: false,
        isAuthLoading: false,
        curID: null,
        dialogFormVisible: false,
        certifyform: {
          name: '',
          sort: '',
        },
        rules: {
          name: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          sort: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { type: 'number', min: 1, message: '排序为数字且必须大于等于1', trigger: 'blur' },
          ],
        },
        formLabelWidth: '80px', // 新增修改ed
        loading: false,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        tableData: [],
      }
    },
    created () {
      
    },
    mounted () {
      this.search();
    },
    methods: {
      showAuthDialog (row) {
        this.dialogFormVisibleAuth = true
        this.curID = row.id
        this.isAuthStatus = row.auth || false
      },
      saveiSAuth () {
        this.isAuthLoading = true
        dappPermissionAlter_tab({
          auth: this.isAuthStatus,
          id: this.curID
        }).then(response => {
          this.isAuthLoading = false
          if (response.code == 200) {
            this.msgSuccess(`操作成功`)
            this.dialogFormVisibleAuth = false
            this.search(1)
          } else {
            this.msgSuccess(response.message)
          }
        }).catch(e => {
          this.isAuthLoading = false
        })
      },
      handleAdd() {
        this.certifyform = {
          clientType: 1, // old need add params
          name: '',
          sort: '',
        };
        if(this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields();
        this.dialogFormVisible = true;
      },
      handleEdit(row) {
        this.certifyform = Object.assign({}, row);
        this.certifyform.clientType = 1 // old need add params
        if(this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields();
        this.dialogFormVisible = true;
      },
      handleSetType(row) {
        let text = row.status === true ? "启用" : "停用";
        this.$confirm(`确认要${text}该配置?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          let _params = {
            id: row.id
          }
          changeEcologyTab(_params).then(response => {
            if (response.code === 200) {
              this.msgSuccess(`保存成功`)
              this.dialogFormVisible = false;
              this.search(this.pageIndex);
            } else {
              this.msgSuccess(response.message)
              this.dialogFormVisible = false
            }
          })
        }).catch(() => {
          row.status = !row.status;
        });
      },
      handleDelete(row) {
        this.$confirm('是否确定要删除该条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          deleteEcologyTab({id: row.id}).then(response => {
            if (response.code === 200) {
              this.msgSuccess(`删除成功`)
              this.search(1);
            } else {
              this.msgSuccess(response.message)
            }
          })
        }).catch(() => {
                   
        });
      },
      // 提交保存
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.certifyform);
            // return;
            if(this.certifyform.id) {
              editEcologyTab(this.certifyform).then(response => {
                if (response.code === 200) {
                  this.msgSuccess(`保存成功`)
                  this.dialogFormVisible = false;
                  this.search(this.pageIndex);
                } else {
                  this.msgSuccess(response.message)
                  this.dialogFormVisible = false
                }
              })
            }else {
              addEcologyTab(this.certifyform).then(response => {
                if (response.code === 200) {
                  this.msgSuccess(`保存成功`)
                  this.dialogFormVisible = false;
                  this.search(1);
                } else {
                  this.msgSuccess(response.message)
                  this.dialogFormVisible = false
                }
              })
            }
          }
        })
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.search()
      },
      search (pgi) {
        if (pgi) this.pageIndex = pgi
        let _params = {
          clientType: 1, // old need add params
          currentPage: this.pageIndex,
          pageSize: this.pageSize,
          status: '',
          name: ''
        }
        this.loading = true
        ecologyTabPage(_params).then(response => {
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
      }
    }
  }
</script>

<style lang="scss" scoped>
.cont_Wrapper{
  padding: 20px;
  .line{
    text-align: center;
  }
}
</style>

