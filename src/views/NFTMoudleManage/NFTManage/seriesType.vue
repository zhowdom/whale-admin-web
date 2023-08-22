<template>
  <div class="userlistwapper" style="padding:20px;">

    <el-form :model="queryParams" :rules="rules" ref="queryForm" :inline="true">
  
    <el-form-item label="类别：">
      <el-select v-model="queryParams.id" clearable placeholder="请选择">
        <el-option label="全部" value=""></el-option>
        <el-option v-for="(item, index) in seriesTypeArr" :label="item.label" :disabled="item.disable" :value="item.value" :key="index"></el-option>
      </el-select>
    </el-form-item>

      <el-form-item label="更新时间：">
        <el-date-picker
          v-model="queryParams.regtime"
          type="datetimerange"
          :default-time="['00:00:00', '23:59:59']"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至" 
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
    </el-form-item>
    


      <el-form-item>
        <el-button v-hasPermi="['internal:feeBonus:share:log:page']" type="primary" :loading="loading" icon="el-icon-search" @click="search(1)">查询</el-button>
        <el-button v-hasPermi="['internal:feeBonus:share:log:page']" type="primary" icon="el-icon-plus" @click="addClick">新增</el-button>
      </el-form-item>
    </el-form>

    <!-- table-->
    <el-table highlight-current-row
      border
      id="out-table"
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
      style="width: 100%;margin-top:10px;"
      >
      <el-table-column
        header-align="center"
        align="center"
        label="类别">
        <template scope="scope">
          <p>{{scope.row.multilingualInfo.name}}</p>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="类别描述">
        <template scope="scope">
          <p>{{scope.row.multilingualInfo.describe}}</p>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="微标">
        <template scope="scope">
          <img v-if="scope.row.logo" :src="scope.row.logo" style="width:99px;height:99px;border-radius:3px;" />
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="横幅图片">
        <template scope="scope">
          <img v-if="scope.row.bannerPicture" :src="scope.row.bannerPicture" style="width:99px;height:99px;border-radius:3px;" />
          <span v-else>无</span>
        </template>
      </el-table-column>

      <el-table-column
        header-align="center"
        align="center"
        label="状态">

        <template scope="scope">
          <el-switch
          v-model="scope.row.status"
          v-hasPermi="['whale:interface_verify:change']"
          @change="watchChange(scope.row)"
          class="customSwitchStyle"
          active-color="#00A854"
          active-text="已开启"
          inactive-color="#F04134"
          inactive-text="已禁用"
          />
        </template>
      </el-table-column>
      <el-table-column
      label="创建时间"
      align="center">
      <template slot-scope="{row}">
        {{row.createTime ? $dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
    </el-table-column>
    <el-table-column
      label="操作"
      align="center">
      <template slot-scope="{row}">
        <el-button type="text" @click="seeClick(row)">查看</el-button>
        <el-button type="text" @click="editClick(row)">编辑</el-button>
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


    <!--新增编辑弹窗-->
    <el-dialog :visible.sync="dialogFormVisible">
      <el-form :model="sumbitForm" ref="myref" :rules="rules">

        <el-form-item label="微标图片" :label-width="formLabelWidth" class="rela">
          <el-upload
            ref="uploadComp"
            class="row-uploader fl"
            :disabled="curType == 'see'"
            action=""
            :show-file-list="false"
            :accept="uploadConfItem.accept"
            :list-type="uploadConfItem.type"
            :http-request="handleAvatarSuccessRUN.bind(curfile, 'logo')">
            <img v-if="sumbitForm.logo" :src="sumbitForm.logo" class="avatar" style="width:146px;height:146px;border-radius:6px;">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <i v-if="sumbitForm.logo" class="el-icon-delete iscloseTNB" @click="handleDel('logo')"></i>
        </el-form-item>

        <el-form-item label="横幅图片" :label-width="formLabelWidth" class="rela">
          <el-upload
            ref="uploadComp"
            class="row-uploader fl"
            :disabled="curType == 'see'"
            action=""
            :show-file-list="false"
            :accept="uploadConfItem.accept"
            :list-type="uploadConfItem.type"
            :http-request="handleAvatarSuccessRUN.bind(curfile, 'bannerPicture')">
            <img v-if="sumbitForm.bannerPicture" :src="sumbitForm.bannerPicture" class="avatar" style="width:146px;height:146px;border-radius:6px;">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <i v-if="sumbitForm.bannerPicture" class="el-icon-delete iscloseTNB" @click="handleDel('bannerPicture')"></i>
        </el-form-item>


        <h3 style="padding-left:30px;font-wight:bold;">中文</h3>
        <el-form-item label="类别" :label-width="formLabelWidth" prop="multilingualInfo.name"><!--可以对象点多层里面参数的校验！-->
          <el-input v-model.trim="sumbitForm.multilingualInfo.name" :disabled="curType == 'see'" maxlength="10" show-word-limit autocomplete="off" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="类别描述" :label-width="formLabelWidth">
          <el-input v-model.trim="sumbitForm.multilingualInfo.describe" :disabled="curType == 'see'" maxlength="2000" show-word-limit type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入内容"></el-input>
        </el-form-item>
        <h3 style="padding-left:30px;font-wight:bold;">英文</h3>
        <el-form-item label="类别" :label-width="formLabelWidth" prop="multilingualInfo.nameEn"><!--可以对象点多层里面参数的校验！-->
          <el-input v-model.trim="sumbitForm.multilingualInfo.nameEn" :disabled="curType == 'see'" maxlength="10" show-word-limit autocomplete="off" style="width:300px;"></el-input>
        </el-form-item>
        
        <el-form-item label="类别描述" :label-width="formLabelWidth">
          <el-input v-model.trim="sumbitForm.multilingualInfo.describeEn" :disabled="curType == 'see'" maxlength="2000" show-word-limit type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入内容"></el-input>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{curType == 'see' ? '确 定' : '取 消'}}</el-button>
        <el-button v-show="curType !== 'see'" type="primary" @click="submitClick('myref')" :loading="sumbitLoading">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import { nft_seriesTypeSelect, nft_seriesTypePage, nft_seriesTypeAdd, nft_seriesTypeEdit, nft_seriesTypeStatus } from "@/api/NFTMoudleManage";
import {replaceUnitlPrefixStr} from '@/utils/index';
import { getCertificate, upload } from "@/api/system/userlist";

export default {
  data() {
    var validatePhone = (rule, value, callback) => {
      if (!(/^1[3456789]\d{9}$/.test(value)) && value !== '') {
        return callback(new Error('请输入正确的手机号码'))
      }
      callback()
    }
    let userNameValidator = (rule, value, callback) => {
      if (!/\S/.test(value)) {
        callback(new Error('不能为空'))
      } else {
        callback()
      }
    }
    let imgValidator = (rule, value, callback) => {
      if (!/\S/.test(value)) {
        callback(new Error('请上传图片'))
      } else {
        callback()
      }
    }
    return {
      sumbitLoading: false,
      sumbitForm: {
        bannerPicture: "",
        id: null,
        logo: "",
        multilingualInfo: {
          describe: "",
          describeEn: "",
          name: "",
          nameEn: ""
        }
      },
      certificateInfos: {},
      curfile: {},
      seriesTypeArr: [],
      uploadConfItem: {
        type: 'picture-card',
        accept: '.png,.jpg,.jpeg',
      },
      queryParams: {
        id: '',
        regtime: '',
      },
      beforeWatchChange: 1,
      curHandleFlags: '',
      multipleSelection: [],
      menuStatus: 'close',
      getByID: '',
      everyClickNextFans_row: {},
      cacheQueryParams: {},
      fansChain: [],
      changeStatusCloneRow: {},
      formstatus: {
        remark: ''
      },
      rules: {
        logo: [
          {required: true, message: '不能为空', trigger: ['blur', 'change']},
        ],
        'multilingualInfo.name': [
          {required: true, message: '不能为空', trigger: ['blur', 'change']},
        ],
        'multilingualInfo.nameEn': [
          {required: true, message: '不能为空', trigger: ['blur', 'change']},
        ]
      },
      disableTip: '确认关闭吗？',
      enableTip: '确认开启吗？',
      formLabelWidth: '130px',
      dialogFormVisible: false,
      loading: false,
      timeZone: 1,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      tableData: [],
      curType: '',
    }
  },
  computed: {},
  created () {
    this.nft_seriesTypeSelectRun()
  },
  mounted () {
    this.getCertificateRun();
    this.isAuth.isPermi(["whale:interface_verify:page"]) && this.search()
  },
  methods: {
    // 图片上传
    getCertificateRun () {
      // 向您搭建的STS服务获取临时访问凭证。
      return new Promise((resolve, reject) => {
        getCertificate().then(response => {
          this.certificateInfos = response.data
          resolve(this.certificateInfos)
        })
      })
    },
    async handleAvatarSuccessRUN (type, file) { // the order of the parameters here must be reversed.
      // let _valid = this.beforeAvatarUpload(file.file)
      // if (!_valid) await this.put(file.file, opt)
      await this.put(file.file, type)
    },
    beforeAvatarUpload(file) {
      const isNOtJPGPNG = file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png'
      const isGt2M = file.size / 1024 / 1024 > 2
      if (isNOtJPGPNG) {
        this.$message.error('请上传是 jpg、png、jpeg 格式的图片!')
      }
      if (isGt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isNOtJPGPNG || isGt2M
    },
    async put (file, type) {
      try {
        let _res = await upload(this.certificateInfos, file)
        let ossFileUrl = _res.res.requestUrls[0]
        console.log('certificateInfos bucketCdnUrl：', this.certificateInfos.bucketCdnUrl)
        console.log('origin URL：', ossFileUrl)
        //如果CDN域名不为空，则替换成CDN域名
        if(this.certificateInfos.bucketCdnUrl){
          ossFileUrl = replaceUnitlPrefixStr(ossFileUrl, this.certificateInfos.endpoint, this.certificateInfos.bucketCdnUrl);
        }
        console.log('handled URL：', ossFileUrl)
        this.sumbitForm[type] = ossFileUrl
        console.log('this.sumbitForm：', this.sumbitForm)
      } catch (e) {
        console.log(e)
      }
    },
    addClick () {
      this.dialogFormVisible = true
      this.curType = 'add'
      this.sumbitForm = {
        bannerPicture: "",
        id: null,
        logo: "",
        multilingualInfo: {
          describe: "",
          describeEn: "",
          name: "",
          nameEn: ""
        }
      }
      this.$nextTick(() => {
        this.$refs['myref'].clearValidate()
      })
    },
    editClick (row) {
      this.dialogFormVisible = true
      this.sumbitForm.id = row.id
      this.curType = 'edit'
      this.sumbitForm = JSON.parse(JSON.stringify(row))
      this.$nextTick(() => {
        this.$refs['myref'].clearValidate()
      })
    },
    seeClick (row) {
      this.dialogFormVisible = true
      this.curType = 'see'
      this.sumbitForm = Object.assign({}, row)
    },
    submitClick (name) {
      this.$refs[name].validate((valid) => {
          if (valid) this.runEditOrAdd()
      })
    },
    // 编辑或新增
    runEditOrAdd () {
      this.sumbitLoading = true
      let _curApi = this.curType == 'add' ? nft_seriesTypeAdd : nft_seriesTypeEdit
      _curApi(this.sumbitForm).then(response => {
        if (response.code == 200) {
          this.dialogFormVisible = false
          this.$message({
            message: '操作成功',
            type: 'success',
            'duration': 1000,
            onClose: () => {
              this.search(1)
            }
          })
        } else {
          this.$message.error(response.message);
        }
        this.sumbitLoading = false
      }).catch(e => {
        this.sumbitLoading = false
        console.log(e)
      })
    },
    nft_seriesTypeSelectRun() {
      nft_seriesTypeSelect({}).then((response) => {
        if (response.code === 200) {
          this.seriesTypeArr = response.data.list || [];
        } else {
          this.seriesTypeArr = [];
          this.$message.error(response.message);
        }
      });
    },
    handleBeforeWatchChange (val) {
      this.multipleSelection = []
      this.$refs.multipleTable.clearSelection()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    alterStatus (opt) {
      nft_seriesTypeStatus({
        id: opt.id
      }).then(response => {
        if (response.code == 200) {
          this.$message({
            message: '操作成功',
            type: 'success',
            'duration': 1000,
            onClose: () => {
              this.search(1)
            }
          })
        } else {
          opt.status = !opt.status
          this.$message.error(response.message)
        }
      }).catch(e => {
        // opt.status = !opt.status
        console.log(e, 'ee')
      })
    },
    watchChange (val) {
      this.$confirm(val.status ? this.enableTip : this.disableTip, val.status ? '确定开启？' : '确定关闭？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.alterStatus(val)
      }).catch(() => {
        val.status = !val.status
      })
    },
    search (pgi) {
      if (pgi) this.pageIndex = pgi
      let datetime = [];
      datetime = this.queryParams.regtime;
      let _params = {
        endTime: datetime ? datetime[1] : "",
        startTime: datetime ? datetime[0] : "",
        pageSize: this.pageSize,
        currentPage: this.pageIndex,
        ...this.queryParams,
      }
      this.loading = true
      nft_seriesTypePage(_params).then(response => {
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
      })
    },
    handleDel (type) {
      this.sumbitForm[type] = ''
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.search()
    },
  }
};
</script>
<style lang="scss">
.subEmClassNode{
  font-style: normal;
}
.iscloseTNB{
  position: absolute;
  top:7px;
  left:124px;
  opacity: .75;
  color: #606266;
  font-size: 18px!important;
  z-index: 1000;
  cursor: pointer;
}
</style>
