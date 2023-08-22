<template>
  <div class="editor" ref="editor" :style="styles"></div>
</template>

<script>
import Quill from "quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import {getCertificate, upload} from '@/api/oss';

export default {
  name: "Editor",
  props: {
    /* 编辑器的内容 */
    value: {
      type: String,
      default: "",
    },
    /* 高度 */
    height: {
      type: Number,
      default: null,
    },
    /* 最小高度 */
    minHeight: {
      type: Number,
      default: null,
    },
    // 是否使用自定义处理图片方式
    isHandleImg: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      curRoutePathName: '',
      Quill: null,
      currentValue: "",
      options: {
        theme: "snow",
        bounds: document.body,
        debug: "warn",
        modules: {
          // 工具栏配置
          toolbar: [
            ["bold", "italic", "underline", "strike"],       // 加粗 斜体 下划线 删除线
            ["blockquote", "code-block"],                    // 引用  代码块
            [{ list: "ordered" }, { list: "bullet" }],       // 有序、无序列表
            [{ indent: "-1" }, { indent: "+1" }],            // 缩进
            [{ size: ["small", false, "large", "huge"] }],   // 字体大小
            [{ header: [1, 2, 3, 4, 5, 6, false] }],         // 标题
            [{ color: [] }, { background: [] }],             // 字体颜色、字体背景颜色
            [{ align: [] }],                                 // 对齐方式
            ["clean"],                                       // 清除文本格式
            ["link", "image", "video"]                       // 链接、图片、视频
          ],
        },
        placeholder: "请输入内容",
        readOnly: false,
      },
      imgUploadConf: {
        size: 500,
        accept: 'image/png, image/gif, image/jpeg, image/bmp',
        typeArr: ['image/png', 'image/jpeg', 'image/gif', 'image/jpg', 'image/bmp'],
      },
    };
  },
  computed: {
    styles() {
      let style = {};
      if (this.minHeight) {
        style.minHeight = `${this.minHeight}px`;
      }
      if (this.height) {
        style.height = `${this.height}px`;
      }
      return style;
    },
  },
  watch: {
    value: {
      handler(val) {
        if (val !== this.currentValue) {
          this.currentValue = val === null ? "" : val;
          if (this.Quill) {
            this.Quill.pasteHTML(this.currentValue);
          }
        }
      },
      immediate: true,
    },
  },
  created () {
    this.curRoutePathName = this.$route.path
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.Quill = null;
  },
  methods: {
    init() {
      const editor = this.$refs.editor;
      this.Quill = new Quill(editor, this.options);
      this.Quill.disable();  // 初始化过程禁用默认选中防止滚动
      if (this.isHandleImg) this.customHandleImg();
      this.Quill.pasteHTML(this.currentValue);
      this.Quill.on("text-change", (delta, oldDelta, source) => {
        const html = this.$refs.editor.children[0].innerHTML;
        const text = this.Quill.getText();
        const quill = this.Quill;
        this.currentValue = html;
        this.$emit("input", html);
        this.$emit("on-change", { html, text, quill });
      });
      this.Quill.on("text-change", (delta, oldDelta, source) => {
        this.$emit("on-text-change", delta, oldDelta, source);
      });
      this.Quill.on("selection-change", (range, oldRange, source) => {
        this.$emit("on-selection-change", range, oldRange, source);
      });
      this.Quill.on("editor-change", (eventName, ...args) => {
        this.$emit("on-editor-change", eventName, ...args);
      });

      this.Quill.enable(); // 初始化结束启用输入
    },
    // 自定义处理图片
    customHandleImg () {
      //重写编辑器的图片预览方法
      let vm = this;
      let toolbar = this.Quill.getModule('toolbar');
      toolbar.addHandler('image', function () {
        let fileInput = this.container.querySelector('input.ql-image[type=file]');
        fileInput && this.container.removeChild(fileInput); // 重置fileInput

        if (fileInput == null) {
          fileInput = document.createElement('input');
          fileInput.setAttribute('type', 'file');
          fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp');
          fileInput.classList.add('ql-image');

          fileInput.addEventListener('change', function () {
            if (fileInput.files != null && fileInput.files[0] != null) {
              let file = fileInput.files[0];
              let isValid = vm.beforeUpload(file);
              if (isValid) vm.uploadRequset(file);
              console.log(fileInput.files[0]);
            }
          });

          this.container.appendChild(fileInput);
        };

        fileInput.click();
      });
    },
    // 上传前校验
    beforeUpload(file) {
      const isLt = file.size / 1024 < this.imgUploadConf.size;
      const isRightFormat = this.imgUploadConf.typeArr.includes(file.type);
      if (!isRightFormat) this.$message.error('上传图片只能是 JPG，PNG，GIF, BMP 格式!');
      if (!isLt) this.$message.error(`上传图片大小不能超过 ${this.imgUploadConf.size}KB!`);
      return isRightFormat && isLt;
    },
    // 发起图片上传请求
    async uploadRequset (file) {
      try {
        console.log(this.curRoutePathName)
        let _flag = (this.curRoutePathName === '/games/gameTemplate' || this.curRoutePathName === '/games/gameRule') ? 'blindBox' : 'product'
        console.log(_flag, '_flag_flag')
        let {data} = await getCertificate(_flag);
        const {res: {status, statusCode, requestUrls}} = await upload(data, file);
        if (status == 200 && statusCode == 200) {
          let range = this.Quill.getSelection(true);
          this.Quill.insertEmbed(range.index, 'image', requestUrls[0]);
          this.Quill.setSelection(range.index + 1);
          this.$message.success('图片上传成功！');
        } else {
          this.$message.error('图片上传失败');
        }
      } catch (e) {
        console.log(e)
      }
    },
  },
};
</script>

<style>
.editor, .ql-toolbar {
  white-space: pre-wrap!important;
  line-height: normal !important;
}
.quill-img {
  display: none;
}
.ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: "保存";
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "18px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "32px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "衬线字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  content: "等宽字体";
}
</style>
