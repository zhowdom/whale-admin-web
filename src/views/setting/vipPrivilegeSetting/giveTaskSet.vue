<template>
  <div class="vip-privilege-setting">
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="top-guid-bar">转增配置</div>
      </el-col>
      <el-col :span="18">
        <el-form :model="subForm" :rules="rules" ref="subForm" label-width="200px" class="mt100">

          <el-form-item label="VIP转赠数量：">
            <div class="input-class no-edit-item">无限制</div>
            <div class="input-tips">只要购买VIP，转赠数量都是无限制。若已不是VIP则回到之前全平台设置状态</div>
          </el-form-item>

          <el-form-item label="VIP转赠手续费：" prop="rate">
            <el-input class="input-class" v-model.number="subForm.rate">
              <template slot="append">%</template>
            </el-input>
            <div class="input-tips">此处VIP若设置了转赠手续费，以此处的优先，若不是VIP则回到之前全平台设置状态</div>
          </el-form-item>

        </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="4">
        <div class="top-guid-bar">VIP赠送任务券配置</div>
      </el-col>
      <el-col :span="18">
        <el-form :model="mainForm" :rules="rules" ref="mainForm" label-width="200px" class="mt100">

          <el-form-item
            v-for="(item, index) in mainForm.benefits"
            :key="item.id"
            :prop="'benefits.'+index+'.taskValue'"
            :label="item.itemTitle+'VIP赠送任务券：'"
          >
            <el-select class="input-class" v-model="item.taskValue" placeholder="请选择任务">
              <el-option v-for="task in tasks" :key="task.id" :label="task.taskName" :value="task.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <div class="form-btns">
              <el-button type="primary" v-hasPermi="['vip:benefit:transfer:rate:update']" @click="submitForm">保存</el-button>
            </div>
          </el-form-item>

        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import types from '@/utils/taskTypes';
import math from '../../../utils/math';
import {taskPage} from '@/api/pointsMgmt/starTasks';
import {benefitBatchUpdate, vipList, transferRate, transferRateUpdate} from '@/api/setting/vip';

export default {
  name: 'VipPrivilegeSetting',
  data () {
    return {
      tasks: [],
      rateId: null,
      subForm: {
        rate: 0,
      },
      mainForm: {
        benefits: [],
      },
      rules: {
        rate: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { type: 'number', min: 0, max: 50, message: '输入数字范围0-50', trigger: ['blur', 'change'] }
        ],
      },
    }
  },
  mounted () {
    this.taskPageRequest();
    this.vipListRequest();
    this.transferRateListRequest();
  },
  methods: {
    // 提交数据
    submitForm () {
      let flag = false;
      // 更新手续费
      this.$refs.subForm.validate(valid => {
        if (valid) {
          flag = true;
          this.transferRateUpdateRequest();
        } else {
          return false;
        }
      });
      // 更新权益
      this.$refs.mainForm.validate(valid => {
        if (valid) {
          flag && this.benefitBatchUpdateRequest();
        } else {
          return false;
        }
      });
    },
    // 获取任务类型
    async taskPageRequest () {
      try {
        const {code, message, data:{list}} = await taskPage({
          taskType: types['会员任务']
        });
        if (code == 200) {
          list.push({id: -1, taskName: '无赠送'});
          this.tasks = list;
        } else {
          this.$message({type: 'error', message});
        }
      } catch (error) {
        // ...
      }
    },
     // 获取会员清单
    async vipListRequest () {
      try {
        const {code, message, data: {list}} = await vipList();
        if (code == 200) {
          list.sort((a, b) => a.id - b.id);
          list.map(item => {
            item.taskValue = null;
            if (item.benefitList.length) {
              item.taskValue = Number(item.benefitList[0].benefitValue);
            }
          });
          this.mainForm.benefits = list;
        } else {
          this.$message({type: 'error', message});
        }
      } catch (error) {
        // ...
      }
    },
    // 更新会员权益
    async benefitBatchUpdateRequest () {
      try {
        const datas = this.mainForm.benefits;
        datas.map(item => {
          if (item.taskValue !== null) {
            item.benefitList[0] = {
              benefitType: 1,               // 权益类型 1任务券
              benefitValue: item.taskValue  // 权益值(此处为任务券id)
            };
          }
        });
        const {code, message} = await benefitBatchUpdate({datas});
        if (code == 200) {
          this.$message({type: 'success', message: '会员权益更新成功'});
        } else {
          this.$message({type: 'error', message});
        }
      } catch (error) {
        // ...
      }
    },
    // 查询转赠手续费
    async transferRateListRequest () {
      try {
        const {code, message, data} = await transferRate();
        if (code == 200) {
          this.rateId = data.id;
          this.subForm.rate = math.multiply(data.rate, 100, 0);
          this.$refs.subForm.clearValidate('rate');
        } else {
          this.$message({type: 'error', message});
        }
      } catch (error) {
        // ...
      }
    },
    // 更新转赠手续费
    async transferRateUpdateRequest () {
      try {
        const rate = math.divide(this.subForm.rate, 100);
        const {code, message} = await transferRateUpdate({
          rate,
          id: this.rateId,
        });
        if (code != 200) {
          this.$message({type: 'error', message});
        }
      } catch (error) {
        // ...
      }
    },
  }
}
</script>

<style lang="scss" scoped>
  .vip-privilege-setting {
    min-width: 1200px;
    padding: 80px 20px 20px;
    .top-guid-bar {
      position: relative;
      background: #9ca7b5;
      height: 50px;
      width: 200px;
      line-height: 50px;
      text-align: center;
      color: #FFF;
      font-weight: 500;
      &::after {
        content: ' ';
        height: 1px;
        width: 1px;
        display: inline-block;
        border: 25px solid transparent;
        border-left-color: #9ca7b5;
        position: absolute;
        right: -50px;
      }
    }
    .input-class {
      width: 290px;
    }
    .no-edit-item {
      display: inline-block;
      border-radius: 4px;
      border: 1px solid #DCDFE6;
      padding: 0 15px;
      color: #606266;
      cursor: not-allowed;
    }
    .input-tips {
      display: inline-block;
      margin-left: 20px;
      color: #9ca7b5;
      vertical-align: middle;
      width: 390px;
      line-height: 22px;
    }
    .form-btns {
      margin-top: 15px;
      button {
        padding: 10px 40px;
      }
    }
    ::v-deep .el-form-item__label {
      font-weight: 400;
    }
  }
</style>
