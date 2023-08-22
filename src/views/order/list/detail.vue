<template>
  <div class="order-detail-wrap">
    <!-- 订单详情-步骤条 -->
    <div class="order-steps">
      <el-steps :active="activeStep" align-center finish-status="success">
        <el-step
          v-for="({operDesc, operTime, disable}) in stepArr"
          :key="operDesc"
          :title="operDesc"
          :description="operTime||disable"
        >
        </el-step>
      </el-steps>
    </div>

    <!-- 当前订单状态 -->
    <div class="order-status">
      <div class="info-item status">
        <div class="ml12 ftwt7 wth245 inline-block">
          <i class="el-icon-warning"></i>
          当前订单状态：<span>{{transStatus(orderStatus)}}</span>
        </div>
        <div v-show="false" class="inline-block ml10">
          <el-button disabled @click="editInfoDio(1)" size="medium">修改发票信息</el-button>
          <el-button class="x-btn" @click="editInfoDio(2)" size="medium">修改收货人信息</el-button>
          <el-button class="x-btn" @click="editInfoDio(3)" size="medium">修改商品信息</el-button>
          <el-button class="x-btn" @click="editInfoDio(4)" size="medium">修改费用信息</el-button>
          <el-button class="x-btn" @click="editInfoDio(5)" size="medium">发送站内信</el-button>
          <el-button class="x-btn" @click="editInfoDio(6)" size="medium">关闭订单</el-button>
          <el-button class="x-btn" @click="editInfoDio(7)" size="medium">备注订单</el-button>
        </div>
      </div>
    </div>

    <!-- 基本信息 -->
    <el-card class="box-card" shadow="always">
      <template slot="header">
        <i class="el-icon-info"></i>
        基本信息
      </template>
      <el-table :data="basicInfo1" border style="width: 100%">
        <el-table-column align="center" prop="orderNo" label="订单编号"></el-table-column>
        <el-table-column align="center" prop="serialNo" label="发货单流水号"></el-table-column>
        <el-table-column align="center" prop="memberAccount" label="用户账号"></el-table-column>
        <el-table-column align="center" prop="payType" label="支付方式"></el-table-column>
      </el-table>

      <br><br>

      <el-table :data="basicInfo2" border style="width: 100%">
        <el-table-column align="center" prop="dispatName" label="配送方式"></el-table-column>
        <el-table-column align="center" prop="orderSourceDesc" label="订单来源"></el-table-column>
        <el-table-column align="center" prop="activeNum" label="订单可得活跃值"></el-table-column>
        <el-table-column align="center" prop="orderType" label="订单类型"></el-table-column>
      </el-table>
    </el-card>

    <!-- 发票信息 -->
    <el-card class="box-card" shadow="always" v-show="false">
      <template slot="header">
        <i class="el-icon-s-management"></i>
        发票信息
      </template>
      <el-table :data="invoiceInfo" border style="width: 100%">
        <el-table-column align="center" :formatter="formatter" prop="col1" label="发票类型" width="180"></el-table-column>
        <el-table-column align="center" :formatter="formatter" prop="col2" label="发票抬头"></el-table-column>
        <el-table-column align="center" :formatter="formatter" prop="col3" label="发票内容"></el-table-column>
        <el-table-column align="center" :formatter="formatter" prop="col4" label="收票人信息"></el-table-column>
      </el-table>
    </el-card>

    <!-- 收货人信息 -->
    <el-card class="box-card" shadow="always">
      <template slot="header">
        <i class="el-icon-s-custom"></i>
        收货人信息
      </template>
      <el-table :data="receiverInfo" border style="width: 100%">
        <el-table-column align="center" prop="deliveryMemberName" label="收货人"></el-table-column>
        <el-table-column align="center" prop="deliveryPhone" label="手机号码"></el-table-column>
        <el-table-column align="center" prop="deliveryAddress" label="收货地址"></el-table-column>
      </el-table>
    </el-card>

    <!-- 商品信息 -->
    <el-card class="box-card" shadow="always">
      <template slot="header">
        <i class="el-icon-s-goods"></i>
        商品信息
      </template>
      <el-table :data="goodsInfo" border style="width: 100%">
        <el-table-column align="center" :formatter="formatter" prop="img" label="商品图片" width="180"></el-table-column>
        <el-table-column align="center" :formatter="formatter" prop="title" label="商品名称" width="180"></el-table-column>
        <el-table-column align="center" :formatter="formatter" prop="itemNo" label="价格/货号" width="210"></el-table-column>
        <el-table-column align="center" :formatter="formatter" prop="props" label="属性" width="190"></el-table-column>
        <el-table-column align="center" :formatter="formatter" prop="num" label="数量"></el-table-column>
        <el-table-column align="center" :formatter="formatter" prop="supplyPrice" label="商品供货价"></el-table-column>
        <el-table-column align="center" :formatter="formatter" prop="marketPrice" label="商品划线价"></el-table-column>
        <el-table-column align="center" :formatter="formatter" prop="salaPrice" label="销售价（USDT）"></el-table-column>
        <el-table-column align="center" prop="saleWhalePeas" label="销售价（Candy）"></el-table-column>
        <el-table-column align="center" :formatter="formatter" prop="stock" label="库存"></el-table-column>
        <el-table-column align="center" :formatter="formatter" fixed="right" prop="subtotal" label="小计（USDT）"></el-table-column>
        <el-table-column align="center" :formatter="formatter" fixed="right" prop="subtotalWhalePeas" label="小计（Candy）"></el-table-column>
      </el-table>

      <div class="summary-txt">合计：￥{{total}}，{{whalePeasTotal}}Candy</div>

      <!-- 买家备注 -->
      <div class="custom-remark">
        <div class="remark-label">买家备注</div>
        <div class="inline-block ml12">{{remark||'-'}}</div>
      </div>
    </el-card>

    <!-- 费用信息 -->
    <el-card class="box-card" shadow="always">
      <template slot="header">
        <i class="el-icon-s-finance"></i>
        费用信息
      </template>
      <el-table :data="feeInfo" border style="width: 100%">
        <el-table-column align="center" prop="productPriceTatal" label="商品合计"></el-table-column>
        <el-table-column align="center" prop="whalePeasTotal" label="Candy合计"></el-table-column>
        <el-table-column align="center" prop="freight" label="运费"></el-table-column>
        <el-table-column align="center" prop="couponPriceDeduction" label="优惠券"></el-table-column>
        <el-table-column align="center" prop="payWhalePeas" label="Candy支付"></el-table-column>
        <el-table-column align="center" prop="whalePeasDeduction" label="Candy抵扣"></el-table-column>
        <el-table-column align="center" prop="practicalPrice" label="应付金额">
          <span slot-scope="{row}" class="text-danger">{{row.practicalPrice}}</span>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 购买商品用户获赠信息 -->
    <el-card class="box-card" shadow="always">
      <template slot="header">
        <i class="el-icon-s-ticket"></i>
        购买商品用户获赠信息
      </template>
      <el-table :data="giftInfo" border style="width: 100%">
        <el-table-column align="center" prop="contributionNum" label="获赠荣耀值"></el-table-column>
        <el-table-column align="center" prop="commission" label="获得分佣"></el-table-column>
      </el-table>
    </el-card>

    <!-- 已发货、已完成、已关闭时 - 商家发货信息 -->
    <el-card class="box-card" shadow="always" v-show="false">
      <template slot="header">
        <i class="el-icon-s-promotion"></i>
        商家发货信息
      </template>
      <el-row class="info-item custom-wt top-border" :gutter="20">
        <el-col class="item-label" :span="3">物流:</el-col>
        <el-col :span="15">{{logisticsName||'-'}}</el-col>
      </el-row>
      <el-row class="info-item custom-wt" :gutter="20">
        <el-col class="item-label" :span="3">单号:</el-col>
        <el-col :span="15">{{logisticsNum||'-'}}</el-col>
      </el-row>
    </el-card>

    <!-- 操作信息 -->
    <el-card class="box-card" shadow="always">
      <template slot="header">
        <i class="el-icon-s-order"></i>
        操作信息
      </template>
      <el-table :data="logInfo" border style="width: 100%">
        <el-table-column align="center" prop="memberName" label="操作者"></el-table-column>
        <el-table-column align="center" prop="createTime" label="操作时间"></el-table-column>
        <el-table-column align="center" prop="orderStatus" label="订单状态"></el-table-column>
        <el-table-column align="center" prop="payStatus" label="付款状态"></el-table-column>
        <el-table-column align="center" prop="deliverStatus" label="发货状态"></el-table-column>
        <el-table-column align="center" prop="remark" label="备注"></el-table-column>
      </el-table>
    </el-card>

    <!-- 操作弹窗 -->
    <el-dialog
      center
      ref="diaForm"
      width="720px"
      :title="diaTitle"
      :close-on-click-modal="false"
      :visible.sync="shwoDia"
      :before-close="cancelDia">

      <!-- 修改发票信息 -->
      <div  v-if="diaIdx==1">
        <el-form class="custom-form" :model="diaForm1" :rules="rules" ref="diaForm1" label-width="100px">
          <el-form-item prop="d11" label="发票类型:">
            <el-select class="input-class" clearable v-model="diaForm1.d11" placeholder="请选择">
              <el-option label="不开发票" value='0'></el-option>
              <el-option label="电子发票" value='1'></el-option>
              <el-option label="纸质发票" value='2'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="d12" label="发票抬头:">
            <el-input class="input-class" v-model="diaForm1.d12" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item prop="d13" label="发票类型:">
            <el-select class="input-class" clearable v-model="diaForm1.d13" placeholder="请选择">
              <el-option label="日用品" value='1'></el-option>
              <el-option label="家居用品" value='2'></el-option>
              <el-option label="食品" value='3'></el-option>
              <el-option label="酒/饮料" value='4'></el-option>
              <el-option label="服饰" value='5'></el-option>
              <el-option label="化妆品" value='6'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="d12" label="收票人手机:">
            <el-input class="input-class" v-model="diaForm1.d14" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item prop="d12" label="收票人邮箱:">
            <el-input class="input-class" v-model="diaForm1.d15" placeholder="请输入"></el-input>
          </el-form-item>
        </el-form>
      </div>

      <!-- 修改收货人信息 -->
      <div  v-if="diaIdx==2">
        <el-form class="custom-form" :model="diaForm2" :rules="rules" ref="diaForm2" label-width="100px">
          <el-form-item prop="d21" label="收货人姓名:">
            <el-input class="input-class" v-model="diaForm2.d21" placeholder="请输入收货人姓名"></el-input>
          </el-form-item>
          <el-form-item prop="d22" label="手机号码:">
            <el-input class="input-class" v-model="diaForm2.d22" placeholder="请输入手机号码"></el-input>
          </el-form-item>
          <el-form-item prop="d23" label="邮政编码:">
            <el-input class="input-class" v-model="diaForm2.d23" placeholder="请输入邮政编码"></el-input>
          </el-form-item>
          <el-form-item prop="d24" label="所在区域:">
            <el-cascader
              clearable
              class="input-class"
              ref="cascader"
              :props="{value:'adCode'}"
              v-model="diaForm2.d24"
              :options="citysData"
              placeholder="请选择所在区域"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item prop="d25" label="详细地址:">
            <el-input
              class="input-class"
              type="textarea"
              :maxlength="50"
              show-word-limit
              :autosize="{minRows:3}"
              placeholder="请输入详细地址"
              v-model="diaForm2.d25"
            />
          </el-form-item>
        </el-form>
      </div>

      <!-- 修改费用信息 -->
      <div v-if="diaIdx==4">
        <el-table :data="feeData" border row-key="key">
          <el-table-column align="center" :formatter="formatter" prop="f1" label="商品合计(￥)"></el-table-column>
          <el-table-column align="center" prop="f2" label="运费(￥)" width="180">
            <template slot-scope="{row}">
              <el-input-number v-model="row.f2" size="small" :precision="2" :step="0.01" :min="0"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="f3" label="优惠券(￥)"></el-table-column>
          <el-table-column align="center" :formatter="formatter" prop="f4" label="Candy抵扣(￥)"></el-table-column>
        </el-table>

        <br>

        <el-table :data="feeData" border row-key="key">
          <el-table-column align="center" :formatter="formatter" prop="f5" label="活动优惠(￥)"></el-table-column>
          <el-table-column align="center" prop="f6" label="折扣金额(￥)" width="180">
            <template slot-scope="{row}">
              <el-input-number v-model="row.f6" size="small" :precision="2" :step="0.01" :min="0"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column align="center" :formatter="formatter" prop="f7" label="订单总金额(￥)">
            <span slot-scope="{row}" class="text-danger">{{row.f7||0}}</span>
          </el-table-column>
          <el-table-column align="center" :formatter="formatter" prop="f8" label="应付款金额(￥)">
            <span slot-scope="{row}" class="text-danger">{{row.f8||0}}</span>
          </el-table-column>
        </el-table>
      </div>

      <!-- 发送站内信 -->
      <div v-if="diaIdx==5">
        <el-form class="custom-form" :model="diaForm5" :rules="rules" ref="diaForm5" label-width="100px">
          <el-form-item prop="d51" label="标题:">
            <el-input class="input-class" v-model="diaForm5.d51" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item prop="d52" label="内容:">
            <el-input
              class="input-class"
              type="textarea"
              :maxlength="100"
              show-word-limit
              :autosize="{minRows:5}"
              placeholder="请输入内容"
              v-model="diaForm5.d52"
            />
            <div class="input-tips">站内信标题不能超过20个字，内容不能超过100个字。</div>
          </el-form-item>
        </el-form>
      </div>

      <!-- 关闭订单 -->
      <div v-if="diaIdx==6">
        <el-form class="custom-form" :model="diaForm6" :rules="rules" ref="diaForm6" label-width="100px">
          <el-form-item prop="d61" label="操作备注:">
            <el-input
              class="input-class"
              type="textarea"
              :maxlength="100"
              show-word-limit
              :autosize="{minRows:6}"
              placeholder="请输入内容"
              v-model="diaForm6.d61"
            />
          </el-form-item>
        </el-form>
      </div>

      <!-- 备注订单 -->
      <div v-if="diaIdx==7">
        <el-form class="custom-form" :model="diaForm7" :rules="rules" ref="diaForm7" label-width="100px">
          <el-form-item prop="d61" label="操作备注:">
            <el-input
              class="input-class"
              type="textarea"
              :maxlength="100"
              show-word-limit
              :autosize="{minRows:6}"
              placeholder="请输入内容"
              v-model="diaForm7.d71"
            />
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDia">取 消</el-button>
        <el-button type="primary" @click="confirmDia">确 定</el-button>
      </span>
    </el-dialog>

    <div class="form-btns">
      <el-button type="warning" @click="goBackList">返回</el-button>
    </div>
  </div>
