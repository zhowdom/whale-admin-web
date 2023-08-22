<template>
  <div class="fpCountryBox" style="padding:20px;">
    

    <el-form :inline="true">
              
      <el-form-item label="国家">
          <el-input clearable v-model="enteredCountry" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="城市">
          <el-input clearable v-model="enteredCity" placeholder="请输入"></el-input>
      </el-form-item>
      
      <el-form-item label="">
          <el-button :loading="loading" v-hasPermi="['abroad:district_country:page']" type="primary" @click="search(1)">查询</el-button>
          <el-button v-hasPermi="['abroad:district_country:enable']" type="primary" @click="addNew">启用</el-button>
          <span style="margin-left:20px;">(注：启用后，不可以删除，只能禁用， 1个城市具有唯一性)</span>
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
                prop="openedLan"
                label="已开通语言">
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
          <el-table-column property="status" label="状态">
              <template scope="scope">
                  <el-switch
                  v-hasPermi="['abroad:district_country:changeStatus']"
                  v-model="scope.row.status"
                  @change="watchChange(scope.row)"
                  class="customSwitchStyle"
                  active-color="#00A854"
                  active-text="已开启"
                  inactive-color="#F04134"
                  inactive-text="已禁用"
                  />
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
    <el-dialog title="" :visible.sync="dialogFormVisible" width="39%">
          <el-form>

            <el-form-item label="国家：" :label-width="formLabelWidth">
              <el-select @change="handleChangeCountry" v-model="valueCountry" filterable placeholder="请选择">
                <el-option
                  v-for="item in optionCountry"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="城市：" :label-width="formLabelWidth">
              <el-select @change="handleChangeCounty" v-model="valueCounty" filterable placeholder="请选择">
                <el-option
                  v-for="item in optionCounty"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button :loading="sumbitLoading" type="primary" @click="newOpenClick">确 定</el-button>
          </div>
        </el-dialog>

    

  </div>
</template>

<script>
import { xhgjSpark_fpCountrySelectQuery, xhgjSpark_fpCountryNewOpen, xhgjSpark_fpCountryStatusAlter, xhgjSpark_fpCountryListQuery } from "@/api/xhgjSpark_api";
  export default {
    components: {},
    data () {
      return {
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
      }
    },
    mounted () {
      this.search(1)
    },
    watch: {},
    methods: {
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
                this.search()
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
        this.$confirm(`确认要执行此操作 ？`, '', {
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
        xhgjSpark_fpCountryListQuery({
          city: this.enteredCity,
          country: this.enteredCountry,
          pageSize: this.pageSize,
          currentPage: this.pageIndex,
        }).then(response => {
          if (+response.code === 200) {
            this.tableData = (response.data.list || []).map((item, index) => {
              return {
                openedLan: '中文简体，英文',
                ...item,
              }
            })
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
        xhgjSpark_fpCountryNewOpen({
          cityId: this.valueCounty,
          countryId: this.valueCountry
        }).then(response => {
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
      handleChangeCountry (value) {
        this.queryCountryAndCounty(value)
      },
      handleChangeCounty (value) {
        console.log(value);
      },
      addNew () {
        this.dialogFormVisible = true
        this.queryCountryAndCounty()
      },
      queryCountryAndCounty (id) {
        xhgjSpark_fpCountrySelectQuery({countryId: id}).then(response => {
          if (+response.code === 200) {
            if (id) {
              this.optionCounty = (response.data.list || []).map((item, index) => {
                return {
                  value: item.id,
                  label: item.name,
                  disable: item.disable
                }
              })
              if (this.optionCounty.length <= 0) {
                this.valueCounty = ''
              } else {
                this.valueCounty = this.optionCounty[0]['value']
              }
            } else {
              this.optionCountry = (response.data.list || []).map((item, index) => {
                return {
                  value: item.id,
                  label: item.name,
                  disable: item.disable
                }
              })
              if (this.optionCountry.length <= 0) {
                this.valueCountry = ''
              } else {
                this.valueCountry = this.optionCountry[0]['value']
                this.handleChangeCountry(this.valueCountry)
              }
            }
          } else {
            this.optionCountry = []
            this.optionCounty = []
          }
        })
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

