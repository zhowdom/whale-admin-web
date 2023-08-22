const export2Excel = {
  currentPage (ctx, name) {
    // default function
    let tables = document.getElementById("out-table")
    let table_book = ctx.$XLSX.utils.table_to_book(tables)
    var table_write = ctx.$XLSX.write(table_book, {
      bookType: "xlsx",
      bookSST: true,
      type: "array"
    })
    try {
      ctx.$FileSaver.saveAs(
        new Blob([table_write], { type: "application/octet-stream" }),
        `${name}.xlsx`
      )
    } catch (e) {
      if (typeof console !== "undefined") console.log(e, table_write)
    }
    return table_write
  },
  multiplePage (option = {}) {
    // support custom selected table'row date or multiple page data
    // Waiting for research...
    require.ensure([], () => {
      const tHeader = option.header
      const filterVal = option.headerProps
      // const tHeader = ['姓名', '住址', '时间'] // 对应表格输出的中文title
      // const filterVal = ['name', 'address', 'date'] // 对应表格输出的数据
      const list = ctx.tableData // 表格data
      const data = formatJson(filterVal, list)
      // export_json_to_excel(tHeader, data, 'xlsx') // 对应下载文件的名字
    })
    function formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}

export default export2Excel