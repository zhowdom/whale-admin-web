// 商品详情页头、页尾
const quillVer = `1.3.7`;
const templateStart = `<div class="ql-editor" id="editorWrapper">`;
const templateEnd = `</div>`;
export default {
  top: `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />
    <link href="https://cdn.bootcdn.net/ajax/libs/quill/${quillVer}/quill.bubble.min.css" rel="stylesheet">
    <link href="https://cdn.bootcdn.net/ajax/libs/quill/${quillVer}/quill.core.min.css" rel="stylesheet">
    <link href="https://cdn.bootcdn.net/ajax/libs/quill/${quillVer}/quill.snow.min.css" rel="stylesheet">
    <title>quill</title>
  </head>
  <body>
    ${templateStart}
  `,
  bottom: `
    ${templateEnd}
    <script>
      // 禁止缩放功能
      document.documentElement.addEventListener('touchstart', function (event) {
        if (event.touches.length > 1) {
          event.preventDefault();
        }
      }, {passive:false});
      // 禁止双击放大
      let lastTouchEnd = 0;
      document.documentElement.addEventListener('touchend', function (event) {
        var now = Date.now();
        if (now - lastTouchEnd <= 300) {
          event.preventDefault();
        }
        lastTouchEnd = now;
      }, {passive:false});
    </script>
  </body>
  </html>
  `,
  start: templateStart,
  end: templateEnd
}
