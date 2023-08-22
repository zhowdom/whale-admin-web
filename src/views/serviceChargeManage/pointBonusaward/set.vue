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
      label="节点分红总拔比"
      width="120"
      align="center">
      <template scope="scope">
        <span v-if="scope.row.totalRate">{{scope.row.totalRate * 100}}%</span>
      </template>
    </el-table-column>
    <el-table-column
      label="节点分红条件"
      width="140"
      align="center">
      <template scope="scope">
        <div v-if="scope.row.shareCondition && scope.row.shareCondition.conditionOn">
          <p>有条件 - 
            <span v-if="scope.row.shareCondition.taskHold">
              进行中糖果包 {{scope.row.shareCondition.taskHold || 0}} Candy;
            </span>
            <span v-if="scope.row.shareCondition.asteriskLevel">
              {{{
              "1":"一星达人",
              "2":"二星达人",
              "3":"三星达人",
              "4":"四星达人",
              "5":"五星达人",
              }[scope.row.shareCondition.asteriskLevel]}}
            </span>
          </p>
        </div>
        <span v-else>无条件</span>
      </template>
    </el-table-column>
    <el-table-column
      label="节点分红方式"
      width="120"
      align="center">
      <template scope="scope">
        <span>{{scope.row.shareType ==1?'独立分红':'平均分红'}}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="一级节点分红比例"
      align="center">
      <template scope="scope">
        <span v-if="scope.row.shareType ==2"> --</span>
        <span v-else-if="scope.row.levelRates">{{scope.row.levelRates[0] * 100}}%</span>
      </template>
    </el-table-column>
    <el-table-column
      label="二级节点分红比例"
      align="center">
      <template scope="scope">
        <span v-if="scope.row.shareType ==2"> --</span>
        <span v-else-if="scope.row.levelRates">{{scope.row.levelRates[1] * 100}}%</span>
      </template>
    </el-table-column>
    <el-table-column
      label="三级节点分红比例"
      align="center">
      <template scope="scope">
        <span v-if="scope.row.shareType ==2"> --</span>
        <span v-else-if="scope.row.levelRates">{{scope.row.levelRates[2] * 100}}%</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="nodeShare"
      label="国际节点分红比例"
      align="center">
      <template scope="scope">
        <span v-if="scope.row.shareType ==2"> --</span>
        <span v-else-if="scope.row.levelRates">{{scope.row.levelRates[3] * 100}}%</span>
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
          <el-button type="text" v-hasPermi="['internal:feeBonus:setting:update']" @click="alterClick(scope.row)" v-if="!scope.row.statusType">编辑</el-button>
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
    title="节点分红配置"
    :visible.sync="dialogVisible"
    width="50%">
      <el-dialog
        width="89%"
        title="引用节点分红配置"
        :visible.sync="innerVisible"
        append-to-body>
        <cp v-if="innerVisible" @bridgeFn="bridgeFnParent" :bonusType="1" />
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
      <el-form-item label="节点分红总拔比"><el-input-number @blur="((ev) => handleBlur(ev, 'totalRate'))" v-model="submitForm.totalRate" :precision="2" :step="1" :max="100" :min="0.01" controls-position="right" style="width:50%;"></el-input-number><span style="padding-left:10px;">%</span></el-form-item>
      <el-form-item label="节点分红条件" prop="conditionOn">
          <el-radio-group v-model="submitForm.conditionOn">
            <el-radio :label="false">无条件</el-radio>
            <el-radio :label="true">有条件</el-radio>
          </el-radio-group>
          
          <template v-if="submitForm.conditionOn">
            <div style="margin-top: 20px;">
              <el-checkbox v-model="submitForm.taskCheckbox">持有进行中糖果包</el-checkbox>
              <el-input-number :min="0" style="margin-left: 20px;" v-model="submitForm.taskHold" :precision="2"></el-input-number><span style="padding-left:5px;">Candy</span>
            </div>
            <div style="margin-top: 20px;">
              <el-checkbox v-model="submitForm.levelCheckbox">星级达人身份</el-checkbox>
              <el-select
                style="margin-left: 48px;"
                v-model="submitForm.asteriskLevel"
                placeholder="请选择星级达人身份"> 
                <el-option :key="1" label="一星达人" :value="1"></el-option>
                <el-option :key="2" label="二星达人" :value="2"></el-option>
                <el-option :key="3" label="三星达人" :value="3"></el-option>
                <el-option :key="4" label="四星达人" :value="4"></el-option>
                <el-option :key="5" label="五星达人" :value="5"></el-option>
              </el-select>
            </div>
            <p>多选，必填一项：大于等当前配置条件的，均为符合条件</p>
          </template>
          <p v-else>只需成为节点用户即可以参与分红</p>
         
      </el-form-item>
      
      <el-form-item label="节点分红方式" prop="shareType">
          <el-radio-group v-model="submitForm.shareType">
            <el-radio :label="1">独立分红</el-radio>
            <el-radio :label="2">平均分红</el-radio>
          </el-radio-group>
      </el-form-item>
      <template v-if="submitForm.shareType == 1">
        <el-form-item label="一级节点分红比例"><el-input-number @blur="((ev) => handleBlur(ev, 'levelRates', 0))" v-model="submitForm.levelRates[0]" :precision="2" :step="1" :max="100" :min="0.01" controls-position="right" style="width:50%;"></el-input-number><span style="padding-left:10px;">%</span></el-form-item>
        <el-form-item label="二级节点分红比例"><el-input-number @blur="((ev) => handleBlur(ev, 'levelRates', 1))" v-model="submitForm.levelRates[1]" :precision="2" :step="1" :max="100" :min="0.01" controls-position="right" style="width:50%;"></el-input-number><span style="padding-left:10px;">%</span></el-form-item>
        <el-form-item label="三级节点分红比例"><el-input-number @blur="((ev) => handleBlur(ev, 'levelRates', 2))" v-model="submitForm.levelRates[2]" :precision="2" :step="1" :max="100" :min="0.01" controls-position="right" style="width:50%;"></el-input-number><span style="padding-left:10px;">%</span></el-form-item>
        <el-form-item label="国际节点分红比例"><el-input-number @blur="((ev) => handleBlur(ev, 'levelRates', 3))" v-model="submitForm.levelRates[3]" :precision="2" :step="1" :max="100" :min="0.01" controls-position="right" style="width:50%;"></el-input-number><span style="padding-left:10px;">%</span></el-form-item>
      </template>
     
      <div style="font-size:13px;color: rgb(115 112 112);padding:10px;">
        注：<br>
          1. 每个月份，在列表上可以存在多条，但计算【同一月份，每个币种】只能存在一条，无论为【禁用】还是【启用】状态；<br>
          2. 引用，可引用列表上的数据;<br>
          3. 节点分红总拔比，以所勾选来源的手续费汇总为基数;<br>
          4. 各级节点比例，以节点分红为100%基准，各级节点配置比例，总和不得大于1；<br>
          5. 【相同来源的手续费汇总】 配置总拔比，节点分红总拔比，星级达人总拔比，VIP用户总拔比，之间比例之和不得大于1 ；<br>
          6.未配置或未启用，则不作分红处理；<br>
          7. 取结算日前的配置，故在结算前配置且启用后均生效 ；结算日之后配置的，则不生效。<br>
          8. 【节点分红方式】<独立分红> 针对每个不一样的节点进行独立分配置 ；<全网平均>是指不区分节点类型，全网总人数平均分红<br>
          9.例：<br>
          假设<br>
          （1）勾选【区块链转账】【平台内部转账】9月份的手续费为 1000 USDT, 800 Candy<br>
          （2）勾选【币种】USDT<br>
          （3）节点分红总拔比 20% ，一级节点分红比例30%，二级节点分红比例30%，三级节点分红比例30%，国际节点分红比例10%<br>
          （4）一级节点2 人，二级节点2 人，三级节点2 人，国际节点 0 人计算<br>
          计算<br>
          （1）9 月份只勾选 USDT ，则9 月份节点手续费只能分USDT，10月1号00:00 发放<br>
          （2)  节点总分红 = 分红手续费 × 节点分红总拔比 = 1000 × 20% = 200 USDT<br>
          - <独立分红>方式计算<br>
           （3）一级节点分红 = 节点总分红 × 一级节点分红比例 = 200 × 30% ÷ 2  =30 USDT<br>
                  二级节点分红 = 节点总分红 × 二级节点分红比例 = 200 × 30%÷ 2 =30 USDT<br>
                  三级节点分红 = 节点总分红 × 三级节点分红比例 = 200 × 30%÷ 2 =30 USDT<br>
                  国际节点分红 = 节点总分红 × 国际节点分红比例 = 200 × 10%÷ 0 =0 USDT  （国际节点没有人，则此部分分红不分出）<br>
          - <全网平均>方式计算<br>
          不区分所节点类型，全平台节点用户获得的节点分红为一样的<br>
          节点分红 = 节点总分红 ÷ 全网节点用户 = 200 ÷ （2+2+2）= 33.33<br>
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
          levelRates: [0.01, 0.01, 0.01, 0.01],
          totalRate: 0.01,
          statusType: 1, // 状态 0-关闭 1-开启
          id: null,
          bonusType: 1, // 1-节点分红、2-星级达人
          shareType: 1, //节点分红方式 1独立分红 2平均分红 默认1
          conditionOn: false, //节点分红条件 false无条件 true有条件 默认false
          taskHold: "", //持有糖果包数量  
          asteriskLevel: "", //星级达人身份  
          taskCheckbox: false, //是否勾选持有进行中糖果包
          levelCheckbox: false, //是否勾选星级达人身份
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
          bonusType: 1,
          shareType: val.shareType || 1,
          conditionOn: val.shareCondition.conditionOn || false,
          taskHold: val.shareCondition.taskHold || "",
          asteriskLevel: val.shareCondition.asteriskLevel || "",
          taskCheckbox: val.shareCondition.taskHold? true : false,
          levelCheckbox: val.shareCondition.asteriskLevel? true : false,
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
        let formData = {
          bonusType: this.submitForm?.bonusType,
          shareType: this.submitForm?.shareType,
          conditionOn: this.submitForm.conditionOn,
          coins: this.submitForm?.coins,
          feeTypes: this.submitForm?.feeTypes,
          id: this.submitForm?.id,
          levelRates: (this.submitForm?.levelRates || []).map(v => (v/100).toFixed(4)),
          month: this.submitForm?.month,
          statusType: this.submitForm?.statusType,
          totalRate: (this.submitForm?.totalRate/100).toFixed(4),
          year: this.submitForm?.year
        }
        //节点分红条件 / 有条件时
        if(this.submitForm?.conditionOn == true){
          if(!this.submitForm?.taskCheckbox && !this.submitForm?.levelCheckbox){
            this.$message.error('节点分红条件至少勾选一项')
            return false
          }
          //已勾选持有进行中糖果包 未输入数量
          if(this.submitForm?.taskCheckbox){
            if(!(this.submitForm?.taskHold)){
              this.$message.error('请输入持有进行中糖果包')
              return false
            }
            formData.taskHold = this.submitForm?.taskHold;
          }
          //已勾选星级达人身份 未选择达人
          if(this.submitForm?.levelCheckbox){
            if(!(this.submitForm?.asteriskLevel)){
              this.$message.error('请选择星级达人身份')
              return false
            }
            formData.asteriskLevel = this.submitForm?.asteriskLevel;
          }
        }
        console.log(formData);
        this.saveLoading = true;
        _api(formData).then(response => {
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
          levelRates: [0.01, 0.01, 0.01, 0.01],
          totalRate: 0.01,
          statusType: 1,
          id: null,
          bonusType: 1,
          shareType: 1,
          conditionOn: false,
          taskHold: "", 
          asteriskLevel: 0,
          taskCheckbox: false,
          levelCheckbox: false,
        }
      },
      alterClick (row) {
        this.curActionType = 'alter'
        this.dialogVisible = true
        console.log(row);
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
          bonusType: 1,
          shareType: row.shareType || 1,
          conditionOn : row.shareCondition.conditionOn || false,
          taskHold : row.shareCondition.taskHold || "",
          asteriskLevel : row.shareCondition.asteriskLevel || "",
          taskCheckbox: row.shareCondition.taskHold? true : false,
          levelCheckbox: row.shareCondition.asteriskLevel? true : false,
        }
        console.log(this.submitForm);
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
            bonusType: 1,
            hareType: row.shareType || 1,
            conditionOn : row.shareCondition.conditionOn || false,
            taskHold : row.shareCondition.taskHold || "",
            asteriskLevel : row.shareCondition.asteriskLevel || "",
            taskCheckbox: row.shareCondition.taskHold? true : false,
            levelCheckbox: row.shareCondition.asteriskLevel? true : false,
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
              bonusType: 1,
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
