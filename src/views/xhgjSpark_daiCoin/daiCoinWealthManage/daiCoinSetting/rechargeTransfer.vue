<template>
  <div class="tab-content">
    <!--table-->
    <div class="task-table">
      <el-table
      :data="tableData"
      v-loading="loading"
      style="width: 100%">
        <el-table-column prop="coinName" label="币种" align="center" min-width="120"></el-table-column>
        <template v-for="(item, key, index) in headerData">
          <el-table-column :prop="key" :label="item" align="center" min-width="120" :key="index">
            <template slot-scope="{row}">
              <template v-if="row[key]">
                <el-switch v-hasPermi="['whale:coin:setting:update']" v-model="row[key].enable" @change="handleSetType(row, row[key])"></el-switch>
              </template>
              <span v-else>--</span>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <!--table-->
  </div>
</template>

<script>
import { tokensConfigList, rechargeTransferList, editCoinSetting } from "@/api/xhgjSpark_api/daiCoinSetting.js";

export default {
  data() {
    var validateNumber = (rule, value, callback) => {
      if (!(/^[1-9]\d*$/.test(value)) && value !== '') {
        return callback(new Error('请输入正数'))
      }
      callback()
    }
    return {
      loading: false,
      tableData: [],
      dialogTitle: '充值转账功能配置',
      certifyform: {
        coinName: '',
        functionType: []
      },
      rules: {
        jingdu: [
          { required: true, validator: validateNumber, trigger: 'blur' }
        ],
      },
      formLabelWidth: '120px',
      headerData: {},// 表头
    }
  },
  mounted() {
    this.getHeaderData();
  },
  activated() {
    this.search();
  },
  methods: {
    // 获取表头
    getHeaderData() {
      tokensConfigList({}).then(response => {
        if (response.code === 200) {
          this.headerData = JSON.parse(JSON.stringify(response.data));
        } else {
          this.headerData = {};
        }
      })
    },
    // 数据查询
    search () {
      let _params = {
        coinName: '',
        functionType: '',
        settingType: 1
      }
      this.loading = true
      rechargeTransferList(_params).then(response => {
        if (response.code === 200) {
          this.tableData = this.settingData(JSON.parse(JSON.stringify(response.data)), this.headerData);
          this.loading = false
        } else {
          this.tableData = []
          this.loading = false
          this.$message.error(response.message)
        }
      }).catch(e => {
        console.log(e)
        this.loading = false
      })
    },
    // 列表数据处理
    settingData(obj, headObj) {
      let arr = [];
      let newHeadObj = {};
      for(let key in headObj) {
        newHeadObj[key] = '';
      }
      newHeadObj.coinName = '';
      for(let key in obj) {
        let arrObj = Object.assign({}, newHeadObj);
        arrObj['coinName'] = key;
        obj[key].forEach(item => {
          arrObj[item.functionType] = item;
        })
        arr.push(arrObj);
      }
      return arr;
    },
    // 状态开关
    handleSetType(row, child) {
      let text = child.enable == false ? "停用" : "启用";
      this.$confirm(`确认要${text}该配置?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        let _params = {
          enable: child.enable,
          id: child.id
        }
        editCoinSetting(_params).then(response => {
          if (response.code === 200) {
            this.msgSuccess(`保存成功`)
            this.search();
          } else {
            this.msgSuccess(response.message)
          }
        })
      }).catch(() => {
        if(child.enable == false) {
          row[child.functionType].enable = true
        } else{
          row[child.functionType].enable = false
        }
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.tab-content{
  
}
</style>
