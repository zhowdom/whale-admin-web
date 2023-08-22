<template>
    <div class="userpower_Wrapper">
      <el-date-picker
        @change="handleChange1"
          v-model="value1"
          type="date"
          placeholder="选择日期">
        </el-date-picker>


        <el-time-select
          v-model="value"
          @change="handleChange"
          :picker-options="{
            start: '08:30',
            step: '00:15',
            end: '18:30'
          }"
          placeholder="选择时间">
        </el-time-select>

      <p @click="testRun">提交的时间戳</p>
      <p @click="testRender">测试回显日期</p>
        

    </div>
</template>

<script>
export default {
    components: {},
    data () {
        return {
          value1: '2021-11-2',
          value: '08:30',
          testStr: 1652079600000,
        }
    },
    created () {
    },
    mounted () {
      console.log(this.stamp_to_dateTimeStr(1668362400000))
      console.log(this.stamp_to_dateTimeStr(1669433400000))
    },
    methods: {
      stamp_to_dateTimeStr (stamp, isNeedsecond) {
        /**
         * 根据时间戳(毫秒，13位) -> 日期时间字符串(格式：2021-11-2 08:30)
         * 是否需要显示秒：isNeedsecond：true｜false
         */
        return isNeedsecond ? this.$dayjs(stamp).format('YYYY-MM-DD HH:mm:ss') : this.$dayjs(stamp).format('YYYY-MM-DD HH:mm')
      },
      dateTimeStr_to_Stamp (dateTimeStr) {
        /**
         * 日期时间字符串 -> 时间戳(毫秒，13位)
         * dateTimeStr格式：
         * 日期：2021-11-02
         * 时间(也可以后面补全秒)：08:30
         */
        return this.$dayjs(dateTimeStr).valueOf()
      },
      testRun () {
        let combainedDate = this.value1 + ' ' + this.value
        console.log(this.value1, 'ol2')
        console.log(this.value, 'ol')
        console.log('提交后台的时间戳：', this.dateTimeStr_to_Stamp(combainedDate))
      },
      testRender () {
        let _res = this.stamp_to_dateTimeStr(this.testStr)
        this.value1 = _res.split(' ')[0]
        this.value = _res.split(' ')[1]
      },
      handleChange1(v){
        console.log('当前选的日期：', v)
      },
      handleChange(v){
        console.log('当前选的时间：', v)
      }
    }
}
</script>

<style lang="scss" scoped>
</style>
