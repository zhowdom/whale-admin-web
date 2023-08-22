// 非四舍五入保留制定位数小数
// export default (n, fixed) => ~~(Math.pow(10, fixed) * n) / Math.pow(10, fixed) // bug*
export default (num, decimal) => {
	num = num.toString()
	let index = num.indexOf('.')
	if (index !== -1) {
		num = num.substring(0, decimal + index + 1)
	} else {
		num = num.substring(0)
	}
	return parseFloat(num).toFixed(decimal)
}
