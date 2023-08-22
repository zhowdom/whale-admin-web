<template>
  <div class="tab-content cont_Wrapper">
    <div style="padding-bottom:15px;">
      <span style="color:red;font-size:13px;">点击【禁用】后，只是APP端不展示，接口并未关闭 ；但是如果用户没有刷新，存在缓存，仍然可以进行跳转。</span>
      <el-button size="medium" type="primary" @click="jumpToApiCloseRoute">前往关闭后端接口</el-button>
      
    </div>
    <div>
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="Banner来源">
          <el-select v-model="queryParams.sourceType" placeholder="请选择" clearable>
            <el-option label="管理后台添加" :value="1"></el-option>
            <el-option label="H5申请" :value="2"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="邀请码"><el-input v-model="queryParams.inviteCode" placeholder="" clearable /></el-form-item>
        <el-form-item label="手机号"><el-input v-model="queryParams.phone" placeholder="" clearable /></el-form-item>
        <el-form-item label="邮箱"><el-input v-model="queryParams.mail" placeholder="" clearable /></el-form-item>
        <el-form-item label="套餐单号"><el-input v-model="queryParams.adSpaceOrderNo" placeholder="" clearable /></el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择" clearable>
            <el-option label="全部" :value="null"></el-option>
            <el-option label="待审核" :value="1"></el-option>
            <!-- <el-option label="待开始" :value="3"></el-option> -->
            <el-option label="进行中" :value="4"></el-option>
            <el-option label="已结束" :value="5"></el-option>
            <el-option label="已拒绝" :value="6"></el-option>
          </el-select>
        </el-form-item>

        <el-button v-hasPermi="['ad_space:package_member:page']" type="primary" @click="search(1)">查询</el-button>
        <el-button v-hasPermi="['ad_space:package_member:save']" icon="el-icon-plus" type="primary" @click="handleAdd">新增</el-button>
        
      </el-form>
      
    </div>
    <!--table-->
    <el-table
    :data="tableData"
    v-loading="loading"
    class="tab-contentbox"
    style="width: 100%">
      <el-table-column prop="id" label="编号" align="center" min-width="120"></el-table-column>
      <el-table-column prop="sourceType" label="banner来源" align="center" min-width="120">
        <template slot-scope="{row}">
          <p>{{row.sourceType == 1 ? '管理后台添加' : 'H5申请'}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="用户手机" align="center" min-width="120"></el-table-column>
      <el-table-column prop="email" label="用户邮箱" align="center" min-width="120"></el-table-column>
      <el-table-column prop="inviteCode" label="用户邀请码" align="center" min-width="120"></el-table-column>
      <el-table-column prop="adSpaceOrderNo" label="套餐单号" align="center" min-width="120"></el-table-column>
      <el-table-column label="添加时间" align="center" min-width="120">
        <template scope="scope">
          {{scope.row.createTime ? $dayjs(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
      </el-table-column>
      <el-table-column :label="tag == 'isnewApp' ? '开屏页图片' : 'banner图片'" align="center" min-width="120">
        <template slot-scope="{row}">
          <el-image style="width: 100px; height: 100px" :src="row.image" :preview-src-list="[row.image]"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center" min-width="120">
        <template scope="scope">
          {{scope.row.startTime ? $dayjs(scope.row.startTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
      </el-table-column>
      <el-table-column label="到期时间" align="center" min-width="120">
        <template scope="scope">
          {{scope.row.endTime ? $dayjs(scope.row.endTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="useAdPlaceTime" label="消耗广告时长(分钟)" align="center" min-width="120"></el-table-column>
      <el-table-column prop="id" label="是否配置连接" align="center" min-width="120">
        <template scope="scope">{{scope.row.params[0].value ? '是': '否'}}</template>
      </el-table-column>
      <el-table-column prop="statusDesc" label="状态" align="center" min-width="120"></el-table-column>
      <el-table-column v-if="tag == 'isnewApp'" prop="duration" label="开屏页倒计时（秒）" align="center" min-width="120"></el-table-column>
      <el-table-column prop="remark" label="备注" align="center" min-width="120"></el-table-column>

      
      <el-table-column v-if="tag !== 'isnewApp'" prop="sort" label="排序" align="center" min-width="120"></el-table-column>
      <el-table-column v-if="tag !== 'isnewApp'" prop="positionDesc" label="banner位置" align="center" min-width="120"></el-table-column>
      <el-table-column v-if="tag !== 'isnewApp'" prop="name" label="banner名称" align="center" min-width="120"></el-table-column>

      <!-- <el-table-column prop="useAdPlaceQuantity" label="消耗广告次数(次)" align="center" min-width="120"></el-table-column> -->
      <!-- <el-table-column prop="id" label="业务类型" align="center" min-width="120"></el-table-column> -->
      

      <el-table-column label="操作" align="center" width="220">
        <template scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row, true)">查看</el-button>
          <el-button v-hasPermi="['setting:banner_setting:update']" type="primary" size="mini" @click="handleEdit(scope.row)" v-if="scope.row.status == 1">编辑</el-button>
          <el-button v-hasPermi="['ad_space:package_member:audit']" type="primary" size="mini" @click="handleAudit(scope.row)" v-if="scope.row.status == 1">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--table-->
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
    <!--新增/编辑dialog-->
    <el-dialog custom-class="certifyForm" :title="dialogTitle" :visible.sync="dialogFormVisible" :width="'630px'">
      <el-form :model="certifyform" :rules="rules" ref="ruleForm" :disabled="seeBool">

        <el-form-item label="用户手机号：" :label-width="formLabelWidth">
          <el-input maxlength="11" @blur="((ev)=>{handleChangeItp(ev, 'phone')})" v-model="matchedResult.phone" autocomplete="off" clearable placeholder="" :disabled="h5ReadOnly == 2 && operationType == 'edit'"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱：" :label-width="formLabelWidth">
          <el-input maxlength="40" @blur="((ev)=>{handleChangeItp(ev, 'email')})" v-model="matchedResult.email" autocomplete="off" clearable placeholder="" :disabled="h5ReadOnly == 2 && operationType == 'edit'"></el-input>
        </el-form-item>
        <el-form-item label="用户邀请码：" :label-width="formLabelWidth">
          <el-input maxlength="40" @blur="((ev)=>{handleChangeItp(ev, 'inviteCode')})" v-model="matchedResult.inviteCode" autocomplete="off" clearable placeholder="" :disabled="h5ReadOnly == 2 && operationType == 'edit'"></el-input>
        </el-form-item>

        <el-form-item label="使用套餐单号：" :label-width="formLabelWidth" prop="adSpaceOrderNo">
          <el-input maxlength="40" @blur="handleChangeByOrderNo" v-model="certifyform.adSpaceOrderNo" autocomplete="off" clearable placeholder="请输入" :disabled="findedMemberId == '' || (h5ReadOnly == 2 && operationType == 'edit')"></el-input>
        </el-form-item>
        <el-form-item label="套餐名称：" :label-width="formLabelWidth">
          <el-input maxlength="40" v-model="matchedResult2.name" autocomplete="off" clearable placeholder="" disabled></el-input>
        </el-form-item>
        <!-- <el-form-item label="剩余次数：" :label-width="formLabelWidth">
          <el-input maxlength="40" v-model="matchedResult2.count" autocomplete="off" clearable placeholder="" disabled></el-input>
        </el-form-item> -->
        <el-form-item label="剩余时长：" :label-width="formLabelWidth">
          <el-input maxlength="40" v-model="matchedResult2.time" autocomplete="off" clearable placeholder="" disabled style="width:290px;"></el-input>
          <span style="padding-left:10px;">分钟</span>
        </el-form-item>

        <el-form-item label="位置：" :label-width="formLabelWidth" prop="position">
          <el-select v-model="certifyform.position" clearable placeholder="" class="mb20" disabled>
            <el-option v-for="(item, index) of bannerConfigAppSelectArr" :key="index" :label="item.label" :value="item.value" :disabled="item.disable"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称：" :label-width="formLabelWidth" prop="name">
          <el-input maxlength="40" v-model="certifyform.name" autocomplete="off" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="开始时间：" :label-width="formLabelWidth">
          <el-date-picker
            style="width:200px;"
            @change="handleChangeDatePicker"
            v-model="startDate1"
            type="date"
            :picker-options="pickerBeginOption"
            placeholder="选择日期"
            >
          </el-date-picker>
          <el-time-select
            style="width:150px;margin-left:10px;"
            @change="handleChangeDatePicker"
            v-model="startDate2"
            :picker-options="{
              start: '00:00',
              step: '00:30',
              end: '23:30'
            }"
            placeholder="选择时分">
          </el-time-select>
        </el-form-item>

        <el-form-item label="结束时间：" :label-width="formLabelWidth">
          <el-date-picker
            style="width:200px;"
            v-model="endDate1"
            @change="handleChangeDatePicker"
            :picker-options="pickerBeginOption"
            type="date"
            placeholder="选择日期"
            >
          </el-date-picker>
          <el-time-select
            style="width:150px;margin-left:10px;"
            v-model="endDate2"
            @change="handleChangeDatePicker"
            :picker-options="{
              start: '00:00',
              step: '00:30',
              end: '23:30'
            }"
            placeholder="选择时分">
          </el-time-select>
        </el-form-item>

        <!-- <el-form-item label="消耗广告位次数：" :label-width="formLabelWidth" prop="useAdPlaceQuantity">
          <el-input v-model.number="certifyform.useAdPlaceQuantity" autocomplete="off" clearable placeholder="请输入"></el-input>
        </el-form-item> -->

        <el-form-item label="消耗广告位时长：" :label-width="formLabelWidth" prop="useAdPlaceTime">
          <el-input v-model.number="certifyform.useAdPlaceTime" autocomplete="off" clearable placeholder="" disabled style="width:290px;"></el-input>
          <span style="padding-left:10px;">分钟</span>
        </el-form-item>


        <el-form-item label="排序：" :label-width="formLabelWidth" prop="sort">
          <el-input v-model.number="certifyform.sort" autocomplete="off" clearable placeholder="请输入" style="width:290px;"></el-input>
        </el-form-item>
        <el-form-item label="图片：" :label-width="formLabelWidth" prop="image">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :http-request="handleAvatarSuccessRUN.bind(file, 'FRONT')">
            <img v-if="certifyform.image" :src="certifyform.image" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item v-if="tag == 'isnewApp'" label="开屏页倒计时：" :label-width="formLabelWidth" prop="duration">
          <el-input v-model.number="certifyform.duration" autocomplete="off" clearable placeholder="请输入" style="width:290px;"></el-input>
        </el-form-item>
        <!-- <el-form-item label="备注：" :label-width="formLabelWidth" prop="remark">
          <el-input maxlength="200" v-model="certifyform.remark" autocomplete="off" clearable placeholder="请输入"></el-input>
        </el-form-item> -->
        <el-form-item label="配置连接：" :label-width="formLabelWidth">
          <el-form-item label="渠道来源：" :label-width="formLabelWidth" prop="urlType">
            <el-select v-model="certifyform.urlType" clearable placeholder="请选择" class="mb20" @change="handleUrlTypeChange">
              <el-option label="外链" :value="1"></el-option>
              <el-option label="内链" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="路由名称：" :label-width="formLabelWidth" prop="jumpLinkId">
            <el-select v-model="certifyform.jumpLinkId" clearable placeholder="请选择" @change="handleJumpLinkArrChange">
              <el-option v-for="(its, index) in jumpLinkArr" :key="index" :label="its.routeName" :value="its.jumpLinkId" :disabled="!its.status"></el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item label="参数名-参数值：" :label-width="formLabelWidth">
          <div v-for="(item, index) of paramsArr" :key="index">
            <el-col :span="11">
              <el-input :value="item.name" disabled></el-input>
            </el-col>
            <el-col class="line" :span="2">:</el-col>
            <el-col :span="11">
              <el-input v-model="item.value" autocomplete="off" clearable></el-input>
            </el-col>
          </div>
        </el-form-item>
        <!--注释提示-->
        <div style="background:#efefef;border:1px solid #ccc;border-radius:5px;padding:8px;font-size:13px;margin-left:20px;line-height:22px;">
          1. 【Banner 起止时间】与【消耗次广告位次数】属于联动关系<br>
          2.   每张Banner 展示停留3秒，则消耗1次 ；<br>
          （1）假设banner 时长为1小时，则需要<br>
          （2）消耗广告位次数 =  ( 1 × 60 分 × 60 秒 ) ÷ 3 秒 = 1200 次<br>
          3.  【剩余次数】小于以【banner起止时间】换算需要【消耗广告位次数】，则需要使用【剩余次数】来换算结束时间，对此广告进行拔正。<br>
          （1）假设开始时间为2022.12.31 00:00:00,结束时间2022.01.01 01:00:00<br>
          （2）【剩余次数】400 次 ；由【2】可知banner 时长1小时，需消耗 1200次 ，由此 banner 展示的结束时间需在拔正。<br>
          （3）【剩余次数】，换算可展示时长 = 400 次 × 3 秒 ÷ 60 秒/分 =20 分<br>
          （4）则拔正时间，展示时长为2022.12.31 00:00:00  - 2022.01.01 00:20:00<br>

          4.  【剩余时长】小于【banner起止时间】，则需要使用【剩余时长】来变更结束时间，对此广告进行拔正。<br>
          （1）假设开始时间为2022.12.31 00:00:00,结束时间2022.01.01 01:00:00<br>
          （2）【剩余时长】0.5小时 ；由【2】可知【banner起止时长】1小时，由此 banner 展示的结束时间需在拔正。<br>
          （3）则拔正时间，展示时长为2022.12.31 00:00:00  - 2022.01.01 00:30:00<br>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" v-show="!seeBool">确 定</el-button>
      </div>
    </el-dialog>

    <!--用户审核-->
    <el-dialog title="审核" :visible.sync="formVisibleAudit" width="30%">
      <el-dialog
        width="50%"
        title="广告位排期"
        :visible.sync="adEmptyVisible"
        append-to-body>
        <el-form v-loading="adEmptyLoading">
          <span>日期：</span>
            <el-date-picker
              style="width:200px;"
              v-model="endDateEmpty"
              @change="handleChangeDateEmpty"
              :picker-options="pickerBeginOption"
              type="date"
              placeholder="请选择日期查询"
              >
            </el-date-picker>
          <div class="adEmptyboxMain">
            <span v-if="morningList.length > 0" style="font-weight:bold;padding-top:20px;display:inline-block;">上午</span>
            <ul>
              <li v-for="(item, index) in morningList" :key="index"><p>{{item.timeStr}}</p><span>{{item.count}}/{{tag == 'isnewApp' ? 1 : 8}}</span></li>
            </ul>
            <span v-if="afternoonList.length > 0" style="font-weight:bold;">下午</span>
            <ul>
              <li v-for="(item, index) in afternoonList" :key="index"><p>{{item.timeStr}}</p><span>{{item.count}}/{{tag == 'isnewApp' ? 1 : 8}}</span></li>
            </ul>
          </div>
        </el-form>
          
      </el-dialog>
      
      <el-form :model="formAudit">
        <el-button type="primary" v-hasPermi="['ad_space:package_member:scheduling']" @click="showEmptyAds" size="mini" style="float:right;">查看广告空档</el-button><br>
        <el-form-item label="审核结果">
          <el-radio v-model="formAudit.result" :label="true">通过</el-radio>
          <el-radio v-model="formAudit.result" :label="false">拒绝</el-radio>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formAudit.remark" autocomplete="off" type="textarea" :rows="2" placeholder="请输入备注" maxlength="20" show-word-limit></el-input>
          <p style="font-size:13px;" v-if="$route.path == '/setting/startScreenConfV2'">注：针对开屏页审核弹窗修改，启用banner不能超过1张。</p>
          <p style="font-size:13px;" v-else>注：同一时间段启用banner不能超过8张。</p>
        </el-form-item>
       
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formVisibleAudit = false">取 消</el-button>
        <el-button type="primary" @click="handleAuditSave">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { setRoutLinkList } from "@/api/games";
import { upload, getCertificate } from "@/api/system/userlist";
import {compareVersion, replaceUnitlPrefixStr} from '@/utils/index';
import { adSetAudit_page, adSetAudit_buged, adSetAudit_add, adSetAudit_alter, adSetAudit_audit, adSetAudit_free} from "@/api/bannerConfig";
import { atManaCatchOneBy} from "@/api/adsTreasure";
export default {
  props: {
    bannerConfigAppSelectArr: Array,
    bannerConfigAppSelectObj: Object,
    tag: String
  },
  data() {
    let imgValidator = (rule, value, callback) => {
      if (!/\S/.test(value)) {
        callback(new Error('请上传图片'))
      } else {
        callback()
      }
    }
    return {
      h5ReadOnly: '',
      adEmptyLoading: false,
      currentType: '',
      afternoonList: [],
      morningList: [],
      endDateEmpty: '',
      curRowPosition: null,
      adEmptyVisible: false,
      curRowID: null,
      formVisibleAudit: false,
      formAudit: {
        result: true,
        remark: '',
      },

      queryParams: {
        type: 1,
        adSpaceOrderNo: '',
        inviteCode: '',
        mail: '',
        phone: '',
        sourceType: '',
        status: '',
      },

      findedMemberId: '',
      matchedResult: {
        phone: '',
        email: '',
        inviteCode: ''
      },
      matchedResult2: {
        name: '',
        count: '',
        time: ''
      },

      loading: false,
      dialogFormVisible: false,
      dialogTitle: '',
      certifyform: {
        adSpaceOrderNo: '',
        useAdPlaceQuantity: null,
        useAdPlaceTime: '',
        position: '',
        name: '',
        startTime: '',
        endTime: '',
        sort: '',
        image: '',
        remark: '',
        urlType: '',
        jumpLinkId: '',
        params: [],
        type: 1,
        duration: '',
      },
      rules: {
        adSpaceOrderNo: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        position: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        urlType: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        jumpLinkId: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        image: [
          { required: true, validator: imgValidator, trigger: 'blur,change' }
        ],
        position: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        sort: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { type: 'number', min: 1, message: '排序为数字且必须大于等于1', trigger: 'blur' },
        ],
        duration: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { type: 'number', min: 1, message: '开屏页倒计时为数字且必须大于等于1', trigger: 'blur' },
        ]
      },
      jumpLinkArr: [],// 路由
      paramsArr: [],// 参数
      formLabelWidth: '130px',
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      tableData: [],
      file: '',
      seeBool: false,
      operationType: 'add',
      startDate1: '',
      startDate2: '',
      endDate1: '',
      endDate2: '',

      pickerBeginOption: {
        disabledDate: (time) => {
          // 限制今天之前不可选择
          return time.getTime() < Date.now()-1 * 24 * 60 * 60 * 1000
        }
      },
    }
  },
  created () {
    // 1: app, 2: dApp
    this.currentType = this.$route.path == '/bannerConfig/appBanner' ? 1 : 2
    // tag: isnewApp新APP用户开屏页配置及审核
    if(this.tag == 'isnewApp'){
      this.currentType = 1
      this.queryParams.position = 99
    }
  },
  activated() {
    this.search();
    this.getCertificateRun();
  },
  mounted () {},
  methods: {
    rnd (n, m) {
      return Math.floor(Math.random() * (m - n) + n)
    },
    handleChangeDateEmpty () {
      this.adEmptyLoading = true
      adSetAudit_free({
        position: this.curRowPosition,
        dateStr: this.$dayjs(this.endDateEmpty).format('YYYY-MM-DD')
      }).then(response => {
        if (response.code == 200) {
          this.afternoonList = response.data?.afternoonList || []
          this.morningList = response.data?.morningList || []
        } else {
          this.afternoonList = []
          this.morningList = []
          this.$message.error(response?.message)
        }
        setTimeout(() => {
          this.adEmptyLoading = false
        }, this.rnd(1, 7) * 100)
      }).catch(e => {
        this.adEmptyLoading = false
        console.log(e)
      })
    },
    showEmptyAds () {
      this.adEmptyVisible = true
    },
    adSetAudit_bugedRun (opt) {
      adSetAudit_buged({
        orderNo: opt.orderNo,
        memberId: opt.memberId,
      }).then(response => {
        if (response.code == 200) {
          this.certifyform.position = response?.data?.position
          if (response.data.equityType == 1) {
            this.matchedResult2 = {
              name: response?.data?.adSpaceName,
              count: response?.data?.availableCount,
              time: ''
            }
          } else {
            this.matchedResult2 = {
              name: response?.data?.adSpaceName,
              count: '',
              time: response?.data?.availableCount,
            }
          }
        } else {
          this.$message.error(response.message)
        }
      }).catch(e => {
        console.log(e)
      })
    },
    handleChangeByOrderNo (ev) {
      let _opt = {
        orderNo: ev.target.value,
        memberId: this.findedMemberId,
      }
      this.adSetAudit_bugedRun(_opt)
    },
    handleChangeItp (val, type) {
      let _val = val.target.value
      if (type === 'inviteCode') {
        if (_val == '' || _val.length < 7) {
          this.$message.error('请输入正确的邀请码')
        } else {
          this.macth_phoneEmailInvite(
            {
              inviteCode: _val,
              phone: '',
              email: '',
            }
          )
        }
      } else if (type === 'phone') {
        if (_val == '' || _val.length < 11 || !(/^1[3456789]\d{9}$/.test(_val))) {
          this.$message.error('请输入正确的手机号')
        } else {
          this.macth_phoneEmailInvite(
            {
              inviteCode: '',
              phone: _val,
              email: '',
            }
          )
        }
      } else if (type === 'email') {
        if (_val == '' || !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(_val)) {
          this.$message.error('请输入正确的邮箱')
        } else {
          this.macth_phoneEmailInvite(
            {
              inviteCode: '',
              phone: '',
              email: _val,
            }
          )
        }
      }
    },
    macth_phoneEmailInvite (obj) {
      atManaCatchOneBy({
          inviteCode: obj.inviteCode,
          phone: obj.phone,
          email: obj.email,
        }).then(response => {
        if (+response.code === 200) {
          this.findedMemberId = response?.data?.id || ''
          this.matchedResult.inviteCode = response?.data?.inviteCode || ''
          this.matchedResult.phone = response?.data?.phone || ''
          this.matchedResult.email = response?.data?.email || ''
        } else {
          this.$message.error(response.message)
        }
      })
    },
    macth_taocanInfos () {},
    jumpToApiCloseRoute () {
      this.$router.push('/setting/apiEnableStatus')
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.search()
    },
    // 数据查询
    search (pgi) {
      if (pgi) this.pageIndex = pgi
      this.queryParams.type = this.currentType
      let _params = {
        currentPage: this.pageIndex,
        pageSize: this.pageSize,
        ...this.queryParams,
      }
      this.loading = true
      adSetAudit_page(_params).then(response => {
        if (response.code === 200) {
          this.tableData = (response.data.list || []).map(val => {
            let {position, ...a} = val
            let positionDesc = this.bannerConfigAppSelectArr.find(item => item.value == position)?.label || '-'
            return {
              position,
              positionDesc,
              ...a
            }
          });
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
        console.log(e)
      })
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.seeBool = false;
      this.operationType = 'add';
      
      // if(this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields(); // will happen error accidently
      this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields();
        this.matchedResult = {
          phone: '',
          email: '',
          inviteCode: ''
        }
        this.matchedResult2 = {
          name: '',
          count: '',
          time: ''
        }

        // certifyform.adSpaceOrderNo
        // certifyform.position
        // certifyform.name
        // certifyform.sort
        // certifyform.image

        this.certifyform = {
          adSpaceOrderNo: '',
          useAdPlaceQuantity: null,
          useAdPlaceTime: '',
          position: '',
          name: '',
          startTime: '',
          endTime: '',
          sort: '',
          image: '',
          remark: '',
          urlType: '',
          jumpLinkId: '',
          params: [],
          type: 1
        };
        this.paramsArr = [];
        this.startDate1 = '';
        this.startDate2 = '';
        this.endDate1 = '';
        this.endDate2 = '';
        if (this.tag == 'isnewApp') {
          this.certifyform.position = 99
        }
      })
      
    },
    handleAudit (row) {
      this.endDateEmpty = ''
      this.afternoonList.length = 0
      this.morningList.length = 0
      this.curRowID = row.id
      this.curRowPosition = row.position
      this.formVisibleAudit = true
    },
    handleAuditSave () {
      adSetAudit_audit(Object.assign({}, this.formAudit, {id: this.curRowID})).then(response => {
        if (response.code == 200) {
          this.msgSuccess('操作成功')
          this.search()
          this.formVisibleAudit = false
        } else {
          this.$message.error(response?.message)
        }
      }).catch(e => {
        this.formVisibleAudit = false
        console.log(e)
      })
    },
    handleEdit(row, seeBool = false) {
      this.seeBool = seeBool;
      this.operationType = 'edit';
      this.certifyform = Object.assign({}, row);
      this.handleUrlTypeChange(row.urlType, true);
      this.paramsArr = row.params;
      this.h5ReadOnly = row.sourceType
      this.macth_phoneEmailInvite({
        inviteCode: row?.inviteCode,
        phone: row?.phone,
        email: row?.email,
      })
      let _opt = {
        orderNo: row.adSpaceOrderNo,
        memberId: row.memberId,
      }
      this.adSetAudit_bugedRun(_opt)
      if(row.startTime && row.endTime) {
        let _startTimeStr =  this.stamp_to_dateTimeStr(row.startTime)
        let _endTimeStr =  this.stamp_to_dateTimeStr(row.endTime)
        this.startDate1 = _startTimeStr.split(' ')[0];
        this.startDate2 = _startTimeStr.split(' ')[1];
        this.endDate1 = _endTimeStr.split(' ')[0];
        this.endDate2 = _endTimeStr.split(' ')[1];
      }

      this.dialogFormVisible = true;
    },
    handleChangeDatePicker () {
      if (!this.startDate1 || !this.startDate2 || !this.endDate1 || !this.endDate2) {
        this.certifyform.useAdPlaceTime = 0
        console.log(`请选择完整的banner开始、结束时间`)
      } else {
        this.validSubmitTimerCore()
      }
    },
    validSubmitTimer () {
      if (!this.startDate1 || !this.startDate2 || !this.endDate1 || !this.endDate2) {
        this.$message.error(`请选择完整的banner开始、结束时间`)
        return false
      } else {
        this.validSubmitTimerCore()
      }
    },
    validSubmitTimerCore () {
      // 格式化banner开始、结束时间字符串
      let _startTimeStr = this.$dayjs(this.startDate1).format('YYYY-MM-DD') + ' ' + this.startDate2
      let _endTimeStr = this.$dayjs(this.endDate1).format('YYYY-MM-DD') + ' ' + this.endDate2
      console.log('开始时间string：', _startTimeStr)
      console.log('结束时间string：', _endTimeStr)
      // 日期时间字符串转时间戳
      let _startTimeStrToStamp = this.dateTimeStr_to_Stamp(_startTimeStr)
      let _endTimeStrToStamp = this.dateTimeStr_to_Stamp(_endTimeStr)
      if (_endTimeStrToStamp <= _startTimeStrToStamp) {
        this.$message.error(`banner结束时间必须大于开始时间`)
        return false
      } else {
        this.certifyform.startTime = _startTimeStrToStamp
        this.certifyform.endTime = _endTimeStrToStamp
        this.certifyform.useAdPlaceTime = (_endTimeStrToStamp - _startTimeStrToStamp)/60000 // millisecond to minute
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.certifyform.jumpLinkId) {
            this.certifyform.params = this.paramsArr;
          }
          this.certifyform.memberId = this.findedMemberId
          this.certifyform.type = this.currentType
          this.validSubmitTimer()
          console.log(this.certifyform, 'cer')
          if(this.operationType == 'edit') {
            adSetAudit_alter(this.certifyform).then(response => {
              if (response.code === 200) {
                this.msgSuccess(`保存成功`)
                this.dialogFormVisible = false;
                this.search(1);
              } else {
                this.msgSuccess(response.message)
                this.dialogFormVisible = false
              }
            })
          }else {
            adSetAudit_add(this.certifyform).then(response => {
              if (response.code === 200) {
                this.msgSuccess(`保存成功`)
                this.dialogFormVisible = false;
                this.search(1);
              } else {
                this.msgSuccess(response.message)
                this.dialogFormVisible = false
              }
            })
          }
        }
      })
    },
    // 选择渠道来源
    handleUrlTypeChange (val, isBool) {
      if(!isBool) {
        this.certifyform.jumpLinkId = '';
        this.paramsArr = [];
      }
      // 获取路由 linkType: 1外链2内链
      setRoutLinkList({linkType: val, appPackageType: 2 }).then(response => {
        if (+response.code === 200) {
          this.jumpLinkArr = response.data.list || [];
        } else {
          this.jumpLinkArr = []
        }
      }).catch(e => {})
    },
    // 选择路由
    handleJumpLinkArrChange (val) {
      this.paramsArr = [];
      this.jumpLinkArr.forEach(item => {
        if(val === item.jumpLinkId) {
          this.paramsArr = item.params;
        }
      })
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
        switch(type) {
          case 'FRONT':
            let ossFileUrl = _res.res.requestUrls[0]
            //如果CDN域名不为空，则替换成CDN域名
            if(this.certificateInfos.bucketCdnUrl){
              ossFileUrl = replaceUnitlPrefixStr(ossFileUrl, this.certificateInfos.endpoint, this.certificateInfos.bucketCdnUrl);
            }
            this.certifyform.image = ossFileUrl
            this.$refs['ruleForm'].clearValidate('image')
            break;
        }
      } catch (e) {
        console.log(e)
      }
    },
    stamp_to_dateTimeStr (stamp, isNeedsecond) {
      /**
       * 根据时间戳(毫秒，13位) -> 日期时间字符串(格式：2021-11-2 08:30)。
       * 是否需要显示秒：isNeedsecond：true｜false
       */
      return isNeedsecond ? this.$dayjs(stamp).format('YYYY-MM-DD HH:mm:ss') : this.$dayjs(stamp).format('YYYY-MM-DD HH:mm')
    },
    dateTimeStr_to_Stamp (dateTimeStr) {
      /**
       * 日期时间字符串 -> 时间戳(毫秒，13位)
       * dateTimeStr的格式：
       * 1、日期：2021-11-02
       * 2、时间(也可以后面补全秒)：08:30
       */
      return this.$dayjs(dateTimeStr).valueOf()
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
    text-align: center;
  }
}
</style>
<style lang="scss">
.tab-content{
  .certifyForm form{
    padding-right:40px;
    .el-select, .el-date-editor{
      width: 100%;
    }
  }
  .el-form-item__content{
    position: relative;
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
.adEmptyboxMain{
  li{
    display: inline-block;
    background: rgba(242, 242, 242, 1);
    border-radius: 10px;
    padding: 10px;
    margin-right:10px;
    margin-bottom: 10px;
    text-align: center;
    font-weight: bold;
    p{
      padding: 0;
      margin:0;
    }
    span{
      padding-top: 5px;
      display: inline-block;
    }
  }
}
</style>