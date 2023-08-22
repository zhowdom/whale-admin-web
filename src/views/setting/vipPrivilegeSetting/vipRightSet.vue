<template>
  <div class="bindEmailSetBox">
    <div class="clearfix">
      <div class="fl" style="width:90px;text-align:right;">VIP 赠送权益：</div>
      <div class="fl" style="margin-left:10px;">
        <el-checkbox v-model="checkedDefault">赠送任务券</el-checkbox><br><br>
        <el-checkbox v-model="checkedGiveCoin">赠送代币</el-checkbox>
      </div>
    </div>

    <div class="clearfix" style="margin:20px 0;text-align:right;">
      <div class="fl" style="width:90px;">状态：</div>
      <div class="fl">
        <el-switch
        v-model="bindStatus"
        active-color="#13ce66"
        inactive-color="#ff4949">
        </el-switch>
      </div>
    </div>

    <div style="font-size:13px;margin-bottom:30px;color:#72767c;">
      注:<br>
      1. 默认勾选【赠送任务券】且为默认【启用】状态，即现有逻辑 ；<br>
      2. 如果不勾选，且启用，即购买VIP 不赠送任何权益；<br>
      3. 赠送权益为多选项；<br>
      4. 购买不同的VIP，可获赠不同的币种。<br>
    </div>

    <el-button type="primary" :loading="loading" @click="save" v-hasPermi="['member:setting:storage']">保存</el-button>
  </div>
</template>

<script>
import {bindEmailSet_save, vipRightSet_query} from '@/api/games';

export default {
  name: 'ControlPointsConf',
  data () {
    return {
      checkedDefault: true,
      checkedGiveCoin: true,
      bindStatus: false,
      loading: false,
      id: null,
    }
  },
  mounted () {
    this.isAuth.isPermi(['member:setting:type']) && this.query()
  },
  methods: {
    query () {
      vipRightSet_query().then(response => {
        if (response.code == 200) {
          this.bindStatus = response.data?.enabled
          this.checkedGiveCoin = response.data?.condition?.giveCoin|| false
          this.checkedDefault = response.data?.condition?.giveTaskTicket|| false
          this.id = response.data?.id
        }
      }).catch(e => {
        console.log(e)
      })
    },
    save () {
      this.loading = true
      let _params = {
        id: this.id,
        condition: {
          giveCoin: this.checkedGiveCoin,
          giveTaskTicket: this.checkedDefault,
        },
        enabled: this.bindStatus
      }
      bindEmailSet_save(_params).then(response => {
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
