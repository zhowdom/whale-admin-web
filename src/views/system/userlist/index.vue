<template>
  <div class="userlistwapper">

    <el-form :model="queryParams" ref="queryForm" :rules="rulesTop" :inline="true">
      <el-form-item label="输入用户ID" prop="memberId">
        <el-input
          v-model.trim="queryParams.memberId"
          placeholder="输入用户ID"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="用户名" prop="nickName">
        <el-input
          v-model.trim="queryParams.nickName"
          placeholder="输入用户名"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="邀请码" prop="inviteCode">
        <el-input
          v-model.trim="queryParams.inviteCode"
          placeholder="输入邀请码"
          maxlength="7"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input
          v-model.trim="queryParams.phone"
          placeholder="输入手机号"
          clearable
          maxlength="11"
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input
          v-model.trim="queryParams.email"
          placeholder="输入邮箱"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="注册时间" prop="regtime">
        <el-date-picker
          v-model="queryParams.regtime"
          type="daterange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="审核情况" prop="authStatus">
        <el-select v-model="queryParams.authStatus" clearable placeholder="">
          <el-option
            v-for="item in auditingChoose"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    <el-form-item label="国家类型" prop="status">
        <el-select v-model="queryParams.countryType" clearable placeholder="请选择" @change="handleNode">
          <el-option label="全部" :value="null"></el-option>
          <el-option label="国内" :value="1"></el-option>
          <el-option label="国外" :value="2"></el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="城市" prop="cityName">
        <el-cascader ref="cascader" class="item1-input" v-model="selectedOptions" :options="citysData" clearable>
        </el-cascader>
    </el-form-item>
    <el-form-item label="账户状态" prop="status">
        <el-select v-model="queryParams.status" clearable placeholder="请选择">
          <el-option label="已开启" :value="1"></el-option>
          <el-option label="已禁用" :value="2"></el-option>
          <el-option label="已注销" :value="3"></el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="test" v-show="false">
        <el-input
          v-model="queryParams.test"
          placeholder="输入"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="定位情况" prop="status">
        <el-select v-model="queryParams.pointed" clearable placeholder="请选择">
          <el-option label="全部" :value="-1"></el-option>
          <el-option label="已定位" :value="1"></el-option>
          <el-option label="未定位" :value="0"></el-option>
        </el-select>
    </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" icon="el-icon-search" @click="search(1, 'clickQuery')">查询</el-button>
        <el-button v-show="false" type="primary" :loading="loading" icon="el-icon-download" @click="export2Excel.currentPage(ctx, 'add')">导出</el-button>
      </el-form-item>
      <el-form-item>
        <span class="text-muted">（筛选【合约城市】前，需选择【国家类型】）</span>
      </el-form-item>
      <div class="clearfix" style="width:100%;"></div>
    
    </el-form>

    <!--bread-->
    <div class="wouterBox" style="position:relative;">
    <div class="breadTop clearfix overflowSet" ref="breadTop" :class="{'openBread':menuStatus === 'open', 'closeBread':menuStatus === 'close', 'defaultOHeight': fansChain.length === 0, 'borderedStyle bg': fansChain.length > 0 }">
      <ul id="breadTop" class="clearfix">
      <li v-for="(item, index) in fansChain" :key="index" class="fl">
        <div v-if="index === fansChain.length-1">
          <span @click="queryThisChild(item, index)" style="position:relative;">
            {{item.name}}<i class="fortest">({{item.id}})</i>
            <i @click.stop="closeChild(item, index)" class="closeTag el-icon-close" style="position:absolute;top:0;"></i>
          </span> 
          <span style="padding-left:19px;">的粉丝</span>

        </div>
        <div v-else>
          <span @click="queryThisChild(item, index)">
            {{item.name}}<i class="fortest">({{item.id}})</i> <i class="el-breadcrumb__separator el-icon-arrow-right" style="color:#1890ff!important;font-weight: bold;"></i>
          </span>
        </div>
      </li>
      
      </ul>
    </div>
      <div class="iosTopBar" v-show="fansChain.length > 0" id="iosTopBarJs" title="展开">
        <span class="ac-ln-menucta-chevron"></span>
      </div>

      <div @click="refreshReset" class="iosTopBar refreshBox" v-show="fansChain.length > 0" id="refreshJs" title="一键清除">
        <i class="el-icon-refresh"></i>
      </div>
    </div>

    <!-- table-->
    <el-table highlight-current-row
      border
      id="out-table"
      ref="multipleTable"
      @header-click="formatSortHeader"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
      v-loading="loading"
      :data="tableData"
      style="width: 100%;margin-top:10px;"
      :row-key="getRowKey"
      >
      <el-table-column
        type="selection"
        :selectable="checkboxSelect"
        :reserve-selection="true"
        width="55">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="memberId"
        label="用户ID">
        <template scope="scope">
          <div>{{scope.row.memberId}}</div>
        </template>
      </el-table-column>
      <el-table-column
        width="160"
        header-align="center"
        align="center"
        sortable="custom"
        prop="registeredAt"
        label="注册时间">
        <template scope="scope">
          <div>{{scope.row.registeredAt}}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column
        header-align="center"
        align="center"
        prop="platform"
        label="注册来源">
        <template scope="scope">
          <div v-if='scope.row.platform === 1'>H5</div>
          <div v-else-if='scope.row.platform === 2'>Android</div>
          <div v-else-if='scope.row.platform === 3'>IOS</div>
          <div v-else-if='scope.row.platform === 4'>小程序</div>
        </template>
      </el-table-column> -->
      <el-table-column
        header-align="center"
        align="center"
        prop="cityName"
        label="城市">
        <template scope="scope">
          <span v-if="scope.row.countryName">{{scope.row.countryName}} / </span>
          <span v-if="scope.row.provinceName">{{scope.row.provinceName}}</span>
          <span v-if="scope.row.cityName"> / {{scope.row.cityName}}</span>
          <span v-if="scope.row.areaName"> / {{scope.row.areaName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="139"
        prop="nickName"
        label="用户名">
        <template scope="scope">
          <div>{{scope.row.nickName}}</div>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="139"
        prop="relaName"
        label="真实姓名">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="139"
        prop="registeredType"
        label="注册类型">
        <template scope="scope">
          <span v-if="scope.row.registeredType == 1">手机</span>
          <span v-else-if="scope.row.registeredType == 2">邮箱</span>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="120"
        prop="areaCode"
        label="国家/地区">
        <template scope="scope">
          <div>{{scope.row.areaCode}}</div>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="120"
        prop="phone"
        label="注册手机">
        <template scope="scope">
          <div>{{scope.row.phone}}</div>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="120"
        prop="recommendEmail"
        label="邀请人邮箱">
        <template scope="scope">
          <div>{{scope.row.recommendEmail}}</div>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="120"
        prop="email"
        label="邮箱">
        <template scope="scope">
          <div>{{scope.row.email}}</div>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="inviteCode"
        label="邀请码">
        <template scope="scope">
          <div>{{scope.row.inviteCode}}</div>
        </template>
      </el-table-column>
      <el-table-column
        width="120"
        header-align="center"
        align="center"
        prop="recommendPhone"
        label="邀请人手机号">
        <template scope="scope">
          <div>{{scope.row.recommendPhone}}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column
        width="110"
        header-align="center"
        align="center"
        prop="authStatus"
        label="实名认证情况">
        <template scope="scope">
          <div class="certifyResbox" v-hasPermi="['member:rpAuth:auth']">
          <div v-if='scope.row.authStatus === -1' @click="clickCertifyResult(scope.row.memberId)" style="color:blue;text-decoration: underline;">未认证</div>
          <div v-else-if='scope.row.authStatus === 1' @click="clickCertifyResult(scope.row.memberId)" style="color:green;text-decoration: underline;">认证成功</div>
          <div v-else-if='scope.row.authStatus === 2' @click="clickCertifyResult(scope.row.memberId)" style="color:gray;text-decoration: underline;">认证失败</div>
          <div v-else-if='scope.row.authStatus === 4' @click="clickCertifyResult(scope.row.memberId)" style="color:red;text-decoration: underline;">待审核</div>
          </div>
        </template>
      </el-table-column> -->
      <el-table-column
        header-align="center"
        align="center"
        prop="pointed"
        label="定位情况">
        <template scope="scope">
          <span v-if="scope.row.pointed">已定位</span>
          <span v-else>未定位</span>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="receiveTask"
        label="领取情况">
        <template scope="scope">
          <span>{{scope.row.receiveTask ? '已领取' : '未领取'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="160"
        header-align="center"
        align="center"
        prop="lastLoginAt"
        sortable="custom"
        label="最后登陆时间">
        <template slot-scope="{row}">
          {{row.lastLoginAt ? $dayjs(row.lastLoginAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="139"
        prop="status"
        label="账户状态">
        <template scope="scope">
          <!-- <div v-if='scope.row.status === 1'>正常使用</div>
          <div v-else-if='scope.row.status === 2'>禁用</div> -->
          <!-- <el-switch
            class="radioStyleSet"
            v-model="scope.row.statusTransfered"
            inactive-text="禁用"
            active-text="正常"
            :width='80'
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch> -->

          <el-switch
            v-hasPermi="['member:member:status']"
            v-model="scope.row.statusTransfered"
            @change="watchChange(scope.row, 'single')"
            class="customSwitchStyle"
            active-color="#00A854"
            active-text="已开启"
            inactive-color="#F04134"
            inactive-text="已禁用"
            />
        </template>
      </el-table-column>
      <el-table-column
        width="160"
        header-align="center"
        align="center"
        prop="recommendedId"
        label="我的粉丝">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" icon="el-icon-s-custom" @click="seeInSee(row)">查看粉丝</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template>
          <el-button type="primary" size="mini">查看详情</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <div class="t2Btnsbox fl" style="padding-top:10px;" v-if="tableData.length > 0">
      <el-select style="width:129px;margin-right:10px;padding-bottom:30px;" v-model="beforeWatchChange" @change="handleBeforeWatchChange" placeholder="请选择">
        <el-option label="批量启用" :value="1"></el-option>
        <el-option label="批量禁用" :value="2"></el-option>
      </el-select>
      <el-button v-hasPermi="['member:member:status']" v-show="+beforeWatchChange === 1" :disabled="multipleSelection.length <= 0" type="primary" :loading="loading" @click="watchChange(null, 'batchOn')">批量启用</el-button>
      <el-button v-hasPermi="['member:member:status']" v-show="+beforeWatchChange === 2" :disabled="multipleSelection.length <= 0" type="primary" :loading="loading" @click="watchChange(null, 'batchOff')">批量禁用</el-button>
    </div>
    <el-pagination
      class="fr"
      @current-change="search"
      :page-sizes="[10, 20, 30, 50, 100]"
      @size-change="handleSizeChange"
      :current-page.sync="pageIndex"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage">
    </el-pagination>
    <!--实名认证dialog-->
    <el-dialog custom-class="certifyForm" title="实名认证审核" :visible.sync="dialogFormVisible">
      <div class="twoBtns">
        <el-button :disabled="certifyform.statusType === 1" type="primary" @click="approveOrRefuseClick(1)">审核通过</el-button>
        <el-button :disabled="certifyform.statusType === 1" @click="approveOrRefuseClick(2)">审核不通过</el-button>
      </div>
      <el-form :model="certifyform" :rules="rules" ref="ruleForm">
        <el-form-item label="真实姓名：" :label-width="formLabelWidth" prop="userName">
          <el-input maxlength="10" v-model="certifyform.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码：" :label-width="formLabelWidth" prop="idCardNumber">
          <el-input v-model="certifyform.idCardNumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="身份证正面：" :label-width="formLabelWidth" prop="imageUrlSuccessFRONT">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :http-request="handleAvatarSuccessRUN.bind(file, 'FRONT')">
            <img v-if="certifyform.imageUrlSuccessFRONT" :src="certifyform.imageUrlSuccessFRONT" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="身份证反面：" :label-width="formLabelWidth" prop="imageUrlSuccessBACK">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :http-request="handleAvatarSuccessRUN.bind(file, 'BACK')">
            <img v-if="certifyform.imageUrlSuccessBACK" :src="certifyform.imageUrlSuccessBACK" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="手持身份证正面：" :label-width="formLabelWidth" prop="imageUrlSuccessHAND">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :http-request="handleAvatarSuccessRUN.bind(file, 'HAND')">
            <img v-if="certifyform.imageUrlSuccessHAND" :src="certifyform.imageUrlSuccessHAND" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="认证结果：" :label-width="formLabelWidth">
          <span style="color:red;" v-if="certifyform.statusType === 4">待审核</span>
          <span style="color:green;" v-else-if="certifyform.statusType === 1">已认证</span>
          <span style="color:red;" v-else-if="certifyform.statusType === -1">未认证</span>
          <span style="color:gray;" v-else-if="certifyform.statusType === 2">认证失败</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveMdfClick('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!--账号启用禁用Dialog-->
    <el-dialog width="29%" title="确定要执行此操作吗？" :visible.sync="dialogFormVisibleStatus" :before-close="handleClose">
      <el-form :model="formstatus">
        <el-form-item label="备注描述" :label-width="formLabelWidth">
          <el-input v-model="formstatus.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSattusClick">取 消</el-button>
        <el-button :disabled="(formstatus.remark.replace(/(^\s+)|(\s+$)/g, '')).length <= 0" type="primary" @click="sureStatusClick">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { someoneCertifyResult, searchUserList, getCertificate, upload, refuseOrApprove, save, statusChange, statusBatchChange } from "@/api/system/userlist";
// import { regionData, CodeToText } from 'element-china-area-data'
import regionData from '@/utils/provinceCity'
import { checkIDCard } from '@/utils/validate'
import export2Excel from '@/components/exportToExcel'
import { abroadFacilitator } from '@/api/member/cityService';
import {compareVersion, replaceUnitlPrefixStr} from '@/utils/index';

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
    let idCardNumberValidator = (rule, value, callback) => {
      if (!checkIDCard(value)) {
        callback(new Error('请输入正确的身份证号码'))
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
      export2Excel,
      ctx: this,
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
      dialogFormVisibleStatus: false,
      path: '',
      file: {},
      // options: regionData,
      selectedOptions: [],
      imageUrl: '',
      certifyform: {
        userName: '',
        idCardNumber: '',
        statusType: -1,
        imageUrlSuccessBACK: '',
        imageUrlSuccessFRONT: '',
        imageUrlSuccessHAND: '',
        imageUrlSuccessElemt: ''
      },
      rulesTop: {
        phone: [
          { validator: validatePhone, trigger: 'blur' }
        ]
      },
      rules: {
        userName: [
          { validator: userNameValidator, trigger: 'blur' }
        ],
        idCardNumber: [
          { validator: idCardNumberValidator, trigger: 'blur' }
        ],
        imageUrlSuccessHAND: [
          { validator: imgValidator, trigger: 'change,blur' }
        ],
        imageUrlSuccessBACK: [
          { validator: imgValidator, trigger: 'blur,change' }
        ],
        imageUrlSuccessFRONT: [
          { validator: imgValidator, trigger: 'blur,change' }
        ],
        imageUrlSuccessElemt: [
          { validator: imgValidator, trigger: 'blur,change' }
        ]
      },
      formLabelWidth: '130px',
      dialogFormVisible: false,
      loading: false,
      timeZone: 1,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      tableData: [],
      auditingChoose: [
        {
          value: '',
          label: '请选择'
        },
        {
          value: 4,
          label: '待审核'
        },
        {
          value: 1,
          label: '已认证'
        },
        {
          value: -1,
          label: '未认证'
        },
        {
          value: 2,
          label: '认证失败'
        }
      ],
      queryParams: {
        pointed: -1,
        memberId: '',
        nickName: '',
        inviteCode: '',
        phone: '',
        email: '',
        regtime: '',
        authStatus: '', // 审核情况
        cityName: '',
        sort: '', // 排序：注册时间：1从小到大、2从大到小；最后登陆时间：3从小到大、4从大到小
        recommendedId: '',
        status: '',
        test: '' // just for debug, delete or not
      },
      clickedUserId: '', // 当前点中的用户ID
      clickCountTimeReg: 0,
      clickCountTimelog: 0,
      citysData: []
    }
  },
  computed: {
    // handleRemoveCounty () {
      // regionData.forEach(v => v.children && v.children.forEach(i => i.children && Reflect.deleteProperty(i, 'children')))
      // return this.recursionTree(regionData)
    // }
  },
  mounted () {
    this.queryParams.sort = 2
    this.search()
    this.getCertificateRun()
    this.runToggleClass('iosTopBar', 'ac-localnav')
  },
  methods: {
    handleBeforeWatchChange (val) {
      this.multipleSelection = []
      this.$refs.multipleTable.clearSelection()
    },
    checkboxSelect (row, rowIndex) {
      // 能够批量启用的行数据
      if (+this.beforeWatchChange === 1) {
        return +row.status === 2
      } else if (+this.beforeWatchChange === 2) {
        return +row.status === 1
      }
    },
    // support multiple selection during accross pages.
    getRowKey (row) {
      return row.memberId
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // recursionTree (origin) {
    //   if (Array.isArray(origin)) {
    //     if (!origin || !origin.length) return origin
    //     return origin.map(val => {
    //       let {id, children, ...a} = val
    //       return {
    //         value: id,
    //         ...a,
    //         children: children && children.length > 0 ? children.map(this.recursionTree) : null
    //       }
    //     })
    //   } else {
    //     let {id, children, ...a} = origin
    //     return {
    //       value: id,
    //       ...a,
    //       children: children && children.length > 0 ? children.map(this.recursionTree) : null
    //     }
    //   }
    // },
    refreshReset () {
      this.fansChain.length = 0
      this.cacheQueryParams = {}
      this.queryParams = {
        memberId: '',
        nickName: '',
        inviteCode: '',
        phone: '',
        email: '',
        regtime: '',
        authStatus: '',
        cityName: '',
        sort: 2,
        recommendedId: '',
        status: '',
        test: ''
      }
      this.$refs['queryForm'].resetFields()
      this.$refs.queryForm.clearValidate()
      this.search(1)
    },
    findKeyframesRule (rule) {
      var ss = Array.from(document.styleSheets).filter((styleSheet) => !styleSheet.href || styleSheet.href.startsWith(window.location.origin))
      for (var i = 0; i < ss.length; ++i) {
        for (var j = 0; j < ss[i].cssRules.length; ++j) {
          if (ss[i].cssRules[j].type === window.CSSRule.KEYFRAMES_RULE && ss[i].cssRules[j].name === rule) {
            return ss[i]
          }
        }
      }
      return null
    },
    eachTimeCalcHeight () {
      let obj = document.getElementById('breadTop')
      // 3margin|20padding|2border
      let height = obj.clientHeight < 31 ? (31 + 3 + 20 + 2) +'px' : (obj.clientHeight + 3 + 20 + 2) + 'px'
      const style = document.styleSheets[0]
      const kfs = this.findKeyframesRule('slideDown')
      if (kfs) {
        kfs.deleteRule(0)
        kfs.deleteRule(1)
      }
      style.insertRule(`@keyframes slideDown{from{height:51px;}to{height:${height};}}`)
      style.insertRule(`@keyframes slideUp{from{height:${height};}to{height:51px;}}`)
      Array.from(style.cssRules).splice(0,2)
      Array.from(style.rules).splice(0,2)
    },
    runToggleClass (wraperClass, toggleClass) {
      let _this = this
      let odiv = document.getElementsByClassName(wraperClass)[0]
      odiv.addEventListener('click', toggC, false)
      const _cli = document.getElementById('iosTopBarJs')
      function toggC (e) {
        var e = e || window.event,
            tar = e.target || e.src.Element,
            className = tar.className
        if (odiv.classList.contains(toggleClass)) {
          odiv.className = wraperClass
           _this.menuStatus = 'close'
           _cli.title = '展开'
        } else {
          odiv.className += ` ${toggleClass}`
          _this.menuStatus = 'open'
          _cli.title = '收起'
        }
        _this.eachTimeCalcHeight()
      }
    },
    queryThisChild (item, index) {
      this.createBreadcrumb(item, index)
    },
    closeChild (item, index) {
      this.createBreadcrumb(item, index, 'del')
    },
    // 动态创建面包屑
    createBreadcrumb (item, index, type) {
      /**
       * 1)只有最后一个子节点才能删除，且删除之后，回退到被删除的节点的上一级，并查询更新此时ID下的列表
       * 2)任一个节点都可以点击查询，且在此节点之后，要被清除
       * 3)当最后一个子节点也被删除了之后，则查询默认的初始状态的列表数据（等同页面刷新）
       * 4)会有N多个下级的粉丝关系链
       * 5)回退到任意一上级粉丝时，需匹配到之前对应查询时的查询条件状态
       */
      if (index === 0 && type !== 'del') {
        // 特殊场景：如果点击查询（a:是第一个且只有一个节点;或者b:有多个节点，直接点击第一个）：此时该节点后续的节点要清空，保留第一个节点
        this.fansChain = this.fansChain.slice(0, 1)
      } else if (index === 0 && type === 'del') {
        this.fansChain = this.fansChain.slice(0, 0)
        this.cacheQueryParams = {
          'first': this.cacheQueryParams['first']
        }
      } else if (index !== 0 && type !== 'del') {
        this.fansChain = this.fansChain.slice(0, index+1)
      } else if (index !== 0 && type === 'del') {
        this.fansChain = this.fansChain.slice(0, index)
      }
      if (this.fansChain.length === 0) {
        this.queryParams.recommendedId = ''
      } else {
        // 如果是点击删除，此时ID取被删除元素的上一个ID
        this.queryParams.recommendedId = type === 'del' ? this.fansChain[this.fansChain.length - 1]['id'] : item.id
      }
      this.getByID = this.queryParams.recommendedId
      if (this.fansChain.length === 0) {
        this.getByID = 'first'
      }
      if (item && this.cacheQueryParams[this.getByID]) {
        this.queryParams.memberId = this.cacheQueryParams[this.getByID]['memberId']
        this.queryParams.nickName = this.cacheQueryParams[this.getByID]['nickName']
        this.queryParams.inviteCode = this.cacheQueryParams[this.getByID]['inviteCode']
        this.queryParams.phone = this.cacheQueryParams[this.getByID]['phone']
        this.queryParams.email = this.cacheQueryParams[this.getByID]['email']
        this.queryParams.regtime = this.cacheQueryParams[this.getByID]['regtime']
        this.queryParams.authStatus = this.cacheQueryParams[this.getByID]['authStatus']
        this.queryParams.cityName = this.cacheQueryParams[this.getByID]['cityName']
        this.queryParams.sort = this.cacheQueryParams[this.getByID]['sort']
        this.queryParams.status = this.cacheQueryParams[this.getByID]['status']
        // this.queryParams.recommendedId = this.cacheQueryParams[this.getByID]['recognizeMark'].split('_')[1]
        this.queryParams.test = this.cacheQueryParams[this.getByID]['test']
      }
      this.search(1)
    },
    // 查看我的粉丝
    seeInSee (row) {
      this.fansChain.push({
        name: row.nickName,
        id: row.memberId
      })
      this.everyClickNextFans_row = row
      this.queryParams = {
        memberId: '',
        nickName: '',
        inviteCode: '',
        phone: '',
        email: '',
        regtime: '',
        authStatus: '',
        cityName: '',
        sort: '',
        recommendedId: row.memberId,
        status: '',
        test: ''
      }
      this.$refs.queryForm.clearValidate()
      this.search(1)
    },
    handleClose(done) {
      this.cancelSattusClick()
    },
    cancelSattusClick () {
      this.dialogFormVisibleStatus = false
      this.search()
    },
    sureStatusClick () {
      let _params = {}
      _params.remark = this.formstatus.remark
      if (this.curHandleFlags === 'single') {
        _params.memberIds = [this.changeStatusCloneRow.memberId]
        _params.status = this.changeStatusCloneRow.status === 1 ? 2 : 1
      } else {
        _params.memberIds = this.multipleSelection.map(val => val.memberId)
        _params.status = this.curHandleFlags === 'batchOn' ? 1 : 2
      }
      statusBatchChange(_params).then(response => {
        this.dialogFormVisibleStatus = false
        if (response.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success',
            'duration': 1000,
            onClose: () => {
              this.handleBeforeWatchChange()
              this.search()
            }
          })
        } else {
          this.$message.error(response.message)
        }
      }).catch(({ error }) => {
        if (error) this.$message.error(error.message)
      })
    },
    // 账户状态启用、禁用[用户状态 1:正常使用 2:禁用 3:注销]
    watchChange (row, type) {
      this.curHandleFlags = type
      this.dialogFormVisibleStatus = true
      this.formstatus.remark = ''
      if (row) {
        this.changeStatusCloneRow = Object.assign({}, row)
      }
    },
    sortChange ({column, prop, order}) {
      let _blooean
      switch(prop)
      {
        case 'registeredAt': // 注册时间
          _blooean = order === 'ascending' ? 1 : 2
          this.queryParams.sort = _blooean
          break;
        case 'lastLoginAt': // 最后登陆时间
          _blooean = order === 'ascending' ? 3 : 4
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
    // 选择节点
    handleNode (val) {
      this.selectedOptions = []
      if(!val) {
        this.citysData = []
        return;
      }
      let num = val == 1 ? 12 : 9;
      this.abroadFacilitatorRun(num);
    },
    // 获取城市
    abroadFacilitatorRun (val) {
      abroadFacilitator({ nodeType: val }).then(response => {
        if (+response.code === 200) {
          this.citysData = this.recursionTree(response.data.list);
        } else {
          this.citysData = []
        }
      }).catch(e => {
        console.log(e, 'e')
      })
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
    search (pgi, acitionType) {
      this.$refs['queryForm'].validate((valid) => {
          if (valid) {
            if (pgi) this.pageIndex = pgi
            let datetime = []
            datetime = this.queryParams.regtime
            let _params = {
              memberId: this.queryParams.memberId,
              name: this.queryParams.nickName,
              inviteCode: this.queryParams.inviteCode,
              phone: this.queryParams.phone,
              email: this.queryParams.email,
              registeredEndTime: datetime ? datetime[1] : '',
              registeredStartTime: datetime ? datetime[0] : '',
              authStatus: this.queryParams.authStatus, // 审核情况
              provinceId: this.selectedOptions.length > 0 ? this.selectedOptions[0] : '',
              cityId: this.selectedOptions.length > 1 ? this.selectedOptions[1] : '',
              areaId: this.selectedOptions.length > 2 ? this.selectedOptions[2] : '',
              pageSize: this.pageSize,
              currentPage: this.pageIndex,
              sort: this.queryParams.sort,
              recommendedId: this.queryParams.recommendedId,
              status: this.queryParams.status,
              test: this.queryParams.test,
              countryType: this.queryParams.countryType,
              pointed: this.queryParams.pointed
            }
            this.loading = true
            searchUserList(_params).then(response => {
              if (response.code === 200) {
                this.tableData = JSON.parse(JSON.stringify(response.data.list))
                this.totalPage = response.data.total
                for (let [k, s] of Object.entries(this.tableData || [])) {
                  this.$set(this.tableData[k], 'statusTransfered', s.status === 1 ? true : false)
                }
                this.loading = false
              } else {
                this.tableData = []
                this.totalPage = 0
                this.pageSize = 10
                this.loading = false
                this.$message.error(response.message)
              }
              if (acitionType) {
                let markID = this.everyClickNextFans_row.memberId || 'first'
                this.cacheQueryParams[markID] = Object.assign({recognizeMark: `marked_${markID}`}, this.queryParams)
                if (this.fansChain.length === 0) {
                  this.cacheQueryParams = {
                    'first': this.cacheQueryParams[markID]
                  }
                }
              }
            }).catch( e => {
              this.loading = false
            })
          }
      })
    },
    clickCertifyResult (id) {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields()
      })
      this.queryCertifyResultStatus(id)
      this.clickedUserId = id
    },
    queryCertifyResultStatus (id) {
      someoneCertifyResult({
        memberId: id
      }).then(response => {
        if (!response.data) {
          this.certifyform.imageUrlSuccessFRONT = ''
          this.certifyform.imageUrlSuccessBACK = ''
          this.certifyform.imageUrlSuccessHAND = ''
          this.certifyform.userName = ''
          this.certifyform.idCardNumber = ''
          this.certifyform.statusType = -1
        } else {
          this.certifyform.imageUrlSuccessFRONT = response.data.frontImgUrl
          this.certifyform.imageUrlSuccessBACK = response.data.backImgUrl
          this.certifyform.imageUrlSuccessHAND = response.data.handHoldImgUrl
          this.certifyform.userName = response.data.userName
          this.certifyform.idCardNumber = response.data.idCardNumber
          this.certifyform.statusType = response.data.statusType
        }
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.search()
    },
    approveOrRefuseClick (type) {
      let _desc = type === 1 ? '通过' : '不通过'
      this.$confirm(`确认审核${_desc}吗？`, '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.certifyform.statusType = type
        let _params = {
          frontImgUrl:this.certifyform.imageUrlSuccessFRONT,
          backImgUrl: this.certifyform.imageUrlSuccessBACK,
          handHoldImgUrl: this.certifyform.imageUrlSuccessHAND,
          memberId: this.clickedUserId,
          userName: this.certifyform.userName,
          idCardNumber: this.certifyform.idCardNumber,
          statusType: this.certifyform.statusType
        }
        refuseOrApprove(_params).then(response => {
          if (response.code === 200) {
            this.msgSuccess(`操作成功`)
            this.search()
          } else {
            this.msgSuccess(response.message)
          }
        })
      }).catch(() => {})
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
          case 'BACK':
            this.certifyform.imageUrlSuccessBACK = ossFileUrl
            this.$refs['ruleForm'].clearValidate('imageUrlSuccessBACK')
            break;
          case 'FRONT':
            this.certifyform.imageUrlSuccessFRONT = ossFileUrl
            this.$refs['ruleForm'].clearValidate('imageUrlSuccessFRONT')
            break;
          case 'HAND':
            this.certifyform.imageUrlSuccessHAND = ossFileUrl
            this.$refs['ruleForm'].clearValidate('imageUrlSuccessHAND')
            break;
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 实名认证资料提交保存
    saveMdfClick (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let _params = {
            frontImgUrl:this.certifyform.imageUrlSuccessFRONT,
            backImgUrl: this.certifyform.imageUrlSuccessBACK,
            handHoldImgUrl: this.certifyform.imageUrlSuccessHAND,
            memberId: this.clickedUserId,
            userName: this.certifyform.userName,
            idCardNumber: this.certifyform.idCardNumber,
            statusType: this.certifyform.statusType
          }
          save(_params).then(response => {
            if (response.code === 200) {
              this.msgSuccess(`保存成功`)
              this.dialogFormVisible = false
            } else {
              this.msgSuccess(response.message)
              this.dialogFormVisible = false
            }
          })
        }
      })
    }
  }
};
</script>
<style lang="scss">
.defaultOHeight {
  height: 0!important;
}
.borderedStyle {
  border: 1px solid #1890ff;
  border-radius:3px;
}
.overflowSet {
    overflow: hidden;
  }
  .openBread {
    animation:slideDown 1;
    animation-duration:1.5s;

    /* Safari and Chrome */
    -webkit-animation:slideDown 1;
    -webkit-animation-duration:1.5s;
  }
  .closeBread {
    height: 51px;
    animation:slideUp 1;
    animation-duration:1.5s;

    /* Safari and Chrome */
    -webkit-animation:slideUp 1;
    -webkit-animation-duration:1.5s;
  }
  .bg{ 
    background-image: -webkit-gradient(linear,left top, left bottom,from(rgba(255,255,255,0)),color-stop(50%, #fff));
    background-image: linear-gradient(-180deg,rgba(255,255,255,1) 50%,rgb(242, 242, 242, 1) 80%);
  }
.breadTop{
  width:679px;
  position: relative;
  margin:0;
  padding: 10px;
  .fortest{
    // display: inline-block;
    display: none;
    font-style: normal;
  }
  ul{
    border: 1px solid rgba(255,255,255,.0);
    margin:0;
    padding: 0;
    margin-top:3px;
    padding-right: 5px;
  }
  li{
    margin:0;
    padding: 0;
    display: inline-block;
    padding-bottom: 9px;
    & :hover{
      color: #1890ff;
    }
    span{
      padding: 6px 0;
      font-size: 14px;
      color:#606266;
      cursor: pointer;
      font-weight: bold;
    }

    .closeTag{
      font-size: 12px;
      border-radius:100%;
      padding: 2px;
      color: #1890ff;
      font-weight: bold;
      &:hover{
        background: #f56c6c;
        color: #fff;
        cursor: pointer;
        }
      }
    }
}
.wouterBox {
  /*animation toggle*/
  .ac-ln-menucta-chevron {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 1;
    -webkit-transition: -webkit-transform 1s cubic-bezier(0.86, 0, 0.07, 1),-webkit-transform-origin 1s cubic-bezier(0.86, 0, 0.07, 1);
    transition: -webkit-transform 1s cubic-bezier(0.86, 0, 0.07, 1),-webkit-transform-origin 1s cubic-bezier(0.86, 0, 0.07, 1);
    transition: transform 1s cubic-bezier(0.86, 0, 0.07, 1),transform-origin 1s cubic-bezier(0.86, 0, 0.07, 1);
    transition: transform 1s cubic-bezier(0.86, 0, 0.07, 1),transform-origin 1s cubic-bezier(0.86, 0, 0.07, 1),-webkit-transform 1s cubic-bezier(0.86, 0, 0.07, 1),-webkit-transform-origin 1s cubic-bezier(0.86, 0, 0.07, 1);
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
  .ac-ln-menucta-chevron::before {
      -webkit-transform-origin: 100% 100%;
      transform-origin: 100% 100%;
      -webkit-transform: rotate(40deg) scaleY(1.5);
      transform: rotate(40deg) scaleY(1.5);
      background: #fff;
  }
  .ac-ln-menucta-chevron::after {
      -webkit-transform-origin: 0% 100%;
      transform-origin: 0% 100%;
      -webkit-transform: rotate(-40deg) scaleY(1.5);
      transform: rotate(-40deg) scaleY(1.5);
      background: #fff;
  }
  .ac-ln-menucta-chevron::before {
      right: 50%;
  }
  .ac-ln-menucta-chevron::after {
      left: 50%;
  }
  .ac-ln-menucta-chevron::before, .ac-ln-menucta-chevron::after {
      content: "";
      display: block;
      position: absolute;
      top: 14px;
      width: 8px;
      height: 1px;
      z-index: 1;
      -webkit-transition: -webkit-transform 1s cubic-bezier(0.86, 0, 0.07, 1),-webkit-transform-origin 1s cubic-bezier(0.86, 0, 0.07, 1);
      transition: -webkit-transform 1s cubic-bezier(0.86, 0, 0.07, 1),-webkit-transform-origin 1s cubic-bezier(0.86, 0, 0.07, 1);
      transition: transform 1s cubic-bezier(0.86, 0, 0.07, 1),transform-origin 1s cubic-bezier(0.86, 0, 0.07, 1);
      transition: transform 1s cubic-bezier(0.86, 0, 0.07, 1),transform-origin 1s cubic-bezier(0.86, 0, 0.07, 1),-webkit-transform 1s cubic-bezier(0.86, 0, 0.07, 1),-webkit-transform-origin 1s cubic-bezier(0.86, 0, 0.07, 1);
  }
  .ac-localnav .ac-ln-menucta-chevron{
      -webkit-transform: translateY(-8px);
      transform: translateY(-8px);
  }
  .ac-localnav .ac-ln-menucta-chevron {
      display: block;
      position: relative;
      width: 20px;
      height: 20px;
      z-index: 1;
      -webkit-transition: -webkit-transform 1s cubic-bezier(0.86, 0, 0.07, 1),-webkit-transform-origin 1s cubic-bezier(0.86, 0, 0.07, 1);
      transition: -webkit-transform 1s cubic-bezier(0.86, 0, 0.07, 1),-webkit-transform-origin 1s cubic-bezier(0.86, 0, 0.07, 1);
      transition: transform 1s cubic-bezier(0.86, 0, 0.07, 1),transform-origin 1s cubic-bezier(0.86, 0, 0.07, 1);
      transition: transform 1s cubic-bezier(0.86, 0, 0.07, 1),transform-origin 1s cubic-bezier(0.86, 0, 0.07, 1),-webkit-transform 1s cubic-bezier(0.86, 0, 0.07, 1),-webkit-transform-origin 1s cubic-bezier(0.86, 0, 0.07, 1);
      -webkit-transform: translateY(-8px);
      transform: translateY(-8px);
  }
  .ac-localnav .ac-ln-menucta-chevron::before {
      -webkit-transform-origin: 100% 0%;
      transform-origin: 100% 0%;
      -webkit-transform: rotate(40deg) scaleY(1.5);
      transform: rotate(-40deg) scaleY(1.5);
  }
  .ac-localnav .ac-ln-menucta-chevron::after {
      -webkit-transform-origin: 0% 100%;
      transform-origin: 0% 100%;
      -webkit-transform: rotate(-40deg) scaleY(1.5);
      transform: rotate(40deg) scaleY(1.5);
  }
  .ac-localnav .ac-ln-menucta-chevron::before {
      right: 50%;
  }
  .ac-localnav .ac-ln-menucta-chevron::before, .ac-localnav .ac-ln-menucta-chevron::after {
      content: "";
      display: block;
      position: absolute;
      top: 14px;
      width: 8px;
      height: 1px;
      z-index: 1;
      -webkit-transition: -webkit-transform 1s cubic-bezier(0.86, 0, 0.07, 1),-webkit-transform-origin 1s cubic-bezier(0.86, 0, 0.07, 1);
      transition: -webkit-transform 1s cubic-bezier(0.86, 0, 0.07, 1),-webkit-transform-origin 1s cubic-bezier(0.86, 0, 0.07, 1);
      transition: transform 1s cubic-bezier(0.86, 0, 0.07, 1),transform-origin 1s cubic-bezier(0.86, 0, 0.07, 1);
      transition: transform 1s cubic-bezier(0.86, 0, 0.07, 1),transform-origin 1s cubic-bezier(0.86, 0, 0.07, 1),-webkit-transform 1s cubic-bezier(0.86, 0, 0.07, 1),-webkit-transform-origin 1s cubic-bezier(0.86, 0, 0.07, 1);
  }
  .ac-localnav .ac-ln-menucta-chevron::after, .ac-localnav .ac-ln-menucta-chevron::after {
      -webkit-transform-origin: 0% 0%;
      transform-origin: 0% 0%;
      -webkit-transform: rotate(40deg) scaleY(1.5);
      transform: rotate(40deg) scaleY(1.5);
  }
  .ac-localnav .ac-ln-menucta-chevron::after {
      left: 50%;
  }
  .iosTopBar{
    position: absolute;
    width:20px;
    height: 20px;
    bottom:20px;
    left:685px;
    cursor: pointer;
    background: rgba(24,144,255,1);
    color: #fff;
    border-radius:100%;
  }
  .refreshBox{
    left:715px;
    text-align: center;
    line-height: 20px;
    & :hover{
      transform: rotate(90deg) scaleY(1.005);
      transition-duration: 0.5s;
    }
    i{
      font-weight: bold;
    }
  }
}
</style>
<style>
.userlistwapper{padding: 20px;}
.userlistwapper .el-pagination{
  text-align: right;
  padding-top: 10px;
}
/*upload style*/
.userlistwapper .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.userlistwapper .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.userlistwapper .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.userlistwapper .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.userlistwapper .certifyForm{
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
.customUploadBox input{
  width: 190px;
  height: 190px;
  opacity: 0;
  z-index: 102;
  position: absolute;
  top:5px;
  left: 5px;
  cursor: pointer;
}
.customUploadBox svg{
  position: absolute;
  top:87px;
  left: 87px;
  height: 30px;
  width:30px;
  z-index: 101;
}
.twoBtns{
  text-align: right;
  padding: 15px 20px;
}
.certifyResbox {color: blue;cursor: pointer;}
.isDescending{border-top-color: #1890ff!important;}
.isAscending{border-bottom-color: #1890ff!important;}
.custSortStyle{
  position: relative;
}
.custSortStyle .sort-caret{
  position: absolute;
  left: 5px;
}
.custSortStyle .ascending{
  top:-2px!important;
}
.custSortStyle .descending{
  bottom: -3px!important;
}
.breadTop .el-icon-close:before{
  content: "\e6db";
}
.breadTop .el-tag .el-icon-close:before{
  display: block;
}
</style>
