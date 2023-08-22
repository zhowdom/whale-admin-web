<template>
  <div class="index-conf-add" v-loading.fullscreen.lock="hasLoading">
    <div class="top">
      <div class="modify-title">
        <div class="text">模板名称：</div>
        <el-input size="small" v-model="templName" placeholder="请输入模板名称"></el-input>
      </div>
      <div class="btns">
        <el-button size="small" round @click="goBackHandle">返回</el-button>
        <el-button size="small" type="success" round v-hasPermi="['setting:home_module:save','setting:home_module:update']" @click="saveHandle">保存</el-button>
      </div>
    </div>
    <div class="content">
      <div class="aside">
        <h3 class="tips">
          <span class="text">模块中心</span>
        </h3>
        <div class="menus">
          <el-menu
            :default-active="activeName"
            :default-openeds="activeOpenName"
            @open="handleOpen"
            class="custom-menus"
            text-color="#666666"
            :unique-opened="true"
            background-color="#d7d7d7"
            active-text-color="#ffd04b">
            <template v-for="(item, index) in menus">
              <el-submenu :index="item.name" :key="index">
                <template slot="title">
                  <span>{{item.label}}</span>
                </template>
                <el-menu-item :index="item.name+'-1'">
                  <div class="menu-item-wrap" @dblclick="submenuDblclickHandle(item)">
                    <img class="image" :src="item.src" />
                  </div>
                </el-menu-item>
              </el-submenu>
            </template>
          </el-menu>
        </div>
      </div>
      <div class="priview">
        <!--中间区域响应预览-->
        <template v-for="({type,content,id, topBigTitle},findex) in templModel">
          <!-- 顶部导航 -->
          <template v-if="type=='topNav'">
            <div :class="['item topNav',{active:isActiveBlock(findex,activeName,id)}]" @click="setCurBlockActiveHandle(id,type)" :key="id">
              <div v-if="content.length" class="wrap">
                <div class="topNav-item" v-for="(item,index) in content" :key="index">
                  <template v-if="item.src===undefined">
                    <div class="input">{{item.tips}}</div>
                  </template>
                  <template v-else>
                    <img class="icon" :src="item.src" alt="">
                  </template>
                </div>
              </div>
              <img v-else class="image" :src="Conf.topNav">
              <!-- 工具条 -->
              <div class="tools" v-if="isActiveBlock(findex,activeName,id)">
                <img class="image" @click="clearCurModelHandle('topNav',id)" :src="Conf.deleteIcon">
              </div>
            </div>
          </template>

          <!-- 顶部菜单tab -->
          <template v-if="type=='topTab'">
            <div :class="['item topTab',{active:isActiveBlock(findex,activeName,id)}]" @click="setCurBlockActiveHandle(id,type)" :key="id">
              <div v-if="content.length" class="wrap">
                <div :class="['topTab-item',{sel:index==0}]" v-for="(item,index) in content" :key="index">
                  <div class="text">{{item.text}}</div>
                </div>
                <div class="topTab-item">
                  <img class="image" :src="Conf.rightIcon">
                </div>
              </div>
              <img v-else class="image" :src="Conf.topTab">
              <!-- 工具条 -->
              <div class="tools" v-if="isActiveBlock(findex,activeName,id)">
                <!-- <img class="image" @click="upCurModelHandle('topTab',id)" :src="Conf.upIcon"> -->
                <!-- <img class="image" @click="downCurModelHandle('topTab',id)" :src="Conf.downIcon"> -->
                <img class="image" @click="clearCurModelHandle('topTab',id)" :src="Conf.deleteIcon">
              </div>
            </div>
          </template>

          <!-- 大banner -->
          <template v-if="type=='bigBanner'">
            <div :class="['item bigBanner',{active:isActiveBlock(findex,activeName,id)}]" @click="setCurBlockActiveHandle(id,type)" :key="id">
              <div v-if="content.length" class="wrap">
                <div class="banners">
                  <el-carousel class="custom-carousel" arrow="never">
                    <el-carousel-item v-for="(item,index) in content" :key="index">
                      <div class="image"></div>
                    </el-carousel-item>
                  </el-carousel>
                </div>
              </div>
              <img v-else class="image" :src="Conf.bigBanner">
              <!-- 工具条 -->
              <div class="tools" v-if="isActiveBlock(findex,activeName,id)">
                <img class="image" @click="upCurModelHandle('bigBanner',id)" :src="Conf.upIcon">
                <img class="image" @click="downCurModelHandle('bigBanner',id)" :src="Conf.downIcon">
                <img class="image" @click="clearCurModelHandle('bigBanner',id)" :src="Conf.deleteIcon">
              </div>
            </div>
          </template>

          <!-- 金刚区 -->
          <template v-if="type=='king'">
            <div :class="['item king',{active:isActiveBlock(findex,activeName,id)}]" @click="setCurBlockActiveHandle(id,type)" :key="id">
              <div v-if="content.length" class="wrap">
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
              <img v-else class="image" :src="Conf.king">
              <!-- 工具条 -->
              <div class="tools" v-if="isActiveBlock(findex,activeName,id)">
                <img class="image" @click="upCurModelHandle('king',id)" :src="Conf.upIcon">
                <img class="image" @click="downCurModelHandle('king',id)" :src="Conf.downIcon">
                <img class="image" @click="clearCurModelHandle('king',id)" :src="Conf.deleteIcon">
              </div>
            </div>
          </template>

          <!-- 卡片1图 -->
          <template v-if="type=='card1p'">
            <div :class="['item card1p',{active:isActiveBlock(findex,activeName,id)}]" @click="setCurBlockActiveHandle(id,type)" :key="id">
              <div v-if="content.length" class="wrap">
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
              <img v-else class="image" :src="Conf.card1p">
              <!-- 工具条 -->
              <div class="tools" v-if="isActiveBlock(findex,activeName,id)">
                <img class="image" @click="upCurModelHandle('card1p',id)" :src="Conf.upIcon">
                <img class="image" @click="downCurModelHandle('card1p',id)" :src="Conf.downIcon">
                <img class="image" @click="clearCurModelHandle('card1p',id)" :src="Conf.deleteIcon">
              </div>
            </div>
          </template>

          <!-- 小banner -->
          <template v-if="type=='smallBanner'">
            <div :class="['item smallBanner',{active:isActiveBlock(findex,activeName,id)}]" @click="setCurBlockActiveHandle(id,type)" :key="id">
              <div v-if="content.length" class="wrap">
                <div class="banners">
                  <el-carousel class="custom-carousel" arrow="never">
                    <el-carousel-item v-for="(item,index) in content" :key="index">
                      <div class="image"></div>
                    </el-carousel-item>
                  </el-carousel>
                </div>
              </div>
              <img v-else class="image" :src="Conf.smallBanner">
              <!-- 工具条 -->
              <div class="tools" v-if="isActiveBlock(findex,activeName,id)">
                <img class="image" @click="upCurModelHandle('smallBanner',id)" :src="Conf.upIcon">
                <img class="image" @click="downCurModelHandle('smallBanner',id)" :src="Conf.downIcon">
                <img class="image" @click="clearCurModelHandle('smallBanner',id)" :src="Conf.deleteIcon">
              </div>
            </div>
          </template>

          <!-- 卡片4图 -->
          <template v-if="type=='card4p'">
            <div :class="['item card4p',{active:isActiveBlock(findex,activeName,id)}]" @click="setCurBlockActiveHandle(id,type)" :key="id">
              <div v-if="content.length" class="wrap">
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
              <img v-else class="image" :src="Conf.card4p">
              <!-- 工具条 -->
              <div class="tools" v-if="isActiveBlock(findex,activeName,id)">
                <img class="image" @click="upCurModelHandle('card4p',id)" :src="Conf.upIcon">
                <img class="image" @click="downCurModelHandle('card4p',id)" :src="Conf.downIcon">
                <img class="image" @click="clearCurModelHandle('card4p',id)" :src="Conf.deleteIcon">
              </div>
            </div>
          </template>

          <!-- 卡片3图 -->
          <template v-if="type=='card3p'">
            <div :class="['item card3p',{active:isActiveBlock(findex,activeName,id)}]" @click="setCurBlockActiveHandle(id,type)" :key="id">
              <div v-if="content.length" class="wrap">
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
              <img v-else class="image" :src="Conf.card3p">
              <!-- 工具条 -->
              <div class="tools" v-if="isActiveBlock(findex,activeName,id)">
                <img class="image" @click="upCurModelHandle('card3p',id)" :src="Conf.upIcon">
                <img class="image" @click="downCurModelHandle('card3p',id)" :src="Conf.downIcon">
                <img class="image" @click="clearCurModelHandle('card3p',id)" :src="Conf.deleteIcon">
              </div>
            </div>
          </template>

          <!-- 底部tab分页 -->
          <template v-if="type=='bottomTab'">
            <div :class="['item bottomTab',{active:isActiveBlock(findex,activeName,id)}]" @click="setCurBlockActiveHandle(id,type)" :key="id">
              <div v-if="content.length" class="wrap">
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
              <img v-else class="image" :src="Conf.bottomTab">
              <!-- 工具条 -->
              <div class="tools" v-if="isActiveBlock(findex,activeName,id)">
                <!-- <img class="image" @click="upCurModelHandle('bottomTab',id)" :src="Conf.upIcon"> -->
                <!-- <img class="image" @click="downCurModelHandle('bottomTab',id)" :src="Conf.downIcon"> -->
                <img class="image" @click="clearCurModelHandle('bottomTab',id)" :src="Conf.deleteIcon">
              </div>
            </div>
          </template>


          <!-- tab分页 -->
          <template v-if="type=='tabPage'">
            <div :class="['item tabPage',{active:isActiveBlock(findex,activeName,id)}]" @click="setCurBlockActiveHandle(id,type)" :key="id">
              <div v-if="content.length" class="wrap">
                <div class="tabPageBox">
                  <ul class="clearfix" :style="{width: 65*content.length + 'px'}">
                    <li v-for="(item,index) in content" :key="index"><span :class="{cur: index== 0}">{{item.tagname}}</span></li>
                  </ul>
                </div>
              </div>
              <img v-else class="image" :src="Conf.tabPage">
              <!-- 工具条 -->
              <!-- <div class="tools" v-if="isActiveBlock(findex,activeName,id)">
                <img class="image" @click="upCurModelHandle('tabPage',id)" :src="Conf.upIcon">
                <img class="image" @click="downCurModelHandle('tabPage',id)" :src="Conf.downIcon">
                <img class="image" @click="clearCurModelHandle('tabPage',id)" :src="Conf.deleteIcon">
              </div> -->
            </div>
          </template>
          <!-- banner新 -->
          <template v-if="type=='bannerNew'">
            <div :class="['item bannerNew',{active:isActiveBlock(findex,activeName,id)}]" @click="setCurBlockActiveHandle(id,type)" :key="id">
              <div v-if="content.length" class="wrap bannerNew_box">
                <div class="banners">
                  <h3>{{topBigTitle.mainTagName}}</h3>
                  <ul class="clearfix" :style="{width: (content.length * 310) + 'px'}">
                    <li v-for="(item,index) in content" :key="index" class="fl">
                      <img v-if="item.bannerSrc" :src="item.bannerSrc">
                      <div v-else style="width:260px;height:260px;background:#f1d7da;border-radius:5px;"></div>
                      </li>
                  </ul>
                </div>
              </div>
              <img v-else class="image" :src="Conf.bannerNew">
              <!-- 工具条 -->
              <div class="tools" v-if="isActiveBlock(findex,activeName,id)">
                <img class="image" @click="upCurModelHandle('bannerNew',id)" :src="Conf.upIcon">
                <img class="image" @click="downCurModelHandle('bannerNew',id)" :src="Conf.downIcon">
                <img class="image" @click="clearCurModelHandle('bannerNew',id)" :src="Conf.deleteIcon">
              </div>
            </div>
          </template>
          <!-- 分类 -->
          <template v-if="type=='classifyType'">
            <div :class="['item classifyType',{active:isActiveBlock(findex,activeName,id)}]" @click="setCurBlockActiveHandle(id,type)" :key="id">
              <div v-if="content.length" class="wrap classifyTypeBox">
                <h3>{{topBigTitle.mainTagName}}</h3>
                <div class="wrapbox">
                  <ul class="clearfix" :style="{width: (content.length * 195) + 'px'}">
                    <li class="fl" v-for="(item,index) in content" :key="index">
                      <div>
                        <div class="perfecIMG">
                          <img v-if="item.perfectPicture" :src="item.perfectPicture" />
                          <div v-else style="width:166pxpx;height:116px;background:#f1d7da;border-radius:5px;"></div>
                        </div>
                        <div class="logoIMG">
                          <img v-if="item.logo" :src="item.logo" />
                          <div v-else style="width:45pxpx;height:45px;background:#d58089;border-radius:5px;"></div>
                        </div>
                        <p class="serNameBox" v-if="item.seriesName">{{item.seriesName}}</p>
                        <p class="serNameBox" v-else style="width:70%;background:#f1d7da;height:16px;"></p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <img v-else class="image" :src="Conf.classifyType">
              <!-- 工具条 -->
              <div class="tools" v-if="isActiveBlock(findex,activeName,id)">
                <img class="image" @click="upCurModelHandle('classifyType',id)" :src="Conf.upIcon">
                <img class="image" @click="downCurModelHandle('classifyType',id)" :src="Conf.downIcon">
                <img class="image" @click="clearCurModelHandle('classifyType',id)" :src="Conf.deleteIcon">
              </div>
            </div>
          </template>

          <!-- 底部导航 -->
          <template v-if="type=='bottomNav'">
            <div :class="['item bottomNav',{active:isActiveBlock(findex,activeName,id)}]" @click="setCurBlockActiveHandle(id,type)" :key="id">
              <div v-if="content.length" class="wrap">
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
              <img v-else class="image" :src="Conf.bottomNav">
              <!-- 工具条 -->
              <!-- <div class="tools" v-if="isActiveBlock(findex,activeName,id)">
                <img class="image" @click="clearCurModelHandle('bottomNav',id)" :src="Conf.deleteIcon">
              </div> -->
            </div>
          </template>
        </template>
      </div>
      <div class="body">
        <!-- 顶部导航 -->
        <top-nav ref="topNav" v-if="activeName==2" @update="updateFormModel"/>
        <!-- 顶部菜单tab -->
        <top-tab ref="topTab" v-if="activeName==4" @update="updateFormModel"/>
        <!-- 大banner -->
        <big-banner ref="bigBanner" v-if="activeName==5" @update="updateFormModel"/>
        <!-- 金刚区 -->
        <king ref="king" v-if="activeName==7" @update="updateFormModel"/>
        <!-- 卡片1图 -->
        <card-1p ref="card1p" v-if="activeName==8" @update="updateFormModel"/>
        <!-- 小banner -->
        <small-banner ref="smallBanner" v-if="activeName==6" @update="updateFormModel"/>
        <!-- 卡片4图 -->
        <card-4p ref="card4p" v-if="activeName==9" @update="updateFormModel"/>
        <!-- 卡片3图 -->
        <card-3p ref="card3p" v-if="activeName==10" @update="updateFormModel"/>
        <!-- 底部tab分页 -->
        <bottom-tab ref="bottomTab" v-if="activeName==3" @update="updateFormModel"/>

        <!-- tab分页 -->
        <tab-page ref="tabPage" v-if="activeName==11" @update="updateFormModel"/>
        <!-- banner新 -->
        <banner-new ref="bannerNew" v-if="activeName==12" @update="updateFormModel"/>
        <!-- 分类 -->
        <classify-type ref="classifyType" v-if="activeName==13" @update="updateFormModel"/>
        <!-- 底部导航 -->
        <bottom-nav ref="bottomNav" v-if="activeName==1" @update="updateFormModel"/>
        
      </div>
    </div>
  </div>
