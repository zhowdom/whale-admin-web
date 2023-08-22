<template>
  <div class="tab-content cont_Wrapper">

    <el-form ref="queryForm" :inline="true">

        <el-form-item label="转账网络" prop="phone">
          <el-select v-model="netVal" placeholder="请选择" clearable>
            <el-option v-for="(item, key, index) in transferList" :label="`${item} (${key})`" :value="key" :key="index"></el-option>
            <!-- <el-option label="ERC20以太坊" :value="1"></el-option>
            <el-option label="TRC波场" :value="2"></el-option>
            <el-option label="BEP20币安智能链" :value="3"></el-option> -->
          </el-select>
        </el-form-item>

        <el-form-item label="币种" prop="phone">
          <el-select v-model="coinNameSelected" placeholder="请选择" clearable>
            <el-option v-for="(item, index) in coinMaps" :label="item" :value="item" :key="index"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="来源" prop="phone">
          <el-select v-model="chainVal" placeholder="请选择" clearable>
            <el-option label="链上" :value="true"></el-option>
            <el-option label="非链上" :value="false"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="" style="border:none;">
            <el-button type="primary" @click="search(1)" style="margin-bottom:20px;">查询</el-button>
            <el-button type="primary" @click="handleEdit('add')" style="margin-bottom:20px;">增加代币</el-button>
        </el-form-item>

      </el-form>

    <!--table-->
    <div class="task-table">
      <el-table
      :data="tableData"
      v-loading="loading"
      style="width: 100%">
        <el-table-column prop="coinName" label="币种" align="center" min-width="120"></el-table-column>
        <el-table-column prop="imgUrl" label="图标" align="center" min-width="160">
          <template slot-scope="{row}">
            <el-image  style="width: 100px; height: 100px" :src="row.imgUrl" :preview-src-list="[row.imgUrl]"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="blockchain" label="来源" align="center" min-width="120">
          <template slot-scope="{row}">
            {{row.blockchain ? '链上' : '非链上'}}
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" align="center" min-width="120"></el-table-column>
        <el-table-column prop="scale" label="精度（位）" align="center" min-width="120">
          <template slot-scope="{row}">
            {{row.scale}} <span v-if="row.unit">({{row.unit}})</span>
          </template>
        </el-table-column>
        <el-table-column prop="exchangeType" label="汇率来源" align="center" min-width="120">
          <template slot-scope="{row}">
            <span v-if="row.exchangeType == 1">币安汇率</span>
            <span v-else-if="row.exchangeType == 2">手动配置</span>
          </template>
        </el-table-column>
        <el-table-column prop="exchangeRate" label="汇率" align="center" min-width="220">
          <template scope="scope">
            <p>1 {{scope.row.coinName}} = {{scope.row.exchangeRate|filterMoney}} USDT</p>
          </template>
        </el-table-column>
        <el-table-column prop="minThreshold" label="小额资产值域" align="center" min-width="120"></el-table-column>
        <el-table-column prop="enable" label="状态" align="center" min-width="160">
          <template slot-scope="{row}">
              <el-switch v-hasPermi="['wallet:coin:config:settings:update']" v-model="row.enable" @change="handleSetType(row)"></el-switch>
            </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" align="center" min-width="160">
          <template slot-scope="{row}">
            {{row.updatedAt ? $dayjs(row.updatedAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template scope="scope">
            <el-button v-hasPermi="['wallet:coin:config:settings:update']" type="text" size="mini" @click="handleEdit('edit', scope.row)">编辑</el-button>
            <el-button v-hasPermi="['wallet:coin:config:settings:update']" type="text" size="mini" @click="handleDetails(scope.row)" v-if="!scope.row.enable">项目详情</el-button>
            <el-button v-hasPermi="['wallet:contract:add']" type="text" size="mini" @click="handleEditChain(scope.row)" v-if="!scope.row.blockchain">添加链上合约</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-pagination text-right mt10">
        <el-pagination
        @current-change="search"
        :page-sizes="[10, 20, 30]"
        @size-change="handleSizeChange"
        :current-page.sync="pageIndex"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
        </el-pagination>
      </div>
    </div>
    <!--table-->
    <!--新增/编辑dialog-->
    <el-dialog custom-class="certifyForm" :title="curTitleName" :visible.sync="dialogFormVisible" :width="'800px'">
      <el-form :model="certifyform" :rules="rules" ref="ruleForm">
        <el-form-item label="币种：" :label-width="formLabelWidth" prop="coinName">
          <el-input v-model.trim="certifyform.coinName" autocomplete="off" maxlength="10" :disabled="isEdit == 'edit'"></el-input>
        </el-form-item>
        <el-form-item label="精度：" :label-width="formLabelWidth" prop="unit">
          <el-select v-model="certifyform.unit" clearable placeholder="请选择" @change="handleChangeUnit">
            <el-option v-for="(item, key, index) in scaleParams" :label="`${item} (${key})`" :value="key" :key="index"></el-option>
          </el-select>
          <span class="danwei">位</span>
        </el-form-item>
        <el-form-item label="排序：" :label-width="formLabelWidth" prop="sort">
          <el-input v-model.number="certifyform.sort" autocomplete="off" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item label="图标：" :label-width="formLabelWidth" prop="imgUrl">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :http-request="handleAvatarSuccessRUN.bind(file, 'FRONT')">
            <img v-if="certifyform.imgUrl" :src="certifyform.imgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="汇率：" :label-width="formLabelWidth" prop="exchangeType">
          <div class="mb10">
            <el-radio v-model="certifyform.exchangeType" :label="1" @change="handleExchangeType" :disabled="!certifyform.blockchain">取币安交易所实时数据 （如果没有上交易所的，此选项置灰）</el-radio>
          </div>
          <el-col :span="7" style="width:100px;">
            <el-radio v-model="certifyform.exchangeType" :label="2" @change="handleExchangeType">
              <span>1</span>
              <span v-show="switchStatus%2==0" style="margin-left:10px;font-size:13px;">USDT</span>
              <span v-show="switchStatus%2==1" style="margin-left:10px;font-size:13px;">{{certifyform.coinName}}</span>
            </el-radio>
          </el-col>
          <el-col class="line" :span="3" style="width:30px;">=</el-col>
          <el-col :span="14">
            <!-- <el-input v-model="certifyform.exchangeRate" @input="handleINPUT" autocomplete="off" maxlength="36" clearable style="width:220px;"></el-input> -->
            <el-input-number v-model="certifyform.exchangeRate" controls-position="right" @change="handleINPUT" :min="0.000001" :precision="6" class="cy9box"></el-input-number>
            <span v-show="switchStatus%2==0" style="margin-left:10px;font-size:13px;color:#1890ff;font-weight:bold;">{{certifyform.coinName}}</span>
            <span v-show="switchStatus%2==1" style="margin-left:10px;font-size:13px;color:#1890ff;font-weight:bold;">USDT</span>
          </el-col>
          <!-- <i class="el-icon-refresh" style="cursor: pointer;" @click="switchStatusHandle"></i> -->
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" v-if="certifyform.coinName">
          <div class="clearfix" style="font-weight:bold;font-size:13px;margin-left:23px;">
            <div class="fl clearfix" style="color:#1890ff;"><span class="fl" style="padding-right:10px;">1</span>{{certifyform.coinName}}</div>
            <div class="fl clearfix" style="width:300px;">
              <span class="fl" style="margin:0 10px;">=</span>
              <!-- <el-input @input="handleINPUT_transfer" class="fl" v-model="inputTestVal" placeholder="" clearable maxlength="36" style="width:220px;"></el-input> -->
              <el-input-number v-model="inputTestVal" controls-position="right" @change="handleINPUT_transfer" :min="0.000001" :precision="6" class="fl cy9box"></el-input-number>
              <span style="margin-left:10px;color:#1890ff;">USDT</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <span class="required">以USDT 为本位，配置1USDT 等于多少等值代币；其他代币间汇算，以USDT为基准汇率进行中间换算。</span>
        </el-form-item>
        <el-form-item label="小额资产值域：" :label-width="formLabelWidth">
          <el-input v-model="certifyform.minThreshold"  @input="certifyform.minThreshold=certifyform.minThreshold.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g,'$1')" autocomplete="off" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <span>6位精度，上限1000000</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" :loading="editLoading">确 定</el-button>
      </div>
    </el-dialog>
    <!--项目详情dialog-->
    <el-dialog custom-class="certifyForm" title="项目详情" :visible.sync="projectVisible" :width="'800px'">
      <div class="mb15">
        <span class="text-muted pl10">详情页单张图片大小建议不超过500kb</span>
      </div>
      <div>
        <qu-editor v-model="bruleForm.detailUrl" :min-height="192" ref="quEditorRef" :is-handle-img="true" disabled/>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleEditProject()">编 辑</el-button>
        <el-button type="primary" @click="submitProjectForm()" :loading="editLoading">保 存</el-button>
      </div>
    </el-dialog>

    <!--添加链上合约dialog-->
    <el-dialog custom-class="certifyFormChains" title="添加链上合约" :visible.sync="dialogFormVisibleChain" :width="'600px'">
      <el-form :model="certifyFormChains" :rules="rulesChian" ref="ruleFormChain" style="padding-right:40px;">
        <el-form-item label="转账平台：" :label-width="formLabelWidthChain" prop="platformName">
          <el-select v-model="certifyFormChains.platformName" clearable placeholder="请选择">
            <el-option v-for="(item, key, index) in transferList" :label="`${item} (${key})`" :value="key" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="代币地址：" :label-width="formLabelWidthChain" prop="contractAddress">
          <el-input v-model="certifyFormChains.contractAddress" autocomplete="off" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="代币符号：" :label-width="formLabelWidthChain" prop="coinName">
          <el-input v-model="certifyFormChains.coinName" autocomplete="off" maxlength="20" disabled></el-input>
        </el-form-item>
        <el-form-item label="精度：" :label-width="formLabelWidthChain" prop="unit">
          <el-select v-model="certifyFormChains.unit" clearable placeholder="请选择" @change="handleChangeUnitChain">
            <el-option v-for="(item, key, index) in scaleParams" :label="`${item} (${key})`" :value="key" :key="index"></el-option>
          </el-select>
          <span class="danwei">位</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleChain = false">取 消</el-button>
        <el-button type="primary" @click="submitFormChain('ruleFormChain')" :loading="editLoadingChain">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { upload, getCertificate } from "@/api/system/userlist";
import { tokensConfigPage, editTokensConfig, scaleList, taskCouponsGiftCoin_addCoin, daiCoinSettingList, transferListPlatform, addContractManage } from "@/api/xhgjSpark_api/daiCoinSetting.js";
import {compareVersion, replaceUnitlPrefixStr} from '@/utils/index';
export default {
  components: {
    QuEditor: () => import('@/components/Editor')
  },
  data() {
    let imgValidator = (rule, value, callback) => {
      if (!/\S/.test(value)) {
        callback(new Error('请上传图片'))
      } else {
        callback()
      }
    }
    let minThresholdValidator = (rule, value, callback) => {
      if ((value == ''|| value == null || value == undefined) && value != 0 ) {
        callback(new Error('不能为空'))
      }else if(value < 0 || value > 1000000) {
        callback(new Error('请输入0 ~ 1000000数字'))
      } else {
        callback()
      }
    }
    let exchangeRateValidator = (rule, value, callback) => {
      if (!!!value) {
        callback(new Error('不能为空'))
      }else if(value == 2 && !!!this.certifyform.exchangeRate) {
        callback(new Error('请输入汇率'))
      } else {
        callback()
      }
    }
    return {
      inputTestVal: undefined,
      curTitleName: '',
      transferList: [],
      dialogFormVisibleChain: false,
      editLoadingChain: false,
      formLabelWidthChain: '120px',
      certifyFormChains: {
        coinName: '',
        contractAddress: '',
        platformName: '',
        unit: '',
        unitNumber: '',
        remark: '',
        id: ''
      },
      netVal: '',
      chainVal: '',
      coinNameSelected: '',
      coinMaps: [],
      switchStatus: 0,
      isEdit: null,
      loading: false,
      tableData: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dialogFormVisible: false,
      certifyform: {
        coinName: '',
        exchangeRate: '',
        scale: '',
        sort: '',
        unit: '',
        imgUrl: '',
        exchangeType: 2
      },
      rulesChian: {
        platformName: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        unit: [
          { required: true, message: '不能为空', trigger: 'change' },
        ],
        contractAddress: [
          { required: true, message: '不能为空', trigger: 'blur' },
        ],
        coinName: [
          { required: true, message: '不能为空', trigger: 'blur' },
        ],
      },
      rules: {
        unit: [
          { required: true, message: '不能为空', trigger: 'change' },
        ],
        sort: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { type: 'number', min: 1, message: '排序为数字且必须大于等于1', trigger: 'blur' },
        ],
        exchangeType: [
          { required: true, validator: exchangeRateValidator, trigger: 'blur' },
        ],
        imgUrl: [
          { required: true, validator: imgValidator, trigger: 'blur,change' }
        ],
        minThreshold: [
          { required: true, validator: minThresholdValidator, trigger: 'blur' },
        ],
      },
      file: '',
      formLabelWidth: '120px',
      bruleForm: {detailUrl: '', id: '', exchangeType: ''},
      projectVisible: false,
      editLoading: false,
      scaleParams: {},
    }
  },
  created () {
    this.transferListPlatform()
    daiCoinSettingList().then(response => {
      if (response.code == 200) {
        this.coinMaps = response.data || []
      } else {
        this.coinMaps = []
      }
    })
  },
  filters: {
    filterMoney (val) {
      return (1 / val).toFixed(6)
    }
  },
  mounted() {
    this.search();
    this.getCertificateRun();
    this.scaleList();
  },
  methods: {
    handleINPUT (v) {
      // 1 USDT = ? **币种
      // this.certifyform.exchangeRate = this.certifyform.exchangeRate.replace(/^\D*(\d*(?:\.\d{0,18})?).*$/g,'$1')
      this.inputTestVal = 1 / this.certifyform.exchangeRate
    },
    handleINPUT_transfer (v) {
      // 1 **币种 = ? USDT
      // this.inputTestVal = this.inputTestVal.replace(/^\D*(\d*(?:\.\d{0,18})?).*$/g,'$1')
      this.certifyform.exchangeRate = 1 / v
    },
    handleEditChain(row) {
      this.certifyFormChains = {
        coinName: row.coinName,
        contractAddress: row.contractAddress,
        platformName: row.platformName,
        remark: '',
        unit: row.unit,
        unitNumber: row.scale
      }
      this.dialogFormVisibleChain = true;
      this.$nextTick(() => {
        this.$refs['ruleFormChain'].clearValidate()
      })
    },
    handleChangeUnitChain(val) {
      this.certifyFormChains.unitNumber = this.scaleParams[val];
    },
    submitFormChain(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editLoadingChain = true;
          addContractManage(this.certifyFormChains).then(response => {
            if (response.code === 200) {
              this.msgSuccess(`保存成功`)
              this.search(this.pageIndex);
            } else {
              this.msgSuccess(response.message)
              this.search(this.pageIndex);
            }
            this.dialogFormVisibleChain = false;
            this.editLoadingChain = false;
          }).catch(error => {
            this.dialogFormVisibleChain = false;
            this.editLoadingChain = false;
            this.search(this.pageIndex);
          })
        }
      })
    },
    transferListPlatform() {
      transferListPlatform({}).then(response => {
        if (response.code === 200) {
          this.transferList = JSON.parse(JSON.stringify(response.data));
        } else {
          this.transferList = {}
          this.$message.error(response.message)
        }
      })
    },
    switchStatusHandle () {
      this.switchStatus = this.switchStatus + 1
    },
    scaleList() {
      scaleList({}).then(response => {
        if (response.code === 200) {
          this.scaleParams = JSON.parse(JSON.stringify(response.data));
        } else {
          this.scaleParams = {}
          this.$message.error(response.message)
        }
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.search()
    },
    // 数据查询
    search (pgi) {
      if (pgi) this.pageIndex = pgi
      let _params = {
        currentPage: this.pageIndex,
        pageSize: this.pageSize,
        blockchain: this.chainVal,
        coinName: this.coinNameSelected,
        enable: '',
        platformName: this.netVal,
        transactionNetworkName: '',
      }
      this.loading = true
      tokensConfigPage(_params).then(response => {
        if (response.code === 200) {
          this.tableData = JSON.parse(JSON.stringify(response.data.list));
          this.totalPage = response.data.total;
          this.loading = false
        } else {
          this.tableData = []
          this.totalPage = 0
          this.pageSize = 10
          this.loading = false
          this.$message.error(response.message)
        }
      }).catch(e => {
        console.log(e)
        this.loading = false
      })
    },
    // 状态开关
    handleSetType(row) {
      this.isEdit = 'edit'
      let text = row.enable == false ? "停用" : "启用";
      this.$confirm(`确认要${text}该配置?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        let _params = {
          description: row.description,
          enable: row.enable,
          exchangeRate: row.exchangeRate,
          scale: row.scale,
          sort: row.sort,
          id: row.id,
          minThreshold: row.minThreshold,
          exchangeType: row.exchangeType
        }
        this.updata(_params);
      }).catch(() => {
        if(row.enable == false) {
          row.enable = true
        } else{
          row.enable = false
        }
      });
    },
    handleExchangeType() {
      this.certifyform.exchangeRate = '';
    },
    handleEdit(type, row) {
      this.isEdit = type
      this.curTitleName = type == 'add' ? '新增代币' : '编辑代币'
      this.switchStatus = 0
      this.dialogFormVisible = true;
      if (type == 'add') {
        this.inputTestVal = undefined
        this.certifyform = {
          coinName: '',
          exchangeRate: undefined,
          scale: '',
          sort: '',
          unit: '',
          imgUrl: '',
          exchangeType: 2
        }
      } else {
        this.certifyform = Object.assign({}, row);
        this.inputTestVal = 1 / this.certifyform.exchangeRate
      }
      if(this.certifyform.exchangeType == 1) {
        this.certifyform.exchangeRate = '';
      }
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })
    },
    handleChangeUnit(val) {
      this.certifyform.scale = this.scaleParams[val];
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editLoading = true;
          this.updata(this.certifyform);
        }
      })
    },
    handleRate (obj) {
      // 汇率转换处理
      let _originRate = obj?.exchangeRate
      if (this.switchStatus % 2 == 1) {
        obj.exchangeRate = 1/_originRate
      }
    },
    updata(params) {
      let _api = this.isEdit == 'edit' ? editTokensConfig : taskCouponsGiftCoin_addCoin
      this.handleRate(params)
      _api(params).then(response => {
        if (response.code === 200) {
          this.msgSuccess(`保存成功`)
          this.dialogFormVisible = false;
          this.projectVisible = false;
          this.editLoading = false;
          this.search(this.pageIndex);
        } else {
          this.msgSuccess(response.message)
          this.dialogFormVisible = false;
          this.projectVisible = false;
          this.editLoading = false;
          this.search(this.pageIndex);
        }
      }).catch(error => {
        this.dialogFormVisible = false;
        this.projectVisible = false;
        this.editLoading = false;
        this.search(1);
      })
    },
    handleDetails(row) {
      this.projectVisible = true;
      this.bruleForm.detailUrl = row.description;
      this.bruleForm.id = row.id;
      this.bruleForm.exchangeType = row.exchangeType;
      this.$nextTick(() => {
        this.$refs.quEditorRef.Quill.enable(false);
      })
    },
    handleEditProject() {
      this.$refs.quEditorRef.Quill.enable();
    },
    submitProjectForm() {
      console.log(this.bruleForm);
      let _params = {
        description: this.bruleForm.detailUrl,
        id: this.bruleForm.id,
        exchangeType: this.bruleForm.exchangeType
      }
      if(_params.description !== null && _params.description !== undefined && _params.description !== '') {

      }else {
        this.$message.error('请填写内容')
        return;
      }
      this.editLoading = true;
      this.updata(_params);
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
    // 图片上传
    async handleAvatarSuccessRUN (type, file) { // the order of the parameters here must be reversed.
      let _valid = this.beforeAvatarUpload(file.file)
      if (!_valid) await this.put(file.file, type)
    },
    beforeAvatarUpload(file) {
      const isNOtJPGPNG = file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png'
      const isGt2M = file.size / 1024 / 1024 > 5
      if (isNOtJPGPNG) {
        this.$message.error('请上传是 jpg、png、jpeg 格式的图片!')
      }
      if (isGt2M) {
        this.$message.error('上传图片大小不能超过 5MB!')
      }
      return isNOtJPGPNG || isGt2M
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
          case 'FRONT':
            this.certifyform.imgUrl = ossFileUrl
            this.$refs['ruleForm'].clearValidate('imgUrl')
            break;
        }
      } catch (e) {
        console.log(e)
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.tab-content{
  .danwei{
    position: absolute;
    top: 0;
    right: -20px;
  }
  .line{
    box-sizing: border-box;
    padding-right: 11px;
    text-align: right;
  }
}
</style>
<style lang="scss">
.tab-content{
  .certifyForm form{
    padding-right:40px;
  }
  .el-form-item__content{
    position: relative;
    .el-select{
      width: 100%;
    }
  }
}
/*upload style*/
.cont_Wrapper .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.cont_Wrapper .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.cont_Wrapper .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.cont_Wrapper .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.cont_Wrapper .certifyForm{
  width:600px;
}
.certifyForm form{
  padding-right:20px;
}
.uploadSuccessed {
  width:200px;
  height: 200px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
}
.uploadSuccessed img{
  height: 100%;
  width: 100%;
  cursor: pointer;
}
/*隐藏左右2段加、减按钮*/
.cy9box .el-input-number__decrease,.cy9box .el-input-number__increase{
  display: none!important;
}
.cy9box .el-input__inner{
  padding-right: 15px!important;
}
</style>