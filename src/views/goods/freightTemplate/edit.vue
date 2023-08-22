<template>
  <div class="template-wrap">
    <el-card class="box-card" shadow="always">
      <el-form :model="mainForm" :rules="rules" ref="mainForm" label-width="100px" class="mt40">
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
            <el-col :span="3">
              <el-button type="primary" @click="addCity">新增指定城市模板</el-button>
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
                  <el-button class="fr" type="text" @click="showDio(row, $index, 'table1')">编辑</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="startPoint" align="center" :label="`首${tabSetUnit}`">
                <template slot-scope="{row}">
                  <el-input v-input-filter:int2="{key:'startPoint',row}" v-model.lazy="row.startPoint" min="0" placeholder="请输入"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="startFee" align="center" label="首费（USDT）">
                <template slot-scope="{row}">
                  <el-input v-input-filter:price="{key:'startFee',row}" v-model.lazy="row.startFee" placeholder="请输入"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="eachStepInc" align="center" :label="`续${tabSetUnit}`">
                <template slot-scope="{row}">
                  <el-input v-input-filter:int2="{key:'eachStepInc',row}" v-model.lazy="row.eachStepInc" placeholder="请输入"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="eachStepIncFee" align="center" label="续费（USDT）">
                <template slot-scope="{row}">
                  <el-input v-input-filter:price="{key:'eachStepIncFee',row}" v-model.lazy="row.eachStepIncFee" placeholder="请输入"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="170">
                <template slot-scope="scope">
                  <el-button size="mini" type="danger" @click="delCity(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>

          <el-form-item label="是否指定包邮(选填):" prop="status" label-width="140px">
            <el-switch
              :width="55"
              class="custom-switcher"
              @change="changeStatus"
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
                  <el-button class="fr" type="text" @click="showDio(row, $index, 'table2')">编辑</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="freeMinPoint" align="center" label="设置包邮条件">
                <template slot-scope="{row}">
                  <div class="wth250 center">
                    <el-input class="wth200" v-input-filter:int2="{key:'freeMinPoint',row}" v-model.lazy="row.freeMinPoint" placeholder="请输入"></el-input>
                    <div class="wth50 lht36 inline-block">{{setUnit}}包邮</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="170">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="addFree">新增</el-button>
                  <el-button size="mini" type="danger" v-if="scope.$index>=1" @click="delFree(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </template>
      </el-form>

      <div class="form-btns">
        <el-button @click="cancelSubmit">取消</el-button>
        <el-button type="primary" @click="resetForm">重置</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </div>
    </el-card>

    <el-dialog
      center
      width="520px"
      title="选择地区"
      :close-on-click-modal="false"
      :before-close="cancelDio"
      :visible.sync="dialogVisible"
    >
      <div class="custom-card">
        <el-card header="可选省、市、区">
          <el-tree
            ref="initTree"
            :data="citysData"
            show-checkbox
            node-key="id"
            check-on-click-node
            :default-expanded-keys="[2]"
            @check="getCheckedNodes"
            >
          </el-tree>
        </el-card>
      </div>

      <span slot="footer" class="mt20">
        <el-button @click="cancelDio">取 消</el-button>
        <el-button type="primary" @click="confirmDio">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import citys from '@/utils/provinceCity';
import {templDetail, templEdit, templSave,} from '@/api/goods/index';

