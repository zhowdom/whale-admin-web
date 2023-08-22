<template>
  <div class="pop-ads-mgmt">
    <div class="top-search">
      <el-form ref="mainForm" inline :model="mainForm" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="弹窗广告名称" prop="name">
              <el-input class="align-width" clearable v-model="mainForm.name" placeholder="请输入弹窗广告名称"></el-input>
            </el-form-item>
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
            <el-form-item label="弹窗广告位置" prop="position">
              <el-select class="align-width" clearable v-model="mainForm.position" placeholder="请选择弹窗广告位置">
                <el-option v-for="{label, type} in positions" :key="type" :label="label" :value='type'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="弹出条件" prop="type">
              <el-select class="align-width" clearable v-model="mainForm.type" placeholder="请选择弹出条件">
                <el-option v-for="{label, type} in conditions" :key="type" :label="label" :value='type'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="fr mr0">
              <el-button size="small" class="mr20" type="primary" @click="onSearch" v-hasPermi="['setting:popup_advert_v2:page']">查询</el-button>
              <el-button size="small" type="primary" @click="handleTabBtn({}, 'Add')" v-hasPermi="['setting:popup_advert_v2:save']">添加弹框广告</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="task-table">
      <el-table border :data="tableData" style="width: 100%" @sort-change="sortFunction">
        <el-table-column prop="createTime" align="center" label="添加时间" width="170" :formatter="formatter"></el-table-column>
        <el-table-column prop="name" align="center" label="弹窗广告名称" width="110" :formatter="formatter"></el-table-column>
        <el-table-column prop="position" align="center" label="弹窗广告位置" width="130" :formatter="formatter"></el-table-column>
        <el-table-column prop="imgUrl" align="center" label="广告图片" width="220" :formatter="formatter"></el-table-column>
        <el-table-column prop="startTime" sortable="custom" align="center" label="开始时间" width="170" :formatter="formatter"></el-table-column>
        <el-table-column prop="endTime" sortable="custom" align="center" label="到期时间" width="170" :formatter="formatter"></el-table-column>
        <el-table-column prop="type" label="弹出条件" align="center" width="100" :formatter="formatter"></el-table-column>
        <el-table-column prop="online" align="center" label="上线/下线" width="100" :formatter="formatter"></el-table-column>
        <!-- <el-table-column prop="clickTimes" align="center" label="点击次数" width="150"></el-table-column> -->
        <!-- <el-table-column prop="orderCount" align="center" label="生成订单" width="160"></el-table-column> -->
        <el-table-column prop="remark" align="center" label="备注" :formatter="formatter"></el-table-column>
        <el-table-column align="center" label="操作" width="170">
          <template slot-scope="{row}">
            <el-button size="mini" type="primary" v-hasPermi="['setting:popup_advert_v2:edit']" @click="handleTabBtn(row, 'Edit')">编辑</el-button>
            <el-button v-if="!row.online" size="mini" type="danger" v-hasPermi="['setting:popup_advert_v2:del']" @click="delPopAds(row)">删除</el-button>
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
  </div>
</template>

<script>
const now = Date.now();
import {advertPage, advertDelete} from '@/api/setting/ads';
import {advertPOP_list, advertPOP_Detail, advertPOP_del, advertPOP_add, advertPOP_alter} from '@/api/games';

