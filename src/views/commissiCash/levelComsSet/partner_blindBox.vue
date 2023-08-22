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
          prop="selfBaseScale"
          label="返佣比例"
          align="center"
          >
          <template scope="scope">
            <p>{{scope.row.selfBaseScale|valTransfer}}</p>
          </template>
      </el-table-column>
      <el-table-column
          prop="subsidizeScale"
          align="center"
          width="200"
          label="平台补贴比例"
          >
          <template scope="scope">
            <p>{{scope.row.subsidizeScale|valTransfer}}</p>
          </template>
      </el-table-column>
    </el-table-column>
    <el-table-column label="下级别购物返佣" align="center">
      <el-table-column
          prop="partnerLevel1Scale"
          width="180"
          label="一级合伙人购物返佣比例"
          align="center"
          >
          <template scope="scope">
            <p>{{scope.row.partnerLevel1Scale|valTransfer}}</p>
          </template>
      </el-table-column>
      <el-table-column
          prop="partnerLevel2Scale"
          align="center"
          width="200"
          label="二级合伙人购物返佣比例"
          show-overflow-tooltip
          >
          <template scope="scope">
            <p>{{scope.row.partnerLevel2Scale|valTransfer}}</p>
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
      <template scope="scope">
        <el-button size="mini" v-hasPermi="['commission:plus:save']" type="primary" @click="mdfClick(scope.row)">修改</el-button>
      </template>
    </el-table-column>
  </el-table>
 

    <el-dialog :title="curTitle" :visible.sync="dialogFormVisible" class="commissiCashDialog">
      <el-form :model="sumbitForm" ref="ruleForm">
        <el-form-item class="addtionBD" label="等级：" :label-width="formLabelWidth">
          <el-input style="width:200px;" v-model="cloneRowData.plusName" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        
        <div class="clearfix">
          <p class="fl" style="font-weight:bold;padding:20px 0;">分佣设置（现金分佣）</p>
          <el-tooltip class="item fl" effect="dark" placement="top-start">
            <div slot="content">
              <p>合伙人自购返佣 <span style="color:red">=</span> 返佣金额 <span style="color:red">+</span> 平台补贴</p>
              <p>返佣金额 <span style="color:red">=</span> 基础佣金 <span style="color:red">×</span> 返佣比例</p>
              <p>平台补贴 <span style="color:red">=</span> 基础佣金 <span style="color:red">×</span> 平台补贴比例</p>
            </div>
            <i style="font-size: 19px;margin-top:19px;" class="el-icon-question"></i>
          </el-tooltip>
        </div>

        <div style="border:1px solid #ccc;border-bottom:none;padding:10px 0;text-indent:10px;"><p>团长自购返佣</p></div>
        <el-form-item label="返佣比例：" :label-width="formLabelWidth" prop="selfBaseScale">
          <el-input-number @blur="handleBlur" :precision="2" v-model="sumbitForm.selfBaseScale" :step="1" :min="0" controls-position="right"></el-input-number><span style="padding:0 10px;">%</span>
        </el-form-item>
        <el-form-item label="平台补贴比例：" :label-width="formLabelWidth" prop="subsidizeScale">
          <el-input-number @blur="handleBlur" :precision="2" v-model="sumbitForm.subsidizeScale" :step="1" :min="0" controls-position="right"></el-input-number><span style="padding:0 10px;">%</span>
        </el-form-item>

        <div class="clearfix" style="border:1px solid #ccc;border-bottom:none;padding:10px 0;"><p class="fl" style="padding-right:10px;text-indent:10px;">合伙人下级购物返佣</p>
          <el-tooltip class="item fl" effect="dark" placement="top-start">
            <div slot="content">
              <p>例如：</p>
              <p>一、用户B为用户A（A角色为合伙人）的一级合伙人</p>
              <p style="text-indent:8px;">计算出用户B的基础佣金45USDT，设置一级合伙人购物返佣12%，则返给上级用户A的佣金为45 <span style="color:red">×</span> 12% <span style="color:red">=</span> 5.4USDT</p>
              <br>
              <p>二、用户C为用户A（A角色为合伙人）的二级合伙人</p>
              <p style="text-indent:8px;">计算出用户C的基础佣金45USDT，设置二级合伙人购物返佣4%，则返给上级用户</p>
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
        <p style="text-indent:10px;">2.直推⼀级合伙人、间推⼆级合伙人升级成为⽐⾃⼰⼤的等级后，返佣脱离关系（即升级为团长或高级高长）</p>
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
          remark: ''
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
              confType: 2,
              plusLevel: this.sumbitForm.plusLevel,
              selfBaseScale: this.sumbitForm.selfBaseScale / 100,
              subsidizeScale: this.sumbitForm.subsidizeScale / 100,
              partnerLevel1Scale: this.sumbitForm.partnerLevel1Scale / 100,
              partnerLevel2Scale: this.sumbitForm.partnerLevel2Scale / 100,
              remark: this.sumbitForm.remark
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
          remark: row.remark || ''
        }
      },
      globalSetClick () {
        this.dialogFormVisible = true
      },
      search () {
        let _params = {
          confType: 2,
          plusLevel: 1 // 1合伙人\8团长\16高级团长
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
.commissiCashDialog {
  p{
    margin: 0;
    padding: 0;
  }
  .addtionBD{
    border-bottom: 1px solid #ccc;
  }
  .el-form-item {
    margin-bottom: 0;
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
  }
  .el-form-item__content{
    padding: 10px 0 10px 10px;
    border-left:1px solid #ccc;
  }
  label.el-form-item__label{
    padding: 10px 0;
  }
}
</style>
