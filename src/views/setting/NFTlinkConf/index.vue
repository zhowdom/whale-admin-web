<template>
  <div class="link-config-wrap">
    <div class="top-tabs">
      <el-tabs type="border-card" v-model="appPackageType" @tab-click="handleClick">
        <!-- <el-tab-pane label="鲸丽生活" name="1">
          <div class="wrap">
            <div class="top-search">
              <el-form ref="mainForm1" inline :model="mainForm">
                <el-form-item label="渠道来源:" prop="linkType">
                  <el-select class="input-class" clearable v-model="mainForm.linkType" placeholder="请选择">
                    <el-option label="全部" :value='-1'></el-option>
                    <el-option label="外链" :value='1'></el-option>
                    <el-option label="内链" :value='2'></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="路由唯一标识:" prop="uniqueIdent">
                  <el-input class="input-class" v-model="mainForm.uniqueIdent" clearable placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="路由名称:" prop="name">
                  <el-input class="input-class" v-model="mainForm.name" clearable placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item class="fr mr0">
                  <el-button size="small" class="mr15" icon="el-icon-search" type="primary" @click="onSearch" v-hasPermi="['setting:jump_link:page']">查询</el-button>
                  <el-button size="small" type="success" icon="el-icon-plus" @click="onAdd" v-hasPermi="['setting:jump_link:save']">新增</el-button>
                </el-form-item>
              </el-form>
            </div>

            <div class="link-table">
              <el-table border :data="tableData">
                <el-table-column prop="id" align="center" label="编号" :formatter="formatter"></el-table-column>
                <el-table-column prop="linkType" align="center" label="渠道来源" :formatter="formatter"></el-table-column>
                <el-table-column prop="uniqueIdent" align="center" label="路由唯一标识" :formatter="formatter"></el-table-column>
                <el-table-column prop="name" align="center" label="路由名称" :formatter="formatter"></el-table-column>
                <el-table-column prop="sort" align="center" label="排序" :formatter="formatter"></el-table-column>
                <el-table-column prop="status" align="center" label="状态" width="120">
                  <template slot-scope="{row}">
                    <el-switch
                      :width="80"
                      :active-value="true"
                      :inactive-value="false"
                      active-text="已开启"
                      inactive-text="已关闭"
                      @change="statusChange(row)"
                      :value="row.status"
                      class="custom-switcher"
                      v-hasPermi="['setting:jump_link_status:change']">
                    </el-switch>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="220">
                  <template slot-scope="{row}">
                    <el-button v-if="!row.status" size="mini" type="primary" v-hasPermi="['setting:jump_link:update']" @click="onEdit(row)">编辑</el-button>
                    <el-button size="mini" type="warning" @click="onView(row)">查看</el-button>
                    <el-button v-if="!row.status" size="mini" type="danger" v-hasPermi="['setting:jump_link:del']" @click="delJumpLink(row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>

              <div class="table-pagination text-right mt10">
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
        </el-tab-pane> -->
        <el-tab-pane label="新版App" name="2">
          <div class="wrap">
            <div class="top-search">
              <el-form ref="mainForm2" inline :model="mainForm">
                <el-form-item label="渠道来源:" prop="linkType">
                  <el-select class="input-class" clearable v-model="mainForm.linkType" placeholder="请选择">
                    <el-option label="全部" :value='-1'></el-option>
                    <el-option label="外链" :value='1'></el-option>
                    <el-option label="内链" :value='2'></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="路由唯一标识:" prop="uniqueIdent">
                  <el-input class="input-class" v-model="mainForm.uniqueIdent" clearable placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="路由名称:" prop="name">
                  <el-input class="input-class" v-model="mainForm.name" clearable placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item class="fr mr0">
                  <el-button size="small" class="mr15" icon="el-icon-search" type="primary" @click="onSearch" v-hasPermi="['setting:jump_link:page']">查询</el-button>
                  <el-button size="small" type="success" icon="el-icon-plus" @click="onAdd" v-hasPermi="['setting:jump_link:save']">新增</el-button>
                </el-form-item>
              </el-form>
            </div>

            <div class="link-table">
              <el-table border :data="tableData">
                <el-table-column prop="id" align="center" label="编号" :formatter="formatter"></el-table-column>
                <el-table-column prop="linkType" align="center" label="渠道来源" :formatter="formatter"></el-table-column>
                <el-table-column prop="uniqueIdent" align="center" label="路由唯一标识" :formatter="formatter"></el-table-column>
                <el-table-column prop="name" align="center" label="路由名称" :formatter="formatter"></el-table-column>
                <el-table-column prop="sort" align="center" label="排序" :formatter="formatter"></el-table-column>
                <el-table-column prop="status" align="center" label="状态" width="120">
                  <template slot-scope="{row}">
                    <el-switch
                      :width="80"
                      :active-value="true"
                      :inactive-value="false"
                      active-text="已开启"
                      inactive-text="已关闭"
                      @change="statusChange(row)"
                      :value="row.status"
                      class="custom-switcher"
                      v-hasPermi="['setting:jump_link_status:change']">
                    </el-switch>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="220">
                  <template slot-scope="{row}">
                    <el-button v-if="!row.status" size="mini" type="primary" v-hasPermi="['setting:jump_link:update']" @click="onEdit(row)">编辑</el-button>
                    <el-button size="mini" type="warning" @click="onView(row)">查看</el-button>
                    <el-button v-if="!row.status" size="mini" type="danger" v-hasPermi="['setting:jump_link:del']" @click="delJumpLink(row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>

              <div class="table-pagination text-right mt10">
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
        </el-tab-pane>
        <!-- <el-tab-pane label="小程序" name="3">
          <div class="wrap">
            <div class="top-search">
              <el-form ref="mainForm3" inline :model="mainForm">
                <el-form-item label="渠道来源:" prop="linkType">
                  <el-select class="input-class" clearable v-model="mainForm.linkType" placeholder="请选择">
                    <el-option label="全部" :value='-1'></el-option>
                    <el-option label="外链" :value='1'></el-option>
                    <el-option label="内链" :value='2'></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="路由唯一标识:" prop="uniqueIdent">
                  <el-input class="input-class" v-model="mainForm.uniqueIdent" clearable placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="路由名称:" prop="name">
                  <el-input class="input-class" v-model="mainForm.name" clearable placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item class="fr mr0">
                  <el-button size="small" class="mr15" icon="el-icon-search" type="primary" @click="onSearch" v-hasPermi="['setting:jump_link:page']">查询</el-button>
                  <el-button size="small" type="success" icon="el-icon-plus" @click="onAdd" v-hasPermi="['setting:jump_link:save']">新增</el-button>
                </el-form-item>
              </el-form>
            </div>

            <div class="link-table">
              <el-table border :data="tableData">
                <el-table-column prop="id" align="center" label="编号" :formatter="formatter"></el-table-column>
                <el-table-column prop="linkType" align="center" label="渠道来源" :formatter="formatter"></el-table-column>
                <el-table-column prop="uniqueIdent" align="center" label="路由唯一标识" :formatter="formatter"></el-table-column>
                <el-table-column prop="name" align="center" label="路由名称" :formatter="formatter"></el-table-column>
                <el-table-column prop="sort" align="center" label="排序" :formatter="formatter"></el-table-column>
                <el-table-column prop="status" align="center" label="状态" width="120">
                  <template slot-scope="{row}">
                    <el-switch
                      :width="80"
                      :active-value="true"
                      :inactive-value="false"
                      active-text="已开启"
                      inactive-text="已关闭"
                      @change="statusChange(row)"
                      :value="row.status"
                      class="custom-switcher"
                      v-hasPermi="['setting:jump_link_status:change']">
                    </el-switch>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="220">
                  <template slot-scope="{row}">
                    <el-button v-if="!row.status" size="mini" type="primary" v-hasPermi="['setting:jump_link:update']" @click="onEdit(row)">编辑</el-button>
                    <el-button size="mini" type="warning" @click="onView(row)">查看</el-button>
                    <el-button v-if="!row.status" size="mini" type="danger" v-hasPermi="['setting:jump_link:del']" @click="delJumpLink(row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>

              <div class="table-pagination text-right mt10">
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
        </el-tab-pane> -->
      </el-tabs>
    </div>

    <!-- 新增、编辑渠道参数 -->
    <el-dialog
      center
      ref="linkConf"
      width="820px"
      class="link-conf"
      :visible.sync="shwoDia"
      :before-close="cancelDia"
      :close-on-click-modal="false"
      :title="`${diaType==1?'添加':diaType==2?'配置':'查看'}跳转链接`">
      <el-form :model="diaForm" :rules="rules" ref="diaForm" label-width="110px" :disabled="diaType==3">
        <el-form-item label="渠道来源:" prop="linkType">
          <el-radio-group :disabled="diaType == 2" class="input-class-modal" v-model="diaForm.linkType">
            <el-radio :label="2">内链</el-radio>
            <el-radio :label="1">外链</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="路由唯一标识:" prop="uniqueIdent">
          <el-input class="input-class-modal" placeholder="请输入" v-model.trim="diaForm.uniqueIdent" />
        </el-form-item>

        <el-form-item label="路由名称:" prop="name">
          <el-input class="input-class-modal" placeholder="请输入" v-model.trim="diaForm.name" />
          <div class="input-tips">路由名称不能相同</div>
        </el-form-item>

        <el-form-item label="排序:" prop="sort">
          <el-input class="input-class-modal" placeholder="请输入" v-model.trim="diaForm.sort" />
          <div class="input-tips">排序不能相同，不区分渠道来源，越小越靠前</div>
        </el-form-item>

        <el-form-item label="参数配置:">
          <el-row class="mb10 ml0" :gutter="15" v-for="(item, index) in diaForm.params" :key="index">
            <el-col :span="6" class="pl0">
              <el-form-item :prop="'params.' + index + '.name'">
                <el-input placeholder="请输入参数名" v-model.trim="item.name" />
              </el-form-item>
            </el-col>
            <el-col :span="6" class="">
              <el-form-item :prop="'params.' + index + '.value'">
                <el-input placeholder="请输入参数值" v-model.trim="item.value" />
              </el-form-item>
            </el-col>
            <el-col :span="6" class="">
              <el-form-item :prop="'params.' + index + '.remark'">
                <el-input placeholder="请输入备注" v-model.trim="item.remark" />
              </el-form-item>
            </el-col>
            <el-col :span="3" class="text-right">
              <el-button v-if="index==0" type="primary" icon="el-icon-plus" @click.prevent="addParam"></el-button>
              <el-button v-else class="remove" type="danger" icon="el-icon-minus" @click.prevent="removeParam(index)"></el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="mr15" @click="cancelDia">取 消</el-button>
        <el-button type="primary" v-if="diaType!=3" @click="confirmDia">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {page_NFT as page, save_NFT as save, del_NFT as del, update_NFT as update, change_NFT as change} from '@/api/setting/linkConf';

