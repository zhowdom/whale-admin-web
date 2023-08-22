<template>
  <div class="checking-goods-audit">
    <div class="base part1">
      <div class="header">
        <i></i>
        <span>基本属性</span>
      </div>
      <div class="body">
        <el-row class="info-item" :gutter="20">
          <el-col class="item-label" :span="3">商品分类:</el-col>
          <el-col :span="15">{{category||'-'}}</el-col>
        </el-row>
        <el-row class="info-item" :gutter="20">
          <el-col class="item-label" :span="3">商品名称:</el-col>
          <el-col :span="15">{{info.name||'-'}}</el-col>
        </el-row>
        <el-row class="info-item" :gutter="20">
          <el-col class="item-label" :span="3">副标题:</el-col>
          <el-col :span="15">{{info.title||'-'}}</el-col>
        </el-row>
        <el-row class="info-item" :gutter="20">
          <el-col class="item-label" :span="3">商品品牌:</el-col>
          <el-col :span="15">{{info.brandName||'-'}}</el-col>
        </el-row>
        <el-row class="info-item" :gutter="20">
          <el-col class="item-label" :span="3">商品介绍:</el-col>
          <el-col class="item-border" :span="15">{{info.summary||'-'}}</el-col>
        </el-row>
        <el-row class="info-item" :gutter="20">
          <el-col class="item-label" :span="3">运费模板:</el-col>
          <el-col :span="15">{{templateName||'-'}}</el-col>
        </el-row>
        <el-row class="info-item" :gutter="20">
          <el-col class="item-label" :span="3">商品货号:</el-col>
          <el-col :span="15">{{info.itemNo||'-'}}</el-col>
        </el-row>
        <el-row class="info-item" :gutter="20">
          <el-col class="item-label" :span="3">商品重量:</el-col>
          <el-col :span="15">{{info.weights||0}} kg</el-col>
        </el-row>
        <el-row class="info-item" :gutter="20">
          <el-col class="item-label" :span="3">商品体积:</el-col>
          <el-col :span="15">{{info.volumes||0}} m³</el-col>
        </el-row>
      </div>
    </div>

    <el-divider></el-divider>

    <div class="base part2">
      <div class="header">
        <i></i>
        <span>其他信息</span>
      </div>
      <div class="body">
        <el-row class="info-item" :gutter="20">
          <el-col class="item-label" :span="3">服务保证:</el-col>
          <el-col :span="15">
            <el-tag class="mr10" v-for="(item, index) in services" :key="index">
              {{item}}
            </el-tag>
          </el-col>
        </el-row>
        <el-row class="info-item" :gutter="20">
          <el-col class="item-label" :span="3">最小购买数量:</el-col>
          <el-col :span="15">{{info.purchaseMin||'-'}}</el-col>
        </el-row>
        <el-row class="info-item" :gutter="20">
          <el-col class="item-label" :span="3">最大购买数量:</el-col>
          <el-col :span="15">{{info.purchaseMax||'-'}}</el-col>
        </el-row>
        <el-row class="info-item" :gutter="20">
          <el-col class="item-label" :span="3">商品备注:</el-col>
          <el-col :span="15">{{info.remark||'-'}}</el-col>
        </el-row>
        <el-row class="info-item" :gutter="20">
          <el-col class="item-label" :span="3">商品关键词:</el-col>
          <el-col :span="15">
            <template v-if="keywords.length">
              <el-tag class="mr10" v-for="(item, index) in keywords" :key="index">
                {{item}}
              </el-tag>
            </template>
            <template v-else>-</template>
          </el-col>
        </el-row>
      </div>
    </div>

    <el-divider></el-divider>

    <div class="base part3">
      <div class="header">
        <i></i>
        <span>商品属性</span>
      </div>
      <div class="body">
        <el-row class="info-item" :gutter="20">
          <el-col class="item-label" :span="3">属性类型:</el-col>
          <el-col :span="15">{{attrTypeName||'-'}}</el-col>
        </el-row>
        <el-row class="info-item" :gutter="20">
          <el-col class="item-label" :span="3">商品规格:</el-col>
          <el-col :span="20">
            <template v-for="(item, index) in attrs">
              <div class="mb10" :key="index">
                <div class="text-muted ml20 ftwt5" v-if="item.attrItemName">
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
      </div>
    </div>

    <el-divider></el-divider>

    <div class="base part4">
      <div class="header">
        <i></i>
        <span>商品外网参考</span>
      </div>
      <div class="body">
        <el-row class="info-item" :gutter="20">
          <el-col class="item-label" :span="4">商品外网价格:</el-col>
          <el-col :span="15">{{money}} USDT</el-col>
        </el-row>
        <el-row class="info-item" :gutter="20">
          <el-col class="item-label" :span="3">链接:</el-col>
          <el-col :span="15">
            <template v-if="links.length">
              <div v-for="(link, index) in links" :key="index">{{link||'-'}}</div>
            </template>
            <template v-else>-</template>
          </el-col>
        </el-row>
      </div>
    </div>

    <el-divider></el-divider>

    <div class="base part5">
      <div class="header">
        <i></i>
        <span>商品相册</span>
      </div>
      <div class="body">
        <el-row class="info-item" :gutter="20">
          <el-col class="ml120" :span="20">
            <div class="album-info" v-for="src in images" :key="src">
              <el-image :src="src" :preview-src-list="[src]" fit="fit"></el-image>
              <div class="album-txt" v-if="primaryImage==src">商品主图</div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <el-divider></el-divider>

    <div class="base part6">
      <div class="header">
        <i></i>
        <span>规格参数</span>
      </div>
      <div class="body">
        <el-row class="info-item" :gutter="20">
          <el-col class="item-label" :span="3">商品描述:</el-col>
          <el-col :span="21">
            <el-card class="custom-html">
              <div v-html="description"></div>
            </el-card>
          </el-col>
        </el-row>

        <el-row class="info-item" :gutter="20" v-if="status==2||status==4&&upMode">
          <el-col class="item-label" :span="3">上架方式:</el-col>
          <el-col :span="15">
            <el-radio-group v-model="upMode" :disabled="status==4&&upMode" @change="changeUpMode">
              <el-radio :label="false">直接上架</el-radio>
              <el-radio :label="true">进行二次编辑</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="base part7" v-if="upMode&&(status==2||status==4)">
      <div class="header">
        <i></i>
        <span>补充信息</span>
      </div>
      <div class="body">
        <el-row class="info-item" :gutter="20">
          <el-col class="item-label" :span="3">商品推荐:</el-col>
          <el-col :span="15">
            <el-checkbox-group v-model="recommended" :disabled="status==4&&upMode">
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
              :disabled="status==4&&upMode"
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
            <el-form :model="subForm" :rules="rules" ref="subForm" :disabled="status==4&&upMode">
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

    <div class="base part8" v-if="upMode&&(status==2||status==4)">
      <div class="header">
        <i></i>
        <span>价格设置</span>
      </div>
      <div class="body">
        <el-row class="info-item" :gutter="20">
          <el-col class="item-label text-left" :span="15">编辑后商品属性信息:</el-col>
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
                      'required': (prop=='editMarketPrice'||prop=='editPrice'||prop=='whalePeas')&&status==2
                    }"
                  >{{label}}
                  </span>
                  <template slot-scope="{row}">
                    <template v-if="status==2">
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
                          <!-- <el-input v-model="row.whalePeas" placeholder="请输入销售价(Candy)"></el-input> -->
                          <el-input-number class="mockSlotStyleToNomal" size="mini" v-model="row.whalePeas" :precision="6" :step="0.1" :min="0" controls-position="right"></el-input-number>
                        </el-form-item>
                      </el-form>

                      <div v-else-if="prop=='skuNo'||prop=='name'">{{row[prop]||'-'}}</div>
                      <div v-else-if="prop=='image'">
                        <el-image fit="fit" :src="row.image" class="editable-table-img"></el-image>
                      </div>
                      <div v-else>{{row[prop]||0}}</div>
                    </template>
                    <template v-else>
                      <div v-if="prop=='skuNo'||prop=='name'">{{row[prop]||'-'}}</div>
                      <div v-else-if="prop=='image'">
                        <el-image fit="fit" :src="row.image" class="editable-table-img"></el-image>
                      </div>
                      <div v-else>{{row[prop]||0}}</div>
                    </template>
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
      <el-button type="primary" size="large" v-hasPermi="['goods:product:audit']" @click="auditHandle">审核</el-button>
    </div>

    <el-dialog :visible.sync="auditVisible" :close-on-click-modal="false" center width="600px" class="auditDio" :before-close="cancelSubmit">
      <template slot="title">
        <span class="red-dot">*</span>
        <span v-if="status==2">
          商品审核通过后会在“供应商商品列表”中显示
        </span>
        <span v-else>
          审核通过商品将在平台下架
        </span>
      </template>

      <el-form :model="auditForm" :rules="rules" ref="auditForm">
        <el-form-item prop="remark">
          <el-input type="textarea" v-model="auditForm.remark" :rows="5" maxlength="200" show-word-limit placeholder="反馈详情"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button v-if="status==2" type="warning" @click="submitForm(false)">审核失败</el-button>
        <el-button type="primary" @click="submitForm(true)">审核成功</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import _html from '@/utils/stHtml';
