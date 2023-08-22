<template>
  <div class="star-goodp-modal">
    <el-dialog
      center
      :title="title"
      width="1200px"
      destroy-on-close
      :visible.sync="show"
      :before-close="closeModal"
      :close-on-click-modal="false"
    >
      <el-form :model="modalForm" inline-message :rules="rules" ref="modalForm" label-width="130px" class="modalForm">

        <el-form-item class="form-base-class" label="等级名称：" v-if="!!rowData.createAt">
          {{editStarLevel}}
        </el-form-item>

        <el-form-item class="form-base-class" label="等级名称：" prop="levelTag" v-else>
          <el-select v-model="modalForm.levelTag" placeholder="请选择等级名称">
            <el-option v-for="item in types" :key="item.msg" :label="item.msg+'达人'" :value="item.tag"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="form-base-class" label="所需升级类型">
          <el-checkbox-group v-model="updateType" disabled>
            <el-checkbox label="全局配置项" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item class="form-base-class last-form-item" label="条件编码设置">
          <div class="condition-settting">
            <el-row class="row-setting">
              <el-col :span="5"><div class="code-container">条件编码 BSC0070202101</div></el-col>
              <el-col :span="18">
                <div class="baseActivity">
                  <el-row>
                    <el-col :span="24">
                      <!-- 基础活跃度 -->
                      <el-form-item label-width="96px" :inline-message="false" prop="activeWorthMin" label="基础活跃度">
                        <el-input class="item1-input" v-model="modalForm.activeWorthMin">
                          <i slot="prefix" class="el-icon-customize el-input__icon"></i>
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <!-- 单项提升值： -->
                      <el-form-item label-width="96px" :inline-message="false" prop="activeWorthExtendPerOne" label="单项提升值">
                        <el-input class="item1-input" v-model="modalForm.activeWorthExtendPerOne"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <!-- 提升最高值 -->
                      <el-form-item label-width="96px" :inline-message="false" prop="activeWorthExtendMax" label="提升最高值">
                        <el-input class="item1-input" v-model="modalForm.activeWorthExtendMax"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <!-- 显示说明 -->
                      <el-form-item label-width="96px" prop="activeWorthExtendDesc" label="显示说明">
                        <el-input type="textarea" maxlength="30" show-word-limit :rows="3" resize="none" v-model="modalForm.activeWorthExtendDesc" placeholder="基础活跃值的限制说明"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
            </el-row>

            <el-row class="row-setting">
              <el-col :span="5"><div class="code-container">条件编码 BSC0070202102</div></el-col>
              <el-col :span="18">
                <div class="baseActivity">
                  <el-row>
                    <el-col :span="24">
                      <!-- 有效直推达 -->
                      <el-form-item class="inline-block" label-width="96px" :inline-message="false" prop="directPromotionMemberMin" label="有效直推达">
                        <el-input class="item1-input item2-input" v-model="modalForm.directPromotionMemberMin"></el-input>
                      </el-form-item>
                      <el-form-item class="inline-block" label-width="160px" label="直推的用户基础活跃度">
                        <el-input class="item1-input item2-input" v-model="directPromotionMemberMin1" disabled>
                          <i slot="prefix" class="el-icon-customize el-input__icon"></i>
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <!-- 单项提升值： -->
                      <el-form-item label-width="96px" :inline-message="false" prop="directPromotionMemberExtendPerOne" label="单项提升值">
                        <el-input class="item1-input" v-model="modalForm.directPromotionMemberExtendPerOne"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <!-- 提升最高值 -->
                      <el-form-item label-width="96px" :inline-message="false" prop="directPromotionMemberExtendMax" label="提升最高值">
                        <el-input class="item1-input" v-model="modalForm.directPromotionMemberExtendMax"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <!-- 显示说明 -->
                      <el-form-item label-width="96px" prop="directPromotionMemberExtendDesc" label="显示说明">
                        <el-input type="textarea" maxlength="30" show-word-limit :rows="3" resize="none" v-model="modalForm.directPromotionMemberExtendDesc" placeholder="有效直推，以及直推活跃度的限制说明"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
            </el-row>

            <el-row class="row-setting">
              <el-col :span="5"><div class="code-container">条件编码 BSC0070202103</div></el-col>
              <el-col :span="18">
                <div class="baseActivity">
                  <el-row>
                    <el-col :span="24">
                      <!-- 团队活跃值 -->
                      <el-form-item label-width="96px" :inline-message="false" prop="activeTeamWorthMin" label="团队活跃值">
                        <el-input class="item1-input" v-model="modalForm.activeTeamWorthMin">
                          <i slot="prefix" class="el-icon-customize el-input__icon"></i>
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <!-- 单项提升值： -->
                      <el-form-item label-width="96px" :inline-message="false" prop="activeTeamWorthExtendPerOne" label="单项提升值">
                        <el-input class="item1-input" v-model="modalForm.activeTeamWorthExtendPerOne"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <!-- 提升最高值 -->
                      <el-form-item label-width="96px" :inline-message="false" prop="activeTeamWorthExtendMax" label="提升最高值">
                        <el-input class="item1-input" v-model="modalForm.activeTeamWorthExtendMax"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <!-- 显示说明 -->
                      <el-form-item label-width="96px" prop="activeTeamWorthExtendDesc" label="显示说明">
                        <el-input type="textarea" maxlength="30" show-word-limit :rows="3" resize="none" v-model="modalForm.activeTeamWorthExtendDesc" placeholder="团队活跃值的限制说明"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
            </el-row>

            <el-row class="row-setting">
              <el-col :span="5"><div class="code-container">条件编码 BSC0070202104</div></el-col>
              <el-col :span="18">
                <div class="baseActivity">
                  <el-row>
                    <el-col :span="24">
                      <!-- 部落总活跃值 -->
                      <el-form-item label-width="108px" :inline-message="false" prop="activeTribeWorthMin" label="部落总活跃值">
                        <el-input class="item1-input" v-model="modalForm.activeTribeWorthMin">
                          <i slot="prefix" class="el-icon-customize el-input__icon"></i>
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <!-- 单项提升值： -->
                      <el-form-item label-width="96px" :inline-message="false" prop="activeTribeWorthExtendPerOne" label="单项提升值">
                        <el-input class="item1-input" v-model="modalForm.activeTribeWorthExtendPerOne"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <!-- 提升最高值 -->
                      <el-form-item label-width="96px" :inline-message="false" prop="activeTribeWorthExtendMax" label="提升最高值">
                        <el-input class="item1-input" v-model="modalForm.activeTribeWorthExtendMax"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <!-- 显示说明 -->
                      <el-form-item label-width="96px" prop="activeTribeWorthExtendDesc" label="显示说明">
                        <el-input type="textarea" maxlength="30" show-word-limit :rows="3" resize="none" v-model="modalForm.activeTribeWorthExtendDesc" placeholder="部落总活跃值的说明"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
            </el-row>

            <el-row class="row-setting">
              <el-col :span="5"><div class="code-container">条件编码 BSC0070202105</div></el-col>
              <el-col :span="18">
                <div class="baseActivity">
                  <el-row>
                    <el-col :span="24">
                      <!-- 我的直推有 -->
                      <el-form-item class="inline-block" label-width="96px" :inline-message="false" prop="directPromotionLevelQuantity" label="我的直推有">
                        <el-input class="item1-input" v-model="modalForm.directPromotionLevelQuantity">
                          <template slot="append">个</template>
                        </el-input>
                      </el-form-item>
                      <el-form-item class="inline-block" label-width="26px" :inline-message="false" prop="directPromotionLevelTag">
                        <el-select v-model="modalForm.directPromotionLevelTag" placeholder="请选择等级名称">
                          <el-option v-for="item in types" :key="item.msg" :label="item.msg+'达人'" :value="item.tag"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <!-- 单项提升值： -->
                      <el-form-item label-width="96px" :inline-message="false" prop="directPromotionLevelExtendPerOne" label="单项提升值">
                        <el-input class="item1-input" v-model="modalForm.directPromotionLevelExtendPerOne"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <!-- 提升最高值 -->
                      <el-form-item label-width="96px" :inline-message="false" prop="directPromotionLevelExtendMax" label="提升最高值">
                        <el-input class="item1-input" v-model="modalForm.directPromotionLevelExtendMax"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <!-- 显示说明 -->
                      <el-form-item label-width="96px" prop="directPromotionLevelExtendDesc" label="显示说明">
                        <el-input type="textarea" maxlength="30" show-word-limit :rows="3" resize="none" v-model="modalForm.directPromotionLevelExtendDesc" placeholder="我的直推人数说明"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeModal">取 消</el-button>
        <el-button @click="resetModalData">重 置</el-button>
        <template v-if="isEdit">
          <el-button type="primary" @click="saveModalData" v-hasPermi="['integral:asterisk:update:expert']">保 存</el-button>
        </template>
        <template v-else>
          <el-button type="primary" @click="saveModalData" v-hasPermi="['integral:asterisk:save:expert']">保 存</el-button>
        </template>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {asteriskTypes, saveExpert, updateExpert} from '@/api/pointsMgmt/starTalent';

