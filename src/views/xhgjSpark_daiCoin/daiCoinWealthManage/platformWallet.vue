<template>
  <div class="wallet_Wrapper">
    <div class="topshow" style="padding-bottom:20px;">
      <el-button v-hasPermi="['advertising:user_oper:page']" type="primary" icon="el-icon-plus" @click="addWallet">增加钱包</el-button>
      <el-button v-hasPermi="['advertising:user_oper:page']" :loading="loading" type="primary" icon="el-icon-search" @click="search(1)">刷新</el-button>
      <span style="margin-left:10px;">( 默认统计昨日数量，刷新后，可获得最新数据 。刷新需要等待几分钟，请耐心等待)</span>
    </div>
    <div class="mb20">
      <el-form :model="queryParams" ref="queryForm" :inline="true" class="mytopformstyle">
        <el-form-item label="转账网络" prop="transactionNetworkName">
          <el-select v-model="queryParams.transactionNetworkName" clearable placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, index) in transferListArr" :label="item" :value="item" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="钱包名称" prop="name">
            <el-input clearable v-model="queryParams.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="代币" prop="coinName">
          <el-select v-model="queryParams.coinName" clearable placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, index) in daiCoinSettingArr" :label="item" :value="item" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="钱包地址" prop="address">
            <el-input clearable v-model="queryParams.address" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="作用" prop="actionType">
          <el-select v-model="queryParams.actionType" clearable placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="资金归集钱包" :value="1"></el-option>
            <el-option label="归集手续费钱包" :value="2"></el-option>
            <el-option label="用户提现钱包" :value="3"></el-option>
            <el-option label="卖了还钱提现钱包" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" style="border:none;">
            <el-button v-hasPermi="['advertising:user_oper:page']" :loading="loading" type="primary" icon="el-icon-search" @click="search(1)">查询</el-button>
            <el-button :loading="loading" type="primary" plain @click="resetQuery()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--table-->
    <el-table
    :data="tableData"
    border
    v-loading="loading"
    class="userpowerbox"
    style="width: 100%">
        <el-table-column
            prop="transactionNetworkName"
            align="center"
            label="转账网络">
        </el-table-column>
        <el-table-column
            align="center"
            prop="name"
            label="钱包名称">
        </el-table-column>
        <el-table-column
            prop="coinName"
            align="center"
            label="代币">
        </el-table-column>
        <el-table-column
            prop="coinBalance"
            align="center"
            label="代币余额">
        </el-table-column>
        <el-table-column
            prop="balance"
            align="center"
            maxlength="11"
            label="本币余额">
        </el-table-column>
        <el-table-column
            prop="actionType"
            align="center"
            maxlength="11"
            label="作用">
            <template scope="scope">
              <p v-if="+scope.row.actionType === 1">资金归集钱包</p>
              <p v-else-if="+scope.row.actionType === 2">归集手续费钱包</p>
              <p v-else-if="+scope.row.actionType === 3">用户提现钱包</p>
              <p v-else-if="+scope.row.actionType === 4">卖了还钱提现钱包</p>
            </template>
        </el-table-column>
        <el-table-column
            prop="address"
            align="center"
            maxlength="11"
            label="钱包地址">
        </el-table-column>
        <el-table-column
            prop="collectLimit"
            align="center"
            maxlength="11"
            label="阈值">
            <template slot-scope="{row}">
              <span v-if="+row.actionType === 1">{{row.collectLimit}}</span>
              <span v-else>--</span>
            </template>
        </el-table-column>
        <el-table-column prop="collectStatus" label="状态" align="center" min-width="120">
          <template slot-scope="{row}">
            <span v-if="+row.actionType === 1">{{row.collectStatus == 1 ? "启用" : "禁用"}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="remark"
            align="center"
            maxlength="11"
            label="备注">
        </el-table-column>
        <!-- <el-table-column
            prop="updatedAt"
            align="center"
            width="180"
            label="更新时间">
            <template slot-scope="{row}">
              {{row.updatedAt ? $dayjs(row.updatedAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
            </template>
        </el-table-column> -->
        <el-table-column
            prop="status"
            align="center"
            label="账户状态">
            <template scope="scope">
              <p v-if="+scope.row.status === 0">正常</p>
              <p v-else-if="+scope.row.status === 1">手续费不足或者余额不足</p>
              <p v-else-if="+scope.row.status === 2">nonce序号异常</p>
              <p v-else-if="+scope.row.status === 3">网络异常尝试自动修复</p>
            </template>
        </el-table-column>
        <el-table-column property="enable" label="状态">
          <template scope="scope">
              <el-switch
              v-hasPermi="['game:lottery:pool:updateStatus']"
              v-model="scope.row.enable"
              @change="watchChange(scope.row)"
              class="customSwitchStyle"
              active-color="#00A854"
              active-text="已开启"
              inactive-color="#F04134"
              inactive-text="已禁用"
              />
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            width="200"
            label="操作">
            <template scope="scope">
              <div style="padding-bottom:5px;" v-if="scope.row.actionType == 1"><el-button type="primary" size="mini" @click="handelDetails(scope.row)">归集记录</el-button></div>
              <div v-if="+scope.row.status === 1" style="padding-bottom:5px;"><el-button type="primary" size="mini" @click="refresh(scope.row)">已充值点击刷新</el-button></div>
              <div style="padding-bottom:5px;" v-if="+scope.row.actionType === 3"><el-button type="primary" @click="havaAsee" size="mini">提现明细</el-button></div>
              <div v-if="+scope.row.actionType === 1" style="padding-bottom:5px;"><el-button type="primary" size="mini" @click="thresholdEdit(scope.row)">阈值</el-button></div>
              <!-- <div style="padding-bottom:5px;" v-show="!scope.row.enable"><el-button @click="removeClick(scope.row)" type="primary" size="mini">删除</el-button></div> -->
            </template>
        </el-table-column>
    </el-table>
    <!--table-->
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
    <!--添加钱包地址-->
    <el-dialog title="添加钱包地址" :visible.sync="dialogwalletVisible">
      <el-form :model="walletform" :rules="myrules" ref="mywallertForm">

        <el-form-item label="作用" :label-width="formLabelWidth">
          <el-select @change="handleChangeWallet" v-model="walletform.actionType" placeholder="">
            <el-option label="资金归集钱包" value="1"></el-option>
            <el-option label="归集手续费钱包" value="2"></el-option>
            <el-option label="用户提现钱包" value="3"></el-option>
            <el-option label="卖了还钱提现钱包" value="4"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="转账网络" :label-width="formLabelWidth">
          <el-select @change="handleChangeWallet" v-model="walletform.transactionNetworkName" placeholder="">
            <el-option label="ERC20" value="ERC20"></el-option>
            <el-option label="BEP20" value="BEP20"></el-option>
            <el-option label="TRC20" value="TRC20"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="代币" :label-width="formLabelWidth">
          <el-select :disabled="+walletform.actionType == 2" v-model="walletform.contractId" placeholder="" style="margin-right:10px;">
            <el-option v-for="(item,index) in contractIdMaps" :key="index" :label="item.coinName" :value="item.id"></el-option>
          </el-select>
          <span v-if="+walletform.actionType == 2 && walletform.transactionNetworkName == 'ERC20'">ERC20的本币为 ETH</span>
          <span v-else-if="+walletform.actionType == 2 && walletform.transactionNetworkName == 'BEP20'">BEP20的本币为 BNB</span>
          <span v-else-if="+walletform.actionType == 2 && walletform.transactionNetworkName == 'TRC20'">TRC20的本币为 TRX</span>
        </el-form-item>

        <el-form-item label="钱包地址" :label-width="formLabelWidth" prop="address">
          <el-input v-if="+walletform.actionType !== 1" disabled v-model="walletform.address" autocomplete="off" placeholder="系统生产"></el-input>
          <el-input v-else v-model="walletform.address" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="钱包名称" :label-width="formLabelWidth">
          <el-input v-model="walletform.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input show-word-limit type="textarea" maxlength="30" v-model="walletform.remark" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="验证码1" :label-width="formLabelWidth" v-if="+walletform.actionType == 1" prop="code">
          <div>
            <el-input maxlength="6" v-model="walletform.code" autocomplete="off" style="width:150px;margin-right:10px;"></el-input>
            <el-button @click="sendCode(1)">获取验证码</el-button>
          </div>
          <span v-show="showCodeBox1">验证码已发送至：{{phoneNumber1}}</span>
        </el-form-item>
        <el-form-item label="验证码2" :label-width="formLabelWidth" v-if="+walletform.actionType == 1" prop="code2">
          <div>
            <el-input maxlength="6" v-model="walletform.code2" autocomplete="off" style="width:150px;margin-right:10px;"></el-input>
            <el-button @click="sendCode(2)">获取验证码</el-button>
          </div>
          <span v-show="showCodeBox2">验证码已发送至：{{phoneNumber2}}</span>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <span class="text-muted">（需要输入2个正确的验证码，才可以创建或编辑）</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogwalletVisible = false">取 消</el-button>
        <el-button type="primary" :loading="sumbitWalletLoading" @click="sumbitWalletAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!--修改阈值-->
    <el-dialog title="修改阈值" :visible.sync="thresholdBool" :width="'500px'">
      <el-form :model="thresholdParam" :rules="thresholdrules" ref="thresholdForm">
        <el-form-item label="阈值" :label-width="formLabelWidth" prop="collectLimit">
          <el-input v-model="thresholdParam.collectLimit"  @input="thresholdParam.collectLimit=thresholdParam.collectLimit.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g,'$1')" autocomplete="off" placeholder="请输入..." maxlength="20"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <span>6位精度，上限1000000</span>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth" prop="collectStatus">
          <el-switch v-model="thresholdParam.collectStatus" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="thresholdBool = false">取 消</el-button>
        <el-button type="primary" :loading="thresholdLoading" @click="sumbitThreshold('thresholdForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { daiCoinSettingList, transferList, cashsweepConfigModify } from "@/api/xhgjSpark_api/daiCoinSetting.js";
import { xhgjSpark_platWalletRefresh, xhgjSpark_platWalletList, xhgjSpark_platWalletSendCode, xhgjSpark_platWalletAdd, xhgjSpark_platWalletDel, xhgjSpark_platWalletSwitchValid, xhgjSpark_platWalletSwitch, xhgjSpark_platWalletDaiCoinMaps } from "@/api/xhgjSpark_api";
  export default {
    components: {},
    data () {
      var validateAddress = (rule, value, callback) => {
        if (+this.walletform.actionType === 1 && value == '') {
          return callback(new Error('请输入钱包地址'))
        }
        callback()
      }
      var validateCode = (rule, value, callback) => {
        if (+this.walletform.actionType === 1 && value == '') {
          return callback(new Error('请输入验证码'))
        }
        callback()
      }
      var maxNumber = (rule, value, callback) => {
        if(Number(value) > 1000000 || Number(value) < 0) {
          return callback(new Error('阈值为数字且必须大于等于0小于1000000的数值'))
        }
        callback()
      }
      return {
        myrules: {
          address: [
            { validator: validateAddress, trigger: 'blur' }
          ],
          code: [
            { validator: validateCode, trigger: 'blur' }
          ],
          code2: [
            { validator: validateCode, trigger: 'blur' }
          ]
        },
        formLabelWidth: '120px', // 新增修改ed
        loading: false,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        input: '',
        queryParams: {
          transactionNetworkName: '',
          name: '',
          coinName: '',
          address: '',
          actionType: '',
        },
        tableData: [],
        dialogwalletVisible: false,
        contractIdMaps: [],
        walletform: {
          actionType: '1',
          transactionNetworkName: 'ERC20',
          contractId: '',
          name: '',
          remark: '',
          address: '',
          code: '',
          code2: ''
        },
        showCodeBox1: false,
        showCodeBox2: false,
        phoneNumber1: '',
        phoneNumber2: '',
        sumbitWalletLoading: false,
        daiCoinSettingArr: [],
        transferListArr: [],
        thresholdBool: false,
        thresholdLoading: false,
        thresholdParam: {
          collectLimit: 30,
          collectStatus: 0,
          id: ''
        },
        thresholdrules: {
          collectLimit: [
            { required: true, validator: maxNumber, trigger: 'blur' },
          ]
        }
      }
    },
    mounted () {
      this.search();
      this.daiCoinSettingList();
      this.transferList();
    },
    watch: {},
    methods: {
      daiCoinSettingList() {
        daiCoinSettingList({}).then(response => {
          if (response.code === 200) {
            this.daiCoinSettingArr = JSON.parse(JSON.stringify(response.data))
          } else {
            this.daiCoinSettingArr = []
            this.$message.error(response.message)
          }
        })
      },
      transferList() {
        transferList({}).then(response => {
          if (response.code === 200) {
            this.transferListArr = JSON.parse(JSON.stringify(response.data))
          } else {
            this.transferListArr = []
            this.$message.error(response.message)
          }
        })
      },
      refresh (row) {
        xhgjSpark_platWalletRefresh({
          walletHotId: row.id
        }).then(response => {
          if (+response.code === 200) {
            this.$message.success("操作成功")
            this.search(1)
          } else {
            this.$message.error(response.message)
          }
        }).catch(e => {})
      },
      havaAsee () {
        this.$router.push({ path: "/daiCoinWealthManage/depositWithdrawalLog", query: {}})
      },
      sumbitWalletAdd () {
        this.$refs.mywallertForm.validate(valid => {
          if (valid) {
            this.sumbitWalletLoading = true
            xhgjSpark_platWalletAdd(this.walletform).then(response => {
              if (+response.code === 200) {
                this.$message.success("操作成功")
                this.dialogwalletVisible = false
                this.sumbitWalletLoading = false
                this.search(1)
              } else {
                this.$message.error(response.message)
                this.sumbitWalletLoading = false
              }
            }).catch(e => {
              this.sumbitWalletLoading = false
            })
          }
        })
      },
      sendCode (num) {
        xhgjSpark_platWalletSendCode({phoneOrder: num}).then(response => {
          if (+response.code === 200 && response.data) {
            this.$message.success("发送成功")
            let phoneNum = response.data.phone.substr(0,3) + '****' + response.data.phone.substr(7,response.data.phone.length);
            if(num == 1) {
              this.showCodeBox1 = true;
              this.phoneNumber1 = phoneNum;
            }
            if(num == 2) {
              this.showCodeBox2 = true;
              this.phoneNumber2 = phoneNum;
            }
          } else {
            this.$message.error(response.message)
          }
        })
      },
      handleChangeWallet () {
        this.daiCoinArrQuery()
        this.$nextTick(() => {
          if (+this.walletform.actionType !== 1) {
            this.$refs['mywallertForm'].clearValidate()
          }
        })
      },
      // 查询代币集合下拉
      daiCoinArrQuery () {
        xhgjSpark_platWalletDaiCoinMaps({
          actionType: this.walletform.actionType,
          transactionNetworkName: this.walletform.transactionNetworkName
        }).then(response => {
          if (+response.code === 200) {
            this.contractIdMaps = response.data || []
            // 处理：默认选中第一项
            this.walletform.contractId = this.contractIdMaps[0].id
          } else {
            this.contractIdMaps = []
          }
        })
      },
      // 启用禁用之前校验
      runvalid (val) {
        return new Promise((resolve, reject) => {
          xhgjSpark_platWalletSwitchValid({
            id: val.id
          }).then(response => {
            if (+response.code === 200) {
              resolve(response.data)
            } else {
              val.enable = !val.enable
              this.$message.error(response.message)
            }
          }).catch(e => {
            val.enable = !val.enable
          })
        })
      },
      async watchChange (val) {
        let _res = await this.runvalid(val)
        if (!_res) { // 如果false，弹出询问
          this.$confirm(`1.  相同【作用】的钱包地址，同一时间只能启用一条;<br>2.启用后，将关闭其他同一【作用】的钱包;`, '确定要启用当前钱包 ？', {
            confirmButtonText: '确认',
            dangerouslyUseHTMLString: true,
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.watchChangeInnerRun(val)
          }).catch(() => {
            val.enable = !val.enable
          })
        } else {
          this.$confirm(`确认要执行此操作吗？`, '警告', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.watchChangeInnerRun(val)
          }).catch(() => {
            val.enable = !val.enable
          })
        }
      },
      watchChangeInnerRun (val) {
        let _params = {}
        _params.id = val.id
        _params.enable = val.enable
        xhgjSpark_platWalletSwitch(_params).then(response => {
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
            val.enable = !val.enable
            this.search(1)
            this.$message.error(response.message)
          }
        }).catch(({ error }) => {
          val.enable = !val.enable
          this.search(1)
          if (error) this.$message.error(error.message)
        })
      },
      addWallet () {
        this.walletform.code = ''
        this.walletform.code2 = ''
        this.walletform.address = ''
        this.walletform.name = ''
        this.walletform.remark = ''
        this.dialogwalletVisible = true
        this.showCodeBox1 = false;
        this.showCodeBox2 = false;
        this.phoneNumber1 = '';
        this.phoneNumber2 = '';
        this.daiCoinArrQuery()
        this.$nextTick(() => {
          this.$refs['mywallertForm'].clearValidate()
        })
      },
      removeClick (row) {
        this.$confirm(`确认要执行此操作吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // do here ...
          xhgjSpark_platWalletDel(
            {id: row.id}
          ).then(response => {
            if (response.code === 200) {
              this.$message({
                message: '移除成功',
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
        }).catch(() => {})
      },
      // 重置
      resetQuery() {
        this.queryParams = {
          transactionNetworkName: '',
          name: '',
          coinName: '',
          address: '',
          actionType: '',
        }
        this.search(1);
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.search()
      },
      search (pgi) {
        if (pgi) this.pageIndex = pgi;
        let _params = {
          currentPage: this.pageIndex,
          pageSize: this.pageSize,
          ...this.queryParams
        }
        this.loading = true
        xhgjSpark_platWalletList(_params).then(response => {
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
          console.log(e)
          this.loading = false
        })
      },
      // 查看
      handelDetails(row) {
        const query = {
          memberId: '',
          platformName: row.platformName,
          coinName: '',
          nickname: row.nickname,
          inviteCode: row.inviteCode,
          routePath: 'platformWallet'
        };
        const curView = this.$route;
        const path = 'moneyCollectLogForDetails';

        this.$store.dispatch('tagsView/delView', curView).then(() => {
          this.$nextTick(() => {
            this.$router.replace({path, query});
          });
        });
      },
      // 阈值修改
      thresholdEdit(row) {
        this.thresholdBool = true;
        this.thresholdParam.collectLimit = row.collectLimit;
        this.thresholdParam.collectStatus = row.collectStatus;
        this.thresholdParam.id = row.id;
      },
      sumbitThreshold(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let _params = {
              collectLimit: this.thresholdParam.collectLimit,
              collectStatus: this.thresholdParam.collectStatus == 1 ? 1 : 0,
              id: this.thresholdParam.id
            }
            this.thresholdLoading = true;
            this.updata(_params);
          }
        })
      },
      // 提交编辑
      updata(data) {
        cashsweepConfigModify(data).then(response => {
          if (response.code === 200) {
            this.msgSuccess(`保存成功`)
            this.thresholdLoading = false;
            this.thresholdBool = false;
            this.search(this.pageIndex);
          } else {
            this.msgSuccess(response.message)
            this.thresholdLoading = false;
            this.thresholdBool = false;
          }
        }).catch(err => {
          this.thresholdLoading = false;
        })
      }
    }
  }
</script>

<style>
.wallet_Wrapper{
    padding: 20px;
}
 .wallet_Wrapper .topshow ul{
     margin-left: -36px;
 }
 .wallet_Wrapper .topshow li{
    padding: 5px;
    float: left;
    list-style: none;
    margin-right: 10px;
    border: 1px solid #ccc;
    border-radius:3px;
    margin-bottom: 10px;
    font-size: 13px;
 }
 .wallet_Wrapper .codeLeft, .wallet_Wrapper .auditCenter, .wallet_Wrapper .auditRight{
   height: 80px;
 }
  .wallet_Wrapper .codeLeft{
    width:200px;
    padding-top: 20px;
    border-right:1px solid #ccc;
  }
  .wallet_Wrapper .auditRight{
    width:305px;
    padding-top: 10px;
  }
  .wallet_Wrapper .auditRight .el-textarea{
    width:229px;
    float: left;
  }
 .wallet_Wrapper .auditCenter{
   width:calc(100% - 539px);
   padding-top: 20px;
 }
 .wallet_Wrapper .el-form-item{
   border-bottom: none;
   margin-bottom: 10px!important;
 }
 .wallet_Wrapper .el-form-item__label,.wallet_Wrapper .el-form-item__content{
   padding: 10px 10px 0 10px!important;
 }
 .wallet_Wrapper .notP .el-form-item__content{
   padding: 0!important;
 }
</style>

