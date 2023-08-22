<template>
  <div class="city-service-detail">
    <el-card class="detail-card" shadow="always">
      <div slot="header" class="detail-header">
        <span>城市信息</span>
      </div>

      <div class="cityInfo">
        <el-row class="info-item" :gutter="20">
          <el-col :span="4">节点</el-col>
          <!-- <el-col :span="10">{{info.provinceName}} {{info.cityName}}</el-col> -->
          <el-col :span="10">{{info.contractCity}}</el-col>
        </el-row>
        <el-row class="info-item" :gutter="20">
          <el-col :span="4">生效周期</el-col>
          <el-col :span="10">{{formateDate(info.startAt)}}-{{formateDate(info.expireAt)}}<span class="circle-text">(剩余{{info.excessTime||'-'}}天)</span></el-col>
        </el-row>
        <el-row class="info-item" :gutter="20">
          <el-col :span="4">协议年限</el-col>
          <el-col :span="10">{{info.signTime}}{{info.signUnit=='M'?'月':'年'}}</el-col>
        </el-row>
      </div>
    </el-card>
    <el-card class="detail-card" shadow="always">
      <div slot="header" class="detail-header">
        <span>数据信息</span>
      </div>

      <div class="cityInfo">
        <el-table border :data="tableData" style="width: 100%">
          <el-table-column prop="cityTotalMember" align="center" label="总人数" width="80"></el-table-column>
          <el-table-column prop="todayIncreaseMember" align="center" label="今日新增人数" width="120"></el-table-column>
          <el-table-column prop="monthIncreaseMember" align="center" label="本月新增人数" width="120"></el-table-column>
          <el-table-column prop="yesterdayTransferDividend" align="center" label="节点昨日分红" width="110"></el-table-column>
          <el-table-column prop="monthTransferDividend" align="center" label="节点本月分红" width="130"></el-table-column>
          <el-table-column prop="totalIncome" align="center" label="节点累计分红" width="130"></el-table-column>
          <el-table-column prop="statusType" align="center" label="节点状态" width="130">
            <template slot-scope="{row}">
              <!-- 状态 0 未启用 1启用 -->
              {{row.statusType?'启用':'禁用'}}
            </template>
          </el-table-column>
          <el-table-column prop="activeCityWorth" align="center" label="节点推广活跃值" width="120"></el-table-column>
          <el-table-column prop="todayIncreaseActiveWorth" align="center" label="新增节点推广活跃值"></el-table-column>
        </el-table>
      </div>
    </el-card>
    <div class="form-btns">
      <el-button type="info" size="medium" icon="el-icon-d-arrow-left" @click="goBackList">返回</el-button>
    </div>
  </div>
</template>

<script>
import {facilitatorInfo, memberSearch} from '@/api/member/cityService';

export default {
  name: 'CityServiceDetail',
  data () {
    return {
      tableData: [
        /*
        {
          cityTotalMember: 0,               // 总人数
          todayIncreaseMember: 0,           // 今日新增人数
          monthIncreaseMember: 0,           // 本月新增人数
          yesterdayTransferDividend: 0,     // 昨日分红
          monthTransferDividend: 0,         // 本月分红
          totalIncome: 0,                   // 累计分红
          statusType: 0,                    // 服务商状态
          activeCityWorth: 0,               // 城市有效活跃值
          todayIncreaseActiveWorth: 0,      // 今日新增城市活跃值
        }
        */
      ],
      info: {},
    }
  },
  computed: {
    formateDate () {
      return time => time ? this.$dayjs(time).format('YYYY-MM-DD HH:mm:ss') : '-';
    }
  },
  mounted () {
    this.id = '';
    this.info = {};
    this.id = this.$route.query.id;
    this.facilitatorInfoRequest();
  },
  methods: {
    // 查询详情
    async facilitatorInfoRequest () {
      try {
        const {code, message, data} = await facilitatorInfo({id: this.id});
        if (code == 200) {
          this.info = data;
          const {
            cityTotalMember,
            todayIncreaseMember,
            monthIncreaseMember,
            yesterdayTransferDividend,
            monthTransferDividend,
            totalIncome,
            statusType,
            activeCityWorth,
            todayIncreaseActiveWorth,
          } = data;
          this.$set(this.tableData, 0, {
            cityTotalMember,
            todayIncreaseMember,
            monthIncreaseMember,
            yesterdayTransferDividend,
            monthTransferDividend,
            totalIncome,
            statusType,
            activeCityWorth,
            todayIncreaseActiveWorth,
          });
        } else {
          this.$message({type: 'error', message});
        }
      } catch (error) {
        // ...
      }
    },
    // 返回
    goBackList () {
      const curView = this.$route;
      this.$store.dispatch('tagsView/delView', curView).then(() => {
        this.$nextTick(() => {
          // 返回列表页
          this.$router.replace({path: `cityService`});
        });
      });
    }
  }
}
</script>

<style lang="scss" scoped>
  .city-service-detail {
    min-width: 1200px;
    padding: 50px 80px 0;
    .detail-card {
      margin: 0 auto;
      margin-bottom: 46px;
      .detail-header {
        font-size: 18px;
        font-weight: 500;
      }
      .cityInfo {
        .info-item {
          height: 48px;
          line-height: 48px;
          font-size: 14px;
          .circle-text {
            color: #FF6600;
          }
        }
      }
    }
    .form-btns {
      text-align: center;
    }
  }
</style>
