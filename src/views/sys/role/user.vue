<template>
  <div class="app-container">
    <el-page-header
      :content="'当前角色 [' + roleName + '] '"
      @back="goBack"
    />
    <user-list
      ref="userList"
      :multiple-selected="true"
      :dept-data="deptTreeData"
      :default-params="{roleId: roleId}"
      :selectable-callback="selectable"
      @handleSelected="removeUser"
      @handleSingleSelected="singleRemoveUser"
    >
      <template v-slot:toolbars>
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
            type="danger"
            icon="el-icon-delete"
            :disabled="delUserIds.length <= 0"
            @click="handleDelete"
          >
            {{ $t('table.remove') }}
          </el-button>
        </el-col>
      </template>
      <template v-slot:row-btns="scope">
        <el-button
          type="danger"
          size="mini"
          icon="el-icon-delete"
          :disabled="(roleId === '1' && scope.row.id === '1')"
          @click="singleRemoveUser([scope.row])"
        >
          {{ $t('table.remove') }}
        </el-button>
      </template>
    </user-list>

    <el-dialog
      :visible.sync="dialogVisible"
      title="添加用户"
      width="70%"
      top="10vh"
    >
      <user-list
        ref="userAddList"
        :multiple-selected="true"
        :dept-data="deptTreeData"
        :default-params="{notEqRoleId: roleId, status: '1'}"
        @handleSelected="addUser"
        @handleSingleSelected="singleAddUser"
      >
        <template v-slot:queryParams>
          <el-form-item />
        </template>
      </user-list>

      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :disabled="addUserIds.length <= 0"
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
import { addUserRole, deleteUserRole } from '@/api/sys/userRole'
import { getDeptList } from '@/api/sys/dept'
import { buildTree } from '@/utils/tree'

import UserList from '@/views/sys/user/components/UserList'

export default {
  name: 'RoleUser',
  /** 注册组件 */
  components: { UserList },
  data() {
    return {
      // 弹出层显示
      dialogVisible: false,
      // 角色id，从路由中获取
      roleId: this.$route.query.id,
      // 角色名称，从路由中获取
      roleName: this.$route.query.name,
      // 待移除用户
      delUserIds: [],
      // 待添加用户
      addUserIds: [],
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
    /** 返回 */
    goBack() {
      // 路由跳转
      this.$router.push({
        path: '/sys/role'
      })
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
      // 初始化 userAddList
      this.handleRefresh2()
    },
    /** 删除 */
    handleDelete() {
      this.$confirm('确认移除当前选中用户?', '确认', {
        confirmButtonText: '确认',
        cancelButtonText: '关闭',
        type: 'warning'
      })
        .then(async() => {
          const data = {
            roleId: this.roleId,
            userIds: this.delUserIds
          }
          await deleteUserRole(data)
          this.handleRefresh1()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(err => { console.error(err) })
    },
    /** 关闭用户弹窗 */
    closeDialog() {
      this.dialogVisible = false
      // 清空添加的元素
      this.addUserIds = []
    },
    /** 新增或者编辑时 保存 */
    async confirmHandle() {
      this.$confirm('确认将角色[ ' + this.roleName + ' ]授予当前选中用户?', '确认', {
        confirmButtonText: '确认',
        cancelButtonText: '关闭',
        type: 'warning'
      })
        .then(async() => {
          const data = {
            roleId: this.roleId,
            userIds: this.addUserIds
          }
          addUserRole(data)
            .then(async() => {
              this.closeDialog()
              // 刷新
              this.handleRefresh1()
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
            })
            .catch(err => { console.error(err) })
        })
        .catch(err => { console.error(err) })
    },
    /** 刷新 用户列表 */
    handleRefresh1() {
      this.handleRefresh('userList')
    },
    /** 刷新 待添加用户列表 */
    handleRefresh2() {
      this.handleRefresh('userAddList')
    },
    /** 刷新子组件 */
    handleRefresh(ref) {
      this.$nextTick(() => {
        this.$refs[ref].resetQuery()
      })
    },
    /** 选择要移除的用户 多选 */
    removeUser(users) {
      this.delUserIds = this.getUserIds(users)
    },
    /** 选择要移除的用户 单选 */
    singleRemoveUser(users) {
      this.delUserIds = this.getUserIds(users)
      // 保存
      this.handleDelete()
    },
    /** 选择要添加的用户 多选 */
    addUser(users) {
      this.addUserIds = this.getUserIds(users)
    },
    /** 选择要添加的用户 单选 */
    singleAddUser(users) {
      this.addUserIds = this.getUserIds(users)
      // 保存
      this.confirmHandle()
    },
    // 将元素集合转为id集合
    getUserIds(users) {
      return (users || []).map(user => user.id)
    },
    /** 排除超级管理员用户和角色 */
    selectable(row, index) {
      return !(this.roleId === '1' && row.id === '1')
    }
  }
}
</script>
<style scoped>
</style>
