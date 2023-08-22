<template>
  <div class="tab-content cont_Wrapper">
    <el-form :model="queryParams" :inline="true">
      <el-form-item label="菜单名称" prop="title">
        <el-input v-model="queryParams.title" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" clearable placeholder="请选择">
          <el-option label="全部" :value="null"></el-option>
          <el-option label="启用" :value="true"></el-option>
          <el-option label="禁用" :value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-hasPermi="['setting:problem_manual_menu:tree']" type="primary" :loading="loading" icon="el-icon-search" @click="search()">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="mb30">
      <el-button v-hasPermi="['setting:problem_manual_menu:save']" icon="el-icon-plus" type="primary" @click="handleAdd()">新增</el-button>
    </div>
    <!--table-->
    <el-table
    :data="tableData"
    v-loading="loading"
    class="tab-contentbox"
    row-key="title"
    style="width: 100%"
    :tree-props="{children: 'child'}">
      <el-table-column prop="title" label="菜单名称" align="left" min-width="120"></el-table-column>
      <el-table-column prop="sort" label="排序" align="center" min-width="120"></el-table-column>
      <el-table-column prop="status" label="状态" align="center" min-width="160">
        <template slot-scope="{row}">
          <el-switch v-hasPermi="['setting:problem_manual_menu:change']" v-model="row.status" :active-value="true" :inactive-value="false" @change="handleSetType(row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center" min-width="160">
        <template slot-scope="{row}">
          {{row.createTime ? $dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="220">
        <template scope="scope">
          <el-button v-hasPermi="['setting:problem_manual_menu:update']" type="primary" size="mini" @click="handleEdit(scope.row)" v-if="!scope.row.status">编辑</el-button>
          <el-button v-hasPermi="['setting:problem_manual_menu:save']" type="primary" size="mini" @click="handleChildAdd(scope.row)">新增</el-button>
          <el-button v-hasPermi="['setting:problem_manual_menu:delete']" type="primary" size="mini" @click="handleDelete(scope.row)" v-if="!scope.row.status">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--table-->
    <!--新增/编辑dialog-->
    <el-dialog custom-class="certifyForm" title="新增/修改菜单" :visible.sync="dialogFormVisible" :width="'630px'">
      <el-form :model="certifyform" :rules="rules" ref="ruleForm">
        <el-form-item label="菜单名称：" :label-width="formLabelWidth" prop="title">
          <el-input maxlength="40" v-model="certifyform.title" autocomplete="off" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单：" :label-width="formLabelWidth">
          <el-cascader 
          v-model="memuIdList" 
          :options="tableData" 
          :props="{ value: 'id', label: 'title',children: 'child', checkStrictly: true }" 
          clearable
          :disabled="operationType == 'childAdd'"></el-cascader>
        </el-form-item>
        <el-form-item label="排序：" :label-width="formLabelWidth" prop="sort">
          <el-input v-model.number="certifyform.sort" autocomplete="off" clearable placeholder="请输入"></el-input>
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
import { manualTreePage, addManual, editManual, changeManual, deleteManual } from "@/api/setting/problem.js";
export default {
  data() {
    return {
      loading: false,
      dialogFormVisible: false,
      queryParams: {
        title: '',
        status: null
      },
      certifyform: {
        title: '',
        parentId: '',
        sort: '',
        id: '',
      },
      rules: {
        title: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { type: 'number', min: 1, message: '排序为数字且必须大于等于1', trigger: 'blur' },
        ],
      },
      formLabelWidth: '130px',
      tableData: [],
      treeData: [],
      memuIdList: [],
      operationType: 'add',
      rootId: '',
    }
  },
  activated() {
    this.search();
  },
  methods: {
    // 数据查询
    search () {
      let _params = {
        ...this.queryParams
      }
      this.loading = true
      manualTreePage(_params).then(response => {
        if (response.code === 200) {
          let arr = JSON.parse(JSON.stringify(response.data.list));
          this.tableData = this.toolData(arr, [], false);
          this.treeData = this.tableData;
          this.loading = false
        } else {
          this.tableData = []
          this.loading = false
          this.$message.error(response.message)
        }
      }).catch( e => {
        this.loading = false
      })
    },
    // 处理数据
    toolData(dataArr = [], idsArr, isbool) {
      dataArr.forEach(item => {
        item.disabled = isbool == true ? true : false;
        if(item.id == this.rootId) {
          item.disabled = true;
        }
        item.ids = [...idsArr, item.id];
        if(item.child && item.child.length > 0) {
          this.toolData(item.child, item.ids, item.disabled);
        }
      })
      return dataArr;
    },
    // 删除
    handleDelete(row) {
      this.$confirm('是否确定要删除该条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        deleteManual({id: row.id}).then(response => {
          if (response.code === 200) {
            this.msgSuccess(`删除成功`)
            this.search();
          } else {
            this.msgSuccess(response.message)
          }
        })
      }).catch(() => {
                  
      });
    },
    // 状态开关
    handleSetType(row) {
      let text = row.status === true ? "启用" : "停用";
      this.$confirm(`确认要${text}该配置?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        let _params = {
          id: row.id
        }
        changeManual(_params).then(response => {
          if (response.code === 200) {
            this.msgSuccess(`保存成功`)
            this.search();
          } else {
            this.msgSuccess(response.message)
          }
        })
      }).catch(() => {
        row.status = !row.status;
      });
    },
    handleAdd() {
      this.operationType = 'add';
      this.certifyform = {
        title: '',
        parentId: '',
        sort: '',
        id: '',
      };
      this.memuIdList = [];
      if(this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields();
      this.dialogFormVisible = true;
    },
    handleEdit(row) {
      this.operationType = 'etid';
      this.certifyform = Object.assign({}, row);
      this.rootId = row.id;
      if(row.parentId == 0) {
        this.memuIdList = [];
      }else {
        this.memuIdList = row.ids.slice(0, row.ids.length - 1);
      }
      this.treeData = this.toolData(this.tableData, [], false);
      if(this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields();
      this.dialogFormVisible = true;
    },
    handleChildAdd(row) {
      this.operationType = 'childAdd';
      this.certifyform = {
        title: '',
        parentId: row.id,
        sort: '',
        id: '',
      }
      this.memuIdList = row.ids;
      if(this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields();
      this.dialogFormVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.memuIdList.length <= 0) {
            this.certifyform.parentId = 0;
          }else{
            this.certifyform.parentId = this.memuIdList[this.memuIdList.length - 1];
          }
          if(this.operationType == 'etid') {
            editManual(this.certifyform).then(response => {
              if (response.code === 200) {
                this.msgSuccess(`保存成功`)
                this.dialogFormVisible = false;
                this.search();
              } else {
                this.msgSuccess(response.message)
                this.dialogFormVisible = false
              }
            })
          }else {
            addManual(this.certifyform).then(response => {
              if (response.code === 200) {
                this.msgSuccess(`保存成功`)
                this.dialogFormVisible = false;
                this.search();
              } else {
                this.msgSuccess(response.message)
                this.dialogFormVisible = false
              }
            })
          }
        }
      })
    },
  }
}
</script>

<style lang="scss">
.tab-content{
  .certifyForm form{
    padding-right:40px;
    .el-select, .el-cascader{
      width: 100%;
    }
  }
  .el-form-item__content{
    position: relative;
  }
}
</style>