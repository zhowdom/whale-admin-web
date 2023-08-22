<template>
    <div class="tab-content">
      <div class="mb30">
        <el-button v-hasPermi="['whale:exchange_dh_rule:save']" icon="el-icon-plus" type="primary" @click="handleAdd()">新增</el-button>
        <span style="font-size:13px;margin-left:10px;color:red;">新增当天生效，修改的需要明天才生效，如果需要当天生效，需要技术执行。</span>
      </div>
      <!--table-->
      <el-table
      :data="tableData"
      v-loading="loading"
      class="tab-contentbox"
      style="width: 100%">
        <el-table-column label="兑换币种" align="center" min-width="120">
          <template slot-scope="{row}">
            <span v-if="row.fromName">{{row.fromName}}</span>
            <span v-if="row.toName"> - {{row.toName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="汇率方式" align="center" min-width="120">
          <template slot-scope="{row}">
            <span v-if="row.exchangeRateType == 1">USDT 本位</span>
            <span v-if="row.exchangeRateType == 2">新建</span>
          </template>
        </el-table-column>
        <el-table-column prop="rate" label="汇率" align="center" min-width="120">
          <template slot-scope="{row}">
            <span v-if="row.rate && row.rate.length > 0 && row.exchangeRateType == 2">{{row.rate[0]}} : ({{row.rate[1] }} ~ {{row.rate[2]}})</span>
            <span v-else-if="row.rate && row.rate.length > 0 && row.exchangeRateType == 1">{{row.rate[0] }} : {{row.rate[1]}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="status" label="状态" align="center" min-width="120">
          <template slot-scope="{row}">
            <el-switch v-hasPermi="['whale:exchange_dh_rule:change']" v-model="row.status" @change="handleSetType(row)"></el-switch>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" align="center" width="180">
          <template scope="scope">
            <el-button v-hasPermi="['whale:exchange_dh_rule:update']" type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
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
      <el-dialog custom-class="certifyForm" title="新增/编辑对换配置" :visible.sync="dialogFormVisible" :width="'600px'">
        <el-form :model="certifyform" :rules="rules" ref="ruleForm">
          <el-form-item label="兑换币种：" :label-width="formLabelWidth" prop="fromName">
            <el-col :span="11">
              <el-select v-model="certifyform.fromName" clearable placeholder="请选择" :disabled="!!certifyform.id">
                <el-option v-for="(its, index) in daiCoinSettingArr" :key="index" :label="its" :value="its"></el-option>
                <!-- <el-option v-for="(its, index) in daiCoinSettingArr" :key="index" :label="its" :value="its" :disabled="handleChangeFromTo(its)"></el-option> -->
              </el-select>
            </el-col>
            <el-col class="line" :span="2">:</el-col>
            <el-col :span="11">
              <el-select v-model="certifyform.toName" clearable placeholder="请选择" :disabled="!!certifyform.id">
                <el-option v-for="(its, index) in daiCoinSettingArr" :key="index" :label="its" :value="its"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="兑换汇率：" :label-width="formLabelWidth" prop="exchangeRateType">
            <el-radio-group v-model="certifyform.exchangeRateType">
              <div class="mb20"><el-radio :label="1">取【代币配置-汇率】，中间换算</el-radio></div>
              <div><el-radio :label="2">新建  （创建新的兑换汇率 ）</el-radio></div>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth" prop="rateItem" v-if="certifyform.exchangeRateType == 2">
            <el-col :span="7">
                <el-input value="1" disabled></el-input>
            </el-col>
            <el-col class="line" :span="1">:</el-col>
            <el-col :span="7">
                <el-input v-model="certifyform.rateItem" @input="certifyform.rateItem=certifyform.rateItem.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g,'$1')" autocomplete="off" maxlength="20" clearable></el-input>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="7">
                <el-input v-model="certifyform.rateItem2" @input="certifyform.rateItem2=certifyform.rateItem2.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g,'$1')" autocomplete="off" maxlength="20" clearable></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth" v-if="certifyform.exchangeRateType == 2">
            汇率，在输入的配置范围的区间内随机选择， 区间范围包头包尾，小数6位，最大10000
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')" >确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { exchangeList, exchangeCurrencyPage, exchangeCurrencySave, exchangeCurrencyUpdate, exchangeCurrencyChange } from "@/api/xhgjSpark_api/daiCoinSetting.js";
  export default {
    data() {
      const validateFromTo = (rule, value, callback) => {
        if(value === '') {
          callback(new Error('请选择兑换币种'));
        }else if(this.certifyform.toName === '') {
          callback(new Error('请选择兑换币种'));
        }else{
          callback();
        }
      }
      const validateRateItem = (rule, value, callback) => {
        if(this.certifyform.exchangeRateType == 2 && (!value || !this.certifyform.rateItem2)) {
          callback(new Error('不能为空'));
        }else if(Number(this.certifyform.rateItem2) > 10000){
          callback(new Error('不能大于10000'));
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
          exchangeRateType: '',
          fromName: '',
          fromValue: '',
          toName: '',
          rate: [],
          rateItem: null,
          rateItem2: null
        },
        rules: {
          fromName: [
            { required: true, validator: validateFromTo, trigger: 'change' }
          ],
          exchangeRateType: [
            { required: true, message: '不能为空', trigger: 'change' }
          ],
          rateItem: [
            { required: true, validator: validateRateItem, trigger: 'blur' }
          ],
        },
        formLabelWidth: '120px',
        daiCoinSettingArr: [],
      }
    },
    created() {
      this.daiCoinSettingList();
    },
    mounted() {
      this.search();
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
        exchangeCurrencyPage(_params).then(response => {
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
          exchangeRateType: '',
          fromName: '',
          toName: '',
          rate: [],
          rateItem: null,
          rateItem2: null
        };
        if(this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields();
        this.dialogFormVisible = true;
      },
      // 状态开关
      handleSetType(row) {
        let text = row.status == false ? "停用" : "启用";
        this.$confirm(`确认要${text}该配置?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          exchangeCurrencyChange({id: row.id}).then(response => {
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
      handleEdit(row) {
        this.certifyform = Object.assign({rateItem: null, rateItem2: null}, row);
        console.log(this.certifyform);
        if(this.certifyform.exchangeRateType == 2) {
          this.certifyform.rateItem = row.rate[1];
          this.certifyform.rateItem2 = row.rate[2];
        }
        this.dialogFormVisible = true;
      },
      handleChangeFromTo(its) {
        let isFromToBool = false;
        this.tableData.forEach(item => {
          if(item.fromName == its) {
            isFromToBool = true;
          }
        })
        return isFromToBool;
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.certifyform.fromValue == this.certifyform.toName) {
              this.$message.error('兑换币种不能相同');
              return;
            }
            let _params = {
              exchangeRateType: this.certifyform.exchangeRateType,
              fromName: this.certifyform.fromName,
              toName: this.certifyform.toName,
              rate: []
            }
            if(this.certifyform.exchangeRateType == 2) {
              _params.rate = [1, Number(this.certifyform.rateItem), Number(this.certifyform.rateItem2)];
            }
            if(this.certifyform.id) {
              _params.id = this.certifyform.id;
              exchangeCurrencyUpdate(_params).then(response => {
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
              exchangeCurrencySave(_params).then(response => {
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