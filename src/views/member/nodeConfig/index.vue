<template>
  <div class="userpower_Wrapper tab-content">
    <!-- <div class="mb30">
      <el-button v-hasPermi="['facilitator:node_setting:save']" icon="el-icon-plus" type="primary" @click="handleAdd()">新增</el-button>
    </div> -->
    <!--table-->
    <div class="top-search">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form ref="queryParams" inline :rules="rules" :model="queryParams" label-width="90px">
            <el-form-item label="代理节点">
              <el-select v-model="queryParams.nodeType" placeholder="请选择" @change="handleNodeSearch">
                <el-option label="全部" :value='null'></el-option>
                <el-option v-for="(its, index) in nodeArr" :key="index" :label="its.desc" :value="its.code"></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="合约城市" prop="cityName">
              <el-cascader ref="cascader" class="item1-input" v-model="selectedOptions" :options="citysData" clearable>
              </el-cascader>
            </el-form-item>
            <el-form-item label="更新时间" prop="regtime">
              <el-date-picker
                v-model="queryParams.regtime"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="queryParams.status" placeholder="请选择状态">
                <el-option label="全部" :value='null'></el-option>
                <el-option label="禁用" :value='2'></el-option>
                <el-option label="启用" :value='1'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button class="pl30 pr30" type="primary" v-hasPermi="['member:city:facilitator:page']" @click="search(1)">查询</el-button>
              <el-button type="primary" @click="handleChangeAllType('一键开启')" v-hasPermi="['facilitator:node_setting:enable']">一键开启</el-button>
              <el-button type="primary" @click="handleChangeAllType('一键关闭')" v-hasPermi="['facilitator:node_setting:disable']">一键关闭</el-button>
            </el-form-item>
            <el-form-item>
              <span class="text-muted">（筛选【合约城市】前，需选择【代理节点】）</span>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <el-table
    :data="tableData"
    v-loading="loading"
    class="tab-contentbox"
    style="width: 100%">
      <el-table-column prop="id" align="center" label="序号" width="80"></el-table-column>
      <el-table-column prop="giveTaskType" label="代理节点" align="center" min-width="120">
        <template slot-scope="{row}">
          <span v-if="row.giveTaskType == 9">国际节点</span>
          <span v-else-if="row.giveTaskType == 10">一级节点</span>
          <span v-else-if="row.giveTaskType == 11">二级节点</span>
          <span v-else-if="row.giveTaskType == 12">三级节点</span>
        </template>
      </el-table-column>
      <el-table-column prop="singleMaxAmount" label="合约城市" align="center" min-width="120">
        <template slot-scope="{row}">
          <template v-if="row.giveTaskType == 9">
            <span v-if="row.countryName">{{row.countryName}}</span>
            <span v-if="row.provinceName">/{{row.provinceName}}</span>
          </template>
          <template v-else>
            <span v-if="row.provinceName">{{row.provinceName}}</span>
            <span v-if="row.cityName">/{{row.cityName}}</span>
            <!-- <span v-if="row.areaName">/{{row.areaName}}</span> -->
          </template>
        </template>
      </el-table-column>
      <el-table-column label="节点费用" align="center" min-width="180">
        <template slot-scope="{row}">
          <span v-if="row.payInfo && row.payInfo.length > 0">
            {{row.payInfo[0].price}}/{{row.payInfo[0].payWay == 1 ? 'USDT' : 'Candy'}}
          </span>
          <span v-if="row.payInfo && row.payInfo.length > 1">
            ， {{row.payInfo[1].price || row.payInfo[1].price == 0 ? row.payInfo[1].price : ''}}{{row.payInfo[1].payWay == 1 ? '/USDT' : '/Candy'}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="signTime" label="协议期限（月）" align="center" min-width="120"></el-table-column>
      <el-table-column prop="status" label="状态" align="center" min-width="120">
        <template slot-scope="{row}">
          <el-switch v-hasPermi="['facilitator:node_setting:status']" v-model="row.status" @change="handleSetType(row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" align="center" min-width="120"></el-table-column>
    <el-table-column prop="updateTime" label="更新时间" align="center" min-width="160">
        <template slot-scope="{row}">
        {{row.updateTime ? $dayjs(row.updateTime).format('YYYY-MM-DD HH:mm:ss') : $dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss')}}
        </template>
    </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template scope="scope">
          <el-button v-hasPermi="['facilitator:node_setting:update']" type="text" size="mini" @click="handelEdit(scope.row)" :disabled="scope.row.status">编辑</el-button>
          <el-button v-hasPermi="['facilitator:node_setting:equity']" type="text" size="mini" @click="handleDetails(scope.row)">节点权益</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-pagination text-right mt10">
      <el-pagination
      @current-change="search"
      :page-sizes="[10, 20, 30]"
      @size-change="handleSizeChange"
      :current-page.sync="pageIndex"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage">
      </el-pagination>
    </div>
    <!--table-->
    <!--新增/编辑dialog-->
    <el-dialog custom-class="certifyForm" title="添加/编辑代理节点" :visible.sync="dialogFormVisible" :width="'700px'">
      <el-form :model="certifyform" :rules="rules" ref="ruleForm">
        <el-form-item label="代理节点：" :label-width="formLabelWidth" prop="giveTaskType">
          <el-select v-model="certifyform.giveTaskType" clearable placeholder="请选择" @change="handleNode">
            <el-option v-for="(its, index) in nodeArr" :key="index" :label="its.desc" :value="its.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合约城市：" :label-width="formLabelWidth">
          <el-cascader ref="cascader" class="item1-input" v-model="selectedArr" :options="citysData" @change="handleChange" :disabled="!!certifyform.id">
          </el-cascader>
        </el-form-item>
        <el-form-item label="节点费用：" :label-width="formLabelWidth">
          <div class="feiyong">
            <el-col :span="5">
              <el-checkbox v-model="currency.USDT" :label="1">USDT 支付</el-checkbox>
            </el-col>
            <el-col :span="11">
              <el-input v-model="payInfo[0].price" @input="payInfo[0].price=payInfo[0].price.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')" autocomplete="off" maxlength="20" clearable></el-input>
            </el-col>
            <el-col :span="8" class="clr-99">
              <span>（0-100000，包头包尾）</span>
            </el-col>
          </div>
          <div>
            <el-col :span="5">
              <el-checkbox v-model="currency.Candy" :label="2">Candy 支付</el-checkbox>
            </el-col>
            <el-col :span="11">
              <el-input v-model="payInfo[1].price" @input="payInfo[1].price=payInfo[1].price.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')" autocomplete="off" maxlength="20"></el-input>
            </el-col>
            <el-col :span="8" class="clr-99">
              （0-100000，包头包尾）
            </el-col>
          </div>
        </el-form-item>
        <el-form-item label="" :label-width="formLabelWidth">
          <span class="clr-99">（可多选，选择candy 支付，需受转赠逻辑影响，申请支付时，需校验手续费、荣耀值是否充足）</span> 
        </el-form-item>
        <el-form-item label="协议期限：" :label-width="formLabelWidth" prop="signTime">
          <el-col :span="22">
            <el-input v-model.number="certifyform.signTime" autocomplete="off" maxlength="20" clearable></el-input>
          </el-col>
          <el-col :span="2" class="right-dw">月</el-col>
        </el-form-item>
        <el-form-item label="排序：" :label-width="formLabelWidth" prop="sort">
          <el-input v-model.number="certifyform.sort" autocomplete="off" maxlength="20" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" :loading="editLoading">确 定</el-button>
      </div>
    </el-dialog>
    <!--项目详情dialog-->
    <el-dialog custom-class="certifyForm" title="节点权益" :visible.sync="projectVisible" :width="'800px'">
      <!-- <div class="mb15">
        <span class="text-muted pl10">详情页单张图片大小建议不超过500kb</span>
      </div>
      <div>
        <qu-editor v-model="bruleForm.equity" :min-height="192" ref="quEditorRef" :is-handle-img="true" disabled/>
      </div> -->
      <div>
        <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="bruleForm.equity" maxlength="1000" show-word-limit :disabled="textAreaBool"></el-input>
      </div>
      <div slot="footer" class="dialog-footer" v-if="editIsBool">
        <el-button type="primary" @click="handleEditProject()">编 辑</el-button>
        <el-button type="primary" @click="submitProjectForm()" :loading="editLoading">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import filterXSS from 'xss';
import {getCertificate as getCertificate_oss, upload as upload_oss} from '@/api/oss';
import _html from '@/utils/stHtml';
import {descHtml} from '@/api/goods/index';
import { nodeConfigPage, addNodeConfig, editNodeConfig, changeNodeConfig, editEquityNodeConfig, changeAllConfigEnable, changeAllConfigDisable } from "@/api/member/nodeConfig.js";
import { abroadFacilitator } from '@/api/member/cityService';
import { taskNodeListQuery } from '@/api/pointsMgmt/starTasks';
export default {
  components: {
    QuEditor: () => import('@/components/Editor')
  },
  data() {
    return {
      loading: false,
      optionsForginer: [],
      tableData: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      queryParams: {
        nodeType: null,
        status: null,
        regtime: '',
      },
      dialogFormVisible: false,
      currency: {
        USDT: true,
        Candy: false
      },
      payInfo: [
        {payWay: 1, price: null},
        {payWay: 2, price: null}
      ],
      certifyform: {
        giveTaskType: '',
        payInfo: [],
        signTime: '',
        sort: '',
      },
      rules: {
        giveTaskType: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        signTime: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { type: 'number', min: 1, message: '排序为数字且必须大于等于1', trigger: 'blur' },
        ],
        sort: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { type: 'number', min: 1, message: '排序为数字且必须大于等于1', trigger: 'blur' },
        ],
      },
      formLabelWidth: '120px',
      selectedArr: [],
      nodeArr: [],
      citysData: [],
      selectedOptions: [],
      serviceForm: {},
      bruleForm: {equity: '', id: ''},
      projectVisible: false,
      editLoading: false,
      editIsBool: true,
      textAreaBool: true,
    }
  },
  mounted() {
    this.search();
    this.handleGetNodeType();
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.search()
    },
    // 数据查询
    search (pgi) {
      if (pgi) this.pageIndex = pgi
      let ctryId = '';
      let pieId = '';
      let cyId = '';
      if(this.queryParams.nodeType && this.queryParams.nodeType == 9 && this.selectedOptions.length > 0) {
        ctryId = this.selectedOptions[0];
        pieId = this.selectedOptions[1];
      }else if(this.queryParams.nodeType && this.queryParams.nodeType != 9 && this.selectedOptions.length > 0) {
        pieId = this.selectedOptions[0];
        cyId = this.selectedOptions[1];
      }
      let _params = {
        currentPage: this.pageIndex,
        pageSize: this.pageSize,
        countryId: ctryId,
        provinceId: pieId,
        cityId: cyId,
        nodeType: this.queryParams.nodeType,
        startTime: this.queryParams.regtime && this.queryParams.regtime.length > 0 ? this.queryParams.regtime[0] : '',
        endTime: this.queryParams.regtime && this.queryParams.regtime.length > 0 ? this.queryParams.regtime[1] : '',
        status: this.queryParams.status,
      }
      this.loading = true
      nodeConfigPage(_params).then(response => {
        if (response.code === 200) {
          this.tableData = JSON.parse(JSON.stringify(response.data.list))
          this.totalPage = response.data.total;
          this.loading = false
        } else {
          this.tableData = []
          this.totalPage = 0
          this.pageSize = 10
          this.loading = false
          this.$message.error(response.message)
        }
      }).catch( e => {
        this.loading = false
      })
    },
    handleChangeAllType(type) {
      this.$confirm(`确认要${type}所有配置?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        if(type == '一键开启') {
          changeAllConfigEnable({}).then(response => {
            if (response.code === 200) {
              this.msgSuccess(`${type}成功`)
              this.search(this.pageIndex);
            } else {
              this.msgSuccess(response.message)
            }
          })
        }else if(type == '一键关闭') {
          changeAllConfigDisable({}).then(response => {
            if (response.code === 200) {
              this.msgSuccess(`${type}成功`)
              this.search(this.pageIndex);
            } else {
              this.msgSuccess(response.message)
            }
          })
        }
      }).catch(() => {
        
      });
    },
    handleAdd() {
      this.certifyform = {
        giveTaskType: '',
        payInfo: [],
        signTime: '',
        sort: '',
      };
      this.selectedArr = [];
      this.payInfo = [
        {payWay: 1, price: null},
        {payWay: 2, price: null}
      ]
      this.currency = {
        USDT: true,
        Candy: false
      }
      if(this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields();
      this.dialogFormVisible = true;
    },
    // 获取节点
    handleGetNodeType() {
      taskNodeListQuery().then(response => {
        if (+response.code === 200) {
          this.nodeArr = response.data.list || []
        } else {
          this.nodeArr = []
        }
      })
    },
    handleNodeSearch(val, isbool = false) {
      if(!isbool) {
        this.selectedOptions = [];
      }
      // 原提交对象是否要重置？不需要，直接若selectedArr.length=0不让提交
      let num = val == 9 ? val : 11;
      this.abroadFacilitatorRun(num, isbool);
    },
    // 选择节点
    handleNode (val, isbool = false) {
      // if(!isbool) {
        // this.selectedArr = []
        // this.selectedOptions = [];
      // }
      // 原提交对象是否要重置？不需要，直接若selectedArr.length=0不让提交
      if(isbool) {
        let num = val == 9 ? val : 11;
        this.abroadFacilitatorRun(num, isbool);
      }
    },
    // 获取城市
    abroadFacilitatorRun (val, isbool) {
      abroadFacilitator({ nodeType: val }).then(response => {
        if (+response.code === 200) {
          this.citysData = this.recursionTree(response.data.list);
          if(isbool) {
            this.selectedArr = [];
            this.$nextTick(() => {
              if(this.certifyform.giveTaskType == 9) {
                this.selectedArr.push(this.certifyform.countryId);
                this.selectedArr.push(this.certifyform.provinceId);
              }else {
                this.selectedArr.push(this.certifyform.provinceId);
                this.selectedArr.push(this.certifyform.cityId);
              }
              // if(this.certifyform.giveTaskType != 9) {
              //   this.selectedArr.push(this.certifyform.areaId);
              // }
            })
          }
        } else {
          this.citysData = []
        }
      }).catch(e => {
        console.log(e, 'e')
      })
    },
    recursionTree (origin) {
      if (Array.isArray(origin)) {
        if (!origin || !origin.length) return origin
        return origin.map(val => {
          let {adCode, children, ...a} = val
          return {
            value: adCode,
            ...a,
            children: children && children.length > 0 ? children.map(this.recursionTree) : null
          }
        })
      } else {
        let {adCode, children, ...a} = origin
        return {
          value: adCode,
          ...a,
          children: children && children.length > 0 ? children.map(this.recursionTree) : null
        }
      }
    },
    handleChange(value) {
      let {provinceName, provinceId, cityName, cityId, areaId, areaName} = {};
      let checkedNodes = this.$refs.cascader.getCheckedNodes()[0].pathNodes;
      let province = checkedNodes.length >= 1 && checkedNodes[0].data;
      let city = checkedNodes.length >= 2 && checkedNodes[1].data;
      let area = checkedNodes.length >= 3 && checkedNodes[2].data;
      
      checkedNodes.length >= 1 && (provinceId = province.value)
      checkedNodes.length >= 1 && (provinceName = province.label)
      checkedNodes.length >= 2 && (cityId = city.value)
      checkedNodes.length >= 2 && (cityName = city.label)
      checkedNodes.length >= 3 && (areaId = area.value)
      checkedNodes.length >= 3 && (areaName = area.label)
      this.serviceForm = {provinceName, cityName, areaName};
    },
    // 状态开关
    handleSetType(row) {
      let text = row.status == false ? "停用" : "启用";
      this.$confirm(`确认要${text}该配置?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        changeNodeConfig({id: row.id}).then(response => {
          if (response.code === 200) {
            this.msgSuccess(`保存成功`)
            this.search(this.pageIndex);
          } else {
            this.msgSuccess(response.message)
          }
        })
      }).catch(() => {
        if(row.status == false) {
          row.status = true
        } else{
          row.status = false
        }
      });
    },
    handelEdit(row) {
      this.certifyform = Object.assign({singNum: null, proportionFirst: null, proportionSecond: null}, row);
      this.handleNode(this.certifyform.giveTaskType, true);
      this.currency = {USDT: false, Candy: false};
      if(this.certifyform.payInfo && this.certifyform.payInfo.length > 0) {
        this.certifyform.payInfo.forEach((item, index) => {
          if(item.payWay == 1 && (item.price || item.price == 0)) {
            this.payInfo[0].price = item.price;
            this.currency.USDT = true;
          }
          if(item.payWay == 2 && (item.price || item.price == 0)) {
            this.payInfo[1].price = item.price;
            this.currency.Candy = true;
          }
        })
      }
      this.dialogFormVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.selectedArr.length <= 0) {
            this.$message.error('请选择合约城市')
            return;
          }
          if(!this.currency.USDT && !this.currency.Candy) {
            this.$message.error('请选择支付方式')
            return;
          }
          if(this.currency.USDT && (this.payInfo[0].price == '' || this.payInfo[0].price == null || this.payInfo[0].price == undefined)) {
            this.$message.error('请输入节点费用')
            return;
          }
          if(this.currency.Candy && (this.payInfo[1].price == '' || this.payInfo[1].price == null || this.payInfo[1].price == undefined)) {
            this.$message.error('请输入节点费用')
            return;
          }
          if(this.payInfo[0].price > 100000 || this.payInfo[1].price > 100000) {
            this.$message.error('请输入0~100000节点费用')
            return;
          }

          let _params = Object.assign({}, this.certifyform);
          _params.payInfo = [];
          if(this.currency.USDT == true) {
            this.payInfo[0].price = Number(this.payInfo[0].price)
            _params.payInfo.push(this.payInfo[0]);
          }
          if(this.currency.Candy == true) {
            this.payInfo[1].price = Number(this.payInfo[1].price);
            _params.payInfo.push(this.payInfo[1]);
          }
          this.editLoading = true;
          if(this.certifyform.id) {
            editNodeConfig(_params).then(response => {
              if (response.code === 200) {
                this.msgSuccess(`保存成功`)
                this.dialogFormVisible = false;
                this.editLoading = false;
                this.search(this.pageIndex);
              } else {
                this.msgSuccess(response.message)
                this.dialogFormVisible = false;
                this.editLoading = false;
              }
            }).catch(err => {
              this.editLoading = false;
            })
          }else {
            _params.provinceId = this.selectedArr[0];
            _params.cityId = this.selectedArr[1];
            _params.provinceName = this.serviceForm.provinceName;
            _params.cityName = this.serviceForm.cityName;
            // if(this.certifyform.giveTaskType !== 9) {
            //   _params.areaId = this.selectedArr[2];
            //   _params.areaName = this.serviceForm.areaName;
            // }
            addNodeConfig(_params).then(response => {
              if (response.code === 200) {
                this.msgSuccess(`保存成功`)
                this.dialogFormVisible = false;
                this.editLoading = false;
                this.search(1);
              } else {
                this.msgSuccess(response.message)
                this.dialogFormVisible = false;
                this.editLoading = false;
              }
            }).catch(err => {
              this.editLoading = false;
            })
          }
        }
      })
    },
    // 富文本编辑
    async handleDetails(row) {
      this.projectVisible = true;
      this.textAreaBool = true;
      this.editIsBool = !row.status;
      this.bruleForm.id = row.id;
      this.bruleForm.equity = row.equity;
      // 原有富文本 方式处理
      // let {top, bottom,start,end } = _html;
      // let _descHtml
      // try {
      //   _descHtml = await this.descHtmlReq(row.equity);
      //   _descHtml = _descHtml.replace(top, '').replace(bottom, '');
        // let subStart = _descHtml.indexOf(start)
        //     let subEnd = _descHtml.lastIndexOf(end);
        //     if(subStart != -1 && subEnd != -1){
        //       _descHtml = _descHtml.substring(subStart+start.length,subEnd)
        //     }
      // } catch (e) {
      //   console.log(e, '富文本内容获取超时')
      //   _descHtml = ''
      // }
      // this.bruleForm.equity = _descHtml
      // this.$nextTick(() => {
      //   this.$refs.quEditorRef.Quill.enable(false);
      // })
    },
    handleEditProject() {
      this.textAreaBool = false;
      // this.$refs.quEditorRef.Quill.enable();
    },
    async submitProjectForm() {
      if(this.bruleForm.equity !== null && this.bruleForm.equity !== undefined && this.bruleForm.equity !== '') {

      }else {
        this.$message.error('请填写内容')
        return;
      }
      // const _description = await this.handleDescription();
      let _myequity = this.bruleForm.equity.replace(/\s+/g, "");   //remove \s
      const _bruleForm = {
        id: this.bruleForm.id,
        equity: _myequity.replace(/[\r\n]/g, "") //remove \n\r
        // equity: _description
      }
      this.editLoading = true;
      editEquityNodeConfig(_bruleForm).then(response => {
        if (response.code === 200) {
          this.msgSuccess(`保存成功`)
          this.search(this.pageIndex);
          this.editLoading = false;
          this.projectVisible = false;
        } else {
          this.msgSuccess(response.message)
          this.editLoading = false;
          this.projectVisible = false;
        }
      }).catch(err => {
        this.editLoading = false;
      })
    },
    // 获取descHtml内容
    async descHtmlReq (url) {
      if(url == '' || url == null || url == undefined) {
        return '';
      }
      try {
        const {data} = await descHtml(url);
        return data;
      } catch (error) {
        console.error(error);
      }
    },
    // 节点权益描述内容上传
    async handleDescription () {
      const {top, bottom} = _html;
      const _xssDesc = filterXSS(this.bruleForm.equity); // xss 转化
      const description = top + _xssDesc + bottom;

      const certificates = await this.getCertificateRequest();
      const {res: {status, statusCode, requestUrls}} = await upload_oss(certificates, description, 'content');
      if (status == 200 && statusCode == 200) {
        return requestUrls[0];
      } else {
        this.$message.error('节点权益描述转化url错误');
      };
    },
    // 向您搭建的STS服务获取临时访问凭证
    async getCertificateRequest () {
      try {
        const {code, data, message} = await getCertificate_oss('blindBox');
        if (code == 200) {
          return data;
        } else {
          this.$message.error(message);
        };
      } catch (error) {
        // ...
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.userpower_Wrapper{
  padding: 20px;
  .right-dw{
    box-sizing: border-box;
    padding-left: 10px;
  }
  .feiyong{
    box-sizing: border-box;
    padding-bottom: 10px;
    overflow: hidden;
  }
  .clr-99{
    color: #999;
  }
}
</style>
<style lang="scss">
.tab-content{
  .certifyForm form{
    padding-right:40px;
    .el-select{
      width: 100%;
    }
    .item1-input {
      width: 100%;
      .item1-input-select {
        width: 68px;
      }
    }
  }
  .el-form-item__content{
    position: relative;
  }
}
</style>