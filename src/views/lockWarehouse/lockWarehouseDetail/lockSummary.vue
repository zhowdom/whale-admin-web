<template>
  <div class="jdtDetailBox">
    <el-form :model="queryParams" :rules="rules" ref="queryForm" :inline="true">

      <el-form-item label="币种" prop="coinName">
        <el-select v-model="queryParams.coinName" clearable placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(item, index) in daiCoinSettingArr" :label="item" :value="item" :key="index"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :loading="loading" icon="el-icon-search" @click="search(1)">查询</el-button>
        <!-- <el-button v-show="false" type="primary" :loading="loading" icon="el-icon-download" @click="export2Excel.currentPage(ctx, 'add')">导出</el-button> -->
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" style="width: 100%">
      <el-table-column prop="coinName" label="币种">
      </el-table-column>
      <el-table-column prop="totalLock" label="累计锁仓中">
      </el-table-column>
      <el-table-column prop="totalAvailable" label="累计已释放">
      </el-table-column>
      <!-- <el-table-column prop="createdAt" label="时间">
        <template slot-scope="{row}">
          {{row.createdAt ? $dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
      </el-table-column> -->
    </el-table>

    <el-pagination style="margin-top:10px;" @current-change="search" :page-sizes="[10, 20, 30]" @size-change="handleSizeChange"
                   :current-page.sync="pageIndex" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalPage">
    </el-pagination>

  </div>
</template>
  
  <script>
import { coinLockStatistics } from "@/api/lockWarehouse";
import { daiCoinSettingList } from "@/api/xhgjSpark_api/daiCoinSetting.js";
export default {
  components: {},
  data() {
    var validatePhone = (rule, value, callback) => {
      if (!/^1[3456789]\d{9}$/.test(value) && value !== "") {
        return callback(new Error("请输入正确的手机号码"));
      }
      callback();
    };
    return {
      rules: {
        phone: [{ validator: validatePhone, trigger: "blur" }],
      },
      loading: false,
      queryParams: {
        coinName: "",
      },
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      tableData: [],
      daiCoinSettingArr: [],
    };
  },
  created() {
    this.daiCoinSettingList();
  },
  mounted() {
    this.search(1);
  },
  watch: {},
  methods: {
    daiCoinSettingList() {
      daiCoinSettingList({}).then((response) => {
        if (response.code === 200) {
          this.daiCoinSettingArr = JSON.parse(JSON.stringify(response.data));
        } else {
          this.daiCoinSettingArr = [];
          this.$message.error(response.message);
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.search();
    },
    search(pgi) {
      this.$refs["queryForm"].validate((valid) => {
        if (valid) {
          if (pgi) this.pageIndex = pgi;
          let _params = {
            transType: 1,
            pageSize: this.pageSize,
            currentPage: this.pageIndex,
            ...this.queryParams,
          };
          this.loading = true;
          coinLockStatistics(_params).then((response) => {
            if (response.code === 200) {
              this.tableData = response.data.list;
              this.totalPage = response.data.total;
              this.loading = false;
            } else {
              this.tableData = [];
              this.totalPage = 0;
              this.pageSize = 10;
              this.loading = false;
              this.$message.error(response.message);
            }
          });
        }
      });
    },
  },
};
</script>
  
  <style lang="scss" scoped>
.tofuJdt {
  li {
    width: 200px;
    height: 100px;
    border-radius: 10px;
    text-align: center;
    border: 1px solid #eaeefb;
    float: left;
    margin-right: 20px;
  }
}
</style>
  
  