<template>
  <div class="template-wrap">
    <el-card class="box-card" shadow="always">
      <el-form :model="mainForm" :rules="rules" ref="mainForm" label-width="150px" class="mt40" disabled>
        <el-form-item label="模板名称:" prop="name">
          <el-input class="input-class" v-model="mainForm.name" placeholder="请输入模板名称"></el-input>
        </el-form-item>

        <el-form-item label="是否包邮:" prop="shippingType">
          <el-radio-group v-model="mainForm.shippingType">
            <el-radio v-for="{label, value} in shippingTypes" :key="value" :label="value">{{label}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <template v-if="mainForm.shippingType==2">
          <el-form-item label="计价方式:" prop="method">
            <el-radio-group v-model="mainForm.method">
              <el-radio v-for="{label, value} in valuationWay" :key="value" :label="value">{{label}}</el-radio>
            </el-radio-group>
          </el-form-item>

          <div class="input-tips txt">
            除指定地区外，其余地区的采用“默认运费”
          </div>

          <el-form-item label="运送方式:" class="custom-item is-required">
            <el-col :span="1" class="text-left wth65">默认运费</el-col>
            <el-col :span="4" class="wth150">
              <el-form-item prop="startPoint">
                <el-input placeholder="请输入" v-model="mainForm.startPoint">
                  <template slot="append">{{setUnit}}</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1" class="text-center wth22">内</el-col>
            <el-col :span="4" class="wth150">
              <el-form-item prop="startFee">
                <el-input placeholder="请输入" v-model="mainForm.startFee">
                  <template slot="append">USDT</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="text-center wth50">每增加</el-col>
            <el-col :span="4" class="wth150">
              <el-form-item prop="eachStepInc">
                <el-input placeholder="请输入" v-model="mainForm.eachStepInc">
                  <template slot="append">{{setUnit}}</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="text-center wth64">增加运费</el-col>
            <el-col :span="4" class="wth150 mr10">
              <el-form-item prop="eachStepIncFee">
                <el-input placeholder="请输入" v-model="mainForm.eachStepIncFee">
                  <template slot="append">USDT</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-form-item>

          <el-form-item v-if="specs.length">
            <el-table border size="mini" :data="specs" style="width: 100%">
              <el-table-column prop="cityIds" align="center" label="运送到">
                <template slot-scope="{$index,row}">
                  <el-tooltip
                    effect="dark"
                    popper-class="wth220"
                    placement="top-start"
                    v-if="row.cityIds.length>5"
                    :content="setCellLabel(row.cityIds)"
                  >
                    <div class="fl lht36 text-left">
                      {{setCellLabel5(row.cityIds)}}
                    </div>
                  </el-tooltip>
                  <div class="fl lht36 text-left" v-if="row.cityIds.length<=5">
                    {{setCellLabel(row.cityIds)}}
                  </div>
                  <div class="fl lht36" v-if="!row.cityIds.length">未添加地区</div>
                </template>
              </el-table-column>
              <el-table-column prop="startPoint" align="center" :label="`首${tabSetUnit}`">
                <template slot-scope="{row}">
                  <el-input disabled v-input-filter:int2="{key:'startPoint',row}" v-model.lazy="row.startPoint" min="0" placeholder="请输入"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="startFee" align="center" label="首费（USDT）">
                <template slot-scope="{row}">
                  <el-input disabled v-input-filter:price="{key:'startFee',row}" v-model.lazy="row.startFee" placeholder="请输入"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="eachStepInc" align="center" :label="`续${tabSetUnit}`">
                <template slot-scope="{row}">
                  <el-input disabled v-input-filter:int2="{key:'eachStepInc',row}" v-model.lazy="row.eachStepInc" placeholder="请输入"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="eachStepIncFee" align="center" label="续费（USDT）">
                <template slot-scope="{row}">
                  <el-input disabled v-input-filter:price="{key:'eachStepIncFee',row}" v-model.lazy="row.eachStepIncFee" placeholder="请输入"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>

          <el-form-item label="是否指定包邮(选填):" prop="status">
            <el-switch
              :width="55"
              class="custom-switcher"
              active-text="是"
              inactive-text="否"
              :value="mainForm.status"
              >
            </el-switch>
          </el-form-item>

          <el-form-item v-if="mainForm.status">
            <el-table border size="mini" :data="frees" style="width: 100%">
              <el-table-column prop="cityIds" align="center" label="选择地区">
                <template slot-scope="{$index,row}">
                  <el-tooltip
                    effect="dark"
                    popper-class="wth220"
                    placement="top-start"
                    v-if="row.cityIds.length>5"
                    :content="setCellLabel(row.cityIds)"
                  >
                    <div class="fl lht36 text-left">
                      {{setCellLabel5(row.cityIds)}}
                    </div>
                  </el-tooltip>
                  <div class="fl lht36 text-left" v-if="row.cityIds.length<=5">
                    {{setCellLabel(row.cityIds)}}
                  </div>
                  <div class="fl lht36" v-if="!row.cityIds.length">未添加地区</div>
                </template>
              </el-table-column>
              <el-table-column prop="freeMinPoint" align="center" label="设置包邮条件">
                <template slot-scope="{row}">
                  <div class="wth250 center">
                    <el-input disabled class="wth200" v-input-filter:int2="{key:'freeMinPoint',row}" v-model.lazy="row.freeMinPoint" placeholder="请输入"></el-input>
                    <div class="wth50 lht36 inline-block">{{setUnit}}包邮</div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </template>
      </el-form>

      <div class="form-btns">
        <el-button type="warning" @click="cancelSubmit">返回</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import citys from '@/utils/provinceCity';
import {templDetail} from '@/api/goods/index';

export default {
  name: 'TemplateDetail',
  computed: {
    setUnit: function () {
      if (this.mainForm.method == 1) {
        return '件';
      } else if (this.mainForm.method == 2) {
        return 'kg';
      } else {
        return 'm³';
      }
    },
    tabSetUnit: function () {
      if (this.mainForm.method == 1) {
        return '件（件）';
      } else if (this.mainForm.method == 2) {
        return '重（kg）';
      } else {
        return '体积（m³）';
      };
    },
    citysData() {
      citys.forEach(e => {
        e.children && e.children.forEach(o => {
          o.children && (delete o.children);
        })
      });
      return citys;
    },
    setCellLabel() {
      return arr => {
        let labels = [];
        this.citysData.forEach(e => {
          if (e.children && e.children.length) {
            e.children.forEach(o => {
              if (arr.includes(o.id)) {
                labels.push(o.label);
              }
            });
          } else {
            if (arr.includes(e.id)) {
              labels.push(e.label);
            }
          };
        });

        return labels.length ? labels.join('、') : '';
      }
    },
    setCellLabel5 () {
      return arr => {
        let labels = [];
        this.citysData.forEach(e => {
          if (e.children && e.children.length) {
            e.children.forEach(o => {
              if (arr.includes(o.id) && labels.length < 5) {
                labels.push(o.label);
              }
            });
          };
        });

        return labels.length ? labels.join('、') : '';
      }
    }
  },
  data () {
    return {
      valuationWay: [
        {
          value: 1,
          label: '按照件数',
        },
        {
          value: 2,
          label: '按照重量',
        },
        {
          value: 3,
          label: '按照体积',
        },
      ],
      shippingTypes: [
        {
          value: 2,
          label: '自定义运费',
        },
        {
          value: 1,
          label: '卖家承担运费/包邮',
        },
      ],
      mainForm: {
        name: '',
        shippingType: 2,
        method: 1,
        startPoint: 1,
        startFee: 0.01,
        eachStepInc: 1,
        eachStepIncFee: 0.01,
        status: false,
      },
      rules: {},
      specs: [],
      frees: [],
      id: '',
    }
  },
  mounted () {
    this.id = this.$route.query.id;
    this.templDetailRequest();
  },
  methods: {
    // 获取详情
    async templDetailRequest () {
      try {
        const {code, message, data} = await templDetail({id: this.id});
        if (code == 200) {
          this.mainForm.name = data.name;
          this.mainForm.shippingType = data.shippingType;
          if (data.shippingType == 2) {
            this.mainForm.method = data.method;
            this.mainForm.startPoint = data.defTmpl.startPoint;
            this.mainForm.startFee = data.defTmpl.startFee;
            this.mainForm.eachStepInc = data.defTmpl.eachStepInc;
            this.mainForm.eachStepIncFee = data.defTmpl.eachStepIncFee;

            if (data.specs.length) {
              this.specs = data.specs;
            };

            if (data.frees.length) {
              this.frees = data.frees;
              this.mainForm.status = true;
            } else {
              this.mainForm.status = false;
            };
          };
        } else {
          this.$message.error(message);
        };
      } catch (error) {
        // ...
      };
    },
    // 取消功能
    cancelSubmit () {
      const curView = this.$route;

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          this.$router.replace({path: 'freightTemplate'}); // 返回列表页
        });
      });
    },
  },
}
</script>

<style lang="scss" scoped>
  .template-wrap {
    min-width: 1200px;
    padding: 30px 40px 0;
    .box-card {
      margin: 0 auto;
      margin-top: 60px;
      .input-class {
        width: 360px;
      }
      .input-tips {
        color: #9ca7b5;
        &.txt {
          font-size: 14px;
          line-height: 20px;
          margin-left: 150px;
          margin-bottom: 6px;
        }
      }
      .el-form-item {
        ::v-deep .el-form-item__label {
          font-weight: normal;
        }
      }
      .custom-item {
        ::v-deep .el-input-group__append {
          padding: 0 10px;
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
      .form-btns {
        text-align: center;
        margin-top: 35px;
        margin-left: 20px;
        button {
          margin-right: 50px;
          padding: 10px 30px;
        }
      }
    }
    .custom-card {
      overflow: hidden;
      ::v-deep .el-card__header {
        text-align: center;
        background: rgba(246, 246, 246, 1);
      }
    }
  }
</style>