export default {
  name: 'StarGoodpModal',
  props: {
    title: String,
    isShowTalent: Boolean,
    updateModal: Function,
    rowData: Object,
    curType: Number,
  },
  data () {
    return {
      show: false,
      modalForm: {
        type: 1,                                // 类型 1等级成长配置 2降级再升级对应等级成长配置
        activeTeamWorthExtendDesc: "",          // 团队活跃值显示说明
				activeTeamWorthExtendMax: 0,            // 团队活跃值最大活跃
				activeTeamWorthExtendPerOne: 0,         // 团队活跃值单项活跃
				activeTeamWorthMin: 0,                  // 最小团队活跃值

				activeTribeWorthExtendDesc: "",         // 部落活跃值显示说明
				activeTribeWorthExtendMax: 0,           // 部落活跃值最大活跃
				activeTribeWorthExtendPerOne: 0,        // 部落活跃值单项活跃
				activeTribeWorthMin: 0,                 // 最小部落活跃值

				activeWorthExtendDesc: "",              // 基础活跃值显示说明
				activeWorthExtendMax: 0,                // 基础活跃值对应最大活跃
				activeWorthExtendPerOne: 0,             // 基础活跃值对应单项活跃
				activeWorthMin: 0,                      // 最小基础活跃值

				directPromotionLevelExtendDesc: "",     // 最小直推等级显示说明
				directPromotionLevelExtendMax: 0,       // 最小直推等级最大活跃
				directPromotionLevelExtendPerOne: 0,    // 最小直推等级单项活跃
				directPromotionLevelQuantity: 0,        // 最小直推等级数量
				directPromotionLevelTag: "",            // 最小直推等级标识

				directPromotionMemberExtendDesc: "",    // 有效直推显示说明
				directPromotionMemberExtendMax: 0,      // 有效直推最大活跃
				directPromotionMemberExtendPerOne: 0,   // 有效直推单项活跃
				directPromotionMemberMin: 0,            // 最小有效直推，直推的用户基础活跃值大于0

        levelTag: "",                           // 等级标识
      },
      id: '',
      rules: {
        levelTag: [
          { type: 'string', required: true, message: '等级名称不能为空', trigger: 'change' }
        ],
        activeWorthMin: [
          { required: true, message: '基础活跃度不能为空', trigger: 'blur' },
          { pattern: /^(0|[1-9][0-9]*)$/, message: '基础活跃度为大于等于1的数字', trigger: 'blur' }
        ],
        activeWorthExtendPerOne: [
          { required: true, message: '基础活跃度单项提升值不能为空', trigger: 'blur' },
          { pattern: /^(0|[1-9][0-9]*)$/, message: '基础活跃度单项提升值为大于等于1的数字', trigger: 'blur' }
        ],
        activeWorthExtendMax: [
          { required: true, message: '基础活跃度最大提升值不能为空', trigger: 'blur' },
          { pattern: /^(0|[1-9][0-9]*)$/, message: '基础活跃度最大提升值为大于等于1的数字', trigger: 'blur' }
        ],
        directPromotionMemberMin: [
          { required: true, message: '有效直推值不能为空', trigger: 'blur' },
          { pattern: /^(0|[1-9][0-9]*)$/, message: '有效直推值为大于等于1的数字', trigger: 'blur' }
        ],
        directPromotionMemberExtendPerOne: [
          { required: true, message: '有效直推单项提升值不能为空', trigger: 'blur' },
          { pattern: /^(0|[1-9][0-9]*)$/, message: '有效直推单项提升值为数字', trigger: 'blur' }
        ],
        directPromotionMemberExtendMax: [
          { required: true, message: '有效直推最大提升值不能为空', trigger: 'blur' },
          { pattern: /^(0|[1-9][0-9]*)$/, message: '有效直推最大提升值为大于等于1的数字', trigger: 'blur' }
        ],
        activeTeamWorthMin: [
          { required: true, message: '团队活跃值不能为空', trigger: 'blur' },
          { pattern: /^(0|[1-9][0-9]*)$/, message: '团队活跃值为大于等于1的数字', trigger: 'blur' }
        ],
        activeTeamWorthExtendPerOne: [
          { required: true, message: '团队活跃单项提升值不能为空', trigger: 'blur' },
          { pattern: /^(0|[1-9][0-9]*)$/, message: '团队活跃单项提升值为大于等于1的数字', trigger: 'blur' }
        ],
        activeTeamWorthExtendMax: [
          { required: true, message: '团队活跃最大提升值不能为空', trigger: 'blur' },
          { pattern: /^(0|[1-9][0-9]*)$/, message: '团队活跃最大提升值为大于等于1的数字', trigger: 'blur' }
        ],
        activeTribeWorthMin: [
          { required: true, message: '最小部落活跃值不能为空', trigger: 'blur' },
          { pattern: /^(0|[1-9][0-9]*)$/, message: '最小部落活跃值为大于等于1的数字', trigger: 'blur' }
        ],
        activeTribeWorthExtendPerOne: [
          { required: true, message: '部落活跃单项提升值不能为空', trigger: 'blur' },
          { pattern: /^(0|[1-9][0-9]*)$/, message: '最小部落活跃单项提升值为大于等于1的数字', trigger: 'blur' }
        ],
        activeTribeWorthExtendMax: [
          { required: true, message: '部落活跃最大提升值不能为空', trigger: 'blur' },
          { pattern: /^(0|[1-9][0-9]*)$/, message: '部落活跃最大提升值为大于等于1的数字', trigger: 'blur' }
        ],

        directPromotionLevelQuantity: [
          { required: true, message: '最小直推等级数量不能为空', trigger: 'blur' },
          { pattern: /^(0|[1-9][0-9]*)$/, message: '最小直推等级数量为大于等于1的数字', trigger: 'blur' }
        ],
        directPromotionLevelTag: [
          { required: true, message: '最小直推等级标识不能为空', trigger: 'blur' }
        ],
        directPromotionLevelExtendPerOne: [
          { required: true, message: '最小直推等级单项活跃值不能为空', trigger: 'blur' },
          { pattern: /^(0|[1-9][0-9]*)$/, message: '最小直推等级单项活跃值为大于等于1的数字', trigger: 'blur' }
        ],
        directPromotionLevelExtendMax: [
          { required: true, message: '最小直推等级最大活跃值不能为空', trigger: 'blur' },
          { pattern: /^(0|[1-9][0-9]*)$/, message: '最小直推等级最大活跃值为大于等于1的数字', trigger: 'blur' }
        ],
      },
      types: [],
      updateType: true,
      directPromotionMemberMin1: 1,
      isEdit: false,
    }
  },
  computed: {
    editStarLevel () {
      const curLevel = this.types.filter(item => item.tag == this.rowData.levelTag);
      return curLevel ? curLevel[0].msg + '达人' : '-';
    }
  },
  mounted () {
    this.asteriskTypesRequest();
  },
  methods: {
    // 获取星级类型清单
    async asteriskTypesRequest () {
      try {
        const {code, message, data: {list}} = await asteriskTypes();
        if (code == 200) {
          list[0].msg = '无星';
          this.types = list;
        } else {
          this.$message({type: 'error', message});
        }
      } catch (error) {
        // ...
      }
    },
    // 保存/更新 权益配置
    async submitData () {
      try {
        // 编辑 -- 更新提交 新建 -- 保存提交
        let id = this.id;
        let data = this.modalForm;
        data = this.isEdit ? {...data, id} : data;
        console.log(data);
        let requestFn = this.isEdit ? updateExpert : saveExpert;
        let {code, message} = await requestFn(data);
        if (code == 200) {
          this.$message({type: 'success', message});
          this.closeModal();
        } else {
          this.$message({type: 'error', message});
        }
      } catch (error) {
        // ...
      }
    },
    // 关闭弹窗
    closeModal () {
      this.$emit('updateModal', 'gr');
      this.resetModalData();
    },
    // 保存成长对话框数据
    saveModalData () {
      this.$refs['modalForm'].validate((valid) => {
        if (valid) {
          this.submitData();
        } else {
          return false;
        }
      });
    },
    // 重置成长对话框数据
    resetModalData () {
      const levelTag = this.modalForm.levelTag;
      const initData = this.$options.data().modalForm;
      const resetData = this.isEdit ? {...initData, levelTag} : initData;
      this.modalForm = {...this.modalForm, ...resetData};
      this.modalForm.type = this.curType;
      console.log(this.modalForm.type);
      this.$nextTick(() => {
        this.$refs['modalForm'].clearValidate();
      });
    },
  },
  watch: {
    isShowTalent: function (nV, oV) {
      this.show = nV;
    },
    rowData: function (nV, oV) {
      if (Object.keys(nV).length) {
        const {
          type,
          activeTeamWorthExtendDesc,
          activeTeamWorthExtendMax,
          activeTeamWorthExtendPerOne,
          activeTeamWorthMin,
          activeTribeWorthExtendDesc,
          activeTribeWorthExtendMax,
          activeTribeWorthExtendPerOne,
          activeTribeWorthMin,
          activeWorthExtendDesc,
          activeWorthExtendMax,
          activeWorthExtendPerOne,
          activeWorthMin,
          directPromotionLevelExtendDesc,
          directPromotionLevelExtendMax,
          directPromotionLevelExtendPerOne,
          directPromotionLevelQuantity,
          directPromotionLevelTag,
          directPromotionMemberExtendDesc,
          directPromotionMemberExtendMax,
          directPromotionMemberExtendPerOne,
          directPromotionMemberMin,
          levelTag,
          id
        } = nV;
        this.modalForm = {
          ...this.modalForm,
          ...{
            type,
            levelTag,
            activeTeamWorthExtendDesc,
            activeTeamWorthExtendMax,
            activeTeamWorthExtendPerOne,
            activeTeamWorthMin,
            activeTribeWorthExtendDesc,
            activeTribeWorthExtendMax,
            activeTribeWorthExtendPerOne,
            activeTribeWorthMin,
            activeWorthExtendDesc,
            activeWorthExtendMax,
            activeWorthExtendPerOne,
            activeWorthMin,
            directPromotionLevelExtendDesc,
            directPromotionLevelExtendMax,
            directPromotionLevelExtendPerOne,
            directPromotionLevelQuantity,
            directPromotionLevelTag,
            directPromotionMemberExtendDesc,
            directPromotionMemberExtendMax,
            directPromotionMemberExtendPerOne,
            directPromotionMemberMin
          }
        };

        this.id = id;
      }
    },
    title: function (nV, oV) {
      this.isEdit = nV ? nV.indexOf('编辑') > -1 : false;
    },
    curType: function (nV, oV) {
      this.modalForm.type = nV;
    }
  }
}
</script>

