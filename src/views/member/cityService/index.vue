<template>
  <div class="city-service">
    <div class="top-search">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form ref="serviceForm" inline :rules="rules" :model="serviceForm" label-width="90px">
            <el-form-item label="邀请码">
              <el-input v-model="serviceForm.inviteCode" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="手机">
              <el-input v-model="serviceForm.phone" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="serviceForm.email" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="代理节点">
              <el-select v-model="serviceForm.nodeType" placeholder="请选择" @change="handleNode">
                <el-option label="全部" :value='null'></el-option>
                <el-option
                  v-for="item in optionsForginer"
                  :key="item.code"
                  :label="item.desc"
                  :value="item.code">
                </el-option>
            </el-select>
            </el-form-item>
            <!-- <el-form-item label="合约城市" prop="cityName">
              <el-cascader ref="cascader" class="item1-input" v-model="selectedOptions" :options="citysData" clearable>
              </el-cascader>
            </el-form-item> -->
            <el-form-item label="昵称">
              <el-input v-model="serviceForm.serviceUserName" placeholder="请输入服务商姓名"></el-input>
            </el-form-item>
            <el-form-item label="时间" prop="regtime">
              <el-date-picker
                v-model="serviceForm.regtime"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="serviceForm.statusType" placeholder="请选择服务商状态">
                <el-option label="全部" :value='-1'></el-option>
                <el-option label="禁用" :value='0'></el-option>
                <el-option label="启用" :value='1'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button class="pl30 pr30" type="primary" v-hasPermi="['member:city:facilitator:page']" @click="onSearch">查询</el-button>
            </el-form-item>
            <el-form-item>
              <span class="text-muted">（筛选【合约城市】前，需选择【代理节点】）</span>
            </el-form-item>
            <el-form-item class="fr mr0">
              <el-button type="primary" @click="onAdd" v-hasPermi="['member:city:facilitator:save']" icon="el-icon-plus">添加服务商</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div class="service-table">
      <el-table border :data="tableData" @sort-change="sortFunction" style="width: 100%">
        <el-table-column prop="id" align="center" label="ID" width="80"></el-table-column>
        <el-table-column header-align="center" align="center" prop="myMatchedType" label="代理节点" min-width="100"></el-table-column>
        <el-table-column prop="contractCity" align="center" label="合约城市" min-width="130"></el-table-column>
        <el-table-column label="节点费用" align="center" min-width="120">
        <template slot-scope="{row}">
          <span v-if="row.sourceType == 1">--</span>
          <template v-else>
            <span v-if="row.payInfo && row.payInfo.length > 0">
              {{row.payInfo[0].price}}/{{row.payInfo[0].payWay == 1 ? 'USDT' : 'Candy'}}
            </span>
          </template>
        </template>
      </el-table-column>
        <!-- <el-table-column prop="provinceName" align="center" label="省份" width="120"></el-table-column> -->
        <!-- <el-table-column prop="cityName" align="center" label="城市"></el-table-column> -->
        <el-table-column prop="startAt" align="center" label="开启时间" width="110">
          <template slot-scope="{row}">
            {{row.startAt?$dayjs(row.startAt).format('YYYY-MM-DD'):'-'}}
          </template>
        </el-table-column>
        <el-table-column prop="serviceUserName" align="center" label="城市服务商" min-width="130"></el-table-column>
        <el-table-column prop="phone" align="center" label="手机" min-width="130"></el-table-column>
        <el-table-column prop="email" align="center" label="邮箱" min-width="130"></el-table-column>
        <el-table-column prop="inviteCode" align="center" label="邀请码" width="130"></el-table-column>
        <el-table-column prop="excessTime" align="center" sortable="custom" label="剩余时间(天)" width="120"></el-table-column>
        <el-table-column prop="giveTaskName" align="center" label="赠送任务券" width="110"></el-table-column>
        <el-table-column prop="sourceType" align="center" label="来源" width="80">
          <template slot-scope="{row}">
            <span v-if="row.sourceType == 2">H5申请</span>
            <span v-else>后台配置</span>
          </template>
        </el-table-column>
        <el-table-column prop="statusType" align="center" label="状态" width="140">
          <template slot-scope="{row}">
            <!-- 状态 0 未启用 1启用 -->
            <el-switch 
              v-hasPermi="['member:city:facilitator:status:change']" 
              @change="swChange(row)" 
              class="table-switch" 
              :value="row.statusType" 
              :width="83" 
              active-text="已开启" 
              inactive-text="已禁用" 
              :active-value="1" 
              :inactive-value="0"
            ></el-switch>
            <!-- v-if="row.sourceType == 1" <span v-else>{{row.excessTime > 0 ? '进行中' : '过期'}}</span> -->
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="170">
          <template slot-scope="{row}">
            <el-button size="mini" type="warning" v-hasPermi="['member:city:facilitator:info']" @click="handleTabBtn(row, 'view')">查看</el-button>
            <el-button v-if="row.statusType==0 && !row.enableTime" size="mini" type="primary" v-hasPermi="['member:city:facilitator:update']" @click="handleTabBtn(row, 'edit')">编辑</el-button>
            <!-- && row.sourceType == 1 -->
          </template>
        </el-table-column>
      </el-table>
      <div class="table-pagination text-right mt10" v-hasPermi="['member:city:facilitator:page']">
        <el-pagination
          :current-page="pager.curPage"
          :page-sizes="[10, 20, 30]"
          :page-size="pager.size"
          :total="pager.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {facilitatorPage, statusChange} from '@/api/member/cityService';
