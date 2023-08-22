<template>
  <div class="redBackDetailsBox">
    <el-form ref="form" v-loading="loadingTop" label-width="80px" style="width:789px;">  
    <ul class="topStatisBox clearfix" >
      <li class="fl">当天实时转赠笔数：<span>{{topStatistic.transferTotal}}</span></li>
      <li class="fl">当天实时转赠总Candy：<span>{{topStatistic.transferWhalePeasTotal}}</span></li>
      <li class="fl">当天实时产生手续费：<span>{{topStatistic.serviceChargeTotal}}</span></li>
      <el-button class="fl" v-hasPermi="['internal:whale:peas:transfer:page']" type="primary" round :loading="loadingTop" icon="el-icon-refresh" @click="searchStatistic">实时刷新</el-button>
    </ul>
    </el-form>
    <el-form :model="queryParams" ref="queryForm" :rules="rules" :inline="true">
      <el-form-item label="真实姓名" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="输入真实姓名"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="输入手机号"
          clearable
          maxlength="11"
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="queryParams.email"
          placeholder="输入邮箱"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="受赠方真实姓名" prop="receiveUserName">
        <el-input
          v-model="queryParams.receiveUserName"
          placeholder="输入受赠方真实姓名"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="受赠方手机号" prop="receivePhone">
        <el-input
          v-model="queryParams.receivePhone"
          placeholder="输入受赠方手机号"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <!-- <el-form-item label="LV等级" prop="levelTag">
        <el-input-number class="customInp" placeholder="输入LV等级" step-strictly v-model="queryParams.levelTag" :controls="false" @change="handleChange" @blur="handleBlur" :min="0" :max="99"></el-input-number>
      </el-form-item> -->
      <el-form-item label="LV等级" prop="levelTag">
        <el-select v-model="queryParams.levelTag" placeholder="">
          <el-option
            label="全部"
            value="">
          </el-option>
          <el-option
            v-for="item in optionsLV"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="转赠时间" prop="redbacktime">
        <el-date-picker
          v-model="queryParams.redbacktime"
          type="daterange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button v-hasPermi="['whale:peas:statistic:page']" type="primary" :loading="loading" icon="el-icon-search" @click="search(1)">查询</el-button>
        <!-- <el-button type="primary" icon="el-icon-search" @click="dispatchClick">test DISPATCH</el-button>
        <el-button type="primary" icon="el-icon-search" @click="commitClick">test COMMIT</el-button> -->
      </el-form-item>
    </el-form>

    <el-table
    :data="tableData"
    @sort-change="sortChange"
    v-loading="loading"
    border
    style="width: 100%">
    <el-table-column
      prop="memberId"
      label="用户ID"
      align="center">
    </el-table-column>
    <el-table-column
      prop="userName"
      label="真实姓名"
      align="center">
    </el-table-column>
    <el-table-column
      prop="phone"
      label="手机号"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      prop="email"
      label="邮箱"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      prop="levelTag"
      label="LV等级"
      align="center">
    </el-table-column>
    <el-table-column
      prop="createAt"
      width="170"
      sortable="custom"
      label="转赠时间"
      align="center">
      <template slot-scope="{row}">
        {{row.createAt ? $dayjs(row.createAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
    </el-table-column>
    <el-table-column
      prop="receiveUserName"
      label="受赠方真实姓名"
      width="160"
      align="center">
    </el-table-column>
    <el-table-column
      width="120"
      prop="receivePhone"
      label="受赠方手机号"
      align="center">
    </el-table-column>
    <el-table-column
      prop="transferWhalePeas"
      width="130"
      sortable="custom"
      label="转赠Candy数量"
      align="center">
    </el-table-column>
    <el-table-column
      prop="serviceCharge"
      width="130"
      sortable="custom"
      label="扣除手续费"
      align="center">
    </el-table-column>
    <el-table-column
      prop="dedicateWorth"
      width="120"
      sortable="custom"
      label="扣除荣耀值"
      align="center">
    </el-table-column>
    <el-table-column
      prop="transferWhalePeas"
      width="180"
      sortable="custom"
      label="受赠方获得Candy数量"
      align="center">
    </el-table-column>
    <el-table-column
      prop="receiveDedicateWorth"
      width="180"
      sortable="custom"
      label="受赠方获得荣耀值数量"
      align="center">
    </el-table-column>
    <el-table-column
      prop="createAt"
      width="170"
      sortable="custom"
      label="受赠方到账时间"
      align="center">
      <template slot-scope="{row}">
        {{row.createAt ? $dayjs(row.createAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
    </el-table-column>
  </el-table>

  <el-pagination
  style="float:right;padding-top:20px;"
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
import { peanDetailList, peanDetailStatistic, lvList } from "@/api/pean/index";
  export default {
    components: {},
    data () {
      var validatePhone = (rule, value, callback) => {
        if (!(/^1[3456789]\d{9}$/.test(value)) && value !== '') {
          return callback(new Error('请输入正确的手机号码'))
        }
        callback()
      }
      return {
        topStatistic: {
          serviceChargeTotal: 0,
          transferTotal: 0,
          transferWhalePeasTotal: 0
        },
        rules: {
          phone: [
            { validator: validatePhone, trigger: 'blur' }
          ],
          receivePhone: [
            { validator: validatePhone, trigger: 'blur' }
          ]
        },
        optionsLV: [],
        levelTag: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        queryParams: {
          userName: '',
          receiveUserName: '',
          phone: '',
          email: '',
          receivePhone: '',
          lv: '',
          levelTag: '',
          redbacktime: '',
          selectedLevelTag: '',
          orderItems: []
        },
        tableData: [],
        loading: false,
        loadingTop: false
      }
    },
    created () {
      this.isAuth.isPermi(['internal:whale:peas:transfer:page']) && this.searchStatistic()
    },
    mounted () {
      this.queryParams.phone = this.$route.query.phone || ''
      // this.search()
      lvList().then(response => {
        if (response.code === 200) {
          (response.data || []).forEach(el => {
            this.optionsLV.push({
              value: el,
              label: el
            })
          })
        } else {
          this.optionsLV = []
          this.$message.error(response.message)
        }
      })
    },
    watch: {},
    methods: {
      searchStatistic () {
        this.loadingTop = true
        peanDetailStatistic().then(response => {
          if (response.code === 200) {
            this.topStatistic = response.data
          } else {
            this.$message.error(response.message)
          }
          this.loadingTop = false
        }).catch(e => {
          this.loadingTop = false
        })
      },
      sortChange ({column, prop, order}) {
        this.queryParams.orderItems = [{ asc: order === 'ascending', column: prop.replace(/([A-Z])/g, '_$1').toLowerCase() }]
        this.search()
      },
      search (pgi) {
        this.$refs['queryForm'].validate((valid) => {
          if (valid) {
            if (pgi) this.pageIndex = pgi
            let datetime = []
            datetime = this.queryParams.redbacktime
            let _params = {
              currentPage: this.pageIndex,
              levelTag: this.queryParams.levelTag,
              orderItems: this.queryParams.orderItems,
              pageSize: this.pageSize,
              phone: this.queryParams.phone,
              email: this.queryParams.email,
              receivePhone: this.queryParams.receivePhone,
              receiveUserName: this.queryParams.receiveUserName,
              transferEnd: datetime ? this.$dayjs(datetime[1]).format('YYYY-MM-DD') : '',
              transferStart: datetime ? this.$dayjs(datetime[0]).format('YYYY-MM-DD') : '',
              userName: this.queryParams.userName
            }
            this.loading = true
            peanDetailList(_params).then(response => {
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
            }).catch( e => {
              this.loading = false
            })
          }
        })
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.search()
      },
      handleBlur (ev, index) {
        // blur后若输入内容为空，处理为显示对应特权类型的最小默认值
        // if (ev.target.ariaValueNow === 'undefined') ev.target.value = ev.target.ariaValueMin
      },
      handleChange(value) {
        console.log(value)
      }
    }
  }
</script>

<style lang="scss">
.redBackDetailsBox{
  padding: 20px;
  .topStatisBox{
    width: 789px;
    border:1px solid #ccc;
    border-radius: 28px;
    margin-bottom: 29px;
    & li{
      padding: 20px 0;
      margin-right:29px;
      & span{
        color: rgb(243, 160, 101);
      }
    }
    & .el-button{
      margin-top:13px;
    }
  }
}
.customInp{
  & .el-input{
    & .el-input__inner {
      text-align: left;
    }
  }
}
</style>
