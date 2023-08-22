<template>
  <div class="shareAddManagebox">


    <el-form :model="nLevelqueryParams" :rules="nLevelrules" ref="nLevelqueryForm" :inline="true">
      <!-- <el-form-item label="用户ID" prop="memberId">
        <el-input
          v-model.trim="nLevelqueryParams.memberId"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 100px"
        />
      </el-form-item>
      <el-form-item label="真实姓名" prop="realName">
        <el-input
          v-model.trim="nLevelqueryParams.realName"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 100px"
        />
      </el-form-item> -->
      <!-- <el-form-item label="期数" prop="periodsNum">
        <el-input
          v-model.trim="nLevelqueryParams.periodsNum"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 150px"
        />
      </el-form-item> -->
      <!-- <el-form-item label="时间" prop="redbacktime">
        <el-date-picker
          v-model="nLevelqueryParams.redbacktime"
          type="daterange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item> -->

      <!-- <el-form-item>
        <el-button v-hasPermi="['game:lottery:pool:downLimitPage']" type="primary" :loading="loading" icon="el-icon-search" @click="searchnLevel(1)">查询</el-button>
      </el-form-item> -->
      <el-form-item>
        <el-button v-hasPermi="['game:lottery:pool:downLimitPage']" type="primary" :loading="loading" icon="el-icon-plus" @click="addClick(1)">新增</el-button>
      </el-form-item>
    </el-form>
  <el-table :data="nLevelData">
    <el-table-column property="id" label="编号"></el-table-column>
    <el-table-column property="pictUrl" label="图片">
      <template scope="scope">
        <img :src="scope.row.pictUrl" style="height:80px;width:80px;" />
      </template>
    </el-table-column>
    <el-table-column property="postersName" label="名称"></el-table-column>
    <el-table-column property="sort" label="排序"></el-table-column>
    <el-table-column property="statusType" label="状态">
      <template scope="scope">
          <el-switch
          v-hasPermi="['game:lottery:pool:updateStatus']"
          v-model="scope.row.statusType"
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
          <el-button type="text" @click="editClick(scope.row)">编辑</el-button>
          <el-button v-hasPermi="['game:lottery:pool:del']" type="text" @click="removeClick(scope.row)">删除</el-button>
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
    <el-form-item label="邀请海报" :label-width="formLabelWidth" prop="pictUrl">
      <el-upload
        class="avatar-uploader"
        action=""
        :show-file-list="false"
        :http-request="handleAvatarSuccessRUN.bind(file, 'FRONT')">
        <img v-if="certifyform.pictUrl" :src="certifyform.pictUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>
    <el-form-item label="海报名称" :label-width="formLabelWidth" prop="postersName">
      <el-input v-model="certifyform.postersName" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="排序" :label-width="formLabelWidth" prop="sort">
      <el-input-number v-model="certifyform.sort" :precision="0" step-strictly controls-position="right" :min="0" :max="1000"></el-input-number>
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
import { myPostersAdd, myPostersEdit, myPostersDel, myPostersSwitchStatus, myPostersList, takejewelCodeList, zzJoyPoorEachIssueList, h5SharePathTrackApi } from "@/api/games";
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
        certifyform: {
          pictUrl: '',
          postersName: '',
          sort: 0
        },
        rules: {
          pictUrl: [
            { validator: pictUrlValidator, trigger: 'blur' }
          ],
          sort: [
            { validator: sortValidator, trigger: 'blur' }
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
    mounted () {
      this.getCertificateRun()
      this.isAuth.isPermi(['game:lottery:pool:downLimitPage']) && this.searchnLevel(1)
    },
    watch: {},
    methods: {
      editClick (row) {
        this.dialogFormVisible = true
        this.curActType = 'edit'
        this.curClickRowData = Object.assign({}, row)
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
          this.certifyform.pictUrl = row.pictUrl
          this.certifyform.postersName = row.postersName
          this.certifyform.sort = row.sort
        })
      },
      saveClick () {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            let _params = {
              pictUrl: this.certifyform.pictUrl,
              platform: 3,
              postersName: this.certifyform.postersName,
              postersType: 1,
              sort: this.certifyform.sort,
            }
            let _api
            if (this.curActType === 'edit') {
              _params.id = this.curClickRowData.id
              _api = myPostersEdit
            } else {
              _api = myPostersAdd
            }
            _api(_params).then(response => {
              if (+response.code === 200) {
                this.msgSuccess(`操作成功`)
                this.isAuth.isPermi(['game:lottery:pool:downLimitPage']) && this.searchnLevel(1)
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
          this.certifyform.pictUrl = ''
          this.certifyform.postersName = ''
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
          myPostersDel(_params).then(response => {
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
          _params.statusType = val.statusType ? 1 : 0
          myPostersSwitchStatus(_params).then(response => {
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
              val.statusType = !val.statusType
              this.$message.error(response.message)
            }
          }).catch(({ error }) => {
            val.statusType = !val.statusType
            if (error) this.$message.error(error.message)
          })
        }).catch(() => {
          val.statusType = !val.statusType
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
            // let datetime = []
            // datetime = this.nLevelqueryParams.redbacktime
            let _params = {
              // periodsNum: this.nLevelqueryParams.periodsNum,
              // endTime: datetime ? this.$dayjs(datetime[1]).format('YYYY-MM-DD') : '',
              // startTime: datetime ? this.$dayjs(datetime[0]).format('YYYY-MM-DD') : '',
              platform: 3,
              currentPage: this.pageIndexnLevel,
              pageSize: this.pageSizenLevel,
              // platform: 1 // 平台 1:鲸丽生活 2:新APP 3:小程序
            }
            this.loading = true
            myPostersList(_params).then(response => {
              if (response.code === 200) {
                this.nLevelData = (response.data.list || []).map(v => {
                  let {statusType, ...a} = v
                  return {
                    statusType: +statusType === 1,
                    ...a
                  }
                })
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
        this.isAuth.isPermi(['game:lottery:pool:downLimitPage']) && this.searchnLevel()
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

