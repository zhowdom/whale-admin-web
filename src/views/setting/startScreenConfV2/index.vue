<template>
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
          <component v-if="tabActive === item.name" :is="item.component" :tag="'isnewApp'" :bannerConfigAppSelectArr="bannerConfigAppSelectArr" :bannerConfigAppSelectObj="bannerConfigAppSelectObj"></component>
        </keep-alive>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { adsRent_addressList } from "@/api/moreCoin/index";
export default {
  data () {
    return {
      tabActive: 'new',
      tabs: [
        // {
        //   label: `鲸丽生活App`,
        //   name: 'old',
        //   component: resolve => import('./old.vue').then(resolve),
        //   permission: ['setting:start_page_v2:query']
        // },
        {
          label: '新App',
          name: 'new',
          component: resolve => import('./new.vue').then(resolve),
          permission: ['setting:start_page_v2:query']
        },
        // {
        //   label: '小程序',
        //   name: 'mini',
        //   component: resolve => import('./mini.vue').then(resolve),
        //   permission: ['setting:start_page_v2:query']
        // }
        {
          label: `用户开屏页配置及审核`,
          name: 'setAudit',
          component: resolve => import('../../bannerConfig/commonComp/index.vue').then(resolve),
          permission: ['setting:banner_dapp_position:page', 'setting:banner_setting:page']
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
              console.log(response.data.list, '?sss')
                this.bannerConfigAppSelectArr = JSON.parse(JSON.stringify(response.data.list));
                this.bannerConfigAppSelectArr.forEach(item => {
                    this.bannerConfigAppSelectObj[item.code] = item.desc;
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
