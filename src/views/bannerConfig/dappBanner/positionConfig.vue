<template>
  <div class="tab-content">
    <div style="padding-bottom:15px;">
      <span style="color:red;font-size:13px;">点击【禁用】后，只是APP端不展示，接口并未关闭 ；但是如果用户没有刷新，存在缓存，仍然可以进行跳转。</span>
      <el-button size="medium" type="primary" @click="jumpToApiCloseRoute">前往关闭后端接口</el-button>
      <!-- <el-button v-hasPermi="['setting:banner_setting:save']" icon="el-icon-plus" type="primary" @click="handleAdd()">新增</el-button> -->
    </div>
    <div class="task-table">
      <!--table-->
      <el-table
      :data="tableData"
      v-loading="loading"
      style="width: 100%">
        <el-table-column prop="position" label="banner位置" align="center" min-width="120" :key="Math.random()">
          <template slot-scope="{row}">
            {{bannerConfigAppSelectObj[row.position]}}
          </template>
        </el-table-column>
        <el-table-column prop="bizType" label="业务类型" align="center" min-width="120" :key="Math.random()">
          <template slot-scope="{row}">
            {{coinServiceObj[row.bizType]}}
          </template>
        </el-table-column>
        <el-table-column prop="createBy" label="操作人" align="center" min-width="120" :key="Math.random()"></el-table-column>
        <el-table-column prop="createTime" label="更新时间" align="center" min-width="160">
          <template slot-scope="{row}">
            {{row.createTime ? $dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180" :key="Math.random()">
          <template slot-scope="{row}">
            <el-switch v-hasPermi="['setting:banner_position:change']" v-model="row.status" :active-value="true" :inactive-value="false" @change="handleSetType(row)"></el-switch>
          </template>
        </el-table-column>
      </el-table>
      <!--table-->
    </div>
  </div>
</template>

<script>
import { bannerConfigDappPage, changeBannerPosition } from "@/api/bannerConfig";
export default {
  components: {},
  props: {
    bannerConfigAppSelectArr: Array,
    bannerConfigAppSelectObj: Object,
    coinServiceObj: Object,
    coinServiceArr: Array
  },
  data () {
    return {
      loading: false,
      tableData: [],
    }
  },
  mounted () {
    this.search();
  },
  methods: {
    jumpToApiCloseRoute () {
      this.$router.push('/setting/apiEnableStatus')
    },
    // 数据查询
    search () {
      this.loading = true
      bannerConfigDappPage({}).then(response => {
        if (response.code === 200) {
          this.tableData = JSON.parse(JSON.stringify(response.data.list))
          this.loading = false
        } else {
          this.tableData = []
          this.loading = false
          this.$message.error(response.message)
        }
      })
    },
    // 状态开关
    handleSetType(row) {
      let text = row.status === true ? "启用" : "停用";
      this.$confirm(`确认要${text}该配置?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        let _params = {
          id: row.id
        }
        changeBannerPosition(_params).then(response => {
          if (response.code === 200) {
            this.msgSuccess(`保存成功`)
            this.search();
          } else {
            this.msgSuccess(response.message)
          }
        })
      }).catch(() => {
        row.status = !row.status;
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
}
</style>

