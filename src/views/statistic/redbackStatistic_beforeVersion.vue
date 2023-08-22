<template>
  <div class="redBackDetailsBox">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="真实姓名" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="输入真实姓名"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="输入手机号"
          clearable
          maxlength="11"
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="分红时间" prop="redbacktime">
        <el-date-picker
          v-model="queryParams.redbacktime"
          type="daterange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>

    <el-form-item label="星级等级" prop="levelTag">

        <el-select v-model="queryParams.selectedLevelTag" placeholder="请选择">
          <el-option
            v-for="item in levelTag"
            :key="item.value"
            :label="item.tag"
            :value="item.type">
          </el-option>
        </el-select>

    </el-form-item>
      <el-form-item>
        <el-button v-hasPermi="['agora:white:dividend:log:page']" type="primary" :loading="loading" icon="el-icon-search" @click="search(1)">查询</el-button>
        <!-- <el-button type="primary" icon="el-icon-search" @click="dispatchClick">test DISPATCH</el-button>
        <el-button type="primary" icon="el-icon-search" @click="commitClick">test COMMIT</el-button> -->
      </el-form-item>
    </el-form>

    <el-table
    :data="tableData"
    v-loading="loading"
    border
    style="width: 100%">
    <el-table-column
      prop="memberId"
      label="用户ID"
      align="center">
    </el-table-column>
    <el-table-column
      prop="userName"
      label="真实姓名"
      align="center">
    </el-table-column>
    <el-table-column
      prop="phone"
      label="手机号"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      prop="levelName"
      label="星级等级"
      align="center">
    </el-table-column>
    <el-table-column
      prop="dividendSource"
      width="120"
      label="分红来源"
      align="center">
    </el-table-column>
    <el-table-column
      prop="createAt"
      label="分红计算时间"
      width="160"
      align="center">
      <template slot-scope="{row}">
        {{row.createAt ? $dayjs(row.createAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
    </el-table-column>
    <el-table-column
      prop="percent"
      label="分红比例"
      align="center">
    </el-table-column>
    <el-table-column
      prop="totalWhalePeas"
      width="120"
      :render-header="renderHeaderTotalWhalePeas"
      label="分红总Candy"
      align="center">
    </el-table-column>
    <el-table-column
      prop="totalDividendMember"
      width="130"
      :render-header="renderHeaderTotalDividendMember"
      label="参与分红人数"
      align="center">
    </el-table-column>
    <el-table-column
      prop="whalePeas"
      width="100"
      :render-header="renderHeaderWhalePeas"
      label="所分Candy"
      align="center">
    </el-table-column>
    <el-table-column
      prop="dateString"
      width="160"
      :render-header="renderHeaderDateString"
      label="分红时间"
      align="center">
      <template slot-scope="{row}">
        {{row.dateString ? $dayjs(row.dateString).format('YYYY-MM-DD HH:mm:ss') : '-'}}
      </template>
    </el-table-column>
  </el-table>
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


  </div>
</template>

<script>
import { fluidList, queryStartTypes } from "@/api/om/white";
  export default {
    components: {},
    data () {
      return {
        levelTag: [],
        clickCount_1: 0,
        clickCount_2: 0,
        clickCount_3: 0,
        clickCount_4: 0,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        queryParams: {
          userName: '',
          phone: '',
          redbacktime: '',
          selectedLevelTag: '',
          orderItems: []
        },
        tableData: [],
        loading: false
      }
    },
    mounted () {
      this.queryParams.phone = this.$route.query.phone || ''
      this.search()
      queryStartTypes().then(response => {
        if (response.code === 200) {
          this.levelTag = response.data.list || []
        } else {
          this.$message.error(response.message)
        }
      })
    },
    watch: {},
    methods: {
      renderHeaderTotalWhalePeas (h, { column, $index }) {
        return h('el-button', {
          attrs: {
            type: 'text'
          },
          on: {
            click: () => {
              this.clickCount_2 = 0
              this.clickCount_3 = 0
              this.clickCount_4 = 0
              let x = this.clickCount_1 % 2
              this.queryParams.orderItems = x === 0 ? [{ asc: true, column: 'total_whale_peas' }] : [{ asc: false, column: 'total_whale_peas' }]
              this.clickCount_1++
              this.search()
            }
          },
          domProps: {
            innerHTML: this.handleCore(1)
          }
        })
      },
      renderHeaderTotalDividendMember (h, { column, $index }) {
        return h('el-button', {
          attrs: {
            type: 'text'
          },
          on: {
            click: () => {
              this.clickCount_1 = 0
              this.clickCount_3 = 0
              this.clickCount_4 = 0
              let x = this.clickCount_2 % 2
              this.queryParams.orderItems = x === 0 ? [{ asc: true, column: 'total_dividend_member' }] : [{ asc: false, column: 'total_dividend_member' }]
              this.clickCount_2++
              this.search()
            }
          },
          domProps: {
            innerHTML: this.handleCore(2)
          }
        })
      },
      renderHeaderWhalePeas (h, { column, $index }) {
        return h('el-button', {
          attrs: {
            type: 'text'
          },
          on: {
            click: () => {
              this.clickCount_1 = 0
              this.clickCount_2 = 0
              this.clickCount_4 = 0
              let x = this.clickCount_3 % 2
              this.queryParams.orderItems = x === 0 ? [{ asc: true, column: 'whale_peas' }] : [{ asc: false, column: 'whale_peas' }]
              this.clickCount_3++
              this.search()
            }
          },
          domProps: {
            innerHTML: this.handleCore(3)
          }
        })
      },
      renderHeaderDateString (h, { column, $index }) {
        return h('el-button', {
          attrs: {
            type: 'text'
          },
          on: {
            click: () => {
              this.clickCount_1 = 0
              this.clickCount_2 = 0
              this.clickCount_3 = 0
              let x = this.clickCount_4 % 2
              this.queryParams.orderItems = x === 0 ? [{ asc: true, column: 'date_string' }] : [{ asc: false, column: 'date_string' }]
              this.clickCount_4++
              this.search()
            }
          },
          domProps: {
            innerHTML: this.handleCore(4)
          }
        })
      },
      handleCore (type) {
        let _txt = ''
        switch(type) {
          case 1:
            _txt = '分红总Candy'
            break;
          case 2:
            _txt = '参与分红人数'
            break;
          case 3:
            _txt = '所分Candy'
            break;
          case 4:
            _txt = '分红时间'
            break;
        }
        let _h = `${_txt}<span class="custSortStyle"><i class="sort-caret ascending"></i><i class="sort-caret descending"></i></span>`
        if (this[`clickCount_${type}`] === 0) {
          return _h
        } else if (this[`clickCount_${type}`] % 2 === 0) {
          return `${_txt}<span class="custSortStyle"><i class="sort-caret ascending"></i><i class="isDescending sort-caret descending"></i></span>`
        } else {
          return `${_txt}<span class="custSortStyle"><i class="isAscending sort-caret ascending"></i><i class="sort-caret descending"></i></span>`
        }
      },
      search (pgi) {
        if (pgi) this.pageIndex = pgi
        let datetime = []
        datetime = this.queryParams.redbacktime
        let _params = {
          currentPage: this.pageIndex,
          endTime: datetime ? datetime[1] : '',
          inviteCode: '', // 原型上没有此过滤条件
          levelTag: this.queryParams.selectedLevelTag,
          orderItems: this.queryParams.orderItems,
          pageSize: this.pageSize,
          phone: this.queryParams.phone,
          startTime: datetime ? datetime[0] : '',
          userName: this.queryParams.userName
        }
        this.loading = true
        fluidList(_params).then(response => {
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
          this.loading = false
        })
      },
      // ...del
      dispatchClick () {
        this.$store.dispatch('setMs', {
          name: Math.random() + 1
        });
      },
      commitClick () {
        this.$store.commit('SET_MS', {
          name: Math.random() + 1
        });
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.search()
      }
    }
  }
</script>

<style lang="scss">
.redBackDetailsBox{
  padding: 20px;
}
/*custom sort style*/
.isDescending{border-top-color: #1890ff!important;}
.isAscending{border-bottom-color: #1890ff!important;}
.custSortStyle{
  position: relative;
}
.custSortStyle .sort-caret{
  position: absolute;
  left: 5px;
}
.custSortStyle .ascending{
  top:-2px!important;
}
.custSortStyle .descending{
  bottom: -3px!important;
}
</style>
