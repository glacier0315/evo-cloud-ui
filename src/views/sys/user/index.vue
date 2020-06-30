<template>
  <div class="app-container">
    <div>
      <el-input v-model="pageRequest.params.username" placeholder="用户名" style="width:100px;margin-left:1em;" />
      <el-input v-model="pageRequest.params.nickname" placeholder="昵称" style="width:100px;margin-left:1em;" />
      <el-input v-model="pageRequest.params.idCard" placeholder="身份证号" style="width:200px;margin-left:1em;" />
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
        <el-table-column align="center" label="用户名" prop="username" />
        <el-table-column align="center" label="昵称" prop="nickname" />
        <el-table-column align="center" label="性别" prop="sex" :formatter="sexFormat" />
        <el-table-column align="center" label="身份证号" prop="idCard" />
        <el-table-column align="center" label="出生日期">
          <template slot-scope="scope">
            <span>{{ scope.row.birthday | parseTime('{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="单位" prop="deptId" />
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
      <el-form ref="user" :model="user" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username" placeholder="用户名" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="user.nickname" placeholder="昵称" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="user.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
            <el-radio :label="3">其他</el-radio>
          </el-radio-group>
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
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="user.email" placeholder="邮箱" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="user.mobile" placeholder="手机号" />
        </el-form-item>
        <el-form-item label="单位id" prop="deptId">
          <el-input v-model="user.deptId" placeholder="单位id" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="user.status">
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
import { getList, add, update, del } from '@/api/sys/user'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const defaultUser = {
  id: null,
  username: '',
  nickname: '',
  sex: 1,
  idCard: '',
  birthday: null,
  status: '1',
  email: null,
  mobile: null,
  deptId: null
}

export default {
  name: 'User',
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
          username: null
        }
      },
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
    handleAdd() {
      this.user = Object.assign({}, defaultUser)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
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
    async confirmHandle() {
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
                message: '更新成功',
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
    },
    sexFormat(row, column, cellValue, index) {
      const sexMap = {
        '1': '男',
        '2': '女',
        '3': '其他'
      }
      return sexMap[cellValue]
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
