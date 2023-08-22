<template>
  <div class="goods-sort">
    <div class="classification">
      <div class="header">
        <i></i>
        <span>选择分类</span>
      </div>
      <div class="body">
        <div class="class-wrap">
          <!-- 一级分类 -->
          <el-card class="main-class">
            <div slot="header">
              <span>选择一级分类</span>
            </div>
            <template v-if="level1.length">
              <div
                v-for="{categoryName, iconUrl, categoryId, showStatus} in level1"
                v-show="showStatus"
                :key="categoryId"
                :class="{item:true,active:pid==categoryId}"
              >
                <div class="label">{{categoryName}}</div>
                <div class="img mr20">
                  <img v-show="iconUrl" :src="iconUrl" alt="">
                </div>
                <div class="icon">
                  <i class="el-icon-arrow-right"></i>
                </div>
              </div>
            </template>
            <div class="no-class" v-else>
              <i class="el-icon-info"></i>暂无分类
            </div>
          </el-card>

          <div class="middle-link">
            <span>
              <i class="el-icon-right"></i>
            </span>
          </div>

          <!-- 二级分类 -->
          <el-card class="sub-class">
            <div slot="header">
              <span>选择二级分类</span>
            </div>
            <template v-if="level2.length">
              <div
                v-for="{categoryName, iconUrl, categoryId, showStatus} in level2"
                v-show="showStatus"
                :key="categoryId"
                :class="{item:true,active:cid==categoryId}"
              >
                <div class="label">{{categoryName}}</div>
                <div class="img mr20">
                  <img v-show="iconUrl" :src="iconUrl" alt="">
                </div>
              </div>
            </template>
            <div class="no-class" v-else>
              <i class="el-icon-info"></i>暂无分类
            </div>
          </el-card>
        </div>

        <div class="bottom-txt">
          <div class="select-tips">您当前选择的商品类别是：</div>
          <div class="select-item">{{pname}} {{cname?`&gt; ${cname}`:''}}</div>
        </div>

      </div>
    </div>

    <el-divider></el-divider>

    <div class="parameter">
      <div class="header mb20">
        <i></i>
        <span>根据分类录参数</span>
      </div>
      <div class="body">
        <div class="base-txt bottom mb20">
          商品参数：
        </div>
        <el-checkbox-group class="input-class group mb35" v-model="paramList" disabled>
          <template v-for="(item, index) in pList">
            <el-checkbox :label="item" :key="index">
              {{item}}
            </el-checkbox>
          </template>
        </el-checkbox-group>

        <ul class="info-item-ul" v-if="paramList.length">
          <template v-for="(item, index) in paramList">
            <li :class="lastLi(index)" :key="index">{{item}}</li>
            <li :class="lastLi(index)">
              <el-input v-model="args[item]" disabled placeholder="请输入内容"></el-input>
            </li>
          </template>
        </ul>
      </div>
    </div>

    <el-divider></el-divider>

    <div class="text-center mt30 mb20">
      <el-button type="primary" @click="next">下一步, 查看商品信息</el-button>
    </div>

  </div>
</template>

<script>
import {session} from '@/utils/storage';
import {paramsDetail, noPageCategory, productDetail} from '@/api/goods/index';

export default {
  name: 'GoodsSort',
  data() {
    return {
      pList: [],
      paramList: [],
      level1: [],
      level2: [],
      pid: '',
      cid: '',
      args: {},
      pname: '',
      cname: '',
      part1: {},
      part2: {},
      part3: {},
    }
  },
  computed: {
    lastLi() {
      return index => {
        const lastIdx = this.paramList.length - 1;
        return index == lastIdx ? 'no-border-bottom' : '';
      };
    }
  },
  mounted () {
    this.noPageCategoryRequest();
    this.productDetailReq();
  },
  methods: {
    next() {
      // 本地暂存
      session.set('part1', this.part1);
      session.set('part2', this.part2);
      session.set('part3', this.part3);
      session.set('pname', this.pname);
      session.set('cname', this.cname);
      this.$emit('updateStep', 2);
    },
    // 查询商品分类
    async noPageCategoryRequest (parentId = null) {
      try {
        const {data: {list}} = await noPageCategory({parentId});

        if (parentId !== null) {
          this.level2 = list;
          if (!list.length) this.paramsDetailRequest(parentId);
        } else {
          this.level1 = list;
        };
      } catch (error) {
        // ...
      }
    },
    // 查询参数列表
    async paramsDetailRequest (categoryId) {
      try {
        const {data} = await paramsDetail({categoryId});
        if (data) {
          this.pList = data.name;
        } else {
          this.pList = [];
        };
      } catch (error) {
        console.log(error);
      }
    },
    // 查询商品详情
    async productDetailReq () {
      try {
        const productId = session.get('productId');
        const {data: {
          firstCategoryId, secondCategoryId, args,
          name, title, brandId,summary, templateId, itemNo, volumes, weights, autoUpTiming, services, remark, keywords, recommended, commission, showTip,
          items, description, refer, images, sellerId, primaryImage, purchaseMin, purchaseMax, soldOutTime, activityImage, couponId, showSoldOut, payWay
        }} = await productDetail({productId});
        let {day, hour, minute} = soldOutTime || {};
        day === undefined && (day = '');
        hour === undefined && (hour = '');
        minute === undefined && (minute = '');

        if (secondCategoryId !== '') await this.noPageCategoryRequest(firstCategoryId);
        await this.categoryNames(firstCategoryId, secondCategoryId);
        this.args = args;
        this.pid = firstCategoryId;
        this.cid = secondCategoryId;
        this.paramList = Object.keys(args);

        this.part1 = {firstCategoryId, secondCategoryId, args};
        this.part2 = {
          name, title, brandId,summary, templateId, itemNo, volumes, weights,
          autoUpTiming, services, remark, keywords, recommended, commission,
          purchaseMin, purchaseMax, day, hour, minute, showTip, showSoldOut
        };
        this.part3 = {items, description, refer, images, sellerId, primaryImage, activityImage, couponId, payWay};
      } catch (error) {
        console.error(error);
      }
    },
    // 获取分类名称
    categoryNames (pid, cid) {
      if (pid !== '') {
        this.level1.some(({categoryId, categoryName}) => {
          this.pname = categoryId == pid ? categoryName : '';
          return categoryId == pid;
        });
      };

      if (cid !== '') {
        this.level2.some(({categoryId, categoryName}) => {
          this.cname = categoryId == cid ? categoryName : '';
          return categoryId == cid;
        });
      };

      const targetId = cid === '' ? pid : cid;
      this.paramsDetailRequest(targetId);
    }
  }
}
</script>

