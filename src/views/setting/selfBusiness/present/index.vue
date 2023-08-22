<template>
  <div class="redBackDetailsBox">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="商品名字" prop="productName">
        <el-input
          v-model="queryParams.productName"
          placeholder="输入商品名字"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="货号" prop="itemNo">
        <el-input
          v-model="queryParams.itemNo"
          placeholder="输入货号"
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
        <el-button v-hasPermi="['goods:product_welfare:product_welfare_page_list']" type="primary" :loading="loading" icon="el-icon-search" @click="search(1)">查询</el-button>
        <el-button v-hasPermi="['goods:product_welfare:save']" icon="el-icon-plus" type="primary" @click="add">添加</el-button>
      </el-form-item>
    </el-form>

    <el-table
    :data="tableData"
    v-loading="loading"
    border
    style="width: 100%">
    <el-table-column
      prop="productNo"
      label="编号"
      align="center">
    </el-table-column>
    <el-table-column
      prop="productImg"
      width="200"
      label="商品图片"
      align="center">
      <template scope="scope">
        <img style="width:80px;height:80px;border-radius:6px;" :src="scope.row.productImg">
      </template>
    </el-table-column>
    <el-table-column
      prop="name"
      label="商品名称"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      prop="cateName"
      label="分类"
      align="center">
    </el-table-column>

    <el-table-column
      prop="sellerName"
      label="供应商"
      align="center">
    </el-table-column>
    <el-table-column
      label="售价/货号"
      align="center">
      <template scope="scope">
        <p>{{scope.row.salePrice}}</p>
        <p>{{scope.row.itemNo}}</p>
      </template>
    </el-table-column>
    <el-table-column
      prop="stock"
      label="库存"
      align="center">
    </el-table-column>
    <el-table-column prop="payType" align="center" label="支付类型">
          <template scope="scope">
            <p v-if="+scope.row.payType === 1">支付宝</p>
            <p v-else-if="+scope.row.payType === 2">微信</p>
            <p v-else-if="+scope.row.payType === 3">余额支付</p>
            <p v-else-if="+scope.row.payType === 4">Candy</p>
            <p v-else-if="+scope.row.payType === 5">支付宝 + Candy</p>
            <p v-else-if="+scope.row.payType === 6">微信 + Candy</p>
            <p v-else-if="+scope.row.payType === 7">余额 + Candy</p>
          </template>
        </el-table-column>
    <el-table-column
        width="70"
        header-align="center"
        align="center"
        prop="sku"
        label="SKU">
        <template scope="scope">
          <div style="text-decoration: underline;color:#1890ff;cursor:pointer;">
            <span v-hasPermi="['goods:product:sku']" @click="clickSku(scope.row, 'editReadOnly')">查看</span>
          </div>
        </template>
      </el-table-column>
    <el-table-column
      prop="welfare"
      label="福利项"
      align="center">
      <template scope="scope">
        <p v-if="+scope.row.welfare.type === 1" @click="welfareClick(scope.row)" style="text-decoration:underline;cursor:pointer;">Candy可抵扣现金</p>
        <p v-else-if="+scope.row.welfare.type === 2" @click="welfareClick(scope.row)" style="text-decoration:underline;cursor:pointer;">赠送Candy</p>
        <p v-else-if="+scope.row.welfare.type === 3" @click="welfareClick(scope.row)" style="text-decoration:underline;cursor:pointer;">赠送荣耀值</p>
        <p v-else-if="+scope.row.welfare.type === 4" @click="welfareClick(scope.row)" style="text-decoration:underline;cursor:pointer;">赠送分享值</p>
        <p v-else-if="+scope.row.welfare.type === 5" @click="welfareClick(scope.row)" style="text-decoration:underline;cursor:pointer;">赠送阅读值</p>
        <p v-else-if="+scope.row.welfare.type === 6" @click="welfareClick(scope.row)" style="text-decoration:underline;cursor:pointer;">赠送任务券</p>
      </template>
    </el-table-column>
    <!-- <el-table-column
      prop="addTime"
      label="启用时间"
      width="160"
      align="center">
      <template slot-scope="{row}">
        {{row.addTime ? $dayjs(row.addTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
    </el-table-column> -->
    <el-table-column
      prop="addTime"
      label="添加时间"
      width="160"
      align="center">
      <template slot-scope="{row}">
        {{row.addTime ? $dayjs(row.addTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
    </el-table-column>
    <el-table-column
      prop="operMemberName"
      label="添加人"
      align="center">
    </el-table-column>
    
     <el-table-column
      prop="percent"
      width="190"
      label="操作"
      align="center">
      <template scope="scope">
        <el-button size="mini" type="primary" @click="mdfClick(scope.row, 'readOnly')">查看</el-button>
        <el-button size="mini" v-hasPermi="['goods:product_welfare:update_product_welfare']" type="primary" @click="mdfClick(scope.row)">编辑</el-button>
        <el-button style="margin-top:10px;" size="mini" v-hasPermi="['goods:product_welfare:cancel_product_welfare']" type="primary" @click="cancelWelfare(scope.row)">取消所有福利项</el-button>
      </template>
    </el-table-column>


  </el-table>
  <el-pagination
  style="float:right;padding-top:20px;"
  @current-change="search"
  :page-sizes="[10, 20, 30]"
  @size-change="handleSizeChange"
  :current-page.sync="pageIndex"
  :page-size="pageSize"
  layout="total, sizes, prev, pager, next, jumper"
  :total="totalPage">
  </el-pagination>

  <!--Candy抵扣dialog-->


  <el-dialog width="30%" :title="curTitle" :visible.sync="dialogVisible">
  <el-form :model="formRow">

    <el-form-item v-if="+formRow.type === 1" :label="curTitle" :label-width="formLabelWidth">
      <el-select v-model="discoMoney" placeholder="请选择">
          <el-option
            v-for="item in discoMoneyArray"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
    </el-form-item>

    <el-form-item v-if="+formRow.type === 6" :label="curTitle" :label-width="formLabelWidth">
      <el-select v-model="myTicketsVal" placeholder="请选择">
          <el-option
            v-for="item in myTicketsArray"
            :key="item.id"
            :label="item.taskName"
            :value="item.id">
          </el-option>
        </el-select>
    </el-form-item>

    <el-form-item v-else :label="curTitle" :label-width="formLabelWidth">
      <el-input-number v-if="+formRow.type === 4 || +formRow.type === 5" placeholder="" :precision="2" v-model="formRow.num" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, formRow.type)})" :min="0.000001"></el-input-number>
      <el-input-number v-else placeholder="" :precision="6" v-model="formRow.num" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, formRow.type)})" :min="0.000001"></el-input-number>
      <i style="padding-left:5px;">个</i>
    </el-form-item>

  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button v-hasPermi="['goods:product_welfare:update_product_welfare']" :loading="loadingSave" type="primary" @click="save">确 定</el-button>
  </div>
