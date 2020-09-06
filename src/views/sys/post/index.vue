<template>
  <div class="app-container">
    <el-form
      ref="queryForm"
      :model="pageRequest.params"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="岗位名称" prop="name">
        <el-input
          v-model="pageRequest.params.name"
          placeholder="岗位名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="岗位编码" prop="code">
        <el-input
          v-model="pageRequest.params.code"
          placeholder="岗位编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="pageRequest.params.status"
          placeholder="状态"
          clearable
        >
          <el-option
            :key="''"
            :label="'全部'"
            :value="null"
          />
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
    <div>
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
          label="岗位名称"
          prop="name"
        />
        <el-table-column
          align="center"
          label="岗位编码"
          prop="code"
        />
        <el-table-column
          align="center"
          label="状态"
          prop="status"
          :formatter="statusFormat"
        />
        <el-table-column
          align="center"
          label="排序号"
          prop="orderNum"
        />
        <el-table-column
          align="center"
          width="240"
          label="操作"
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
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
          </template>
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
      :title="post.id ? '编辑':'添加'"
      width="800px"
      append-to-body
    >
      <el-form
        ref="post"
        :model="post"
        :rules="rules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input
                v-model="post.name"
                placeholder="名称"
                maxlength="10"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编码" prop="code">
              <el-input
                v-model="post.code"
                placeholder="编码"
                maxlength="20"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="post.status">
                <el-radio
                  v-for="(item, index) in statusList"
                  :key="'status_'+ index"
                  :label="item.value"
                >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序号" prop="orderNum">
              <el-input-number
                v-model="post.orderNum"
                :min="1"
                :step="1"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="描述" prop="description">
              <el-input
                v-model="post.description"
                type="textarea"
                placeholder="描述"
                maxlength="500"
              />
            </el-form-item>
          </el-col>
        </el-row>
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
import { getPostPageList, savePost, delPost, checkCode } from '@/api/sys/post'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

/** 岗位默认值 */
const defaultPost = {
  id: '',
  name: '',
  code: '',
  status: 1,
  orderNum: 0,
  description: ''
}

export default {
  name: 'Post',
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
      post: Object.assign({}, defaultPost),
      // 表单校验
      rules: {
        name: [
          { required: true, message: '请输入岗位名称', trigger: 'blur' },
          {
            pattern: /^(?!_)(?!.*?_$)[\u4e00-\u9fa5_a-zA-Z0-9_]{2,10}$/,
            message: '岗位名称不合法，长度是2到10位，支持(中文，字母，数字，下划线)，不能以下划线开头结尾',
            trigger: 'blur'
          }
        ],
        code: [
          { required: true, message: '请输入岗位编码', trigger: 'blur' },
          {
            pattern: /^(?!_)(?!.*?_$)[a-zA-Z0-9_]{3,20}$/,
            message: '岗位编码不合法，长度是3到20位，支持(字母，数字，下划线)，不能以下划线开头结尾',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              const data = {
                id: this.post.id,
                code: value
              }
              let exist = false
              checkCode(data)
                .then((response) => {
                  exist = response.data
                })
                .catch(err => {
                  console.error(err)
                })
              setTimeout(() => {
                if (exist) {
                  callback(new Error('编码已存在!'))
                  return
                }
                callback()
              }, 1000)
            },
            trigger: 'blur'
          }
        ]
      },
      // 状态集合
      statusList: [
        { label: '正常', value: 1 },
        { label: '禁用', value: 2 }
      ]
    }
  },
  created() {
    this.getPageList()
  },
  methods: {
    /** 获取分页列表 */
    getPageList() {
      this.listLoading = true
      getPostPageList(this.pageRequest).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    /** 关闭弹出层 */
    closeDialog() {
      this.dialogVisible = false
      this.$refs['post'].resetFields()
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
      this.post = Object.assign({}, defaultPost)
      this.dialogVisible = true
    },
    /** 编辑 */
    handleEdit(scope) {
      this.post = Object.assign({}, scope.row)
      this.dialogVisible = true
    },
    /** 删除 */
    handleDelete({ $index, row }) {
      this.$confirm('确认删除当前岗位?', 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '关闭',
        type: 'warning'
      })
        .then(async() => {
          await delPost(row.id)
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
      const isEdit = this.post.id && this.post.id.length > 0
      this.$refs['post'].validate((valid) => {
        if (valid) {
          savePost(this.post).then(data => {
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
    },
    /** 状态格式化 */
    statusFormat(row, column, cellValue, index) {
      const status = {}
      this.statusList.forEach((item) => {
        if (cellValue && item.value === cellValue) {
          Object.assign(status, item)
          return
        }
      })
      return status.label
    }
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 1em;
}
</style>
