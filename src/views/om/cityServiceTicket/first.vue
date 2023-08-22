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
      :row-key="getRowKey"
      >
      <el-table-column
        header-align="center"
        align="center"
        prop="id"
        label="ID">
        <template scope="scope">
          <div>{{scope.row.id}}</div>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="myMatchedType"
        label="类型">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="taskName"
        label="名称">
        <template scope="scope">
          <div>{{scope.row.taskName}}</div>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="limitQuantity"
        label="数量">
        <template scope="scope">
          <div>{{scope.row.limitQuantity}}</div>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="income"
        label="总奖励（个）">
        <template scope="scope">
          <div>{{scope.row.income}}</div>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="dayToDo"
        label="每天任务次数">
        <template scope="scope">
          <div>{{scope.row.dayToDo}}</div>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="completeCycleMin"
        label="周期（天）">
        <template scope="scope">
          <div>{{scope.row.completeCycleMin}}</div>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="executor"
        label="操作人员">
        <template scope="scope">
          <div>{{scope.row.executor}}</div>
        </template>
      </el-table-column>

      <el-table-column
        width="160"
        header-align="center"
        align="center"
        prop="modifyAt"
        label="更新时间">
        <template slot-scope="{row}">
          {{row.modifyAt ? $dayjs(row.modifyAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="139"
        prop="statusTypeTransfered"
        label="状态">

        <template scope="scope">
          <el-switch
          v-hasPermi="['integral:task_node:statusChange']"
          v-model="scope.row.statusTypeTransfered"
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
        width="150"
        label="操作">
        <template scope="scope">
          <el-button type="primary" size="mini" @click="editOrSee(scope.row, 'see')">查看</el-button>
          <el-button style="margin-top:5px;" @click="editOrSee(scope.row, 'alter')" v-if="!scope.row.statusTypeTransfered" type="primary" size="mini">编辑</el-button>
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
    

    <!--账号启用禁用Dialog-->
    <el-dialog width="29%" title="确定要执行此操作吗？" :visible.sync="dialogFormVisibleStatus" :before-close="handleClose">
      <el-form :model="formstatus">
        <el-form-item label="备注描述" :label-width="formLabelWidth">
          <el-input v-model="formstatus.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSattusClick">取 消</el-button>
        <el-button :disabled="(formstatus.remark.replace(/(^\s+)|(\s+$)/g, '')).length <= 0" type="primary" @click="sureStatusClick">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {taskPageV2, taskPageSwitch, taskNodeListQuery} from '@/api/pointsMgmt/starTasks';
import { someoneCertifyResult, searchUserList, getCertificate, upload, refuseOrApprove, save, statusChange, statusBatchChange } from "@/api/system/userlist";
// import { regionData, CodeToText } from 'element-china-area-data'
import regionData from '@/utils/provinceCity'
import { checkIDCard } from '@/utils/validate'
import export2Excel from '@/components/exportToExcel'

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
    let idCardNumberValidator = (rule, value, callback) => {
      if (!checkIDCard(value)) {
        callback(new Error('请输入正确的身份证号码'))
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
      export2Excel,
      ctx: this,
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
      dialogFormVisibleStatus: false,
      path: '',
      file: {},
      // options: regionData,
      selectedOptions: [],
      imageUrl: '',
      certifyform: {
        userName: '',
        idCardNumber: '',
        statusType: -1,
        imageUrlSuccessBACK: '',
        imageUrlSuccessFRONT: '',
        imageUrlSuccessHAND: '',
        imageUrlSuccessElemt: ''
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
        idCardNumber: [
          { validator: idCardNumberValidator, trigger: 'blur' }
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
      auditingChoose: [
        {
          value: '',
          label: '请选择'
        },
        {
          value: 4,
          label: '待审核'
        },
        {
          value: 1,
          label: '已认证'
        },
        {
          value: -1,
          label: '未认证'
        },
        {
          value: 2,
          label: '认证失败'
        }
      ],
      queryParams: {
        memberId: '',
        nickName: '',
        inviteCode: '',
        phone: '',
        regtime: '',
        authStatus: '', // 审核情况
        cityName: '',
        sort: '', // 排序：注册时间：1从小到大、2从大到小；最后登陆时间：3从小到大、4从大到小
        recommendedId: '',
        status: '',
        test: '' // just for debug, delete or not
      },
      clickedUserId: '', // 当前点中的用户ID
      clickCountTimeReg: 0,
      clickCountTimelog: 0,
      originData: [],
      matchedObj: {}
    }
  },
  computed: {
    handleRemoveCounty () {
      regionData.forEach(v => v.children && v.children.forEach(i => i.children && Reflect.deleteProperty(i, 'children')))
      return this.recursionTree(regionData)
    }
  },
  created () {},
  mounted () {
    this.queryParams.sort = 2
    this.search()
  },
  methods: {
    runMatch () {
      return new Promise((resolve, reject) => {
        taskNodeListQuery().then(response => {
          if (+response.code === 200) {
            (response.data.list || []).forEach(item => {
              let {code, desc} = item
              this.matchedObj[code] = desc
            })
          } else {
            this.matchedObj = {}
          }
          resolve(this.matchedObj)
        })
      })
    },
    editOrSee (row, actionType) {
      this.$router.push({ path: '/om/cityServiceTicketInnerPage', query: {id: row.id, taskType: row.taskType, actionType}})
    },
    handleBeforeWatchChange (val) {
      this.multipleSelection = []
      this.$refs.multipleTable.clearSelection()
    },
    checkboxSelect (row, rowIndex) {
      // 能够批量启用的行数据
      if (+this.beforeWatchChange === 1) {
        return +row.status === 2
      } else if (+this.beforeWatchChange === 2) {
        return +row.status === 1
      }
    },
    // support multiple selection during accross pages.
    getRowKey (row) {
      return row.memberId
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    recursionTree (origin) {
      if (Array.isArray(origin)) {
        if (!origin || !origin.length) return origin
        return origin.map(val => {
          let {id, children, ...a} = val
          return {
            value: id,
            ...a,
            children: children && children.length > 0 ? children.map(this.recursionTree) : null
          }
        })
      } else {
        let {id, children, ...a} = origin
        return {
          value: id,
          ...a,
          children: children && children.length > 0 ? children.map(this.recursionTree) : null
        }
      }
    },
    refreshReset () {
      this.fansChain.length = 0
      this.cacheQueryParams = {}
      this.queryParams = {
        memberId: '',
        nickName: '',
        inviteCode: '',
        phone: '',
        regtime: '',
        authStatus: '',
        cityName: '',
        sort: 2,
        recommendedId: '',
        status: '',
        test: ''
      }
      this.$refs['queryForm'].resetFields()
      this.$refs.queryForm.clearValidate()
      this.search(1)
    },
    handleClose(done) {
      this.cancelSattusClick()
    },
    cancelSattusClick () {
      this.dialogFormVisibleStatus = false
      this.search()
    },
    sureStatusClick () {
      let _params = {}
      _params.remark = this.formstatus.remark
      if (this.curHandleFlags === 'single') {
        _params.memberIds = [this.changeStatusCloneRow.memberId]
        _params.status = this.changeStatusCloneRow.status === 1 ? 2 : 1
      } else {
        _params.memberIds = this.multipleSelection.map(val => val.memberId)
        _params.status = this.curHandleFlags === 'batchOn' ? 1 : 2
      }
      statusBatchChange(_params).then(response => {
        this.dialogFormVisibleStatus = false
        if (response.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success',
            'duration': 1000,
            onClose: () => {
              this.handleBeforeWatchChange()
              this.search()
            }
          })
        } else {
          this.$message.error(response.message)
        }
      }).catch(({ error }) => {
        if (error) this.$message.error(error.message)
      })
    },
    // 账户状态启用、禁用[用户状态 1:正常使用 2:禁用 3:注销]
    watchChange (val) {
        this.$confirm(`确认要执行此操作吗？`, '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _params = {}
          _params.id = val.id
          taskPageSwitch(_params).then(response => {
            if (response.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                'duration': 1000,
                onClose: () => {
                  this.search(1)
                }
              })
            } else {
              val.statusTypeTransfered = !val.statusTypeTransfered
              this.$message.error(response.message)
            }
          }).catch(({ error }) => {
            val.statusTypeTransfered = !val.statusTypeTransfered
            if (error) this.$message.error(error.message)
          })
        }).catch(() => {
          val.statusTypeTransfered = !val.statusTypeTransfered
        })
      },
    sortChange ({column, prop, order}) {
      let _blooean
      switch(prop)
      {
        case 'registeredAt': // 注册时间
          _blooean = order === 'ascending' ? 1 : 2
          this.queryParams.sort = _blooean
          break;
        case 'lastLoginAt': // 最后登陆时间
          _blooean = order === 'ascending' ? 3 : 4
          this.queryParams.sort = _blooean
          break;
      }
      this.search()
    },
    formatSortHeader (column, event) {
      // watch event in the table header
      // if (column.property === 'lastLoginAt') {
      //   let x = this.clickCountTimelog % 2
      //   this.queryParams.sort = x === 0 ? 4 : 3
      // }
      // this.clickCountTimelog++
    },
    search (pgi) {
      if (pgi) this.pageIndex = pgi
      let _params = {
        pageSize: this.pageSize,
        currentPage: this.pageIndex
      }
      this.loading = true
      this.isAuth.isPermi(['integral:task_node:page']) && taskPageV2(_params).then(async response => {
        if (response.code === 200) {
          await this.runMatch()
          this.tableData = (response.data.list || []).map(item => {
            let {statusType, ...a} = item
            return {
              statusTypeTransfered: statusType ? true : false,
              ...a
            }
          })
          for (let [k, s] of Object.entries(this.tableData)) {
            this.$set(this.tableData[k], 'myMatchedType', this.matchedObj[s.taskType])
          }
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
    addressChange(arr) {
      arr.length === 1 ? this.queryParams.cityName = arr[0] : this.queryParams.cityName = arr[1]
    },
    approveOrRefuseClick (type) {
      let _desc = type === 1 ? '通过' : '不通过'
      this.$confirm(`确认审核${_desc}吗？`, '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.certifyform.statusType = type
        let _params = {
          frontImgUrl:this.certifyform.imageUrlSuccessFRONT,
          backImgUrl: this.certifyform.imageUrlSuccessBACK,
          handHoldImgUrl: this.certifyform.imageUrlSuccessHAND,
          memberId: this.clickedUserId,
          userName: this.certifyform.userName,
          idCardNumber: this.certifyform.idCardNumber,
          statusType: this.certifyform.statusType
        }
        refuseOrApprove(_params).then(response => {
          if (response.code === 200) {
            this.msgSuccess(`操作成功`)
            this.search()
          } else {
            this.msgSuccess(response.message)
          }
        })
      }).catch(() => {})
    },
  }
};
</script>
<style lang="scss">
</style>
