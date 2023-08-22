<template>
  <div class="task-store-detail">
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="top-guid-bar">任务信息</div>
      </el-col>
      <el-col :span="14">
        <el-form :model="mainForm" :rules="rules" ref="mainForm" label-width="215px" class="mt100">
          <el-form-item label="任务券名称：" prop="taskName">
            <el-input class="input-class" v-model="mainForm.taskName" placeholder="请输入任务券名称" disabled />
          </el-form-item>
          <el-form-item label="请选择任务券类型">
            <div class="input-class gray-txt">
              {{mainForm.taskType?'需要兑换的任务券':'赠送的任务券'}}
            </div>
          </el-form-item>
          <el-form-item label="任务同时运行最大数量" prop="limitQuantity">
            <el-input class="input-class" v-model.number="mainForm.limitQuantity" disabled>
              <template slot="append">个</template>
            </el-input>
            <div class="input-tips">同时运行的最大数量</div>
          </el-form-item>

          <template v-if="!mainForm.taskType">
            <el-form-item label="总奖励Candy：" prop="income">
              <el-input class="input-class" v-model="mainForm.income" disabled>
                <template slot="append">个</template>
              </el-input>
              <div class="input-tips">35天周期总共奖励的Candy</div>
            </el-form-item>
          </template>

          <template v-else>
            <el-form-item label="兑换任务成本" prop="needWhalePeas">
              <el-input class="input-class" v-model="mainForm.needWhalePeas" disabled>
                <template slot="append">颗</template>
              </el-input>
              <div class="input-tips">CandyCandy</div>
            </el-form-item>
            <el-form-item label="收益率" prop="earningsRate">
              <el-input class="input-class" v-model="mainForm.earningsRate" disabled>
                <template slot="append">%</template>
              </el-input>
              <div class="input-tips">基于“兑换任务成本”的收益率，最大收益率不超过39%</div>
            </el-form-item>
            <el-form-item class="long-input-tips-form-item" label="周期收益每个任务券周期递减" prop="earningsRateCycleReduce">
              <el-input class="input-class" v-model="mainForm.earningsRateCycleReduce" disabled>
                <template slot="append">%</template>
              </el-input>
              <div class="input-tips">月收益率，按任务型周期，每个周期减产0.5%。天数，也按任务型周期，每个周期递增2天（按照每个任务券数量为周期，例如初级任务，一个任务总共可以兑换8个，以8个结束为1个周期结束）</div>
            </el-form-item>
            <el-form-item label="每个周期递增" prop="completeCycleIncrease">
              <el-input class="input-class" v-model.number="mainForm.completeCycleIncrease" disabled>
                <template slot="append">天</template>
              </el-input>
            </el-form-item>
          </template>

          <el-form-item label="每天可做任务次数" prop="dayToDo">
            <el-input class="input-class" v-model.number="mainForm.dayToDo" disabled>
              <template slot="append">次</template>
            </el-input>
          </el-form-item>
          <el-form-item label="任务券周期" prop="completeCycleMin">
            <el-input class="input-class" v-model.number="mainForm.completeCycleMin" disabled>
              <template slot="append">天</template>
            </el-input>
          </el-form-item>
          <el-form-item class="long-input-tips-form-item" label="任务券过期时间" prop="expireDayAfter">
            <el-input class="input-class" v-model.number="mainForm.expireDayAfter" disabled>
              <template slot="append">天</template>
            </el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="4">
        <div class="top-guid-bar">基础活跃值配置</div>
      </el-col>
      <el-col :span="14">
        <el-form :model="subForm" :rules="rules" ref="subForm" label-width="200px" class="mt100">
          <el-form-item label="排序" prop="sort">
            <el-input class="input-class" v-model="subForm.sort" disabled ></el-input>
            <div class="input-tips">排序不可以重复，前端显示按排序从低到高排序</div>
          </el-form-item>

          <el-form-item label="基础活跃值" prop="activeWorth">
            <el-input class="input-class" v-model.number="subForm.activeWorth" disabled>
              <template slot="append">个</template>
            </el-input>
            <div class="input-tips">
              {{mainForm.taskType?'兑换时产生':'领取时产生'}}，可用于统计团队活跃值
            </div>
          </el-form-item>
          <el-form-item label="基础活跃值失效时间" prop="activeWorthExpireDayAfter">
            <el-input class="input-class" v-model="subForm.activeWorthExpireDayAfter" disabled>
              <template slot="append">天</template>
            </el-input>
            <div class="input-tips">
              <span class="red-class">推广活跃值失效时间 与 基础活跃值失效时间一致</span>
            </div>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="4">
        <div class="top-guid-bar">任务UI配置-任务商店</div>
      </el-col>
      <el-col :span="14">
        <el-form :model="uiForm1" :rules="rules" ref="uiForm1" label-width="200px" class="mt100">
          <el-form-item label="字体/按钮颜色：" prop="fontColor">
            <el-input class="input-class" v-model="uiForm1.fontColor" disabled placeholder="请输入字体颜色"></el-input>
            <div class="input-tips">填写颜色编码，也可以粘贴过来</div>
          </el-form-item>

          <el-form-item label="背景图片：" prop="imgUrl">
            <div class="img-mask" v-if="uiForm1.imgUrl">
              <img class="uiForm-img" :src="uiForm1.imgUrl" alt="背景图片" srcset="">
              <i @click="handlePictureCardPreview(uiForm1.imgUrl)" class="el-icon-circle-plus"></i>
            </div>
            <span class="no-img" v-else>无图片</span>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="4">
        <div class="top-guid-bar">任务UI配置-进行中</div>
      </el-col>
      <el-col :span="14">
        <el-form :model="uiForm2" :rules="rules" ref="uiForm2" label-width="200px" class="mt100">
          <el-form-item label="字体/按钮颜色：" prop="fontColorProcess">
            <el-input class="input-class" v-model="uiForm2.fontColorProcess" disabled placeholder="请输入字体颜色"></el-input>
            <div class="input-tips">填写颜色编码，也可以粘贴过来</div>
          </el-form-item>

          <el-form-item label="背景图片：" prop="imgUrlProcess">
            <div class="img-mask" v-if="uiForm2.imgUrlProcess">
              <img class="uiForm-img" :src="uiForm2.imgUrlProcess" alt="背景图片" srcset="">
              <i @click="handlePictureCardPreview(uiForm2.imgUrlProcess)" class="el-icon-circle-plus"></i>
            </div>
            <span class="no-img" v-else>无图片</span>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="4">
        <div class="top-guid-bar">任务UI配置-已完成</div>
      </el-col>
      <el-col :span="14">
        <el-form :model="uiForm3" :rules="rules" ref="uiForm3" label-width="200px" class="mt100">
          <el-form-item label="字体/按钮颜色：" prop="fontColorProcess">
            <el-input class="input-class" v-model="uiForm3.fontColorComplete" disabled placeholder="请输入字体颜色"></el-input>
            <div class="input-tips">填写颜色编码，也可以粘贴过来</div>
          </el-form-item>

          <el-form-item label="背景图片：" prop="imgUrlComplete">
            <div class="img-mask" v-if="uiForm3.imgUrlComplete">
              <img class="uiForm-img" :src="uiForm3.imgUrlComplete" alt="背景图片" srcset="">
              <i @click="handlePictureCardPreview(uiForm3.imgUrlComplete)" class="el-icon-circle-plus"></i>
            </div>
            <span class="no-img" v-else>无图片</span>
          </el-form-item>

        </el-form>
      </el-col>

      <el-col :span="12" :offset="8">
        <div class="form-btns">
          <el-button type="info" size="medium" icon="el-icon-d-arrow-left" @click="goBackList">返回</el-button>
        </div>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import math from '@/utils/math';
