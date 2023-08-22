<template>
  <div class="welfareSettingBox" >

<div v-show="$route.query.type === 'add'">
  <div class="topbarFlag" style="margin-top:20px;">选择商品</div>

    <div style="margin-top: 39px;width:508px;margin:0 auto;padding-top:30px;" class="clearfix">
      <el-input style="width:400px;" placeholder="请输入商品名称/商品分类/商品货号" v-model="keywords" class="input-with-select fl">
        <el-button @click="searchBtn" :loading="loadingBtn" slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>

<div class="twoTableWrapper clearfix" style="width:66%;margin:0 auto;padding-top:30px;">
  <el-table
  border
    ref="multipleTable"
    :data="tableData"
    @selection-change="handleSelectionChange"
    v-loading="loading">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      prop="name"
      header-align="center"
      align="center"
      label="商品名称"
      show-overflow-tooltip
     >
    </el-table-column>
    <el-table-column
      prop="primaryImage"
      header-align="center"
      align="center"
      label="商品图"
      width="120">
      <template scope="scope">
        <img style="width:50px;height:50px;border-radius:6px;" :src="scope.row.primaryImage">
      </template>
    </el-table-column>
    <el-table-column
      prop="itemNo"
      align="center"
      header-align="center"
      show-overflow-tooltip
      label="货号">
    </el-table-column>
    </el-table>

    <div class="clearfix">
      <el-pagination
      style="padding-top:20px;"
      @current-change="search"
      :page-sizes="[10, 20, 30]"
      @size-change="handleSizeChange"
      :current-page.sync="pageIndex"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage">
      </el-pagination>
    </div>
</div>

</div>


<div class="topbarFlag" style="margin-top:20px;">配置福利赠送</div>
<!--setting-->
<div class="welfareSettingStyle" style="width:600px;margin:0 auto;">
  <ul>
    <li v-for="(item, index) in welfareSetting" :key="index" class="clearfix">
      <el-radio class="sq_radioLabel" v-model="finallyChecked" :label="item.type"><span></span></el-radio>
      <span class="sq_title">{{item.desc}}</span>
      <span>
        <sub class="sq_tip" v-if="+item.type === 1">
          请选择“Candy”最多抵扣金额：
          <!-- <el-tooltip placement="top">
              <div slot="content">
                商品的支付类型为"现金+Candy"，在【配置福利赠送】时，<br>
                不可以配置【Candy抵扣现金】此福利。
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip> -->
        </sub>
        <sub class="sq_tip" v-else>{{item.desc}}：</sub>
      </span>
      
      <div v-if="+item.type === 1" class="speflb">
        <el-select v-model="discoMoney" placeholder="请选择">
          <el-option
            v-for="item in discoMoneyArray"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div v-else-if="+item.type === 6" class="speflb">
        <el-select v-model="myTicketsVal" placeholder="请选择">
          <el-option
            v-for="item in myTicketsArray"
            :key="item.id"
            :label="item.taskName"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div v-else class="speflb">
        <el-input-number v-if="+item.type === 4 || +item.type === 5" :placeholder="item.placeholder" :precision="2" v-model="item.value" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, item.type)})" :min="0.01"></el-input-number>
        <el-input-number v-else :placeholder="item.placeholder" :precision="6" v-model="item.value" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, item.type)})" :min="0.000001"></el-input-number>
        <i style="padding-left:5px;">{{item.unit}}</i>
      </div>

    </li>
  </ul>
  <div>
    <div style="width:180px;margin:0 auto;padding-top:30px;" class="clearfix">
    <el-button v-show="!$route.query.readOnly" class="fl" :loading="loadingSave" type="primary" @click="save">保存</el-button>
    <el-button class="fl" type="primary" @click="goBack">返回</el-button>
    </div>
  </div>
</div>
  

  </div>
</template>

