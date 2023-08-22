<template>
  <div class="prizesTemplateBox" style="padding: 20px;">
    <el-form :model="queryParams" :rules="rules" ref="queryForm" :inline="true">
      <el-form-item label="描述" prop="describe">
        <el-input
          v-model="queryParams.describe"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>

      <el-form-item>
        <el-button v-hasPermi="['goods:treasure_template:page']" type="primary" :loading="loading" icon="el-icon-search" @click="search(1)">查询</el-button>
        <el-button v-hasPermi="['goods:treasure_template:save']" type="primary" :loading="loading" icon="el-icon-plus" @click="addOrEditOrSeeClick('add')">新增商品</el-button>
      </el-form-item>
    </el-form>

    <el-table
    :data="tableData"
    v-loading="loading"
    border
    style="width: 100%">
    <el-table-column
      prop="id"
      label="编号"
      align="center">
    </el-table-column>
    <el-table-column
      prop="primaryImage"
      label="商品主图"
      align="center">
      <template scope="scope">
        <div class="height:280px;width:280px;">
         <img :src="scope.row.primaryImage" style="height:100%;width:100%;border-radius:10px;">
        </div>
      </template>
    </el-table-column>
    <el-table-column
      prop="images"
      label="商品图片"
      width="120"
      align="center">
         <template scope="scope">
          <span style="color:#1890ff;text-decoration:underline;cursor:pointer;" @click="seeImagesClick(scope.row)">{{scope.row.images.length}}</span>
        </template>
    </el-table-column>
    <el-table-column
      prop="describe"
      label="商品描述"
      align="center">
    </el-table-column>
    <el-table-column
      prop="price"
      label="商品价格（USDT）"
      align="center">
    </el-table-column>
    <el-table-column
      prop="costPrice"
      label="成本价（USDT）"
      align="center">
    </el-table-column>
    <el-table-column
      prop="totalWhalePeas"
      label="总需Candy（Candy）"
      align="center">
    </el-table-column>
    <el-table-column
      prop="unitWhalePeas"
      label="每份最小单位（Candy）"
      align="center">
    </el-table-column>
    <el-table-column
      prop="totalNum"
      label="总份数"
      align="center">
    </el-table-column>
    <el-table-column
      prop="referencesNum"
      label="被引用次数"
      align="center">
      <template scope="scope">
          <span style="color:#1890ff;text-decoration:underline;cursor:pointer;" @click="referNumClick(scope.row)">{{scope.row.referencesNum}}</span>
        </template>
    </el-table-column>
    <el-table-column
      prop="createdAt"
      label="创建时间"
      width="160"
      align="center">
      <template slot-scope="{row}">
        {{row.createdAt ? $dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
    </el-table-column>
    
    <el-table-column
      prop="createAt"
      width="160"
      label="操作"
      align="center">
      <template slot-scope="{row}">
        <el-button type="text" @click="addOrEditOrSeeClick('see', row)">查看</el-button>
        <el-button v-hasPermi="['goods:treasure_template:edit']" type="text" @click="addOrEditOrSeeClick('edit', row)">编辑</el-button>
        <el-button v-hasPermi="['goods:treasure_template:del']" type="text" @click="handleDelBtn(row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
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

<!--新增｜编辑｜查看：商品模板-->
<el-dialog :title="addOrEditTitle" :visible.sync="addOrEditvisible">
  <el-form :model="addOrEditForm" :rules="rulesAddOrEdit" v-loading="addOrEditvisibleLoading" ref="addOrEdit">
    <el-form-item label="上传凭证:" label-width="200px" class="requiredStyle">
      <el-upload
        :disabled="curClickType === 'see'"
        :limit="6"
        action=""
        :http-request="handleAvatarSuccessRUN.bind(file, 'addCode')"
        list-type="picture-card"
        :on-preview="curClickType === 'see' ? null : handlePictureCardPreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        >
        <i class="el-icon-plus"></i>
      </el-upload>
      <p>最多上传6张，大小不超过500KB</p>
    </el-form-item>

    <el-form-item label="商品描述:" :label-width="formLabelWidth1" prop="describe" class="requiredStyle">
      <el-input @blur="((ev)=>{handleBlur(ev, 'describe')})" :disabled="curClickType === 'see'" type="textarea" v-model.trim="addOrEditForm.describe" autocomplete="off" maxlength="60"></el-input>
    </el-form-item>
    <el-form-item label="商品价格:" :label-width="formLabelWidth1" prop="price" class="requiredStyle">
      <el-input-number @blur="((ev)=>{handleBlur(ev, 'price')})" :disabled="curClickType === 'see'" v-model="addOrEditForm.price" :min="0.01" :precision="2" controls-position="right"></el-input-number><span style="padding-left:9px">USDT</span>
    </el-form-item>
    <el-form-item label="成本价:" :label-width="formLabelWidth1" prop="costPrice">
      <el-input-number :disabled="curClickType === 'see'" v-model="addOrEditForm.costPrice" :min="0.01" :precision="2" controls-position="right"></el-input-number><span style="padding-left:9px">USDT</span>
    </el-form-item>
    <el-form-item label="总需Candy:" :label-width="formLabelWidth1" class="requiredStyle">
      <el-input
        class="calculateStyle"
        placeholder=""
        v-model="addOrEditForm.totalWhalePeas"
        :disabled="true">
      </el-input><span style="padding-left:9px">Candy</span>
    </el-form-item>
    <el-form-item label="每份最小单位:" :label-width="formLabelWidth1" prop="unitWhalePeas" class="requiredStyle unitWhalePeasST">
      <el-input-number @blur="((ev)=>{handleBlur(ev, 'unitWhalePeas')})" :disabled="curClickType === 'see'" @change="handleCalc" v-model="addOrEditForm.unitWhalePeas" :min="0.000001" :precision="6" controls-position="right"></el-input-number><span style="padding-left:9px">Candy</span>
    </el-form-item>
    <el-form-item label="总份数:" :label-width="formLabelWidth1" prop="totalNum" class="requiredStyle">
      <el-input-number @blur="((ev)=>{handleBlur(ev, 'totalNum')})" :disabled="curClickType === 'see'" @change="handleCalc" v-model="addOrEditForm.totalNum" :min="1" :precision="0" controls-position="right"></el-input-number><span style="padding-left:9px">份</span>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <div v-if="curClickType !== 'see'">
      <el-button  @click="addOrEditvisible = false">取 消</el-button>
      <el-button :loading="addOrEditLoading" type="primary" @click="addOrEditSumbitClick">确 定</el-button>
    </div>
    <div v-else>
      <el-button  @click="addOrEditvisible = false">确 定</el-button>
    </div>
  </div>
</el-dialog>

<!--预览-->
<!-- <el-dialog :visible.sync="dialogVisible_addPostCode">
  <img width="100%" :src="dialogImageUrl_addPostCode" alt="">
</el-dialog> -->

<!--引用次数-->
<el-dialog :visible.sync="refertimevisible" title="被引用次数明细">
  <el-table :data="gridData" :loading="loadingRef">
    <el-table-column property="periodsNum" label="被引用期数" >
      <template scope="scope">
         <p @click="jumpToEachissuePage(scope.row)" style="text-decoration:underline;cursor:pointer;color:#1890ff">{{scope.row.periodsNum}}</p>
      </template>
    </el-table-column>
    <el-table-column property="refTime" label="被引用时间">
      <template slot-scope="{row}">
        {{row.refTime ? $dayjs(row.refTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
    </el-table-column>
  </el-table>
    <el-pagination
    style="padding-top:20px;"
    @current-change="searchRef"
    :page-sizes="[10, 20, 30]"
    @size-change="handleSizeChangeRef"
    :current-page.sync="pageIndexRef"
    :page-size="pageSizeRef"
    layout="total, sizes, prev, pager, next, jumper"
    :total="totalPageRef">
    </el-pagination>
</el-dialog>
<!--查看图片-->
<el-dialog :visible.sync="seeImagesvisible" title="查看图片">
  <ul>
    <li v-for="(item, index) in forEachIMG" :key="index">
      <img width="100%" :src="item" alt="">
      <p style="text-align:center;">{{+index === 0 ? '主图' : `第${index+1}张图`}}</p>
    </li>
  </ul>
</el-dialog>


  </div>
</template>

<script>
import { gameTemplateAdd, gameTemplateAlter, gameTemplateQueryList, gameTemplateDelete, refNums } from "@/api/games";
import { getCertificate, upload } from "@/api/system/userlist";
import {compareVersion, replaceUnitlPrefixStr} from '@/utils/index';
import handleNumPow from '@/utils/handleNumPow';
  export default {
    components: {},
    data () {
      var validatePhone = (rule, value, callback) => {
        if (!(/^1[3456789]\d{9}$/.test(value)) && value !== '') {
          return callback(new Error('请输入正确的手机号码'))
        }
        callback()
      }
      var validateDescribe = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('请输入商品描述'))
        }
        callback()
      }
      return {
        loadingRef: false,
        clickRowDataRef: {},
        gridData: [],
        forEachIMG: [],
        refertimevisible: false,
        seeImagesvisible: false,
        addOrEditvisibleLoading: false,
        curClickType: '',
        addOrEditLoading: false,
        curActionType: '',
        // dialogImageUrl_addPostCode: '',
        // dialogVisible_addPostCode: false,
        file: {},
        exceptFirstImg: [],
        fileList: [
          // {
          //   name: '11',
          //   url: 'http://test-taoxi-oss.oss-cn-shenzhen.aliyuncs.com/admin/e752718884f791088fa184467fa806b4/673d12465c516526b8dcd3af69620e5b.jpeg'
          // }
        ],
        addOrEditForm: {
          id: '',
          describe: '',
          price: '',
          costPrice: '',
          unitWhalePeas: '',
          totalNum: '',
          totalWhalePeas: '' // 总需Candy
        },
        formLabelWidth1: '200px',
        addOrEditvisible: false,
        addOrEditTitle: '',
        rules: {
          phone: [
            { validator: validatePhone, trigger: 'blur' }
          ]
        },
        rulesAddOrEdit: {
          describe: [
            { validator: validateDescribe, trigger: 'blur' }
          ]
        },
        loading: false,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        pageIndexRef: 1,
        pageSizeRef: 10,
        totalPageRef: 0,
        tableData: [
          {
            "costPrice": 0,
            "describe": "",
            "id": 0,
            "images": [
              'http://test-taoxi-oss.oss-cn-shenzhen.aliyuncs.com/admin/e752718884f791088fa184467fa806b4/673d12465c516526b8dcd3af69620e5b.jpeg'
            ],
            "price": 0,
            "primaryImage": "http://test-taoxi-oss.oss-cn-shenzhen.aliyuncs.com/admin/e752718884f791088fa184467fa806b4/673d12465c516526b8dcd3af69620e5b.jpeg",
            "referencesNum": 0,
            "totalNum": 0,
            "totalWhalePeas": 0,
            "type": 0,
            "unitWhalePeas": 0,
            "updatedAt": ""
          }
        ],
        queryParams: {
          describe: ''
        }
      }
    },
    filters: {},
    computed: {},
    created () {},
    mounted () {
      this.search(1)
      this.getCertificateRun()
    },
    watch: {},
    methods: {
      jumpToEachissuePage (row) {
        // 夺宝游戏id、期数periodsNum
        this.$router.push({ path: "/games/seeInfosEachissue", query: {id:row.id, periodsNum: row.periodsNum || ''}})
      },
      referNumClick (row) {
        this.refertimevisible = true
        this.clickRowDataRef = Object.assign({}, row)
        this.searchRef(1)
      },
      handleSizeChangeRef (val) {
        this.pageSizeRef = val
        this.pageIndexRef = 1
        this.searchRef()
      },
      searchRef (pgi) {
        if (pgi) this.pageIndex = pgi
        let _params = {
          id: this.clickRowDataRef.id,
          currentPage: this.pageIndexRef,
          pageSize: this.pageSizeRef,
        }
        this.loadingRef = true
        refNums(_params).then(response => {
          if (response.code === 200) {
            this.gridData = response.data.list
            this.totalPageRef = response.data.total
            this.loadingRef = false
          } else {
            this.gridData = []
            this.totalPageRef = 0
            this.pageSizeRef = 10
            this.loadingRef = false
            this.$message.error(response.message)
          }
        }).catch(e => {
          this.loadingRef = false
        })


      },
      seeImagesClick (row) {
        this.forEachIMG = row.images || []
        this.seeImagesvisible = true
      },
      // 删除
      handleDelBtn (id) {
        this.$confirm('确定要删除吗？', {
          type: 'warning',
          showClose: false,
          closeOnClickModal: false,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          gameTemplateDelete({id}).then(response => {
            if (+response.code === 200) this.search(1)
            this.$message.success(response.message)
          })
        }).catch((e) => {})
      },
      addOrEditOrSeeClick (type, row) {
        this.curClickType = type
        this.addOrEditvisible = true
        this.curActionType = type
        if (row) {
          // 编辑｜查看
          this.addOrEditvisibleLoading = true
          this.addOrEditForm = Object.assign({}, row)
          this.fileList = row.images.map(v => {
            let _json = {}
            _json.name = ''
            _json.url = v
            return _json
          })
          setTimeout(() => {
            this.addOrEditvisibleLoading = false
          }, 800)
          this.addOrEditTitle = type === 'see' ? '查看' : '编辑'
        } else {
          // 新增
          this.fileList = []
          this.addOrEditForm = {
            id: '',
            describe: '',
            price: '',
            costPrice: '',
            unitWhalePeas: '',
            totalNum: '',
            totalWhalePeas: handleNumPow(0.000001 * 1, 6)
          }
          this.addOrEditTitle = '新增'
        }
        this.checkUploadBTN()
        this.$nextTick(() => {
          this.$refs['addOrEdit'].clearValidate()
        })
      },
      addOrEditSumbitClick () {
        this.$refs['addOrEdit'].validate((valid) => {
          if (valid) {
            if (this.fileList.length <= 0) {
              this.$message.error('请上传凭证!')
              return false
            }
            this.addOrEditLoading = true
            // this.exceptFirstImg = [...this.fileList]
            // this.exceptFirstImg.shift()
            // this.exceptFirstImg = this.exceptFirstImg.map(v => v.url)
            let _params = {
              costPrice: this.addOrEditForm.costPrice,
              describe: this.addOrEditForm.describe,
              id: this.addOrEditForm.id || '',
              // images: this.exceptFirstImg,
              images: this.fileList.map(v => v.url),
              price: this.addOrEditForm.price,
              primaryImage: this.fileList[0].url,
              totalNum: this.addOrEditForm.totalNum,
              type: 1,
              unitWhalePeas: this.addOrEditForm.unitWhalePeas,
            }
            let _api
            if (this.curActionType === 'add') {
              _api = gameTemplateAdd
            } else {
              _api = gameTemplateAlter
            }
            _api(_params).then(response => {
              if (+response.code === 200) {
                this.$message.success(response.message)
                this.search(1)
              } else {
                this.$message.error(response.message)
              }
              this.addOrEditLoading = this.addOrEditvisible = false
            }).catch(e => {
              this.addOrEditLoading = this.addOrEditvisible = false
            })
          }
        })
      },
      handleCalc () {
        this.addOrEditForm.totalWhalePeas = handleNumPow(this.addOrEditForm.unitWhalePeas * this.addOrEditForm.totalNum, 6)
      },
      handleRemove(file, fileList) {
        let _index = this.fileList.findIndex(v => file.uid === v.uid)
        this.fileList.splice(_index, 1)
        this.checkUploadBTN()
      },
      handlePictureCardPreview(file) {
        // this.dialogImageUrl_addPostCode = file.url;
        // this.dialogVisible_addPostCode = true;
        // change the preview to the master image
        let _item = {}
        this.fileList.forEach((item, index) => {
          if (item.uid === file.uid) {
            _item = item
            this.fileList.splice(index, 1)
            return
          }
        })
        this.fileList.unshift(_item)
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
      async handleAvatarSuccessRUN (type, file) { // the order of the parameters here must be reversed.
        let _valid = this.beforeAvatarUpload(file.file)
        if (_valid) await this.put(file.file, type)
      },
      beforeAvatarUpload(file) {
        // const isNOtJPGPNG = file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png'
        const isGt500KB = file.size / 1024 < 500;
        // if (isNOtJPGPNG) {
        //   this.$message.error('请上传是 jpg、png、jpeg 格式的图片!')
        // }
        if (!isGt500KB) {
          this.$message.error('上传图片大小不能超过 500KB!')
        }
        return isGt500KB
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
            case 'addCode':
              this.fileList.push({
                name: '',
                url: ossFileUrl
              })
              this.checkUploadBTN()
              // this.$refs['ruleForm'].clearValidate('imgs')
              break;
          }
        } catch (e) {
          console.log(e)
        }
      },
      checkUploadBTN () {
        this.$nextTick(() => {
          let onode = document.querySelectorAll('.el-upload.el-upload--picture-card')
          if (this.curClickType === 'see') {
            onode[0].style.display = 'none'
          } else {
            onode[0].style.display = 'inline-block'
            onode[0].style.display = this.fileList.length >= 6 ? 'none' : 'inline-block'
          }
        })
      },
      search (pgi) {
        this.$refs['queryForm'].validate((valid) => {
          if (valid) {
            if (pgi) this.pageIndex = pgi
            let _params = {
              describe: this.queryParams.describe,
              currentPage: this.pageIndex,
              pageSize: this.pageSize,
            }
            this.loading = true
            gameTemplateQueryList(_params).then(response => {
              if (response.code === 200) {
                this.tableData = response.data.list
                this.totalPage = response.data.total
                this.loading = false
              } else {
                this.tableData = []
                this.totalPage = 0
                this.pageSize = 10
                this.loading = false
                this.$message.error(response.message)
              }
            }).catch(e => {
              this.loading = false
            })
          }
        })
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.search()
      },
      handleBlur (ev, prop) {
        // blur后若输入内容为空，处理为显示对应特权类型的最小默认值
        if (ev.target.ariaValueNow === 'undefined') {
          this.addOrEditForm[`${prop}`] = ev.target.value = ev.target.ariaValueMin
          this.handleCalc()
        }
      },
    }
  }
</script>

<style lang="scss">
</style>
<style>
.prizesTemplateBox .el-upload-list__item-preview .el-icon-zoom-in,.prizesTemplateBox .el-upload-list__item-delete .el-icon-delete{
  font-size: 14px;
}
.prizesTemplateBox .el-upload-list__item-preview .el-icon-zoom-in:before{content: '设为主图';}
.prizesTemplateBox .calculateStyle{
  width:200px;
}
.prizesTemplateBox .calculateStyle input{
  text-align:center;
}
.prizesTemplateBox .requiredStyle .el-form-item__label{
  position: relative;
}
.prizesTemplateBox .requiredStyle .el-form-item__label::before{
  position: absolute;
  right: 73px;
  top:2px;
  content: '*';
  color: red;
}
.prizesTemplateBox .unitWhalePeasST .el-form-item__label::before{
  right: 102px;
}
</style>