export default {
  name: 'EditTemplate',
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
      rules: {
        name: [
          { required: true, message: '模板名称不能为空', trigger: 'blur' },
          { type: 'string', min: 1, max: 24, message: '模板名称长度1-24个字符', trigger: 'blur' },
        ],
        shippingType: [
          { required: true, message: '是否承担运费选项不能为空', trigger: 'blur' },
        ],
        method: [
          { required: true, message: '计价方式不能为空', trigger: 'blur' },
        ],
        startPoint: [
          { required: true, message: '首配不能为空', trigger: ['blur', 'change'] },
          { pattern: /^[1-9]\d*$/, message: '输入必须为正整数', trigger: ['blur', 'change'] }
        ],
        startFee: [
          { required: true, message: '首费不能为空', trigger: ['blur', 'change'] },
          { pattern: /^0(\.[1-9]\d?|\.\d[1-9])?$|^[1-9]\d*(\.\d{1,2})?$/, message: '输入为非负整数或1-2位小数', trigger: ['blur', 'change'] }
        ],
        eachStepInc: [
          { required: true, message: '续配不能为空', trigger: ['blur', 'change'] },
          { pattern: /^[1-9]\d*$/, message: '输入必须为正整数', trigger: ['blur', 'change'] }
        ],
        eachStepIncFee: [
          { required: true, message: '续费不能为空', trigger: ['blur', 'change'] },
          { pattern: /^0(\.[1-9]\d?|\.\d[1-9])?$|^[1-9]\d*(\.\d{1,2})?$/, message: '输入为非负整数或1-2位小数', trigger: ['blur', 'change'] }
        ],
      },
      specs: [],
      frees: [],
      dialogVisible: false,
      checkedLabels: [],
      currTarget: '',
      id: '',
      isEdit: false,
      curItem: [],
      curIndex: 0,
    }
  },
  mounted () {
    this.id = this.$route.query.id;
    if (this.id >= 0) {
      this.isEdit = true;
      this.templDetailRequest();
    };
  },
  methods: {
    // 新增模板
    async templSaveRequest () {
      try {
        let reqData;
        let baseData;
        let defTmpl;
        let specs = this.specs;
        let frees = this.frees;

        const {method, name, shippingType} = this.mainForm;
        if (shippingType == 1) {
          baseData = {name, shippingType};
          reqData = baseData;
        } else {
          baseData = {name, shippingType, method};
          let {startPoint, startFee, eachStepInc, eachStepIncFee} = this.mainForm;
          defTmpl = {cityIds: [-1], startPoint, startFee, eachStepInc, eachStepIncFee};

          reqData = {...baseData, defTmpl};

          if (specs.length) {
            const notEmptySpecs = specs.filter(el => el.cityIds.length > 0);
            reqData = {...reqData, specs: notEmptySpecs};
          }

          if (frees.length) {
            const notEmptyFrees = frees.filter(el => el.cityIds.length > 0);
            reqData = {...reqData, frees: notEmptyFrees};
          }
        };

        reqData = this.isEdit ? {...reqData, id: this.id} : reqData;
        const reqFn = this.isEdit ? templEdit : templSave;

        const {code, message} = await reqFn(reqData);
        if (code == 200) {
          this.$message.success('提交成功！');
          this.cancelSubmit();
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
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
    // 获取选中的节点
    getCheckedNodes(d1, d2) {
      console.log(d1, '----d1----', d2, '--d2---',);
      this.curItem = d2.checkedKeys;
    },
    // 修改指定包邮状态
    changeStatus (value) {
      this.mainForm.status = value;

      if (value) {
        this.addFree();
      } else {
        this.frees = [];
      };
    },
    // 新增城市运费
    addCity () {
      this.specs.push({
        cityIds: [],
        startPoint: 1,
        startFee: 0.01,
        eachStepInc: 1,
        eachStepIncFee: 0.01,
      });
    },
    // 删除城市运费
    delCity (index) {
      this.specs.splice(index, 1);
    },
    // 新增指定包邮
    addFree() {
      this.frees.push({
        cityIds: [],
        freeMinPoint: 1,
      });
    },
    // 删除指定包邮
    delFree(index) {
      this.frees.splice(index, 1);
    },
    // 关闭tag标签
    closeTagFn () {
      const curView = this.$route;

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          this.$router.replace({path: 'freightTemplate'}); // 返回列表页
        });
      });
    },
    // 取消功能
    cancelSubmit () {
      this.closeTagFn();
    },
    // 重置功能
    resetForm() {
      this.specs = [];
      this.frees = [];
      this.mainForm.name = '';
      this.mainForm.shippingType = 2;
      this.mainForm.method = 1;
      this.mainForm.startPoint = 1;
      this.mainForm.startFee = 1;
      this.mainForm.eachStepInc = 1;
      this.mainForm.eachStepIncFee = 1;
      this.mainForm.status = false;
    },
    // 提交
    submitForm() {
      this.$refs.mainForm.validate(valid => {
        if (valid) {
          this.templSaveRequest();
        } else {
          console.error('表单校验失败！');
        }
      });
    },
    // 取消弹框
    cancelDio () {
      this.currTarget = '';
      this.curItem = [];
      this.curIndex = 0;
      this.dialogVisible = false;

      this.$nextTick(() => {
        this.$refs.initTree.setCheckedKeys([]);
      });
    },
    // 确认弹框
    confirmDio () {
      if (this.currTarget == 'table1') {
        this.$set(this.specs[this.curIndex], 'cityIds', this.curItem);
      } else {
        this.$set(this.frees[this.curIndex], 'cityIds', this.curItem);
      };

      this.currTarget = '';
      this.curIndex = 0;
      this.dialogVisible = false;
      this.$nextTick(() => {
        this.$refs.initTree.setCheckedKeys([]);
      });
    },
    // 打开弹窗
    showDio (row, index, str) {
      // 数据初始化
      let restItem = [];
      let restFlatArr = [];
      let lenSpecs = this.specs.length;
      let lenFrees = this.frees.length;
      this.currTarget = str;
      this.curIndex = index;
      this.curItem = [];
      this.citysData.map(el => {
        if (el.disabled !== undefined) {
          this.$delete(el, 'disabled');
        };
        if (el.children) {
          el.children.map(ol => {
            if (ol.disabled !== undefined) {
              this.$delete(ol, 'disabled');
            };
          });
        };
      });

      // tree数据设置
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.initTree.setCheckedKeys(row.cityIds);
      });

      if (this.currTarget == 'table1') {
        restItem = this.specs.filter((item, idx) => idx !== index);
        lenFrees && (restItem = restItem.concat(this.frees));
      } else {
        restItem = this.frees.filter((item, idx) => idx !== index);
        lenSpecs && (restItem = restItem.concat(this.specs));
      };
      restFlatArr = [...restItem.map(e => e.cityIds)].flat();

      this.citysData.map(el => {
        if (restFlatArr.includes(el.id)) {
          this.$set(el, 'disabled', true);
        };
        el.children && el.children.map(ol => {
          if (restFlatArr.includes(ol.id)) {
            this.$set(ol, 'disabled', true);
          };
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
          margin-left: 100px;
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
