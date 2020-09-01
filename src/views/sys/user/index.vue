<template>
  <div class="app-container">
    <el-form
      ref="queryForm"
      :model="pageRequest.params"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="pageRequest.params.username"
          placeholder="用户名"
          clearable
          style="width:90px;"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input
          v-model="pageRequest.params.nickname"
          placeholder="昵称"
          clearable
          style="width:90px;"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="身份证号" prop="idCard">
        <el-input
          v-model="pageRequest.params.idCard"
          placeholder="身份证号"
          clearable
          style="width:200px;"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select
          v-model="pageRequest.params.sex"
          placeholder="性别"
          clearable
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
        <treeselect
          v-model="pageRequest.params.deptId"
          name="deptSearch"
          placeholder="单位"
          :multiple="false"
          clearable
          :options="deptTreeData"
          :normalizer="deptNormalizer"
          style="width:180px;"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="pageRequest.params.status"
          placeholder="状态"
          clearable
          style="width:80px;"
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
          type="info"
          icon="el-icon-upload2"
          @click="handleImport"
        >
          {{ $t('table.import') }}
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
        style="width: 100%;margin-top: 1em;"
      >
        <el-table-column
          align="center"
          label="序号"
          type="index"
          width="80px"
        />
        <el-table-column
          align="center"
          label="用户名"
          prop="username"
        />
        <el-table-column
          align="center"
          label="昵称"
          prop="nickname"
        />
        <el-table-column
          align="center"
          label="性别"
          prop="sex"
          :formatter="sexFormat"
        />
        <el-table-column
          align="center"
          label="身份证号"
          prop="idCard"
        />
        <el-table-column
          align="center"
          label="出生日期"
        >
          <template #default="scope">
            {{ scope.row.birthday | parseTime('{y}-{m}-{d}') }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="单位"
          prop="deptName"
        />
        <el-table-column
          align="center"
          label="状态"
          prop="status"
          :formatter="statusFormat"
        />
        <el-table-column
          align="center"
          width="320"
          label="操作"
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-plus"
              @click="grantRole(scope)"
            >
              {{ $t('permission.grant') }}
            </el-button>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="handleEdit(scope)"
            >
              {{ $t('table.edit') }}
            </el-button>
            <el-button
              v-if="scope.row.id !== '1'"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope)"
            >
              {{ $t('table.delete') }}
            </el-button>
            <el-button
              size="mini"
              type="info"
              icon="el-icon-key"
              @click="handleResetPwd(scope)"
            >
              {{ $t('table.reset') }}
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
      :title="user.id ? '编辑':'添加'"
      width="750px"
      append-to-body
    >
      <el-form
        ref="user"
        :model="user"
        :rules="rules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model="user.username"
                placeholder="用户名"
                :disabled="user.id && user.id.length > 0"
                maxlength="20"
                minlength="5"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" />
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="昵称" prop="nickname">
              <el-input
                v-model="user.nickname"
                placeholder="昵称"
                maxlength="10"
                minlength="4"
              />
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
              <el-input
                v-model="user.idCard"
                placeholder="身份证号"
                maxlength="18"
                minlength="15"
              />
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
              <el-input
                v-model="user.email"
                placeholder="邮箱"
                maxlength="100"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="mobile">
              <el-input
                v-model="user.mobile"
                placeholder="手机号"
                maxlength="11"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单位" prop="deptId">
              <treeselect
                v-model="user.deptId"
                name="dept"
                placeholder="单位"
                clearable
                :options="deptTreeData"
                :normalizer="deptNormalizer"
                @select="selectDept"
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
import { getUserList, addUser, updateUser, delUser, resetUserPwd } from '@/api/sys/user'
import { getDeptList } from '@/api/sys/dept'
import { buildTree } from '@/utils/tree'
import Pagination from '@/components/Pagination'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
// 自定义校验
import { usernameValidator, nicknameValidator } from '@/validator/sys/user'
import { idCardValidator, emailValidator, mobileValidator } from '@/validator/common'

