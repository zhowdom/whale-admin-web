<template>
  <div class="tab-content cont_Wrapper">

    <el-form ref="queryForm" :inline="true">
      <el-form-item label="名称">
        <el-input v-model="subTitle" placeholder="请输入" clearable></el-input>
      </el-form-item>

      <el-form-item label="质押币种">
        <el-select v-model="coinNameFrom" clearable placeholder="质押币种">
          <el-option v-for="(item, index) in coinMaps" :label="item" :value="item" :key="index"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="赚取币种">
        <el-select v-model="coinNameTo" clearable placeholder="赚取币种">
          <el-option v-for="(item, index) in coinMaps" :label="item" :value="item" :key="index"></el-option>
        </el-select>
      </el-form-item>

    </el-form>
    

    <div class="mb30">
      <el-button v-hasPermi="['wallet:mining:conf:page']" type="primary" @click="search(1)">查询</el-button>
      <el-button v-hasPermi="['wallet:mining:conf:add']" icon="el-icon-plus" type="primary" @click="handleAdd()">新增</el-button>
    </div>
    <div class="task-table">
      <!--table-->
      <el-table
      :data="tableData"
      v-loading="loading"
      style="width: 100%">
        <el-table-column prop="subTitle" label="名称" align="center" min-width="120"></el-table-column>
        <el-table-column prop="coinNameFrom" label="质押币种" align="center" min-width="120"></el-table-column>
        <!-- <el-table-column prop="iconFrom" label="质押币图标" align="center" min-width="160">
          <template slot-scope="{row}">
            <el-image  style="width: 100px; height: 100px" :src="row.iconFrom" :preview-src-list="[row.iconFrom]"></el-image>
          </template>
        </el-table-column> -->
        <el-table-column prop="coinNameTo" label="获得收益币种" align="center" min-width="120"></el-table-column>
        <!-- <el-table-column prop="iconTo" label="获得收益币图标" align="center" min-width="160">
          <template slot-scope="{row}">
            <el-image  style="width: 100px; height: 100px" :src="row.iconTo" :preview-src-list="[row.iconTo]"></el-image>
          </template>
        </el-table-column> -->
        <el-table-column prop="updatedAt" label="更新时间" align="center" min-width="160">
          <template slot-scope="{row}">
            {{row.updatedAt ? $dayjs(row.updatedAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template scope="scope">
            <el-button v-hasPermi="['wallet:mining:conf:edit']" type="primary" size="mini" @click="handelEdit(scope.row)" :disabled="scope.row.enabled">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--table-->
      <div class="table-pagination text-right mt10">
        <el-pagination
        @current-change="search"
        :page-sizes="[10, 20, 30]"
        @size-change="handleSizeChange"
        :current-page.sync="pageIndex"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
        </el-pagination>
      </div>
    </div>
    <!--新增/编辑dialog-->
    <el-dialog custom-class="certifyForm" title="挖矿类型配置" :visible.sync="dialogFormVisible" :width="'600px'">
      <el-form :model="certifyform" :rules="rules" ref="ruleForm">
        <el-form-item label="质押币种：" :label-width="formLabelWidth" prop="coinNameFrom">
          <el-select v-model="certifyform.coinNameFrom" clearable placeholder="请选择" @change="handleSelectToFror" :disabled="!!certifyform.id">
            <el-option v-for="(item, index) in exchangeArr" :label="item" :value="item" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="质押币种图标：" :label-width="formLabelWidth" prop="iconFrom">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :http-request="handleAvatarSuccessRUN.bind(file, 'FRONT')">
            <img v-if="certifyform.iconFrom" :src="certifyform.iconFrom" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item> -->
        <el-form-item label="获得收益币种：" :label-width="formLabelWidth" prop="coinNameTo">
          <el-select v-model="certifyform.coinNameTo" clearable placeholder="请选择" @change="handleSelectToFror" :disabled="!!certifyform.id">
            <el-option v-for="(item, index) in exchangeArr" :label="item" :value="item" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="收益币种图标：" :label-width="formLabelWidth" prop="iconTo">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :http-request="handleAvatarSuccessRUN.bind(file, 'ICONTO')">
            <img v-if="certifyform.iconTo" :src="certifyform.iconTo" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item> -->
        <el-form-item label="名称：" :label-width="formLabelWidth">
          <el-input :value="(certifyform.coinNameTo ? `赚${certifyform.coinNameTo}` : '') + (certifyform.coinNameFrom ? `质押${certifyform.coinNameFrom}` : '')" disabled></el-input>
        </el-form-item>
        <el-form-item label="收益换算汇率：" :label-width="formLabelWidth" prop="exchangeRateType" v-if="isRateTypeBool">
          <el-radio-group v-model="certifyform.exchangeRateType">
            <div class="mb20"><el-radio :label="1">USDT 本位（使用USDT 本位，作为中间换算）</el-radio></div>
            <div><el-radio :label="2">新建  （创建新的闪兑汇率 ）</el-radio></div>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="" :label-width="formLabelWidth" prop="rateItem" v-if="certifyform.exchangeRateType == 2">
          <el-col :span="7">
              <el-input value="1" disabled></el-input>
          </el-col>
          <el-col class="line" :span="1">:</el-col>
          <el-col :span="7">
              <el-input v-model="certifyform.rateItem" @input="certifyform.rateItem=certifyform.rateItem.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g,'$1')" autocomplete="off" maxlength="20" clearable></el-input>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="7">
              <el-input v-model="certifyform.rateItem2" @input="certifyform.rateItem2=certifyform.rateItem2.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g,'$1')" autocomplete="off" maxlength="20" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="" :label-width="formLabelWidth" v-if="certifyform.exchangeRateType == 2">
          汇率，在输入的配置范围的区间内随机选择，区间范围包头包尾，小数6位，最大10000
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { upload, getCertificate } from "@/api/system/userlist";
import { miningConfigPage, miningConfigTypeEdit, miningConfigAdd } from "@/api/miningManage";
import { exchangeList, daiCoinSettingList } from "@/api/xhgjSpark_api/daiCoinSetting.js";
import {compareVersion, replaceUnitlPrefixStr} from '@/utils/index';
import {  } from "@/api/miningManage";
  export default {
    components: {},
    data () {
      let imgValidator = (rule, value, callback) => {
        if (!/\S/.test(value)) {
          callback(new Error('请上传图片'))
        } else {
          callback()
        }
      }
      const validateRateItem = (rule, value, callback) => {
        if(this.certifyform.exchangeRateType == 2 && (!value || !this.certifyform.rateItem2)) {
          callback(new Error('不能为空'));
        }else if(Number(this.certifyform.rateItem2) > 10000){
          callback(new Error('不能大于10000'));
        }else{
          callback();
        }
      }
      return {
        subTitle: '',
        coinNameFrom: '',
        coinNameTo: '',
        coinMaps: [],
        loading: false,
        submitLoading: false,
        tableData: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dialogFormVisible: false,
        certifyform: {
          coinNameFrom: '',
          coinNameTo: '',
          exchangeRate: [],
          exchangeRateType: '',
          iconFrom: '',
          iconTo: '',
          id: ''
        },
        rules: {
          coinNameFrom: [
            { required: true, message: '不能为空', trigger: 'change' }
          ],
          coinNameTo: [
            { required: true, message: '不能为空', trigger: 'change' }
          ],
          iconFrom: [
            { required: true, validator: imgValidator, trigger: 'blur' }
          ],
          iconTo: [
            { required: true, validator: imgValidator, trigger: 'blur' }
          ],
          exchangeRateType: [
            { required: true, message: '不能为空', trigger: 'change' }
          ],
          rateItem: [
            { required: true, validator: validateRateItem, trigger: 'blur' }
          ],
        },
        file: '',
        formLabelWidth: '130px',
        exchangeArr: [],
        exchangeObj: {},
        isRateTypeBool: false
      }
    },
    created () {
      // 币种下拉
      daiCoinSettingList().then(response => {
        if (response.code == 200) {
          this.coinMaps = response.data || []
        } else {
          this.coinMaps = []
        }
      })
    },
    mounted () {
      this.search();
      this.getCertificateRun();
      this.exchangeList();
    },
    methods: {
      exchangeList() {
        exchangeList({}).then(response => {
          if (response.code === 200) {
            this.exchangeArr = JSON.parse(JSON.stringify(response.data))
          } else {
            this.exchangeArr = []
            this.$message.error(response.message)
          }
        })
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.search()
      },
      // 数据查询
      search (pgi) {
        if (pgi) this.pageIndex = pgi
        let _params = {
          currentPage: this.pageIndex,
          pageSize: this.pageSize,
          coinNameFrom: this.coinNameFrom,
          coinNameTo: this.coinNameTo,
          subTitle: this.subTitle,
        }
        this.loading = true
        miningConfigPage(_params).then(response => {
          if (response.code === 200) {
            this.tableData = JSON.parse(JSON.stringify(response.data.list))
            this.totalPage = response.data.total
            this.loading = false
          } else {
            this.tableData = []
            this.totalPage = 0
            this.pageSize = 10
            this.loading = false
            this.$message.error(response.message)
          }
        })
      },
      handleAdd() {
        this.certifyform = {
          coinNameFrom: '',
          coinNameTo: '',
          exchangeRate: [],
          exchangeRateType: '',
          // iconFrom: '',
          // iconTo: '',
          id: ''
        };
        if(this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields();
        this.dialogFormVisible = true;
      },
      handelEdit(row) {
        this.certifyform = Object.assign({rateItem: null, rateItem2: null}, row);;
        if(this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields();
        if(this.certifyform.exchangeRateType == 2) {
          this.certifyform.rateItem = row.exchangeRate[0];
          this.certifyform.rateItem2 = row.exchangeRate[1];
        }
        this.handleSelectToFror();
        this.dialogFormVisible = true;
      },
      // 选择币种
      handleSelectToFror() {
        if(
          this.certifyform.coinNameFrom != '' &&
          this.certifyform.coinNameFrom != null &&
          this.certifyform.coinNameFrom != undefined &&
          this.certifyform.coinNameTo != '' &&
          this.certifyform.coinNameTo != null &&
          this.certifyform.coinNameTo != undefined &&
          this.certifyform.coinNameFrom === this.certifyform.coinNameTo
        ) {
          this.isRateTypeBool = false;
        }else {
          this.isRateTypeBool = true;
        }
      },
          
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let isFromToBool = false;
            this.tableData.forEach(item => {
              if(item.coinNameFrom == this.certifyform.coinNameFrom && item.coinNameTo == this.certifyform.coinNameTo) {
                isFromToBool = true;
              }
            })
            if(isFromToBool) {
              this.$message.error('已存在，请重新选择');
              return;
            }
            if(this.certifyform.exchangeRateType == 2) {
              this.certifyform.exchangeRate = [Number(this.certifyform.rateItem), Number(this.certifyform.rateItem2)];
            }
            if(this.certifyform.coinNameFrom == this.certifyform.coinNameTo) {
              this.certifyform.exchangeRate = [];
              this.certifyform.exchangeRateType = 0;
            }
            this.submitLoading = true;
            if(this.certifyform.id) {
              miningConfigTypeEdit(this.certifyform).then(response => {
                if (response.code === 200) {
                  this.msgSuccess(`保存成功`)
                  this.dialogFormVisible = false;
                  this.search(1);
                } else {
                  this.msgSuccess(response.message)
                  this.dialogFormVisible = false
                }
                setTimeout(() => {
                  this.submitLoading = false;
                },1000)
              }).catch(err => {
                this.submitLoading = false;
              })
            }else {
              miningConfigAdd(this.certifyform).then(response => {
                if (response.code === 200) {
                  this.msgSuccess(`保存成功`)
                  this.dialogFormVisible = false;
                  this.submitLoading = false;
                  this.search(this.pageIndex);
                } else {
                  this.msgSuccess(response.message)
                  this.dialogFormVisible = false
                  this.submitLoading = false;
                }
              }).catch(err => {
                this.submitLoading = false;
              })
            }
          }
        })
      },
      // 向您搭建的STS服务获取临时访问凭证。
      getCertificateRun () {
        return new Promise((resolve, reject) => {
          getCertificate().then(response => {
            this.certificateInfos = response.data
            resolve(this.certificateInfos)
          })
        })
      },
      // 图片上传
      async handleAvatarSuccessRUN (type, file) { // the order of the parameters here must be reversed.
        let _valid = this.beforeAvatarUpload(file.file)
        if (!_valid) await this.put(file.file, type)
      },
      beforeAvatarUpload(file) {
        const isNOtJPGPNG = file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png'
        const isGt2M = file.size / 1024 / 1024 > 5
        if (isNOtJPGPNG) {
          this.$message.error('请上传是 jpg、png、jpeg 格式的图片!')
        }
        if (isGt2M) {
          this.$message.error('上传图片大小不能超过 5MB!')
        }
        return isNOtJPGPNG || isGt2M
      },
      async put (file, type) {
        try {
          let _res = await upload(this.certificateInfos, file)
          let ossFileUrl = _res.res.requestUrls[0]
          //如果CDN域名不为空，则替换成CDN域名
          if(this.certificateInfos.bucketCdnUrl){
            ossFileUrl = replaceUnitlPrefixStr(ossFileUrl, this.certificateInfos.endpoint, this.certificateInfos.bucketCdnUrl);
          }
          switch(type) {
            case 'FRONT':
              this.certifyform.iconFrom = ossFileUrl
              this.$refs['ruleForm'].clearValidate('iconFrom')
              break;
            case 'ICONTO':
              this.certifyform.iconTo = ossFileUrl
              this.$refs['ruleForm'].clearValidate('iconTo')
              break;
          }
        } catch (e) {
          console.log(e)
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
.tab-content{
  .danwei{
    position: absolute;
    top: 0;
    right: -45px;
  }
  .line{
    text-align: center;
  }
}
</style>
<style lang="scss">
.tab-content{
  form{
    padding-right:40px;
  }
  .el-form-item__content{
    position: relative;
  }
  .el-select{
    width: 100%;
  }
}
/*upload style*/
.cont_Wrapper .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.cont_Wrapper .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.cont_Wrapper .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.cont_Wrapper .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.cont_Wrapper .certifyForm{
  width:600px;
}
.certifyForm form{
  padding-right:20px;
}
.uploadSuccessed {
  width:200px;
  height: 200px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
}
.uploadSuccessed img{
  height: 100%;
  width: 100%;
  cursor: pointer;
}
</style>