export default {
  name: 'PopAdsMgmtNew',
  data () {
    return {
      positions: [
        {
          type: 0,
          label: '不限页面',
        },
        {
          type: 1,
          label: '首页',
        },
        {
          type: 4,
          label: '我的',
        }
      ],
      conditions: [
        {
          type: 99,
          label: '所有用户',
        },
        {
          type: 0,
          label: '新注册用户',
        },
        {
          type: 1,
          label: '一星达人',
        },
        {
          type: 2,
          label: '二星达人',
        },
        {
          type: 3,
          label: '三星达人',
        },
        {
          type: 4,
          label: '四星达人',
        },
        {
          type: 5,
          label: '合伙人',
        },
        {
          type: 6,
          label: '团长',
        },
        {
          type: 7,
          label: '高级团长',
        },
      ],
      startDate: [],
      endDate: [],
      mainForm: {
        name: '',
        position: '',
        startTimeStart: '',
        startTimeEnd: '',
        endTimeStart: '',
        endTimeEnd: '',
        type: '',
        sort: '', // 1: 按开始时间升序, 2: 按开始时间降序, 3: 按到期时间升序, 2: 按到期时间降序;
      },
      pager: {
        curPage: 1,
        size: 10,
        total: 0,
      },
      tableData: [],
    }
  },
  activated () {},
  mounted () {
    this.advertPageReq();
  },
  methods: {
    // 格式化
    formatter (row, column) {
      let _localArr = [];
      let key = column.property;

      if (key == 'imgUrl') {
        const h = this.$createElement;
        const elmStyle = {padding: '2px'};
        const imgStyle = {display: 'block', borderRadius: '4px', width: '195px'};
        const attrs = {src: row[key], title: 'popAds', alt: 'popAds'};
        const image = h('img', {style: imgStyle, attrs}, null);
        const elm = h('div', {style: elmStyle}, [image], null)
        return row[key] ? elm : '-';
      } else if (key == 'position' || key == 'type') {
        let localArr = key == 'position' ? this.positions : this.conditions;
        _localArr = localArr.filter(({type}) => type == row[key]);
        return _localArr.length ? _localArr[0].label : '-';
      } else if (key == 'online') {
        const h = this.$createElement;
        const style = {color: '#1ABC9C'};
        return row[key] ? h('span', {style}, '上线') : '下线';
      } else if (key == 'hasUrl') {
        return row['clickUrl'] ? '是' : '否';
      } else if (key == 'endTime') {
        let color = '#606266';
        const set = 3 * 24 * 3600 * 1000;
        const h = this.$createElement;
        if (row[key] != '') {
          const endTime = new Date(row[key]).getTime();
          if (endTime - now <= 0) { // 已过期
            color = '#999999';
          } else if (endTime - now <= set) { // 临近过期（离过期时间小于等于三天)
            color = '#FF9900';
          } else {
            color = '#606266';
          }
        };
        const style = {color};
        return h('span', {style}, this.formatDate(row[key], 'YYYY-MM-DD HH:mm:ss', '-'));
      } else if (key == 'createTime' || key == 'startTime') {
        return this.formatDate(row[key], 'YYYY-MM-DD HH:mm:ss', '-');
      } else {
        return row[key] || '-';
      }
    },
    // 排序
    sortFunction ({prop, order}) {
      const asc = order == 'ascending'; // 是否升序
      if (prop == 'startTime') this.mainForm.sort = asc ? 1 : 2;
      if (prop == 'endTime') this.mainForm.sort = asc ? 3 : 4;
      this.advertPageReq();
    },
    // 格式日期功能
    formatDate (date, format = 'YYYY-MM-DD', def = '') {
      return date ? this.$dayjs(date).format(format) : def;
    },
    // 删除弹窗广告操作
    delPopAds ({id}) {
      this.$confirm('确定要删除此弹窗广告吗？', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.advertDeleteReq(id);
      }).catch(() => {
        this.$message({type: 'info', message: '已取消删除'});
      });
    },
    // 查询分页数据
    async advertPageReq () {
      try {
        const [endTimeStart, endTimeEnd] = this.endDate || [];
        const [startTimeStart, startTimeEnd] = this.startDate || [];

        this.mainForm.endTimeStart = endTimeStart ? endTimeStart + ':00' : '';
        this.mainForm.endTimeEnd = endTimeEnd ? endTimeEnd + ':59' : '';
        this.mainForm.startTimeStart = startTimeStart ? startTimeStart + ':00' : '';
        this.mainForm.startTimeEnd = startTimeEnd ? startTimeEnd + ':59' : '';

        const {code, message, data: {list, pageSize, total}} = await advertPOP_list({
          ...this.mainForm,
          pageSize: this.pager.size,
          currentPage: this.pager.curPage,
          appPackageType: 3
        });

        if (code == 200) {
          this.tableData = list;
          this.pager.size = pageSize;
          this.pager.total = total;
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        throw error;
      }
    },
    // 删除banner
    async advertDeleteReq (id) {
      try {
        const {code, message} = await advertPOP_del({id});
        if (code == 200) {
          this.advertPageReq();
          this.$message.success('删除成功');
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        throw error;
      }
    },
    // 条件搜索
    onSearch () {
      this.pager.curPage = 1;
      this.advertPageReq();
    },
    // 分页数量修改
    handleSizeChange(val) {
      this.pager.size = val;
      this.advertPageReq();
    },
    // 跳转当前页
    handleCurrentChange(val) {
      this.pager.curPage = val;
      this.advertPageReq();
    },
    // 跳转功能
    handleTabBtn(row, type) {
      const curView = this.$route;
      const query = type == 'Add' ? {type, appPackageType: 1} : {type, id: row.id, appPackageType: 1};
      const path = type == 'Add' ? 'addPopAdsMiniNewv2' : 'editPopAdsMiniNewv2';

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          // 跳转页面到编辑/详情
          this.$router.replace({query, path});
        });
      });
    },
  }
}
</script>

<style lang="scss" scoped>
  .pop-ads-mgmt {
    padding: 20px;
    .top-search  {
      .align-width {
        width: 320px;
      }
      .el-form-item {
        margin-right: 36px;
        ::v-deep .el-form-item__label {
          font-weight: 400;
        }
        button {
          padding: 10px 30px;
        }
      }
    }
  }
</style>
