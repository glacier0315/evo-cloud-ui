<template>
  <div class="app-container">
    <el-form
      ref="queryForm"
      :model="pageRequest.params"
      :inline="true"
      label-width="90px"
    >
      <el-form-item label="数据源名称" prop="name">
        <el-input
          v-model="pageRequest.params.name"
          placeholder="数据源名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="handleQuery"
        >
          {{ $t('table.search') }}
        </el-button>
        <el-button
          icon="el-icon-refresh"
          @click="resetQuery"
        >
          {{ $t('table.reset') }}
        </el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handleAdd"
        >
          {{ $t('table.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          @click="handleExport"
        >
          {{ $t('table.export') }}
        </el-button>
      </el-col>
    </el-row>
    <div class="page-content">
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        stripe
        highlight-current-row
        current-row-key="id"
        style="width: 100%;"
      >
        <el-table-column
          align="center"
          label="序号"
          type="index"
          width="50"
        />
        <el-table-column
          align="center"
          label="数据源名称"
          prop="name"
        />
        <el-table-column
          align="center"
          label="URL"
          prop="code"
        />
        <el-table-column
          align="center"
          width="180"
          label="操作"
          class-name="small-padding fixed-width"
        >
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="handleEdit(scope)"
          >
            {{ $t('table.edit') }}
          </el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope)"
          >
            {{ $t('table.delete') }}
          </el-button>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="pageRequest.pageNum"
        :limit.sync="pageRequest.pageSize"
        @pagination="getPageList"
      />
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="form.id ? '编辑':'添加'"
      width="800px"
      append-to-body
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="名称"
          />
        </el-form-item>
        <el-form-item label="url" prop="url">
          <el-input
            v-model="form.url"
            placeholder="url"
          />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="form.username"
            placeholder="用户名"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="confirmHandle"
        >
          {{ $t('table.confirm') }}
        </el-button>
        <el-button
          @click="closeDialog"
        >
          {{ $t('table.cancel') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { findPage, save, del } from '@/api/gen/datasource'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

/** 角色默认值 */
const defaultForm = {
  id: '',
  name: '',
  url: '',
  username: '',
  password: ''
}
export default {
  name: 'Datasource',
  /** 注册组件 */
  components: { Pagination },
  data() {
    return {
      // 遮罩层
      listLoading: true,
      // 弹出层
      dialogVisible: false,
      // 分页请求
      pageRequest: {
        pageNum: 1,
        pageSize: 10,
        params: {}
      },
      // 列表集合
      list: [],
      // 总数
      total: 0,
      // 表单
      form: Object.assign({}, defaultForm),
      // 表单校验
      rules: {

      }
    }
  },
  created() {
    this.getPageList()
  },
  methods: {
    /** 获取分页列表 */
    getPageList() {
      this.listLoading = true
      findPage(this.pageRequest)
        .then(response => {
          this.list = response.data.list
          this.total = response.data.total
          this.listLoading = false
        })
    },
    /** 关闭弹出层 */
    closeDialog() {
      this.dialogVisible = false
      this.$refs['form'].resetFields()
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.pageRequest.pageNum = 1
      this.getPageList()
    },
    /** 重置查询 */
    resetQuery() {
      this.pageRequest.params = {}
      this.$refs['queryForm'].resetFields()
      this.handleQuery()
    },
    /** 新增 */
    handleAdd() {
      this.role = Object.assign({}, defaultForm)
      this.dialogVisible = true
    },
    /** 编辑 */
    handleEdit(scope) {
      this.role = Object.assign({}, scope.row)
      this.dialogVisible = true
    },
    /** 删除 */
    handleDelete({ $index, row }) {
      this.$confirm('确认删除当前角色?', 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '关闭',
        type: 'warning'
      })
        .then(async() => {
          await del(row.id)
          this.getPageList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(err => { console.error(err) })
    },
    // 提交表单
    async confirmHandle() {
      const isEdit = this.role.id

      this.$refs['form'].validate((valid) => {
        if (valid) {
          save(this.role).then(data => {
            this.dialogVisible = false
            this.getPageList()

            if (isEdit) {
              this.$notify({
                title: '成功',
                dangerouslyUseHTMLString: true,
                message: '更新成功',
                type: 'success'
              })
            } else {
              this.$notify({
                title: '成功',
                dangerouslyUseHTMLString: true,
                message: '添加成功',
                type: 'success'
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      // todo
      console.log('导出')
    }
  }
}
</script>

<style scoped>
.page-content {
  margin-top: 1em;
}
</style>
