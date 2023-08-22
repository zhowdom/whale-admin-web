<template>
  <div class="redBackDetailsBox" style="padding:30px;">
    <div class="clearfix">
      <div class="fl sss8b">
        <span style="display:block;">{{toufu.toDayNewUser}}</span>
        <span>当日新增用户</span>
      </div>
      <div class="fl sss8b">
        <span style="display:block;">{{toufu.toDayActiveUser}}</span>
        <span>当日新增激活用户</span>
      </div>
      <div class="fl sss8b">
        <span style="display:block;">{{toufu.toDayLocationUser}}</span>
        <span>当日新增定位用户</span>
      </div>
      <div class="fl sss8b">
        <span style="display:block;">{{toufu.toDayReceiveUser}}</span>
        <span>当日新增领取用户</span>
      </div>
      <div class="fl sss8b">
        <span style="display:block;">{{toufu.toDayFirstReceiveCandy}}</span>
        <span>当日首次领取Candy</span>
      </div>
      <div class="fl sss8b">
        <span style="display:block;">{{toufu.toDayReceiveCandy}}</span>
        <span>当日领取Candy</span>
      </div>
    </div>

    <h3>历史数据概览</h3>
    <el-button v-hasPermi="['member:data_agg:history']" type="primary" :loading="loading" icon="el-icon-search" @click="searchRange">范围查询</el-button><span style="color:#606266;font-size:13px;margin-left:10px;">(一次最大查询为1个月，含当天)</span>

    <div class="clearfix" style="margin-top:20px;">
      <div class="fl sss8b">
        <span style="display:block;">{{toufu.totalUser}}</span>
        <span>累计用户</span>
      </div>
      <div class="fl sss8b">
        <span style="display:block;">{{toufu.totalActiveUser}}</span>
        <span>累计激活用户</span>
      </div>
      <div class="fl sss8b">
        <span style="display:block;">{{toufu.totalLocationUser}}</span>
        <span>累计定位用户</span>
      </div>
      <div class="fl sss8b">
        <span style="display:block;">{{toufu.totalReceiveUser}}</span>
        <span>累计领取用户</span>
      </div>
      <div class="fl sss8b">
        <span style="display:block;">{{toufu.totalReceiveCandy}}</span>
        <span>累计领取Candy</span>
      </div>
    </div>


    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="39%">
      <div class="clearfix" style="margin-bottom:20px;">
        <span class="fl">查询对象：</span>
        <el-select clear="fl" v-model="valueDX" placeholder="请选择">
          <el-option
            v-for="item in optionsDX"
            :key="item.value"
            :label="item.label"
            :disabled="item.disable"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      
      <div class="clearfix" style="margin-bottom:20px;">
        <span class="fl">日期：</span>
        <el-date-picker
          class="fl"
          v-model="reimbDate"
          size="small"
          type="datetimerange"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          placeholder="选择报销时间">
        </el-date-picker>
      </div>
      <div class="clearfix" style="margin-bottom:50px;">
       <el-button @click="runQuery" type="primary" style="margin-bottom:10px;">查询</el-button>
       <span style="padding-left:10px;font-size:12px;color:#9e9999;">一次最大查询为1个月，含当天</span>
      </div>

       <div>
        <span>查询结果：</span>
        <el-button type="text" style="height:30px;width:99px;background:#e4e6eb;color:#409eff;line-height:9px;" :loading="loadingRes" disabled>{{queryRes}}</el-button>
        <span style="padding-left:10px;">个</span>
       </div>

      


      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    

    


  </div>
</template>

<script>
import { lccToufuInfo, lccFanweiInfo,lccDXlist } from "@/api/pean/index";
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
        loadingRes: false,
        queryRes: '',
        valueDX: '',
        reimbDate: '',
        pickerOptions: {
          disabledDate(time) {
            // const times = new Date(new Date().toLocaleDateString()).getTime() - 15 * 8.64e7 + 1; // 只能选择当天及前面的15天
            const times = new Date(new Date().toLocaleDateString()).getTime() - 30 * 8.64e7 + 1; // 只能选择当天及前面的30天
            return time.getTime() > Date.now() || time.getTime() < times; 
          },
        },
        dialogVisible: false,
        optionsDX: [],
        toufu: {
          toDayActiveUser: 0,
          toDayFirstReceiveCandy: 0,
          toDayLocationUser: 0,
          toDayNewUser: 0,
          toDayReceiveCandy: 0,
          toDayReceiveUser: 0,
          totalActiveUser: 0,
          totalLocationUser: 0,
          totalReceiveCandy: 0,
          totalReceiveUser: 0,
          totalUser: 0,
        },
        rules: {
          phone: [
            { validator: validatePhone, trigger: 'blur' }
          ]
        },
        levelTag: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        queryParams: {
          userName: '',
          phone: '',
          selectedLevelTag: '',
          orderItems: []
        },
        tableData: [],
        loading: false
      }
    },
    created () {
      this.listDX()
    },
    mounted () {
      this.isAuth.isPermi(['member:data_agg:info']) && this.search()
    },
    watch: {},
    methods: {
      runQuery () {
        if (this.valueDX == '') {
          this.$message.error('请选择查询对象')
          return false
        } else if (!this.reimbDate) {
          this.$message.error('请选择日期范围')
          return false
        }
        this.loadingRes = true
        lccFanweiInfo(
          {
            endTime: this.reimbDate[1],
            startTime: this.reimbDate[0],
            type: this.valueDX
          }
        ).then(response => {
          setTimeout(() => {
            this.loadingRes = false
          }, 500)
          if (response.code === 200) {
            this.queryRes = response.data.result
          } else {
            this.queryRes = ''
            this.$message.error(response.message)
          }
        })
      },
      // 对象列表
      listDX () {
        lccDXlist().then(response => {
          if (response.code === 200) {
            this.optionsDX = response.data.list
          } else {
            this.optionsDX = []
            this.$message.error(response.message)
          }
        })
      },
      searchRange () {
        this.reimbDate = ''
        this.valueDX = ''
        this.queryRes = ''
        this.dialogVisible = true
      },
      seeDetails (row) {
        // 跳转到Candy总统计->每一列对应子页面(原型暂未提供...)
        // this.$router.push('/statistics/totalNextPean')
      },
      search () {
        this.loading = true
        lccToufuInfo().then(response => {
          if (response.code === 200) {
            this.toufu = response.data
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

<style lang="scss">
.sss8b{
  border-radius:5px;border:1px solid #c0c1c4;text-align:center;color:#606266;width:150px;padding:15px 0;
  margin-left:10px;
}
.sss8b span{
  font-size: 13px;
  font-weight: bold;
  line-height: 20px;
}
</style>
