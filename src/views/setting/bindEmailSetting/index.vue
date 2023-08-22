<template>
  <div class="bindEmailSetBox">
    <div class="clearfix">
      <div class="fl" style="width:90px;text-align:right;">绑定邮箱：</div>
      <div class="fl">
      <el-radio v-model="bindRadio" label="1">选择绑定</el-radio><br><br>
      <el-radio v-model="bindRadio" label="2">强制绑定</el-radio>
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
      1. 默认勾选【选择绑定】<br>
      2. 【选择绑定】 -  手机注册的用户，可自行选择是否绑定<br>
      3.【强制绑定】 -  手机注册的用户，需要强制绑定，不绑定，即进入不了APP应用
    </div>

    <el-button type="primary" :loading="loading" @click="save" v-hasPermi="['member:setting:storage']">保存</el-button>
  </div>
</template>

<script>
import {bindEmailSet_save, bindEmailSet_query} from '@/api/games';

export default {
  name: 'ControlPointsConf',
  data () {
    return {
      bindRadio: '1',
      bindStatus: false,
      loading: false,
      id: null,
      type: null,
    }
  },
  mounted () {
    this.isAuth.isPermi(['member:setting:type']) && this.query()
  },
  methods: {
    query () {
      bindEmailSet_query().then(response => {
        if (response.code == 200) {
          this.bindRadio = response.data?.condition?.bindingType+''||'1'
          this.bindStatus = response.data?.enabled
          this.type = response.data?.type
          this.id = response.data?.id
        }
      }).catch(e => {
        console.log(e)
      })
    },
    save () {
      this.loading = true
      bindEmailSet_save({
        condition: {
          bindingType: +this.bindRadio
        },
        enabled: this.bindStatus,
        id: this.id,
        type: this.type
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
