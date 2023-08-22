<template>
  <div class="goods-attrs-wrap">
    <div class="goods-attr">
      <div class="header mb20">
        <i></i>
        <span>商品属性</span>
      </div>
      <div class="body">
        <el-form label-position="left" :rules="rules" ref="mainForm" class="custom-form" disabled>
          <el-form-item label="属性类型: ">
            <el-select class="wth300" v-model="attributeId" filterable placeholder="请选择属性类型">
              <el-option
                v-for="item in arrList"
                :key="item.attributeId"
                :label="item.attributeName"
                :value="item.attributeId"
              >
              </el-option>
              <el-option
                v-if="hasAttrDeleted(attributeId, arrList)"
                :value="attributeId"
                label="已删除"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="is-required" label="商品规格: "></el-form-item>

          <template v-for="(item, index) in attrs">
            <el-form-item class="mb10" :key="index" label-width="0">
              <div class="text-muted ml20 ftwt5" v-if="item.attrItemName">
                <el-tag type="danger">{{item.attrItemName}}</el-tag>
              </div>
              <div class="ml40">
                <el-checkbox-group class="input-class group" v-model="item['checked']">
                  <el-checkbox v-for="(oItem, oindex) in item.itemInfo" :label="oItem" :key="oindex">{{oItem}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </el-form-item>
          </template>

          <el-form-item label-width="0">

            <div style="padding-bottom:10px;">
              <span><i style="color:red;padding-right:6px;">*</i>支付类型：</span>
              <el-radio-group disabled v-model="payWay">
                <el-radio :label="1">自由支付</el-radio>
                <el-radio :label="2">（现金+Candy）组合支付</el-radio>
                <el-radio :label="3">纯Candy支付</el-radio>
              </el-radio-group>
            </div>

            <el-table :data="tableData" border v-if="cols.length" row-key="key">
              <el-table-column v-for="({prop, label}, index) in cols" :key="index" :prop="prop" :label="label" align="center"></el-table-column>

              <el-table-column
                align="center"
                v-for="(item, index) in restTableHead"
                :key="item.key"
                :prop="item.name"
                :label="item.label"
                :width="item.width"
              >
                <span
                  slot="header"
                  :class="{'required': item.name=='supplyPrice'||
                    item.name=='marketPrice'||
                    item.name=='price'|| item.name=='whalePeas' ||
                    item.name=='stock'||
                    item.name=='waring'
                  }"
                >
                  {{item.label}}
                </span>
                <template slot-scope="{row,$index}">
                  <div v-if="item.name=='supplyPrice'">{{row.supplyPrice||'-'}}</div>
                  <div v-if="item.name=='marketPrice'">{{row.marketPrice||'-'}}</div>
                  <div v-if="item.name=='price'">{{row.price||'-'}}</div>
                  <div v-if="item.name=='whalePeas'">{{row.whalePeas}}</div>
                  <div v-if="item.name=='stock'">{{row.stock||'-'}}</div>
                  <div v-if="item.name=='waring'">{{row.waring||'-'}}</div>
                  <div v-if="item.name=='skuNo'">{{row.skuNo||'-'}}</div>
                  <div v-if="item.name=='name'">{{row.name||'-'}}</div>
                  <div v-if="item.name=='image'">
                    <el-image v-if="row.image" class="wth154 ht87 pointer" :src="row.image" @click="uploadDio($index,row)" fit="fit"></el-image>
                    <div v-else>--</div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>

          <el-form-item label="选择配用优惠券里的-无门槛优惠券: ">
            <el-select :disabled="+payWay === 3" class="wth300" v-model="couponId" placeholder="请选择优惠券" clearable>
              <el-option v-for="{id,name,amount} in cites" :key="id" :value="id" :label="name">
                <span style="float: left">{{name}}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{amount}}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <el-divider></el-divider>

    <div class="outwebsite-info">
      <div class="header mb20">
        <i></i>
        <span>商品外网参考</span>
      </div>
      <div class="body">
        <el-form :model="refer" :rules="rules" ref="refer" label-width="120px" class="custom-form" disabled>
          <el-form-item label="商品外网价格" prop="money">
            <el-input class="wth300" placeholder="请输入内容" v-model="refer.money">
              <template slot="append">USDT</template>
            </el-input>
          </el-form-item>

          <el-form-item label="链接" prop="links">
            <el-form-item
              class="wth300 mb20"
              v-for="(item, index) in refer.links"
              :key="index"
              :prop="'links.' + index"
              :rules="{type: 'url', message: '链接格式有误', trigger: 'blur'}"
            >
              <el-input v-model="refer.links[index]" clearable placeholder="请输入链接"></el-input>
            </el-form-item>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <el-divider></el-divider>

    <div class="goods-album">
      <div class="header mb20">
        <i></i>
        <span>商品相册</span>
      </div>
      <div class="body">
        <div class="group-picture">
          <div class="picture-label">商品组图</div>
          <div class="ml120">
            <div v-for="url in images" class="wth150 inline-block mr15">
              <el-card class="text-center" :body-style="{padding:'0px'}">
                <img :src="url" class="wth145 ht145 pd4 block pointer" @click="handlePictureCardPreview(url)">
                <div class="card-border ht36">
                  <el-button type="text" class="ft13 ftwt5 green-txt-btn" v-if="url==primaryImage">商品主图</el-button>
                </div>
              </el-card>
            </div>
            <div class="el-upload__tip" slot="tip">最多可以上传5张图片，建议尺寸750*750px，大小不超过500kb</div>
          </div>
        </div>
        <el-divider></el-divider>
        <div class="long-picture">
          <div class="picture-label">商品长图</div>
          <div class="ml120">
            <el-image class="pointer long" :src="activityImage" @click="handlePictureCardPreview(activityImage)">
              <div slot="error" class="el-image__error">
                <i class="el-icon-picture"></i>
              </div>
            </el-image>
            <div class="el-upload__tip">推荐图片尺寸960x400 或图片比例12 x 5, 大小不超过500kb</div>
          </div>
        </div>
      </div>
    </div>

    <el-divider></el-divider>

    <div class="goods-params">
      <div class="header mb10">
        <i></i>
        <span>规格参数</span>
      </div>
      <div class="body">
        <div class="ml120 mb10 mt20">
          <el-tag type="" effect="dark">移动端详情</el-tag>
          <span class="ml10 ft14 text-muted">详情页单张图片大小上传建议不超过500kb</span>
        </div>
        <div class="ml120">
          <qu-editor ref="qqEditor" v-model="description" :min-height="192"/>
        </div>
      </div>
    </div>

    <el-divider></el-divider>

    <div class="text-center mt30 mb20">
      <el-button plain @click="prev" class="mr15">上一步，查看商品信息</el-button>
      <el-button type="primary" @click="next">返回</el-button>
    </div>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

    <!-- 上传图片 -->
    <el-dialog
      center
      title="查看图片"
      width="420px"
      :close-on-click-modal="false"
      :visible.sync="showUploadDio"
      :before-close="cancelUploadDio">
      <el-row class="lht32" :gutter="20">
        <el-col class="text-right" :span="8">商品名称：</el-col>
        <el-col :span="16">{{goodsName||'-'}}</el-col>
      </el-row>
      <el-row class="lht32" :gutter="20">
        <el-col class="text-right" :span="8">商品类型名称：</el-col>
        <el-col :span="16">{{selectName||'-'}}</el-col>
      </el-row>
      <el-row class="lht32" :gutter="20">
        <el-col class="text-right" :span="8">属性名称：</el-col>
        <el-col :span="16">{{getAttrNames}}</el-col>
      </el-row>
      <el-row class="lht32" :gutter="20">
        <el-col class="text-right" :span="8">属性图片：</el-col>
        <el-col :span="16">
          <div class="wth108 ht108">
            <el-image class="pointer" :src="curImg" @click="handlePictureCardPreview(curImg)"></el-image>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {uuid} from '@/utils/index';
