<template>
  <div class="redBackDetailsBox">
    <div v-show="false" style="padding: 10px 0;text-align:right;"><el-button v-hasPermi="['agora:white:dividend:log:page']" icon="el-icon-plus" type="primary" @click="add">添加</el-button></div>
    <el-table
    :data="tableData"
    v-loading="loading"
    border
    style="width: 100%">
    <el-table-column
      prop="id"
      width="50"
      label="序号"
      align="center">
    </el-table-column>
    <el-table-column
      prop="channelName"
      width="80"
      label="合作渠道"
      align="center">
    </el-table-column>
    <el-table-column
      prop="channelTxScale"
      label="鲸丽生活收取税率"
      width="120"
      align="center">
      <template slot-scope="{row}">
          <p>{{(row.channelTxScale * 100).toFixed(0)}}%</p>
        </template>
    </el-table-column>
    <el-table-column
      prop="channelCommissionScale"
      label="鲸丽生活平台分配佣金比例"
      width="180"
      align="center">
      <template slot-scope="{row}">
          <p>{{(row.channelCommissionScale * 100).toFixed(0)}}%</p>
        </template>
    </el-table-column>
    <el-table-column
      prop="platformCommissionScale"
      label="鲸丽生活返佣给用户比例"
      width="180"
      align="center">
      <template slot-scope="{row}">
          <p>{{(row.platformCommissionScale * 100).toFixed(0)}}%</p>
        </template>
    </el-table-column>
    <el-table-column
      prop="updatedAt"
      label="最后操作时间"
      width="160"
      align="center">
      <template slot-scope="{row}">
          {{row.updatedAt ? $dayjs(row.updatedAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
    </el-table-column>
    <el-table-column
      prop="remark"
      width="180"
      label="备注"
      show-overflow-tooltip
      align="center">
    </el-table-column>
    <el-table-column
      prop="createdBy"
      width="109"
      label="操作人"
      align="center">
    </el-table-column>
    <el-table-column
      prop="percent"
      label="操作"
      align="center">
      <template scope="scope">
        <el-button size="mini" v-hasPermi="['commission:channel:save']" type="primary" @click="mdfClick(scope.row)">修改</el-button>
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
        <el-form-item label="平台：" :label-width="formLabelWidth" prop="channel">
          <el-select disabled v-model="sumbitForm.channel" placeholder="请选择">
            <el-option
              v-for="item in platformTypsList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="sumbitForm.channel !== 99" label="第三方平台收取鲸丽生活税率：" :label-width="formLabelWidth" prop="channelTxScale">
          <el-input-number @blur="handleBlur" v-model="sumbitForm.channelTxScale" :step="1" :min="0" :max="100" step-strictly controls-position="right"></el-input-number><span style="padding:0 10px;">%</span>
        </el-form-item>
        <el-form-item label="鲸丽生活平台分配佣金比例：" :label-width="formLabelWidth" prop="channelCommissionScale">
          <el-input-number @blur="handleBlur" v-model="sumbitForm.channelCommissionScale" :step="1" :min="0" :max="100" step-strictly controls-position="right"></el-input-number><span style="padding:0 10px;">%</span>
            <el-tooltip class="item" effect="dark" content="90为最大边界，目前定下固定值，不可调" placement="top-start">
            <i style="font-size: 19px;" class="el-icon-question"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="鲸丽生活返佣给用户比例：" :label-width="formLabelWidth" prop="platformCommissionScale">
          <el-input-number @blur="handleBlur" v-model="sumbitForm.platformCommissionScale" :step="1" :min="0" :max="100" step-strictly controls-position="right"></el-input-number><span style="padding:0 10px;">%</span>
        </el-form-item>
        <el-form-item label="备注：" :label-width="formLabelWidth" prop="remark">
          <el-input
            style="width:400px;"
            type="textarea"
            :rows="4"
            placeholder="请输入备注"
            v-model="sumbitForm.remark"
            maxlength="100"
            show-word-limit
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div class="wmtipsBox" v-show="+sumbitForm.channel !== 98">
        <p>第三方平台收取鲸丽生活税金 <span>=</span> 第三方平台返佣给鲸丽生活金额 <span>×</span> 第三方平台收取鲸丽生活税率</p>
        <p>鲸丽生活得到佣金净利润 <span>=</span> 第三方平台返佣给鲸丽生活金额 <span>-</span> 第三方平台收取鲸丽生活税金</p>
        <p>鲸丽生活平台可分配佣金 <span>=</span> 鲸丽生活得到佣金净利润 <span>×</span> 鲸丽生活平台分配佣金比例</p>
        <p>鲸丽生活返佣给用户基础佣金 <span>=</span> 鲸丽生活平台用户可分配佣金总额 <span>×</span> 鲸丽生活返佣给用户比例</p>
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
import { platformList, platformSave } from "@/api/commissCash/platform";
  export default {
    components: {},
    data () {
      return {
        platformTypsList: [
          {
            value: 1,
            label: '淘宝'
          },
          {
            value: 2,
            label: '京东'
          },
          {
            value: 3,
            label: '拼多多'
          },
          {
            value: 99,
            label: '自营'
          },
          {
            value: 4,
            label: '唯品会'
          },
          {
            value: 6,
            label: '美团'
          },
          {
            value: 7,
            label: '饿了吗'
          },
          {
            value: 98,
            label: '盲盒游戏'
          }
        ],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        tableData: [],
        loading: false,
        btnloading: false,
        dialogFormVisible: false,
        curTitle: '平台分佣设置',
        formLabelWidth: '219px',
        sumbitForm: {
          channel: 0,
          channelCommissionScale: 0,
          channelTxScale: 0,
          id: null,
          platformCommissionScale: 0,
          remark: ""
        },
        cloneRowData: {},
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
              channel: this.sumbitForm.channel,
              channelCommissionScale: this.sumbitForm.channelCommissionScale / 100,
              channelTxScale: this.sumbitForm.channelTxScale / 100,
              id: this.sumbitForm.id,
              platformCommissionScale: this.sumbitForm.platformCommissionScale / 100,
              remark: this.sumbitForm.remark
            }
            platformSave(_params).then((response) => {
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
        this.sumbitForm.channelCommissionScale = 0
        this.sumbitForm.channelTxScale = 0
        this.sumbitForm.platformCommissionScale = 0
        this.sumbitForm.remark = ''
        this.sumbitForm.channel = this.cloneRowData.channel
      },
      saveClick (formName) {
        this.coreRunner(formName)
      },
      mdfClick (row) {
        this.cloneRowData = Object.assign({}, row)
        this.dialogFormVisible = true
        this.sumbitForm = {
          channel: row.channel,
          channelCommissionScale: row.channelCommissionScale * 100,
          channelTxScale: row.channelTxScale * 100,
          id: row.id,
          platformCommissionScale: row.platformCommissionScale * 100,
          remark: row.remark
        }
      },
      add () {
        // 接口暂未提供
        this.dialogFormVisible = true
      },
      search (pgi) {
        if (pgi) this.pageIndex = pgi
        let _params = {
          currentPage: this.pageIndex,
          pageSize: this.pageSize
        }
        this.loading = true
        platformList(_params).then(response => {
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
        if (ev.target.ariaValueNow === 'undefined') this.sumbitForm.shareWorthAward = ev.target.value = ev.target.ariaValueMin
      }
    }
  }
</script>

<style lang="scss">
.redBackDetailsBox{
  padding: 20px;
}
.wmtipsBox{
  padding-left:23px;font-size:13px;line-height:13px;
  & p span{
    color: red;
    font-weight: bold;
  }
}
</style>
