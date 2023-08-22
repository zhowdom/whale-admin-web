<template>
  <div class="vip-member-setting">
    <div class="top-tabs">
      <el-tabs type="border-card" v-model="active" @tab-click="handleTabClick">
        <el-tab-pane label="常规VIP设置" name="1">
          <div class="wrap">
            <div class="part1 ml200" v-hasPermi="['vip:item:batch:update']">
              <div class="mb20 top-label-class">是否允许购买：</div>
              <el-radio-group class="mb20 radio-class" @change="statusChangeRequest" v-model="statusType">
                <el-radio :label="1" :value="1">允许购买</el-radio>
                <el-radio :label="0" :value="0">不允许购买</el-radio>
              </el-radio-group>
            </div>

            <div class="part2">
              <div class="top-guid-bar">购买VIP费用设置</div>
              <el-form :model="mainForm" :rules="rules" ref="mainForm" label-width="200px" class="mt100 ml200 custom-form">

                <el-form-item
                  v-for="(vip, index) in mainForm.vipList"
                  :key="vip.id"
                  :prop="'vipList.'+index+'.itemPrice'"
                  :label="vip.itemTitle+'VIP：'"
                  :rules="[
                    {required: true, message: '输入不能为空', trigger: 'blur'},
                    {pattern: /^[1-9]\d*$/, message: '输入必须为正整数', trigger: ['blur', 'change']}
                  ]"
                >
                  <el-input class="input-class" v-model="vip.itemPrice">
                    <template slot="append">USDT</template>
                  </el-input>
                </el-form-item>

                <el-form-item label="禁用VIP：">
                  <el-select class="input-class" multiple v-model="disabledVips" placeholder="请选择禁用的VIP">
                    <el-option v-for="item in mainForm.vipList" :key="item.id" :label="item.itemTitle+'VIP'" :value="item.id"></el-option>
                  </el-select>
                  <div class="input-tips">可多选。禁用后前端不再显示此套餐购买项</div>
                </el-form-item>

                <el-form-item label="推荐项设置：">
                  <el-select class="input-class" v-model="recommend" @change="changeRecommend(-1, 1)" placeholder="请选择推荐vip项" clearable>
                    <el-option v-for="item in mainForm.vipList" :key="item.id" :label="item.itemTitle+'VIP'" :value="item.id"></el-option>
                  </el-select>
                  <div class="input-tips">只可单选。设置后前端会在对应套餐上显示“推荐标签”，并且默认为选中状态</div>
                </el-form-item>

              </el-form>
            </div>

            <el-divider></el-divider>

            <div class="part3">
              <div class="top-guid-bar">兑换+购买VIP费用设置</div>
              <el-form :model="subForm" :rules="rules" ref="subForm" class="bottom-form mt100 ml200">
                <div class="item-wrap" v-for="(item, index) in subForm.items" :key="index">
                  <div class="custom-item">
                    <el-form-item :prop="'items['+index+'].readWorth'" label="阅读值: " :rules="rules.readWorth">
                      <el-input class="input-width" v-model="item.readWorth">
                        <template slot="append">个</template>
                      </el-input>
                    </el-form-item>
                  </div>
                  <div class="custom-item">
                    <el-form-item :prop="'items['+index+'].itemPrice'" label="金额: " :rules="rules.itemPrice">
                      <el-input class="input-width" v-model="item.itemPrice">
                        <template slot="append">USDT</template>
                      </el-input>
                    </el-form-item>
                  </div>
                  <div class="custom-item">
                    <el-form-item :prop="'items['+index+'].signTime'" label="可兑换VIP: " :rules="rules.signTime">
                      <el-input class="input-width" v-model="item.signTime">
                        <template slot="append">天</template>
                      </el-input>
                    </el-form-item>
                  </div>
                  <div class="custom-item">
                    <el-form-item class="switcher" :prop="'items['+index+'].statusType'" label="是否禁用: ">
                      <el-switch
                        :width="60"
                        class="custom-switcher"
                        v-model="item.statusType"
                        active-text="是"
                        inactive-text="否"
                        :active-value="0"
                        :inactive-value="1"
                      >
                      </el-switch>
                    </el-form-item>
                  </div>
                  <div class="custom-item">
                    <el-form-item class="switcher" :prop="'items['+index+'].recommend'" label="设为推荐项: ">
                      <el-switch
                        :width="60"
                        class="custom-switcher"
                        v-model="item.recommend"
                        @change="changeRecommend(index, 2)"
                        active-text="是"
                        inactive-text="否"
                        :active-value="1"
                        :inactive-value="0"
                      >
                      </el-switch>
                    </el-form-item>
                  </div>
                  <div class="custom-item">
                    <el-form-item>
                      <el-button type="primary" size="small" v-if="index==0" @click="addItem(2)">增加</el-button>
                      <el-button type="danger" size="small" v-if="index!=0&&!item.id" @click="delItem(index, 2)">删除</el-button>
                    </el-form-item>
                  </div>
                </div>
              </el-form>
            </div>

            <div class="form-btns">
              <el-button type="primary" @click="submitForm" v-hasPermi="['vip:item:batch:update']">保存</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="赠送VIP设置" name="2">
          <div class="wrap2">
            <div class="top-tips">
              <div class="title">注意：</div>
              <div class="content">
                <div class="item">
                  1. 此功能暂时应用于"魔力盲盒模块"，此处配置VIP权益，在使用时需要激活；通过魔力盲盒获得的VIP权益可转赠；他人转赠的VIP权益，只可使用不可二次赠予他人。
                </div>
                <div class="item">
                  2. 如须更换VIP权益的天数，为避免现存在已使用此类型的VIP权益，建议使用 "新增" 新的权益而非使用"更换"现有权益。
                </div>
              </div>
            </div>

            <div class="form">
              <el-form :model="receiveForm" :rules="rules" ref="receiveForm" class="receive-form" label-width="90px">
                <div class="item-wrap" v-for="(item, index) in receiveForm.items" :key="index">
                  <div class="custom-item">
                    <el-form-item :prop="'items['+index+'].signTime'" label="赠送VIP: " :rules="rules.signTime">
                      <el-input class="input-width" v-model="item.signTime">
                        <template slot="append">天</template>
                      </el-input>
                    </el-form-item>
                  </div>
                  <div class="custom-item">
                    <el-form-item class="switcher" :prop="'items['+index+'].statusType'" label="是否禁用: ">
                      <el-switch
                        :width="60"
                        class="custom-switcher"
                        v-model="item.statusType"
                        active-text="是"
                        inactive-text="否"
                        :active-value="0"
                        :inactive-value="1"
                      >
                      </el-switch>
                    </el-form-item>
                  </div>
                  <div class="custom-item">
                    <el-form-item>
                      <el-button type="primary" size="small" v-if="index==0" @click="addItem(3)">增加</el-button>
                      <el-button type="danger" size="small" v-if="index!=0&&!item.id" @click="delItem(index, 3)">删除</el-button>
                    </el-form-item>
                  </div>
                </div>
              </el-form>
            </div>

            <div class="btns">
              <el-button type="primary" @click="submitForm" v-hasPermi="['vip:item:batch:update']">保存</el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {vipStatus, statusChange, batchUpdate, vipList} from '@/api/setting/vip';