/** 用户默认值 */
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
  /** 注册组件 */
  components: { Pagination, Treeselect },
  data() {
    return {
      // 遮罩层
      listLoading: true,
      // 弹出层显示
      dialogVisible: false,
      // 分页请求
      pageRequest: {
        pageNum: 1,
        pageSize: 10,
        params: {}
      },
      // 用户列表
      list: [],
      // 总记录数
      total: 0,
      // 组织机构树
      deptTreeData: [],
      // 用户表单
      user: Object.assign({}, defaultUser),
      // 表单校验
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { validator: usernameValidator, trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { validator: nicknameValidator, trigger: 'blur' }
        ],
        idCard: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { validator: idCardValidator, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: emailValidator, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: mobileValidator, trigger: 'blur' }
        ],
        deptId: [
          { required: true, message: '请选择单位', trigger: 'blur' }
        ]
      },
      // 性别集合
      sexList: [
        { label: '男', value: 1 },
        { label: '女', value: 2 },
        { label: '其他', value: 3 }
      ],
      // 状态集合
      statusList: [
        { label: '正常', value: '1' },
        { label: '禁用', value: '2' }
      ],
      // 日期选项
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
    this.getDeptData()
  },
  methods: {
    /** 获取用户分页 */
    getPageList() {
      this.listLoading = true
      getUserList(this.pageRequest).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.pageRequest.pageNum = 1
      this.getPageList()
    },
    /** 重置查询 */
    resetQuery() {
      this.pageRequest.params = {}
      this.handleQuery()
    },
    /** 获取组织机构数 */
    async getDeptData() {
      this.deptTreeData = []
      getDeptList().then(response => {
        this.deptTreeData = buildTree(response.data || [])
      })
    },
    /** 关闭用户弹窗 */
    closeDialog() {
      this.dialogVisible = false
      this.user = Object.assign({}, defaultUser)
    },
    /** 新增 */
    handleAdd() {
      this.user = Object.assign({}, defaultUser)
      this.dialogVisible = true
    },
    /** 修改 */
    handleEdit(scope) {
      this.user = Object.assign({}, scope.row)
      this.dialogVisible = true
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
          this.handleQuery()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(err => { console.error(err) })
    },
    /** 重置密码按钮操作 */
    handleResetPwd(scope) {
      this.$prompt('请输入 "' + scope.row.username + '" 的新密码', '重置密码', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          resetUserPwd(scope.row.id, value)
            .then(data => {
              this.$notify({
                title: '成功',
                dangerouslyUseHTMLString: true,
                message: '修改成功，新密码是：' + value,
                type: 'success'
              })
            })
        })
        .catch(err => { console.error(err) })
    },
    /** 授权 */
    grantRole(scope) {
      // 路由跳转
      this.$router.push({
        path: '/sys/user/role',
        query: {
          id: scope.row.id,
          name: scope.row.username
        }
      })
    },
    /** 新增或者编辑时 保存 */
    async confirmHandle() {
      const isEdit = this.user.id && this.user.id.length > 0
      this.$refs['user']
        .validate((valid) => {
          if (valid) {
            if (isEdit) {
              updateUser(this.user)
                .then(data => {
                  this.closeDialog()
                  this.handleQuery()

                  this.$notify({
                    title: '成功',
                    dangerouslyUseHTMLString: true,
                    message: '更新成功',
                    type: 'success'
                  })
                })
            } else {
              addUser(this.user)
                .then(data => {
                  this.closeDialog()
                  this.handleQuery()

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
    /** 选择单位时更新 用户单位名称 */
    selectDept(data) {
      const { name } = data
      this.user.deptName = name
    },
    /** status 格式化 */
    statusFormat(row, column, cellValue, index) {
      const status = {}
      this.statusList.forEach((item) => {
        if (cellValue && item.value === cellValue) {
          Object.assign(status, item)
        }
      })
      return status.label
    },
    /** 性别格式化 */
    sexFormat(row, column, cellValue, index) {
      const sex = {}
      this.sexList.forEach((item) => {
        if (cellValue && item.value === cellValue) {
          Object.assign(sex, item)
        }
      })
      return sex.label
    },
    /** 处理树形数据 */
    deptNormalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    }
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 1em;
}
</style>