import _html from '@/utils/stHtml';
import {session} from '@/utils/storage';
import {citeList} from '@/api/coupons/index';
import {goodsAttributeList} from '@/api/goods/goodsAbout';
import {attributeItem, attrByCateId, descHtml} from '@/api/goods/index';

export default {
  name: 'GoodsAttrs',
  components: {
    QuEditor: () => import('@/components/Editor')
  },
  data () {
    return {
      payWay: 1,
      attributeId: '',
      description: '',
      arrList: [],
      rules: {},
      dialogImageUrl: '',
      dialogVisible: false,
      tableData: [],
      cols: [],
      attrs: [
        // {
        //   "attrItemId":3,
        //   "attrItemName":"尺码",
        //   "itemInfo":["M","L","XL","2XL","3XL"],
        //   "checked":[],
        //   "prop":"18d2005d"
        // }
      ],
      primaryImage: '',
      activityImage: '',
      refer: {
        money: '',
        links: [''],
      },
      showUploadDio: false,
      itemIdx: 0,
      restTableHead: [
        {
          name: 'supplyPrice',
          width: 160,
          label: '供货价（USDT）'
        },
        {
          name: 'marketPrice',
          width: 160,
          label: '划线价（USDT）'
        },
        {
          name: 'price',
          width: 160,
          label: '销售价（USDT）'
        },
        {
          name: 'whalePeas',
          width: 160,
          label: '销售价(Candy)'
        },
        {
          name: 'stock',
          width: 160,
          label: '商品库存'
        },
        {
          name: 'waring',
          width: 160,
          label: '库存预警值'
        },
        {
          name: 'skuNo',
          width: 160,
          label: 'SKU编号'
        },
        {
          name: 'name',
          width: 160,
          label: 'SKU名称'
        },
        {
          name: 'image',
          width: 175,
          label: '属性图片'
        }
      ],
      images: [],
      curImg: '',
      selectName: '',
      goodsName: '',
      cites: [],  // 无门槛优惠券列表
      couponId: '', // 无门槛优惠券id
    }
  },
  computed: {
    getAttrNames () {
      let names = this.cols.map(el => el.label);
      return names.join(',');
    },
    hasAttrDeleted () {
      return (selAttrId, attrList) => {
        return attrList.every(({attributeId}) => attributeId != selAttrId);
      }
    }
  },
  activated () {
    this.getSelectName();
    this.getGoodsName();
    this.setPart3Data();
    this.citeListReq();
  },
  deactivated () {
    this.cites = [];
    this.couponId = '';
    this.selectName = '';
    this.goodsName = '';
    this.attributeId = '';
  },
  mounted () {
    this.categoriesAttrsReq();
  },
  methods: {
    // 获取上一步选择的商品分类
    getSelectName() {
      const pname = session.get('pname');
      const cname = session.get('cname');
      this.selectName = cname ? `${pname} > ${cname}` : pname;
    },
    // 获取商品分类名
    getGoodsName () {
      const part2 = session.get('part2');
      this.goodsName = part2 ? part2.name : '';
    },
    // 设置part3数据
    async setPart3Data () {
      let attrTypeId;
      let {top, bottom,start,end} = _html;
      let {firstCategoryId, secondCategoryId} = session.get('part1');
      let {items, description, refer, images, primaryImage, activityImage, couponId, payWay} = session.get('part3');
      
      let categorieId = secondCategoryId || firstCategoryId; // 商品分类id（二级没有取一级）
      let money = refer?.money || '';
      let links = refer?.links || [];
      !links.length && links.push('');
      items.some(({props}) => props.some(ol => {
        attrTypeId = ol.attrTypeId;
        return attrTypeId !== undefined;
      }));
      await this.cateAttrByIdReq(categorieId, attrTypeId);
      let _descHtml = await this.descHtmlReq(description);
      _descHtml = _descHtml.replace(top, '').replace(bottom, '');
      let subStart = _descHtml.indexOf(start)
      let subEnd = _descHtml.lastIndexOf(end);
      if(subStart != -1 && subEnd != -1){
        _descHtml = _descHtml.substring(subStart+start.length,subEnd)
      }
      this.images = images || [];
      this.refer = {money, links};
      this.description = _descHtml;
      this.primaryImage = primaryImage;
      this.activityImage = activityImage;
      this.couponId = couponId || null;
      this.payWay = payWay || 1

      // 设置当前已被选中的属性值
      items.map(pl => {
        pl.props.map(cl0 => {
          let item = {};
          const {name, value, attrNameId, attrValueId} = cl0;
          const hasNotDiffName = this.attrs.every(({attrItemName}) => attrItemName != name);
          if (hasNotDiffName) {
            // if (attrNameId === 0) {
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
            // };
          };

          this.attrs.map(cl1 => {
            const {attrItemName: label, checked, itemInfo, prop} = cl1;
            // 设置被选中的属性值
            if (name == label) {
              if (!checked.includes(value)) checked.push(value);
              if (!itemInfo.includes(value)) itemInfo.push(value);
              pl[prop] = value;
            };

            // 设置表头列数据
            if (checked.length) {
              const hasSameProp = this.cols.findIndex(dl => dl.prop == prop);
              if (hasSameProp == -1) this.cols.push({label, prop});
            };
          });
        });
      });

      // 设置表格数据
      this.tableData = items;

      // 禁用富文本
      if (this.$refs.qqEditor) {
        this.$refs.qqEditor.Quill.enable(false);
      };
    },
    // 打开图片上传弹窗
    uploadDio (index, row) {
      this.curImg = row.image || '';
      this.itemIdx = index;
      this.showUploadDio = true;
    },
    // 取消图片弹窗
    cancelUploadDio () {
      this.curImg = '';
      this.showUploadDio = false;
    },
    // 获取descHtml内容
    async descHtmlReq (url) {
      try {
        const {data} = await descHtml(url);
        return data;
      } catch (error) {
        console.error(error);
      }
    },
    // 获取无门槛优惠券列表
    async citeListReq () {
      try {
        let {data: {list}} = await citeList({type: 1});
        this.cites = list?.map(({id, name, couponAmount: amount}) => ({id, name, amount}));
      } catch (error) {
        throw error;
      }
    },
    // 获取属性列表
    async categoriesAttrsReq () {
      try {
        const {data} = await goodsAttributeList();
        this.arrList = data.list;
      } catch (error) {
        throw console.error(error);
      };
    },
    // 根据属性类型获取属性值
    async categoriesAttrsValuesReq (attributeId) {
      try {
        const {data} = await attributeItem({attributeId});
        data.list.map(el => {
          el.checked = [];
          el.prop = uuid().substr(0, 8);
          el.itemInfo = el.itemInfo || [];
        });

        this.cols = [];
        this.attrs = data.list;
      } catch (error) {
        throw console.error(error);
      }
    },
    // 根据分类id获取后台绑定的属性类型
    async cateAttrByIdReq (id, attrTypeId) {
      try {
        const {data} = await attrByCateId({id});

        if (data && data.id) {
          // 该分类下绑定的属性类型不为空
          // 此处的属性类型id是后台给该分类绑定属性类型时的id ！！！
          // [查到已绑定属性类型需要跟创建sku时选择的属性类型进行比较]
          this.attributeId = attrTypeId !== '' ? attrTypeId : data.id;
        } else {
          // 该分类下绑定的属性类型为空，
          // 此处的属性类型id是创建SKU时使用的属性类型的id ！！！
          this.cols = [];
          this.attrs = [];
          this.attributeId = attrTypeId;
        };
        await this.categoriesAttrsValuesReq(this.attributeId);
        this.tableData = [];
      } catch (error) {
        console.error(error);
      }
    },
    handlePictureCardPreview(url) {
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    // 清空缓存
    clearCache () {
      session.remove('pname');
      session.remove('cname');
      session.remove('part1');
      session.remove('part2');
      session.remove('part3');
      session.remove('part1Info');
      session.remove('part2Info');
      session.remove('part3Info');
      session.remove('productId');
    },
    next() {
      const curView = this.$route;

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          this.clearCache();
          this.$router.replace({path: 'goodslist'});
        });
      });
    },
    prev () {
      this.$emit('updateStep', 2);
    },
  }
}
</script>

