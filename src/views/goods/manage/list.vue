<template>
  <div class="goodsListWrapper">
    <div class="goodslistTopper clearfix">

      <el-radio-group v-model="tabPosition" style="margin-bottom: 10px;" @change="SelectedChange">
        <el-radio-button v-for="(item, key) in gdStatistics" :key="key" :label="item.status">{{item.label}}({{item.value}})</el-radio-button>
      </el-radio-group>

    </div>
    <el-form :model="queryParams" ref="queryForm" :inline="true" style="padding-top:20px;">
      <el-form-item label="输入搜索：" prop="keywords">
        <el-input
          v-model="queryParams.keywords"
          placeholder="输入商品名称/货号"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>

      <el-form-item label="商品分类：" prop="categoryId">
        <el-cascader @change="handleChangeCascader" v-model="queryParams.categoryId" clearable :options="gdCategoryTreeArr" :show-all-levels="false"></el-cascader>
      </el-form-item>

      <el-form-item label="商品品牌：" prop="brandId">
        <el-select v-model="queryParams.brandId" placeholder="" clearable>
          <el-option
            v-for="item in gdBrandsArr"
            :key="item.brandId"
            :label="item.brandName"
            :value="item.brandId">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="推荐标签：" prop="recommend">
        <el-select v-model="queryParams.recommend" placeholder="" clearable>
          <el-option
            v-for="item in introduceTagArr"
            :key="item.id"
            :label="item.desc"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="供应商：" prop="supplierId">
        <el-select v-model="queryParams.supplierId" placeholder="" clearable>
          <el-option label="筛选供应商" :value="-1"></el-option>
          <el-option
            v-for="item in supplyArr"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="自营：" prop="source">
        <el-select v-model="queryParams.source" placeholder="" clearable>
          <el-option
            v-for="item in sourceArr"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>


      <el-form-item>
        <el-button v-hasPermi="['goods:product:list']" type="primary" :loading="loading" icon="el-icon-search" @click="search(1)">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- table-->
    <el-table highlight-current-row
      border
      v-loading="loading"
      :data="tableData"
      @header-click="formatSortHeader"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
      style="width: 100%"
      >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="itemNo"
        label="编号">
        <template scope="scope">
          <div>{{scope.row.itemNo}}</div>
        </template>
      </el-table-column>
      <el-table-column
        width="100"
        header-align="center"
        align="center"
        prop="primaryImage"
        label="商品图片">
        <template scope="scope">
          <div class="goodsIMG">
            <img :src="scope.row.primaryImage" alt="">
          </div>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        show-overflow-tooltip
        prop="name"
        label="商品名称">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="分类">
        <template scope="scope">
          <p>{{scope.row.matchTypeName}}</p>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="sellerName"
        label="供应商">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="brandName"
        label="商品品牌">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="140"
        prop="itemNo"
        label="货号">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        sortable="custom"
        prop="stock"
        label="库存">
      </el-table-column>
      <el-table-column
        width="120"
        header-align="center"
        align="center"
        prop="comment"
        label="评论">
      </el-table-column>
      <el-table-column
        width="100"
        header-align="center"
        sortable="custom"
        align="center"
        prop="virSales"
        label="基础销量">
        <template scope="scope">
          <span v-if="isAuth.isPermi(['goods:product_vir_sales:edit'])" @click="clickBaseSell(scope.row)" style="text-decoration: underline;color:#1890ff;cursor:pointer;">{{scope.row.virSales}}</span>
          <span v-else>{{scope.row.virSales}}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="70"
        header-align="center"
        align="center"
        prop="sku"
        label="SKU">
        <template scope="scope">
          <div v-if="+scope.row.source === 1" style="text-decoration: underline;color:#1890ff;cursor:pointer;">
            <span v-hasPermi="['goods:product:sku']" v-if="+scope.row.status === 3 && (scope.row.autoUpTiming && $dayjs(scope.row.autoUpTiming).unix() > parseInt(new Date().getTime()/1000))" @click="clickSku(scope.row, 'edit')">编辑</span>
            <span v-hasPermi="['goods:product:sku']" v-else @click="clickSku(scope.row, 'editReadOnly')">查看</span>
          </div>
          <div v-else-if="+scope.row.source === 2" style="text-decoration: underline;color:#1890ff;cursor:pointer;">
            <span v-hasPermi="['goods:product:sku']" v-if="scope.row.status === 3 || scope.row.status === 6 || (scope.row.status === 3 && (scope.row.autoUpTiming && $dayjs(scope.row.autoUpTiming).unix() > parseInt(new Date().getTime()/1000)))" @click="clickSku(scope.row, 'edit')">编辑</span>
            <span v-hasPermi="['goods:product:sku']" v-else @click="clickSku(scope.row, 'editReadOnly')">查看</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="100"
        sortable="custom"
        prop="actualSales"
        label="真实销量">
        <template scope="scope">
          <span v-if="isAuth.isPermi(['goods:product:sku'])" @click="clickSku(scope.row, 'seeDetail')" style="text-decoration: underline;color:#1890ff;cursor:pointer;">{{scope.row.actualSales}}</span>
          <span v-else>{{scope.row.actualSales}}</span>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="150"
        prop="status"
        label="审核状态">
        <template scope="scope">
          <div>

            <div v-if="scope.row.source === 1">
              <span v-if="scope.row.status === 3 && (scope.row.autoUpTiming && $dayjs(scope.row.autoUpTiming).unix() > parseInt(new Date().getTime()/1000))">已审核未到上架时间</span>
              <span v-else-if="scope.row.status === 3 || scope.row.status === 6">已审核</span>
              <span v-else-if="scope.row.status === 2">上架待审核</span>
              <span v-else-if="scope.row.status === 4">下架待审核</span>
              <span v-else>{{scope.row.status|status(that)}}</span>
              <div v-hasPermi="['goods:audited_product:history']" @click="suthStatusClick(scope.row)" style="text-decoration: underline;color:#1890ff;cursor:pointer;">审核详情</div>
            </div>
            <div v-else-if="scope.row.source === 2">
              <span v-if="scope.row.status === 3 && (scope.row.autoUpTiming && $dayjs(scope.row.autoUpTiming).unix() > parseInt(new Date().getTime()/1000))">已审核未到上架时间</span>
              <span v-else-if="scope.row.status === 3 || scope.row.status === 6">已审核</span>
              <span v-else>{{scope.row.status|status(that)}}</span>
              <!-- <div v-hasPermi="['goods:audited_product:history']" @click="suthStatusClick(scope.row)" style="text-decoration: underline;color:#1890ff;cursor:pointer;">审核详情</div> -->
            </div>

          </div>
        </template>
      </el-table-column>
      <el-table-column
        width="160"
        header-align="center"
        sortable="custom"
        align="center"
        prop="firstUpAt"
        label=" 首次正式上架时间">
        <template slot-scope="{row}">
          {{row.firstUpAt ? $dayjs(row.firstUpAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="160"
        label="操作">
        <template scope="scope">

          <div v-if="+scope.row.source === 1">
            <div v-if="scope.row.status === 3 && (scope.row.autoUpTiming && $dayjs(scope.row.autoUpTiming).unix() > parseInt(new Date().getTime()/1000))">
              <!-- <el-button type="primary" size="mini" @click="checkOutClick(scope.row.id, 'query')">查看</el-button> -->
              <!-- <el-button type="primary" size="mini" @click="editClick(scope.row.id, 'edit')">编辑</el-button><br> -->
              <el-button type="primary" size="mini" @click="previewClick(scope.row, 'newPage')" style="margin-top:10px;">预览</el-button>
            </div>
            <div v-else-if="scope.row.status === 3">
              <!-- <el-button type="primary" size="mini" @click="checkOutClick(scope.row.id, 'query')">查看</el-button> -->
              <el-button type="primary" size="mini" @click="previewClick(scope.row, 'newPage')">预览</el-button><br>
              <el-button type="primary" size="mini" @click="goodsUpDown('down', scope.row)" style="margin-top:10px;" v-hasPermi="['goods:product:down']">下架</el-button>
            </div>
            <div v-else-if="scope.row.status === 6">
              <!-- <el-button type="primary" size="mini" @click="checkOutClick(scope.row.id, 'query')">查看</el-button> -->
              <el-button type="primary" size="mini" @click="previewClick(scope.row, 'newPage')">预览</el-button>
            </div>
            <div v-else-if="scope.row.status === 4">
              <!-- <el-button type="primary" size="mini" @click="checkOutClick(scope.row.id, 'query')">查看</el-button> -->
              <el-button type="primary" size="mini" @click="previewClick(scope.row, 'newPage')">预览</el-button>
            </div>
            <div v-else-if="scope.row.status === 2">
              <!-- <el-button type="primary" size="mini" @click="checkOutClick(scope.row.id, 'query')">查看</el-button> -->
              <el-button type="primary" size="mini" @click="previewClick(scope.row, 'newPage')">预览</el-button>
            </div>
            <div v-else-if="scope.row.status === 5">
              <!-- <el-button type="primary" size="mini" @click="checkOutClick(scope.row.id, 'query')">查看</el-button> -->
              <el-button type="primary" size="mini" @click="previewClick(scope.row, 'newPage')" style="margin-top:10px;">预览</el-button>
            </div>
          </div>
          <div v-else-if="+scope.row.source === 2">
            <div v-if="scope.row.status === 6">
              <el-button type="primary" size="mini" @click="checkOutClick(scope.row.id, 'query')">查看</el-button>
              <el-button type="primary" size="mini" @click="editClick(scope.row.id, 'edit')">编辑</el-button><br>
              <el-button type="primary" size="mini" @click="previewClick(scope.row, 'newPage')" style="margin-top:10px;">预览</el-button>

              <el-button v-show="!(scope.row.status === 3 && (scope.row.autoUpTiming && $dayjs(scope.row.autoUpTiming).unix() > parseInt(new Date().getTime()/1000)))" type="primary" size="mini" @click="goodsUpDown('up', scope.row)" v-hasPermi="['goods:product:up']">上架</el-button>
              

            </div>
            <div v-else-if="scope.row.status === 5">
              <el-button type="primary" size="mini" @click="checkOutClick(scope.row.id, 'query')">查看</el-button>
              <el-button type="primary" size="mini" @click="previewClick(scope.row, 'newPage')" style="margin-top:10px;">预览</el-button>
            </div>
            <div v-else-if="scope.row.status === 3 && (scope.row.autoUpTiming && $dayjs(scope.row.autoUpTiming).unix() > parseInt(new Date().getTime()/1000))">
              <el-button type="primary" size="mini" @click="checkOutClick(scope.row.id, 'query')">查看</el-button>
              <el-button type="primary" size="mini" @click="editClick(scope.row.id, 'edit')">编辑</el-button><br>
              <el-button type="primary" size="mini" @click="previewClick(scope.row, 'newPage')" style="margin-top:10px;">预览</el-button>
              
              
            <el-button v-show="!(scope.row.status === 3 && (scope.row.autoUpTiming && $dayjs(scope.row.autoUpTiming).unix() > parseInt(new Date().getTime()/1000)))" type="primary" size="mini" @click="goodsUpDown('up', scope.row)" v-hasPermi="['goods:product:up']">上架</el-button>
              
            </div>
            <div v-else-if="scope.row.status === 3">
              <el-button type="primary" size="mini" @click="checkOutClick(scope.row.id, 'query')">查看</el-button>
              <el-button type="primary" size="mini" @click="previewClick(scope.row, 'newPage')">预览</el-button><br>
              <el-button type="primary" size="mini" @click="goodsUpDown('down', scope.row)" style="margin-top:10px;" v-hasPermi="['goods:product:down']">下架</el-button>
            </div>
          </div>

        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top:10px;"
      @current-change="search"
      :page-sizes="[10, 20, 30]"
      @size-change="handleSizeChange"
      :current-page.sync="pageIndex"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage">
    </el-pagination>


    <!--SKU-->
    <sku ref="skuComp" :sendTochildBridgeData="parentHavenRowData" @emitToParentMsg="copyMsgFromChild" />

    <!--审核详情-->
    <el-dialog width="39%" title="审核详情" :visible.sync="auditDetDataVisible">
      <el-table :data="auditDetailData" border>
        <el-table-column width="160" header-align="center" align="center" property="auditTime" label="审核时间">
            <template slot-scope="{row}">
            {{row.auditTime ? $dayjs(row.auditTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" property="auditBy" label="审核人员"></el-table-column>
        <el-table-column header-align="center" align="center" property="result" label="审核结果"></el-table-column>
        <el-table-column header-align="center" align="center" property="remark" label="反馈详情"></el-table-column>
      </el-table>
    </el-dialog>

    <!--商品预览-->
    <el-dialog
    title="商品预览"
    custom-class="previewStyle"
    :visible.sync="dialogVisiblePreview"
    width="85%">
    
    <iframe :src="previewSrc" id="previewBox" style="height:800px;border:1px solid #ccc;border-radius:3px;"></iframe>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisiblePreview = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisiblePreview = false">确 定</el-button>
    </span>
  </el-dialog>

  <!--基础销量编辑-->
  <el-dialog width="35%" title="基础销量" :visible.sync="dialogFormVisibleBase">
  <el-form :model="baseform">
    <el-form-item label="设置基础销量：" :label-width="formLabelWidth">
      <el-input-number v-model="baseform.virSales" :min="0" controls-position="right" :step="1" step-strictly></el-input-number>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleBase = false">取 消</el-button>
    <el-button type="primary" :loading="baseLoading" @click="clickBaseSellSave">确 定</el-button>
  </div>
</el-dialog>

  </div>
</template>

<script>
import { goodsListQuery, gdCategoryTreeList, gdBrandsSelectMap, gdProductRecoList, gdsSupplierList, applyAuditDetails, applyGoodsStatistics, goodsStatus, goodsUp, goodsDown, editBaseSell } from "@/api/goods/goodsAbout";
import sku from './sku'
export default {
  components: {
    sku
  },
  data() {
    return {
      baseLoading: false,
      baseRowData: {},
      dialogFormVisibleBase: false,
      formLabelWidth: '120px',
      baseform: {
        virSales: 0
      },
      previewSrc: '',
      dialogVisiblePreview: false,
      tabPosition: 'left',
      gdStatistics: [],
      submitCategoryId: '',
      gdCategoryTreeArr: [],
      sourceArr: [
        // {label: '全部', value: -1},
        {label: '本平台自营', value: 2}
      ],
      gdBrandsArr: [],
      parentHavenRowData: {},
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      queryParams: {
        keywords: '',
        categoryId: '',
        brandId: '',
        recommend: '',
        supplierId: '',
        source: '',
        status: 0 // 默认查全部
      },
      auditDetDataVisible: false,
      auditDetailData: [],
      tableData: [],
      loading: false,
      introduceTagArr: [],
      supplyArr: [],
      cacheGDCategory: {
        'cachedCategory': null
      },
      goodsStatusObj: {},
      that: this
    }
  },
  computed: {},
  async created () {
    let awContainer = [this.gdCategoryTreeArrRun(), this.gdBrandsSelectMapRun(), this.gdProductRecoListRun(), this.gdsSupplierListRun(), this.applyGoodsStatisticsRun(), this.goodsStatusRun()]
    let receiverContainer = []
    for await (let s of awContainer) {
      receiverContainer.push(s)
    }
    this.gdCategoryTreeArr = receiverContainer[0]
    this.gdBrandsArr = receiverContainer[1]
    this.introduceTagArr = receiverContainer[2]
    this.supplyArr = receiverContainer[3]
    this.gdStatistics = receiverContainer[4]
    this.goodsStatusObj = receiverContainer[5]
  },
  mounted () {
    this.submitCategoryId = this.queryParams.categoryId = +this.$route.query.categoryId
    this.search()
    // var str = '2021-06-27T00:00:00.000+08:00'
    // Unix 时间戳 (秒) dayjs().unix()|当前系统时间戳(秒)parseInt(new Date().getTime()/1000)
    // console.log(this.$dayjs(str).unix(), '时间戳 (秒)')
  },
  filters: {
    status (val, that) {
      return that.goodsStatusObj[val]
    }
  },
  methods: {
    clickBaseSellSave () {
      this.baseLoading = true
      const _params = {
        id: this.baseRowData.id,
        virSales: this.baseform.virSales
      }
      editBaseSell(_params).then(response => {
        if (response.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success',
            'duration': 1000,
            onClose: async () => {
              this.dialogFormVisibleBase = false
              this.baseLoading = false
              this.search()
            }
          })
        } else {
          this.dialogFormVisibleBase = false
          this.baseLoading = false
          this.$message.error(response.message)
        }
      })
    },
    // 基础销量编辑
    clickBaseSell (row) {
      this.dialogFormVisibleBase = true
      this.baseform.virSales = row.virSales || 0
      this.baseRowData = Object.assign({}, row)
    },
    // 查询商品的状态
    goodsStatusRun () {
      return new Promise((resolve, reject) => {
        goodsStatus().then(response => {
          if (response.code === 200) {
            let _json = {}
            for (let [k, s] of Object.entries(response.data.list || [])) {
              _json[s['code']] = s['desc']
            }
            resolve(_json)
          } else {
            resolve({})
            this.$message.error(response.message)
          }
        })
      })
    },
    checkOutClick (id, type) {
      this.$router.push({ path: "checkoutGoods", query: { id, type}})
    },
    editClick (id, type) {
      this.$router.push({ path: "editGoods", query: { id, type}})
    },
    handleSHowPreview (row) {
      return new Promise(resolve => {
        this.dialogVisiblePreview = true
        this.previewSrc = row.description
        resolve(row.description)
      })
    },
    async previewClick (row, type) {
      // 预览：type='newPage'为新开一个页面模式
      if (type) {
        this.$store.dispatch('setPreview', row)
        this.$router.push({ path: "/goods/previewing"})
      } else {
        let _res = await this.handleSHowPreview(row)
        let _oifream = document.getElementById('previewBox').contentWindow
      }
    },
    goodsUpDown_runner (type, row) {
      let _params = {
        id: row.id
      }
      const _api = type === 'up' ? goodsUp : goodsDown
      _api(_params).then(response => {
        if (response.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success',
            'duration': 1000,
            onClose: async () => {
              this.search()
              this.gdStatistics = await this.applyGoodsStatisticsRun() // 上架下架后，更新统计状态
            }
          })
        } else {
          this.$message.error(response.message)
        }
      })
    },
    // 商品上架、下架
    goodsUpDown (type, row) {
      let _desc = type === 'up' ? '确定要上架此商品吗？' : '确定要下架此商品吗？'
      this.$confirm(_desc, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.goodsUpDown_runner(type, row)
      }).catch(() => {})
    },
    sortChange ({column, prop, order}) {
      let _blooean
      switch(prop)
      {
        case 'stock': // 库存
          _blooean = order === 'ascending' ? 1 : 2
          this.queryParams.sort = _blooean
          break;
        case 'virSales': // 基础销量
          _blooean = order === 'ascending' ? 3 : 4
          this.queryParams.sort = _blooean
          break;
        case 'actualSales': // 真实销量
          _blooean = order === 'ascending' ? 5 : 6
          this.queryParams.sort = _blooean
          break;
        case 'firstUpAt': // 首次正式上架时间
          _blooean = order === 'ascending' ? 7 : 8
          this.queryParams.sort = _blooean
          break;
      }
      this.search()
    },
    formatSortHeader (column, event) {
      // watch event in the table header
      // if (column.property === 'lastLoginAt') {
      //   let x = this.clickCountTimelog % 2
      //   this.queryParams.sort = x === 0 ? 4 : 3
      // }
      // this.clickCountTimelog++
    },
    suthStatusClick (row) {
      this.applyAuditDetailsRun(row.id)
    },
    applyAuditDetailsRun (id) {
      applyAuditDetails({
        id
      }).then(response => {
          this.auditDetDataVisible = true
          if (response.code === 200) {
            this.auditDetailData = response.data.list
          } else {
            this.auditDetailData = []
            this.$message.error(response.message)
        }
      })
    },
    handleChangeCascader (value) {
      this.submitCategoryId = [...value].pop()
    },
    clickUpSale (row) {

    },
    recursionMapData (arr) {
      // if arr is:an array.
      if (Array.isArray(arr)) {
        if (!arr || !arr.length) return arr
        return arr.map(item => {
          let {categoryId, categoryName, child, ...a} = item
          return {
            value: categoryId,
            label: categoryName,
            children: child.length === 0 ? null : child.map(this.recursionMapData),
            ...a
          }
        })
      } else {
        // if arr is:child->map loop，here is child‘s each item，it is json object.
        let {categoryId, categoryName, child, ...a} = arr
        return {
          value: categoryId,
          label: categoryName,
          children: child.length === 0 ? null : child.map(this.recursionMapData),
          ...a
        }
      }
    },
    // 获取商品分类
    gdCategoryTreeArrRun () {
      return new Promise((resolve, reject) => {
        gdCategoryTreeList().then(response => {
            if (response.code === 200) {
              this.cacheGDCategory = {
                'cachedCategory': response.data.list || []
              }
              resolve(this.recursionMapData(response.data.list))
            } else {
              this.gdCategoryTreeArr = []
              resolve([])
              this.$message.error(response.message)
          }
        })
      })
    },
    // 获取商品品牌
    gdBrandsSelectMapRun () {
      return new Promise(resolve => {
        gdBrandsSelectMap().then(response => {
          if (response.code === 200) {
            resolve(response.data.list)
          } else {
            this.gdBrandsArr = []
            resolve([])
            this.$message.error(response.message)
          }
        })
      })
    },
    // 获取推荐标签
    gdProductRecoListRun () {
      return new Promise((resolve, reject) => {
        gdProductRecoList().then(response => {
            if (response.code === 200) {
              resolve(response.data.list)
            } else {
              this.introduceTagArr = []
              resolve([])
              this.$message.error(response.message)
          }
        })
      })
    },
    // 获取供应商
    gdsSupplierListRun () {
      return new Promise((resolve, reject) => {
        gdsSupplierList().then(response => {
            if (response.code === 200) {
              resolve(response.data.list.map(val => {
                let {id, name} = val
                return {
                  label: name,
                  value: id
                }
              }))
            } else {
              this.supplyArr = []
              resolve([])
              this.$message.error(response.message)
          }
        })
      })
    },
    applyGoodsStatisticsRun () {
      return new Promise((resolve, reject) => {
        applyGoodsStatistics().then(response => {
          if (response.code === 200) {
            resolve(response.data.list.map((val, index, arr) => {
              let {count, name, ...a} = val
              return {
                value: count,
                label: name,
                ...a
              }
            }))
          } else {
              this.gdStatistics = []
              resolve([])
              this.$message.error(response.message)
          }
        })
      })
    },
    matchTypesNameByID (idBody, arr) {
      let _resParent = arr.find(val => val.value === idBody.firstCategoryId)
      let _resChild = _resParent && _resParent.children && _resParent.children.find(val => val.value === idBody.secondCategoryId)
      return _resChild ? _resChild.label : (_resParent ? _resParent.label : '-') // 优先查找二级分类，若二级分类不存在，则向上查找一级分类
    },
    search (pgi) {
      if (pgi) this.pageIndex = pgi
      let _params = {
        brandId: this.queryParams.brandId || null,
        categoryId: this.submitCategoryId || null,
        currentPage: this.pageIndex,
        keywords: this.queryParams.keywords || null,
        pageSize: this.pageSize,
        recommend: this.queryParams.recommend,
        source: this.queryParams.source,
        supplierId: this.queryParams.supplierId,
        sort: this.queryParams.sort,
        status: this.queryParams.status
      }
      this.loading = true
      goodsListQuery(_params).then(async response => {
          if (response.code === 200) {
          this.tableData = []
            for (let [k, s] of Object.entries(response.data.list)) {
              let {brandId, ...a} = s
              let cur_typeNameID = {firstCategoryId: s.firstCategoryId, secondCategoryId: s.secondCategoryId}
              let matchTypeName
              {
                if (this.gdCategoryTreeArr.length > 0) {
                  matchTypeName = this.matchTypesNameByID(cur_typeNameID, this.gdCategoryTreeArr)
                } else if (this.cacheGDCategory['cachedCategory'] === null) {
                  let _resArr = await this.gdCategoryTreeArrRun()
                  matchTypeName = this.matchTypesNameByID(cur_typeNameID, _resArr)
                }
              }
              this.tableData.push({
                brandId,
                ...a,
                matchTypeName
              })
            }

          this.totalPage = response.data.total
          this.loading = false
          } else {
          this.tableData = []
          this.totalPage = 0
          this.pageSize = 10
          this.loading = false
          this.$message.error(response.message)
        }
      }).catch((e) => {
        this.loading = false
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.search()
    },
    handleSelectionChange (val) {
      console.log(val, 'val')
    },
    copyMsgFromChild (val) {
      console.log(val, 'val')
    },
    asyncHandle (row, clickType) {
      return new Promise(resolve => {
        this.parentHavenRowData = {
          visible: true,
          clickType,
          search: this.search,
          data: {
            id: row.id
          },
          row
        }
        resolve(this.parentHavenRowData)
      })
    },
    async clickSku (row, clickType) {
      // pass the data for the current row to the child-component when each click
      await this.asyncHandle(row, clickType)
      if (clickType === 'seeDetail') {
        this.$refs.skuComp.skulistQuery(1, 'realSales')
      } else {
        this.$refs.skuComp.skulistQuery(1)
      }
    },
    SelectedChange (val) {
      this.queryParams.status = val
      this.search(1)
    }
  }
};
</script>
<style lang="scss" scoped>
.goodsListWrapper {
  padding: 20px;
  .previewStyle{
    iframe{
      width:100%;
      height: auto;
      overflow: auto;
    }
  }
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
  .goodslistTopper{
    margin:0!important;
    padding:0!important;
    li {
      padding: 6px;
      border: 1px solid #ccc;
      color: #333;
      font-size: 13px;
      float: left;
      margin-right: 10px;
      border-radius:3px;
    }
    li.cur{
      background: #1890ff;
      color: #fff;
      border: 1px solid #1890ff;
    }
  }
}
</style>
