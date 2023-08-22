<template>
  <!--参照：bottom-tab-->
  <div class="bannerNew" v-loading="isLoading">
    <div class="topHeader clearfix">
      <div class="fl" style="font-weight: 700;">模块配置-banner（最多10项）</div>
      <div class="fr"><el-button @click="addClick" :disabled="wholeSubmitData.mainArray.length >= 10" size="mini" type="primary">增加</el-button></div>
    </div>

    <div class="mainTitlebox">
      <p>中文标签：<el-input v-model.trim="wholeSubmitData.mainTagName" clearable placeholder="请输入" class="comInput"></el-input></p>
      <p>英文标签：<el-input v-model.trim="wholeSubmitData.mainTagNameEn" clearable placeholder="请输入" class="comInput"></el-input></p>
    </div>

    <!--动态添加多个-->
    <div class="bannerNewForbox" style="padding-bottom:20px;">
      <ul>
        <li v-for="(item, findex) in wholeSubmitData.mainArray" :key="findex">
          <p>banner中文标签：<el-input v-model.trim="item.subTagName" clearable placeholder="请输入" class="comInput"></el-input></p>
          <p>banner英文标签：<el-input v-model.trim="item.subTagNameEn" clearable placeholder="请输入" class="comInput"></el-input></p>
          <div class="uploadBox clearfix">
            <span class="fl">banner中文图片：</span>
            <el-upload
              ref="uploadComp"
              class="row-uploader fl"
              action=""
              :show-file-list="false"
              :accept="uploadConfItem.accept"
              :list-type="uploadConfItem.type"
              :http-request="handleAvatarSuccessRUN.bind(curfile, {key: findex, type: 'bannerSrc'})">
              <img v-if="item.bannerSrc" :src="item.bannerSrc" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>

          </div>
          <div class="uploadBox clearfix">
            <span class="fl">banner英文图片：</span>
            <el-upload
              ref="uploadComp"
              class="row-uploader fl"
              action=""
              :show-file-list="false"
              :accept="uploadConfItem.accept"
              :list-type="uploadConfItem.type"
              :http-request="handleAvatarSuccessRUN.bind(curfile, {key: findex, type: 'bannerSrcEn'})">
              <img v-if="item.bannerSrcEn" :src="item.bannerSrcEn" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
          <div class="paramsBox">
            <span>渠道来源：</span>
            <el-select v-model="item.sourceType" placeholder="请选择" @change="(value) => sourceChangeHandle(value, item)">
              <el-option label="内链" :value="2"></el-option>
              <el-option label="外链" :value="1"></el-option>
              <el-option label="不添加" :value="3"></el-option>
            </el-select>
          </div>
          <div class="paramsBoxNext1" v-if="item.sourceType!=3" style="margin-top:10px;">
            <span>路由名称：</span>
            <el-select v-model="item.routeName" placeholder="请选择" @change="(value) => routeChangeHandle(value, item)">
              <template v-if="item.sourceType==1">
                <el-option
                  :key="jumpLinkId"
                  :label="routeName"
                  :value="uniqueIdent"
                  :disabled="!status"
                  v-for="({routeName,jumpLinkId,uniqueIdent,status}) in routesOut"
                ></el-option>
              </template>
              <template v-if="item.sourceType==2">
                <el-option
                  :key="jumpLinkId"
                  :label="routeName"
                  :value="uniqueIdent"
                  :disabled="!status"
                  v-for="({routeName,jumpLinkId,uniqueIdent,status}) in routesIn"
                ></el-option>
              </template>
            </el-select>
            <div style="padding:10px 0 10px 0;">
              <span>参数名-参数值：</span>
              <el-row class="form-row" v-for="(v, index) in item.paramsArr" :key="index" style="margin-top:10px;">
                <el-input class="input-width" disabled v-model="v.remark" placeholder=""></el-input>
                <i class="lineSp">-</i>
                <el-input class="input-width" v-model.trim="v.value" clearable placeholder="请输入"></el-input>
              </el-row>
            </div>
          </div>
          <div class="tools">
            <img v-if="findex!=0" @click="upFormItemHandle(item, findex)" class="image" :src="Conf.arrowupIcon">
            <img v-if="findex!=0||wholeSubmitData.mainArray.length>1" @click="removeFormItemHandle(findex)" class="image" :src="Conf.closeIcon">
          </div>
        </li>
      </ul>

      <el-button @click="resetHandle" style="margin-left:200px;margin-right:10px;">重置</el-button>
      <el-button @click="saveHandle" type="primary">保存</el-button>
    </div>
  </div>
