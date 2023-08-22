<template>
  <div class="tab-content">
    <div class="mb30">
      <el-button v-hasPermi="['whale:exchange_setting:save']" icon="el-icon-plus" type="primary" @click="handleAdd()">新增</el-button>
    </div>
    <!--table-->
    <el-table
    :data="tableData"
    v-loading="loading"
    class="tab-contentbox"
    style="width: 100%">
      <el-table-column prop="ruleId" label="闪兑币对" align="center" min-width="120">
        <template slot-scope="{row}">
          <span v-if="row.ruleId">{{exchangeSettingObj[row.ruleId]}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="singleMinAmount" label="单笔最小闪兑额" align="center" min-width="120"></el-table-column>
      <el-table-column prop="singleMaxAmount" label="单笔最大闪兑额" align="center" min-width="120"></el-table-column>
      <el-table-column prop="dayMaxAmount" label="当日最大可闪兑" align="center" min-width="120"></el-table-column>
      <el-table-column prop="serviceFee" label="手续费" align="center" min-width="120">
        <template slot-scope="{row}">
          <span v-if="row.serviceFee || row.serviceFee == 0">{{row.serviceFee}} %</span>
        </template>
      </el-table-column>
      <el-table-column prop="gasFee" label="Gas fee" align="center" min-width="120">
        <template slot-scope="{row}">
          {{row.gasFee}}{{row.gasFeeType == 1 ? ' (本币)' : (row.gasFeeType == 2 ? ' (USDT)' : '')}}
        </template>
      </el-table-column>
      <el-table-column prop="dedicateWorthType" label="荣耀值收取方式" align="center" min-width="120">
        <template slot-scope="{row}">
          <span v-if="row.dedicateWorthType == 1">按次收取</span>
          <span v-else-if="row.dedicateWorthType == 2">按次比例收取</span>
          <span v-else-if="row.dedicateWorthType == 3">按【荣耀值使用】配置收取</span>
        </template>
      </el-table-column>
      <el-table-column prop="dedicateWorth" label="数量/比例" align="center" min-width="120">
        <template slot-scope="{row}">
          <span v-if="row.dedicateWorth && row.dedicateWorth.length > 0">
            {{row.dedicateWorth[0]}}
            <template v-if="row.dedicateWorthType == 2">: {{row.dedicateWorth[1]}}</template>
          </span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="代币状态" align="center" min-width="120">
          <template slot-scope="{row}">
            {{row.coinStatus? '可用':'锁仓'}}
          </template>
        </el-table-column>
      <el-table-column prop="status" label="状态" align="center" min-width="120">
        <template slot-scope="{row}">
          <el-switch v-hasPermi="['whale:exchange_setting:change']" v-model="row.status" @change="handleSetType(row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template scope="scope">
          <el-button v-hasPermi="['whale:exchange_setting:update']" type="primary" size="mini" @click="handelEdit(scope.row)" :disabled="scope.row.status">编辑</el-button>
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
    <!--table-->
    <!--新增/编辑dialog-->
    <el-dialog custom-class="certifyForm" title="闪兑配置" :visible.sync="dialogFormVisible" :width="'700px'">
      <el-form :model="certifyform" :rules="rules" ref="ruleForm">
        <el-form-item label="闪兑币种：" :label-width="formLabelWidth" prop="ruleId">
          <el-select v-model="certifyform.ruleId" clearable placeholder="请选择" :disabled="!!certifyform.id" @change="handleRuleId">
            <el-option v-for="(its, index) in exchangeSettingArr" :key="index" :label="its.label" :value="its.value" :disabled="its.disable"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单笔最小闪兑额：" :label-width="formLabelWidth" prop="singleMinAmount">
          <el-input v-model="certifyform.singleMinAmount" @input="certifyform.singleMinAmount=certifyform.singleMinAmount.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g,'$1')" autocomplete="off" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item label="单笔最大闪兑额：" :label-width="formLabelWidth" prop="singleMaxAmount">
          <el-input v-model="certifyform.singleMaxAmount" @input="certifyform.singleMaxAmount=certifyform.singleMaxAmount.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g,'$1')" autocomplete="off" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item label="当日最大可闪兑：" :label-width="formLabelWidth" prop="dayMaxAmount">
          <el-input v-model="certifyform.dayMaxAmount" @input="certifyform.dayMaxAmount=certifyform.dayMaxAmount.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g,'$1')" autocomplete="off" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item label="手续费：" :label-width="formLabelWidth" prop="serviceFee">
          <el-input v-model="certifyform.serviceFee" @input="certifyform.serviceFee=certifyform.serviceFee.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g,'$1')" autocomplete="off" maxlength="20" clearable></el-input>
          <span class="danwei">%</span>
        </el-form-item>
        <el-form-item label="Gas fee：" :label-width="formLabelWidth" prop="gasFeeType">
          <el-radio-group v-model="certifyform.gasFeeType" @change="handleChangeGasFee" style="width: 100%;">
            <div class="gxz pb5">
              <el-col :span="7">
                <el-radio :label="2" style="line-height: 36px">扣USDT</el-radio>
              </el-col>
              <el-col :span="17">
                <el-input v-model="usdtNum" @input="usdtNum=usdtNum.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g,'$1')" autocomplete="off" maxlength="20" clearable></el-input>
              </el-col>
              <el-col :span="24" style="height: 30px;font-size: 14px;line-height: 35px;">（Gas fee统一按笔收取，收取USDT；配置为0，即APP端不显示）</el-col>
            </div>
            <div class="gxz pb5">
              <el-col :span="7">
                <el-radio :label="1" style="line-height: 36px">扣本币</el-radio>
              </el-col>
              <el-col :span="17">
                <el-input v-model="homeCurrency" @input="homeCurrency=homeCurrency.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g,'$1')" autocomplete="off" maxlength="20" clearable></el-input>
              </el-col>
              <el-col :span="24" style="height: 30px;font-size: 14px;line-height: 35px;">（Gas fee统一按笔收取，收取本币；配置为0，即APP端不显示）</el-col>
            </div>
          </el-radio-group>
          <!-- <el-col :span="21">
            <el-input v-model="certifyform.gasFee"  @input="certifyform.gasFee=certifyform.gasFee.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g,'$1')" autocomplete="off" maxlength="20" clearable></el-input>
          </el-col>
          <el-col class="line" :span="3">
            USDT
          </el-col> -->
        </el-form-item>
        <el-form-item label="荣耀值：" :label-width="formLabelWidth" prop="dedicateWorthType">
          <el-radio-group v-model="certifyform.dedicateWorthType" @change="handleChangeRadio">
            <div class="gxz pb5">
              <el-col :span="7">
                <el-radio :label="1" style="line-height: 36px">按次收取</el-radio>
              </el-col>
              <el-col :span="17">
                <el-input v-model="certifyform.singNum" @input="certifyform.singNum=certifyform.singNum.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g,'$1')" autocomplete="off" maxlength="20" clearable></el-input>
              </el-col>
            </div>
            <div class="gxz pb5">
              <el-col :span="7">
                <el-radio :label="2" style="line-height: 36px">按次比例收取</el-radio>
              </el-col>
              <el-col :span="6">
                <span style="font-size: 14px;line-height: 36px">USDT： 荣耀值 = </span>
              </el-col>
              <el-col :span="5">
                <el-input v-model="certifyform.proportionFirst" @input="certifyform.proportionFirst=certifyform.proportionFirst.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g,'$1')" autocomplete="off" maxlength="20" clearable></el-input>
              </el-col>
              <el-col class="line" :span="1"><span style="font-size: 14px;line-height: 36px">:</span></el-col>
              <el-col :span="5">
                <el-input v-model="certifyform.proportionSecond" @input="certifyform.proportionSecond=certifyform.proportionSecond.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g,'$1')" autocomplete="off" maxlength="20" clearable></el-input>
              </el-col>
            </div>
            <div>
              <el-col :span="12">
                <el-radio :label="3" style="line-height: 36px" :disabled="thirdRadio"> 按【荣耀值使用】配置收取</el-radio>
              </el-col>
              <!-- <el-col :span="12">
                <span style="color: #999">（如果无配置，则此项置灰，不可选）</span>
              </el-col> -->
            </div>
          </el-radio-group>
        </el-form-item>

         <el-form-item label="代币状态：" :label-width="formLabelWidth" prop="coinStatus">
          <span v-if="thirdRadio">可用</span>
          <el-select placeholder="请选择" v-model="certifyform.coinStatus" style="width: 200px;" v-else>
            <el-option label="可用" :value="true"></el-option>
            <el-option label="锁仓" :value="false" ></el-option>
          </el-select>
        </el-form-item>
        <div style="text-indent: 40px;">
          <div>假设：</div>
          <p class="text-muted">(1) 闪兑 candy - usdt</p>
          <p class="text-muted">(2) 闪兑100 candy 手续费配置 ： 1% ， Gas fee   配置为 1 USDT</p>
          <p class="text-muted">(3) 荣耀值 选中 【荣耀值使用】</p>
          <p class="text-muted">(4) 1 candy : 1 usdt  = 1：3.43</p>
          <p class="text-muted">(5)当前等级 LV2 ，转赠逻辑手续费 35%</p>
          <div>计算：</div>
          <p class="text-muted">(1)实际使用Candy 来USDT： 100</p>
          <p class="text-muted">(2)实际扣减  = 使用闪兑数量  + 转赠逻辑手续费 + 配置的手续费</p>
          <p class="text-muted" style="text-indent: 117px;">=  100 + 100  * 35%+ 100*1% = 136 candy</p>
          <p class="text-muted">(3)138 在这 [100- 500] 区间 ，candy : 荣耀值 = 1: 1  , 扣荣耀值136</p>
          <p class="text-muted">(4)闪兑扣减Gasfee = 1 USDT</p>
          <p class="text-muted">(6)得到 USDT = 100 × 3.43 = 343</p>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { exchangeSettingList, exchangeSettingPage, exchangeSettingSave, exchangeSettingUpdate, exchangeSettingChange } from "@/api/xhgjSpark_api/daiCoinSetting.js";
export default {
  data() {
    const validateDedicateWorth = (rule, value, callback) => {
      if(!value) {
        callback(new Error('请选择荣耀值类型'));
      }else if(this.certifyform.dedicateWorthType == 1 && this.certifyform.singNum != 0 && !this.certifyform.singNum) {
        callback(new Error('请输入荣耀值'));
      }else if(this.certifyform.dedicateWorthType == 2 && (!this.certifyform.proportionFirst || !this.certifyform.proportionSecond)) {
        callback(new Error('请输入荣耀值'));
      }else{
        callback();
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
        dayMaxAmount: '',
        dedicateWorth: [],
        dedicateWorthType: '',
        gasFee: 0,
        ruleId: '',
        serviceFee: 0,
        singleMaxAmount: '',
        singleMinAmount: '',
        singNum: null,
        proportionFirst: null,
        proportionSecond: null,
        coinStatus:true
      },
      rules: {
        ruleId: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        singleMinAmount: [
          { required: true, message: '不能为空', trigger: 'blur' },
        ],
        singleMaxAmount: [
          { required: true, message: '不能为空', trigger: 'blur' },
        ],
        dayMaxAmount: [
          { required: true, message: '不能为空', trigger: 'blur' },
        ],
        dedicateWorthType: [
          { required: true, validator: validateDedicateWorth, trigger: 'blur,change' }
        ],
        coinStatus: [
          { required: true, message: '请选择代币状态', trigger: 'blur' },
        ],
      },
      formLabelWidth: '140px',
      exchangeSettingArr: [],
      exchangeSettingObj: {},
      thirdRadio: true,
      homeCurrency: null,
      usdtNum: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.search();
    })
  },
  activated() {
    this.exchangeSettingList();
  },
  methods: {
    exchangeSettingList() {
      exchangeSettingList({}).then(response => {
        if (response.code === 200) {
          this.exchangeSettingArr = JSON.parse(JSON.stringify(response.data.list))
          this.exchangeSettingArr.forEach(item => {
            this.exchangeSettingObj[item.value] = item.label;
          })
        } else {
          this.exchangeSettingArr = []
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
      exchangeSettingPage(_params).then(response => {
        if (response.code === 200) {
          this.tableData = JSON.parse(JSON.stringify(response.data.list))
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
        dayMaxAmount: '',
        dedicateWorth: [],
        dedicateWorthType: '',
        gasFee: 0,
        ruleId: '',
        serviceFee: 0,
        singleMaxAmount: '',
        singleMinAmount: '',
        singNum: null,
        proportionFirst: null,
        proportionSecond: null,
        coinStatus:true
      };
      if(this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields();
      this.dialogFormVisible = true;
    },
    // 选择币种
    handleRuleId(val, isBool) {
      let str = ''
      this.exchangeSettingArr.forEach(item => {
        if(item.value === val) {
          str = item.label;
        }
      })
      let typeArr = str.split(' -> ');
      if(typeArr[0] == 'CANDY') {
        this.thirdRadio = false;
      }else {
        this.thirdRadio = true;
        if(!isBool && this.certifyform.dedicateWorthType == 3) {
          this.certifyform.dedicateWorthType = '';
        }
      }
    },
    handleChangeGasFee(val) {
      this.homeCurrency = null;
      this.usdtNum = null;
    },
    handleChangeRadio(val) {
      if(val == 1) {
        this.certifyform.proportionFirst = null;
        this.certifyform.proportionSecond = null;
      }else if(val == 2) {
        this.certifyform.singNum = null;
      }else {
        this.certifyform.singNum = null;
        this.certifyform.proportionFirst = null;
        this.certifyform.proportionSecond = null;
      }
    },
    // 状态开关
    handleSetType(row) {
      let text = row.status == false ? "停用" : "启用";
      this.$confirm(`确认要${text}该配置?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        exchangeSettingChange({id: row.id}).then(response => {
          if (response.code === 200) {
            this.msgSuccess(`保存成功`)
            this.search(1);
          } else {
            this.msgSuccess(response.message)
          }
        })
      }).catch(() => {
        if(row.status == false) {
          row.status = true
        } else{
          row.status = false
        }
      });
    },
    handelEdit(row) {
      if(row.coinStatus == null || row.coinStatus == undefined){
        row.coinStatus = true;
      }
      this.certifyform = Object.assign({singNum: null, proportionFirst: null, proportionSecond: null}, row);
      this.handleRuleId(this.certifyform.ruleId, true);
      if(this.certifyform.dedicateWorthType == 1) {
        this.certifyform.singNum = row.dedicateWorth[0];
      }
      if(this.certifyform.dedicateWorthType == 2) {
        this.certifyform.proportionFirst = row.dedicateWorth[0] || 0;
        this.certifyform.proportionSecond = row.dedicateWorth[1] || 0;
      }
      if(this.certifyform.gasFeeType == 1) {
        this.homeCurrency = this.certifyform.gasFee;
      }else if(this.certifyform.gasFeeType == 2) {
        this.usdtNum = this.certifyform.gasFee;
      }
      this.dialogFormVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let _params = Object.assign({}, this.certifyform);
          if(this.certifyform.dedicateWorthType == 1) {
            _params.dedicateWorth = [Number(this.certifyform.singNum)];
          }
          if(this.certifyform.dedicateWorthType == 2) {
            _params.dedicateWorth = [null,null];
            _params.dedicateWorth[0] = Number(this.certifyform.proportionFirst);
            _params.dedicateWorth[1] = Number(this.certifyform.proportionSecond)
          }
          if(_params.serviceFee == '' || _params.serviceFee == null || _params.serviceFee == undefined) {
            _params.serviceFee = 0;
          }
          if(_params.gasFeeType == 1) {
            _params.gasFee = this.homeCurrency;
          }else if(_params.gasFeeType == 2) {
            _params.gasFee = this.usdtNum;
          }
          if(_params.gasFee == '' || _params.gasFee == null || _params.gasFee == undefined) {
            _params.gasFee = 0;
          }
          if(this.thirdRadio){
            _params.coinStatus = true;
          }
          if(this.certifyform.id) {
            exchangeSettingUpdate(_params).then(response => {
              if (response.code === 200) {
                this.msgSuccess(`保存成功`)
                this.dialogFormVisible = false;
                this.search(1);
              } else {
                this.msgSuccess(response.message)
                this.dialogFormVisible = false
              }
            })
          }else {
            exchangeSettingSave(_params).then(response => {
              if (response.code === 200) {
                this.msgSuccess(`保存成功`)
                this.dialogFormVisible = false;
                this.search(1);
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

<style lang="scss" scoped>
.tab-content{
  .danwei{
    position: absolute;
    top: 0;
    right: -20px;
  }
  .line{
    text-align: center;
  }
  .gxz{
    box-sizing: border-box;
    overflow: hidden;
  }
}
</style>
<style lang="scss">
.tab-content{
  .certifyForm form{
    padding-right:40px;
    .el-select{
      width: 100%;
    }
  }
  .el-form-item__content{
    position: relative;
  }
}
</style>