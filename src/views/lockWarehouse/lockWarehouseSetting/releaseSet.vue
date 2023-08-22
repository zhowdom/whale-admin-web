<template>
  <div class="jdtDetailBox">
    <el-form class="ssForm" :model="queryParams" :rules="rules" ref="queryForm" :inline="true">

      <el-form-item label="币种" prop="coinName">
        <el-select v-model="queryParams.coinName" clearable placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(item, index) in daiCoinSettingArr" :label="item" :value="item" :key="index"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" v-hasPermi="['coin:lock_release_conf:page']" :loading="loading" icon="el-icon-search" @click="search(1)">查询</el-button>
        <el-button type="primary" v-hasPermi="['coin:lock_release_conf:add']" icon="el-icon-plus" @click="add" style="margin-bottom:20px;">新增</el-button>
      </el-form-item>
    </el-form>
    <div class="pageToolBox">
      <p class="tag">注：</p>
      <div class="textBox">
        <p>1. 需配置连续区间，如果存在有个间段不配置，则释放比例默认为上一个区间</p>
        <p>2. 如果获得的锁仓代币，没有配置释放比例，则释放比例默认为0</p>
      </div>
    </div>

    <el-table :data="tableData" order border :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" style="width: 100%">
      <el-table-column prop="id" label="序号" width="180">
      </el-table-column>
      <el-table-column prop="coinName" label="币种">
      </el-table-column>
      <el-table-column prop="inviteCode" label="锁仓基数范围" width="180">
        <template scope="scope">
          <span>{{scope.row.minNum}}</span>-<span>{{scope.row.maxNum}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ratio" label="释放比例（‰）">
      </el-table-column>
      <el-table-column prop="remark" label="说明">
      </el-table-column>

      <el-table-column prop="updatedAt" label="更新时间">
        <template slot-scope="{row}">
          {{row.updatedAt ? $dayjs(row.updatedAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="updatedBy" label="操作人">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="primary" v-hasPermi="['coin:lock_release_conf:update']" @click="mdfclick(row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination style="margin-top:10px;" @current-change="search" :page-sizes="[10, 20, 30]" @size-change="handleSizeChange"
                   :current-page.sync="pageIndex" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalPage">
    </el-pagination>

    <el-dialog width="39%" title="锁仓释放比例配置" :visible.sync="dialogFormVisibleStatus">
      <el-form :model="formstatus">
        <el-form-item label="币种" :label-width="formLabelWidth">
          <el-select v-model="formstatus.coinName" clearable placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, index) in daiCoinSettingArr" :label="item" :value="item" :key="index"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="锁仓基数范围" :label-width="formLabelWidth">
          <el-input-number controls-position="right" size="mini" v-model="formstatus.minNum" :min="0" :max="1000000" :step="1" step-strictly>
          </el-input-number>
          <span style="padding:0 10px;">-</span>
          <el-input-number controls-position="right" size="mini" v-model="formstatus.maxNum" :min="0" :max="1000000" :step="1" step-strictly>
          </el-input-number>
          <p style="font-size:12px;"><span style="color:red;">* </span>在某范围-取相应比例，针对【昨日锁仓】而言</p>
        </el-form-item>

        <el-form-item label="释放比例" :label-width="formLabelWidth">
          <!-- <el-input-number controls-position="right" v-model="formstatus.ratio" :min="0" :max="1000000" :step="1" step-strictly></el-input-number> -->
          <el-input class="newInput" v-model="formstatus.ratio" @input="formstatus.ratio=formstatus.ratio.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g,'$1')" autocomplete="off" maxlength="20" clearable></el-input>
          <span style="padding-left:10px;">‰（千分比）</span>
        </el-form-item>
        <el-form-item label="说明" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="formstatus.remark" autocomplete="off" show-word-limit maxlength="30"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleStatus = false">取 消</el-button>
        <el-button v-show="curActType === 'add'" type="primary" @click="sureStatusClick('add')">确 定</el-button>
        <el-button v-show="curActType === 'mdf'" type="primary" @click="sureStatusClick('mdf')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  jdtDetailList,
  jdtDetailToufu,
  lockSetMdf,
  lockSetAdd,
  lockSetList,
  jdtSetInfo,
} from "@/api/lockWarehouse";
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
      curActType: 1,
      formstatus: {
        minNum: 0,
        maxNum: 0,
        ratio: 0,
        remark: "",
        type: 1,
        coinName:""
      },
      dialogFormVisibleStatus: false,
      formLabelWidth: "120px",
      reMap: {},
      rules: {
        phone: [{ validator: validatePhone, trigger: "blur" }],
      },
      loading: false,
      queryParams: {
        coinName:"",
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
    mdfclick(row) {
      this.formstatus = JSON.parse(JSON.stringify(row));
      this.curActType = "mdf";
      this.dialogFormVisibleStatus = true;
    },
    add() {
      this.curActType = "add";
      this.dialogFormVisibleStatus = true;
      this.formstatus = {
        minNum: 0,
        maxNum: 0,
        ratio: 0,
        remark: "",
        type: 1,
        coinName:""
      };
    },
    sureStatusClick(type) {
      let _api = type === "add" ? lockSetAdd : lockSetMdf;
      if(!this.formstatus.coinName){
        this.$message.error('请选择币种');
        return;
      }
      _api(this.formstatus).then((response) => {
        if (+response.code === 200 && response.data.result) {
          this.$message.success("操作成功");
          this.dialogFormVisibleStatus = false;
          this.search(1);
        } else {
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
      if (pgi) this.pageIndex = pgi;
      let _params = {
        type: 1,
        pageSize: this.pageSize,
        currentPage: this.pageIndex,
        ...this.queryParams,
      };
      this.loading = true;
      lockSetList(_params).then((response) => {
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
.ssForm .el-form-item{
  margin-bottom: 0 !important;
}
.pageToolBox{
  display: flex;
  align-items: flex-start;
  font-size: 14px;
  color: red;
  margin-bottom: 20px;
  .tag{
    margin: 0;
  }
  .textBox{
    p{
      margin: 0 0 8px 0;
    }
  }
}
.newInput{
  width: 180px; 
}
</style>

