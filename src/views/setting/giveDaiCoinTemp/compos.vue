<template>
  <div class="giveDaiCoinTempBox" style="padding:20px;" v-loading="dialogVisibleLoading">

    <span>赠送代币名称：</span>
    <el-input v-model.trim="name" placeholder="请输入" maxlength="20" style="width:200px;"></el-input><br>

    <div style="margin-top:20px;">
      <span>赠送数量计算方式：</span>
      <el-radio v-model="calculateType" :label="1">固定数量</el-radio>
      <el-radio v-model="calculateType" :label="2">汇率计算（目前只针对【盲盒】）</el-radio>
    </div>

    <span>赠送币种：</span><el-button type="primary" @click="addClick" :disabled="vforData.length >= 10" icon="el-icon-plus" style="margin-top:20px;">添加</el-button>

    <div style="margin-top:20px;">
      <div style="padding-left:40px;">
        <span style="width: 192px;display: inline-block;text-align:center;margin-right:60px;">币种</span>
        <span :class="{'needHide':calculateType == 2}" style="width: 200px;display: inline-block;text-align:center;margin-right:80px;">数量</span>
        <span style="width: 100px;display: inline-block;text-align:center;margin-right:30px;">代币状态</span>
        <span style="width: 85px;display: inline-block;margin-left: 38px;">状态</span>
        <span>操作</span>
      </div>

      <ul>
        <li v-for="(item, index) in vforData" :key="index" class="clearfix" style="margin-bottom:20px;">
          <div class="fl" style="margin-right:30px;">
            <el-select v-model="item.coinName" placeholder="请选择">
              <!-- <el-option v-for="(item, index) in coinMaps" :label="item" :value="item" :key="index"></el-option> -->
              <el-option v-for="(item, index) in coinMaps" :label="item.coinName" :value="item.coinName" :key="index">{{item.coinName}}</el-option>
            </el-select>
          </div>

          <div class="fl" :class="{'needHide':calculateType == 2}" style="margin-left:30px;margin-right:30px;">
            <el-input-number @blur="((ev)=>{handleBlurForthis(ev, index, 'coinValue')})" v-model="item.coinValue" controls-position="right" :min="0" :max="100000" :step="1" :precision="6"></el-input-number><span style="padding-left:10px;">个</span>
          </div>

          <div class="fl" style="margin-left:29px;">
            <el-select placeholder="请选择" v-model="item.coinType" style="width: 100px;" >
              <el-option label="可用" :value="2"></el-option>
              <el-option label="锁仓" :value="1"></el-option>
            </el-select>
          </div>
          
          <div class="fl" style="padding-top:8px;margin-left:55px;">
            <el-switch
              v-model="item.enable"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </div>

          <div class="fl" style="margin-left:33px;">
            <!-- <el-button v-hasPermi="['task:dedicate:rate:remove']" v-if="item.id && !item.enable" type="danger" @click="delClick(index, item.id)">删除</el-button> -->
            <el-button v-if="!item.enable" type="danger" @click="delClick(index)">删除</el-button>
          </div>

        </li>
      </ul>
    </div>

    <el-button size="large" type="primary" @click="saveClick" :loading="loading" style="margin-left:60px;">保存</el-button>

  <div style="font-size:14px;padding-left:30px;margin-top:30px;">
    注：<br>
    1.【赠送名称】列表中只能存在一条，已存在的，toast 提示：已存在此【赠送名称已存在】<br>
    2. 赠送【币种】是唯一的，已经添加的币种，即置灰不可以再选择<br>
    3. 赠送币种，输入数量为小数，精度6位，区间范围[【0 -1000000 】<br>
    4.【币种】币种选择，包括链上代币和非链上代币<br>
    5.每点击【增加】即增加一条赠送【币种】数据<br>
    6.编辑状态，任务券名称为禁用状态，不可变更<br>
    7.增加【代币状态】- 可用，锁仓 ；默认【可用】<br>
    8.此处配置，为VIP赠送代币，盲盒赠送代币调用<br>
  </div>
  </div>
</template>

<script>
import { daiCoinSettingList, giveDaiCoinTemp_add, giveDaiCoinTemp_alter} from "@/api/xhgjSpark_api/daiCoinSetting.js";
import { coinSelectNews } from "@/api/otc_adsTreasure";
  export default {
    components: {},
    props: ['queryParentList', 'rowDate'],
    data () {
      return {
        calculateType: 1,
        name: '',
        loading: false,
        options: [],
        vforData: [],
        coinMaps: [],
        dialogVisibleLoading: false,
      }
    },
    created () {
      // 币种下拉
      // daiCoinSettingList().then(response => {
      //   if (response.code == 200) {
      //     this.coinMaps = response.data || []
      //   } else {
      //     this.coinMaps = []
      //   }
      // })
      coinSelectNews({
        enable: true
      }).then(response => {
        if (response.code == 200) {
          this.coinMaps = response.data.list || []
        } else {
          this.coinMaps = []
        }
      })
    },
    async mounted () {
      this.queryList()
    },
    watch: {},
    methods: {
      queryList () {
        this.dialogVisibleLoading = true
        setTimeout(() => {
          this.dialogVisibleLoading = false
          this.vforData = this.rowDate?.coinAwardInfo || []
          this.calculateType = +this.rowDate?.calculateType || 1
          this.name = this.rowDate?.name || ''
        }, this.rnd(1, 7) * 100)
      },
      delClick (key) {
        this.vforData.splice(key, 1)
      },
      addClick () {
        this.curType = 'add'
        this.vforData.push({
          coinValue: 0,
          enable: false,
          coinType:1,
          coinName: this.coinMaps[0].coinName
        })
      },
      saveClick () {
        if (!this.name) {
          this.$message.error('赠送代币名称不能为空')
          return false
        }
        let _params = {
          calculateType: this.calculateType,
          coinAwardInfo: this.vforData,
          id: this.rowDate?.id || null,
          name: this.name,
        }
        this.loading = true
        let _curApi = this.rowDate?.id ? giveDaiCoinTemp_alter : giveDaiCoinTemp_add
        _curApi(_params).then(response => {
          this.loading = false
          if (+response.code === 200) {
            this.$message({type: 'success', message: '操作成功'})
            this.queryParentList()
            this.$emit('close_comsp', false)
          } else {
            this.$message.error(response.message)
          }
        }).catch((e) => {
          this.loading = false
        })
      },
      handleChange (ev, key, keyName) {
        let _res = this.options.find((value, index, arr) => {
          return value.id == ev
        })
        this.vforData[key][keyName] = _res.needWhalePeas
      },
      handleBlurForthis (ev, key, keyName) {
        // blur后若输入内容为空，处理为显示对应特权类型的最小默认值
        if (ev.target.ariaValueNow === 'undefined') {
          ev.target.value = ev.target.ariaValueMin
          this.vforData[key][keyName] = ev.target.ariaValueMin
        }
      },
      rnd (n, m) {
        return Math.floor(Math.random() * (m - n) + n)
      }
    }
  }
</script>

<style>
.giveDaiCoinTempBox .needHide{
  opacity: 0;
  display: none!important;
}
</style>
