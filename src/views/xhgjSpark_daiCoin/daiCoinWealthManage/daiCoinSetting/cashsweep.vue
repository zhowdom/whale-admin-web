<template>
  <div class="tab-content">
    <div class="mb30">
      说明 ： 每天00:00 进行归集，取当时实时gas fee
    </div>
    <div class="task-table">
      <!--table-->
      <el-table
      :data="tableData"
      v-loading="loading"
      style="width: 100%">
        <el-table-column prop="coinName" label="币种" align="center" min-width="120"></el-table-column>
        <el-table-column prop="transactionNetworkName" label="转账网络" align="center" min-width="120"></el-table-column>
        <el-table-column prop="collectLimit" label="资产达到阈值" align="center" min-width="120"></el-table-column>
        <el-table-column prop="collectStatus" label="状态" align="center" min-width="120">
          <template slot-scope="{row}">
            <el-switch v-hasPermi="['wallet:config:collect:modify']" v-model="row.collectStatus" :active-value="1" :inactive-value="0" @change="handleSetType(row)"></el-switch>
            <el-switch v-if="!switchDisabled"  v-model="row.collectStatus" :active-value="1" :inactive-value="0" disabled></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="collectModifyAt" label="更新时间" align="center" min-width="160">
          <template slot-scope="{row}">
            {{row.collectModifyAt ? $dayjs(row.collectModifyAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template scope="scope">
            <el-button v-hasPermi="['wallet:config:collect:modify']" type="primary" size="mini" @click="handelEdit(scope.row)" :disabled="scope.row.collectStatus == 1">编辑</el-button>
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
    <el-dialog custom-class="certifyForm" :title="dialogTitle" :visible.sync="dialogFormVisible" :width="'600px'">
      <el-form :model="certifyform" :rules="rules" ref="ruleForm">
        <el-form-item label="转账网络：" :label-width="formLabelWidth" prop="transactionNetworkName">
          <el-input v-model="certifyform.transactionNetworkName" disabled></el-input>
        </el-form-item>
        <el-form-item label="币种：" :label-width="formLabelWidth" prop="coinName">
          <el-input v-model="certifyform.coinName" disabled></el-input>
        </el-form-item>
        <el-form-item label="资产值域：" :label-width="formLabelWidth" prop="collectLimit">
          <el-input v-model="certifyform.collectLimit"  @input="certifyform.collectLimit=certifyform.collectLimit.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g,'$1')" autocomplete="off" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <span>6位精度，上限1000000</span>
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
import store from '@/store'
import { cashsweepConfigPage, cashsweepConfigModify } from "@/api/xhgjSpark_api/daiCoinSetting.js";
  export default {
    components: {},
    data () {
      var maxNumber = (rule, value, callback) => {
        if(Number(value) > 1000000) {
          return callback(new Error('请输入小于1000000的数值'))
        }
        callback()
      }
      return {
        loading: false,
        submitLoading: false,
        tableData: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dialogFormVisible: false,
        dialogTitle: '归集配置',
        certifyform: {
          coinName: '',
          collectLimit: '',
          collectModifyAt: '',
          collectStatus: '',
          id: '',
          name: '',
          platformName: '',
          transactionNetworkName: '',
        },
        rules: {
          collectLimit: [
            { required: true, validator: maxNumber, trigger: 'blur' }
          ],
        },
        formLabelWidth: '120px',
        switchDisabled: true,
      }
    },
    mounted () {
      
    },
    activated() {
      this.search();
      const all_permission = "*:*:*";
      const permissionFlag = ['wallet:config:collect:modify'];
      const permissions = store.getters && store.getters.permissions;
      this.switchDisabled = permissions.some(permission => {
        return all_permission === permission || permissionFlag.includes(permission)
      })
    },
    watch: {},
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
        cashsweepConfigPage(_params).then(response => {
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
        }).catch(e => {
          console.log(e)
          this.loading = false
        })
      },
      // 状态开关
      handleSetType(row) {
        let text = row.collectStatus == 0 ? "停用" : "启用";
        this.$confirm(`确认要${text}该配置?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          let _params = {
            collectLimit: row.collectLimit,
            collectStatus: row.collectStatus == 1 ? 1 : 0,
            id: row.id
          }
          this.updata(_params);
        }).catch(() => {
          if(row.collectStatus == 0) {
            row.collectStatus = 1
          } else{
            row.collectStatus = 0
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
            let _params = {
              collectLimit: Number(this.certifyform.collectLimit),
              collectStatus: this.certifyform.collectStatus,
              id: this.certifyform.id
            }
            this.submitLoading = true;
            this.updata(_params);
          }
        })
      },
      // 提交编辑
      updata(data) {
        cashsweepConfigModify(data).then(response => {
          if (response.code === 200) {
            this.msgSuccess(`保存成功`)
            this.dialogFormVisible = false;
            this.search(1);
          } else {
            this.msgSuccess(response.message)
            this.dialogFormVisible = false
          }
          setTimeout(() => {
            this.submitLoading = false;
          },1000)
        })
      }
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
  }
}
</style>

