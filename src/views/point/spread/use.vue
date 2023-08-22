<template>
  <div class="redbackSetPage">
    <div class="topbarFlag" style="margin-top:20px;">推广活跃值使用管理</div>
    <div class="enterVal" style="text-align:center;">
      <span>推广基础活跃值转化为Candy比例：</span>
      <el-input-number step-strictly :precision="0" v-model="redBackPercent" controls-position="right" @change="handleChange" :min="0" :max="100" @blur="handleBlur"></el-input-number><span class="unit">%</span>
    </div>
    <div style="text-align:center;padding-top:100px;">
      <el-button v-hasPermi="['active:promote:use:setting:update']" type="primary" :loading="loading" @click="update_redBackInfos">保存</el-button>
    </div>
  </div>
</template>

<script>
import { spreadUseList, spreadUseAlter } from "@/api/pointsMgmt/spread";
  export default {
    components: {},
    data () {
      return {
        redBackPercent: 0,
        loading: false,
        resId: ''
      }
    },
    mounted () {
      this.query_redBackInfos()
    },
    watch: {},
    methods: {
      update_redBackInfos () {
        this.loading = true
        let _params = {
          rate: this.redBackPercent / 100,
          id: this.resId
        }
        spreadUseAlter(_params).then(response => {
          this.loading = false
          if (response.code === 200) {
            this.$message({
              message: '保存成功',
              type: 'success',
              'duration': 1000,
              onClose: () => {
                this.query_redBackInfos()
              }
            })
          } else {
            this.$message.error(response.message)
          }
        }).catch(e => {
          this.loading = false
        })
      },
      // 查询
      query_redBackInfos () {
        spreadUseList().then(response => {
          if (response.code === 200) {
            
            response.data.list.forEach((v) => {
              if (v.type === 1) {
                this.redBackPercent = v.rate * 100 || 0
                this.resId = v.id
              }
            })
          } else {
            this.$message.error(response.message)
          }
        })
      },
      handleChange(value) {
        this.$forceUpdate()
      },
      handleBlur (ev, index) {
        // blur后若输入内容为空，处理为显示对应特权类型的最小默认值
        if (ev.target.ariaValueNow === 'undefined') ev.target.value = ev.target.ariaValueMin
      }
    }
  }
</script>

<style lang="scss" scoped>
$myColor: #8b939c;
.redbackSetPage{
  padding: 20px;
}
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
.enterVal{
  padding: 29px 67px;
  & .unit{
    color: $myColor;
    padding:0 10px 0 10px;
  }
}
</style>