import {taskNodeListQuery} from '@/api/pointsMgmt/starTasks';
import { abroadFacilitator } from '@/api/member/cityService';

export default {
  name: 'CityService',
  data () {
    return {
      optionsForginer: [],
      serviceForm: {
        inviteCode: '',
        nodeType: '',
        cityName: '',
        regtime: '',
        serviceUserName: '',
        phone: '',
        email: '',
        statusType: -1,
      },
      orderItems: [
        {
          asc: true,
          column: 'excess_time'
        }
      ],
      rules: {
        phone: [
          {require: false, pattern: /^1[0-9]{10}$/, message: '手机号格式有误', trigger: 'blur'}
        ]
      },
      tableData: [],
      matchedObj: {},
      pager: {
        curPage: 1,
        size: 10,
        total: 0,
      },
      citysData: [],
      selectedOptions: []
    }
  },
  created () {
    taskNodeListQuery().then(response => {
      if (+response.code === 200) {
        this.optionsForginer = response.data.list || []
      } else {
        this.optionsForginer = []
      }
    })
  },
  mounted () {
    this.facilitatorPageRequest();
  },
  methods: {
    runMatch () {
      return new Promise((resolve, reject) => {
        taskNodeListQuery().then(response => {
          if (+response.code === 200) {
            (response.data.list || []).forEach(item => {
              let {code, desc} = item
              this.matchedObj[code] = desc
            })
          } else {
            this.matchedObj = {}
          }
          resolve(this.matchedObj)
        })
      })
    },
    // 选择节点
    handleNode (val) {
      this.selectedOptions = []
      if(!val) {
        this.citysData = []
        return;
      }
      let num = val == 9 ? 9 :12;
      this.abroadFacilitatorRun(num);
    },
    // 获取城市
    abroadFacilitatorRun (val) {
      abroadFacilitator({ nodeType: val }).then(response => {
        if (+response.code === 200) {
          this.citysData = this.recursionTree(response.data.list);
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
    // 排序
    sortFunction ({column, prop, order}) {
      this.orderItems[0].asc = order == 'ascending';
      this.facilitatorPageRequest();
    },
    // 查询分页数据
    async facilitatorPageRequest () {
      try {
        let datetime = []
        datetime = this.serviceForm.regtime
        const rqData = {
          ...this.serviceForm,
          endTime: datetime ? datetime[1] : '',
          startTime: datetime ? datetime[0] : '',
          pageSize: this.pager.size,
          orderItems: this.orderItems,
          currentPage: this.pager.curPage,
          provinceId: this.selectedOptions.length > 0 ? this.selectedOptions[0] : '',
          cityId: this.selectedOptions.length > 1 ? this.selectedOptions[1] : '',
          areaId: this.selectedOptions.length > 2 ? this.selectedOptions[2] : '',
        };
        const {code, message, data: {list, pageSize, total}} = await facilitatorPage(rqData);
        if (code == 200) {
          await this.runMatch()
          this.tableData = list;
          for (let [k, s] of Object.entries(this.tableData)) {
            this.$set(this.tableData[k], 'myMatchedType', this.matchedObj[s.giveTaskType])
          }
          this.pager.size = pageSize;
          this.pager.total = total;
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
    // 修改状态
    async statusChangeRequest (statusType, id) {
      try {
        const {code, message} = await statusChange({id, statusType});
        if (code == 200) {
          this.facilitatorPageRequest();
          this.$message({type: 'success', message: '修改成功'});
        } else {
          this.$message({type: 'error', message});
        }
      } catch (error) {
        // ...
      }
    },
    // 条件搜索
    onSearch () {
      // 搜索时页码重置
      this.pager.curPage = 1;
      this.facilitatorPageRequest();
    },
    // 新增任务
    onAdd () {
      const curView = this.$route
      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          // 跳转页面到新增
          this.$router.replace({
            path: 'addCityService',
            query: {
              type: 'add'
            }
          });
        })
      });
    },
    // 状态切换功能
    swChange (row) {
      const h = this.$createElement;
      const style = {fontSize: '16px', padding: '20px 10px'};
      const {statusType, phone, serviceUserName, id, provinceName, cityName, areaName} = row;
      const val = statusType ? 0 : 1;
      const tips = statusType ? '禁用' : '启用';
      const message = h('p', {style}, [
        h('span', null, '您正在'),
        h('span', {style: 'color: red'}, `“${tips}”`),
        h('span', null, '用户"'),
        h('span', {style: 'color: #4F7AF6'}, `${serviceUserName}(${phone})`),
        h('span', null, `"在${provinceName||''} ${cityName||''} ${areaName||''}的服务商资格，请再次确认！`)
      ]);

      this.$msgbox({
        message,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        // 操作
        this.statusChangeRequest(val, id);
      }).catch(() => {
        // 取消
        this.$message({type: 'info', message: `已取消${tips}`});
      });
    },
    // 分页数量修改
    handleSizeChange(val) {
      this.pager.size = val;
      this.facilitatorPageRequest();
    },
    // 跳转当前页
    handleCurrentChange(val) {
      this.pager.curPage = val;
      this.facilitatorPageRequest();
    },
    // 表格中按钮功能
    handleTabBtn(row, info) {
      const curView = this.$route;
      window.sessionStorage.removeItem('edit');
      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          // 跳转页面到编辑/详情
          this.$router.replace({
            path: `${info}CityService`,
            query: {
              id: row.id,
              type: info,
            }
          });
          if (info == 'edit') {
            window.sessionStorage.setItem('edit', JSON.stringify(row));
          }
        })
      });
    },
  }
}
</script>

