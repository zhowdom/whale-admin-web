<template>
  <div class="fill-goods-sort">
    <div class="classification">
      <div class="header">
        <i></i>
        <span>选择分类</span>
      </div>
      <div class="body">
        <div class="base-txt mb30">
          <span class="">您最近使用的商品分类：</span>
          <el-select v-model="used" placeholder="请选择商品分类" clearable @change="handleRecentlyUsedChange">
            <el-option
              v-for="(item, index) in recentlyUsed"
              :key="index"
              :label="`${item.pname}${item.cid?' > '+item.cname:''}`"
              :value="`${item.pname},${item.cname},${item.pid},${item.cid}`">
            </el-option>
          </el-select>
        </div>

        <div class="class-wrap">
          <!-- 一级分类 -->
          <el-card class="main-class">
            <div slot="header">
              <span>选择一级分类</span>
              <el-button size="mini" v-hasPermi="['goods:category:save']" type="primary" @click="addLevel(1)">添加</el-button>
            </div>
            <template v-if="level1.length">
              <div
                v-for="{categoryName, iconUrl, categoryId, showStatus} in level1"
                v-show="showStatus"
                :key="categoryId"
                :class="{item:true,active:pid==categoryId}"
                @click="selectLevel1(categoryName, categoryId)"
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
              <el-button size="mini" v-if="pid" v-hasPermi="['goods:category:save']" type="primary" @click="addLevel(2)">添加</el-button>
              <el-button size="mini" v-else disabled type="primary">添加</el-button>
            </div>
            <template v-if="level2.length">
              <div
                v-for="{categoryName, iconUrl, categoryId, showStatus} in level2"
                v-show="showStatus"
                :key="categoryId"
                :class="{item:true,active:cid==categoryId}"
                @click="selectLevel2(categoryName, categoryId)"
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
          <el-button size="mini" v-if="hasLevel2?cid!=='':pid!==''" type="primary" v-hasPermi="['goods:params:save','goods:params:edit']" @click="addParam">添加</el-button>
          <el-button size="mini" v-else disabled type="primary">添加</el-button>
        </div>
        <el-checkbox-group class="input-class group mb35" v-model="paramList">
          <template v-for="(item, index) in pList">
            <el-checkbox :label="item" :key="index" @change="changeCheBox">
              {{item}}
            </el-checkbox>
          </template>
        </el-checkbox-group>

        <ul class="info-item-ul" v-if="paramList.length">
          <template v-for="(item, index) in paramList">
            <li :class="lastLi(index)" :key="index">{{item}}</li>
            <li :class="lastLi(index)">
              <el-input v-model="args[item]" placeholder="请输入内容"></el-input>
            </li>
          </template>
        </ul>
      </div>
    </div>

    <el-divider></el-divider>

    <div class="text-center mt30 mb20">
      <el-button type="primary" @click="next">下一步, 填写商品信息</el-button>
    </div>

  </div>
</template>

<script>
import {session} from '@/utils/storage';
import {addCategory} from '@/api/goods/goodsAbout';
import {paramsSave, paramsUpdate, paramsDetail, noPageCategory, productDetail} from '@/api/goods/index';

