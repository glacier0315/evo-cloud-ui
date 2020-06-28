<template>
  <div class="app-container">
    <div>
      <el-button type="primary" @click="handleAddUser">
        {{ $t('table.add') }}
      </el-button>
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
        <el-table-column align="center" label="id" prop="id" />
        <el-table-column align="center" label="username" prop="username" />
        <el-table-column align="center" label="nickname" prop="nickname" />
        <el-table-column align="center" label="idCard" prop="idCard" />
        <el-table-column align="center" label="status" prop="status" :formatter="statusFormatter" />

        <el-table-column align="center" label="birthday">
          <template slot-scope="scope">
            <span>{{ scope.row.birthday | parseTime('{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Operations">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleEditUser(scope)">
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
      <el-form ref="user" :model="user" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username" placeholder="用户名" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="user.nickname" placeholder="昵称" />
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="user.idCard" placeholder="身份证号" />
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker
            v-model="user.birthday"
            align="right"
            type="date"
            placeholder="出生日期"
            :picker-options="pickerOptions"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="confirmUser">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList, add, update, del } from '@/api/sys/user'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const defaultUser = {
  id: null,
  username: '',
  nickname: '',
  idCard: '',
  birthday: null
}

export default {
  name: 'User',
  components: { Pagination },
  data() {
    return {
      listLoading: true,
      dialogVisible: false,
      dialogType: 'new',
      pageRequest: { current: 1, size: 10 },
      list: [],
      total: 0,
      user: Object.assign({}, defaultUser),
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 5 到 20个字符', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 5 到 20个字符', trigger: 'blur' }
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }]
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
    handleAddUser() {
      this.user = Object.assign({}, defaultUser)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEditUser(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.user = Object.assign({}, scope.row)
    },
    handleDelete({ $index, row }) {
      this.$confirm('确认删除当前用户?', 'Warning', {
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
    async confirmUser() {
      const isEdit = this.dialogType === 'edit'

      this.$refs['user'].validate((valid) => {
        console.log('valid,', valid)
        if (valid) {
          if (isEdit) {
            update(this.user).then(data => {
              this.dialogVisible = false
              this.getPageList()

              this.$notify({
                title: '成功',
                dangerouslyUseHTMLString: true,
                message: '操作成功',
                type: 'success'
              })
            })
          } else {
            add(this.user).then(data => {
              this.dialogVisible = false
              this.getPageList()

              this.$notify({
                title: '成功',
                dangerouslyUseHTMLString: true,
                message: '操作成功',
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
    statusFormatter(row, column, cellValue, index) {
      const statusMap = {
        '1': '正常',
        '0': '禁用'
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
</style>
