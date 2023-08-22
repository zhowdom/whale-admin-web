<template>
  <div class="star-goodp-growing-tables">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="序号" align="center" width="50">
        <template slot-scope="scope"><span>{{scope.$index+1}}</span></template>
      </el-table-column>
      <el-table-column prop="levelTag" align="center" label="等级名称" width="80">
        <template slot-scope="{row}">
          {{levelName(row.levelTag)}}
        </template>
      </el-table-column>
      <el-table-column prop="modifyAt" align="center" label="等级变化及权益分红计算时间" width="100">
        <template slot-scope="{row}">
          {{row.modifyAt?$dayjs(row.modifyAt).format('YYYY-MM-DD HH:mm:ss'):'-'}}
        </template>
      </el-table-column>
      <el-table-column prop="levelTag" align="center" label="等级标识" width="80"></el-table-column>
      <el-table-column label="等级成长设置" align="center">
        <el-table-column class-name="multi-line" prop="zip" align="center" label="条件编码" width="120">
          <template slot-scope="{row}">
            <div class="multi-line-class center">-</div>
            <div class="multi-line-class center">-</div>
            <div class="multi-line-class center">-</div>
            <div class="multi-line-class center">-</div>
            <div class="multi-line-class center">-</div>
          </template>
        </el-table-column>
        <el-table-column class-name="multi-line" prop="activeWorthMin" label="条件设置" min-width="370">
          <template slot-scope="{row}">
            <div class="multi-line-class">
              <div class="multi-line-class-inner">
                基础活跃值大于或等于<span class="red-span">{{'{'+row.activeWorthMin+'}'}}</span>
              </div>
            </div>
            <div class="multi-line-class">
              <div class="multi-line-class-inner">
                有效直推达<span class="red-span">{{'{'+row.directPromotionMemberMin+'}'}}</span>人,
                直推的用户基础活跃值大于或等于<span class="red-span">{{'{'+1+'}'}}</span>
              </div>
            </div>
            <div class="multi-line-class">
              <div class="multi-line-class-inner">
                团队活跃值大于等于<span class="red-span">{{'{'+row.activeTeamWorthMin+'}'}}</span>
              </div>
            </div>
            <div class="multi-line-class">
              <div class="multi-line-class-inner">
                部落总活跃值大于等于<span class="red-span">{{'{'+row.activeTribeWorthMin+'}'}}</span>
              </div>
            </div>
            <div class="multi-line-class">
              <div class="multi-line-class-inner">
                我的直推有<span class="red-span">{{'{'+row.directPromotionLevelQuantity+'}'}}</span>个
                <span class="red-span">{{'{'+levelName(row.directPromotionLevelTag)+'}'}}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column class-name="multi-line" prop="activeWorthExtendPerOne" align="center" label="单项提升值" width="90">
          <template slot-scope="{row}">
            <div class="multi-line-class center">{{row.activeWorthExtendPerOne||0}}</div>
            <div class="multi-line-class center">{{row.directPromotionMemberExtendPerOne||0}}</div>
            <div class="multi-line-class center">{{row.activeTeamWorthExtendPerOne||0}}</div>
            <div class="multi-line-class center">{{row.activeTribeWorthExtendPerOne||0}}</div>
            <div class="multi-line-class center">{{row.directPromotionLevelExtendPerOne||0}}</div>
          </template>
        </el-table-column>
        <el-table-column class-name="multi-line" prop="activeWorthExtendMax" align="center" label="提升值最高值" width="110">
          <template slot-scope="{row}">
            <div class="multi-line-class center">{{row.activeWorthExtendMax||0}}</div>
            <div class="multi-line-class center">{{row.directPromotionMemberExtendMax||0}}</div>
            <div class="multi-line-class center">{{row.activeTeamWorthExtendMax||0}}</div>
            <div class="multi-line-class center">{{row.activeTribeWorthExtendMax||0}}</div>
            <div class="multi-line-class center">{{row.directPromotionLevelExtendMax||0}}</div>
          </template>
        </el-table-column>
        <el-table-column class-name="multi-line" prop="activeWorthExtendDesc" label="显示说明" width="420">
          <template slot-scope="{row}">
            <div class="multi-line-class">
              <div class="multi-line-class-inner">{{row.activeWorthExtendDesc||'-'}}</div>
            </div>
            <div class="multi-line-class">
              <div class="multi-line-class-inner">{{row.directPromotionMemberExtendDesc||'-'}}</div>
            </div>
            <div class="multi-line-class">
              <div class="multi-line-class-inner">{{row.activeTeamWorthExtendDesc||'-'}}</div>
            </div>
            <div class="multi-line-class">
              <div class="multi-line-class-inner">{{row.activeTribeWorthExtendDesc||'-'}}</div>
            </div>
            <div class="multi-line-class">
              <div class="multi-line-class-inner">{{row.directPromotionLevelExtendDesc||'-'}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" align="center" label="升级所需提升值" width="120">
          <template slot-scope="{row}">
            {{
              row.activeTeamWorthExtendMax+
              row.activeTribeWorthExtendMax+
              row.activeWorthExtendMax+
              row.directPromotionLevelExtendMax+
              row.directPromotionMemberExtendMax
            }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="executor" align="center" label="操作人" width="80">
        <template slot-scope="{row}">{{row.executor||'-'}}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {expertList} from '@/api/pointsMgmt/starTalent';

export default {
  name: 'StarGoodPGrowingTables',
  props: {
    updateModal: Function,
    curType: Number,
    shouldUpdate: Boolean,
  },
  data() {
    return {
      tableData: []
    }
  },
  computed: {
    levelName() {
      return arg => {
        if (arg) {
          switch (arg) {
            case 'VIP0':
              return '无星达人'
              break;
            case 'VIP1':
              return '一星达人'
              break;
            case 'VIP2':
              return '二星达人'
              break;
            case 'VIP3':
              return '三星达人'
              break;
            case 'VIP4':
              return '四星达人'
              break;
            default:
              return '-'
              break;
          }
        } else {
          return '-';
        }
      }
    },
  },
  mounted () {
    this.expertListRequest();
  },
  methods: {
    // 星级达人级成长配置清单
    async expertListRequest () {
      try {
        const {code, message, data: {list}} = await expertList({
          type: this.curType
        });
        if (code == 200) {
          this.tableData = list;
        } else {
          this.$message({type: 'error', message});
        }
      } catch (error) {
        // ...
      }
    },
    // 编辑功能
    handleEdit(index, row) {
      this.$emit('updateModal', {
        name: 0,
        data: row,
      });
    }
  },
  watch: {
    shouldUpdate: function (value) {
      value && this.expertListRequest();
    }
  }
}
</script>

<style lang="scss" scoped>
  .star-goodp-growing-tables {
    .red-span {
      color: red;
    }
    ::v-deep td.multi-line,
    ::v-deep td.multi-line .cell {
      padding: 0!important;
    }
    td.multi-line {
      .multi-line-class {
        height: 44px;
        padding: 6px;
        line-height: 16px;
        position: relative;
        border-bottom: 1px solid #dfe6ec;
        .multi-line-class-inner {
          top: 50%;
          position: absolute;
          transform: translateY(-50%);
        }
      }
      .center {
        line-height: 32px;
      }
      .multi-line-class:last-child {
        border-bottom: none;
      }
    }
  }
</style>
