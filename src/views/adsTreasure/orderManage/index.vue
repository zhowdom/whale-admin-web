<template>
  <div class="userpower_Wrapper">
        <div class="topshow">
            <el-form :model="queryParams" ref="queryForm" :inline="true" class="mytopformstyle">
              <el-form-item label="交易单号" prop="tickCode">
                <el-input clearable  maxlength="30" v-model="queryParams.tickCode" placeholder="请输入"></el-input>
              </el-form-item>
              <!-- <el-form-item label="用户昵称" prop="buyerNickName">
                  <el-input clearable  maxlength="30" v-model="queryParams.buyerNickName" placeholder="请输入"></el-input>
              </el-form-item> -->
              <el-form-item label="用户手机号" prop="buyerPhone" >
                  <el-input clearable  maxlength="11" v-model="queryParams.buyerPhone" placeholder="请输入手机号"></el-input>
              </el-form-item>
              <el-form-item label="用户邮箱" prop="buyerEmail" >
                  <el-input clearable v-model="queryParams.buyerEmail" placeholder="请输入邮箱"></el-input>
              </el-form-item>
              <!-- <el-form-item label="广告主昵称" prop="sellerNickName">
                  <el-input clearable  maxlength="30" v-model="queryParams.sellerNickName" placeholder="请输入"></el-input>
              </el-form-item> -->
              <el-form-item label="广告主手机号" prop="sellerPhone" >
                  <el-input clearable  maxlength="11" v-model="queryParams.sellerPhone" placeholder="请输入手机号"></el-input>
              </el-form-item>
              <el-form-item label="广告邮箱" prop="sellerEmail" >
                  <el-input clearable v-model="queryParams.sellerEmail" placeholder="请输入邮箱"></el-input>
              </el-form-item>
              <el-form-item label="名称" prop="name">
                <el-select v-model="queryParams.name" clearable placeholder="请选择">
                  <el-option v-for="(its, index) in atNameListsResult" :key="index" :label="its.label" :value="its.label"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="购买方向" prop="tickType">
                <el-select v-model="queryParams.tickType" clearable placeholder="请选择">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="买入" :value="2"></el-option>
                  <el-option label="卖出" :value="1"></el-option>
                </el-select>
            </el-form-item>
          <!-- <el-form-item label="状态" prop="orderStatus">
              <el-select v-model="queryParams.orderStatus" clearable placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option label="待付款" :value="1"></el-option>
                <el-option label="待收款" :value="2"></el-option>
                <el-option label="已完成" :value="3"></el-option>
                <el-option label="已取消" :value="4"></el-option>
              </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="申诉状态" prop="appealStatus">
              <el-select v-model="queryParams.appealStatus" clearable placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option label="未申诉" :value="1"></el-option>
                <el-option label="申诉中" :value="2"></el-option>
                <el-option label="已完成" :value="3"></el-option>
                <el-option label="撤销申诉" :value="4"></el-option>
              </el-select>
          </el-form-item> -->
          <el-form-item label="下单时间" prop="jointimeSelected">
              <el-date-picker
                v-model="jointimeSelected"
                type="daterange"
                value-format="timestamp"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            
            <el-form-item label="更新时间" prop="jointimeSelected2">
              <el-date-picker
                v-model="jointimeSelected2"
                type="daterange"
                value-format="timestamp"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="兑换单号" prop="exchangeCode">
                <el-input clearable  maxlength="30" v-model="queryParams.exchangeCode" placeholder="请输入"></el-input>
            </el-form-item>
            
            <el-form-item label="" style="border:none;">
                <el-button v-hasPermi="['advertising:order:page']" :loading="loading" type="primary" icon="el-icon-search" @click="search(1)">查询</el-button>
            </el-form-item>
            </el-form>
        </div>

        <div class="tttfBox clearfix">
          <ul>
            <!-- <li>
              <p>全部</p>
              <span>{{toufuRes.totalNum}}</span>
            </li>
            <li>
              <p>待付款</p>
              <span>{{toufuRes.waitPaymentNum}}</span>
            </li>
            <li>
              <p>待收款</p>
              <span>{{toufuRes.pendingPaymentNum}}</span>
            </li>
            <li>
              <p>申诉中</p>
              <span>{{toufuRes.appealNum}}</span>
            </li> -->
            <li>
              <p>已完成</p>
              <span>{{toufuRes.finishNum}}</span>
            </li>
            <!-- <li>
              <p>已取消</p>
              <span>{{toufuRes.cancelNum}}</span>
            </li> -->
          </ul>
        </div>
        <!--table-->
        <el-table
        :data="tableData"
        border
        v-loading="loading"
        class="userpowerbox"
        style="width: 100%">
            <el-table-column
                prop="tickCode"
                align="center"
                label="交易单号">
            </el-table-column>
            <el-table-column
                align="center"
                prop="exchangeCode"
                label="兑换单号">
            </el-table-column>
            <el-table-column
                prop="name"
                align="center"
                label="名称">
            </el-table-column>
            <el-table-column
                prop="tickType"
                align="center"
                maxlength="11"
                label="交易方向">
                <template scope="scope">
                  <p v-if="+scope.row.tickType === 1">卖出</p>
                  <p v-else-if="+scope.row.tickType === 2">买入</p>
                </template>
            </el-table-column>
            <el-table-column
                prop="itemNum"
                align="center"
                maxlength="11"
                label="数量">
            </el-table-column>
            <el-table-column
                prop="salePrice"
                align="center"
                maxlength="11"
                label="单价（USDT）">
            </el-table-column>
            <el-table-column
                prop="orderAmount"
                align="center"
                maxlength="11"
                label="总价（USDT）">
            </el-table-column>
            <el-table-column
                prop="serviceAmount"
                align="center"
                maxlength="11"
                label="服务费（Candy）">
            </el-table-column>
            <!-- <el-table-column
                prop="sourceType"
                align="center"
                maxlength="11"
                label="广告宝来源">
                <template scope="scope">
                  <p v-if="+scope.row.sourceType === 1">市场买入</p>
                  <p v-else-if="+scope.row.sourceType === 0">自行兑换</p>
                </template>
            </el-table-column> -->
            <el-table-column
                prop="buyerNickName"
                align="center"
                maxlength="11"
                label="用户昵称">
            </el-table-column>
            <el-table-column
                prop="buyerPhone"
                align="center"
                maxlength="11"
                label="用户手机号">
            </el-table-column>
            <el-table-column
                prop="buyerEmail"
                align="center"
                maxlength="11"
                label="用户邮箱">
            </el-table-column>
            <el-table-column
                prop="sellerNickName"
                align="center"
                maxlength="11"
                label="广告主昵称">
            </el-table-column>
            <el-table-column
                prop="sellerPhone"
                align="center"
                maxlength="11"
                label="广告主手机号">
            </el-table-column>
            <el-table-column
                prop="sellerEmail"
                align="center"
                maxlength="11"
                label="广告主邮箱">
            </el-table-column>
            <el-table-column
                prop="createAt"
                align="center"
                width="180"
                label="下单时间">
                <template slot-scope="{row}">
                  {{row.createAt ? $dayjs(row.createAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
                </template>
            </el-table-column>
            <el-table-column
                prop="modifyAt"
                align="center"
                width="180"
                label="更新时间">
                <template slot-scope="{row}">
                  {{row.modifyAt ? $dayjs(row.modifyAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
                </template>
            </el-table-column>
            <el-table-column
                prop="appealStatus"
                align="center"
                maxlength="11"
                label="状态">
                <template scope="scope">
                  <p v-if="+scope.row.orderStatus === 3">已完成</p>
                </template>
            </el-table-column>
            <!-- <el-table-column
                prop="orderStatus"
                align="center"
                maxlength="11"
                label="状态">
                <template scope="scope">
                  <p v-if="+scope.row.orderStatus === 1">待付款</p>
                  <p v-else-if="+scope.row.orderStatus === 2">待收款</p>
                  <p v-else-if="+scope.row.orderStatus === 3">已完成</p>
                  <p v-else-if="+scope.row.orderStatus === 4">已取消</p>
                </template>
            </el-table-column> -->
            <!-- <el-table-column
                prop="appealStatus"
                align="center"
                maxlength="11"
                label="申诉状态">
                <template scope="scope">
                  <p v-if="+scope.row.appealStatus === 1">未申诉</p>
                  <p v-else-if="+scope.row.appealStatus === 2">申诉中</p>
                  <p v-else-if="+scope.row.appealStatus === 3">已完成</p>
                  <p v-else-if="+scope.row.appealStatus === 4">撤销申诉</p>
                </template>
            </el-table-column> -->
            <el-table-column
                prop="remark"
                align="center"
                maxlength="11"
                label="备注">
            </el-table-column>
            <el-table-column
                prop="phone"
                align="center"
                maxlength="11"
                label="操作">
                <template scope="scope">
                  <el-button type="text" @click="w2seeinClick(scope.row.id)" v-if="+scope.row.orderStatus === 3">查看</el-button>
                  <!-- <el-button v-hasPermi="['advertising:order:audit']" v-if="+scope.row.appealStatus === 2" type="text" @click="w2AuditClick(scope.row.id)">审核</el-button> -->
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

        <!--审核弹窗-->
        <el-dialog title="申诉订单审核" :visible.sync="dialogFormVisible">
          <el-form :model="formw2">
            <el-form-item label="审核结果" :label-width="formLabelWidth">
              <el-radio v-model="formw2.resultType" :label="0">经核查，确认卖方已收款 ，订单已完成</el-radio><br>
              <el-radio v-model="formw2.resultType" :label="2">经核查，确认买方未付款 ，订单已取消</el-radio>
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth">
              <el-input type="textarea" v-model="formw2.remark" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="" :label-width="formLabelWidth">
              <el-checkbox v-model="formw2.maliciousStatus">是否属于恶意申诉</el-checkbox>
            </el-form-item>
            <el-form-item label="" :label-width="formLabelWidth">
              <p>
                恶意申诉是指：<br>
                1. 购买方尚未付款，却确认已付款，且发起申诉；<br>
                2. 出售方已收款，但未确认收款，且发起申诉。
              </p>
            </el-form-item>
            
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="savew2">确 定</el-button>
          </div>
        </el-dialog>

        <!--查看-->
        <el-dialog
          title=""
          :visible.sync="dialogVisible"
          width="66%">

        <div class="mglls">
          <p style="margin-left:0;" class="mgStatus hdst" v-if="+seeinMsg.appealStatus === 2">申诉中<span v-show="seeinMsg.remark">({{seeinMsg.remark}})</span></p>
          <p style="margin-left:0;" class="mgStatus hdst" v-else-if="+seeinMsg.orderStatus === 1">待付款<span v-show="seeinMsg.orderPayExpire > 0">({{toTimer(seeinMsg.orderPayExpire)}}内完成付款)</span></p>
          <p style="margin-left:0;" class="mgStatus hdst" v-else-if="+seeinMsg.orderStatus === 2">待收款<span v-show="seeinMsg.orderPayExpire > 0">({{toTimer(seeinMsg.orderPayExpire)}}内确认收款，否则买方可以发起申诉)</span></p>
          <p style="margin-left:0;" class="mgStatus hdst" v-else-if="+seeinMsg.orderStatus === 3">已完成<span v-show="seeinMsg.remark">({{seeinMsg.remark}})</span></p>
          <p style="margin-left:0;" class="mgStatus hdst" v-else-if="+seeinMsg.orderStatus === 4">已取消<span v-show="seeinMsg.remark">({{seeinMsg.remark}})</span></p>
        </div>

          <div>
            <h3>交易双方信息</h3>
            <div class="mglls">
              <p><span>用户昵称：</span><span>{{seeinMsg.buyerNickName}}</span></p>
              <p><span>用户手机号：</span><span>{{seeinMsg.buyerPhone}}</span></p>
              <p><span>用户邮箱：</span><span>{{seeinMsg.buyerEmail}}</span></p>
              <p><span>广告商呢称：</span><span>{{seeinMsg.sellerNickName}}</span></p>
              <p><span>广告商手机号：</span><span>{{seeinMsg.sellerPhone}}</span></p>
              <p><span>广告商邮箱：</span><span>{{seeinMsg.sellerEmail}}</span></p>
            </div>
          </div>

          <div>
            <h3>订单信息</h3>
            <div class="mglls">
              <p><span>交易单号：</span><span>{{seeinMsg.tickCode}}</span></p>
            <p><span>广告宝名称：</span><span>{{seeinMsg.name}}</span></p>
            <p><span>交易方向：</span><span>{{+seeinMsg.tickType === 2 ? '买入' : '卖出'}}</span></p>
            <p><span>交易数量：</span><span>{{seeinMsg.itemNum}}</span>个</p>
            <p><span>交易单价：</span><span>{{seeinMsg.salePrice}}</span>USDT</p>
            <p><span>交易总价：</span><span>{{seeinMsg.orderAmount}}</span>USDT</p>
            <p><span>服务费：</span><span>{{seeinMsg.serviceAmount}}</span>Candy</p>
            <p><span>下单时间：</span><span>{{seeinMsg.createAt ? $dayjs(seeinMsg.createAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}</span></p>
            <!-- <p><span>广告宝来源：</span><span>{{+seeinMsg.sourceType === 0 ? '自行兑换' : '市场买入'}}</span></p> -->
            <p><span>兑换单号：</span><span>{{seeinMsg.exchangeCode}}</span></p>
            </div>
            
          </div>

          <div v-if="seeinMsg.account">
            <h3>收款信息</h3>
            <div class="mglls">
            <div v-for="item in seeinMsg.account" :key="item.channelType" class="clearfix" style="margin-bottom:10px;">
              <div class="fl" style="padding-right:10px;width:80px;">{{item.channelType|valTransfer}}</div>
              <div class="fl" v-for="(vs, index) in item.accountResultList" :key="index">
                <span style="margin-right:10px;">{{vs.name}}</span>
                <span style="margin-right:10px;">{{vs.account}}</span>
                <span style="margin-right:10px;">{{vs.bank}}</span>
              </div>
            </div>

            </div>
          </div>

          <div v-if="seeinMsg.voucher && seeinMsg.voucher.length > 0">
            <h3>付款凭证</h3>
            <div class="mglls">
            <div class="clearfix">
              <div class="fl">付款凭证：</div>
              <div class="fl rela" style="height:100px;" v-if="seeinMsg.voucher && seeinMsg.voucher.length > 0">
                <span class="ctImgs" v-if="seeinMsg.voucher">共{{seeinMsg.voucher.length}}张</span>
                <el-image
                v-if="seeinMsg.voucher"
                style="width: 100px; height: 100px"
                :src="seeinMsg.voucher[0]" 
                :preview-src-list="seeinMsg.voucher">
              </el-image>
              </div>
            </div>
            </div>
          </div>

          <div v-if="seeinMsg.plaintiffAppeal">
            <h3>发起申诉人信息</h3>
            <div class="mglls">
            <div>
              <p><span>发起方：</span><span>{{+seeinMsg.plaintiffAppeal.memberType === 1 ? '用户' : '广告商'}}</span></p>
              <p><span>发起人昵称：</span><span>{{seeinMsg.plaintiffAppeal.memberNickName}}</span></p>
              <p><span>发起人真实姓名：</span><span>{{seeinMsg.plaintiffAppeal.memberName}}</span></p>
              <p><span>发起人手机号：</span><span>{{seeinMsg.plaintiffAppeal.memberPhone}}</span></p>
              <p><span>申诉理由：</span><span>{{seeinMsg.plaintiffAppeal.reason}}</span></p>
              <div class="clearfix">
                <div class="fl">申诉凭证：</div>
                <div class="fl rela" style="height:100px;" v-if="seeinMsg.plaintiffAppeal.voucher && seeinMsg.plaintiffAppeal.voucher.length > 0">
                  <span class="ctImgs" v-if="seeinMsg.plaintiffAppeal.voucher">共{{seeinMsg.plaintiffAppeal.voucher.length}}张</span>
                  <el-image
                  v-if="seeinMsg.plaintiffAppeal.voucher"
                  style="width: 100px; height: 100px"
                  :src="seeinMsg.plaintiffAppeal.voucher[0]" 
                  :preview-src-list="seeinMsg.plaintiffAppeal.voucher">
                </el-image>
                </div>
              </div>
            </div>
            </div>
          </div>

          <div v-if="seeinMsg.defendantAppeal">
            <h3>被申诉人信息</h3>
            <div class="mglls">
            <div>
              <p><span>被申诉方：</span><span>{{+seeinMsg.defendantAppeal.memberType === 1 ? '用户' : '广告商'}}</span></p>
              <p><span>被申诉方昵称：</span><span>{{seeinMsg.defendantAppeal.memberNickName}}</span></p>
              <p><span>被申诉方真实姓名：</span><span>{{seeinMsg.defendantAppeal.memberName}}</span></p>
              <p><span>被申诉方手机号：</span><span>{{seeinMsg.defendantAppeal.memberPhone}}</span></p>
              <p><span>申诉理由：</span><span>{{seeinMsg.defendantAppeal.reason}}</span></p>
              <div class="clearfix">
                <div class="fl">举证：</div>
                <div class="fl rela" style="height:100px;" v-if="seeinMsg.defendantAppeal.voucher && seeinMsg.defendantAppeal.voucher.length > 0">
                  <span class="ctImgs" v-if="seeinMsg.defendantAppeal.voucher">共{{seeinMsg.defendantAppeal.voucher.length}}张</span>
                  <el-image
                  v-if="seeinMsg.defendantAppeal.voucher"
                  style="width: 100px; height: 100px"
                  :src="seeinMsg.defendantAppeal.voucher[0]" 
                  :preview-src-list="seeinMsg.defendantAppeal.voucher">
                </el-image>
                </div>
              </div>
            </div>
            </div>
          </div>

          <div v-if="seeinMsg.processingResult && seeinMsg.processingResult.length > 0">
            <h3>申诉处理结果</h3>
            <div class="mglls">
            <p v-for="(its, index) in seeinMsg.processingResult" :key="index" class="hdst">
              <i>{{index+1}}、</i>{{its}}
            </p>
            </div>
          </div>


          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>


  </div>
</template>

<script>
import { atNameLists, atOrderQuery, atOrderSeeIn, atOrderAudit, atOrderStatistics } from "@/api/adsTreasure";
  export default {
    components: {},
    data () {
      return {
        formLabelWidth: '120px', // 新增修改ed
        loading: false,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        queryParams: {
          tickCode: '',
          buyerNickName: '',
          buyerPhone: '',
          buyerEmail: '',
          sellerNickName: '',
          sellerPhone: '',
          sellerEmail: '',
          tickType: '',
          name: '',
          orderStatus: '',
          appealStatus: '',
          exchangeCode: '',
        },
        formw2: {
          id: null,
          maliciousStatus: true,
          remark: "",
          resultType: 0
        },
        seeinMsg: {
          account: [
            {
              accountResultList: [
                {
                  account: "",
                  bank: "",
                  name: ""
                }
              ],
              channelType: 0
            }
          ],
          appealStatus: 0,
          buyerName: "",
          buyerNickName: "",
          buyerPhone: "",
          buyerEmail: "",
          createAt: "",
          defendantAppeal: {
            memberName: "",
            memberNickName: "",
            memberPhone: "",
            memberType: 0,
            reason: "",
            voucher: []
          },
          id: 0,
          itemNum: 0,
          name: "",
          orderAmount: 0,
          orderPayExpire: 0,
          orderStatus: 0,
          plaintiffAppeal: {
            memberName: "",
            memberNickName: "",
            memberPhone: "",
            memberType: 0,
            reason: "",
            voucher: []
          },
          processingResult: [],
          releaseStatus: 0,
          remark: "",
          salePrice: 0,
          sellerName: "",
          sellerNickName: "",
          sellerPhone: "",
          sellerEmail: "",
          serviceAmount: 0,
          sourceType: 0,
          tickCode: "",
          tickType: 0,
          voucher: []
        },
        dialogVisible: false,
        dialogFormVisible: false,
        jointimeSelected: '',
        jointimeSelected2: '',
        toufuRes: {},
        tableData: [],
        atNameListsResult: []
      }
    },
    created () {
      this.atNameListsRun()
    },
    mounted () {
      this.search()
    },
    filters: {
      valTransfer (val) {
        if (+val === 1) {
          return '支付宝'
        } else if (+val === 2) {
          return '微信'
        } else if (+val === 3) {
          return '银联'
        }
      }
    },
    watch: {},
    methods: {
      atNameListsRun () {
        atNameLists().then(response => {
          if (+response.code === 200) {
            this.atNameListsResult = response.data.list || []
          } else {
            this.atNameListsResult = []
            this.$message.error(response.message)
          }
        })
      },
      toTimer (msd) {
        let time = parseFloat(msd) / 1000;
        if (null != time && "" != time) {
            if (time > 60 && time < 60 * 60) {
                time = parseInt(time / 60.0) + "分" + parseInt((parseFloat(time / 60.0) -
                    parseInt(time / 60.0)) * 60) + "秒";
            }
            // else if (time >= 60 * 60 && time < 60 * 60 * 24) {
            else if (time >= 60 * 60) {
                time = parseInt(time / 3600.0) + "时" + parseInt((parseFloat(time / 3600.0) -
                    parseInt(time / 3600.0)) * 60) + "分" +
                    parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                    parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";
            }
            else {
                time = parseInt(time) + "秒";
            }
        }
        return time;
      },
      w2seeinClick (id) {
        this.dialogVisible = true
        atOrderSeeIn(
          {
            id
          }
        ).then(response => {
          if (+response.code === 200) {
            this.seeinMsg = response.data
          } else {
            this.$message.error(response.message)
          }
        })
      },
      w2AuditClick (id) {
        this.dialogFormVisible = true
        this.formw2.id = id
        this.formw2.remark = ''
      },
      savew2 () {
        atOrderAudit(
          this.formw2
        ).then(response => {
          if (+response.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              'duration': 1000,
              onClose: () => {
                this.dialogFormVisible = false
                this.search(this.pageSize)
              }
            })
          } else {
            this.$message.error(response.message)
          }
        })
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.search()
      },
      search (pgi) {
        this.$refs['queryForm'].validate((valid) => {
          if (valid) {
            if (pgi) this.pageIndex = pgi
            let datetime = []
            let datetime2 = []
            datetime = this.jointimeSelected
            datetime2 = this.jointimeSelected2
            let _params = {
              currentPage: this.pageIndex,
              pageSize: this.pageSize,
              createAtEnd: datetime ? this.$dayjs(datetime[1]).format('YYYY-MM-DD') : '',
              createAtStart: datetime ? this.$dayjs(datetime[0]).format('YYYY-MM-DD') : '',
              modifyAtEnd: datetime2 ? this.$dayjs(datetime2[1]).format('YYYY-MM-DD') : '',
              modifyAtStart: datetime2 ? this.$dayjs(datetime2[0]).format('YYYY-MM-DD') : '',
              ...this.queryParams
            }
           if(_params.name == '全部') _params.name = ''
            this.loading = true
            atOrderQuery(_params).then(response => {
                if (+response.code === 200) {
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
              console.log(e)
            })
            atOrderStatistics(_params).then(response => {
                if (+response.code === 200) {
                this.toufuRes = response.data
                } else {
                  this.toufuRes = {}
                  this.$message.error(response.message)
              }
            }).catch(e => {
              console.log(e)
            })
          }
        })
      }
    }
  }
</script>

<style>
.ctImgs{
  position: absolute;bottom: 0px;left: 0px;z-index: 10;background: rgba(0,0,0,.5);display: block;width: 100%;text-align: center;color: #fff;
}
.mglls{
  padding-left: 80px;
}
.hdst{
  background:#f2f2f2;border-radius:5px;padding:20px 10px;width:calc(100% - 80px);
}
.mgStatus{
  color: #F59A23;
  font-weight: bold;
  width:calc(100% - 80px);
  margin-left: 80px;
  font-size: 17px;
}
.mgStatus span{
  color: #333;
  font-size: 15px;
  padding-left: 10px;
}
.tttfBox{
  padding-bottom: 20px;
}
.tttfBox ul li {
  padding: 10px;
  text-align: center;
  border:1px solid #ccc;
  border-radius: 3px;
  float: left;
  margin-right:20px;
}
.tttfBox ul li p{
  padding: 0;
  margin: 0;
  padding-bottom: 5px;
}
.userpower_Wrapper{
    padding: 20px;
}
 .userpower_Wrapper .topshow ul{
     margin-left: -36px;
 }
 .userpower_Wrapper .topshow li{
    padding: 5px;
    float: left;
    list-style: none;
    margin-right: 10px;
    border: 1px solid #ccc;
    border-radius:3px;
    margin-bottom: 10px;
    font-size: 13px;
 }
 .userpower_Wrapper .el-form-item{
   margin-bottom: 0!important;
   border: 1px solid #ccc;
   border-bottom: none;
 }
 .userpower_Wrapper .el-form-item:last-child{
   border-bottom: 1px solid #ccc;
 }
 .userpower_Wrapper .el-form-item__label,.userpower_Wrapper .el-form-item__content{
   padding: 10px!important;
 }
 .mytopformstyle .el-form-item{
   border: none;
 }
</style>

