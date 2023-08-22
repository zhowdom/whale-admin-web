<template>
  <div class="prizesAwardBox" style="padding: 20px;">
    <el-form :model="queryParams" :rules="rules" ref="queryForm" :inline="true">
      <el-form-item label="中奖人姓名" prop="memberName">
        <el-input
          v-model="queryParams.memberName"
          placeholder="输入中奖人姓名"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="输入手机号"
          clearable
          maxlength="11"
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="期数" prop="winDate">
        <el-input
          v-model="queryParams.winDate"
          placeholder="输入期数"
          clearable
          maxlength="11"
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="中奖码" prop="winCode">
        <el-input
          v-model="queryParams.winCode"
          placeholder="输入中奖码"
          clearable
          maxlength="40"
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="添加收获信息" prop="addAddressType">
        <el-select clearable v-model="queryParams.addAddressType" placeholder="请选择">
          <el-option
            label="全部"
            value="">
          </el-option>
          <el-option
            label="已添加"
            :value="1">
          </el-option>
          <el-option
            label="未添加"
            :value="0">
          </el-option>

        </el-select>
    </el-form-item>
      <el-form-item label="发货状态" prop="deliverType">
        <el-select clearable v-model="queryParams.deliverType" placeholder="请选择">
          <el-option
            label="全部"
            value="">
          </el-option>
          <el-option
            label="已发货"
            :value="1">
          </el-option>
          <el-option
            label="未发货"
            :value="0">
          </el-option>

        </el-select>
    </el-form-item>
      <el-form-item label="更新时间" prop="redbacktime">
        <el-date-picker
          v-model="queryParams.redbacktime"
          type="daterange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>





      <el-form-item>
        <el-button v-hasPermi="['game:prizeDistribution:listByPage']" type="primary" :loading="loading" icon="el-icon-search" @click="search(1)">查询</el-button>
        <el-button v-hasPermi="['game:prizeDistribution:exportExcel']" type="primary" :loading="loading" icon="el-icon-download" @click="exportClick">导出</el-button>
      </el-form-item>
    </el-form>

    <el-table
    :data="tableData"
    @sort-change="sortChange"
    v-loading="loading"
    border
    style="width: 100%">
    <el-table-column
      prop="prizeNo"
      label="奖品订单号"
      align="center">
    </el-table-column>
    <el-table-column
      prop="prizeSource"
      label="奖品来源"
      align="center">
      <template scope="scope">
        <p v-if="+scope.row.prizeSource === 1">Candy夺宝</p>
        <p v-else>{{scope.row.prizeSource}}</p>
      </template>
    </el-table-column>
    <el-table-column
      prop="winDate"
      label="期数"
      width="120"
      align="center">
      <template slot-scope="{row}">
        <p @click="jumpToEachissuePage(row)" style="color:#1890ff;text-decoration:underline;cursor:pointer;">{{row.winDate}}</p>
      </template>
    </el-table-column>
    <el-table-column
      prop="goodsMainImg"
      label="商品主图"
      align="center">
      <template scope="scope">
        <div class="height:280px;width:280px;">
         <img :src="scope.row.goodsMainImg" style="height:100%;width:100%;border-radius:10px;">
        </div>
      </template>
    </el-table-column>
    <el-table-column
      prop="goodsDesc"
      label="商品描述"
      align="center">
    </el-table-column>
    <el-table-column
      prop="memberId"
      label="中奖人UID"
      align="center">
    </el-table-column>
    <el-table-column
      prop="memberName"
      label="中奖人姓名"
      align="center">
    </el-table-column>
    <el-table-column
      prop="phone"
      label="手机号"
      align="center">
    </el-table-column>
    <el-table-column
      prop="addAddressType"
      label="添加收获信息"
      align="center">
      <template scope="scope">
        <p v-if="+scope.row.addAddressType === 1">是</p>
        <p v-else>否</p>
      </template>
    </el-table-column>
    <el-table-column
      prop="address"
      label="收货地址"
      align="center">
    </el-table-column>
    <el-table-column
      prop="deliverType"
      label="发货状态"
      align="center">
      <template scope="scope">
        <p v-if="+scope.row.deliverType === 1">是</p>
        <p v-else>否</p>
      </template>
    </el-table-column>
    <el-table-column
      prop="updateTime"
      label="更新时间"
      sortable="custom"
      width="160"
      align="center">
      <template slot-scope="{row}">
        {{row.updateTime ? $dayjs(row.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
    </el-table-column>
    <el-table-column
      prop="operName"
      label="操作人"
      align="center">
    </el-table-column>

    <el-table-column
      prop="createAt"
      width="160"
      label="操作"
      align="center">
      <template slot-scope="{row}">
        <el-button @click="seeDetailClick(row)" type="text">查看</el-button>
        <el-button v-show="!(+row.deliverType === 1)" v-hasPermi="['game:prizeDistribution:addAddress']" v-if="row.address" @click="addOrEditAddressClick(row, 'edit')" type="text">编辑</el-button>
        <el-button v-show="!(+row.deliverType === 1)" v-hasPermi="['game:prizeDistribution:addLogisticsNum']" @click="addPostCodeClick(row)" type="text">添加快递单号</el-button>
        <el-button v-hasPermi="['game:prizeDistribution:addAddress']" v-if="!row.address" @click="addOrEditAddressClick(row, 'add')" type="text">添加收件地址</el-button>
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


<!--添加快递单号-->
<el-dialog class="addPostCodeDialog" title="添加快递单号" :visible.sync="addPostCodeDialogVisible">
  <el-form :model="addPostCodeForm" :rules="rulesAddPost" ref="queryFormAddPost">

    <el-form-item label="快递公司" label-width="200px" prop="logisticsName" class="requiredStyle">
      <el-select v-model="addPostCodeForm.logisticsName" placeholder="请选择快递公司">
        <el-option v-for="val in mms" :label="val.name" :value="`${val.name}|${val.code}`" :key="val.code"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="快递单号" label-width="200px" prop="logisticsNum" class="requiredStyle">
      <el-input v-model.trim="addPostCodeForm.logisticsNum" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="上传凭证" label-width="200px" prop="imgs">
      <el-upload
        :limit="2"
        action=""
        :http-request="handleAvatarSuccessRUN.bind(file, 'addCode')"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        >
        <i class="el-icon-plus"></i>
      </el-upload>
      <p>最多上传2张，大小不超过500KB</p>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="addPostCodeDialogVisible = false">取 消</el-button>
    <el-button :loading="addPostCodeSumbitLoading" type="primary" @click="addPostCodeSumbit">确 定</el-button>
  </div>
</el-dialog>
<!--新增、编辑收货地址-->
<el-dialog class="getProductDialog" title="添加收货地址" :visible.sync="getProductVisible">
  <el-form :model="getProductForm" :rules="rulesGetProduct" ref="getProductForm">
    <el-form-item label="姓名" label-width="200px" prop="memberName" class="requiredStyle">
      <el-input v-model.trim="getProductForm.memberName" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="手机号码" label-width="200px" prop="phone" class="requiredStyle">
      <el-input v-model.trim="getProductForm.phone" autocomplete="off" maxlength="11"></el-input>
    </el-form-item>
    <el-form-item label="所在地址" label-width="200px" prop="selectedOptions" class="requiredStyle">
        <el-cascader
          ref="myCascader"
          style="width:100%;"
          clearable
          size="large"
          :options="handleRemoveCounty"
          v-model="selectedOptions"
          @change="addressChange">
        </el-cascader>
    </el-form-item>
    <el-form-item label="详细地址" label-width="200px" prop="address" class="requiredStyle">
      <el-input v-model.trim="getProductForm.address" autocomplete="off" maxlength="11" placeholder="街道"></el-input>
    </el-form-item>

  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="getProductVisible = false">取 消</el-button>
    <el-button :loading="getProductSumbitLoading" type="primary" @click="getProductSumbit">确 定</el-button>
  </div>
</el-dialog>
<!--查看奖品发放详情-->
<el-dialog
  title="查看奖品发放详情"
  :visible.sync="prizesDetailVisible"
  width="50%">
  <div>
    <h3 style="background:rgba(242,239,239,1);border-radius:5px;padding:6px;">{{+clickInfosRowData.deliverType === 1 ? '已发货' : '未发货'}}</h3>
    <h3>中奖人信息</h3>
      <p style="text-indent:30px;">期数:  第{{clickInfosRowData.winDate}}期</p>
      <p style="text-indent:30px;">商品描述: {{clickInfosRowData.goodsDesc}}</p>
      <p style="text-indent:30px;">中奖码: {{clickInfosRowData.winCode}}</p>
      <p style="text-indent:30px;">中奖人姓名 : {{clickInfosRowData.memberName}}</p>
      <p style="text-indent:30px;">手机号: {{clickInfosRowData.phone}}0</p>
    <h3>收货地址</h3>
      <p style="text-indent:30px;">收货人姓名 : {{clickInfosRowData.deliveryMemberName}}</p>
      <p style="text-indent:30px;">收货地址: {{clickInfosRowData.address}}</p>
      <p style="text-indent:30px;">手机号: {{clickInfosRowData.deliveryPhone}}</p>
    <h3>快递单号</h3>
      <p style="text-indent:30px;">快递公司: {{clickInfosRowData.logisticsName}}</p>
      <p style="text-indent:30px;">快递单号: {{clickInfosRowData.logisticsNum}}</p>
  </div>

  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="prizesDetailVisible = false">确 定</el-button>
  </span>
</el-dialog>



<!--预览-->
<el-dialog :visible.sync="dialogVisible_addPostCode">
  <img width="100%" :src="dialogImageUrl_addPostCode" alt="">
</el-dialog>

  </div>
</template>

<script>
import { prizesAwardQueryList, prizesAwardExport, prizesAwardAddPostCode, prizesAwardAddOrEditAddress, prizesAwardDetails } from "@/api/games";
import { getCertificate, upload } from "@/api/system/userlist";
import {compareVersion, replaceUnitlPrefixStr} from '@/utils/index';
import {saveAs} from 'file-saver';
import mms from '@/utils/mss';
import regionData from '@/utils/provinceCity'
  export default {
    components: {},
    data () {
      var validatePhone = (rule, value, callback) => {
        if (!(/^1[3456789]\d{9}$/.test(value)) && value !== '') {
          return callback(new Error('请输入正确的手机号码'))
        }
        callback()
      }
      var validatePhoneMust = (rule, value, callback) => {
        if (!(/^1[3456789]\d{9}$/.test(value))) {
          return callback(new Error('请输入正确的手机号码'))
        }
        callback()
      }
      var validatelogisticsName = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('请选择快递公司'))
        }
        callback()
      }
      var validatelogisticsNum = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('请输入快递单号'))
        }
        callback()
      }
      var validateMemberName = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('请输入姓名'))
        }
        callback()
      }
      var validateAddress = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('请详情地址'))
        }
        callback()
      }
      return {
        clickInfosRowData: {},
        prizesDetailVisible: false,
        selectedOptions: [],
        getProductSumbitLoading: false,
        getProductVisible: false,
        addPostCodeSumbitLoading: false,
        curClickRowData: {},
        mms,
        fileList: [],
        dialogImageUrl_addPostCode: '',
        dialogVisible_addPostCode: false,
        path: '',
        file: {},
        addPostCodeForm: {
          logisticsName: '',
          logisticsNum: '',
          imgs: []
        },
        getProductForm: {
          memberName: '',
          phone: '',
          address: ''
        },
        addPostCodeDialogVisible: false,
        rules: {
          phone: [
            { validator: validatePhone, trigger: 'blur' }
          ]
        },
        rulesAddPost: {
          logisticsName: [
            { validator: validatelogisticsName, trigger: 'change' }
          ],
          logisticsNum: [
            { validator: validatelogisticsNum, trigger: 'blur' }
          ]
        },
        rulesGetProduct: {
          memberName: [
            { validator: validateMemberName, trigger: 'blur' }
          ],
          phone: [
            { validator: validatePhoneMust, trigger: 'blur' }
          ],
          address: [
            { validator: validateAddress, trigger: 'blur' }
          ],
        },
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        queryParams: {
          memberName: '',
          phone: '',
          winDate: '',
          winCode: '',
          addAddressType: '',
          deliverType: '',
          redbacktime: '',
          selectedLevelTag: '',
          dividendType: -1,
          orderItems: []
        },
        tableData: [],
        loading: false,
        gridData: [],
        cloneRowData: {}
      }
    },
    filters: {
      valTransfer (val) {
        if (val === null || val === '') {
          return '-'
        } else {
          return `${((val * 100).toFixed(2) + '').replace(/(?:\.0*|(\.\d+?)0+)$/, '$1')}%`
        }
      }
    },
    computed: {
      handleRemoveCounty () {
        // regionData.forEach(v => v.children && v.children.forEach(i => i.children && Reflect.deleteProperty(i, 'children')))
        return this.recursionTree(regionData)
      }
    },
    created () {},
    // 内置组件激活
    activated () {
      this.getCertificateRun()
      this.queryParams.phone = this.$route.query.phone || ''
      this.search()
    },
    // mounted () {
    //   this.getCertificateRun()
    //   this.queryParams.phone = this.$route.query.phone || ''
    //   this.search()
    // },
    watch: {},
    methods: {
      jumpToEachissuePage (row) {
        // 夺宝游戏id、期数periodsNum
        this.$router.push({ path: "/games/seeInfosEachissue", query: {id:row.gameWhalePeasSeizeTreasureId, periodsNum: row.winDate || ''}})
      },
      recursionTree (origin) {
        if (Array.isArray(origin)) {
          if (!origin || !origin.length) return origin
          return origin.map(val => {
            let {adCode, children, ...a} = val
            return {
              value: adCode,
              ...a,
              children: children && children.length > 0 ? children.map(this.recursionTree) : null
            }
          })
        } else {
          let {adCode, children, ...a} = origin
          return {
            value: adCode,
            ...a,
            children: children && children.length > 0 ? children.map(this.recursionTree) : null
          }
        }
      },
      addressChange(arr) {
        arr.length === 1 ? this.queryParams.cityName = arr[0] : this.queryParams.cityName = arr[1]
      },
      handleSumbitAddress () {
        this.getProductSumbitLoading = true
        let _params = {
          address: this.getProductForm.address,
          areaCode: this.selectedOptions[2] || '',
          areaName: this.$refs['myCascader'].inputValue.split('/')[2].replace(/\s/g, '') || '',
          cityCode: this.selectedOptions[1] || '',
          cityName: this.$refs['myCascader'].inputValue.split('/')[1].replace(/\s/g, '') || '',
          gamePrizeDistributionId: this.curClickRowData.id,
          deliveryMemberName: this.getProductForm.memberName,
          deliveryPhone: this.getProductForm.phone,
          provinceCode: this.selectedOptions[0] || '',
          provinceName: this.$refs['myCascader'].inputValue.split('/')[0].replace(/\s/g, '') || ''
        }
        prizesAwardAddOrEditAddress(_params).then(response => {
          if (+response.code === 200) {
            this.$message.success(response.message)
            this.search(1)
          } else {
            this.$message.error(response.message)
          }
          this.getProductSumbitLoading = false
          this.getProductVisible = false
        }).catch(e => {
          this.getProductSumbitLoading = false
          this.getProductVisible = false
        })
      },
      getProductSumbit () {
        this.$refs['getProductForm'].validate((valid) => {
          if (valid) {
            if (this.selectedOptions.length <= 0) {
              this.$message.error('请选择地址!')
              return false
            }
            this.handleSumbitAddress()
          }
        })
      },
      // 添加快递单号添加保存
      addPostCodeSumbit () {
        this.$refs['queryFormAddPost'].validate((valid) => {
          if (valid) {
            this.addPostCodeSumbitLoading = true
            let _params = {
              // gamePrizeDistributionId: this.curClickRowData.gameWhalePeasSeizeTreasureId,
              gamePrizeDistributionId: this.curClickRowData.id,
              imgs: (this.fileList || []).map(v => v.url),
              logisticsCode: this.addPostCodeForm.logisticsName.split('|')[1],
              logisticsName: this.addPostCodeForm.logisticsName.split('|')[0],
              logisticsNum: this.addPostCodeForm.logisticsNum
            }
            prizesAwardAddPostCode(_params).then(response => {
              if (+response.code === 200) {
                this.$message.success(response.message);
              } else {
                this.$message.error(response.message)
              }
              this.addPostCodeSumbitLoading = this.addPostCodeDialogVisible = false
            }).catch(e => {
              this.addPostCodeSumbitLoading = this.addPostCodeDialogVisible = false
            })
          }
        })
      },
      handleRemove(file, fileList) {
        let _index = this.fileList.findIndex(v => file.uid === v.uid)
        this.fileList.splice(_index, 1)
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl_addPostCode = file.url;
        this.dialogVisible_addPostCode = true;
      },
      // 向您搭建的STS服务获取临时访问凭证。
      getCertificateRun () {
        return new Promise((resolve, reject) => {
          getCertificate().then(response => {
            this.certificateInfos = response.data
            resolve(this.certificateInfos)
          })
        })
      },
      async handleAvatarSuccessRUN (type, file) { // the order of the parameters here must be reversed.
        let _valid = this.beforeAvatarUpload(file.file)
        if (_valid) await this.put(file.file, type)
      },
      beforeAvatarUpload(file) {
        // const isNOtJPGPNG = file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png'
        const isGt500KB = file.size / 1024 < 500;
        // if (isNOtJPGPNG) {
        //   this.$message.error('请上传是 jpg、png、jpeg 格式的图片!')
        // }
        if (!isGt500KB) {
          this.$message.error('上传图片大小不能超过 500KB!')
        }
        return isGt500KB
      },
      async put (file, type) {
        try {
          let _res = await upload(this.certificateInfos, file)
          let ossFileUrl = _res.res.requestUrls[0]
          //如果CDN域名不为空，则替换成CDN域名
          if(this.certificateInfos.bucketCdnUrl){
            ossFileUrl = replaceUnitlPrefixStr(ossFileUrl, this.certificateInfos.endpoint, this.certificateInfos.bucketCdnUrl);
          }
          switch(type) {
            case 'addCode':
              this.addPostCodeForm.imgs = ossFileUrl
              this.fileList.push({
                name: '',
                url: ossFileUrl
              })
              // this.$refs['ruleForm'].clearValidate('imgs')
              break;
          }
        } catch (e) {
          console.log(e)
        }
      },
      // 订单导出
      async orderExportReq (reqData, cb, done) {
        try {
          const {data, status, filename} = await prizesAwardExport(reqData);

          if (status == 200) {
            let bob = new Blob([data], {type: 'application/vnd.ms-excel'});
            saveAs(bob, filename);
            this.$message.success('订单导出成功');
          } else {
            this.$message.error('导出错误');
          };
          cb.close();
          done();
        } catch (error) {
          cb.close();
          throw error;
        }
      },
      // 订单导出
      execDownload (cb, done) {
        let datetime = []
        datetime = this.queryParams.redbacktime
        let _data = {
          addAddressType: this.queryParams.addAddressType,
          currentPage: this.pageIndex,
          eliverType: this.queryParams.deliverType,
          exportExcel: true,
          memberName: this.queryParams.userName,
          pageSize: this.pageSize,
          phone: this.queryParams.phone,
          updateStartTime: datetime ? this.$dayjs(datetime[0]).format('YYYY-MM-DD') : '',
          updateEndTime: datetime ? this.$dayjs(datetime[1]).format('YYYY-MM-DD') : '',
          winDate: this.queryParams.winDate,
          winCode: this.queryParams.winCode,
        }

        // 导出数据方法
        this.orderExportReq(_data, cb, done);
      },
      exportClick () {
        const vm = this;
        const h = this.$createElement;
        const noData = this.tableData.length == 0;
        const style = {fontSize: '15px', display: 'block', padding: '10px 10px 30px'};
        const message = h('strong', {style}, '当前支持三个月内的订单导出！');
        if (noData) return this.$message.warning('当前查询条件暂无数据');

        this.$msgbox({
          title: '',
          message,
          center: true,
          showClose: false,
          closeOnClickModal: false,
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          confirmButtonClass: 'ml30',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              const target = instance.$el.firstChild;
              const cb = this.$loading({
                target,
                lock: true,
                text: '导出中...',
                spinner: 'el-icon-sunny',
                customClass: 'loadingAnim',
              });
              // 发送请求
              setTimeout(() => {
                vm.execDownload(cb, done);
              }, 1200);
            } else {
              done();
            }
          }
        }).then(() => {
          // this.$message.success('订单导出成功');
        }).catch(() => {
          this.$message.info('已取消订单导出');
        });
      },
      addOrEditAddressClick (row, type) {
        this.getProductVisible = true
        this.$nextTick(() => {
          this.$refs['getProductForm'].clearValidate()
        })
        this.curClickRowData = Object.assign({}, row)
        if (type === 'add') {
          this.getProductForm = {
            memberName: '',
            phone: '',
            address: ''
          }
          this.selectedOptions = []
        } else {
          this.getProductForm = {
            memberName: row.memberName,
            phone: row.phone,
            address: row.address
          }
          this.selectedOptions = [
            row.provinceCode,
            row.cityCode,
            row.areaCode
          ]
        }
      },
      seeDetailClick (row) {
        this.prizesDetailVisible = true
        prizesAwardDetails({
          id: row.id
        }).then(response => {
          if (response.code === 200) {
            this.clickInfosRowData = response.data
          } else {
            this.$message.error(response.message)
          }
        })
      },
      addPostCodeClick (row) {
        this.addPostCodeDialogVisible = true
        this.$nextTick(() => {
          this.$refs['queryFormAddPost'].clearValidate()
        })
        this.curClickRowData = Object.assign({}, row)
      },
      sortChange ({column, prop, order}) {
        this.queryParams.orderItems = [{ asc: order === 'ascending', column: prop.replace(/([A-Z])/g, '_$1').toLowerCase() }]
        this.search()
      },
      search (pgi) {
        this.$refs['queryForm'].validate((valid) => {
          if (valid) {
            if (pgi) this.pageIndex = pgi
            let datetime = []
            datetime = this.queryParams.redbacktime
            let _params = {
              memberName: this.queryParams.userName,
              phone: this.queryParams.phone,
              winDate: this.queryParams.winDate,
              winCode: this.queryParams.winCode,
              addAddressType: this.queryParams.addAddressType,
              deliverType: this.queryParams.deliverType,
              updateStartTime: datetime ? this.$dayjs(datetime[0]).format('YYYY-MM-DD') : '',
              updateEndTime: datetime ? this.$dayjs(datetime[1]).format('YYYY-MM-DD') : '',
              currentPage: this.pageIndex,
              pageSize: this.pageSize,
            }
            this.loading = true
            prizesAwardQueryList(_params).then(response => {
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
      // ...del
      dispatchClick () {
        this.$store.dispatch('setMs', {
          name: Math.random() + 1
        });
      },
      commitClick () {
        this.$store.commit('SET_MS', {
          name: Math.random() + 1
        });
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
<style>
.addPostCodeDialog .requiredStyle .el-form-item__label{
  position: relative;
}
.addPostCodeDialog .requiredStyle .el-form-item__label::before{
  position: absolute;
  right: 73px;
  top:2px;
  content: '*';
  color: red;
}
.getProductDialog .requiredStyle .el-form-item__label{
  position: relative;
}
.getProductDialog .requiredStyle .el-form-item__label::before{
  position: absolute;
  right: 73px;
  top:2px;
  content: '*';
  color: red;
}
</style>
