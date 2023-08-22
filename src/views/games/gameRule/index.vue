<template>
  <el-tabs type="border-card"
   style="margin:20px 20px 0 20px;"
   @blur="((ev)=>{handleBlur(ev, formRow.type)})"
    v-model="tabActive">
    <el-tab-pane
      v-for="(item, index) in tabs"
      :key="index"
      v-if="isAuth.isPermi(item.permission)"
      :label="`${item.label}`"
      :name="item.name">
        <keep-alive>
          <component :sendTochildBridgeData="tabs[index]" v-if="tabActive === item.name" :is="item.component"></component>
        </keep-alive>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { allGamesList } from "@/api/games";
export default {
  data () {
    return {
      tabActive: 'game1',
      tabs: []
    }
  },
  activated () {
    this.isAuth.isPermi(['game:info:page']) && this.queryAllGamesList()
  },
  deactivated () {
    this.isAuth.isPermi(['game:info:page']) && this.queryAllGamesList()
  },
  created () {
    this.isAuth.isPermi(['game:info:page']) && this.queryAllGamesList()
  },
  methods: {
    queryAllGamesList () {
      let _params = {
        currentPage: 1, // 所有游戏列表
        pageSize: 1000,
        statusType: -1
      }
      this.loading = true
      allGamesList(_params).then(res => {
        if (res.code === 200) {
          let newList = res.data.list;
            for (let i = 0; i < newList.length - 1; i++) {
              if(newList[i].gameType == 1){
                newList[i].gameName = "猜数字";
              }
              for (let j = i + 1; j < newList.length; j++) {
                  if (newList[i].gameType == newList[j].gameType) {
                    newList.splice(j, 1);
                    j--;
                  }
              }
          }
          this.tabs = newList.map((val, index) => {
            let _json = {}
            _json.label = val.gameName
            _json.name = `game${index+1}`
            if (+val.gameType === 2) { // Candy夺宝
              _json.component = resolve => import('./takeJewel.vue').then(resolve)
            } else if (+val.gameType === 1) {
              _json.component = resolve => import('./guestPean.vue').then(resolve)
            } else if (+val.gameType === 3) { // 转转乐
              _json.component = resolve => import('./whirligigJoy.vue').then(resolve)
            } else if (+val.gameType === 4) { // 盲盒
              _json.component = resolve => import('./blindBox.vue').then(resolve)
            }
            _json.permission = ['game:room:statistic']
            _json.totalInformation = val // 通信用数据，必须
            return _json
          })
          this.loading = false
        } else {
          this.loading = false
          this.$message.error(res.message)
        }
      }).catch(e => {
        this.loading = false
      })
    }
  }
}
</script>