</template>

<script>
import {
  TopNav,
  TopTab,
  BigBanner,
  King,
  SmallBanner,
  BottomTab,
  Card1p,
  Card3p,
  Card4p,

  TabPage,
  BannerNew,
  ClassifyType,
  BottomNav,

} from './libs';
import {uuid} from '@/utils/index';
import Conf from '@/utils/indexConf';
import temData from './temData';
import {moduleSave, moduleDetail, moduleUpdate, routeLinks} from '@/api/modularity/index-admin';

export default {
  name: 'IndexConfEdit',
  components: {
    TopNav,
    TopTab,
    BigBanner,
    King,
    SmallBanner,
    BottomTab,
    Card1p,
    Card3p,
    Card4p,

    TabPage,
    BannerNew,
    ClassifyType,
    BottomNav,
  },
  data() {
    return {
      Conf,
      templName: '',
      activeName: '1',
      activeBottomTab: '1',
      activeOpenName: ['1', '1-1'],
      activeBlockId: '', // 这个是什么ID？
      menus: [
        {
          name: '11',
          label: 'tab分页',
          type: 'tabPage',
          src: Conf.tabPage,
        },
        {
          name: '12',
          label: 'banner',
          type: 'bannerNew',
          src: Conf.bannerNew,
        },
        {
          name: '13',
          label: '分类',
          type: 'classifyType',
          src: Conf.classifyType,
        },
        {
          name: '1', // 不可双击增加操作
          label: '底部导航',
          type: 'bottomNav',
          src: Conf.bottomNav,
        },
        // {
        //   name: '2',
        //   label: '顶部导航',
        //   type: 'topNav',
        //   src: Conf.topNav,
        // },
        // {
        //   name: '3',
        //   label: '底部tab分页',
        //   type: 'bottomTab',
        //   src: Conf.bottomTab,
        // },
        // {
        //   name: '4',
        //   label: '顶部菜单tab',
        //   type: 'topTab',
        //   src: Conf.topTab,
        // },
        // {
        //   name: '5',
        //   label: '大banner',
        //   type: 'bigBanner',
        //   src: Conf.bigBanner,
        // },
        // {
        //   name: '6',
        //   label: '小banner',
        //   type: 'smallBanner',
        //   src: Conf.smallBanner,
        // },
        // {
        //   name: '7',
        //   label: '金刚区',
        //   type: 'king',
        //   src: Conf.king,
        // },
        // {
        //   name: '8',
        //   label: '卡片1图',
        //   type: 'card1p',
        //   src: Conf.card1p,
        // },
        // {
        //   name: '9',
        //   label: '卡片4图',
        //   type: 'card4p',
        //   src: Conf.card4p,
        // },
        // {
        //   name: '10',
        //   label: '卡片3图',
        //   type: 'card3p',
        //   src: Conf.card3p,
        // },
      ],
      templModel: [
        // {
        //   type: 'topNav',					// 顶部导航
        //   content: [],						// 数据集
        //   id: uuid().substr(0, 8),// 客户端id
        // },
        // {
        //   type: 'topTab',					// 顶部tab菜单
        //   content: [],						// 数据集
        //   id: uuid().substr(0, 8),// 客户端id
        // },
        // {
        //   type: 'bigBanner',			// 大banner
        //   content: [],						// 数据集
        //   id: uuid().substr(0, 8),// 客户端id
        // },
        // {
        //   type: 'king',						// 金刚区
        //   content: [],						// 数据集
        //   id: uuid().substr(0, 8),// 客户端id
        // },
        // {
        //   type: 'card1p',         // 卡片1图
        //   content: [],            // 数据集
        //   id: uuid().substr(0, 8),// 客户端id
        // },
        // {
        //   type: 'smallBanner',		// 小Banner
        //   content: [],						// 数据集
        //   id: uuid().substr(0, 8),// 客户端id
        // },
        // {
        //   type: 'card4p',         // 卡片4图
        //   content: [],            // 数据集
        //   id: uuid().substr(0, 8),// 客户端id
        // },
        // {
        //   type: 'card3p',         // 卡片3图
        //   content: [],            // 数据集
        //   id: uuid().substr(0, 8),// 客户端id
        // },
        // {
        //   type: 'bottomTab',			// 底部商品tab菜单
        //   content: [],						// 数据集
        //   id: uuid().substr(0, 8),// 客户端id
        // },
        {
          type: 'tabPage',			// tab分页
          topBigTitle: {},        // 顶部大的独立中英标签(默认空对象)
          content: [],						// 数据集
          id: uuid().substr(0, 8),// 客户端id
        },
        {
          type: 'bannerNew',			// banner新
          topBigTitle: {},        // 顶部大的独立中英标签(默认空对象)
          content: [],						// 数据集
          id: uuid().substr(0, 8),// 客户端id
        },
        {
          type: 'classifyType',			// 分类
          topBigTitle: {},        // 顶部大的独立中英标签(默认空对象)
          content: [],						// 数据集
          id: uuid().substr(0, 8),// 客户端id
        },
        {
          type: 'bottomNav',			// 底部导航
          topBigTitle: {},        // 顶部大的独立中英标签(默认空对象)
          content: [],						// 数据集
          id: uuid().substr(0, 8),// 客户端id
        },
      ],
      routesList: [],
      templId: '', // 存在id,表示编辑，否则新增
      appPackageType: 2,
      isEdit: false,
      hasLoading: false,
    }
  },
  mounted() {
    console.log(BannerNew, 'BannerNew')
    console.log(TopNav, 'TopNav')
    this.templId = this.$route.query.id || '';
    this.appPackageType = this.$route.query.type || 2;

    if (this.templId) {
      this.hasLoading = true;
      this.isEdit = true;
      this.moduleDetailReq();
    } else {
      this.isEdit = false;
      const curIndex = this.templModel.findIndex(cur => cur.type == 'bottomNav');
      // alert(`默认展开底部导航，它的索引是：${curIndex}`)
      this.activeBlockId = this.templModel[curIndex].id;
      // alert(`默认展开底部导航，对应中间预览块的ID是：${this.activeBlockId}`)
      this.routeLinksReq();
    }
  },
  computed: {
    isActiveBlock() {
      return (index,name, id) => {
        console.log(`中间块的索引index：${index}`)
        console.log(`左侧菜单被激活的name：${name}`)
        console.log(`中间块的唯一id：${id}`)
        const {type} = this.menus.find(el => el.name == name) || {};
        const frtIndex = this.templModel.findIndex(el => el.type == type);

        if (this.activeBlockId) {
          return this.activeBlockId == id;
        } else {
          return index == frtIndex;
        };
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
    // 当前平台下的路由名称（内链和外链）
    async routeLinksReq() {
      try {
        const {code, data, message} = await routeLinks({
          appPackageType: this.appPackageType
        });

        if (code == 200) {
          this.routesList = data || [];
          if (!this.isEdit) {
            this.handleOpen('1', ['1']); // 初次调用默认开启菜单的方法
          }
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        throw error;
      }
    },
    // 查询模板详情请求
    async moduleDetailReq () {
      try {
        await this.routeLinksReq();
        const {code, message, data} = await moduleDetail({
          id: this.templId
        });
        if (code == 200) {
          this.templName = data.templName;
          this.templModel = data.templData; // p9
          this.handleOpen('1', ['1']); // 初次调用默认开启菜单的方法
          setTimeout(() => {
            this.hasLoading = false;
          }, 600);
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
    // 新增模板请求
    async moduleSaveReq() {
      try {
        const data = this.setModelData(this.templModel);
        const {code, message} = await moduleSave({
          templData: data,
          templName: this.templName,
        });

        if (code == 200) {
          this.$message.success('新增模板成功');
          this.routerHandle();
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
    // 编辑模板请求
    async moduleUpdateReq() {
      try {
        const data = this.setModelData(this.templModel);
        const {code, message} = await moduleUpdate({
          templData: data,
          templId: this.templId,
          templName: this.templName,
        });

        if (code == 200) {
          this.$message.success('更新模板成功');
          this.routerHandle();
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
    // 设置模板数据
    setModelData(data) {
      data.map(({type, content}) => {
        if (type == 'topNav' || type == 'topTab' || type == 'card1p' || type == 'card4p' || type == 'bottomNav') {
          content.map(el => {
            el.params = {};
            let {list, params} = el;
            list.map(({name, value}) => {
              params[name] = value;
            });
          });
        }

        if (type == 'bigBanner' || type == 'smallBanner') {
          content.map(el => {
            el.params = {};
            let {banlist, params} = el;
            banlist.map(({name, value}) => {
              params[name] = value;
            });
          });
        }

        if (type == 'king') {
          content.map(({pages}) => {
            pages.map(el => {
              el.params = {};
              let {list, params} = el;
              list.map(({name, value}) => {
                params[name] = value;
              });
            })
          });
        }

        if (type == 'card3p') {
          content.map(({icons, banners}) => {
            icons.map(el => {
              el.params = {};
              let {list, params} = el;
              list.map(({name, value}) => {
                params[name] = value;
              });
            });
            banners.map(el => {
              el.params = {};
              let {banlist, params} = el;
              banlist.map(({name, value}) => {
                params[name] = value;
              });
            });
          });
        }

        if (type == 'bottomTab') {
          content.map(item => {
            item.params = {};
            const {list, params, banners} = item;
            list.map(({name, value}) => {
              params[name] = value;
            });

            banners.map(el => {
              el.params = {};
              let {banlist, params} = el;
              banlist.map(({name, value}) => {
                params[name] = value;
              });
            });
          });
        }
      });

      return data;
    },
    // 上移当前模块
    upCurModelHandle(type, id) {
      let curIndex = this.templModel.findIndex(cur => cur.type == type && cur.id == id);
      let item = this.templModel[curIndex];
      // if (curIndex == 0) return this.$message.error('当前模块已无法上移!');
      if (curIndex == 1) return this.$message.error('当前模块已无法上移!'); // curIndex=1表示处于仅次于顶部菜单的第二个位置
      let {type: preType} = this.templModel[curIndex - 1];
      

      if (preType == 'topNav' || preType == 'topTab') {
        this.$message.error('当前模块已无法上移!');
      } else {
        this.templModel.splice(curIndex - 1, 0, item);
        this.templModel.splice(curIndex + 1, 1);
      }
    },
    // 下移当前模块
    downCurModelHandle(type, id) {
      let curIndex = this.templModel.findIndex(cur => cur.type == type && cur.id == id);
      let item = this.templModel[curIndex];
      if (curIndex == this.templModel.length - 2) return this.$message.error('当前模块已无法下移!');
      let {type: nextType} = this.templModel[curIndex + 1];

      if (nextType == 'bottomTab' || nextType == 'bottomNav') {
        this.$message.error('当前模块已无法下移!');
      } else {
        this.templModel.splice(curIndex + 2, 0, item);
        this.templModel.splice(curIndex, 1);
      }
    },
    // 双击子菜单操作
    submenuDblclickHandle({type, name}) {
      const id = this.activeBlockId; // 当前激活的id
      const uniqueMenuName = ['1','2','3','4', '5', '6', '11']; // 底部导航，顶部导航，底部tab分页，顶部tab分页，大banner，小banner唯一
      const item = {type, content: [], id: uuid().substr(0, 8)};
      const curIndex = this.templModel.findIndex(cur => id ? cur.id == id : cur.type == type);
      // alert(curIndex)
      const topNavIdx = this.templModel.findIndex(cur => cur.type == 'topNav');
      const topTabIdx = this.templModel.findIndex(cur => cur.type == 'topTab');
      const bottomTabIdx = this.templModel.findIndex(cur => cur.type == 'bottomTab');
      const bottomNavIdx = this.templModel.findIndex(cur => cur.type == 'bottomNav');

      if (curIndex == -1) {
        if (name == '2') { // 顶部导航
          this.templModel.splice(0, 0, item);
        } else if (name == '4') { // 顶部tab分页
          if (topNavIdx == -1) {
            this.templModel.splice(0, 0, item);
          } else {
            this.templModel.splice(1, 0, item);
          }
        } else if (name == '3') { // 底部tab分页
          this.templModel.splice(this.templModel.length - 1, 0, item);
        } else {
          if (bottomTabIdx == -1) {
            this.templModel.splice(bottomNavIdx, 0, item);
          } else {
            this.templModel.splice(bottomNavIdx - 1, 0, item);
          }
        }
      } else {
        if (uniqueMenuName.includes(name)) return;
        this.templModel.splice(curIndex + 1, 0, item);
      }
    },
    // 激活当前选区操作
    setCurBlockActiveHandle(id, type) {
      this.activeBlockId = id;
      // alert('块的唯一ID：' + id)
      const {name} = this.menus.find(el => el.type == type) || {};
      const curIndex = this.templModel.findIndex(cur => cur.type == type && cur.id == id);
      this.activeName = name;
      this.activeOpenName = [name, '1-1'];
      const content = this.templModel[curIndex]['content'];
      const topBigTitle = this.templModel[curIndex]['topBigTitle'];
      

      this.$nextTick(() => {
      // banner新、分类这2菜单有：含有独立的中英文标签
      if (type == 'bannerNew' || type == 'classifyType') {
          console.log(this.templModel, 'KKKKKKKKK')
          console.log(curIndex, 'SSŚSSSSSSS')
            this.$refs[type].setDataHandle({
              topBigTitle,
              content
            });
        } else {
          this.$refs[type].setDataHandle(content);
        }
        this.$refs[type].setRouteHandle(this.routesList);
      });
    },
    // 开启菜单处理
    handleOpen(key, keyPath) {
      console.log(key, 'key')
      this.activeName = String(key);
      let {type} = this.menus.find(({name}) => name == key) || {};
      console.log(type, 'type')
      if (type === undefined) return this.$message.error('未选中菜单');
      // let curIndex = this.templModel.findIndex(cur => cur.type == type);
      let curIndex = this.templModel.findIndex(cur => {
        console.log(cur, 'cur')
        return cur.type == type
      });
      console.log(curIndex, 'curIndex')
      if (curIndex == -1) {
        this.activeBlockId = '';
      } else {
        let {content, id, topBigTitle} = this.templModel[curIndex];
        console.log(content, id, topBigTitle, 'o989')
        this.activeBlockId = id;
        console.log('MK', content)
        this.$nextTick(() => {
          // banner新、分类这2菜单有：含有独立的中英文标签
          if (type == 'bannerNew' || type == 'classifyType') {
              console.log(this.templModel, 'KKKKKKKKK')
              console.log(curIndex, 'SSŚSSSSSSS')
                this.$refs[type].setDataHandle({
                  topBigTitle,
                  content
                });
            } else {
              this.$refs[type].setDataHandle(content);
            }
          this.$refs[type].setRouteHandle(this.routesList);
        });
      };
    },
    // 清空当前模块数据
    clearCurModelHandle(type,id) {
      this.$refs[type].resetHandle();
      let curIndex = this.templModel.findIndex(cur => cur.type == type && cur.id == id);
    
      setTimeout(() => {
        this.templModel.splice(curIndex, 1);
        const {id: bottomNavId} = this.templModel.find(cur => cur.type == 'bottomNav');
        this.activeBlockId = bottomNavId;
        this.activeName = '1';
        this.activeOpenName = ['1', '1-1'];
      }, 300);
    },
    // 更新模板原子菜单的设置数据
    updateFormModel({type, content}) {
      console.log(type, 'type')
      console.log(content, 'content@@@')
      let id = this.activeBlockId;
      let curIndex = this.templModel.findIndex(cur => cur.type == type && cur.id == id);
      // banner新、分类这2菜单有：含有独立的中英文标签
      if (type == 'bannerNew' || type == 'classifyType') {
        this.$set(this.templModel[curIndex], 'content', content.mainArray);
        this.$set(this.templModel[curIndex], 'topBigTitle', {
          mainTagName: content.mainTagName,
          mainTagNameEn: content.mainTagNameEn,
        });
      } else if (type == 'bottomNav') {
        this.$set(this.templModel[curIndex], 'content', content);
      } else {
        this.$set(this.templModel[curIndex], 'content', content.mainArray);
      }
      console.log(this.templModel);
    },
    // 返回功能
    goBackHandle() {
      this.$msgbox({
        message: '',
        center: true,
        showClose: false,
        closeOnClickModal: false,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonClass: 'ml30',
        title: '请确认是否放弃当前编辑的内容 ?',
      }).then(() => {
        this.routerHandle();
      }).catch(() => {
        this.$message.info('已取消');
      });
    },
    // 保存功能
    saveHandle() {
      // if (!this.templName) return this.$message.error('模板名称不能为空');
      if (this.isEdit) {
        this.moduleUpdateReq(); // 编辑模板请求
      } else {
        this.moduleSaveReq(); // 新增模板请求
      }
    },
    // 路由跳转功能
    routerHandle() {
      const curView = this.$route;
      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          // 跳转回列表页
          this.$router.replace({path: 'indexConf'});
        });
      });
    }
  }
}
</script>

<style lang="scss" scoped>
  .index-conf-add {
    padding: 20px;
    .top {
      height: 55px;
      padding: 0 20px;
      box-sizing: border-box;
      margin-bottom: 8px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0px 0px 5px rgb(0 0 0 / 35%);
      .modify-title {
        width: 300px;
        .text {
          color: #666;
          display: inline-block;
          margin-right: 5px;
        }
        ::v-deep {
          .el-input {
            width: 200px;
            display: inline-block;
          }
        }
      }
      .btns {
        ::v-deep {
          .el-button--small.is-round {
            padding: 9px 23px;
          }
        }
      }
    }
    .content {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;
      .aside {
        .tips {
          height: 40px;
          line-height: 40px;
          margin-bottom: 0;
          margin-top: 0;
          .text {
            width: 200px;
            display: inline-block;
            color: #FFF;
            font-weight: 700;
            font-size: 16px;
            text-align: center;
            box-shadow: 0px 0px 5px rgb(0 0 0 / 65%);
            background-color: rgba(85, 85, 85, 1);
            .small {
              font-size: 12px;
              margin-left: 2px;
              font-weight: 300;
            }
          }
        }
        .menus {
          width: 200px;
          .custom-menus {
            box-shadow: 0px 0px 5px rgb(0 0 0 / 35%);
            .image {
              width: 100%;
            }
            ::v-deep {
              .el-submenu__title {
                border-bottom: 1px solid #c9c9c9;
              }
              .el-submenu__title:hover, .el-submenu__title:focus {
                background-color: #d7d7d7 !important;
              }
              .el-menu-item:hover, .el-menu-item:focus {
                background-color: #F8F8F8 !important;
              }
              li.el-menu-item {
                height: unset;
                min-height: 50px !important;
                padding: 0 15px !important;
                background-color: #F8F8F8 !important;
              }
              .el-submenu.is-opened {
                .el-submenu__title {
                  span {
                    color: #169bd5;
                  }
                }
                .el-menu-item {
                  border: 1px solid #169bd5;
                  box-shadow: 0px 0px 5px rgb(22 155 213 / 35%);
                }
              }
            }
          }
        }
      }
      .priview {
        width: 450px;
        min-height: 30px;
        margin-top: 40px;
        background: #fafafa;
        box-shadow: 0px 0px 5px rgb(0 0 0 / 35%);
        .item {
          width: 100%;
          min-height: 40px;
          position: relative;
          border: 1px solid transparent;
          &.active {
            border: 1px solid rgba(22, 155, 213, 1);
            box-shadow: 0px 0px 5px rgb(22 155 213 / 35%);
          }
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
            background: #fefefe;
            border-top:1px solid #f5f5f6;
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
          .tools {
            width: 38px;
            min-height: 30px;
            position: absolute;
            text-align: center;
            left: -45px;
            top: 0;
            box-shadow: 0px 0px 5px rgb(0 0 0 / 35%);
            .image {
              display: block;
              margin: 10px auto;
              width: 14px;
              cursor: pointer;
            }
          }
        }
      }
      .body {
        width: 600px;
        box-shadow: 0px 0px 5px rgb(0 0 0 / 35%);
      }
    }
  }
</style>
<style lang="scss" scoped>
.bannerNew_box{
  overflow-x: scroll;
  h3{
    padding: 0;
    margin: 0;
    font-size: 14px;
    font-weight: normal;
    padding: 10px 0 10px 15px;
    color: #010101;
    font-weight: bold;
  }
  ul{
    padding: 0;
    margin: 0;
    margin-left:15px;
    width:2000px;
    li{
      width:260px;
      height: 260px;
      overflow: hidden;
      margin-right:10px;
      margin-bottom: 10px;
      img{
        height: 100%;
        width: 100%;
        border-radius:5px;
      }
    }
  }
}
.tabPageBox{
  overflow-x: scroll;
  overflow-y: hidden;
  ul{
    padding: 0;
    margin: 0;
    li{
      float: left;
      margin-left:15px;
      font-size: 14px;
      width:50px;
      height: 40px;
      margin-top:5px;
      span{
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width:50px;
        text-align: center;
        border-radius: 3px;
        height:30px;
        line-height: 30px;
        margin-top:5px;
        color: #adadbc;
      }
      span.cur{
        color: #fff;
        background: #101010;
      }
    }
  }
}
.classifyTypeBox{
  padding-left: 15px;
  ul,p{
    margin: 0;
    padding: 0;
  }
  h3{
    font-size: 14px;
    font-weight: bold;
  }
  .wrapbox{
    overflow-x: scroll;
  }
  ul{
    padding: 5px;
  }
  li{
    width:180px;
    height: 180px;
    background: #fff;
    position: relative;
    margin-right:10px;
    margin-bottom: 15px;
    border-radius:5px;
    box-shadow:2px 2px 10px #cfcbcb;
    .perfecIMG{
      width:180px;
      height: 130px;
      position: absolute;
      top:0;
      left:0;
      padding: 7px;
      img{
        height: 100%;
        width:100%;
        border-radius: 5px;
      }
    }
    .logoIMG{
      position: absolute;
      top:100px;
      left:15px;
      height: 45px;
      width:45px;
      img{
        height: 100%;
        width:100%;
        border-radius: 9px;
        border: 2px solid #fff;
      }
    }
    .serNameBox{
      position: absolute;
      bottom: 10px;
      left:14px;
      font-size: 13px;
      width: 160px;
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #151515;
    }
  }
}
</style>