<template>
  <div class="seeInfosEachissueBox">


    <el-form :model="nLevelqueryParams" :rules="nLevelrules" ref="nLevelqueryForm" :inline="true">
      <!-- <el-form-item label="用户ID" prop="memberId">
        <el-input
          v-model.trim="nLevelqueryParams.memberId"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 100px"
        />
      </el-form-item>
      <el-form-item label="真实姓名" prop="realName">
        <el-input
          v-model.trim="nLevelqueryParams.realName"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 100px"
        />
      </el-form-item> -->
      <el-form-item label="期数" prop="periodsNum">
        <el-input
          v-model.trim="nLevelqueryParams.periodsNum"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 150px"
        />
      </el-form-item>
      <!-- <el-form-item label="时间" prop="redbacktime">
        <el-date-picker
          v-model="nLevelqueryParams.redbacktime"
          type="daterange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item> -->

      <el-form-item>
        <el-button v-hasPermi="['game:lottery:pool:injectPage']" type="primary" :loading="loading" icon="el-icon-search" @click="searchnLevel(1)">查询</el-button>
        <el-button v-hasPermi="['goods:treasure_template:page']" type="primary" :loading="loading" @click="injectInCLick">注入</el-button>
      </el-form-item>
    </el-form>
  <el-table :data="nLevelData">
    <el-table-column property="injectNo" label="编号"></el-table-column>
    <el-table-column property="periodsNum" label="期数"></el-table-column>
    <el-table-column property="num" label="注入数量（Candy）"></el-table-column>
    <el-table-column property="realNum" label="实际注入（Candy）"></el-table-column>
    <el-table-column property="operName" label="操作人"></el-table-column>
    <el-table-column property="createTime" label="时间">
      <template slot-scope="{row}">
          {{row.createTime ? $dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
    </el-table-column>
    <el-table-column property="status" label="状态">
      <template scope="scope">
          <el-switch
          v-hasPermi="['game:lottery:pool:updateStatus']"
          v-model="scope.row.status"
          @change="watchChange(scope.row)"
          class="customSwitchStyle"
          active-color="#00A854"
          active-text="已开启"
          inactive-color="#F04134"
          inactive-text="已禁用"
          />
        </template>
    </el-table-column>
    <el-table-column label="操作">
      <template scope="scope">
        <div v-if="!scope.row.status">
          <el-button type="text" @click="editClick(scope.row)">编辑</el-button>
          <el-button v-hasPermi="['game:lottery:pool:del']" type="text" @click="removeClick(scope.row)">删除</el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    style="padding-top:20px;"
    @current-change="searchnLevel"
    :page-sizes="[10, 20, 30]"
    @size-change="handleSizeChangenLevel"
    :current-page.sync="pageIndexnLevel"
    :page-size="pageSizenLevel"
    layout="total, sizes, prev, pager, next, jumper"
    :total="totalPagenLevel">
    </el-pagination>

<!--注入弹窗-->
<el-dialog title="" :visible.sync="dialogFormVisibleEacissue" width="30%">
  <el-form :model="formEacissue">
    
    
    <el-form-item label="期数" label-width="130px">
      <el-input v-model="formEacissue.periodsNum" autocomplete="off" style="width:200px;"></el-input>
    </el-form-item>
    <el-form-item label="注入金额（Candy）" label-width="130px">
      <el-input-number @blur="((ev)=>{handleBlur(ev, 'whalePeasNum')})" v-model="formEacissue.whalePeasNum" :precision="6" :step="0.1" :min="0.000001" controls-position="right"></el-input-number>
    </el-form-item>
    <!-- <el-form-item label="备注" label-width="120">
      <el-input v-model="formEacissue.remark" autocomplete="off"></el-input>
    </el-form-item> -->
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleEacissue = false">取 消</el-button>
    <el-button v-hasPermi="['game:lottery:pool:inject', 'game:lottery:pool:updateById']" type="primary" @click="injectInCLickRun">确 定</el-button>
  </div>
</el-dialog>


  </div>
</template>

<script>
import { takejewelCodeList, zzJoyPoorCanDivideList, zzJoyPoorEachIssueHandling, zzJoyPoorEachIssueStatusChange, zzJoyPoorEachIssueRowDataEdit, zzJoyPoorEachIssueRowDataDel } from "@/api/games";
  export default {
    components: {},
    data () {
      var validatePhone = (rule, value, callback) => {
        if (!(/^1[3456789]\d{9}$/.test(value)) && value !== '') {
          return callback(new Error('请输入正确的手机号码'))
        }
        callback()
      }
      return {
        dialogFormVisibleEacissue: false,
        formEacissue: {
          periodsNum: '',
          remark: '',
          whalePeasNum: ''
        },
        nLevelrules: {
          phone: [
            { validator: validatePhone, trigger: 'blur' }
          ]
        },
        nLevelqueryParams: {
          code: '',
          name: '',
          phone: '',
          memberId: '',
          realName: '',
          periodsNum: '',
          redbacktime: ''
        },
        nLevelPrizeTitle: '',
        pageIndexnLevel: 1,
        pageSizenLevel: 10,
        totalPagenLevel: 0,
        nLevelData: [],
        nLevelPrizesVisible: false,
        loading: false,
        actType: '',
        clickRowDataID: ''
      }
    },
    mounted () {
      this.isAuth.isPermi(['game:lottery:pool:injectPage']) && this.searchnLevel(1)
    },
    watch: {},
    methods: {
      watchChange (val) {
        this.$confirm(`确认要执行此操作吗？`, '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _params = {}
          _params.id = val.id
          _params.status = val.status ? 1 : 0
          zzJoyPoorEachIssueStatusChange(_params).then(response => {
            if (response.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                'duration': 1000,
                onClose: () => {
                  this.isAuth.isPermi(['game:lottery:pool:injectPage']) && this.searchnLevel(1)
                }
              })
            } else {
              val.status = !val.status
              this.$message.error(response.message)
            }
          }).catch(({ error }) => {
            val.status = !val.status
            if (error) this.$message.error(error.message)
          })
        }).catch(() => {
          val.status = !val.status
        })
      },
      editClick (row) {
        this.dialogFormVisibleEacissue = true
        this.actType = 'edit'
        this.formEacissue = {
          periodsNum: row.periodsNum,
          whalePeasNum: row.num
        }
        this.clickRowDataID = row.id
      },
      removeClick (row) {
        this.$confirm(`确认要执行此操作吗？`, '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          zzJoyPoorEachIssueRowDataDel({
            id: row.id
          }).then((response) => {
            if (+response.code === 200) {
              this.$message({type: 'success', message: '操作成功'})
              this.isAuth.isPermi(['game:lottery:pool:injectPage']) && this.searchnLevel(1)
            } else {
              this.$message.error(response.message)
            }
          })
        }).catch((e) => {})
      },
      injectInCLick () {
        this.dialogFormVisibleEacissue = true
        this.actType = 'add'
        this.formEacissue = {
          periodsNum: '',
          remark: '',
          whalePeasNum: ''
        }
      },
      injectInCLickRun () {
        // periodsNum|whalePeasNum
        if (!this.formEacissue.periodsNum) {
          this.$message.error('期数不能为空')
          return false
        } else if (!this.formEacissue.whalePeasNum) {
          this.$message.error('注入金额不能为空')
          return false
        }
        let _params,
          _api
        if (this.actType === 'add') {
          _params = {
            periodsNum: this.formEacissue.periodsNum,
            // remark: this.formEacissue.periodsNum,
            whalePeasNum: this.formEacissue.whalePeasNum,
            type: 1
          }
          _api = zzJoyPoorEachIssueHandling
        } else {
          _params = {
            id: this.clickRowDataID,
            whalePeasNum: this.formEacissue.whalePeasNum,
          }
          _api = zzJoyPoorEachIssueRowDataEdit
        }
        
        _api(_params).then(response => {
          if (+response.code === 200) {
            this.$message.success(response.message)
            this.dialogFormVisibleEacissue = false
            this.isAuth.isPermi(['game:lottery:pool:injectPage']) && this.searchnLevel(1)
          } else {
            this.$message.error(response.message)
          }
        })
        
      },
      nLevelPrizeInfosClick (row) {
        this.nLevelPrizesVisible = true
        this.nLevelPrizeTitle = '二等奖管理（期数：200902）'
      },
      searchnLevel (pgi) {
        this.$refs['nLevelqueryForm'].validate((valid) => {
          if (valid) {
            // todo...
            if (pgi) this.pageIndexnLevel = pgi

            let datetime = []
            datetime = this.nLevelqueryParams.redbacktime
            let _params = {
              periodsNum: this.nLevelqueryParams.periodsNum,
              type: 1,
              // endTime: datetime ? this.$dayjs(datetime[1]).format('YYYY-MM-DD') : '',
              // startTime: datetime ? this.$dayjs(datetime[0]).format('YYYY-MM-DD') : '',
              currentPage: this.pageIndexnLevel,
              pageSize: this.pageSizenLevel,
            }
            this.loading = true
            
            zzJoyPoorCanDivideList(_params).then(response => {
              if (response.code === 200) {
                this.nLevelData = response.data.list.map(v => {
                  let {status, ...a} = v
                  return {
                    status: +status === 1,
                    ...a
                  }
                })
                this.totalPagenLevel = response.data.total
                this.loading = false
              } else {
                this.nLevelData = []
                this.totalPagenLevel = 0
                this.pageSizenLevel = 10
                this.loading = false
                this.$message.error(response.message)
              }
            }).catch(e => {
              this.loading = false
            })
          }
        })
      },
      handleSizeChangenLevel (val) {
        this.pageSizenLevel = val
        this.pageIndexnLevel = 1
        this.isAuth.isPermi(['game:lottery:pool:injectPage']) && this.searchnLevel()
      },
      handleBlur (ev, prop) {
        // blur后若输入内容为空，处理为显示对应特权类型的最小默认值
        if (ev.target.ariaValueNow === 'undefined') {
          this.formEacissue.whalePeasNum = ev.target.value = ev.target.ariaValueMin
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
.seeInfosEachissueBox{}
</style>

