<template>
  <div class="withdraw-container">
    <el-form :model="mainForm" ref="mainForm" size="small" :rules="rules" :inline="true">
      <el-row :gutter="16">
        <el-col :span="24">
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="mainForm.phone" placeholder="输入手机号" clearable maxlength="11"
            />
          </el-form-item>

          <el-form-item label="导入时间">
            <el-date-picker
              v-model="range"
              type="daterange"
              value-format="timestamp"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="提现状态" prop="status">
            <el-select v-model="mainForm.status" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="等待审核" :value="1"></el-option>
              <el-option label="审核失败" :value="2"></el-option>
              <el-option label="打款中" :value="3"></el-option>
              <el-option label="转账成功" :value="4"></el-option>
              <el-option label="转账失败" :value="5"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="提现流水号" prop="tradeNo">
            <el-input
              v-model="mainForm.tradeNo" placeholder="提现流水号" clearable
            />
          </el-form-item>

          <el-form-item>
            <el-button v-hasPermi="['financial:blindBoxWithdraw:page']" type="primary" :loading="loading" icon="el-icon-pageReq" @click="pageReq()">查询</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item class="fr mr0" v-hasPermi="['financial:blindBoxWithdraw:import']">
            <el-tooltip effect="dark" placement="top-start">
              <div slot="content">导入，每存在一条数据，则4个字段必须有内容 ，没有<br>内容 ，则提示 “导入失败”</div>
              <el-button type="default" :loading="loading" @click="showImportDiaHandle">
                导入<i class="el-icon-warning el-icon--right"></i>
              </el-button>
            </el-tooltip>
            <el-button v-hasPermi="['financial:blindBoxWithdraw:template']" type="primary" :loading="loading" icon="el-icon-download" @click="downloadTemplReq">下载模板</el-button>
            <el-button v-hasPermi="['financial:blindBoxWithdraw:delete']" type="primary" :loading="loading" icon="el-icon-delete" @click="deleteClick(null, 1)">批量删除</el-button>
            <el-button v-hasPermi="['financial:blindBoxWithdraw:audit']" type="primary" :loading="loading" icon="el-icon-monitor" @click="auditClickBatchCclick">批量审核</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      border
      :data="tableData"
      v-loading="loading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" :selectable="checkboxSelect" width="55"></el-table-column>
      <el-table-column prop="orderNo" label="订单号" align="center" width="100"></el-table-column>
      <el-table-column prop="tradeNo" label="提现流水ID" align="center" width="100"></el-table-column>
      <el-table-column prop="channelTradeNo" label="付款流水ID" align="center" width="100"></el-table-column>
      <el-table-column prop="phone" label="手机号" width="120" align="center"></el-table-column>
      <el-table-column prop="amount" label="提现金额" width="130" align="center"></el-table-column>
      <el-table-column prop="payeeName" label="支付宝姓名" width="120" align="center"></el-table-column>
      <el-table-column prop="payeeAccount" label="支付宝账号" width="120" align="center"></el-table-column>
      <el-table-column prop="importBatch" label="导入批次" width="180" align="center"></el-table-column>
      <el-table-column prop="createTime" label="导入时间" width="180" align="center">
        <template slot-scope="{row}">
          {{row.createTime ? $dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="提现状态" align="center">
        <template slot-scope="{row}">
          <p v-if="row.status === 1">等待审核</p>
          <p v-if="row.status === 2">审核失败</p>
          <p v-if="row.status === 3" @click="showStatusDialog(row)" class="blue">打款中</p>
          <p v-if="row.status === 4" @click="showStatusDialog(row, 'succeed')" class="green">转账成功</p>
          <p v-if="row.status === 5" @click="showStatusDialog(row, 'failed')" class="red">转账失败</p>
        </template>
      </el-table-column>
      <el-table-column prop="transferRemark" label="转账备注" align="center"></el-table-column>
      <el-table-column prop="remark" label="备注" width="120" align="center"></el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="{row}">
          <template v-if="row.status==1">
            <el-button v-hasPermi="['financial:blindBoxWithdraw:audit']" type="primary" size="mini" @click="auditClick(row)">审核</el-button>
            <el-button v-hasPermi="['financial:blindBoxWithdraw:delete']" type="danger" size="mini" @click="deleteClick(row, 0)">删除</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :total="totalPage"
      class="text-right mt20"
      :page-size="pageSize"
      @current-change="pageReq"
      :page-sizes="[10, 20, 30, 100]"
      @size-change="handleSizeChange"
      :current-page.sync="pageIndex"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <!-- 状态记录 -->
    <el-dialog width="39%" :visible.sync="dialogVisible">
      <p slot="title" class="top-title">状态记录</p>
      <div>
        <p>
          <span style="padding-right:10px;">状态返回时间:</span>
          <span>{{statusRcord.completedAt ? $dayjs(statusRcord.completedAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}</span>
        </p>
        <p v-if="statusRcord.failCause">
          <span style="padding-right:10px;">转账失败原因:</span>
          <span>{{statusRcord.failCause}}</span>
        </p>
      </div>
      <span slot="footer" class="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 审核弹窗 -->
    <el-dialog width="30%" :visible.sync="dialogVisibleAudit">
      <p slot="title" class="top-title">
        <i class="el-icon-question" style="color:#1890ff;"></i>是否确定审核通过？审核通过后现金额将转给用户
      </p>

      <div class="audit-class">
        <el-form class="form-class" :model="auditForm" ref="auditForm" label-width="80px" :rules="rules">
          <el-form-item label="审核" prop="status">
            <el-radio-group v-model="auditForm.status">
              <el-radio :label="3">审核通过</el-radio>
              <el-radio :label="2">审核拒绝</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item v-if="auditForm.status==2" label="拒绝原因" prop="rejectCause">
            <el-input
              type="textarea"
              :rows="4"
              clearable
              maxlength="20"
              show-word-limit
              placeholder="请输入"
              v-model.trim="auditForm.rejectCause"
            />
          </el-form-item>

          <el-form-item label="验证码" prop="code">
            <el-input placeholder="请输入验证码" v-model="auditForm.code">
              <template slot="suffix">
                <el-button type="text" v-hasPermi="['financial:blindBoxWithdraw:smsSend','financial:blindBoxWithdraw:smsReceive']" @click="getCodeHandle" v-if="counter==60">{{counterTxt}}</el-button>
                <el-button type="text" v-else>{{counter<10?'0'+counter:counter}} s</el-button>
              </template>
            </el-input>
          </el-form-item>
          <div class="input-tips" v-if="verPhone">验证码已发送至 {{verPhone}}</div>
        </el-form>
      </div>
      <span slot="footer" class="footer">
        <el-button @click="cancelAuditHandle">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmAuditHandle"
          v-hasPermi="['financial:blindBoxWithdraw:audit']"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 导入授权 -->
    <el-dialog width="30%" :visible.sync="dialogVisibleImport">
      <p slot="title" class="top-title">
        <i class="el-icon-question mr15" style="color:#1890ff;"></i>确定要导入？
      </p>

      <div class="import-wrap">
        <el-form class="form-class" :model="importForm" ref="importForm" label-width="70px" :rules="rules">
          <el-form-item label="验证码" prop="code">
            <el-input placeholder="请输入验证码" v-model="importForm.code">
              <template slot="suffix">
                <el-button type="text" v-hasPermi="['financial:blindBoxWithdraw:smsSend','financial:blindBoxWithdraw:smsReceive']" @click="getCodeHandle" v-if="counter==60">{{counterTxt}}</el-button>
                <el-button type="text" v-else>{{counter<10?'0'+counter:counter}} s</el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              :rows="4"
              clearable
              maxlength="20"
              show-word-limit
              placeholder="请输入备注"
              v-model.trim="importForm.remark"
            />
          </el-form-item>

          <el-form-item label="导入数据">
            <el-upload
              ref="upload"
              class="upload-class"
              :file-list="uploadConf.fileList"
              :action="uploadConf.action"
              :limit="uploadConf.limit"
              :auto-upload="uploadConf.auto"
              :accept="uploadConf.accept"
              :list-type="uploadConf.type"
              :on-remove="handleRemove"
              :on-change="handleChange"
              :show-file-list="uploadConf.showList">
              <el-button size="small" icon="el-icon-upload" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>

          <div class="input-tips" v-if="verPhone">验证码已发送至 {{verPhone}}</div>
        </el-form>
      </div>
      <span slot="footer" class="footer">
        <el-button @click="cancelImportVerHandle">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmImportVerHandle"
          v-hasPermi="[
            'financial:blindBoxWithdraw:smsVerify',
            'financial:blindBoxWithdraw:import',
          ]"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {saveAs} from 'file-saver';
  import {
    audit, importExcel, page, smsSend, smsVerify, downloadTempl, verPhone, del
  } from '@/api/wealth/boxWithdraw';

  export default {
    components: {},
    data () {
      return {
        uploadConf: {
          size: 600,
          showList: true,
          auto: false,
          action: '',
          limit: 1,
          fileList: [],
          type: 'text',
          accept: '.csv,.xlc,.xls,.xlsx,.xlm,.xlt,.xlw,.numbers',
          arr: [
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          ],
        },
        file: null,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        range: [],
        mainForm: {
          phone: '',
          status: '',
          tradeNo: '',
          orderItems: []
        },
        importForm: {
          code: '',
          remark: '',
        },
        auditForm: {
          rejectCause: '',
          status: '',
          code: '',
        },
        tableData: [],
        multSel: [],
        loading: false,
        dialogVisible: false,
        dialogVisibleAudit: false,
        dialogVisibleImport: false,
        statusRcord: {
          completedAt: '',
          failCause: ''
        },
        isBatchType: '',
        curChoosedId: '',
        counter: 60,
        counterTxt: '获取验证码',
        verPhone: '',
        timer: null,
        rules: {
          remark: [
            { required: false, type: 'string', min: 0, max: 20, message: '输入长度0-20个字符', trigger: 'blur' },
          ],
          code: [
            { required: true, message: '输入不能为空', trigger: 'blur' },
            { pattern: /^\d{6}$/, message: '验证码格式有误', trigger: 'blur'}
          ],
          rejectCause: [
            { required: true, message: '输入不能为空', trigger: 'blur' },
            { type: 'string', min: 0, max: 20, message: '输入长度0-20个字符', trigger: 'blur' }
          ],
          phone: [
            { required: false, pattern: /^1\d{10}$/, message: '手机号格式有误', trigger: 'blur' }
          ]
        },
      }
    },
    mounted () {
      this.pageReq();
    },
    watch: {},
    methods: {
      // 取消导入验证
      cancelImportVerHandle() {
        this.dialogVisibleImport = false;
        this.file = null;
        this.counter = 60;
        this.counterTxt = '获取验证码';
        this.$refs.upload.clearFiles();
        this.$refs.importForm.resetFields();
        if (this.timer) clearInterval(this.timer);
      },
      // 确认导入验证
      confirmImportVerHandle() {
        this.$refs.importForm.validate(valid => valid ? this.smsVerifyReq() : false);
      },
      // 校验验证码
      async smsVerifyReq() {
        try {
          const {code, messge} = await smsVerify({code: this.importForm.code});

          if (code == 200) {
            this.uploadRequset();
          } else {
            this.$message.error(messge);
          }
        } catch (error) {
          throw error;
        }
      },
      // 发送验证码
      async smsSendReq() {
        try {
          const {code, data, message} = await smsSend();

          if (code == 200) {
            this.verPhoneReq();
            this.$message.success('发送成功');
          } else {
            this.$message.error(message);
          }
        } catch (error) {
          throw error;
        }
      },
      // 脱敏手机号
      async verPhoneReq() {
        try {
          const {code, message, data} = await verPhone();

          if (code == 200) {
            this.verPhone = data.result || '--';
          } else {
            this.$message.error(message);
          }
        } catch (error) {
          throw error;
        }
      },
      // 获取验证码
      getCodeHandle() {
        this.counter--;
        this.smsSendReq();
        this.timer = setInterval(() => {
          if (this.counter > 1) {
            this.counter--;
          } else {
            clearInterval(this.timer);
            this.counterTxt = '重新获取';
            this.counter = 60;
          }
        }, 1000);
      },
      // 导入文件弹框
      showImportDiaHandle() {
        this.importForm.code = '';
        this.importForm.remark = '';
        this.dialogVisibleImport = true;
      },
      // 文件状态改变
      handleChange(file, fileList) {
        this.file = file.raw;
      },
      // 上传前校验
      handleBeforeUpload(file) {
        const isLt = file.size / 1024 < this.uploadConf.size;
        const isRightFormat = this.uploadConf.arr.includes(file.type);

        if (!isRightFormat) this.$message.error('上传文件只能是表格格式!');
        if (!isLt) this.$message.error(`上传文件大小不能超过 ${this.uploadConf.size}KB!`);
        return isRightFormat && isLt;
      },
      // 移除上传
      handleRemove(file, fileList) {
        this.$refs.upload.clearFiles();
      },
      // 发起上传请求
      async uploadRequset() {
        try {
          const hasValid = this.handleBeforeUpload(this.file);

          if (hasValid) {
            const {remark} = this.importForm;
            const formData = new FormData();
            formData.append('file', this.file);
            formData.append('remark', remark);

            const {code, message} = await importExcel(formData);
            if (code == 200) {
              this.dialogVisibleImport = false;
              // 清空上传列表
              this.file = null;
              this.counter = 60;
              this.importForm.code = '';
              this.importForm.remark = '';
              this.counterTxt = '获取验证码';
              this.$refs.upload.clearFiles();
              this.$refs.importForm.resetFields();
              if (this.timer) clearInterval(this.timer);
              this.$message.success('上传成功');
              this.$emit('update'); // 更新状态数据
              this.pageReq();
            } else {
              this.$message.error(message);
            }
          } else {
            this.file = null;
            this.dialogImageUrl = '';
            this.handleRemove(null, []);
          }
        } catch (e) {
          throw e;
        }
      },
      // 下载模板
      async downloadTemplReq () {
        try {
          this.loading = true;
          const {data, status, filename} = await downloadTempl();
          if (status == 200) {
            let bob = new Blob([data], {type: 'application/vnd.ms-excel'});
            saveAs(bob, filename);
            this.$message.success('模板下载成功');
          } else {
            this.$message.error('模板下载失败');
          };
          this.loading = false;
        } catch (error) {
          this.loading = false;
          throw error;
        }
      },
      checkboxSelect (row, rowIndex) {
        return row.status === 1;
      },
      handleSelectionChange (val) {
        this.multSel = val.map(val => val.id);
      },
      // 提现审核请求
      async auditReq() {
        try {
          const ids = this.isBatchType ? this.multSel : [this.curChoosedId];

          const {code, message, data} = await audit({
            ids,
            ...this.auditForm,
          });

          if (code == 200) {
            this.counter = 60;
            this.counterTxt = '获取验证码';
            this.dialogVisibleAudit = false;
            if (this.timer) clearInterval(this.timer);
            this.$refs.auditForm.resetFields();
            this.$message.success('审核成功');
            this.$emit('update'); // 更新状态数据
            this.pageReq();
          } else {
            this.$message.error(message);
          }
        } catch (error) {
          throw error;
        }
      },
      // 取消审核弹窗
      cancelAuditHandle() {
        this.dialogVisibleAudit = false;
        this.counter = 60;
        this.counterTxt = '获取验证码';
        if (this.timer) clearInterval(this.timer);
        this.$refs.auditForm.resetFields();
      },
      // 确认审核弹窗
      confirmAuditHandle () {
        this.$refs.auditForm.validate(valid => {
          if (valid) this.auditReq();
        });
      },
      // 单个审核
      auditClick (row) {
        this.dialogVisibleAudit = true
        this.isBatchType = 0;
        this.auditForm.rejectCause = '';
        this.auditForm.status = 3;
        this.auditForm.code = '';
        this.curChoosedId = row.id;
      },
      // 批量审核
      auditClickBatchCclick () {
        if (!this.multSel.length) return this.$message.error('请先选择批量数据');
        this.dialogVisibleAudit = true;
        this.isBatchType = 1;
        this.auditForm.rejectCause = '';
        this.auditForm.status = 3;
        this.auditForm.code = '';
      },
      // 单个、批量删除操作
      deleteClick(row, sign) {
        this.isBatchType = sign;
        this.curChoosedId = row && row.id;
        if (!this.multSel.length && sign) return this.$message.error('请先选择批量数据');
        this.$confirm('确定要删除此记录吗？', {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.delReq();
        }).catch(() => {
          this.$message.info('已取消删除');
        });
      },
      // 删除记录
      async delReq() {
        try {
          const datas = this.isBatchType ? this.multSel : [this.curChoosedId];

          const {code, message} = await del({datas});

          if (code == 200) {
            this.$message.success('删除成功');
            this.$emit('update'); // 更新状态数据
            this.pageReq();
          } else {
            this.$message.error(message);
          }
        } catch (error) {
          throw error;
        }
      },
      // 状态记录dialog
      showStatusDialog (row, type) {
        this.dialogVisible = true
        this.statusRcord.completedAt = type == 'failed' ? row.failTime : row.completedTime;
        this.statusRcord.failCause = row.failCause || ''
      },
      // 全部分页
      async pageReq () {
        try {
          this.loading = true;
          let pageSize = this.pageSize;
          let currentPage = this.pageIndex;
          let {phone, status, tradeNo} = this.mainForm;
          let [startTime, endTime] = this.range || ['', ''];
          startTime = startTime ? this.$dayjs(startTime).format('YYYY-MM-DD') : '';
          endTime = endTime ? this.$dayjs(endTime).format('YYYY-MM-DD') : '';

          const {code, message, data} = await page({
            phone, status, tradeNo, endTime, startTime,
            pageSize, currentPage,
          });

          if (code == 200) {
            const {list, total} = data;
            this.totalPage = total;
            this.tableData = list || [];
          } else {
            this.$message.error(message);
          }
          this.loading = false;
        } catch (error) {
          this.loading = false;
          throw error;
        };
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.pageReq()
      }
    }
  }
</script>

<style lang="scss">
  .top-title {
    font-size: 16px;
    text-align: center;
    margin: 0;
  }
  .form-class {
    width: 380px;
    margin: 0 auto;
  }
  .import-wrap {
    text-align: center;
  }
  .footer {
    display: block;
    text-align: center;
    & .el-button:first-child {
      margin-right: 15px;
    }
  }
  .input-tips {
    color: #9ca7b5;
    text-align: right
  }
  .audit-class {
    text-align: center;
    .top-text {
      font-size: 16px;
    }
  }
  .upload-class {
    text-align: left;
  }
  .blue {
    text-decoration: underline;
    color: blue;
    cursor: pointer;
  }
  .green {
    text-decoration: underline;
    color: green;
    cursor: pointer;
  }
  .red {
    text-decoration: underline;
    color: red;
    cursor: pointer;
  }
</style>
