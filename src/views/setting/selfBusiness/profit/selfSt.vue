<template>
  <div class="redBackDetailsBox" style="padding-top:0;">
    
  <el-table
    :data="tableData"
    v-loading="loading"
    border
    style="width: 100%">
    <el-table-column
      prop="prevGain"
      label="平台预留利润"
      align="center">
    </el-table-column>
    
    <el-table-column
      prop="levelGain"
      label="分给等级用户分润"
      width="150"
      align="center">
      <template slot-scope="{row}">
          {{row.remark || '-'}}
        </template>
    </el-table-column>
    <el-table-column
      prop="excutor"
      label="操作人"
      width="120"
      align="center">
      <template slot-scope="{row}">
          {{row.createdBy || '-'}}
        </template>
    </el-table-column>
    <el-table-column
      prop="updatedAt"
      label="最后操作时间"
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

<el-dialog width="30%" title="自营平台分佣配置" :visible.sync="dialogFormVisible">
  <el-form :model="form">
    <el-form-item label="平台预留分佣" :label-width="formLabelWidth">
      <el-input-number v-model="form.prevGain" :precision="2" :step="0.1" controls-position="right" @change="handleChange" @blur="handleBlur"></el-input-number><span style="padding:0 10px;">%</span>
      <el-tooltip class="item" effect="dark" placement="top-start">
        <div slot="content">
          <p>此处百分比为总利润的百分比，总利润<span style="color:red"> = </span>售价<span style="color:red"> - </span>供货价</p>
        </div>
        <i style="font-size: 19px;" class="el-icon-question"></i>
      </el-tooltip>
    </el-form-item>
    <el-form-item label="给等级用户分佣" :label-width="formLabelWidth">
      <el-input-number v-model="form.levelGain" :precision="2" :step="0.1" controls-position="right" @change="handleChange" @blur="handleBlur"></el-input-number><span style="padding:0 10px;">%</span>
      <el-tooltip class="item" effect="dark" placement="top-start">
        <div slot="content">
          <p>此处百分比为总利润的百分比，总利润<span style="color:red"> = </span>售价<span style="color:red"> - </span>供货价</p>
        </div>
        <i style="font-size: 19px;" class="el-icon-question"></i>
      </el-tooltip>
    </el-form-item>
    
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
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
        form: {
          prevGain: '',
          levelGain: '',
          excutor: ''
        },
        formLabelWidth: '120px',
        dialogFormVisible: false,
        tableData: [
          {
            prevGain: 12,
            levelGain: '合伙人',
            excutor: 0.23,
            excutor: '张三',
            updatedAt: '2021-5-20: 18:23:02'
          }
        ],
        loading: false
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
      // this.search()
    },
    watch: {},
    methods: {
      mdfClick (row) {
        this.dialogFormVisible = true
        this.form = Object.assign({}, row)
      },
      handleChange(value) {
        this.$forceUpdate()
      },
      handleBlur (ev) {
        // blur后若输入内容为空，处理为显示对应特权类型的最小默认值
        if (ev.target.ariaValueNow === 'undefined') { ev.target.value = ev.target.ariaValueMin }
      }
    }
  }
</script>

<style lang="scss">

</style>
