<template>
  <div class="app-container">
    <div>
      <el-input v-model="pageRequest.params.name" placeholder="角色名称" style="width:100px;margin-left:1em;" />
      <el-input v-model="pageRequest.params.code" placeholder="角色编码" style="width:100px;margin-left:1em;" />
      <div class="btn-group">
        <el-button type="primary" @click="getPageList">
          {{ $t('table.search') }}
        </el-button>
        <el-button type="primary" @click="handleAdd">
          {{ $t('table.add') }}
        </el-button>
      </div>
    </div>

    <div class="table-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        stripe
        highlight-current-row
        current-row-key="id"
        style="width: 100%"
      >
        <el-table-column align="center" label="序号" type="index" width="80px" />
        <el-table-column align="center" label="主键" prop="id" />
        <el-table-column align="center" label="角色名称" prop="name" />
        <el-table-column align="center" label="角色编码" prop="code" />
        <el-table-column align="center" label="状态" prop="status" :formatter="statusFormat" />
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope)">
              {{ $t('table.edit') }}
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope)">
              {{ $t('table.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="pageRequest.current"
        :limit.sync="pageRequest.size"
        @pagination="getPageList"
      />
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType==='edit'?'编辑':'添加'"
    >
      <el-form ref="role" :model="role" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="role.name" placeholder="名称" />
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="role.code" placeholder="编码" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="role.status">
            <el-radio :label="'1'">正常</el-radio>
            <el-radio :label="'2'">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="confirmHandle">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList, add, update, del } from '@/api/sys/role'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const defaultRole = {
  id: '',
  name: '',
  code: '',
  status: '1'
}

export default {
  name: 'Role',
  components: { Pagination },
  data() {
    return {
      listLoading: true,
      dialogVisible: false,
      dialogType: 'new',
      pageRequest: {
        current: 1,
        size: 10,
        params: {
          name: '',
          code: ''
        }
      },
      list: [],
      total: 0,
      role: Object.assign({}, defaultRole),
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 5 到 20个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入角色编码', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 5 到 20个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getPageList()
  },
  methods: {
    getPageList() {
      this.listLoading = true
      getList(this.pageRequest).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleAdd() {
      this.role = Object.assign({}, defaultRole)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.role = Object.assign({}, scope.row)
    },
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
    async confirmHandle() {
      const isEdit = this.dialogType === 'edit'

      this.$refs['role'].validate((valid) => {
        console.log('valid,', valid)
        if (valid) {
          if (isEdit) {
            update(this.role).then(data => {
              this.dialogVisible = false
              this.getPageList()

              this.$notify({
                title: '成功',
                dangerouslyUseHTMLString: true,
                message: '更新成功',
                type: 'success'
              })
            })
          } else {
            add(this.role).then(data => {
              this.dialogVisible = false
              this.getPageList()

              this.$notify({
                title: '成功',
                dangerouslyUseHTMLString: true,
                message: '添加成功',
                type: 'success'
              })
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    statusFormat(row, column, cellValue, index) {
      const statusMap = {
        '1': '正常',
        '2': '禁用'
      }
      return statusMap[cellValue]
    }
  }
}
</script>

<style scoped>
.table-container {
  margin-top: 1em;
}
.btn-group {
  margin-left: 1em;
  display: inline;
}
</style>