<style lang="scss" scoped>
  .goods-attrs-wrap {
    .goods-attr,
    .outwebsite-info,
    .goods-album,
    .goods-params {
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
        .custom-form {
          width: 1100px;
          margin: 0 auto;
          margin-top: 45px;
        }
      }
    }
    .custom-uploader {
      &::v-deep {
        .el-upload-list {
          .el-upload-list__item {
            border: none;
            margin-bottom: 0;
            margin-right: 30px;
            &.is-success{
              overflow: unset;
            }
          }
        }
      }
    }
    .row-uploader {
      ::v-deep .el-upload-list {
        li {
          width: 108px;
          height: 108px;
        }
      }
      ::v-deep .el-upload--picture-card {
        width: 108px;
        height: 108px;
        line-height: 108px;
      }
    }
    .el-form-item {
      ::v-deep .el-form-item__label {
        font-weight: normal;
      }
    }
    .group-picture,
    .long-picture {
      .picture-label {
        height: 100%;
        float: left;
        min-height: 172px;
        width: 110px;
        font-size: 14px;
        color: #606266;
        text-align: center;
      }
      .long {
        width: 320px;
        height: 180px;
      }
      ::v-deep .el-image__error {
        width: 320px;
        height: 180px;
        border-radius: 2px;
        i {
          font-size: 42px;
        }
      }
    }
  }
</style>
