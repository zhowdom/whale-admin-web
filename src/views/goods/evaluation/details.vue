<template>
  <div class="evaluation-detail">
    <div class="wrap">
      <div class="left-table">
        <div class="user-avatar">
          <el-avatar :size="85" :src="info.virtualAvatar"></el-avatar>
          <p class="text-muted">{{info.memberName||'-'}}</p>
        </div>
        <div class="goods-info">
          <p>商品：<span class="text-muted">{{info.productName||'-'}}</span></p>
          <p>购买：<span class="text-muted">{{info.productItemDesc||'-'}}</span></p>
          <p>星级评价：<span class="inline-block"><el-rate disabled v-model="info.scoreLevel"></el-rate></span></p>
          <p>日期：<span class="text-muted">{{formatDate(info.createTime)}}</span></p>
          <p>IP地址：<span class="text-muted">{{info.memberIpAddr||'-'}}</span></p>
        </div>
      </div>
      <div class="right-content">
        <div class="eval-content">
          <div class="content">
            {{info.content || '-'}}
          </div>
          <div class="imgs">
            <el-image
              class="show-imgs"
              v-for="(src, index) in info.imgs"
              :key="index"
              :src="src"
              fit="fit"
              :preview-src-list="[src]">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>
          <div class="text-muted ft14 mt36">回复评价</div>
          <el-divider></el-divider>
          <div class="response-form">
            <el-form :model="mainForm" :rules="rules" ref="mainForm" label-width="auto" class="main-form" :disabled="!!replyEvaluate.length">
              <el-form-item label="回复内容: " prop="content">
                <el-input
                  rows="5"
                  resize="none"
                  type="textarea"
                  maxlength="200"
                  show-word-limit
                  v-model="mainForm.content"
                  placeholder="请输入内容"
                >
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" v-hasPermi="['goods:evaluate:update']" @click="responseHandle">确定</el-button>
                <span class="text-muted ft14 ml20">注意：管理员回复内容会在前台显示</span>
              </el-form-item>
            </el-form>
          </div>
          <div class="text-muted ft14 mt36">全部评论 {{replyEvaluate.length||'-'}}</div>
          <el-divider></el-divider>
          <div class="response-list">
            <div class="" v-for="(item, index) in replyEvaluate" :key="index">
              <el-alert type="info" :closable="false">
                <div class="response-list-item">
                  <div class="item-icon">
                    <el-avatar :size="50" icon="el-icon-user-solid"></el-avatar>
                  </div>
                  <div class="response-content">
                    <div class="response-content-title">官方</div>
                    <div class="response-content-body">
                      <div class="content-body">
                        <div class="prefix-reply">回复{{info.memberName||'-'}}：</div>
                        <div class="reply">{{item.content||'-'}}</div>
                      </div>
                      <div class="content-time">
                        {{formatDate(item.time, 'YYYY-MM-DD HH:mm:ss')}}
                        <!-- <el-button class="ml10 green2-txt-btn" type="text" @click="shwoDia=true">回复</el-button> -->
                        <el-button class="red-txt-btn" type="text" v-hasPermi="['goods:evaluate:del']" @click="deleteResHandle(index)">删除</el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </el-alert>
              <el-divider></el-divider>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="form-btns">
      <el-button icon="el-icon-d-arrow-left" type="warning" @click="cancelSubmit">返回</el-button>
    </div>

    <!-- 弹窗回复 -->
    <el-dialog
      center
      width="520px"
      ref="diaRep"
      title="官方回复"
      :close-on-click-modal="false"
      :visible.sync="shwoDia"
      :before-close="cancelDia">
      <el-form class="mb0" :model="diaForm" :rules="rules" ref="diaForm">
        <el-form-item prop="content" class="mb0">
          <el-input
            rows="5"
            resize="none"
            type="textarea"
            maxlength="200"
            show-word-limit
            placeholder="请输入回复内容"
            v-model="diaForm.content"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="mr20" @click="cancelDia">取 消</el-button>
        <el-button type="primary" @click="confirmDia">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {evaluationDetail, responseEvaluation, deleteEvResponse} from '@/api/goods/evaluation';

