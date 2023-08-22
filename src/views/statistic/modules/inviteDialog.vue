<template>
  <div>

    <el-dialog title="" width="70%" :visible.sync="dialogTableVisible" v-if="dialogTableVisible">
      <el-form :model="queryParams" :rules="rules" ref="queryForm" :inline="true">
        <el-form-item label="注册-区号" prop="areaCode">
          <el-select v-model="queryParams.areaCode" clearable placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, index) in telPerfixArr" :label="item.label" :value="item.label" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="queryParams.phone" placeholder="输入手机号" clearable maxlength="11" size="small" style="width: 240px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" icon="el-icon-search" @click="search(1)">查询
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-hasPermi="['member:member:status']" type="primary" :loading="loading" @click="watchChange(null, 'batchOff')"
                     :disabled="multipleSelection.length <= 0">批量禁用</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border row-key="memberId" :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" :selectable="checkboxSelect" width="50" />
        <el-table-column property="nickName" label="昵称"></el-table-column>
        <el-table-column property="areaCode" label="注册-区号"> </el-table-column>
        <el-table-column property="phone" label="注册手机号"> </el-table-column>
        <el-table-column property="inviteCode" label="邀请码"> </el-table-column>
        <el-table-column property="registeredIp" :label="isSignIn ? '登录IP' : '注册IP'"></el-table-column>
        <el-table-column property="lastLoginAt" :label="isSignIn ? '最新时间' : '更新时间'" width="200">
          <template slot-scope="{ row }">
            {{
            row.lastLoginAt
              ? $dayjs(row.lastLoginAt).format("YYYY-MM-DD HH:mm:ss")
              : "-"
          }}
          </template>
        </el-table-column>
        <el-table-column property="remark" label="备注"></el-table-column>
        <el-table-column property="status" label="状态">
          <template slot-scope="scope">
            <el-switch v-hasPermi="['member:member:status']" v-model="scope.row.statusTransfered" @change="watchChange(scope.row, 'single')"
                       class="customSwitchStyle" active-color="#00A854" active-text="已开启" inactive-color="#F04134" inactive-text="已禁用" />
          </template>
        </el-table-column>
      </el-table>
      <div style="padding-top: 20px; display: flex; justify-content: flex-end">
        <el-pagination @current-change="search" :page-sizes="[10, 20, 30]" @size-change="handleSizeChange" :current-page.sync="pageIndex"
                       :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalPage">
        </el-pagination>
      </div>

    </el-dialog>
    <!--账号启用禁用Dialog-->
    <el-dialog width="29%" title="确定要执行此操作吗？" :visible.sync="dialogFormVisibleStatus" :before-close="cancelSattusClick">
      <el-form :model="formstatus">
        <el-form-item label="备注描述" :label-width="formLabelWidth">
          <el-input v-model="formstatus.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSattusClick">取 消</el-button>
        <el-button :disabled="(formstatus.remark.replace(/(^\s+)|(\s+$)/g, '')).length <= 0" type="primary" @click="sureStatusClick">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fluidList,
  fluidListNEW,
  fluidListDialog,
  diviSourcesTyps,
  queryStartTypes,
} from "@/api/om/white";
import { searchUserList, statusBatchChange } from "@/api/system/userlist";
import { changeUserStatus } from "@/api/system/user";
import { userAreaPhone } from "@/api/pointsMgmt/starTasks";
export default {
  props: {
    isSignIn: {
      type: Boolean,
      default: false,
    },
  },
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
      levelTag: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      queryParams: {
        phone: "",
        areaCode: "",
        needRemark: true
      },
      fhTypesArray: [],
      tableData: [],
      loading: false,
      dialogTableVisible: false,
      tableData: [],
      cloneRowData: {},
      telPerfixArr: [],
      multipleSelection: [],
      formstatus: {
        remark: "",
      },
      dialogFormVisibleStatus: false,
      curHandleFlags: "",
      changeStatusCloneRow: {},
      formLabelWidth: '130px',
    };
  },
  created() {
    this.getAreaCode();
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
    seeDetailsClick(row) {
      this.cloneRowData = Object.assign({}, row);
      let _params = {
        currentPage: this.pageIndex,
        pageSize: this.pageSize,
        recommendedId: row.recommendId,
        registeredIp: row.ipAddr,
        sort: 2,
      };
      this.queryParams = { ...this.queryParams, ..._params };
      this.getDialogData();
    },
    search(pgi) {
      this.$refs["queryForm"].validate((valid) => {
        if (valid) {
          if (pgi) this.pageIndex = pgi;
          this.queryParams.currentPage = this.pageIndex;
          this.getDialogData();
        }
      });
    },
    getDialogData() {
      searchUserList(this.queryParams).then((response) => {
        this.dialogTableVisible = true;
        if (response.code === 200) {
          this.tableData = response.data.list || [];
          for (let [k, s] of Object.entries(this.tableData || [])) {
            this.$set(
              this.tableData[k],
              "statusTransfered",
              s.status === 1 ? true : false
            );
          }
          this.totalPage = response.data.total || 0;
          this.loading = false;
        } else {
          this.tableData = [];
          this.totalPage = 0;
          this.pageSize = 10;
          this.loading = false;
          this.$message.error(response.message);
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.seeDetailsClick();
    },
    checkboxSelect(row, rowIndex) {
      return row.status == 1;
    },
    // 多选框选中数据
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 用户状态修改(启用/禁用)
    watchChange(row, type) {
      this.curHandleFlags = type;
      this.dialogFormVisibleStatus = true;
      this.formstatus.remark = "";
      if (row) {
        this.changeStatusCloneRow = Object.assign({}, row);
      }
    },
    sureStatusClick() {
      let _params = {};
      _params.remark = this.formstatus.remark;
      if (this.curHandleFlags === "single") {
        _params.memberIds = [this.changeStatusCloneRow.memberId];
        _params.status = this.changeStatusCloneRow.status === 1 ? 2 : 1;
      } else {
        _params.memberIds = this.multipleSelection.map((val) => val.memberId);
        _params.status = this.curHandleFlags === "batchOn" ? 1 : 2;
      }
      statusBatchChange(_params)
        .then((response) => {
          this.dialogFormVisibleStatus = false;
          if (response.code === 200) {
            this.getDialogData();
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1000,
            });
          } else {
            this.$message.error(response.message);
          }
        })
        .catch(({ error }) => {
          if (error) this.$message.error(error.message);
        });
    },
    cancelSattusClick() {
      this.dialogFormVisibleStatus = false;
      this.search();
    },
  },
};
</script>

<style lang="scss">
</style>
