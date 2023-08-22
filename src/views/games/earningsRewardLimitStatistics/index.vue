<template>
  <div class="prizesPoorManageBox">


    <el-tabs type="border-card"
    style="margin:20px 20px 0 20px;"
      v-model="tabActive">
      <el-tab-pane
        v-for="(item, index) in tabs"
        :key="index"
        v-if="isAuth.isPermi(item.permission)"
        :label="`${item.label}`"
        :name="item.name">
          <keep-alive>
            <component v-if="tabActive === item.name" :is="item.component"></component>
          </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
  
</template>

<script>
// 夺宝游戏：table每行查看点击按钮的详情页
export default {
  data () {
    return {
      URL_blindBoxNo: '',
      topLoading: false,
      nLevelqueryParams: {
        code: '',
        name: '',
        phone: '',
        memberId: '',
        realName: '',
        periodsNum: '',
        redbacktime: ''
      },
      tabActive: 'profitDetail',
      tabs: [
        {
          label: '收益/补贴',
          name: 'profitDetail',
          component: resolve => import('./profitDetail.vue').then(resolve),
          permission: ['blindBox:order:earningsInfoByPage']
        },
        {
          label: '管制分',
          name: 'control',
          component: resolve => import('./control.vue').then(resolve),
          permission: ['blindBox:member_control_score_record:all_page']
        },
        {
          label: '可参与',
          name: 'couldJoin',
          component: resolve => import('./couldJoin.vue').then(resolve),
          permission: ['blindBox:product_control:all_page']
        },
        {
          label: '赠送任务券',
          name: 'task',
          component: resolve => import('./task.vue').then(resolve),
          permission: ['blindBox:order_give:all_page']
        },
        {
          label: '赠送VIP券',
          name: 'vip',
          component: resolve => import('./vip.vue').then(resolve),
          permission: ['blindBox:order_give:all_page']
        },
        {
          label: '赠送Pizza',
          name: 'bonusPizza',
          component: resolve => import('./bonusPizza.vue').then(resolve),
          permission: ['product:coin_record:page']
        },
        {
          label: '赠送代币',
          name: 'commongivecoinComp',
          component: resolve => import('../blindBoxEachIssueInfos/commongivecoinComp.vue').then(resolve),
          permission: ['product:coin_record:page']
        }
      ]
    }
  },
  created () {
    this.URL_blindBoxNo = this.$route.query.blindBoxNo
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.prizesPoorManageBox{

  .popoBoxs{
    padding-left:20px;
    padding-top: 20px;
      ul{
        padding: 0;
        margin: 0;
      }
      li{
        border: 1px solid #ccc;
        display: inline-block;
        border-radius:5px;
        padding: 16px;
        margin-right:30px;
        p,h3{
          margin:0;
          padding: 0;
        }
        h3{
          padding-top: 6px;
        }
      }
    }
}
</style>
