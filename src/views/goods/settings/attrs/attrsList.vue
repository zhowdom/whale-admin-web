<template>
  <div class="goodsClassfyWrapper">
     <el-button type="primary" :loading="loading" @click="reBack" style="float:right;margin-bottom:20px;margin-left:10px;">返回</el-button>
    <el-button v-hasPermi="['goods:attribute_item:save']" type="primary" :loading="loading" icon="el-icon-plus" @click="addClick" style="float:right;margin-bottom:20px;">添加</el-button>

     <el-table :data="tableData" border>
      <el-table-column header-align="center" align="center" property="goodsAttrItemId" label="编号" width="100"></el-table-column>
      <el-table-column header-align="center" align="center" property="itemName" label="属性名称"></el-table-column>
      <el-table-column header-align="center" align="center" property="goodsAttrName" label="类型名称"></el-table-column>
      <el-table-column header-align="center" align="center" property="optionalInfo" label="可选值列表">
        <template scope="scope">
          <p>
            {{(scope.row.optionalInfo || []).join('，')}}
          </p>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" property="sort" label="排序" width="60"></el-table-column>
      <el-table-column header-align="center" align="center" label="操作" width="150">
        <template scope="scope">
          <el-button v-hasPermi="['goods:attribute_item:update']" type="primary" size="mini" @click="editClick(scope.row)">编辑</el-button>
          <el-button v-hasPermi="['goods:attribute_item:del']" type="primary" size="mini" @click="deleteClick(scope.row)">删除</el-button>
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

        <!--新增/修改dialog-->
        <el-dialog :title="curActionType === 'add' ? '添加' : ' 编辑'" :visible.sync="dialogFormVisible" width="35%">
          <el-form :model="form" ref="ruleFormAttrInSet" :rules="rules">

            <el-form-item label="商品类型" :label-width="formLabelWidth">
              <el-input readonly v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="属性名称" :label-width="formLabelWidth" prop="itemName" rquired>
              <el-input maxlength="10" v-model.trim="form.itemName" autocomplete="off"></el-input>
            </el-form-item>
            
            <el-form-item label="属性值可选值列表" :label-width="formLabelWidth" prop="optionalInfo" rquired>
              <el-input
                type="textarea"
                placeholder="请输入内容"
                :rows="5"
                v-model="form.optionalInfo"
                show-word-limit
              >
              </el-input>
            </el-form-item>

            <el-form-item style="text-align:right;">
              <el-button :loading="loadingSave" type="primary" @click="onSubmit('ruleFormAttrInSet')">保存</el-button>
              <el-button @click="handleClose">取消</el-button>
            </el-form-item>
            
          </el-form>

        </el-dialog>
    
  </div>
</template>

<script>
import { gdsAttrsInnerList, gdsAttrsInnerAdd, gdsAttrsInnerAlter, gdsAttrsInnerDel } from "@/api/goods/goodsAbout";
  export default {
    components: {},
    data () {
      // let validateItemName = (rule, value, callback) => {
      //   if (!/\S/.test(value) || !value) {
      //     callback(new Error('不能为空'))
      //   } else {
      //     callback()
      //   }
      // }
      let validateOptional = (rule, value, callback) => {
        if (!/\S/.test(value) || !value) {
          callback(new Error('属性值可选值列表不能为空'))
        } else {
          callback()
        }
      }
      return {
        rules: {
          itemName: [
            // { validator: validateItemName, trigger: 'blur' },
            { required: true, message: '请输入属性名称名称', trigger: 'blur' },
            { min: 1, max: 10, message: '长度在1到10个字符', trigger: 'blur' }
          ],
          optionalInfo: [
            { validator: validateOptional, trigger: 'blur' }
          ]
        },
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        loading: false,
        dialogFormVisible: false,
        loadingSave: false,
        formLabelWidth: '140px',
        rowData: {},
        form: {
          name: this.$route.query.name, // 只读，显示用，新增｜修改均不需传
          goodsAttrId: '', // 新增时候传
          goodsAttrItemId: '', // 修改时候传
          optionalInfo: '', // Array
          itemName: ''
        },
        curActionType: 'add',
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
      // 删除
      deleteClick (row) {
        this.$confirm(`确认要删除吗？`, '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _params = {
            goodsAttrItemId: row.goodsAttrItemId
          }
          gdsAttrsInnerDel(_params).then(response => {
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
      reBack () {
        this.$router.push("/goods/attrsTypes")
      },
      handleBlur (ev) {
        // blur后若输入内容为空，处理为显示对应特权类型的最小默认值
        if (ev.target.ariaValueNow === 'undefined') this.sumbitForm.count = ev.target.value = ev.target.ariaValueMin
      },
      handleTextAreaContent () {
        // divide with '\n' as a single data and filtering an entire line is empty.
        return new Promise((resolve, reject) => {
          resolve(this.form.optionalInfo.split('\n').filter(value => value.replace(/(^\s*)|(\s*$)/g, '') !== ''))
        })
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$refs[formName].validate(async (valid) => {
              if (valid) {
                // 保存提交
                this.loadingSave = true
                let optionalInfo_combained = await this.handleTextAreaContent()
                let _form = Object.assign({}, this.form)
                _form.optionalInfo = [...new Set(optionalInfo_combained || [])]
                _form.goodsAttrId = this.$route.query.goodsAttrId
                _form.goodsAttrItemId = this.rowData.goodsAttrItemId
                if (this.curActionType === 'add') {
                  Reflect.deleteProperty(_form, 'goodsAttrItemId')
                } else {
                  Reflect.deleteProperty(_form, 'goodsAttrId')
                }
                Reflect.deleteProperty(_form, 'name')
                const _api = this.curActionType === 'add' ? gdsAttrsInnerAdd : gdsAttrsInnerAlter
                _api(_form).then(response => {
                    if (response.code === 200) {
                    this.$message({
                      message: '操作成功',
                      type: 'success',
                      'duration': 1000,
                      onClose: () => {
                        this.handleClose()
                        this.search(1)
                      }
                    })
                    } else {
                    this.$message({
                      type: 'error',
                      message: response.message
                    })
                    this.loadingSave = false
                  }
                }).catch(() => {
                  this.loadingSave = false
                })
              }
            })
          }
        })
      },
      handleClose() {
        this.loadingSave = false
        this.dialogFormVisible = false
      },
      handlePreview(file) {
        console.log(file)
      },
      editClick (row) {
        this.curActionType = 'edit'
        this.rowData = row
        this.form = {
          name: this.$route.query.name,
          goodsAttrId: this.$route.query.goodsAttrId,
          goodsAttrItemId: row.goodsAttrItemId,
          optionalInfo: (row.optionalInfo || []).join(',').replace(/,/g, '\n'),
          itemName: row.itemName
        }
        this.clearValidateRun()
      },
      clearValidateRun () {
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs.ruleFormAttrInSet.clearValidate()
        })
      },
      addClick () {
        this.curActionType = 'add'
        this.form = {
          name: this.$route.query.name,
          goodsAttrId: this.$route.query.goodsAttrId,
          goodsAttrItemId: '',
          optionalInfo: '',
          itemName: ''
        }
        this.clearValidateRun()
      },
      search (pgi) {
        if (pgi) this.pageIndex = pgi
        let _params = {
          goodsAttrId: this.$route.query.goodsAttrId,
          currentPage: this.pageIndex,
          pageSize: this.pageSize
        }
        this.loading = true
        gdsAttrsInnerList(_params).then(response => {
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

