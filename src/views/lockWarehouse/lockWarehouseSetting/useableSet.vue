<template>
  <div class="jdtDetailBox">
    
    <el-button type="primary" icon="el-icon-plus" @click="add" style="margin-bottom:20px;">新增</el-button>

    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="序号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="inviteCode"
        label="生息基数范围"
        width="180">
        <template scope="scope">
          <span>{{scope.row.minNum}}</span>-<span>{{scope.row.maxNum}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="ratio"
        label="生息比例（‱）">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="说明">
      </el-table-column>
      
      <el-table-column
        prop="updatedAt"
        label="更新时间">
        <template slot-scope="{row}">
          {{row.updatedAt ? $dayjs(row.updatedAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="updatedBy"
        label="操作人">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="{row}">
          <el-button type="primary" @click="mdfclick(row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
    style="margin-top:10px;"
      @current-change="search"
      :page-sizes="[10, 20, 30]"
      @size-change="handleSizeChange"
      :current-page.sync="pageIndex"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage">
    </el-pagination>


    <el-dialog width="39%" title="可用JDT生息比例配置" :visible.sync="dialogFormVisibleStatus">
      <el-form :model="formstatus">
        <el-form-item label="可用基数范围" :label-width="formLabelWidth">
          <el-input-number controls-position="right" size="mini" v-model="formstatus.minNum" :min="0" :max="1000000" :step="1" step-strictly></el-input-number>
          <span style="padding:0 10px;">-</span>
          <el-input-number controls-position="right" size="mini" v-model="formstatus.maxNum" :min="0" :max="1000000" :step="1" step-strictly></el-input-number>
          <p style="font-size:12px;"><span style="color:red;">* </span>在某范围-取相应比例，针对【昨日可用JDT】而言</p>
        </el-form-item>
        <el-form-item label="生息比例" :label-width="formLabelWidth">
          <el-input-number controls-position="right" v-model="formstatus.ratio" :min="0" :max="1000000" :step="1" step-strictly></el-input-number><span style="padding-left:10px;">‱</span>
        </el-form-item>
        <el-form-item label="说明" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="formstatus.remark" autocomplete="off" show-word-limit maxlength="30"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleStatus = false">取 消</el-button>
        <el-button v-show="curActType === 'add'" type="primary" @click="sureStatusClick('add')">确 定</el-button>
        <el-button v-show="curActType === 'mdf'" type="primary" @click="sureStatusClick('mdf')">确 定</el-button>
      </div>
    </el-dialog>


    
  </div>
</template>

<script>
import { jdtDetailList, jdtDetailToufu, jdtSetMdf, jdtSetAdd, jdtSetList, jdtSetInfo } from "@/api/lockWarehouse";
  export default {
    components: {},
    data () {
      var validatePhone = (rule, value, callback) => {
        if (!(/^1[3456789]\d{9}$/.test(value)) && value !== '') {
          return callback(new Error('请输入正确的手机号码'))
        }
        callback()
      }
      return {
        curActType: 1,
        formstatus: {
          minNum: 0,
          maxNum: 0,
          ratio: 0,
          remark: '',
          type: 2
        },
        dialogFormVisibleStatus: false,
        formLabelWidth: '120px',
        reMap: {},
        rules: {
          phone: [
            { validator: validatePhone, trigger: 'blur' }
          ]
        },
        loading: false,
        queryParams: {
          inviteCode: '',
          phone: '',
          sourceType: '',
          nickName: '',
          regtime: []
        },
        pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
        tableData: []
      }
    },
    created () {},
    mounted () {
      this.search(1)
    },
    watch: {},
    methods: {
      mdfclick (row) {
        this.formstatus = JSON.parse(JSON.stringify(row))
        this.curActType = 'mdf'
        this.dialogFormVisibleStatus = true
      },
      add () {
        this.curActType = 'add'
        this.dialogFormVisibleStatus = true
        this.formstatus = {
          minNum: 0,
          maxNum: 0,
          ratio: 0,
          remark: '',
          type: 2
        }
      },
      sureStatusClick (type) {
        let _api = type === 'add' ? jdtSetAdd : jdtSetMdf
        _api(this.formstatus).then(response => {
        if (+response.code === 200 && response.data.result) {
          this.$message.success('操作成功');
          this.dialogFormVisibleStatus = false
          this.search(1)
        } else {
          this.$message.error(response.message)
        }
      })
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.search()
      },
      search (pgi) {
        if (pgi) this.pageIndex = pgi
        let _params = {
          pageSize: this.pageSize,
          currentPage: this.pageIndex,
          type: 2
        }
        this.loading = true
        jdtSetList(_params).then(response => {
          if (response.code === 200) {
            this.tableData = response.data.list
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
    }
  }
</script>

<style lang="scss" scoped>
.tofuJdt{
  li{
    width:200px;
    height:100px;
    border-radius: 10px;
    text-align: center;
    border: 1px solid #eaeefb;
    float: left;
    margin-right: 20px;
  }
}
</style>

