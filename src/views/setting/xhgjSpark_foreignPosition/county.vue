<template>
  <div class="fpCountryBox" style="padding:20px;">
    

    <el-form :inline="true">
              
      <el-form-item label="国家">
          <el-input clearable v-model="enteredCountry" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="城市">
          <el-input clearable v-model="enteredCity" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="区/县">
          <el-input clearable v-model="enteredArea" placeholder="请输入"></el-input>
      </el-form-item>
      
      <el-form-item label="">
          <el-button :loading="loading" v-hasPermi="['abroad:district_country:enable']" type="primary" @click="search(1)">查询</el-button>
          <el-button v-hasPermi="['abroad:district_country:enable']" type="primary" @click="addNew">增加</el-button>
          <span style="margin-left:20px;">（注：只能为已启用的城市增加【区/县】）</span>
      </el-form-item>
    </el-form>

    


  <el-table
        :data="tableData"
        border
        v-loading="loading"
        class="userpowerbox"
        style="width: 100%">
            <el-table-column
                prop="id"
                align="center"
                label="序号">
            </el-table-column>
            
          <el-table-column
                align="center"
                prop="country"
                label="国家">
            </el-table-column>
          <el-table-column
                align="center"
                prop="city"
                label="城市">
            </el-table-column>
          <el-table-column
                align="center"
                prop="area"
                label="区/县">
            </el-table-column>
            <el-table-column
              width="100"
              label="操作"
              align="center">
              <template scope="scope">
                <!-- <el-button size="mini" v-hasPermi="['dedicate:worth:use:setting:update']" type="primary" @click="mdfClick(scope.row)">编辑{{scope.$index+1}}</el-button> -->
                <el-button size="mini" v-hasPermi="['dedicate:worth:use:setting:update']" type="primary" @click="mdfClick(scope.row)">编辑</el-button>
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
      

    <!---->
    <el-dialog :title="actType == 0 ? '新增' : '编辑'" :visible.sync="dialogFormVisible" width="39%">
          <el-form>

            <el-form-item label="国家/城市：" :label-width="formLabelWidth">
              <el-cascader
              :disabled="actType == 1"
              v-model="valueCountryCity"
              :options="optionCountryCity"
              @change="handleChangeCountryCity">
              </el-cascader>
            </el-form-item>
            


            <el-form-item label="区/县：" :label-width="formLabelWidth">
              <el-button :disabled="citySumbitObject.length > 20" @click="addCity" size="mini">新增</el-button>
            </el-form-item>

            <div class="cityBox">
              <p style="font-size:12px;"><span style="margin-left: 61px;">中文简体</span><span style="margin-left: 177px;">英文</span><span style="margin-left: 145px;">状态</span></p>
              <div v-for="(item, index) in citySumbitObject" :key="index" style="margin-bottom:10px;">
                <el-input clearable v-model="item.cnName" placeholder="" style="width:200px;"></el-input>
                <span style="margin:0 10px;">-</span>
                <el-input clearable v-model="item.enName" placeholder="" style="width:200px;"></el-input>
                <el-switch
                style="margin:0 20px;"
                v-model="item.status"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
              
              <el-button v-if="actType == 0" @click="delCityForNow(index)" size="mini" type="text" icon="el-icon-delete"></el-button>
              <el-button v-if="actType == 1 && item['isTemporary']" @click="delCityForNow(index)" size="mini" type="text" icon="el-icon-delete"></el-button>
              </div>
            </div>
            
            
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button v-if="actType == 0" :loading="sumbitLoading" type="primary" @click="newOpenClick">确 定</el-button>
            <el-button v-if="actType == 1" :loading="sumbitLoading" type="primary" @click="editOpenClick">确 定</el-button>
          </div>
        </el-dialog>

    

  </div>
</template>

