<template>
  <div class="vip-ticket-detail">
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="top-guid-bar">任务信息</div>
      </el-col>
      <el-col :span="18">
        <el-form :model="mainForm" :rules="rules" ref="mainForm" label-width="200px" class="mt100">
          <el-form-item label="任务券名称：" prop="taskName">
            <el-input class="input-class" v-model="mainForm.taskName" placeholder="请输入任务券名称" disabled></el-input>
          </el-form-item>

          <el-form-item label="任务同时运行最大数量：" prop="limitQuantity">
            <el-input class="input-class" v-model.number="mainForm.limitQuantity" disabled>
              <template slot="append">个</template>
            </el-input>
            <div class="input-tips">同时运行的最大数量</div>
          </el-form-item>

          <el-form-item label="总奖励Candy：" prop="income">
            <el-input class="input-class" v-model="mainForm.income" disabled>
              <template slot="append">个</template>
            </el-input>
            <div class="input-tips">35天周期总共奖励的Candy</div>
          </el-form-item>
          <el-form-item label="每天可做任务次数：" prop="dayToDo">
            <el-input class="input-class" v-model.number="mainForm.dayToDo" disabled>
              <template slot="append">次</template>
            </el-input>
          </el-form-item>
          <el-form-item label="任务券周期：" prop="completeCycleMin">
            <el-input class="input-class" v-model.number="mainForm.completeCycleMin" disabled>
              <template slot="append">天</template>
            </el-input>
            <div class="input-tips">35天过期后即过期，没有延长时间</div>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="4">
        <div class="top-guid-bar">任务UI配置-进行中</div>
      </el-col>
      <el-col :span="18">
        <el-form :model="uiForm1" :rules="rules" ref="uiForm1" label-width="200px" class="mt100">
          <el-form-item label="字体/按钮颜色：" prop="fontColorProcess">
            <el-input class="input-class" v-model="uiForm1.fontColorProcess" disabled placeholder="请输入字体颜色"></el-input>
            <div class="input-tips">填写颜色编码，也可以粘贴过来</div>
          </el-form-item>

          <el-form-item label="背景图片：" prop="imgUrlProcess">
            <div class="img-mask">
              <img class="uiForm-img" :src="uiForm1.imgUrlProcess" alt="背景图片" srcset="">
              <i @click="handlePictureCardPreview(uiForm1.imgUrlProcess)" class="el-icon-circle-plus"></i>
            </div>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="4">
        <div class="top-guid-bar">任务UI配置-已完成</div>
      </el-col>
      <el-col :span="18">
        <el-form :model="uiForm2" :rules="rules" ref="uiForm2" label-width="200px" class="mt100">
          <el-form-item label="字体/按钮颜色：" prop="fontColorComplete">
            <el-input class="input-class" v-model="uiForm2.fontColorComplete" disabled placeholder="请输入字体颜色"></el-input>
            <div class="input-tips">填写颜色编码，也可以粘贴过来</div>
          </el-form-item>

          <el-form-item label="背景图片：" prop="imgUrlComplete">
            <div class="img-mask">
              <img class="uiForm-img" :src="uiForm2.imgUrlComplete" alt="背景图片" srcset="">
              <i @click="handlePictureCardPreview(uiForm2.imgUrlComplete)" class="el-icon-circle-plus"></i>
            </div>
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
import {taskInfo} from '@/api/pointsMgmt/starTasks';

export default {
  name: 'VipTicketDetail',
  props: ['myType', 'passedID', 'queryParentList'],
  data() {
    return {
      mainForm: {
        taskName: '',             // 任务名称
        limitQuantity: 1,         // 任务同时运行最大数量
        income: '1.000000',       // 总奖励Candy
        dayToDo: 1,               // 每天可做任务次数
        completeCycleMin: 1,      // 任务券周期
        taskType: 5,              // 任务类型
      },
      uiForm1: {                  // 任务UI配置-进行中
        imgUrlProcess: '',        // 背景图片
        fontColorProcess: '',     // 字体/按钮颜色
      },
      uiForm2: {                  // 任务UI配置-已完成
        imgUrlComplete: '',       // 背景图片
        fontColorComplete: '',    // 字体/按钮颜色
      },
      rules: {},
      dialogImageUrl: '',
      dialogVisible: false,
    };
  },
  mounted () {
    this.taskInfoRequest();
  },
  methods: {
    // 获取详情
    async taskInfoRequest () {
      try {
        const id = this.passedID;
        const {code, message, data} = await taskInfo({id});
        if (code == 200) {
          const {
            limitQuantity, income,
            dayToDo, completeCycleMin,
            taskType, taskName,
            taskAttribute
          } = data;
          const {
            imgUrlProcess, fontColorProcess,
            imgUrlComplete, fontColorComplete
          } = taskAttribute;

          this.mainForm = {
            ...this.mainForm,
            limitQuantity, dayToDo,
            completeCycleMin,
            taskType, taskName
          };

          this.mainForm.income = Number(income || 0).toFixed(6);
          this.uiForm1 = {...this.uiForm1, imgUrlProcess, fontColorProcess};
          this.uiForm2 = {...this.uiForm2, imgUrlComplete, fontColorComplete};
        } else {
          this.$message({type: 'error', message});
        }
      } catch (error) {
        // ...
      }
    },
    // 预览上传
    handlePictureCardPreview(url) {
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    // 返回
    goBackList () {
      // const curView = this.$route;
      // this.$store.dispatch('tagsView/delView', curView).then(() => {
      //   this.$nextTick(() => {
      //     this.$router.replace({path: 'vipTicket'}); // 返回列表页
      //   });
      // });
      this.$emit('close_comsp', false)
      this.queryParentList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .vip-ticket-detail {
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
    .input-tips {
      display: inline-block;
      margin-left: 20px;
      color: #9ca7b5;
      vertical-align: middle;
      width: 390px;
      line-height: 22px;
    }
    .align {
      position: absolute;
    }
    .img-mask {
      position: relative;
      width: 290px;
      height: 165px;
      border-radius: 14px;
      display: inline-block;
      .uiForm-img {
        width: 100%;
        height: 100%;
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
          width: 290px;
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
    .form-btns {
      margin: 15px 0 15px 35px;
    }
    .img-modal {
      ::v-deep .el-dialog {
        border-radius: 40px;
      }
      ::v-deep .el-dialog__header {
        padding: 0;
        .el-dialog__headerbtn .el-dialog__close {
          color: #fff;
          font-weight: 900;
        }
      }
      ::v-deep .el-dialog__body {
        padding: 1px;
        border-radius: 40px;
        img {
          border-radius: 14px;
          display: block;
        }
      }
    }
  }
</style>
