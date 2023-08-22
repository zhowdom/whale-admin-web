<template>
  <div class="box-list">
    <el-form :model="mainForm" ref="mainForm" size="small" :inline="true">
      <el-form-item label="子订单号" prop="orderItemNo">
        <el-input
          v-model="mainForm.orderItemNo" placeholder="请输入" clearable
        />
      </el-form-item>
      <el-form-item label="货号" prop="itemNo">
        <el-input
          v-model="mainForm.itemNo" placeholder="请输入" clearable
        />
      </el-form-item>
      <el-form-item label="实物名称" prop="itemName">
        <el-input
          v-model="mainForm.itemName" placeholder="请输入" clearable
        />
      </el-form-item>
      <el-form-item class="fr mr0">
        <el-button v-hasPermi="['blindBox:distribution:itemInfo']" type="primary" :loading="loading" icon="el-icon-search" @click="onSearch">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
      border
      :data="tableData"
      v-loading="loading"
    >
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="memberNickName" label="用户昵称" align="center" width="120"></el-table-column>
      <el-table-column prop="orderItemNo" label="子订单号" align="center" width="260"></el-table-column>
      <el-table-column prop="itemNo" label="货号" align="center" width="130"></el-table-column>
      <el-table-column prop="itemName" label="实物名称" align="center"></el-table-column>
      <el-table-column prop="prizeNo" label="图片" align="center" width="110">
        <template slot-scope="{row}">
          <el-image class="image" :src="row.img" fit="fit"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="costPrice" label="成本价（USDT）" align="center"></el-table-column>
      <el-table-column prop="itemNum" label="数量" align="center"></el-table-column>
    </el-table>

    <el-pagination
      class="text-right mt20"
      :total="pager.total"
      :page-size="pager.size"
      :page-sizes="[10, 20, 30]"
      :current-page="pager.curPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>

</template>

<script>
  import {itemInfo} from "@/api/games/bbPrizesAward.js";

  export default {
    name: 'BoxList',
    props: ['id'],
    data() {
      return {
        mainForm: {
          itemNo: '',
          itemName: '',
          orderItemNo: ''
        },
        pager: {
          size: 10,
          total: 0,
          curPage: 1,
        },
        tableData: [],
        loading: false,
      }
    },
    mounted () {
      this.itemInfoReq();
    },
    methods: {
      // 实物列表
      async itemInfoReq() {
        this.loading = true;
        try {
          const {code, data, message} = await itemInfo({
            ...this.mainForm,
            currentPeriodNo: this.id,
            pageSize: this.pager.size,
            currentPage: this.pager.curPage,
          });

          if (code == 200) {
            this.tableData = data?.list || [];
            this.pager.size = data?.pageSize;
            this.pager.total = data?.total;
          } else {
            this.$message.error(message);
          }
          this.loading = false;
        } catch (error) {
          this.loading = false;
          throw error;
        }
      },
      // 搜索
      onSearch() {
        this.itemInfoReq();
      },
      // 分页数量修改
      handleSizeChange(val) {
        this.pager.size = val;
        this.itemInfoReq();
      },
      // 跳转当前页
      handleCurrentChange(val) {
        this.pager.curPage = val;
        this.itemInfoReq();
      },
    }
  }
</script>

<style lang="scss" scoped>
  .box-list {
    .image {
      width: 80px;
      height: 80px;
      border-radius: 5px;
    }
  }
</style>
