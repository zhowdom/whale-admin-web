<template>
    <div class="userpower_Wrapper">
        <el-tabs type="border-card" v-model="tabActive">
            <template v-for="(item, index) in tabs">
                <el-tab-pane :key="index" v-if="isAuth.isPermi(item.permission)" :label="`${item.label}`" :name="item.name">
                    <keep-alive>
                        <component v-if="tabActive === item.name" :is="item.component" :bannerConfigAppSelectArr="bannerConfigAppSelectArr" :bannerConfigAppSelectObj="bannerConfigAppSelectObj"></component>
                    </keep-alive>
                </el-tab-pane>
            </template>
        </el-tabs>
    </div>
</template>

<script>
import { adsRent_addressList } from "@/api/moreCoin/index";
export default {
    components: {},
    data () {
        return {
            tabActive: 'setAudit',
            tabs: [
                {
                    label: `用户banner配置及审核`,
                    name: 'setAudit',
                    component: resolve => import('../commonComp/index.vue').then(resolve),
                    permission: ['setting:banner_dapp_position:page', 'setting:banner_setting:page']
                },
                {
                    label: `位置展示配置`,
                    name: 'positionConfig',
                    component: resolve => import('./positionConfig.vue').then(resolve),
                    permission: ['setting:banner_app_position:page', 'setting:banner_setting:page']
                },
                {
                    label: `banner配置`,
                    name: 'banner',
                    component: resolve => import('./banner.vue').then(resolve),
                    permission: ['setting:banner_app_position:page', 'setting:banner_setting:page']
                },
            ],
            bannerConfigAppSelectArr: [],// 位置
            bannerConfigAppSelectObj: {},// 位置枚举
        }
    },
    created () {
        this.adsRent_addressList();
    },
    methods: {
        // 查询下拉
        adsRent_addressList() {
            adsRent_addressList({}).then(response => {
                if (response.code === 200) {
                    this.bannerConfigAppSelectArr = JSON.parse(JSON.stringify(response.data.list));
                    this.bannerConfigAppSelectArr.forEach(item => {
                        this.bannerConfigAppSelectObj[item.value] = item.label;
                    })
                } else {
                    this.bannerConfigAppSelectArr = [];
                    this.$message.error(response.message)
                }
            })
        },
    }
}
</script>

<style lang="scss" scoped>
.userpower_Wrapper{
  padding: 20px;
}
</style>
