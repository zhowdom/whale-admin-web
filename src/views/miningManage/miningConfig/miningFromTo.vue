<template>
  <div class="tab-content cont_Wrapper">
    <div class="mb30 text-muted ft14">
      <p>注意 ： 1. 如果【质押币种】配置为【禁用】，在APP端，除历史订单外，不可以再质押新订单。</p>
      <p style="text-indent: 50px;">2. 如果【收割币种】配置为【禁用】，在APP端，除历史订单外，新创建的订单，不可以收割</p>
      <p style="text-indent: 50px;">3. 在【挖矿类型配置】每配置一个质押类型，此处默认为【启用】状态</p>
    </div>
    <div class="task-table">
      <!--table-->
      <el-table
      :data="tableData"
      v-loading="loading"
      style="width: 100%">
        <el-table-column prop="subTitle" label="名称" align="center" min-width="120"></el-table-column>
        <el-table-column prop="pledgeStatus" label="质押币种" align="center" min-width="120">
          <template slot-scope="{row}">
            <el-switch v-hasPermi="['wallet:mining:conf:pledgestatus']" v-model="row.pledgeStatus" @change="handlePledgeStatus(row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="harvestStatus" label="收割币种" align="center" min-width="120">
          <template slot-scope="{row}">
            <el-switch v-hasPermi="['wallet:mining:conf:harveststatus']" v-model="row.harvestStatus" @change="handleHarvestStatus(row)"></el-switch>
          </template>
        </el-table-column>
      </el-table>
      <!--table-->
      <div class="table-pagination text-right mt10">
        <el-pagination
        @current-change="search"
        :page-sizes="[10, 20, 30]"
        @size-change="handleSizeChange"
        :current-page.sync="pageIndex"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { miningConfigPage, pledgeStatus, harvestStatus } from "@/api/miningManage";
  export default {
    components: {},
    data () {
      return {
        loading: false,
        tableData: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
      }
    },
    activated() {
      this.search();
    },
    methods: {
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.search()
      },
      // 数据查询
      search (pgi) {
        if (pgi) this.pageIndex = pgi
        let _params = {
          currentPage: this.pageIndex,
          pageSize: this.pageSize,
        }
        this.loading = true
        miningConfigPage(_params).then(response => {
          if (response.code === 200) {
            this.tableData = JSON.parse(JSON.stringify(response.data.list))
            this.totalPage = response.data.total
            this.loading = false
          } else {
            this.tableData = []
            this.totalPage = 0
            this.pageSize = 10
            this.loading = false
            this.$message.error(response.message)
          }
        })
      },
      // 状态开关
      handlePledgeStatus(row) {
        let text = row.pledgeStatus == false ? "停用" : "启用";
        this.$confirm(`确认要${text}该配置?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          pledgeStatus({id: row.id, enabled: row.pledgeStatus}).then(response => {
            if (response.code === 200) {
              this.msgSuccess(`保存成功`)
              this.search(this.pageIndex);
            } else {
              this.msgSuccess(response.message)
            }
          })
        }).catch(() => {
          if(row.pledgeStatus == false) {
            row.pledgeStatus = true
          } else{
            row.pledgeStatus = false
          }
        });
      },
      // 状态开关
      handleHarvestStatus(row) {
        let text = row.harvestStatus == false ? "停用" : "启用";
        this.$confirm(`确认要${text}该配置?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          harvestStatus({id: row.id, enabled: row.harvestStatus}).then(response => {
            if (response.code === 200) {
              this.msgSuccess(`保存成功`)
              this.search(this.pageIndex);
            } else {
              this.msgSuccess(response.message)
            }
          })
        }).catch(() => {
          if(row.harvestStatus == false) {
            row.harvestStatus = true
          } else{
            row.harvestStatus = false
          }
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
.tab-content{
  .danwei{
    position: absolute;
    top: 0;
    right: -45px;
  }
  .line{
    text-align: center;
  }
}
</style>
<style lang="scss">
.tab-content{
  form{
    padding-right:40px;
  }
  .el-form-item__content{
    position: relative;
  }
  .el-select{
    width: 100%;
  }
}
/*upload style*/
.cont_Wrapper .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.cont_Wrapper .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.cont_Wrapper .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.cont_Wrapper .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.cont_Wrapper .certifyForm{
  width:600px;
}
.certifyForm form{
  padding-right:20px;
}
.uploadSuccessed {
  width:200px;
  height: 200px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
}
.uploadSuccessed img{
  height: 100%;
  width: 100%;
  cursor: pointer;
}
</style>

