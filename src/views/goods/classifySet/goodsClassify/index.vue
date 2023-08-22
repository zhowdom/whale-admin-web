<template>
  <div class="goodsClassfyWrapper">
    <el-button v-if="addType === 'two'" type="primary" :loading="loading" @click="reBack" style="float:right;margin-bottom:20px;margin-left:10px;">返回</el-button>
    <el-button v-hasPermi="['goods:category:save']" type="primary" :loading="loading" icon="el-icon-plus" @click="addTopClassifyClick('add')" style="float:right;margin-bottom:20px;">{{`添加${addType === 'one' ? '一':'二'}级分类`}}</el-button>
    <el-table
      border
      :data="tableData"
      v-loading="loading"
      style="width: 100%">
      <el-table-column
        prop="categoryId"
        header-align="center"
        width="80"
        align="center"
        label="编号">
      </el-table-column>
      <el-table-column
        prop="categoryName"
        header-align="center"
        align="center"
        label="分类名称"
        >
      </el-table-column>
      <el-table-column
        prop="iconUrl"
        header-align="center"
        align="center"
        label="分类图标">
        <template scope="scope">
        <div class="goodsIMG">
          <div v-if="scope.row.iconUrl"><img :src="scope.row.iconUrl" alt=""></div>
          <div v-else style="line-height:50px;">无</div>
        </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="level"
        header-align="center"
        align="center"
        width="80"
        label="级别"
        >
        <template scope="scope">
          <p>{{scope.row.level === 1 ? '一':'二'}}级</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="productCount"
        header-align="center"
        align="center"
        label="商品数量"
        >
        <template scope="scope">
          <el-button size="mini" type="text" @click="goToGoodsList(scope.row)">{{scope.row.productCount}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="displayOnNavigationBar"
        header-align="center"
        align="center"
        width="139"
        label="是否显示在导航栏">
        <template scope="scope">
          <p>{{scope.row.displayOnNavigationBar ? '是':'否'}}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="showStatus"
        header-align="center"
        align="center"
        width="100"
        label="是否显示"
        >
        <template scope="scope">
          <p>{{scope.row.showStatus ? '是':'否'}}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        header-align="center"
        align="center"
        label="排序"
        width="60px"
        >
      </el-table-column>
      <el-table-column
      header-align="center"
        align="center"
        width="120px"
        label="设置">
        <template scope="scope">
          <!-- <p v-if="addType === 'one'"><el-button size="mini" type="text" @click="addClick(scope.row)">新增下级</el-button></p> -->
          <p v-hasPermi="['goods:category:list']" v-if="addType === 'one'"><el-button size="mini" type="text" @click="seeClick(scope.row)">查看下级</el-button></p>
          <!-- <p v-if="scope.row.level > 1"><el-button size="mini" type="text" @click="reBack(scope.row)">返回</el-button></p> -->
          <p><el-button size="mini" type="text" @click="transferClick(scope.row)">转移商品</el-button></p>
        </template>
      </el-table-column>
      <el-table-column
      header-align="center"
        align="center"
        width="180px"
        label="操作">
        <template scope="scope">
          <el-button v-hasPermi="['goods:category:edit']" type="primary" size="mini" @click="editClick(scope.row)">编辑</el-button>
          <el-button v-hasPermi="['goods:category:del']" type="primary" size="mini" @click="deleteClick(scope.row)">删除</el-button>
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
    <classify-setting :sendTochildBridgeData="parentHavenRowData" @emitToParentMsg="copyMsgFromChild" />
  </div>
</template>

<script>
import { delCategory, categoryList, addCategory, editCategory } from "@/api/goods/goodsAbout";
import classifySetting from './classifySetting'
  export default {
    components: {
      classifySetting
    },
    data () {
      return {
        categoryName: '',
        parentId: '',
        addType: 'one',
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
      goToGoodsList (row) {
        this.$router.push({ path: "goodslist", query: { categoryId: row.categoryId}})
      },
      queryAttrsTypesList () {},
      copyMsgFromChild (val) {
        console.log(val, 'val')
      },
      addTopClassifyClick (actionType) {
        this.parentHavenRowData = {
          search: this.search,
          visible: true,
          actionType,
          data: {
            categoryName: this.categoryName,
            parentId: this.parentId // 这里的parentId为空时是一级分类，否则是二级
          },
          rowData: this.rowData
        }
      },
      addClick () {},
      reBack () {
        // 返回
        this.addType = 'one'
        this.parentId = ''
        this.categoryName = ''
        this.rowData = {}
        this.search()

      },
      seeClick (row) {
        // 查看下级
        this.rowData = row
        this.categoryName = row.categoryName
        this.parentId = row.categoryId
        this.addType = 'two'
        this.search(1)
      },
      transferClick () {},
      editClick (row) {
        this.rowData = row
        this.addTopClassifyClick('edit')
      },
      search (pgi) {
        if (pgi) this.pageIndex = pgi
        let _params = {
          categoryName: '', // 一级、二级分类、新增修改后，categoryName传空查询最新列表
          currentPage: this.pageIndex,
          pageSize: this.pageSize,
          parentId: this.parentId || ''
        }
        this.loading = true
        categoryList(_params).then(response => {
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
            categoryId: row.categoryId
          }
          delCategory(_params).then(response => {
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
  p{
    margin:0;
    padding: 0;
  }
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

