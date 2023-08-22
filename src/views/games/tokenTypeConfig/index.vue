<template>
  <div class="shareAddManagebox" style="padding:20px;">
    <el-form ref="nLevelqueryForm" :inline="true">
      <el-form-item>
        <el-button type="primary" v-hasPermi="['game:coin:add']" :loading="buttonLoading" icon="el-icon-plus" @click="addClick()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="pageData" v-loading="loading" border :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
      <el-table-column property="coinName" label="币种"></el-table-column>
      <el-table-column property="sort" label="排序"></el-table-column>
      <el-table-column property="name" label="APP/H5展示">
        <template slot-scope="{row}">
          {{{1:'展示',2:'展示 - 暂未开放',3:'不展示'}[row.pageState]}}
        </template>
      </el-table-column>
      <el-table-column property="apiState" label="接口状态">
        <template slot-scope="{row}">
          {{row.apiState?'启用':'禁用'}}
        </template>
      </el-table-column>
      <el-table-column property="createAt" label="更新时间">
        <template slot-scope="{row}">
          {{row.createAt ? $dayjs(row.createAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button type="text" v-hasPermi="['game:coin:update']" @click="editSortClick(scope.row)">排序</el-button>
          <el-button type="text" v-hasPermi="['game:coin:update']" @click="powerClick(scope.row)">权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="padding-top:20px;" @current-change="search" :page-sizes="[10, 20, 30]" @size-change="handleSizeChangenLevel"
                   :current-page.sync="pageIndexn" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                   :total="totalPage">
    </el-pagination>

    <!--新增代币类型配置弹窗-->
    <el-dialog title="增加代币类型" :visible.sync="dialogAddVisible" width="30%">
      <el-form :model="addForm" :rules="addFormRules" ref="addForm">
        <el-form-item label="币种类型" :label-width="formLabelWidth" prop="coinName">
          <el-select v-model="addForm.coinName" placeholder="请选择">
            <el-option v-for="(item, index) in daiCoinSettingArr" :label="item" :value="item" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <p class="addFormTool">* 新增代币类型，默认【不展示，接口禁用】</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false" :loading="buttonLoading">取 消</el-button>
        <el-button type="primary" @click="confirmAdd" :loading="buttonLoading">确 定</el-button>
      </div>
    </el-dialog>

    <!--编辑排序弹窗-->
    <el-dialog title="排序" :visible.sync="dialogSortVisible" width="30%">
      <el-form :model="clickCurrent" :rules="rules" ref="sortForm">
        <el-form-item label="排序" :label-width="formLabelWidth" prop="sort">
          <el-input-number v-model="clickCurrent.sort" :precision="0" step-strictly controls-position="right" :min="0" :max="1000"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSortVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmChangeSort">确 定</el-button>
      </div>
    </el-dialog>

    <!--权限配置弹窗-->
    <el-dialog title="权限配置" :visible.sync="dialogPowerVisible" width="30%">
      <el-form :model="clickCurrent" :rules="rules" ref="powerForm">
        <el-form-item label="APP/H5端展示：" :label-width="formLabelWidth" prop="sort">
          <el-radio-group v-model="clickCurrent.pageState" class="dfRadiobox">
            <el-radio :label="1">展示；接口状态【启用】</el-radio><br>
            <el-radio :label="2">展示，点击提示：暂未开放；接口状态【禁用】</el-radio><br>
            <el-radio :label="3">不展示；接口状态【禁用】</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPowerVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmChangePower">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
  
  <script>
import { daiCoinSettingList } from "@/api/xhgjSpark_api/daiCoinSetting.js";
import {
  addGameCoin,
  getGameCoinList,
  getGameCoinPage,
  updateGameCoin,
} from "@/api/games";

export default {
  components: {},
  data() {
    let sortValidator = (rule, value, callback) => {
      if (!/\S/.test(value) || value === undefined) {
        callback(new Error("排序不能为空！"));
      } else {
        callback();
      }
    };
    return {
      gameType:1,
      buttonLoading: false,
      loading: false,
      daiCoinSettingArr: [], //代币列表
      clickCurrent: {
        sort: 0,
        id: "",
        coinName: "",
        pageState: 0,
        apiState: false,
      },
      rules: {
        sort: [{ validator: sortValidator, trigger: "blur" }],
      },
      pageIndexn: 1,
      pageSize: 10,
      totalPage: 0,
      pageData: [],
      formLabelWidth: "120px",
      dialogPowerVisible: false, //是否权限配置弹窗
      dialogSortVisible: false, //是否编辑排序弹窗
      dialogAddVisible: false, //是否新增弹窗
      addForm: {
        coinName: "", //币种类型
      },
      addFormRules: {
        coinName: [
          { required: true, message: "请选择币种类型", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.gameType = this.$route.query.gameType || 1;
    this.daiCoinSettingList();
  },
  mounted() {
    this.isAuth.isPermi(["game:coin:page"]) && this.search(1);
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
    //新增
    addClick() {
      this.dialogAddVisible = true;
      this.$nextTick(() => {
        this.$refs["addForm"].clearValidate();
        this.addForm.coinName = "";
      });
    },
    //确认新增
    confirmAdd() {
      this.$refs["addForm"].validate((valid) => {
        if (valid) {
          let params = {
            coinName: this.addForm.coinName,
            gameType: this.gameType,
          };
          this.buttonLoading = true;
          addGameCoin(params)
            .then((res) => {
              if (res.code === 200) {
                this.search(1);
                this.msgSuccess(`操作成功`)
                this.buttonLoading = false;
                this.dialogAddVisible = false;
              } else {
                this.buttonLoading = false;
                this.$message.error(response.message);
              }
            })
            .catch((e) => {
              this.buttonLoading = false;
            });
        }
      });
    },
    //编辑排序
    editSortClick(row) {
      this.dialogSortVisible = true;
      this.$nextTick(() => {
        this.$refs["sortForm"].clearValidate();
        this.clickCurrent = JSON.parse(JSON.stringify(row)) || {};
      });
    },
    //确认编辑排序
    confirmChangeSort() {
      this.$refs["sortForm"].validate((valid) => {
        if (valid) {
          this.updateGameCoin(()=>{
            this.dialogSortVisible = false;
          });
        }
      });
    },
    //权限
    powerClick(row) {
      this.clickCurrent = JSON.parse(JSON.stringify(row)) || {};
      this.dialogPowerVisible = true;
    },
    //确认配置权限
    confirmChangePower() {
      this.$refs["powerForm"].validate((valid) => {
        if (valid) {
          this.updateGameCoin(()=>{
            this.dialogPowerVisible = false;
          });
        }
      });
    },
    // 更新
    updateGameCoin(callback) {
      let newParams = {
        gameType: this.gameType,
        apiState: this.clickCurrent.apiState,
        coinName: this.clickCurrent.coinName,
        sort: this.clickCurrent.sort,
        pageState: this.clickCurrent.pageState,
        id: this.clickCurrent.id,
      }
      updateGameCoin(newParams)
        .then((res) => {
          if (res.code === 200) {
            this.search(1);
            this.buttonLoading = false;
            this.msgSuccess(`操作成功`)
            callback && callback();
          } else {
            this.buttonLoading = false;
            this.$message.error(response.message);
          }
        })
        .catch((e) => {
          this.buttonLoading = false;
        });
    },
    // 获取数据
    search(pgi) {
      if (pgi) this.pageIndexn = pgi;
      let _params = {
        gameType: this.gameType,
        currentPage: this.pageIndexn,
        pageSize: this.pageSize,
      };
      this.loading = true;
      getGameCoinPage(_params)
        .then((res) => {
          if (res.code === 200) {
            console.log(res);
            this.pageData = res.data.list || [];
            this.totalPage = res.data.total;
            this.loading = false;
          } else {
            this.pageData = [];
            this.totalPage = 0;
            this.pageSize = 10;
            this.loading = false;
            this.$message.error(res.message);
          }
        })
        .catch((e) => {
          this.loading = false;
        });
    },
    handleSizeChangenLevel(val) {
      this.pageSize = val;
      this.pageIndexn = 1;
      this.search();
    },
  },
};
</script>
  
<style lang="scss" scoped>
.addFormTool {
  padding-left: 50px;
}
.dfRadiobox .el-radio {
  line-height: 36px;
}
</style>
  
  