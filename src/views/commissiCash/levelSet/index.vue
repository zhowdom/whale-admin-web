<template>
  <div class="userpower_Wrapper">
        <el-table
        :data="tableData"
        v-loading="loading"
        class="userpowerbox"
        style="width: 100%">
            <el-table-column
                prop="id"
                align="center"
                label="序号">
            </el-table-column>
            <el-table-column
                align="center"
                width="120"
                prop="plusName"
                label="等级名称">
            </el-table-column>
            <el-table-column
                prop="enabledTime"
                align="center"
                width="160"
                label="等级变化启用时间">
                <template slot-scope="{row}">
                  {{row.enabledTime ? $dayjs(row.enabledTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
                </template>
            </el-table-column>
            <el-table-column label="等级成长设置" align="center">

                <el-table-column
                    prop="growthCode"
                    label="条件编码ID"
                    width="159"
                    class-name="powerColumnStyle"
                    align="center">
                    <template scope="scope">
                      <div class="innershow" :class="{ 'heigherSet': item.growthCode === 'BSC007010202'}" v-for="(item, index) in scope.row.adminGrowthList.filter(val => val.enabled)"
                      :key="index">
                        <p>{{item.growthCode}}</p>
                      </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    align="center"
                    width="200"
                    class-name="powerColumnStyle"
                    label="升级类型">
                    <template scope="scope">
                      <div class="innershow" :class="{ 'heigherSet': item.growthCode === 'BSC007010202'}" v-for="(item, index) in scope.row.adminGrowthList.filter(val => val.enabled)"
                      :key="index">
                        <p>{{item.name}}</p>
                      </div>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    width="459"
                    show-overflow-tooltip
                    label="条件设置"
                    class-name="powerColumnStyle">
                    <template scope="scope">
                      <div
                      class="innershow"
                      :class="{ 'heigherSet': item.growthCode === 'BSC007010202'}"
                      v-for="(item, index) in scope.row.adminGrowthList.filter(val => val.enabled)"
                      :key="index">
                        
                        <div v-if="+item.plusLevel === 1" attribute-name="合伙人">
                          <p v-if="item.growthCode === 'BSC007010204' || item.growthCode === 'BSC007010205' || item.growthCode === 'BSC007010206'">固定条件</p>

                          <p attribute-name="登录" v-else-if="item.growthCode === 'BSC007010203'">当前账号每天<span style="color:red;"><span>{</span>{{item.oneDayLimitCount}}</span><span>}</span>次登录鲸丽生活获得成长值</p>
                          <p attribute-name="收入" v-else-if="item.growthCode === 'BSC007010201'">近<span style="color:red;"><span>{</span>{{item.lastTotalDays}}</span><span>}</span>天确认收货收入大于或等于<span style="color:red;"><span>{</span>{{`${item.lestBalance}`}}<span>}</span></span>USDT</p>
                          <p attribute-name="粉丝" v-else-if="item.growthCode === 'BSC007010202'">
                            1.在鲸丽生活APP完成<span style="color:red;"><span>{</span>{{item.lessOrderCount}}</span><span>}</span>单的用户为有效用户<br>
                            2.有效直邀 + 有效间邀达到<span style="color:red;"><span>{</span>{{item.groupCount}}</span><span>}</span>人<br>
                            3.且有效一级合伙人大于或等于<span style="color:red;"><span>{</span>{{item.ownerCount}}</span><span>}</span>人
                          </p>

                        </div>
                        <div v-else-if="+item.plusLevel === 8" attribute-name="团长">
                          <p v-if="item.growthCode === 'BSC007010204' || item.growthCode === 'BSC007010205' || item.growthCode === 'BSC007010206'">固定条件</p>

                          <p attribute-name="登录" v-else-if="item.growthCode === 'BSC007010203'">当前账号每天<span style="color:red;"><span>{</span>{{item.oneDayLimitCount}}</span><span>}</span>次登录鲸丽生活获得成长值</p>
                          <p attribute-name="收入" v-else-if="item.growthCode === 'BSC007010201'">个人累计确认收货收入大于或等于<span style="color:red;"><span>{</span>{{item.lestBalance}}</span><span>}</span>USDT</p>
                          <p attribute-name="粉丝" v-else-if="item.growthCode === 'BSC007010202'">
                            1.团⻓近<span style="color:red;"><span>{</span>{{item.lessTotalMonth}}</span><span>}</span>月有<span style="color:red;"><span>{</span>{{item.lessMonth}}</span><span>}</span>个⽉确认收货收入大于或等于<span style="color:red;"><span>{</span>{{item.lestBalance}}</span><span>}</span>USDT为有效团⻓<br>
                            2.有效⼀级团长+有效二级团长达到<span style="color:red;"><span>{</span>{{item.groupCount}}</span><span>}</span>人<br>
                            3.且有效⼀级团⻓大于或等于<span style="color:red;"><span>{</span>{{item.ownerCount}}</span><span>}</span>人
                          </p>

                        </div>
                      </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="unit"
                    align="center"
                    width="90"
                    class-name="powerColumnStyle"
                    label="单项成长值">
                    <template scope="scope">
                      <div
                      class="innershow"
                      :class="{ 'heigherSet': item.growthCode === 'BSC007010202'}"
                      v-for="(item, index) in scope.row.adminGrowthList.filter(val => val.enabled)"
                      :key="index">
                        <p>{{item.unit}}</p>
                      </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="maxValue"
                    align="center"
                    width="90"
                    class-name="powerColumnStyle"
                    label="成长值最高值">
                    <template scope="scope">
                      <div
                      :class="{ 'heigherSet': item.growthCode === 'BSC007010202'}"
                      class="innershow"
                      v-for="(item, index) in scope.row.adminGrowthList.filter(val => val.enabled)"
                      :key="index">
                        <p>{{item.maxValue}}</p>
                      </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="remark"
                    align="center"
                    width="400"
                    show-overflow-tooltip
                    class-name="powerColumnStyle"
                    label="显示说明">
                    <template scope="scope">
                      <div
                      class="innershow"
                      :class="{ 'heigherSet': item.growthCode === 'BSC007010202'}"
                      v-for="(item, index) in scope.row.adminGrowthList.filter(val => val.enabled)"
                      :key="index">
                        <p>{{item.remark}}</p>
                      </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="createdBy"
                    align="center"
                    class-name="powerColumnStyle"
                    label="操作人">
                    <template scope="scope">
                      <div
                      class="innershow"
                      :class="{ 'heigherSet': item.growthCode === 'BSC007010202'}"
                      v-for="(item, index) in scope.row.adminGrowthList.filter(val => val.enabled)"
                      :key="index">
                        <p>{{item.createdBy}}</p>
                      </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="updatedAt"
                    align="center"
                    width="180"
                    class-name="powerColumnStyle"
                    label="最后操作时间">
                    <template slot-scope="{row}">
                      <div
                      class="innershow"
                      :class="{ 'heigherSet': item.growthCode === 'BSC007010202'}"
                      v-for="(item, index) in row.adminGrowthList.filter(val => val.enabled)"
                      :key="index">
                        <p>{{item.updatedAt ? $dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}</p>
                      </div>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column
                prop="needV_calc"
                align="center"
                label="升级所需成长值">
            </el-table-column>
            <el-table-column
                prop="needVMax_calc"
                align="center"
                label="成长值最高值">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              width="250"
              label="操作">
              <template scope="scope">
                <el-button v-hasPermi="['commission:growth:save']" :disabled="scope.row.statusType === 1" type="primary" size="mini" @click="modifyClick(scope.row)">修改</el-button>
              </template>
            </el-table-column>
        </el-table>

        <el-dialog width="88%" title="等级设置" :visible.sync="dialogFormVisible" @close="handleClose" class="levelDialog">
          <el-form :model="formLevel">

            <el-form-item label="等级名称：" :label-width="formLabelWidth">
              <p style="padding:0;margin:0;">{{formLevel.plusName}}</p>
            </el-form-item>

            <el-form-item label="必配类型：" :label-width="formLabelWidth">
              <div class="inLineS clearfix" v-for="(item, index) in formLevel.adminGrowthList.filter(v => v.growthCode === 'BSC007010201' || v.growthCode === 'BSC007010202')" :key="index">
                <el-checkbox class="fl" v-model="item.enabled" disabled></el-checkbox>
                <span @click.stop="showCurClicked($event)" class="fl forceBlueBox bluing">
                  {{item.name}}
                </span>
              </div>
              <p v-show="+formLevel.plusLevel === 8" style="color:red;font-size:13px;margin:0;padding:0;">非必配类型已沿用“合伙人”的配置</p>
            </el-form-item>

            <el-form-item label="非必配类型：" :label-width="formLabelWidth" v-show="+formLevel.plusLevel === 1">
              <div class="inLineS clearfix" v-for="(item, index) in formLevel.adminGrowthList.filter(v => v.growthCode !== 'BSC007010201' && v.growthCode !== 'BSC007010202')" :key="index">
                <el-checkbox class="fl" v-model="item.enabled"></el-checkbox>
                <span @click.stop="showCurClicked($event)" class="fl forceBlueBox bluing">
                  {{item.name}}
                </span>
              </div>
            </el-form-item>

            <el-form-item label="等级成长设置：" :label-width="formLabelWidth">
              <div class="forinBody" v-for="(item, index) in formLevel.adminGrowthList" :key="index" v-show="item.visible">
                <p class="forinBodyPItem clearfix"><i class="leftTitle">条件编码</i><span class="rightContent">{{item.growthCode}}</span></p>
                <p class="forinBodyPItem clearfix"><i class="leftTitle">升级类型</i><span class="rightContent">{{item.name}}</span></p>
                <!--条件设置[ 合伙人 -> 收入 ]-->
                <p class="forinBodyPItem clearfix" v-if="item.growthCode === 'BSC007010201' && +item.plusLevel === 1">
                  <i class="leftTitle">条件设置</i>
                  <span class="rightContent">
                  近<el-input-number  class="inpCust" controls-position="right" :precision="0" step-strictly :min="0" size="mini" v-model="item.lastTotalDays"></el-input-number>
                  天确认收货收入大于或等于<el-input-number  class="inpCust" controls-position="right" :precision="0" step-strictly :min="0" size="mini" v-model="item.lestBalance"></el-input-number>USDT
                  </span>
                </p>
                <!--条件设置[ 合伙人 -> 粉丝 ]-->
                <p class="forinBodyPItem clearfix" v-if="item.growthCode === 'BSC007010202' && +item.plusLevel === 1">
                  <i class="leftTitle">条件设置</i>
                  <span class="rightContent">
                  在鲸丽生活APP完成
                  <el-input-number  class="inpCust" controls-position="right" :precision="0" step-strictly :min="0" size="mini" v-model="item.lessOrderCount"></el-input-number>
                  单的用户为有效用户<br>
                  <i class="warnTips">此条件判断目前合伙人是否为有效合伙人，未达到此条件则为无效合伙人</i><br>
                  有效一级合伙人<i style="color:red;">+</i>有效二级合伙人达到<el-input-number  class="inpCust" controls-position="right" :precision="0" step-strictly :min="0" size="mini" v-model="item.groupCount"></el-input-number>人且<br>
                  有效一级合伙人大于或等于<el-input-number  class="inpCust" controls-position="right" :precision="0" step-strictly :min="0" size="mini" v-model="item.ownerCount"></el-input-number><br>
                  <i class="warnTips">即有效二级合伙人最多计算100个人的成长值</i>
                  </span>
                </p>
                <!--条件设置[ 团长 -> 收入 ]-->
                <p class="forinBodyPItem clearfix" v-if="item.growthCode === 'BSC007010201' && +item.plusLevel === 8">
                  <i class="leftTitle">条件设置</i>
                  <span class="rightContent">
                  个人累计确认收货收入大于或等于
                  <el-input-number  class="inpCust" controls-position="right" :precision="0" step-strictly :min="0" size="mini" v-model="item.lestBalance"></el-input-number>
                  USDT
                  </span>
                </p>
                <!--条件设置[ 团长 -> 粉丝 ]-->
                <p class="forinBodyPItem clearfix" v-if="item.growthCode === 'BSC007010202' && +item.plusLevel === 8">
                  <i class="leftTitle">条件设置</i>
                  <span class="rightContent">
                  团长近
                  <el-input-number  class="inpCust" controls-position="right" :precision="0" step-strictly :min="0" size="mini" v-model="item.lessTotalMonth"></el-input-number>
                  月有
                  <el-input-number  class="inpCust" controls-position="right" :precision="0" step-strictly :min="0" size="mini" v-model="item.lessMonth"></el-input-number>
                  个⽉确认收货收入大于或等于
                  <el-input-number  class="inpCust" controls-position="right" :precision="0" step-strictly :min="0" size="mini" v-model="item.lestBalance"></el-input-number>
                  USDT为有效团⻓<br>
                  <i class="warnTips">此条件判断团长是否为有效团长，未达到此条件则为无效团长。</i><br>
                  有效⼀级团长<i style="color:red;">+</i>有效二级团长达到
                  <el-input-number  class="inpCust" controls-position="right" :precision="0" step-strictly :min="0" size="mini" v-model="item.groupCount"></el-input-number>
                  人且<br>
                  有效⼀级团⻓大于或等于
                  <el-input-number  class="inpCust" controls-position="right" :precision="0" step-strictly :min="0" size="mini" v-model="item.ownerCount"></el-input-number>人<br>
                  <i class="warnTips">即有效2级团长多计算10个人的成长值</i>
                  </span>
                </p>

                <!--条件设置[ 合伙人 -> 绑定微信｜填写支付宝信息｜填写收获地址 ]-->
                <p class="forinBodyPItem clearfix" v-if="item.growthCode === 'BSC007010204' || item.growthCode === 'BSC007010205' || item.growthCode === 'BSC007010206'">
                  <i class="leftTitle">条件设置</i>
                  <span class="rightContent">
                    <span>固定条件</span>
                  </span>
                </p>
                <!--条件设置[ 合伙人 -> 登录 ]-->
                <p class="forinBodyPItem clearfix" v-if="item.growthCode === 'BSC007010203'">
                  <i class="leftTitle">条件设置</i>
                  <span class="rightContent">
                    当前账号每天
                    <el-input-number  class="inpCust" controls-position="right" :precision="0" step-strictly :min="0" size="mini" v-model="item.oneDayLimitCount"></el-input-number>
                    <span>次登录鲸丽生活获得成长值</span>
                  </span>
                </p>

                <!--单项成长值-->
                <p class="forinBodyPItem clearfix">
                  <i class="leftTitle">单项成长值</i>
                  <span class="rightContent">
                    <el-input-number  class="inpCust" controls-position="right" :precision="0" step-strictly :min="0" size="mini" v-model="item.unit"></el-input-number>
                  </span>
                </p>
                
                <!--成长值最高值-->
                <p class="forinBodyPItem clearfix">
                  <i class="leftTitle">成长值最高值</i>
                  <span class="rightContent">
                    <el-input-number  class="inpCust" controls-position="right" :precision="0" step-strictly :min="0" size="mini" v-model="item.maxValue"></el-input-number>
                  </span>
                </p>

                <!--显示说明-->
                <p class="forinBodyPItem clearfix">
                  <i class="leftTitle">显示说明</i>
                  <span class="rightContent">
                    <el-input
                      type="textarea"
                      placeholder=""
                      v-model="item.remark"
                      maxlength="30"
                      show-word-limit>
                    </el-input>
                  </span>
                </p>

              </div>
            </el-form-item>

            
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" :loading="btnloading" @click="saveLayerFormClick">确 定</el-button>
          </div>
        </el-dialog>

  </div>
</template>

<script>
import { layerGrowthLIST, layerGrowthSAVE } from "@/api/commissCash/platform";
  export default {
    components: {},
    data () {
      return {
        // currentRowHaveCodeList: [], // 全部集合
        // checkedCodeList: [], // 启用了(已勾选)的集合
        formLevel: {
          adminGrowthList: []
        },
        dialogFormVisible: false,
        formLabelWidth: '120px',
        tableData: [],
        loading: false,
        clickedName: '收入',
        btnloading: false,
        forceOnlyCurClickIndex: 0 // 高亮索引
      }
    },
    created () {
    },
    mounted () {
      this.search()
    },
    methods: {
      handleClose () {
        this.search()
      },
      // validate
      validateRun (arr = []) {
        let validateERRTips = []
        arr.forEach((val, index) => {
          if (val.unit > val.maxValue) {
            validateERRTips.push(val.name)
          }
        })
        return validateERRTips.join('、')
      },
      saveLayerFormClick () {
        let _params = this.formLevel
        let errorFlag = this.validateRun(_params.adminGrowthList)
        if (errorFlag.length > 0) {
          this.$message.warning(`${errorFlag}类型的单项成长值不可大于成长值最高值`)
          return false
        }
        console.log(_params, 'submitted params')
        this.btnloading = true
        layerGrowthSAVE(_params).then(response => {
          this.dialogFormVisible = this.btnloading = false
          if (response.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              'duration': 1000,
              onClose: () => {
                this.search()
              }
            })
          } else {
            this.$message.error(response.message)
          }
        })
      },
      handleDefaultShow () {
        this.resetting()
        for (let [k, s] of Object.entries(this.formLevel.adminGrowthList || [])) {
          if (s.name === this.clickedName) {
            s.visible = true
          }
        }
        for (let [k, s] of Object.entries(Array.from(document.querySelectorAll('.forceBlueBox')))) {
          if (s.innerHTML.replace(/\s/g, '') === this.clickedName) {
            s.style.color = '#1890ff'
          }
        }
        this.$forceUpdate()
      },
      resetting () {
        this.formLevel.adminGrowthList.forEach(val => {
          val.visible = false
        })
        for (let [k, s] of Object.entries(Array.from(document.querySelectorAll('.forceBlueBox')))) { s.style.color= '#606266' }
      },
      showCurClicked (e) {
        this.resetting()
        this.clickedName = e.target.innerHTML.replace(/\s/g, '') 
        for (let [k, s] of Object.entries(this.formLevel.adminGrowthList || [])) {
          if (this.clickedName === s.name) s.visible = true
        }
        e.target.style.color = '#1890ff'
        this.$forceUpdate()
      },
      modifyClick (row) {
        this.clickedName = '收入'
        this.formLevel = Object.assign({}, row)
        this.$nextTick(() => {
          this.handleDefaultShow()
        })
        this.dialogFormVisible = true
      },
      search () {
        this.loading = true
        layerGrowthLIST().then(response => {
          if (response.code === 200) {
            this.tableData = response.data.map((val, index, arr) => {
              let _json = {}
              let needVArr = []
              let needVMaxArr = []
              _json = Object.assign({}, val)
              _json.adminGrowthList = (_json.adminGrowthList || []).filter(v => v.growthCode !== 'BSC007010207')
              _json.adminGrowthList.forEach(val => {
                if (val.growthCode === 'BSC007010201' || val.growthCode === 'BSC007010202') {
                  needVArr.push(val.maxValue)
                }
                if (val.enabled) {
                  needVMaxArr.push(val.maxValue)
                }
              })
              _json.calcedTotalVal = needVArr.reduce((prev, cur, index, arr) => {
                return prev + cur
              }, 0)
              _json.calcedTotalMaxVal = needVMaxArr.reduce((prev, cur, index, arr) => {
                return prev + cur
              }, 0)
              return _json
            })
            for (let [k, s] of Object.entries(this.tableData || [])) {
              this.$set(this.tableData[k], 'needV_calc', s['calcedTotalVal'])
              this.$set(this.tableData[k], 'needVMax_calc', s['calcedTotalMaxVal'])
            }
            this.loading = false
          } else {
            this.tableData = []
            this.loading = false
            this.$message.error(response.message)
          }
        })
      }
    }
  }
</script>

<style>
.forinBodyPItem .leftTitle{
  padding: 10px;
  background: #F5F7FA;
  display: inline-block;
  float: left;
  font-style: normal;
  width:109px;
  text-align: center;
}
.levelDialog .inpCust {
  margin: 0 5px;
}
.forinBodyPItem .rightContent {
  padding: 10px;
  float: left;
  width: calc(100% - 109px);
  border-left:1px solid #ccc;
}
.forinBodyPItem {
  padding: 0;
  margin: 0;
  border:1px solid #ccc;
  border-bottom: none;
  display:flex;
}
.levelDialog .el-form-item__content{
  border-left:1px solid #ccc;
}
.forinBodyPItem:last-child{
  border-bottom:1px solid #ccc;
}
.levelDialog .warnTips{
  color:#999;
  font-size: 13px;
  font-style: normal;
}
.levelDialog .inLineS {
  display: inline-block;
  padding-right: 19px;
}
.levelDialog .forceBlueBox{
  padding-left: 6px;
  cursor: pointer;
}
.userpower_Wrapper{
    padding: 20px;
}
 .userpower_Wrapper .topshow ul{
     margin-left: -36px;
 }
 .userpower_Wrapper .topshow li{
    padding: 5px;
    float: left;
    list-style: none;
    margin-right: 10px;
    border: 1px solid #ccc;
    border-radius:3px;
    margin-bottom: 10px;
    font-size: 13px;
 }
  .powerColumnStyle .cell,.powerColumnStyle{
    padding:0!important;
  }
 .powerColumnStyle .innershow{
   border-bottom: 1px solid #dfe6ec;
   height: 38px;
 }
 .powerColumnStyle .heigherSet {
   height: 88px!important;
   display: flex;
   align-items: center;
   justify-content: center;
   text-align: justify;
 }
  .powerColumnStyle .heigherSet p{
   padding: 0;
   margin: 0;
 }
 .powerColumnStyle .innershow:last-child{
   border-bottom: none;
 }
 .customStyle  .el-input{
   width:200px;
 }
 .userpower_Wrapper .codeLeft, .userpower_Wrapper .auditCenter, .userpower_Wrapper .auditRight{
   height: 80px;
 }
  .userpower_Wrapper .codeLeft{
    width:200px;
    padding-top: 20px;
    border-right:1px solid #ccc;
  }
  .userpower_Wrapper .auditRight{
    width:305px;
    padding-top: 10px;
  }
  .userpower_Wrapper .auditRight .el-textarea{
    width:229px;
    float: left;
  }
 .userpower_Wrapper .auditCenter{
   width:calc(100% - 539px);
   padding-top: 20px;
 }
 .userpower_Wrapper .el-form-item{
   margin-bottom: 0!important;
   border: 1px solid #ccc;
   border-bottom: none;
 }
 .userpower_Wrapper .el-form-item:last-child{
   border-bottom: 1px solid #ccc;
 }
 .customStyle .el-form-item__content{
   border-left: 1px solid #ccc;
 }
 .myAuditSetting ul{
   padding: 0!important;
   margin:0!important;
 }
  .myAuditSetting ul li:not(:last-child) {
    border-bottom: 1px solid #ccc;
  }
 .userpower_Wrapper .el-form-item__label,.userpower_Wrapper .el-form-item__content{
   padding: 10px!important;
 }
 .userpower_Wrapper .notP .el-form-item__content{
   padding: 0!important;
 }
 .txtC {
   text-align:center;
 }
 .mytopformstyle .el-form-item{
   border: none;
 }
 .confirmUserList .el-tag{
   margin-right:9px;
 }
</style>

