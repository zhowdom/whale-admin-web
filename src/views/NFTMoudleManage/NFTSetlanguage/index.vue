<template>
  <div class="userlistwapper" style="padding:20px;">

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
        label="语言">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="sort"
        label="排序">
      </el-table-column>
      
      <el-table-column
        header-align="center"
        align="center"
        label="状态">

        <template scope="scope">
          <el-switch
          v-model="scope.row.status"
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
        {{row.createTime ? $dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
    </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="操作">
        <template scope="scope">
          <el-button type="text" v-hasPermi="['whale:interface_verify:update']" @click="handleEditTips(scope)">排序</el-button>
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

  </div>
</template>

<script>
import { nft_lanList, nft_lanSort, nft_lanEnable } from "@/api/NFTMoudleManage";

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
      rulesTop: {
        phone: [
          { validator: validatePhone, trigger: 'blur' }
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
    handleEditTips (scope) {
      this.$prompt('排序:', '修改排序', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'apiEnableTip',
        inputValue: scope.row.sort || '',
        inputPattern: /^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/,
        inputErrorMessage: '请输入正整数'
      }).then(({ value }) => {
        this.alterTips(Object.assign(scope.row, {str: value}))
      }).catch((e) => {
        console.log(e)
      });
    },
    handleBeforeWatchChange (val) {
      this.multipleSelection = []
      this.$refs.multipleTable.clearSelection()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    alterTips (opt) {
      nft_lanSort({
        sort: opt.str,
        id: opt.id
      }).then(response => {
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
          this.$message.error(response.message)
        }
      }).catch(e => {
        this.$message.error(response.message)
      })
    },
    alterStatus (opt) {
      nft_lanEnable({
        id: opt.id
      }).then(response => {
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
          opt.status = !opt.status
          this.$message.error(response.message)
        }
      }).catch(e => {
        opt.status = !opt.status
        this.$message.error(response.message)
      })
    },
    watchChange (val) {
      this.$confirm(val.status ? this.enableTip : this.disableTip, val.status ? '确定开启？' : '确定关闭？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.alterStatus(val)
      }).catch(() => {
        val.status = !val.status
      })
    },
    search (pgi) {
      if (pgi) this.pageIndex = pgi
      let _params = {
        pageSize: this.pageSize,
        currentPage: this.pageIndex
      }
      this.loading = true
      nft_lanList(_params).then(response => {
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
