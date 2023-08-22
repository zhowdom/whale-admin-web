<template>
  <div class="redBackDetailsBox" style="padding-top:0;">
    <el-table
    :data="tableData"
    v-loading="loading"
    border
    style="width: 100%">
    <el-table-column
      prop="plusName"
      label="等级名称"
      align="center">
    </el-table-column>
    <el-table-column label="自购返佣" align="center">
      <el-table-column
          label="返佣比例"
          width="159"
          align="center"
          >
          <template slot-scope="scope">
            <p>{{scope.row.selfBaseScale|valTransfer}} - {{(scope.row.selfBaseScale + scope.row.upMaxScale)|valTransfer}}</p>
          </template>
      </el-table-column>
      <el-table-column
          align="center"
          width="139"
          label="平台补贴比例"
          show-overflow-tooltip
          >
          <template slot-scope="scope">
            <p>{{scope.row.subsidizeScale|valTransfer}}</p>
          </template>
      </el-table-column>
    </el-table-column>
    <el-table-column label="下级别购物返佣" align="center">
      <el-table-column
          prop="prerogativeType"
          width="170"
          label="一级合伙人购物返佣比例"
          align="center"
          >
          <template slot-scope="scope">
             <p>
              <span>{{scope.row.partnerLevel1Scale|valTransfer}}</span> -
              <span>{{(scope.row.upMaxScale + scope.row.partnerLevel1Scale)|valTransfer}}</span>
            </p>
          </template>
      </el-table-column>
      <el-table-column
          prop="prerogativeName"
          align="center"
          width="200"
          label="二级合伙人购物返佣比例"
          show-overflow-tooltip
          >
          <template slot-scope="scope">
             <p>
              <span>{{scope.row.partnerLevel2Scale|valTransfer}}</span> -
              <span>{{(scope.row.upMaxScale + scope.row.partnerLevel2Scale)|valTransfer}}</span>
            </p>
          </template>
      </el-table-column>
      <el-table-column
          align="center"
          width="200"
          label="二级外合伙人购物返佣比例"
          show-overflow-tooltip
          >
          <template slot-scope="scope">
             <p>
              <span>{{scope.row.partnerOtherScale|valTransfer}}</span> -
              <span>{{(scope.row.upMaxScale + scope.row.partnerOtherScale)|valTransfer}}</span>
            </p>
          </template>
      </el-table-column>
      <el-table-column
          prop="prerogativeName"
          align="center"
          width="200"
          label="无限极团长团队奖励基数/返佣比例"
          show-overflow-tooltip
          >
          <template slot-scope="scope">
             <p>
              <span>{{scope.row.vpOtherBaseScale|valTransfer}}</span>，
              <span>{{scope.row.vpOtherScale|valTransfer}}</span> -
              <span>{{(scope.row.groupMaxUpScale + scope.row.vpOtherScale)|valTransfer}}</span>
            </p>
          </template>
      </el-table-column>
      <el-table-column
          prop="prerogativeName"
          align="center"
          width="200"
          label="高级团长团队奖励基数/返佣比例"
          show-overflow-tooltip
          >
          <template slot-scope="scope">
             <p>
              <span>{{scope.row.svpBaseScale|valTransfer}}</span>，
              <span>{{scope.row.svpScale|valTransfer}}</span>
            </p>
          </template>
      </el-table-column>
      <el-table-column
          prop="prerogativeName"
          align="center"
          width="200"
          label="佣金提高比例/封顶比例"
          show-overflow-tooltip
          >
          <template slot-scope="scope">
             <p>
              <span>{{scope.row.upScale|valTransfer}}</span>，
              <span>{{scope.row.upMaxScale|valTransfer}}</span>
            </p>
          </template>

      </el-table-column>
      <el-table-column
          prop="prerogativeName"
          align="center"
          width="200"
          label="无限极团长团队奖励提高比例/封顶比例"
          show-overflow-tooltip
          >
          <template slot-scope="scope">
             <p>
              <span>{{scope.row.groupUpScale|valTransfer}}</span>，
              <span>{{scope.row.groupMaxUpScale|valTransfer}}</span>
            </p>
          </template>
      </el-table-column>
    </el-table-column>
    <el-table-column
      prop="remark"
      label="备注"
      width="120"
      align="center">
      <template slot-scope="{row}">
          {{row.remark || '-'}}
        </template>
    </el-table-column>
    <el-table-column
      prop="createdBy"
      label="操作人"
      width="120"
      align="center">
      <template slot-scope="{row}">
          {{row.createdBy || '-'}}
        </template>
    </el-table-column>
    <el-table-column
      prop="updatedAt"
      width="160"
      label="最近操作时间"
      align="center">
      <template slot-scope="{row}">
          {{row.updatedAt ? $dayjs(row.updatedAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
    </el-table-column>
    <el-table-column
      prop="percent"
      label="操作"
      align="center">
      <template slot-scope="scope">
        <el-button size="mini" v-hasPermi="['commission:plus:save']" type="primary" @click="mdfClick(scope.row)">修改</el-button>
      </template>
    </el-table-column>
  </el-table>


    <el-dialog :title="curTitle" :visible.sync="dialogFormVisible" class="commissiCashDialog">
      <el-form :model="sumbitForm" ref="ruleForm">
        <el-form-item class="addtionBD" label="等级：" :label-width="formLabelWidth">
          <el-input style="width:200px;" v-model="cloneRowData.plusName" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>

        <div>
          <p style="font-weight:bold;padding:20px 0;">分佣设置（现金分佣）</p>
        </div>

        <div class="clearfix" style="border:1px solid #ccc;border-bottom:none;padding:10px 0;text-indent:10px;">
          <p class="fl">高级团长自购返佣</p>
          <el-tooltip class="item fl" effect="dark" placement="top-start">
            <div slot="content">
              <p>团长自购返佣 <span style="color:red">=</span> 返佣金额 <span style="color:red">+</span> 平台补贴</p>
              <p>返佣金额 <span style="color:red">=</span> 基础佣金 <span style="color:red">×</span> 返佣比例</p>
              <p>平台补贴 <span style="color:red">=</span> 基础佣金 <span style="color:red">×</span> 平台补贴比例</p>
            </div>
            <i style="font-size: 19px;" class="el-icon-question"></i>
          </el-tooltip>
        </div>
        <el-form-item label="返佣比例：" :label-width="formLabelWidth" prop="selfBaseScale">
          <el-input-number @blur="handleBlur" :precision="2" v-model="sumbitForm.selfBaseScale" :step="1" :min="0" controls-position="right"></el-input-number><span style="padding:0 10px;">%</span>
        </el-form-item>
        <el-form-item label="平台补贴比例：" :label-width="formLabelWidth" prop="subsidizeScale">
          <el-input-number @blur="handleBlur" :precision="2" v-model="sumbitForm.subsidizeScale" :step="1" :min="0" controls-position="right"></el-input-number><span style="padding:0 10px;">%</span>
        </el-form-item>

        <div class="clearfix" style="border:1px solid #ccc;border-bottom:none;padding:10px 0;"><p class="fl" style="padding-right:10px;text-indent:10px;">团长下级购物返佣</p>
          <el-tooltip class="item fl" effect="dark" placement="top-start">
            <div slot="content">
              <p>例如：</p>
              <p>一、用户B为用户A（A角色为团长）的一级合伙人，用户B购买商品后，用户A佣金<span style="color:red"> = </span>基础佣金（A用户自己下单返佣金额）<span style="color:red"> × </span>一级合伙人购物返佣比例</p>
              <p>二、用户C为用户A（A角色为团长）的二级合伙人，用户C购买商品后，用户A佣金<span style="color:red"> = </span>基础佣金<span style="color:red"> × </span>二级合伙人购物返佣比例</p>
              <p>三、用户D为用户A（A角色为团长）的二级外合伙人，用户D购买商品后，用户A佣金<span style="color:red"> = </span>基础佣金<span style="color:red"> × </span>二级外合伙人购物返佣比例</p>
              <p>四、用户E为用户A（A角色为团长）的无限极团长，用户E团队购买商品后，用户A佣金<span style="color:red"> = </span>基础佣金<span style="color:red"> × </span>无限极团长团队奖励基数<span style="color:red"> × </span>无限极团长团队奖励比例</p>
              <p>五、用户F为用户A（A角色为团长）的高级团长，用户F团队购买商品后，用户A佣金<span style="color:red"> = </span>基础佣金<span style="color:red"> × </span>高级团长团队奖励基数<span style="color:red"> × </span>高级团长团队奖励比例</p>
            </div>
            <i style="font-size: 19px;" class="el-icon-question"></i>
          </el-tooltip>
        </div>

        <el-form-item label="一级合伙人购物返佣比例：" :label-width="formLabelWidth" prop="partnerLevel1Scale">
          <el-input-number @blur="handleBlur" :precision="2" v-model="sumbitForm.partnerLevel1Scale" :step="1" :min="0" controls-position="right"></el-input-number><span style="padding:0 10px;">%</span>
        </el-form-item>
        <el-form-item label="二级合伙人购物返佣比例：" :label-width="formLabelWidth" prop="partnerLevel2Scale">
          <el-input-number @blur="handleBlur" :precision="2" v-model="sumbitForm.partnerLevel2Scale" :step="1" :min="0" controls-position="right"></el-input-number><span style="padding:0 10px;">%</span>
        </el-form-item>

        <el-form-item label="二级外合伙人购物返佣比例：" :label-width="formLabelWidth" prop="partnerOtherScale">
          <el-input-number @blur="handleBlur" :precision="2" v-model="sumbitForm.partnerOtherScale" :step="1" :min="0" controls-position="right"></el-input-number><span style="padding:0 10px;">%</span>
        </el-form-item>

        <!--new add-->
        <el-form-item label="无限极团长团队奖励基数：" :label-width="formLabelWidth" prop="vpOtherBaseScale">
          <el-input-number @blur="handleBlur" :precision="2" v-model="sumbitForm.vpOtherBaseScale" :step="1" :min="0" controls-position="right"></el-input-number><span style="padding:0 10px;">%</span>
        </el-form-item>
        <el-form-item label="无限极团长团队返佣比例：" :label-width="formLabelWidth" prop="vpOtherScale">
          <el-input-number @blur="handleBlur" :precision="2" v-model="sumbitForm.vpOtherScale" :step="1" :min="0" controls-position="right"></el-input-number><span style="padding:0 10px;">%</span>
        </el-form-item>
        <el-form-item label="高级团长团队奖励基数：" :label-width="formLabelWidth" prop="svpBaseScale">
          <el-input-number @blur="handleBlur" :precision="2" v-model="sumbitForm.svpBaseScale" :step="1" :min="0" controls-position="right"></el-input-number><span style="padding:0 10px;">%</span>
        </el-form-item>
        <el-form-item label="高级团长团队返佣比例：" :label-width="formLabelWidth" prop="svpScale">
          <el-input-number @blur="handleBlur" :precision="2" v-model="sumbitForm.svpScale" :step="1" :min="0" controls-position="right"></el-input-number><span style="padding:0 10px;">%</span>
        </el-form-item>


        <div class="clearfix" style="border:1px solid #ccc;border-bottom:none;padding:10px 0;"><p class="fl" style="padding-right:10px;text-indent:10px;">每培养一名高级团长</p>
          <el-tooltip class="item fl" effect="dark" placement="top-start">
            <div slot="content">
              <p>每培养一名高级团长：</p>
              <p>一、平台补贴佣金提高包括：自购返佣比例、一级合伙人、二级合伙人、二级外合伙人返佣比例</p>
              <p>二、佣金提高封顶比例需能被佣金提高比例整除</p>
              <p>三、无限极团长团队奖励封顶比例需能被团队奖励提高比例整除</p>
              <p style="text-indent:8px;">高级团长拿高级团长奖励只拿一级高级团长的奖励</p>
            </div>
            <i style="font-size: 19px;" class="el-icon-question"></i>
          </el-tooltip>
        </div>
        <el-form-item label="佣金提高比例：" :label-width="formLabelWidth" prop="upScale">
          <el-input-number size="mini" :precision="2" @blur="handleBlur" v-model="sumbitForm.upScale" :step="1" :min="0" controls-position="right"></el-input-number><span style="padding:0 10px;">%</span>
          <!--需要额外校验-->
          <span style="padding-right:6px;">直到提高</span><el-input-number size="mini" :precision="2" @blur="handleBlur" v-model="sumbitForm.upMaxScale" :step="1" :min="0" controls-position="right"></el-input-number><span style="padding:0 10px;">%</span>封顶
        </el-form-item>
        <el-form-item label="无限极团长团队奖励提高比例：" :label-width="formLabelWidth" prop="groupUpScale">
          <el-input-number size="mini" :precision="2" @blur="handleBlur" v-model="sumbitForm.groupUpScale" :step="1" :min="0" controls-position="right"></el-input-number><span style="padding:0 10px;">%</span>
          <!--需要额外校验-->
          <span style="padding-right:6px;">直到提高</span><el-input-number size="mini" :precision="2" @blur="handleBlur" v-model="sumbitForm.groupMaxUpScale" :step="1" :min="0" controls-position="right"></el-input-number><span style="padding:0 10px;">%</span>封顶
        </el-form-item>
        <!--new add ed-->

        <el-form-item class="addtionBD" label="备注：" :label-width="formLabelWidth" prop="remark">
          <el-input
            style="width:400px;"
            type="textarea"
            :rows="4"
            placeholder=""
            v-model="sumbitForm.remark"
            maxlength="100"
            show-word-limit
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="resetForm('ruleForm')">重 置</el-button>
        <el-button type="primary" :loading="btnloading" @click="saveClick('ruleForm')">确 定</el-button>
      </div>

      <div style="padding-top:29px;font-size:13px;">
        <p>备注说明：</p><br>
        <p style="text-indent:10px;padding-bottom:10px;">1.账号正常才能返佣，一旦被锁定或拉黑，无法返佣；</p>
        <p style="text-indent:10px;">2.我的直推和间推升级说明：所有间推用户等级成为高级团长后整个返佣与我脱离关系，但原组织架构仍保留</p>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { layerSettingLIST, layerSettingSAVE } from "@/api/commissCash/platform";
  export default {
    components: {},
    data () {
      return {
        tableData: [],
        loading: false,
        btnloading: false,
        dialogFormVisible: false,
        curTitle: '分佣设置',
        formLabelWidth: '219px',
        sumbitForm: {
          plusLevel: '',
          selfBaseScale: '',
          subsidizeScale: '',
          partnerLevel1Scale: '',
          partnerLevel2Scale: '',
          partnerOtherScale: '',
          remark: '',
          vpOtherBaseScale: '',
          vpOtherScale: '',
          svpBaseScale: '',
          svpScale: '',
          upScale: '',
          upMaxScale: '',
          groupUpScale: '',
          groupMaxUpScale: ''
        },
        cloneRowData: {},
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
    mounted () {
      this.search()
    },
    watch: {},
    methods: {
      coreRunner (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.btnloading = true
            let _params = {
              confType: 1,
              plusLevel: this.sumbitForm.plusLevel,
              selfBaseScale: this.sumbitForm.selfBaseScale / 100,
              subsidizeScale: this.sumbitForm.subsidizeScale / 100,
              partnerLevel1Scale: this.sumbitForm.partnerLevel1Scale / 100,
              partnerLevel2Scale: this.sumbitForm.partnerLevel2Scale / 100,
              partnerOtherScale: this.sumbitForm.partnerOtherScale / 100,
              remark: this.sumbitForm.remark,
              vpOtherBaseScale: this.sumbitForm.vpOtherBaseScale / 100,
              vpOtherScale: this.sumbitForm.vpOtherScale / 100,
              svpBaseScale: this.sumbitForm.svpBaseScale / 100,
              svpScale: this.sumbitForm.svpScale / 100,
              upScale: this.sumbitForm.upScale / 100,
              upMaxScale: this.sumbitForm.upMaxScale / 100,
              groupUpScale: this.sumbitForm.groupUpScale / 100,
              groupMaxUpScale: this.sumbitForm.groupMaxUpScale / 100,
            }
            layerSettingSAVE(_params).then((response) => {
              this.dialogFormVisible = false
              this.btnloading = false
              if (response.code === 200) {
                this.$message({
                message: '操作成功',
                type: 'success',
                'duration': 1000,
                onClose: () => {
                    this.search()
                  }
                })
              } else {
                this.$message.error(response.message)
              }
            }).catch(({ error }) => {
              this.btnloading = false
              this.dialogFormVisible = false
              if (error) this.$message.error(error.message)
            })
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
        this.sumbitForm.selfBaseScale = 0
        this.sumbitForm.subsidizeScale = 0
        this.sumbitForm.partnerLevel1Scale = 0
        this.sumbitForm.partnerLevel2Scale = 0
        this.sumbitForm.partnerOtherScale = 0
        this.sumbitForm.vpOtherBaseScale = 0
        this.sumbitForm.vpOtherScale = 0
        this.sumbitForm.svpBaseScale = 0
        this.sumbitForm.svpScale = 0
        this.sumbitForm.upScale = 0
        this.sumbitForm.upMaxScale = 0
        this.sumbitForm.groupUpScale = 0
        this.sumbitForm.groupMaxUpScale = 0
        this.sumbitForm.remark = ''
      },
      saveClick (formName) {
        this.coreRunner(formName)
      },
      mdfClick (row) {
        this.cloneRowData = Object.assign({}, row)
        this.dialogFormVisible = true
        this.sumbitForm = {
          plusLevel: row.plusLevel,
          selfBaseScale: (row.selfBaseScale * 100).toFixed(2),
          subsidizeScale: (row.subsidizeScale * 100).toFixed(2),
          partnerLevel1Scale: (row.partnerLevel1Scale * 100).toFixed(2),
          partnerLevel2Scale: (row.partnerLevel2Scale * 100).toFixed(2),
          partnerOtherScale: (row.partnerOtherScale * 100).toFixed(2),
          remark: row.remark || '',
          vpOtherBaseScale: (row.vpOtherBaseScale * 100).toFixed(2),
          vpOtherScale: (row.vpOtherScale * 100).toFixed(2),
          svpBaseScale: (row.svpBaseScale * 100).toFixed(2),
          svpScale: (row.svpScale * 100).toFixed(2),
          upScale: (row.upScale * 100).toFixed(2),
          upMaxScale: (row.upMaxScale * 100).toFixed(2),
          groupUpScale: (row.groupUpScale * 100).toFixed(2),
          groupMaxUpScale: (row.groupMaxUpScale * 100).toFixed(2)
        }
      },
      globalSetClick () {
        this.dialogFormVisible = true
      },
      search () {
        let _params = {
          confType: 1,
          plusLevel: 16
        }
        this.loading = true
        this.tableData = []
        layerSettingLIST(_params).then(response => {
          if (response.code === 200) {
            this.tableData.push(response.data || {})
            this.loading = false
          } else {
            this.loading = false
            this.$message.error(response.message)
          }
        })
      },
      handleBlur (ev) {
        // blur后若输入内容为空，处理为显示对应特权类型的最小默认值
        if (ev.target.ariaValueNow === 'undefined') this.sumbitForm.shareWorthAward = ev.target.value = ev.target.ariaValueMin
      }
    }
  }
</script>

<style lang="scss">
.redBackDetailsBox{
  padding: 20px;
}
</style>
