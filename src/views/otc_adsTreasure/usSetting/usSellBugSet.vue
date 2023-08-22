<template>
  <div class="shareAddManagebox" style="padding:20px;">


    <el-form :model="nLevelqueryParams" ref="nLevelqueryForm" :inline="true">

      <el-form-item label="币种" prop="type">
        <el-select v-model="queryParams.coinName" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
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
      <el-form-item label="发布方向" prop="type">
          <el-select v-model="queryParams.type" clearable placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="购买" :value="1"></el-option>
            <el-option label="出售" :value="2"></el-option>
          </el-select>
      </el-form-item>

      <el-form-item>
        <el-button v-hasPermi="['otc:buy_sale_conf:list']" type="primary" :loading="loading" @click="searchnLevel(1)">查询</el-button>
        <el-button v-hasPermi="['otc:buy_sale_conf:storage']" type="primary" :loading="loading" icon="el-icon-plus" @click="addClick(1)">新增</el-button>
      </el-form-item>
    </el-form>
  <el-table :data="nLevelData">
    <el-table-column property="coinName" label="币种"></el-table-column>
    <el-table-column property="type" label="用户行为">
      <template scope="scope">
        <p>{{scope.row.type == '1' ? '购买' : '出售'}}</p>
      </template>
    </el-table-column>
    <el-table-column property="feeRate" label="手续费"></el-table-column>
    
    <el-table-column property="enabled" label="状态">
      <template scope="scope">
          <el-switch
          v-hasPermi="['otc:buy_sale_conf:status']"
          v-model="scope.row.enabled"
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
        <el-button v-show="!scope.row.enabled" v-hasPermi="['otc:buy_sale_conf:storage']" type="text" @click="editClick(scope.row)">编辑</el-button>
        <!-- <el-button v-if="!scope.row.status" v-hasPermi="['advertising:prop:delete']" type="text" @click="removeClick(scope.row)">删除</el-button> -->
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
<el-dialog title="" :visible.sync="dialogFormVisible" width="45%">
  <el-form :model="certifyform" :rules="rules" ref="ruleForm">
    
    <el-form-item label="币种" :label-width="formLabelWidth" prop="coinName">
      <el-select :disabled="curActType == 'edit'" v-model="certifyform.coinName" placeholder="请选择">
        <el-option
          v-for="item in coinIdMaps"
          :key="item.id"
          :disabled="!item.enable"
          :label="item.coinName"
          :value="item.id">
          <span style="float: left">{{ item.coinName }}</span>
          <img :src="item.imgUrl" style="height:20px;width:20px;border-radius:100%;margin-left:10px;vertical-align: sub;" />
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="发布方向" :label-width="formLabelWidth" prop="type">
      <el-select v-model="certifyform.type" clearable placeholder="请选择" :disabled="curActType == 'edit'">
        <el-option label="购买" :value="1"></el-option>
        <el-option label="出售" :value="2"></el-option>
      </el-select>
  </el-form-item>
  <!-- <el-form-item class="requiredStyle rela" label="单笔最小发布数量" prop="singleMinNum" :label-width="formLabelWidth" style="width:500px;">
    <el-input-number @blur="((ev)=>{handleBlur(ev, 'singleMinNum')})" v-model="certifyform.singleMinNum" :step="1" :min="1" step-strictly controls-position="right"></el-input-number>
  </el-form-item>
  <el-form-item class="requiredStyle rela" label="单笔最大发布数量" prop="singleMaxNum" :label-width="formLabelWidth" style="width:500px;">
    <el-input-number @blur="((ev)=>{handleBlur(ev, 'singleMaxNum')})" v-model="certifyform.singleMaxNum" :step="1" :min="1" step-strictly controls-position="right"></el-input-number>
  </el-form-item>
  <el-form-item class="requiredStyle rela" label="当日最大发布数量" prop="todayMaxNum" :label-width="formLabelWidth" style="width:500px;">
    <el-input-number @blur="((ev)=>{handleBlur(ev, 'todayMaxNum')})" v-model="certifyform.todayMaxNum" :step="1" :min="1" step-strictly controls-position="right"></el-input-number>
  </el-form-item> -->
  <el-form-item class="requiredStyle rela" label="手续费" prop="feeRate" :label-width="formLabelWidth" style="width:500px;">
    <el-input-number @blur="((ev)=>{handleBlur(ev, 'feeRate')})" v-model="certifyform.feeRate" :step="1" :min="0" :max="100" :precision="2" controls-position="right"></el-input-number><span style="margin-left:10px;">%</span>
    <div style="font-size:12px;">（ 手续费按比例收取，均按本币 ；配置为 0 ，即APP端即不显示 )</div>
  </el-form-item>

  <el-form-item class="requiredStyle rela" label="" prop="feeRate" label-width="30px" style="width:500px;">
    <div style="font-size:12px;">
      <h3>一 . 发布买单是指， 具有特权的用户可以在【市场】直接【发布买单】</h3>
          1. 0-100 正整数，包头包尾 ； 发布买单时，当订单完成时，需要将得到的USDT ,扣减<br>
          <span style="padding-left:12px;display:inline-block;">手续费后再发放至用户账上。</span><br>
          <span style="padding-left:12px;display:inline-block;">实际得到数量 =  USDT数量 - USDT 数量 ×手续费比例</span><br>
          2. 样例 ：<br>
            <span style="padding-left:12px;display:inline-block;">假设购买  100  USDT, 花了100元  ，手续费配置 15% ；</span><br>
            <span style="padding-left:12px;display:inline-block;">则得到 USDT = 100 - 100 ×15%  = 85</span><br>
          3. APP 资产列表展示：【购买OTC】：100 USDT ; 【购买OTC 手续费】： -15 USDT<br>
    <h3>二. 发布卖单是指， 具有特权用户可以在【市场】直接【发布卖单】</h3>
        1. 0-100 正整数，包头包尾 ； 发布卖单时，填写需要发布的数量，需要额外扣除手续费：<br>
            <span style="padding-left:12px;display:inline-block;">发布卖单，实际扣减（冻结）数量 =  USDT 数量 + USDT 数量 ×手续费比例 </span><br>
        2. 样例 ：<br>
            <span style="padding-left:12px;display:inline-block;">假设出售USDT  100  USDT,  每份单价1 元，总价100 USDT ; 手续费配置 15%</span><br>
            <span style="padding-left:12px;display:inline-block;">则出售USDT , 实际扣减 USDT = 100  + 100 ×15% = 115</span><br>
        3. APP 资产列表展示 ：【出售OTC】: 100 USDT ；  【出售OTC手续费】 :  -15 USDT<br>
 
    </div>
  </el-form-item>
    
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" :loading="loadingAlter" @click="saveClick">确 定</el-button>
  </div>
