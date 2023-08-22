<template>
  <div class="userlistwapper" style="padding:20px;">

    <el-form :model="queryParams" :rules="rules" ref="queryForm" :inline="true">

    <el-form-item label="网络名称">
      <el-select v-model="queryParams.chainId" placeholder="" clearable>
        <el-option
          v-for="item in netMaps"
          :key="item.chainId"
          :label="item.name"
          :value="item.chainId">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="代币符号">
      <el-input v-model.trim="queryParams.symbol" placeholder="" clearable></el-input>
    </el-form-item>

    <el-form-item label="更新时间：">
        <el-date-picker
          v-model="queryParams.regtime"
          type="datetimerange"
          :default-time="['00:00:00', '23:59:59']"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至" 
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
    </el-form-item>
    <el-form-item label="" style="border:none;">
      <el-button type="primary" v-hasPermi="['whale:interface_verify:update']" @click="search(1)">查询</el-button>
      <el-button type="primary" v-hasPermi="['whale:interface_verify:update']" @click="addOrEdit('add')">新增</el-button>
    </el-form-item>

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
        prop="symbol"
        label="代币符号">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="chainName"
        label="网络名称">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="contractAddress"
        label="代币地址">
      </el-table-column>

      <el-table-column
        header-align="center"
        align="center"
        prop="decimals"
        label="代币精度">
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


    <el-dialog :title="curType == 'add' ? '新增代币' : '编辑代币'" :visible.sync="visibleNet" :width="'590px'">
      <el-form :model="formNet" :rules="rulesNet" ref="formNet">
        
        <el-form-item label="网络名称" :label-width="formLabelWidth" prop="chainId">
          <el-select :disabled="curType == 'edit'" v-model="formNet.chainId" placeholder="">
            <el-option
              v-for="item in netMaps"
              :key="item.chainId"
              :label="item.name"
              :value="item.chainId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="代币地址" :label-width="formLabelWidth" prop="contractAddress">
          <el-input :disabled="curType == 'edit'" v-model.trim="formNet.contractAddress" type="textarea" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="代币符号" :label-width="formLabelWidth" prop="symbol">
          <el-input :disabled="curType == 'edit'" v-model.trim="formNet.symbol" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="代币精度：" :label-width="formLabelWidth" prop="decimals">
          <el-select v-model="formNet.decimals" clearable placeholder="请选择" @change="handleChangeUnit">
            <el-option v-for="(item, key, index) in scaleParams" :label="`${item} (${key})`" :value="key" :key="index"></el-option>
          </el-select>
          <span class="danwei" style="padding-left:10px;">位</span>
        </el-form-item>

        <el-form-item label="排序" :label-width="formLabelWidth" prop="sort">
          <el-input-number v-model="formNet.sort" :step="1" :min="1" step-strictly></el-input-number>
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
import { scaleList } from "@/api/xhgjSpark_api/daiCoinSetting.js";
import {nft_contractNet_page, nft_contractCoin_alter, nft_contractCoin_add, nft_contractCoin_page, nft_contractNetname_list } from "@/api/NFTMoudleManage";

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
      scaleParams: {},
      queryParams: {
        chainId: '',
        symbol: '',
        regtime: ''
      },
      netMaps: [],
      curType: '',
      formNet: {
        active: true,
        chainId: '',
        contractAddress: '',
        decimals: '',
        sort: '',
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
        chainId: [
          {required: true, message: '不能为空', trigger: 'change'},
        ],
        contractAddress: [
          {required: true, message: '不能为空', trigger: 'change'},
        ],
        symbol: [
          {required: true, message: '不能为空', trigger: 'change'},
        ],
        decimals: [
          {required: true, message: '不能为空', trigger: 'change'},
        ],
        sort: [
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
  created () {
    this.scaleList();
    nft_contractNetname_list().then(response => {
      if (response.code == 200) {
        this.netMaps = response.data.list || []
      } else {
        this.netMaps = []
      }
    }).catch(e => {
      console.log(e)
    })
  },
  mounted () {
    this.isAuth.isPermi(["whale:interface_verify:page"]) && this.search()
  },
  methods: {
    scaleList() {
      scaleList({}).then(response => {
        if (response.code === 200) {
          this.scaleParams = JSON.parse(JSON.stringify(response.data));
        } else {
          this.scaleParams = {}
          this.$message.error(response.message)
        }
      })
    },
    handleChangeUnit(val) {
      this.formNet.decimals = this.scaleParams[val];
    },
    submit (name) {
      this.$refs[name].validate((valid) => {
          if (valid) {
            let _curAPI = ''
            _curAPI = this.curType == 'edit' ? nft_contractCoin_alter : nft_contractCoin_add
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
            contractAddress: '',
            decimals: '',
            sort: '',
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
      nft_contractCoin_alter(Object.assign(this.formNet, {active: row.active})).then(response => {
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
      let datetime = [];
      datetime = this.queryParams.regtime;
      let _params = {
        endTime: datetime ? datetime[1] : "",
        startTime: datetime ? datetime[0] : "",
        pageSize: this.pageSize,
        currentPage: this.pageIndex,
        ...this.queryParams,
      }
      this.loading = true
      nft_contractCoin_page(_params).then(response => {
        if (response.code === 200) {
          this.tableData = (response.data.list || []).map(v => {
            let {chainId, ...a} = v
            let chainName = this.netMaps.find(item => item.chainId == chainId)?.name
            return {
              chainId,
              chainName,
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
