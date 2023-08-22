<template>
  <div class="redBackDetailsBox">
    <!-- <div v-show="false" style="padding: 10px 0;text-align:right;"><el-button v-hasPermi="['agora:white:dividend:log:page']" icon="el-icon-setting" type="primary" @click="globalSetClick">全局配置</el-button></div> -->
    <el-table
    :data="tableData"
    v-loading="loading"
    border
    style="width: 100%">
    <el-table-column
      prop="id"
      label="序号"
      align="center">
    </el-table-column>
    <el-table-column
      prop="incomeSource"
      label="分享值来源"
      align="center">
    </el-table-column>
    <el-table-column
      prop="shareWorthAward"
      label="分享值奖励单个数值"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      prop="expireDay"
      label="有效期"
      width="120"
      align="center">
      <template slot-scope="{row}">
          <p v-if="+row.executeType === 1">{{row.expireDay}}天</p>
          <p v-else-if="+row.executeType === 2">不过期</p>
          <p v-else>随直推“活跃值”为0而过期</p>
        </template>
    </el-table-column>
    <el-table-column
      prop="description"
      label="计算分享值说明"
      show-overflow-tooltip
      align="center">
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
      label="操作"
      align="center">
      <template scope="scope">
        <el-button size="mini" v-hasPermi="['share:worth:get:setting:update']" type="primary" @click="mdfClick(scope.row)">修改</el-button>
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
          <el-input style="width:200px;" v-model="sumbitForm.incomeSource" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="分享值奖励单个数值：" :label-width="formLabelWidth" prop="shareWorthAward">
          <el-input-number @blur="handleBlur" v-model="sumbitForm.shareWorthAward" :step="1" :min="0.01" :precision="2" controls-position="right"></el-input-number><span style="padding:0 10px;">个</span>
        </el-form-item>
        <el-form-item label="计算分享值说明：" :label-width="formLabelWidth" prop="description">
          <el-input
            style="width:400px;"
            type="textarea"
            :rows="4"
            placeholder="每直推一个用户，该直推的用户完成实名认证完成后, 获得50个分享值"
            v-model="sumbitForm.description"
            maxlength="100"
            show-word-limit
          >
          </el-input>
        </el-form-item>
      </el-form>
      <!--new add-->
      <div class="shareGainNewAddBox">
        <div class="inner">
          <div class="each">
            <el-radio v-model="radioSelected" label="1">分享值过期时间</el-radio>
            <el-input-number @blur="handleBlur" v-model="sumbitForm.expireDay" :step="1" :min="0" :precision="0" controls-position="right" step-strictly></el-input-number><span style="padding:0 10px;">天</span>
            <p>配置“分享值过期时间”后，分享值从当前时间开始*天后会过期，过期后不可恢复</p>
          </div>
          <div class="each">
            <el-radio v-model="radioSelected" label="2">不过期</el-radio>
            <p>配置“不过期”后分享值从当前开始永不过期</p>
          </div>
          <div class="each" v-if="cloneRowData.incomeSource !== '拆包'">
            <el-radio v-model="radioSelected" label="3">直推用户“活跃值”为0则，原来该直推用户实名，给我生产的“分享值”过期</el-radio>
            <p>配置后，当我的直推活跃值为0时，对应的直推给我产生的50个分享值将会过期，当直推活跃值大于0时此直推给我产生的50个活跃值将会重新恢复。</p>
          </div>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="resetForm('ruleForm')">重 置</el-button>
        <el-button type="primary" :loading="btnloading" @click="saveClick('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { shareGainList, shareGainAlter } from "@/api/pointsMgmt/shareUsageGain";
  export default {
    components: {},
    data () {
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
          incomeSource: '',
          shareWorthAward: '',
          description: '',
          expireDay: 0
        },
        cloneRowData: {},
        radioSelected: '1'
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
              description: this.sumbitForm.description,
              id: this.cloneRowData.id,
              incomeSource: this.sumbitForm.incomeSource,
              shareWorthAward: this.sumbitForm.shareWorthAward,
              type: this.cloneRowData.type,
              expireDay: this.sumbitForm.expireDay,
              executeType: +this.radioSelected
            }
            if (+this.radioSelected !== 1) {
              Reflect.deleteProperty(_params, 'expireDay')
            }
            shareGainAlter(_params).then((response) => {
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
        this.sumbitForm.shareWorthAward = 0
        this.sumbitForm.description = ''
      },
      saveClick (formName) {
        this.coreRunner(formName)
      },
      mdfClick (row) {
        this.cloneRowData = Object.assign({}, row)
        this.dialogFormVisible = true
        this.sumbitForm = {
          incomeSource: row.incomeSource,
          shareWorthAward: row.shareWorthAward,
          description: row.description,
          expireDay: row.expireDay
        }
        this.radioSelected = row.executeType + ''
      },
      globalSetClick () {
        this.dialogFormVisible = true
      },
      search (pgi) {
        if (pgi) this.pageIndex = pgi
        let _params = {
          currentPage: this.pageIndex,
          pageSize: this.pageSize
        }
        this.loading = true
        shareGainList(_params).then(response => {
          if (response.code === 200) {
            this.tableData = response.data.list
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
        if (ev.target.ariaValueNow === 'undefined') ev.target.value = ev.target.ariaValueMin
      }
    }
  }
</script>

<style lang="scss">
.redBackDetailsBox{
  padding: 20px;
}
.shareGainNewAddBox{
  border: 1px solid #ccc;
  border-radius:5px;
  .inner{
    padding-top: 20px;
    width: 80%;
    margin:0 auto;
    .each {
      margin-bottom: 42px;
      p{
        color: #999797;
        font-size: 13px;
      }
    }
  }
}
</style>
