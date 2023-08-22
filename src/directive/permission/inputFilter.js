// 格式化输入框
const addListener = function(el, type, fn) {
  el.addEventListener(type, fn, false);
};

// 只能输入整数 - 给默认值
const intFilter = function(el) {
  addListener(el, 'keyup', () => {
    let value = el.value.replace(/\D/g, '');
    el.value = value ? (parseInt(value) < 1 ? 1 : parseInt(value)) : 1;
  });
};

// 只能输入整数 - 不给默认值
const intFilter2 = function(el, data) {
  addListener(el, 'change', () => {
    let key = data.key;
    let value = el.value.replace(/[^\d.]*/g, '');
    if (value < 1) value = 1;
    value = parseInt(value);
    el.value = value;
    data.row[key] = el.value;
  });
};

// 只能输入2位小数
const priceFilter = function(el, data) {
  addListener(el, 'change', () => {
    let key = data.key;
    let value = el.value.replace(/[^\d.]*/g, '');
    if (value < 0.01) value = 0.01;
    value = parseFloat(value).toFixed(2);
    el.value = value;
    data.row[key] = el.value;
  });
};

// 不能输入空格
const spaceFilter = function(el) {
  addListener(el, 'keyup', () => {
    el.value = el.value.replace(/\s+/, '');
  })
};


export default {
  bind(el, binding) {
    const {arg, value} = binding;
    if (el.tagName.toLowerCase() !== 'input') {
      el = el.getElementsByTagName('input')[0]
    }

    switch (arg) {
      case 'int':
        intFilter(el);
        break;
      case 'int2':
        intFilter2(el, value);
        break;
      case 'price':
        priceFilter(el, value);
        break;
      default:
        spaceFilter(el);
        break;
    }
  },
};
