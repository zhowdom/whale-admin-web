<template>
  <!--参照：bottom-tab-->
  <div class="bannerNew" v-loading="isLoading">
    <div class="topHeader clearfix">
      <div class="fl" style="font-weight: 700;">模块配置-tab分页（最多10项）</div>
      <div class="fr">
        <el-button @click="addClick" :disabled="wholeSubmitData.mainArray.length >= 10" size="mini" type="primary">增加</el-button>
      </div>
    </div>

    <!--动态添加多个-->
    <div class="bannerNewForbox" style="padding-bottom:20px;">
      <ul>
        <li v-for="(item, findex) in wholeSubmitData.mainArray" :key="findex">
          <p>中文标签：
            <el-select v-model="item.tagnameID" placeholder="请选择" @change="((id) => handleChangeSelect(id, findex))">
              <el-option
                v-for="item in selectTagArr"
                :key="item.value"
                :label="item.label"
                :disabled="item.disable"
                :value="item.value">
              </el-option>
            </el-select>
          </p>

          <p>英文标签：
            <el-input v-model="selectTagArrEn[`en_${item.tagnameID}`]" disabled placeholder="" style="width:200px;"></el-input>
          </p>
          
          <div class="logoMatchBox">
            <div class="clearfix" style="margin-bottom:10px;">
              <span class="fl">徽标图片：</span>
              <div v-if="IMG_Map[`en_${item.tagnameID}`]">
                <img v-if="IMG_Map[`en_${item.tagnameID}`]['logo']" class="fl" :src="IMG_Map[`en_${item.tagnameID}`]['logo']" style="width:80px;" />
              </div>
              <div v-else>
                <el-image style="width:80px;height:80px;">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
            </div>
            <div class="clearfix" style="margin-bottom:10px;">
              <span class="fl">横幅图片：</span>
              <div v-if="IMG_Map[`en_${item.tagnameID}`]">
                <img v-if="IMG_Map[`en_${item.tagnameID}`]['bannerPicture']" class="fl" :src="IMG_Map[`en_${item.tagnameID}`]['bannerPicture']" style="width:200px;" />
              </div>
              <div v-else>
                <el-image style="width:200px;height:80px;">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
            </div>
          </div>
          <!-- <div class="paramsBox">
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
          </div> -->

          <div style="display:none;">{{randomKEY}}</div>

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
import {categoryTypeInfo, categoryListArr} from '@/api/modularity/index-admin';

export default {
  name: "BottomTab",
  data() {
    return {
      allID_array: [],
      tagnameID_default: '', // 页面初次加载默认通过此ID来渲染数据
      selectTagArr: [],
      selectTagArrEn: {},
      IMG_Map: {},
      Conf,
      certificateInfos: {},
      curfile: {},
      uploadConfItem: {
        type: 'picture-card',
        accept: '.png,.jpg,.jpeg',
      },
      wholeSubmitData: {
        mainArray: [
          {
            tagnameID: '',
            tagname: '',
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
      randomKEY: '',
      isLoading: false
    };
  },
  async mounted () {
    this.isLoading = true
    await this.categoryListArrRun()
    for (let id of this.allID_array) {
      let _res = await this.categoryTypeInfoRun(id)
      this.$set(this.IMG_Map[`en_${id}`], 'logo', _res.logo)
      this.$set(this.IMG_Map[`en_${id}`], 'bannerPicture', _res.bannerPicture)
      console.log(this.IMG_Map, '_re2s————998————————')
    }
    setTimeout(() => {
      this.randomKEY = Math.random()
      this.isLoading = false
    }, 500)
  },
  methods: {
    handleChangeSelect (id, index) {
      let _res = this.selectTagArr.find(v => v.value == id)
      this.wholeSubmitData.mainArray[index].tagname = _res.label
    },
    categoryTypeInfoRun (id) {
      return new Promise((resolve, reject) => {
        categoryTypeInfo({id}).then(response => {
          if (response.code == 200) {
            resolve({
              logo: response.data.logo,
              bannerPicture: response.data.bannerPicture
            })
          } else {
            resolve({
              logo: '',
              bannerPicture: ''
            })
            console.log('llll')
          }
        }).catch(e => {
          resolve({
            logo: '',
            bannerPicture: ''
          })
          console.log(e)
        })
      })
    },
    categoryListArrRun () {
      return new Promise((resolve, reject) => {
        categoryListArr({
          ignoreStatus: true
        }).then(response => {
          if (response.code == 200) {
            console.log(response.data, '???')
            this.selectTagArr = response.data.list.map(v =>  {
              let {value, labelEn} = v
              this.selectTagArrEn[`en_${value}`] = labelEn
              this.allID_array.push(value)
              this.IMG_Map[`en_${value}`] = {
                logo: '',
                bannerPicture: '',
              }
              console.log('初始化对象', this.IMG_Map)
              return v
            })
            this.tagnameID_default = this.selectTagArr[0]['value']
            resolve(this.tagnameID_default)
          } else {
            reject('error')
            console.log('llll')
          }
        })
      })
    },
    addClick () {
      this.wholeSubmitData.mainArray.push(
        {
            tagnameID: '',
            tagname: '',
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
    // 回显配置数据
    setDataHandle(data) {
      console.log(data, '回显配888置数据++——++——')

      this.$nextTick(() => {
        if (data.length <= 0) {
          this.wholeSubmitData.mainArray = [
            {
              tagnameID: '',
              tagname: '',
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
          this.wholeSubmitData.mainArray = data
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
      let _boolean_tagnameID = this.wholeSubmitData.mainArray.some(v => v.tagnameID == '')
      // let _boolean_source = this.wholeSubmitData.mainArray.some(v => v.sourceType == '')
      // let _boolean_route = this.wholeSubmitData.mainArray.some(v => v.routeName == '')
      if (_boolean_tagnameID) {
        this.$message.error('请选择中文标签');
        return false;
      }
      // else if (_boolean_source) {
      //   this.$message.error('请选择渠道来源');
      //   return false;
      // } else if (_boolean_route) {
      //   this.$message.error('请选择路由名称');
      //   return false;
      // }
      this.$emit('update', {
        type: 'tabPage',
        content: this.wholeSubmitData
      });
    },
    resetHandle () {
      this.wholeSubmitData = {
        mainArray: [
          {
            tagnameID: '',
            tagname: '',
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
        type: 'tabPage',
        content: {
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
.logoMatchBox{
  img{
    height:80px;border-radius:5px;
  }
  ::v-deep {
    .el-image{
      background:#f5f7fa;
      border-radius: 5px;
    }
    .el-icon-picture-outline{
      font-size: 30px;
      color: #909399;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top:23px;
    }
  }
}
</style>
