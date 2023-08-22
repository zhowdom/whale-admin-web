<template>
    <div class="userpower_Wrapper">
        <el-tabs type="border-card"
            v-model="tabActive">
            <template v-for="(item, index) in tabs">
                <el-tab-pane :key="index" v-if="isAuth.isPermi(item.permission)" :label="`${item.label}`" :name="item.name">
                    <keep-alive>
                        <component 
                        v-if="tabActive === item.name" 
                        :is="item.component" 
                        :bannerConfigAppSelectArr="bannerConfigAppSelectArr" 
                        :bannerConfigAppSelectObj="bannerConfigAppSelectObj"
                        :coinServiceObj="coinServiceObj"
                        ></component>
                    </keep-alive>
                </el-tab-pane>
            </template>
        </el-tabs>
    </div>
</template>

<script>
import { bizTypeList } from "@/api/bannerConfig";
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
                    permission: ['setting:banner_dapp_position:page', 'setting:banner_setting:page']
                },
                {
                    label: `banner配置`,
                    name: 'banner',
                    component: resolve => import('./banner.vue').then(resolve),
                    permission: ['setting:banner_dapp_position:page', 'setting:banner_setting:page']
                },
                // {
                //     label: `test`,
                //     name: 'test',
                //     component: resolve => import('../commonComp/test.vue').then(resolve),
                //     permission: ['setting:banner_dapp_position:page', 'setting:banner_setting:page']
                // }
            ],
            bannerConfigAppSelectArr: [],// 位置
            bannerConfigAppSelectObj: {},// 位置枚举
            coinServiceArr: [],// 业务类型
            coinServiceObj: {},// 业务类型枚举
        }
    },
    created () {
        this.adsRent_addressList();
        this.bizTypeList();
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
        // 查询下拉业务类型
        bizTypeList() {
            bizTypeList({}).then(response => {
                if (response.code === 200) {
                    this.coinServiceArr = JSON.parse(JSON.stringify(response.data.list));
                    this.coinServiceArr.forEach(item => {
                        this.coinServiceObj[item.code] = item.desc;
                    })
                } else {
                    this.coinServiceArr = [];
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
