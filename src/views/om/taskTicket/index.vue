<template>
  <div class="task-ticket">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-tabs class="task-ticket-card-tabs" v-model="activeName" type="card">
          <el-tab-pane label="个人特权券" name=0 v-hasPermi="['integral:task:info:page']">
            <personal-Task v-if="activeName=='0'"/>
          </el-tab-pane>
          <el-tab-pane label="全平台特权券" name=1 v-hasPermi="['integral:task:global:page']">
            <all-platforms-ticket v-if="activeName=='1'"/>
          </el-tab-pane>
          <el-tab-pane label="商品任务券" name=2 v-hasPermi="['integral:task:product:page']">
            <goods-ticket v-if="activeName=='2'"/>
          </el-tab-pane>
          <el-tab-pane label="游戏赠送奖励券" name=3 v-hasPermi="['integral:task:game:page']">
            <games-ticket v-if="activeName=='3'"/>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'TaskTicket',
  components: {
    PersonalTask: () => import('./personalTask'),
    AllPlatformsTicket: () => import('./allPlatformsTicket'),
    GoodsTicket: () => import('./goodsTicket'),
    GamesTicket: () => import('./gamesTicket'),
  },
  data () {
    return {
      activeName: '0',
    }
  },
  beforeRouteEnter (to, from, next) {
    const fromPath = from.path;
    const personal = ['/om/taskAdd', '/om/taskEdit', '/om/taskDetail'];
    const allPlatform = ['/om/allPltTicketAdd', '/om/allPltTicketEdit', '/om/allPltTicketDetail'];
    const goods = ['/om/goodsTicketAdd', '/om/goodsTicketEdit', '/om/goodsTicketDetail'];
    const games = ['/om/gamesTicketAdd', '/om/gamesTicketEdit', '/om/gamesTicketDetail'];
    next(vm => {
      if (allPlatform.includes(fromPath)) {
        vm.activeName = '1';
      } else if (personal.includes(fromPath)) {
        vm.activeName = '0';
      } else if (goods.includes(fromPath)) {
        vm.activeName = '2';
      } else if (games.includes(fromPath)) {
        vm.activeName = '3';
      }
      return true;
    })
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/element-variables.scss";

  .task-ticket {
    padding: 20px;
    position: relative;
    & .task-ticket-card-tabs {
      ::v-deep .el-tabs__header {
        border: none;
        & .el-tabs__item {
          border-bottom-color: #dfe4ed !important;
          &.is-active {
            background-color: $--color-primary;
            color: #fff;
          }
        }
      }
    }
  }
</style>>
