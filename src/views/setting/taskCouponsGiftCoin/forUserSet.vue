<template>
  <div class="shareAddManagebox" style="padding:20px;">

    <div class="clearfix">
      <span class="fl">用户对象：</span>
       <el-radio-group v-model="target" class="dfRadiobox fl">
        <el-radio :label="1">全平台用户（指配置启用后，所有新老用户）</el-radio><br>
        <el-radio :label="2">新用户（指配置启用后，新注册的用户）</el-radio><br>
        <el-radio :label="3">老用户（指配置启用后，已存在的老用户）</el-radio>
      </el-radio-group>
    </div>
    <br>

      <span>状态：</span>
      <el-switch
        v-model="statusType"
        active-color="#13ce66"
        inactive-color="#ff4949">
      </el-switch>
      <br>

      <div style="font-size:13px;color:gray;margin:10px 0;padding-left:20px;">
        注:<br>
        1. 默认全平台用户；<br>
        2. 指定用户群，兑换不同的任务，可获赠不同的币种<br>
        3. 禁用，即全平台不赠送<br>

      </div>

      <el-button v-hasPermi="['advertising:serviceFee:storage']" type="primary" @click="save" :loading="loading">保存</el-button>

  </div>
</template>

<script>
import {forUserSet_list, forUserSet_set } from "@/api/xhgjSpark_api/daiCoinSetting.js";
  export default {
    components: {},
    data () {
      return {
        statusType: 1,
        target: 1,
        id: null,
        loading: false,
      }
    },
    created () {
      this.query()
    },
    mounted () {},
    watch: {},
    methods: {
      query () {
        this.loading = true
        forUserSet_list().then(response => {
          if (+response.code == 200) {
            this.statusType = +response.data?.statusType == 1
            this.target = +response.data?.target
            this.id = response.data?.id
          } else {
            this.$message.error(response.message)
          }
          this.loading = false
        }).catch(e => {
          this.loading = false
          console.error(e)
        })
      },
      save () {
        this.loading = true
        forUserSet_set({
          statusType: this.statusType ? 1 : 0,
          target: this.target,
          id: this.id,
        }).then(response => {
          if (+response.code == 200) {
            this.$message.success(response.message)
            this.query()
          } else {
            this.$message.error(response.message)
          }
          this.loading = false
        }).catch(e => {
          this.loading = false
          console.error(e)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.mmUnit{
  padding:0 10px;color:#817d7d;
}
</style>
<style>
.dfRadiobox .el-radio{
  margin-bottom: 10px!important;
}
</style>