</template>

<script>
import citys from '@/utils/provinceCity';
import {orderInfo} from '@/api/order/list';

export default {
  name: 'OrderDetail',
  data () {
    return {
      stepArr: [],
      basicInfo1: [],
      basicInfo2: [],
      receiverInfo: [],
      goodsInfo: [],
      feeInfo: [],
      giftInfo: [],
      logInfo: [],
      invoiceInfo: [],
      feeData: [
        {
          f1: 100,
          f2: 2.33,
          f3: 3,
          f4: 5,
          f5: 6,
          f6: 9,
          f7: 6,
          f8: 6
        }
      ],
      whalePeasTotal: '',
      total: '',
      remark: '', // 订单备注
      logisticsName: '',  // 物流
      logisticsNum: '',   // 单号
      orderType: {
        0: '正常订单',
        1: '秒杀订单',
      },
      deliver: {
        0: '未发货',
        1: '已发货'
      },
      pay: {
        0: '未支付',
        1: '已支付'
      },
      payType: {
        1: '支付宝',
        2: '微信',
        3: '余额'
      },
      diaForm1: {
        d11: '',
        d12: '',
        d13: '',
        d14: '',
        d15: '',
      },
      diaForm2: {
        d21: '',
        d22: '',
        d23: '',
        d24: '',
        d25: '',
      },
      diaForm5: {
        d51: '',
        d52: '',
      },
      diaForm6: {
        d61: '',
      },
      diaForm7: {
        d71: '',
      },
      rules: {
        d11: [
          { required: true, message: '选择不能为空', trigger: 'blur' },
        ],
        d12: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { type: 'string', min: 1, max: 20, message: '输入长度1-20个字符', trigger: 'blur' },
        ],
        d13: [
          { required: true, message: '选择不能为空', trigger: 'blur' },
        ],
        d14: [
          { required: true, message: '输入不能为空', trigger: 'change'},
          { pattern: /^1[0-9]{10}$/, message: '手机号格式有误', trigger: 'blur'}
        ],
        d15: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { pattern: /\w@\w*\.\w/, message: '邮箱格式有误', trigger: 'blur' },
        ],
        d21: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { type: 'string', min: 1, max: 30, message: '输入长度1-30个字符', trigger: 'blur' },
        ],
        d22: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { pattern: /^1[0-9]{10}$/, message: '手机号格式有误', trigger: 'blur'}
        ],
        d23: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { pattern: /^[1-9][0-9]{5}$/, message: '邮编格式有误', trigger: 'blur'}
        ],
        d24: [
          { required: true, type: 'array', message: '所选区域不能为空', trigger: 'change'},
        ],
        d25: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { type: 'string', min: 1, max: 80, message: '输入长度1-80个字符', trigger: 'blur' },
        ],
        d51: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { type: 'string', min: 1, max: 20, message: '输入长度1-20个字符', trigger: 'blur' },
        ],
        d52: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { type: 'string', min: 1, max: 100, message: '输入长度1-100个字符', trigger: 'blur' },
        ],
        d61: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { type: 'string', min: 1, max: 100, message: '输入长度1-100个字符', trigger: 'blur' },
        ],
        d71: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { type: 'string', min: 1, max: 100, message: '输入长度1-100个字符', trigger: 'blur' },
        ],
      },
      activeStep: null,
      diaTitle: '',
      shwoDia: false,
      diaIdx: 0,
      id: '',             // 订单id
      orderStatus: '',    // 订单状态
      from: '',           // 跳转来源
      fromId: '',         // 跳转来源的id参数
    }
  },
  computed: {
    transStatus () {
      return value => {
        return value == 10 ?'待付款'
          : value == 20 ? '待发货'
          : value == 40 ? '已发货'
          : value == 50 ? '已收货-待评价'
          : value == 60 ? '已评价'
          : value == 70 ? '售后中'
          : value == 80 ? '已完成'
          : value == 90 ? '已关闭'
          : '-';
      }
    },
    citysData() {
      citys.forEach(e => {
        if (e.children && e.children.length) {
          e.children.forEach(o => {
            if (o.children && o.children.length) {
              o.children.forEach(c => {
                if (c.children && !c.children.length) delete c.children;
              });
            } else {
              delete o.children;
            }
          });
        } else {
          delete e.children;
        };
      });
      return citys;
    }
  },
  mounted () {
    this.id = this.$route.query.id;
    this.from = this.$route.query.from;
    this.fromId = this.$route.query.fromId;
    this.invoiceInfo = [
      {
        col1: '银色星芒刺绣网纱底裤',
        col2: '银色星芒刺绣网纱底裤',
        col3: '银色星芒刺绣网纱底裤',
        col4: '银色星芒刺绣网纱底裤',
      }
    ];

    this.orderInfoReq();
  },
  methods: {
    // 设置step数据
    setStepData (data) {
      data.sort((a, b) => a.sort - b.sort); // 升序排列
      data.map((el, index) => {
        let {operDesc, operTime} = el;
        if (operDesc.indexOf('支付') != -1) !operTime && (el.disable = '未支付');
        if (operDesc.indexOf('发货') != -1) !operTime && (el.disable = '未发货');
        if (operDesc.indexOf('收货') != -1) !operTime && (el.disable = '未收货');
        if (operDesc.indexOf('评价') != -1) !operTime && (el.disable = '未评价');

        if (operTime) {
          el.operTime = this.$dayjs(operTime).format('YYYY-MM-DD HH:mm:ss');
        }

        if (this.activeStep === null && !operTime) {
          this.activeStep = index;
        }
      });
      this.stepArr = data;
    },
    //设置基本信息
    setBasicInfo (data) {
      let {
        orderNo, serialNo, memberAccount, payType,
        dispatName, orderSourceDesc, activeNum, orderType
      } = data;

      orderNo = orderNo || '-';
      serialNo = serialNo || '-';
      memberAccount = memberAccount || '-';
      payType = this.payType[payType] || '-';

      dispatName = dispatName || '-';
      orderSourceDesc = orderSourceDesc || '-';
      activeNum = activeNum || '-';
      orderType = this.orderType[orderType] || '-';

      // 设置数据、兼容处理
      this.$set(this.basicInfo1, 0, {orderNo, serialNo, memberAccount, payType});
      this.$set(this.basicInfo2, 0, {dispatName, orderSourceDesc, activeNum, orderType});
    },
    // 设置收货人信息
    setReciverInfo (data) {
      let {
        deliveryMemberName, deliveryPhone, deliveryAddress
      } = data;

      deliveryMemberName = deliveryMemberName || '-';
      deliveryPhone = deliveryPhone || '-';
      deliveryAddress = deliveryAddress || '-';

      // 设置数据、兼容处理
      this.$set(this.receiverInfo, 0, {deliveryMemberName, deliveryPhone, deliveryAddress});
    },
    // 设置商品信息
    setGoodsInfo (data) {
      this.goodsInfo = data;
    },
    // 设置费用信息
    setFeeInfo (data) {
      let {
        productPriceTatal, freight, couponPriceDeduction, whalePeasDeduction, practicalPrice,
        payWhalePeas, whalePeasTotal
      } = data;

      productPriceTatal = '￥' + Number(productPriceTatal || 0).toFixed(2);
      freight = '￥' + Number(freight || 0).toFixed(2);
      couponPriceDeduction = '-￥' + Number(couponPriceDeduction || 0).toFixed(2);
      whalePeasDeduction = '-￥' + Number(whalePeasDeduction || 0).toFixed(2);
      practicalPrice = '￥' + Number(practicalPrice || 0).toFixed(2);

      this.$set(this.feeInfo, 0, {productPriceTatal, freight, couponPriceDeduction, whalePeasDeduction, practicalPrice, payWhalePeas, whalePeasTotal});
    },
    // 设置获赠信息
    setGiftInfo (data) {
      let {
        contributionNum, commission
      } = data;

      contributionNum = Number(contributionNum || 0).toFixed(6);
      commission = '￥' + Number(commission || 0).toFixed(2);

      this.$set(this.giftInfo, 0, {contributionNum, commission});
    },
    // 设置操作信息
    setLogInfo (data) {
      this.logInfo = [];

      data.map(el => {
        let {
          memberName, createTime, orderStatus, payStatus, deliverStatus, remark
        } = el;

        memberName = memberName || '-';
        createTime = createTime ? this.$dayjs(createTime).format('YYYY-MM-DD HH:mm:ss') : '-';
        orderStatus = this.transStatus(orderStatus);
        payStatus = this.pay[payStatus] || '-';
        deliverStatus = this.deliver[deliverStatus] || '-';
        remark = remark || '-';

        this.logInfo.push({
          memberName, createTime, orderStatus, payStatus, deliverStatus, remark
        });
      });
    },
    // 获取订单详情
    async orderInfoReq () {
      try {
        let {data} = await orderInfo({
          id: this.id
        });

        // 商品合计
        this.total = data.total;
        this.whalePeasTotal = data.whalePeasTotal;
        // 订单备注
        this.remark = data.remark;
        // 获取订单状态
        this.orderStatus = data.orderStatus;
        // 设置step 数据
        this.setStepData(data.orderOperResps);
        // 设置基本信息
        this.setBasicInfo(data);
        // 设置收货人信息
        this.setReciverInfo(data);
        // 设置商品信息
        this.setGoodsInfo(data.orderProductResps);
        // 设置费用信息
        this.setFeeInfo(data);
        // 设置获赠信息
        this.setGiftInfo(data);
        // 设置操作信息
        this.setLogInfo(data.logResps);
      } catch (error) {
        throw error;
      }
    },
    // 取消弹窗
    cancelDia () {
      const diaForm = 'diaForm' + this.diaIdx;

      this.shwoDia = false;
      this.diaTitle = '';
      if (this.diaIdx != 4) {
        this.$refs[diaForm].resetFields();
      };

      setTimeout(() => {
        this.diaIdx = 0;
      }, 30);
    },
    // 加载loading
    loadLoading (tg) {
      const target = this.$refs[tg].$el.firstChild;

      this.loadinger = this.$loading({
        target,
        lock: true,
        text: '更新中...',
        spinner: 'el-icon-sunny',
        customClass: 'loadingAnim',
      });
    },
    // 确认弹窗
    confirmDia () {
      const diaForm = 'diaForm' + this.diaIdx;

      if (this.diaIdx != 4) {
        this.$refs[diaForm].validate(valid => {
          if (valid) {
            this.loadLoading('exchange');
            // 发起请求
            this.isEdit = false;
          } else {
            return false;
          }
        });
      };
    },
    // 处理修改信息操作
    editInfoDio (arg) {
      let diaTitle = arg == 1 ? '修改发票信息'
        : arg == 2 ? '修改收货人信息'
        : arg == 4 ? '修改费用信息'
        : arg == 5 ? '发送站内信'
        : arg == 6 ? '关闭订单'
        : arg == 7 ? '备注订单'
        : '';
      if (arg != 1 && arg != 3) {
        this.diaIdx = arg;
        this.shwoDia = true;
        this.diaTitle = diaTitle;
      };
    },
    // 格式化
    formatter (row, column) {
      let key = column.property;
      const h = this.$createElement;

      if (key == 'img') {
        let src = row[key];
        let fit = 'fit';
        let style = {
          textAlign: 'center',
          color: '#c0c4cc',
        };
        const imgCell = h('el-image', {props: {src, fit}, class: 'block'}, [
          h('div', {slot: 'placeholder', style}, '加载中...')
        ]);

        return imgCell;
      } else if (key == 'itemNo') {
        let style = {textAlign: 'left',};
        // 设置价格
        let price = Number(row['price'] || 0);
        price = price ? '￥' + price.toFixed(2) : 0;
        // 设置货号
        let itemNo = row['itemNo'];
        itemNo = itemNo ? 'No' + itemNo : '-';
        // 设置cell
        let cell = h('div', {style}, [
          h('p', `价格：${price}`),
          h('p', `货号：${itemNo}`),
        ]);

        return cell;
      } else if (key == 'props') {
        let cells = [];
        let props = row[key];
        let style = {textAlign: 'left',};
        // 设置cells
        props.map(({name, value}) => {
          let cell = name ? h('p', `${name}：${value || '-'}`) : null;
          cell && cells.push(cell);
        });

        return props.length ? h('div', {style}, cells) : '-';
      } else if (key == 'num' || key == 'stock') {
        return row[key] || 0;
      } else if (key == 'marketPrice' || key == 'price' || key == 'salaPrice' || key == 'supplyPrice' || key == 'subtotal') {
        let value = Number(row[key] || 0);
        return value ? '￥' + value.toFixed(2) : 0;
      } else {
        return row[key] || '-';
      }
    },
    // 加载loading
    loadLoading (target) {
      const loadinger = this.$loading({
        target,
        lock: true,
        text: '更新中...',
        spinner: 'el-icon-sunny',
        customClass: 'loadingAnim',
      });

      return loadinger;
    },
    // 审核弹框
    auditTips (arg) {
      const vm = this;
      const h = this.$createElement;
      const style = {fontSize: '14px', padding: '10px 10px 15px'};

      const message = this.orderStatus == 3 ? h('div', {style}, [
        h('strong', {style: {fontSize: '15px'}}, '是否确认收货？'),
        h('p', '确认收货后，退款将会退给用户')
      ]) : h('div', {style}, [
        h('strong', {style: {fontSize: '15px'}}, '是否确认收货？'),
        h('p', '确认收货后，请及时给用户发货“所换商品”')
      ]);

      this.$msgbox({
        title: '',
        message,
        center: true,
        showClose: true,
        closeOnClickModal: false,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            const target = instance.$el.firstChild;
            const loading = vm.loadLoading(target);

            setTimeout(() => {
              loading.close();
              done();
            }, 3200);
          } else {
            done();
          }
        }
      }).then(() => {
        this.$message.success('确认收货成功');
      }).catch(() => {
        this.$message.info('已取消确认收货');
      });
    },
    // 返回
    goBackList () {
      const curView = this.$route;
      const path = this.from || 'orderList';
      const query = this.fromId ? {id: this.fromId, originFlag: 'returnButon'} : { originFlag: 'returnButon' };
      
      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          this.$router.replace({path, query}); // 返回列表页
        });
      });
    },
  }
}
</script>

