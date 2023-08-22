<template>
  <div class="goods-info">
    <div class="base-info">
      <div class="header mb20">
        <i></i>
        <span>基本信息</span>
      </div>
      <div class="body">
        <el-form :model="mainForm" :rules="rules" ref="mainForm" label-width="120px" class="custom-form" disabled>
          <el-form-item class="is-required" label="商品分类">
            {{selectName}}
          </el-form-item>
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="mainForm.name"></el-input>
          </el-form-item>
          <el-form-item label="副标题" prop="title">
            <el-input v-model="mainForm.title" maxlength="200" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="商品品牌" prop="brandId">
            <el-select class="wd100" v-model="mainForm.brandId" placeholder="请选择商品品牌" clearable>
              <el-option
                v-for="item in brands"
                :key="item.brandId"
                :label="item.brandName"
                :value="item.brandId"
                :disabled="!item.showStatus">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品介绍" prop="summary">
            <el-input type="textarea" :rows="5" v-model="mainForm.summary" maxlength="300" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="运费模板" prop="templateId">
            <el-select class="wd100" v-model="mainForm.templateId" placeholder="请选择运费模板">
              <el-option
                v-for="item in templates"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
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
      <div class="header mb20">
        <i></i>
        <span>其他信息</span>
      </div>
      <div class="body">
        <el-form :model="subForm" :rules="rules" ref="subForm" label-width="130px" class="custom-form" disabled>
          <el-form-item label="商品推荐" prop="recommended">
            <el-checkbox-group class="input-class group" v-model="subForm.recommended">
              <el-checkbox v-for="({desc, id}) in recommendList" :key="id" :label="id">
                {{desc}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="显示提示" prop="showTip">
            <el-switch v-model="subForm.showTip" active-text="不支持7天无理由退换"></el-switch>
          </el-form-item>
          <el-form-item label="服务保证" prop="services">
            <el-checkbox-group class="input-class group" v-model="subForm.services">
              <template v-for="item in pList">
                <el-checkbox :label="item" :key="item">{{item}}</el-checkbox>
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
              class="input-class"
              v-for="(item, index) in subForm.keywords"
              :key="index"
              :prop="'keywords.' + index"
              :rules="{type: 'string', min: 1, max: 20, message: '关键词字符长度1-20', trigger: 'blur'}"
            >
              <el-input class="mb15" v-model="subForm.keywords[index]" clearable placeholder="请输入关键词"></el-input>
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
      <el-button plain @click="prev" class="mr15">上一步, 查看商品分类</el-button>
      <el-button type="primary" @click="next">下一步, 查看商品属性</el-button>
    </div>
  </div>
</template>

<script>
import {session} from '@/utils/storage';
import {templsAll} from '@/api/goods/index';
import {recommend} from '@/api/supplier/supplier';
import {gdBrandsSelectMap} from '@/api/goods/goodsAbout';

export default {
  name: 'GoodsInfo',
  data () {
    return {
      pList: [
        '7 天无理由退换货',
        '快速退款',
        '专属客服',
        '优选商品',
        '品质保障',
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
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
      },
      rules: {},
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
    this.setPart2Data();
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
    // 获取上一步选择的商品分类
    getSelectName() {
      const pname = session.get('pname');
      const cname = session.get('cname');
      this.selectName = cname ? `${pname} > ${cname}` : pname;
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
       const {data} = await gdBrandsSelectMap();
       this.brands = data.list;
      } catch (error) {
        throw console.log(error);
      }
    },
    // 设置part2数据
    setPart2Data () {
      let {
        name, title, brandId, summary, templateId, itemNo, volumes, weights, autoUpTiming,
        services, remark, keywords, recommended, commission, purchaseMin, purchaseMax, day, hour, minute, showTip, showSoldOut
      } = session.get('part2');

      autoUpTiming = new Date(autoUpTiming).getTime();
      recommended = recommended || [];
      keywords = keywords || [''];
      !brandId && (brandId = '');

      this.mainForm = {
        name, title, brandId, summary, templateId, itemNo, volumes, weights, autoUpTiming, showSoldOut
      };

      this.subForm = {
        services, remark, keywords, recommended, commission, purchaseMin, purchaseMax, day, hour, minute, showTip, showSoldOut
      };
    },
    next() {
      this.$emit('updateStep', 3);
    },
    prev () {
      this.$emit('updateStep', 1);
    }
  }
}
</script>

<style lang="scss" scoped>
  .goods-info {
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
        margin-bottom: 40px;
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
        .custom-form {
          width: 600px;
          margin: 0 auto;
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