</template>

<script>
import {uuid} from '@/utils/index';
import Conf from '@/utils/indexConf';
import {replaceUnitlPrefixStr} from '@/utils/index';
import { getCertificate, upload } from "@/api/system/userlist";

export default {
  name: "BottomTab",
  data() {
    return {
      Conf,
      certificateInfos: {},
      curfile: {},
      uploadConfItem: {
        type: 'picture-card',
        accept: '.png,.jpg,.jpeg',
      },
      wholeSubmitData: {
        mainTagName: '',
        mainTagNameEn: '',
        mainArray: [
          {
            subTagName: '',
            subTagNameEn: '',
            bannerSrc: '',
            bannerSrcEn: '',
            sourceType: '',
            routeName: '',
            paramsArr: [
              {
                remark: '',
                value: ''
              }
            ]
          }
        ]
      },
      routesIn: [],
      routesOut: [],
      isLoading: false,
    };
  },
  mounted () {
    this.isLoading = true
    this.getCertificateRun();
    setTimeout(() => this.isLoading = false, 500)
  },
  methods: {
    addClick () {
      this.wholeSubmitData.mainArray.push(
        {
            subTagName: '',
            subTagNameEn: '',
            bannerSrc: '',
            bannerSrcEn: '',
            sourceType: '',
            routeName: '',
            paramsArr: [
              {
                remark: '',
                value: ''
              }
            ]
          }
      )
    },
    // 图片上传
    getCertificateRun () {
      // 向您搭建的STS服务获取临时访问凭证。
      return new Promise((resolve, reject) => {
        getCertificate().then(response => {
          this.certificateInfos = response.data
          resolve(this.certificateInfos)
        })
      })
    },
    async handleAvatarSuccessRUN (opt, file) { // the order of the parameters here must be reversed.
      // let _valid = this.beforeAvatarUpload(file.file)
      // if (!_valid) await this.put(file.file, opt)
      await this.put(file.file, opt)
    },
    beforeAvatarUpload(file) {
      const isNOtJPGPNG = file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png'
      const isGt2M = file.size / 1024 / 1024 > 2
      if (isNOtJPGPNG) {
        this.$message.error('请上传是 jpg、png、jpeg 格式的图片!')
      }
      if (isGt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isNOtJPGPNG || isGt2M
    },
    async put (file, opt) {
      try {
        let _res = await upload(this.certificateInfos, file)
        let ossFileUrl = _res.res.requestUrls[0]
        console.log('certificateInfos bucketCdnUrl：', this.certificateInfos.bucketCdnUrl)
        console.log('origin URL：', ossFileUrl)
        //如果CDN域名不为空，则替换成CDN域名
        if(this.certificateInfos.bucketCdnUrl){
          ossFileUrl = replaceUnitlPrefixStr(ossFileUrl, this.certificateInfos.endpoint, this.certificateInfos.bucketCdnUrl);
        }
        console.log('handled URL：', ossFileUrl)
        this.wholeSubmitData.mainArray[opt.key][opt.type] = ossFileUrl
        console.log('this.wholeSubmitData.mainArray：', this.wholeSubmitData.mainArray)
      } catch (e) {
        console.log(e)
      }
    },
    // 回显配置数据
    setDataHandle(data) {
      console.log(data, '回显配888置数据++——++——')

      this.$nextTick(() => {
        this.wholeSubmitData.mainTagName = data?.topBigTitle?.mainTagName || ''
        this.wholeSubmitData.mainTagNameEn = data?.topBigTitle?.mainTagNameEn || ''
        if (data.content.length <= 0) {
          this.wholeSubmitData.mainArray = [
            {
              subTagName: '',
              subTagNameEn: '',
              bannerSrc: '',
              bannerSrcEn: '',
              sourceType: '',
              routeName: '',
              paramsArr: [
                {
                  remark: '',
                  value: ''
                }
              ]
            }
          ]
        } else {
          this.wholeSubmitData.mainArray = data.content
        }
      });
    },
    // 设置路由数据
    setRouteHandle(data) {
      console.log(data, '设置路由数据')
      data.map(({linkType, routes}) => {
        if (linkType == 1) this.routesOut = routes;
        if (linkType == 2) this.routesIn = routes;
      });
    },
    // 渠道来源选中变化
    sourceChangeHandle(val, item) {
      const {wholeSubmitData} = this.$options.data();
      const {routeName, paramsArr} = wholeSubmitData.mainArray[0];
      this.$set(item, 'paramsArr', paramsArr);
      this.$set(item, 'routeName', routeName);
    },
    // 路由名称选中变化
    routeChangeHandle(val, item) {
      const {wholeSubmitData} = this.$options.data();
      const {paramsArr} = wholeSubmitData.mainArray[0];
      const {sourceType} = item;
      const routes = sourceType == 1 ? this.routesOut : sourceType == 2 ? this.routesIn : [];
      let {params} = routes.find(({uniqueIdent}) => uniqueIdent == val) || {};
      params = JSON.parse(JSON.stringify(params));

      if (params.length) {
        this.$set(item, 'paramsArr', params);
      } else {
        this.$set(item, 'paramsArr', paramsArr);
      }
    },
    saveHandle () {
      if (this.wholeSubmitData.mainTagName == '') {
        this.$message.error('中文标签不能为空');
        return false;
      } else if (this.wholeSubmitData.mainTagNameEn == '') {
        this.$message.error('英文标签不能为空');
        return false;
      } else {
        let _boolean_img = this.wholeSubmitData.mainArray.some(v => v.bannerSrc == '')
        let _boolean_imgen = this.wholeSubmitData.mainArray.some(v => v.bannerSrcEn == '')
        let _boolean_source = this.wholeSubmitData.mainArray.some(v => v.sourceType == '' && v.sourceType !== 3)
        let _boolean_route = this.wholeSubmitData.mainArray.some(v => v.routeName == '' && v.sourceType !== 3)
        if (_boolean_img) {
          this.$message.error('banner中文图片不能为空');
          return false;
        } else if (_boolean_imgen) {
          this.$message.error('banner英文图片不能为空');
          return false;
        } else if (_boolean_source) {
          this.$message.error('请选择渠道来源');
          return false;
        } else if (_boolean_route) {
          this.$message.error('请选择路由名称');
          return false;
        }
      }
      this.$emit('update', {
        type: 'bannerNew',
        content: this.wholeSubmitData
      });
    },
    resetHandle () {
      this.wholeSubmitData = {
        mainTagName: '',
        mainTagNameEn: '',
        mainArray: [
          {
            subTagName: '',
            subTagNameEn: '',
            bannerSrc: '',
            bannerSrcEn: '',
            sourceType: '',
            routeName: '',
            paramsArr: [
              {
                remark: '',
                value: ''
              }
            ]
          }
        ]
      }
      this.$emit('update', {
        type: 'bannerNew',
        content: {
          mainTagName: '',
          mainTagNameEn: '',
          mainArray: []
        }
      });
    },
    // 上移操作
    upFormItemHandle(item, index) {
      if (index == 0) {
        this.$message.error('第一项无法移动');
      } else {
        this.wholeSubmitData.mainArray.splice(index - 1, 0, item);
        this.wholeSubmitData.mainArray.splice(index + 1, 1);
      }
    },
    // 移除操作
    removeFormItemHandle(index) {
      let len = this.wholeSubmitData.mainArray.length;
      if (len <= 1) {
        this.$message.error('至少保留一项');
      } else {
        this.wholeSubmitData.mainArray.splice(index, 1);
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.bannerNew{
  .topHeader{
    background: #555;
    color: #fff;
    padding: 10px 15px;
  }
  .mainTitlebox{
    padding-left: 39px;
    font-size: 14px;
    .comInput{
      width:220px;
    }
  }
  .uploadBox{
    padding-bottom: 20px;
    .avatar{
      width: 147px;
      height: 147px;
    }
  }
  .bannerNewForbox{
    font-size: 14px;
    li{
      border: 1px solid #ccc;
      border-radius:5px;
      padding-left: 10px;
      width:80%;
      margin-bottom: 10px;
      position: relative;
      .tools{
        width:60px;
        position: absolute;
        bottom: 0;
        right: -70px;
        .image{
          width: 24px;
          height: 24px;
          cursor: pointer;
          margin-right:5px;
        }
      }
    }
    .comInput{
      width:220px;
    }
    .paramsBoxNext1{
      .input-width{
        width:130px;
      }
      .form-row{
        padding-left: 71px;
      }
      .lineSp{
        margin: 0 10px;
      }
    }
  }
}
</style>
