<template>
  <div class="update-wrap">
    <div class="top-search">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form ref="versionForm" inline :model="versionForm">
            <el-form-item label="版本号">
              <el-select clearable v-model="versionForm.versionNo" placeholder="请选择版本号">
                <el-option v-for="item in versions" :key="item" :label="item" :value='item'></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="平台">
              <el-select clearable v-model="versionForm.platform" placeholder="请选择平台">
                <el-option v-for="(key, value) in platforms" :label="value" :value="key" :key="key"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="发布时间" prop="update">
              <el-date-picker
                class="align-width"
                v-model="update"
                type="daterange"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onSearch" v-hasPermi="['setting:version:page']">查询</el-button>
            </el-form-item>
            <el-form-item class="fr mr0">
              <el-button type="primary" @click="onAdd" v-hasPermi="['setting:version:save']">新增</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div class="update-table">
      <el-table border :data="tableData" :default-sort="defaultTabOrder" style="width: 100%" @sort-change="sortFunction">
        <el-table-column prop="platform" align="center" label="平台" :formatter="formatter"></el-table-column>
        <el-table-column prop="versionNo" sortable="custom" align="center" label="最新版本号" :formatter="formatter"></el-table-column>
        <el-table-column prop="compatibleVersion" align="center" label="最小支持版本号" :formatter="formatter"></el-table-column>
        <el-table-column prop="description" align="center" label="版本描述" width="235" :formatter="formatter"></el-table-column>
        <el-table-column prop="auditMarketTypeList" align="center" label="审核未通过的应用市场" width="235" :formatter="formatter"></el-table-column>
        <el-table-column prop="upgradeLink" align="center" label="下载地址" width="235" :formatter="formatter"></el-table-column>
        <el-table-column prop="executor" align="center" label="操作人" width="120" :formatter="formatter"></el-table-column>
        <el-table-column prop="releaseTime" sortable="custom" align="center" label="发布时间" width="170" :formatter="formatter"></el-table-column>
        <el-table-column prop="currentRelease" align="center" label="状态" width="100" :formatter="formatter"></el-table-column>
        <el-table-column align="center" label="操作" width="290">
          <template slot-scope="{row}">
            <el-button v-if="row.enabled" size="mini" type="danger" v-hasPermi="['setting:version:recall']" @click="handleRecallBtn(row)">撤回</el-button>
            <el-button size="mini" type="primary" v-hasPermi="['setting:version:save']" @click="handleTabBtn(row)">查看详情</el-button>
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

    <el-dialog
      center
      ref="contt"
      width="460px"
      title="审核未通过的应用市场"
      :close-on-click-modal="false"
      :visible.sync="isShowMarket"
      :before-close="closeHandle">
      <div class="content">
        <el-checkbox-group class="group" v-model="selAppMarketList">
          <template v-for="{label, value} in marketList">
            <el-checkbox
              :label="value"
              :key="value"
              v-if="showMarket(rowPlatform, value)"
            >
              {{label}}
            </el-checkbox>
          </template>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer" v-hasPermi="['setting:versionMarket:update']">
        <el-button class="mr20" size="small" @click="closeHandle">取 消</el-button>
        <el-button type="primary" size="small" @click="confirmHandle">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      center
      ref="recall"
      width="460px"
      title="撤回已发布的版本"
      :close-on-click-modal="false"
      :visible.sync="isShowRecall"
      :before-close="closeRecallHandle">
      <div class="content">
        <el-form>
          <el-form-item label="可撤回版本：">
            <el-radio-group class="custom-radio-grop" v-model="recallModel">
              <el-radio v-for="item in recalls" :label="item.versionNo" :key="item.versionNo">{{item.versionNo}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="mr20" size="small" @click="closeRecallHandle">取 消</el-button>
        <el-button type="primary" size="small" @click="confirmRecallHandle">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const {marketList} = require('@/settings.js');
import {findKey} from '@/utils/index';
import platforms from '@/utils/platform';
import {versionPage, listVersions, auditMarket, releasesHistory, versionRecall} from '@/api/setting/version';

export default {
  name: 'UpdateMgmt',
  data () {
    return {
      platforms,
      marketList,
      versionForm: {
        versionNo: '',
        platform: '',
        orderItemList: [
          {
            asc: false,
            column: 'releaseTime'
          }
        ],
        startReleaseDate: '',
        endReleaseDate: '',
      },
      update: [],
      pager: {
        curPage: 1,
        size: 10,
        total: 0,
      },
      tableData: [],
      versions: [],
      defaultTabOrder: {
        prop: 'releaseTime',
        order: 'descending'
      },
      isShowMarket: false,
      selAppMarketList: [],
      rowPlatform: '',
      rowVision: '',
      loadinger: null,
      isShowRecall: false,
      recallModel: '',
      recalls: [],
    }
  },
  computed: {
    showMarket () {
      return (platform, market) => {
        if (platform == 3) {
          return market == 1 || market == 2;
        } else {
          return market != 1 && market != 2;
        };
      }
    }
  },
  mounted () {
    this.versionPageRequest();
    this.listVersionsRequest();
  },
  methods: {
    // 格式化
    formatter (row, column) {
      let key = column.property;

      if (key == 'description' || key == 'upgradeLink') {
        const h = this.$createElement;
        const showTip = row[key]?.trim()?.length * 14 >= 214;
        const tooltipProps = {
          effect: 'dark',
          placement: 'top-start'
        };
        const toolTxtCss = {
          fontSize: '13px',
          width: '320px',
          lineHeight: '24px',
          wordWrap: 'break-word',
        };
        const cellTxtCss = {
          height: '50px',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': 2,
          textAlign: 'left',
        };
        const cellTxt = h('div', {style: cellTxtCss}, row[key]);
        const toolTxt = h('div', {style: toolTxtCss, slot: 'content'}, row[key]);
        const tooltip = h('el-tooltip', {props: tooltipProps}, [toolTxt, cellTxt], null);

        return row[key] ?  (showTip ? tooltip : row[key]) : '-';
      } else if (key == 'auditMarketTypeList') {
        const templArr = [];
        const h = this.$createElement;
        const auditMarketTypeList = row[key] || [];

        this.marketList.forEach(el => {
          if (auditMarketTypeList.includes(el.value)) {
            templArr.push(el.label);
          }
        });
        const text = templArr.join('、');

        return auditMarketTypeList.length ? h('div', {
          style: {
            cursor: 'pointer',
            color: '#1ABC9C',
            textAlign: 'left',
          },
          on: {
            click: () => this.showPop(auditMarketTypeList, row['platform'], row['versionNo'])
          }
        }, text) : '-';
      } else if (key == 'platform') {
        return findKey(platforms, row[key]) || '-';
      } else if (key == 'releaseTime') {
        return this.formatDate(row[key], 'YYYY-MM-DD HH:mm:ss', '-');
      } else if (key == 'currentRelease') {
        return row[key] ? '当前发布' : '历史版本';
      } else {
        return row[key] || '-';
      }
    },
    // 排序
    sortFunction ({prop, order}) {
      const asc = order == 'ascending'; // 是否升序
      const column = this.formatStr(prop); // 格式字符串
      this.$set(this.versionForm.orderItemList, 0, {asc, column});
      this.versionPageRequest();
    },
    // 格式日期功能
    formatDate (date, format = 'YYYY-MM-DD', def = '') {
      return date ? this.$dayjs(date).format(format) : def;
    },
    // 格式小驼峰为下划线功能
    formatStr (str) {
      return str;
      // return str ? str.replace(/([A-Z])/g, "_$1").toLowerCase() : '';
    },
    // 可回退版本列表
    async releasesHistoryReq (platform, versionNo) {
      try {
        const {code, data, message} = await releasesHistory(
          Object.assign(
            {platform, versionNo},
            {
              applicationPackageType: 1 // old app 1 new app 2
            }
          )
        );
        if (code == 200) {
          this.recalls = data.list || [];
          if (this.recalls.length) {
            this.isShowRecall = true;
          } else {
            this.$alert('当前没有可撤回版本！', {
              center: true,
              showConfirmButton: false,
              callback: action => {}
            });
          };
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        throw error;
      }
    },
    // 版本回退请求
    async versionRecallReq (info) {
      try {
        const {code, message} = await versionRecall(
          Object.assign(
            info,
            {
              applicationPackageType: 1 // old app 1 new app 2
            }
          )
        );
        if (code == 200) {
          this.rowPlatform = '';
          this.rowVision = '';
          this.recallModel = '';
          this.recalls = [];
          this.isShowRecall = false;
          await this.versionPageRequest();
          this.$message.success('撤回成功！');
        } else {
          this.$message.error(message);
        };
      } catch (error) {
        throw error;
      }
    },
    // 历史版本信息
    async listVersionsRequest () {
      try {
        const {code, message, data} = await listVersions({
          isReleased: true,
          applicationPackageType: 1 // old app 1 new app 2
        });
        if (code == 200) {
          this.versions = data;
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
    // 查询分页数据
    async versionPageRequest () {
      try {
        const [startReleaseDate, endReleaseDate] = this.update || [];

        this.versionForm.startReleaseDate = startReleaseDate;
        this.versionForm.endReleaseDate = endReleaseDate;

        const rqData = {
          ...this.versionForm,
          pageSize: this.pager.size,
          currentPage: this.pager.curPage,
          applicationPackageType: 1 // old app 1 new app 2
        };
        const {code, message, data: {list, pageSize, total}} = await versionPage({
          ...rqData,
          unreleased: false,
          isReleased: true,
        });
        if (code == 200) {
          this.tableData = list;
          this.pager.size = pageSize;
          this.pager.total = total;
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        // ...
      }
    },
    // 更新审核市场
    async auditMarketRequest () {
      try {
        const {code, message} = await auditMarket({
          versionNo: this.rowVision,
          marketType: this.selAppMarketList,
          platform: this.rowPlatform,
          applicationPackageType: 1 // old app 1 new app 2
        });
        if (code == 200) {
          setTimeout(() => {
            this.$message.success('更新成功！');
            this.loadinger.close();
            this.closeHandle();
          }, 1200);
          this.versionPageRequest();
        } else {
          this.loadinger.close();
          this.$message.error(message);
        }
      } catch (error) {
        // ...
        this.loadinger.close();
      }
    },
    // 条件搜索
    onSearch () {
      this.pager.curPage = 1;
      this.versionPageRequest();
    },
    // 新增版本
    onAdd () {
      const curView = this.$route
      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          // 跳转页面到新增
          this.$router.replace({path: `updateAdd`});
        })
      });
    },
    // 分页数量修改
    handleSizeChange(val) {
      this.pager.size = val;
      this.versionPageRequest();
    },
    // 跳转当前页
    handleCurrentChange(val) {
      this.pager.curPage = val;
      this.versionPageRequest();
    },
    // 查看详情
    handleTabBtn({id}) {
      const curView = this.$route;

      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          // 详情
          this.$router.replace({
            path: `updateDetail`,
            query: {id}
          })
        })
      });
    },
    // 撤回操作
    handleRecallBtn({platform, versionNo}) {
      this.rowPlatform = platform;
      this.rowVision = versionNo;
      this.releasesHistoryReq(platform, versionNo);
    },
    // 关闭撤回弹窗
    closeRecallHandle () {
      this.rowPlatform = '';
      this.rowVision = '';
      this.recallModel = '';
      this.recalls = [];
      this.isShowRecall = false;
    },
    // 确认撤回弹窗
    confirmRecallHandle () {
      if (!this.recallModel) return this.$message.error('请选择要撤回的版本！');
      const info = {
        currentVersionNo: this.rowVision,
        platform: this.rowPlatform,
        recallVersionNo: this.recallModel,
      };
      this.versionRecallReq(info);
    },
    // 打开应用市场弹窗
    showPop (data, platform, versionNo) {
      this.selAppMarketList = [];
      this.rowPlatform = platform;
      this.rowVision = versionNo;
      this.isShowMarket = true;

      this.marketList.forEach(el => {
        if (data.includes(el.value)) {
          this.selAppMarketList.push(el.value);
        }
      });
    },
    // 关闭市场弹窗
    closeHandle () {
      this.selAppMarketList = [];
      this.isShowMarket = false;
    },
    // 确认市场弹窗
    confirmHandle () {
      const target = this.$refs.contt.$el.firstChild;

      this.loadinger = this.$loading({
        target,
        lock: true,
        text: '更新中...',
        spinner: 'el-icon-sunny',
        customClass: 'loadingAnim',
      });

      this.auditMarketRequest();
    }
  }
}
</script>

<style lang="scss" scoped>
  .update-wrap {
    padding: 20px;
    .top-search  {
      .align-width {
        width: 270px;
      }
      .el-form-item {
        margin-right: 20px;
        ::v-deep .el-form-item__label {
          font-weight: 400;
        }
      }
      .el-form-item {
        button {
          padding: 10px 30px;
        }
      }
      .el-form-item:last-child {
        margin-right: 0;
      }
    }
    .group {
      padding-left: 90px;
      ::v-deep .el-checkbox {
        min-width: 125px;
        line-height: 36px;
      }
    }
    .custom-radio-grop {
      padding-left: 100px;
      display: block;
      ::v-deep .el-radio {
        min-width: 125px;
        line-height: 36px;
        .el-radio__input {
          width: 18px;
          height: 18px;
          .el-radio__inner {
            width: 18px;
            height: 18px;
            &::after {
              width: 6px;
              height: 6px;
            }
          }
          .el-radio__original {
            width: 18px;
            height: 18px;
          }
        }
        .el-radio__label {
          vertical-align: middle;
        }

      }
    }
  }
</style>
