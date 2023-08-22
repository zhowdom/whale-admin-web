<template>
  <div class="redBackDetailsBox">
    <el-form :model="queryParams" :rules="rules" ref="queryForm" :inline="true">

      <el-form-item label="月份">
        <el-date-picker
          v-model="queryParams.yearMonth"
          type="month"
          placeholder="选择月">
        </el-date-picker>
      </el-form-item>

    
      <!-- <el-form-item label="真实姓名" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="输入真实姓名"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item> -->

    <!-- <el-form-item label="币种类型">
      <el-select v-model="queryParams.coinName" placeholder="请选择" clearable>
        <el-option v-for="(item, index) in daiCoinSettingArr" :label="item" :value="item" :key="index"></el-option>
      </el-select>
    </el-form-item> -->


      <el-form-item>
        <el-button v-hasPermi="['internal:feeBonus:setting:page']" type="primary" :loading="loading" icon="el-icon-search" @click="search(1)">查询</el-button>
        <el-button v-hasPermi="['internal:feeBonus:setting:add']" type="primary" :loading="loading" icon="el-icon-plus" @click="addClick">增加</el-button>
      </el-form-item>
    </el-form>
     <p style="font-size:13px;color:rgb(115, 112, 112);">注：等级高用户，可同时分等级低配置的比较 ；
       如是5星达人，则可分1星，2星，3星，4星，5星配置的比例 
       统计的人数 ，1 位5星达人， 则1星，2星，3星，4星，5星各增加1人</p>

    <el-table
    :data="tableData"
    v-loading="loading"
    border
    style="width: 100%">
    <el-table-column
      prop="validMonth"
      label="生效月份"
      align="center">
    </el-table-column>
    <el-table-column
      prop="feeTypesDesc"
      label="分红手续费来源"
      align="center">
    </el-table-column>
    <el-table-column
      prop="coinsDesc"
      label="分红手续费币种"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      label="星级达人分红总拔比"
      width="120"
      align="center">
      <template scope="scope">
        <span v-if="scope.row.totalRate">{{scope.row.totalRate * 100}}%</span>
      </template>
    </el-table-column>
    <el-table-column
      label="一星达人分红比例"
      align="center">
      <template scope="scope">
        <span v-if="scope.row.levelRates">{{scope.row.levelRates[0] * 100}}%</span>
      </template>
    </el-table-column>
    <el-table-column
      label="二星达人分红比例"
      align="center">
      <template scope="scope">
        <span v-if="scope.row.levelRates">{{scope.row.levelRates[1] * 100}}%</span>
      </template>
    </el-table-column>
    <el-table-column
      label="三星达人分红比例"
      align="center">
      <template scope="scope">
        <span v-if="scope.row.levelRates">{{scope.row.levelRates[2] * 100}}%</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="nodeShare"
      label="四星达人分红比例"
      align="center">
      <template scope="scope">
        <span v-if="scope.row.levelRates">{{scope.row.levelRates[3] * 100}}%</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="nodeShare"
      label="五星达人分红比例"
      align="center">
      <template scope="scope">
        <span v-if="scope.row.levelRates">{{scope.row.levelRates[4] * 100}}%</span>
      </template>
    </el-table-column>
    <el-table-column
        header-align="center"
        align="center"
        width="139"
        prop="statusType"
        label="状态">

        <template scope="scope">
          <el-switch
          v-hasPermi="['integral:task_node:statusChange']"
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
        width="159"
        label="操作"
        align="center">
        <template scope="scope">
          <el-button v-hasPermi="['internal:feeBonus:setting:update']" type="text" @click="alterClick(scope.row)" v-if="!scope.row.statusType">编辑</el-button>
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

  <!--新增｜编辑-->
  <el-dialog
    title="星级达人分红配置"
    :visible.sync="dialogVisible"
    width="50%">
      <el-dialog
        width="89%"
        title="引用星级达人分红配置"
        :visible.sync="innerVisible"
        append-to-body>
        <cp v-if="innerVisible" @bridgeFn="bridgeFnParent" :bonusType="2" />
      </el-dialog>
    <el-form label-width="160px" style="position:relative;">
      <el-button type="primary" @click="refsClick" style="right:0;position:absolute;z-index:10;">引用</el-button>
      <el-form-item label="生效月份">
        <el-date-picker
          v-model="submitForm.yearMonth"
          @change="handleChangeDate"
          style="width:50%;"
          type="month"
          placeholder="选择月">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="计算分红手续费来源">
        <el-select
          v-model="submitForm.feeTypes"
          multiple
          filterable
          default-first-option
          style="width:90%;"
          placeholder="请选择分红手续费来源">
          <el-option
            v-for="item in originFeeArr"
            :key="item.type"
            :label="item.desc"
            :value="item.type">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手续费分红币种">
        <el-select
          v-model="submitForm.coins"
          multiple
          filterable
          default-first-option
          style="width:90%;"
          placeholder="请选择手续费分红币种">
          <el-option
            v-for="item in daiCoinSettingArr"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="星级达人分红总拔比"><el-input-number @blur="((ev) => handleBlur(ev, 'totalRate'))" v-model="submitForm.totalRate" :precision="2" :step="1" :max="100" :min="0.01" controls-position="right" style="width:50%;"></el-input-number><span style="padding-left:10px;">%</span></el-form-item>
      <el-form-item label="一星达人分红比例"><el-input-number @blur="((ev) => handleBlur(ev, 'levelRates', 0))" v-model="submitForm.levelRates[0]" :precision="2" :step="1" :max="100" :min="0.01" controls-position="right" style="width:50%;"></el-input-number><span style="padding-left:10px;">%</span></el-form-item>
      <el-form-item label="二星达人分红比例"><el-input-number @blur="((ev) => handleBlur(ev, 'levelRates', 1))" v-model="submitForm.levelRates[1]" :precision="2" :step="1" :max="100" :min="0.01" controls-position="right" style="width:50%;"></el-input-number><span style="padding-left:10px;">%</span></el-form-item>
      <el-form-item label="三星达人分红比例"><el-input-number @blur="((ev) => handleBlur(ev, 'levelRates', 2))" v-model="submitForm.levelRates[2]" :precision="2" :step="1" :max="100" :min="0.01" controls-position="right" style="width:50%;"></el-input-number><span style="padding-left:10px;">%</span></el-form-item>
      <el-form-item label="四星达人分红比例"><el-input-number @blur="((ev) => handleBlur(ev, 'levelRates', 3))" v-model="submitForm.levelRates[3]" :precision="2" :step="1" :max="100" :min="0.01" controls-position="right" style="width:50%;"></el-input-number><span style="padding-left:10px;">%</span></el-form-item>
      <el-form-item label="五星达人分红比例"><el-input-number @blur="((ev) => handleBlur(ev, 'levelRates', 4))" v-model="submitForm.levelRates[4]" :precision="2" :step="1" :max="100" :min="0.01" controls-position="right" style="width:50%;"></el-input-number><span style="padding-left:10px;">%</span></el-form-item>
      <div style="font-size:13px;color: rgb(115 112 112);padding:10px;">
        注：<br>
        1. 每个月份，在列表上可以存在多条，但计算【同一月份，每个币种】只能存在一条，无论为【禁用】还是【启用】状态；<br>
        2. 引用，可引用列表上的数据;<br>
        3. 星级达人分红总拔比，以所勾选来源的手续费汇总为基数;<br>
        4. 各级星级达人比例，以星级达人分红为100%基准，各星级达人配置比例，总和不得大于1；<br>
        5. 【相同来源的手续费汇总】 配置总拔比，星级达人分红总拔比和星级达人总拔比，比例之和不得大于1 ；<br>
        6.未配置或未启用，则不作分红处理；<br>
        7. 取结算日前的配置，故在结算前配置且启用后均生效 ；结算日之后配置的，则不生效。<br>

        8.例：假设<br>
        （1）勾选【区块链转账】【平台内部转账】9月份的手续费为 1000 USDT, 800 Candy<br>
        （2）勾选【币种】USDT<br>
        （3）星级达人总拔比 20% ，一星达人分红比例30%，二星达人分红比例30%，三星达人分红比例30%，四星达人分红比例5%，五星达人分红比例5%<br>
        （4）一星达人2 人，二星达人2 人，三星达人2 人，四星达人 0 人，五星达人 0 人计算<br>
        （1）9 月份只勾选 USDT ，则9 月份星级达人手续费只能分USDT，10月1号00:00 发放<br>
        （2)  星级达人总分红 = 分红手续费 × 星级达人分红总拔比 = 1000 × 20% = 200 USDT<br>
        (3) 一星达人分红 = 星级达人总分红 × 一级星级达人分红比例 = 200 × 30% ÷ 2  =30 USDT<br>
            二星达人分红 = 星级达人总分红 × 二级星级达人分红比例 = 200 × 30%÷ 2 =30 USDT<br>
            三星达人分红 = 星级达人总分红 × 三级星级达人分红比例 = 200 × 30%÷ 2 =30 USDT<br>
            四星达人分红 = 星级达人总分红 × 国际星级达人分红比例 = 200 × 5%÷ 0 =0 USDT  （四星达人没有人，则此部分分红不分出）<br>
            五星达人分红 = 星级达人总分红 × 国际星级达人分红比例 = 200 × 5%÷ 0 =0 USDT  （五星达人没有人，则此部分分红不分出）<br>
      </div>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveClick" :loading="saveLoading">确 定</el-button>
    </span>
  </el-dialog>



  </div>
