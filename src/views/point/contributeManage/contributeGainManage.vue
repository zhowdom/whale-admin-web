<template>
  <div class="redBackDetailsBox">
    <div style="padding: 10px 0;text-align:right;"><el-button v-hasPermi="['dedicate:worth:get:setting:add']" icon="el-icon-plus" type="primary" @click="addClick">新增</el-button></div>
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
      prop="incomeSource"
      label="荣耀值收入来源"
      align="center">
    </el-table-column>
    <el-table-column
      label="荣耀值奖励系数"
      width="120"
      align="center">
      <template slot-scope="{row}">
          <p>{{row.dedicateWorthRate * 100}}%</p>
        </template>
    </el-table-column>
    <el-table-column
      prop="description"
      label="计算荣耀值说明"
      show-overflow-tooltip
      align="center">
    </el-table-column>
    <el-table-column
    align="center"
      prop="statusType"
      width="100px"
      label="启用状态">
      <template scope="scope">
        <el-switch
        v-hasPermi="['dedicate:worth:get:setting:status:change']"
        v-model="scope.row.statusType"
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
      prop="modifyAt"
      width="160"
      label="最后操作时间"
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
      width="100px"
      label="操作"
      align="center">
      <template scope="scope">
        <el-button size="mini" v-hasPermi="['dedicate:worth:get:setting:update']" type="primary" @click="mdfClick(scope.row)">修改</el-button>
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

    <el-dialog :title="curTitle" :visible.sync="dialogFormVisible">
      <el-form :model="sumbitForm" ref="ruleForm">
        <el-form-item label="荣耀值收入来源：" :label-width="formLabelWidth" prop="incomeSource">
          <el-select :disabled="clickType === 'edit'" @change="watchChanged" v-model="sumbitForm.incomeSource" placeholder="请选择">
            <el-option label="请选择" value=""></el-option> 
            <el-option
              v-for="item in sourceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select>
        </el-form-item>

        <el-form-item v-show="sumbitForm.type !== ''" label="荣耀值奖励系数：" :label-width="formLabelWidth" prop="dedicateWorthRate">
          <el-input-number controls-position="right" v-model="sumbitForm.dedicateWorthRate" :step="1" :min="0" :max="999" step-strictly @blur="handleBlur"></el-input-number><span style="padding-left:5px;" class="unit">%</span>
        </el-form-item>

        <el-form-item v-show="sumbitForm.type !== ''" label="计算荣耀值说明：" :label-width="formLabelWidth" prop="description">
          <el-input
            type="textarea"
            :placeholder="sumbitForm.placeholder"
            v-model="sumbitForm.description"
            maxlength="30"
            show-word-limit
          >
          </el-input>
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button :disabled="sumbitForm.incomeSource === ''" type="primary" :loading="btnloading" @click="saveClick('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { contributeGainList, contributeGainStatusAlter, contributeGainListAlter, contributeGainAdd, contributeGainTypes } from "@/api/pointsMgmt/shareUsageGain";
  export default {
    components: {},
    data () {
      return {
        clickType: '',
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        tableData: [],
        loading: false,
        btnloading: false,
        dialogFormVisible: false,
        curTitle: '荣耀值获得设置',
        formLabelWidth: '160px',
        sumbitForm: {
          incomeSource: '',
          dedicateWorthRate: 0,
          description: '',
          placeholder: '',
          type: ''
        },
        cloneRowData: {},
        sourceOptions: []
      }
    },
    created () {
      this.queryTypes()
    },
    mounted () {
      this.search()
    },
    watch: {},
    methods: {
      watchChanged (val) {
        this.sumbitForm.type = val
        let _res = this.sourceOptions.find(v => v['value'] === val)
        this.sumbitForm.incomeSource = _res ? _res.label : ''
        switch (val) {
          case '1':
            this.sumbitForm.placeholder = '当天做完任务券所有任务奖励，获得的“Candy总额”X荣耀值奖励系数'
            break
          case '2':
            this.sumbitForm.placeholder = '分红所得“CandyX荣耀值奖励系数'
            break
          case '3':
            this.sumbitForm.placeholder = '分红所得“CandyX荣耀值获赠系数'
            break
          case '':
            this.sumbitForm.placeholder = ''
            break
        }
      },
      queryTypes () {
        contributeGainTypes().then(response => {
            if (response.code === 200) {
              this.sourceOptions = []
              for (let [k, s] of Object.entries(response.data)) {
                this.sourceOptions.push({
                  value: k,
                  label: s
                })
              }
            } else {
              this.$message.error(response.message)
            }
          }).catch(({ error }) => {
            if (error) this.$message.error(error.message)
          })
      },
      watchChange (val) {
        this.$confirm(`确认要执行此操作吗？`, '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _params = {}
          _params.id = val.id
          _params.statusType = val.statusType ? 1 : 0 // val === true -> 正常，传1；否则 val === false 禁用，传0
          contributeGainStatusAlter(_params).then(response => {
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
            if (error) this.$message.error(error.message)
          })
        }).catch(() => {
          val.statusType = !val.statusType
        })
      },
      coreRunner (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.btnloading = true
            let _params = {
              id: this.cloneRowData.id,
              incomeSource: this.sumbitForm.incomeSource,
              type: this.sumbitForm.type,
              dedicateWorthRate: this.sumbitForm.dedicateWorthRate / 100,
              description: this.sumbitForm.description
            }
            let _methods = this.clickType === 'add' ? contributeGainAdd : contributeGainListAlter
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
              this.btnloading = false
              this.dialogFormVisible = false
              if (error) this.$message.error(error.message)
            })
          }
        })
      },
      saveClick (formName) {
        this.coreRunner(formName)
      },
      mdfClick (row) {
        this.clickType = 'edit'
        this.cloneRowData = Object.assign({}, row)
        this.dialogFormVisible = true
        this.sumbitForm.incomeSource = row.incomeSource
        this.sumbitForm.dedicateWorthRate = row.dedicateWorthRate * 100
        this.sumbitForm.description = row.description
        this.sumbitForm.type = row.type
      },
      addClick () {
        this.clickType = 'add'
        this.sumbitForm = {
          type: '',
          incomeSource: '',
          dedicateWorthRate: 0,
          description: '',
          placeholder: ''
        }
        this.dialogFormVisible = true
      },
      search (pgi) {
        if (pgi) this.pageIndex = pgi
        let _params = {
          currentPage: this.pageIndex,
          pageSize: this.pageSize
        }
        this.loading = true
        contributeGainList(_params).then(response => {
          this.loading = false
          if (response.code === 200) {
            this.totalPage = response.data.total || response.data.list.length
            this.tableData = (response.data.list || []).map((val, index, arr) => {
              let _iteam = {}
              _iteam = Object.assign({}, val)
              _iteam.statusType = _iteam.statusType === 1 ? true : false
              return _iteam
            })
          } else {
            this.tableData = []
            this.totalPage = 0
            this.pageSize = 10
            this.$message.error(response.message)
          }
        }).catch(({ error }) => {
          this.loading = false
          if (error) this.$message.error(error.message)
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
</style>

