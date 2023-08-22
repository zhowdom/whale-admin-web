<template>
  <div class="tab-content">
    <div class="mb30">
      <el-button v-hasPermi="['wallet:coin:config:settings:cost:add']" icon="el-icon-plus" type="primary" @click="handleAdd()">新增</el-button>
    </div>
    <!--table-->
    <el-table
    :data="tableData"
    v-loading="loading"
    style="width: 100%">
      <el-table-column prop="coinName" label="币种" align="center" min-width="120"></el-table-column>
      <el-table-column prop="singleMinWithdrawAmount" label="单笔最小提现额" align="center" min-width="120"></el-table-column>
      <el-table-column prop="singleMaxWithdrawAmount" label="单笔最大提现额" align="center" min-width="120"></el-table-column>
      <el-table-column prop="dayMaxWithdrawAmount" label="当日最大可提现" align="center" min-width="120"></el-table-column>
      <el-table-column prop="serverFee" label="手续费" align="center" min-width="120">
        <template slot-scope="{row}">
          <span v-if="row.serverFee || row.serverFee == 0">{{row.serverFee}} %</span>
        </template>
      </el-table-column>
      <el-table-column prop="gasFee" label="Gas fee" align="center" min-width="160">
        <template slot-scope="{row}">
          {{row.gasFee}}{{row.gasFeeType == 1 ? ' (本币)' : (row.gasFeeType == 2 ? ' (USDT)' : '')}}
        </template>
      </el-table-column>
      <el-table-column prop="dedicateWorthType" label="荣耀值收款方式" align="center" min-width="120">
        <template slot-scope="{row}">
          <span v-if="row.dedicateWorthType == 1">按次收取</span>
          <span v-else-if="row.dedicateWorthType == 2">按比例收取</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column prop="dedicateWorth" label="数量/比例" align="center" min-width="120"></el-table-column>
      <el-table-column prop="enable" label="状态" align="center" min-width="160">
        <template slot-scope="{row}">
          <el-switch v-hasPermi="['facilitator:node_setting:status']" v-model="row.enable" @change="handleSetType(row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template scope="scope">
          <el-button v-hasPermi="['wallet:coin:config:settings:cost:update']" type="primary" size="mini" @click="handleEdit(scope.row)" :disabled="scope.row.enable">编辑</el-button>
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
    <el-dialog custom-class="certifyForm" title="区块链转账配置" :visible.sync="dialogFormVisible" :width="'700px'">
      <el-form :model="certifyform" :rules="rules" ref="ruleForm">
        <el-form-item label="币种：" :label-width="formLabelWidth" prop="coinName">
          <el-select v-model="certifyform.coinName" clearable placeholder="请选择" :disabled="!!certifyform.id">
              <el-option v-for="(its, index) in daiCoinSettingArr" :key="index" :label="its" :value="its" :disabled="handleChangeFromTo(its)"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="单笔最小提现额：" :label-width="formLabelWidth" prop="singleMinWithdrawAmount">
          <el-input v-model="certifyform.singleMinWithdrawAmount" @input="certifyform.singleMinWithdrawAmount=certifyform.singleMinWithdrawAmount.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g,'$1')" autocomplete="off" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item label="单笔最大提现额：" :label-width="formLabelWidth" prop="singleMaxWithdrawAmount">
          <el-input v-model="certifyform.singleMaxWithdrawAmount" @input="certifyform.singleMaxWithdrawAmount=certifyform.singleMaxWithdrawAmount.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g,'$1')" autocomplete="off" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item label="当日最大可提现：" :label-width="formLabelWidth" prop="dayMaxWithdrawAmount">
          <el-input v-model="certifyform.dayMaxWithdrawAmount" @input="certifyform.dayMaxWithdrawAmount=certifyform.dayMaxWithdrawAmount.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g,'$1')" autocomplete="off" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item label="手续费：" :label-width="formLabelWidth" prop="serverFee">
          <el-input v-model="certifyform.serverFee" @input="certifyform.serverFee=certifyform.serverFee.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g,'$1')" autocomplete="off" maxlength="20" clearable></el-input>
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
            <el-input v-model="certifyform.gasFee" @input="certifyform.gasFee=certifyform.gasFee.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g,'$1')" autocomplete="off" maxlength="20" clearable></el-input>
          </el-col>
          <el-col class="line" :span="3">
            USDT
          </el-col> -->
        </el-form-item>
        <el-form-item label="荣耀值：" :label-width="formLabelWidth" prop="dedicateWorthType">
          <div class="gxz pb5">
            <el-col :span="7">
              <el-radio v-model="certifyform.dedicateWorthType" :label="1" @change="handleSelectType">按次收取</el-radio>
            </el-col>
            <el-col :span="17">
              <el-input v-model="dedicateWorthNum" @input="dedicateWorthNum=dedicateWorthNum.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g,'$1')" autocomplete="off" maxlength="20" clearable></el-input>
            </el-col>
          </div>
          <div class="gxz pb5">
            <el-col :span="7">
              <el-radio v-model="certifyform.dedicateWorthType" :label="2" @change="handleSelectType">按次比例收取</el-radio>
            </el-col>
            <el-col :span="6">
              <span>USDT： 荣耀值 = </span>
            </el-col>
            <el-col :span="5">
              <el-input v-model="dedicateWorthObj.first" @input="dedicateWorthObj.first=dedicateWorthObj.first.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')" autocomplete="off" maxlength="20" clearable></el-input>
            </el-col>
            <el-col class="line" :span="1">:</el-col>
            <el-col :span="5">
              <el-input v-model="dedicateWorthObj.second" @input="dedicateWorthObj.second=dedicateWorthObj.second.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')" autocomplete="off" maxlength="20" clearable></el-input>
            </el-col>
          </div>
          <div>
            <el-col :span="12">
              <el-radio v-model="certifyform.dedicateWorthType" :label="3" disabled> 按【荣耀值使用】配置收取</el-radio>
            </el-col>
            <el-col :span="12">
              <span style="color: #999">（如果无配置，则此项置灰，不可选）</span>
            </el-col>
          </div>
        </el-form-item>
        <div style="text-indent: 40px;">
          <h3>以USDT 为样例：</h3>
          <div>假设：</div>
          <p class="text-muted">1. 转账输入 100 USDT , 手续费为 1% ，Gas fee 为 5 USDT</p>
          <div>计算：</div>
          <p class="text-muted">1. 则实际到账的USDT = 100 - 100 *1%  = 99</p>
          <p class="text-muted">2. 实际扣减的USDT = 100 USDT</p>
          <p class="text-muted">3. 实际扣减的Gasfee = 5 USDT</p>
          <p class="text-muted">4. 荣耀值比例配置  1 USDT:荣耀值 = 1：4</p>
          <p class="text-muted" style="text-indent: 56px;">则扣除荣耀值 ： 100*4 = 400 荣耀值</p>
          <h3>以LUNA 为样例：</h3>
          <div>假设：</div>
          <p class="text-muted">1. 转账输入 100 LUNA , 手续费为 1% ，Gas fee 为 5 USDT</p>
          <div>计算：</div>
          <p class="text-muted">1. 则实际到账的LUNA = 100 - 100 *1%  = 99</p>
          <p class="text-muted">2. 实际扣减的LUNA = 100 LUNA</p>
          <p class="text-muted">3. 实际扣减的Gasfee = 5 USDT</p>
          <p class="text-muted">4. 荣耀值比例配置  1 LUNA:荣耀值 = 1：4</p>
          <p class="text-muted" style="text-indent: 56px;">则扣除荣耀值 ： 100*4 = 400 荣耀值</p>
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
import { blockchainNewPage, addDlockchain, editDlockchain, exchangeList } from "@/api/xhgjSpark_api/daiCoinSetting.js";
export default {
  name: 'blockchain',
  data() {
    var validateDedicateWorthType = (rule, value, callback) => {
      console.log(this.certifyform,this.dedicateWorthObj);
      if (!value) {
        return callback(new Error('请选择荣耀值收取方式'))
      }else if(
        (value == 1 && (this.dedicateWorthNum == '' || this.dedicateWorthNum == null || this.dedicateWorthNum == undefined)) || 
        (value == 2 && (this.dedicateWorthObj.first == '' || this.dedicateWorthObj.first == null || this.dedicateWorthObj.first == undefined)) || 
        (value == 2 && (this.dedicateWorthObj.second == '' || this.dedicateWorthObj.second == null|| this.dedicateWorthObj.second == undefined))
      ){
        return callback(new Error('请输入数量或比例'))
      }
      callback()
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
        dayMaxWithdrawAmount: '',
        dedicateWorth: '',
        dedicateWorthType: '',
        gasFee: '',
        remark: '',
        serverFee: '',
        singleMaxWithdrawAmount: '',
        singleMinWithdrawAmount: '',
        id: ''
      },
      dedicateWorthObj: {
        first: '',
        second: ''
      },
      dedicateWorthNum: '',
      rules: {
        coinName: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        dayMaxWithdrawAmount: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        singleMaxWithdrawAmount: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        singleMinWithdrawAmount: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        serverFee: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        gasFee: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        dedicateWorthType: [
          { required: true, validator: validateDedicateWorthType, trigger: 'blur,change' }
        ],
      },
      formLabelWidth: '140px',
      daiCoinSettingArr: [],
      homeCurrency: null,
      usdtNum: null
    }
  },
  mounted() {
    this.search();
  },
  activated() {
    this.daiCoinSettingList();
  },
  methods: {
    daiCoinSettingList() {
      exchangeList({}).then(response => {
        if (response.code === 200) {
          this.daiCoinSettingArr = JSON.parse(JSON.stringify(response.data))
        } else {
          this.daiCoinSettingArr = []
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
      blockchainNewPage(_params).then(response => {
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
        coinName: '',
        dayMaxWithdrawAmount: '',
        dedicateWorth: '',
        dedicateWorthType: '',
        gasFee: '',
        remark: '',
        serverFee: '',
        singleMaxWithdrawAmount: '',
        singleMinWithdrawAmount: '',
        gasFeeType: ''
      };
      this.dedicateWorthObj = {
        first: '',
        second: ''
      }
      this.homeCurrency = null;
      this.usdtNum = null;
      this.dedicateWorthNum = '';
      this.daiCoinSettingArr.forEach(item => {
        this.tableData.forEach(child => {
          if(item.label == child.coinName) {
            item.disable = true;
          }
        })
      })
      if(this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields();
      this.dialogFormVisible = true;
    },
    handleSelectType(val) {
      console.log(val);
      if(val == 1) {
        this.dedicateWorthObj = {
          first: '',
          second: ''
        }
      }else if (val == 2) {
        this.dedicateWorthNum = '';
      }
    },
    // 状态开关
    handleSetType(row) {
      let text = row.enable == false ? "停用" : "启用";
      this.$confirm(`确认要${text}该配置?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        let _params = Object.assign({}, row);
        editDlockchain(_params).then(response => {
          if (response.code === 200) {
            this.msgSuccess(`保存成功`)
            this.search(this.pageIndex);
          } else {
            this.msgSuccess(response.message)
          }
        })
      }).catch(() => {
        if(row.enable == false) {
          row.enable = true
        } else{
          row.enable = false
        }
      });
    },
    handleEdit(row) {
      this.certifyform = Object.assign({}, row);
      this.dedicateWorthNum = '';
      this.dedicateWorthObj = {
        first: '',
        second: ''
      }
      if(this.certifyform.dedicateWorthType == 1) {
        this.dedicateWorthNum = this.certifyform.dedicateWorth
      }else if(this.certifyform.dedicateWorthType == 2) {
        let arr = this.certifyform.dedicateWorth.split(':');
        this.dedicateWorthObj.first = arr[0];
        this.dedicateWorthObj.second = arr[1];
      }
      this.homeCurrency = null;
      this.usdtNum = null;
      if(this.certifyform.gasFeeType == 1) {
        this.homeCurrency = this.certifyform.gasFee;
      }else if(this.certifyform.gasFeeType == 2) {
        this.usdtNum = this.certifyform.gasFee;
      }
      this.dialogFormVisible = true;
    },
    handleChangeGasFee(val) {

    },
    handleChangeFromTo(its) {
      let isFromToBool = false;
      this.tableData.forEach(item => {
        if(item.coinName == its) {
          isFromToBool = true;
        }
      })
      return isFromToBool;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let _params = Object.assign({}, this.certifyform);
          if(this.certifyform.dedicateWorthType == 1) {
            _params.dedicateWorth = this.dedicateWorthNum;
          }else if(this.certifyform.dedicateWorthType == 2) {
            _params.dedicateWorth = `${this.dedicateWorthObj.first}:${this.dedicateWorthObj.second}`
          }
          if(_params.gasFeeType == 1) {
            _params.gasFee = this.homeCurrency;
          }else if(_params.gasFeeType == 2) {
            _params.gasFee = this.usdtNum;
          }
          if(_params.gasFee == '' || _params.gasFee == null || _params.gasFee == undefined) {
            _params.gasFee = 0;
          }
          if(this.certifyform.id) {
            _params.id = this.certifyform.id;
            editDlockchain(_params).then(response => {
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
            _params.enable = false;
            addDlockchain(_params).then(response => {
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