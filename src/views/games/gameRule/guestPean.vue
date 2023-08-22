<template>
  <div class="gamesWraper" style="padding:20px;">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="代币类型">
        <el-select v-model="queryParams.coinName" placeholder="请选择">
          <el-option v-for="(item, index) in gameCoinList" :label="item" :value="item" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" icon="el-icon-search" @click="queryAllGameDeskList()">查询</el-button>
        <el-button v-hasPermi="['game:rule:add']" type="primary" @click="editOrSee(1)" style="margin-bottom:20px;">新增</el-button>
        <el-tooltip placement="top" style="margin-left:20px;">
          <div slot="content">
            不允许配置此场景: 每局所需Candy较多的场次（不需解锁) ,而每局<br>
            所需Candy较少的场次（需解锁）前端展示规则<br>
            (1) &lt;所需的Candy>越多的，越靠后<br>
            (2) 每局所需Candy相同的场次，&lt;不需解锁>的优先于&lt;需解锁>的;
            <br>均为&lt;不需解锁> 或&lt;需解锁> ，启用时间的先后，先启用排前
          </div>
          <i class="el-icon-warning-outline"></i>
        </el-tooltip>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" style="width: 100%">
      <el-table-column prop="id" label="序号" width="180">
      </el-table-column>
      <el-table-column prop="ruleName" label="场次" width="180">
      </el-table-column>
      <el-table-column prop="coinName" label="代币类型" width="180">
      </el-table-column>
      <el-table-column prop="entryWhalePeas" label="每局所需">
      </el-table-column>
      <el-table-column prop="ticketWhalePeas" label="门票">
      </el-table-column>
      <el-table-column prop="createAt" label="创建时间">
        <template slot-scope="{row}">
          {{row.createAt ? $dayjs(row.createAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
      </el-table-column>

      <el-table-column prop="useRobot" label="启用机器人">
        <template scope="scope">
          <p v-if="+scope.row.useRobot === 0">禁用</p>
          <p v-else-if="+scope.row.useRobot === 1">启用</p>
        </template>
      </el-table-column>
      <el-table-column prop="robotAwardMultiple" label="机器人中奖比例">
      </el-table-column>
      <el-table-column prop="robotCritical" label="机器人临界值">
      </el-table-column>

      <el-table-column align="center" prop="statusTypeBoolean" label="状态">
        <template scope="scope">
          <el-switch v-hasPermi="['game:rule:status:change']" v-model="scope.row.statusTypeBoolean" @change="watchChange(scope.row)"
                     class="customSwitchStyle" active-color="#00A854" active-text="已开启" inactive-color="#F04134" inactive-text="已禁用" />
        </template>
      </el-table-column>

      <el-table-column prop="date" label="操作">
        <template scope="scope">
          <el-button type="text" @click="editOrSee(0, scope.row)">查看</el-button>
          <el-button v-if="!scope.row.statusTypeBoolean" v-hasPermi="['game:rule:update']" type="text" @click="editOrSee(2, scope.row)">编辑</el-button>
          <el-button v-if="!scope.row.statusTypeBoolean" v-hasPermi="['game:rule:remove']" type="text" @click="removeGameRule(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <!--查看/新增/修改-->

    <el-dialog :title="editOrSeeTitle" :visible.sync="dialogFormVisibleck" width="39%">
      <el-form :model="formck" ref="queryForm" :rules="rulesTop" class="requiredStart">
        <el-form-item label="代币类型" :label-width="formLabelWidthck" prop="coinName" class="lab1">
          <el-select v-model="formck.coinName" :disabled="+editOrSeeStatus != 1" clearable placeholder="请选择">
            <el-option v-for="(item, index) in gameCoinList" :label="item" :value="item" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="场次名称:" :label-width="formLabelWidthck" prop="name" class="lab1">
          <el-input :disabled="+editOrSeeStatus === 0" v-model.trim="formck.name" autocomplete="off" maxlength="6"></el-input>
        </el-form-item>
        <el-form-item label="每局所需:" :label-width="formLabelWidthck" prop="pean" class="lab2">
          <template slot="label">
            <span style="position:relative">

              <el-tooltip style="position:absolute;right:63px;top:2px;" class="item" effect="dark" placement="top">
                <div slot="content">
                  <p>每局所需，已包含门票</p>
                </div>
                <i class="el-icon-question table-msg" />
              </el-tooltip>
              <span>每局所需:</span>
            </span>
          </template>

          <!-- <el-input v-model.trim="formck.pean" autocomplete="off" maxlength="20"></el-input> -->
          <el-input-number :disabled="+editOrSeeStatus === 0" @blur="((ev)=>{handleBlur(ev, 'pean')})" v-model="formck.pean" :min="0.000002"
                           :precision="6" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="门票:" :label-width="formLabelWidthck" prop="ticket" class="lab3">
          <!-- <el-input v-model.trim="formck.ticket" autocomplete="off" maxlength="20"></el-input> -->
          <el-input-number :disabled="+editOrSeeStatus === 0" @blur="((ev)=>{handleBlur(ev, 'ticket')})" v-model="formck.ticket" :min="0.000001"
                           :precision="6" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="每局参与人数:" :label-width="formLabelWidthck" prop="join" class="lab4">
          <!-- <el-input v-model.trim="formck.join" autocomplete="off" maxlength="20"></el-input> -->
          <el-input-number :disabled="+editOrSeeStatus === 0" @blur="((ev)=>{handleBlur(ev, 'join')})" :precision="0" v-model="formck.join" :step="1"
                           :min="1" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="需解锁:" :label-width="formLabelWidthck">
          <span v-show="+editOrSeeStatus === 0">{{formck.lock ? '启用' : '禁用'}}</span>
          <el-radio-group v-show="+editOrSeeStatus !== 0" v-model="formck.lock">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态:" :label-width="formLabelWidthck">
          <span v-show="+editOrSeeStatus === 0">{{formck.status ? '启用' : '禁用'}}</span>
          <el-radio-group disabled v-show="+editOrSeeStatus !== 0" v-model="formck.status">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">启用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="启用机器人:" :label-width="formLabelWidthck">
          <span v-show="+editOrSeeStatus === 0">{{formck.useRobot ? '启用' : '禁用'}}</span>
          <el-radio-group v-show="+editOrSeeStatus !== 0" v-model="formck.useRobot">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">启用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="机器人中奖比例:" :label-width="formLabelWidthck" prop="robotAwardMultiple" class="lab5">
          <template slot="label">
            <span style="position:relative">

              <el-tooltip style="position:absolute;right:102px;top:2px;" class="item" effect="dark" placement="top">
                <div slot="content">
                  <p>机器人中奖比例是在(用户与机器人初始奖概率)中增加机器人的中奖比例的倍数</p>
                </div>
                <i class="el-icon-question table-msg" />
              </el-tooltip>
              <span>机器人中奖比例:</span>
            </span>
          </template>

          <!-- <el-input v-model.trim="formck.join" autocomplete="off" maxlength="20"></el-input> -->
          <el-input-number :disabled="+editOrSeeStatus === 0" @blur="((ev)=>{handleBlur(ev, 'robotAwardMultiple')})" :precision="0"
                           v-model="formck.robotAwardMultiple" :step="1" :min="1" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="机器人临界值:" :label-width="formLabelWidthck" prop="robotCritical" class="robotLimitSt">
          <template slot="label">
            <span style="position:relative">

              <el-tooltip style="position:absolute;right:89px;top:2px;" class="item" effect="dark" placement="top">
                <div slot="content">
                  <p>机器人数量临界值是指每局补充的机器人数量大于等于配置的临界值,机器人猜中的概率为100%</p>
                </div>
                <i class="el-icon-question table-msg" />
              </el-tooltip>
              <span>机器人临界值:</span>
            </span>
          </template>

          <el-input :disabled="+editOrSeeStatus === 0" v-model.trim="formck.robotCritical"></el-input>
          <!-- <el-input-number :disabled="+editOrSeeStatus === 0" @blur="((ev)=>{handleBlur(ev, 'robotCritical')})" :precision="0" v-model="formck.robotCritical" :step="1" controls-position="right"></el-input-number> -->
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="+editOrSeeStatus !== 0" @click="dialogFormVisibleck = false">取 消</el-button>
        <el-button v-if="+editOrSeeStatus !== 0" type="primary" @click="finallySumbit">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  gameDesk,
  gameRuleAdd,
  gameRuleUpdate,
  gameRuleStatusChange,
  gameRuleDel,
} from "@/api/games";
import { getGameCoinList } from "@/api/games";
export default {
  props: ["sendTochildBridgeData"],
  components: {},
  data() {
    var validatecoinName = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请选择代币类型"));
      }
      callback();
    };
    var validateName = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入场次名称"));
      }
      callback();
    };
    var validatePean = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入每局所需Candy"));
      }
      callback();
    };
    var validateTicket = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入门票"));
      } else {
        if (this.formck.pean !== "" && +value >= +this.formck.pean) {
          return callback(new Error("门票不能大于等于每局所需Candy"));
        }
      }
      callback();
    };
    var validateJoin = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入每局参与人数"));
      }
      callback();
    };
    var validateRobotCritical = (rule, value, callback) => {
      // if (!/\S/.test(value)) {
      //   return callback(new Error('请输入机器人中奖倍数'))
      // }
      if (!/^[0-9]*[0-9][0-9]*$/.test(value) && value) {
        return callback(new Error("请输入正整数"));
      }
      callback();
    };
    var validateRobotAwardMultiple = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入机器人中奖倍数"));
      }
      callback();
    };
    return {
      rulesTop: {
        coinName: [{ validator: validatecoinName, trigger: "blur" }],
        name: [{ validator: validateName, trigger: "blur" }],
        pean: [{ validator: validatePean, trigger: "blur" }],
        ticket: [{ validator: validateTicket, trigger: "blur" }],
        join: [{ validator: validateJoin, trigger: "blur" }],
        robotCritical: [{ validator: validateRobotCritical, trigger: "blur" }],
        robotAwardMultiple: [
          { validator: validateRobotAwardMultiple, trigger: "blur" },
        ],
      },
      formck: {
        name: "",
        pean: "",
        ticket: "",
        join: "",
        lock: 0,
        status: 0,
        useRobot: 0,
        robotCritical: "",
        robotAwardMultiple: 0,
        coinName: "CANDY",
      },
      formLabelWidthck: "140px",
      dialogFormVisibleck: false,
      editOrSeeStatus: "",
      editOrSeeTitle: "",
      tableData: [],
      loading: false,
      queryParams: {
        coinName: "CANDY", //代币类型
      },
      gameCoinList: [], //游戏代币类型列表
    };
  },
  created() {
    this.getGameCoinList();
  },
  mounted() {
    this.isAuth.isPermi(["game:rule:page"]) && this.queryAllGameDeskList();
  },
  watch: {
    sendTochildBridgeData: {
      handler: function (newVal, oldVal) {
        console.log(newVal, oldVal);
      },
      deep: true,
    },
  },
  methods: {
    // 获取游戏代币类型列表
    getGameCoinList() {
      let params = {
        gameType: this.sendTochildBridgeData.totalInformation.gameType,
      };
      getGameCoinList(params)
        .then((res) => {
          if (res.code === 200) {
            this.gameCoinList = res.data || [];
          } else {
            this.gameCoinList = [];
            this.$message.error(response.message);
          }
        })
        .catch((e) => {});
    },
    handleBlur(ev, key) {
      // blur后若输入内容为空，处理为显示对应特权类型的最小默认值
      if (ev.target.ariaValueNow === "undefined") {
        if (key === "pean") {
          this.formck.pean = ev.target.ariaValueMin;
        } else if (key === "ticket") {
          this.formck.ticket = ev.target.ariaValueMin;
        } else if (key === "join") {
          this.formck.join = ev.target.ariaValueMin;
        } else if (key === "robotCritical") {
          // this.formck.robotCritical = ev.target.ariaValueMin
        } else if (key === "robotAwardMultiple") {
          this.formck.robotAwardMultiple = ev.target.ariaValueMin;
        }
        if (key !== "robotCritical") {
          ev.target.value = ev.target.ariaValueMin;
        }
      }
    },
    removeGameRule(row) {
      this.$confirm(`确认要执行此操作吗？`, "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          gameRuleDel({
            id: row.id,
          }).then((response) => {
            if (+response.code === 200) {
              this.$message({ type: "success", message: "操作成功" });
              this.isAuth.isPermi(["game:rule:page"]) &&
                this.queryAllGameDeskList(this.dataTransfer);
            } else {
              this.$message.error(response.message);
            }
          });
        })
        .catch((e) => {});
    },
    // 提交整理数据
    finallySumbit() {
      this.$refs["queryForm"].validate((valid) => {
        if (valid) {
          let _paramsAdd = {
            entryWhalePeas: this.formck.pean,
            headcount: this.formck.join,
            lock: this.formck.lock,
            ruleName: this.formck.name,
            statusType: this.formck.status,
            ticketWhalePeas: this.formck.ticket,
            useRobot: this.formck.useRobot,
            robotCritical: this.formck.robotCritical || "",
            robotAwardMultiple: this.formck.robotAwardMultiple,
            coinName: this.formck.coinName,
            gameType: this.sendTochildBridgeData.totalInformation.gameType,
          };
          let _paramsEdit = {
            entryWhalePeas: this.formck.pean,
            headcount: this.formck.join,
            id: this.clickRowData.id,
            lock: this.formck.lock,
            ruleName: this.formck.name,
            statusType: this.formck.status,
            ticketWhalePeas: this.formck.ticket,
            useRobot: this.formck.useRobot,
            robotCritical: this.formck.robotCritical || "",
            robotAwardMultiple: this.formck.robotAwardMultiple,
            coinName: this.formck.coinName,
          };
          let _sumbitParams, _api;
          if (+this.editOrSeeStatus === 1) {
            _sumbitParams = _paramsAdd;
            _api = gameRuleAdd;
          } else if (+this.editOrSeeStatus === 2) {
            _sumbitParams = _paramsEdit;
            _api = gameRuleUpdate;
          }
          _api(_sumbitParams).then((response) => {
            if (+response.code === 200) {
              this.$message({ type: "success", message: "操作成功" });
              this.dialogFormVisibleck = false;
              this.isAuth.isPermi(["game:rule:page"]) &&
                this.queryAllGameDeskList();
            } else {
              this.$message.error(response.message);
              this.dialogFormVisibleck = false;
            }
          });
        }
      });
    },
    // 查询所有游戏场次列表
    queryAllGameDeskList() {
      let _params = {
        currentPage: 1, // 下拉列表
        gameType: this.sendTochildBridgeData.totalInformation.gameType,
        pageSize: 10000,
        statusType: -1,
        coinName: this.queryParams.coinName
      };
      this.loading = true;
      gameDesk(_params)
        .then((response) => {
          if (response.code === 200) {
            this.tableData = response.data.list;
            for (let [k, s] of Object.entries(this.tableData || [])) {
              this.$set(
                this.tableData[k],
                "statusTypeBoolean",
                s.statusType === 1 ? true : false
              );
            }
            this.loading = false;
          } else {
            this.tableData = [];
            this.loading = false;
            this.$message.error(response.message);
          }
        })
        .catch((e) => {
          this.loading = false;
        });
    },
    editOrSee(type, row) {
      this.dialogFormVisibleck = true;
      this.$nextTick(() => {
        this.$refs["queryForm"].resetFields();
        switch (type) {
          case 0:
            this.editOrSeeTitle = "查看";
            this.formck = {
              name: row.ruleName,
              pean: row.entryWhalePeas,
              ticket: row.ticketWhalePeas,
              join: row.headcount,
              lock: row.lock,
              status: row.statusType,
              useRobot: row.useRobot,
              robotCritical: row.robotCritical,
              robotAwardMultiple: row.robotAwardMultiple,
              coinName: row.coinName,
            };
            break;
          case 1:
            this.editOrSeeTitle = "新增";
            this.formck = {
              name: "",
              pean: "",
              ticket: "",
              join: "",
              lock: 0,
              status: 0,
              useRobot: 0,
              robotCritical: "",
              robotAwardMultiple: 0,
              coinName: "",
            };
            break;
          case 2:
            this.editOrSeeTitle = "修改";
            this.formck = {
              name: row.ruleName,
              pean: row.entryWhalePeas,
              ticket: row.ticketWhalePeas,
              join: row.headcount,
              lock: row.lock,
              status: row.statusType,
              useRobot: row.useRobot,
              robotCritical: row.robotCritical,
              robotAwardMultiple: row.robotAwardMultiple,
              coinName: row.coinName,
            };
            break;
        }
        this.editOrSeeStatus = type;
        this.clickRowData = Object.assign({}, row);
      });
    },
    watchChange(val) {
      this.$confirm(`确认要执行此操作吗？`, "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let _params = {};
          _params.id = val.id;
          _params.statusType = val.statusTypeBoolean ? 1 : 0;
          gameRuleStatusChange(_params)
            .then((response) => {
              if (response.code === 200) {
                this.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1000,
                  onClose: () => {
                    this.isAuth.isPermi(["game:rule:page"]) &&
                      this.queryAllGameDeskList();
                  },
                });
              } else {
                val.statusTypeBoolean = !val.statusTypeBoolean;
                this.$message.error(response.message);
              }
            })
            .catch(({ error }) => {
              val.statusTypeBoolean = !val.statusTypeBoolean;
              if (error) this.$message.error(error.message);
            });
        })
        .catch(() => {
          val.statusTypeBoolean = !val.statusTypeBoolean;
        });
    },
  },
};
</script>

<style>
.gamesWraper .requiredStart .el-form-item__label {
  position: relative;
}
.gamesWraper .requiredStart .el-form-item__label::before {
  content: "*";
  color: #fff;
  position: absolute;
  left: 0;
  top: 0;
}
.gamesWraper .requiredStart .lab5 .el-form-item__label::before {
  right: 140px;
  color: red;
}
.gamesWraper .requiredStart .lab4 .el-form-item__label::before {
  right: 106px;
  color: red;
}
.gamesWraper .requiredStart .lab3 .el-form-item__label::before {
  right: 51px;
  color: red;
}
.gamesWraper .requiredStart .lab2 .el-form-item__label::before {
  right: 100px;
  color: red;
}
.gamesWraper .requiredStart .lab1 .el-form-item__label::before {
  right: 78px;
  color: red;
}
.robotLimitSt .el-form-item__content {
  width: 200px;
}
</style>

