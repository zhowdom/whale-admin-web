<template>
  <div class="redbackChargeSet">
    <!-- <p style="text-align:right;"><el-button type="primary" style="margin-bottom:10px;">新增</el-button></p> -->
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
      prop="dividendName"
      label="分红来源">
    </el-table-column>
    <el-table-column
    align="center"
      prop="totalRate"
      label="总体分红比例">
      <template scope="scope">
        <span>{{Math.trunc(scope.row.totalRate * 100)}}%</span>
      </template>
    </el-table-column>
    <el-table-column
    align="center"
      prop="executor"
      label="操作人">
    </el-table-column>
    <el-table-column
    align="center"
      prop="modifyAt"
      width="160"
      label="最后操作时间">
      <template slot-scope="{row}">
          {{row.modifyAt ? $dayjs(row.modifyAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
    </el-table-column>
    <el-table-column
    align="center"
      prop="statusType"
      label="状态">
      <template scope="scope">
        <el-switch
        v-hasPermi="['integral:dividend:setting:status:change']"
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
        <el-button size="mini" v-hasPermi="['integral:dividend:setting:update']" type="primary" @click="save_redBackInfos(scope.row)">修改</el-button>
      </template>
    </el-table-column>
  </el-table>

  <div class="bottomPannelInfos">
    <p>总分红Candy：<span>{{bottomInfos.totalWhalePeas}}</span></p>
    <p>星级达人可分红Candy：<span>{{bottomInfos.dividendAsteriskWhalePeas}}</span></p>
    <p>城市服务商可分红Candy：<span>{{bottomInfos.dividendCityWhalePeas}}</span></p>
    <p>市场部分红Candy：<span>{{bottomInfos.dividendAgoraWhalePeas}}</span></p>
    <p>奖池分红Candy：<span>{{bottomInfos.dividendAwardPoolWhalePeas}}</span></p>
    <p>分公司：<span>{{bottomInfos.dividendFilialeWhalePeas}}</span></p>
    <p>已分出Candy：<span>{{bottomInfos.allocatedTotalWhalePeas}}</span></p>
    <p>未分出Candy：<span>{{bottomInfos.undistributedTotalWhalePeas}}</span></p>
    <!-- <p v-show="false">可分配总Candy：<span>{{bottomInfos.distributableTotalWhalePeas}}</span></p> -->
  </div>

  <el-dialog title="手续费分红设置" :visible.sync="dialogFormVisible">
  <el-form :model="formData">
    <el-form-item label="分红来源：" :label-width="formLabelWidth">
      <el-input
        style="width:200px;"
        placeholder=""
        v-model="redtypes"
        :disabled="true">
      </el-input>
    </el-form-item>
    <el-form-item label="分配比例：" :label-width="formLabelWidth">
       <el-input-number step-strictly controls-position="right" v-model="formData.percent" :precision="0" :step="1" :max="100" :min="0" @blur="handleBlur"></el-input-number><span style="padding-left:5px;">%</span>
    </el-form-item>
  </el-form>
  <div class="footerTips">
    <p>星级达人的分红比例+城市服务商的分红比例+公司的分红比例不能超过100%</p>
    <p>鲸丽生活平台分配分红比例：100%，所有手续费总额都拿来分红</p>
  </div>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" :loading="btnloading" @click="submitRun">确 定</el-button>
  </div>
</el-dialog>

  </div>
</template>

<script>
import { queryRun, updateRun, infosBox, modifyStatus } from "@/api/pointsMgmt/chargeRedback";
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
        curIteamId: ''
      }
    },
    mounted () {
      this.check_redBackInfos()
      this.queryBottomInfos()
    },
    watch: {},
    methods: {
      watchChange (val) {
        this.$confirm(`确认要执行此操作吗？`, '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _params = {}
          _params.id = val.id
          _params.statusType = val.statusType ? 1 : 0 // val === true -> 正常，传1；否则 val === false 禁用，传0
          modifyStatus(_params).then(response => {
            if (response.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                'duration': 1000,
                onClose: () => {
                  this.check_redBackInfos()
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
      queryBottomInfos () {
        infosBox().then(response => {
          if (response.code === 200) {
            this.bottomInfos = response.data || {
              dividendAgoraWhalePeas: '',
              dividendAsteriskWhalePeas: '',
              dividendCityWhalePeas: '',
              totalWhalePeas: '',
              dividendFilialeWhalePeas: '',
              allocatedTotalWhalePeas: '',
              undistributedTotalWhalePeas: '',
              distributableTotalWhalePeas: ''
            }
          } else {
            this.$message.error(response.message)
          }
        }).catch(({ error }) => {
          if (error) this.$message.error(error.message)
        })
      },
      check_redBackInfos () {
        this.loading = true
        queryRun().then(response => {
          this.loading = false
          if (response.code === 200) {
            this.tableData = (response.data.list || []).map((val, index, arr) => {
              let _iteam = {}
              _iteam = Object.assign({}, val)
              _iteam.statusType = _iteam.statusType === 1 ? true : false
              return _iteam
            })
          } else {
            this.$message.error(response.message)
          }
        }).catch(({ error }) => {
          this.loading = false
          if (error) this.$message.error(error.message)
        })
      },
      submitRun () {
        let _params = {
          dividendName: this.formData.type,
          totalRate: this.formData.percent / 100,
          id: this.curIteamId
        }
        this.btnloading = true
        updateRun(_params).then(response => {
          this.dialogFormVisible = false
          this.btnloading = false
          if (response.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              'duration': 1000,
              onClose: () => {
                this.check_redBackInfos()
              }
            })
          } else {
            this.dialogFormVisible = false
            this.$message.error(response.message)
          }
        }).catch(({ error }) => {
          this.btnloading = false
          if (error) this.$message.error(error.message)
        })
      },
      save_redBackInfos (row) {
        this.dialogFormVisible = true
        this.formData.type = row.type
        this.formData.percent = (row.totalRate) * 100
        this.curIteamId = row.id
        this.redtypes = row.dividendName
      },
      handleChange(value) {
        console.log(value)
      },
      handleBlur (ev) {
        // blur后若输入内容为空，处理为显示对应特权类型的最小默认值
        if (ev.target.ariaValueNow === 'undefined') this.formData.percent = ev.target.value = ev.target.ariaValueMin
      }
    }
  }
</script>

<style lang="scss" scoped>
.redbackChargeSet{
  padding: 20px;
  & .footerTips{
    padding-left: 50px;
    & p{
      padding: 0;
      margin: 0;
    }
  }
}
.bottomPannelInfos{
  background-color: #f8f8f9;
  border-radius:5px;
  margin-top:20px;
  border:1px solid #dfe6ec;
  & p{
    padding: 10px 0;
    margin: 0;
    text-indent: 10px;
    & span{
      color: red;
    }
  }
  & p:nth-child(1){
    border-bottom: 1px solid #dfe6ec;
  }
  & p:not(:first-child) {
    padding-bottom: 0;
  }
  & p:last-child {
    padding-bottom: 10px;
  }
}
</style>
