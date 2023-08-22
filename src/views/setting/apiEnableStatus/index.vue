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
        label="接口名称">
      </el-table-column>
      
      <el-table-column
        header-align="center"
        align="center"
        width="139"
        prop="statusTypeTransfered"
        label="接口状态">

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
        header-align="center"
        align="center"
        label="操作">
        <template scope="scope">
          <el-button type="text" v-hasPermi="['whale:interface_verify:update']" @click="handleEditTips(scope)">提示语编辑</el-button>
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
import {apiEnableStatus_page, apiEnableStatus_status, apiEnableStatus_tips} from '@/api/pointsMgmt/starTasks';

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
      disableTip: '禁用后，用户不可以正常访问，缓存数据也无法访问此接口。',
      enableTip: '启用后，用户可以正常访问，缓存数据也可访问此接口。',
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
      this.$prompt('禁用后提示语', '编辑提示语', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'apiEnableTip',
        inputValue: scope.row.errorMsg || '',
        inputPattern: /^(?=.{1,20}$)[a-zA-Z0-9]*[^$%^&*;:,<>?()\"']*$/,
        inputErrorMessage: '请输入1~20位字符'
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
      apiEnableStatus_tips({
        errorMsg: opt.str,
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
      apiEnableStatus_status({
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
      this.$confirm(val.status ? this.enableTip : this.disableTip, val.status ? '确定启用？' : '确定禁用？', {
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
      apiEnableStatus_page(_params).then(response => {
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
