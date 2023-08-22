<template>
  <div class="gamesWraper" style="padding:20px;">
    <el-form ref="formJeweltake" :model="formJeweltake" label-width="60px"  :inline="true">
       <el-form-item label="商品描述" label-width="100px">
        <el-input v-model.trim="formJeweltake.describe" clearable></el-input>
      </el-form-item>
      <el-form-item label="期数" label-width="100px">
        <el-input v-model.trim="formJeweltake.periodsNum" clearable></el-input>
      </el-form-item>
   
    <el-form-item>
      <el-button v-hasPermi="['goods:treasure:save']" type="primary" @click="editOrSee(1)" style="margin-bottom:20px;" :loading="loadingBigTable">新增</el-button>
    <el-button v-hasPermi="['goods:treasure:page']" type="primary" @click="queryAllGameDeskList(1)" style="margin-bottom:20px;" :loading="loadingBigTable">查询</el-button>
    </el-form-item>
  </el-form>

    
    
    <el-table
      :data="tableData"
      v-loading="loadingBigTable"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="periodsNum"
        label="期数">
      </el-table-column>
      <el-table-column
        prop="primaryImage"
        width="120"
        label="商品主图">
        <template scope="scope">
          <img style="width:88px;height:88px;" :src="scope.row.primaryImage" />
        </template>
      </el-table-column>
      <el-table-column
        prop="describe"
        label="商品描述">
      </el-table-column>
      <el-table-column
        prop="totalWhalePeas"
        label="总需Candy（Candy）">
      </el-table-column>
      <el-table-column
        prop="unitWhalePeas"
        label="每份最小单位（Candy）">
      </el-table-column>
      <el-table-column
        prop="maxBuyNum"
        label="每人最大可认购份数">
      </el-table-column>
      <el-table-column
        prop="startTime"
        width="160"
        label="开始时间">
        <template slot-scope="{row}">
          {{row.startTime ? $dayjs(row.startTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="endTime"
        width="160"
        label="结束时间">
        <template slot-scope="{row}">
          {{row.endTime ? $dayjs(row.endTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="sort"
        label="推荐商品排序">
      </el-table-column> -->
      <el-table-column
        prop="countDown"
        width="160"
        label="公布中奖时间">
        <template slot-scope="{row}">
          <span v-if="row.countDown.day">{{row.countDown.day}}天</span>
          <span v-if="row.countDown.hour">{{row.countDown.hour}}小时</span>
          <span v-if="row.countDown.min">{{row.countDown.min}}分钟</span>
          <span v-if="row.countDown.sec">{{row.countDown.sec}}秒</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="couponNo"
        label="引用优惠券编号">
        <template slot-scope="{row}">
          <span @click="showCouponInfos(row.couponId)" style="text-decoration:underline;color:#1890ff;cursor:pointer;">{{row.couponNo}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="isGiveCoupon"
        align="center"
        width="200"
        label="优惠券状态">
        <template scope="scope">
          <el-switch
          v-hasPermi="['goods:treasure_coupon:switch']"
          v-model="scope.row.isGiveCoupon"
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
        prop="sort"
        width="160"
        label="排序">
      </el-table-column>
      <el-table-column
        prop="createdAt"
        width="160"
        label="创建时间">
        <template slot-scope="{row}">
          {{row.createdAt ? $dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="processStatus"
        width="160"
        label="商品状态">
        <template slot-scope="{row}">
          <p v-if="+row.processStatus === 1">待上架</p>
          <p v-else-if="+row.processStatus === 2">进行中</p>
          <p v-else-if="+row.processStatus === 3">已结束（后台下架）</p>
          <p v-else-if="+row.processStatus === 4">已结束（未达标）</p>
          <p v-else-if="+row.processStatus === 5">已结束（已达标）</p>
          <p v-else-if="+row.processStatus === 6">已开奖</p>
        </template>
      </el-table-column>



      <el-table-column
        width="390"
        prop="date"
        label="操作">
        <template scope="scope">
        <el-button type="text" @click="editOrSee(0, scope.row)">查看</el-button>
        <el-button v-if="+scope.row.processStatus === 1" v-hasPermi="['goods:treasure:edit']" type="text" @click="editOrSee(2, scope.row)">编辑</el-button>
        <el-button v-if="+scope.row.processStatus === 1" v-hasPermi="['goods:treasure:up']" type="text" @click="upStoreClick(scope.row)">上架</el-button>
        <el-button v-if="+scope.row.processStatus === 2" v-hasPermi="['goods:treasure:down']" type="text" @click="downStoreClick(scope.row)">下架</el-button>
        <el-button v-if="+scope.row.processStatus === 1 && scope.row.couponId" v-hasPermi="['goods:treasure_coupon:change']" type="text" @click="switchCouponClick(scope.row, 'alter')">更换优惠券</el-button>
        <el-button v-if="+scope.row.processStatus === 1 && !scope.row.couponId" v-hasPermi="['goods:treasure_coupon:setting']" type="text" @click="refuseCouponClick(scope.row, 'add')">引用优惠券</el-button>
        <el-button v-if="+scope.row.processStatus === 1" v-hasPermi="['goods:treasure:del']" type="text" @click="removeGameRule(scope.row)">删除</el-button>
        <el-button v-hasPermi="['goods:treasure:sort_change']" type="text" @click="changeSortGameRule(scope.row)">修改排序</el-button>
      </template>
      </el-table-column>

    </el-table>
    <el-pagination
    style="padding-top:20px;"
    @current-change="queryAllGameDeskList"
    :page-sizes="[10, 20, 30]"
    @size-change="handleSizeChangeList"
    :current-page.sync="pageIndexList"
    :page-size="pageSizeList"
    layout="total, sizes, prev, pager, next, jumper"
    :total="totalPageList">
    </el-pagination>

    <!--查看/新增/修改-->

    <el-dialog :title="editOrSeeTitle" :visible.sync="dialogFormVisibleck" width="59%">
      <el-form :model="formck" ref="queryForm" :rules="rulesTop" class="requiredStart">

        <h3 v-show="+editOrSeeStatus === 0">期数：第{{clickRowData.periodsNum}}期</h3>

        <h3>商品详情<el-button v-hasPermi="['goods:treasure_template:page']" v-show="+editOrSeeStatus === 1 || +editOrSeeStatus === 2" style="float:right;" @click="refsGoodsClick" size="mini" round>引用商品</el-button></h3>
         

        <el-dialog
          width="69%"
          title="引用商品"
          :visible.sync="refsGoodsVisible"
          append-to-body>
          
          <el-table v-loading="loading" highlight-current-row :data="refsGoodsData" ref="singleTable" @current-change="handleCurrentChange" class="myJewelTableCustom">
            
            <el-table-column property="id" label="编号" align="left">
              <template scope="scope">
                <i class="el-icon-success" v-if="scope.row.id == clickRowData.productTemplateId"></i>
                <span style="margin-left:30px;">{{scope.row.id}}</span>
              </template>
            </el-table-column>
            <el-table-column property="primaryImage" label="商品主图">
              <template scope="scope">
                <div class="height:80px;width:80px;">
                <img :src="scope.row.primaryImage" style="height:100%;width:100%;border-radius:10px;">
                </div>
              </template>
            </el-table-column>
            <el-table-column property="describe" label="商品描述"></el-table-column>
            <el-table-column property="price" label="商品价格（USDT）"></el-table-column>
            <el-table-column property="costPrice" label="成本价（USDT）"></el-table-column>
            <el-table-column property="totalWhalePeas" label="总需Candy（Candy）"></el-table-column>
            <el-table-column property="unitWhalePeas" label="每份最小单位（Candy）"></el-table-column>
            <el-table-column property="totalNum" label="总份数"></el-table-column>
          </el-table>
          <div class="clearfix">
            <el-pagination
            style="padding-top:20px;float:left;"
            @current-change="searchRefGoods"
            :page-sizes="[10, 20, 30]"
            @size-change="handleSizeChange"
            :current-page.sync="pageIndex"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalPage">
            </el-pagination>
            <el-button type="primary" style="margin-top:20px;float:right;" @click="handleCurrentChangeSave">确定</el-button>
          </div>
          
        </el-dialog>


        <el-form-item label="产品图片:" :label-width="formLabelWidthck" class="lab1">
          <el-upload
            :disabled="+editOrSeeStatus === 0"
            :limit="6"
            action=""
            :http-request="handleAvatarSuccessRUN.bind(file, 'addCode')"
            list-type="picture-card"
            :on-preview="+editOrSeeStatus === 0 ? null : handlePictureCardPreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            >
            <i class="el-icon-plus"></i>
          </el-upload>
          <p>最多上传6张，大小不超过500KB</p>
        </el-form-item>

        <el-form-item label="商品描述:" :label-width="formLabelWidthck" prop="describe" class="lab1">
          <el-input type="textarea" :disabled="+editOrSeeStatus === 0" v-model.trim="formck.describe" autocomplete="off" maxlength="60"></el-input>
        </el-form-item>

        <el-form-item label="商品价格:" :label-width="formLabelWidthck" prop="price"  class="lab1">
          <el-input-number :disabled="+editOrSeeStatus === 0" @blur="((ev)=>{handleBlur(ev, 'price')})" v-model="formck.price" :min="0.02" :precision="2" controls-position="right"></el-input-number><span style="padding-left:10px;">USDT</span>
        </el-form-item>
        <el-form-item label="成本价:" :label-width="formLabelWidthck" prop="costPrice">
          <el-input-number :disabled="+editOrSeeStatus === 0" @blur="((ev)=>{handleBlur(ev, 'costPrice')})" v-model="formck.costPrice" :min="0.01" :precision="2" controls-position="right"></el-input-number><span style="padding-left:10px;">USDT</span>
        </el-form-item>
        <el-form-item label="每份最小单位:" :label-width="formLabelWidthck" prop="unitWhalePeas" class="lab6">
          <el-input-number :disabled="+editOrSeeStatus === 0" @blur="((ev)=>{handleBlur(ev, 'unitWhalePeas')})" @change="handleCalc" :precision="6" v-model="formck.unitWhalePeas" :step="1" :min="0.000001" controls-position="right"></el-input-number><span style="padding-left:10px;">Candy</span>
        </el-form-item>
        <el-form-item label="总份数:" :label-width="formLabelWidthck" prop="totalNum" class="lab0">
          <el-input-number :disabled="+editOrSeeStatus === 0" @blur="((ev)=>{handleBlur(ev, 'totalNum')})" @change="handleCalc" :precision="0" v-model="formck.totalNum" :step="1" :min="1" controls-position="right"></el-input-number><span style="padding-left:10px;">份</span>
        </el-form-item>
        <el-form-item label="预估总需Candy:" :label-width="formLabelWidthck" prop="join">
          <el-input
            style="width:200px;"
            placeholder=""
            v-model="formck.totalWhalePeas"
            :disabled="true">
          </el-input><span style="padding-left:10px;">Candy</span>
        </el-form-item>
        <h3>规则配置</h3>
        <el-form-item label="起始时间:" :label-width="formLabelWidthck" prop="jewelRuleDate" class="lab1">
          <el-date-picker
            v-model="formck.jewelRuleDate"
            ref="jeweldateRange"
            :disabled="+editOrSeeStatus === 0"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="每人最大可认购份数:" :label-width="formLabelWidthck" prop="maxBuyNum" class="lab4">
          <el-input-number :disabled="+editOrSeeStatus === 0" @blur="((ev)=>{handleBlur(ev, 'maxBuyNum')})" :precision="0" v-model="formck.maxBuyNum" :step="1" :min="1" controls-position="right"></el-input-number><span style="padding-left:10px;">份</span>
        </el-form-item>
        <el-form-item label="公布中奖时间:" :label-width="formLabelWidthck" class="lab6 jewelenterVal">
          <el-input-number :disabled="+editOrSeeStatus === 0" style="width:109px;" step-strictly :precision="0" v-model="countDown.day" controls-position="right" :min="0" :max="200" @blur="handleBlur"></el-input-number><span class="unit">天</span>
          <el-input-number :disabled="+editOrSeeStatus === 0" style="width:109px;" step-strictly :precision="0" v-model="countDown.hour" controls-position="right" :min="0" :max="23" @blur="handleBlur"></el-input-number><span class="unit">时</span>
          <el-input-number :disabled="+editOrSeeStatus === 0" style="width:109px;" step-strictly :precision="0" v-model="countDown.min" controls-position="right" :min="0" :max="59" @blur="handleBlur"></el-input-number><span class="unit">分</span>
          <el-input-number :disabled="+editOrSeeStatus === 0" style="width:109px;" step-strictly :precision="0" v-model="countDown.sec" controls-position="right" :min="0" :max="59" @blur="handleBlur"></el-input-number><span class="unit">秒</span>
        </el-form-item>
        <el-form-item label="排序:" :label-width="formLabelWidthck" prop="sort" class="lab01">
          <el-input-number :disabled="+editOrSeeStatus === 0" @blur="((ev)=>{handleBlur(ev, 'sort')})" :precision="0" v-model="formck.sort" :step="1" :min="1" controls-position="right"></el-input-number>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="+editOrSeeStatus !== 0" @click="dialogFormVisibleck = false">取 消</el-button>
        <el-button v-if="+editOrSeeStatus !== 0" type="primary" @click="finallySumbit">确 定</el-button>
      </div>
    </el-dialog>

<!--引用优惠券dialog-->
<el-dialog title="引用优惠券" :visible.sync="dialogYYUSEVisible" width="80%">
  <el-table :data="gridYYUSEData" ref="singleTableYYUSE" @current-change="handleCurrentChangeYYUSE" highlight-current-row class="myJewelTableCustom">
    <el-table-column property="name" label="优惠券名称" min-width="300">
      <template scope="scope">
        <i class="el-icon-success" v-if="scope.row.id == yyuseCouponId"></i>
        <span style="margin-left:30px;">{{scope.row.name}}</span>
      </template>
    </el-table-column>
    <el-table-column property="type" label="优惠券类型" width="200">
      <template scope="scope">
        <p v-if="+scope.row.type === 1">游戏用户群赠送优惠券</p>
        <p v-else>-</p>
      </template>
    </el-table-column>
    <el-table-column prop="givingType" align="center" label="到券方式">
        <template scope="scope">
          <p v-if="+scope.row.givingType === 2">游戏赠送</p>
          <p v-else>-</p>
        </template>
      </el-table-column>
    <el-table-column prop="applyUserType" align="center" label="适合用户" width="235">
          <template scope="scope">
            <p v-if="+scope.row.applyUserType.findIndex(v => +v === 0) !== -1">参与本期游戏的用户</p>
            <p v-else>-</p>
          </template>
        </el-table-column>
    <el-table-column property="applyGoodsType" :formatter="formatter" label="可使用商品"></el-table-column>
    <el-table-column property="useType" :formatter="formatter" label="使用门槛"></el-table-column>
    <el-table-column property="couponAmount" :formatter="formatter" label="面值"></el-table-column>
    <el-table-column property="effectiveType" :formatter="formatter" label="有效期"></el-table-column>
  </el-table>
  <el-pagination
    @current-change="searchYYUSE"
    :page-sizes="[10, 20, 30]"
    @size-change="handleSizeChangeYYUSE"
    :current-page.sync="pageIndexYYUSE"
    :page-size="pageSizeYYUSE"
    layout="total, sizes, prev, pager, next, jumper"
    :total="totalPageYYUSE">
  </el-pagination>

  <div style="padding-top:20px;text-align:center;">
    <el-button type="primary" @click="jumptoYYUSE" style="margin-bottom:20px;">新增优惠券</el-button>
    <el-button type="primary" @click="saveYYUSE" style="margin-bottom:20px;">确定</el-button>
  </div>
</el-dialog>

<!--优惠券详情-->
      <el-dialog
      title="优惠券详情"
      :visible.sync="dialogVisibleCoupon"
      width="39%">

      <p>
        到券方式：<span>游戏赠送</span>
      </p>
      <p>
        优惠券类型：<span>游戏用户群赠送优惠券</span>
      </p>
      <p>
        适用用户：<span>{{+gridDataCoupon.applyUserType === 0 ? '参与本期游戏用户' : '其他用户'}}</span>
      </p>
      <p>
        优惠券名称：<span>{{gridDataCoupon.name}}</span>
      </p>
      <!-- <p>
        总发行量：<span>{{+gridDataCoupon.stock}}</span>
      </p> -->
      <p>
        每人限领：<span>{{gridDataCoupon.limitNumber}}</span>
      </p>
      <p>
        使用门槛：<span>{{gridDataCoupon.useStr}}</span>
      </p>
      <p>
        有效期：<span>{{gridDataCoupon.effectiveStr}}</span>
      </p>
      <p>
        可使用商品：<span v-if="+gridDataCoupon.applyGoodsType === 0">全场通用</span>
        <span v-else-if="+gridDataCoupon.applyGoodsType === 1">指定商品</span>
        <span v-else-if="+gridDataCoupon.applyGoodsType === 2">指定分类</span>
        <span v-else-if="+gridDataCoupon.applyGoodsType === 3">指定供应商/指定自营店</span>
      </p>


      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisibleCoupon = false">取 消</el-button> -->
        <el-button type="primary" @click="dialogVisibleCoupon = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { gameDesk, gameRuleAdd, gameRuleUpdate, gameRuleStatusChange, gameRuleDel, takejewelRulelist, takejewelRulelistAdd, takejewelRulelistUpdate, gameTemplateQueryList, takejewelDown, takejewelUp, takejewelDelete, takejewelSwitch, takejewelCouponChange, takejewelCouponAdd, jewelGameCouponsInfos, takejewelSortChange } from "@/api/games";
import { getCertificate, upload } from "@/api/system/userlist";
import handleNumPow from '@/utils/handleNumPow';
import {compareVersion, replaceUnitlPrefixStr} from '@/utils/index';
import { givingPage } from "@/api/coupons/game";
  export default {
    props: ['sendTochildBridgeData'],
    components: {},
    data () {
      var validateJewelRuleDate = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('起始时间不能为空'))
        }
        callback()
      }
      var validateDescribe = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('请输入商品描述'))
        }
        callback()
      }
      var validateName = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('请输入场次名称'))
        }
        callback()
      }
      var validatePean = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('请输入每局所需Candy'))
        }
        callback()
      }
      var validateTicket = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('请输入门票'))
        } else {
          if (this.formck.pean !=='' && +value >= +this.formck.pean) {
            return callback(new Error('门票不能大于等于每局所需Candy'))
          }
        }
        callback()
      }
      var validateJoin = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('请输入每局参与人数'))
        }
        callback()
      }
      var validateRobotCritical = (rule, value, callback) => {
        // if (!/\S/.test(value)) {
        //   return callback(new Error('请输入机器人中奖倍数'))
        // }
        if (!/^[0-9]*[0-9][0-9]*$/.test(value) && value) {
          return callback(new Error('请输入正整数'))
        }
        callback()
      }
      var validateRobotAwardMultiple = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('请输入机器人中奖倍数'))
        }
        callback()
      }
      return {
        loadingBigTable: false,
        formJeweltake: {
          describe: '',
          periodsNum: ''
        },
        gridDataCoupon: {},
        dialogVisibleCoupon: false,
        // 0:全场通用 1:指定商品 2:指定分类 3:指定供应商 4:指定自营店
        goods: [
          {
            type: 0,
            label: '全场通用',
          },
          {
            type: 1,
            label: '指定商品',
          },
          {
            type: 2,
            label: '指定分类',
          },
          {
            type: 3,
            label: '指定供应商',
          },
          // {
          //   type: 4,
          //   label: '指定自营店',
          // },
        ],
        dialogYYUSEVisible: false,
        pageIndexYYUSE: 1,
        pageSizeYYUSE: 10,
        totalPageYYUSE: 0,
        gridYYUSEData: [],
        pageIndexList: 1,
        pageSizeList: 10,
        totalPageList: 0,
        clickRowData: '',
        curClickType: '',
        refsGoodsData: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        loading: false,
        refsGoodsVisible: false,
        fileList: [],
        file: {},
        rulesTop: {
          jewelRuleDate: [
            { validator: validateJewelRuleDate, trigger: 'blur' }
          ],
          describe: [
            { validator: validateDescribe, trigger: 'blur' }
          ],
          name: [
            { validator: validateName, trigger: 'blur' }
          ],
          pean: [
            { validator: validatePean, trigger: 'blur' }
          ],
          ticket: [
            { validator: validateTicket, trigger: 'blur' }
          ],
          join: [
            { validator: validateJoin, trigger: 'blur' }
          ],
          robotCritical: [
            { validator: validateRobotCritical, trigger: 'blur' }
          ],
          robotAwardMultiple: [
            { validator: validateRobotAwardMultiple, trigger: 'blur' }
          ]
        },
        countDown: {
          day: '',
          hour: '',
          min: '',
          sec: 1
        },
        formck: {
          describe: '',
          price: '',
          costPrice: '',
          unitWhalePeas: '',
          totalNum: '',
          maxBuyNum: '',
          sort: '',
          totalWhalePeas: '',
          jewelRuleDate: '',
          productTemplateId: '',
          productTemplateId_cachedVal: ''
        },
        formLabelWidthck: '160px',
        dialogFormVisibleck: false,
        editOrSeeStatus: '',
        editOrSeeTitle: '',
        tableData: [],
        currentRowYYUSE: null,
        yyuseCouponId: '',
        couponYYUSEType: '',
        rowProductId: ''
      }
    },
    mounted () {
      this.getCertificateRun()
      this.isAuth.isPermi(['goods:treasure:page']) && this.queryAllGameDeskList(1)
    },
    watch: {
      'sendTochildBridgeData': {
        handler: function (newVal, oldVal) {
          console.log(newVal, oldVal)
        },
        deep: true
      }
    },
    methods: {
      changeSortGameRule (row) {
        this.$prompt('请输入排序', '提示', {
          inputValue: row.sort,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^(0|\+?[1-9][0-9]*)$/,
          inputErrorMessage: '请输入正确的排序'
        }).then(({ value }) => {
          takejewelSortChange({
            id: row.id,
            sort: value
          }).then(response => {
          if (+response.code === 200) {
            this.$message.success(response.message)
            this.isAuth.isPermi(['goods:treasure:page']) && this.queryAllGameDeskList()
          } else {
            this.$message.error(response.message)
          }
        })
        }).catch(() => {})
      },
      // 优惠券详情
      showCouponInfos (couponId) {
        this.dialogVisibleCoupon = true
        jewelGameCouponsInfos({
            couponId
          }).then(response => {
          if (+response.code === 200) {
            this.gridDataCoupon = Object.assign({}, response.data)
          } else {
            this.$message.error(response.message)
          }
        })
      },
      jumptoYYUSE () {
        this.$router.push({ path: "/promotion/addGameCoupons", query: {}})
      },
      saveYYUSE () {
        let _api
        let _params = {
          couponId: this.currentRowYYUSE.id,
          productId: this.rowProductId
        }
        if (this.couponYYUSEType === 'add') {
          _api = takejewelCouponAdd
        } else {
          _api = takejewelCouponChange
        }
        _api(_params).then(response => {
          if (+response.code === 200) this.isAuth.isPermi(['goods:treasure:page']) && this.queryAllGameDeskList()
          this.$message.success(response.message)
          this.dialogYYUSEVisible = false
        })
      },
      setCurrentYYUSE (row) {
        this.$refs.singleTableYYUSE.setCurrentRow(row)
      },
      handleCurrentChangeYYUSE (val) {
        this.currentRowYYUSE = val
      },
      // 格式日期功能
      formatDate (date, format = 'YYYY-MM-DD', def = '') {
        return date ? this.$dayjs(date).format(format) : def;
      },
      // 格式化
      formatter (row, column) {
        let key = column.property;

        if (key == 'useType') {
          const val = row[key];
          const item = val == 0 ? '无限制'
            : val == 1 ? `满${row['fullReductionAmount']}USDT可用`
            : '-';
          return item;
        } else if (key == 'applyGoodsType') {
          let item;
          const val = row[key];

          this.goods.map(({type, label}) => {
            if (val == type) (item = label);
          });
          return item || '-';
        } else if (key == 'couponAmount') {
          return row[key] ? row[key] + 'USDT' : '-';
        } else if (key == 'effectiveType') {
          const {effectiveStartTime, effectiveEndTime} = row;
          if (row[key]) {
            return '-';
          } else {
            const s = this.formatDate(effectiveStartTime, 'YYYY-MM-DD', '-');
            const e = this.formatDate(effectiveEndTime, 'YYYY-MM-DD', '-');
            return s + '至' + e;
          };
        } else {
          return row[key] || '-';
        }
      },
      handleSizeChangeYYUSE (val) {
        this.pageSizeYYUSE = val
        this.pageIndexYYUSE = 1
        this.searchYYUSE()
      },
      searchYYUSE (pgi) {
        if (pgi) this.pageIndexYYUSE = pgi
        this.loading = true
        givingPage({
          name: '',
          applyGoodsType: '',
          enable: '', 
          status: '',
          type: '',
          useType: '',
          applyUserType: '',
          pageSize: this.pageSizeYYUSE,
          currentPage: this.pageIndexYYUSE,
        }).then(response => {
          if (response.code === 200) {
            this.gridYYUSEData = response.data.list
            this.totalPageYYUSE = response.data.total

            let _res = this.gridYYUSEData.find(v => v.id === this.yyuseCouponId)
            this.setCurrentYYUSE(this.gridYYUSEData.find(v => v.id === this.yyuseCouponId))

            this.loading = false
          } else {
            this.gridYYUSEData = []
            this.totalPageYYUSE = 0
            this.pageSizeYYUSE = 10
            this.loading = false
            this.$message.error(response.message)
          }
        })
      },
      setCurrent(row) {
        this.$refs.singleTable.setCurrentRow(row)
      },
      handlePictureCardPreview(file) {
        // this.dialogImageUrl_addPostCode = file.url;
        // this.dialogVisible_addPostCode = true;
        // change the preview to the master image
        let _item = {}
        this.fileList.forEach((item, index) => {
          if (item.uid === file.uid) {
            _item = item
            this.fileList.splice(index, 1)
            return
          }
        })
        this.fileList.unshift(_item)
      },
      watchChange (val) {
        this.$confirm(`确认要执行此操作吗？`, '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _params = {}
          _params.id = val.id
          _params.status = val.isGiveCoupon
          takejewelSwitch(_params).then(response => {
            if (response.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                'duration': 1000,
                onClose: () => {
                  this.isAuth.isPermi(['goods:treasure:page']) && this.queryAllGameDeskList()
                }
              })
            } else {
              val.isGiveCoupon = !val.isGiveCoupon
              this.$message.error(response.message)
            }
          }).catch(({ error }) => {
            val.isGiveCoupon = !val.isGiveCoupon
            if (error) this.$message.error(error.message)
          })
        }).catch(() => {
          val.isGiveCoupon = !val.isGiveCoupon
        })
      },
      removeGameRule (row) {
        this.$confirm(`确认要执行此操作吗？`, '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          takejewelDelete({
            id: row.id
          }).then((response) => {
            if (+response.code === 200) {
              this.$message({type: 'success', message: '操作成功'})
              this.isAuth.isPermi(['goods:treasure:page']) && this.queryAllGameDeskList()
            } else {
              this.$message.error(response.message)
            }
          })
        }).catch((e) => {})
      },
      upStoreClick (row) {
        this.$confirm('确认要执行此操作吗？', {
          type: 'warning',
          showClose: false,
          closeOnClickModal: false,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          takejewelUp({
            id: row.id
          }).then(response => {
            if (+response.code === 200) this.isAuth.isPermi(['goods:treasure:page']) && this.queryAllGameDeskList()
            this.$message.success(response.message)
          })
        }).catch((e) => {})
      },
      downStoreClick (row) {
        this.$confirm('确认要执行此操作吗？', {
          type: 'warning',
          showClose: false,
          closeOnClickModal: false,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          takejewelDown({
            id: row.id
          }).then(response => {
            if (+response.code === 200) this.isAuth.isPermi(['goods:treasure:page']) && this.queryAllGameDeskList()
            this.$message.success(response.message)
          })
        }).catch((e) => {})
      },
      switchCouponClick (row, type) {
        this.dialogYYUSEVisible = true
        this.couponYYUSEType = type
        this.yyuseCouponId = row.couponId
        this.rowProductId = row.id
        this.searchYYUSE(1)
      },
      refuseCouponClick (row, type) {
        this.dialogYYUSEVisible = true
        this.couponYYUSEType = type
        this.yyuseCouponId = row.couponId
        this.rowProductId = row.id
        this.searchYYUSE(1)
      },
      handleCalc () {
        this.formck.totalWhalePeas = handleNumPow(this.formck.unitWhalePeas * this.formck.totalNum, 6)
      },
      refsGoodsClick () {
        this.refsGoodsVisible = true
        this.searchRefGoods(1)
      },
      searchRefGoods (pgi) {
        if (pgi) this.pageIndex = pgi
        let _params = {
          describe: '',
          currentPage: this.pageIndex,
          pageSize: this.pageSize,
        }
        this.loading = true
        gameTemplateQueryList(_params).then(response => {
          if (response.code === 200) {
            this.refsGoodsData = response.data.list
            this.totalPage = response.data.total
            this.loading = false
            /**
             * 引用商品的默认选中状态:
             * 0查看1新增2修改(查看时，不需要显示引用商品界面)
             */
            if (+this.editOrSeeStatus === 1) {
              this.setCurrent()
            } else if (+this.editOrSeeStatus === 2) {
              this.setCurrent(this.refsGoodsData.find(v => v.id === this.clickRowData.productTemplateId))
            }
          } else {
            this.refsGoodsData = []
            this.totalPage = 0
            this.pageSize = 10
            this.loading = false
            this.$message.error(response.message)
          }
        }).catch(e => {
          this.loading = false
        })
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.searchRefGoods()
      },
      handleSizeChangeList () {
        this.pageSizeList = val
        this.pageIndexList = 1
        this.isAuth.isPermi(['goods:treasure:page']) && this.queryAllGameDeskList()
      },
      handleCurrentChangeSave () {
        this.formck.productTemplateId = this.formck.productTemplateId_cachedVal
        this.refsGoodsVisible = false
      },
      handleCurrentChange (val) {
        if (val) {
          this.formck.productTemplateId_cachedVal = val.id
          this.formck.describe = val.describe
          this.formck.price = val.price
          this.formck.costPrice = val.costPrice
          this.formck.unitWhalePeas = val.unitWhalePeas
          this.formck.totalNum = val.totalNum
          this.fileList = (val.images || []).map(v => {
            return {
              name: '',
              url: v
            }
          })
          this.formck.totalWhalePeas = handleNumPow(val.unitWhalePeas * val.totalNum, 6)
          
        }
      },
      checkUploadBTN () {
        this.$nextTick(() => {
          let onode = document.querySelectorAll('.el-upload.el-upload--picture-card')
          if (+this.curClickType === 0) {
            onode[0].style.display = 'none'
          } else {
            onode[0].style.display = 'inline-block'
            onode[0].style.display = this.fileList.length >= 6 ? 'none' : 'inline-block'
          }
        })
      },
      handleRemove(file, fileList) {
        let _index = this.fileList.findIndex(v => file.uid === v.uid)
        this.fileList.splice(_index, 1)
        this.checkUploadBTN()
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
              this.fileList.push({
                name: '',
                url: ossFileUrl
              })
              this.checkUploadBTN()
              // this.$refs['ruleForm'].clearValidate('imgs')
              break;
          }
        } catch (e) {
          console.log(e)
        }
      },
      handleBlur (ev, key) {
        // blur后若输入内容为空，处理为显示对应特权类型的最小默认值
        if (ev.target.ariaValueNow === 'undefined') {
          if (key === 'pean') {
            this.formck.pean = ev.target.ariaValueMin
          } else if (key === 'ticket') {
            this.formck.ticket = ev.target.ariaValueMin
          } else if (key === 'join') {
            this.formck.join = ev.target.ariaValueMin
          } else if (key === 'robotCritical') {
            // this.formck.robotCritical = ev.target.ariaValueMin
          } else if (key === 'robotAwardMultiple') {
            this.formck.robotAwardMultiple = ev.target.ariaValueMin
          }
          if (key !== 'robotCritical') {
            ev.target.value = ev.target.ariaValueMin
          }
          this.handleCalc()
        }
      },
      // 提交整理数据
      finallySumbit () {
        this.$refs['queryForm'].validate((valid) => {
            if (this.fileList.length <= 0) {
              this.$message.error('请上传产品图片!')
              return false
            } else if (+this.countDown.sec === 0 && +this.countDown.min === 0 && +this.countDown.hour === 0 && +this.countDown.day === 0) {
              this.$message.error('公布中奖时间有误')
              return false
            }
            if (valid) {
              let _paramsAdd = {
                describe: this.formck.describe,
                price: this.formck.price,
                costPrice: this.formck.costPrice,
                unitWhalePeas: this.formck.unitWhalePeas,
                totalNum: this.formck.totalNum,
                maxBuyNum: this.formck.maxBuyNum,
                sort: this.formck.sort,
                images: (this.fileList || []).map(v => v.url), // 产品图片
                primaryImage: this.fileList[0].url, // 主图
                countDown: this.countDown,
                // endTime: this.formck.jewelRuleDate && this.$dayjs(this.formck.jewelRuleDate[1]).format('YYYY-MM-DD HH:mm:ss'), // '2021-10-12 01:24:02'
                // startTime: this.formck.jewelRuleDate && this.$dayjs(this.formck.jewelRuleDate[0]).format('YYYY-MM-DD HH:mm:ss'),
                endTime: this.formck.jewelRuleDate && new Date(this.$dayjs(this.formck.jewelRuleDate[1]).format('YYYY-MM-DD HH:mm:ss')).getTime(), // 时间撮:1633973042000
                startTime: this.formck.jewelRuleDate && new Date(this.$dayjs(this.formck.jewelRuleDate[0]).format('YYYY-MM-DD HH:mm:ss')).getTime(),
                id: this.clickRowData.id || '',
                productTemplateId: this.formck.productTemplateId
              }
              let _api
              if (+this.editOrSeeStatus === 1) {
                _api = takejewelRulelistAdd
              } else if (+this.editOrSeeStatus === 2) {
                _api = takejewelRulelistUpdate
              }
              _api(_paramsAdd).then((response) => {
                if (+response.code === 200) {
                  this.$message({type: 'success', message: '操作成功'})
                  this.dialogFormVisibleck = false
                  this.isAuth.isPermi(['goods:treasure:page']) && this.queryAllGameDeskList()
                } else {
                  this.$message.error(response.message)
                  this.dialogFormVisibleck = false
                }
              })
            }
        })
      },
      // 查询所有游戏场次列表
      queryAllGameDeskList (pgi) {
        if (pgi) this.pageIndexList = pgi
        let _params = {
          currentPage: this.pageIndex,
          pageSize: this.pageSize,
          describe: this.formJeweltake.describe,
          periodsNum: this.formJeweltake.periodsNum
        }
        this.loadingBigTable = true
        takejewelRulelist(_params).then(response => {
          if (response.code === 200) {
            this.tableData = response.data.list
            this.totalPageList = response.data.total
            for (let [k, s] of Object.entries(this.tableData || [])) {
              this.$set(this.tableData[k], 'statusTypeBoolean', s.statusType === 1 ? true : false)
            }
            this.loadingBigTable = false
          } else {
            this.tableData = []
            this.totalPageList = 0
            this.pageSizeList = 10
            this.loadingBigTable = false
            this.$message.error(response.message)
          }
        }).catch(e => {
          this.loadingBigTable = false
        })
      },
      editOrSee (type, row) {
        this.dialogFormVisibleck = true
        this.curClickType = type
        this.editOrSeeStatus = type
        this.$nextTick(() => {
          this.$refs['queryForm'].resetFields()
          switch(type)
          {
            case 0:
              this.editOrSeeTitle = '查看'
              this.formck = {
                describe: row.describe,
                price: row.price,
                costPrice: row.costPrice,
                unitWhalePeas: row.unitWhalePeas,
                totalNum: row.totalNum,
                maxBuyNum: row.maxBuyNum,
                productTemplateId: row.productTemplateId,
                sort: row.sort,
                totalWhalePeas: row.totalWhalePeas,
                jewelRuleDate: [ // 起始时间
                  new Date(row.startTime),
                  new Date(row.endTime)
                ]
              }
              // 公布中奖时间
              this.countDown = {
                day: row.countDown.day,
                hour: row.countDown.hour,
                min: row.countDown.min,
                sec: row.countDown.sec
              }
              // 图片
              this.fileList = (row.images || []).map(v => {
                return {
                  name: '',
                  url: v
                }
              })
            break;
            case 1:
              this.editOrSeeTitle = '新增'
              this.clickRowData.productTemplateId = ''
              this.formck = {
                describe: '',
                price: '',
                costPrice: '',
                unitWhalePeas: '',
                totalNum: '',
                maxBuyNum: '',
                productTemplateId: '',
                sort: '',
                totalWhalePeas: handleNumPow(this.formck.unitWhalePeas * this.formck.totalNum, 6),
                jewelRuleDate: []
              }
              // 公布中奖时间
              this.countDown = {
                day: '',
                hour: '',
                min: '',
                sec: 1
              }
              // 图片
              this.fileList = []
            break;
            case 2:
              this.editOrSeeTitle = '修改'
              this.formck = {
                describe: row.describe,
                price: row.price,
                costPrice: row.costPrice,
                unitWhalePeas: row.unitWhalePeas,
                totalNum: row.totalNum,
                maxBuyNum: row.maxBuyNum,
                sort: row.sort,
                productTemplateId: row.productTemplateId,
                totalWhalePeas: row.totalWhalePeas,
                jewelRuleDate: [ // 起始时间
                  new Date(row.startTime),
                  new Date(row.endTime)
                ]
              }
              // 公布中奖时间
              this.countDown = {
                day: row.countDown.day,
                hour: row.countDown.hour,
                min: row.countDown.min,
                sec: row.countDown.sec
              }
              // 图片
              this.fileList = (row.images || []).map(v => {
                return {
                  name: '',
                  url: v
                }
              })
            break;
          }
          this.checkUploadBTN()
          row && (this.clickRowData = Object.assign({}, row))
        })
        
      }
    }
  }
