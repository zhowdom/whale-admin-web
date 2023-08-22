<template>
    <div class="tabs-box">
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
            tabActive: 'menuList',
            tabs: [
                {
                    label: `创建菜单`,
                    name: 'menuList',
                    component: resolve => import('./menuList.vue').then(resolve),
                    permission: ['setting:problem_manual_menu:tree']
                },
                {
                    label: `编辑内容`,
                    name: 'editContent',
                    component: resolve => import('./editContent.vue').then(resolve),
                    permission: ['setting:problem_manual_content:page']
                },
            ],
        }
    },
    methods: {
        
    }
}
</script>

<style lang="scss" scoped>
.tabs-box{
  padding: 20px;
}
</style>