export default {
  name: 'EvaluationDetail',
  data () {
    return {
      id: '',
      info: {},
      mainForm: {
        content: '',        // 回复内容
      },
      diaForm: {
        content: '',        // 回复内容
      },
      texts: ['非常差', '差', '一般', '好', '非常好'],
      replyEvaluate: [], // 回复列表
      shwoDia: false,
      rules: {
        content: [
          { required: true, message: '回复内容不能为空', trigger: 'blur' }
        ]
      },
    }
  },
  mounted() {
    this.id = this.$route.query.id;
    this.evaluationDetailReq();
  },
  methods: {
    // 评价详情
    async evaluationDetailReq () {
      try {
        const {data} = await evaluationDetail({id: this.id});
        this.info = data;
        this.replyEvaluate = data.replyEvaluate || [];
      } catch (error) {
        throw error;
      };
    },
    // 追加评价
    async responseEvaluationReq (arg) {
      try {
        const content = arg == 1
          ? this.mainForm.content
          : this.diaForm.content;
        await responseEvaluation({
          content,
          id: this.id,
        });
        arg ==
        this.$message.success('追评成功！');
        if (arg == 2) this.cancelDia();
        this.evaluationDetailReq();
      } catch (error) {
        throw error;
      }
    },
    // 删除评价
    async deleteEvResponseReq (index) {
      try {
        await deleteEvResponse({
          id: this.id,
          index: index
        });
        this.$message.success('删除成功！');
        this.evaluationDetailReq();
      } catch (error) {
        throw error;
      }
    },
    // 格式日期功能
    formatDate (date, format = 'YYYY-MM-DD', def = '') {
      return date ? this.$dayjs(date).format(format) : def;
    },
    // 删除操作
    deleteResHandle (index) {
      this.$confirm('确定要删除该评论吗？', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.deleteEvResponseReq(index);
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    // 取消弹窗
    cancelDia () {
      this.shwoDia = false;
      this.$refs.diaForm.resetFields();
    },
    // 确认弹窗
    confirmDia () {
      this.$refs.diaForm.validate(valid => {
        if (valid) {
          this.responseEvaluationReq(2);
        } else {
          return false;
        }
      });
    },
    // 取消功能
    cancelSubmit () {
      const curView = this.$route;

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          this.$router.replace({path: 'evaluation'}); // 返回列表页
        });
      });
    },
    // 提交
    responseHandle() {
      this.$refs.mainForm.validate(valid => {
        if (valid) {
          this.responseEvaluationReq(1);
        } else {
          return false;
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
  .evaluation-detail {
    min-width: 1200px;
    padding: 30px 40px 0;
    .wrap {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
      border-radius: 4px;
      border: 1px solid #ebeef5;
      .left-table {
        width: 32%;
        padding: 20px;
        .user-avatar {
          text-align: center;
        }
        .goods-info {
          margin: 50px 0 20px 55px;
          p {
            color: #99a9bf;
            font-size: 13px;
            font-weight: 700;
            line-height: 36px;
          }
          ::v-deep {
            .el-rate {
              height: 36px;
              line-height: 36px;
            }
            .el-rate__item {
              font-size: 1px;
            }
          }
        }
      }
      .right-content {
        width: 68%;
        padding: 20px;
        border-left: 1px solid #ebeef5;
        .eval-content {
          margin-left: 30px;
          .content {
            color: rgb(153, 153, 153);
            text-align: left;
            padding: 10px;
            line-height: 28px;
            min-height: 120px;
          }
        }
        .response-list {
          max-height: 830px;
          overflow-y: auto;
          .response-list-item {
            display: flex;
            flex-direction: row;
            align-items: center;
            .response-content {
              margin-left: 20px;
              .response-content-title {
                font-size: 15px;
                color: #999;
                margin-bottom: 10px;
              }
              .response-content-body {
                color: #999;
                font-size: 14px;
                .content-body {
                  margin-bottom: 10px;
                  display: flex;
                  flex-direction: row;
                  align-items: stretch;
                  flex-wrap: nowrap;
                  .prefix-reply {
                    flex-shrink: 0;
                  }
                  .reply {
                    line-height: 20px;
                  }
                }
              }
            }
            &+.response-list-item {
              margin-top: 15px;
            }
          }
        }
      }
      .show-imgs {
        width: 75px;
        height: 75px;
        margin-right: 15px;
        ::v-deep {
          img {
            cursor: pointer;
          }
        }
      }
    }
    .form-btns {
      position: fixed;
      bottom: 20px;
    }
  }
</style>
