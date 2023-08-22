<template>
  <div class="tab-content">
    <div class="mb30">
      <el-button v-hasPermi="['notice:manage:save']" icon="el-icon-plus" type="primary" @click="handleAdd()">新增</el-button>
    </div>
    <!--table-->
    <el-table
    :data="tableData"
    v-loading="loading"
    class="tab-contentbox"
    style="width: 100%">
      <el-table-column type="index" :index="1" label="序号" align="center" width="80"></el-table-column>
      <el-table-column prop="title" label="公告标题" align="center" min-width="120"></el-table-column>
      <el-table-column prop="displayType" label="展示方式" align="center" min-width="120">
        <template slot-scope="{row}">
          <span v-if="row.displayType && row.displayType.indexOf(1) != -1">公告中心</span>
          <span v-if="row.displayType && row.displayType.indexOf(2) != -1">{{row.displayType.indexOf(1) != -1 ? '、 ' : ''}}轮播</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center" min-width="120">
        <template slot-scope="{row}">
          <el-switch v-hasPermi="['notice:manage:status']" v-model="row.status" @change="handleSetType(row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template scope="scope">
          <el-button v-hasPermi="['notice:manage:update']" type="primary" size="mini" @click="handelEdit(scope.row)" :disabled="scope.row.status">编辑</el-button>
          <el-button v-hasPermi="['notice:manage:delete']" type="danger" size="mini" @click="handelDelete(scope.row)" :disabled="scope.row.status">删除</el-button>
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
    <el-dialog custom-class="certifyForm" title="公告配置" :visible.sync="dialogFormVisible" :width="'700px'">
      <el-form :model="certifyform" :rules="rules" ref="ruleForm">
        <el-form-item label="公告表题：" :label-width="formLabelWidth" prop="title">
          <el-input v-model="certifyform.title" autocomplete="off" maxlength="60" placeholder="请输入（60字以内）" clearable></el-input>
        </el-form-item>
        <el-form-item label="展示方式：" :label-width="formLabelWidth" prop="displayType">
          <el-checkbox-group v-model="certifyform.displayType">
            <el-checkbox :label="1">公告中心</el-checkbox>
            <el-checkbox :label="2">轮播</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <span class="text-muted">（多选，默认选中【公告中心】，只选【公告中心】，则不轮播，只在【公告中心】展示）</span>
        </el-form-item>
        <el-form-item :label-width="'0px'">
          <qu-editor v-model="certifyform.content" :min-height="192" ref="quEditorRef" :is-handle-img="true" @on-change="onEditorChange"/>
          <span class="wordNumber">{{TiLength}}/2000</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { noticePage, addNotice, editNotice, changeNotice, deleteNotice } from "@/api/setting/noticeConfig.js";
export default {
  components: {
    QuEditor: () => import('@/components/Editor')
  },
  data() {
    return {
      loading: false,
      tableData: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dialogFormVisible: false,
      certifyform: {
        displayType: [],
        title: '',
        content: '',
        id: '',
      },
      rules: {
        title: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        displayType: [
          { required: true, message: '不能为空', trigger: 'change,blur' }
        ],
      },
      formLabelWidth: '140px',
      bruleForm: {detailUrl: '', id: ''},
      TiLength: 0
    }
  },
  mounted() {
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
      noticePage(_params).then(response => {
        if (response.code === 200) {
          this.tableData = JSON.parse(JSON.stringify(response.data.list))
          this.totalPage = response.data.total;
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
        displayType: [],
        title: '',
        content: '',
        id: '',
      };
      if(this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields();
      this.dialogFormVisible = true;
    },
    // 状态开关
    handleSetType(row) {
      let text = row.status == false ? "停用" : "启用";
      this.$confirm(`确认要${text}该配置?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        changeNotice({id: row.id}).then(response => {
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
      this.certifyform = Object.assign({}, row);
      this.dialogFormVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.certifyform.title = this.certifyform.title.trim();
          if(!!!this.certifyform.title) {
            this.$message.error('表题不能为空或全为空格');
            return;
          }
          if(this.TiLength > 2000) {
            this.$message.error('内容不能超过2000字！');
            return;
          }
          let _params = Object.assign({}, this.certifyform);
          if(this.certifyform.id) {
            editNotice(_params).then(response => {
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
            addNotice(_params).then(response => {
              if (response.code === 200) {
                this.msgSuccess(`保存成功`)
                this.dialogFormVisible = false;
                this.search(this.pageIndex);
              } else {
                this.msgSuccess(response.message)
                this.dialogFormVisible = false
              }
            })
          }
        }
      })
    },
    handelDelete(row) {
      this.$confirm(`确认要删除该配置?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        deleteNotice({id: row.id}).then(response => {
          if (response.code === 200) {
            this.msgSuccess(`删除成功`)
            this.search(this.pageIndex);
          } else {
            this.msgSuccess(response.message)
          }
        })
      }).catch(() => {
      });
    },
    onEditorChange(obj){
      this.TiLength = obj.text.length - 1;
    }
  }
}
</script>
<style lang="scss" scoped>
  .tab-content{
    box-sizing: border-box;
    padding: 20px;
    .wordNumber{
      float: right;
      margin-top: -27px;
      margin-right: 5px;
      color: #999;
    }
  }
</style>
<style lang="scss">
.tab-content{
  .certifyForm form{
    padding-right:40px;
    .el-select{
      width: 100%;
    }
  }
  .el-form-item__content{
    position: relative;
  }
}
</style>