export default {
  name: 'VipMemberSetting',
  data () {
    return {
      active: '1',
      statusId: '',     // vip状态id
      statusType: 1,    // 1 - 允许购买  0 - 不允许购买
      disabledVips: [],
      recommend: null,
      mainForm: {
        vipList: [],
      },
      subForm: {
        items: [
          {
            isFirst: true,
            itemTitle: '',
            readWorth: '',
            itemPrice: '',
            signTime: '',
            statusType: 1,
            recommend: null,
            signUnit: 'd',
            itemType: 2,
          }
        ]
      },
      receiveForm: {
        items: [
          {
            isFirst: true,
            itemTitle: '',
            readWorth: 0,
            itemPrice: 9999,
            signTime: '',
            statusType: 1,
            recommend: null,
            signUnit: 'd',
            itemType: 3,
          }
        ]
      },
      rules: {
        readWorth: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { min: 1, max: 13, transform: v => v + '', message: '输入长度不超过13个字符', trigger: 'blur' },
          { pattern: /^0\.[1-9]\d?$|^[1-9]\d*(\.\d{1,2})?$/, message: '输入为正数或1-2位小数', trigger: 'blur' },
        ],
        itemPrice: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { min: 1, max: 7, transform: v => v + '', message: '输入长度不超过7个字符', trigger: 'blur' },
          { pattern: /^[1-9]\d*(\.\d{1,2})?$/, message: '输入为大于1的正数最多2位小数', trigger: 'blur' }
        ],
        signTime: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { min: 1, max: 5, transform: v => v + '', message: '输入长度不超过5个字符', trigger: 'blur' },
          { pattern: /^[1-9]\d*$/, message: '输入为大于等于1的正整数', trigger: 'blur' }
        ],
      },
    }
  },
  mounted () {
    this.vipListRequest();
    this.vipStatusRequest();
  },
  methods: {
    // tab切换
    handleTabClick() {
      const {mainForm, subForm, receiveForm} = this.$options.data();
      this.disabledVips = [];
      this.subForm = subForm;
      this.mainForm = mainForm;
      this.receiveForm = receiveForm;

      this.vipListRequest(); // 套餐清单查询
      if (this.active == '1') this.vipStatusRequest(); // 状态查询
    },
    // 提交请求
    submitForm() {
      if (this.active == '1') { // 付费 && 组合
        this.$refs.mainForm.validate(valid => {
          if (valid) {
            this.$refs.subForm.validate(valid2 => {
              if (valid2) {
                this.batchUpdateRequest();
              } else {
                return false;
              }
            })
          } else {
            return false;
          }
        });
      };

      if (this.active == '2') { // 赠送
        this.$refs.receiveForm.validate(valid => {
          if (valid) {
            this.batchUpdateRequest();
          } else {
            return false;
          }
        })
      }
    },
    // 添加组合项
    addItem (type) {
      let item;
      if (type == 2) {
        item = {
          readWorth: '',
          itemPrice: '',
          signTime: '',
          statusType: 1,
          recommend: 0,
          signUnit: 'd',
          itemType: 2,
          itemTitle: '',
        };

        this.subForm.items.push(item);
      };

      if (type == 3) {
        item = {
          readWorth: 0,
          itemPrice: 9999,
          signTime: '',
          statusType: 1,
          recommend: 0,
          signUnit: 'd',
          itemType: 3,
          itemTitle: '',
        };

        this.receiveForm.items.push(item);
      };
    },
    // 删除组合项
    delItem (index, type) {
      if (type == 2) this.subForm.items.splice(index, 1);
      if (type == 3) this.receiveForm.items.splice(index, 1);
    },
    // 设置推荐项
    changeRecommend (idx, type) {
      if (type == 1) {
        this.subForm.items.map(el => {
          this.$set(el, 'recommend', 0);
        });
      } else {
        this.recommend = '';
        this.subForm.items.map((el, index) => {
          this.$set(el, 'recommend', 0);
          if (idx == index) this.$set(el, 'recommend', 1);
        });
      }
    },
    // 获取会员清单
    async vipListRequest () {
      try {
        const itemType = this.active == '1' ? -1 : 3;
        const {code, message, data} = await vipList({itemType});
        if (code == 200) {
          this.disabledVips = [];
          this.recommend = null;
          const {mainForm, subForm, receiveForm} = this.$options.data();
          this.mainForm = mainForm;
          this.subForm = subForm;
          this.receiveForm = receiveForm;

          data.list.sort((a, b) => a.id - b.id);
          data.list.map(item => {
            // 付费购买
            if (item.itemType == 1) {
              if (item.statusType == 0) this.disabledVips.push(item.id);
              if (item.recommend == 1) this.recommend = item.id;
              this.mainForm.vipList.push(item);
            };

            // 组合购买
            if (item.itemType == 2) {
              const {readWorth, itemPrice, signTime} = item;
              if (readWorth && itemPrice && signTime) {
                this.subForm.items.push(item);
                if (this.subForm.items[0].isFirst) this.subForm.items.shift();
              }
            };

            // 赠送vip
            if (item.itemType == 3) {
              const {itemPrice, signTime} = item;
              if (itemPrice && signTime) {
                this.receiveForm.items.push(item);
                if (this.receiveForm.items[0].isFirst) this.receiveForm.items.shift();
              }
            };
          });
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
    // 修改vip可购买状态
    async statusChangeRequest () {
      try {
        const {code, message} = await statusChange({
          id: this.statusId,
          statusType: this.statusType,
        });
        if (code == 200) {
          this.$message.success('vip可购买状态更新成功');
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
    // vip状态查询
    async vipStatusRequest () {
      try {
        const {code, message, data: {statusType, id}} = await vipStatus();
        if (code == 200) {
          this.statusType = statusType;
          this.statusId = id;
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
    // 修改vip套餐
    async batchUpdateRequest () {
      try {
        const data1 = [...this.mainForm.vipList]; // 付费
        const data2 = [...this.subForm.items];    // 组合
        const data3 = [...this.receiveForm.items];// 赠送

        if (data2[0].isFirst) Reflect.deleteProperty(data2[0], 'isFirst');
        if (data3[0].isFirst) Reflect.deleteProperty(data3[0], 'isFirst');

        data1.map(item => {
          item.statusType = 1;
          item.recommend = 0;
          if (this.disabledVips.includes(item.id)) item.statusType = 0;
          if (this.recommend == item.id) item.recommend = 1;
        });
        data2.map(el => el.itemTitle = el.signTime + '天');
        data3.map(el => el.itemTitle = el.signTime + '天');

        const datas = this.active == '1' ? [...data1, ...data2] : [...data3];
        const {code, message} = await batchUpdate({datas});
        if (code == 200) {
          await this.vipListRequest();
          this.$message.success('vip套餐更新成功');
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
  .vip-member-setting {
    min-width: 1200px;
    padding: 20px;
    .top-guid-bar {
      position: relative;
      background: #9ca7b5;
      height: 50px;
      width: 200px;
      line-height: 50px;
      text-align: center;
      color: #FFF;
      font-weight: 500;
      &::after {
        content: ' ';
        height: 1px;
        width: 1px;
        display: inline-block;
        border: 25px solid transparent;
        border-left-color: #9ca7b5;
        position: absolute;
        right: -50px;
      }
    }
    .top-label-class {
      display: inline-block;
      width: 200px;
      line-height: 36px;
      height: 36px;
      text-align: right;
      padding-right: 12px;
      color: #606266;
      vertical-align: middle;
      font-size: 14px;
      font-weight: 400;
    }
    .radio-class {
      label {
        height: 36px;
        line-height: 36px;
        margin-right: 40px;
        font-weight: normal;
      }
      ::v-deep .el-radio__inner {
        width: 18px;
        height: 18px;
        &:after {
          box-sizing: content-box;
          content: "";
          border: 1px solid #fff;
          border-left: 0;
          border-top: 0;
          height: 8px;
          left: 5px;
          position: absolute;
          top: 2px;
          transform: rotate(45deg) scaleY(0);
          width: 4px;
          border-radius: 0;
          background: none;
          transition: transform .15s ease-in .05s;
          transform-origin: center;
        }
      }
      ::v-deep .el-radio__input.is-checked .el-radio__inner:after {
        transform: rotate(45deg) scaleY(1);
      }
    }
    .input-class {
      width: 290px;
    }
    .input-tips {
      display: inline-block;
      margin-left: 20px;
      color: #9ca7b5;
      vertical-align: middle;
      width: 390px;
      line-height: 22px;
    }
    .form-btns {
      margin-top: 35px;
      text-align: center;
    }
    .custom-item {
      display: inline-block;
      margin-right: 15px;
      .input-width {
        width: 190px;
      }
      .switcher {
        width: 100px;
      }
      ::v-deep {
        &.el-input-group__append {
          padding: 0 12px;
        }
      }
    }
    ::v-deep .el-form-item__label {
      font-weight: 400;
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

    .wrap2 {
      min-height: 600px;
      width: 1100px;
      margin: 0 auto;
      .top-tips {
        margin-top: 30px;
        font-size: 14px;
        color: #7F7F7F;
        font-weight: 500;
        display: flex;
        flex-direction: row;
        .title {
          width: 50px;
        }
        .content {
          flex: 1;
          .item {
            line-height: 20px;
            margin-bottom: 10px;
          }
        }
      }
      .form {
        margin-top: 60px;
        .receive-form {
          width: 600px;
          margin: 0 auto;
        }
      }
      .btns {
        margin-top: 35px;
        text-align: center;
      }
    }
  }
</style>
