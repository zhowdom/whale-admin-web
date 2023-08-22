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
            tabActive: 'miningType',
            tabs: [
                {
                    label: `挖矿类型配置`,
                    name: 'miningType',
                    component: resolve => import('./miningType.vue').then(resolve),
                    permission: ['wallet:mining:conf:page']
                },
                {
                    label: `挖矿收益配置`,
                    name: 'miningProfit',
                    component: resolve => import('./miningProfit.vue').then(resolve),
                    permission: ['wallet:mining:conf:page']
                },
                {
                    label: `质押收割配置`,
                    name: 'miningFromTo',
                    component: resolve => import('./miningFromTo.vue').then(resolve),
                    permission: ['wallet:mining:conf:page']
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
