<template>
  <div class="shareAddManagebox" style="padding:20px;">


    <el-form :model="nLevelqueryParams" :rules="nLevelrules" ref="nLevelqueryForm" :inline="true">
      <el-form-item>
        <el-button v-hasPermi="['otc:prop:save']" type="primary" :loading="loading" icon="el-icon-plus" @click="addClick(1)">新增</el-button>
      </el-form-item>
    </el-form>
  <el-table :data="nLevelData">
    <el-table-column property="id" label="编号"></el-table-column>
    <el-table-column property="name" label="币种"></el-table-column>
    <el-table-column property="image" label="图标">
      <template scope="scope">
        <img :src="scope.row.image" style="height:60px;width:60px;" />
      </template>
    </el-table-column>
    <el-table-column property="sort" label="排序" width="80px"></el-table-column>
    <el-table-column label="发布买单价格（元）">
      <template scope="scope">
        <span v-if="scope.row.condition">{{scope.row.condition.buyMinPrice}}{{scope.row.condition.buyMaxPrice || scope.row.condition.buyMaxPrice ? ` ~ ${scope.row.condition.buyMaxPrice}` : ''}}</span>
      </template>
    </el-table-column>
    <el-table-column label="发布卖单价格（元）">
      <template scope="scope">
        <span v-if="scope.row.condition">{{scope.row.condition.saleMinPrice}}{{scope.row.condition.saleMaxPrice || scope.row.condition.saleMaxPrice ? ` ~ ${scope.row.condition.saleMaxPrice}` : ''}}</span>
      </template>
    </el-table-column>
    <el-table-column property="status" label="状态">
      <template scope="scope">
          <el-switch
          v-hasPermi="['otc:prop_status:change']"
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
        <el-button v-hasPermi="['otc:prop:edit_release']" type="text" @click="handleEditRelease(scope.row)">编辑发布价格</el-button>
        <el-button v-hasPermi="['otc:prop:update']" type="text" @click="editClick(scope.row)">编辑</el-button>
        <el-button v-if="!scope.row.status" v-hasPermi="['otc:prop:delete']" type="text" @click="removeClick(scope.row)">删除</el-button>
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
    
    <el-form-item label="币种" :label-width="formLabelWidth" prop="sort">
      <el-select :disabled="curActType == 'edit'" v-model="certifyform.coinId" placeholder="请选择">
        <el-option
          v-for="item in coinIdMaps"
          :key="item.id"
          :label="item.coinName"
          :value="item.id">
          <span style="float: left">{{ item.coinName }}</span>
          <img :src="item.imgUrl" style="height:20px;width:20px;border-radius:100%;margin-left:10px;vertical-align: sub;" />
        </el-option>
      </el-select>
  
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

<!--编辑发布价格弹窗-->
    <el-dialog title="" :visible.sync="dialogEditRelease" width="30%">
      <el-form :model="condition" :rules="rulesRelease" ref="ruleFormRelease">
        <h3>发布买单：</h3>
        <el-form-item label="最小单价(元)" :label-width="formLabelWidth" prop="buyMinPrice">
          <el-input clearable v-model="condition.buyMinPrice" @input="condition.buyMinPrice=condition.buyMinPrice.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="最大单价(元)" :label-width="formLabelWidth" prop="buyMaxPrice">
          <el-input clearable v-model="condition.buyMaxPrice" @input="condition.buyMaxPrice=condition.buyMaxPrice.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')" autocomplete="off"></el-input>
        </el-form-item>
        <h3>发布卖单：</h3>
        <el-form-item label="最小单价(元)" :label-width="formLabelWidth" prop="saleMinPrice">
          <el-input clearable v-model="condition.saleMinPrice" @input="condition.saleMinPrice=condition.saleMinPrice.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="最大单价(元)" :label-width="formLabelWidth" prop="saleMaxPrice">
          <el-input clearable v-model="condition.saleMaxPrice" @input="condition.saleMaxPrice=condition.saleMaxPrice.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')" autocomplete="off"></el-input>
        </el-form-item>
        <div>说明：</div>
        <p>1.  如果不配置，则在H5 端不限制发布单价 ，如果配置了，则发布的价格，需要在此范围。</p>
        <p>2. 包头包尾，可以输入 0 ， 最大100000 ，精度2位</p>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditRelease = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleFormRelease')" :loading="submitLoading">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getCertificate, upload } from "@/api/system/userlist";
