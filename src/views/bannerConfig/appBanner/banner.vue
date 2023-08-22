<template>
  <div class="tab-content cont_Wrapper">
    <div style="padding-bottom:15px;">
      <span style="color:red;font-size:13px;">点击【禁用】后，只是APP端不展示，接口并未关闭 ；但是如果用户没有刷新，存在缓存，仍然可以进行跳转。</span>
      <el-button size="medium" type="primary" @click="jumpToApiCloseRoute">前往关闭后端接口</el-button>
      <el-button v-hasPermi="['setting:banner_setting:save']" icon="el-icon-plus" type="primary" @click="handleAdd()">新增</el-button>
    </div>
    <!--table-->
    <el-table
    :data="tableData"
    v-loading="loading"
    class="tab-contentbox"
    style="width: 100%">
      <el-table-column prop="id" label="编号" align="center" min-width="120">
        <template slot-scope="{row}">
          {{row.id}}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="添加时间" align="center" min-width="160">
        <template slot-scope="{row}">
          {{row.createTime ? $dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" align="center" min-width="120"></el-table-column>
      <el-table-column prop="position" label="banner位置" align="center" min-width="140">
        <template slot-scope="{row}">
          {{bannerConfigAppSelectObj[row.position]}}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="banner名称" align="center" min-width="120"></el-table-column>
      <!-- <el-table-column prop="bizType" label="业务类型" align="center" min-width="120">
        <template slot-scope="{row}">
          {{row.bizType}}
        </template>
      </el-table-column> -->
      <el-table-column prop="image" label="banner图片" align="center" min-width="160">
        <template slot-scope="{row}">
          <el-image  style="width: 100px; height: 100px" :src="row.image" :preview-src-list="[row.image]"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间" align="center" min-width="160">
          <template slot-scope="{row}">
            {{row.startTime ? $dayjs(row.startTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
          </template>
        </el-table-column>
      <el-table-column prop="endTime" label="到期时间" align="center" min-width="160">
          <template slot-scope="{row}">
            {{row.endTime ? $dayjs(row.endTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
          </template>
        </el-table-column>
      <el-table-column prop="jumpLinkId" label="是否配置连接" align="center" min-width="120">
        <template slot-scope="{row}">
          {{row.jumpLinkId ? '是': '否'}}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center" min-width="160">
        <template slot-scope="{row}">
          <el-switch v-hasPermi="['setting:banner_setting:change']" v-model="row.status" :active-value="true" :inactive-value="false" @change="handleSetType(row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" align="center" min-width="160"></el-table-column>
      <el-table-column label="操作" align="center" width="220">
        <template scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row, true)">查看</el-button>
          <el-button v-hasPermi="['setting:banner_setting:update']" type="primary" size="mini" @click="handleEdit(scope.row)" v-if="!scope.row.status">编辑</el-button>
          <el-button v-hasPermi="['setting:banner_setting:delete']" type="primary" size="mini" @click="handleDelete(scope.row)" v-if="!scope.row.status">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--table-->
    <el-pagination
    style="float:right;padding-top:20px;"
    @current-change="search"
    :page-sizes="[10, 20, 30]"
    @size-change="handleSizeChange"
    :current-page.sync="pageIndex"
    :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="totalPage">
    </el-pagination>
    <!--新增/编辑dialog-->
    <el-dialog custom-class="certifyForm" :title="dialogTitle" :visible.sync="dialogFormVisible" :width="'630px'">
      <el-form :model="certifyform" :rules="rules" ref="ruleForm" :disabled="seeBool">
        <el-form-item label="banner位置：" :label-width="formLabelWidth" prop="position">
          <el-select v-model="certifyform.position" clearable placeholder="请选择" class="mb20">
            <el-option v-for="(item, index) of bannerConfigAppSelectArr" :key="index" :label="item.desc" :value="item.code" :disabled="item.disable"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="banner名称：" :label-width="formLabelWidth" prop="name">
          <el-input maxlength="40" v-model="certifyform.name" autocomplete="off" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="banner起止时间：" :label-width="formLabelWidth">
          <el-date-picker
            v-model="jointimeSelected"
            type="datetimerange"
            value-format="timestamp"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="排序：" :label-width="formLabelWidth" prop="sort">
          <el-input v-model.number="certifyform.sort" autocomplete="off" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="banner图片：" :label-width="formLabelWidth" prop="image">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :http-request="handleAvatarSuccessRUN.bind(file, 'FRONT')">
            <img v-if="certifyform.image" :src="certifyform.image" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注：" :label-width="formLabelWidth" prop="remark">
          <el-input maxlength="200" v-model="certifyform.remark" autocomplete="off" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="配置连接：" :label-width="formLabelWidth">
          <el-form-item label="渠道来源：" :label-width="formLabelWidth" prop="urlType">
            <el-select v-model="certifyform.urlType" clearable placeholder="请选择" class="mb20" @change="handleUrlTypeChange">
              <el-option label="外链" :value="1"></el-option>
              <el-option label="内链" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="路由名称：" :label-width="formLabelWidth" prop="jumpLinkId">
            <el-select v-model="certifyform.jumpLinkId" clearable placeholder="请选择" @change="handleJumpLinkArrChange">
              <el-option v-for="(its, index) in jumpLinkArr" :key="index" :label="its.routeName" :value="its.jumpLinkId" :disabled="!its.status"></el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item label="参数名-参数值：" :label-width="formLabelWidth">
          <div v-for="(item, index) of paramsArr" :key="index">
            <el-col :span="11">
              <el-input :value="item.name" disabled></el-input>
            </el-col>
            <el-col class="line" :span="2">:</el-col>
            <el-col :span="11">
              <el-input v-model="item.value" autocomplete="off" clearable></el-input>
            </el-col>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" v-show="!seeBool">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { setRoutLinkList } from "@/api/games";
import { upload, getCertificate } from "@/api/system/userlist";
import {compareVersion, replaceUnitlPrefixStr} from '@/utils/index';
import { bannerConfigPage, addBannerConfig, editBannerConfig, changeBannerConfig, deleteBannerConfig } from "@/api/bannerConfig";
import { bannerConfigAppSelect } from "@/api/bannerConfig/index";
export default {
  props: {},
  data() {
    let imgValidator = (rule, value, callback) => {
      if (!/\S/.test(value)) {
        callback(new Error('请上传图片'))
      } else {
        callback()
      }
    }
    return {
      bannerConfigAppSelectArr: [],
      bannerConfigAppSelectObj: {},
      loading: false,
      dialogFormVisible: false,
      dialogTitle: '新增/编辑banner',
      certifyform: {
        position: '',
        name: '',
        startTime: '',
        endTime: '',
        sort: '',
        image: '',
        remark: '',
        urlType: '',
        jumpLinkId: '',
        params: [],
        type: 1
      },
      rules: {
        position: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        urlType: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        jumpLinkId: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        image: [
          { required: true, validator: imgValidator, trigger: 'blur,change' }
        ],
        position: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        sort: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { type: 'number', min: 1, message: '排序为数字且必须大于等于1', trigger: 'blur' },
        ],
      },
      jumpLinkArr: [],// 路由
      paramsArr: [],// 参数
      formLabelWidth: '130px',
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      tableData: [],
      file: '',
      seeBool: false,
      operationType: 'add',
      jointimeSelected: [],// 时间
    }
  },
  activated() {
    this.search();
    this.getCertificateRun();
  },
  mounted () {
    this.adsRent_addressList()
  },
  methods: {
    adsRent_addressList() {
        bannerConfigAppSelect({}).then(response => {
          if (response.code === 200) {
            this.bannerConfigAppSelectArr = JSON.parse(JSON.stringify(response.data.list));
            this.bannerConfigAppSelectArr.forEach(item => {
              this.bannerConfigAppSelectObj[item.code] = item.desc;
            })
          } else {
            this.bannerConfigAppSelectArr = [];
            this.$message.error(response.message)
          }
        })
    },
    jumpToApiCloseRoute () {
      this.$router.push('/setting/apiEnableStatus')
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
        position: '',
        name: '',
        type: 1
      }
      this.loading = true
      bannerConfigPage(_params).then(response => {
        if (response.code === 200) {
          this.tableData = JSON.parse(JSON.stringify(response.data.list));
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
    // 删除
    handleDelete(row) {
      this.$confirm('是否确定要删除该条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        deleteBannerConfig({id: row.id}).then(response => {
          if (response.code === 200) {
            this.msgSuccess(`删除成功`)
            this.search(1);
          } else {
            this.msgSuccess(response.message)
          }
        })
      }).catch(() => {
                  
      });
    },
    // 状态开关
    handleSetType(row) {
      let text = row.status === true ? "启用" : "停用";
      this.$confirm(`确认要${text}该配置?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        let _params = {
          id: row.id
        }
        changeBannerConfig(_params).then(response => {
          if (response.code === 200) {
            this.msgSuccess(`保存成功`)
            this.search();
          } else {
            this.msgSuccess(response.message)
          }
        })
      }).catch(() => {
        row.status = !row.status;
      });
    },
    handleAdd() {
      this.seeBool = false;
      this.operationType = 'add';
      this.certifyform = {
        position: '',
        name: '',
        startTime: '',
        endTime: '',
        sort: '',
        image: '',
        remark: '',
        urlType: '',
        jumpLinkId: '',
        params: [],
        type: 1
      };
      this.paramsArr = [];
      this.jointimeSelected = [];
      if(this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields();
      this.dialogFormVisible = true;
    },
    handleEdit(row, seeBool = false) {
      this.seeBool = seeBool;
      this.operationType = 'etid';
      this.certifyform = Object.assign({}, row);
      this.handleUrlTypeChange(row.urlType, true);
      this.paramsArr = row.params;
      this.jointimeSelected = [];
      if(row.startTime && row.endTime) {
        this.jointimeSelected = [new Date(row.startTime).getTime(), new Date(row.endTime).getTime()];
      }
      this.dialogFormVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.certifyform.jumpLinkId) {
            this.certifyform.params = this.paramsArr;
          }
          if(this.jointimeSelected && this.jointimeSelected.length > 0) {
            this.certifyform.startTime = this.jointimeSelected[0];
            this.certifyform.endTime = this.jointimeSelected[1];
          }
          if(this.operationType == 'etid') {
            editBannerConfig(this.certifyform).then(response => {
              if (response.code === 200) {
                this.msgSuccess(`保存成功`)
                this.dialogFormVisible = false;
                this.search(1);
              } else {
                this.msgSuccess(response.message)
                this.dialogFormVisible = false
              }
            })
          }else {
            addBannerConfig(this.certifyform).then(response => {
              if (response.code === 200) {
                this.msgSuccess(`保存成功`)
                this.dialogFormVisible = false;
                this.search(1);
              } else {
                this.msgSuccess(response.message)
                this.dialogFormVisible = false
              }
            })
          }
        }
      })
    },
    // 选择渠道来源
    handleUrlTypeChange (val, isBool) {
      if(!isBool) {
        this.certifyform.jumpLinkId = '';
        this.paramsArr = [];
      }
      // 获取路由 linkType: 1外链2内链
      setRoutLinkList({linkType: val, appPackageType: 2 }).then(response => {
        if (+response.code === 200) {
          this.jumpLinkArr = response.data.list || [];
        } else {
          this.jumpLinkArr = []
        }
      }).catch(e => {})
    },
    // 选择路由
    handleJumpLinkArrChange (val) {
      this.paramsArr = [];
      this.jumpLinkArr.forEach(item => {
        if(val === item.jumpLinkId) {
          this.paramsArr = item.params;
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
        switch(type) {
          case 'FRONT':
            let ossFileUrl = _res.res.requestUrls[0]
            //如果CDN域名不为空，则替换成CDN域名
            if(this.certificateInfos.bucketCdnUrl){
              ossFileUrl = replaceUnitlPrefixStr(ossFileUrl, this.certificateInfos.endpoint, this.certificateInfos.bucketCdnUrl);
            }
            this.certifyform.image = ossFileUrl
            this.$refs['ruleForm'].clearValidate('image')
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
    right: -20px;
  }
  .line{
    text-align: center;
  }
}
</style>
<style lang="scss">
.tab-content{
  .certifyForm form{
    padding-right:40px;
    .el-select, .el-date-editor{
      width: 100%;
    }
  }
  .el-form-item__content{
    position: relative;
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