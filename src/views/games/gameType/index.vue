<template>
  <div class="gamesWraper" style="padding:20px;">
    <el-button type="primary" v-hasPermi="['game:info:add']" @click="editOrSee(1)" style="margin-bottom:20px;">创建游戏</el-button>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <!-- <el-table-column
        width="80"
        prop="sort"
        label="序号">
      </el-table-column> -->
      <el-table-column
        prop="gameName"
        label="游戏名称">
        <template scope="scope">
         <span v-if="scope.row.gameType == 1">猜数字 - {{scope.row.coinName || "CANDY"}}</span>
         <span v-else> {{scope.row.gameName}} </span>
        </template>
      </el-table-column>
       <el-table-column
      prop="icon"
      label="商品图片"
      width="120"
      align="center">
         <template scope="scope">
          <img style="height:88px;width:88px;" :src="scope.row.icon" />
        </template>
    </el-table-column>
      <el-table-column
        width="80"
        prop="statusType"
        label="状态">
        <template scope="scope">
          <span v-if="+scope.row.statusType === 0" style="color:red;">禁用</span>
          <span v-else-if="+scope.row.statusType === 1" style="color:green;">启用</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="modifyAt"
        label="更新时间">
        <template slot-scope="{row}">
          {{row.modifyAt ? $dayjs(row.modifyAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
      </el-table-column>
      <el-table-column
        width="560"
        label="操作">
      <template scope="scope">
        <div v-if="+scope.row.statusType === 1">
          <el-button type="primary" @click="editOrSee(0, scope.row)" size="mini">查看</el-button>
          <el-button v-hasPermi="['game:info:status:change']" @click="closeGame(scope.row)" type="primary" size="mini">禁用</el-button>
          <el-button v-if="+scope.row.gameType !== 2" v-hasPermi="['game:info:update']" type="primary" @click="clickRowSettedParams(scope.row, 'seeParams')" size="mini">参数查看</el-button>
          <!-- <el-button v-if="+scope.row.gameType === 1" type="primary" @click="goToTokenTypeConfig(scope.row)" size="mini">代币类型配置</el-button> -->
          <el-button v-if="+scope.row.gameType === 4" type="primary" @click="calcClick" size="mini">计算</el-button>
        </div>
        <div v-else>
          <el-button type="primary" @click="editOrSee(0, scope.row)" size="mini">查看</el-button>
          <el-button v-hasPermi="['game:info:status:change']" @click="openGame(scope.row)" type="primary" size="mini">启用</el-button>
          <el-button v-hasPermi="['game:info:update']" type="primary" @click="editOrSee(2, scope.row)" size="mini">编辑</el-button>
          <el-button v-if="+scope.row.gameType !== 2" v-hasPermi="['game:info:update']" type="primary" @click="clickRowSettedParams(scope.row)" size="mini">参数配置</el-button>
          <el-button v-if="+scope.row.gameType !== 2" type="primary" @click="clickRowSettedParams(scope.row, 'seeParams')" size="mini">参数查看</el-button>
          <!-- <el-button v-if="+scope.row.gameType === 1" type="primary" @click="goToTokenTypeConfig(scope.row)" size="mini">代币类型配置</el-button> -->
          <!-- <el-button v-hasPermi="['game:info:remove']" @click="removeGame(scope.row)" type="primary" size="mini">删除</el-button> -->
          <el-button v-if="+scope.row.gameType === 4" type="primary" @click="calcClick" size="mini">计算</el-button>
        </div>
        
      </template>
      </el-table-column>
    </el-table>

    <!--查看/编辑/新增-->
    <el-dialog :title="editOrSeeTitle" :visible.sync="dialogFormVisibleck" width="39%">
      <el-form :model="formck" ref="queryForm" :rules="rulesTop">
        <el-form-item class="requiredStyle" label="游戏类型:" :label-width="formLabelWidthck" prop="gameTypeArrSelected">
           <el-select :disabled="+editOrSeeStatus === 0" v-model="formck.gameTypeArrSelected" placeholder="请选择">
            <el-option
              v-for="item in gameTypeArr"
              :key="item.gameType"
              :label="item.gameName"
              :value="item.gameType">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="requiredStyle" v-if="formck.gameTypeArrSelected != 1" label="游戏名称:" :label-width="formLabelWidthck" prop="gameName">
          <span v-if="+editOrSeeStatus === 0">{{formck.gameName}}</span>
          <el-input v-else v-model.trim="formck.gameName" autocomplete="off" maxlength="20"></el-input>
        </el-form-item>
        <!-- 仅猜数字游戏显示 -->
        <el-form-item v-if="formck.gameTypeArrSelected == 1" class="requiredStyle" label="代币类型:" :label-width="formLabelWidthck" prop="gameCionName">
           <el-select :disabled="+editOrSeeStatus === 0" v-model="formck.coinName" placeholder="请选择">
            <el-option
              v-for="item in gameCoinList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="requiredStyle" label="上传图标:" :label-width="formLabelWidthck">
          <el-upload
            :disabled="+editOrSeeStatus === 0"
            :limit="1"
            action=""
            :http-request="handleAvatarSuccessRUN.bind(file, 'addCode')"
            list-type="picture-card"
            :on-remove="handleRemove"
            :file-list="fileList"
            >
            <i class="el-icon-plus"></i>
          </el-upload>
          <p>大小不超过500KB</p>
        </el-form-item>
        <!-- <el-form-item class="requiredStyle" label="游戏排序:" :label-width="formLabelWidthck">
          <span v-if="+editOrSeeStatus === 0">{{formck.sort}}</span>
          <el-input-number v-else @blur="handleBlur" :precision="0" v-model="formck.sort" :step="1" :min="1" controls-position="right"></el-input-number>
        </el-form-item> -->

        <!-- <el-form-item label="状态:" :label-width="formLabelWidthck">
          <span v-show="+editOrSeeStatus === 0">{{formck.statusType ? '启用' : '禁用'}}</span>
          <el-radio-group disabled v-show="+editOrSeeStatus !== 0" v-model="formck.statusType">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">启用</el-radio>
          </el-radio-group>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-show="+editOrSeeStatus !== 0" @click="dialogFormVisibleck = false">取 消</el-button>
        <el-button type="primary" @click="gameSureClick">确 定</el-button>
      </div>
    </el-dialog>
  <!--参数配置-->
  <el-dialog title="参数配置" :visible.sync="dialogFormVisiblepz" width="66%">
    <div class="clearfix">
      <el-button class="fl" type="primary" @click="showAllParamsDialog" style="margin-bottom:20px;display:none;">增加参数</el-button>
      <el-button v-show="!seeParamsType" class="fr" type="primary" @click="changepz" style="margin-bottom:20px;">保存</el-button>
    </div>

    
      <el-table
      ref="multipleTable"
      :data="tableDatapz"
      @selection-change="handleSelectionChange"
      style="width: 100%">
      <el-table-column
        type="selection"
        :selectable="checkboxSelect"
        width="55">
      </el-table-column>
      <el-table-column
        prop="sort"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="filedDesc"
        label="参数名称">
        <template scope="scope">
          {{scope.row.filedDesc}}
          <el-tooltip placement="top">
            <div slot="content">{{scope.row.tooltip}}</div>
            <i class="el-icon-warning-outline"></i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="set"
        width="300"
        label="配置">
        <template scope="scope">
          <div v-if="scope.row.inputType === 'radio'">
            <el-radio-group :disabled="seeParamsType" v-model="scope.row.value">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </div>
          <div v-else-if="scope.row.inputType === 'text'">
            <el-input :disabled="seeParamsType" v-model="scope.row.value" placeholder=""></el-input>
          </div>
          <div v-else-if="scope.row.inputType === 'number'">
            <el-input-number :disabled="seeParamsType" :precision="scope.row.precision" :max="scope.row.max" :min="scope.row.min" v-model="scope.row.value" controls-position="right" @change="Calc" @blur="((ev)=>{handleBlur(ev, 'serviceBalance')})"></el-input-number>
            <span class="unit" style="padding-left:9px;">{{scope.row.unit}}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    </el-dialog>


  <!--针对盲盒类型游戏推出的计算弹窗-->
  <el-dialog
  title="计算公式"
  :visible.sync="dialogVisible_forBlindBox"
  width="45%">

  

  <p><span class="laberSt">(A)每份单价：</span><el-input-number :precision="2" v-model="input_A" :min="0.01" label="" controls-position="right"></el-input-number><span class="mmUnit">USDT</span></p>
  <p><span class="laberSt">(B)购买总份数：</span><el-input-number step-strictly :step="1" v-model="input_B" :min="1" label="" controls-position="right"></el-input-number><span class="mmUnit">份</span></p>
  
  <p><span class="laberSt">(E)最终收益：</span><el-input-number step-strictly :step="1" v-model="input_E" label="" controls-position="right"></el-input-number><span class="mmUnit">USDT</span></p>

  <el-select @change="handleChangeCalc" v-model="show_input_CorD" placeholder="请选择" style="margin-right:10px;">
    <el-option label="(C)每份参与者补贴拨比" value="C"></el-option>
    <el-option label="(D)平台补贴总拨比" value="D"></el-option>
  </el-select>
  <el-input-number v-if="show_input_CorD === 'C'" step-strictly :step="1" v-model="input_C" :min="1" label="" controls-position="right"></el-input-number>
  <el-input-number v-if="show_input_CorD === 'D'" step-strictly :step="1" v-model="input_D" :min="1" label="" controls-position="right"></el-input-number>
  <span class="mmUnit">‱</span>
  
  <div style="padding:20px 0;">
    <span style="padding-right:100px;color:red;">计算公式：E = A * B * C * D</span>
    <el-button @click="calcRunClick" v-if="show_input_CorD === 'C'" :disabled="(input_C === '' || input_C === null || input_C === undefined) || (input_A === '' || input_A === null || input_A === undefined) || (input_B === '' || input_B === null || input_B === undefined) || (input_E === '' || input_E === null || input_E === undefined)" type="primary">计算</el-button>
    <el-button @click="calcRunClick" v-if="show_input_CorD === 'D'" :disabled="(input_D === '' || input_D === null || input_D === undefined) || (input_A === '' || input_A === null || input_A === undefined) || (input_B === '' || input_B === null || input_B === undefined) || (input_E === '' || input_E === null || input_E === undefined)" type="primary">计算</el-button>
  </div>

  <div>
    <p v-if="show_input_CorD === 'C'">
      (D)平台补贴总拨比: 
      <span v-if="isChangeSelect" style="font-weight:bold;font-size:16px;">{{input_D}}</span>
      <span v-else v-loading="calcRunClickLoading"></span>
    </p>
    <p v-if="show_input_CorD === 'D'">
      (C)每份参与者补贴拨比: 
      <span v-if="isChangeSelect" style="font-weight:bold;font-size:16px;">{{input_C}}</span>
      <span v-else v-loading="calcRunClickLoading"></span>
    </p>
  </div>

  <!-- <p>A.{{input_A}}</p>
  <p>B.{{input_B}}</p>
  <p>C.{{input_C}}</p>
  <p>D.{{input_D}}</p>
  <p>E.{{input_E}}</p> -->

</el-dialog>



  </div>
</template>

<script>
import { creatGame, alterGame, allGamesList, gamePropsList, gameStatusChange, gameRemove, allGamesTypeslist } from "@/api/games";
import { getCertificate, upload } from "@/api/system/userlist";
import {compareVersion, replaceUnitlPrefixStr} from '@/utils/index';
import { getGameCoinList } from "@/api/games";
  export default {
    components: {},
    data () {
      var validatePhone = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('请输入游戏名称'))
        }
        callback()
      }
      var validateType = (rule, value, callback) => {
        if (value === '' || value === undefined) {
          return callback(new Error('请选择游戏类型'))
        }
        callback()
      }
      var validateCoinName = (rule, value, callback) => {
        if (value === '' || value === undefined) {
          return callback(new Error('请选择代币类型'))
        }
        callback()
      }
      return {
        file: {},
        fileList: [
          // {
          //   name: '11',
          //   url: 'http://test-taoxi-oss.oss-cn-shenzhen.aliyuncs.com/admin/e752718884f791088fa184467fa806b4/673d12465c516526b8dcd3af69620e5b.jpeg'
          // }
        ],
        gameTypeArr: [],
        seeParamsType: false,
        multipleSelection: [],
        canNotCancelChoosedArr: [], // 默认从参数列表查询所有[required: true]的参数，默认放在穿梭框右侧，并且不可取消，移动到左侧
        gameSettingStrOBJ: '',
        replaceLoading: false,
        deDuplicated: [],
        curClickRowData: {},
        rulesTop: {
          gameName: [
            { validator: validatePhone, trigger: 'blur' }
          ],
          gameTypeArrSelected: [
            { validator: validateType, trigger: 'blur' }
          ],
          gameCoinName: [
            { validator: validateCoinName, trigger: 'blur' }
          ]
        },
        dataTransfer: [],
        valueTransfer: [],
        dialogFormVisibleck: false,
        dialogFormVisiblepz: false,
        innerVisible: false,
        formLabelWidthck: '120px',
        editOrSeeStatus: '',
        editOrSeeTitle: '',
        formck: {
          gameTypeArrSelected: '',
          coinName: 'CANDY',
          gameName: '',
          statusType: 0,
          sort: 1
        },
        gameCoinList: [], //游戏代币类型列表
        tableData: [],
        dialogVisible_forBlindBox: false,
        input_A: 0.01,
        input_B: 1,
        input_C: 1,
        input_D: 1,
        input_E: '',
        isChangeSelect: false,
        calcRunClickLoading: false,
        show_input_CorD: 'C',
        tableDatapz: [
          {
            filedDesc: '解锁局数',
            filedName: '',
            sort: '',
            value: 1,
            id: '',
            inputType: '',
            required: '',
            tooltip: 'i am tooltip',
            show: false,
            max: 1000,
            min: 1,
            precision: 0,
            unit: '局'
          }
        ],
      }
    },
    async created () {
      try {
        this.dataTransfer = await this.queryAllParamsList(1)
        this.isAuth.isPermi(['game:info:page']) && this.queryAllGamesList(this.dataTransfer)
      } catch(e){}
      this.getGameCoinList();
      this.queryAllGamelist()
    },
    mounted () {
      this.getCertificateRun()
    },
    watch: {},
    methods: {
      // 获取游戏代币类型列表
      getGameCoinList() {
        let params = {
          gameType: 1,
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
      // 向您搭建的STS服务获取临时访问凭证。
      getCertificateRun () {
        return new Promise((resolve, reject) => {
          getCertificate().then(response => {
            this.certificateInfos = response.data
            resolve(this.certificateInfos)
          })
        })
      },
      async handleAvatarSuccessRUN (type, file) { // the order of the parameters here must be reversed.
        let _valid = this.beforeAvatarUpload(file.file)
        if (_valid) await this.put(file.file, type)
      },
      beforeAvatarUpload(file) {
        // const isNOtJPGPNG = file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png'
        const isGt500KB = file.size / 1024 < 500;
        // if (isNOtJPGPNG) {
        //   this.$message.error('请上传是 jpg、png、jpeg 格式的图片!')
        // }
        if (!isGt500KB) {
          this.$message.error('上传图片大小不能超过 500KB!')
        }
        return isGt500KB
      },
      async put (file, type) {
        try {
          let _res = await upload(this.certificateInfos, file)
          let ossFileUrl = _res.res.requestUrls[0]
          //如果CDN域名不为空，则替换成CDN域名
          if(this.certificateInfos.bucketCdnUrl){
            ossFileUrl = replaceUnitlPrefixStr(ossFileUrl, this.certificateInfos.endpoint, this.certificateInfos.bucketCdnUrl);
          }
          switch(type) {
            case 'addCode':
              this.fileList.push({
                name: '',
                url: ossFileUrl
              })
              this.checkUploadBTN()
              // this.$refs['ruleForm'].clearValidate('imgs')
              break;
          }
        } catch (e) {
          console.log(e)
        }
      },
      handleRemove(file, fileList) {
        let _index = this.fileList.findIndex(v => file.uid === v.uid)
        this.fileList.splice(_index, 1)
        this.checkUploadBTN()
      },
      // 所有游戏列表
      queryAllGamelist () {
        allGamesTypeslist().then((response) => {
            if (+response.code === 200) {
              let gameTypesArr = Object.keys(response.data || {})
              this.gameTypeArr = gameTypesArr.map(v => {
                let _item = {}
                _item.gameType = v
                _item.gameName = response.data[v]
                return _item
              })
            } else {
              this.$message.error(response.message)
            }
          })
      },
      removeGame (row) {
        this.$confirm(`确认要执行此操作吗？`, '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          gameRemove({
            id: row.id
          }).then((response) => {
            if (+response.code === 200) {
              this.$message({type: 'success', message: '操作成功'})
              this.isAuth.isPermi(['game:info:page']) && this.queryAllGamesList(this.dataTransfer)
            } else {
              this.$message.error(response.message)
            }
          })
        }).catch((e) => {})
      },
      openGame (row) {
        this.$confirm(`启用后，游戏将上线`, '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          gameStatusChange({
            id: row.id,
            statusType: 1
          }).then((response) => {
            if (+response.code === 200) {
              this.$message({type: 'success', message: '操作成功'})
              this.isAuth.isPermi(['game:info:page']) && this.queryAllGamesList(this.dataTransfer)
            } else {
              this.$message.error(response.message)
            }
          })
        }).catch((e) => {})
      },
      closeGame (row) {
        this.$confirm(`禁用后，游戏将下架`, '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          gameStatusChange({
            id: row.id,
            statusType: 0
          }).then((response) => {
            if (+response.code === 200) {
              this.$message({type: 'success', message: '操作成功'})
              this.isAuth.isPermi(['game:info:page']) && this.queryAllGamesList(this.dataTransfer)
            } else {
              this.$message.error(response.message)
            }
          })
        }).catch((e) => {})
      },
      checkboxSelect (row, rowIndex) {
        return !row.required && !this.seeParamsType
      },
      Calc (value) {
        this.$forceUpdate()
      },
      // 从列表中点击“参数配置”，查询该条数据的已有参数配置情况列表
      async clickRowSettedParams (row, type) {
        console.log(row)
        this.seeParamsType = type === 'seeParams' // 如果是点击‘参数查看’按钮
        // this.formck = Object.assign({}, row)
        this.formck.gameTypeArrSelected = row.gameType
        this.formck.coinName = row.coinName || "CANDY"
        this.formck.gameName = row.gameName
        this.formck.statusType = row.statusType
        this.formck.sort = row.sort
        this.curClickRowData = row
        this.editOrSeeStatus = 3
        this.tableDatapz = []
        this.valueTransfer = []
        this.dialogFormVisiblepz = true
        /**
         * gameSetting: null||'{"waitingSecond":2,"guessingSecond":23}'
         * 根据：'{"waitingSecond":2,"guessingSecond":23}' --> 更新穿梭框选中的值集合[valueTransfer]，
         * 把该值[currentRowSetting]作为一个新的字段存入对应的row对象中去，
         * 当点击对应“参数配置”按钮时，更新valueTransfer = currentRowSetting
         */
        let {gameSetting, ...a} = row
        this.gameSettingStrOBJ = JSON.parse(gameSetting) // 从row中点击获取到的原始gameSetting转成的对象
        try {
          this.dataTransfer = await this.queryAllParamsList(row.gameType) // 动态获取不同类型的游戏的参数列表
        } catch(e){}
        this.dataTransfer.forEach((item, index) => {
          // 初始化
          this.tableDatapz.push(
            {
              filedDesc: item.label,
              filedName: item.filedName,
              sort: index + 1,
              value: 1, // 初始化默认值为空
              id: item.key,
              inputType: item.inputType,
              required: item.disabled,
              tooltip: item.tip,
              show: false,
              max: 99999, // 以下理论上接口也需要返回，但并未返回，这里先预留。
              min: 1,
              precision: 0,
              unit: item.unit
            })
        })

        if (this.gameSettingStrOBJ) {
          for (let [k, s] of Object.entries(this.gameSettingStrOBJ)) {
            this.dataTransfer.forEach(val => {
              if (val.filedName === k) {
                // 更新对应穿梭框已经选中了的集合[key]
                this.valueTransfer.push(val.key)
                // 更新table列表每一条数据的显示隐藏show状态
                this.tableDatapz.forEach(items => {
                  if (items.filedName === k) {
                    items.value = s
                    items.show = true
                  }
                })
              }
            })
          }
        }
        this.handleMustChoosedParamRun(row)
      },
      // 处理默认必须勾选且不可取消的参数以及之前已经勾选了的参数，二者可能会出现交集情况，但不影响最终结果的正确性
      handleMustChoosedParamRun (row) {
        this.$nextTick(() => {
          this.tableDatapz.forEach(val => {
            if (val.required) { // 必须勾选不可取消的参数
              this.$refs.multipleTable.toggleRowSelection(val, true)
            }
            if (row.gameSetting) {
              for (let [k, s] of Object.entries(JSON.parse(row.gameSetting))) {
                if (val.filedName === k) { // 点击之前就勾选
                  this.$refs.multipleTable.toggleRowSelection(val, true)
                }
              }
            }
          })
        })
      },
      showAllParamsDialog () {
        this.innerVisible = true
      },
      // 穿梭框：左侧查询所有参数列表结合(默认执行，外层table的row:[gameSetting]和内层dialog都需要利用这个列表数据)A1
      queryAllParamsList (gameType = 1) {
        return new Promise(resolve => {
          // 1猜数字 2Candy夺宝 3转转乐
          gamePropsList({gameType}).then(response => {
            if (+response.code === 200) {
              resolve((response.data.list || []).map((val, index, arr) => {
                let _items = {}
                let {
                  id : key, // component must
                  filedDesc : label, // component must
                  required : disabled, // component must
                  filedName,
                  inputType, // radio[接口返回和传参都是0|1], text, number
                  tip,
                  unit
                } = val
                _items.label = label
                _items.filedName = filedName
                _items.key = key
                _items.inputType = inputType
                _items.disabled = disabled
                _items.tip = tip
                _items.unit = unit
                // 如果该项是必选且只读不可更改
                if (disabled) {
                  this.valueTransfer.push(key) // 当前穿梭框选中的集合(key集合)A2
                  this.canNotCancelChoosedArr.push(key)
                }
                return _items
              }))
            }
          })
        })
      },
      toggleSelection (rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          });
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      queryAllGamesList (settingInfo) {
        let _params = {
          currentPage: 1, // 所有游戏列表
          pageSize: 1000,
          statusType: -1
        }
        this.loading = true
        allGamesList(_params).then(response => {
          if (response.code === 200) {
            this.tableData = response.data.list || []
            this.loading = false
          } else {
            this.loading = false
            this.$message.error(response.message)
          }
        }).catch(e => {
          this.loading = false
        })
      },
      coreHandleSumbit (setting) {
        // 新增[1]｜修改[2]｜参数配置[3] 三者公共处理提交函数
        let _params = {
          gameName: this.formck.gameName || "猜数字",
          // sort: this.formck.sort,
          statusType: this.formck.statusType,
          icon: '',
          coinName: this.formck.coinName
        }
        if (+this.editOrSeeStatus === 1) {
          _params.gameType = this.formck.gameTypeArrSelected
          _params.icon = this.fileList[0].url
        }
        if (+this.editOrSeeStatus === 2) {
          // ’编辑‘按钮
          Reflect.deleteProperty(_params, 'statusType')
          _params.id = this.curClickRowData.id
          _params.gameSetting = this.curClickRowData.gameSetting
          _params.icon = this.fileList[0].url
        }
        if (+this.editOrSeeStatus === 3) {
          // 点击’参数配置‘修改按钮
          Reflect.deleteProperty(_params, 'statusType')
          _params.id = this.curClickRowData.id
          _params.gameSetting = setting || ''
          _params.icon = this.curClickRowData.icon
        }
        
        let _api = +this.editOrSeeStatus === 1 ? creatGame : alterGame
        _api(_params).then(response => {
          if (+response.code === 200) {
            this.$message({type: 'success', message: '操作成功'})
          } else {
            this.$message.error(response.message)
          }
          this.dialogFormVisibleck = this.dialogFormVisiblepz = false
          this.isAuth.isPermi(['game:info:page']) && this.queryAllGamesList(this.dataTransfer)
        }).catch((e) => {
          // this.dialogFormVisibleck = this.dialogFormVisiblepz = false
        })
      },
      gameSureClick (setting) {
        if (+this.editOrSeeStatus === 0) {
          this.dialogFormVisibleck = false
        } else {
          this.$refs['queryForm'].validate((valid) => {
            if (valid) {
              if (this.fileList.length <= 0) {
                this.$message.error('请上传图标')
                return false
              }
              this.coreHandleSumbit(setting)
            }
          })
        }
      },
      changepz () {
        this.$confirm(`确认要执行此操作吗？`, '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _currentSettingSumbit = {}
          for (let [k, s] of Object.entries(this.multipleSelection || [])) {
            _currentSettingSumbit[s.filedName] = s.value
          }
          // 拿到当前最终用户选择后的参数列表table，和gameSettingStrOBJ合并对象
          this.coreHandleSumbit(JSON.stringify(_currentSettingSumbit))
        }).catch((e) => {})
      },
      editOrSee (type, row) {
        this.dialogFormVisibleck = true
        this.$nextTick(() => {
          this.$refs['queryForm'].resetFields()
           switch(type)
          {
            case 0:
              this.editOrSeeTitle = '查看'
            break;
            case 1:
              this.editOrSeeTitle = '新增'
            break;
            case 2:
              this.editOrSeeTitle = '编辑'
            break;
          }
          this.editOrSeeStatus = type
          //gameTypeArrSelected
          if (+type === 1) { // 新增重置
            this.formck.gameTypeArrSelected = ''
            this.formck.coinName = 'CANDY';
            this.formck.gameName = ''
            this.formck.statusType = 0
            // this.formck.sort = 1
            this.fileList = []
          } else {
            // this.formck = Object.assign({}, row)
            this.curClickRowData = row
            this.formck.gameTypeArrSelected = row.gameType + ''
            this.formck.coinName = row.coinName || "CANDY"
            this.formck.gameName = row.gameName
            this.formck.statusType = row.statusType
            // this.formck.sort = row.sort
            this.fileList = [
              {
                name: '',
                url: row.icon
              }
            ]
          }
          this.checkUploadBTN()
        })
      },
      handleBlur (ev) {
        // blur后若输入内容为空，处理为显示对应特权类型的最小默认值
        if (ev.target.ariaValueNow === 'undefined') this.formck.sort = ev.target.value = ev.target.ariaValueMin
      },
      checkUploadBTN () {
        this.$nextTick(() => {
          let onode = document.querySelectorAll('.el-upload.el-upload--picture-card')
          if (this.curClickType === 'see') {
            onode[0].style.display = 'none'
          } else {
            onode[0].style.display = 'inline-block'
            onode[0].style.display = this.fileList.length >= 1 ? 'none' : 'inline-block'
          }
        })
      },
      calcClick () {
        this.dialogVisible_forBlindBox = true
      },
      async calcRunClick () {
        this.calcRunClickLoading = true
        let _res = await this.calcRunCore()
        if (_res) {
          setTimeout(() => {
            this.isChangeSelect = true
            this.calcRunClickLoading = false
          }, Math.floor(Math.random() * (4 - 1) + 1) * 1000) // [1, 3)
        } else {
          this.calcRunClickLoading = false
        }
      },
      calcRunCore () {
        return new Promise((resolve, reject) => {
          if (+this.input_E === 0) {
            this.$message.error('最终收益不能为0')
            resolve(false)
            return false
          } else {
            this.calcRunClickLoading = true
            this.isChangeSelect = false
            if (this.show_input_CorD === 'C') {
              this.input_D = this.input_E / (this.input_A * this.input_B * (this.input_C / 10000))
              resolve(true)
            } else {
              this.input_C = this.input_E / (this.input_A * this.input_B * (this.input_D / 10000))
              resolve(true)
            }
          }
        })
      },
      handleChangeCalc (val) {
        this.isChangeSelect = false
        if (this.show_input_CorD === 'C') {
          this.input_C = 1
        } else {
          this.input_D = 1
        }
      },
      // 代币类型配置
      goToTokenTypeConfig(item){
        this.$router.push({ path: "/games/tokenTypeConfig", query: {
          gameType: item.gameType,
        }})
      }
    }
  }
</script>

<style lang="scss" scoped>
.laberSt{
  width:161px;
}
.mmUnit{
  color:#9ca7b5;
  font-size: 12px;
  padding-left: 8px;
}
</style>
<style>
.innerDialogWd .el-dialog{
  width: 685px;
}
.gamesWraper .requiredStyle .el-form-item__label{
  position: relative;
}
.gamesWraper .requiredStyle .el-form-item__label::before{
  position: absolute;
  right: 73px;
  top:2px;
  content: '*';
  color: red;
}
</style>
