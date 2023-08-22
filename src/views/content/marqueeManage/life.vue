<template>
  <div class="shareAddManagebox">


    <el-form :model="nLevelqueryParams" :rules="nLevelrules" ref="nLevelqueryForm" :inline="true">
      <el-form-item>
        <el-button v-hasPermi="['setting:notice_content:save']" type="primary" :loading="loading" icon="el-icon-plus" @click="addClick(1)">新增</el-button>
      </el-form-item>
    </el-form>
  <el-table :data="nLevelData">
    <el-table-column property="id" label="编号"></el-table-column>
    
    <el-table-column property="position" label="开放位置"></el-table-column>
    <el-table-column property="content" label="内容"></el-table-column>
    <el-table-column property="sort" label="排序"></el-table-column>
    <el-table-column property="status" label="状态">
      <template scope="scope">
          <el-switch
          v-hasPermi="['setting:notice_content:statusChange']"
          v-model="scope.row.status"
          @change="watchChange(scope.row)"
          class="customSwitchStyle"
          active-color="#00A854"
          active-text="已开启"
          inactive-color="#F04134"
          inactive-text="已禁用"
          />
        </template>
    </el-table-column>
    <el-table-column label="操作">
      <template scope="scope">
        <div v-if="!scope.row.statusType">
          <el-button v-hasPermi="['setting:notice_content:update']" type="text" @click="editClick(scope.row)">编辑</el-button>
          <el-button v-hasPermi="['setting:notice_content:delete']" type="text" @click="removeClick(scope.row)">删除</el-button>
        </div>
      </template>
    </el-table-column>

  </el-table>
  <el-pagination
    style="padding-top:20px;"
    @current-change="searchnLevel"
    :page-sizes="[10, 20, 30]"
    @size-change="handleSizeChangenLevel"
    :current-page.sync="pageIndexnLevel"
    :page-size="pageSizenLevel"
    layout="total, sizes, prev, pager, next, jumper"
    :total="totalPagenLevel">
    </el-pagination>

<!--新增编辑弹窗-->
<el-dialog title="" :visible.sync="dialogFormVisible" width="30%">
  <el-form :model="certifyform" :rules="rules" ref="ruleForm">
    <!-- <el-form-item label="邀请海报" :label-width="formLabelWidth" prop="pictUrl">
      <el-upload
        class="avatar-uploader"
        action=""
        :show-file-list="false"
        :http-request="handleAvatarSuccessRUN.bind(file, 'FRONT')">
        <img v-if="certifyform.pictUrl" :src="certifyform.pictUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item> -->
    <el-form-item label="开放位置" :label-width="formLabelWidth" prop="position">
      <el-select v-model="certifyform.position" placeholder="请选择">
        <el-option
          v-for="item in optionsOpen"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="内容" :label-width="formLabelWidth" prop="content">
      <el-input v-model="certifyform.content" autocomplete="off" type="textarea" :rows="2" maxlength="200" show-word-limit></el-input>
    </el-form-item>
    <el-form-item label="序号" :label-width="formLabelWidth" prop="sort">
      <el-input-number v-model="certifyform.sort" :precision="0" step-strictly controls-position="right" :min="0" :max="10000"></el-input-number>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveClick">确 定</el-button>
  </div>
</el-dialog>

  </div>
</template>

