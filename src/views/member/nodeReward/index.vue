<template>
    <div class="userpower_Wrapper">
        <el-tabs type="border-card" v-model="tabActive">
            <template v-for="(item, index) in tabs">
                <el-tab-pane :key="index" v-if="isAuth.isPermi(item.permission)" :label="`${item.label}`" :name="item.name">
                    <keep-alive>
                        <component v-if="tabActive === item.name" :is="item.component"></component>
                    </keep-alive>
                </el-tab-pane>
            </template>
        </el-tabs>
    </div>
</template>

<script>
export default {
    components: {},
    data () {
        return {
            tabActive: 'rewardPackage',
            tabs: [
                {
                    label: `节点激励包配置`,
                    name: 'rewardPackage',
                    component: resolve => import('./rewardPackage.vue').then(resolve),
                    permission: ['integral:task_node_reward:page']
                },
                {
                    label: `节点奖励`,
                    name: 'reward',
                    component: resolve => import('./reward.vue').then(resolve),
                    permission: ['task:node_setting_reward:page']
                },
                {
                    label: `节点权益`,
                    name: 'nodeEquity',
                    component: resolve => import('./nodeEquity.vue').then(resolve),
                    permission: ['task:node_setting_equity:page']
                },
            ],
        }
    },
    created () {
        
    },
    methods: {
        
    }
}
</script>

<style lang="scss" scoped>
.userpower_Wrapper{
  padding: 20px;
}
</style>
