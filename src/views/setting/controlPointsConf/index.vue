<template>
  <div class="control-points-conf">
    <el-card class="box-card">
      <div class="wrap">
        <div class="part3">
          <el-form :model="subForm" :rules="rules" ref="subForm" class="bottom-form mt100 ml200" label-position="top">
            <div class="item-wrap" v-for="(item, index) in subForm.items" :key="index">
              <div class="custom-item mr100">
                <el-form-item :prop="'items['+index+'].redouble'" label="赠送条件: " :rules="rules.redouble">
                  <el-input class="input-width" v-model="item.redouble"></el-input>
                  <div class="input-text ml10">倍 基础管制分</div>
                </el-form-item>
              </div>

              <div class="custom-item mr100">
                <el-form-item label="赠送任务券: " required>
                  <el-checkbox v-model="item.give"></el-checkbox>
                  <div class="sub-custom-item ml10">
                    <div class="input-text mr10">赠送</div>
                    <el-form-item :prop="'items['+index+'].num'" :rules="rules.num">
                      <el-input class="input-width" v-model="item.num"></el-input>
                    </el-form-item>
                    <div class="input-text ml10 mr10">张</div>
                  </div>
                  <div class="sub-custom-item">
                    <el-form-item :prop="'items['+index+'].select'" :rules="rules.select">
                      <el-select v-model="item.select" placeholder="请选择" clearable>
                        <template v-for="sub in list">
                          <el-option :label="sub.taskName" :value="sub.id" :key="sub.id"></el-option>
                        </template>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-form-item>
              </div>

              <div class="custom-item mr15">
                <el-form-item class="switcher" :prop="'items['+index+'].enabled'" label="是否禁用: ">
                  <el-switch
                    :width="60"
                    class="custom-switcher"
                    v-model="item.enabled"
                    active-text="是"
                    inactive-text="否"
                    :active-value="false"
                    :inactive-value="true"
                  >
                  </el-switch>
                </el-form-item>
              </div>

              <div class="custom-item">
                <el-form-item>
                  <el-button type="primary" size="small" v-if="index==0" @click="addItem">增加</el-button>
                  <el-button type="danger" size="small" v-if="index!=0&&!item.id" @click="delItem(index)">删除</el-button>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
        <div class="form-btns">
          <el-button type="primary" @click="submitForm" v-hasPermi="['blindBox:control_reward_setting:saveOrUpdate']">保存</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import {blindBoxRuleAddCoupons} from '@/api/games';
import {settingList, settingSaveOrUpdate, settingEnabled} from '@/api/setting/ctrlPoints.js';

export default {
  name: 'ControlPointsConf',
  data () {
    return {
      list: [],
      subForm: {
        items: [
          {
            isFirst: true,
            enabled: true,
            redouble: 1,
            select: '',
            give: true,
            num: 1,
          }
        ]
      },
      rules: {
        redouble: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { pattern: /(^[1-9]\d{0,3}(\.\d)?|10000|10000.0)$/, message: '1-10000最多1位小数', trigger: 'blur' },
        ],
        num: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { pattern: /(^[1-9]\d{0,3}(\.\d)?|10000|10000.0)$/, message: '1-10000最多1位小数', trigger: 'blur' },
        ],
        select: [
          { required: true, message: '选择不能为空', trigger: ['blur', 'change'] },
        ],
      },
    }
  },
  mounted () {
    this.blindBoxRuleAddCouponsReq();
    this.settingListReq();
  },
  methods: {
    // 奖励券列表
    async blindBoxRuleAddCouponsReq() {
      try {
        const {code, message, data} = await blindBoxRuleAddCoupons({
          currentPage: 1,
          pageSize: 30,
          statusType: 1,
          taskType: 8
        });

        if (code == 200) {
          this.list = data?.list || [];
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
    // 获取列表
    async settingListReq () {
      try {
        const {code, message, data} = await settingList();
        if (code == 200) {

          const {subForm} = this.$options.data();
          this.subForm = subForm;

          data?.list?.map(item => {
            const {enabled, id, redouble} = item;
            const taskTicket = item?.standardAward?.taskTicket || {};

            this.subForm.items.push({
              id, enabled, redouble,
              select: taskTicket['id'] || '',
              give: taskTicket['give'] || true,
              num: taskTicket['num'] || 1,
            });
            if (this.subForm.items[0].isFirst) this.subForm.items.shift();
          });
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
    // 提交请求
    submitForm() {
      this.$refs.subForm.validate(valid => {
        if (valid) {
          this.settingSaveOrUpdateReq();
        } else {
          return false;
        }
      })
    },
    // 添加组合项
    addItem () {
      let item = {
        enabled: true,
        redouble: 1,
        select: '',
        give: true,
        num: 1,
      };

      this.subForm.items.push(item);
    },
    // 删除组合项
    delItem (index) {
      this.subForm.items.splice(index, 1);
    },
    // 修改or增加
    async settingSaveOrUpdateReq () {
      try {
        let reqData = this.subForm.items.reduce((pre, cur) => {
          let {enabled, id, redouble, select, give, num} = cur;
          num = Number(num);
          redouble = Number(redouble);
          const taskTicket = {give, id: select, num};

          const item = id ? {
            id, enabled, redouble, standardAward: {taskTicket}
          } : {
            enabled, redouble, standardAward: {taskTicket}
          };
          pre.push(item);
          return pre;
        }, []);

        const {code, message} = await settingSaveOrUpdate(reqData);
        if (code == 200) {
          this.$message.success('保存成功');
          this.settingListReq();
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .control-points-conf {
    min-width: 1200px;
    padding: 20px;
    .mr100 {
      margin-right: 100px;
    }
    .form-btns {
      margin-top: 35px;
      text-align: center;
    }
    .custom-item {
      display: inline-block;
      min-width: 100px;
      .input-width {
        width: 120px;
      }
      .input-text {
        display: inline-block;
      }
      .sub-custom-item {
        display: inline-block;
        .el-form-item {
          display: inline-block;
        }
      }
      .switcher {
        width: 100px;
      }
    }
    .custom-switcher {
      ::v-deep .el-switch__label--left,
      ::v-deep .el-switch__label--right {
        position: absolute;
        z-index: -1;
        font-size: 14px;
      }
      ::v-deep .el-switch__label--left {
        margin-right: 10px;
        right: 0;
        color: #999;
      }
      ::v-deep .el-switch__label--right {
        margin-right: 0px;
        left: 0px;
        color: #fff;
      }
      ::v-deep .el-switch__label.is-active {
        z-index: 20;
      }
      ::v-deep .el-switch__core {
        height: 26px;
        border-radius: 24px;
      }
      ::v-deep .el-switch__core:after {
        border-radius: 24px;
        width: 26px;
        height: 26px;
        margin-left: -2px;
        box-shadow: -3px 0px 1px #888;
        top: -1px;
      }
      &.is-checked ::v-deep .el-switch__core:after {
        margin-left: -25px;
        box-shadow: 3px 0px 1px #888;
      }
    }
  }
</style>
