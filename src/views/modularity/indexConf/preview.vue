<template>
  <div class="priview-page">
    <div class='box'>
      <template v-for="({type,content,id},findex) in templModel">
        <div class='header' :key="findex" v-if="type=='topNav'&&content.length">
          <!-- 顶部导航 -->
          <div class="item topNav" :key="id">
            <div class="wrap">
              <div class="topNav-item" v-for="(item,index) in content" :key="index">
                <template v-if="item.src===undefined">
                  <div class="input">{{item.tips}}</div>
                </template>
                <template v-else>
                  <img class="icon" :src="item.src" alt="">
                </template>
              </div>
            </div>
          </div>
        </div>
      </template>

      <div class='body' :style="{padding:paddingComput}">
        <template v-for="({type,content,id}) in templModel">
          <!-- 顶部菜单tab -->
          <template v-if="type=='topTab'&&content.length">
            <div class="item topTab" :key="id">
              <div class="wrap">
                <div :class="['topTab-item',{sel:index==0}]" v-for="(item,index) in content" :key="index">
                  <div class="text">{{item.text}}</div>
                </div>
                <div class="topTab-item">
                  <img class="image" :src="Conf.rightIcon">
                </div>
              </div>
            </div>
          </template>

          <!-- 大banner -->
          <template v-if="type=='bigBanner'&&content.length">
            <div class="item bigBanner" :key="id">
              <div class="wrap">
                <div class="banners">
                  <el-carousel class="custom-carousel" arrow="never">
                    <el-carousel-item v-for="(item,index) in content" :key="index">
                      <div class="image"></div>
                    </el-carousel-item>
                  </el-carousel>
                </div>
              </div>
            </div>
          </template>

          <!-- 金刚区 -->
          <template v-if="type=='king'&&content.length">
            <div class="item king" :key="id">
              <div class="wrap">
                <div class="king-pages">
                  <el-carousel class="custom-carousel" arrow="never">
                    <el-carousel-item v-for="(kpage,kindex) in content" :key="kindex">
                      <div class="k-wrap">
                        <div class="k-item" v-for="(page,pindex) in kpage.pages" :key="pindex">
                          <img class="k-image" :src="page.src">
                          <div class="k-title">{{page.title}}</div>
                          <div class="k-subtitle">{{page.subtitle}}</div>
                        </div>
                      </div>
                    </el-carousel-item>
                  </el-carousel>
                </div>
              </div>
            </div>
          </template>

          <!-- 卡片1图 -->
          <template v-if="type=='card1p'&&content.length">
            <div class="item card1p" :key="id">
              <div class="wrap">
                <div class="card1p-pages" v-for="(citem,cindex) in content" :key="cindex">
                  <div class="card1p-left">
                    <img class="img" :src="citem.src">
                    <div class="text1">{{citem.title}}</div>
                    <div class="text2">{{citem.subtitle}}</div>
                  </div>
                  <div class="card1p-right">
                    <img class="kkimg" :src="Conf.leftkk">
                    <div class="block" v-for="n in 4" :key="n">
                      <div class="gray"></div>
                      <div class="price">￥198.00</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- 小banner -->
          <template v-if="type=='smallBanner'&&content.length">
            <div class="item smallBanner" :key="id">
              <div class="wrap">
                <div class="banners">
                  <el-carousel class="custom-carousel" arrow="never">
                    <el-carousel-item v-for="(item,index) in content" :key="index">
                      <div class="image"></div>
                    </el-carousel-item>
                  </el-carousel>
                </div>
              </div>
            </div>
          </template>

          <!-- 卡片4图 -->
          <template v-if="type=='card4p'&&content.length">
            <div class="item card4p" :key="id">
              <div class="wrap">
                <div class="card4p-pages">
                  <div class="card4p-item" v-for="(item,index) in content" :key="index">
                    <div class="text">
                      <div class="text1">{{item.title}}</div>
                      <div class="text2">{{item.subtitle}}</div>
                    </div>
                    <img class="img" :src="item.src">
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- 卡片3图 -->
          <template v-if="type=='card3p'&&content.length">
            <div class="item card3p" :key="id">
              <div class="wrap">
                <div class="card3p-pages" v-for="(item,index) in content" :key="index">
                  <div class="banners">
                    <el-carousel class="custom-carousel" arrow="never">
                      <el-carousel-item v-for="(banitem,banindex) in item.banners" :key="banindex">
                        <div class="image"></div>
                      </el-carousel-item>
                    </el-carousel>
                  </div>
                  <div class="icons">
                    <div
                      :key="iindex"
                      class="icon-item"
                      v-for="(iconitem,iindex) in item.icons"
                      :style="bgColorComput(iconitem.bgColor)"
                    >
                      <div class="item-top">
                        <template v-if="iconitem.type==1">
                          <img v-if="iconitem.mainsrc" class="img" :src="iconitem.mainsrc">
                        </template>
                        <template v-else>
                          <div class="text">{{iconitem.mainsrc}}</div>
                        </template>
                      </div>
                      <div class="item-body">
                        <div class="body-left">
                          <div class="text1">
                            {{iconitem.title.slice(0,-2)}}<span class="red">{{iconitem.title.substr(-2,2)}}</span>
                          </div>
                          <div class="text2">{{iconitem.subtitle}}</div>
                          <div class="btn">{{iindex==0?'立即抢':'马上领'}}</div>
                        </div>
                        <div class="body-right">
                          <img class="img" :src="iconitem.imagesrc">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- 底部tab分页 -->
          <template v-if="type=='bottomTab'&&content.length">
            <div class="item bottomTab" :key="id">
              <div class="wrap">
                <el-tabs v-model="activeBottomTab" class="custom-tabs">
                  <el-tab-pane v-for="(item,index) in content" :key="index" :name="index+1+''">
                    <div :class="['bottm-tab-title',{'active':activeBottomTab==index+1}]" slot="label">
                      <div class="title">{{item.title}}</div>
                      <div v-show="item.subtitle" class="subTitle">{{item.subtitle}}</div>
                    </div>
                    <div class="bottm-tab-item">
                      <div class="goods">
                        <img class="image" :src="Conf.goodsCase">
                      </div>
                      <div class="banners">
                        <el-carousel class="custom-carousel" arrow="never">
                          <el-carousel-item v-for="(banitem,banindex) in item.banners" :key="banindex">
                            <div class="image"></div>
                          </el-carousel-item>
                        </el-carousel>
                      </div>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </div>
          </template>
        </template>
      </div>

      <template v-for="({type,content,id},findex) in templModel">
        <div class='footer' :key="findex" v-if="type=='bottomNav'&&content.length">
          <!-- 底部导航 -->
          <div class="item bottomNav" :key="id">
            <div class="wrap">
              <div class="nav-item" v-for="(item,index) in content" :key="index">
                <template v-if="index==0">
                  <img class="icon" :src="item.selSrc" alt="">
                  <div class="text sel">{{item.name}}</div>
                </template>
                <template v-else>
                  <img class="icon" :src="item.src" alt="">
                  <div class="text">{{item.name}}</div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Conf from '@/utils/indexConf';