import {uuid} from '@/utils/index';
import {citeList} from '@/api/coupons/index';
import {goodsAttributeList} from '@/api/goods/goodsAbout';
import {categoryTree, attrByCateId, attributeItem, descHtml} from '@/api/goods/index';
import {productAudit, productDetail, templateAll, recommend} from '@/api/supplier/supplier';
let reg1 = /^0(\.[1-9]\d?|\.\d[1-9])?$|^[1-9]\d*(\.\d{1,2})?$/; // 0或正数或1-2位小数

export default {
  name: 'CheckingGoodsAudit',
  data () {
    return {
      auditVisible: false,
      info: {},
      auditForm: {
        remark: ''
      },
      subForm: {
        day: '',
        hour: '',
        minute: '',
      },
      rules: {
        remark: [
          { required: true, message: '审核反馈不能为空', trigger: 'blur' },
        ],
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
      status: '',
      categories: [],
      brands: [],
      templs: [],
      category: '',
      templateName: '',
      services: [],
      keywords: [],
      attrTypes: [],
      images: [],
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
      primaryImage: '',
      description: '',
      items: [], // sku属性列表
      attrs: [], // 商品属性规格
      money: '',
      links: [],
      recommended: [], // 选择的推荐项
      commission: true, // 是否开启分佣 默认开启
      tags: [],  // 选择的角标
      upMode: false,
      cites: [],  // 无门槛优惠券列表
      couponId: '', // 无门槛优惠券id
      payWay: 1
    }
  },
  async mounted () {
    this.status = this.$route.query.status;
    this.productId = this.$route.query.productId;
    await this.categoryTreeReq();
    await this.templateAllReq();
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
    // 查询商品分类（不分页）
    async categoryTreeReq () {
      try {
        const {code, message, data} = await categoryTree();
        if (code == 200) {

          function formatData(arr) {
            arr.map(el => {
              el.value = el.categoryId;
              el.label = el.categoryName;
              if (el.child.length) {
                el.children = el.child;
                formatData(el.child);
              }
            });
          };
          formatData(data.list);
          this.categories = data.list;
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        throw error;
      }
    },
    // 获取运费模板
    async templateAllReq () {
      try {
        const {data} = await templateAll({type: 3});
        this.templs = data.list || [];
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
    // 获取descHtml内容
    async descHtmlReq (url) {
      try {
        const {top, bottom,start,end} = _html;
        const {data} = await descHtml(url);
        if (data) {
          data = data.replace(top, '').replace(bottom, '');
          let subStart = data.indexOf(start)
          let subEnd = data.lastIndexOf(end);
          if(subStart != -1 && subEnd != -1){
            data = data.substring(subStart+start.length,subEnd)
          }
          this.description = data;
          // this.description = data.replace(top, '').replace(bottom, '');

        } else {
          this.description = '';
        };
      } catch (error) {
        console.error(error);
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
    // 审核商品
    async productAuditReq (reqData) {
      try {
        const {code, message} = await productAudit(reqData);
        if (code == 200) {
          this.auditVisible = false;
          this.goBackList(); // 返回列表页
          this.$message.success('审核完成');
        } else {
          this.$message.error('审核错误');
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
        this.info = data;
        // 商品一级、二级分类
        this.pid = data.firstCategoryId;
        this.cid = data.secondCategoryId;
        // 是否已编辑过
        this.upMode = data.edited;
        // 是否开启分佣
        this.commission = data.commission;
        // 商品推荐模块
        this.recommended = data.recommended || [];
        // sku属性列表
        this.items = data.items || [];
        this.payWay = data.payWay || 1;
        // 获取商品分类
        this.getGoodsCategory(data.firstCategoryId, data.secondCategoryId);
        // 获取供应商模板
        this.getGoodsTempl(data.templateId);
        // 服务保证
        this.services = data.services || [];
        // 关键词
        this.keywords = data.keywords || [];
        // 根据商品分类获取商品属性类型
        await this.attrByCateIdReq();
        // 外网价格
        this.money = data.refer.money || '-';
        // 链接
        this.links = data.refer.links || [];
        // 商品相册、主图
        this.images = data.images || [];
        this.primaryImage = data.primaryImage || '-';
        // 商品描述信息
        await this.descHtmlReq(data.description);
      } catch (error) {
        throw error;
      }
    },
    // 获取供应商模板
    getGoodsTempl (templateId) {
      this.templs.some(({id, name}) => {
        if (id == templateId) {
          this.templateName = name;
          return true;
        };
      });
    },
    // 获取商品分类
    getGoodsCategory (pid, cid) {
      let pname;
      let cname;
      this.categories.map(pl => {
        if (pl.value == pid) {
          pname = pl.label;
        };
        if (pl.children) {
          pl.children.map(cl => {
            if (cl.value == cid) {
              cname = cl.label;
            };
          });
        };
      });

      if (pname) {
        if (cname) {
          this.category = pname + ' > ' + cname;
        } else {
          this.category = pname;
        };
      } else {
        this.category = cname ? cname : '';
      };
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

      if (!this.upMode) {
        // 二次编辑过的用二次编辑过的值
        // 未二次编辑过用供应商的值
        tableData.map(el => [el.editPrice, el.editMarketPrice] = [el.price, el.marketPrice]);
      };
      this.editableTable = tableData;
    },
    // 改变上架模式
    changeUpMode (arg) {
      if (this.status == 4 && this.upMode) return;
      if (arg) this.recommendReq();
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
    // 取消功能
    cancelSubmit () {
      this.$refs.auditForm.resetFields();
      this.auditVisible = false;
    },
    // 提交表单
    submitForm (audit) {
      this.$refs.auditForm.validate(valid => {
        if (valid) {
          let data;
          // 上架二次编辑
          const auditType = this.upMode && this.status == 2;
          // 是否是二次编辑过的商品下架
          const isEdited = this.upMode && this.status == 4;

          if (auditType) {
            this.$refs.subForm.validate(valid2 => {
              if (valid2) {
                const {day, hour, minute} = this.subForm;
                const items = this.editableTable.map(
                  ({id, editPrice, editMarketPrice, whalePeas}) => ({id, editPrice: editPrice || 0, editMarketPrice: editMarketPrice || 0, whalePeas: whalePeas || 0})
                );

                data = {
                  items,
                  tags: [],
                  auditStatus: audit,
                  id: this.productId,
                  upMode: this.upMode,
                  couponId: this.couponId,
                  commission: this.commission,
                  recommended: this.recommended,
                  remark: this.auditForm.remark,
                  soldOutTime: {day, hour, minute},
                };
              }
            });

          } else {
            data = {
              auditStatus: audit,
              id: this.productId,
              upMode: isEdited ? false : this.upMode,
              remark: this.auditForm.remark,
            }
          };

          // 发起审核请求
          this.productAuditReq(data);
        }
      });
    },
    // 审核操作
    auditHandle() {
      if ((this.upMode && this.status == 4) || !this.upMode) {
        // 下架审核
        this.auditVisible = true;
        return;
      };
      const couponId = this.couponId || null;
      const forms = this.$refs.editableTabForm;
      const result = forms.every(form => {
        let validRst = false;
        form.validate(valid => validRst = valid);
        return validRst;
      });

      const items = this.editableTable.map(
        ({id, editPrice, editMarketPrice}) => ({id, editPrice, editMarketPrice})
      );

      // 判断无门槛优惠券能否使用
      if (couponId) {
        const amount = this.cites.filter(el => el.id == couponId)[0]['amount'];
        const noCanUse = items.some(({editPrice}) => editPrice <= amount);
        if (noCanUse) return this.$message.error('优惠券面额必须小于商品售价，请重新选择优惠券!');
      };

      if (result) {
        this.auditVisible = true;
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
          this.$router.replace({path: 'checkingGoods'}); // 返回列表页
        });
      });
    },
  }
}
</script>

<style lang="scss" scoped>
  .checking-goods-audit {
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
          .custom-img {
            width: 150px;
          }
          .no-img {
            color: #666;
            font-style: italic;
          }
          .item-border {
            border: 1px solid #e4e4e4;
            border-radius: 4px;
            padding: 10px;
            line-height: 18px;
            min-height: 120px;
          }
          .no-border-bottom {
            border-bottom: none;
          }
          .text-normal {
            color: #6699ff;
          }
          .text-block {
            color: #ff6600;
          }
          .album-info {
            width: 160px;
            margin-right: 15px;
            text-align: center;
            display: inline-block;
            vertical-align: top;
            .el-image {
              display: block;
            }
            .album-txt {
              color: #6699ff;
              font-size: 14px;
              line-height: 40px;
            }
          }
          .custom-html {
            height: 580px;
            overflow: auto;
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
    .auditDio {
      .el-dialog__header {
        .red-dot {
          color: #f56c6c;
          vertical-align: middle;
        }
      }
      .el-dialog__body {
        .auditForm2 {
          width: 600px;
          margin: 0 auto;
          .el-form-item {
            ::v-deep .el-form-item__label {
              font-weight: normal;
            }
          }
        }
      }
      .el-dialog__footer {
        button+button {
          margin-left: 38px;
        }
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
.checking-goods-audit .mockSlotStyleToNomal span{
  display: none!important;
}
.checking-goods-audit .mkWD{
  width:180px;
}
</style>
