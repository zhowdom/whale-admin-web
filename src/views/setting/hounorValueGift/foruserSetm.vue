<template>
  <div class="forUserSetBox" style="padding:20px;">

    <p class="laname">用户对象赠送：</p>
    <div class="ckboxm" style="padding-left:106px;">
      <el-checkbox v-model="infos.all" label="">全平台用户</el-checkbox><br>
      <el-checkbox v-model="infos.vip" label="">针对VIP用户</el-checkbox><br>
      <el-checkbox v-model="infos.asterisk" label="">针对星级达人用户</el-checkbox><br>
      <el-checkbox v-model="infos.node" label="">针对节点用户</el-checkbox><br>
    </div>
    
    <!-- <div style="margin-top:30px;">
      <span class="laname" style="padding-left:63px;">状态：</span>
      <el-switch
        v-model="infos.statusType"
        active-color="#13ce66"
        inactive-color="#ff4949">
      </el-switch>
    </div> -->

    <el-button v-hasPermi="['member:dedicate:send:update']" type="primary" @click="alter" :loading="loading" style="margin:30px 0;">保存</el-button>

    <div style="font-size:13px;color:#3e3e3e;">
      注:<br>
      1. 默认全平台用户；<br>
      2. 指定用户群，兑换不同的任务，可获得荣耀值；<br>
      3. 禁用，即全平台不赠送。<br>
    </div>
  </div>
</template>

<script>
import { forUserSet_alter, forUserSet_query } from "@/api/games";
  export default {
    components: {},
    data () {
      return {
        loading: false,
        infos: {
          all: true,
          asterisk: true,
          node: true,
          vip: true,
          id: 0,
          statusType: false,
        }
      }
    },
    created () {
      this.isAuth.isPermi(['member:dedicate:send:setting']) && this.query()
    },
    mounted () {},
    watch: {},
    methods: {
      query () {
        forUserSet_query().then(response => {
          if (response.code == 200) {
            this.infos = {
              all: response?.data?.all,
              asterisk: response?.data?.asterisk,
              node: response?.data?.node,
              vip: response?.data?.vip,
              id: response?.data?.id,
              statusType: response?.data?.statusType == 1,
            }
          } else {
            this.$message.error(response.message)
          }
        }).catch(e => {
          console.log(e)
        })
      },
      alter () {
        let {statusType, ...a} = this.infos
        let _params = {
          ...a,
          statusType: statusType ? 1 : 0
        }
        this.loading = true
        forUserSet_alter(_params).then(response => {
          this.loading = false
          if (response.code == 200) {
            this.$message({type: 'success', message: '操作成功'})
            this.query()
          } else {
            this.$message.error(response.message)
          }
        }).catch(e => {
          this.loading = false
          console.log(e)
        })
      }
    }
  }
</script>

<style>
.ckboxm .el-checkbox{
  margin-bottom: 10px;
}
</style>
