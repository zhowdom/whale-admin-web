<template>
  <div class="star-goodp">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-tabs class="star-goodp-card-tabs" v-model="activeName" type="card">
          <el-tab-pane label="等级成长设置" name=0 v-hasPermi="['integral:asterisk:list:expert']">
            <star-good-growing-tables v-if="activeName==0" :should-update="updateGrTable" :cur-type="1" @updateModal="editUpdateModal" />
          </el-tab-pane>
          <el-tab-pane label="用户降级后再升级设置" name=1 v-hasPermi="['integral:asterisk:list:expert']">
            <star-good-regrowing-tables v-if="activeName==1" :should-update="updateReGrTable" :cur-type="2" @updateModal="editUpdateModal" />
          </el-tab-pane>
          <el-tab-pane label="权益设置" name=2 v-hasPermi="['integral:asterisk:list:benefit']">
            <star-good-equity-setting-tables v-if="activeName==2" :should-update="updateEqTable" @updateModal="editUpdateModal" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <div class="star-goodp-top-btn">
      <el-button type="primary" v-if="currActiveBtn" icon="el-icon-plus" @click="addTalentFn">新增达人</el-button>
      <el-button type="primary" v-else icon="el-icon-plus" @click="addEqSettingFn">新增权益</el-button>
    </div>
    <div class="modals">
      <star-goodp-modal :is-show-talent="isShowTalent" :cur-type="type" :title="talentModalTitle" :row-data="rowData" @updateModal="updateModal"/>                  <!-- 星级达人弹窗 -->
      <star-good-equity-setting-modal :is-show-eq-setting="isShowEqSetting" :row-data="rowData" :title="eqSettingModalTitle" @updateModal="updateModal"/>    <!-- 权益配置弹窗 -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'StarGoodP',
  components: {
    StarGoodGrowingTables: () => import('./growingTables'),
    StarGoodRegrowingTables: () => import('./regrowingTables'),
    StarGoodEquitySettingTables: () => import('./equitySettingTables'),
    StarGoodpModal: () => import('./starGoodPModal'),
    StarGoodEquitySettingModal: () => import('./equitySettingModal'),
  },
  computed: {
    currActiveBtn () {
      return this.activeName != 2;
    }
  },
  data() {
    return {
      activeName: 0,
      isShowTalent: false,
      isShowEqSetting: false,
      talentModalTitle: '',
      eqSettingModalTitle: '',
      rowData: {},
      isEdit: false,
      type: 1,
      updateGrTable: false,
      updateReGrTable: false,
      updateEqTable: false
    }
  },
  methods: {
    // 添加达人
    addTalentFn () {
      this.isShowTalent = true;
      this.talentModalTitle = '新增达人设置';
      this.type = this.activeName == 0 ? 1 : 2;
      if (this.activeName == 0) {
        this.updateGrTable = false;
      } else if (this.activeName == 1) {
        this.updateReGrTable = false;
      }
    },
    // 添加权益
    addEqSettingFn () {
      this.isShowEqSetting = true;
      this.updateEqTable = false;
      this.eqSettingModalTitle = '新增权益设置';
    },
    // 新增更新弹窗
    updateModal (args) {
      if (args == 'eq') {
        this.eqSettingModalTitle = '';
        this.isShowEqSetting = false;
        this.updateEqTable = true;
      } else {
        this.talentModalTitle = '';
        this.isShowTalent = false;
        if (this.activeName == 0) {
          this.updateGrTable = true;
        } else if (this.activeName == 1) {
          this.updateReGrTable = true;
        }
      }
      this.rowData = {};
    },
    // 修改更新
    editUpdateModal ({name, data}) {
      if (name != 2) {
        this.isShowTalent = true;
        this.talentModalTitle = '编辑达人设置';
      } else {
        this.isShowEqSetting = true;
        this.eqSettingModalTitle = '编辑权益设置';
      }

      this.type = name == 0 ? 1 : 2;
      if (name == 0) {
        this.updateGrTable = false;
      } else if (name == 1) {
        this.updateReGrTable = false;
      } else {
        this.updateEqTable = false;
      }
      this.rowData = data;
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/element-variables.scss";

  .star-goodp {
    padding: 20px;
    position: relative;
    & .star-goodp-card-tabs {
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
    & .star-goodp-top-btn {
      position: absolute;
      top: 20px;
      right: 20px;
    }
  }
</style>