export default {
  name: 'LinkConfig',
  data () {
    return {
      appPackageType: '2', // 应用类型 1：网上商城App，2：CandyApp，3：网上商城小程序
      mainForm: {
        name: '',
        linkType: '',
        uniqueIdent: ''
      },
      diaForm: {
        linkType: '',
        name: '',
        sort: '',
        uniqueIdent: '',
        params: [
          {
            name: '',
            remark: '',
            value: ''
          }
        ]
      },
      pager: {
        curPage: 1,
        size: 10,
        total: 0,
      },
      shwoDia: false,
      diaType: 0, // 1 保存 2 编辑 3 查看
      tableData: [],
      rules: {
        linkType: [
          { required: true, message: '渠道来源不能为空', trigger: 'change' },
        ],
        uniqueIdent: [
          { required: true, message: '路由唯一标识不能为空', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '路由名称不能为空', trigger: 'blur' },
        ],
        sort: [
          { required: true, message: '排序不能为空', trigger: 'blur' },
        ],
      },
    }
  },
  mounted () {
    this.pageReq();
  },
  methods: {
    // tab切换操作
    handleClick() {
      this.tableData = [];
      this.pager.curPage = 1;
      this.$refs.mainForm1.resetFields();
      this.$refs.mainForm2.resetFields();
      this.$refs.mainForm3.resetFields();
      this.pageReq();
    },
    // 移除参数名
    removeParam (index) {
      if (this.diaForm.params.length > 1) {
        this.diaForm.params.splice(index, 1);
      }
    },
    // 添加参数名
    addParam () {
      const len = this.diaForm.params.length;
      if (this.diaForm.params[len - 1].name) {
        this.diaForm.params.push({name: '', value: '', remark: ''});
      } else {
        this.$message.info('参数名不能为空！');
      };
    },
    // 状态切换功能
    statusChange ({id, status}) {
      const h = this.$createElement;
      const style = {fontSize: '16px', padding: '10px 10px 8px', fontWeight: 600};
      const tips = status ? '关闭' : '开启';
      const message = h('div', {style}, [
        h('p', {class: 'ml5'}, `确定要${tips}吗？`)
      ]);

      this.$msgbox({
        message,
        type: 'warning',
        showClose: false,
        closeOnClickModal: false,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'coupons-msg',
        iconClass: 'el-icon-question iconQ',
      }).then(() => {
        this.changeReq(id);
      }).catch(() => {
        this.$message.info(`已取消${tips}`);
      });
    },
    // 删除跳转链接
    delJumpLink ({id}) {
      const h = this.$createElement;
      const style = {fontSize: '16px', padding: '10px 10px 8px'};
      const message = h('div', {style}, [
        h('p', {style: 'fontWeight: 600'}, '确定要删除吗？')
      ]);

      this.$msgbox({
        message,
        type: 'warning',
        showClose: false,
        closeOnClickModal: false,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'coupons-msg',
      }).then(() => {
        this.delReq(id);
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    // 格式化
    formatter (row, column) {
      let key = column.property;

      if (key == 'linkType') {
        const val = row[key];

        return val == 1 ? '外链' : '内链';
      } else {
        return row[key] || '-';
      }
    },
    // 格式日期功能
    formatDate (date, format = 'YYYY-MM-DD', def = '') {
      return date ? this.$dayjs(date).format(format) : def;
    },
    // 跳转连接配置分页
    async pageReq () {
      try {
        const {code, message, data: {list, pageSize, total}} = await page({
          ...this.mainForm,
          pageSize: this.pager.size,
          currentPage: this.pager.curPage,
          appPackageType: this.appPackageType,
        });

        if (code == 200) {
          this.tableData = list;
          this.pager.size = pageSize;
          this.pager.total = total;
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        throw error;
      }
    },
    // 跳转链接配置-状态修改
    async changeReq (id) {
      try {
        await change({id});
        this.$message.success('更新成功');
        this.pageReq();
      } catch (error) {
        throw error;
      }
    },
    // 跳转链接配置-删除
    async delReq (id) {
      try {
        await del({id});
        this.$message.success('删除成功');
        this.pageReq();
      } catch (error) {
        throw error;
      }
    },
    // 跳转链接配置-新增、编辑
    async saveOrEditReq (cb) {
      try {
        const id = this.id;
        const appPackageType = this.appPackageType;
        const fn = this.diaType == 1 ? save : update;
        const tips = this.diaType == 1 ? '保存成功' : '编辑成功';
        const req = this.diaType == 1
          ? {appPackageType, ...this.diaForm}
          : {id, appPackageType, ...this.diaForm};
        const {code, message} = await fn(req);

        if (code == 200) {
          this.shwoDia = false;
          this.$message.success(tips);
          this.cancelDia();
        } else {
          this.$message.error(message);
        }
        cb.close();
      } catch (error) {
        cb.close();
        throw error;
      }
    },
    // 条件搜索
    onSearch () {
      this.pager.curPage = 1;
      this.pageReq();
    },
    // 分页数量修改
    handleSizeChange(val) {
      this.pager.size = val;
      this.pageReq();
    },
    // 跳转当前页
    handleCurrentChange(val) {
      this.pager.curPage = val;
      this.pageReq();
    },
    // 加载loading
    loadLoading () {
      const target = this.$refs.linkConf.$el.firstChild;

      const loadinger = this.$loading({
        target,
        lock: true,
        text: '更新中...',
        spinner: 'el-icon-sunny',
        customClass: 'loadingAnim',
      });

      return loadinger;
    },
    // 取消弹窗
    cancelDia () {
      this.id = null;
      this.diaType = 0;
      this.shwoDia = false;
      this.$refs.diaForm.resetFields();
      const initData = this.$options.data().diaForm;
      this.diaForm = {...this.diaForm, ...initData};
      this.pageReq(); // 跳转链接列表
    },
    // 确认弹窗
    confirmDia () {
      this.$refs.diaForm.validate(valid => {
        if (valid) {
          const cb = this.loadLoading();
          this.saveOrEditReq(cb);
        } else {
          return false;
        }
      });
    },
    // 新增链接
    onAdd () {
      this.diaType = 1;
      this.shwoDia = true;
    },
    // 查看链接
    onView ({appPackageType, ...rest}) {
      this.diaType = 3;
      this.shwoDia = true;
      this.appPackageType = appPackageType + '';
      const {linkType, params, sort, uniqueIdent, name} = rest;
      const pams = params.length ? params : [{name: '', value: '', remark: ''}];
      this.diaForm = {...this.diaForm, linkType, sort, uniqueIdent, name};
      this.$set(this.diaForm, 'params', pams);
    },
    // 编辑链接
    onEdit({id, appPackageType, ...rest}) {
      this.id = id;
      this.diaType = 2;
      this.shwoDia = true;
      this.appPackageType = appPackageType + '';
      const {linkType, params, sort, uniqueIdent, name} = rest;
      const pams = params.length ? params : [{name: '', value: '', remark: ''}];
      this.diaForm = {...this.diaForm, linkType, sort, uniqueIdent, name};
      this.$set(this.diaForm, 'params', pams);
    },
  }
}
</script>

<style lang="scss" scoped>
  .link-config-wrap {
    padding: 20px;
    .top-search,
    .link-conf {
      .el-form-item {
        ::v-deep .el-form-item__label {
          font-weight: 400;
        }
      }
    }
    .input-class {
      width: 230px;
    }
    .input-class-modal {
      width: 260px;
    }
    .input-tips {
      display: inline-block;
      margin-left: 10px;
      color: #9ca7b5;
      vertical-align: top;
    }
    .custom-switcher {
      height: 60px;
      ::v-deep {
        .el-switch__label--left,
        .el-switch__label--right {
          position: absolute;
          z-index: -1;
          font-size: 14px;
        }
        .el-switch__label--left {
          margin-right: 10px;
          right: 0;
          color: #999;
        }
        .el-switch__label--right {
          margin-right: 0px;
          left: 0px;
          color: #fff;
        }
        .el-switch__label.is-active {
          z-index: 20;
        }
        .el-switch__core {
          height: 26px;
          border-radius: 24px;
        }
        .el-switch__core:after {
          border-radius: 24px;
          width: 26px;
          height: 26px;
          margin-left: -2px;
          box-shadow: -3px 0px 1px #888;
          top: -1px;
        }
      }
      &.is-checked ::v-deep {
        .el-switch__core:after {
          margin-left: -25px;
          box-shadow: 3px 0px 1px #888;
        }
      }
    }
  }
</style>