export default {
  name: 'EditGoodsSort',
  data() {
    return {
      recentlyUsed: [],
      pList: [],
      used: '',
      paramList: [],
      level1: [],
      level2: [],
      pid: '',
      cid: '',
      pname: '',
      cname: '',
      paramsId: '',
      args: {},
      part1: {},
      hasLevel2: false,
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
  activated () {
    this.productDetailReq();
  },
  mounted () {
    this.noPageCategoryRequest();
    this.recentlyUsed = session.get('recentlyUsed');
  },
  methods: {
    // 设置初始值
    setInitData (pid = '', cid = '', pname = '', cname = '') {
      this.pid = pid;
      this.cid = cid;
      this.pname = pname;
      this.cname = cname;
    },
    // 修改最近使用的商品分类
    async handleRecentlyUsedChange (itemStr) {
      if (!itemStr) {
        this.setInitData();
        this.used = '';
        return;
      };

      const [pname, cname, pid, cid] = itemStr.split(',');
      if (cid === '') {
        this.setInitData(pid, cid, pname, cname);
        this.hasLevel2 = false;
      } else {
        await this.noPageCategoryRequest(pid);
        const hasCurLev = this.level2.some(el => el.categoryId == cid);

        if (hasCurLev) {
          this.setInitData(pid, cid, pname, cname);
        } else {
          this.setInitData();
          this.used = '';
          this.$message.error('您当前选择的最近使用商品分类已被删除，请重新选择！');
        }
      };
    },
    // 选中参数改变
    changeCheBox (value, event) {
      const key = event.target.value;

      if (value) {
        this.$set(this.args, key, '');
      } else {
        this.$delete(this.args, key);
      };
    },
    // 添加分类
    addLevel(arg) {
      const level = arg == 1 ? '一级' : '二级';

      this.$prompt(`请输入${level}分类`, '提示', {
        showClose: false,
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入分类',
        inputPattern: /^.{1,20}$/,
        inputErrorMessage: '分类字符长度1-20'
      }).then(({value}) => {
        if (arg == 1) {
          const hasSameLev1 = this.level1.some(({categoryName}) => categoryName == value);
          if (hasSameLev1) {
            this.$message.error('添加失败，分类名称不能重复！');
            return;
          } else {
            this.addCategoryRequest(value, 0);
          };
        } else {
          const hasSameLev2 = this.level2.some(({categoryName}) => categoryName == value);
          if (hasSameLev2) {
            this.$message.error('添加失败，分类名称不能重复！');
            return;
          } else {
            this.addCategoryRequest(value, this.pid);
          };
        };
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消添加分类'
        });
      });
    },
    // 添加参数
    addParam() {
      this.$prompt('请输入商品参数', '提示', {
        showClose: false,
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入商品参数',
        inputPattern: /^.{1,20}$/,
        inputErrorMessage: '分类字符长度1-20'
      }).then(({value}) => {
        this.editParam(value);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消添加参数'
        });
      });
    },
    // 选择一级分类
    selectLevel1 (name, id) {
      this.pid = id;
      this.pname = name;
      this.cid = '';
      this.cname = '';
      this.pList = [];
      this.paramList = [];
      this.noPageCategoryRequest(id);
    },
    // 选择二级分类
    selectLevel2 (name, id) {
      this.cid = id;
      this.cname = name;
      this.pList = [];
      this.paramList = [];
      this.hasLevel2 = true;
      this.paramsDetailRequest(id);
    },
    // 获取分类名称
    async categoryNames (pid, cid) {
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
      await this.paramsDetailRequest(targetId);
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

        items.map(el => this.$delete(el, 'virSales'));

        if (secondCategoryId !== '') await this.noPageCategoryRequest(firstCategoryId);
        await this.categoryNames(firstCategoryId, secondCategoryId);
        this.args = args;
        this.pid = firstCategoryId;
        this.cid = secondCategoryId;
        this.paramList = Object.keys(args);

        const part1Info = {firstCategoryId, secondCategoryId, args};
        const part2Info = {
          name, title, brandId,summary, templateId, itemNo, volumes, weights,
          autoUpTiming, services, remark, keywords, recommended, commission,
          purchaseMin, purchaseMax, day, hour, minute, showTip, showSoldOut
        };
        const part3Info = {
          items, description, refer, images, sellerId, primaryImage, activityImage, couponId, payWay
        };

        session.set('part1Info', part1Info);
        session.set('part2Info', part2Info);
        session.set('part3Info', part3Info);
      } catch (error) {
        console.error(error);
      }
    },
    // 查询商品分类
    async noPageCategoryRequest (parentId = null) {
      try {
        const {data: {list}} = await noPageCategory({parentId});

        if (parentId !== null) {
          this.level2 = list;
          if (!list.length) {
            this.hasLevel2 = false;
            this.paramsDetailRequest(parentId);
          } else {
            this.hasLevel2 = true;
          };
        } else {
          this.level1 = list;
        };
      } catch (error) {
        // ...
      }
    },
    // 添加商品分类
    async addCategoryRequest (categoryName, parentId = null) {
      try {
        const baseData = {
          parentId,
          categoryName,
          showStatus: 1,
          displayOnNavigationBar: 1,
        };
        const {code} = await addCategory(baseData);
        if (code == 200) {
          this.$message.success('添加分类成功');
          if (parentId === 0) {
            await this.noPageCategoryRequest();
          } else {
            await this.noPageCategoryRequest(parentId);
          };
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
          this.paramsId = data.paramsId;
          this.pList = data.name;
        } else {
          this.pList = [];
        };
      } catch (error) {
        // ...
      }
    },
    // 编辑参数字段
    async editParam (value) {
      try {
        let reqFn;
        let reqData;
        let paramsId = this.paramsId;
        let paramsInfo = [...this.pList, value];
        let goodsCategoryId = this.cid !== '' ? this.cid : this.pid;
        paramsInfo = [...new Set(paramsInfo)];

        if (this.pList.length) {
          reqFn = paramsUpdate;
          reqData = {goodsCategoryId, paramsInfo, paramsId};
        } else {
          reqFn = paramsSave;
          reqData = {goodsCategoryId, paramsInfo};
        };

        const {code, message} = await reqFn(reqData);
        if (code == 200) {
          this.$message.success('参数添加成功');
          await this.paramsDetailRequest(goodsCategoryId);
        } else {
          this.$message.error(message);
        };
      } catch (error) {
        // ...
      }
    },
    // 下一步
    next() {
      // 判断是否能跳装下一步
      const canNext = this.hasLevel2 ? this.cid !== '' : this.pid !== '';
      if (!canNext) return this.$message.error('请先选择商品分类！');
      // 一级分类是否被隐藏
      const isLevel1Hidden = this.level1.some(({categoryId, showStatus}) => !showStatus && categoryId == this.pid);
      // 二级分类是否被隐藏
      const isLevel2Hidden = this.level2.some(({categoryId, showStatus}) => !showStatus && categoryId == this.cid);
      if (isLevel1Hidden || isLevel2Hidden) return this.$message.error('当前选择的商品分类已被隐藏无法使用，请修改！');

      this.$set(this.part1, 'firstCategoryId', this.pid);
      this.$set(this.part1, 'secondCategoryId', this.cid);
      this.$set(this.part1, 'args', this.args);

      // 本地暂存
      session.set('part1', this.part1);
      session.set('pname', this.pname);
      session.set('cname', this.cname);
      this.$emit('updateStep', 2);
    },
  }
}
</script>

<style lang="scss" scoped>
  .fill-goods-sort {
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
