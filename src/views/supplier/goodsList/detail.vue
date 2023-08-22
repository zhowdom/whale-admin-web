<template>
  <div class="operation-goods-detail">
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
          <el-col class="item-label" :span="3">商品备注:</el-col>
          <el-col :span="15">{{info.remark||'-'}}</el-col>
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

        <el-row class="info-item" :gutter="20" v-if="upMode">
          <el-col class="item-label" :span="3">上架方式:</el-col>
          <el-col :span="15">
            <el-radio-group v-model="upMode" :disabled="upMode">
              <el-radio :label="false">直接上架</el-radio>
              <el-radio :label="true">进行二次编辑</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="base part7" v-if="upMode">
      <div class="header">
        <i></i>
        <span>补充信息</span>
      </div>
      <div class="body">
        <el-row class="info-item" :gutter="20">
          <el-col class="item-label" :span="3">商品推荐:</el-col>
          <el-col :span="15">
            <el-checkbox-group v-model="recommended" :disabled="upMode">
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
              :disabled="upMode"
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
            <el-form :model="subForm" ref="subForm" disabled>
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

    <div class="base part8" v-if="upMode">
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
                <template slot-scope="{row}">
                  <div v-if="prop=='skuNo'||prop=='name'">{{row[prop]||'-'}}</div>
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
            <el-select :disabled="+payWay === 3" class="wth300" v-model="couponId" placeholder="请选择优惠券" disabled>
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
    </div>
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
import {productDetail, templateAll, recommend} from '@/api/supplier/supplier';

export default {
  name: 'OperationGoodsDetail',
  data () {
    return {
      info: {},
      subForm: {
        day: '',
        hour: '',
        minute: '',
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
          label: '销售价',
          prop: 'price',
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
      commission: true, // 是否分佣 默认开启
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
    // 获取商品详情
    async productDetailReq () {
      try {
        const {data} = await productDetail({
          productId: this.productId,
        });
        // 兼容定时售罄接口数据
        let soldOutTime = data.soldOutTime || {};
        this.info = data;
        // 商品一级、二级分类
        this.pid = data.firstCategoryId;
        this.cid = data.secondCategoryId;
        // 是否已编辑过
        this.upMode = data.edited;
        // 无门槛优惠券
        this.couponId = data.couponId;
        // 是否分佣
        this.commission = data.commission;
        // 商品推荐模块
        this.recommended = data.recommended || [];
        // 商品定时售罄
        this.subForm = {...this.subForm, ...soldOutTime};
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
  .operation-goods-detail {
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
