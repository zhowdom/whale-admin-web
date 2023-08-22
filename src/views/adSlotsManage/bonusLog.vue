<template>
  <div class="userlistwapper" style="padding:20px;">
    
    <el-form :model="queryParams" inline label-width="120px">
      <el-form-item label="用户昵称：">
        <el-input v-model="queryParams.nickName" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="邀请码：">
        <el-input v-model="queryParams.inviteCode" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="手机号：">
        <el-input v-model="queryParams.phone" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="邮箱：">
        <el-input v-model="queryParams.email" placeholder="请输入" clearable></el-input>
      </el-form-item>

    <el-button type="primary" v-hasPermi="['ad_space:reward:page']" style="margin-left:10px;" @click="search(1)">查 询</el-button>
    </el-form>

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
        prop="nickName"
        label="用户昵称">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="inviteCode"
        label="邀请码">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="phone"
        label="手机号">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="email"
        label="邮箱">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="amount"
        label="奖励">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="邀请明细">
        <template scope="scope">
          <el-button v-hasPermi="['ad_space:reward:invite_page']" type="text" @click="seeInfo(scope.row)">查看</el-button>
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


    <!--查看明细-->
    <el-dialog title="" :visible.sync="dialogTableVisible" width="66%">
      <comsp :id="curId" :key="randomStr" />
    </el-dialog>

  </div>
</template>

<script>
import {adsRent_bonusLog, adsRent_packageList, adsRent_switch} from '@/api/moreCoin/index';
import comsp from './bonusLogDetails.vue';

export default {
  components: {
    comsp
  },
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
      dialogTableVisible: false,
      queryParams: {
        nickName: '',
        inviteCode: '',
        phone: '',
        email: '',
      },
      formAds: {
        "equityInfo": {
          "count": 0,
          "minute": 0
        },
        "equityType": 1,
        "sizeScale":'',
        "inviteReward": 0,
        "name": "",
        "position": 0,
        "price": 0
      },
      packageArr: [],
      addressForMatch: [],
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
      curType: null,
      curRowData: null,
      coinName: 'USDT',
      curId: null,
      randomStr: null,
    }
  },
  computed: {},
  created () {
    this.allTaoCanSelect()
  },
  mounted () {
    this.isAuth.isPermi(["whale:interface_verify:page"]) && this.search()
  },
  methods: {
    seeInfo (row) {
      this.randomStr = new Date().getTime()
      this.curId = row?.memberId
      this.dialogTableVisible = true
    },
    // 所有套餐列表下拉
    allTaoCanSelect () {
      adsRent_packageList({
        coinName: this.coinName
      }).then(response => {
        if (response.code == 200) {
          this.packageArr = response.data.list
        } else {
          this.packageArr = []
        }
      }).catch(e => {
        console.log(e)
      })
    },
    handleChange (v) {
      this.formAds.sizeScale = v == 3 ? '13/5' : '13/3'
    },
    handleBeforeWatchChange (val) {
      this.multipleSelection = []
      this.$refs.multipleTable.clearSelection()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    alterStatus (opt) {
      adsRent_switch({
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
        currentPage: this.pageIndex,
        pageSize: this.pageSize,
        ...this.queryParams
      }
      this.loading = true
      adsRent_bonusLog(_params).then(response => {
        if (response.code === 200) {
          this.tableData = response.data.list || []
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
.weakTips {
  color: #867e7e;
  font-size: 12px;
  padding-left: 10px;
}
</style>