<style lang="scss" scoped>
  .city-service {
    padding: 20px;
    .top-search  {
      .el-form-item {
        ::v-deep .el-form-item__label {
          font-weight: 400;
        }
      }
      .el-form-item:last-child {
        margin-right: 0;
      }
    }
    .service-table {
      .table-switch {
        height: 60px;
        ::v-deep .el-switch__label--left,
        ::v-deep .el-switch__label--right {
          position: absolute;
          z-index: -1;
          font-size: 14px;
        }
        ::v-deep .el-switch__label--left {
          margin-right: 10px;
          right: 0;
          color: #999;
        }
        ::v-deep .el-switch__label--right {
          margin-right: 0px;
          left: 0px;
          color: #fff;
        }
        ::v-deep .el-switch__label.is-active {
          z-index: 20;
        }
        ::v-deep .el-switch__core {
          height: 26px;
          border-radius: 24px;
        }
        ::v-deep .el-switch__core:after {
          border-radius: 24px;
          width: 26px;
          height: 26px;
          margin-left: 0px;
          box-shadow: -3px 0px 1px #888;
          top: -1px;
        }
        &.is-checked ::v-deep .el-switch__core:after {
          margin-left: -25px;
          box-shadow: 3px 0px 1px #888;
        }
      }
    }
  }
</style>
