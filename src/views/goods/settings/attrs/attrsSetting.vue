<template>
  <div class="goodsClassfyWrapper">
    
    <el-dialog
      :title="curActionType === 'add' ? '添加' : ' 编辑'"
      :visible.sync="sendTochildBridgeData.visible"
      width="30%"
      :before-close="handleClose">

    <el-form :model="form" label-width="150px" ref="ruleFormClassSet" :rules="rules">
      <el-form-item label="类型名称：" prop="name" class="mockRequired">
        <el-input maxlength="10" v-model.trim="form.name"></el-input>
      </el-form-item>

      <el-form-item style="text-align:right">
        <el-button :loading="loadingSave" type="primary" @click="onSubmit('ruleFormClassSet')">保存</el-button>
        <el-button @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>

    </el-dialog>

  </div>
</template>

<script>
import { gdsAttrsAdd, gdsAttrsAlter } from "@/api/goods/goodsAbout";
  export default {
    props: ['sendTochildBridgeData'],
    components: {},
    data () {
      let validateItemName = (rule, value, callback) => {
        if (!/\S/.test(value) || !value) {
          callback(new Error('不能为空'))
        } else {
          callback()
        }
      }
      return {
        rules: {
          name: [
             { validator: validateItemName, trigger: 'blur' },
             { min: 1, max: 10, message: '长度在1到10个字符', trigger: 'blur' }
          ]
        },
        curActionType: 'add',
        loadingSave: false,
        form: {
          name: '',
          goodsAttrId: ''
        }
      }
    },
    filters: {},
    watch: {
      'sendTochildBridgeData': {
        handler: function (newVal, oldVal) {
          if (newVal.actionType === 'add') {
            this.curActionType = 'add'
            this.form = {
              name: '',
              goodsAttrId: ''
            }
            // this.form.categoryName = newVal.data.categoryName
          } else if (newVal.actionType === 'edit'){
            this.curActionType = 'edit'
            this.form = {
              name: newVal.rowData.name,
              goodsAttrId: newVal.rowData.goodsAttrId
            }
          }
          this.$nextTick(() => {
            this.$refs.ruleFormClassSet.clearValidate()
          })
        },
        deep: true
      }
    },
    computed: {},
    mounted () {},
    methods: {
      handleBlur (ev) {
        // blur后若输入内容为空，处理为显示对应特权类型的最小默认值
        if (ev.target.ariaValueNow === 'undefined') this.sumbitForm.count = ev.target.value = ev.target.ariaValueMin
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 保存提交
            this.loadingSave = true
            let _form = Object.assign({}, this.form)
            if (this.curActionType === 'add') {
              Reflect.deleteProperty(_form, 'goodsAttrId')
            }
            const _api = this.curActionType === 'add' ? gdsAttrsAdd : gdsAttrsAlter
            _api(_form).then(response => {
                if (response.code === 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  'duration': 1000,
                  onClose: () => {
                    this.handleClose()
                    this.loadingSave = false
                    this.sendTochildBridgeData.search()
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
      },
      handleClose() {
        this.sendTochildBridgeData.visible = false
        this.$refs.ruleFormClassSet.clearValidate()
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
<style lang="scss">
.mockRequired label.el-form-item__label{
  position: relative;
}
.mockRequired label.el-form-item__label:before{
  position: absolute;
  top:0;
  right:86px;
  content: '*';
  color: red;
  }
</style>

