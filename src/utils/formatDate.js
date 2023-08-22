import dayjs from 'dayjs'

export function stamp_to_dateTimeStr(stamp, isNeedsecond) {
  /**
   * 根据时间戳(毫秒，13位) -> 日期时间字符串(格式：2021-11-2 08:30)
   * 是否需要显示秒：isNeedsecond：true｜false
   */
  return isNeedsecond ? dayjs(stamp).format('YYYY-MM-DD HH:mm:ss') : dayjs(stamp).format('YYYY-MM-DD HH:mm')
}

export function dateTimeStr_to_Stamp(dateTimeStr) {
  /**
   * 日期时间字符串 -> 时间戳(毫秒，13位)
   * 日期时间字符串(dateTimeStr)的格式：
   * 1、日期：2021-11-02
   * 2、时间(也可以后面补全秒)：08:30
   */
  return dayjs(dateTimeStr).valueOf()
}

export function dateTimeStr_to_DateObj(dateTimeStr) {
  /**
   * 日期时间字符串 -> 原生的 Date 对象(Tue Nov 01 2022 00:00:00 GMT+0800 (中国标准时间))
   * 日期时间字符串(dateTimeStr)的格式：
   * 1、日期：2021-11-02
   * 2、时间(也可以后面补全秒)：08:30
   */
  return dayjs(dateTimeStr).toDate()
}
