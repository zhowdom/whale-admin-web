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
      <!-- <el-form-item label="期数" prop="periodsNum">
        <el-input
          v-model.trim="nLevelqueryParams.periodsNum"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 150px"
        />
      </el-form-item> -->
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
        <!-- <el-button v-hasPermi="['game:lottery:pool:injectPage']" type="primary" :loading="loading" icon="el-icon-search" @click="searchnLevel(1)">查询</el-button> -->
        <el-button v-hasPermi="['goods:treasure_template:page']" type="primary" :loading="loading" @click="injectInCLick">注入</el-button>
      </el-form-item>
    </el-form>
  <el-table :data="nLevelData">
    <el-table-column property="injectNo" label="编号"></el-table-column>
    <el-table-column property="num" label="注入数量（Candy）"></el-table-column>
    <el-table-column property="remark" label="备注"></el-table-column>
    <el-table-column property="operName" label="操作人"></el-table-column>
    <el-table-column property="createTime" label="时间">
      <template slot-scope="{row}">
        {{row.createTime ? $dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
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
    
    
    <!-- <el-form-item label="期数" label-width="120">
      <el-input v-model="formEacissue.periodsNum" autocomplete="off"></el-input>
    </el-form-item> -->
    <el-form-item label="注入金额（Candy）" label-width="130px">
      <el-input-number @blur="((ev)=>{handleBlur(ev, 'whalePeasNum')})" v-model="formEacissue.whalePeasNum" :precision="6" :step="0.1" :min="0.000001" controls-position="right"></el-input-number>
    </el-form-item>
    <el-form-item label="备注" label-width="130px">
      <el-input v-model="formEacissue.remark" autocomplete="off" style="width:200px;"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleEacissue = false">取 消</el-button>
    <el-button v-hasPermi="['game:lottery:pool:inject']" type="primary" @click="injectInCLickRun">确 定</el-button>
  </div>
</el-dialog>


  </div>
</template>

<script>
import { takejewelCodeList, zzJoyPoorCanDivideList, zzJoyPoorEachIssueHandling } from "@/api/games";
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
      }
    },
    mounted () {
      this.isAuth.isPermi(['game:lottery:pool:injectPage']) && this.searchnLevel(1)
    },
    watch: {},
    methods: {
      injectInCLick () {
        this.dialogFormVisibleEacissue = true
        this.formEacissue = {
          periodsNum: '',
          remark: '',
          whalePeasNum: ''
        }
      },
      injectInCLickRun () {
        if (!this.formEacissue.whalePeasNum) {
          this.$message.error('注入金额不能为空')
          return false
        }
        let _params = {
          // periodsNum: this.formEacissue.periodsNum,
          remark: this.formEacissue.remark,
          whalePeasNum: this.formEacissue.whalePeasNum,
          type: 0
        }
        zzJoyPoorEachIssueHandling(_params).then(response => {
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
              type: 0,
              // endTime: datetime ? this.$dayjs(datetime[1]).format('YYYY-MM-DD') : '',
              // startTime: datetime ? this.$dayjs(datetime[0]).format('YYYY-MM-DD') : '',
              currentPage: this.pageIndexnLevel,
              pageSize: this.pageSizenLevel,
            }
            this.loading = true
            zzJoyPoorCanDivideList(_params).then(response => {
              if (response.code === 200) {
                this.nLevelData = response.data.list
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

