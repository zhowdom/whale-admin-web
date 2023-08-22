<template>
  <div class="vip-management">
    <div class="top-search">
      <el-form ref="vipForm" inline :rules="rules" :model="vipForm">
        <el-form-item label="用户昵称" prop="nickName">
          <el-input class="align-width" v-model.trim="vipForm.nickName" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="邀请码" prop="inviteCode">
          <el-input class="align-width" v-model.trim="vipForm.inviteCode" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input class="align-width" v-model.trim="vipForm.phone" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input class="align-width" v-model.trim="vipForm.email" clearable placeholder="请输入"></el-input>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="onSearch" v-hasPermi="['member:email_unbind:list']">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="vip-management-table">
      <p style="font-size:13px;color: rgb(114, 118, 124);">(只针对手机注册的用户进行解绑；邮箱注册的用户，不可以解绑用于注册的邮箱)</p>
      <el-table border :data="vipTableData" style="width: 100%" @sort-change="vipTableSort">
        <el-table-column prop="nickName" align="center" label="用户昵称" ></el-table-column>
        <el-table-column prop="inviteCode" align="center" label="邀请码" width="100" ></el-table-column>
        <el-table-column prop="phone" align="center" label="手机号" ></el-table-column>
        <el-table-column prop="email" align="center" label="邮箱" ></el-table-column>
        <el-table-column prop="reason" align="center" label="备注" ></el-table-column>
        <el-table-column align="center" label="操作">
          <template scope="scope">
            <el-button type="primary" @click="unBindClick(scope)" v-hasPermi="['member:email:unbind']">解除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-pagination text-right mt10">
        <!-- <el-pagination
          :current-page="pager.curPage"
          :page-sizes="[10, 20, 30]"
          :page-size="pager.size"
          :total="pager.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination> -->
      </div>
      <el-dialog center :close-on-click-modal="false" title="购买记录" :visible.sync="showBuyTable" width="60%">
        <el-table border :data="buyTableData" style="width: 100%" @sort-change="buyTableSort">
          <el-table-column prop="vipItemTitle" align="center" label="购买VIP套餐" ></el-table-column>
          <el-table-column prop="payPrice" align="center" label="购买VIP金额（USDT）" ></el-table-column>
          <el-table-column prop="payWay" align="center" label="支付方式" ></el-table-column>
          <el-table-column prop="serialId" align="center" label="支付订单号" ></el-table-column>
          <el-table-column prop="buyAt" align="center" sortable="custom"  label="购买VIP时间"></el-table-column>
          <el-table-column prop="expireAt" align="center" sortable="custom"  label="VIP到期时间"></el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {relieveBindEmail_query, relieveBindEmail_unbind} from '@/api/setting/vip';

export default {
  name: 'VipManagement',
  data () {
    return {
      expire: [],
      vipForm: {
        email: '',
        inviteCode: '',
        nickName: '',
        phone: '',
      },
      buyForm: {
        phone: '',
        email: '',
        userName: '',
        orderItems: [],
      },
      rules: {
        phone: [
          {required: false, pattern: /^1[0-9]{10}$/, message: '手机号格式有误', trigger: 'blur'}
        ],
      },
      statusType: [
        {
          value: -1,
          label: '全部',
        },
        {
          value: 0,
          label: '已过期',
        },
        {
          value: 1,
          label: '未过期',
        },
      ],
      pager: {
        curPage: 1,
        size: 10,
        total: 0,
      },
      vipTableData: [],
      buyTableData: [],
      showBuyTable: false,
    }
  },
  mounted () {
    this.vipPageRequest();
  },
  methods: {
    unBindClick (scope) {
      this.$prompt('备注：', '确定解绑？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'apiEnableTip',
        inputValue: scope.row.reason || '',
        inputPattern: /^(?=.{1,20}$)[a-zA-Z0-9]*[^$%^&*;:,<>?()\"']*$/,
        inputErrorMessage: '请输入1~20位字符'
      }).then(({ value }) => {
        this.alterTips(Object.assign(scope.row, {str: value}))
      }).catch((e) => {
        console.log(e)
      });
    },
    alterTips (opt) {
      relieveBindEmail_unbind({
        remark: opt.str,
        id: opt.id
      }).then(response => {
        if (response.code == 200) {
          this.$message({
            message: '操作成功',
            type: 'success',
            'duration': 1000,
            onClose: () => {
              this.vipPageRequest()
            }
          })
        } else {
          this.$message.error(response.message)
        }
      }).catch(e => {
        this.$message.error(response.message)
      })
    },
    // vip用户管理表格排序
    vipTableSort ({prop, order}) {
      const asc = order == 'ascending'; // 是否升序
      const column = this.formatStr(prop); // 格式字符串
      this.$set(this.vipForm.orderItems, 0, {column, asc});
      this.vipPageRequest();
    },
    // vip购买记录表格排序
    buyTableSort ({prop, order}) {
      const asc = order == 'ascending'; // 是否升序
      const column = this.formatStr(prop); // 格式字符串
      this.$set(this.buyForm.orderItems, 0, {column, asc});
    },
    // 格式日期功能
    formatDate (date, format = 'YYYY-MM-DD', def = '') {
      return date ? this.$dayjs(date).format(format) : def;
    },
    // 格式小驼峰为下划线功能
    formatStr (str) {
      return str ? str.replace(/([A-Z])/g, "_$1").toLowerCase() : '';
    },
    // 处理表格点击时产生的数据
    handleClickData ({userName, phone}) {
      this.buyTableData = [];
      this.buyForm = {...this.buyForm, userName, phone};
      this.showBuyTable = true;
    },
    // 查询vip用户分页数据
    async vipPageRequest () {
      try {
        const rqData = {
          ...this.vipForm,
          // pageSize: this.pager.size,
          // currentPage: this.pager.curPage
        };

        const {code, message, data: {list, pageSize, total}} = await relieveBindEmail_query(rqData);
        if (code == 200) {
          this.vipTableData = list;
          this.pager.size = pageSize;
          this.pager.total = total;
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
    // 条件搜索
    onSearch () {
      this.pager.curPage = 1;
      this.$refs.vipForm.validate(valid => {
        if (valid) {
          this.vipPageRequest();
        } else {
          this.$message({type: 'error', message: '手机号格式有误！'});
          return false;
        }
      });
    },
    // 分页数量修改
    handleSizeChange(val) {
      this.pager.curPage = 1;
      this.pager.size = val;
      this.vipPageRequest();
    },
    // 跳转当前页
    handleCurrentChange(val) {
      this.pager.curPage = val;
      this.vipPageRequest();
    },
  }
}
</script>

<style lang="scss" scoped>
  .vip-management {
    padding: 20px;
    .top-search  {
      .align-width {
        width: 270px;
      }
      .el-form-item {
        margin-right: 36px;
        ::v-deep .el-form-item__label {
          font-weight: 400;
        }
        button {
          padding: 10px 30px;
        }
      }
    }
  }
</style>
