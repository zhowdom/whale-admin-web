<template>
  <div class="fill-goods-info">
    <div class="base-info">
      <div class="header">
        <i></i>
        <span>基本信息</span>
      </div>
      <div class="body">
        <el-form :model="mainForm" :rules="rules" ref="mainForm" label-width="120px" class="custom-form">
          <el-form-item class="is-required" label="商品分类">
            {{selectName}}
            <span class="ml5">
              <i class="el-icon-question text-success"></i>
              <el-button type="text" @click="prev">编辑</el-button>
            </span>
          </el-form-item>
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="mainForm.name"></el-input>
          </el-form-item>
          <el-form-item label="副标题" prop="title">
            <el-input v-model="mainForm.title" maxlength="200" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="商品品牌" prop="brandId">
            <el-col :span="17">
              <el-select class="wd90" v-model="mainForm.brandId" placeholder="请选择商品品牌" clearable>
                <el-option
                  v-for="item in brands"
                  :key="item.brandId"
                  :label="item.brandName"
                  :value="item.brandId">
                </el-option>
              </el-select>
            </el-col>
            <el-col class="line" :span="7">
              <el-button type="primary" v-hasPermi="['goods:brand:save']" @click="addBrand">新增商品品牌</el-button>
            </el-col>
          </el-form-item>
          <el-form-item label="商品介绍" prop="summary">
            <el-input type="textarea" :rows="5" v-model="mainForm.summary" maxlength="300" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="运费模板" prop="templateId">
            <el-col :span="17">
              <el-form-item>
                <el-select class="wd90" v-model="mainForm.templateId" placeholder="请选择运费模板">
                  <el-option
                    v-for="item in templates"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="7">
              <el-button type="primary" v-hasPermi="['goods:admin_shipping_template:save']" @click="addTemplHandle">新增运费模板</el-button>
            </el-col>
          </el-form-item>
          <el-form-item label="商品货号" prop="itemNo">
            <el-input v-model="mainForm.itemNo" maxlength="50" show-word-limit></el-input>
            <div class="input-tips mt5">可以是商品条码下的一串编号，如果您不输入商品货号，系统将自动生成一个唯一的货号。</div>
          </el-form-item>
          <el-form-item label="商品体积" prop="volumes">
            <el-input v-model="mainForm.volumes">
              <template slot="append">m³</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="weights">
            <el-input v-model="mainForm.weights">
              <template slot="append">kg</template>
            </el-input>
          </el-form-item>
          <el-form-item label="定时上架时间" prop="autoUpTiming">
            <el-date-picker class="wd100" type="datetime" :picker-options="pickerOptions" placeholder="选择日期" value-format="timestamp" v-model="mainForm.autoUpTiming"></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <el-divider></el-divider>

    <div class="other-info">
      <div class="header">
        <i></i>
        <span>其他信息</span>
      </div>
      <div class="body">
        <el-form :model="subForm" :rules="rules" ref="subForm" label-width="130px" class="custom-form">
          <el-form-item label="商品推荐" prop="recommended">
            <el-checkbox-group class="input-class group" v-model="subForm.recommended">
              <el-checkbox v-for="({desc, id}) in recommendList" :key="id" :label="id">
                {{desc}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="显示提示" prop="showTip">
            <el-switch v-model="subForm.showTip" active-text="不支持7天无理由退换" @change="showServiceTip"></el-switch>
          </el-form-item>
          <el-form-item label="服务保证" prop="services">
            <el-checkbox-group class="input-class group" v-model="subForm.services">
              <template v-for="item in pList">
                <el-checkbox :disabled="disabledService(item)" :label="item" :key="item">{{item}}</el-checkbox>
              </template>
            </el-checkbox-group>
          </el-form-item>
          <div class="input-tips ml120 mb5">
            填写定时后，商品从正式上架开始计算时间，时间到后前端显示“已售完”
          </div>
          <el-form-item label="定时已售完">
            <el-form-item prop="day" class="sold-out-item">
              <el-input placeholder="天" v-model="subForm.day"><template slot="append">天</template></el-input>
            </el-form-item>
            <el-form-item prop="hour" class="sold-out-item">
              <el-input placeholder="小时" v-model="subForm.hour"><template slot="append">时</template></el-input>
            </el-form-item>
            <el-form-item prop="minute" class="sold-out-item">
              <el-input placeholder="分钟" v-model="subForm.minute"><template slot="append">分</template></el-input>
            </el-form-item>
          </el-form-item>
          <el-form-item label="最小购买数量" prop="purchaseMin">
            <el-input v-model.number="subForm.purchaseMin" placeholder="请输入最小购买数量"></el-input>
          </el-form-item>
          <el-form-item label="最大购买数量" prop="purchaseMax">
            <el-input v-model.number="subForm.purchaseMax" placeholder="请输入最大购买数量"></el-input>
          </el-form-item>
          <el-form-item label="商品备注" prop="remark">
            <el-input v-model="subForm.remark" maxlength="300" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="商品关键词">
            <el-form-item
              class="input-class custom-width"
              v-for="(item, index) in subForm.keywords"
              :key="index"
              :prop="'keywords.' + index"
              :rules="{type: 'string', min: 1, max: 20, message: '关键词字符长度1-20', trigger: 'blur'}"
            >
              <el-input v-model="subForm.keywords[index]" clearable placeholder="请输入关键词"></el-input>
              <el-button type="primary" v-if="index==0" @click.prevent="addParam">增加</el-button>
              <el-button type="danger" v-else @click.prevent="removeParam(index)">删除</el-button>
            </el-form-item>
            <div class="input-tips">
              点击可增加/删除关键词；<br>
              关键词有两个功能，一是可以作为站内关键词查询，在前台搜索框输入关键词后，能够搜索到该商品；二是作为搜索引擎收录使用.
            </div>
          </el-form-item>
          <el-form-item label="佣金设置" prop="commission">
            <el-switch
              :width="70"
              class="custom-switcher"
              v-model="subForm.commission"
              active-text="开启"
              inactive-text="关闭"
              :active-value="true"
              :inactive-value="false"
              >
            </el-switch>
            <div class="input-tips inline-block ml25">
              关闭后该商品将不产生佣金
              <el-tooltip placement="top">
                <div slot="content">
                  说明：<br>
                  1. 自由选择支付方式<br>
                  只要（销售价 - 供货价）大于0 才有佣金结算<br>
                  2.  现金+ Candy支付 <br>
                  只有 （【现金】部分 - 供货价 ）大于0 才有佣金结算<br>
                  3. 纯Candy支付 ，无论是否关闭，均不产生佣金
                </div>
                <i class="el-icon-warning-outline"></i>
              </el-tooltip>
            </div>
          </el-form-item>
          <el-form-item label="APP端显示倒计时" prop="showSoldOut">
              <el-radio-group v-model="subForm.showSoldOut">
              <el-radio :label="true">显示</el-radio>
              <el-radio :label="false">不显示</el-radio>
            </el-radio-group>
            <p style="color:#9ca7b5">（如果没有设置已售完时间，则APP端不显示倒计时）</p>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <el-divider></el-divider>

    <div class="text-center mt30 mb20">
      <el-button plain @click="prev" class="mr15">上一步, 选择商品分类</el-button>
      <el-button type="primary" @click="next">下一步, 填写商品属性</el-button>
    </div>

    <el-dialog
      center
      width="1250px"
      title="新建运费模板"
      :show-close="false"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
    >
      <add-templ @updateUplevel="updateUplevel"/>
    </el-dialog>
  </div>
</template>

<script>
import {session} from '@/utils/storage';
import {templsAll} from '@/api/goods/index';
import {recommend} from '@/api/supplier/supplier';
import {gdBrandsSelectMap, gdBrandsAdd} from '@/api/goods/goodsAbout';

export default {
  name: 'FillGoodsInfo',
  components: {
    AddTempl: () => import('./addTemplate.vue')
  },
  data () {
    const vm = this;
    return {
      pList: [
        '7 天无理由退换货',
        '快速退款',
        '专属客服',
        '优选商品',
        '品质保障',
      ],
      tips: [
        '不支持7天无理由退换货'
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
        },
      },
      mainForm: {
        name: '',
        title: '',
        brandId: '',
        summary: '',
        templateId: '',
        itemNo: '',
        volumes: '',
        weights: '',
        autoUpTiming: '',
      },
      subForm: {
        commission: true,
        recommended: [],
        services: [],
        remark: '',
        keywords: [''],
        purchaseMin: 1,
        purchaseMax: '',
        day: '',
        hour: '',
        minute: '',
        showTip: false,
        showSoldOut: false
      },
      rules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入副标题名称', trigger: 'blur' },
          { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
        ],
        templateId: [
          { required: true, message: '请选择运费模板', trigger: 'change' }
        ],
        volumes: [
          { required: true, message: '商品体积不能为空', trigger: 'blur' },
          { pattern: /^0(\.[1-9]\d?|\.\d[1-9])?$|^[1-9]\d*(\.\d{1,2})?$/, message: '输入为0/整数/1-2位的小数', trigger: 'blur' }
        ],
        weights: [
          { required: true, message: '商品重量不能为空', trigger: 'blur' },
          { pattern: /^0(\.[1-9]\d?|\.\d[1-9])?$|^[1-9]\d*(\.\d{1,2})?$/, message: '输入为0/整数/1-2位的小数', trigger: 'blur' }
        ],
        purchaseMin: [
          { pattern: /^[1-9]\d*$/, message: '输入为大于等于1的正整数', trigger: 'blur' },
          { validator(rule, value, callback) {
              if (!value) return callback();
              if (!vm.subForm.purchaseMax) return callback();
              if (value > vm.subForm.purchaseMax) {
                return callback('最小购买数量不能大于最大购买数量');
              };
              callback();
            },
            trigger: 'blur',
          }
        ],
        purchaseMax: [
          { pattern: /^[1-9]\d*$/, message: '输入为大于等于1的正整数', trigger: 'blur' },
          { validator(rule, value, callback) {
              if (!value) return callback();
              if (value < vm.subForm.purchaseMin) {
                return callback('最大购买数量不能小于最小购买数量');
              };
              callback();
            },
            trigger: 'blur',
          }
        ],
        day: [
          { pattern: /^(\d{1,2}|[1-9]\d{2,})$/, message: '输入非负整数', trigger: 'blur' },
        ],
        hour: [
          { pattern: /^\d{1,2}$/, message: '输入非负1-2位整数', trigger: 'blur' },
          { validator(rule, value, callback) {
              if (value === '' || value === null) return callback();
              if (Number(value) < 0 || Number(value) > 23) {
                return callback('数值范围 0~23');
              };
              callback();
            },
            trigger: 'blur',
          }
        ],
        minute: [
          { pattern: /^\d{1,2}$/, message: '输入非负1-2位整数', trigger: 'blur' },
          { validator(rule, value, callback) {
              if (value === '' || value === null) return callback();
              if (Number(value) < 0 || Number(value) > 59) {
                return callback('数值范围 0~59');
              };
              callback();
            },
            trigger: 'blur',
          }
        ],
      },
      brands: [],
      templates: [],
      recommendList: [], // 推荐列表
      part2: {},
      dialogVisible: false,
      selectName: '',
    }
  },
  activated () {
    this.getSelectName();
  },
  deactivated () {
    this.selectName = '';
  },
  mounted () {
    this.recommendReq();
    this.templsRequest();
    this.brandsListRequest();
  },
  methods: {
    // 显示提示切换功能
    showServiceTip (bool) {
      let k1 = '无理由退换货';
      let k2 = '快速退款';
      let showTips = this.subForm.services.some(el => el.indexOf(k1) >= 0 || el.indexOf(k2) >= 0);
      if (bool && showTips) {
        this.subForm.showTip = !bool;
        this.$message.warning('请先取消 7天无理由退换货和快速退款');
      }
    },
    // 设置禁用服务
    disabledService (value) {
      let k1 = '无理由退换货';
      let k2 = '快速退款';
      if (this.subForm.showTip && (value.indexOf(k1) >= 0 || value.indexOf(k2) >= 0)) return true;
      return false;
    },
    // 获取上一步选择的商品分类
    getSelectName() {
      const pname = session.get('pname');
      const cname = session.get('cname');
      this.selectName = cname ? `${pname} > ${cname}` : pname;
    },
    // 更新上层组件
    updateUplevel () {
      this.dialogVisible = false;
      this.templsRequest();
    },
    // 添加品牌
    addBrand () {
      this.$prompt('请输入品牌名称', '提示', {
        showClose: false,
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入品牌名称',
        inputPattern: /^.{1,20}$/,
        inputErrorMessage: '品牌名称长度1-20'
      }).then(({value}) => {
        const hasSameBrand = this.brands.some(({brandName}) => brandName == value);
        if (hasSameBrand) {
          this.$message.error('添加失败，品牌名称不能重复！');
          return;
        } else {
          this.gdBrandsAddReq(value);
        };
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消添加品牌'
        });
      });
    },
    // 新增运费模板处理
    addTemplHandle () {
      this.dialogVisible = true;
    },
    // 增加参数
    addParam () {
      this.subForm.keywords.push('');
    },
    // 删除参数
    removeParam (index) {
      this.subForm.keywords.splice(index, 1);
    },
    // 获取推荐列表
    async recommendReq () {
      try {
        const {data} = await recommend();
        this.recommendList = data.list || [];
      } catch (error) {
        throw error;
      }
    },
    // 添加品牌
    async gdBrandsAddReq (brandName) {
      try {
        await gdBrandsAdd({
          brandName,
          showStatus: true,
          brandLogoUrl: '',
          manufacturerType: true,
        });
        await this.brandsListRequest();
        this.$message.success('添加成功！');
      } catch (error) {
        throw error;
      }
    },
    // 查询所有的运费模板
    async templsRequest () {
      try {
        const {code, message, data} = await templsAll({type: 2});
        if (code == 200) {
          this.templates = data.list;
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
    // 获取所有品牌
    async brandsListRequest () {
      try {
        const queryHidden = false;
        const {data} = await gdBrandsSelectMap({queryHidden});
        this.brands = data.list;
      } catch (error) {
        throw console.log(error);
      }
    },
    // 设置part2数据
    setPart2Data () {
      let {itemNo, summary, brandId} = this.mainForm;
      let {
        services, remark, keywords, recommended, commission,
        purchaseMin, purchaseMax, day, hour, minute, showTip, showSoldOut
      } = this.subForm;
      let soldOutTime = {day, hour, minute};

      let part2 = {
        ...this.mainForm,
        showTip,
        services,
        remark,
        recommended,
        commission,
        purchaseMin,
        purchaseMax,
        soldOutTime,
        showSoldOut
      };

      // 商品货号为空删除该字段
      if (itemNo === '') this.$delete(part2, 'itemNo');
      if (summary === '') this.$delete(part2, 'summary');
      if (brandId === '') this.$set(part2, 'brandId', 0);
      if (remark === '') this.$delete(part2, 'remark');
      if (keywords.length) {
        // 去除空的keywords
        keywords = keywords.filter(el => el.trim() != '');
        keywords.length && this.$set(part2, 'keywords', keywords);
      };

      // 本地暂存
      this.part2 = part2;
      session.set('part2', this.part2);
    },
    // 校验表单数据
    validateForms () {
      this.$refs.mainForm.validate(valid1 => {
        if (valid1) {
          this.$refs.subForm.validate(valid2 => {
            if (valid2) {
              this.setPart2Data();
              this.$emit('updateStep', 3);
            } else {
              console.error('表单校验失败！');
            }
          });
        } else {
          console.error('表单校验失败！');
        }
      });
    },
    next() {
      this.validateForms();
    },
    prev () {
      this.$emit('updateStep', 1);
    }
  }
}
</script>

<style lang="scss" scoped>
  .fill-goods-info {
    .base-info,
    .other-info {
      .header {
        position: relative;
        display: inline-block;
        color: #fff;
        width: 160px;
        height: 50px;
        line-height: 50px;
        font-weight: 500;
        background: #9ca7b5;
        i {
          background: #fff;
          height: 16px;
          display: inline-block;
          width: 11px;
          border: 5px solid #fff;
          border-bottom-color: #9ca7b5;
          margin: 17px 5px 0 15px;
          border-radius: 1px;
          vertical-align: top;
        }
        &::after {
          content: "";
          height: 0px;
          position: absolute;
          width: 80px;
          background: #9ca7b5;
          right: -80px;
          border: 25px solid #fff;
          border-left-width: 18px;
          border-left-color: #9ca7b5;
        }
      }
      .body {
        .base-txt {
          text-align: center;
          font-size: 14px;
          color: #666;
          &.bottom {
            text-align: left;
            &::before {
              content: '*';
              color: #F04844;
            }
          }
        }
        .input-class {
          &.group {
            ::v-deep .el-checkbox {
              line-height: 36px;
              .el-checkbox__label {
                display: inline-block;
                min-width: 120px;
                white-space: break-spaces;
                vertical-align: text-top;
              }
            }
          }
        }
        .input-tips {
          color: #9ca7b5;
          line-height: 16px;
          font-size: 13px;
        }
        .el-form-item {
          ::v-deep .el-form-item__label {
            font-weight: normal;
          }
        }
        .custom-width {
          margin-bottom: 15px;
          ::v-deep .el-form-item__content {
            .el-input {
              width: 340px;
            }
            .el-button {
              float: right;
            }
          }
        }
        .custom-form {
          width: 600px;
          margin: 0 auto;
          margin-top: 45px;
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
    }
    .sold-out-item {
      width: 130px;
      display: inline-block;
      ::v-deep .el-input-group__append {
        padding: 0 12px;
      }
      &+.sold-out-item {
        margin-left: 25px;
      }
    }
  }
</style>