<script>
import { xhgjSpark_fpCityListQuery, xhgjSpark_fpCityListAdd, xhgjSpark_fpCityListAlter, xhgjSpark_fpCitySelectQuery, xhgjSpark_fpCityDetails } from "@/api/xhgjSpark_api";
import { i } from 'mathjs';
  export default {
    components: {},
    data () {
      return {
        actType: 0,
        optionCounty: [],
        optionCountry: [],
        valueCountry: '',
        valueCounty: '',
        dialogFormVisible: false,
        formLabelWidth: '120px',
        vloading: false,
        sumbitLoading: false,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        tableData: [],
        loading: false,
        enteredCountry: '',
        enteredCity: '',
        enteredArea: '',
        optionCountryCity: [],
        valueCountryCity: [3744, 4044],
        citySumbitObject: [
          {
            cnName: '',
            enName: '',
            status: true,
            areaId: null,
            isTemporary: true
          }
        ],
      }
    },
    mounted () {
      this.search(1)
    },
    watch: {},
    methods: {
      editOpenClick () {
        this.sumbitLoading = true
        let _params = this.citySumbitObject.map((item, index) => Object.assign({cityId: this.valueCountryCity.length == 2 ? this.valueCountryCity[1] : this.valueCountryCity[0]}, item))
        xhgjSpark_fpCityListAlter(_params.filter(item => item.cnName && item.enName)).then(response => {
          if (+response.code === 200) {
            this.dialogFormVisible = false
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
          this.sumbitLoading = false
        }).catch(e => {
          this.sumbitLoading = false
        })
      },
      async mdfClick (row) {
        this.actType = 1
        await this.queryCountryAndCounty(2)
        xhgjSpark_fpCityDetails({
          cityId: row.id,
        }).then(response => {
          if (+response.code === 200) {
            this.dialogFormVisible = true
            this.citySumbitObject = (response.data.list || []).map((item, index) => {
              let {id, ...a} = item
              return {
                areaId: id,
                ...a
              }
            })
            setTimeout(() => {
              this.valueCountryCity = [row.parentId, row.id]
            }, 50)
          } else {
            this.citySumbitObject = []
            this.$message.error(response.message)
          }
          this.loading = false
        })
      },
      delCityForNow (index) {
        this.citySumbitObject.splice(index, 1)
      },
      addCity () {
        this.citySumbitObject.push({
          cnName: '',
          enName: '',
          status: true,
          isTemporary: true
        })
      },
      handleChangeCountryCity (value) {
        console.log(value)
      },
      watchChangeInnerRun (val) {
        let _params = {}
        _params.id = val.id
        xhgjSpark_fpCountryStatusAlter(_params).then(response => {
          if (response.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              'duration': 1000,
              onClose: () => {
                this.search(1)
              }
            })
          } else {
            val.status = !val.status
            this.search(1)
            this.$message.error(response.message)
          }
        }).catch(({ error }) => {
          val.status = !val.status
          this.search(1)
          if (error) this.$message.error(error.message)
        })
      },
      watchChange (val) {
        this.$confirm(`1.  相同【作用】的钱包地址，同一时间只能启用一条;<br>2.启用后，将关闭其他同一【作用】的钱包;`, '确定要启用当前钱包 ？', {
          confirmButtonText: '确认',
          dangerouslyUseHTMLString: true,
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.watchChangeInnerRun(val)
        }).catch(() => {
          val.status = !val.status
        })
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.search()
      },
      search (pgi) {
        if (pgi) this.pageIndex = pgi
        this.loading = true
        xhgjSpark_fpCityListQuery({
          area: this.enteredArea,
          city: this.enteredCity,
          country: this.enteredCountry,
          pageSize: this.pageSize,
          currentPage: this.pageIndex,
        }).then(response => {
          if (+response.code === 200) {
            this.tableData = response.data.list || []
            this.totalPage = response.data.total
          } else {
            this.tableData = []
            this.totalPage = 0
            this.pageSize = 10
            this.$message.error(response.message)
          }
          this.loading = false
        }).catch( e => {
          this.loading = false
        })
      },
      newOpenClick () {
        this.sumbitLoading = true
        let _params = this.citySumbitObject.map((item, index) => Object.assign({cityId: this.valueCountryCity.length == 2 ? this.valueCountryCity[1] : this.valueCountryCity[0]}, item))
        xhgjSpark_fpCityListAdd(_params.filter(item => item.cnName && item.enName)).then(response => {
          if (+response.code === 200) {
            this.dialogFormVisible = false
            this.$message({
              message: '操作成功',
              type: 'success',
              'duration': 1000,
              onClose: () => {
                this.search(1)
              }
            })
          } else {
            this.$message.error(response.message)
          }
          this.sumbitLoading = false
        }).catch(e => {
          this.sumbitLoading = false
        })
      },
      handleChangeCounty (value) {
        console.log(value);
      },
      async addNew () {
        this.actType = 0
        this.dialogFormVisible = true
        this.valueCountryCity = []
        this.citySumbitObject = [
          {
            cnName: '',
            enName: '',
            status: true,
            areaId: null,
            isTemporary: true
          }
        ]
        await this.queryCountryAndCounty(1)
      },
      queryCountryAndCounty (type) {
        return new Promise((resolve, reject) => {
          xhgjSpark_fpCitySelectQuery({
            type // 1:新增；2:编辑
          }).then(response => {
            if (+response.code === 200) {
              this.optionCountryCity = this.recursionTree(response.data.list || [])
              resolve(this.optionCountryCity)
            } else {
              resolve([])
            }
          })
        })
      },
      // recursion tree
      recursionTree (origin) {
        if (Array.isArray(origin)) {
          if (!origin || !origin.length) return origin
          return origin.map(val => {
            let {children, ...a} = val
            return {
              ...a,
              children: children && children.length > 0 ? children.map(this.recursionTree) : null
            }
          })
        } else {
          let {children, ...a} = origin
          return {
            ...a,
            children: children && children.length > 0 ? children.map(this.recursionTree) : null
          }
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
.mmUnit{
  padding:0 10px;color:#817d7d;
}
</style>
<style>
.nlItem .el-form-item__content{
  margin-left: 0!important;
}
</style>

