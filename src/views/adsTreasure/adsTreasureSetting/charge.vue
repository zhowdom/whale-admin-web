<template>
  <div class="shareAddManagebox" style="padding:20px;">

      <el-button v-hasPermi="['advertising:serviceFee:storage']" @click="addOrEditClick('add')">新增</el-button>

      <el-table
    :data="tableData"
    @sort-change="sortChange"
    v-loading="loading"
    border
    style="width: 100%;margin-top:30px;">
    
    <el-table-column
      prop="id"
      label="编号"
      align="center"></el-table-column>

    <el-table-column
      prop="name"
      label="广告宝名称"
      align="center"></el-table-column>

    <el-table-column
      prop="images"
      label="图标"
      align="center">
      <template scope="scope">
        <el-image style="width: 80px; height: 80px" :src="scope.row.images"></el-image>
      </template>
    </el-table-column>
    <el-table-column
      prop="partnerAmount"
      label="合伙人服务费"
      align="center"></el-table-column>
    <el-table-column
      prop="vpAmount"
      label="团长服务费"
      align="center"></el-table-column>
    
     <el-table-column
      prop="svpAmount"
      label="高级服务费"
      align="center"></el-table-column>

    <el-table-column
      label="状态"
      align="center">
      <template scope="scope">
        <el-switch
          v-hasPermi="['advertising:serviceFee:status']"
          v-model="scope.row.enabled"
          @change="watchChange(scope.row)"
          class="customSwitchStyle"
          active-color="#00A854"
          active-text="已开启"
          inactive-color="#F04134"
          inactive-text="已禁用"
          />
      </template>
    </el-table-column>

    <el-table-column
        prop="tickCode"
        label="操作">
        <template scope="scope">
          <el-button v-hasPermi="['advertising:serviceFee:storage']" v-show="!scope.row.enabled" type="text" @click="addOrEditClick('edit', scope.row)">编辑</el-button>
          <el-button v-hasPermi="['advertising:serviceFee:delete']" v-show="!scope.row.enabled" type="text" @click="delectClick(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    

  </el-table>
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

    

<el-dialog
  :title="curActType == 'add' ? '新增' : '编辑'"
  :visible.sync="dialogVisible"
  width="30%">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
      <el-form-item label="合伙人服务费">
        <el-select v-model="ruleForm.adslistMapSelected" placeholder="请选择">
            <el-option
              v-for="item in adslistMap"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="合伙人服务费" prop="day1">
        <el-input-number :min="0" v-model="ruleForm.day1" :precision="6" :step="1" controls-position="right"></el-input-number><span class="mmUnit">Candy</span>
      </el-form-item>
      <el-form-item label="团长服务费" prop="day2">
        <el-input-number :min="0" v-model="ruleForm.day2" :precision="6" :step="1" controls-position="right"></el-input-number><span class="mmUnit">Candy</span>
      </el-form-item>
      <el-form-item label="高级服务费" prop="day3">
        <el-input-number :min="0" v-model="ruleForm.day3" :precision="6" :step="1" controls-position="right"></el-input-number><span class="mmUnit">Candy</span>
      </el-form-item>
      <el-form-item label="是否启用" prop="qijinyong1">
          <el-switch v-model="ruleForm.qijinyong1"></el-switch>
        </el-form-item>

        <p style="color:#817d7d;margin-left:145px;font-size:13px;margin-bottom:30px;">* 服务费是按次收取，只向出售方收取，即用户出售或广告商发布卖单</p>
          <el-form-item>
          <el-button v-hasPermi="['advertising:treasure:saveorupdate']" type="primary" @click="submitForm('ruleForm')">保存</el-button>
        </el-form-item>
    </el-form>
</el-dialog>

      

  </div>
</template>

