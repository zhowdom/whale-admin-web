<template>
  <div class="taskGiveCoups" style="padding:20px;">
    <el-button v-hasPermi="['task:dedicate:rate:batch:add']" type="primary" @click="addClick" :disabled="vforData.length >= 20">添加</el-button>

    <div>
      <div>
        <span style="width: 100px;display: inline-block;margin-left: 93px;">任务券名称</span>
        <span style="width: 100px;display: inline-block;margin-left: 100px;">任务券所需</span>
        <span style="width: 150px;display: inline-block;margin-left: 150px;">赠送荣耀值换算系数</span>
        <!-- <span style="width: 150px;display: inline-block;margin-left: 150px;">赠送pizza</span> -->
        <span style="width: 100px;display: inline-block;margin-left: 115px;">状态</span>
        <span>操作</span>
      </div>

      <ul>
        <li v-for="(item, index) in vforData" :key="index" class="clearfix" style="margin-bottom:20px;">
          <div class="fl" style="margin-right:30px;">
            <el-select @change="((ev)=>{handleChange(ev, index, 'couponsNeedScore')})" v-model="item.taskInfoId" placeholder="请选择">
              <el-option
                v-for="items in options"
                :key="items.id"
                :label="items.taskName"
                :value="items.id">
              </el-option>
            </el-select>
            <span :class="{ 'blackColor':index == vforData.length - 1 }" style="color:#fff;margin-left:5px;"></span>
          </div>

          <div class="fl" style="width:200px;padding-top:8px;margin-left:30px;">
            <span>{{item.couponsNeedScore}}</span>
            <span>Candy</span>
            <span :class="{ 'blackColor':index == vforData.length - 1 }" style="color:#fff;margin-left:5px;"></span>
          </div>

          <div class="fl" style="margin-left:30px;margin-right:30px;">
            <el-input-number @blur="((ev)=>{handleBlurForthis(ev, index, 'rate')})" v-model="item.rate" controls-position="right" :min="0" :max="100000" :step="1"></el-input-number><span style="padding-left:10px;">‱</span>
          </div>

          <!-- <div class="fl" style="margin-left:30px;margin-right:30px;">
            <el-input-number @blur="((ev)=>{handleBlurForthis(ev, index, 'pizzaAmt')})" v-model="item.pizzaAmt" controls-position="right" :min="0" :max="100000" :step="1" :precision="6"></el-input-number><span style="padding-left:10px;">个</span>
          </div> -->
          
          <div class="fl" style="padding-top:8px;margin-left:20px;">
            <el-switch
              v-model="item.statusType"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </div>

          <div class="fl" style="margin-left:40px;">
            <el-button v-hasPermi="['task:dedicate:rate:remove']" v-if="item.id && !item.statusType" type="danger" @click="delClick(index, item.id)">删除</el-button>
            <el-button v-hasPermi="['task:dedicate:rate:remove']" v-else-if="!item.id" type="danger" @click="delClick(index)">删除</el-button>
          </div>

        </li>
      </ul>
    </div>

    <el-button v-hasPermi="['task:dedicate:rate:batch:add']" type="primary" @click="saveClick" :loading="loading">保存</el-button>

  <div style="font-size:14px;padding-left:30px;margin-top:30px;">
    注：<br>
    1.默认页面为，为空数据<br>
    2. 可【增加】的数据上限，以【启用】状态的任务券（现更名：糖果包）为上限<br>
    3. 【赠送荣耀值换算系数】以万分比为单位， 0-100000 正整数 ；可大于10000<br>
    4. 赠送荣耀值 = 【任务券所需】* 【赠送荣耀值换算系数】<br>
    5. 兑换任务券，一次性赠送，无须每天领取<br>
    6. 此处【赠送荣耀值】与【任务商店】单一任务券赠送荣耀值，是为2个功能并行存在<br>
    例：<br>
    1. 假设：糖果包1 的【任务券所需】配置为：1000 ， 换算系数配置为 ：15000 ‱<br>
    2.  赠送荣耀值 = 【任务券所需】* 【赠送荣耀值换算系数】 = 100 * 15000‱ = 150 荣耀值<br>
    3. 兑换成功，即赠送
  </div>
  </div>
</template>

<script>
import { taskGiveCoupsPageList_dedicate, taskGiveCoupsAdd_dedicate, taskGiveCoupsDel_dedicate, taskGiveCoupsMapslist } from "@/api/games";
  export default {
    components: {},
    data () {
      return {
        loading: false,
        options: [],
        vforData: []
      }
    },
    created () {},
    async mounted () {
      await this.queryTaskGiveCoupsMapslist()
      this.isAuth.isPermi(['task:dedicate:rate:list']) && this.queryList()
    },
    watch: {},
    methods: {
      queryTaskGiveCoupsMapslist () {
        return new Promise((resolve, reject) => {
          taskGiveCoupsMapslist({
            currentPage: 1,
            pageSize: 30,
            statusType: 1,
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
        taskGiveCoupsPageList_dedicate().then(response => {
          if (+response.code === 200) {
            this.vforData = (response.data.list || []).map((v, index) => {
              let {statusType, taskInfoId, ...a} = v
              return {
                statusType: statusType ? true : false, // 接口返回与传递需要是0|1，界面需要boolean
                couponsNeedScore: (this.options.find(v => {
                  return v.id == taskInfoId
                })).needWhalePeas,
                taskInfoId,
                ...a
              }
            })
          } else {
            this.vforData = []
          }
        })
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
        this.vforData.push({
          id: null,
          couponsNeedScore: this.options[0].needWhalePeas,
          rate: 0,
          pizzaAmt: 0,
          statusType: false,
          taskInfoId: this.options[0].id
        })
      },
      saveClick () {
        this.loading = true
        taskGiveCoupsAdd_dedicate({
          datas: this.vforData.map(v => {
            let {statusType, ...a} = v
            return {
              statusType: statusType ? 1 : 0,
              ...a
            }
          })
        }).then(response => {
          this.loading = false
          if (+response.code === 200) {
            this.$message({type: 'success', message: '操作成功'})
            this.queryList()
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
    }
  }
</script>

<style>
.blackColor{
  color: #000!important;
}
</style>
