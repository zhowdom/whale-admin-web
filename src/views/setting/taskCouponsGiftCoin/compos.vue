<template>
  <div class="taskGiveCoups" style="padding:20px;" v-loading="dialogVisibleLoading">

    <span>任务券名称：</span>
    <el-select v-model="taskInfoIdSelected" placeholder="请选择">
      <el-option
        v-for="items in options"
        :key="items.id"
        :label="items.taskName"
        :value="items.id">
      </el-option>
    </el-select><br>

    <span>赠送币种：</span><el-button v-hasPermi="['task:dedicate:rate:batch:add']" type="primary" @click="addClick" :disabled="vforData.length >= 10" icon="el-icon-plus" style="margin-top:20px;">添加</el-button>

    <div style="margin-top:20px;">
      <div>
        <span style="width: 100px;display: inline-block;margin-left: 93px;">币种</span>
        <span style="width: 150px;display: inline-block;margin-left: 170px;">数量</span>
        <span style="width: 100px;display: inline-block;margin-left: 115px;">代币状态</span>
        <span style="width: 85px;display: inline-block;margin-left: 38px;">状态</span>
        <span>操作</span>
      </div>

      <ul>
        <li v-for="(item, index) in vforData" :key="index" class="clearfix" style="margin-bottom:20px;">
          <div class="fl" style="margin-right:30px;">
            <el-select v-model="item.coinName" placeholder="请选择">
              <el-option v-for="(item, index) in coinMaps" :label="item" :value="item" :key="index"></el-option>
            </el-select>
          </div>

          <div class="fl" style="margin-left:30px;margin-right:30px;">
            <el-input-number @blur="((ev)=>{handleBlurForthis(ev, index, 'amount')})" v-model="item.amount" controls-position="right" :min="0" :max="100000" :step="1" :precision="6"></el-input-number><span style="padding-left:10px;">个</span>
          </div>

          <div class="fl" style="margin-left:60px;">
            <el-select placeholder="请选择" v-model="item.lock" style="width: 100px;" >
              <el-option label="可用" :value="false"></el-option>
              <el-option label="锁仓" :value="true"></el-option>
            </el-select>
          </div>
          
          <div class="fl" style="padding-top:8px;margin-left:55px;">
            <el-switch
              v-model="item.enabled"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </div>

          <div class="fl" style="margin-left:33px;">
            <el-button v-hasPermi="['task:dedicate:rate:remove']" v-if="item.id && !item.enabled" type="danger" @click="delClick(index, item.id)">删除</el-button>
            <el-button v-hasPermi="['task:dedicate:rate:remove']" v-else-if="!item.id" type="danger" @click="delClick(index)">删除</el-button>
          </div>

        </li>
      </ul>
    </div>

    <el-button v-hasPermi="['task:dedicate:rate:batch:add']" size="large" type="primary" @click="saveClick" :loading="loading" style="margin-left:60px;">保存</el-button>

  <div style="font-size:14px;padding-left:30px;margin-top:30px;">
    注：<br>
    1.【任务券名称】列表中只能存在一条，已存在的，toast 提示：已存在此任务券配置<br>
    2. 赠送【币种】是唯一的，已经添加的币种，即置灰不可以再选择<br>
    3. 赠送币种，输入数量为小数，精度6位，区间范围[【0 -1000000 】<br>
    4.【币种】币种选择，包括链上代币和非链上代币<br>
    5.每点击【增加】即增加一条赠送【币种】数据<br>
    6.编辑状态，任务券名称为禁用状态，不可变更<br>
  </div>
  </div>
</template>

<script>
import { taskGiveCoupsAdd_dedicate, taskGiveCoupsDel_dedicate, taskGiveCoupsMapslist } from "@/api/games";
import { daiCoinSettingList, taskCouponsGiftCoin_list, taskCouponsGiftCoin_add, taskCouponsGiftCoin_alter, taskCouponsGiftCoin_del} from "@/api/xhgjSpark_api/daiCoinSetting.js";
  export default {
    components: {},
    props: ['queryParentList', 'rowDate'],
    data () {
      return {
        loading: false,
        options: [],
        vforData: [],
        coinMaps: [],
        taskInfoIdSelected: '',
        dialogVisibleLoading: false,
      }
    },
    created () {
      // 币种下拉
      daiCoinSettingList().then(response => {
        if (response.code == 200) {
          this.coinMaps = response.data || []
        } else {
          this.coinMaps = []
        }
      })
    },
    async mounted () {
      await this.queryTaskGiveCoupsMapslist()
      this.isAuth.isPermi(['task:dedicate:rate:list']) && this.queryList()
    },
    watch: {},
    methods: {
      // 任务券下拉
      queryTaskGiveCoupsMapslist () {
        return new Promise((resolve, reject) => {
          taskGiveCoupsMapslist({
            currentPage: 1,
            pageSize: 30,
            enabled: 1,
            taskName: '',
            taskType: '',
          }).then(response => {
            if (+response.code === 200) {
              this.options = response.data.list || []
              resolve(this.options)
            } else {
              this.options = []
              resolve(this.options)
            }
          })
        })
      },
      queryList () {
        this.dialogVisibleLoading = true
        setTimeout(() => {
          this.dialogVisibleLoading = false
          this.vforData = this.rowDate?.coinsInfo || []
          this.taskInfoIdSelected = this.rowDate?.taskInfoId
        }, this.rnd(1, 7) * 100)
      },
      delClick (key, id) {
        if (id) {
          taskGiveCoupsDel_dedicate({ id }).then(response => {
            if (+response.code === 200) {
              this.$message({type: 'success', message: '操作成功'})
              this.queryList()
            } else {
              this.$message.error(response.message)
            }
          })
        } else {
          this.vforData.splice(key, 1)
        }
      },
      addClick () {
        this.curType = 'add'
        this.vforData.push({
          amount: 0,
          enabled: false,
          lock:false,
          coinName: this.coinMaps[0]
        })
      },
      saveClick () {
        if (!this.taskInfoIdSelected) {
          this.$message.error('请选择任务券')
          return false
        }
        let _params = {
          coinsInfo: this.vforData,
          statusType: this.rowDate?.statusType || 0,
          taskInfoId: this.taskInfoIdSelected,
          id: this.rowDate?.id || null,
        }
        this.loading = true
        let _curApi = this.rowDate?.id ? taskCouponsGiftCoin_alter : taskCouponsGiftCoin_add
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
.blackColor{
  color: #000!important;
}
</style>
