<template>
  <div class="edit-operation-goods">
    <div class="base part1">
      <div class="header">
        <i></i>
        <span>补充信息</span>
      </div>
      <div class="body">
        <el-row class="info-item" :gutter="20">
          <el-col class="item-label" :span="3">商品推荐:</el-col>
          <el-col :span="15">
            <el-checkbox-group v-model="recommended">
              <el-checkbox v-for="({desc, id}) in recommendList" :key="id" :label="id">
                {{desc}}
              </el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>

        <!-- <el-row class="info-item" :gutter="20">
          <el-col class="item-label" :span="3">选择角标:</el-col>
          <el-col :span="15">
            <el-checkbox-group v-model="tags">
              <el-checkbox v-for="(item, index) in tagList" :key="index" :label="item">{{item}}</el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row> -->

        <el-row class="info-item" :gutter="20">
          <el-col class="item-label" :span="3">是否开启分佣:</el-col>
          <el-col :span="15">
            <el-switch
              :width="60"
              class="custom-switcher"
              v-model="commission"
              active-text="是"
              inactive-text="否"
              :active-value="true"
              :inactive-value="false"
              >
            </el-switch>

            <div class="input-tips inline-block ml10">关闭后该商品将不产生佣金</div>
          </el-col>
        </el-row>

        <el-row class="info-item" :gutter="20">
          <el-col class="item-label" :span="3">定时已售完:</el-col>
          <el-col :span="15">
            <div class="input-tips">
              填写定时后，商品从正式上架开始计算时间，时间到后前端显示“已售完”
            </div>
            <el-form :model="subForm" :rules="rules" ref="subForm">
              <el-form-item prop="day" class="sold-out-item">
                <el-input placeholder="天" v-model="subForm.day"><template slot="append">天</template></el-input>
              </el-form-item>
              <el-form-item prop="hour" class="sold-out-item">
                <el-input placeholder="小时" v-model="subForm.hour"><template slot="append">时</template></el-input>
              </el-form-item>
              <el-form-item prop="minute" class="sold-out-item">
                <el-input placeholder="分钟" v-model="subForm.minute"><template slot="append">分</template></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="base part2">
      <div class="header">
        <i></i>
        <span>价格设置</span>
      </div>
      <div class="body">
        <el-row class="info-item" :gutter="20">
          <el-col class="item-label text-left" :span="3">属性类型:</el-col>
          <el-col :span="15">{{attrTypeName||'-'}}</el-col>
        </el-row>
        <el-row class="info-item" :gutter="20">
          <el-col class="item-label text-left" :span="18">商品规格:</el-col>
          <el-col :offset="1" :span="23">
            <template v-for="(item, index) in attrs">
              <div class="mb10" :key="index">
                <div class="text-muted ml20" v-if="item.attrItemName">
                  <el-tag type="danger">{{item.attrItemName}}</el-tag>
                </div>
                <div class="ml40">
                  <el-checkbox-group disabled class="input-class group" v-model="item['checked']">
                    <el-checkbox v-for="(oItem, oindex) in item.itemInfo" :label="oItem" :key="oindex">{{oItem}}</el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
            </template>
          </el-col>
        </el-row>

        <el-row class="info-item">
          <el-col class="item-label text-left" :span="18">供应商提供商品属性信息:</el-col>
          <el-col :span="24">
            <el-table border row-key="key" :data="tableData" style="width: 100%">
              <template v-for="({prop, label, width}, index) in tableHeader">
                <el-table-column
                  align="center"
                  :key="index"
                  :prop="prop"
                  :label="label"
                  :width="width"
                  :formatter="formatter">
                </el-table-column>
              </template>
            </el-table>
          </el-col>
        </el-row>
        <br><br><br>

        <el-row class="info-item" :gutter="20">
          <el-col class="item-label text-left" :span="15">编辑商品属性信息:</el-col>
          <el-col :span="24">
            <el-table border row-key="key" :data="editableTable" style="width: 100%">
              <el-table-column
                align="center"
                v-for="({prop, label, width}, index) in editableHeader"
                :key="index"
                :prop="prop"
                :label="label"
                :width="width">
                  <span
                    slot="header"
                    :class="{
                      'required': prop=='editMarketPrice'||prop=='editPrice'||prop=='whalePeas'
                    }"
                  >{{label}}
                  </span>
                  <template slot-scope="{row}">
                    <el-form
                      ref="editableTabForm"
                      :model="row"
                      :rules="rules"
                      v-if="prop=='editMarketPrice'||prop=='editPrice'||prop=='whalePeas'"
                    >
                      <el-form-item v-if="prop=='editMarketPrice'" prop="editMarketPrice" class="mb15 mt15">
                        <el-input v-model="row.editMarketPrice" placeholder="请输入划线价"></el-input>
                      </el-form-item>

                      <el-form-item v-if="prop=='editPrice'" prop="editPrice" class="mb15 mt15">
                        <el-input v-model="row.editPrice" placeholder="请输入销售价"></el-input>
                      </el-form-item>
                      <el-form-item v-if="prop=='whalePeas'" prop="whalePeas" class="mb15 mt15">
                        <el-input-number class="mockSlotStyleToNomal" size="mini" v-model="row.whalePeas" :precision="6" :step="0.1" :min="0" controls-position="right"></el-input-number>
                      </el-form-item>
                    </el-form>

                    <div v-else-if="prop=='skuNo'||prop=='name'">{{row[prop]||'-'}}</div>
                    <div v-else-if="prop=='image'">
                      <el-image fit="fit" :src="row.image" class="editable-table-img"></el-image>
                    </div>
                    <div v-else>{{row[prop]||0}}</div>
                  </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>

        <el-row class="info-item" :gutter="20">
          <el-col class="item-label" :span="5">选择配用优惠券里的-无门槛优惠券:</el-col>
          <el-col :span="15">
            <el-select :disabled="+payWay === 3" class="wth300" v-model="couponId" placeholder="请选择优惠券" clearable>
              <el-option v-for="{id,name,amount} in cites" :key="id" :value="id" :label="name">
                <span style="float: left">{{name}}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{amount}}</span>
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="form-btns">
      <el-button type="warning" size="large" @click="goBackList">返回</el-button>
      <el-button type="primary" size="large" v-hasPermi="['goods:audited_product:update']" @click="submitForm">保存</el-button>
    </div>

  </div>
