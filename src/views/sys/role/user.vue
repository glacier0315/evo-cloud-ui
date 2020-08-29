<template>
  <div class="app-container">
    <el-page-header
      :content="'当前角色 [' + roleName + '] '"
      @back="goBack"
    />
    <userList
      ref="userList"
      :dept-data="deptTreeData"
      :default-params="{ roleId: roleId }"
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
      </template>

      <template #operation="scope">
        <el-button
          v-if="scope.row.id !== '1' "
          size="mini"
          type="danger"
          icon="el-icon-delete"
          @click="handleDelete(scope)"
        >
          {{ $t('table.delete') }}
        </el-button>
      </template>
    </userList>

    <el-dialog
      :visible.sync="dialogVisible"
      title="添加用户"
      width="80%"
      center
    >
      <userSearchList
        ref="userAddList"
        :multiple-selected="true"
        :dept-data="deptTreeData"
      >
        <template #operation="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="handleAddUser(scope)"
          >
            {{ $t('table.confirm') }}
          </el-button>
        </template>
      </userSearchList>

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
import { delUserRole, addUserRole } from '@/api/sys/role'
import { getDeptList } from '@/api/sys/dept'
import { buildTree } from '@/utils/tree'
import UserList from '@/views/sys/user/components/UserList'
import UserSearchList from '@/views/sys/user/components/UserSearchList'

export default {
  name: 'UserRole',
  /** 注册组件 */
  components: { UserList, UserSearchList },
  data() {
    return {
      // 角色id，从路由中获取
      roleId: this.$route.query.id,
      // 角色名称，从路由中获取
      roleName: this.$route.query.name,
      // 弹出层显示
      dialogVisible: false,
      // 组织机构树
      deptTreeData: []
    }
  },
  watch: {

  },
  created() {
    this.getDeptData()
  },
  methods: {
    // 刷新拥有角色用户列表
    reloadUserList() {
      // 调用子组件查询方法刷新
      this.$refs.userList.handleQuery()
    },
    // 重置待添加角色列表
    resetUserAddList() {
      // 重置子组件
      this.$refs.userAddList.resetQuery()
    },
    /** 获取组织机构数 */
    async getDeptData() {
      this.deptTreeData = []
      getDeptList().then(response => {
        this.deptTreeData = buildTree(response.data)
      })
    },
    /** 新增 */
    handleAdd() {
      this.dialogVisible = true
    },
    /** 删除 */
    handleDelete({ $index, row }) {
      this.$confirm('确认移除当前用户?', 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '关闭',
        type: 'warning'
      })
        .then(async() => {
          const data = {
            roleId: this.roleId,
            userIds: [row.id]
          }
          await delUserRole(data)
          this.reloadUserList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(err => { console.error(err) })
    },
    /** 返回 */
    goBack() {
      // 路由跳转
      this.$router.push({
        path: '/sys/role'
      })
    },
    /** 关闭用户弹窗 */
    closeDialog() {
      this.dialogVisible = false
      // 重置子组件
      this.resetUserAddList()
    },
    /** 添加用户 */
    handleAddUser(scope) {
      // 保存用户角色关系
      const data = {
        roleId: this.roleId,
        userIds: [scope.row.id]
      }
      console.log('data ', data)
      addUserRole(data)
        .then(async() => {
          this.closeDialog()
          // 刷新
          this.reloadUserList()
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
        })
        .catch(err => { console.error(err) })
    },
    /** 新增或者编辑时 保存 */
    async confirmHandle() {
      // 调用子组件方法获取选择的用户
      const users = this.$refs.userAddList.getMultipleSelection()
      console.log('users ', users)
      // 保存用户角色关系
      if (users &&
      users instanceof Array &&
      users.length > 0) {
        const userIds = users.map(u => u.id)
        const data = {
          roleId: this.roleId,
          userIds: userIds
        }
        console.log('data ', data)
        addUserRole(data)
          .then(async() => {
            this.closeDialog()
            // 刷新
            this.reloadUserList()
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
          })
          .catch(err => { console.error(err) })
      } else {
        this.$message({
          type: 'warning',
          message: '请选择要授权用户!'
        })
      }
    }
  }
}
</script>
<style scoped>

</style>
