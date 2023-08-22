<template>
  <div class="sub-banner">
    <div class="top-search">
      <el-form ref="bannerForm" inline :model="bannerForm" label-width="90px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="banner名称" prop="bannerName">
              <el-input clearable class="align-width" v-model="bannerForm.bannerName" placeholder="请输入banner名称"></el-input>
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
            <el-form-item label="banner位置" prop="dictCode">
              <el-select class="align-width" clearable v-model="bannerForm.dictCode" placeholder="请选择banner位置">
                <el-option v-for="{dictName, dictCode} in positions" :key="dictCode" :label="dictName" :value='dictCode'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="fr mr0">
              <el-button class="mr20" type="primary" @click="onSearch" v-hasPermi="['operation:banner:page']">查询</el-button>
              <el-button type="primary" @click="handleTabBtn({}, 'Add')" v-hasPermi="['operation:banner:save']">新增Banner</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="banner-table">
      <el-table border :data="tableData" style="width: 100%" @sort-change="sortFunction">
        <el-table-column prop="id" label="banner编号" align="center" width="100" :formatter="formatter"></el-table-column>
        <el-table-column prop="createdAt" sortable="custom" align="center" label="添加时间" width="100" :formatter="formatter"></el-table-column>
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
        <el-table-column prop="remark" align="center" label="备注" :formatter="formatter"></el-table-column>
        <el-table-column align="center" label="操作" width="170">
          <template slot-scope="{row}">
            <el-button size="mini" type="primary" v-hasPermi="['operation:banner:edit']" @click="handleTabBtn(row, 'Edit')">编辑</el-button>
            <el-button v-if="!row.enabled" size="mini" type="danger" v-hasPermi="['operation:banner:delete']" @click="delBanner(row)">删除</el-button>
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
import {bannerPageList, bannerDelete, bannerDictCodes} from '@/api/om/banner';

export default {
  name: 'SubBanner',
  data () {
    return {
      positions: [],
      startDate: [],
      endDate: [],
      bannerForm: {
        bannerName: '',
        dictCode: '',
        startDateBegin: '',
        startDateEnd: '',
        endDateBegin: '',
        endDateEnd: '',
        dictType: 1,
        orderItemList: [
          {
            asc: true,
            column: 'created_at'
          }
        ],
      },
      pager: {
        curPage: 1,
        size: 10,
        total: 0,
      },
      tableData: [],
    }
  },
  mounted () {
    this.bannerDictCodesRequest();
    this.bannerPageListRequest();
  },
  methods: {
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
        dictCode = this.positions.filter(e => e.dictCode == row[key]);
        return dictCode.length ? dictCode[0].dictName : '-';
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
      this.$set(this.bannerForm.orderItemList, 0, {asc, column});
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
        this.bannerDeleteRequest([id]);
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
        const {code, message, data: {list, pageSize, total}} = await bannerPageList(rqData);
        if (code == 200) {
          this.tableData = list;
          this.pager.size = pageSize;
          this.pager.total = total;
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
    // 删除banner
    async bannerDeleteRequest (ids, loading) {
      try {
        const {code, message} = await bannerDelete({ids});
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
        const {code, message, data} = await bannerDictCodes({
          dictType: 1
        });
        if (code == 200) {
          this.positions = data;
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
      const query = type == 'Add' ? {type} : {type, id: row.id};

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          // 跳转页面到编辑/详情
          this.$router.replace({
            query,
            path: type == 'Add' ? 'addSubBanner' : 'editSubBanner',
          });
        });
      });
    },
  }
}
</script>

<style lang="scss" scoped>
  .sub-banner {
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