<style lang="scss" scoped>
  .goods-sort {
    .classification,
    .parameter {
      .header {
        position: relative;
        display: inline-block;
        color: #fff;
        width: 160px;
        height: 50px;
        line-height: 50px;
        font-weight: 500;
        background: #9ca7b5;
        margin-bottom: 40px;
        i {
          background: #fff;
          height: 16px;
          display: inline-block;
          width: 11px;
          border: 5px solid #fff;
          border-bottom-color: #9ca7b5;
          margin: 17px 5px 0 15px;
          border-radius: 1px;
          vertical-align: top;
        }
        &::after {
          content: "";
          height: 0px;
          position: absolute;
          width: 80px;
          background: #9ca7b5;
          right: -80px;
          border: 25px solid #fff;
          border-left-width: 18px;
          border-left-color: #9ca7b5;
        }
      }
      .body {
        .base-txt {
          text-align: left;
          font-size: 14px;
          color: #666;
          .el-select {
            width: 280px;
          }
          &.bottom {
            text-align: left;
          }
        }
        .add-btns {
          margin-bottom: 10px;
        }
        .class-wrap {
          width: 1100px;
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          justify-content: space-between;
          .main-class,
          .sub-class {
            width: 400px;
            &::v-deep {
              .el-card__header {
                background:#f9f9f9;
                font-size: 14px;
                div {
                  height: 28px;
                  line-height: 28px;
                  display: flex;
                  justify-content: space-between;
                }
              }
              .el-card__body {
                padding: 0;
                min-height: 42px;
                max-height: 350px;
                overflow: auto;
              }
            }
            .no-class {
              display: flex;
              align-items: center;
              justify-content: center;
              color: #bbb;
              min-height: 42px;
              font-style: italic;
              font-size: 15px;
              font-weight: 500;
              i {
                font-size: 18px;
                margin-right: 3px;
              }
            }
            .item {
              height: 42px;
              line-height: 42px;
              padding: 0 15px;
              font-size: 13px;
              border-bottom: 1px solid #e6ebf5;
              .label {
                float: left;
                width: 200px;
                height: 42px;
                font-weight: 600;
                color: #666;
              }
              .img {
                float: left;
                width: 100px;
                height: 42px;
                img {
                  width: 100%;
                  height: 30px;
                  margin-top: 6px;
                }
              }
              .icon {
                float: right;
                i {
                  font-weight: 700;
                }
              }
              &.active {
                background: #f2f2f2;
                .label {
                  color: #6799FF;
                }
                .icon {
                  color: rgb(26, 188, 156);
                }
              }
              &:hover {
                background: #f2f2f2;
                .label {
                  color: #6799FF;
                }
                .icon {
                  color: rgb(26, 188, 156);
                }
              }
            }
          }
          .middle-link {
            align-self: center;
            span {
              width: 60px;
              height: 60px;
              display: block;
              border-radius: 50%;
              border: 4px solid #ccc;
              i {
                font-size: 50px;
                font-weight: 800;
                color: #ccc;
              }
            }
          }
        }
        .bottom-txt {
          margin-top: 20px;
          font-size: 14px;
          .select-tips {
            color: #666;
            display: inline-block;
          }
          .select-item {
            color: #F04844;
            display: inline-block;
          }
        }
        .input-class {
          width: 1100px;
          &.group {
            ::v-deep .el-checkbox {
              line-height: 36px;
              .el-checkbox__label {
                display: inline-block;
                width: 220px;
                white-space: break-spaces;
                vertical-align: text-top;
              }
            }
          }
        }
        .info-item-ul {
          margin: 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          border: 1px solid #DCDFE6;
          li {
            width: 200px;
            padding: 6px;
            text-align: center;
            min-height: 49px;
            line-height: 36px;
            color: #666;
            font-size: 14px;
            border-bottom: 1px solid #DCDFE6;
            &:nth-child(even) {
              width: calc(100% - 200px);
              border-left: 1px solid #DCDFE6;
            }
          }
          .no-border-bottom {
            border-bottom: none;
          }
        }
      }
    }
  }
</style>
