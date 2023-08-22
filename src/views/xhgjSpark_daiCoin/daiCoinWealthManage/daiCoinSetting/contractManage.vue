<template>
  <div class="tab-content cont_Wrapper">
    <div class="mb30">
      <el-button v-hasPermi="['wallet:contract:add']" icon="el-icon-plus" type="primary" @click="handleAdd()">新增</el-button>
    </div>
    <!--table-->
    <div class="task-table">
      <el-table
      :data="tableData"
      v-loading="loading"
      style="width: 100%">
        <el-table-column prop="coinName" label="代币符号" align="center" min-width="120"></el-table-column>
        <el-table-column prop="sort" label="转账平台" align="center" min-width="120">
          <template slot-scope="{row}">
            {{transferList[row.platformName]}}
          </template>
        </el-table-column>
        <el-table-column prop="contractAddress" label="代币地址" align="center" min-width="120"></el-table-column>
        <el-table-column prop="scale" label="精度（位）" align="center" min-width="120">
          <template slot-scope="{row}">
            {{row.unitNumber}} <span v-if="row.unit">({{row.unit}})</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template scope="scope">
            <el-button v-hasPermi="['wallet:contract:update']" type="text" size="mini" @click="handleEdit(scope.row)" v-if="!scope.row.enable">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
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
    <!--table-->
    <!--新增/编辑dialog-->
    <el-dialog custom-class="certifyForm" title="添加/编辑代币" :visible.sync="dialogFormVisible" :width="'600px'">
      <el-form :model="certifyform" :rules="rules" ref="ruleForm">
        <el-form-item label="转账平台：" :label-width="formLabelWidth" prop="platformName">
          <el-select v-model="certifyform.platformName" clearable placeholder="请选择">
            <el-option v-for="(item, key, index) in transferList" :label="`${item} (${key})`" :value="key" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="代币地址：" :label-width="formLabelWidth" prop="contractAddress">
          <el-input v-model="certifyform.contractAddress" autocomplete="off" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="代币符号：" :label-width="formLabelWidth" prop="coinName">
          <el-input v-model="certifyform.coinName" autocomplete="off" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="精度：" :label-width="formLabelWidth" prop="unit">
          <el-select v-model="certifyform.unit" clearable placeholder="请选择" @change="handleChangeUnit">
            <el-option v-for="(item, key, index) in scaleParams" :label="`${item} (${key})`" :value="key" :key="index"></el-option>
          </el-select>
          <span class="danwei">位</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" :loading="editLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { contractManagePage, addContractManage, editContractManage, scaleList, transferListPlatform } from "@/api/xhgjSpark_api/daiCoinSetting.js";
export default {
  data() {
    let imgValidator = (rule, value, callback) => {
      if (!/\S/.test(value)) {
        callback(new Error('请上传图片'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      tableData: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dialogFormVisible: false,
      certifyform: {
        coinName: '',
        contractAddress: '',
        platformName: '',
        unit: '',
        unitNumber: '',
        remark: '',
        id: ''
      },
      rules: {
        platformName: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        unit: [
          { required: true, message: '不能为空', trigger: 'change' },
        ],
        contractAddress: [
          { required: true, message: '不能为空', trigger: 'blur' },
        ],
        coinName: [
          { required: true, message: '不能为空', trigger: 'blur' },
        ],
      },
      file: '',
      formLabelWidth: '120px',
      scaleParams: {},
      editLoading: false,
      transferList: {}
    }
  },
  mounted() {
    this.search();
    this.scaleList();
    this.transferListPlatform();
  },
  methods: {
    transferListPlatform() {
      transferListPlatform({}).then(response => {
        if (response.code === 200) {
          this.transferList = JSON.parse(JSON.stringify(response.data));
        } else {
          this.transferList = {}
          this.$message.error(response.message)
        }
      })
    },
    scaleList() {
      scaleList({}).then(response => {
        if (response.code === 200) {
          this.scaleParams = JSON.parse(JSON.stringify(response.data));
        } else {
          this.scaleParams = {}
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
      contractManagePage(_params).then(response => {
        if (response.code === 200) {
          this.tableData = JSON.parse(JSON.stringify(response.data.list));
          this.totalPage = response.data.total;
          this.loading = false
        } else {
          this.tableData = []
          this.totalPage = 0
          this.pageSize = 10
          this.loading = false
          this.$message.error(response.message)
        }
      }).catch(e => {
        console.log(e)
        this.loading = false
      })
    },
    handleAdd() {
      this.certifyform = {
        coinName: '',
        contractAddress: '',
        platformName: '',
        unit: '',
        unitNumber: '',
        remark: '',
      }
      if(this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields();
      this.dialogFormVisible = true;
    },
    handleEdit(row) {
      this.certifyform = Object.assign({}, row);
      this.dialogFormVisible = true;
    },
    handleChangeUnit(val) {
      this.certifyform.unitNumber = this.scaleParams[val];
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editLoading = true;
          if(this.certifyform.id) {
            editContractManage(this.certifyform).then(response => {
              if (response.code === 200) {
                this.msgSuccess(`保存成功`)
                this.search(this.pageIndex);
              } else {
                this.msgSuccess(response.message)
                this.search(this.pageIndex);
              }
              this.dialogFormVisible = false;
              this.editLoading = false;
            }).catch(error => {
              this.dialogFormVisible = false;
              this.editLoading = false;
              this.search(this.pageIndex);
            })
          }else {
            addContractManage(this.certifyform).then(response => {
              if (response.code === 200) {
                this.msgSuccess(`保存成功`)
                this.search(this.pageIndex);
              } else {
                this.msgSuccess(response.message)
                this.search(this.pageIndex);
              }
              this.dialogFormVisible = false;
              this.editLoading = false;
            }).catch(error => {
              this.dialogFormVisible = false;
              this.editLoading = false;
              this.search(this.pageIndex);
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
  .danwei{
    position: absolute;
    top: 0;
    right: -20px;
  }
}
</style>
<style lang="scss">
.tab-content{
  .certifyForm form{
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