<template>
  <div class="userlistwapper" style="padding:20px;">
    <div class="ttwbtns" style="margin-top:30px;margin-left:30px;">
       <el-button type="primary" @click="jumpTo('/bannerConfig/appBanner')">APP广告配置及审核</el-button>
       <span>【点击】跳转至【Banner 管理 - (APP - banner 配置)】</span>
    </div>
    <div class="ttwbtns" style="margin-left:30px;">
       <el-button type="primary" @click="jumpTo('/bannerConfig/dappBanner')">DAPP广告配置及审核</el-button>
       <span>【点击】跳转至【Banner 管理 - (DAPP - banner 配置)】</span>
    </div>

    <div class="ttwbtns" style="margin-left:30px;">
       <el-button type="primary" @click="jumpTo('/setting/startScreenConfV2')">开屏页设置及审核</el-button>
       <span>【点击】跳转至【设置 - (DAPP - （开屏页设置）)】</span>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {}
  },
  computed: {},
  created () {},
  methods: {
    jumpTo(path) {
      this.$router.push(path)
    }
  }
};
</script>
<style lang="scss">
.ttwbtns{
  margin-bottom: 20px;
  font-size: 13px;
  color: #333;
}
</style>
