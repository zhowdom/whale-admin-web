<template>
  <div class="userlistwapper" style="padding:20px;">
    <el-button type="primary" v-hasPermi="['whale:interface_verify:update']" @click="addOrEdit('add')">新增</el-button>

    <!-- table-->
    <el-table highlight-current-row
      border
      id="out-table"
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
      style="width: 100%;margin-top:10px;"
      >
      <el-table-column
        header-align="center"
        align="center"
        prop="name"
        label="网络名称">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="rpcUrl"
        label="新的RPC URL">
      </el-table-column>

      <el-table-column
        header-align="center"
        align="center"
        prop="chainId"
        label="链ID">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="symbol"
        label="货币符号">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="explorerUrl"
        label="区块浏览器URL（可选）">
      </el-table-column>

      
      <el-table-column
        header-align="center"
        align="center"
        label="状态">

        <template scope="scope">
          <el-switch
          v-model="scope.row.active"
          v-hasPermi="['whale:interface_verify:change']"
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
      label="更新时间"
      align="center">
      <template slot-scope="{row}">
        {{row.updateTime ? $dayjs(row.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
    </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="操作">
        <template scope="scope">
          <el-button type="text" v-hasPermi="['whale:interface_verify:update']" @click="addOrEdit('edit', scope.row)">编辑</el-button>
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


    <el-dialog :title="curType == 'add' ? '新增网络' : '编辑网络'" :visible.sync="visibleNet">
      <el-form :model="formNet" :rules="rulesNet" ref="formNet">
        <el-form-item label="网络名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="formNet.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新的RPC URL" :label-width="formLabelWidth" prop="rpcUrl">
          <el-input v-model="formNet.rpcUrl" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="链ID" :label-width="formLabelWidth" prop="chainId">
          <el-input :disabled="curType == 'edit'" v-model="formNet.chainId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="货币符号" :label-width="formLabelWidth" prop="symbol">
          <el-input v-model="formNet.symbol" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="区块浏览器URL（可选）" :label-width="formLabelWidth">
          <el-input v-model="formNet.explorerUrl" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visibleNet = false">取 消</el-button>
        <el-button type="primary" @click="submit('formNet')">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import { nft_contractNet_page, nft_contractNet_alter, nft_contractNet_add } from "@/api/NFTMoudleManage";

export default {
  data() {
    var validatePhone = (rule, value, callback) => {
      if (!(/^1[3456789]\d{9}$/.test(value)) && value !== '') {
        return callback(new Error('请输入正确的手机号码'))
      }
      callback()
    }
    let userNameValidator = (rule, value, callback) => {
      if (!/\S/.test(value)) {
        callback(new Error('不能为空'))
      } else {
        callback()
      }
    }
    let imgValidator = (rule, value, callback) => {
      if (!/\S/.test(value)) {
        callback(new Error('请上传图片'))
      } else {
        callback()
      }
    }
    return {
      curType: '',
      formNet: {
        active: true,
        chainId: '',
        explorerUrl: '',
        name: '',
        rpcUrl: '',
        symbol: '',
        id: '',
      },
      visibleNet: false,
      beforeWatchChange: 1,
      curHandleFlags: '',
      multipleSelection: [],
      menuStatus: 'close',
      getByID: '',
      everyClickNextFans_row: {},
      cacheQueryParams: {},
      fansChain: [],
      changeStatusCloneRow: {},
      formstatus: {
        remark: ''
      },
      rulesNet: {
        name: [
          {required: true, message: '不能为空', trigger: 'change'},
        ],
        rpcUrl: [
          {required: true, message: '不能为空', trigger: 'change'},
        ],
        chainId: [
          {required: true, message: '不能为空', trigger: 'change'},
        ],
        symbol: [
          {required: true, message: '不能为空', trigger: 'change'},
        ]
      },
      rules: {
        userName: [
          { validator: userNameValidator, trigger: 'blur' }
        ],
        imageUrlSuccessHAND: [
          { validator: imgValidator, trigger: 'change,blur' }
        ],
        imageUrlSuccessBACK: [
          { validator: imgValidator, trigger: 'blur,change' }
        ],
        imageUrlSuccessFRONT: [
          { validator: imgValidator, trigger: 'blur,change' }
        ],
        imageUrlSuccessElemt: [
          { validator: imgValidator, trigger: 'blur,change' }
        ]
      },
      disableTip: '确认关闭吗？',
      enableTip: '确认开启吗？',
      formLabelWidth: '130px',
      dialogFormVisible: false,
      loading: false,
      timeZone: 1,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      tableData: [],
    }
  },
  computed: {},
  created () {},
  mounted () {
    this.isAuth.isPermi(["whale:interface_verify:page"]) && this.search()
  },
  methods: {
    submit (name) {
      this.$refs[name].validate((valid) => {
          if (valid) {
            let _curAPI = ''
            _curAPI = this.curType == 'edit' ? nft_contractNet_alter : nft_contractNet_add
            _curAPI(this.formNet).then(response => {
              if (response.code == 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  'duration': 1000,
                  onClose: () => {
                    this.search(1)
                  }
                })
                this.visibleNet = false
              } else {
                this.$message.error(response.message)
              }
            }).catch(e => {
              console.log(e)
            })
          }
      })
    },
    addOrEdit (type, row) {
      this.visibleNet = true
      this.curType = type
      this.$nextTick(() => {
        this.$refs['formNet'].resetFields()
        if (type == 'add') {
          this.formNet = {
            active: true,
            chainId: '',
            explorerUrl: '',
            name: '',
            rpcUrl: '',
            symbol: '',
            id: '',
          }
        } else {
          this.formNet = Object.assign({}, row)
        }
      })
    },
    handleBeforeWatchChange (val) {
      this.multipleSelection = []
      this.$refs.multipleTable.clearSelection()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    alterStatus (row) {
      nft_contractNet_alter(Object.assign(row, {active: row.active})).then(response => {
        if (response.code == 200) {
          this.$message({
            message: '操作成功',
            type: 'success',
            'duration': 1000,
            onClose: () => {
              this.search(1)
            }
          })
        } else {
          row.active = !row.active
          this.$message.error(response.message)
        }
      }).catch(e => {
        row.active = !row.active
        this.$message.error(response.message)
      })
    },
    watchChange (row) {
      this.$confirm(row.active ? this.enableTip : this.disableTip, row.active ? '确定开启？' : '确定关闭？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.alterStatus(row)
      }).catch(() => {
        row.active = !row.active
      })
    },
    search (pgi) {
      if (pgi) this.pageIndex = pgi
      let _params = {
        pageSize: this.pageSize,
        currentPage: this.pageIndex
      }
      this.loading = true
      nft_contractNet_page(_params).then(response => {
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
    
    handleSizeChange (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.search()
    },
  }
};
</script>
<style lang="scss">
.subEmClassNode{
  font-style: normal;
}
</style>
