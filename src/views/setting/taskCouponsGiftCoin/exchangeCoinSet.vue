<template>
  <div class="shareAddManagebox" style="padding:20px;">

      <el-button v-hasPermi="['advertising:serviceFee:storage']" icon="el-icon-plus" type="primary" @click="addOrEditClick('add')">新增</el-button>

      <el-table
    :data="tableData"
    @sort-change="sortChange"
    v-loading="loading"
    border
    style="width: 100%;margin-top:30px;">
    
   
    <el-table-column
      prop="_taskName"
      label="任务券名称"
      align="center"></el-table-column>
    
     <el-table-column
      prop="_coinsInfo"
      label="赠送币种"
      align="center"></el-table-column>

    <el-table-column
      label="状态"
      align="center">
      <template scope="scope">
        <el-switch
          v-hasPermi="['advertising:serviceFee:status']"
          v-model="scope.row.statusTypeBoolean"
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
  <!-- <el-pagination
  style="float:right;padding-top:20px;"
  @current-change="search"
  :page-sizes="[10, 20, 30]"
  @size-change="handleSizeChange"
  :current-page.sync="pageIndex"
  :page-size="pageSize"
  layout="total, sizes, prev, pager, next, jumper"
  :total="totalPage">
  </el-pagination> -->

    

<el-dialog
  :title="curActType == 'add' ? '新增' : '编辑'"
  :visible.sync="dialogVisible"
  v-if="dialogVisible"
  width="60%">
  <comsp :queryParentList="search" @close_comsp="close_comspHandle" :rowDate="curRowData" />
</el-dialog>

      

  </div>
</template>

<script>
import { ggb_serviceFeeSetNew_list, ggb_serviceFeeSetNew_alter, ggb_serviceFeeSetNew_status, ggb_serviceFeeSetNew_del, atNameLists } from "@/api/adsTreasure";
import { taskGiveCoupsMapslist } from "@/api/games";
import { daiCoinSettingList, taskCouponsGiftCoin_list, taskCouponsGiftCoin_add, taskCouponsGiftCoin_alter, taskCouponsGiftCoin_del} from "@/api/xhgjSpark_api/daiCoinSetting.js";
import comsp from './compos.vue';
  export default {
    components: {
      comsp
    },
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
        curRowData: null,
        tableData: [],
        loading: false,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        adslistMap: [],
        coinMaps: [],
        dialogVisible: false,
        curActType: null,
        isId: null,
        ruleForm: {
          adslistMapSelected: '',
          coinSelected: '',
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
    created () {},
    async mounted () {
      await this.taskGiveCoupsMapslistQuery()
      this.isAuth.isPermi(['advertising:serviceFee:list']) && this.search(1)
    },
    watch: {},
    methods: {
      taskGiveCoupsMapslistQuery () {
        return new Promise(resolve => {
          taskGiveCoupsMapslist().then(response => {
            if (response.code == 200) {
              this.adslistMap = response.data.list || []
            } else {
              this.adslistMap = []
            }
            resolve(this.adslistMap)
          })
        })
      },
      close_comspHandle (boolean) {
        this.dialogVisible = boolean
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
        taskCouponsGiftCoin_list(_params).then(response => {
          if (response.code === 200) {
            this.tableData = (response.data.list || []).map((val, index) => {
              let {taskInfoId, coinsInfo, statusType, ...a} = val
              let _taskName = this.adslistMap.find(v => v.id == taskInfoId).taskName
              let _coinsInfo = coinsInfo.filter(v => v.enabled).map(v => `${v.amount} ${v.coinName} - ${v.lock?'锁仓':'可用'}`).join('，')
              let statusTypeBoolean = +statusType == 1
              return {
                taskInfoId,
                coinsInfo,
                _taskName,
                _coinsInfo,
                statusTypeBoolean,
                statusType,
                ...a
              }
            })
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
        this.curRowData = row ? JSON.parse(JSON.stringify(row)) : null
      },
      delectClick (row) {
        this.$confirm(`确认要执行此操作吗？`, '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          taskCouponsGiftCoin_del({
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
          let _params = JSON.parse(JSON.stringify(val))
          taskCouponsGiftCoin_alter({
            coinsInfo: _params.coinsInfo,
            statusType: _params.statusTypeBoolean ? 1 : 0,
            taskInfoId: _params.taskInfoId,
            id: _params.id
          }).then(response => {
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
              val.statusTypeBoolean = !val.statusTypeBoolean
              this.$message.error(response.message)
            }
          }).catch(({ error }) => {
            val.statusTypeBoolean = !val.statusTypeBoolean
            if (error) this.$message.error(error.message)
          })
        }).catch((e) => {
          console.log(e)
          val.statusTypeBoolean = !val.statusTypeBoolean
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

