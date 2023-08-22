<template>
  <div class="city-service-edit-page">
    <el-form :model="serviceForm" inline-message :rules="rules" ref="serviceForm" label-width="130px" class="serviceForm">

        <el-form-item class="form-base-class common-item" label="用户" prop="phone">
          <el-radio v-model="radioActType" label="1">手机号</el-radio>
          <el-radio disabled v-model="radioActType" label="2">邮箱</el-radio>

          <div class="common-item-label">账号：</div>
          <el-select :disabled="type=='edit'" @change="handleChangePerfix" v-model="telPerfix" placeholder="请选择" class="telPerfixStyle">
            <el-option
              v-for="item in telPerfixArr"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input v-model="serviceForm.phone" placeholder="请输入手机号" clearable :disabled="type=='edit'"></el-input>
        </el-form-item>

        <el-form-item class="form-base-class common-item" label="确定服务商用户" prop="memberId">
          <div class="common-item-label">{{usersName||''}}</div>
        </el-form-item>

        <el-form-item class="form-base-class common-item" label="代理节点" prop="memberId">
          <!-- 新需求2022-6-9 编辑状态可以编辑 代理节点、合约城市 :disabled="type=='edit'"-->
          <el-radio-group v-model="radioNode" @change="handleRadio">
            <el-radio v-for="(item, index) in radioNodeArr" :key="index" :label="item.code">{{item.desc}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item class="form-base-class last-form-item" label="专属特权配置">
          <div class="condition-settting">
            <el-row class="row-setting">
              <el-col :span="19">
                <el-form-item label-width="108px" label="合约城市">
                  <el-cascader ref="cascader" class="item1-input" v-model="selectedArr" :options="citysData" @change="handleChange">
                  </el-cascader>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="row-setting">
              <el-col :span="19">
                <el-form-item label-width="108px" label="协议期限" prop="signTime">
                  <el-input class="item1-input" v-model="serviceForm.signTime">
                    <template slot="append">月</template>
                    <!-- <el-select class="item1-input-select" v-model="serviceForm.signUnit" slot="append" disabled placeholder="请选择">
                      <el-option label="月" value="M"></el-option>
                      <el-option label="年" value="y"></el-option>
                    </el-select> -->
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="row-setting">
              <el-col :span="19">
                <el-form-item label-width="108px" label="开始时间设定" prop="startAt">
                  <el-date-picker @change="changeDate" class="item1-input" :picker-options="pkOpts" value-format="yyyy-MM-dd" v-model="serviceForm.startAt" type="date" placeholder="选择日期"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
      </el-form-item>
    </el-form>

    <div class="form-btns">
      <el-button type="primary" @click="cancelSubmit">取消</el-button>
      <el-button type="primary" @click="resetForm">重置</el-button>
      <el-button type="primary" @click="submitForm" v-hasPermi="['integral:task:update:asterisk']">保存</el-button>
    </div>
  </div>
</template>

<script>
import citys from '@/utils/provinceCity';
import {facilitatorSave, facilitatorUpdate, memberSearch, memberSearchv2, abroadFacilitator} from '@/api/member/cityService';
import {taskNodeListQuery, userAreaPhone} from '@/api/pointsMgmt/starTasks';

export default {
  name: 'CityServiceEditPage',
  data () {
    const vm = this;
    return {
      citysData: [],
      radioNode: 10,
      radioNodeArr: [],
      matchedObj: {},
      telPerfixArr: [],
      telPerfix: '',
      radioActType: '1',
      usersName: '',
      serviceForm: {
        phone: '',
        memberId: '',
        signTime: 12,
        signUnit: 'M',
        startAt: '',
        
        provinceId: '',
        cityId: '',
        areaId: '',

        cityName: '',
        provinceName: '',
        areaName: ''
      },
      selectedArr: [],
      rules: {
        phone: [
          {required: true, message: '手机号不能为空', trigger: 'blur'},
          // {pattern: /^1[0-9]{10}$/, message: '手机号格式有误', trigger: 'blur'}
        ],
        signTime: [
          {required: false, pattern: /^[1-9]\d*$/, message: '协议期限必须为正整数', trigger: 'blur'}
        ],
      },
      type: '',
      id: '',
      info: {},
      pkOpts: {
        // 禁用日期
        // disabledDate: this.disabledDate,
      }
    }
  },
  computed: {
    // citysData() {
    //   citys.forEach(e => {
    //     e.children && e.children.forEach(o => {
    //       o.children && (delete o.children);
    //     })
    //   });
    //   return citys;
    // }
  },
  async mounted () {
    await this.runMatch()
    await this.runPhoneArea()
    await this.handleRadio()
    this.id = '';
    this.info = {};
    this.type = this.$route.query.type;
    if (this.type == 'edit') {
      this.handleChangePerfix()
      this.id = this.$route.query.id;
      this.info = JSON.parse(window.sessionStorage.getItem('edit'));
      this.serviceForm = {...this.serviceForm, ...this.info};
      this.telPerfix = (this.telPerfixArr.find(item => item.label == this.info.phone.split(' ')[0])).value
      this.radioNode = +this.info.giveTaskType
      this.serviceForm.phone = this.serviceForm.phone.split(' ')[1]
      this.selectedArr = [this.serviceForm.provinceId, this.serviceForm.cityId, this.serviceForm.areaId].filter(v => v);
      console.log(this.selectedArr, 'selectedArr')
    };
  },
  methods: {
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
    handleRadio () {
      this.selectedArr = []
      // 原提交对象是否要重置？不需要，直接若selectedArr.length=0不让提交
      this.abroadFacilitatorRun()
    },
    abroadFacilitatorRun () {
      let val = null;
      val = this.radioNode == 9 ? 9 : 12
      abroadFacilitator({
        nodeType: val
      }).then(response => {
        if (+response.code === 200) {
          this.citysData = this.recursionTree(response.data.list)
        } else {
          this.citysData = []
        }
      }).catch(e => {
        console.log(e, 'e')
      })
    },
    handleChangePerfix () {
      if (this.serviceForm.phone && this.serviceForm.phone.length == 11) {
        this.memberSearchRequst()
      }
    },
    runMatch () {
      return new Promise((resolve, reject) => {
        taskNodeListQuery().then(response => {
          if (+response.code === 200) {
            this.radioNodeArr = response.data.list || []
            (response.data.list || []).forEach(item => {
              let {code, desc} = item
              this.matchedObj[code] = desc
            })
          } else {
            this.matchedObj = {}
          }
          resolve(this.matchedObj)
        })
      })
    },
    runPhoneArea () {
      // telPerfixArr|telPerfix
      return new Promise((resolve, reject) => {
        userAreaPhone().then(response => {
          if (+response.code === 200) {
            this.telPerfixArr = response.data.list || []
            this.telPerfixArr.forEach(item => {
              if(item.label == '+86') {
                this.telPerfix = item.value;
              }
            })
          }
          resolve(this.telPerfixArr)
        })
      })
    },
    // 禁用日期
    disabledDate () {
      // 当前时间小于设定启用时间才可以进行编辑
      const now = Date.now();
      const startAt = this.serviceForm.startAt;
      const setTime = new Date(startAt).getTime();
      return now >= setTime;
    },
    // 修改日期
    changeDate (date) {
      const now = new Date(new Date().toLocaleDateString()).getTime();
      const selectTime = new Date(date).getTime();
      if (now >= selectTime) {
        this.serviceForm.startAt = '';
        this.$message({type: 'error', message: '开始日期设定不能早于当前日期'});
      } else {
        this.serviceForm.startAt = date;
      };
    },
    // 会员搜索
    async memberSearchRequst () {
      try {
        // const {code, message, data} = await memberSearch({
        //   phone: this.serviceForm.phone
        // });
        let _params
        if (this.radioActType === '1') { // 手机号
          _params = {
            phone: this.serviceForm.phone,
            phoneArea: this.telPerfix
          }
        } else { // 邮箱
          _params = {
            email: '' // 等邮箱需求加了后，这里再继续接，先写固定传空
          }
        }
        const {code, message, data} = await memberSearchv2(_params);
        if (code == 200) {
          this.usersName = data?.userName??''
          this.serviceForm.memberId = data?.memberId??''
          if (!data) this.$message({type: 'error', message: '查找不到服务商用户'});
        } else {
          this.usersName = '';
          this.serviceForm.memberId = '';
          this.$message({type: 'error', message});
        }
      } catch (error) {
        this.usersName = '';
        this.serviceForm.memberId = '';
        // ...
      }
    },
    // 提交数据
    async submitData () {
      if (this.selectedArr.length <= 0) {
        this.$message({type: 'error', message: '请选择合约城市'})
        return false
      }
      try {
        let id = this.id;
        let {startAt, cityId, cityName, memberId, provinceId, provinceName, signTime, signUnit, areaId, areaName} = this.serviceForm;
        startAt = startAt ? this.$dayjs(startAt).format('YYYY-MM-DD') : '';
        const reqFn = this.type == 'add' ? facilitatorSave : facilitatorUpdate;
        const reqData = this.type == 'add'
          ? {startAt, cityId, cityName, memberId, provinceId, provinceName, signTime, signUnit, areaName, areaId, nodeType: this.radioNode}
          : {id, signTime, signUnit, startAt, cityId, cityName, memberId, provinceId, provinceName, areaName, areaId, nodeType: this.radioNode};
        // 保存接口提示用户未实名（但是用户列表里已经实名）
        const {code, message} = await reqFn(reqData);
        if (code == 200) {
          this.$message({type: 'success', message: '提交成功'});
          this.cancelSubmit();
        } else {
          this.$message({type: 'error', message});
        }
      } catch (error) {
        console.log(error)
      }
    },
    handleChange(value) {
      let {provinceName, provinceId, cityName, cityId, areaId, areaName} = {};
      let checkedNodes = this.$refs.cascader.getCheckedNodes()[0].pathNodes;
      console.log(checkedNodes, 'checkedNodes')
      let province = checkedNodes.length >= 1 && checkedNodes[0].data;
      let city = checkedNodes.length >= 2 && checkedNodes[1].data;
      let area = checkedNodes.length >= 3 && checkedNodes[2].data;
      
      checkedNodes.length >= 1 && (provinceId = province.value)
      checkedNodes.length >= 1 && (provinceName = province.label)
      checkedNodes.length >= 2 && (cityId = city.value)
      checkedNodes.length >= 2 && (cityName = city.label)
      checkedNodes.length >= 3 && (areaId = area.value)
      checkedNodes.length >= 3 && (areaName = area.label)

      this.serviceForm = {...this.serviceForm, provinceName, provinceId, cityName, cityId, areaId, areaName};
      console.log(provinceName, provinceId, cityName, cityId, areaName, areaId)
    },
    // 关闭tag标签
    closeTagFn () {
      const curView = this.$route
      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          this.$router.replace({name: 'CityService'}); // 返回列表页
        });
      });
    },
    // 取消功能
    cancelSubmit () {
      this.closeTagFn();
      this.resetForm();
    },
    // 重置功能
    resetForm() {
      if (this.type == 'edit') {
        const editInfo = JSON.parse(sessionStorage.getItem('edit'));
        this.serviceForm = {...this.serviceForm, ...editInfo};
        this.serviceForm.signTime = 12;
        this.serviceForm.signUnit = 'M';
        this.selectedArr = [editInfo.provinceId + '', editInfo.cityId + ''];
      } else {
        this.usersName = '';
        this.selectedArr = [];
        this.$refs.serviceForm.resetFields();
      }
    },
    // 提交
    submitForm() {
      this.$refs.serviceForm.validate(valid => valid ? this.submitData() : false);
    }
  },
  watch: {
    'serviceForm.phone': function(val) {
      if (val.length && val.length == 11) {
        this.memberSearchRequst();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .city-service-edit-page {
    min-width: 1200px;
    padding: 50px 80px;
    .serviceForm {
      width: 900px;
      margin: 0 auto;
      border: 1px solid #d3d3d4;
      & .form-base-class {
        margin-bottom: 0;
        & > ::v-deep .el-form-item__label {
          padding: 3px 8px;
          line-height: 46px;
          text-align: center;
        }
        & > ::v-deep .el-form-item__content {
          padding: 7px 8px 0;
          border-left: 1px solid #d3d3d4 !important;
        }
      }
      & .form-base-class:not(:last-child) {
        border-bottom: 1px solid #d3d3d4;
      }
      & .last-form-item {
        & > ::v-deep .el-form-item__label {
          height: 255px;
          line-height: 255px;
        }
        ::v-deep .el-form-item__content {
          padding-top: 0;
        }
      }
    }
    .item1-input {
      width: 270px;
      .item1-input-select {
        width: 68px;
      }
    }

    .condition-settting {
      .row-setting {
        margin-right: -8px;
        margin-left: -8px;
        height: 85px;
        padding: 24px 5px;
        border-bottom: 1px solid #d3d3d4 !important;
        & ::v-deep .el-form-item__label {
          font-weight: normal;
        }
      }
      .row-setting:last-child {
        border-bottom: none !important;
      }
    }

    .common-item {
      ::v-deep .el-form-item__content {
        padding-left: 5px !important;
      }
      .common-item-label {
        width: 96px;
        display: inline-block;
        font-size: 14px;
        color: #606266;
        text-align: right;
        margin-right: 12px;
      }
      ::v-deep .el-input {
        width: 270px;
      }
    }

    .form-btns {
      text-align: center;
      margin-top: 15px;
      margin-left: 20px;
      button {
        margin-right: 50px;
      }
    }
  }
</style>
<style>
.telPerfixStyle .el-input{width:90px!important;margin-right:10px;}
</style>
