import XLSX from 'xlsx';
import {saveAs} from 'file-saver';

export default (json, fields, filename = '测试数据.xlsx') => {

  // 整理数据
  json.forEach(item => {
    for (let i in item) {
      if (fields.hasOwnProperty(i)) {
        item[fields[i]] = item[i];
      };

      // 删除原先的对象属性
      delete item[i];
    }
  });


  // excel的文件名称
  let sheetName = filename;

  // 创建工作薄对象
  let wb = XLSX.utils.book_new();

  // 将JS对象数组转换为工作表
  let ws = XLSX.utils.json_to_sheet(json, {header: Object.values(fields)});

  ws['!margins'] = {left:20, right:20, top:21,bottom:21,header:10,footer:10};

  ws['!cols'] = {wpx:600, width:600, wch:600};

  ws['!rows'] = {hpx: 300, hpt: 150};

  // 给创建的工作薄对象设置表名
  wb.SheetNames.push(sheetName);

  // 将工作表数据设置到给定名字的工作薄
  wb.Sheets[sheetName] = ws;

  // 设置单元格样式
  let cellStyle = {
    font: {
      sz: 19,
      name: "Verdana",
      color: {
        rgb: "E6FF00FF"
      },
    },
    fill: {
      fgColor: {
        rgb: "E6FF00FF",
      },
    },
    alignment: {
      vertical: 'center',
      horizontal: 'center',
    }
  };

  // 配置工作薄
  let wopts = {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary',
    cellStyles: true,
    defaultCellStyle: cellStyle,
    showGridLines: false
  };

  // 组合工作薄与配置，生成表格
  let wbout = XLSX.write(wb, wopts);

  // 使用file-saver 下载生成的表格
  let blob = new Blob([s2ab(wbout)], {type: 'application/octet-stream'});
  saveAs(blob, filename);
}

// 转化工作薄对象为blob对象
const s2ab = s => {
  let buf;
  if (typeof ArrayBuffer !== 'undefined') {
    buf = new ArrayBuffer(s.length);
    let view = new Uint8Array(buf);
    for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
  } else {
    buf = new Array(s.length);
    for (let i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
  };

  return buf;
}
