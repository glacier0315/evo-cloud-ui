<template>
  <div class="app-container">
    <el-page-header
      :content="'当前用户 [' + username + '] '"
      @back="goBack"
    />
    <role-list
      ref="roleList"
      :multiple-selected="true"
      :default-params="{userId: userId}"
      :selectable-callback="selectable"
      @handleSelected="removeRole"
      @handleSingleSelected="singleRemoveRole"
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
            :disabled="delRoleIds.length <= 0"
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
          :disabled="(userId === '1' && scope.row.id === '1')"
          @click="singleRemoveRole([scope.row])"
        >
          {{ $t('table.remove') }}
        </el-button>
      </template>
    </role-list>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="'添加角色'"
      width="60%"
      top="10vh"
    >
      <role-list
        ref="roleAddList"
        :multiple-selected="true"
        :default-params="{notEqUserId: userId, status: '1'}"
        @handleSelected="addRole"
        @handleSingleSelected="singleAddRole"
      >
        <template v-slot:queryParams>
          <el-form-item />
        </template>
      </role-list>

      <div slot="footer" class="dialog-footer">
        <el-button
          :disabled="addRoleIds.length <= 0"
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
import { addRoleUser, deleteRoleUser } from '@/api/sys/userRole'

import RoleList from '@/views/sys/role/components/RoleList'

export default {
  name: 'UserRole',
  /** 注册组件 */
  components: { RoleList },
  data() {
    return {
      // 用户id，从路由中获取
      userId: this.$route.query.id,
      // 用户名称，从路由中获取
      username: this.$route.query.name,
      // 弹出层
      dialogVisible: false,
      // 待移除角色
      delRoleIds: [],
      // 待授予角色
      addRoleIds: []

    }
  },
  created() {
  },
  methods: {
    /** 返回 */
    goBack() {
      // 路由跳转
      this.$router.push({
        path: '/sys/user'
      })
    },
    /** 新增 */
    handleAdd() {
      this.dialogVisible = true
      // 初始化 roleAddList
      this.handleRefresh2()
    },
    /** 删除 */
    handleDelete() {
      this.$confirm('确认移除当前选中角色?', '确认', {
        confirmButtonText: '确认',
        cancelButtonText: '关闭',
        type: 'warning'
      })
        .then(async() => {
          const data = {
            userId: this.userId,
            roleIds: this.delRoleIds
          }
          await deleteRoleUser(data)
          this.handleRefresh1()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(err => { console.error(err) })
    },
    /** 关闭弹出层 */
    closeDialog() {
      this.dialogVisible = false
      // 清空添加的元素
      this.addUserIds = []
    },
    // 提交表单
    async confirmHandle() {
      this.$confirm('确认给用户[ ' + this.username + ' ]授予当前选中角色?', '确认', {
        confirmButtonText: '确认',
        cancelButtonText: '关闭',
        type: 'warning'
      })
        .then(async() => {
          const data = {
            roleIds: this.addRoleIds,
            userId: this.userId
          }
          addRoleUser(data)
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
      this.handleRefresh('roleList')
    },
    /** 刷新 待添加用户列表 */
    handleRefresh2() {
      this.handleRefresh('roleAddList')
    },
    /** 刷新子组件 */
    handleRefresh(ref) {
      this.$nextTick(() => {
        this.$refs[ref].resetQuery()
      })
    },
    /** 选择要移除的用户 多选 */
    removeRole(roles) {
      this.delRoleIds = this.getRoleIds(roles)
    },
    /** 选择要移除的用户 单选 */
    singleRemoveRole(roles) {
      this.delRoleIds = this.getRoleIds(roles)
      // 保存
      this.handleDelete()
    },
    /** 选择要添加的用户 多选 */
    addRole(roles) {
      this.addRoleIds = this.getRoleIds(roles)
    },
    /** 选择要添加的用户 单选 */
    singleAddRole(roles) {
      this.addRoleIds = this.getRoleIds(roles)
      // 保存
      this.confirmHandle()
    },
    // 将元素集合转为id集合
    getRoleIds(roles) {
      return (roles || []).map(role => role.id)
    },
    /** 排除超级管理员用户和角色 */
    selectable(row, index) {
      return !(this.userId === '1' && row.id === '1')
    }
  }
}
</script>

<style scoped>

</style>
