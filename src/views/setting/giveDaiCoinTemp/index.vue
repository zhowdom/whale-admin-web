<template>
  <div class="shareAddManagebox" style="padding:20px;">

      <el-button v-hasPermi="['wallet:coin_award_setting:add']" icon="el-icon-plus" type="primary" @click="addOrEditClick('add')">新增</el-button>

      <el-table
    :data="tableData"
    v-loading="loading"
    border
    style="width: 100%;margin-top:30px;">
    
   
    <el-table-column
      prop="name"
      label="任务券名称"
      align="center"></el-table-column>

      <el-table-column
      label="计算方式"
      align="center">
      <template scope="scope">
        <p>{{scope.row.calculateType == 1 ? '固定数量' : '汇率计算'}}</p>
      </template>
      </el-table-column>
    
     <el-table-column
      prop="coinAwardInfoDESC"
      label="赠送币种"
      align="center"></el-table-column>

    <el-table-column
        prop="tickCode"
        width="120px"
        label="操作">
        <template scope="scope">
          <el-button v-hasPermi="['wallet:coin_award_setting:edit']" v-show="!scope.row.enabled" type="text" @click="addOrEditClick('edit', scope.row)">编辑</el-button>
          <!-- <el-button v-hasPermi="['wallet:coin_award_setting:delete']" v-show="!scope.row.enabled" type="text" @click="delectClick(scope.row)">删除</el-button> -->
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
  v-if="dialogVisible"
  width="60%">
  <comsp :queryParentList="search" @close_comsp="close_comspHandle" :rowDate="curRowData" />
</el-dialog>

      

  </div>
</template>

<script>
import { taskGiveCoupsMapslist } from "@/api/games";
import { giveDaiCoinTemp_list, giveDaiCoinTemp_del} from "@/api/xhgjSpark_api/daiCoinSetting.js";
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
      this.isAuth.isPermi(['wallet:coin_award_setting:page']) && this.search(1)
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
      search (pgi) {
        if (pgi) this.pageIndex = pgi
        let _params = {
          currentPage: this.pageIndex,
          pageSize: this.pageSize,
        }
        this.loading = true
        giveDaiCoinTemp_list(_params).then(response => {
          if (response.code === 200) {
            this.tableData = (response.data.list || []).map(val => {
              let {coinAwardInfo, ...a} = val
              let coinAwardInfoDESC = []
              for (let [k, s] of Object.entries(coinAwardInfo)) {
                if (s.enable) coinAwardInfoDESC.push(`${s.coinValue == 0 ? '' : s.coinValue} ${s.coinName} - ${s.coinType == 1 ? '锁仓' : '可用'}`)
              }
              return {
                coinAwardInfo,
                coinAwardInfoDESC: coinAwardInfoDESC.join(),
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
          console.log(e)
          this.loading = false
        })
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.isAuth.isPermi(['wallet:coin_award_setting:page']) && this.search()
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
          giveDaiCoinTemp_del({
            id: row.id
          }).then(response => {
            if (response.code == 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                'duration': 1000,
                onClose: () => {
                  this.isAuth.isPermi(['wallet:coin_award_setting:page']) && this.search(1)
                }
              })
            } else {
              this.$message.error(response.message)
            }
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.mmUnit{
  padding:0 10px;color:#817d7d;
}
</style>

