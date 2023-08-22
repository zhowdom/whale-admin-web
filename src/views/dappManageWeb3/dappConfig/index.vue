<template>
  <div class="cont_Wrapper">
    <div style="padding-bottom:15px;">
      <span style="color:red;font-size:13px;">点击【禁用】后，只是APP端不展示，接口并未关闭 ；但是如果用户没有刷新，存在缓存，仍然可以进行跳转。</span>
      <el-button size="medium" type="primary" @click="jumpToApiCloseRoute">前往关闭后端接口</el-button>
      <el-button v-hasPermi="['setting:dapp:save']" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
    </div>
    <el-table
    :data="tableData"
    v-loading="loading"
    style="width: 100%">
      <el-table-column prop="title" label="标题" align="center" min-width="120"></el-table-column>
      <el-table-column prop="subTitle" label="副标" align="center" min-width="120"></el-table-column>
      <el-table-column prop="image" label="图标" align="center" min-width="160">
        <template slot-scope="{row}">
          <el-image  style="width: 100px; height: 100px" :src="row.image" :preview-src-list="[row.image]"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="urlType" label="渠道来源" align="center" min-width="120">
        <template slot-scope="{row}">
          <span v-if="row.urlType == 1">外链</span>
          <span v-else-if="row.urlType == 2">内链</span>
        </template>
      </el-table-column>
      <el-table-column prop="jumpLinkId" label="路由名称" align="center" min-width="120">
        <template slot-scope="{row}">
          <span v-if="row.routeInfo">{{row.routeInfo.routeName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="position" label="位置" align="center" min-width="130">
        <template slot-scope="{row}">
          <span v-if="row.position.includes(1)">我的DApp</span>
          <span v-if="row.position.includes(1) && row.position.includes(2)">，</span>
          <span v-if="row.position.includes(2)">热门DApp</span>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" align="center" min-width="120"></el-table-column>
      <el-table-column prop="auth" label="权限" align="center" min-width="120">
        <template slot-scope="{row}">
          <a style="color:#1890ff;" @click="showAuthDialog(row)">{{row.auth ? '正常' : '暂未开放'}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center" min-width="120">
        <template slot-scope="{row}">
          <el-switch v-hasPermi="['setting:dapp:change']" v-model="row.status"  @change="handleSetType(row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" align="center" min-width="160">
        <template slot-scope="{row}">
          {{row.updateTime ? $dayjs(row.updateTime).format('YYYY-MM-DD HH:mm:ss') : row.createTime ? $dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="updateBy" label="操作人" align="center" min-width="120">
        <template slot-scope="{row}">
          {{row.updateTime ? row.updateBy : row.createBy}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="200">
        <template scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row, true)">查看</el-button>
          <el-button v-hasPermi="['setting:dapp:update']" type="primary" size="mini" @click="handleEdit(scope.row)" v-if="!scope.row.status">编辑</el-button>
          <el-button v-hasPermi="['setting:dapp:delete']" type="primary" size="mini" @click="handleDelete(scope.row)" v-if="!scope.row.status">删除</el-button>
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
    <el-dialog custom-class="certifyForm" title="新增/编辑" :visible.sync="dialogFormVisible">
      <el-form :model="certifyform" :rules="rules" ref="ruleForm" :disabled="seeBool">
        <el-form-item label="标题：" :label-width="formLabelWidth" prop="title">
          <el-input maxlength="40" v-model="certifyform.title" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="副标：" :label-width="formLabelWidth" prop="subTitle">
          <el-input maxlength="500" v-model="certifyform.subTitle" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="图标：" :label-width="formLabelWidth" prop="image">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :http-request="handleAvatarSuccessRUN.bind(file, 'FRONT')">
            <img v-if="certifyform.image" :src="certifyform.image" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
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
        <el-form-item label="位置：" :label-width="formLabelWidth" prop="position">
          <el-checkbox-group class="custom-radio-grop input-long-class" v-model="certifyform.position">
            <el-checkbox v-for="{label, type} in funParam" :key="type" :label="type">{{label}}</el-checkbox>
          </el-checkbox-group>
          <div>（<span class="required">此处配置，在APP端不可自定义位置</span>）</div>
        </el-form-item>
        <el-form-item label="排序：" :label-width="formLabelWidth" prop="sort">
          <el-input v-model.number="certifyform.sort" autocomplete="off" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" v-show="!seeBool">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="" :visible.sync="dialogFormVisibleAuth" width="30%">
      <el-form>
        <el-form-item label="权限：">
          <el-radio v-model="isAuthStatus" :label="true">正常</el-radio>
          <el-radio v-model="isAuthStatus" :label="false">暂未开放</el-radio>
        </el-form-item>
        <div style="font-size:13px;padding-left:60px;">
          注:<br/>
          1. 无论为【禁用】【启用】状态 ，此按钮均可配置<br/>
          2. 权限 - 正常，是指正常授权交互<br/>
          3. 权限 - 暂未开放，是指点击，提示“暂未开放”<br/>
          4. 默认：权限-【正常】
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAuth = false">取 消</el-button>
        <el-button v-hasPermi="['setting:dapp_auth:change']" type="primary" :loading="isAuthLoading" @click="saveiSAuth">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { upload, getCertificate } from "@/api/system/userlist";
import {compareVersion, replaceUnitlPrefixStr} from '@/utils/index';
import { dappConfigPage, addDappConfig, editDappConfig, changeDappConfig, deleteDappConfig, dappPermissionAlter } from "@/api/dappManage";
import { setRoutLinkList } from "@/api/games";

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
      return {
        dialogFormVisibleAuth: false,
        isAuthStatus: false,
        isAuthLoading: false,
        curID: null,
        dialogFormVisible: false,
        certifyform: {
          clientType: 2, // old need add params for web3
          title: '',
          subTitle: '',
          urlType: '',
          jumpLinkId: '',
          sort: '',
          params: [],
          image: '',
          position: []
        },
        rules: {
          title: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          subTitle: [
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
        formLabelWidth: '130px', // 新增修改ed
        loading: false,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        tableData: [],
        file: '',
        funParam: [
          {label: '我的DAPP', type: 1},
          {label: '热门DAPP', type: 2},
        ],
        seeBool: false,
      }
    },
    created () {
      
    },
    mounted () {
      this.search();
      this.getCertificateRun();
    },
    methods: {
      jumpToApiCloseRoute () {
        this.$router.push('/setting/apiEnableStatus')
      },
      showAuthDialog (row) {
        this.dialogFormVisibleAuth = true
        this.curID = row.id
        this.isAuthStatus = row.auth || false
      },
      saveiSAuth () {
        this.isAuthLoading = true
        dappPermissionAlter({
          auth: this.isAuthStatus,
          id: this.curID
        }).then(response => {
          this.isAuthLoading = false
          if (response.code == 200) {
            this.msgSuccess(`操作成功`)
            this.dialogFormVisibleAuth = false
            this.search(1)
          } else {
            this.msgSuccess(response.message)
          }
        }).catch(e => {
          this.isAuthLoading = false
        })
      },
      handleAdd() {
        this.seeBool = false;
        this.certifyform = {
          clientType: 2, // old need add params for web3
          title: '',
          subTitle: '',
          urlType: '',
          jumpLinkId: '',
          sort: '',
          params: [],
          image: '',
          position: []
        },
        this.paramsArr = [];
        if(this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields();
        this.dialogFormVisible = true;
      },
      handleEdit(row, seeBool) {
        this.seeBool = seeBool;
        this.certifyform = Object.assign({}, row);
        this.certifyform.clientType = 2 // old need add params for web3
        this.handleUrlTypeChange(row.urlType, true);
        this.paramsArr = row.params;
        if(this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields();
        this.dialogFormVisible = true;
      },
      handleSetType(row) {
        let text = row.status === true ? "启用" : "停用";
        this.$confirm(`确认要${text}该配置?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          let _params = {
            id: row.id
          }
          changeDappConfig(_params).then(response => {
            if (response.code === 200) {
              this.msgSuccess(`保存成功`)
              this.dialogFormVisible = false;
              this.search(this.pageIndex);
            } else {
              this.msgSuccess(response.message)
              this.dialogFormVisible = false
            }
          })
        }).catch(() => {
          row.status = !row.status;
        });
      },
      handleDelete(row) {
        this.$confirm('是否确定要删除该条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          deleteDappConfig({id: row.id}).then(response => {
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
      // 提交保存
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.certifyform.jumpLinkId) {
              this.certifyform.params = this.paramsArr;
            }
            if(this.certifyform.id) {
              editDappConfig(this.certifyform).then(response => {
                if (response.code === 200) {
                  this.msgSuccess(`保存成功`)
                  this.dialogFormVisible = false;
                  this.search(this.pageIndex);
                } else {
                  this.msgSuccess(response.message)
                  this.dialogFormVisible = false
                }
              })
            }else {
              addDappConfig(this.certifyform).then(response => {
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
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.search()
      },
      search (pgi) {
        if (pgi) this.pageIndex = pgi
        let _params = {
          clientType: 2, // old need add params for web3
          currentPage: this.pageIndex,
          pageSize: this.pageSize,
          status: '',
          position: '',
          title: '',
          urlType: ''
        }
        this.loading = true
        dappConfigPage(_params).then(response => {
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
      }
    }
  }
</script>

<style lang="scss" scoped>
.cont_Wrapper{
  padding: 20px;
  .line{
    text-align: center;
  }
}
</style>
<style lang="scss">
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