</template>

<script>
import { daiCoinSettingList } from "@/api/xhgjSpark_api/daiCoinSetting.js";
import { mmfee_monthQuery, mmfee_originQuery, mmfee_totalQuery, mmStartPoint_settingQuery, mmStartPoint_feeTypeQuery, mmStartPoint_profitQuery, mmStartPoint_profitDetail, mmStartPoint_add, mmStartPoint_alter } from "@/api/serviceCharge";
import { stamp_to_dateTimeStr, dateTimeStr_to_Stamp, dateTimeStr_to_DateObj} from "@/utils/formatDate";
import cp from '../commonComp.vue'
  export default {
    components: {
      cp
    },
    data () {
      var validatePhone = (rule, value, callback) => {
        if (!(/^1[3456789]\d{9}$/.test(value)) && value !== '') {
          return callback(new Error('请输入正确的手机号码'))
        }
        callback()
      }
      return {
        saveLoading: false,
        innerVisible: false,
        originFeeArr: [],
        submitForm: {
          yearMonth: new Date(),
          year: '',
          month: '',
          coins: [],
          feeTypes: [],
          levelRates: [0.01, 0.01, 0.01, 0.01, 0.01],
          totalRate: 0.01,
          statusType: 1, // 状态 0-关闭 1-开启
          id: null,
          bonusType: 2 // 1-星级达人分红、2-星级达人
        },
        dialogVisible: false,
        rules: {
          phone: [
            { validator: validatePhone, trigger: 'blur' }
          ]
        },
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        queryParams: {
          yearMonth: new Date(),
          // userName: '',
          coinName: '',
          month: '',
          year: '',
        },
        tableData: [],
        loading: false,
        cloneRowData: {},
        daiCoinSettingArr: [], //代币列表
        curActionType: '',
      }
    },
    filters: {
      valTransfer (val) {
        if (val === null || val === '') {
          return '-'
        } else {
          return `${((val * 100).toFixed(2) + '').replace(/(?:\.0*|(\.\d+?)0+)$/, '$1')}%`
        }
      }
    },
    created () {
      this.daiCoinSettingList();
      this.mmStartPoint_feeTypeQueryRun();
    },
    mounted () {
      this.search(1)
    },
    watch: {},
    methods: {
      handleChangeDate (v) {
        console.log(v)
      },
      bridgeFnParent (val) {
        this.submitForm = {
          yearMonth: dateTimeStr_to_DateObj(val.validMonth),
          year: val.validMonth.split('-')[0],
          month: val.validMonth.split('-')[1],
          coins: val.coins,
          feeTypes: val.feeTypes,
          levelRates: val.levelRates.map(v => v*100),
          totalRate: val.totalRate*100,
          statusType: val.statusType,
          id: val.id,
          bonusType: 2
        }
        this.innerVisible = false
      },
      refsClick () {
        this.innerVisible = true
      },
      handleBlur (ev, prop, index) {
        if (ev.target.ariaValueNow === 'undefined') {
          if (index >= 0) {
            this.submitForm[`${prop}`][index] = ev.target.value = ev.target.ariaValueMin
          } else {
            this.submitForm[`${prop}`] = ev.target.value = ev.target.ariaValueMin
          }
        }
      },
      saveClick () {
        let _api = this.curActionType == 'add' ? mmStartPoint_add : mmStartPoint_alter
        if (!this.complexYearMonthFormat(this.submitForm)) return false
        if (this.submitForm.feeTypes.length <= 0) {
          this.$message.error('请选择分红手续费来源')
          return false
        }
        else if (this.submitForm.coins.length <= 0) {
          this.$message.error('请选择手续费分红币种')
          return false
        }
        this.saveLoading = true
        _api({
          bonusType: this.submitForm?.bonusType,
          coins: this.submitForm?.coins,
          feeTypes: this.submitForm?.feeTypes,
          id: this.submitForm?.id,
          levelRates: (this.submitForm?.levelRates || []).map(v => (v/100).toFixed(4)),
          month: this.submitForm?.month,
          statusType: this.submitForm?.statusType,
          totalRate: (this.submitForm?.totalRate/100).toFixed(4),
          year: this.submitForm?.year
        }).then(response => {
          if (response.code == 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              'duration': 1000,
              onClose: () => {
                this.saveLoading = false
                this.dialogVisible = false
                this.search(1)
              }
            })
          } else {
            this.saveLoading = false
            this.$message.error(response.message)
          }
        }).catch(e => {
          this.saveLoading = false
          this.$message.error(e)
        })
      },
      addClick () {
        this.curActionType = 'add'
        this.dialogVisible = true
        this.submitForm = {
          yearMonth: new Date(),
          year: '',
          month: '',
          coins: [],
          feeTypes: [],
          levelRates: [0.01, 0.01, 0.01, 0.01, 0.01],
          totalRate: 0.01,
          statusType: 1,
          id: null,
          bonusType: 2
        }
      },
      alterClick (row) {
        this.curActionType = 'alter'
        this.dialogVisible = true
        this.submitForm = {
          yearMonth: dateTimeStr_to_DateObj(row.validMonth),
          year: row.validMonth.split('-')[0],
          month: row.validMonth.split('-')[1],
          coins: row.coins,
          feeTypes: row.feeTypes,
          levelRates: row.levelRates.map(_ => _*100),
          totalRate: row.totalRate*100,
          statusType: row.statusType,
          id: row.id,
          bonusType: 2
        }
      },
      watchChange (row) {
        this.$confirm(`确认要执行此操作吗？`, '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.submitForm = {
            yearMonth: dateTimeStr_to_DateObj(row.validMonth),
            year: row.validMonth.split('-')[0],
            month: row.validMonth.split('-')[1],
            coins: row.coins,
            feeTypes: row.feeTypes,
            levelRates: row.levelRates,
            totalRate: row.totalRate,
            statusType: row.statusTypeBoolean ? 1 : 0,
            id: row.id,
            bonusType: 2
          }
          mmStartPoint_alter(this.submitForm).then(response => {
            if (response.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                'duration': 1000,
                onClose: () => {
                  this.search(1)
                }
              })
            } else {
              row.statusTypeBoolean = !row.statusTypeBoolean
              this.$message.error(response.message)
            }
          }).catch(({ error }) => {
            row.statusTypeBoolean = !row.statusTypeBoolean
            if (error) this.$message.error(error.message)
          })
        }).catch(() => {
          row.statusTypeBoolean = !row.statusTypeBoolean
        })
      },
      daiCoinSettingList() {
        daiCoinSettingList({}).then((response) => {
          if (response.code === 200) {
            this.daiCoinSettingArr = JSON.parse(JSON.stringify(response.data));
          } else {
            this.daiCoinSettingArr = [];
            this.$message.error(response.message);
          }
        });
      },
      mmStartPoint_feeTypeQueryRun() {
        mmStartPoint_feeTypeQuery({}).then((response) => {
          if (response.code === 200) {
            this.originFeeArr = JSON.parse(JSON.stringify(response.data));
          } else {
            this.originFeeArr = [];
            this.$message.error(response.message);
          }
        });
      },
      complexYearMonthFormat (o) {
        if (o['yearMonth']) {
          o['year'] = this.$dayjs(o['yearMonth']).format('YYYY-MM').split('-')[0]
          o['month'] = this.$dayjs(o['yearMonth']).format('YYYY-MM').split('-')[1]
          return true
        } else {
          this.$message.error('请选择日期')
          return false
        }
      },
      search (pgi) {
        this.$refs['queryForm'].validate((valid) => {
          if (valid) {
            if (pgi) this.pageIndex = this.pageIndex
            if (!this.complexYearMonthFormat(this.queryParams)) return false
            let _params = {
              bonusType: 2,
              currentPage: this.pageIndex,
              pageSize: this.pageSize,
              ...this.queryParams,
            }
            this.loading = true
            mmStartPoint_settingQuery(_params).then(response => {
              if (response.code === 200) {
                this.tableData = (response.data.list || []).map(v => {
                  let {coins, feeTypes, statusType, ...a} = v
                  let feeTypesDesc = []
                  feeTypes.forEach(item => feeTypesDesc.push(this.originFeeArr.find(s => s.type==item)?.desc))
                  return {
                    coins,
                    statusType,
                    feeTypes,
                    coinsDesc: coins.join(';'),
                    feeTypesDesc: feeTypesDesc.join(';'),
                    statusTypeBoolean: statusType == 1,
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
            }).catch( e => {
              this.loading = false
            })
          }
        })
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.search()
      }
    }
  }
</script>

<style lang="scss">
.redBackDetailsBox{
  padding: 20px;
}
</style>