<style lang="scss" scoped>
  .order-detail-wrap {
    padding: 25px 40px 0;
    .order-steps {
      ::v-deep {
        .el-step__title {
          font-weight: bold;
        }
        .el-step__head {
          .el-step__line {
            top: 24px;
          }
          .el-step__icon.is-text {
            width: 48px;
            height: 48px;
            font-size: 24px;
          }
          &.is-finish {
            .el-step__icon.is-text {
              background: #1890ff;
              color: #fff;
            }
          }
        }
      }
    }
    .order-status {
      min-height: 80px;
      box-sizing: border-box;
      background-color: rgb(243, 243, 243);
      border: 1px solid rgb(228, 228, 228);
      border-radius: 2px;
      font-size: 16px;
      color: rgb(240, 72, 68);
      text-align: left;
      line-height: 80px;
      margin-top: 30px;
      .status {
        border: none !important;
        line-height: unset;
        height: unset;
        font-size: 16px;
      }
    }
    .box-card {
      margin: 0 auto;
      margin-top: 30px;
      ::v-deep .el-card__header {
        padding: 0 12px;
        min-height: unset;
        font-size: 16px;
        height: 50px;
        line-height: 50px;
        color: #666;
        background-color: rgba(243, 243, 243, 1);
      }
      .info-item {
        min-height: 48px;
        line-height: 48px;
        font-size: 14px;
        border-bottom: 1px solid #e4e4e4;
        &:first-child {
          border-top: 1px solid #e4e4e4;
        }
        &.top-border {
          border-top: 1px solid #e4e4e4;
        }
        &.custom-wt {
          font-size: 15px;
          font-weight: 800;
        }
        &.img-item {
          display: flex;
        }
        .item-label {
          color: #666;
          text-align: right;
          background: #f9fafc;
        }
        .text-normal {
          color: #6699ff;
        }
        .text-block {
          color: #ff6600;
        }
      }
    }
    .dialog-footer {
      display: inline-block;
      button {
        margin-right: 30px;
      }
    }
    .text-sum {
      color: #ed5565;
      font-weight: 600;
      font-size: 16px;
    }
    .summary-txt {
      height: 60px;
      background: #f9fafc;
      margin-top: 20px;
      line-height: 60px;
      text-align: right;
      color: #ed5565;
      font-weight: 600;
      font-size: 16px;
      padding: 0 15px;
    }
    .custom-form {
      width: 500px;
      margin: 10px auto;
      .el-form-item {
        ::v-deep .el-form-item__label {
          font-weight: normal;
        }
        .input-class {
          width: 360px;
        }
        .input-tips {
          color: #9ca7b5;
          font-size: 13px;
          line-height: 26px;
        }
      }
    }
    .custom-switcher {
      ::v-deep .el-switch__label--left,
      ::v-deep .el-switch__label--right {
        position: absolute;
        z-index: -1;
        font-size: 14px;
      }
      ::v-deep .el-switch__label--left {
        margin-right: 10px;
        right: 0;
        color: #999;
      }
      ::v-deep .el-switch__label--right {
        margin-right: 0px;
        left: 0px;
        color: #fff;
      }
      ::v-deep .el-switch__label.is-active {
        z-index: 20;
      }
      ::v-deep .el-switch__core {
        height: 26px;
        border-radius: 24px;
      }
      ::v-deep .el-switch__core:after {
        border-radius: 24px;
        width: 26px;
        height: 26px;
        margin-left: -2px;
        box-shadow: -3px 0px 1px #888;
        top: -1px;
      }
      &.is-checked ::v-deep .el-switch__core:after {
        margin-left: -25px;
        box-shadow: 3px 0px 1px #888;
      }
    }
    .x-btn {
      box-shadow: 4px 2px 3px #999;
    }
    .form-btns {
      text-align: center;
      margin-top: 35px;
      margin-bottom: 30px;
      button {
        min-width: 98px;
        margin-right: 50px;
      }
    }
    .custom-remark {
      min-height: 48px;
      line-height: 48px;
      font-size: 14px;
      border: 1px solid #e4e4e4;
      margin-top: 15px;
      .remark-label {
        color: #666;
        width: 250px;
        padding: 0 12px;
        text-align: right;
        background: #f9fafc;
        border-right: 1px solid #e4e4e4;
        display: inline-block;
      }
    }
    .info-item {
      min-height: 48px;
      line-height: 48px;
      font-size: 14px;
      border-bottom: 1px solid #e4e4e4;
      &:first-child {
        border-top: 1px solid #e4e4e4;
      }
      &.top-border {
        border-top: 1px solid #e4e4e4;
      }
      &.img-item {
        display: flex;
      }
      .item-label {
        color: #666;
        text-align: right;
        background: #f9fafc;
      }
      .text-normal {
        color: #6699ff;
      }
      .text-block {
        color: #ff6600;
      }
    }
  }
</style>

