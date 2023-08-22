<template>
  <div class="pure-search">
    <div class="input-tips">{{label}}</div>
    <el-input class="searchClass" :style="{width: `${width}px`, '--wd': width}" @keypress.native.enter="searchHandle" :size="size" :placeholder="placeholder" v-model="searchString">
      <i slot="suffix" class="el-input__icon el-icon-search" @click="searchHandle"></i>
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'PureSearch',
  props: {
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    size: {
      type: String,
      default: 'medium', // medium / small / mini / large
    },
    width: {
      type: Number,
      default: 220,
    },
  },
  data () {
    return {
      searchString: '',
    }
  },
  mounted () {
  },
  methods: {
    // 搜索功能 - 对外提供
    searchHandle () {
      this.$emit('search', this.searchString);
    }
  }
}
</script>

<style lang="scss" scoped>
  .pure-search {
    .searchClass {
      width: auto;
      transition: 0.4s;
      border-radius: 4px;
      border: 1px solid #DCDFE6;
      ::v-deep {
        .el-input__inner {
          border: none;
          &:focus {
            border: none;
          }
        }
        .el-input__suffix {
          i[class^='el-input'] {
            cursor: pointer;
            font-size: 17px;
          }
          &:hover {
            color: #1890ff;
          }
        }
      }
      &:hover {
        border-color: #1890ff;
        width: calc(var(--wd) * 1px + 60px) !important;
      }
    }
    .input-tips {
      color: #9ca7b5;
      display: inline-block;
      margin-right: 5px;
      font-size: 14px;
    }
  }
</style>
