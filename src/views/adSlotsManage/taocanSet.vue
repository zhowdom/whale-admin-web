<template>
  <div class="userlistwapper" style="padding:20px;">
    <el-form inline label-width="80px">
      <el-form-item label="币种：">
        <el-select class="align-width" v-model="coinName" placeholder="">
          <el-option label="USDT" value='USDT'></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="套餐：">
        <el-select class="align-width" v-model="name" placeholder="" clearable>
          <el-option v-for="{label, value} in packageArr" :label="label" :value='label' :key="value"></el-option>
        </el-select>
      </el-form-item>

    <el-button type="primary" v-hasPermi="['ad_space:package:page']" style="margin-left:10px;" @click="search(1)">查询</el-button>
    <el-button type="primary" v-hasPermi="['ad_space:package:save']" @click="addOrEdit('add')" style="margin-left:10px;">增加</el-button>
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
        prop="name"
        label="套餐名称">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="price"
        label="套餐价格">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="positionDesc"
        label="展示位置">
      </el-table-column>
      <!-- <el-table-column
        header-align="center"
        align="center"
        prop="equityInfo.count"
        label="展示次数（次）">
        <template scope="scope">
          <p>{{scope.row.equityInfo.count*600}}</p>
        </template>
      </el-table-column> -->
      <el-table-column
        header-align="center"
        align="center"
        prop="equityInfo.minute"
        label="展示时间（时）">
        <template scope="scope">
          <p>{{scope.row.equityInfo.minute*0.5}}</p>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="inviteReward"
        label="邀请奖励（%）">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="sizeScale"
        label="广告尺寸">
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
          v-hasPermi="['ad_space:package:change']"
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
          <el-button type="text" v-hasPermi="['ad_space:package:update']" @click="addOrEdit('edit' ,scope)" :disabled="scope.row.status">编辑</el-button>
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

    <!--新增｜编辑-->
    <el-dialog title="广告位套餐配置" :visible.sync="dialogFormVisible">
      <el-form :model="formAds">
        <el-form-item label="套餐名称" :label-width="formLabelWidth">
          <el-input v-model="formAds.name" autocomplete="off" style="width:400px;" maxlength="6"></el-input>
        </el-form-item>
        <el-form-item label="套餐价格" :label-width="formLabelWidth">
          <el-input-number @blur="((ev) => handleBlur(ev, 'price'))" v-model="formAds.price" :min="1" label="描述文字" style="width:400px;" controls-position="right" :precision="2"></el-input-number><span class="weakTips">USDT</span>
        </el-form-item>
        <el-form-item label="展示区域" :label-width="formLabelWidth">
          <el-select v-model="formAds.position" placeholder="请选择" @change="handleChange" :disabled="curType == 'edit'">
            <el-option v-for="(item, key) in addressForMatch" :key="key" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="尺寸比例" :label-width="formLabelWidth">
          <el-input v-model="formAds.sizeScale" autocomplete="off" style="width:400px;" readonly></el-input>
        </el-form-item>
        <el-form-item label="套餐权益" :label-width="formLabelWidth">
          <el-radio v-model="formAds.equityType" :label="2">按时长</el-radio>
          <!-- <el-radio v-model="formAds.equityType" :label="1" disabled>按次数</el-radio> -->
        </el-form-item>
        <el-form-item label="总时长" :label-width="formLabelWidth">
          <el-input-number @blur="((ev) => handleBlur(ev, 'minute'))" v-model="formAds.equityInfo.minute" :step="1" :min="1" placeholder="请输入（大于等于1正整数）" style="width:400px;" controls-position="right" step-strictly></el-input-number><span class="weakTips">* 30分</span>
        </el-form-item>
        <!-- <el-form-item label="总次数" :label-width="formLabelWidth">
          <el-input-number @blur="((ev) => handleBlur(ev, 'count'))" v-model="formAds.equityInfo.count" :step="1" :min="1" placeholder="请输入（大于等于1正整数）" style="width:400px;" controls-position="right" step-strictly></el-input-number><span class="weakTips">* 600次</span>
        </el-form-item> -->
        <p style="margin-left:100px;" class="weakTips">
          <span style="color:red;">时长配置必须为 30 分钟整数倍</span>
        </p>
        <el-form-item label="邀请奖励" :label-width="formLabelWidth">
          <el-input-number @blur="((ev) => handleBlur(ev, 'inviteReward'))" v-model="formAds.inviteReward" :min="0" placeholder="请输入以套餐价格为100%，可输小数，最多2位小数" style="width:400px;" controls-position="right" :precision="2"></el-input-number><span class="weakTips">%</span>
          <p class="weakTips">* 审核通过即发放，只针对邀请人为节点用户</p>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSave" :loading="savaLoading">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {adsRent_packageList, adsRent_query, adsRent_switch, adsRent_edit, adsRent_addressList, adsRent_add} from '@/api/moreCoin/index';

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
      savaLoading: false,
      formAds: {
        "equityInfo": {
          "count": 0,
          "minute": 0
        },
        "equityType": 2,
        "sizeScale":'',
        "inviteReward": 0,
        "name": "",
        "payCoinName": '',
        "position": null,
        "price": 0
      },
      name: '',
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
      formLabelWidth: '130px',
      dialogFormVisible: false,
      loading: false,
      timeZone: 1,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      tableData: [],
      curType: null,
      curRowID: null,
      coinName: 'USDT',
    }
  },
  computed: {},
  created () {
    this.allTaoCanSelect()
  },
  async mounted () {
    await this.adsRent_addressListRun()
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

    handleSave () {
      if (!this.formAds.name) {
        this.$message.error('请输入套餐名称')
        return false
      }
      let _curApi = this.curType == 'add' ? adsRent_add : adsRent_edit
      this.savaLoading = true
      _curApi(Object.assign(this.formAds, {id: this.curRowID || '', payCoinName: this.coinName})).then(response => {
        if (response.code == 200) {
          this.dialogFormVisible = false
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
        this.savaLoading = false
      }).catch(e => {
        this.savaLoading = false
        console.log(e)
      })
    },
    switchSize (id) {
      /**
       * picType = 1，比例是13/3
       * picType = 3，比例是13/5
       * picType = 99，比例是1/2
       */
      switch (id) {
        case 1:
          this.formAds.sizeScale = '13/3'
          break;
        case 3:
          this.formAds.sizeScale = '13/5'
          break;
        case 99:
          this.formAds.sizeScale = '1/2'
          break;
        default:
          break;
      }
    },
    handleChange (v) {
      let _res = this.addressForMatch.find(s => s.value == v)?.picType
      this.switchSize(_res)
    },
    addOrEdit (type, scope) {
      this.curType = type
      this.dialogFormVisible = true
      scope && (this.curRowID = scope.row.id)
      if (type == 'edit') {
        this.formAds = Object.assign({}, scope.row)
      } else {
        this.curRowID = ''
        this.formAds = {
          "equityInfo": {
            "count": 0,
            "minute": 0
          },
          "equityType": 2,
          "sizeScale": this.formAds.sizeScale,
          "inviteReward": 0,
          "name": "",
          "payCoinName": '',
          "position": this.formAds.position,
          "price": 0
        }
      }
    },
    adsRent_addressListRun () {
      return new Promise(resolve => {
        adsRent_addressList().then(response => {
          this.addressForMatch = response?.data?.list || []
          this.formAds.position = response?.data?.list[0]?.value
          this.switchSize(response?.data?.list[0]?.picType)
          resolve(this.addressForMatch)
        }).catch(e => {
          resolve([])
          console.log(e)
        })
      })
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
      this.$confirm(`确认要执行此操作吗?`, '提示', {
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
        currentPage: this.pageIndex,
        name: this.name,
        coinName: this.coinName
      }
      this.loading = true
      adsRent_query(_params).then(response => {
        if (response.code === 200) {
          this.tableData = (response.data.list || []).map(v => {
            let {position, ...a} = v
            let positionDesc =  this.addressForMatch.find(item => item.value == position)?.label || '-'
            return {
              positionDesc,
              position,
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
        this.loading = false
      })
    },
    handleBlur (ev, prop) {
      // blur后若输入内容为空，处理为显示对应特权类型的最小默认值
      if (ev.target.ariaValueNow === 'undefined') {
        if (prop == 'count' || prop == 'minute') {
          this.formAds.equityInfo[`${prop}`] = ev.target.value = ev.target.ariaValueMin
          if (prop == 'count') {
            this.formAds.equityInfo['minute'] = this.formAds.equityInfo['count']
          } else if (prop == 'minute') {
            this.formAds.equityInfo['count'] = this.formAds.equityInfo['minute']
          }
        } else {
          this.formAds[`${prop}`] = ev.target.value = ev.target.ariaValueMin
        }
      } else if (prop == 'count' || prop == 'minute') {
        if (prop == 'count') {
          this.formAds.equityInfo['minute'] = this.formAds.equityInfo['count']
        } else if (prop == 'minute') {
          this.formAds.equityInfo['count'] = this.formAds.equityInfo['minute']
        }
      }
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
