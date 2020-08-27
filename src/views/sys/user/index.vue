<template>
  <div class="app-container">
    <el-form ref="userSearch" :model="pageRequest.params" :inline="true" label-width="68px">
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="pageRequest.params.username"
          placeholder="请输入用户名称"
          clearable
          size="small"
          style="width:140px;"
          @keyup.enter.native="getPageList"
        />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input
          v-model="pageRequest.params.nickname"
          placeholder="请输入昵称"
          clearable
          size="small"
          style="width:140px;"
          @keyup.enter.native="getPageList"
        />
      </el-form-item>
      <el-form-item label="身份证号" prop="idCard">
        <el-input
          v-model="pageRequest.params.idCard"
          placeholder="请输入身份证号"
          clearable
          size="small"
          style="width:200px;"
          @keyup.enter.native="getPageList"
        />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select
          v-model="pageRequest.params.sex"
          placeholder="性别"
          clearable
          size="small"
          style="width:80px;"
        >
          <el-option
            v-for="item in sexList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="单位" prop="deptId">
        <tree-select
          v-model="pageRequest.params.deptId"
          :options="deptTreeData"
          @selected="selectedSearch"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="pageRequest.params.status"
          style="width:80px;"
          placeholder="状态"
          clearable
          size="small"
        >
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
          size="mini"
          @click="handleQuery"
        >
          {{ $t('table.search') }}
        </el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
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
          size="mini"
          @click="handleAdd"
        >
          {{ $t('table.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
        >
          {{ $t('table.import') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
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
        style="width: 100%"
      >
        <el-table-column align="center" label="序号" type="index" width="80px" />
        <el-table-column align="center" label="用户名" prop="username" />
        <el-table-column align="center" label="昵称" prop="nickname" />
        <el-table-column align="center" label="性别" prop="sex" :formatter="sexFormat" />
        <el-table-column align="center" label="身份证号" prop="idCard" />
        <el-table-column align="center" label="出生日期">
          <template slot-scope="scope">
            <span>{{ scope.row.birthday | parseTime('{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="单位" prop="deptName" />
        <el-table-column align="center" label="状态" prop="status" :formatter="statusFormat" />
        <el-table-column
          align="center"
          width="240"
          label="操作"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="handleEdit(scope)"
            >
              {{ $t('table.edit') }}
            </el-button>
            <el-button
              v-if="scope.row.id !== 1"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope)"
            >
              {{ $t('table.delete') }}
            </el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-key"
              @click="handleResetPwd(scope.row)"
            >{{ $t('table.reset') }}</el-button>
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
      :title="dialogType==='edit'?'编辑':'添加'"
      width="750px"
      append-to-body
    >
      <el-form ref="user" :model="user" :rules="rules" label-width="80px">
        <el-row v-if="user.id == undefined || user.id == null">
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="user.username" placeholder="用户名" maxlength="20" minlength="5" />
            </el-form-item>
          </el-col>
          <el-col :span="12" />
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="user.nickname" placeholder="昵称" maxlength="10" minlength="4" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="user.sex">
                <el-radio
                  v-for="(item,index) in sexList"
                  :key="index"
                  :label="item.value"
                >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="user.idCard" placeholder="身份证号" maxlength="18" minlength="15" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期" prop="birthday">
              <el-date-picker
                v-model="user.birthday"
                align="right"
                type="date"
                placeholder="出生日期"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="user.email" placeholder="邮箱" maxlength="100" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="user.mobile" placeholder="手机号" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单位">
              <tree-select
                v-model="user.deptId"
                :options="deptTreeData"
                @selected="selected"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="user.status">
                <el-radio
                  v-for="(item,index) in statusList"
                  :key="index"
                  :label="item.value"
                >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" size="small" @click="closeDialog">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" size="small" @click="confirmHandle">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, addUser, updateUser, delUser, resetUserPwd } from '@/api/sys/user'
import { getDeptList } from '@/api/sys/dept'
import { buildTree } from '@/utils/tree'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import TreeSelect from '@/components/TreeSelect'

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
  deptId: null,
  deptName: null
}

export default {
  name: 'User',
  components: { Pagination, TreeSelect },
  data() {
    return {
      listLoading: true,
      dialogVisible: false,
      dialogType: 'new',
      pageRequest: {
        pageNum: 1,
        pageSize: 10,
        params: {
          username: null
        }
      },
      list: [],
      total: 0,
      deptTreeData: [],
      user: Object.assign({}, defaultUser),
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            pattern: /^(?!_)(?!.*?_$)[a-zA-Z0-9_]{5,20}$/,
            message: '用户名不合法，长度是5到20位，支持(字母，数字，下划线)，不能以下划线开头结尾',
            trigger: 'blur'
          }
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          {
            pattern: /^(?!_)(?!.*?_$)[\u4e00-\u9fa5_a-zA-Z0-9_]{4,10}$/,
            message: '昵称不合法，长度是4到10位，支持(中文，字母，数字，下划线)，不能以下划线开头结尾',
            trigger: 'blur'
          }
        ],
        idCard: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          {
            pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
            message: '请输入正确的身份证号，长度18位',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: '请输入正确的邮箱',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/,
            message: '请输入正确的手机号，长度11位',
            trigger: 'blur'
          }
        ],
        deptId: [
          { required: true, message: '请选择单位', trigger: 'blur' }
        ]
      },
      sexList: [
        { label: '男', value: 1 },
        { label: '女', value: 2 },
        { label: '其他', value: 3 }
      ],
      statusList: [
        { label: '正常', value: '1' },
        { label: '禁用', value: '2' }
      ],
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
    this.handleQuery()
    this.getDeptTree()
  },
  methods: {
    getPageList() {
      this.listLoading = true
      getUserList(this.pageRequest).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    async getDeptTree() {
      this.deptTreeData = []
      getDeptList().then(response => {
        this.deptTreeData = buildTree(response.data)
      })
    },
    closeDialog() {
      this.dialogVisible = false
      this.$refs['user'].resetFields()
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.pageRequest.pageNum = 1
      this.getPageList()
    },
    /** 重置查询 */
    resetQuery() {
      this.pageRequest.params = {}
      this.$refs['userSearch'].resetFields()
      this.handleQuery()
    },
    /** 新增 */
    handleAdd() {
      this.user = Object.assign({}, defaultUser)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    /** 修改 */
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.user = Object.assign({}, scope.row)
    },
    /** 删除 */
    handleDelete({ $index, row }) {
      this.$confirm('确认删除当前用户?', 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '关闭',
        type: 'warning'
      })
        .then(async() => {
          await delUser(row.id)
          this.getPageList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(err => { console.error(err) })
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.username + '"的新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        resetUserPwd(row.id, value).then(data => {
          this.$notify({
            title: '成功',
            dangerouslyUseHTMLString: true,
            message: '修改成功，新密码是：' + value,
            type: 'success'
          })
        })
      }).catch(() => {})
    },
    /** 新增或者编辑时 保存 */
    async confirmHandle() {
      const isEdit = this.dialogType === 'edit'
      console.log('this.user', this.user)
      this.$refs['user'].validate((valid) => {
        if (valid) {
          if (isEdit) {
            updateUser(this.user).then(data => {
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
            addUser(this.user).then(data => {
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
    /** 导出按钮操作 */
    handleExport() {
      // todo
      console.log('导出')
    },
    /** 导入按钮操作 */
    handleImport() {
      // todo
      console.log('导入')
    },
    selected(data) {
      const { id, name } = data
      this.user.deptId = id
      this.user.deptName = name
    },
    selectedSearch(data) {
      const { id, name } = data
      this.pageRequest.params.deptId = id
      this.pageRequest.params.deptName = name
    },
    statusFormat(row, column, cellValue, index) {
      const status = {}
      this.statusList.forEach((item) => {
        if (cellValue && item.value === cellValue) {
          Object.assign(status, item)
        }
      })
      return status.label
    },
    sexFormat(row, column, cellValue, index) {
      const sex = {}
      this.sexList.forEach((item) => {
        if (cellValue && item.value === cellValue) {
          Object.assign(sex, item)
        }
      })
      return sex.label
    }
  }
}
</script>

<style scoped>
.btn-group {
  margin-left: 1em;
  display: inline;
}
.el-row {
  margin-bottom: 1em;
}
</style>
