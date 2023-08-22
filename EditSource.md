##Quill源码修改##
修复：工具栏缩紧按钮设置无效

源码改动：
/node_modules/quill/dist/quill.js

indent: function indent(value) {
  var range = this.quill.getSelection();
  var formats = this.quill.getFormat(range);
  var indent = parseInt(formats.indent || 0);
  if (value === '+1' || value === '-1') {
    var modifier = value === '+1' ? 1 : -1;
    if (formats.direction === 'rtl') modifier *= -1;
    this.quill.format('indent', indent + modifier, _quill2.default.sources.USER);
    const _insertContent = value === '+1' ? '\xa0' : ''
    var delta = new _quillDelta2.default().retain(range.index).delete(range.length).insert(_insertContent);
    this.quill.updateContents(delta, _quill2.default.sources.USER);
    if (value === '-1') {
      try {
        this.quill.deleteText(range.index - 1, 1, _quill2.default.sources.USER);
      } catch (e) {
        console.warn(e)
      }
    }
  }
},