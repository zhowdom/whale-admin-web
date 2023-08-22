<template>
  <div class="bindEmailSetBox">
    <div class="clearfix">
      <div class="fl" style="width:90px;text-align:right;">注册赠送代币：</div>
      <div class="fl">
      <el-select class="align-width" v-model="coinAwardId" placeholder="">
        <el-option v-for="{label, value} in seletArr" :label="label" :value='value' :key="value"></el-option>
      </el-select>
      <el-button type="primary" @click="jumpToTemplate" style="margin-left:10px;">赠送代币模板</el-button>
      <span style="font-size:13px;color: rgb(114, 118, 124);">（无合适的，前往【赠送代币模版】自行配置）</span>
      </div>
    </div>
    <div style="font-size:13px;color: rgb(114, 118, 124);padding-left:88px;padding-top:10px;">* 不可选【汇率计算】配置的赠送数</div>

    <div class="clearfix" style="margin:20px 0;text-align:right;">
      <div class="fl" style="width:90px;">状态：</div>
      <div class="fl">
        <el-switch
        v-model="statusType"
        active-color="#13ce66"
        inactive-color="#ff4949">
        </el-switch>
      </div>
    </div>


    <el-button type="primary" :loading="loading" @click="save" v-hasPermi="['member:register_award:setting:update']" style="margin-left:30px;">保存</el-button>
  </div>
</template>

<script>
import {regGiveCoin_set, regGiveCoin_query, regGiveCoin_selectlist} from '@/api/setting/vip';

export default {
  name: 'ControlPointsConf',
  data () {
    return {
      coinAwardId: '',
      seletArr: [],
      bindRadio: '1',
      statusType: false,
      loading: false,
      id: null,
      type: null,
    }
  },
  created () {
    regGiveCoin_selectlist({
      calculateType: 1
    }).then(response => {
      if (response.code == 200) {
        this.seletArr = response.data.list || []
        this.coinAwardId = response.data.list[0].value
      } else {
        this.seletArr = []
      }
    }).catch(e => {
      console.log(e)
    })
  },
  mounted () {
    this.isAuth.isPermi(['member:register_award:setting']) && this.query()
  },
  methods: {
    jumpToTemplate () {
      this.$router.push({ path: '/setting/giveDaiCoinTemp', query: {}})
    },
    query () {
      regGiveCoin_query().then(response => {
        if (response.code == 200) {
          this.coinAwardId = response.data?.coinAwardId
          this.id = response.data?.id
          this.statusType = response.data?.statusType == 1 ? true : false
        }
      }).catch(e => {
        console.log(e)
      })
    },
    save () {
      this.loading = true
      regGiveCoin_set({
        coinAwardId: this.coinAwardId,
        id: this.id,
        statusType: this.statusType ? 1 : 0, // 1启用0关闭
      }).then(response => {
        this.loading = false
        if (response.code == 200) {
          this.$message.success(response.message);
          this.query()
        } else {
          this.$message.error(message);
        }
      }).catch(e => {
        this.loading = false
        console.log(e)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.bindEmailSetBox{
  padding: 30px;
}
</style>
