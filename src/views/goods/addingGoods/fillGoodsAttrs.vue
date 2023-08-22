<template>
  <div class="fill-goods-attr">
    <div class="goods-attr">
      <div class="header mb20">
        <i></i>
        <span>商品属性</span>
      </div>
      <div class="body">
        <el-form label-position="left" :rules="rules" ref="mainForm" class="custom-form">
          <el-form-item label="属性类型: ">
            <el-select class="wth300" v-model="attributeId" filterable placeholder="请选择属性类型" @change="changeAttr" clearable>
              <el-option
                v-for="item in arrList"
                :key="item.attributeId"
                :label="item.attributeName"
                :value="item.attributeId"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="is-required" label="商品规格: ">
            <el-button v-if="attributeId!==''" type="primary" size="mini" @click="addAttrs">增加</el-button>
          </el-form-item>

          <template v-for="(item, index) in attrs">
            <el-form-item class="mb10" :key="index" label-width="0">
              <div class="text-muted ml20 ftwt5" v-if="item.attrItemName">
                <el-tag type="danger">{{item.attrItemName}}</el-tag>
                <el-button class="ml5" type="primary" size="mini" @click="addValues(index)">增加</el-button>
              </div>
              <div class="ml40">
                <el-checkbox-group class="input-class group" v-model="item['checked']" @change="handleCheckedChange">
                  <el-checkbox v-for="(oItem, oindex) in item.itemInfo" :label="oItem" :key="oindex">{{oItem}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </el-form-item>
          </template>

          <el-form-item label-width="0">
            <div style="padding-bottom:10px;">
              <span><i style="color:red;padding-right:6px;">*</i>支付类型：</span>
              <el-radio-group v-model="payWay">
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
                  <el-form :model="row" :rules="rules" ref="rowForm">
                    <el-form-item prop="supplyPrice" class="mb15 mt15" v-if="item.name=='supplyPrice'">
                      <el-input size="mini" v-model="row.supplyPrice" placeholder="请输入供货价"></el-input>
                    </el-form-item>

                    <el-form-item prop="marketPrice" class="mb15 mt15" v-if="item.name=='marketPrice'">
                      <el-input size="mini" v-model="row.marketPrice" placeholder="请输入划线价"></el-input>
                    </el-form-item>

                    <el-form-item prop="price" class="mb15 mt15" v-if="item.name=='price'">
                      <el-input size="mini" v-model="row.price" placeholder="请输入销售价"></el-input>
                    </el-form-item>

                    <el-form-item prop="whalePeas" class="mb15 mt15" v-if="item.name=='whalePeas'">
                      <!-- <el-input v-model="row.whalePeas" placeholder="请输入销售价(Candy)"></el-input> -->
                      <el-input-number class="mockSlotStyleToNomal" size="mini" v-model="row.whalePeas" :precision="6" :step="0.1" :min="0" controls-position="right"></el-input-number>
                    </el-form-item>

                    <el-form-item prop="stock" class="mb15 mt15" v-if="item.name=='stock'">
                      <el-input size="mini" v-model="row.stock" placeholder="请输入库存"></el-input>
                    </el-form-item>

                    <el-form-item prop="waring" class="mb15 mt15" v-if="item.name=='waring'">
                      <el-input size="mini" v-model="row.waring" placeholder="请输入库存预警"></el-input>
                    </el-form-item>

                    <el-form-item prop="skuNo" class="mb15 mt15" v-if="item.name=='skuNo'">
                      <el-input size="mini" v-model="row.skuNo" placeholder="请输入SKU编号"></el-input>
                    </el-form-item>

                    <el-form-item prop="name" class="mb15 mt15" v-if="item.name=='name'">
                      <el-input size="mini" v-model="row.name" placeholder="请输入SKU名称"></el-input>
                    </el-form-item>

                    <div v-if="item.name=='image'">
                      <div v-if="row.image">
                        <el-image class="wth154 ht87 pointer" :src="row.image" @click="uploadDio($index,row)" fit="fit"></el-image>
                      </div>
                      <div v-else>
                        <el-button type="text" @click="uploadDio($index,row)">上传图片</el-button>
                      </div>
                    </div>

                    <div v-if="item.name=='del'">
                      <el-button size="mini" type="danger" @click="delAttr($index)">删除</el-button>
                    </div>
                  </el-form>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="small">刷新列表</el-button>
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
        <el-form :model="refer" :rules="rules" ref="refer" label-width="120px" class="custom-form">
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
              <el-input class="wth245" v-model="refer.links[index]" clearable placeholder="请输入链接"></el-input>
              <el-button class="fr pl10 pr10" type="primary" v-if="index==0" plain icon="el-icon-plus" @click.prevent="addLink"></el-button>
              <el-button class="fr pl10 pr10" type="danger" v-else plain icon="el-icon-minus" @click.prevent="removeLink(index)"></el-button>
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
          <el-upload
            ref="uploadAlbum"
            class="custom-uploader ml120"
            :file-list="uploadConf.fileList"
            :http-request="handleRequest"
            :action="uploadConf.action"
            :limit="uploadConf.limit"
            :auto-upload="uploadConf.auto"
            :accept="uploadConf.accept"
            :list-type="uploadConf.type"
            :show-file-list="uploadConf.showList"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{file}">
              <el-card class="text-center" :body-style="{padding:'0px'}">
                <img :src="file.url" class="wth145 ht145 pd4 block">
                <span class="el-upload-list__item-actions">
                  <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                    <i class="el-icon-zoom-in"></i>
                  </span>
                </span>
                <div class="card-border">
                  <el-button type="text" class="ft13 ftwt5 green-txt-btn" v-if="getPrimaryImage(file)">商品主图</el-button>
                  <el-button type="text" class="ft13 ftwt5" v-else @click="setPrimaryImg(file)">设为主图</el-button>
                  <el-button type="text" class="ft13 ftwt5 red-txt-btn" @click="handleRemove(file)">删除图片</el-button>
                </div>
              </el-card>
            </div>
            <div class="el-upload__tip" slot="tip">最多可以上传5张图片，建议尺寸750*750px，大小不超过500kb</div>
          </el-upload>
        </div>
        <el-divider></el-divider>
        <div class="long-picture">
          <div class="picture-label">商品长图</div>
          <el-upload
            ref="uploadLong"
            class="ml120"
            :file-list="uploadConfLong.fileList"
            :http-request="handleRequestLong"
            :action="uploadConfLong.action"
            :limit="uploadConfLong.limit"
            :auto-upload="uploadConfLong.auto"
            :accept="uploadConfLong.accept"
            :list-type="uploadConfLong.type"
            :show-file-list="uploadConfLong.showList"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemoveLong">
            <i slot="default" class="el-icon-plus"></i>
            <div class="el-upload__tip" slot="tip">推荐图片尺寸960x400 或图片比例12 x 5, 大小不超过500kb</div>
          </el-upload>
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
          <qu-editor v-model="description" :min-height="192" :is-handle-img="true"/>
        </div>
      </div>
    </div>

    <el-divider></el-divider>

    <div class="text-center mt30 mb20">
      <el-button plain @click="prev" class="mr15">上一步，填写商品信息</el-button>
      <el-button type="primary" @click="next" v-hasPermi="['goods:product_self:save']">完成, 提交商品</el-button>
    </div>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

    <!-- 添加属性名称、属性值 -->
    <el-dialog
      center
      width="400px"
      title="新增属性"
      :close-on-click-modal="false"
      :visible.sync="showAddAttr"
      :before-close="cancelDio">
      <el-form :model="attrForm" :rules="rules" ref="attrForm">
        <el-form-item label="数据字段" prop="attrItemProp">
          <el-input placeholder="请输入内容" disabled v-model="attrForm.attrItemProp" />
        </el-form-item>
        <el-form-item label="属性名" prop="attrItemName" v-if="addKey==1">
          <el-input placeholder="请输入内容" v-model.trim="attrForm.attrItemName" />
        </el-form-item>
        <el-form-item label="属性值" prop="attrItemValue" v-if="addKey==2">
          <el-input placeholder="请输入内容" v-model.trim="attrForm.attrItemValue" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDio">取 消</el-button>
        <el-button type="primary" @click="confirmDio">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 上传图片 -->
    <el-dialog
      center
      title="上传图片"
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
          <el-upload
            ref="uploadRow"
            class="row-uploader"
            :file-list="uploadConfRow.fileList"
            :http-request="handleRequestRow"
            :action="uploadConfRow.action"
            :limit="uploadConfRow.limit"
            :auto-upload="uploadConfRow.auto"
            :accept="uploadConfRow.accept"
            :list-type="uploadConfRow.type"
            :show-file-list="uploadConfRow.showList"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__tip mt0" slot="tip">只能上传jpg/png格式文件，最大{{uploadConfRow.size}}KB</div>
          </el-upload>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button class="mr15" @click="cancelUploadDio">取 消</el-button>
        <el-button type="primary" @click="confirmUploadDio">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import filterXSS from 'xss';
import md5 from 'crypto-js/md5';
import _html from '@/utils/stHtml';
import {session} from '@/utils/storage';
import {uuid, strSym} from '@/utils/index';
import {getCertificate, upload} from '@/api/oss';
import {citeList} from '@/api/coupons/index';
import {goodsAttributeList} from '@/api/goods/goodsAbout';
import {attributeItem, productSave, attrByCateId} from '@/api/goods/index';
let reg1 = /^0\.([1-9]\d?|\d[1-9])$|^[1-9]\d*(\.\d{1,2})?$/; // 正数或1-2位小数
let reg4 = /^0(\.[1-9]\d?|\.\d[1-9])?$|^[1-9]\d*(\.\d{1,2})?$/; // 0或正整数或1-2位小数
let reg2 = /^[1-9]\d*$/; // 大于等于1的正整数
let reg3 = /^(0|[1-9]\d*)$/; // 非负整数

export default {
  name: 'FillGoodsAttr',
  components: {
    QuEditor: () => import('@/components/Editor')
  },
  data () {
    let priceValidator = (rule, value, callback) => {
      if ((+this.payWay === 1 || +this.payWay === 2) && (!/\S/.test(value) || value === undefined)) {
        callback(new Error('不能为空'))
      } else if ((+this.payWay === 1 || +this.payWay === 2) && !(reg1.test(value)) && value !== '') {
        callback(new Error('请输入为正整数或1-2位小数'))
      } else {
        callback()
      }
    }
    let whalePeasValidator = (rule, value, callback) => {
      if ((+this.payWay === 2 || +this.payWay === 3) && (!/\S/.test(value) || value === undefined)) {
        callback(new Error('不能为空'))
      } else {
        callback()
      }
    }
    return {
      payWay: 1,
      uploadConfRow: {
        size: 200,
        showList: true,
        auto: true,
        action: '',
        limit: 1,
        fileList: [],
        type: 'picture-card',
        accept: '.png,.jpg,.jpeg',
        arr: ['image/png', 'image/jpeg', 'image/jpg'],
      },
      uploadConf: {
        size: 500,
        showList: true,
        auto: true,
        action: '',
        limit: 5,
        fileList: [],
        type: 'picture-card',
        accept: '.png,.jpg,.jpeg,.gif',
        arr: ['image/png', 'image/jpeg', 'image/gif', 'image/jpg'],
      },
      uploadConfLong: {
        size: 500,
        showList: true,
        auto: true,
        action: '',
        limit: 1,
        fileList: [],
        type: 'picture-card',
        accept: '.png,.jpg,.jpeg,.gif',
        arr: ['image/png', 'image/jpeg', 'image/gif', 'image/jpg'],
      },
      attributeId: '',
      description: '',
      arrList: [],
      rules: {
        supplyPrice: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { pattern: reg1, message: '输入为正整数或1-2位小数', trigger: 'blur' }
        ],
        marketPrice: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { pattern: reg1, message: '输入为正整数或1-2位小数', trigger: 'blur' }
        ],
        price: [
          { validator: priceValidator, trigger: 'blur' }
          // { required: true, message: '输入不能为空', trigger: 'blur' },
          // { pattern: reg1, message: '输入为正整数或1-2位小数', trigger: 'blur' }
        ],
        whalePeas: [
          { validator: whalePeasValidator, trigger: 'blur' }
          // { required: true, message: '输入不能为空', trigger: 'blur' },
          // { pattern: reg11, message: '输入为正整数或1-6位小数', trigger: 'blur' }
        ],
        stock: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { pattern: reg2, message: '输入为大于等于1的正整数', trigger: 'blur' }
        ],
        waring: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { pattern: reg3, message: '输入为非负整数', trigger: 'blur' }
        ],
        money: [
          { pattern: reg4, message: '输入为0或正整数或1-2位小数', trigger: 'blur' }
        ],
        attrItemName: [
          { required: true, message: '属性名称不能为空', trigger: 'blur' },
        ],
        attrItemValue: [
          { required: true, message: '属性值不能为空', trigger: 'blur' },
        ]
      },
      dialogImageUrl: '',
      dialogVisible: false,
      file: null,
      tableData: [],
      cols: [],
      attrs: [],
      showAddAttr: false,
      attrForm: {
        attrItemName: '',
        attrItemValue: '',
        attrItemProp: '',
      },
      primaryImage: '',
      activityImage: '', // 长图
      addKey: 0,
      curIdx: null,
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
        },
        {
          name: 'del',
          width: 100,
          label: '操作'
        },
      ],
      images: [],
      part3: {},
      sellerId: '', // 供应商id
      curImg: '',
      selectName: '',
      goodsName: '',
      deletedSku: [],
      addedVal: [], // 自定义添加的属性值
      cites: [],  // 无门槛优惠券列表
      couponId: '', // 无门槛优惠券id
    }
  },
  computed: {
    getAttrNames () {
      let names = this.cols.map(el => el.label);
      return names.join(',');
    },
    getPrimaryImage () {
      return file => {
        const uploadFiles = this.$refs.uploadAlbum.uploadFiles;
        const index = uploadFiles.findIndex(el => el.uid == file.uid);
        return this.primaryImage == this.images[index];
      }
    }
  },
  activated () {
    this.getSelectName();
    this.getGoodsName();
    this.getCategorieAttrById();
    this.citeListReq();
  },
  deactivated () {
    this.couponId = '';
    this.selectName = '';
    this.goodsName = '';
    this.attributeId = '';
    this.deletedSku = [];
    this.addedVal = [];
    this.cites = [];
  },
  mounted () {
    this.categoriesAttrsReq();
    this.sellerId = this.$store.state.user.sellerId;
  },
  methods: {
    // 获取上一步选择的商品分类
    getSelectName() {
      const pname = session.get('pname');
      const cname = session.get('cname');
      this.selectName = cname ? `${pname} > ${cname}` : pname;
    },
    // 获取最近使用分类
    setRecentlyUsed () {
      const pname = session.get('pname');
      const cname = session.get('cname');
      const {firstCategoryId: pid, secondCategoryId: cid} = session.get('part1');
      const item = {pname, pid, cname, cid};
      const recentlyUsed = session.get('recentlyUsed') || [];
      const hasSameUsed = recentlyUsed.some(el => el.pid == pid && el.cid == cid);
      if (!hasSameUsed) {
        if (recentlyUsed.length) {
          recentlyUsed.unshift(item);
          if (recentlyUsed.length > 5) recentlyUsed.length = 5;
        } else {
          recentlyUsed.push(item);
        };
      };
      session.set('recentlyUsed', recentlyUsed);
    },
    // 获取商品分类名
    getGoodsName () {
      const part2 = session.get('part2');
      this.goodsName = part2 ? part2.name : '';
    },
    // 获取商品分类id
    getCategorieAttrById () {
      const {firstCategoryId, secondCategoryId} = session.get('part1');
      const categorieId = secondCategoryId !== '' ? secondCategoryId : firstCategoryId;
      this.cateAttrByIdReq(categorieId);
    },
    // 设置主图
    setPrimaryImg (file) {
      const uploadFiles = this.$refs.uploadAlbum.uploadFiles;
      const index = uploadFiles.findIndex(el => el.uid == file.uid);
      this.primaryImage = this.images[index];
    },
    // 打开图片上传弹窗
    uploadDio (index, row) {
      this.curImg = row.image || '';
      this.itemIdx = index;
      this.showUploadDio = true;
      this.uploadConfRow.fileList = this.curImg ? [{name: '', url: this.curImg}] : [];
      this.curImg && this.switchUploader('uploadRow', 'none');
    },
    // 取消图片弹窗
    cancelUploadDio () {
      this.curImg = '';
      this.uploadConfRow.fileList = [];
      this.switchUploader('uploadRow', 'inline-block');
      this.showUploadDio = false;
    },
    // 确认图片弹窗
    confirmUploadDio () {
      this.$set(this.tableData[this.itemIdx], 'image', this.curImg);
      this.uploadConfRow.fileList = [];
      this.switchUploader('uploadRow', 'inline-block');
      this.showUploadDio = false;
    },
    // 增加参数
    addLink () {
      this.refer.links.push('');
    },
    // 删除参数
    removeLink (index) {
      this.refer.links.splice(index, 1);
    },
    // 全部属性选中变化
    handleCheckedChange () {
      const isEmpty = this.attrs.every(el => el.checked.length == 0);

      if (isEmpty) {
        this.tableData = [];
      } else {
        this.attrs.map(({attrItemName: label, prop, checked}) => {
          const colIdx = this.cols.findIndex(ol => ol.prop == prop);
          if (checked.length) {
            if (colIdx == -1) this.cols.push({prop, label});
          } else {
            if (colIdx >= 0) this.cols.splice(colIdx, 1);
          };

          // 删除多个属性值中被删除1个属性值的情况移除删除缓存数组的元素
          if (this.deletedSku.length) {
            let delSkuArr = [...this.deletedSku];
            checked.map(ol => {
              this.deletedSku.map((el, ddx) => {
                if (el.indexOf(ol) != -1) delSkuArr.splice(ddx, 1);
              });
            });
            this.deletedSku = delSkuArr;
          };
        });

        this.addTableData();
      };
    },
    // 改变属性类型
    changeAttr (val) {
      this.categoriesAttrsValuesReq(val);
      this.tableData = [];
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
    // 根据属性类型id获取属性值
    async categoriesAttrsValuesReq (attributeId) {
      try {
        const {data} = await attributeItem({attributeId});
        data.list.map(el => {
          el.checked = [];
          el.prop = uuid().substr(0, 8);
          el.itemInfo = el.itemInfo || [];
          el.attrNameId = el.attrItemId;
        });

        this.cols = [];
        this.attrs = data.list;
      } catch (error) {
        throw console.error(error);
      }
    },
    // 根据分类id获取属性值
    async cateAttrByIdReq (id) {
      try {
        const {data} = await attrByCateId({id});
        if (data && data.id) {
          this.attributeId = data.id;
          await this.categoriesAttrsValuesReq(data.id);
        } else {
          this.cols = [];
          this.attrs = [];
        };
        this.tableData = [];
      } catch (error) {
        console.error(error);
      }
    },
    // 删除sku
    delAttr (index) {
      const vm = this;
      const {props} = this.tableData[index];

      this.$confirm('确认删除此SKU?', '警告', {
        customClass: 'wth300',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        closeOnClickModal: false,
      }).then(() => {
        vm.$message.success('删除成功!');
        // 对已删除的sdk的prop进行排序储存
        const propStr = JSON.stringify(props);
        vm.deletedSku.push(propStr);
        vm.tableData.splice(index, 1);

        if (!vm.tableData.length) {
          vm.cols = [];
          vm.attrs.map(el => el.checked = []);
          vm.deletedSku = [];
          return false;
        };
        // 删除成功之后计算
        // 1. 当前属性值的sku是否被全部删除
        // 2. 如果全部被删除则需要取消相应的属性值的勾选否则不做操作
        // 3. 取消勾选之后需要移除删除缓存数组中相应的元素
        // 4. 手动选中的属性值，只要在删除缓存数组中的都必须移除
        let delVal;
        const values = props.map(el => el.value);
        const keys = vm.cols.map(el => el.prop);

        values.every(el => {
          const bool = vm.tableData.some(cl => {
            const boolArr = keys.map(ol => cl[ol] == el);
            return boolArr.some(pl => pl);
          });
          !bool && (delVal = el);
          return bool;
        });

        vm.attrs.map(({prop, checked}) => {
          let attrIdx = checked.indexOf(delVal);
          if(attrIdx >= 0) checked.splice(attrIdx, 1);

          if (!checked.length) {
            const colIdx = vm.cols.findIndex(el => el.prop == prop);
            if (colIdx >= 0) vm.cols.splice(colIdx, 1);
          };
        });

        // 当属性值关联的sku被全部删除需要取消被删除sku的缓存记录
        if (delVal) {
          let delSkuArr = vm.deletedSku.filter(el => el.indexOf(delVal) == -1);
          vm.deletedSku = delSkuArr;
        };
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    cancelDio () {
      this.showAddAttr = false;
      this.$refs.attrForm.resetFields();
    },
    confirmDio () {
      this.$refs.attrForm.validate(valid => {
        if (valid) {
          const {attrItemName, attrItemValue, attrItemProp} = this.attrForm;

          if (this.addKey == 1) { // 添加属性名
            const attrItem = {
              attrItemName,
              itemInfo: [],
              checked: [],
              prop: attrItemProp,
              attrNameId: 0, // 0 - 自定义属性名的id
            };
            if (this.hasSameAttrOrVal(1, attrItemName, this.attrs)) {
              return this.$message.error('商品规格属性名不能重复！');
            };
            this.attrs.push(attrItem);
            this.addColData();
          } else { // 添加属性值
            const attrItemVal = this.attrs[this.curIdx].itemInfo;
            if (this.hasSameAttrOrVal(2, attrItemValue, attrItemVal)) {
              return this.$message.error('商品规格同属性名下的属性值不能重复！');
            };
            // 自定义添加的属性值
            this.addedVal.push(attrItemValue);
            attrItemVal.push(attrItemValue);
          };

          this.showAddAttr = false;
          this.$refs.attrForm.resetFields();
          setTimeout(() => {
            this.addKey = 0;
            this.curIdx = null;
          }, 0);
        } else {
          return false;
        }
      });
    },
    // 是否有相同的属性名/值
    hasSameAttrOrVal (sign, val, arr) {
      if (sign == 1) {
        return arr.some(el => el['attrItemName'] == val);
      } else {
        return arr.some(el => el == val);
      };
    },
    // 添加属性-dio
    addAttrs () {
      this.addKey = 1;
      this.showAddAttr = true;
      this.attrForm.attrItemProp = uuid().substr(0, 8);
    },
    // 添加属性值-dio
    addValues (idx) {
      this.addKey = 2;
      this.curIdx = idx;
      this.showAddAttr = true;
      this.attrForm.attrItemProp = this.attrs[idx].prop;
    },
    // 添加列数据
    addColData () {
      const {attrItemName: label, prop, checked} = this.attrs.slice(-1)[0];
      if (checked.length) this.cols.push({label, prop});
    },
    // 添加表格数据
    addTableData () {
      this.confuseAttr(this.attrs);
    },
    // 属性混淆 - 1
    confuseAttr (arr) {
      let initItem = {};
      let tableData = [];
      let array = this.getArrayByArrays(arr);
      arr.map(({prop}) => initItem[prop] = '');

      array.map(el => {
        let uniquekey;
        let propStr;
        const data = {};
        const props = [];
        const item = el.split(strSym);
        Object.keys(initItem).map((ol, index) => {
          let value = item[index] != 'null' ? item[index] : '';
          data[ol] = value;
          if (value) {
            this.cols.map(({label, prop}) => {
              if (prop == ol) {
                let attrNameId;
                let attrTypeId = this.attributeId;
                let hasAddVal = this.addedVal.includes(value);
                this.attrs.some(ql => {
                  if (ql.prop == prop) attrNameId = ql.attrNameId;
                  return ql.prop == prop;
                });
                let propsItem = {name: label, value, image: '', attrTypeId, attrNameId};
                propsItem = hasAddVal ? {...propsItem, attrValueId: 0} : propsItem;

                props.push(propsItem);
              }
            });
          }
        });
        uniquekey = md5(JSON.stringify(data)).toString();
        propStr = JSON.stringify(props);

        // 之前已删除的不再添加到列表中
        if (!this.deletedSku.includes(propStr)) {
          tableData.push({
            ...data,
            supplyPrice: 0.01,
            marketPrice: 0.01,
            price: 0.01,
            whalePeas: 0.000001,
            stock: 1,
            waring: 0,
            skuNo: '',
            name: '',
            image: '',
            props,
            uniquekey,
            editMarketPrice: 0,
            editPrice: 0,
          });
        }
      });

      tableData.map(pl => {
        this.tableData.map(cl => {
          if (cl.uniquekey == pl.uniquekey) {
            pl.supplyPrice = cl.supplyPrice;
            pl.marketPrice = cl.marketPrice;
            pl.price = cl.price;
            pl.whalePeas = cl.whalePeas;
            pl.stock = cl.stock;
            pl.waring = cl.waring;
          }
        })
      });
      this.tableData = tableData;
      // console.log(array, '_________');
      // console.log(tableData, '---++--');
    },
    // 属性混淆 - 2
    getArrayByArrays(arrays) {
      let result = [''];
      for (let i = 0; i < arrays.length; i++) {
        result = this.getValuesByArray(i, result, arrays[i]);
      };
      return result;
    },
    // 属性混淆 - 3
    getValuesByArray(i, obj1, obj2) {
      let value;
      let arr = [];
      let arr1 = Array.isArray(obj1) ? obj1 : obj1['checked'];
      let arr2 = Array.isArray(obj2) ? obj2 : obj2['checked'];

      for (let m = 0; m < arr1.length; m++) {
        let value1 = arr1[m] === '' && i == 0 ? '' : arr1[m] + strSym;
        if (arr2.length) {
          for(let n = 0; n < arr2.length; n++) {
            let value2 = arr2[n];
            value = value1 + value2;
            arr.push(value);
          };
        } else {
          value = value1 + 'null';
          arr.push(value);
        };
      };
      return arr;
    },
    // 预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 计算默认主图
    getDefaultPrimage () {
      const hasPrimage = this.images.some(el => el == this.primaryImage);
      if (!hasPrimage) this.primaryImage = this.images[0];
    },
    // 切换上传组件显示状态
    switchUploader (ref, arg) {
      this.$nextTick(() => {
        const uploader = this.$refs[ref].$el.querySelector('.el-upload');
        uploader.style.display = arg;
      });
    },
    // 移除上传
    handleRemove(file, fileList) {
      if (this.showUploadDio) {
        this.curImg = '';
        const uploadFiles = this.$refs.uploadRow.uploadFiles;
        const index = uploadFiles.findIndex(el => el.uid == file.uid);
        this.$refs.uploadRow.uploadFiles.splice(index, 1);
        this.switchUploader('uploadRow', 'inline-block');
      } else {
        const uploadFiles = this.$refs.uploadAlbum.uploadFiles;
        const index = uploadFiles.findIndex(el => el.uid == file.uid);
        this.$refs.uploadAlbum.uploadFiles.splice(index, 1);
        this.switchUploader('uploadAlbum', 'inline-block');
        this.images.splice(index, 1);
        this.getDefaultPrimage();
      };
    },
    // 移除上传的长图
    handleRemoveLong(file, fileList) {
      const uploadFiles = this.$refs.uploadLong.uploadFiles;
      const index = uploadFiles.findIndex(el => el.uid == file.uid);
      this.$refs.uploadLong.uploadFiles.splice(index, 1);
      this.switchUploader('uploadLong', 'inline-block');
      this.activityImage = '';
    },
    // 上传前校验 - Row
    beforeUploadRow(file) {
      const isLt = file.size / 1024 < this.uploadConfRow.size;
      const isRightFormat = this.uploadConfRow.arr.includes(file.type);
      if (!isRightFormat) this.$message.error('上传图片只能是JPG、PNG格式!');
      if (!isLt) this.$message.error(`上传图片大小不能超过 ${this.uploadConfRow.size}KB!`);
      return isRightFormat && isLt;
    },
    // 上传前校验
    beforeUpload(file) {
      const isLt = file.size / 1024 < this.uploadConf.size;
      const isRightFormat = this.uploadConf.arr.includes(file.type);
      if (!isRightFormat) this.$message.error('上传图片只能是 JPG，PNG，GIF 格式!');
      if (!isLt) this.$message.error(`上传图片大小不能超过 ${this.uploadConf.size}KB!`);
      return isRightFormat && isLt;
    },
    // 上传前校验-long
    beforeUploadLong(file) {
      const isLt = file.size / 1024 < this.uploadConfLong.size;
      const isRightFormat = this.uploadConfLong.arr.includes(file.type);
      if (!isRightFormat) this.$message.error('上传图片只能是 JPG，PNG，GIF 格式!');
      if (!isLt) this.$message.error(`上传图片大小不能超过 ${this.uploadConfLong.size}KB!`);
      return isRightFormat && isLt;
    },
    // 重写提交方法 - Row
    async handleRequestRow ({file}) {
      const hasValid = this.beforeUploadRow(file);
      if (hasValid) {
        await this.uploadRequset(file);
      } else {
        this.file = null;
        this.dialogImageUrl = '';
        this.$refs.uploadRow.uploadFiles.pop();
      }
    },
    // 重写提交方法
    async handleRequest ({file}) {
      const hasValid = this.beforeUpload(file);
      if (hasValid) {
        await this.uploadRequset(file);
      } else {
        this.file = null;
        this.dialogImageUrl = '';
        this.$refs.uploadAlbum.uploadFiles.pop();
      }
    },
    // 重写提交方法-long
    async handleRequestLong ({file}) {
      const hasValid = this.beforeUploadLong(file);
      if (hasValid) {
        await this.uploadRequsetLong(file);
      } else {
        this.file = null;
        this.dialogImageUrl = '';
        this.$refs.uploadLong.uploadFiles.pop();
      }
    },
    // 向您搭建的STS服务获取临时访问凭证
    async getCertificateRequest () {
      try {
        const {code, data, message} = await getCertificate('product');
        if (code == 200) {
          return data;
        } else {
          this.$message.error(message);
        };
      } catch (error) {
        // ...
      }
    },
    // 发起图片上传请求
    async uploadRequset (file) {
      try {
        const certificates = await this.getCertificateRequest();
        const {res: {status, statusCode, requestUrls}} = await upload(certificates, file);
        if (status == 200 && statusCode == 200) {
          const img = requestUrls[0];
          if (this.showUploadDio) {
            this.curImg = img;
            this.switchUploader('uploadRow', 'none');
          } else {
            this.images.push(img);
            this.$notify.success({
              title: '商品相册图片上传成功',
              message: `还能继续上传${5 - this.images.length}张图片`,
            });
            if (this.images.length >= 5) this.switchUploader('uploadAlbum', 'none');
            this.getDefaultPrimage();
          };
          this.$message.success('图片上传成功！');
        } else {
          this.$message.error('图片上传失败');
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 发起图片上传请求-long
    async uploadRequsetLong (file) {
      try {
        const certificates = await this.getCertificateRequest();
        const {res: {status, statusCode, requestUrls}} = await upload(certificates, file);
        if (status == 200 && statusCode == 200) {
          const img = requestUrls[0];
          this.activityImage = img;
          this.switchUploader('uploadLong', 'none');
          this.$message.success('图片上传成功！');
        } else {
          this.$message.error('图片上传失败');
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 商品描述内容上传
    async handleDescription () {
      const {top, bottom} = _html;
      const _xssDesc = filterXSS(this.description); // xss 转化
      const description = top + _xssDesc + bottom;

      const certificates = await this.getCertificateRequest();
      const {res: {status, statusCode, requestUrls}} = await upload(certificates, description, 'content');
      if (status == 200 && statusCode == 200) {
        return requestUrls[0];
      } else {
        this.$message.error('商品描述转化url错误');
      };
    },
    // 加载loading
    loadLoading () {
      const loadinger = this.$loading({
        lock: true,
        text: '更新中...',
        fullscreen: true,
        spinner: 'el-icon-sunny',
        customClass: 'custom-loading',
      });

      return loadinger;
    },
    // 新建商品请求
    async productSaveReq(data) {
      const loadinger = this.loadLoading();
      try {
        const description = await this.handleDescription();
        const part1 = session.get('part1');
        const part2 = session.get('part2');
        const part3 = {...data, description};
        // 二级分类为空默认给0
        const secondCategoryId = part1.secondCategoryId || 0
        const {code, message} = await productSave({
          ...part1,
          ...part2,
          ...part3,
          secondCategoryId
        });

        if (code == 200) {
          this.part3 = part3;
          session.set('part3', part3);
          this.setRecentlyUsed();
          this.$emit('updateStep', 3);
          this.$message.success('商品添加成功');
          this.goGoodsList();
        } else {
          this.$message.error(message);
        };
        loadinger.close();
      } catch (error) {
        loadinger.close();
        console.error(error);
      }
    },
    next() {
      let part3 = {};
      let refersObj = {};
      let couponId = this.couponId || null;
      let {links, money} = this.refer;
      const rowForms = this.$refs.rowForm;

      if (!rowForms || !rowForms.length) return this.$message.error('请选择属性类型！');
      if (!this.images.length) return this.$message.error('请至少上传一张商品相册的图片！');
      if (!this.description) return this.$message.error('商品描述不能为空！');

      const result = rowForms.every(form => {
        let validRst = false;
        form.validate(valid => validRst = valid);
        return validRst;
      });

      const items = this.tableData.map(({
        editMarketPrice, editPrice, enable, image,
        marketPrice, name, price, whalePeas, productId, props,
        skuNo, stock, supplyPrice, virSales, waring,
      }) => {
        const item = {
          editMarketPrice,
          editPrice,
          image,
          marketPrice,
          name,
          price: price || 0,
          whalePeas: whalePeas || 0,
          props,
          skuNo,
          stock,
          supplyPrice,
          waring,
          // virSales: '',     // 虚拟销量
          // productId: '',    // 商品的ID, 如果是编辑必须传入
          // enable: false,    // true不删除,false删除 编辑时必须传入
          // id: '',           // sku的ID, 如果是编辑必须传入
        };
        if (item.skuNo === '') Reflect.deleteProperty(item, 'skuNo');
        if (item.name === '') Reflect.deleteProperty(item, 'name');
        !item.image && (item.image = this.primaryImage);
        console.log(item, 'item')
        return item;
      });

      if (!items.length) return this.$message.error('商品SKU不能为空！');
      if (links.length) {
        // 去除空的lnks
        links = links.filter(el => el.trim() != '');
        refersObj = {money, links};
      };

      // 判断无门槛优惠券能否使用
      if (couponId) {
        const amount = this.cites.filter(el => el.id == couponId)[0]['amount'];
        const noCanUse = items.some(({price}) => price <= amount);
        if (noCanUse) return this.$message.error('优惠券面额必须小于商品售价，请重新选择优惠券!');
      };

      // 设置part3本地数据
      part3 = {
        items,
        couponId,
        description: '',
        refer: refersObj,
        images: this.images,
        sellerId: this.sellerId,
        primaryImage: this.primaryImage,
        activityImage: this.activityImage,
        payWay: this.payWay
      };

      if (result) this.productSaveReq(part3);
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
    prev () {
      this.$emit('updateStep', 2);
    },
    // 页面跳转
    goGoodsList () {
      const curView = this.$route;

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          // 返回列表页
          this.clearCache();
          this.$router.replace({path: 'goodslist'});
        });
      });
    }
  }
}
</script>

<style lang="scss" scoped>
  .fill-goods-attr {
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
    }
  }
</style>
<style>
.fill-goods-attr .el-form-item__error{
  position: relative!important;
}
.fill-goods-attr .mockSlotStyleToNomal span{
  display: none!important;
}
</style>
