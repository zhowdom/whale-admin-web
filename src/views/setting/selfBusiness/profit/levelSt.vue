<template>
  <div class="redBackDetailsBox" style="padding-top:0;">
    
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
      prop="name"
      label="等级名称"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      prop="gain"
      label="所获分佣"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      prop="memo"
      label="备注"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      prop="excutor"
      width="160"
      label="操作人"
      align="center">
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


  <el-dialog width="30%" title="等级分润配置" :visible.sync="dialogFormVisible">
  <el-form :model="form">
    <el-form-item label="不分润" :label-width="formLabelWidth">
      <el-checkbox v-model="form.disPatch"></el-checkbox>
    </el-form-item>
    <el-form-item label="等级名称" :label-width="formLabelWidth">
      <el-input v-model="form.name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="所获分润" :label-width="formLabelWidth">
      <el-input-number v-model="form.gain" :precision="2" :step="0.1" controls-position="right" @change="handleChange" @blur="handleBlur"></el-input-number><span style="padding:0 10px;">%</span>
    </el-form-item>
    <el-form-item label="备注" :label-width="formLabelWidth">
      <el-input
        type="textarea"
        placeholder="请输入内容"
        v-model="form.memo"
        maxlength="30"
        show-word-limit>
      </el-input>
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
          name: '',
          gain: '',
          memo: '',
          disPatch: false
        },
        formLabelWidth: '120px',
        dialogFormVisible: false,
        tableData: [
          {
            id: 12,
            name: '合伙人',
            gain: 0.23,
            excutor: '张三',
            memo: '俺是备注',
            disPatch: false,
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
