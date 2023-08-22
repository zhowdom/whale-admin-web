<template>
  <div class="goodsClassfyWrapper">
    <el-form :inline="true">
      <el-form-item label="输入类型名称：" prop="name">
        <el-input
          v-model.trim="queryParams.name"
          placeholder="请输入类型名称"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>

      <el-form-item>
        <el-button v-hasPermi="['goods:attribute:list']" type="primary" :loading="loading" icon="el-icon-search" @click="search(1)">查询</el-button>
        <el-button v-hasPermi="['goods:attribute:save']" type="primary" :loading="loading" icon="el-icon-plus" @click="addTopClassifyClick('add')" style="float:right;">添加</el-button>
      </el-form-item>

    </el-form>

    
   
    <el-table
      border
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="goodsAttrId"
        header-align="center"
        width="80"
        align="center"
        label="编号">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="类型名称"
        >
      </el-table-column>
      <el-table-column
        prop="attrCount"
        header-align="center"
        width="120"
        align="center"
        label="属性数量">
      </el-table-column>
      <el-table-column
        header-align="center"
        width="120"
        align="center"
        label="设置"
        >
        <template scope="scope">
          <span v-hasPermi="['goods:attribute_item:list']" style="color:rgb(102, 153, 255);cursor:pointer;" @click="jumpToAttrsList(scope.row)">属性列表</span>
        </template>
      </el-table-column>
      
      <el-table-column
      header-align="center"
        align="center"
        width="180px"
        label="操作">
        <template scope="scope">
          <el-button v-hasPermi="['goods:attribute:edit']" type="primary" size="mini" @click="editClick(scope.row)">编辑</el-button>
          <el-button v-hasPermi="['goods:attribute:del']" type="primary" size="mini" @click="deleteClick(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        style="float:right;padding-top:20px;"
        @current-change="search"
        :page-sizes="[10, 20, 30]"
        @size-change="handleSizeChange"
        :current-page.sync="pageIndex"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
        </el-pagination>


    <!--添加一级分类-->
    <attrs-setting :sendTochildBridgeData="parentHavenRowData" @emitToParentMsg="copyMsgFromChild" />

    
  </div>
</template>

<script>
import { gdsAttrsList, gdsAttrsDel } from "@/api/goods/goodsAbout";
import attrsSetting from './attrsSetting'
  export default {
    components: {
      attrsSetting
    },
    data () {
      return {
        queryParams: {
          name: ''
        },
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        parentHavenRowData: {},
        loading: false,
        tableData: [],
        rowData: {}
      }
    },
    filters: {},
    watch: {},
    computed: {},
    mounted () {
      this.search(1)
    },
    methods: {
      jumpToAttrsList (row) {
        this.$router.push({ path: "/goods/attrslist", query: { goodsAttrId: row.goodsAttrId, name: row.name}})
      },
      copyMsgFromChild (val) {
        console.log(val, 'val')
      },
      addTopClassifyClick (actionType) {
        this.parentHavenRowData = {
          search: this.search,
          visible: true,
          actionType,
          rowData: this.rowData
        }
      },
      editClick (row) {
        this.rowData = row
        this.addTopClassifyClick('edit')
      },
      // 删除
      deleteClick (row) {
        this.$confirm(`确认要删除吗？`, '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _params = {
            goodsAttrId: row.goodsAttrId
          }
          gdsAttrsDel(_params).then(response => {
            if (response.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                'duration': 1000,
                onClose: () => {
                  this.search()
                }
              })
            } else {
              this.$message.error(response.message)
            }
          }).catch(({ error }) => {
            if (error) this.$message.error(error.message)
          })
        })
      },
      search (pgi) {
        if (pgi) this.pageIndex = pgi
        let _params = {
          name: this.queryParams.name,
          currentPage: this.pageIndex,
          pageSize: this.pageSize
        }
        this.loading = true
        gdsAttrsList(_params).then(response => {
            if (response.code === 200) {
            this.tableData = response.data.list
            this.totalPage = response.data.total
            this.loading = false
            } else {
            this.tableData = []
            this.totalPage = 0
            this.pageSize = 10
            this.loading = false
            this.$message.error(response.message)
          }
        }).catch( e => {
          this.loading = false
        })
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.search()
      }
    }
  }
</script>

<style lang="scss" scoped>
.goodsClassfyWrapper{
  padding: 20px;
  .goodsIMG{
    height: 50px;
    width: 50px;
    margin: 0 auto;
    & img{
      height: 100%;
      width: 100%;
      overflow: hidden;
      border-radius: 3px;
    }
  }
}
</style>