import {taskInfo} from '@/api/pointsMgmt/starTasks';

export default {
  name: 'TaskStoreDetail',
  data() {
    return {
      mainForm: {
        income: '0.000000',    // 总奖励Candy
        taskName: '',         // 任务名称
        taskType: 1,          // 任务类型
        limitQuantity: 1,     // 任务同时运行最大数量
        needWhalePeas: '',    // 兑换任务成本
        earningsRate: 0,      // 收益率
        earningsRateCycleReduce: 0, // 减产比例
        completeCycleIncrease: 0, // 递增天数
        dayToDo: 1,           // 每天可做任务次数
        expireDayAfter: 70,    // 最小完成周期数
        completeCycleMin: 70, // 任务券过期时间
      },
      subForm: {
        sort: 0,
        activeWorth: 0,
        activeWorthExpireDayAfter: 0,
        activeWorthPromoteExpireDayAfter: 0,
      },
      uiForm1: {              // 任务UI配置-任务商店
        imgUrl: '',           // 背景图片
        fontColor: '',        // 字体/按钮颜色
      },
      uiForm2: {              // 任务UI配置-进行中
        imgUrlProcess: '',    // 背景图片
        fontColorProcess: '', // 字体/按钮颜色
      },
      uiForm3: {              // 任务UI配置-已完成
        imgUrlComplete: '',   // 背景图片
        fontColorComplete: '',// 字体/按钮颜色
      },
      rules: {},
      dialogImageUrl: '',
      dialogVisible: false,
      id: '',
    };
  },
  mounted () {
    this.id = this.$route.query.id;
    this.taskInfoRequest();
  },
  methods: {
    // 格式化Candy
    formateProperty (num) {
      return Number(num || 0).toFixed(6);
    },
    // 转化百分比
    formatePercentage (data, def) {
      if (def == '%') {
        return math.divide(data || 0, 100, 4);
      } else {
        return math.multiply(data || 0, 100, 4);
      }
    },
    // 预览上传
    handlePictureCardPreview(url) {
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    // 获取详情
    async taskInfoRequest () {
      try {
        const {code, message, data} = await taskInfo({id: this.id});
        if (code == 200) {
          let {
            income,
            taskName,
            taskType,
            limitQuantity,
            needWhalePeas,
            earningsRate,
            earningsRateCycleReduce,
            completeCycleIncrease,
            dayToDo,
            expireDayAfter,
            completeCycleMin,
            sort,
            activeWorth,
            activeWorthExpireDayAfter,
            activeWorthPromoteExpireDayAfter,
            taskAttribute,
          } = data;

          income = Number(income || 0).toFixed(6);
          earningsRate = this.formatePercentage(earningsRate, 'x');
          earningsRateCycleReduce = this.formatePercentage(earningsRateCycleReduce, 'x').toFixed(2);

          const {
            imgUrl, fontColor,
            imgUrlProcess, fontColorProcess,
            imgUrlComplete, fontColorComplete
          } = taskAttribute;

          this.subForm = {
            ...this.subForm,
            sort,
            activeWorth,
            activeWorthExpireDayAfter,
            activeWorthPromoteExpireDayAfter,
          };

          this.mainForm = {
            ...this.mainForm,
            taskName,
            taskType,
            limitQuantity,
            needWhalePeas,
            completeCycleIncrease,
            dayToDo,
            expireDayAfter,
            completeCycleMin,
            income,
            earningsRate,
            earningsRateCycleReduce,
          };


          this.uiForm1 = {...this.uiForm1, imgUrl, fontColor};
          this.uiForm2 = {...this.uiForm2, imgUrlProcess, fontColorProcess};
          this.uiForm3 = {...this.uiForm3, imgUrlComplete, fontColorComplete};

          this.uploadConf.fileList1 = imgUrl ? [{name: '', url: imgUrl}] : [];
          this.uploadConf.fileList2 = imgUrlProcess ? [{name: '', url: imgUrlProcess}] : [];
          this.uploadConf.fileList3 = imgUrlComplete ? [{name: '', url: imgUrlComplete}] : [];
          imgUrl && this.switchUploader('upload1', 'none');
          imgUrlProcess && this.switchUploader('upload2', 'none');
          imgUrlComplete && this.switchUploader('upload3', 'none');
        } else {
          this.$message({type: 'error', message});
        }
      } catch (error) {
        // ...
      }
    },
    // 返回
    goBackList () {
      const curView = this.$route;
      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          this.$router.replace({path: 'taskStoreMgmt'}); // 返回列表页
        });
      });
    }
  }
}
</script>

