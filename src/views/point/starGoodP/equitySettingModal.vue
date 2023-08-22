<template>
  <div class="equity-setting-modal">
    <el-dialog
      center
      :title="title"
      width="800px"
      :destroy-on-close="true"
      :visible.sync="show"
      :before-close="closeModal"
      :close-on-click-modal="false"
    >
      <el-form :model="modalForm" inline-message :rules="rules" ref="modalForm" label-width="160px" class="modalForm">
        <el-form-item label="等级名称" v-if="!!rowData.createAt">
          {{editStarLevel}}
        </el-form-item>
        <el-form-item label="等级名称" prop="levelTag" required v-else>
          <el-select class="item1-input" v-model="modalForm.levelTag" placeholder="请选择等级名称">
            <el-option v-for="item in types" :key="item.msg" :label="item.msg+'达人'" :value="item.tag"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item inline-message label="用户转赠手续费分红" prop="transferWhalePeasProfitRate">
          <el-input class="item1-input" v-model.number="modalForm.transferWhalePeasProfitRate" placeholder="请输入可分配比例">
            <template slot="append">%</template>
          </el-input>
          <div class="form-bottom-tips">
            获得分红前提：账号正常，若被冻结，没有资格分红；<br>
            手续费分红总额：平台收取用户提现的手续费总额；<br>
            得到的手续费结果：手续费分红总额（Candy总额）*可分配比例/能<br>
            获得分红资格的一星达人数量
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeModal">取 消</el-button>
        <el-button @click="resetModalData">重 置</el-button>
        <template v-if="isEdit">
          <el-button v-hasPermi="['integral:asterisk:update:benefit']" type="primary" @click="saveModalData">保 存</el-button>
        </template>
        <template v-else>
          <el-button v-hasPermi="['integral:asterisk:save:benefit']" type="primary" @click="saveModalData">保 存</el-button>
        </template>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import math from '@/utils/math';
import {asteriskTypes, saveBenefit, updateBenefit} from '@/api/pointsMgmt/starTalent';

export default {
  name: 'EquitySettingModal',
  props: {
    title: String,
    isShowEqSetting: Boolean,
    updateModal: Function,
    rowData: Object,
  },
  data () {
    return {
      isEdit: false,
      show: false,
      modalForm: {
        levelTag: '',
        transferWhalePeasProfitRate: 0
      },
      rules: {
        levelTag: [
          { required: true, message: '等级名称不能为空', trigger: 'change' },
        ],
        transferWhalePeasProfitRate: [
          { required: true, message: '手续费分红不能为空', trigger: 'change' },
          { type: 'number', min: 0, max: 100, message: '手续费分红为数字且取值0-100整数', trigger: ['change', 'blur'] }
        ]
      },
      types: [],
      id: '',
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
          // 删除无星达人
          list.shift();
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
        let id = this.id;
        let data = {
          levelTag: this.modalForm.levelTag,
          transferWhalePeasProfitRate: math.divide(this.modalForm.transferWhalePeasProfitRate, 100, 2)
        };
        data = this.isEdit ? {...data, id} : data;
        // 编辑 -- 更新提交 新建 -- 保存提交
        const requestFn = this.isEdit ? updateBenefit : saveBenefit;
        const {code, message} = await requestFn(data);
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
      this.$emit('updateModal', 'eq');
      this.resetModalData();
    },
    // 保存权益对话框数据
    saveModalData () {
      this.$refs['modalForm'].validate((valid) => {
        if (valid) {
          this.submitData();
        } else {
          return false;
        }
      });
    },
    // 重置权益对话框数据
    resetModalData () {
      const levelTag = this.modalForm.levelTag;
      const initData = this.$options.data().modalForm;
      const resetData = this.isEdit ? {...initData, levelTag} : initData;
      this.modalForm = {...this.modalForm, ...resetData};
      this.$nextTick(() => {
        this.$refs['modalForm'].clearValidate();
      });
    }
  },
  watch: {
    isShowEqSetting: function (nV, oV) {
      this.show = nV;
    },
    rowData: function (nV, oV) {
      if (Object.keys(nV).length) {
        let {levelTag, transferWhalePeasProfitRate, id} = nV;
        this.id = id;
        this.modalForm = {
          ...this.modalForm,
          tag: levelTag,
          transferWhalePeasProfitRate: math.multiply(transferWhalePeasProfitRate || 0, 100),
        };
      }
    },
    title: function (nV, oV) {
      this.isEdit = nV ? nV.indexOf('编辑') > -1 : false;
    }
  }
}
</script>

<style lang="scss" scoped>
  .equity-setting-modal {
    .modalForm {
      border: 1px solid #d3d3d4;
      & .el-form-item:not(:last-child) {
        border-bottom: 1px solid #d3d3d4;
      }
      & .el-form-item  {
        margin-bottom: 0;
        ::v-deep .el-form-item__label {
          padding: 3px 8px;
          line-height: 46px;
        }
        ::v-deep .el-form-item__content {
          padding: 7px 8px 0;
          border-left: 1px solid #d3d3d4 !important;
        }
      }
      & .el-form-item:last-child {
        ::v-deep .el-form-item__label{
          height: 154px;
          line-height: 154px !important;
        }
      }
      .item1-input {
        width: 240px;
      }
    }

    .form-bottom-tips {
      display: block;
      font-size: 13px;
      line-height: 22px;
      color: #888;
      font-style: normal;
      font-weight: 500;
      margin-top: 10px;
      position: absolute;
    }

    .dialog-footer {
      button {
        margin-right: 40px;
        padding: 10px 30px;
      }
    }
  }
</style>
