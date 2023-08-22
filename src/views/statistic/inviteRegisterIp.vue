<template>
  <div class="inviteRegisterIp">
    <el-form :model="queryParams" :rules="rules" ref="queryForm" :inline="true">
      <el-form-item label="注册-区号" prop="areaCode">
        <el-select
          v-model="queryParams.areaCode"
          clearable
          placeholder="请选择"
        >
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="(item, index) in telPerfixArr"
            :label="item.label"
            :value="item.label"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="输入手机号"
          clearable
          maxlength="11"
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="queryParams.email"
          placeholder="输入邮箱"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          v-hasPermi="['member:auth:list']"
          type="primary"
          :loading="loading"
          icon="el-icon-search"
          @click="search(1)"
          >查询</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      @sort-change="sortChange"
      v-loading="loading"
      border
      style="width: 100%"
    >
      <el-table-column prop="ipAddr" label="注册IP" align="center">
      </el-table-column>
      <el-table-column
        prop="totalWhalePeas"
        sortable="custom"
        label="相同IP注册人数"
        align="center"
      >
        <template slot-scope="{ row }">
          <div
            @click="seeDetailsClick(row)"
            style="color: #61affe; cursor: pointer; text-decoration: underline"
          >
            <p>{{ row.totalMember }}</p>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="createAt" label="更新日期" align="center">
        <template slot-scope="{ row }">
          {{
            row.updateTime
              ? $dayjs(row.updateTime).format("YYYY-MM-DD HH:mm:ss")
              : "-"
          }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="float: right; padding-top: 20px"
      @current-change="search"
      :page-sizes="[10, 20, 30]"
      @size-change="handleSizeChange"
      :current-page.sync="pageIndex"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage"
    >
    </el-pagination>

    <inviteDialog ref="inviteDialog"></inviteDialog>
  </div>
</template>

<script>
import { queryStartTypes, getInviteeIpStatPage } from "@/api/om/white";
import { userAreaPhone } from "@/api/pointsMgmt/starTasks";
import inviteDialog from "./modules/inviteDialog.vue";
export default {
  components: {
    inviteDialog,
  },
  data() {
    let validatePhone = (rule, value, callback) => {
      if (!/^1[3456789]\d{9}$/.test(value) && value !== "") {
        return callback(new Error("请输入正确的手机号码"));
      }
      callback();
    };
    return {
      rules: {
        phone: [{ validator: validatePhone, trigger: "blur" }],
      },
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      queryParams: {
        phone: "",
        email: "",
        areaCode: "",
        sortDesc: true,
      },
      tableData: [],
      loading: false,
      telPerfixArr: [],
    };
  },
  created() {
    this.getAreaCode();
  },
  mounted() {
    // this.search();
  },
  methods: {
    // 获取区号数据
    getAreaCode() {
      userAreaPhone().then((response) => {
        if (+response.code === 200) {
          this.telPerfixArr = response.data.list || [];
        }
      });
    },
    // 相同ip注册人数点击
    seeDetailsClick(row) {
      this.$refs.inviteDialog.seeDetailsClick(row);
    },
    // 相同ip注册人数排序
    sortChange({ column, prop, order }) {
      let sortDesc = true;
      if (order) {
        sortDesc = order === "ascending";
      }
      this.queryParams.sortDesc = sortDesc;
      this.search();
    },
    // 查询数据
    search(pgi) {
      this.$refs["queryForm"].validate((valid) => {
        if (!this.queryParams.phone && !this.queryParams.email) {
          this.$message.error("请输入手机号或者邮箱");
          return false;
        }
        if (valid) {
          if (pgi) this.pageIndex = pgi;
          let _params = {
            currentPage: this.pageIndex,
            pageSize: this.pageSize,
            statRegisteIP: true,
          };
          this.loading = true;
          getInviteeIpStatPage({..._params,...this.queryParams}).then((response) => {
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
          }).catch((error)=>{
            this.loading = false;
          });
        }
      });
    },
    // 分页切换回调
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.search();
    },
  },
};
</script>

<style lang="scss">
.inviteRegisterIp {
  padding: 20px;
}
</style>
