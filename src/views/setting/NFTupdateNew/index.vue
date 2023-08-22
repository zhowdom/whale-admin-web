<template>
  <div class="update">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-tabs class="update-card-tabs" v-model="activeName" type="card">
          <el-tab-pane label="NFT版本管理" name=0 v-hasPermi="['setting:version:page']">
            <update-mgmt v-if="activeName=='0'"/>
          </el-tab-pane>
          <el-tab-pane label="NFT版本待发布" name=1 v-hasPermi="['setting:version:page']">
            <to-be-released v-if="activeName=='1'" @updateTab="update"/>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'Update',
  components: {
    UpdateMgmt: () => import('./updateMgmt'),
    ToBeReleased: () => import('./toBeReleased'),
  },
  data () {
    return {
      activeName: '0',
    }
  },
  beforeRouteEnter (to, from, next) {
    const fromPath = from.path;

    const toBeReleased = ['/setting/toBeReleasedAddNew', '/setting/toBeReleasedEditNew'];
    next(vm => {
      const release = window.sessionStorage.getItem('release');
      if (toBeReleased.includes(fromPath)) {
        if (release === '1') {
          vm.activeName = '0';
        } else {
          vm.activeName = '1';
        }
      } else {
        if (release === '0') {
          vm.activeName = '1';
        } else {
          vm.activeName = '0';
        }
      };
      window.sessionStorage.removeItem('release');
      return true;
    })
  },
  methods: {
    update () {
      this.activeName = '0';
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/element-variables.scss";

  .update {
    padding: 20px;
    position: relative;
    & .update-card-tabs {
      ::v-deep .el-tabs__header {
        border: none;
        & .el-tabs__item {
          border-bottom-color: #dfe4ed !important;
          &.is-active {
            background-color: $--color-primary;
            color: #fff;
          }
        }
      }
    }
  }
</style>
