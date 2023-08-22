<template>
  <div class="selfbPean">
    <el-form v-loading="loading" style="padding-bottom:39px;">
      <p v-show="false" style="padding-bottom:20px;">Candy最多保留6位小数点，金额最多保留两位小数点，若为整数，后面的0省略自动取整</p>
      <ul>
        <li v-for="(item, index) in submitParams" :key="index">
          <el-input-number class="mockSlotStyle customW" :controls="false" :precision="6" v-model="item.whalePeas" controls-position="right" @change="handleChange" :min="0.000001" @blur="((ev)=>{handleBlur(ev, index, 'whalePean')})"></el-input-number>
          <sub class="separator">抵扣</sub>
          <el-input-number class="mockSlotStyle customW moneyUnit" :precision="2" :controls="false" v-model="item.deductionWorth" controls-position="right" @change="handleChange" :min="0.01" @blur="((ev)=>{handleBlur(ev, index, 'money')})"></el-input-number>
          
          <div class="cliBtnBox">
            <el-button class="cliBtn" @click="minusClick(index)" v-if="index === submitParams.length - 1 && submitParams.length > 0 && index !== 0" type="primary" icon="el-icon-minus">删除</el-button>
            <el-button class="cliBtn" @click="plusClick(index)" v-if="index === submitParams.length - 1 && submitParams.length < 20" type="primary" icon="el-icon-plus">添加</el-button>
          </div>
        </li>
      </ul>
      <el-button :disabled="noChange" :loading="loadingBtn" style="margin-top:50px;" @click="query" type="primary">取消修改</el-button>
      <el-button v-hasPermi="['whale:deduction:setting:updateorsave']" :loading="loadingBtn" style="margin-top:50px;" @click="saveClick" type="primary">保存</el-button>
    </el-form>
    
  </div>
</template>

<script>
import { whalePeanDiscList, whalePeanDiscUpdate } from "@/api/goods/goodsAbout";
  import handleNumPow from '@/utils/handleNumPow';
import Item from '../../../layout/components/Sidebar/Item.vue';
  export default {
    components: {Item},
    data () {
      return {
        noChange: true,
        ifInitialization: true,
        loading: false,
        loadingBtn: false,
        submitParams: [
          {
            deductionType: 0,
            deductionWorth: 0,
            whalePeas: 0,
            id: null
          }
        ]
      }
    },
    mounted () {
      this.query()
    },
    watch: {
      submitParams: {
        handler: function (newVal, oldVal) {  
          if (!this.ifInitialization) {
            this.noChange = false
          }
        },
        deep: true
      }
    },
    methods: {
      query () {
        this.loading = this.loadingBtn = true
        whalePeanDiscList().then(response => {
          if (response.code === 200) {
            if (response.data.list.length > 0) {
              this.submitParams = response.data.list.map(item => {
                let { deductionType, deductionWorth, id, whalePeas } = item
                return {
                  deductionType,
                  deductionWorth,
                  id,
                  whalePeas
                }
              })
            } else {
              this.submitParams = [{
                deductionType: 0,
                deductionWorth: 0,
                whalePeas: 0,
                id: null
              }]
            }
          } else {
            this.$message.error(response.message)
          }
          this.ifInitialization = true
          this.noChange = true
          this.loading = this.loadingBtn = false
        }).catch(e => {
          this.loading = false
        })
      },
      saveClick () {
        this.loadingBtn = true
        whalePeanDiscUpdate({
          datas: this.submitParams
        }).then(response => {
          if (response.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              'duration': 1000,
              onClose: async () => {
                this.query()
              }
            })
          } else {
            this.$message.error(response.message)
          }
          this.loadingBtn = false
        }).catch(e => {
          this.loadingBtn = false
        })
      },
      minusClick (index) {
        this.submitParams.pop()
        this.ifInitialization = false
      },
      plusClick (index) {
        this.submitParams.push({
          deductionType: 0, // 折扣类型默认：0人民币
          deductionWorth: 0,
          whalePeas: 0,
          id: null
        })
        this.ifInitialization = false
      },
      handleChange() {
        this.$forceUpdate()
        this.ifInitialization = false
      },
      handleBlur (ev, index, type) {
        // blur后若输入内容为空，处理为显示对应特权类型的最小默认值
        if (ev.target.ariaValueNow === 'undefined') {
          ev.target.value = ev.target.ariaValueMin
          if (type === 'whalePean') {
            this.submitParams[index].whalePeas = ev.target.ariaValueMin
          } else {
            this.submitParams[index].deductionWorth = ev.target.ariaValueMin
          }
        }
        if (type === 'money' && Number.isInteger(+ev.target.ariaValueNow) && +ev.target.ariaValueNow !== 0) {
          ev.target.value = handleNumPow(ev.target.value, 0)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
$myColor: #8b939c;
.enterVal{
  padding: 29px 67px;
  & .unit{
    color: $myColor;
    padding:0 10px 0 10px;
  }
}
</style>
<style lang="scss">
$myColor: #8b939c;
.selfbPean{
  width:929px;
  // margin: 69px auto 0 auto;
  text-align: center;
  ul {
    padding: 0;
  }
  p{
    color: #909399;
    font-size:13px;
  }
  li{
    position: relative;
    margin-bottom: 19px;
    & .cliBtn {
      margin-left: 20px;
    }
    & :first-child .cliBtn{
      margin-left: 20px;
    }
    .cliBtnBox{
      position: absolute;
      top:0;
      right: 0;
    }
  }
  .separator {
    font-style: normal;
    padding: 0 39px;
    vertical-align: middle;
    color: red;
  }
  & .enterVal {
    padding: 29px 67px 0 67px;
  }
  & .customW {
    width:139px;
    & .el-input::after{
      right:-55px;
      content: 'Candy'!important;
      text-align: center;
    }
  }
  & .moneyUnit {
    & .el-input::after{
      content: 'USDT'!important;
    }
  }
  .el-form-item__error{
    width:100%;
    text-align: center;
    padding-top: 10px;
  }
}
</style>