</template>

<script>
import {uuid} from '@/utils/index';
import {citeList} from '@/api/coupons/index';
import {goodsAttributeList} from '@/api/goods/goodsAbout';
import {attrByCateId, attributeItem} from '@/api/goods/index';
import {auditedEdit, productDetail, recommend} from '@/api/supplier/supplier';
let reg1 = /^0(\.[1-9]\d?|\.\d[1-9])?$|^[1-9]\d*(\.\d{1,2})?$/; // 0或正数或1-2位小数

export default {
  name: 'EditOperationGoods',
  data () {
    return {
      subForm: {
        day: '',
        hour: '',
        minute: '',
      },
      rules: {
        editMarketPrice: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { pattern: reg1, message: '输入为0或正整数或1-2位小数', trigger: 'blur' }
        ],
        editPrice: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { pattern: reg1, message: '输入为0或正整数或1-2位小数', trigger: 'blur' }
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
      tableData: [], // 不可编辑商品属性表格
      tableHeader: [
        {
          label: '供货价',
          prop: 'supplyPrice',
        },
        {
          label: '划线价',
          prop: 'marketPrice',
        },
        {
          label: '销售价（USDT）',
          prop: 'price',
        },
        {
          label: '销售价（Candy）',
          prop: 'whalePeas',
        },
        {
          label: '商品库存',
          prop: 'stock',
        },
        {
          label: '库存预警值',
          prop: 'waring',
          width: 90,
        },
        {
          label: 'SKU编号',
          prop: 'skuNo',
        },
        {
          label: 'SKU名称',
          prop: 'name',
        },
        {
          label: '属性图',
          prop: 'image',
          width: 170,
        },
      ],
      editableTable: [], // 可编辑商品属性表格
      editableHeader: [
        {
          label: '供货价',
          prop: 'supplyPrice',
        },
        {
          label: '划线价',
          prop: 'editMarketPrice',
          width: 160,
        },
        {
          label: '销售价（USDT）',
          prop: 'editPrice',
          width: 160,
        },
        {
          label: '销售价（Candy）',
          prop: 'whalePeas',
          width: 160,
        },
        {
          label: '商品库存',
          prop: 'stock',
        },
        {
          label: '库存预警值',
          prop: 'waring',
          width: 90,
        },
        {
          label: 'SKU编号',
          prop: 'skuNo',
        },
        {
          label: 'SKU名称',
          prop: 'name',
        },
        {
          label: '属性图',
          prop: 'image',
          width: 170,
        },
      ], // 可编辑商品属性表头
      productId: '',
      attrTypes: [],
      recommendList: [], // 推荐列表
      tagList: [
        '折扣商品',
        '进口商品',
        '促销商品',
        '热销商品',
      ], // 商品角标
      pid: '',
      cid: '',
      attrTypeId: '',
      attrTypeName: '',
      items: [], // sku属性列表
      attrs: [], // 商品属性规格
      recommended: [], // 选择的推荐项
      commission: true, // 是否开启分佣 默认开启
      tags: [],  // 选择的角标
      edited: false,
      cites: [],  // 无门槛优惠券列表
      couponId: '', // 无门槛优惠券id
      payWay: 1
    }
  },
  async mounted () {
    this.productId = this.$route.query.productId;
    await this.recommendReq();
    await this.productDetailReq();
    await this.citeListReq();
  },
  methods: {
    // 获取无门槛优惠券列表
    async citeListReq () {
      try {
        let {data: {list}} = await citeList({type: 1});
        this.cites = list?.map(({id, name, couponAmount: amount}) => ({id, name, amount}));
      } catch (error) {
        throw error;
      }
    },
    // 获取属性类型列表
    async goodsAttributeListReq () {
      try {
        const {data} = await goodsAttributeList();
        this.attrTypes = data.list || [];
        data.list.some(({attributeId, attributeName}) => {
          if (this.attrTypeId == attributeId) {
            this.attrTypeName = attributeName;
            return true;
          };
        });
      } catch (error) {
        throw error;
      }
    },
    // 根据商品分类获取属性类型
    async attrByCateIdReq () {
      try {
        const id = this.cid || this.pid;
        const {data} = await attrByCateId({id});
        if (data && data.id) {
          let attrTypeIdBind;       // 绑定的属性类型
          let attrTypeIdCustom;     // 自定义的属性类型
          attrTypeIdBind = data.id;
          // 对比属性类型id是否相同
          this.items.some(({props, enable}) => enable && props.some(({attrTypeId}) => {
            if (attrTypeId) {
              attrTypeIdCustom = attrTypeId;
              return true;
            };
          }));
          this.attrTypeId = attrTypeIdCustom || attrTypeIdBind;
        } else {
          this.items.some(({props, enable}) => enable && props.some(({attrTypeId}) => {
            if (attrTypeId) {
              this.attrTypeId = attrTypeId;
              return true;
            };
          }));
        };
        // 获取属性类型名称
        await this.goodsAttributeListReq();
        // 根据属性类型获取属性规格
        await this.attrItemReq();
      } catch (error) {
        throw error;
      }
    },
    // 根据属性类型获取属性规格
    async attrItemReq () {
      try {
        const {data: {list}} = await attributeItem({attributeId: this.attrTypeId});
        list.map(el => {
          el.checked = [];
          el.prop = uuid().substr(0, 8);
          el.itemInfo = el.itemInfo || [];
        });
        this.attrs = list;

        // 设置当前被选中的属性值
        this.getCheckedVals();
      } catch (error) {
        throw error;
      }
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
    // 编辑商品
    async auditedEditReq (reqData) {
      try {
        const {code, message} = await auditedEdit(reqData);
        if (code == 200) {
          this.goBackList(); // 返回列表页
          this.$message.success('编辑成功');
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        throw error;
      }
    },
    // 获取商品详情
    async productDetailReq () {
      try {
        const {data} = await productDetail({
          productId: this.productId,
        });
        // 兼容定时售罄接口数据
        let soldOutTime = data.soldOutTime || {};
        // 商品一级、二级分类
        this.pid = data.firstCategoryId;
        this.cid = data.secondCategoryId;
        // 是否已编辑
        this.edited = data.edited;
        // 无门槛优惠券
        this.couponId = data.couponId || null;
        // 是否开启分佣
        this.commission = data.commission;
        // 商品推荐模块
        this.recommended = data.recommended || [];
        // 商品定时售罄
        this.subForm = {...this.subForm, ...soldOutTime};
        // sku属性列表
        this.items = data.items || [];
        this.payWay = data.payWay || 1
        // 根据商品分类获取商品属性类型
        await this.attrByCateIdReq();
      } catch (error) {
        throw error;
      }
    },
    // 获取被选中的属性值 (合并用户自定义的和已绑定的规格)
    getCheckedVals () {
      let tableData = [];
      let propHeader = [];

      this.items.map(pl => {
        pl.props.map(cl => {
          let item = {};
          const {name, value, attrNameId, attrValueId} = cl;
          const hasDiffName = this.attrs.every(({attrItemName}) => attrItemName != name);
          if (hasDiffName) {
            if (attrNameId === 0) {
              item.checked = [];
              item.itemInfo = [];
              item.attrItemName = name;
              item.attrNameId = attrNameId;
              item.prop = uuid().substr(0, 8);

              if (attrValueId === 0) {
                item.checked.push(value);
                item.itemInfo.push(value);
              };
              this.attrs.push(item);
            };
          };

          this.attrs.map(ol => {
            const {attrItemName: label, checked, itemInfo, prop} = ol;
            // 设置被选中的属性值
            if (name == label) {
              if (!checked.includes(value)) checked.push(value);
              if (!itemInfo.includes(value)) itemInfo.push(value);
              pl[prop] = value;
              if (pl.enable) {
                if (propHeader.findIndex(dl => dl.prop == prop) == -1) {
                  propHeader.push({prop, label});
                };
              };
            };

            // // 设置表头列数据
            // if (checked.length) {
            //   const hasSameProp = this.cols.findIndex(dl => dl.prop == prop);
            //   if (hasSameProp == -1) this.cols.push({label, prop});
            // };
          });
        });
        if (pl.enable) tableData.push(pl);
      });

      this.tableHeader = [...propHeader, ...this.tableHeader];
      this.editableHeader = [...propHeader, ...this.editableHeader];
      this.tableData = tableData;

      if (!this.edited) {
        // 二次编辑过的用二次编辑过的值
        // 未二次编辑过用供应商的值
        tableData.map(el => [el.editPrice, el.editMarketPrice] = [el.price, el.marketPrice]);
      };
      this.editableTable = tableData;
    },
    // 格式化
    formatter (row, column) {
      let key = column.property;
      const h = this.$createElement;

      if (key == 'image') {
        const src = row[key];
        const fit = 'fit';
        const style = {
          with: '150px',
          height: '85px',
          display: 'block',
          borderRadius: '2px',
        };
        const props = {src, fit};
        const img = h('el-image', {style, props});
        return src ? img : '-';
      } else if (key == 'skuNo' || key == 'name') {
        return row[key] || '-';
      } else {
        return row[key] || 0;
      }
    },
    // 提交表单
    submitForm () {
      const forms = this.$refs.editableTabForm;
      const result = forms.every(form => {
        let validRst = false;
        form.validate(valid => validRst = valid);
        return validRst;
      });

      if (result) {
        this.$refs.subForm.validate(valid2 => {
          if (valid2) {
            const couponId = this.couponId || null;
            const {day, hour, minute} = this.subForm;
            const items = this.editableTable.map(
              ({id, editPrice, editMarketPrice, whalePeas}) => ({id, editPrice: editPrice || 0, editMarketPrice: editMarketPrice || 0, whalePeas: whalePeas || 0})
            );

            // 判断无门槛优惠券能否使用
            if (couponId) {
              const amount = this.cites.filter(el => el.id == couponId)[0]['amount'];
              const noCanUse = items.some(({editPrice}) => editPrice <= amount);
              if (noCanUse) return this.$message.error('优惠券面额必须小于商品售价，请重新选择优惠券!');
            };

            const data = {
              items,
              tags: [],
              couponId,
              id: this.productId,
              commission: this.commission,
              recommended: this.recommended,
              soldOutTime: {day, hour, minute},
            }

            // 编辑商品请求
            this.auditedEditReq(data);
          };
        });
      } else {
        this.$message.error('校验失败请检查！');
        return;
      };
    },
    // 返回
    goBackList () {
      const curView = this.$route;

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          this.$router.replace({path: 'supplierGoodsList'}); // 返回列表页
        });
      });
    },
  }
}
</script>

<style lang="scss" scoped>
  .edit-operation-goods {
    min-width: 1200px;
    padding: 50px 20px 20px;
    .base {
      .header {
        position: relative;
        display: inline-block;
        color: #fff;
        width: 160px;
        height: 50px;
        line-height: 50px;
        font-weight: 500;
        background: #9ca7b5;
        margin-bottom: 20px;
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
        .info-item {
          min-height: 48px;
          line-height: 48px;
          font-size: 14px;
          margin-bottom: 15px;
          .item-label {
            color: #999;
            text-align: right;
          }
          .editable-table-img {
            width: 150px;
            height: 85px;
            display: block;
          }
        }
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
      margin-bottom: 80px;
      margin-top: 25px;
      button+button {
        margin-left: 50px;
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
    .input-tips {
      color: #9ca7b5;
      line-height: 16px;
      font-size: 13px;
    }
  }
</style>
<style>
.edit-operation-goods .mockSlotStyleToNomal span{
  display: none!important;
}
.edit-operation-goods .mkWD{
  width:180px;
}
</style>
