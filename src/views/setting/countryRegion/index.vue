<template>
  <div class="redbackChargeSet" style="padding:20px;">
    <p style="text-align:left;"><el-button v-hasPermi="['member:areacode:add']" type="primary" style="margin-bottom:10px;" @click="addClick">增加</el-button></p>
    <el-table
    :data="tableData"
    v-loading="loading"
    border
    style="width: 100%">
    <el-table-column
    align="center"
      prop="id"
      label="序号"
      width="80">
    </el-table-column>
    <el-table-column
    align="center"
      prop="region"
      label="国家地区">
    </el-table-column>
    <el-table-column
    align="center"
      prop="areaCode"
      label="区号">
    </el-table-column>
    <el-table-column
    align="center"
      prop="updatedAt"
      width="160"
      label="更新时间">
      <template slot-scope="{row}">
          {{row.updatedAt ? $dayjs(row.updatedAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
    </el-table-column>
    <el-table-column
    align="center"
      prop="updatedBy"
      label="操作人">
    </el-table-column>
    <el-table-column
    align="center"
      prop="sort"
      label="排序">
    </el-table-column>
    <el-table-column
    align="center"
      prop="statusType"
      label="状态">
      <template scope="scope">
        <el-switch
        v-hasPermi="['member:areacode:status']"
        v-model="scope.row.statusType"
        @change="watchChange(scope.row)"
        class="customSwitchStyle"
        active-color="#00A854"
        active-text="已开启"
        inactive-color="#F04134"
        inactive-text="已禁用"
        />
        <!-- <span>{{scope.row.statusType === 1 ? '正常' : '禁用'}}</span> -->
      </template>
    </el-table-column>

    
    <el-table-column
      align="center"
      width="100"
      label="操作">
      <template scope="scope">
        <el-button v-if="!scope.row.statusType" size="mini" v-hasPermi="['member:areacode:delete']" type="primary" @click="delClick(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
   <el-pagination
      class="fr"
      style="padding-top:10px;"
      @current-change="search"
      :page-sizes="[10, 20, 30]"
      @size-change="handleSizeChange"
      :current-page.sync="pageIndex"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage">
    </el-pagination>


<!--增加国家/地区弹窗-->
<el-dialog title="" :visible.sync="dialogFormVisibleCR" class="dialogFormVisibleCRSt">
  <el-form>
    
    <el-form-item label="国家/地区" :label-width="formLabelWidth">
      <el-select ref="sel" @change="changeHandle" v-model="countryRegionSelectedNameCN" filterable placeholder="请选择">
        <el-option
          v-for="(item, index) in countryRegionArr"
          :key="index"
          :label="item.label"
          :value="{value: item.value, label: item.label}">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="国际区号" :label-width="formLabelWidth">
      <el-input v-model="countryRegionSelected" autocomplete="off" :disabled="true" style="width:186px;"></el-input>
    </el-form-item>
    <el-form-item label="排序" :label-width="formLabelWidth">
      <el-input-number v-model="sortCR" :step="1" :min="0" step-strictly controls-position="right"></el-input-number>
    </el-form-item>

  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleCR = false">取 消</el-button>
    <el-button type="primary" @click="dialogFormVisibleCRSureClick">确 定</el-button>
  </div>
</el-dialog>

  

  </div>
</template>

<script>
import { countryRegionList, countryRegionPageQuery, countryRegionStatusSwitch, countryRegionDelete, countryRegionAdd } from "@/api/system/userlist";
import national from '@/utils/national'
  export default {
    components: {},
    data () {
      return {
        loading: false,
        btnloading: false,
        formLabelWidth: '120px',
        formData: {
          type: 1,
          percent: 0
        },
        dialogFormVisible: false,
        redtypes: '',
        tableData: [],
        bottomInfos: {
          dividendAgoraWhalePeas: '',
          dividendAsteriskWhalePeas: '',
          dividendCityWhalePeas: '',
          totalWhalePeas: '',
          dividendFilialeWhalePeas: '',
          undistributedTotalWhalePeas: '',
          allocatedTotalWhalePeas: '',
          distributableTotalWhalePeas: ''
        },
        curIteamId: '',
        countryRegionArr: [],
        dialogFormVisibleCR: false,
        countryRegionSelected: '',
        countryRegionSelectedNameCN: '',
        sortCR: 0,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
      }
    },
    mounted () {
      this.countryRegionListRun()
      this.isAuth.isPermi(['member:areacode:page']) && this.search(1)
    },
    watch: {},
    methods: {
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.isAuth.isPermi(['member:areacode:page']) && this.search()
      },
      dialogFormVisibleCRSureClick () {
        if (this.countryRegionSelected === '' || this.countryRegionSelected === undefined) {
          this.$message.error('请选择国家/地区')
          return false
        }
        if (this.sortCR === '' || this.sortCR === undefined) {
          this.$message.error('排序不能为空')
          return false
        }
        let _params = {
          areaCode: this.countryRegionSelected,
          region: this.countryRegionSelectedNameCN,
          sort: this.sortCR
        }
        countryRegionAdd(_params).then(response => {
          if (+response.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              'duration': 1000,
              onClose: () => {
                this.isAuth.isPermi(['member:areacode:page']) && this.search()
              }
            })
            this.dialogFormVisibleCR = false
          } else {
            this.$message.error(response.message)
          }
        })
      },
      changeHandle (val) {
        let {label, value} = val;
        this.countryRegionSelectedNameCN = label
        this.countryRegionSelected = value
      },
      // 国家/地区Select下拉集合
      countryRegionListRun () {
        this.countryRegionArr = (national || []).map(v => {
          // en目前没有用到
          let {cn, code, ...a} = v
          return {
            value: code,
            label: cn,
            ...a
          }
        })
        
        // countryRegionList().then(response => {
        //   if (+response.code === 200) {
        //     this.countryRegionArr = (response.data.list || []).map(v => {
        //       // en目前没有用到
        //       let {cn, code, ...a} = v
        //       return {
        //         value: code,
        //         label: cn,
        //         ...a
        //       }
        //     })
        //   } else {
        //     this.countryRegionArr = []
        //   }
        // }).catch(e => {})
      },
      // 新增国家/区域弹窗
      addClick () {
        this.dialogFormVisibleCR = true
        this.countryRegionSelected = '';
        this.countryRegionSelectedNameCN = '';
        this.sortCR = 0
      },
      // 删除
      delClick (val) {
        this.$confirm(`确认要执行此操作吗？`, '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _params = {}
          _params.id = val.id
          countryRegionDelete(_params).then(response => {
            if (response.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                'duration': 1000,
                onClose: () => {
                  this.isAuth.isPermi(['member:areacode:page']) && this.search()
                }
              })
            } else {
              this.$message.error(response.message)
            }
          }).catch(({ error }) => {
            if (error) this.$message.error(error.message)
          })
        }).catch(() => {
          // val.statusType = !val.statusType
        })
      },
      watchChange (val) {
        this.$confirm(`确认要执行此操作吗？`, '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _params = {}
          _params.id = val.id
          _params.statusType = val.statusType ? 1 : 0 // 0:停用 1:启用
          countryRegionStatusSwitch(_params).then(response => {
            if (response.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                'duration': 1000,
                onClose: () => {
                  this.isAuth.isPermi(['member:areacode:page']) && this.search()
                }
              })
            } else {
              this.$message.error(response.message)
            }
          }).catch(({ error }) => {
            if (error) this.$message.error(error.message)
          })
        }).catch(() => {
          val.statusType = !val.statusType
        })
      },
      search (pgi) {
        if (pgi) this.pageIndex = pgi
        let _params = {
          pageSize: this.pageSize,
          currentPage: this.pageIndex,
          areaCode: '',
          region: ''
        }
        this.loading = true
        countryRegionPageQuery(_params).then(response => {
          if (response.code === 200) {
            this.tableData = (response.data.list || []).map(v => {
              let {statusType, ...a} = v
              return {
                statusType: +statusType === 1,
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
      }
    }
  }
</script>

<style>
.dialogFormVisibleCRSt .el-dialog{
  width:399px;
}
</style>