<script>
  import { welfareQueryListInnerAdd, whalePeanSetQueryList, productWelfareQueryList, productWelfareAddSave, productWelfareEditSave } from "@/api/presents";
  import {pageGoods} from '@/api/om/task';
  export default {
    components: {},
    data () {
      return {
        myTicketsVal: '',
        myTicketsArray: [],
        theFinallyCheckedMap: [],
        ifTransfer: false, // 是否开启穿梭框，左右2个table模式。
        finallyChecked: null,
        discoMoney: '',
        discoMoneyArray: [],
        welfareSetting: [],
        tableData: [],
        loadingBtn: false,
        loading: false,
        keywords: '',
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        loadingSave: false
      }
    },
    filters: {},
    created () {
      this.pageGlobalRequest()
    },
    mounted () {
      this.search(1)
      this.whalePeanSetQueryListRun()
      this.productWelfareQueryListRun()
    },
    watch: {},
    methods: {
      // 查询分页数据
      async pageGlobalRequest () {
        const rqData = {
          currentPage: 1,
          pageSize: 999,
          statusType: 1, // 启用
        }
        // const {code, message, data: {list, pageSize, total}} = await pageGlobal(rqData);
        const {code, message, data: {list}} = await pageGoods(rqData);
        if (code == 200) {
          this.myTicketsArray = list
        } else {
          this.myTicketsArray = []
          this.$message.error(message)
        }
      },
      reRenderShow () {
        const urlParams = this.$route.query
        const _welfare = JSON.parse(urlParams.welfare)
        this.finallyChecked = _welfare.type
        if (this.finallyChecked === 1) {
          this.discoMoney = _welfare.settingId
        } else if (this.finallyChecked === 6) {
          this.myTicketsVal = _welfare.settingId
        }
        this.welfareSetting.forEach(val => {
          if (val.type === _welfare.type) {
            val.value = _welfare.num
          }
        })
      },
      whalePeanSetQueryListRun () {
        whalePeanSetQueryList().then(response => {
          if (response.code === 200) {
            this.discoMoneyArray = (response.data.list || []).map(val => {
              let {deductionWorth, id} = val
              return {
                value: id,
                label: deductionWorth + 'USDT'
              }
            })
          } else {
            this.discoMoneyArray = []
            this.$message.error(response.message)
          }
        })
      },
      productWelfareQueryListRun () {
        productWelfareQueryList().then(response => {
          if (response.code === 200) {
            this.welfareSetting = response.data.list.map(val => Object.assign({value: 0.000001, unit: '个'}, val))
            if (this.$route.query.type === 'edit') {
              this.reRenderShow()
            }
          } else {
            this.welfareSetting = []
            this.$message.error(response.message)
          }
        })
      },
      handleSelectionChange (val) {
        if (val.length > 20) {
          for (const [k, s] of Object.entries(val || [])) {
            if (k > 19) this.$refs.multipleTable.toggleRowSelection(s)
          }
          val.length = 20
        }
        this.theFinallyCheckedMap = val
      },
      goBack () {
        this.$router.push('/setting/selfBusinessPresent')
      },
      save () {
        const _routeParams = this.$route.query
        let _url = _routeParams.type === 'add' ? productWelfareAddSave : productWelfareEditSave

        if (this.theFinallyCheckedMap.length <= 0 && _routeParams.type === 'add') {
          this.$message.error('请选择商品')
          return false
        }
        // 保存提交
        let _form = {}
        if (_routeParams.type === 'add') {
          _form.productIds = this.theFinallyCheckedMap.map(val => val.id)
        } else {
          _form.productId = _routeParams.id
        }
        if (!this.finallyChecked && _routeParams.type === 'add') {
          this.$message.error('请配置福利赠送')
          return false
        } else {
          const _item = this.welfareSetting.filter(val => +val.type === +this.finallyChecked)
          _form.welfare = {
            type: this.finallyChecked,
            // settingId: this.discoMoney,
            settingId: (_a => +this.finallyChecked === 1 ? this.discoMoney : this.myTicketsVal)()
          }
          if (+this.finallyChecked !== 1 && +this.finallyChecked !== 6) {
            _form.welfare.num = _item[0].value
            Reflect.deleteProperty(_form.welfare, 'settingId')
          } else {
            if (!this.discoMoney && !this.myTicketsVal && _routeParams.type === 'add') {
              this.$message.error('请配置福利赠送')
              return false
            } else {
              if (+this.finallyChecked === 6) {
                if (this.myTicketsVal === '') {
                  this.$message.error('请选择福利赠送')
                  return false
                }
                _form.welfare.num = 1
              } else {
                if (this.discoMoney === '') {
                  this.$message.error('请选择福利赠送')
                  return false
                }
                _form.welfare.num = +(this.discoMoneyArray.find(val => +val.value === +this.discoMoney).label).replace('USDT', '')
              }
            }
            if (_form.welfare.settingId === '') {
              this.$message.error('请选择福利赠送')
              return false
            }
          }
        }
        this.loadingSave = true
        _url(_form).then(response => {
            if (response.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              'duration': 1000,
              onClose: () => {
                this.loadingSave = false
                this.goBack()
               }
             })
            } else {
            this.$message({
              type: 'error',
              message: response.message
            })
            this.loadingSave = false
          }
        }).catch(() => {
          this.loadingSave = false
        })
      },
      removeClick () {},
      addClick () {},
      search (pgi) {
        this.loading = this.loadingBtn = true
        if (pgi) this.pageIndex = pgi
        let _params = {
          keywords: this.keywords,
          currentPage: this.pageIndex,
          pageSize: this.pageSize
        }
        welfareQueryListInnerAdd(_params).then(response => {
          if (response.code === 200) {
            this.tableData = response.data.list
            this.totalPage = response.data.total
            this.loading = this.loadingBtn = false
          } else {
            this.tableData = []
            this.totalPage = 0
            this.pageSize = 10
            this.loading = this.loadingBtn = false
            this.$message.error(response.message)
          }
        }).catch(e => {
          this.loading = this.loadingBtn = false
        })
      },
      searchBtn () {
        this.search(1)
      },
      search_removed () {
        this.loadingBtn = true
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.search()
      },
      handleSizeChange_removed (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.search()
      },
      handleChange(value) {
        this.$forceUpdate()
      },
      handleBlur (ev, type) {
        // blur后若输入内容为空，处理为显示对应特权类型的最小默认值
        if (ev.target.ariaValueNow === 'undefined') { 
          ev.target.value = ev.target.ariaValueMin
          this.welfareSetting.forEach(item => {
            if (+item.type === +type) {
              item.value = ev.target.ariaValueMin
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss">
.welfareSettingStyle {
  padding: 30px 0 50px 0;
  li{
    margin-bottom: 19px;
  }
  label.sq_radioLabel,span.sq_title,sub.sq_tip,.speflb{
    display: inline-block;
    float: left;
  }
  sub.sq_tip{
    margin-top: 7px;
  }
  label.sq_radioLabel{
    margin-right: 10px;
    margin-top: 11px;
  }
  span.sq_title{
    background: #1890ff;
    padding: 3px 10px;
    font-size: 12px;
    border-radius:3px;
    margin-right: 10px;
    margin-top: 7px;
    color: #fff;
  }
  .speflb i{
    font-style: normal;
    font-size: 12px;
  }
}
.welfareSettingBox{
  .topbarFlag{
    position: relative;
    background: #9ca7b5;
    height: 50px;
    width: 200px;
    line-height: 50px;
    text-align: center;
    color: #FFF;
    font-weight: 500;
    &:after {
      content: " ";
      height: 1px;
      width: 1px;
      display: inline-block;
      border: 25px solid transparent;
      border-left-color: #9ca7b5;
      position: absolute;
      right: -50px;
    }
  }
}

</style>
