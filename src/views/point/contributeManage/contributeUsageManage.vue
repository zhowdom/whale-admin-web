<template>
  <div class="usageBox">
    <div style="padding: 10px 0;text-align:right;"><el-button v-hasPermi="['dedicate:worth:use:setting:add']" icon="el-icon-plus" type="primary" @click="addClick">新增</el-button></div>
    <el-table
    :data="tableData"
    v-loading="loading"
    border
    style="width: 100%">
    <el-table-column
      prop="id"
      width="60px"
      label="序号"
      align="center">
    </el-table-column>
    <el-table-column
      label="转赠额度+手续费"
      align="center">
      <template scope="scope">
        <p v-if="scope.row.withdrawMax === ''">{{scope.row.withdrawMin}} - 无限制</p>
        <p v-else>{{scope.row.withdrawMin}} - {{scope.row.withdrawMax}}</p>
      </template>
    </el-table-column>
    <el-table-column
      label="荣耀值消耗基数"
      width="120"
      align="center">
      <template scope="scope">
        <p>{{scope.row.dedicateWorthConsumeRate}}</p>
      </template>
    </el-table-column>
    <el-table-column
      prop="description"
      show-overflow-tooltip
      label="消耗约束及说明"
      align="center">
    </el-table-column>
    <el-table-column
      prop="modifyAt"
      label="最后操作时间"
      width="160"
      align="center">
      <template slot-scope="{row}">
          {{row.modifyAt ? $dayjs(row.modifyAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
    </el-table-column>
    <el-table-column
      prop="executor"
      label="操作人"
      width="160"
      align="center">
    </el-table-column>
    <el-table-column
      prop="percent"
      width="100"
      label="操作"
      align="center">
      <template scope="scope">
         <!-- <el-button v-show="false" size="mini" v-hasPermi="['agora:white:dividend:log:page']" type="primary" @click="delClick">删除</el-button> -->
        <el-button size="mini" v-hasPermi="['dedicate:worth:use:setting:update']" type="primary" @click="mdfClick(scope.row)">修改</el-button>
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

    <el-dialog :title="curTitle" :visible.sync="dialogFormVisible" width="45%">
      <el-form :model="sumbitForm" ref="ruleForm" :rules="rules" class="customyFormStyle">
        <el-form-item label="转赠额度+手续费" :label-width="formLabelWidth" prop="ifNolimit_share">
          <div class="unboxstyle clearfix specialStyle">
            <el-input-number class="fl" controls-position="right" :controls="false" v-model="sumbitForm.withdrawMin" :step="1" :min="0" step-strictly @blur="handleBlur"></el-input-number>
            <span class="fl">-</span>
            <el-input-number class="fl" controls-position="right" :controls="false" v-model="sumbitForm.withdrawMax" :step="1" :min="0" step-strictly @blur="handleBlur"></el-input-number>
          </div>
        </el-form-item>
        <el-form-item label="荣耀值消耗基数" :label-width="formLabelWidth" prop="dedicateWorthConsumeRate">
          <el-input-number controls-position="right" v-model="sumbitForm.dedicateWorthConsumeRate" :step="1" :min="0" :max="999" step-strictly @blur="handleBlur"></el-input-number><span class="unit"></span>
        </el-form-item>
        <el-form-item label="消耗约束及说明" :label-width="formLabelWidth" prop="description">
          <el-input
            style="width:80%" 
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            maxlength="30"
            show-word-limit
            v-model.trim="sumbitForm.description">
          </el-input>
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="resetForm('ruleForm')">重 置</el-button>
        <el-button type="primary" :loading="btnloading" @click="saveClick('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { contributeUseList, contributeUseListAlter, contributeUsageAdd } from "@/api/pointsMgmt/shareUsageGain";
  export default {
    components: {},
    data () {
      let checkCharge = (rule, value, callback) => {
        if (!/\S/.test(value)) {
          return callback(new Error('不能为空'))
        }
        callback()
      }
      let checkLV = (rule, value, callback) => {
        if (!/\S/.test(value)) {
          return callback(new Error('不能为空'))
        }
        if (!Number.isFinite(+value) || !Number.isInteger(+value) || Math.sign(+value) < 0) {
          return callback(new Error('请输入大于等于零的正整数'))
        }
        if (value === '-0' || value === '00' || value === '.0' || value === '0.') {
          this.sumbitForm.levelDescription = 0
        }
        callback()
      }
      let checkPresent = (rule, value, callback) => {
        if (!/\S/.test(value)) {
          return callback(new Error('不能为空'))
        }
        callback()
      }
      let checkShare = (rule, value, callback) => {
        if (value) {
          if (!/\S/.test(this.sumbitForm.withdrawMax)) {
            return callback(new Error('不能为空'))
          }
          callback()
        } else {
          if (!/\S/.test(this.sumbitForm.withdrawMin) || !/\S/.test(this.sumbitForm.withdrawMax)) {
            return callback(new Error('不能为空'))
          }
          if (+this.sumbitForm.withdrawMin > +this.sumbitForm.withdrawMax) {
            return callback(new Error('请输入正确的分享值区间'))
          }
          callback()
        }
      }
      return {
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        tableData: [],
        loading: false,
        btnloading: false,
        dialogFormVisible: false,
        curTitle: '分享值获得设置',
        formLabelWidth: '160px',
        sumbitForm: {
          dedicateWorthConsumeRate: '',
          description: '',
          levelDescription: '',
          withdrawMoreThan: '',
          withdrawMin: '',
          withdrawMax: '',
          transferRate: 0,
          transferQuantityLimit: '',
          ifNolimit_present: false,
          ifNolimit_share: false,
          clickType: false
        },
        rules: {
          levelDescription: [
            { validator: checkLV, trigger: 'blur' }
          ],
          transferRate: [
            { validator: checkCharge, trigger: 'blur' }
          ],
          ifNolimit_present: [
            { validator: checkPresent, trigger: 'blur' }
          ],
          ifNolimit_share: [
            { validator: checkShare, trigger: 'blur' }
          ]
        },
        cloneRowData: {},
        curClickType: ''
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
              id: this.cloneRowData.id,
              dedicateWorthConsumeRate: this.sumbitForm.dedicateWorthConsumeRate, // 荣耀值消耗基数
              description: this.sumbitForm.description, // 荣耀值消耗基数
              withdrawMax: this.sumbitForm.withdrawMax,
              withdrawMin: this.sumbitForm.withdrawMin
            }
            let _methods = this.curClickType === 'add' ? contributeUsageAdd : contributeUseListAlter
            _methods(_params).then((response) => {
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
              this.dialogFormVisible = false
              this.btnloading = false
              if (error) this.$message.error(error.message)
            })
          }
        })
      },
      saveClick (formName) {
        this.coreRunner(formName)
      },
      delClick () {},
      resetForm (formName) {
        this.$refs[formName].resetFields()
        this.sumbitForm.withdrawMoreThan = ''
        this.sumbitForm.withdrawMin = ''
        this.sumbitForm.withdrawMax = ''
        this.sumbitForm.transferQuantityLimit = ''
        this.sumbitForm.transferRate = 0
        this.sumbitForm.dedicateWorthConsumeRate = 0
        this.sumbitForm.description = ''
        this.sumbitForm.levelDescription = ''
        this.sumbitForm.ifNolimit_share = this.sumbitForm.ifNolimit_present = false
      },
      mdfClick (row) {
        this.dialogFormVisible = true
        // 判断所需分享值区间、转赠数量限制，是否是无限制（勾选状态）
        this.sumbitForm.ifNolimit_share = +row.withdrawMax === -1
        this.sumbitForm.ifNolimit_present = +row.transferQuantityLimit === -1
        this.sumbitForm.withdrawMoreThan = row.withdrawMin
        this.sumbitForm.withdrawMin = row.withdrawMin
        this.sumbitForm.withdrawMax = row.withdrawMax
        this.sumbitForm.transferQuantityLimit = row.transferQuantityLimit
        this.sumbitForm.levelDescription = row.levelDescription
        this.sumbitForm.description = row.description
        // this.sumbitForm.transferRate = row.transferRate
        this.sumbitForm.dedicateWorthConsumeRate = row.dedicateWorthConsumeRate
        this.sumbitForm.clickType = true
        this.curClickType = 'edit'
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate('levelDescription')
        })
        this.cloneRowData = Object.assign({}, row)
      },
      addClick () {
        this.dialogFormVisible = true
        this.sumbitForm.clickType = false
        this.curClickType = 'add'
        this.$nextTick(() => {
          this.resetForm('ruleForm')
        })
      },
      search (pgi) {
        if (pgi) this.pageIndex = pgi
        let _params = {
          currentPage: this.pageIndex,
          pageSize: this.pageSize
        }
        this.loading = true
        contributeUseList(_params).then(response => {
          if (response.code === 200) {
            this.tableData = []
            let combinedObj
            combinedObj = response.data.list.map((val, index, arr) => {
              let _json = {}
              _json.levelDescription = val.levelDescription && val.levelDescription.replace(/[A-z]{1,}/g, '')
              return _json
            })
            for (let [k, s] of Object.entries(response.data.list)) {
              this.tableData.push(Object.assign(s, combinedObj[k]))
            }
            this.totalPage = response.data.total || response.data.list.length
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
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.search()
      },
      handleBlur (ev) {
        // blur后若输入内容为空，处理为显示对应特权类型的最小默认值
        if (ev.target.ariaValueNow === 'undefined') this.sumbitForm.count = ev.target.value = ev.target.ariaValueMin
      }
    }
  }
</script>

<style lang="scss">
.redBackDetailsBox{
  padding: 20px;
}
.unboxstyle{
  & div.fl{
    width:80px;
    & input{
      text-align: center;
    }
  }
  & span.fl{
    padding: 0 14px;
  }
}
.morethanstyle{
  & div.fl{
    width:130px;
    & input{
      text-align: center;
    }
  }
  & span.fl{
    padding-right:5px;
  }
}
.usageBox{
  padding: 20px;
  .unit{
    padding: 0 10px;
  }
  & .customyFormStyle{
    border-left:1px solid #ccc;
    border-right:1px solid #ccc;
    border-top:1px solid #ccc;
    .el-form-item{
      border-bottom: 1px solid #ccc;
      margin-bottom: 0!important;
      & .el-form-item__label{
        padding-top: 16px;
      }
      & .el-form-item__content{
        padding: 16px 0!important;
        border-left:1px solid #ccc;
        padding-left: 16px!important;
      }
    }
  }
  .specialStyle{
    padding-top: 16px;
  }
  .noLimited{
    color: green;
  }
}
</style>