</el-dialog>

  <!--SKU-->
  <sku ref="skuComp" :sendTochildBridgeData="parentHavenRowData" @emitToParentMsg="copyMsgFromChild" />


  </div>
</template>

<script>
import { welfareQueryList, whalePeanSetQueryList, cancelProductWelfare, productWelfareEditSave } from "@/api/presents";
import { goodsListQuery, gdCategoryTreeList, gdBrandsSelectMap, gdProductRecoList, gdsSupplierList, applyAuditDetails, applyGoodsStatistics, goodsStatus, goodsUp, goodsDown, editBaseSell } from "@/api/goods/goodsAbout";
import sku from '../../../goods/manage/sku.vue'
import {pageGoods} from '@/api/om/task';
  export default {
    components: {
      sku
    },
    data () {
      var validatePhone = (rule, value, callback) => {
        if (!(/^1[3456789]\d{9}$/.test(value)) && value !== '') {
          return callback(new Error('请输入正确的手机号码'))
        }
        callback()
      }
      return {
        myTicketsVal: '',
        myTicketsArray: [],
        parentHavenRowData: {},
        loadingSave: false,
        formLabelWidth: '120px',
        formRow: {},
        curTitle: '',
        dialogVisible: false,
        discoMoneyArray: [],
        discoMoney: '',
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        loading: false,
        tableData: [],
        cacheGDCategory: {
          'cachedCategory': null
        },
        supplyArr: [],
        introduceTagArr: [],
        gdBrandsArr: [],
        gdCategoryTreeArr: [],
        queryParams: {
          itemNo: '',
          productName: '',
          categoryId: '',
          brandId: '',
          recommend: '',
          supplierId: '',
          source: ''
        },
        submitCategoryId: '',
        sourceArr: [
          // {label: '全部', value: -1},
          {label: '本平台自营', value: 2}
        ]
      }
    },
    filters: {},
    async created () {
      let awContainer = [this.gdCategoryTreeArrRun(), this.gdBrandsSelectMapRun(), this.gdProductRecoListRun(), this.gdsSupplierListRun()]
      let receiverContainer = []
      for await (let s of awContainer) {
        receiverContainer.push(s)
      }
      this.gdCategoryTreeArr = receiverContainer[0]
      this.gdBrandsArr = receiverContainer[1]
      this.introduceTagArr = receiverContainer[2]
      this.supplyArr = receiverContainer[3]
    },
    mounted () {
      this.search(1)
      this.whalePeanSetQueryListRun()
      this.pageGlobalRequest()
    },
    watch: {},
    methods: {
      // 商品赠送任务券下拉数据
      async pageGlobalRequest () {
        const rqData = {
          currentPage: 1,
          pageSize: 999,
          statusType: 1, // 启用
        }
        // const {code, message, data: {list, pageSize, total}} = await pageGlobal(rqData);
        const {code, message, data: {list}} = await pageGoods(rqData);
        if (code == 200) {
          this.myTicketsArray = list
        } else {
          this.myTicketsArray = []
          this.$message.error(message)
        }
      },
      copyMsgFromChild (val) {
        console.log(val, 'val')
      },
      async clickSku (row, clickType) {
        // pass the data for the current row to the child-component when each click
        await this.asyncHandle(row, clickType)
        this.$refs.skuComp.skulistQuery(1)
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
      save () {
        const _routeParams = this.$route.query
        let _url = productWelfareEditSave
        // 保存提交
        let _form = {
          productId: this.formRow.id,
          welfare: {
            type: this.formRow.type,
            num: +this.formRow.num,
            settingId: this.formRow.settingId || ''
          }
        }
        if (+this.formRow.type !== 1 && +this.formRow.type !== 6) {
          Reflect.deleteProperty(_form.welfare, 'settingId')
        } else {
          if (+this.formRow.type === 1) {
            _form.welfare.settingId = this.discoMoney
            _form.welfare.num = +(this.discoMoneyArray.find(val => +val.value === +this.discoMoney).label).replace('USDT', '')
          } else if (+this.formRow.type === 6){
            _form.welfare.settingId = this.myTicketsVal
            _form.welfare.num = 1
          }
        }
        this.loadingSave = true
        _url(_form).then(response => {
            if (response.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              'duration': 1000,
              onClose: () => {
                this.search(1)
               }
             })
            } else {
            this.$message({
              type: 'error',
              message: response.message
            })
          }
          this.loadingSave = this.dialogVisible = false
        }).catch(() => {
          this.loadingSave = this.dialogVisible = false
        })
      },
      whalePeanSetQueryListRun () {
        whalePeanSetQueryList().then(response => {
          if (response.code === 200) {
            this.discoMoneyArray = (response.data.list || []).map(val => {
              let {deductionWorth, id} = val
              return {
                value: id,
                label: deductionWorth + 'USDT'
              }
            })
          } else {
            this.discoMoneyArray = []
            this.$message.error(response.message)
          }
        })
      },
      handleChange(value) {
        this.$forceUpdate()
      },
      handleBlur (ev, type) {
        // blur后若输入内容为空，处理为显示对应特权类型的最小默认值
        if (ev.target.ariaValueNow === 'undefined') { 
          ev.target.value = ev.target.ariaValueMin
          this.formRow.num = ev.target.ariaValueMin
        }
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
      handleChangeCascader (value) {
        this.submitCategoryId = [...value].pop()
      },
      welfareClick (row) {
        this.dialogVisible = true
        this.formRow = Object.assign({ id: row.id }, row.welfare)
        this.discoMoney = this.formRow.settingId || ''
        this.myTicketsVal = this.formRow.settingId || ''
        switch(+row.welfare.type){
          case 1 :
            this.curTitle = 'Candy可抵扣现金'
            break;
          case 2 :
            this.curTitle = '赠送Candy'
            break;
          case 3 :
            this.curTitle = '赠送荣耀值'
            break;
          case 4 :
            this.curTitle = '赠送分享值'
            break;
          case 5 :
            this.curTitle = '赠送阅读值'
            break;
          case 6 :
            this.curTitle = '赠送任务券'
            break;
        }
      },
      mdfClick (row, readOnly) {
        this.$router.push({ path: "/setting/selfBusinessProfitSet", query: {type: 'edit', id: row.id, welfare: JSON.stringify(row.welfare), readOnly}})
      },
      cancelWelfare (row) {
        this.$confirm(`确认要执行此操作吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.cancelWelfareRunner(row.id)
        }).catch(() => {})
      },
      cancelWelfareRunner (id) {
        cancelProductWelfare({
          productId: id
        }).then(response => {
          if (response.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              'duration': 1000,
              onClose: () => {
                this.search(1)
              }
            })
          } else {
            this.$message.error(response.message)
          }
        }).catch(e => {})
      },
      add () {
        this.$router.push({ path: "/setting/selfBusinessProfitSet", query: {type: 'add'}})
      },
      search (pgi) {
        this.$refs['queryForm'].validate((valid) => {
          if (valid) {
            if (pgi) this.pageIndex = pgi
            let _params = {
              brandId: this.queryParams.brandId || null,
              cateId: this.submitCategoryId || null,
              currentPage: this.pageIndex,
              itemNo: this.queryParams.itemNo || null,
              pageSize: this.pageSize,
              source: this.queryParams.source || null,
              productName: this.queryParams.productName || null,
              recommend: this.queryParams.recommend || null,
              sellerId: this.queryParams.supplierId === -1 ? null : (this.queryParams.supplierId || null)
            }
            this.loading = true
            welfareQueryList(_params).then(response => {
              if (response.code === 200) {
                this.tableData = response.data.list
                this.totalPage = response.data.total
                this.loading = false
              } else {
                this.tableData = []
                this.totalPage = 0
                this.pageSize = 10
                this.loading = false
                this.$message.error(response.message)
              }
            }).catch(e => {
              this.loading = false
            })
          }
        })
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.search()
      }
    }
  }
</script>

<style lang="scss">
.redBackDetailsBox{
  padding: 20px;
}
</style>
