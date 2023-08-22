<template>
  <div class="coupons-edit">
    <el-card class="wrap-card" shadow="always" :header="`编辑${isCite?'引用':'赠送'}优惠券`">
      <el-form :model="mainForm" :rules="rules" ref="mainForm" label-width="200px" class="mt40">

        <el-form-item label="到券方式：">
          <div class="text-muted">{{isCite?'配置引用':'自动赠送'}}</div>
        </el-form-item>

        <template v-if="isCite">
          <el-form-item label="优惠券类型：" prop="type">
            <el-select class="input-class" v-model="mainForm.type" placeholder="请选择优惠券类型" clearable @change="changeTypeHandle">
              <el-option label="一体化优惠券" :value="0"></el-option>
              <el-option label="配用优惠券" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </template>

        <template v-else>
          <el-form-item label="优惠券类型：" prop="type">
            <el-select class="input-class" v-model="mainForm.type" placeholder="请选择优惠券类型" clearable @change="changeTypeHandle">
              <el-option label="指定个人赠送优惠券" :value="0"></el-option>
              <el-option label="指定用户群赠送优惠券" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </template>

        <template v-if="!isCite">
          <template v-if="mainForm.type==0">
            <el-form-item label="适合用户：" prop="phone">
              <el-input class="input-class" placeholder="请输入内容" v-model="mainForm.phone">
                <i slot="suffix" @click="addUserHandle" class="el-input__icon el-icon-zoom-in add-icon-class"></i>
              </el-input>
            </el-form-item>

            <el-form-item label="确定用户：" prop="memberIds" required>
              <div class="input-class">
                <el-tag class="mr10" closable v-for="{name, type, id} in mainForm.memberIds" :key="id" :type="type" @close="handleClose(id)">
                  {{name}}
                </el-tag>
              </div>
            </el-form-item>
          </template>

          <template v-else>
            <el-form-item label="适合用户：" prop="applyUserType">
              <el-checkbox-group class="custom-radio-grop input-long-class" v-model="mainForm.applyUserType">
                <el-checkbox v-for="{label, type} in users" :key="type" :label="type">{{label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </template>
        </template>

        <el-form-item label="优惠券名称：" prop="name">
          <el-input class="input-class" v-model="mainForm.name" placeholder="请输入优惠券名称"></el-input>
        </el-form-item>

        <template v-if="(!isCite&&mainForm.type==1)||isCite">
          <el-form-item label="总发行量：" prop="stock">
            <el-input class="input-class" v-model="mainForm.stock" placeholder="请输入总发行量"></el-input>
            <div class="input-tips">只能输入正整数，留空为无限制</div>
          </el-form-item>
        </template>

        <el-form-item label="面额：" prop="couponAmount">
          <el-input class="input-class" v-model="mainForm.couponAmount" placeholder="请输入优惠券面额">
            <template slot="append">USDT</template>
          </el-input>
          <div class="input-tips">面额只能是数值，0.01-10000，限2位小数</div>
        </el-form-item>

        <el-form-item label="每人限领：" prop="limitNumber" required>
          <div class="text-muted">{{mainForm.limitNumber}}张</div>
        </el-form-item>

        <el-form-item class="mb5" label="使用门槛：" prop="useType">
          <el-radio-group class="custom-radio-grop" v-model="mainForm.useType">
            <el-radio class="input-short-class mb20" :label="0">
              <div class="input-tips inline-block">无限制</div>
            </el-radio>
            <el-radio v-if="isCite&&mainForm.type==0" class="input-class block mb20" :label="1">
              <el-form-item class="inline-block" prop="fullReductionAmount" :rules="mainForm.useType==1?rules.fullRe1:rules.fullRe2">
                <div class="input-tips inline-block mr5">满</div>
                <el-input class="input-short-class" v-model="mainForm.fullReductionAmount" placeholder="请输入满减金额">
                  <template slot="append">USDT</template>
                </el-input>
                <div class="input-tips inline-block ml5">可用</div>
              </el-form-item>
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item class="mb5" label="有效期：" prop="effectiveType" required>
          <el-radio-group class="custom-radio-grop" v-model="mainForm.effectiveType">
            <el-radio class="input-class block mb20" :label="0">
              <div class="input-tips inline-block mr5">日期范围</div>
              <el-form-item class="inline-block no-asterisk" prop="timeRange" :rules="mainForm.effectiveType==1?rules.timeRange1:rules.timeRange2">
                <el-date-picker
                  class="input-class"
                  :editable="false"
                  type="datetimerange"
                  format="yyyy-MM-dd HH:mm"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  v-model="mainForm.timeRange"
                  :default-time="['00:00:00', '23:59:59']"
                  :picker-options="opts">
                </el-date-picker>
              </el-form-item>
            </el-radio>
            <el-radio class="input-class block mb20" :label="1">
              <div class="input-tips inline-block mr5">固定天数</div>
              <el-form-item class="inline-block" prop="expireDay" :rules="mainForm.effectiveType==1?rules.expireDay1:rules.expireDay2">
                <el-input class="input-class" v-model.number="mainForm.expireDay" placeholder="领取后到期天数">
                  <template slot="append">天</template>
                </el-input>
              </el-form-item>
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <template v-if="isCite">
          <el-form-item label="适合用户：" prop="applyUserType">
            <el-checkbox-group class="custom-radio-grop input-long-class" v-model="mainForm.applyUserType">
              <el-checkbox v-for="{label, type} in users" :key="type" :label="type">{{label}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <template v-if="mainForm.type==0">
            <el-form-item label="开始发放时间：" prop="givingAt">
              <el-date-picker
                class="input-short-class"
                v-model="mainForm.givingAt"
                type="datetime"
                :editable="false"
                format="yyyy-MM-dd HH:mm"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            
            <el-form-item label="可使用商品：" prop="applyGoodsType">
              <el-radio-group v-model="mainForm.applyGoodsType" @change="goodsGroupChange">
                <el-radio-button v-for="{label, type} in goods" :key="type" :label="type">{{label}}</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <br><br><br>
          </template>
        </template>

        <template v-else>
          <template v-if="mainForm.type==1">
            <el-form-item label="开始发放时间：" prop="givingAt">
              <el-date-picker
                class="input-short-class"
                v-model="mainForm.givingAt"
                type="datetime"
                :editable="false"
                format="yyyy-MM-dd HH:mm"
                placeholder="选择日期时间"
                :picker-options="opts">
              </el-date-picker>
            </el-form-item>
            <br><br><br>
          </template>
          <el-form-item label="可使用商品：" prop="applyGoodsType">
            <el-radio-group v-model="mainForm.applyGoodsType" @change="goodsGroupChange">
              <el-radio-button v-for="{label, type} in goods" :key="type" :label="type">{{label}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </template>

        <!-- 可使用商品 -->
        <item-wraper ref="witems" v-if="showDrawer" :ptype="mainForm.applyGoodsType" :pids="mainForm.applyGoodsIds"/>

        <el-form-item label="备注：" prop="remark">
          <el-input
            rows="5"
            resize="none"
            type="textarea"
            class="input-long-class"
            maxlength="20"
            show-word-limit
            v-model="mainForm.remark"
            placeholder="请输入备注"
          >
          </el-input>
        </el-form-item>

        <el-form-item>
          <div class="form-btns">
            <el-button type="primary" @click="resetForm">重置</el-button>
            <el-button type="primary" v-hasPermi="['coupon:reference:edit', 'coupon:giving:edit']" @click="submitForm">保存</el-button>
            <el-button type="warning" @click="goBack2List">返回</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import ItemWraper from './edit/itemWraper.vue';
import {citeEditDetails, citeEditUpdate, givingEditDetails, givingEditUpdate, memberSearch} from '@/api/coupons';
import {givingEditDetails as gameEditDetails, givingEditUpdate as gameEditUpdate} from '@/api/coupons';
const reg1 = /^0(\.[1-9]\d?|\.\d[1-9])$|^[1-9]\d{0,3}(\.\d{1,2})?$|^10000(\.[0]{1,2})?$/; // 0.01 - 10000
const types = ['', 'success', 'info', 'warning', 'danger'];
const rdm = () => types[Math.floor(Math.random() * 5)];

export default {
  // 优惠券编辑
  name: 'CouponsEdit',
  data () {
    return {
      // 0:所有用户 1:普通用户 2:VIP会员 3:新用户 4:老用户 5:一星达人 6:二星达人 7:三星达人 8:四星达人 9:城市服务商 10:合伙人 11:团长 12:高级团长
      users: [
        {
          type: 0,
          label: '所有用户',
        },
        {
          type: 1,
          label: '普通用户',
        },
        {
          type: 2,
          label: 'VIP用户',
        },
        {
          type: 3,
          label: '新用户',
        },
        {
          type: 4,
          label: '老用户',
        },
        {
          type: 5,
          label: '一星达人',
        },
        {
          type: 6,
          label: '二星达人',
        },
        {
          type: 7,
          label: '三星达人',
        },
        {
          type: 8,
          label: '四星达人',
        },
        {
          type: 9,
          label: '城市服务商',
        },
        {
          type: 10,
          label: '合伙人',
        },
        {
          type: 11,
          label: '团长',
        },
        {
          type: 12,
          label: '高级团长',
        },
      ],
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
      mainForm: {
        name: '',                             // 优惠券名称
        phone: '',                            // 选择用户查询的手机号
        type: 0,                              // 优惠券类型 0:指定个人赠送优惠券 1:指定用户群赠送优惠券
        timeRange: [],                        // 有效期范围
        limitNumber: 1,                       // 每人限领数
        effectiveEndTime: null,               // 日期范围结束时间
        effectiveStartTime: null,             // 日期范围开始时间
        applyUserType: [],                    // 适合用户类型
        stock: '',                            // 总发行量
        couponAmount: '',                     // 优惠券面额
        useType: 0,                           // 使用门槛类型 0:无限制 1:满减
        fullReductionAmount: '',              // 满减的金额
        effectiveType: 0,                     // 有效期类型 0:日期范围 1:固定天数
        expireDay: '',                        // 有效期天数
        givingAt: '',                         // 优惠卷发放时间
        applyGoodsType: 0,                    // 适用商品类型 0:全场通用 1:指定商品 2:指定分类 3:指定供应商 4:指定自营店
        remark: '',                           // 备注
        givingType: 0,                        // 赠送方式
        applyGoodsIds: [],                    // 可使用商品的ID
        memberIds: [],                        // 适合的用户
      },
      limitNumber: 1,
      showDrawer: false,
      rules: {
        name: [
          { required: true, message: '优惠券名称不能为空', trigger: 'blur' },
          { min: 1, max: 20, message: '长度限制1-20个字符', trigger: 'blur' }
        ],
        phone: [
          { required: false, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '手机号格式有误', trigger: 'blur' }
        ],
        applyUserType: [
          { type: 'array', required: true, message: '适合用户类型不能为空', trigger: 'change' }
        ],
        memberIds: [
          { type: 'array', required: true, message: '适合用户不能为空', trigger: 'change' }
        ],
        couponAmount: [
          { required: true, message: '优惠券面额不能为空', trigger: 'blur' },
          { pattern: reg1, message: '输入为正数或1-2位小数，取值范围0.01-10000', trigger: 'blur'}
        ],
        fullRe1: [
          { required: true, message: '满减金额不能为空', trigger: 'blur' },
          { pattern: reg1, message: '输入为正数或1-2位小数，取值范围0.01-10000', trigger: 'blur'}
        ],
        fullRe2: [
          { required: false }
        ],
        timeRange1: [
          { required: false }
        ],
        timeRange2: [
          { type: 'array', required: true, message: '有效期日期范围不能为空', trigger: 'change' }
        ],
        expireDay1: [
          { required: true, message: '有效期固定天数不能为空', trigger: 'blur' },
          { type: 'number', min: 1, max: 365, transform: val => Number(val), message: '有效期固定天数取值范围1-365', trigger: 'blur'}
        ],
        expireDay2: [
          { required: false },
        ],
        stock: [
          { required: false, pattern: /^[1-9]\d*$/, message: '总发行量为大于等于1的正整数', trigger: 'blur'}
        ],
        givingAt: [
          { required: true, message: '开始发放时间不能为空', trigger: 'blur' },
        ]
      },
      opts: {
        disabledDate (time) {
          return time.getTime() <= Date.now() - 1000 * 3600 * 24;
        },
      },
      id: '',
      // isCite: false,
      isCite: '',
    }
  },
  components: {ItemWraper},
  beforeRouteEnter (to, from, next) {
    const {query} = to;
    const id = query?.id;
    // const isCite = query?.from == 'cite';
    const isCite = query?.from;

    next(vm => {
      vm.isCite = isCite;
      vm.id = id;
      return true;
    });
  },
  mounted () {
    this.detailsReq();
  },
  methods: {
    // 获取优惠券详情
    async detailsReq () {
      try {
        let timeRange = [];
        // const reqFn = this.isCite ? citeEditDetails : givingEditDetails;
        const reqFn = ''
        if (this.isCite == 'cite') {
          reqFn = citeEditDetails
        } else if (this.isCite == 'giving') {
          reqFn = givingEditDetails
        } else if (this.isCite == 'game') {
          reqFn = gameEditDetails
        }
        const {data} = await reqFn({couponId: this.id});

        this.limitNumber = data.limitNumber;
        if (this.isCite == 'cite') {
          // 获取引用优惠券详情
          let {
            applyGoodsType, applyUserType, couponAmount, couponNo, effectiveEndTime, effectiveStartTime,
            effectiveType, expireDay, fullReductionAmount, givingAt, givingType, limitNumber, name,
            status, stock, type, useType, applyGoodsIds, remark
          } = data;

          this.mainForm = {
            applyGoodsType, applyUserType, couponAmount, couponNo, effectiveType, remark,
            givingAt, givingType, limitNumber, name, status, stock, type, useType,
          };

          // 有效期类型
          if (effectiveType == 0) {
            timeRange = [effectiveStartTime, effectiveEndTime];
            this.$set(this.mainForm, 'timeRange', timeRange);
            this.$set(this.mainForm, 'expireDay', '');
          } else {
            this.$set(this.mainForm, 'timeRange', []);
            this.$set(this.mainForm, 'expireDay', expireDay);
          };

          // 使用门槛类型
          if (useType == 0) {
            this.$set(this.mainForm, 'fullReductionAmount', '');
          } else {
            this.$set(this.mainForm, 'fullReductionAmount', fullReductionAmount);
          };

          if (type == 0) {
            // 一体化优惠券
            this.goodsGroupChange(applyGoodsType);
            applyGoodsType && this.$set(this.mainForm, 'applyGoodsIds', applyGoodsIds);
          };
        } else if (this.isCite == 'giving' || this.isCite == 'game') {
          // 获取赠送优惠券详情
          let {
            applyGoodsType, applyUserType, couponAmount, effectiveType, effectiveStartTime, effectiveEndTime,
            expireDay, fullReductionAmount, givingAt, givingType, limitNumber, name, status,
            stock, type, useType, applyGoodsIds, remark
          } = data;

          this.mainForm = {
            applyGoodsType, applyUserType, couponAmount, effectiveType, remark,
            givingAt, givingType, limitNumber, name, status, stock, type, useType,
          };

          // 有效期类型
          if (effectiveType == 0) {
            timeRange = [effectiveStartTime, effectiveEndTime];
            this.$set(this.mainForm, 'timeRange', timeRange);
            this.$set(this.mainForm, 'expireDay', '');
          } else {
            this.$set(this.mainForm, 'timeRange', []);
            this.$set(this.mainForm, 'expireDay', expireDay);
          };

          // 使用门槛类型
          if (useType == 0) {
            this.$set(this.mainForm, 'fullReductionAmount', '');
          } else {
            this.$set(this.mainForm, 'fullReductionAmount', fullReductionAmount);
          };

          this.goodsGroupChange(applyGoodsType);
          applyGoodsType && this.$set(this.mainForm, 'applyGoodsIds', applyGoodsIds);
        }
      } catch (error) {
        throw error;
      }
    },
    // 切换优惠券类型
    changeTypeHandle (val) {
      this.$refs.mainForm.resetFields();
      const initData = this.$options.data().mainForm;
      this.mainForm = {...this.mainForm, ...initData};
      this.mainForm.type = val;
      this.mainForm.limitNumber = this.limitNumber;
    },
    // 更新优惠券
    async updateCouponReq (cb) {
      try {
        let reqFn;
        let reqDate;
        let id = this.id;
        let {
          name, type, timeRange, limitNumber, applyUserType, stock, couponAmount, givingType, applyGoodsIds,
          useType, fullReductionAmount, effectiveType, expireDay, givingAt, applyGoodsType, remark,
        } = this.mainForm;
        let [effectiveStartTime, effectiveEndTime] = timeRange || [];
        effectiveStartTime = effectiveStartTime || '';
        effectiveEndTime = effectiveEndTime || '';
        // 使用门槛 0:无限制 1:满减
        fullReductionAmount = useType ? fullReductionAmount : null;
        // 有效期 0:日期范围 1:固定天数
        if (effectiveType) {
          effectiveStartTime = effectiveEndTime = null;
        } else {
          expireDay = null;
        };
        if (this.isCite == 'cite') {
          reqFn = citeEditUpdate;

          // 配用优惠券
          reqDate = {
            effectiveStartTime, effectiveEndTime, givingType, name, type, limitNumber, couponAmount,
            useType, fullReductionAmount, effectiveType, expireDay, applyUserType, remark, stock
          };

          // 优惠券类型【一体化/配用】
          if (type === 0) {
            // 一体化优惠券
            // 可用优惠券的商品/分类/供应商 id
            let ids = [];
            if (applyGoodsType) {
              ids = this.$refs.witems.handleCheckIds();
              if (!ids) return cb.close();
            };
            applyGoodsIds = ids;
            reqDate = {...reqDate, givingAt, applyGoodsType, applyGoodsIds};
          };
        } else if (this.isCite == 'giving') {
          reqFn = givingEditUpdate;

          // 可用优惠券的商品/分类/供应商/自营店 id
          let ids = [];
          if (applyGoodsType) {
            ids = this.$refs.witems.handleCheckIds();
            if (!ids) return cb.close();
          };
          applyGoodsIds = ids;

          reqDate = {
            effectiveStartTime, effectiveEndTime, givingType, name, type, limitNumber, couponAmount,
            applyGoodsIds, useType, fullReductionAmount, effectiveType, expireDay, applyGoodsType, remark,
          };

          // 优惠券类型【个人/群体】
          if (type === 0) {
            // 个人优惠券
            let memberIds = this.mainForm.memberIds.map(({id}) => id);
            if (!memberIds.length) {
              cb.close();
              return this.$message.error('赠送用户不能为空！')
            };
            reqDate = {...reqDate, memberIds};
          } else {
            // 群体优惠券
            reqDate = {...reqDate, applyUserType, stock, givingAt};
          };
        } else if (this.isCite == 'game') {
          // game...
          reqFn = gameEditUpdate;

          // 可用优惠券的商品/分类/供应商/自营店 id
          let ids = [];
          if (applyGoodsType) {
            ids = this.$refs.witems.handleCheckIds();
            if (!ids) return cb.close();
          };
          applyGoodsIds = ids;

          reqDate = {
            effectiveStartTime, effectiveEndTime, givingType, name, type, limitNumber, couponAmount,
            applyGoodsIds, useType, fullReductionAmount, effectiveType, expireDay, applyGoodsType, remark,
          };

          // 优惠券类型【个人/群体】
          if (type === 0) {
            // 个人优惠券
            let memberIds = this.mainForm.memberIds.map(({id}) => id);
            if (!memberIds.length) {
              cb.close();
              return this.$message.error('赠送用户不能为空！')
            };
            reqDate = {...reqDate, memberIds};
          } else {
            // 群体优惠券
            reqDate = {...reqDate, applyUserType, stock, givingAt};
          };
        }

        const {code, data} = await reqFn({...reqDate, id});
        if (code == 200) {
          this.$message.success('提交成功');
          this.goBack2List();
        } else {
          this.$message.error(message);
        }
        cb.close();
      } catch (error) {
        cb.close();
        throw error;
      }
    },
    // 用户搜索
    async memberSearchReq () {
      try {
        const {phone, memberIds} = this.mainForm;
        const {data: {memberId, userName}} = await memberSearch({phone});
        let index = memberIds.findIndex(el => el.id == memberId);
        if (index != -1) return this.$message.error('不能添加相同的用户！');
        this.mainForm.memberIds.push({
          type: rdm(),
          id: memberId,
          name: userName,
        });
      } catch (error) {
        throw error;
      }
    },
    // 添加用户
    addUserHandle () {
      if (/^1[0-9]{10}$/.test(this.mainForm.phone)) {
        if (this.mainForm.memberIds.length > 14) {
          this.$message.error('指定个人赠送优惠券最多可添加14人');
          return false;
        };
        this.memberSearchReq();
      } else {
        this.$message.error('手机号格式有误！');
      };
    },
    // 移除用户
    handleClose (id) {
      let index = this.mainForm.memberIds.findIndex(el => el.id == id);
      this.mainForm.memberIds.splice(index, 1);
    },
    // 可使用商品切换
    goodsGroupChange (id) {
      if (id == 0) {
        this.showDrawer = false;
      } else {
        this.showDrawer = true;
      };

      this.mainForm.applyGoodsIds = [];
    },
    // 加载loading
    loadLoading () {
      const loadinger = this.$loading({
        lock: true,
        text: '更新中...',
        fullscreen: true,
        spinner: 'el-icon-sunny',
        customClass: 'custom-loading',
      });

      return loadinger;
    },
    // 取消功能
    goBack2List () {
      const curView = this.$route;
      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          this.$router.replace({path: 'couponsList'}); // 返回列表页
        });
      });
    },
    // 重置功能
    resetForm() {
      this.$refs.mainForm.resetFields();
      const initData = this.$options.data().mainForm;
      this.mainForm = {...this.mainForm, ...initData};
    },
    // 提交
    submitForm() {
      this.$refs.mainForm.validate(valid => {
        if (valid) {
          const cb = this.loadLoading();
          setTimeout(() => this.updateCouponReq(cb), 800);
        } else {
          return false;
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
  .coupons-edit {
    min-width: 1200px;
    padding: 80px 20px 20px;
    .wrap-card {
      width: 1100px;
      margin: 0 auto;
      ::v-deep .el-card__header {
        font-size: 14px;
        padding: 14px 15px;
        background-color: #f3f3f3;
      }
      .el-form-item {
        ::v-deep {
          .el-form-item__label {
            font-weight: 400;
          }
          .el-input-group__append {
            padding: 0 12px;
          }
        }
      }
      .input-class {
        width: 360px;
      }
      .input-short-class {
        width: 200px;
      }
      .input-long-class {
        width: 560px;
      }
      .input-tips {
        color: #9ca7b5;
        vertical-align: middle;
        line-height: 22px;
      }
      .no-asterisk {
        ::v-deep .el-form-item__label {
          &::before {
            display: none;
          }
        }
      }
      .custom-radio-grop {
        display: block;
        ::v-deep .el-radio {
          min-width: 125px;
          line-height: 36px;
          .el-form-item__error {
            font-weight: normal;
          }
        }
      }
      .add-icon-class {
        font-size: 18px;
        cursor: pointer;
        &:hover {
          color: #1890ff;
        }
      }
      .form-btns {
        margin-top: 25px;
        button {
          margin-right: 50px;
        }
      }
    }
  }
</style>
