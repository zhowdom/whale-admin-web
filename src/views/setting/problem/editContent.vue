<template>
  <div class="tab-content cont_Wrapper">
    <!--table-->
    <el-table
    :data="tableData"
    v-loading="loading"
    class="tab-contentbox"
    style="width: 100%">
      <el-table-column prop="title" label="菜单名称" align="center" min-width="120"></el-table-column>
      <el-table-column prop="detailUrl" label="内容" align="center" min-width="160">
        <template scope="scope">
          <div class="showcont" v-html="scope.row.detailUrl"></div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="220">
        <template scope="scope">
          <el-button v-hasPermi="['setting:problem_manual_content:update']" type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--table-->
    <el-pagination
    style="float:right;padding-top:20px;"
    @current-change="search"
    :page-sizes="[10, 20, 30]"
    @size-change="handleSizeChange"
    :current-page.sync="pageIndex"
    :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="totalPage">
    </el-pagination>
    <!--项目详情dialog-->
    <el-dialog custom-class="certifyForm" title="项目详情" :visible.sync="projectVisible" :width="'800px'">
      <el-form :model="bruleForm" :inline="true">
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="bruleForm.title" clearable placeholder="请输入" disabled></el-input>
        </el-form-item>
      </el-form>
      <div class="mb15">
        <span class="text-muted pl10">详情页单张图片大小建议不超过500kb</span>
      </div>
      <div>
        <qu-editor v-model="bruleForm.detailUrl" :min-height="192" ref="quEditorRef" :is-handle-img="true" disabled/>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleEditProject()">编 辑</el-button>
        <el-button type="primary" @click="submitProjectForm()" :loading="editLoading">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import filterXSS from 'xss';
import _html from '@/utils/stHtml';
import {getCertificate, upload} from '@/api/oss';
import { manualContentPage, editManualContent } from "@/api/setting/problem.js";
export default {
  components: {
    QuEditor: () => import('@/components/Editor')
  },
  data() {
    return {
      loading: false,
      certifyform: {
        position: '',
        name: '',
        id: '',
      },
      rules: {
        position: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
      },
      formLabelWidth: '130px',
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      tableData: [],
      bruleForm: {detailUrl: '', id: '', title: ''},
      projectVisible: false,
      editLoading: false,
    }
  },
  activated() {
    this.search();
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.search()
    },
    // 数据查询
    search (pgi) {
      if (pgi) this.pageIndex = pgi
      let _params = {
        currentPage: this.pageIndex,
        pageSize: this.pageSize,
      }
      this.loading = true
      manualContentPage(_params).then(response => {
        if (response.code === 200) {
          this.tableData = JSON.parse(JSON.stringify(response.data.list));
          this.totalPage = response.data.total
          this.loading = false
        } else {
          this.tableData = []
          this.totalPage = 0
          this.pageSize = 10
          this.loading = false
          this.$message.error(response.message)
        }
      })
    },
    handleEdit(row) {
      this.bruleForm = Object.assign({}, row);
      this.$nextTick(() => {
        this.$refs.quEditorRef.Quill.enable(false);
      })
      this.projectVisible = true;
    },
    handleEditProject() {
      this.$refs.quEditorRef.Quill.enable();
    },
    // 向您搭建的STS服务获取临时访问凭证
    async getCertificateRequest () {
      try {
        const {code, data, message} = await getCertificate('product');
        if (code == 200) {
          return data;
        } else {
          this.$message.error(message);
        };
      } catch (error) {
        // ...
      }
    },
    async handleDescription () {
      const {top, bottom} = _html;
      const _xssDesc = filterXSS(this.bruleForm.detailUrl); // xss 转化
      const description = top + _xssDesc + bottom;

      const certificates = await this.getCertificateRequest();
      const {res: {status, statusCode, requestUrls}} = await upload(certificates, description, 'content');
      if (status == 200 && statusCode == 200) {
        return requestUrls[0];
      } else {
        this.$message.error('内容转化url错误');
      };
    },
    async submitProjectForm() {
      // let _descHtmlUrl = await this.handleDescription();
      let _params = {
        // detailUrl: _descHtmlUrl,// 传url
        detailUrl: this.bruleForm.detailUrl,
        id: this.bruleForm.id,
      }
      if(_params.detailUrl == null ||_params.detailUrl == undefined || _params.detailUrl == '') {
        this.$message.error('请填写内容')
        return;
      }
      this.editLoading = true;
      editManualContent(_params).then(response => {
        if (response.code === 200) {
          this.msgSuccess(`保存成功`)
          this.editLoading = false;
          this.projectVisible = false;
          this.search(this.pageIndex);
        } else {
          this.msgSuccess(response.message)
          this.editLoading = false;
          this.projectVisible = false;
        }
      })
    },
  }
}
</script>

<style lang="scss">
.tab-content{
  .certifyForm form{
    padding-right:40px;
    .el-select, .el-date-editor{
      width: 100%;
    }
  }
  .el-form-item__content{
    position: relative;
  }
  .showcont{
    img{
      width: 5px;
      height: 1px;
      vertical-align: middle;
      margin: 0 5px
    }
  }
}
</style>