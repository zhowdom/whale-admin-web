<template>
  <div class="main-banner">
    <!-- <div class="top-tabs">
      <el-tabs type="border-card" v-model="appPackageType" @tab-click="handleTabClick">
        <el-tab-pane label="鲸丽生活" name="1"></el-tab-pane>
        <el-tab-pane label="新App" name="2"></el-tab-pane>
        <el-tab-pane label="小程序" name="3"></el-tab-pane>
      </el-tabs>
    </div>

    <el-card class="box-card"> -->
      <div class="top-search">
        <el-form ref="bannerForm" inline :model="bannerForm" label-width="90px">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="banner名称" prop="bannerName">
                <el-input class="normal-width" clearable v-model="bannerForm.bannerName" placeholder="请输入banner名称"></el-input>
              </el-form-item>
              <el-form-item label="应用类型" prop="appPackageType">
                <el-select @change="handleChange" class="normal-width" v-model="bannerForm.appPackageType" placeholder="请选择应用类型">
                  <el-option label="网上商城App" :value='1'></el-option>
                  <el-option label="鲸豆App" :value='2'></el-option>
                  <el-option label="网上商城小程序" :value='3'></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="banner位置" prop="dictCode">
                <el-select @change="handleChange" class="normal-width" clearable v-model="bannerForm.dictCode" placeholder="请选择banner位置">
                  <el-option v-for="{name, code} in positions" :key="code" :label="name" :value='code'></el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="渠道来源" prop="bannerName">
                <el-select class="normal-width" clearable v-model="bannerForm.bannerName" placeholder="请选择">
                  <el-option label="全部" :value='-1'></el-option>
                  <el-option label="外链" :value='1'></el-option>
                  <el-option label="内链" :value='2'></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="路由名称" prop="bannerName">
                <el-select
                  filterable
                  clearable
                  remote
                  placeholder="请输入"
                  class="normal-width"
                  :loading="loading"
                  v-model="bannerForm.bannerName"
                  :remote-method="remoteMethod"
                >
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="开始时间" prop="startDate">
                <el-date-picker
                  class="align-width"
                  v-model="startDate"
                  :editable="false"
                  type="datetimerange"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  :default-time="['00:00:00', '23:59:59']"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="到期时间" prop="endDate">
                <el-date-picker
                  class="align-width"
                  v-model="endDate"
                  :editable="false"
                  type="datetimerange"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  :default-time="['00:00:00', '23:59:59']"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item class="fr mr0">
                <el-button :loading="loading" size="small" type="primary" icon="el-icon-search" class="mr15" @click="onSearch" v-hasPermi="['setting:banner:page']">查询</el-button>
                <el-button :loading="loading" size="small" type="success" icon="el-icon-plus" @click="handleTabBtn({}, 'Add')" v-hasPermi="['setting:banner:save']">新增</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="task-table">
        <el-table v-loading="loading" border :data="tableData" style="width: 100%" @sort-change="sortFunction">
          <el-table-column prop="id" label="banner编号" align="center" width="100" :formatter="formatter"></el-table-column>
          <el-table-column prop="createTime" sortable="custom" align="center" label="添加时间" width="100">
            <template slot-scope="{row}">
              {{row.createTime ? $dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="sort" align="center" label="排序" width="120" :formatter="formatter"></el-table-column>
          <el-table-column prop="bannerName" align="center" label="banner名称" width="110" :formatter="formatter"></el-table-column>
          <el-table-column prop="dictCode" align="center" label="广告位置" width="130" :formatter="formatter"></el-table-column>
          <el-table-column prop="pictUrl" align="center" label="banner图片" width="220" :formatter="formatter"></el-table-column>
          <el-table-column prop="startTime" sortable="custom" align="center" label="开始时间" width="130" :formatter="formatter"></el-table-column>
          <el-table-column prop="endTime" sortable="custom" align="center" label="到期时间" width="120" :formatter="formatter"></el-table-column>
          <el-table-column prop="hasUrl" align="center" label="是否配有链接" width="100" :formatter="formatter"></el-table-column>
          <el-table-column prop="enabled" align="center" label="上线/下线" width="100" :formatter="formatter"></el-table-column>
          <!-- <el-table-column prop="clickTimes" align="center" label="点击次数" width="150"></el-table-column> -->
          <!-- <el-table-column prop="orderCount" align="center" label="生成订单" width="160"></el-table-column> -->
          <!-- <el-table-column prop="remark" align="center" label="渠道来源" :formatter="formatter"></el-table-column> -->
          <!-- <el-table-column prop="remark" align="center" label="路由名称" :formatter="formatter"></el-table-column> -->
          <el-table-column prop="remark" align="center" label="备注" :formatter="formatter"></el-table-column>
          <el-table-column align="center" label="操作" width="170">
            <template slot-scope="{row}">
              <el-button size="mini" type="primary" v-hasPermi="['setting:banner:info', 'setting:banner:update']" @click="handleTabBtn(row, 'Edit')">编辑</el-button>
              <el-button v-if="!row.enabled" size="mini" type="danger" v-hasPermi="['setting:banner:delete']" @click="delBanner(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="table-pagination text-right mt10">
          <el-pagination
            :current-page="pager.curPage"
            :page-sizes="[10, 20, 30]"
            :page-size="pager.size"
            :total="pager.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </div>
      </div>
    <!-- </el-card> -->
  </div>
</template>

<script>
const now = Date.now();
// import {bannerPageList, bannerDelete, bannerDictCodes} from '@/api/om/banner';
import {bannerPageList, bannerDelete, bannerDictCodes} from '@/api/om/banner';
import { setRoutLinkList, bigOrSmallBannerAdd, bigOrSmallBannerAlter, bigOrSmallBannerDel, bigOrSmallBannerListQuery, bigOrSmallBannerPositionQuery } from "@/api/games";

export default {
  name: 'SubBanner',
  data () {
    return {
      loading: false,
      positions: [],
      startDate: [],
      endDate: [],
      options: [],
      bannerForm: {
        appPackageType: 1,
        type: 1,
        bannerName: '',
        dictCode: '',
        startDateBegin: '',
        startDateEnd: '',
        endDateBegin: '',
        endDateEnd: '',
        dictType: 2,
        sort: '',
        // orderItemList: [
        //   {
        //     asc: true,
        //     column: 'created_at'
        //   }
        // ],
      },
      pager: {
        curPage: 1,
        size: 10,
        total: 0,
      },
      loading: false,
      tableData: [],
      bigOrSmallBannerPositionArr: []
    }
  },
  created () {
    this.bannerForm.appPackageType = +this.$route.query.appPackageType || 1
  },
  mounted () {
    this.bannerDictCodesRequest();
    this.bannerPageListRequest();
  },
  methods: {
    handleChange (val) {
      this.onSearch(1)
    },
    // tab切换操作
    handleTabClick () {

    },
    // 远程搜索
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true;
        // setTimeout(() => {
        //   this.loading = false;
        //   this.options = this.list.filter(item => {
        //     return item.label.toLowerCase()
        //       .indexOf(query.toLowerCase()) > -1;
        //   });
        // }, 200);
      } else {
        this.options = [];
      }
    },
    // 格式化
    formatter (row, column) {
      let dictCode = [];
      let key = column.property;

      if (key == 'pictUrl') {
        const h = this.$createElement;
        const elmStyle = {padding: '2px'};
        const imgStyle = {display: 'block', borderRadius: '4px', width: '195px'};
        const attrs = {src: row[key], title: 'banner', alt: 'banner'};
        const image = h('img', {style: imgStyle, attrs}, null);
        const elm = h('div', {style: elmStyle}, [image], null)
        return row[key] ? elm : '-';
      } else if (key == 'dictCode') {
        dictCode = this.positions.filter(e => e.code == row[key]);
        return dictCode.length ? dictCode[0].name : '-';
      } else if (key == 'enabled') {
        const h = this.$createElement;
        const style = {color: '#1ABC9C'};
        return row[key] ? h('span', {style}, '上线') : '下线';
      } else if (key == 'hasUrl') {
        return row['clickUrl'] ? '是' : '否';
      }  else if (key == 'endTime') {
        let color = '#606266';
        const set = 3 * 24 * 3600 * 1000;
        const h = this.$createElement;
        if (row[key] != '') {
          const endTime = new Date(row[key]).getTime();
          if (endTime - now <= 0) { // 已过期
            color = '#999999';
          } else if (endTime - now <= set) { // 临近过期（离过期时间小于等于三天
            color = '#FF9900';
          } else {
            color = '#606266';
          }
        };
        const style = {color};
        return h('span', {style}, this.formatDate(row[key], 'YYYY-MM-DD HH:mm:ss', '-'));
      } else if (key == 'createdAt' || key == 'startTime') {
        return this.formatDate(row[key], 'YYYY-MM-DD HH:mm:ss', '-');
      } else {
        return row[key] || '-';
      }
    },
    // 排序
    sortFunction ({prop, order}) {
      const asc = order == 'ascending'; // 是否升序
      const column = this.formatStr(prop); // 格式字符串
      // this.$set(this.bannerForm.orderItemList, 0, {asc, column});
      if (column === 'created_at' && asc === true) {
        this.bannerForm.sort = 1
      } else if (column === 'created_at' && asc === false) {
        this.bannerForm.sort = 2
      } else if (column === 'start_time' && asc === true) {
        this.bannerForm.sort = 3
      } else if (column === 'start_time' && asc === false) {
        this.bannerForm.sort = 4
      } else if (column === 'end_time' && asc === true) {
        this.bannerForm.sort = 5
      } else if (column === 'end_time' && asc === false) {
        this.bannerForm.sort = 6
      }
      this.bannerPageListRequest();
    },
    // 格式日期功能
    formatDate (date, format = 'YYYY-MM-DD', def = '') {
      return date ? this.$dayjs(date).format(format) : def;
    },
    // 格式小驼峰为下划线功能
    formatStr (str) {
      return str ? str.replace(/([A-Z])/g, "_$1").toLowerCase() : '';
    },
    // 删除banneer操作
    delBanner ({id}) {
      this.$confirm('确定要删除此banner吗？', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.bannerDeleteRequest(id);
      }).catch(() => {
        this.$message({type: 'info', message: '已取消删除'});
      });
    },
    // 查询分页数据
    async bannerPageListRequest () {
      try {
        const [endDateBegin, endDateEnd] = this.endDate || [];
        const [startDateBegin, startDateEnd] = this.startDate || [];

        this.bannerForm.endDateBegin = endDateBegin ? endDateBegin + ':00' : '';
        this.bannerForm.endDateEnd = endDateEnd ? endDateEnd + ':59' : '';
        this.bannerForm.startDateBegin = startDateBegin ? startDateBegin + ':00' : '';
        this.bannerForm.startDateEnd = startDateEnd ? startDateEnd + ':59' : '';

        const rqData = {
          ...this.bannerForm,
          pageSize: this.pager.size,
          currentPage: this.pager.curPage,
        }
        this.loading = true
        // const {code, message, data: {list, pageSize, total}} = await bannerPageList(rqData);
        const {code, message, data: {list, pageSize, total}} = await bigOrSmallBannerListQuery(rqData);
        if (code == 200) {
          this.tableData = list;
          this.pager.size = pageSize;
          this.pager.total = total;
          this.loading = false
        } else {
          this.$message.error(message);
          this.loading = false
        }
      } catch (error) {
        this.loading = false
        // ...
      }
    },
    // 删除banner
    async bannerDeleteRequest (id) {
      try {
        // const {code, message} = await bannerDelete({ids});
        const {code, message} = await bigOrSmallBannerDel({id});
        if (code == 200) {
          this.bannerPageListRequest();
          this.$message({type: 'success', message: '删除成功'});
        } else {
          this.$message({type: 'error', message});
        }
      } catch (error) {
        // ...
      }
    },
    // 获取banner位置列表
    async bannerDictCodesRequest () {
      try {
        // const {code, message, data} = await bannerDictCodes({
        //   dictType: 2
        // });
        const {code, message, data} = await bigOrSmallBannerPositionQuery({
          type: 1, // 小Banner
          appPackageType: this.bannerForm.appPackageType
        });
        if (code == 200) {
          this.positions = data.list;
        } else {
          this.$message({type: 'error', message});
        }
      } catch (error) {
        // ...
      }
    },
    // 条件搜索
    onSearch () {
      this.pager.curPage = 1;
      this.bannerPageListRequest();
    },
    // 分页数量修改
    handleSizeChange(val) {
      this.pager.size = val;
      this.bannerPageListRequest();
    },
    // 跳转当前页
    handleCurrentChange(val) {
      this.pager.curPage = val;
      this.bannerPageListRequest();
    },
    // 跳转功能
    handleTabBtn(row, type) {
      const curView = this.$route;
      const query = type == 'Add' ? {type, appPackageType: this.bannerForm.appPackageType} : {type, id: row.id, appPackageType: this.bannerForm.appPackageType};

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          // 跳转页面到编辑/详情
          this.$router.replace({
            query,
            path: type == 'Add' ? 'addSubBannerNew' : 'editSubBannerNew',
          });
        });
      });
    },
  }
}
</script>

<style lang="scss" scoped>
  .main-banner {
    padding: 20px;
    .top-tabs {
      ::v-deep .el-tabs {
        border-bottom: none;
        .el-tabs__content {
          display: none;
        }
      }
    }

    .box-card {
      border-top: 0;
      border-radius: 0;
      box-shadow: 0 2px 4px 0 rgb(0 0 0 / 12%), 0 0 6px 0 rgb(0 0 0 / 4%);
    }
    .top-search  {
      .align-width {
        width: 320px;
      }
      .el-form-item {
        margin-right: 36px;
        ::v-deep .el-form-item__label {
          font-weight: 400;
        }
      }
    }
  }
</style>