<style lang="scss" scoped>
  .task-store-detail {
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
    span.red-class {
      color: red;
    }
    .input-class {
      width: 240px;
    }
    .input-tips {
      display: inline-block;
      margin-left: 20px;
      color: #9ca7b5;
      vertical-align: top;
      width: 340px;
    }
    ::v-deep .el-form-item__label {
      font-weight: normal;
    }
    .long-input-tips-form-item {
      .input-tips {
        line-height: 22px;
      }
      ::v-deep .el-form-item__error {
        top: 36px;
      }
    }
    .radio-class {
      label {
        height: 36px;
        line-height: 36px;
        margin-right: 40px;
        font-weight: normal;
      }
      ::v-deep .el-radio__inner {
        width: 18px;
        height: 18px;
        &:after {
          box-sizing: content-box;
          content: "";
          border: 1px solid #fff;
          border-left: 0;
          border-top: 0;
          height: 8px;
          left: 5px;
          position: absolute;
          top: 2px;
          transform: rotate(45deg) scaleY(0);
          width: 4px;
          border-radius: 0;
          background: none;
          transition: transform .15s ease-in .05s;
          transform-origin: center;
        }
      }
      ::v-deep .el-radio__input.is-checked .el-radio__inner:after {
        transform: rotate(45deg) scaleY(1);
      }
    }
    .form-btns {
      margin-top: 15px;
      margin-left: 20px;
      button {
        margin-right: 50px;
      }
    }
    .img-mask {
      position: relative;
      width: 240px;
      border-radius: 14px;
      display: inline-block;
      .uiForm-img {
        width: 100%;
        display: block;
        border-radius: 14px;
      }
      & i {
        position: absolute;
        font-size: 36px;
        z-index: 3;
        top: 56%;
        left: 50%;
        color: transparent;
        cursor: pointer;
        transition: all 0.2s;
        transform: translate(-50%, -50%);
      }
      &:hover {
        &::after {
          content: ' ';
          width: 240px;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          transition: all 0.6s;
          border-radius: 14px;
          background: rgba(125, 125, 125, 0.65);
        }
        i {
          top: 50%;
          color: #fff;
          transition: all 0.4s;
        }
      }
    }
    .no-img {
      color: #666;
      font-style: italic;
    }
    .gray-txt {
      color: #C0C4CC;
      font-weight: 500;
    }
  }
</style>