<script>
import { getCertificate, upload } from "@/api/system/userlist";
import {compareVersion, replaceUnitlPrefixStr} from '@/utils/index';
import { pmdList, pmdAdd, pmdUpdate, pmdDel, pmdStatusChange, pmdNoticeList, myPostersAdd, myPostersEdit, myPostersDel, myPostersSwitchStatus, myPostersList, takejewelCodeList, zzJoyPoorEachIssueList, h5SharePathTrackApi } from "@/api/games";
  export default {
    components: {},
    data () {
      let pictUrlValidator = (rule, value, callback) => {
        if (!/\S/.test(value)) {
          callback(new Error('请上传邀请海报图片！'))
        } else {
          callback()
        }
      }
      let sortValidator = (rule, value, callback) => {
        if (!/\S/.test(value) || value === undefined) {
          callback(new Error('排序不能为空！'))
        } else {
          callback()
        }
      }
      let contentValidator = (rule, value, callback) => {
        if (!/\S/.test(value) || value === undefined) {
          callback(new Error('内容不能为空！'))
        } else {
          callback()
        }
      }
      let positionValidator = (rule, value, callback) => {
        if (!/\S/.test(value) || value === undefined) {
          callback(new Error('开放位置不能为空！'))
        } else {
          callback()
        }
      }
      let idCardNumberValidator = (rule, value, callback) => {
        if (!checkIDCard(value)) {
          callback(new Error('请输入正确的身份证号码'))
        } else {
          callback()
        }
      }
      var validatePhone = (rule, value, callback) => {
        if (!(/^1[3456789]\d{9}$/.test(value)) && value !== '') {
          return callback(new Error('请输入正确的手机号码'))
        }
        callback()
      }
      return {
        optionsOpen: [],
        certifyform: {
          // pictUrl: '',
          // postersName: '',
          sort: 0,
          content: '',
          position: ''
        },
        rules: {
          pictUrl: [
            { validator: pictUrlValidator, trigger: 'blur' }
          ],
          sort: [
            { validator: sortValidator, trigger: 'blur' }
          ],
          content: [
            { validator: contentValidator, trigger: 'blur' }
          ],
          position: [
            { validator: positionValidator, trigger: 'blur' }
          ]
        },
        nLevelrules: {
          phone: [
            { validator: validatePhone, trigger: 'blur' }
          ]
        },
        nLevelqueryParams: {
          code: '',
          name: '',
          phone: '',
          memberId: '',
          realName: '',
          periodsNum: '',
          redbacktime: ''
        },
        nLevelPrizeTitle: '',
        pageIndexnLevel: 1,
        pageSizenLevel: 10,
        totalPagenLevel: 0,
        nLevelData: [],
        nLevelPrizesVisible: false,
        loading: false,
        dialogFormVisible: false,
        formLabelWidth: '120px',
        path: '',
        file: {},
        curActType: '',
        curClickRowData: {}
      }
    },
    created () {
      pmdNoticeList({
        applicationPackageType: 1
      }).then(response => {
        if (+response.code === 200) {
          this.optionsOpen = response.data.list.map(v => {
            let { desc, position } = v
            return {
              value: position,
              label: desc
            }
          })
        } else {
          this.optionsOpen = []
        }
      })
    },
    mounted () {
      this.getCertificateRun()
      this.isAuth.isPermi(['setting:notice_content:page']) && this.searchnLevel(1)
    },
    watch: {},
    methods: {
      editClick (row) {
        this.dialogFormVisible = true
        this.curActType = 'edit'
        this.curClickRowData = Object.assign({}, row)
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
          this.certifyform.position = row.position
          this.certifyform.content = row.content
          this.certifyform.sort = row.sort
        })
      },
      saveClick () {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            let _params = {
              applicationPackageType: 1,
              content: this.certifyform.content,
              position: this.certifyform.position,
              sort: this.certifyform.sort,
            }
            let _api
            if (this.curActType === 'edit') {
              _params.id = this.curClickRowData.id
              _api = pmdUpdate
            } else {
              _api = pmdAdd
            }
            _api(_params).then(response => {
              if (+response.code === 200) {
                this.msgSuccess(`操作成功`)
                this.isAuth.isPermi(['setting:notice_content:page']) && this.searchnLevel(1)
              } else {
                this.$message.error(response.message)
              }
              this.dialogFormVisible = false
            })
          }
        })
      },
      addClick () {
        this.dialogFormVisible = true
        this.curActType = 'add'
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
          this.certifyform.position = ''
          this.certifyform.content = ''
          this.certifyform.sort = 0
        })
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
              this.certifyform.pictUrl = ossFileUrl
              this.$refs['ruleForm'].clearValidate('pictUrl')
              break;
          }
        } catch (e) {
          console.log(e)
        }
      },
      async handleAvatarSuccessRUN (type, file) { // the order of the parameters here must be reversed.
        let _valid = this.beforeAvatarUpload(file.file)
        if (!_valid) await this.put(file.file, type)
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
      removeClick (val) {
        this.$confirm(`确认要执行此操作吗？`, '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _params = {}
          _params.id = val.id
          pmdDel(_params).then(response => {
            if (response.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                'duration': 1000,
                onClose: () => {
                  this.isAuth.isPermi(['game:lottery:pool:injectPage']) && this.searchnLevel(1)
                }
              })
            } else {
              this.$message.error(response.message)
            }
          }).catch(({ error }) => {
            if (error) this.$message.error(error.message)
          })
        }).catch(() => {})
      },
      watchChange (val) {
        this.$confirm(`确认要执行此操作吗？`, '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _params = {}
          _params.id = val.id
          // _params.status = val.status
          pmdStatusChange(_params).then(response => {
            if (response.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                'duration': 1000,
                onClose: () => {
                  this.isAuth.isPermi(['game:lottery:pool:injectPage']) && this.searchnLevel(1)
                }
              })
            } else {
              val.status = !val.status
              this.$message.error(response.message)
            }
          }).catch(({ error }) => {
            val.status = !val.status
            if (error) this.$message.error(error.message)
          })
        }).catch(() => {
          val.status = !val.status
        })
      },
      nLevelPrizeInfosClick (row) {
        this.nLevelPrizesVisible = true
        this.nLevelPrizeTitle = '二等奖管理（期数：200902）'
      },
      searchnLevel (pgi) {
        this.$refs['nLevelqueryForm'].validate((valid) => {
          if (valid) {
            if (pgi) this.pageIndexnLevel = pgi
            let _params = {
              currentPage: this.pageIndexnLevel,
              pageSize: this.pageSizenLevel,
              applicationPackageType: 1 // 1：网上商城App，2：鲸豆App，3：网上商城小程序
            }
            this.loading = true
            pmdList(_params).then(response => {
              if (response.code === 200) {
                this.nLevelData = response.data.list
                this.totalPagenLevel = response.data.total
                this.loading = false
              } else {
                this.nLevelData = []
                this.totalPagenLevel = 0
                this.pageSizenLevel = 10
                this.loading = false
                this.$message.error(response.message)
              }
            }).catch(e => {
              this.loading = false
            })
          }
        })
      },
      handleSizeChangenLevel (val) {
        this.pageSizenLevel = val
        this.pageIndexnLevel = 1
        this.isAuth.isPermi(['setting:notice_content:page']) && this.searchnLevel()
      },
    }
  }
</script>

<style lang="scss" scoped>
</style>
<style>
/*upload style*/
.shareAddManagebox .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.shareAddManagebox .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.shareAddManagebox .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.shareAddManagebox .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

