<template>
  <div class="add-evaluation">
    <div class="wrap">
      <div class="left-table">
        <div class="mb15">
          <pure-search size="small" placeholder="请输入商品名称/商品货号" @search="searchHandle"/>
        </div>
        <el-table :data="tableData" row-key="id" :expand-row-keys="[expandId]" @expand-change="expandHandle" stripe style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="{row}">
              <el-form label-position="left" inline class="custom-table-expand">
                <el-form-item label="选择SKU: ">
                  <el-radio-group v-model="selectedSkuId" size="small" @change="changeSkuHandle(row)">
                    <el-radio
                      border
                      v-for="(item,index) in row.items"
                      :key="index"
                      :label="item.id"
                      class="block custom-radio"
                    >
                      {{transSkuName(item.props)}}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="商品 ID" prop="id"></el-table-column>
          <el-table-column label="商品名称" prop="name"></el-table-column>
          <el-table-column label="货号" prop="itemNo"></el-table-column>
        </el-table>

        <div class="table-pagination text-right mt10">
          <el-pagination
            :total="pager.total"
            :page-size="pager.size"
            :current-page="pager.curPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="total, prev, pager, next">
          </el-pagination>
        </div>
      </div>
      <div class="right-content">
        <div class="user-avatar">
          <el-avatar :size="85" :src="mainForm.virtualAvatar"></el-avatar>
          <p class="text-muted">Avatar</p>
        </div>
        <div class="goods-info">
          <p>商品：<span class="text-muted">{{goodsName}}</span></p>
          <p>购买：<span class="text-muted">{{skuNames}}</span></p>
        </div>
        <div class="eval-form">
          <el-form :model="mainForm" :rules="rules" ref="mainForm" label-width="auto" class="main-form">
            <el-form-item label="评论时间: " prop="createTime">
              <el-date-picker
                v-model="mainForm.createTime"
                type="date"
                :editable="false"
                format="yyyy-MM-dd"
                placeholder="选择日期时间"
                :picker-options="opts">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="星级评价: " prop="scoreLevel">
              <el-rate v-model="mainForm.scoreLevel" show-text :texts="texts"></el-rate>
            </el-form-item>

            <el-form-item label="商品评价: " prop="content">
              <el-input
                rows="5"
                resize="none"
                type="textarea"
                maxlength="200"
                show-word-limit
                v-model="mainForm.content"
                placeholder="宝贝是否满足了你的期待？说说你的使用心得分享给其他想购买的朋友吧"
              >
              </el-input>
            </el-form-item>

            <el-form-item label="上传图片: " prop="imgs">
              <el-upload
                ref="uploader"
                class="custom-uploader"
                :file-list="upload.fileList"
                :http-request="handleRequest.bind(file)"
                :action="upload.action"
                :limit="upload.limit"
                :auto-upload="upload.auto"
                :accept="upload.accept"
                :list-type="upload.type"
                :show-file-list="upload.showList"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove">
                <i slot="default" class="el-icon-plus"></i>
                <div class="el-upload__tip" slot="tip">最多可以上传{{upload.limit}}张图片，建议尺寸750*750px，大小不超过500kb</div>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

    <div class="form-btns">
      <el-button type="warning" @click="cancelSubmit">取消</el-button>
      <el-button type="default" @click="resetForm">重置</el-button>
      <el-button type="primary" @click="submitForm">保存</el-button>
    </div>
  </div>
</template>

<script>
import PureSearch from '@/components/PureSearch';
import {randomString} from '@/utils/index.js';
import {getCertificate, upload} from '@/api/oss';
import {goodsListQuery} from '@/api/goods/goodsAbout';
import {addEvaluation} from '@/api/goods/evaluation';