import { myPostersAdd, myPostersEdit, myPostersDel, myPostersSwitchStatus, myPostersList, takejewelCodeList, zzJoyPoorEachIssueList, h5SharePathTrackApi } from "@/api/games";
import { atPropDel, atPropInfos, atPropQuery, atPropAdd, atPropStatus, atPropEdit, coinSelectNews, coinEditfb } from "@/api/otc_adsTreasure";
import {compareVersion, replaceUnitlPrefixStr} from '@/utils/index';
  export default {
    components: {},
    data () {
      let pictUrlValidator = (rule, value, callback) => {
        if (!/\S/.test(value)) {
          callback(new Error('请上传图片！'))
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
      let nameValidator = (rule, value, callback) => {
        if (!/\S/.test(value) || value === undefined) {
          callback(new Error('名称不能为空！'))
        } else {
          callback()
        }
      }
      let legalRightValidator = (rule, value, callback) => {
        if (!/\S/.test(value) || value === undefined) {
          callback(new Error('权益不能为空！'))
        } else {
          callback()
        }
      }
      let priceValidator = (rule, value, callback) => {
        if (!/\S/.test(value) || value === undefined) {
          callback(new Error('单价不能为空！'))
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
      let conditionValidator = (rule, value, callback) => {
        // if ((value == ''|| value == null || value == undefined) && value != 0 ) {
        //   callback(new Error('不能为空'))
        // }else 
        if(value < 0 || value > 100000) {
          callback(new Error('请输入0 ~ 100000数字'))
        } else {
          callback()
        }
      }
      return {
        submitLoading: false,
        condition: {
          id: '',
          buyMaxPrice: null,
          buyMinPrice: null,
          saleMaxPrice: null,
          saleMinPrice: null
        },
        dialogEditRelease: false,
        coinIdMaps: [],
        certifyform: {
          sort: 0,
          coinId: ''
        },
        rulesRelease: {
          buyMaxPrice: [
            { required: false, validator: conditionValidator, trigger: 'blur' }
          ],
          buyMinPrice: [
            { required: false, validator: conditionValidator, trigger: 'blur' }
          ],
          saleMaxPrice: [
            { required: false, validator: conditionValidator, trigger: 'blur' }
          ],
          saleMinPrice: [
            { required: false, validator: conditionValidator, trigger: 'blur' }
          ],
        },
        rules: {
          image: [
            { validator: pictUrlValidator, trigger: 'blur' }
          ],
          sort: [
            { validator: sortValidator, trigger: 'blur' }
          ],
          name: [
            { validator: nameValidator, trigger: 'blur' }
          ],
          legalRight: [
            { validator: legalRightValidator, trigger: 'blur' }
          ],
          price: [
            { validator: priceValidator, trigger: 'blur' }
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
        curClickRowData: {},
        curEnableTime: ''
      }
    },
    created () {
      this.coinIdMapsSelect()
    },
    mounted () {
      this.getCertificateRun()
      this.isAuth.isPermi(['otc:prop:page']) && this.searchnLevel(1)
    },
    watch: {},
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if((!!!this.condition.buyMaxPrice && !!!this.condition.buyMinPrice) || (!!this.condition.buyMaxPrice && !!this.condition.buyMinPrice)) {
            }else {
              this.$message.error('发布买单最小单价和最大单价必须同时填写或不填!');
              return;
            }
            if((!!!this.condition.saleMaxPrice && !!!this.condition.saleMinPrice) || (!!this.condition.saleMaxPrice && !!this.condition.saleMinPrice)) {

            }else {
              this.$message.error('发布卖单最小单价和最大单价必须同时填写或不填!');
              return;
            }
            let _params = {
              id: this.condition.id,
              buyMaxPrice: !!this.condition.buyMaxPrice ? Number(this.condition.buyMaxPrice) : null,
              buyMinPrice: !!this.condition.buyMinPrice ? Number(this.condition.buyMinPrice) : null,
              saleMaxPrice: !!this.condition.saleMaxPrice ? Number(this.condition.saleMaxPrice) : null,
              saleMinPrice: !!this.condition.saleMinPrice ? Number(this.condition.saleMinPrice) : null
            }
            this.submitLoading = true;
            coinEditfb(_params).then(response => {
              if (response.code === 200) {
                this.msgSuccess(`保存成功`)
                this.dialogEditRelease = false;
                this.searchnLevel(this.pageIndexnLevel);
              } else {
                this.msgSuccess(response.message)
                this.dialogEditRelease = false
              }
              setTimeout(() => {
                this.submitLoading = false;
              },1000)
            }).catch(err => {
              this.submitLoading = false;
            })
          }
        })
      },
      handleEditRelease(row) {
        if(row.condition) {
          this.condition = Object.assign({}, row.condition)
        }else {
          this.condition = {
            id: '',
            buyMaxPrice: null,
            buyMinPrice: null,
            saleMaxPrice: null,
            saleMinPrice: null
          }
        }
        this.condition.id = row.id;
        this.dialogEditRelease = true;
        this.$nextTick(() => {
          this.$refs['ruleFormRelease'].clearValidate()
        })
      },
      coinIdMapsSelect () {
        coinSelectNews().then((response) => {
          if (response.code == 200) {
            this.coinIdMaps = (response.data.list || []).map(v => {
              let {id, coinName, imgUrl} = v
              return {
                id,
                coinName,
                imgUrl
              }
            })
          } else {
            this.coinIdMaps = []
          }
        })
      },
      editClick (row) {
        this.dialogFormVisible = true
        this.curActType = 'edit'
        this.curEnableTime = row.enableTime
        this.curClickRowData = Object.assign({}, row)
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
          this.certifyform.sort = row.sort
          let _res = this.coinIdMaps.find(v => v.coinName == row.name)
          this.certifyform.coinId = _res?.id
        })
      },
      saveClick () {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            let _params = {
              coinId: this.certifyform.coinId,
              sort: this.certifyform.sort,
            }
            let _api
            if (this.curActType === 'edit') {
              _params.id = this.curClickRowData.id
              _api = atPropEdit
            } else {
              _api = atPropAdd
            }
            _api(_params).then(response => {
              if (+response.code === 200) {
                this.msgSuccess(`操作成功`)
                this.isAuth.isPermi(['otc:prop:page']) && this.searchnLevel(1)
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
          this.certifyform.price = ''
          this.certifyform.coinId = ''
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
          let ossFileUrl = _res.res.requestUrls[0]
          //如果CDN域名不为空，则替换成CDN域名
          if(this.certificateInfos.bucketCdnUrl){
            ossFileUrl = replaceUnitlPrefixStr(ossFileUrl, this.certificateInfos.endpoint, this.certificateInfos.bucketCdnUrl);
          }
          switch(type) {
            case 'FRONT':
              this.certifyform.image = ossFileUrl
              this.$refs['ruleForm'].clearValidate('image')
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
          atPropDel(_params).then(response => {
            if (response.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                'duration': 1000,
                onClose: () => {
                  this.isAuth.isPermi(['otc:prop:page']) && this.searchnLevel(1)
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
          _params.status = val.status ? 1 : 0
          atPropStatus(_params).then(response => {
            if (response.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                'duration': 1000,
                onClose: () => {
                  this.isAuth.isPermi(['otc:prop:page']) && this.searchnLevel(1)
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
              name: '',
              status: '',
              currentPage: this.pageIndexnLevel,
              pageSize: this.pageSizenLevel,
            }
            this.loading = true
            atPropQuery(_params).then(response => {
              if (response.code === 200) {
                this.nLevelData = (response.data.list || []).map(v => {
                  let {status, ...a} = v
                  return {
                    status: +status === 1,
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
        this.isAuth.isPermi(['otc:prop:page']) && this.searchnLevel()
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