<script>
import { ggb_serviceFeeSetNew_list, ggb_serviceFeeSetNew_alter, ggb_serviceFeeSetNew_status, ggb_serviceFeeSetNew_del, atNameLists } from "@/api/adsTreasure";
  export default {
    components: {},
    data () {
      var validateday1 = (rule, value, callback) => {
        if (value === '' || value === undefined) {
          callback(new Error('请输入'));
        }
        callback()
      };
      var validateday2 = (rule, value, callback) => {
        if (value === '' || value === undefined) {
          callback(new Error('请输入'));
        }
        callback()
      };
      var validateday3 = (rule, value, callback) => {
        if (value === '' || value === undefined) {
          callback(new Error('请输入'));
        }
        callback()
      };
      return {
        tableData: [],
        loading: false,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        adslistMap: [],
        dialogVisible: false,
        curActType: null,
        isId: null,
        ruleForm: {
          adslistMapSelected: '',
          day1: '',
          day2: '',
          day3: '',
          qijinyong1: false,
        },
        rules: {
          day1: [
            { validator: validateday1, trigger: 'blur' }
          ],
          day2: [
            { validator: validateday2, trigger: 'blur' }
          ],
          day3: [
            { validator: validateday3, trigger: 'blur' }
          ],
        }
      }
    },
    created () {
      atNameLists().then(response => {
        if (response.code == 200) {
          this.adslistMap = response.data.list || []
        } else {
          this.adslistMap = []
        }
      })
    },
    mounted () {
      this.isAuth.isPermi(['advertising:serviceFee:list']) && this.search(1)
    },
    watch: {},
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let _params = {
                partnerAmount: this.ruleForm.day1,
                vpAmount: this.ruleForm.day2,
                svpAmount: this.ruleForm.day3,
                enabled: this.ruleForm.qijinyong1,
                id: this.isId,
                propId: this.ruleForm.adslistMapSelected
              }
              console.log('A0', _params)
            if (this.curActType == 'add') Reflect.deleteProperty(_params, 'id')
            ggb_serviceFeeSetNew_alter(_params).then(response => {
              if (+response.code === 200) {
                this.msgSuccess(`操作成功`)
                this.isAuth.isPermi(['advertising:serviceFee:list']) && this.search(1)
              } else {
                this.$message.error(response.message)
              }
              this.dialogVisible = false
            })
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      sortChange ({column, prop, order}) {
        this.queryParams.orderItems = [{ asc: order === 'ascending', column: prop.replace(/([A-Z])/g, '_$1').toLowerCase() }]
        this.isAuth.isPermi(['advertising:serviceFee:list']) && this.search(1)
      },
      search (pgi) {
        if (pgi) this.pageIndex = pgi
        let _params = {
          currentPage: this.pageIndex,
          pageSize: this.pageSize,
        }
        this.loading = true
        ggb_serviceFeeSetNew_list(_params).then(response => {
          if (response.code === 200) {
            this.tableData = response.data.list
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
          this.loading = false
        })
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.isAuth.isPermi(['advertising:serviceFee:list']) && this.search()
      },
      addOrEditClick (type, row) {
        this.dialogVisible = true
        this.curActType = type
        if (type == 'add') {
          this.ruleForm = {
            adslistMapSelected: '',
            day1: '',
            day2: '',
            day3: '',
            qijinyong1: false,
          }
          this.isId = ''
        } else {
          this.ruleForm = {
            adslistMapSelected: row.propId + '',
            day1: row.partnerAmount,
            day2: row.vpAmount,
            day3: row.svpAmount,
            qijinyong1: row.enabled,
          }
          this.isId = row.id
        }
      },
      delectClick (row) {
        this.$confirm(`确认要执行此操作吗？`, '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ggb_serviceFeeSetNew_del({
            id: row.id
          }).then(response => {
            if (response.code == 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                'duration': 1000,
                onClose: () => {
                  this.search(1)
                }
              })
            } else {
              this.$message.error(response.message)
            }
          })
        })
      },
      watchChange (val) {
        this.$confirm(`确认要执行此操作吗？`, '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _params = {}
          _params.id = val.id
          _params.enabled = val.enabled
          ggb_serviceFeeSetNew_status(_params).then(response => {
            if (response.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                'duration': 1000,
                onClose: () => {
                  this.isAuth.isPermi(['lottery:task:list']) && this.search()
                }
              })
            } else {
              val.enabled = !val.enabled
              this.$message.error(response.message)
            }
          }).catch(({ error }) => {
            val.enabled = !val.enabled
            if (error) this.$message.error(error.message)
          })
        }).catch((e) => {
          val.enabled = !val.enabled
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
.mmUnit{
  padding:0 10px;color:#817d7d;
}
</style>