import {moduleDetail} from '@/api/modularity/index-admin';

export default {
  name: 'PriviewCom',
  props: ['templId'],
  data() {
    return {
      Conf,
      templModel: [],
      activeBottomTab: '1',
    }
  },
  mounted() {
  },
  computed: {
    paddingComput() {
      let hasTopNav = false;
      let hasBottomNav = false;

      this.templModel.map(({type, content}) => {
        if (type == 'topNav') hasTopNav = !!content.length;
        if (type == 'bottomNav') hasBottomNav = !!content.length;
      });

      if (hasTopNav && hasBottomNav) {
        return '46px 0 51px';
      } else if (!hasTopNav && hasBottomNav) {
        return '0 0 51px';
      } else if (hasTopNav && !hasBottomNav) {
        return '46px 0 0';
      } else {
        return '0';
      }
    },
    bgColorComput() {
      return arr => {
        let [bg1, bg2] = arr;
        bg1 = bg1 || 'F8F8F8';
        bg2 = bg2 || 'F8F8F8';

        return {
          /*! autoprefixer: off */
          background:`-webkit-gradient(linear, 266deg, #${bg1} 0%, #${bg2} 100%)`,
          background:`-webkit-linear-gradient(266deg, #${bg1} 0%, #${bg2} 100%)`,
          /* autoprefixer: on */
          background:`-moz-linear-gradient(266deg, #${bg1} 0%, #${bg2} 100%)`,
          background:`-o-linear-gradient(266deg, #${bg1} 0%, #${bg2} 100%)`,
          background:`linear-gradient(266deg, #${bg1} 0%, #${bg2} 100%)`,
        };
      }
    },
  },
  methods: {
    // 查询模板详情请求
    async moduleDetailReq () {
      try {
        if (!this.templId) return this.$message.error('模板id不能为空');

        const {code, message, data} = await moduleDetail({
          id: this.templId
        });
        if (code == 200) {
          this.templName = data.templName;
          this.templModel = data.templData;
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
  }
}
</script>

<style lang="scss" scoped>
  .priview-page {
    width: 450px;
    height: 800px;
    position: relative;
    background: #F8F8F8;
    box-shadow: 0px 0px 5px rgb(0 0 0 / 35%);
    .box {
      width: 450px;
      height: 800px;
      overflow: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      .header {
        height: 46px;
        width: 100%;
        position: absolute;
        left: 0px;
        top: 0px;
        z-index: 9999;
        background: #F8F8F8;
      }
      .body {
        width: 100%;
        // padding: 46px 0 51px;
      }
      .footer {
        height: 51px;
        width: 100%;
        position: absolute;
        left: 0px;
        bottom: 0px;
        z-index: 9999;
        background: #F8F8F8;
      }
    }
    .item {
      width: 100%;
      min-height: 40px;
      .image {
        width: 100%;
        display: block;
      }
      &.topNav {
        .wrap {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-around;
          .topNav-item {
            text-align: center;
            .input {
              font-size: 14px;
              color: #999;
              text-align: left;
              width: 350px;
              border-radius: 20px;
              border: 1px solid #F4B100;
              height: 36px;
              line-height: 36px;
              padding: 0 10px;
              margin: 5px 0;
              box-sizing: border-box;
            }
            .icon {
              width: 24px;
              height: 24px;
              display: block;
              margin: 5px auto;
            }
          }
        }
      }
      &.topTab {
        .wrap {
          width: 100%;
          height: 40px;
          overflow: hidden;
          position: relative;
          background: #FFF;
          white-space: nowrap;
          .topTab-item {
            min-width: 40px;
            height: 40px;
            line-height: 40px;
            padding: 0 18px;
            text-align: center;
            display: inline-block;
            vertical-align: top;
            .text {
              font-size: 16px;
              font-weight: 500;
              color: #999;
            }
            &.sel {
              .text {
                color: #000;
                position: relative;
                &::after {
                  content: "";
                  position: absolute;
                  bottom: 0;
                  width: 24px;
                  height: 3px;
                  background: #F8B70B;
                  border-radius: 2px;
                  left: calc((100% - 24px) / 2);
                }
              }

            }
            &:last-child {
              width: 40px;
              height: 40px;
              min-width: unset;
              background: #FFFFFF;
              padding: 0;
              position: absolute;
              right: 0;
              top: 0;
              box-shadow: -2px 2px 4px 0px rgba(0, 0, 0, 0.04);
              .image {
                width: 24px;
                height: 24px;
                display: block;
                margin: 5px auto;
              }
            }
          }
        }
      }
      &.bigBanner {
        .banners {
          width: 100%;
          height: 175px;
          .custom-carousel {
            height: 100%;
            ::v-deep {
              .el-carousel__container {
                height: 100%;
              }
              .el-carousel__indicator {
                button {
                  width: 5px;
                  height: 5px;
                  border-radius: 6px;
                }
                &.is-active {
                  button {
                    width: 11px;
                  }
                }
              }
            }
            .image {
              height: 100%;
              background: #D8D8D8;
            }
          }
        }
      }
      &.king {
        .wrap {
          .king-pages {
            width: 100%;
            height: 238px;
            background: #FFF;
            .custom-carousel {
              height: 100%;
              ::v-deep {
                .el-carousel__container {
                  height: 100%;
                }
                .el-carousel__indicator {
                  button {
                    width: 5px;
                    height: 5px;
                    opacity: 0.5;
                    border-radius: 6px;
                    background-color: #FCBE19;
                  }
                  &.is-active {
                    button {
                      opacity: 1;
                      width: 11px;
                    }
                  }
                }
              }
              .k-wrap {
                display: flex;
                flex-direction: row;
                align-items: center;
                flex-wrap: wrap;
                padding: 0 20px;
                .k-item {
                  width: 80px;
                  margin: 10px 0;
                  text-align: center;
                  .k-image {
                    width: 42px;
                    height: 42px;
                    display: block;
                    margin: 0 auto;
                  }
                  .k-title {
                    font-size: 14px;
                    font-weight: 500;
                    color: #000000;
                    margin: 5px 0;
                  }
                  .k-subtitle {
                    font-size: 12px;
                    font-weight: 500;
                    color: #999999;
                  }
                }
              }
            }
          }
        }
      }
      &.card1p {
        .wrap {
          width: 100%;
          height: 115px;
          background: #FFF;
          .card1p-pages {
            display: flex;
            height: 100%;
            flex-direction: row;
            align-items: center;
            .card1p-left {
              display: inline-block;
              margin: 0 5px 0 16px;
              text-align: center;
              .img {
                width: 44px;
                height: 44px;
                display: block;
                margin: 0 auto;
                margin-bottom: 5px;
              }
              .text1 {
                font-size: 16px;
                font-weight: bold;
                color: #000000;
                margin-bottom: 5px;
              }
              .text2 {
                font-size: 12px;
                font-weight: 500;
                color: #666666;
              }
            }
            .card1p-right {
              display: inline-block;
              .kkimg {
                width: 20px;
                height: 80px;
              }
              .block {
                display: inline-block;
                margin-right: 12px;
                .gray {
                  width: 70px;
                  height: 70px;
                  background: #D8D8D8;
                  border-radius: 6px;
                  margin-bottom: 5px;
                }
                .price {
                  font-size: 12px;
                  font-weight: bold;
                  color: #EC4A2D;
                  text-align: center;
                }
              }
            }
          }
        }
      }
      &.smallBanner {
        .banners {
          width: 100%;
          height: 105px;
          .custom-carousel {
            height: 100%;
            ::v-deep {
              .el-carousel__container {
                height: 100%;
              }
              .el-carousel__indicator {
                button {
                  width: 5px;
                  height: 5px;
                  border-radius: 6px;
                }
                &.is-active {
                  button {
                    width: 11px;
                  }
                }
              }
            }
            .image {
              height: 100%;
              background: #D8D8D8;
            }
          }
        }
      }
      &.card4p {
        .wrap {
          width: 100%;
          height: 194px;
          padding: 0 16px;
          margin: 5px 0;
          .card4p-pages {
            background: #DCC698;
            border-radius: 8px;
            display: flex;
            height: 100%;
            flex-direction: row;
            align-items: center;
            flex-wrap: wrap;
            padding: 7px;
            box-sizing: border-box;
            box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.06);
            .card4p-item {
              width: 197px;
              height: 86px;
              background: #FFFFFF;
              border-radius: 6px;
              margin-right: 7px;
              margin-bottom: 7px;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-around;
              &:nth-child(even) {
                margin-right: 0;
              }
              .text {
                width: 80px;
                .text1 {
                  font-size: 16px;
                  font-weight: 500;
                  color: #000000;
                  margin-bottom: 5px;
                }
                .text2 {
                  font-size: 12px;
                  font-weight: 500;
                  color: #EC4A2D;
                }
              }
              .img {
                width: 72px;
                height: 72px;
              }
            }
          }
        }
      }
      &.card3p {
        .wrap {
          width: 100%;
          height: 300px;
          padding: 0 16px;
          margin: 5px 0;
          .card3p-pages {
            display: flex;
            height: 100%;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            .banners {
              width: 200px;
              height: 300px;
              border-radius: 6px;
              .custom-carousel {
                height: 100%;
                ::v-deep {
                  .el-carousel__container {
                    height: 100%;
                  }
                  .el-carousel__item {
                    border-radius: 6px;
                  }
                  .el-carousel__indicator {
                    button {
                      width: 5px;
                      height: 5px;
                      border-radius: 6px;
                    }
                    &.is-active {
                      button {
                        width: 11px;
                      }
                    }
                  }
                }
                .image {
                  height: 100%;
                  background: #D8D8D8;
                }
              }
            }
            .icons {
              width: 200px;
              .icon-item {
                width: 200px;
                height: 145px;
                padding: 5px;
                border-radius: 10px;
                margin-bottom: 10px;
                // background: linear-gradient(266deg, #FCB901 0%, #F1D504 100%);
                &+.icon-item {
                  margin-bottom: 0;
                  // background: linear-gradient(270deg, #22B5F6 0%, #69D6F3 100%);
                }
                .item-top {
                  height: 20px;
                  margin-bottom: 8px;
                  margin-left: 5px;
                  .img {
                    height: 20px;
                    display: block;
                  }
                  .text {
                    height: 100%;
                    font-size: 20px;
                    line-height: 20px;
                    font-weight: 800;
                  }
                }
                .item-body {
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: space-around;
                  width: 100%;
                  height: 107px;
                  background: #FFFFFF;
                  border-radius: 8px;
                  .body-left {
                    .text1 {
                      font-size: 16px;
                      font-weight: bold;
                      color: #000000;
                      margin-bottom: 8px;
                      .red {
                        color: #EC4A2D;
                      }
                    }
                    .text2 {
                      font-size: 12px;
                      font-weight: 500;
                      color: #666666;
                      margin-bottom: 8px;
                    }
                    .btn {
                      width: 58px;
                      height: 22px;
                      line-height: 22px;
                      border-radius: 12px;
                      color: #FFF;
                      font-size: 12px;
                      text-align: center;
                      background: linear-gradient(180deg, #E87332 0%, #DF3E24 100%);
                    }
                  }
                  .body-right {
                    .img {
                      width: 80px;
                      height: 88px;
                    }
                  }
                }
              }
            }
          }
        }
      }
      &.bottomTab {
        .custom-tabs {
          ::v-deep {
            .el-tabs__active-bar {
              display: none;
            }
            .el-tabs__header {
              min-width: 450px;
              margin-bottom: 5px;
            }
            .el-tabs__nav {
              min-height: 40px;
            }
            .el-tabs__item {
              height: unset;
              padding: 0 20px;
            }
            .el-tabs__nav-wrap::after {
              display: none;
            }
          }
          .bottm-tab-title {
            text-align: center;
            .title {
              height: 20px;
              font-size: 18px;
              font-weight: bold;
              color: #666;
              line-height: 20px;
              margin: 10px;
            }
            .subTitle {
              min-width: 80px;
              height: 26px;
              line-height: 26px;
              border-radius: 16px;
              margin: 10px;
              font-weight: 400;
              color: #999;
            }
            &.active {
              .title {
                color: #333;
              }
              .subTitle {
                color: #333;
                font-weight: 500;
                background: #FCBE19;
              }
            }
          }
          .bottm-tab-item {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-bottom: 15px;
            padding: 0 16px;
            justify-content: space-between;
            .goods {
              width: 200px;
              height: 330px;
              border-radius: 6px;
              .image {
                width: 100%;
                height: 100%;
                display: block;
              }
            }
            .banners {
              width: 200px;
              height: 330px;
              border-radius: 6px;
              .custom-carousel {
                height: 100%;
                ::v-deep {
                  .el-carousel__container {
                    height: 100%;
                  }
                  .el-carousel__item {
                    border-radius: 6px;
                  }
                  .el-carousel__indicator {
                    button {
                      width: 5px;
                      height: 5px;
                      border-radius: 6px;
                    }
                    &.is-active {
                      button {
                        width: 11px;
                      }
                    }
                  }
                }
                .image {
                  height: 100%;
                  background: #D8D8D8;
                }
              }
            }
          }
        }
      }
      &.bottomNav {
        .wrap {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-around;
          .nav-item {
            text-align: center;
            .icon {
              width: 24px;
              height: 24px;
              display: block;
              margin: 5px auto;
            }
            .text {
              font-size: 12px;
              color: #999;
              text-align: center;
              &.sel {
                color: #333;
              }
            }
          }
        }
      }
    }
  }
</style>
