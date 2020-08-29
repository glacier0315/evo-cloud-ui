<template>
  <div class="app-container">
    <userList
      ref="userList"
      :id-card-visible="true"
      :dept-data="deptTreeData"
      :operation-width="240"
    >
      <template v-slot:handle>
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
      </template>

      <template #operation="scope">
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
    </userList>

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
                :multiple="false"
                :clearable="true"
                :options="deptTreeData"
                :normalizer="normalizer"
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
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色" prop="roleIds">
              <treeselect
                v-model="user.roleIds"
                name="role"
                :multiple="true"
                :clearable="true"
                :options="roleData"
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
import { addUser, updateUser, delUser, resetUserPwd } from '@/api/sys/user'
import { getDeptList } from '@/api/sys/dept'
import { getRoleList, getRoleByUser } from '@/api/sys/role'
import { buildTree } from '@/utils/tree'
import UserList from './components/UserList'
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
  deptName: null,
  roleIds: []
}

export default {
  name: 'User',
  /** 注册组件 */
  components: { Treeselect, UserList },
  data() {
    return {
      // 弹出层显示
      dialogVisible: false,
      // 组织机构树
      deptTreeData: [],
      // 角色列表
      roleData: [],
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
    this.getDeptData()
    this.getRoleData()
  },
  methods: {
    reloadUserList() {
      // 调用子组件查询方法刷新
      this.$refs.userList.handleQuery()
    },
    /** 获取角色列表 */
    async getRoleData() {
      this.roleData = []
      getRoleList().then(response => {
        const roles = response.data || []
        this.roleData = roles.map(u => {
          // 添加label，便于树形结构
          u.label = u.name
          u.children = undefined
          return u
        })
      })
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
      this.$refs['user'].resetFields()
    },
    /** 新增 */
    handleAdd() {
      this.user = Object.assign({}, defaultUser)
      this.dialogVisible = true
    },
    /** 修改 */
    handleEdit(scope) {
      this.user = Object.assign({}, scope.row)
      getRoleByUser(this.user.id)
        .then(response => {
          const roles = response.data || []
          this.user.roleIds = roles.map(u => u.id)
        })
        .catch(err => { console.error(err) })
      console.log('this.user ', this.user)
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
          this.reloadUserList()
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
      const isEdit = this.user.id && this.user.id.length > 0
      console.log('isEdit ', isEdit)
      this.$refs['user'].validate((valid) => {
        console.log('valid ', valid)
        if (valid) {
          if (isEdit) {
            updateUser(this.user).then(data => {
              this.dialogVisible = false
              this.reloadUserList()

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
              this.reloadUserList()

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
    /** 处理树形数据 */
    normalizer(node) {
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
