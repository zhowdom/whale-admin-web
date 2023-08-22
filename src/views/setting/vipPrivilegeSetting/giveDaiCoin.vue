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
        prop="vipDesc"
        label="VIP名称">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="coinAwardName"
        label="调用名称">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="giveCoinDESC"
        label="赠送币种">
      </el-table-column>
      
      <el-table-column
        header-align="center"
        align="center"
        width="139"
        prop="status"
        label="状态">

        <template scope="scope">
          <el-switch
          v-model="scope.row.status"
          v-hasPermi="['vip:buy_give:change']"
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
          <el-button type="text" @click="addOrEdit('edit', scope.row)" v-hasPermi="['vip:buy_give:update']">编辑</el-button>
          <el-button type="text" v-hasPermi="['vip:buy_give:delete']" @click="removeClick(scope.row)">删除</el-button>
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

    <el-dialog
      title="VIP赠送代币配置"
      :visible.sync="dialogVisible"
      width="50%">
      <el-form label-width="120px">
      <el-form-item label="VIP名称">
        <el-select v-model="vipValue" placeholder="请选择">
          <el-option v-for="(v, k) in vipArr" :label="v.label" :value="v.value" :key="k"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="赠送代币名称">
        <el-select v-model="daiCoinValue" placeholder="请选择">
          <el-option v-for="(v, k) in daiCoinArr" :label="v.label" :value="v.value" :key="k" :disabled="v.disable"></el-option>
        </el-select>
        <el-button type="primary" @click="jumpToTemplate" style="margin-left:10px;">赠送代币模板</el-button>
        <p>无合适的，前往【赠送代币模版】自行配置）</p>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="saveForm" :loading="loadingForm">确 定</el-button>
      </el-form-item>
      </el-form>

    </el-dialog>


  </div>
</template>

<script>
import {giveDaiCoin_page, giveDaiCoin_add, giveDaiCoin_edit, giveDaiCoin_del, giveDaiCoin_status, giveDaiCoinVIP_page, giveDaiCoinSelect_page} from '@/api/pointsMgmt/starTasks';

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
      dialogVisible: false,
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
      formLabelWidth: '130px',
      dialogFormVisible: false,
      loading: false,
      timeZone: 1,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      tableData: [],
      vipArr: [],
      daiCoinArr: [],
      vipValue: '',
      daiCoinValue: '',
      submitType: 'add',
      curRowData: {},
      loadingForm: false,
    }
  },
  computed: {},
  created () {
    giveDaiCoinSelect_page().then(response => {
      if (response.code == 200) {
        this.daiCoinArr = response.data.list
      } else {
        this.daiCoinArr = []
      }
    })
  },
  async mounted () {
    await this.vipsMap()
    this.isAuth.isPermi(["vip:buy_give:page"]) && this.search()
  },
  methods: {
    removeClick (val) {
      this.$confirm(`确认要执行此操作吗？`, '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let _params = {}
        _params.id = val.id
        giveDaiCoin_del(_params).then(response => {
          if (response.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              'duration': 1000,
              onClose: () => {
                this.isAuth.isPermi(['game:lottery:pool:injectPage']) && this.search(1)
              }
            })
          } else {
            this.$message.error(response.message)
          }
        }).catch(({ error }) => {
          console.log(error)
          if (error) this.$message.error(error.message)
        })
      }).catch(() => {})
    },
    saveForm () {
      let _params
      let _api
      if (this.submitType == 'add') {
        _params = {
          coinAwardId: this.daiCoinValue,
          vipId: this.vipValue,
        }
        _api = giveDaiCoin_add
      } else {
        _params = {
          coinAwardId: this.daiCoinValue,
          id: this.curRowData.id
        }
        _api = giveDaiCoin_edit
      }
      this.loadingForm = true
      _api(_params).then(response => {
        if (response.code == 200) {
          this.dialogVisible = false
          this.$message({
            message: '操作成功',
            type: 'success',
            'duration': 1000,
            onClose: () => {
              this.search(1)
            }
          })
        } else {
          this.dialogVisible = false
          this.$message.error(response.message)
        }
        this.loadingForm = false
      }).catch(e => {
        console.log(e)
        this.loadingForm = false
      })

    },
    jumpToTemplate () {
      this.$router.push({ path: '/setting/giveDaiCoinTemp', query: {}})
    },
    addOrEdit (type, row) {
      this.dialogVisible = true
      this.curRowData = Object.assign({}, row)
      this.submitType = type
      if (type == 'add') {
        this.vipValue = ''
        this.daiCoinValue = ''
      } else {
        this.vipValue = row.vipId
        this.daiCoinValue = row.coinAwardId
      }
    },
    vipsMap () {
      return new Promise((resolve, reject) => {
        giveDaiCoinVIP_page().then(response => {
          if (response.code == 200) {
            this.vipArr = response.data.list
            resolve(this.vipArr)
          } else {
            this.vipArr = []
            resolve([])
          }
        })
      })
    },
    alterStatus (opt) {
      giveDaiCoin_status({
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
      this.$confirm('确认要执行此操作 ？', '警告', {
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
      giveDaiCoin_page(_params).then(response => {
        if (response.code === 200) {
          this.tableData = (response.data.list || []).map(val => {
            let {coinAwardInfo, vipId, ...a} = val
            let giveCoinDESC = coinAwardInfo.filter(v => v.enable).map(v => `${v.coinValue}${v.coinName}-${v.coinType == 2 ? '可用' : '锁仓'}`).join()
            let vipDesc = this.vipArr.find(v => v.value == vipId)?.label || '-'
            return {
              coinAwardInfo,
              vipId,
              vipDesc,
              giveCoinDESC,
              ...a
            }
          })
          this.totalPage = response.data.total
          this.loading = false
        } else {
          this.tableData = []
          this.totalPage = 0
          this.pageSize = 10
          this.loading = false
          this.$message.error(response.message)
        }
      }).catch(e => {
        console.log(e)
        this.loading = false
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