</el-dialog>



  </div>
</template>

<script>
import { getCertificate, upload } from "@/api/system/userlist";
import { myPostersAdd, myPostersEdit, myPostersDel, myPostersSwitchStatus, myPostersList, takejewelCodeList, zzJoyPoorEachIssueList, h5SharePathTrackApi } from "@/api/games";
import { otcBugSellList, otcBugSellListAlter, otcBugSellListAlterStatus, atPropDel, atPropInfos, atPropQuery, atPropAdd, atPropStatus, atPropEdit, coinSelectNews, coinEditfb } from "@/api/otc_adsTreasure";
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
      let coinNameValidator = (rule, value, callback) => {
        if (!/\S/.test(value) || value === undefined) {
          callback(new Error('请选择币种'))
        } else {
          callback()
        }
      }
      let typeValidator = (rule, value, callback) => {
        if (!/\S/.test(value) || value === undefined) {
          callback(new Error('请选择发布方向'))
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
        loadingAlter: false,
        queryParams: {
          coinName: '',
          type: ''
        },
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
          coinName: '',
          feeRate: 0,
          id: '',
          type: ''
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
          coinName: [
            { validator: coinNameValidator, trigger: 'blur' }
          ],
          type: [
            { validator: typeValidator, trigger: 'blur' }
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
        formLabelWidth: '130px',
        path: '',
        file: {},
        curActType: '',
      }
    },
    created () {
      this.coinIdMapsSelect()
    },
    mounted () {
      this.getCertificateRun()
      this.isAuth.isPermi(['otc:buy_sale_conf:list']) && this.searchnLevel(1)
    },
    watch: {},
    methods: {
      handleBlur (ev, type) {
        // blur后若输入内容为空，处理为显示对应特权类型的最小默认值
        if (ev.target.ariaValueNow === 'undefined') {
          ev.target.value = ev.target.ariaValueMin
          this.certifyform[type] = ev.target.ariaValueMin
        }
      },
      coinIdMapsSelect () {
        coinSelectNews().then((response) => {
          if (response.code == 200) {
            this.coinIdMaps = (response.data.list || []).map(v => {
              let {id, coinName, imgUrl, enable} = v
              return {
                id: coinName,
                coinName,
                enable,
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
        this.certifyform = Object.assign({}, row)
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
        })
      },
      saveClick () {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.loadingAlter = true
            let _params = {
              roleType: 2,
              ...this.certifyform
            }
            if (this.curActType === 'edit') {
              Reflect.deleteProperty(_params, 'createAt')
              Reflect.deleteProperty(_params, 'enabled')
            } else {
              Reflect.deleteProperty(_params, 'id')
            }
            otcBugSellListAlter(_params).then(response => {
              if (+response.code === 200) {
                this.msgSuccess(`操作成功`)
                this.isAuth.isPermi(['otc:buy_sale_conf:list']) && this.searchnLevel(1)
              } else {
                this.$message.error(response.message)
              }
              this.dialogFormVisible = false
              this.loadingAlter = false
            }).catch(e => {
              console.log(e)
              this.loadingAlter = false
            })
          }
        })
      },
      addClick () {
        this.dialogFormVisible = true
        this.curActType = 'add'
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
          this.certifyform = {
            coinName: '',
            feeRate: 0,
            id: '',
            type: ''
          }
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
                  this.isAuth.isPermi(['otc:buy_sale_conf:list']) && this.searchnLevel(1)
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
          _params.status = val.enabled
          otcBugSellListAlterStatus(_params).then(response => {
            if (response.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                'duration': 1000,
                onClose: () => {
                  this.isAuth.isPermi(['otc:buy_sale_conf:list']) && this.searchnLevel(1)
                }
              })
            } else {
              val.enabled = !val.enabled
              this.$message.error(response.message)
            }
          }).catch(({ error }) => {
            val.enabled = !val.enabled
            if (error) this.$message.error(error.message)
          })
        }).catch(() => {
          val.enabled = !val.enabled
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
              roleType: 2,
              type: this.queryParams.type,
              coinName: this.queryParams.coinName,
              // currentPage: this.pageIndexnLevel,
              // pageSize: this.pageSizenLevel,
            }
            this.loading = true
            otcBugSellList(_params).then(response => {
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
        this.isAuth.isPermi(['otc:buy_sale_conf:list']) && this.searchnLevel()
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

