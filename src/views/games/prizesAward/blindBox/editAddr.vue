<template>
  <div class="edit-addr">
    <el-form :model="mainForm" :rules="rules" ref="mainForm" label-width="200px">
      <el-form-item label="姓名" prop="deliveryMemberName">
        <el-input class="input-class" v-model.trim="mainForm.deliveryMemberName" placeholder="请输入" clearable/>
      </el-form-item>
      <el-form-item label="手机号码" prop="deliveryPhone">
        <el-input class="input-class" v-model.trim="mainForm.deliveryPhone" maxlength="11" clearable/>
      </el-form-item>
      <el-form-item label="所在地址" prop="selectedOptions">
        <el-cascader
          clearable
          ref="cascader"
          class="input-class"
          :options="citysData"
          :props="{value:'adCode'}"
          placeholder="请选择所在区域"
          v-model="mainForm.selectedOptions"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input
          class="input-class"
          type="textarea"
          :rows="4"
          clearable
          maxlength="300"
          show-word-limit
          v-model.trim="mainForm.address"
          placeholder="请输入详细地址"
        />
      </el-form-item>
      <el-form-item label-width="0" class="text-center">
        <el-button type="default" @click="resetHandle">重置</el-button>
        <el-button :loading="loading" v-hasPermi="['blindBox:distribution:addAddress']" type="primary" @click="confirmHandle">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import citys from '@/utils/provinceCity'
  import {addAddress} from "@/api/games/bbPrizesAward.js";

  export default {
    name: 'EditAddr',
    props: ['id', 'info'],
    data() {
      return {
        mainForm: {
          deliveryPhone: '',
          address: '',
          deliveryMemberName: '',
          selectedOptions: [],
        },
        loading: false,
        rules: {
          deliveryMemberName: [
            { required: true, message: '输入不能为空', trigger: 'blur' },
            { type: 'string', min: 1, max: 24, message: '输入长度1-24个字符', trigger: 'blur' },
          ],
          address: [
            { required: true, message: '输入不能为空', trigger: 'blur' },
            { type: 'string', min: 1, max: 300, message: '输入长度1-300个字符', trigger: 'blur' },
          ],
          deliveryPhone: [
            { required: true, message: '输入不能为空', trigger: 'blur' },
            { pattern: /^1[0-9]{10}$/, message: '手机号格式有误', trigger: 'blur'}
          ],
          selectedOptions: [
            { required: true, type: 'array', message: '所在区域不能为空', trigger: 'change'},
          ],
        },
      }
    },
    computed: {
      citysData() {
        // 城市数据 - 暂留三级
        citys.forEach(e => {
          if (e?.children?.length) {
            e.children.forEach(o => {
              if (o?.children?.length) {
                o.children.forEach(c => {
                  if (!c?.children?.length) delete c.children;
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
    mounted() {
      this.detailReq();
    },
    methods: {
      // 获取详情数据
      detailReq() {
        let provinceName, cityName, areaName;
        const {
          deliveryMemberName, deliveryPhone, address, provinceCode, cityCode, areaCode
        } = this.info;
        this.mainForm = {...this.mainForm, deliveryMemberName, deliveryPhone, address};

        citys.forEach(e => {
          if(provinceCode == e.adCode) provinceName = e.label;
          e?.children?.forEach(o => {
            if(cityCode == o.adCode) cityName = o.label;
            o?.children?.forEach(c => {
              if(areaCode == c.adCode) areaName = c.label;
            });
          });
        });

        if (provinceName && cityName && areaName) {
          this.$set(this.mainForm, 'selectedOptions', [provinceCode, cityCode, areaCode]);
        }
      },
      // 提交地址
      async addAddressReq() {
        try {
          this.loading = true;
          let gamePrizeDistributionId = this.id;
          let provinceName, cityName, areaName;
          let {address, deliveryPhone, deliveryMemberName, selectedOptions} = this.mainForm;
          let [provinceCode, cityCode, areaCode] = selectedOptions || ['', '', ''];

          citys.forEach(e => {
            if(provinceCode == e.adCode) provinceName = e.label;
            e?.children?.forEach(o => {
              if(cityCode == o.adCode) cityName = o.label;
              o?.children?.forEach(c => {
                if(areaCode == c.adCode) areaName = c.label;
              });
            });
          });

          const {code, message} = await addAddress({
            address,
            deliveryPhone,
            deliveryMemberName,
            cityCode, cityName,
            areaCode, areaName,
            gamePrizeDistributionId,
            provinceCode, provinceName,
          });

          if (code == 200) {
            this.$message.success('编辑成功');
            this.resetHandle();
            this.loading = false;
            this.$emit('updateModel');
          } else {
            this.loading = false;
            this.$message.error(message);
          }
        } catch (error) {
          this.loading = false;
          throw error;
        }
      },
      // 重置表单
      resetHandle() {
        this.$refs.mainForm.resetFields();
      },
      // 确认表单
      confirmHandle() {
        const vm = this;
        this.$refs.mainForm.validate((valid) => {
          if (valid) {
            vm.addAddressReq();
          } else {
            return false;
          }
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
  .edit-addr {
    .el-form-item {
      .input-class {
        width: 360px;
      }
    }
    .text-center {
      margin-top: 50px;
      .el-button:first-child {
        margin-right: 40px;
      }
    }
  }
</style>
