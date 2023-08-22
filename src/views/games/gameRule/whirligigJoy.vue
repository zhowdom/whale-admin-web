<template>
  <div class="whirligigRuleBox">
    
    <h3>签到
      <el-tooltip placement="top">
        <div slot="content">
          以连续签到5天为一个轮的，即连续签到的第6天时，在APP端显示是"本轮签到第1天"
        </div>
        <i class="el-icon-warning-outline"></i>
      </el-tooltip>
    </h3>

    <ul>
      <li class="clearfix">
        <div class="lmm0 fl noBTboder noRTboder">天数</div>
        <div class="lmm1 fl noBTboder noRTboder">第1天</div>
        <div class="lmm1 fl noBTboder noRTboder">第2天</div>
        <div class="lmm1 fl noBTboder noRTboder">第3天</div>
        <div class="lmm1 fl noBTboder noRTboder">第4天</div>
        <div class="lmm1 fl noBTboder noRTboder">第5天</div>
        <div class="lmm2 fl noBTboder">操作</div>
      </li>
      <li class="clearfix">
        <div class="lmm0 fl noRTboder">{{siginInData.taskName}}</div>
        <div class="lmm1 fl noRTboder">
          <el-input-number :disabled="disabledAbleStatus" size="mini" v-model="siginInData.timeBody.firstDay" :min="0" :precision="0" controls-position="right"></el-input-number>
        </div>
        <div class="lmm1 fl noRTboder">
          <el-input-number :disabled="disabledAbleStatus" size="mini" v-model="siginInData.timeBody.twoDay" :min="0" :precision="0" controls-position="right"></el-input-number>
        </div>
        <div class="lmm1 fl noRTboder">
          <el-input-number :disabled="disabledAbleStatus" size="mini" v-model="siginInData.timeBody.threeDay" :min="0" :precision="0" controls-position="right"></el-input-number>
        </div>
        <div class="lmm1 fl noRTboder">
          <el-input-number :disabled="disabledAbleStatus" size="mini" v-model="siginInData.timeBody.fourDay" :min="0" :precision="0" controls-position="right"></el-input-number>
        </div>
        <div class="lmm1 fl noRTboder">
          <el-input-number :disabled="disabledAbleStatus" size="mini" v-model="siginInData.timeBody.fiveDay" :min="0" :precision="0" controls-position="right"></el-input-number>
        </div>
        <div class="lmm2 fl">
          <el-button v-hasPermi="['lottery:signin:saveorupdate']" type="text" v-show="disabledAbleStatus" @click="disabledAbleStatus = false">编辑</el-button>
          <el-button v-hasPermi="['lottery:signin:saveorupdate']" type="text" v-show="!disabledAbleStatus" @click="zzJoySiginDataUpdateRun">保存</el-button>
        </div>
      </li>
    </ul>

    <h3>其他游戏任务</h3>
    <el-button type="primary" @click="addOrEditClick('add')" style="margin-bottom:20px;">新增</el-button>

    <el-table
      :data="tableData"
      style="width: 100%">
      
      <el-table-column
        prop="id"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="taskType"
        label="游戏任务类型">
        <template scope="scope">
          <p v-if="+scope.row.taskType === 0">邀请新用户</p>
          <p v-else-if="+scope.row.taskType === 1">看视频</p>
          <p v-else-if="+scope.row.taskType === 2">星级达人</p>
          <p v-else-if="+scope.row.taskType === 3">Candy兑换</p>
          <p v-else-if="+scope.row.taskType === 4">自营下单</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="taskName"
        label="任务名称">
      </el-table-column>
      <el-table-column
        prop="minCodeNum"
        label="获得1个奖码（最小单位）">
      </el-table-column>
      <el-table-column
        prop="maxCodeNum"
        label="每期奖码上限（个）">
      </el-table-column>
      <el-table-column
        prop="sort"
        label="排序">
      </el-table-column>
      <el-table-column
        prop="createAt"
        label="创建时间">
        <template slot-scope="{row}">
        {{row.createAt ? $dayjs(row.createAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
      </el-table-column>
      <el-table-column
        prop="createBy"
        label="操作人">
      </el-table-column>
      <el-table-column
        prop="statusType"
        label="状态">
        <template scope="scope">
          <el-switch
          v-hasPermi="['lottery:task:enableordisable']"
          v-model="scope.row.statusType"
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
        prop="tickCode"
        label="操作">
        <template scope="scope">
          <el-button v-show="!scope.row.statusType" type="text" @click="addOrEditClick('edit', scope.row)">编辑</el-button>
          <el-button v-hasPermi="['lottery:task:delete']" v-show="!scope.row.statusType" type="text" @click="delectClick(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

<!--新增｜编辑-->
<el-dialog :title="addOrEditOrSeeTitle" :visible.sync="dialogFormVisible" width="66%">
  <el-form :model="form" :rules="rules" ref="queryForm">
    <el-form-item label="游戏任务类型" :label-width="formLabelWidth" prop="taskType">
      <el-select v-model="form.taskType" placeholder="请选择游戏任务类型">
        <el-option label="邀请新用户" :value="0"></el-option>
        <el-option label="看福利视频" :value="1"></el-option>
        <el-option label="星级达人" :value="2"></el-option>
        <el-option label="Candy兑换" :value="3"></el-option>
        <el-option label="自营下单" :value="4"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="任务名称" :label-width="formLabelWidth" prop="taskName">
      <el-input v-model.trim="form.taskName" autocomplete="off" style="width:200px;" maxlength="8"></el-input>
    </el-form-item>

    <el-form-item v-show="+form.taskType !== 2" label="获得1个奖码(最小单位)" :label-width="formLabelWidth" prop="minCodeNum">
      <template slot="label">
            <span style="position:relative">
                
                <el-tooltip style="position:absolute;right:145px;top:2px;" class="item" effect="dark"  placement="top">
                  <div slot="content">
                    <p v-show="+form.taskType === 0">邀请多少人可获得1个奖码</p>
                    <p v-show="+form.taskType === 1">看多少视频获得1奖码</p>
                    <p v-show="+form.taskType === 3">兑换1个奖码所需Candy</p>
                    <p v-show="+form.taskType === 4">下多少个单获得1奖码</p>
                  </div>
                  <i class="el-icon-question table-msg" />
              </el-tooltip>
              <span>获得1个奖码(最小单位)</span>
            </span>
        </template>
      <el-input-number size="medium" v-model="form.minCodeNum" :min="0.000001" :precision="6" controls-position="right"></el-input-number>
      <span v-show="+form.taskType === 0" style="padding-left:10px;">人</span>
      <span v-show="+form.taskType === 1 || +form.taskType === 3 || +form.taskType === 4" style="padding-left:10px;">个</span>
    </el-form-item>

    <el-form-item label="每期奖码上限" :label-width="formLabelWidth" prop="maxCodeNum">
      <template slot="label">
            <span style="position:relative">
                
                <el-tooltip style="position:absolute;right:89px;top:2px;" class="item" effect="dark"  placement="top">
                  <div slot="content">
                    <p v-show="+form.taskType === 0">设置后,单个用户通过(邀请奖励)领取的奖码达到上限后,即当期不可通过(邀请奖励)方式领取奖码</p>
                    <p v-show="+form.taskType === 2">设置后,单个用户通过(星级达人)领取的奖码达到上限后,即当期不可通过(星级达人)方式领取奖码</p>
                    <p v-show="+form.taskType === 1">设置后,单个用户通过（看福利视频）领取的奖码达到上限后,即当期不可通过（看福利视频）方式领取奖码</p>
                    <p v-show="+form.taskType === 3">设置后,单个用户通过(Candy兑换)领取的奖码达到上限后,即当期不可通过(Candy兑换)方式领取奖码</p>
                    <p v-show="+form.taskType === 4">设置后,单个用户通过(下单)方式领取的奖码达到上限后,即当期不可通过(下单)方式领取奖码</p>
                  </div>
                  <i class="el-icon-question table-msg" />
              </el-tooltip>
              <span>每期奖码上限</span>
            </span>
        </template>

       <el-input-number size="medium" v-model="form.maxCodeNum" :min="1" :precision="0" controls-position="right"></el-input-number>
       <span style="padding-left:10px;">注</span>
    </el-form-item>


    <el-form-item label="排序" :label-width="formLabelWidth" prop="sort">
      <el-input-number size="medium" v-model="form.sort" :min="0" :precision="0" controls-position="right"></el-input-number>
    </el-form-item>

    <!--自营下单：点击跳转链接-->
    <el-form-item v-show="+form.taskType === 4" label="点击跳转链接" :label-width="formLabelWidth">

      <el-radio-group v-model="radioLink">
        <el-radio :label="2">内链</el-radio>
        <el-radio :label="1">外链</el-radio>
      </el-radio-group>
      <div>
        <div class="clearfix" style="padding-bottom:10px;">
          <span class="fl" style="padding-right:10px;">{{+radioLink === 1 ? '内链路由:' : 'banner外链:'}}</span>
          <el-input style="width:459px;" class="fl" v-model.trim="radioLinkEnterVal" placeholder="请输入内容"></el-input>
        </div>
        
        <div v-show="+radioLink === 2">
          <div v-for="(item, index) in pmMaps" :key="index" class="clearfix" style="padding-bottom:10px;">
            <span class="fl" style="padding-right:10px;">参数名-参数值:</span>
            <el-input style="width:200px;" class="fl" v-model.trim="item.name" placeholder="请输入参数名"></el-input>
            <span class="fl" style="padding:0 10px;">-</span>
            <el-input style="width:200px;" class="fl" v-model.trim="item.value" placeholder="请输入参数值"></el-input>
            <el-button style="margin-left:10px;" class="fl" v-if="index === pmMaps.length - 1 && pmMaps.length < 20" type="primary" icon="el-icon-plus" @click="plusClick"></el-button>
            <el-button style="margin-left:10px;" class="fl" v-if="index === pmMaps.length - 1 && pmMaps.length > 0 && index !== 0" type="warning" icon="el-icon-minus" @click="minusClick"></el-button>
          </div>
          
        </div>
      </div>


    </el-form-item>
    
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" v-hasPermi="['lottery:task:save', 'lottery:task:update']" @click="addOrEditOrSeeSaveClick">确 定</el-button>
  </div>
</el-dialog>

  </div>
</template>

<script>
import { zzJoySiginDataQuery, zzJoySiginDataUpdate, zzJoyOtherTaskList, zzJoyOtherTaskAdd, zzJoyOtherTaskUpdate, zzJoyOtherTaskDelete, zzJoyOtherTaskStatusChange } from "@/api/games";
  export default {
    props: ['sendTochildBridgeData'],
    components: {},
    data () {
      var validateTaskType = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('请选择游戏任务类型'))
        }
        callback()
      }
      var validateTaskName = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('请输入任务名称'))
        }
        callback()
      }
      var validateMaxCodeNum = (rule, value, callback) => {
        if (value === '' || value < 0 || value === undefined) {
          return callback(new Error('请输入不小于0的整数'))
        }
        callback()
      }
      var validateMinCodeNum = (rule, value, callback) => {
        if (value === '' || value < 0 || value === undefined) {
          return callback(new Error('请输入不小于0的数值'))
        }
        callback()
      }
      var validateSort = (rule, value, callback) => {
        if (value === '' || value < 0 || value === undefined) {
          return callback(new Error('请输入不小于0的整数'))
        }
        callback()
      }
      return {
        rules: {
          taskType: [
            { validator: validateTaskType, trigger: 'blur' }
          ],
          taskName: [
            { validator: validateTaskName, trigger: 'blur' }
          ],
          maxCodeNum: [
            { validator: validateMaxCodeNum, trigger: 'blur' }
          ],
          minCodeNum: [
            { validator: validateMinCodeNum, trigger: 'blur' }
          ],
          sort: [
            { validator: validateSort, trigger: 'blur' }
          ]
        },
        form: {
          maxCodeNum: 0,
          minCodeNum: 0.000001,
          sort: 0,
          taskName: "",
          taskType: 0
        },
        formLabelWidth: '200px',
        dialogFormVisible: false,
        disabledAbleStatus: true,
        siginInData: {
          taskName: '',
          timeBody: {
            firstDay: 0,
            fiveDay: 0,
            fourDay: 0,
            threeDay: 0,
            twoDay: 0
          }
        },
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        pageIndexAll: 1,
        pageSizeAll: 10,
        totalPageAll: 0,
        tableData: [],
        tableDataLog: [],
        inputSearch: '',
        addOrEditOrSeeTitle: '',
        addOrEditOrSeeStatus: '',
        radioLink: 1,
        radioLinkEnterVal: '',
        pmMaps: [
          {
            name: '',
            value: ''
          }
        ]
      }
    },
    created () {
      this.isAuth.isPermi(['lottery:signin:list']) && this.zzJoySiginDataQueryRun()
      this.isAuth.isPermi(['lottery:task:list']) && this.zzJoyOtherTaskListRun()
    },
    mounted () {},
    watch: {},
    methods: {
      plusClick () {
        this.pmMaps.push({
          name: '',
          value: ''
        })
      },
      minusClick () {
        this.pmMaps.pop()
      },
      addOrEditClick (type, row) {
        this.dialogFormVisible = true
        this.addOrEditOrSeeTitle = '新增'
        this.addOrEditOrSeeStatus = type
        this.$nextTick(() => {
          this.$refs['queryForm'].clearValidate()
        })
        if (type === 'add') {
          this.form = {
            maxCodeNum: 0,
            minCodeNum: 0.000001,
            sort: 0,
            taskName: "",
            taskType: 0,
            id: null,
            gameTypeId: this.sendTochildBridgeData.totalInformation.id
          }
          this.radioLink = 1
          this.radioLinkEnterVal = ''
          this.pmMaps = [
            {
              name: '',
              value: ''
            }
          ]
        } else {
          this.addOrEditOrSeeTitle = '编辑'
          this.form = {
            maxCodeNum: row.maxCodeNum,
            minCodeNum: row.minCodeNum,
            sort: row.sort,
            taskName: row.taskName,
            taskType: row.taskType,
            id: row.id
          }
          this.radioLink = +row.linkType
          this.radioLinkEnterVal = row.link
          let _arr = []
          for (let [k, s] of Object.entries(row.params || {})) {
            _arr.push(
              {
                name: k,
                value: s
              }
            )
          }
          if (_arr.length <= 0) {
            _arr = [{
              name: '',
              value: ''
            }]
          }
          this.pmMaps = _arr
        }
      },
      addOrEditOrSeeSaveClick () {
        this.$refs['queryForm'].validate((valid) => {
          if (valid) {
            if (+this.form.taskType === 4) {
              if (!this.radioLinkEnterVal) {
                this.$message.error('跳转链接不能为空')
                return false
              }
              // let _index = this.pmMaps.findIndex(v => {
              //   return v.name === '' || v.name === undefined || v.value === '' || v.value === undefined
              // })
              // if (_index !== -1 && +this.radioLink === 2) {
              //   this.$message.error('参数名与参数值不能为空')
              //   return false
              // }
            }
            let _api = this.addOrEditOrSeeStatus === 'add' ? zzJoyOtherTaskAdd : zzJoyOtherTaskUpdate
            let _paramsLink = {}
            this.pmMaps.forEach(v => {
              _paramsLink[v.name] = v.value
            })
            _api(Object.assign({}, this.form, {
              link: this.radioLinkEnterVal,
              linkType: this.radioLink,
              params: _paramsLink
            })).then(response => {
              if (+response.code === 200) {
                this.$message.success(response.message)
                this.isAuth.isPermi(['lottery:task:list']) && this.zzJoyOtherTaskListRun()
              } else {
                this.$message.error(response.message)
              }
              this.dialogFormVisible = false
            })
          }
        })
      },
      // 删除
      delectClick (row) {
        this.$confirm('确定要删除吗？', {
          type: 'warning',
          showClose: false,
          closeOnClickModal: false,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          zzJoyOtherTaskDelete({id: row.id}).then(response => {
            if (+response.code === 200) {
              this.$message.success(response.message)
              this.isAuth.isPermi(['lottery:task:list']) && this.zzJoyOtherTaskListRun()
            } else {
              this.$message.error(response.message)
            }
          })
        }).catch((e) => {})
      },
      watchChange (val) {
        this.$confirm(`确认要执行此操作吗？`, '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _params = {}
          _params.id = val.id
          _params.statusType = val.statusType ? 1 : 0
          zzJoyOtherTaskStatusChange(_params).then(response => {
            if (response.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                'duration': 1000,
                onClose: () => {
                  this.isAuth.isPermi(['lottery:task:list']) && this.zzJoyOtherTaskListRun()
                }
              })
            } else {
              val.statusType = !val.statusType
              this.$message.error(response.message)
            }
          }).catch(({ error }) => {
            val.statusType = !val.statusType
            if (error) this.$message.error(error.message)
          })
        }).catch(() => {
          val.statusType = !val.statusType
        })
      },
      zzJoyOtherTaskListRun () {
        this.loading = true
        zzJoyOtherTaskList().then(response => {
          if (response.code === 200) {
            this.tableData = response.data.list.map(v => {
              let {statusType, ...a} = v
              return {
                ...a,
                statusType: statusType === 1
              }
            })
            this.loading = false
          } else {
            this.tableData = []
            this.loading = false
            this.$message.error(response.message)
          }
        }).catch(e => {
          this.loading = false
        })
      },
      // 顶部的签到数据更改
       zzJoySiginDataUpdateRun () {
         zzJoySiginDataUpdate(Object.assign({}, this.siginInData, {gameTypeId: this.sendTochildBridgeData.totalInformation.id})).then(response => {
          if (+response.code === 200) {
            this.$message.success(response.message)
            this.disabledAbleStatus = true
            this.isAuth.isPermi(['lottery:signin:list']) && this.zzJoySiginDataQueryRun()
          } else {
            this.$message.error(response.message)
          }
        })
       },
      // 顶部的签到数据查询
      zzJoySiginDataQueryRun () {
        zzJoySiginDataQuery().then(response => {
          if (+response.code === 200) {
            this.siginInData = Object.assign({}, response.data)
          } else {
            this.siginInData = {
              taskName: '',
              timeBody: {
                firstDay: 0,
                fiveDay: 0,
                fourDay: 0,
                threeDay: 0,
                twoDay: 0
              }
            }
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.whirligigRuleBox{
  .noBTboder {
    border-bottom: none!important;
  }
  .noRTboder {
    border-right: none!important;
  }
  .lmm1{
    width:160px;
    height: 49px;
    text-align: center;
    border: 1px solid #ccc;
    line-height: 49px;
  }
  .lmm0{
    width: 130px;
    height: 49px;
    text-align: center;
    border: 1px solid #ccc;
    line-height: 49px;
  }
  .lmm2{
    width:100px;
    height: 49px;
    text-align: center;
    border: 1px solid #ccc;
    line-height: 49px;
  }
}
</style>