<style lang="scss" scoped>
  .star-goodp-modal {
    .modalForm {
      border: 1px solid #d3d3d4;
      & .form-base-class {
        margin-bottom: 0;
        & > ::v-deep .el-form-item__label {
          padding: 3px 8px;
          line-height: 46px;
        }
        & > ::v-deep .el-form-item__content {
          padding: 7px 8px 0;
          border-left: 1px solid #d3d3d4 !important;
        }
      }
      & .form-base-class:not(:last-child) {
        border-bottom: 1px solid #d3d3d4;
      }
      & .last-form-item {
        & > ::v-deep .el-form-item__label {
          height: 755px;
          line-height: 755px;
        }
        ::v-deep .el-form-item__content {
          padding-top: 0;
        }
      }
    }
    .item1-input {
      width: 270px;
    }
    .item2-input {
      width: 200px;
    }
    ::v-deep .el-icon-customize::before {
      content: '>=';
    }

    .dialog-footer {
      button {
        margin-right: 50px;
        padding: 10px 30px;
      }
    }

    .condition-settting {
      .row-setting {
        margin-right: -8px;
        margin-left: -8px;
        border-bottom: 1px solid #d3d3d4 !important;
        height: 225px;
        .code-container {
          height: 225px;
          line-height: 225px;
          text-align: center;
        }
        .baseActivity {
          padding: 15px 8px;
          border-left: 1px solid #d3d3d4 !important;
          & .el-col .el-form-item {
            margin-bottom: 24px;
            & ::v-deep .el-form-item__label {
              font-weight: normal;
            }
          }
          & .el-col:last-child .el-form-item {
            margin-bottom: 0px;
          }
        }
      }
      .row-setting:last-child {
        height: 285px;
        border-bottom: none !important;
        .code-container {
          height: 285px;
          line-height: 285px;
        }
      }
    }
  }
</style>