export default {
  name: 'AddEvaluation',
  data () {
    const vm = this;
    return {
      upload: {
        size: 500,
        showList: true,
        auto: true,
        action: '',
        limit: 5,
        fileList: [],
        type: 'picture-card',
        accept: '.png,.jpg,.jpeg,.gif',
        arr: ['image/png', 'image/jpeg', 'image/gif', 'image/jpg'],
      },
      keywords: '',
      tableData: [],
      pager: {
        curPage: 1,
        size: 10,
        total: 0,
      },
      selectedSkuId: '',   // 选中的sku
      expandId: '',      // 展开行的id
      goodsName: '',      // 商品名称
      skuNames: '',       // sku名称
      texts: ['非常差', '差', '一般', '好', '非常好'],
      mainForm: {
        createTime: '',
        imgs: [],
        scoreLevel: 5,
        virtualAvatar: '',
        content: '',
      },
      dialogImageUrl: '',
      dialogVisible: false,
      file: null,
      firstUpAt: '', // 首次上架时间
      opts: {
        disabledDate (time) {
          return time.getTime() <= new Date(vm.firstUpAt).getTime();
        },
      },
      rules: {},
    }
  },
  components: {PureSearch},
  computed: {
    transSkuName () {
      return arr => {
        const names = [];
        arr.map(({value}) => names.push(value));
        return names.length ? names.join(' ') : '-';
      }
    }
  },
  mounted() {
    const seed = randomString(); // 随机图片的种子
    this.goodsListQueryReq();
    this.$set(this.mainForm, 'virtualAvatar', `https://picsum.photos/seed/${seed}/85`);
  },
  methods: {
    // 商品列表页
    async goodsListQueryReq () {
      try {
        const {code, message, data: {list, pageSize, total}} = await goodsListQuery({
          keywords: this.keywords,
          pageSize: this.pager.size,
          currentPage: this.pager.curPage,
        });
        if (code == 200) {
          this.tableData = list;
          this.pager.size = pageSize;
          this.pager.total = total;
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        throw error;
      };
    },
    // 添加评价
    async addEvaluationReq () {
      try {
        await addEvaluation({
          ...this.mainForm,
          productId: this.expandId,
          productItemId: this.selectedSkuId
        });
        this.$message.success('添加成功！');
        this.cancelSubmit();
      } catch (error) {
        throw error;
      }
    },
    // 展开行修改
    expandHandle (row, eRows) {
      this.expandId = eRows.length ? row.id : '';
    },
    // 修改sku处理
    changeSkuHandle ({name, items, firstUpAt}) {
      const names = [];
      this.goodsName = name;
      items.map(({props}) => {
        props?.map(({value}) => names.push(value));
      });
      this.skuNames = names.length ? names.join(' ') : '-';
      this.firstUpAt = firstUpAt;
    },
    // 切换上传组件显示状态
    switchUploader (ref, arg) {
      this.$nextTick(() => {
        const uploader = this.$refs[ref].$el.querySelector('.el-upload');
        uploader.style.display = arg;
      });
    },
    // 预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 移除上传
    handleRemove(file, fileList) {
      const list = this.upload.fileList;
      const index = list.findIndex(el => el.url == file.url);
      this.mainForm.imgs.splice(index, 1);
      this.upload.fileList.splice(index, 1);
      this.switchUploader('uploader', 'inline-block');
    },
    // 上传前校验
    beforeUpload(file) {
      const isLt = file.size / 1024 < this.upload.size;
      const isRightFormat = this.upload.arr.includes(file.type);
      if (!isRightFormat) this.$message.error('上传图片只能是 JPG，PNG，GIF 格式!');
      if (!isLt) this.$message.error(`上传图片大小不能超过 ${this.upload.size}KB!`);
      return isRightFormat && isLt;
    },
    // 重写提交方法
    async handleRequest ({file}) {
      const hasValid = this.beforeUpload(file);
      if (hasValid) {
        await this.uploadRequset(file);
      } else {
        this.file = null;
        this.dialogImageUrl = '';
        this.$refs.uploader.uploadFiles.pop();
      }
    },
    // 发起图片上传请求
    async uploadRequset (file) {
      try {
        const {data: certificates} = await getCertificate('product');
        const {res: {status, statusCode, requestUrls}} = await upload(certificates, file);
        if (status == 200 && statusCode == 200) {
          const img = requestUrls[0];
          this.mainForm.imgs.push(img);
          this.$notify.success({
            title: '图片上传成功',
            message: `还能继续上传${this.upload.limit - this.mainForm.imgs.length}张图片`,
          });
          this.upload.fileList.push({...file, url: img});
          if (this.mainForm.imgs.length >= this.upload.limit) this.switchUploader('uploader', 'none');
          this.$message.success('图片上传成功！');
        } else {
          this.$message.error('图片上传失败');
        }
      } catch (e) {
        throw e;
      }
    },
    // 条件搜索
    onSearch () {
      this.pager.curPage = 1;
      this.goodsListQueryReq();
    },
    // 搜索功能
    searchHandle (str) {
      this.keywords = str;
      this.pager.curPage = 1;
      this.goodsListQueryReq();
    },
    // 分页数量修改
    handleSizeChange(val) {
      this.pager.size = val;
      this.goodsListQueryReq();
    },
    // 跳转当前页
    handleCurrentChange(val) {
      this.pager.curPage = val;
      this.goodsListQueryReq();
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
    // 重置功能
    resetForm() {
      this.expandId = '';
      this.goodsName = '';
      this.skuNames = '';
      this.$refs.mainForm.resetFields();
    },
    // 提交
    submitForm() {
      this.$refs.mainForm.validate(valid => {
        if (valid) {
          this.addEvaluationReq();
        } else {
          console.log('表单验证错误');
          return false;
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
  .add-evaluation {
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
        width: 40%;
        padding: 20px;
        .custom-table-expand {
          ::v-deep {
            .el-form-item {
              margin-right: 0;
              margin-bottom: 0;
              .el-form-item__label {
                color: #99a9bf;
                font-size: 13px;
              }
              .custom-radio {
                width: unset;
                min-width: 90px;
                margin: 0;
                &+.custom-radio {
                  margin-top: 10px;
                }
              }
            }
          }

        }
      }
      .right-content {
        width: 60%;
        padding: 20px;
        border-left: 1px solid #ebeef5;
        ::v-deep {
          .el-form-item__label {
            color: #99a9bf;
            font-size: 13px;
          }
          .el-rate {
            height: 36px;
            line-height: 36px;
          }
          .el-rate__item {
            font-size: 1px;
          }
        }
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
        }
        .eval-form {
          margin-left: 30px;
        }
      }
      .custom-uploader {
        &::v-deep {
          .el-upload-list {
            .el-upload-list__item {
              margin-bottom: 0;
              margin-right: 10px;
              width: 100px;
              height: 100px;
              &.is-success{
                overflow: hidden;
              }
            }
          }
          .el-upload--picture-card {
            width: 100px;
            height: 100px;
            line-height: 100px;
          }
        }
      }
    }
    .form-btns {
      text-align: center;
      margin: 35px 0 20px;
      button+button {
        margin-left: 50px;
      }
    }
  }
</style>
