<template>
  <!--参照：bottom-tab-->
  <div class="bannerNew" v-loading="isLoading">
    <div class="topHeader clearfix">
      <div class="fl" style="font-weight: 700;">模块配置-分类（最多10项）</div>
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
          
          <div style="margin-bottom:10px;margin-top:10px;">
            <span>系列名称：</span>
            <el-select v-model="item.seriesId" placeholder="请选择" @change="((id) => handleChangeSelect(id, findex))">
              <el-option
                v-for="item in allSeriesSelect"
                :key="item.value"
                :disabled="item.disable"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>

          <div class="logoMatchBox">
            <div class="clearfix" style="margin-bottom:10px;">
              <span class="fl">微标图片：</span>
              <img v-if="allSeriesMap[`img_${item.seriesId}`]" class="fl" :src="allSeriesMap[`img_${item.seriesId}`]['logo']" style="width:80px;" />
              <div v-else>
                <el-image style="width:80px;height:80px;">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
            </div>
            <div class="clearfix" style="margin-bottom:10px;">
              <span class="fl">精选图片：</span>
              <img v-if="allSeriesMap[`img_${item.seriesId}`]" class="fl" :src="allSeriesMap[`img_${item.seriesId}`]['perfectPicture']" style="width:200px;" />
              <div v-else>
                <el-image style="width:200px;height:80px;">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
            </div>
            <div style="display:none;">{{randomKEY}}</div>
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
import {nftSeriesInfo, nftSeriesList} from '@/api/modularity/index-admin';


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
            seriesId: '',
            seriesName: '',
            logo: '',
            perfectPicture: '',
          }
        ]
      },
      routesIn: [],
      routesOut: [],
      allSeriesMap: {},
      allSeriesSelect: [],
      randomKEY: '',
      isLoading: false
    };
  },
  async mounted () {
    this.isLoading = true
    let _allSeriesSelect = await this.nftSeriesListRun()
    for (let item of _allSeriesSelect) {
      let info = await this.nftSeriesInfoRun(item.value)
      console.log(info.logo, 'kkkk9')
      this.allSeriesMap[`img_${item.value}`]['logo'] = info.logo
      this.allSeriesMap[`img_${item.value}`]['perfectPicture'] = info.perfectPicture
    }
    setTimeout(() => {
      this.randomKEY = Math.random()
      this.isLoading = false
    }, 500)
  },
  methods: {
    handleChangeSelect (id, index) {
      let _res = this.allSeriesSelect.find(v => v.value == id)
      console.log(_res, '啥')
      console.log(this.allSeriesMap, '啥222')
      this.wholeSubmitData.mainArray[index].seriesName = _res.label
      this.wholeSubmitData.mainArray[index].logo = this.allSeriesMap[`img_${id}`]['logo']
      this.wholeSubmitData.mainArray[index].perfectPicture = this.allSeriesMap[`img_${id}`]['perfectPicture']
    },
    // 系列名称下拉集合
    nftSeriesListRun () {
      return new Promise((resolve, reject) => {
        nftSeriesList({
          ignoreStatus: true
        }).then(response => {
          if (response.code == 200) {
            this.allSeriesSelect = response.data.list.map(item => {
              let {value} = item
              this.allSeriesMap[`img_${value}`] = {
                logo: '',
                perfectPicture: '',
              }
              return item
            })
            resolve(this.allSeriesSelect)
          } else {
            this.allSeriesSelect = []
            resolve([])
          }
        }).catch(e => {
          console.log(e)
          reject([])
        })
      })
    },
    nftSeriesInfoRun (id) {
      return new Promise((resolve, reject) => {
        nftSeriesInfo({id}).then(response => {
          if (response.code == 200) {
            resolve(response.data)
          } else {
            resolve({})
          }
        }).catch(e => {
          console.log(e)
          reject({})
        })
      })
    },
    addClick () {
      this.wholeSubmitData.mainArray.push(
        {
          seriesId: '',
          seriesName: '',
          logo: '',
          perfectPicture: '',
        }
      )
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
              seriesId: '',
              seriesName: '',
              logo: '',
              perfectPicture: '',
            }
          ]
        } else {
          this.wholeSubmitData.mainArray = data.content
        }
      });
    },
    
    saveHandle () {
      if (this.wholeSubmitData.mainTagName == '') {
        this.$message.error('中文标签不能为空');
        return false;
      } else if (this.wholeSubmitData.mainTagNameEn == '') {
        this.$message.error('英文标签不能为空');
        return false;
      } else {
        let _boolean = this.wholeSubmitData.mainArray.some(v => v.seriesId == '')
        if (_boolean) {
          this.$message.error('请选择系列名称');
          return false;
        }
      }
      this.$emit('update', {
        type: 'classifyType',
        content: this.wholeSubmitData
      });
    },
    resetHandle () {
      this.wholeSubmitData = {
        mainTagName: '',
        mainTagNameEn: '',
        mainArray: [
          {
            seriesId: '',
            seriesName: '',
            logo: '',
            perfectPicture: '',
          }
        ]
      }
      this.$emit('update', {
        type: 'classifyType',
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
    setRouteHandle () {
      // 分类没有参数、路由配置
    }
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
