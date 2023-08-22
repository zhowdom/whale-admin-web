<template>
  <div class="userlistwapper" style="padding:20px;">
    
    <el-form :model="queryParams" inline label-width="120px">
      <el-form-item label="用户昵称：">
        <el-input v-model="queryParams.nickName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="邀请码：">
        <el-input v-model="queryParams.inviteCode" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="手机号：">
        <el-input v-model="queryParams.phone" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="邮箱：">
        <el-input v-model="queryParams.email" placeholder="请输入"></el-input>
      </el-form-item>

      <!-- <el-form-item label="币种：">
        <el-select class="align-width" v-model="coinName" placeholder="">
          <el-option label="USDT" value='USDT'></el-option>
        </el-select>
      </el-form-item> -->

      <el-form-item label="套餐：">
        <el-select class="align-width" v-model="queryParams.adSpaceId" placeholder="" clearable> 
          <el-option v-for="{label, value} in packageArr" :label="label" :value='value' :key="value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="邀请人：">
        <el-input v-model="queryParams.nodeInviteCode" placeholder="请输入"></el-input>
      </el-form-item>


    <el-button type="primary" v-hasPermi="['ad_space:order:page']" style="margin-left:10px;" @click="search(1)">查 询</el-button>
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
        prop="nodeInviteCode"
        label="邀请人">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="orderNo"
        label="套餐单号">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="adSpaceName"
        label="套餐">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="num"
        label="数量">
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
import {adsRent_applyLog, adsRent_packageList, adsRent_switch} from '@/api/moreCoin/index';

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
      queryParams: {
        nickName: '',
        inviteCode: '',
        phone: '',
        adSpaceId: '',
        nodeInviteCode: ''
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
      adsRent_applyLog(_params).then(response => {
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
