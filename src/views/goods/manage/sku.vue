<template>
  <div class="skuWrapper">

    <el-dialog :width="cur_clickType === 'seeDetail' ? '50%' : '95%'" :title="curTitleName" :visible.sync="sendTochildBridgeData.visible" :before-close="handleClose">
      <div class="skuboxTop clearfix" v-show="cur_clickType !== 'seeDetail'">
        <span class="fl" style="line-height:32px;">商品货号：{{curProductItemNo}}</span>
        <el-input placeholder="请输入内容" clearable v-model="keywords" class="input-with-select fl" style="display:none;">
          <el-button :loading="loadingSku" @click="skulistQuery(1)" slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>


      <el-table v-loading="loadingSku" :data="skuData" border :key="Math.random()">

        <el-table-column :label="its" v-for="(its, kes) in customHeaderLabel_Name" :key="kes + Math.random()" align="center" header-align="center">
          <template scope="scope">
            <div>
              <p>{{convrtedProps[scope.row.id][its]}}</p>
            </div>
          </template>
        </el-table-column>

        
        <el-table-column v-if="cur_clickType === 'edit' || cur_clickType === 'editReadOnly'" prop="supplyPrice" label="供货价" align="center" header-align="center" width="160">
          <template scope="scope">
            <div>

              <div v-if="cur_clickType === 'edit'">
                <el-input-number :precision="2" v-if="(bridgeRowData.source === 2 && bridgeRowData.status === 3 && (bridgeRowData.autoUpTiming && $dayjs(bridgeRowData.autoUpTiming).unix() > parseInt(new Date().getTime()/1000))) || (bridgeRowData.source === 2 && bridgeRowData.status === 6)" size="mini" class="innnerInput" v-model="scope.row.supplyPrice" controls-position="right" @change="((val)=>{handleChange(val, 'supplyPrice', scope.row)})" :min="0" @blur="handleBlur"></el-input-number>
                <span v-else>{{scope.row.supplyPrice}}</span>
              </div>
              <div v-else-if="cur_clickType === 'editReadOnly'">
                {{scope.row.supplyPrice}}
              </div>
              
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="cur_clickType === 'edit' || cur_clickType === 'editReadOnly'" prop="editMarketPrice" label="划线价" align="center" header-align="center" width="160">
          <template scope="scope">
            <div>
              
              <div v-if="bridgeRowData.source === 1">

                <div v-if="bridgeRowData.edited" kName='经过了二次编辑（供应商1采取先有逻辑，自营2的采取刚刚商定的修改逻辑）'>
                  <div v-if="cur_clickType === 'edit'">
                    <el-input-number :precision="2" v-if="(bridgeRowData.source === 2 && bridgeRowData.status === 3 && (bridgeRowData.autoUpTiming && $dayjs(bridgeRowData.autoUpTiming).unix() > parseInt(new Date().getTime()/1000))) || (bridgeRowData.source === 2 && bridgeRowData.status === 6) || (bridgeRowData.source === 1 && bridgeRowData.status === 3 && (bridgeRowData.autoUpTiming && $dayjs(bridgeRowData.autoUpTiming).unix() > parseInt(new Date().getTime()/1000)))" size="mini" class="innnerInput" v-model="scope.row.editMarketPrice" controls-position="right" @change="((val)=>{handleChange(val, 'editMarketPrice', scope.row)})" :min="0" @blur="handleBlur"></el-input-number>
                    <span v-else>{{scope.row.editMarketPrice}}</span>
                  </div>
                  <div v-else-if="cur_clickType === 'editReadOnly'">
                    {{scope.row.editMarketPrice}}
                  </div>
                </div>
                <div v-else kName='没有经过二次编辑（供应商采取先有逻辑，自营的采取刚刚商定的修改逻辑）'>
                  <div v-if="cur_clickType === 'edit'">
                    <el-input-number :precision="2" v-if="(bridgeRowData.source === 2 && bridgeRowData.status === 3 && (bridgeRowData.autoUpTiming && $dayjs(bridgeRowData.autoUpTiming).unix() > parseInt(new Date().getTime()/1000))) || (bridgeRowData.source === 2 && bridgeRowData.status === 6) || (bridgeRowData.source === 1 && bridgeRowData.status === 3 && (bridgeRowData.autoUpTiming && $dayjs(bridgeRowData.autoUpTiming).unix() > parseInt(new Date().getTime()/1000)))" size="mini" class="innnerInput" v-model="scope.row.marketPrice" controls-position="right" @change="((val)=>{handleChange(val, 'marketPrice', scope.row)})" :min="0" @blur="handleBlur"></el-input-number>
                    <span v-else>{{scope.row.marketPrice}}</span>
                  </div>
                  <div v-else-if="cur_clickType === 'editReadOnly'">
                    {{scope.row.marketPrice}}
                  </div>
                </div>

              </div>
              <div v-else-if="bridgeRowData.source === 2">

                <div v-if="bridgeRowData.edited" kName='经过了二次编辑'>
                  <div v-if="cur_clickType === 'edit'">
                    <el-input-number :precision="2" v-if="(bridgeRowData.source === 2 && bridgeRowData.status === 3 && (bridgeRowData.autoUpTiming && $dayjs(bridgeRowData.autoUpTiming).unix() > parseInt(new Date().getTime()/1000))) || (bridgeRowData.source === 2 && bridgeRowData.status === 6) || (bridgeRowData.source === 1 && bridgeRowData.status === 3 && (bridgeRowData.autoUpTiming && $dayjs(bridgeRowData.autoUpTiming).unix() > parseInt(new Date().getTime()/1000)))" size="mini" class="innnerInput" v-model="scope.row.editMarketPrice" controls-position="right" @change="((val)=>{handleChange(val, 'editMarketPrice', scope.row)})" :min="0" @blur="handleBlur"></el-input-number>
                    <span v-else>{{scope.row.editMarketPrice}}</span>
                  </div>
                  <div v-else-if="cur_clickType === 'editReadOnly'">
                    {{scope.row.editMarketPrice}}
                  </div>
                </div>
                <div v-else kName='没有经过二次编辑'>
                  <div v-if="cur_clickType === 'edit'">
                    <el-input-number :precision="2" v-if="(bridgeRowData.source === 2 && bridgeRowData.status === 3 && (bridgeRowData.autoUpTiming && $dayjs(bridgeRowData.autoUpTiming).unix() > parseInt(new Date().getTime()/1000))) || (bridgeRowData.source === 2 && bridgeRowData.status === 6) || (bridgeRowData.source === 1 && bridgeRowData.status === 3 && (bridgeRowData.autoUpTiming && $dayjs(bridgeRowData.autoUpTiming).unix() > parseInt(new Date().getTime()/1000)))" size="mini" class="innnerInput" v-model="scope.row.marketPrice" controls-position="right" @change="((val)=>{handleChange(val, 'marketPrice', scope.row)})" :min="0" @blur="handleBlur"></el-input-number>
                    <span v-else>{{scope.row.marketPrice}}</span>
                  </div>
                  <div v-else-if="cur_clickType === 'editReadOnly'">
                    {{scope.row.marketPrice}}
                  </div>
                </div>

              </div>
              
              
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="cur_clickType === 'edit' || cur_clickType === 'editReadOnly'" prop="editPrice" label="销售价（USDT）" align="center" header-align="center" width="160">
          <template scope="scope">
            <div>
              
              <div v-if="bridgeRowData.source === 1">

                <div v-if="bridgeRowData.edited" kName='经过了二次编辑'>
                  <div v-if="cur_clickType === 'edit'">
                    <el-input-number :precision="2" v-if="(bridgeRowData.source === 2 && bridgeRowData.status === 3 && (bridgeRowData.autoUpTiming && $dayjs(bridgeRowData.autoUpTiming).unix() > parseInt(new Date().getTime()/1000))) || (bridgeRowData.source === 2 && bridgeRowData.status === 6) || (bridgeRowData.source === 1 && bridgeRowData.status === 3 && (bridgeRowData.autoUpTiming && $dayjs(bridgeRowData.autoUpTiming).unix() > parseInt(new Date().getTime()/1000)))" size="mini" class="innnerInput" v-model="scope.row.editPrice" controls-position="right" @change="((val)=>{handleChange(val, 'editPrice', scope.row)})" :min="0" @blur="handleBlur"></el-input-number>
                    <span v-else>{{scope.row.editPrice}}</span>
                  </div>
                  <div v-else-if="cur_clickType === 'editReadOnly'">
                    {{scope.row.editPrice}}
                  </div>
                </div>
                <div v-else kName='没有经过二次编辑'>
                  <div v-if="cur_clickType === 'edit'">
                  <el-input-number :precision="2" v-if="(bridgeRowData.source === 2 && bridgeRowData.status === 3 && (bridgeRowData.autoUpTiming && $dayjs(bridgeRowData.autoUpTiming).unix() > parseInt(new Date().getTime()/1000))) || (bridgeRowData.source === 2 && bridgeRowData.status === 6) || (bridgeRowData.source === 1 && bridgeRowData.status === 3 && (bridgeRowData.autoUpTiming && $dayjs(bridgeRowData.autoUpTiming).unix() > parseInt(new Date().getTime()/1000)))" size="mini" class="innnerInput" v-model="scope.row.price" controls-position="right" @change="((val)=>{handleChange(val, 'price', scope.row)})" :min="0" @blur="handleBlur"></el-input-number>
                  <span v-else>{{scope.row.price}}</span>
                </div>
                <div v-else-if="cur_clickType === 'editReadOnly'">
                  {{scope.row.price}}
                </div>
                </div>

              </div>
              <div v-else-if="bridgeRowData.source === 2">

                <div v-if="bridgeRowData.edited" kName='经过了二次编辑'>
                <div v-if="cur_clickType === 'edit'">
                  <el-input-number :precision="2" v-if="(bridgeRowData.source === 2 && bridgeRowData.status === 3 && (bridgeRowData.autoUpTiming && $dayjs(bridgeRowData.autoUpTiming).unix() > parseInt(new Date().getTime()/1000))) || (bridgeRowData.source === 2 && bridgeRowData.status === 6) || (bridgeRowData.source === 1 && bridgeRowData.status === 3 && (bridgeRowData.autoUpTiming && $dayjs(bridgeRowData.autoUpTiming).unix() > parseInt(new Date().getTime()/1000)))" size="mini" class="innnerInput" v-model="scope.row.editPrice" controls-position="right" @change="((val)=>{handleChange(val, 'editPrice', scope.row)})" :min="0" @blur="handleBlur"></el-input-number>
                  <span v-else>{{scope.row.editPrice}}</span>
                </div>
                <div v-else-if="cur_clickType === 'editReadOnly'">
                  {{scope.row.editPrice}}
                </div>
              </div>
              <div v-else kName='没有经过二次编辑'>
                <div v-if="cur_clickType === 'edit'">
                <el-input-number :precision="2" v-if="(bridgeRowData.source === 2 && bridgeRowData.status === 3 && (bridgeRowData.autoUpTiming && $dayjs(bridgeRowData.autoUpTiming).unix() > parseInt(new Date().getTime()/1000))) || (bridgeRowData.source === 2 && bridgeRowData.status === 6) || (bridgeRowData.source === 1 && bridgeRowData.status === 3 && (bridgeRowData.autoUpTiming && $dayjs(bridgeRowData.autoUpTiming).unix() > parseInt(new Date().getTime()/1000)))" size="mini" class="innnerInput" v-model="scope.row.price" controls-position="right" @change="((val)=>{handleChange(val, 'price', scope.row)})" :min="0" @blur="handleBlur"></el-input-number>
                <span v-else>{{scope.row.price}}</span>
              </div>
              <div v-else-if="cur_clickType === 'editReadOnly'">
                {{scope.row.price}}
              </div>
              </div>
              
              </div>
              
              
            </div>
          </template>
        </el-table-column>
         <el-table-column v-if="cur_clickType === 'edit' || cur_clickType === 'editReadOnly'" prop="whalePeas" label="销售价（Candy）" align="center" header-align="center" width="160">
          <template scope="scope">
            <p>{{scope.row.whalePeas}}</p>
          </template>
        </el-table-column>
        <el-table-column v-if="cur_clickType === 'edit' || cur_clickType === 'editReadOnly'" prop="stock" label="商品库存" align="center" width="160" header-align="center">
          <template scope="scope">
            <div>

              <div v-if="cur_clickType === 'edit'">
                <el-input-number :precision="0" v-if="(bridgeRowData.source === 2 && bridgeRowData.status === 3 && (bridgeRowData.autoUpTiming && $dayjs(bridgeRowData.autoUpTiming).unix() > parseInt(new Date().getTime()/1000))) || (bridgeRowData.source === 2 && bridgeRowData.status === 6) || (bridgeRowData.source === 2 && bridgeRowData.status === 3)" size="mini" class="innnerInput" v-model="scope.row.stock" controls-position="right" @change="((val)=>{handleChange(val, 'stock', scope.row)})" :min="0" @blur="handleBlur" step-strictly></el-input-number>
                <span v-else>{{scope.row.stock}}</span>
              </div>
              <div v-else-if="cur_clickType === 'editReadOnly'">
                {{scope.row.stock}}
              </div>

            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="cur_clickType === 'edit' || cur_clickType === 'editReadOnly'" prop="waring" label="库存预警值" align="center" width="160" header-align="center">
          <template scope="scope">
            <div>

              <div v-if="cur_clickType === 'edit'">
                <el-input-number :precision="0" v-if="(bridgeRowData.source === 2 && bridgeRowData.status === 3 && (bridgeRowData.autoUpTiming && $dayjs(bridgeRowData.autoUpTiming).unix() > parseInt(new Date().getTime()/1000))) || (bridgeRowData.source === 2 && bridgeRowData.status === 6) || (bridgeRowData.source === 2 && bridgeRowData.status === 3)" size="mini" class="innnerInput" v-model="scope.row.waring" controls-position="right" @change="((val)=>{handleChange(val, 'waring', scope.row)})" :min="0" @blur="handleBlur" step-strictly></el-input-number>
                <span v-else>{{scope.row.waring}}</span>
              </div>
              <div v-else-if="cur_clickType === 'editReadOnly'">
                {{scope.row.waring}}
              </div>
              
            </div>
          </template>
        </el-table-column>
        <el-table-column width="100" prop="skuNo" label="SKU编号" align="center" header-align="center">
          <template scope="scope">
            <div>

              <div v-if="cur_clickType === 'editReadOnly' || cur_clickType === 'seeDetail'">
                {{scope.row.skuNo}}
              </div>
              <div v-else-if="cur_clickType === 'edit'">
                <el-input v-if="(bridgeRowData.source === 2 && bridgeRowData.status === 3 && (bridgeRowData.autoUpTiming && $dayjs(bridgeRowData.autoUpTiming).unix() > parseInt(new Date().getTime()/1000))) || (bridgeRowData.source === 2 && bridgeRowData.status === 6)" @change="((val)=>{handleChange(val, 'skuNo', scope.row)})" v-model="scope.row.skuNo" placeholder=""></el-input>
                <span v-else>{{scope.row.skuNo}}</span>
              </div>

            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="cur_clickType === 'seeDetail'" prop="sales" label="销量" align="center" header-align="center"></el-table-column>
        <el-table-column width="100" v-if="cur_clickType === 'edit' || cur_clickType === 'editReadOnly'" prop="name" label="SKU名称" align="center" header-align="center">
          <template scope="scope">
            <div>

              <div v-if="cur_clickType === 'editReadOnly'">
                {{scope.row.name}}
              </div>
              <div v-else-if="cur_clickType === 'edit'">
                <el-input v-if="(bridgeRowData.source === 2 && bridgeRowData.status === 3 && (bridgeRowData.autoUpTiming && $dayjs(bridgeRowData.autoUpTiming).unix() > parseInt(new Date().getTime()/1000))) || (bridgeRowData.source === 2 && bridgeRowData.status === 6)" @change="((val)=>{handleChange(val, 'name', scope.row)})" v-model="scope.row.name" placeholder=""></el-input>
                <span v-else>{{scope.row.name}}</span>
              </div>

            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="cur_clickType === 'edit' || cur_clickType === 'editReadOnly'" prop="image" label="属性图片" width="80" align="center" header-align="center">
          <template scope="scope">
            <div class="goodsIMG">
              <img :src="scope.row.image" alt="">
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="clearfix" style="text-align:right;">
      <el-button v-show="cur_clickType === 'edit'" @click="handleClose" :loading="loadingSave" style="margin-top:20px;float:right;margin-left:10px;">取消</el-button>
      <el-button v-hasPermi="['goods:product_sku:edit']" v-show="skuData.length > 0 && cur_clickType === 'edit'" :loading="loadingSave" style="margin-top:20px;float:right;" type="primary" @click="saveSku">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { applySkuListQuery, applySkuListQuery2, applySkuListSave } from "@/api/goods/goodsAbout";
  export default {
    props: ['sendTochildBridgeData'],
    components: {},
    data () {
      return {
        bridgeRowData: {},
        convrtedProps: {},
        curTitleName: '编辑货品信息',
        cur_clickType: 'edit',
        curProductItemNo: '',
        loadingSave: false,
        skuSearch: '',
        loadingSku: false,
        customHeaderLabel_Name: [],
        collectObj: {},
        finallyOps: [], // 整理之后，最终提交的ops
        skuData: [],
        keywords: ''
      }
    },
    filters: {},
    watch: {
      'sendTochildBridgeData': {
        handler: function (newVal, oldVal) {
          // this.skulistQuery(1)
          this.curProductItemNo = newVal.row.itemNo
          this.collectObj = {}
          this.finallyOps = []
          this.keywords = ''
          this.bridgeRowData = JSON.parse(JSON.stringify(newVal.row))
          // 此处监听clickType：SKU全字段可编辑edit|SKU全字段只读editReadOnly|SKU销量信息只读seeDetail
          this.cur_clickType = newVal.clickType
          switch (newVal.clickType) {
            case 'edit':
              this.curTitleName = '编辑货品信息'
              break;
            case 'editReadOnly':
              this.curTitleName = '货品信息详情'
              break;
            case 'seeDetail':
              this.curTitleName = 'SKU销量信息'
              break;
          }
        },
        deep: true
      }
    },
    computed: {},
    mounted () {},
    methods: {
      skulistQuery (pgi, ifRealSales) {
        this.loadingSku = true
        if (pgi) this.pageIndex = pgi
        let _params = {
          productId: this.sendTochildBridgeData.data.id,
          currentPage: 1, // 管理后台额外加参数
          keywords: this.keywords,
          pageSize: 10000
        }
        let _apiUrl = ifRealSales === 'realSales' ? applySkuListQuery2 : applySkuListQuery
        _apiUrl(_params).then(response => {
            if (response.code === 200) {
              this.skuData = response.data.list.map((item, index, arr) => {
                let _items = {}
                let {props, ...a} = item
                _items = {
                  props,
                  ...a
                }
                // 需要提交的字段，各自存储一份原始值，进行比对
                _items.originalValStock = item.stock
                _items.originalValWaring = item.waring
                
                _items.originalValEditMarketPrice = item.editMarketPrice
                _items.originalValEditPrice = item.editPrice
                _items.originalValSupplyPrice = item.supplyPrice
                // 动态添加数组成员
                this.collectObj[item.id] = {
                  editMarketPrice: item.editMarketPrice,
                  editPrice: item.editPrice,
                  id: item.id,
                  // image: '', // 图片
                  name: item.name,
                  skuNo: item.skuNo,
                  stock: item.stock,
                  supplyPrice: item.supplyPrice,
                  waring: item.waring
                }
                this.convrtedProps[item.id] = {}
                this.customHeaderLabel_Name = []
                for (let [k, s] of Object.entries(props)) {
                  this.customHeaderLabel_Name.push(s.name)
                  // cur_itemMember[`label${k}`] = s.name
                  // cur_itemMember[`value${k}`] = s.value
                  // cur_itemMember[`image${k}`] = s.image
                  this.convrtedProps[item.id][s.name] = s.value
                }
                this.customHeaderLabel_Name = [...new Set(this.customHeaderLabel_Name)]
                return _items
              })
              this.loadingSku = false
            } else {
            this.skuData = []
            this.loadingSku = false
            this.$message.error(response.message)
          }
        })
      },
      handleCoreRunner () {},
      handleChange (value, skuType, row) {
        // 以下为：供应商后台处理逻辑
        let originalValStock,
            originalValWaring,
            originalValEditMarketPrice,
            originalValEditPrice,
            originalValSupplyPrice
        /**
         * 当直接置为空，虽然处理了通过绑定handleBlur事件校正显示为最小默认初始值，
         * 但此处此时接收到的值，并非是校正过后的值。因为不是表单form模式，而是table。
         * 所以会出现这个问题。故此处需做单独特殊兼容处理
         */
        if (typeof(value) === 'undefined') {
          originalValStock = originalValWaring = originalValEditMarketPrice = originalValEditPrice = originalValSupplyPrice = 0
        }
        // 后续如果有更改重复的项，不能重复添加，只更新这一项里面的值的变化
        this.collectObj[row.id][skuType] = value || originalValStock
        this.$forceUpdate()
      },
      onSubmit() {
        // 保存提交
        this.loadingSave = true
        let _form = {
          items: this.finallyOps,
          id: this.sendTochildBridgeData.data.id
        }
        applySkuListSave(_form).then(response => {
            if (response.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              'duration': 1000,
              onClose: () => {
                this.loadingSave = false
                this.handleClose()
                this.sendTochildBridgeData.search()
               }
             })
            } else {
            this.$message({
              type: 'error',
              message: response.message
            })
            this.loadingSave = false
            this.handleClose()
          }
        }).catch(() => {
          this.loadingSave = false
          this.handleClose()
        })
      },
      coreRunerOpsCollect () {
        return new Promise(resolve => {
          for (let [k, s] of Object.entries(this.collectObj)) {
            this.finallyOps.push(s)
          }
          resolve(this.finallyOps)
        })
      },
      async saveSku () {
        // this.$emit('emitToParentMsg', 1 + Math.random())
        await this.coreRunerOpsCollect()
        this.onSubmit()
      },
      handleClose() {
        this.sendTochildBridgeData.visible = false
      },
      handleBlur (ev) {
        if (ev.target.ariaValueNow === 'undefined') ev.target.value = ev.target.ariaValueMin
      },
    }
  }
</script>

<style lang="scss" scoped>
.skuWrapper{
  .goodsIMG{
    height: 50px;
    width: 50px;
    margin: 0 auto;
    & img{
      height: 100%;
      width: 100%;
      overflow: hidden;
      border-radius: 3px;
    }
  }
  .skuboxTop{
    padding-bottom: 20px;
    .fl.input-with-select{
      width:50%;
      margin-left: 30px;
    }
  }
}
</style>

