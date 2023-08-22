<template>
  <div class="redbackSetPage">
    <div class="topbarFlag" style="margin-top:20px;">分红权益</div>
    <div class="enterVal" style="text-align:center;">
      <span>分给白名单用户的市场部分红：</span>
      <el-input-number step-strictly :precision="0" v-model="redBackPercent" controls-position="right" @change="handleChange" :min="0" :max="100"></el-input-number><span class="unit">%</span>
      <el-tooltip class="item" effect="dark" content="白名单的所有用户，均分前一天算好的手续费分红" placement="top-start">
        <i style="font-size: 19px;" class="el-icon-question"></i>
      </el-tooltip>
    </div>
    <div style="text-align:center;padding-top:100px;">
      <el-button v-hasPermi="['agora:white:dividend:setting:update']" type="primary" :loading="loading" @click="update_redBackInfos">保存</el-button>
    </div>
  </div>
</template>

<script>
import { queryWhiteSetting, updateWhiteSetting } from "@/api/om/white";
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
      console.log(this.$store.getters, 'getters')
    },
    watch: {},
    methods: {
      update_redBackInfos () {
        this.loading = true
        let _params = {
          dividendRate: this.redBackPercent / 100,
          id: this.resId
        }
        updateWhiteSetting(_params).then(response => {
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
        queryWhiteSetting().then(response => {
          if (response.code === 200) {
            this.resId = response.data.id
            this.redBackPercent = response.data.dividendRate * 100 || 0
          } else {
            this.$message.error(response.message)
          }
        })
      },
      handleChange(value) {
        console.log(value)
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