</script>

<style lang="scss" scoped>
$myColor: #8b939c;
.jewelenterVal{
  & .unit{
    color: $myColor;
    padding:0 10px 0 10px;
  }
}
</style>
<style>
.gamesWraper .requiredStart .el-form-item__label{
  position: relative;
}
.gamesWraper .requiredStart .el-form-item__label::before{
  content: '*';
  color: #fff;
  position: absolute;
  left: 0;
  top:0;
}
.gamesWraper .requiredStart .lab6 .el-form-item__label::before{left:52px;color: red;}
.gamesWraper .requiredStart .lab5 .el-form-item__label::before{left:-7px;color: red;}
.gamesWraper .requiredStart .lab4 .el-form-item__label::before{left:7px;color: red;}
.gamesWraper .requiredStart .lab3 .el-form-item__label::before{left:63px;color: red;}
.gamesWraper .requiredStart .lab2 .el-form-item__label::before{left:78px;color: red;}
.gamesWraper .requiredStart .lab1 .el-form-item__label::before{left:78px;color: red;}
.gamesWraper .requiredStart .lab0 .el-form-item__label::before{left:91px;color: red;}
.gamesWraper .requiredStart .lab01 .el-form-item__label::before{left:108px;color: red;}
.robotLimitSt .el-form-item__content{
  width:200px;
}
.gamesWraper .el-upload-list__item-preview .el-icon-zoom-in:before{content: '设为主图';}
.gamesWraper .el-upload-list__item-preview .el-icon-zoom-in,.gamesWraper .el-upload-list__item-delete .el-icon-delete{
  font-size: 14px;
}
.myJewelTableCustom .el-icon-success{
  color: #1890ff;
}
</style>

