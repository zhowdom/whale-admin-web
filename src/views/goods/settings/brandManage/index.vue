<template>
  <div class="goodsClassfyWrapper">

    <el-form :inline="true">
      <el-form-item label="输入类型名称：" prop="brandName">
        <el-input
          v-model.trim="queryParams.brandName"
          placeholder="请输入品牌名称/关键词"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>

      <el-form-item>
        <el-button v-hasPermi="['goods:brand:list']" type="primary" :loading="loading" icon="el-icon-search" @click="search(1)">查询</el-button>
        <el-button v-hasPermi="['goods:brand:save']" type="primary" :loading="loading" icon="el-icon-plus" @click="addTopClassifyClick('add')" style="float:right;">添加</el-button>
      </el-form-item>

    </el-form>

    <el-table
      border
      @sort-change="sortChange"
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="brandName"
        header-align="center"
        align="center"
        label="品牌名称">
      </el-table-column>
      <el-table-column
        prop="sort"
        header-align="center"
        sortable="custom"
        align="center"
        label="排序"
        >
      </el-table-column>
      <el-table-column
        prop="manufacturerType"
        header-align="center"
        align="center"
        label="品牌制造商">
        <template scope="scope">
          <span>{{scope.row.manufacturerType ? '是' : '否'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="showStatus"
        header-align="center"
        align="center"
        label="是否显示"
        >
        <template scope="scope">
          <span>{{scope.row.showStatus ? '显示' : '隐藏'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="updatedBy"
        header-align="center"
        align="center"
        label="操作人"
        >
        <template slot-scope="{row}">
          {{row.updatedBy ? row.updatedBy : row.createdBy}}
        </template>
      </el-table-column>
      <el-table-column
        prop="updatedAt"
        header-align="center"
        width="160"
        sortable="custom"
        align="center"
        label="操作时间">
        <template slot-scope="{row}">
          {{row.updatedAt ? $dayjs(row.updatedAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="productTotal"
        header-align="center"
        sortable="custom"
        align="center"
        label="商品"
        >
      </el-table-column>
      <el-table-column
        prop="commentTotal"
        header-align="center"
        sortable="custom"
        align="center"
        label="评论"
        >
      </el-table-column>
      <el-table-column
      header-align="center"
        align="center"
        width="180px"
        label="操作">
        <template scope="scope">
          <el-button v-hasPermi="['goods:brand:edit']" type="primary" size="mini" @click="addTopClassifyClick('edit', scope.row)">编辑</el-button>
          <el-button v-hasPermi="['goods:brand:del']" type="primary" size="mini" @click="deleteClick(scope.row)">删除</el-button>
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
    <brand-setting :sendTochildBridgeData="parentHavenRowData" @emitToParentMsg="copyMsgFromChild" />
  </div>
</template>

<script>
import { gdBrandsList, gdBrandsDel, gdBrandsAdd, gdBrandsAlter } from "@/api/goods/goodsAbout";
import brandSetting from './brandSetting'
  export default {
    components: {
      brandSetting
    },
    data () {
      return {
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        queryParams: {
          brandName: '',
          sort: 1
        },
        parentHavenRowData: {},
        loading: false,
        tableData: []
      }
    },
    filters: {},
    watch: {},
    computed: {},
    created () {},
    mounted () {
      this.search(1)
    },
    methods: {
      sortChange ({column, prop, order}) {
        let _blooean
        switch(prop)
        {
          case 'sort':
            _blooean = order === 'ascending' ? 1 : 2
            this.queryParams.sort = _blooean
            break;
          case 'updatedAt':
            _blooean = order === 'ascending' ? 3 : 4
            this.queryParams.sort = _blooean
            break;
          case 'productTotal':
            _blooean = order === 'ascending' ? 5 : 6
            this.queryParams.sort = _blooean
            break;
          case 'commentTotal':
            _blooean = order === 'ascending' ? 7 : 8
            this.queryParams.sort = _blooean
            break;
        }
        this.search()
      },
      copyMsgFromChild (val) {
        console.log(val, 'val')
      },
      addTopClassifyClick (actionType, row) {
        this.parentHavenRowData = {
          search: this.search,
          visible: true,
          actionType,
          data: {
            brandId: actionType === 'add' ? '' : row.brandId
          },
          rowData: actionType === 'add' ? {} : row
        }
      },
      search (pgi) {
        if (pgi) this.pageIndex = pgi
        let _params = {
          brandName: this.queryParams.brandName,
          currentPage: this.pageIndex,
          pageSize: this.pageSize,
          sort: this.queryParams.sort
        }
        this.loading = true
        gdBrandsList(_params).then(response => {
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
      },
      // 删除
      deleteClick (row) {
        this.$confirm(`确认要删除吗？`, '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _params = {
            brandId: row.brandId
          }
          gdBrandsDel(_params).then(response => {
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

