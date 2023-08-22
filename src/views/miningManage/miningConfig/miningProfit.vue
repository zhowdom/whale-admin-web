<template>
  <div class="tab-content">
    <div class="task-table">
      <!--table-->
      <el-table
      :data="tableData"
      v-loading="loading"
      style="width: 100%">
        <el-table-column prop="subTitle" label="名称" align="center" min-width="160"></el-table-column>
        <el-table-column prop="pledgeWay" label="方式" align="center" min-width="120">
          <template slot-scope="{row}">
            <span v-if="row.pledgeWay == 1">手动</span>
            <span v-else-if="row.pledgeWay == 2">自动</span>
          </template>
        </el-table-column>
        <el-table-column prop="pledgeType" label="类型" align="center" min-width="120">
          <template slot-scope="{row}">
            <span v-if="row.pledgeType == 1">活期</span>
            <span v-else-if="row.pledgeType == 2">定期</span>
          </template>
        </el-table-column>
        <el-table-column prop="condition" label="第1收益率" align="center" min-width="120">
          <template slot-scope="{row}">
            <template v-if="row.pledgeType == 1">
              <span v-if="row.yearIncomeRatio">{{row.yearIncomeRatio}}% / 365天</span>
              <span v-else>--</span>
            </template>
            <template v-else>
              <span v-if="row.condition && row.condition.length > 0">{{row.condition[0].ratio}}% / {{row.condition[0].dayNumber}}天</span>
              <span v-else>--</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="collectLimit" label="第2收益率" align="center" min-width="120">
          <template slot-scope="{row}">
            <span v-if="row.condition && row.condition.length > 1 && row.condition[1].ratio">{{row.condition[1].ratio}}% / {{row.condition[1].dayNumber}}天</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="collectLimit" label="第3收益率" align="center" min-width="120">
          <template slot-scope="{row}">
            <span v-if="row.condition && row.condition.length > 2 && row.condition[2].ratio">{{row.condition[2].ratio}}% / {{row.condition[2].dayNumber}}天</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="collectLimit" label="第4收益率" align="center" min-width="120">
          <template slot-scope="{row}">
            <span v-if="row.condition && row.condition.length > 3 && row.condition[3].ratio">{{row.condition[3].ratio}}% / {{row.condition[3].dayNumber}}天</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="collectLimit" label="第5收益率" align="center" min-width="120">
          <template slot-scope="{row}">
            <span v-if="row.condition && row.condition.length > 4 && row.condition[4].ratio">{{row.condition[4].ratio}}% / {{row.condition[4].dayNumber}}天</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="collectLimit" label="第6收益率" align="center" min-width="120">
          <template slot-scope="{row}">
            <span v-if="row.condition && row.condition.length > 5 && row.condition[5].ratio">{{row.condition[5].ratio}}% / {{row.condition[5].dayNumber}}天</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="feeRatio" label="收割手续费率" align="center" min-width="120">
          <template slot-scope="{row}">
            <span v-if="row.feeRatio || row.feeRatio == 0">{{row.feeRatio}}%</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" align="center" min-width="120"></el-table-column>
        <el-table-column prop="enabled" label="状态" align="center" min-width="120">
          <template slot-scope="{row}">
            <el-switch v-hasPermi="['wallet:mining:conf:status']" v-model="row.enabled" @change="handleSetType(row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template scope="scope">
            <el-button v-hasPermi="['wallet:mining:conf:edit']" type="primary" size="mini" @click="handelEdit(scope.row)" :disabled="scope.row.enabled">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--table-->
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
    </div>
    <!--新增/编辑dialog-->
    <el-dialog custom-class="certifyForm" title="挖矿配置" :visible.sync="dialogFormVisible" :width="'600px'">
      <el-form :model="certifyform" :rules="rules" ref="ruleForm">
        <el-form-item label="名称：" :label-width="formLabelWidth" prop="subTitle">
          <el-input v-model="certifyform.subTitle" disabled></el-input>
        </el-form-item>
        <el-form-item label="方式：" :label-width="formLabelWidth" prop="pledgeWay">
          <el-select v-model="certifyform.pledgeWay" disabled placeholder="请选择">
            <el-option label="手动" :value="1"></el-option>
            <el-option label="自动" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型：" :label-width="formLabelWidth" prop="pledgeType">
          <el-select v-model="certifyform.pledgeType" disabled placeholder="请选择">
            <el-option label="活期" :value="1"></el-option>
            <el-option label="定期" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年化收益率：" :label-width="formLabelWidth" prop="yearIncomeRatio" v-if="certifyform.pledgeType == 1">
          <el-col :span="23">
            <el-input v-model="certifyform.yearIncomeRatio" @input="certifyform.yearIncomeRatio=certifyform.yearIncomeRatio.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g,'$1')" autocomplete="off" maxlength="20" clearable></el-input>
          </el-col>
          <el-col class="line text-right" :span="1">%</el-col>
        </el-form-item>
        <template v-if="certifyform.pledgeType == 2">
            <el-form-item 
            v-for="(item, index) of certifyform.condition"
            :label="`第${item.conditionId}个收益率：`" 
            :label-width="formLabelWidth" 
            :prop="item.conditionId == 1 ? 'condition' : ''" 
            :key="index">
                <el-col :span="10">
                  <el-input v-model="item.dayNumber" autocomplete="off" maxlength="20"></el-input>
                </el-col>
                <el-col class="line text-center" :span="1">天</el-col>
                <el-col class="line text-center" :span="2">-</el-col>
                <el-col :span="10">
                  <el-input v-model="item.ratio"  @input="certifyform.ratio=certifyform.ratio.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g,'$1')" autocomplete="off" maxlength="20" clearable></el-input>
                </el-col>
                <el-col class="line text-right" :span="1">%</el-col>
            </el-form-item>
        </template>
        <el-form-item label="收割手续费率：" :label-width="formLabelWidth" prop="feeRatio">
          <el-col :span="23">
            <el-input v-model="certifyform.feeRatio" autocomplete="off" maxlength="20" clearable></el-input>
          </el-col>
          <el-col class="line text-right" :span="1">%</el-col>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <span>收割手续费 = 挖矿收益 x 收割手续费率</span>
        </el-form-item>
        <el-form-item :label-width="'30px'" v-if="certifyform.pledgeType == 2">
          <div class="text-danger tip-box">
            <p>注：</p>
            <p class="l-h" style="text-indent: 20px;">（1） 收益率均为年化率收益率，需要除以365 天换算为日收益率</p>
            <p class="l-h" style="text-indent: 20px;">（2） 每日收益（本币） =  质押本金 * 配置的收益率/365</p>
            <p style="text-indent: 20px;">（3） 每日收益（对应币种）= 每日收益（本币）* 当天的汇率折算</p>
            <p style="text-indent: 20px;">（4） 当天质押，不计算当日收益；次日计算昨日收益。</p>
            <p style="text-indent: 20px;">（5） 定期内，不可以提前赎回</p>
            <p style="text-indent: 20px;">（6） 收益率配置，会影响历史未完结的质押记录 ；</p>
            <p style="text-indent: 20px;">（7）汇率配置，每天只会有同一个汇率，</p>
            <p>样例：</p>
            <p style="text-indent: 20px;">（1）质押 7 天 10000 luna ，定期luna</p>
            <p style="text-indent: 20px;">（2）   收益率:  第1天初始配置为400% ，</p>
            <p style="text-indent: 110px;">第2天配置300%，第3天不变，</p>
            <p style="text-indent: 110px;">第4天配置450%，第5，6，7 天都不变</p>
            <p style="text-indent: 20px;">（3）   收割手续费 : 7.2% </p>
            <p style="text-indent: 110px; color: #333;">收割手续费 = 挖矿收益 × 收割手续费率</p>
            <p style="text-indent: 20px;">（4）汇率配置：第1天 1 Luna：1Candy = 1: 0.0020</p>
            <p style="text-indent: 126px;">第2天 1 Luna：1Candy = 1: 0.0019</p>
            <p style="text-indent: 126px;">第3天 1 Luna：1Candy = 1: 0.0023</p>
            <p style="text-indent: 126px;">第4天 1 Luna：1Candy = 1: 0.0017</p>
            <p style="text-indent: 126px;">第5天 1 Luna：1Candy = 1: 0.0018</p>
            <p style="text-indent: 126px;">第6天 1 Luna：1Candy = 1: 0.0020</p>
            <p style="text-indent: 126px;">第7天 1 Luna：1Candy = 1: 0.0023</p>
            <p style="text-indent: 20px;">（5）Candy 收益计算：</p>
            <p style="text-indent: 57px;">第1天 Candy = 10000 luna × 400% ÷ 365 × 0.0020  =  0.2191780</p>
            <p style="text-indent: 57px;">第2天 Candy = 10000 luna × 300% ÷ 365 × 0.0019  =  0.156164382</p>
            <p style="text-indent: 57px;">第3天 Candy = 10000 luna × 300% ÷ 365 × 0.0023  =  0.189041094</p>
            <p style="text-indent: 57px;">第4天 Candy = 10000 luna × 450% ÷ 365 × 0.0017  =  0.20958892</p>
            <p style="text-indent: 57px;">第5天 Candy = 10000 luna × 450% ÷ 365 × 0.0018  =  0.22191768</p>
            <p style="text-indent: 57px;">第6天 Candy = 10000 luna × 450% ÷ 365 × 0.0020  =  0.2465752</p>
            <p style="text-indent: 57px;">第7天 Candy = 10000 luna × 450% ÷ 365 × 0.0023  =  0.28356148</p>
            <p style="text-indent: 52px;">第 8 天可收割 = 所有收益之和 × （1- 收割手续费率）</p>
            <p style="text-indent: 142px;">= （ 1 - 7.2%）=  1.52602656  ×  92.8%</p>
            <p style="text-indent: 142px;">= 1.41615283</p>          
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { miningProfitPage, miningConfigEdit, miningConfigChange } from "@/api/miningManage";
import {  } from "@/api/miningManage";
  export default {
    components: {},
    data () {
      const validateCondition = (rule, value, callback) => {
        if(!this.certifyform.condition[0].ratio) {
          callback(new Error('请输入收益率'));
        }else{
          callback();
        }
      }
      return {
        loading: false,
        submitLoading: false,
        tableData: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dialogFormVisible: false,
        certifyform: {
          subTitle: '',
          pledgeWay: '',
          pledgeType: '',
          condition: [],
          feeRatio: '',
          yearIncomeRatio: ''
        },
        conditionArr: [
          {conditionId: 1, dayNumber: '', ratio: ''},
          {conditionId: 2, dayNumber: '', ratio: ''},
          {conditionId: 3, dayNumber: '', ratio: ''},
          {conditionId: 4, dayNumber: '', ratio: ''},
          {conditionId: 5, dayNumber: '', ratio: ''},
          {conditionId: 6, dayNumber: '', ratio: ''},
        ],
        rules: {
          condition: [
            { required: true, validator: validateCondition, trigger: 'blur' }
          ],
          feeRatio: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          yearIncomeRatio: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
        },
        formLabelWidth: '150px',
      }
    },
    activated() {
      this.search();
    },
    methods: {
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
        miningProfitPage(_params).then(response => {
          if (response.code === 200) {
            this.tableData = JSON.parse(JSON.stringify(response.data.list))
            this.totalPage = response.data.total
            this.loading = false
          } else {
            this.tableData = []
            this.totalPage = 0
            this.pageSize = 10
            this.loading = false
            this.$message.error(response.message)
          }
        })
      },
      // 状态开关
      handleSetType(row) {
        let text = row.enabled == false ? "停用" : "启用";
        this.$confirm(`确认要${text}该配置?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          miningConfigChange({id: row.id, enabled: row.enabled}).then(response => {
            if (response.code === 200) {
              this.msgSuccess(`保存成功`)
              this.search(this.pageIndex);
            } else {
              this.msgSuccess(response.message)
            }
          })
        }).catch(() => {
          if(row.enabled == false) {
            row.enabled = true
          } else{
            row.enabled = false
          }
        });
      },
      handelEdit(row) {
        this.certifyform = {};
        this.certifyform = Object.assign({}, row);
        if(!this.certifyform.condition || (this.certifyform.condition && this.certifyform.condition.length < 6)) {
          this.conditionArr = [
            {conditionId: 1, dayNumber: '', ratio: ''},
            {conditionId: 2, dayNumber: '', ratio: ''},
            {conditionId: 3, dayNumber: '', ratio: ''},
            {conditionId: 4, dayNumber: '', ratio: ''},
            {conditionId: 5, dayNumber: '', ratio: ''},
            {conditionId: 6, dayNumber: '', ratio: ''},
          ]
          this.certifyform.condition = [...this.conditionArr];
        }
        this.dialogFormVisible = true;
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitLoading = true;
            this.updata(this.certifyform);
          }
        })
      },
      // 提交编辑
      updata(data) {
        miningConfigEdit(data).then(response => {
          if (response.code === 200) {
            this.msgSuccess(`保存成功`)
            this.dialogFormVisible = false;
            this.search(this.pageIndex);
          } else {
            this.msgSuccess(response.message)
            this.dialogFormVisible = false
          }
          setTimeout(() => {
            this.submitLoading = false;
          },1000)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.tab-content{
  .danwei{
    position: absolute;
    top: 0;
    right: -45px;
  }
  .noshow{
    visibility: hidden;
    height: 0px !important;
    overflow: hidden !important;
  }
  .tip-box{
    p{
      margin: 0 !important;
    }
    .l-h{
      line-height: 22px;
    }
  }
}
</style>
<style lang="scss">
.tab-content{
  form{
    padding-right:40px;
  }
  .el-form-item__content{
    position: relative;
    .el-select{
      width: 100%;
    }
  }
}
</style>

