<template>
  <div class="app-container">
    <el-page-header
      :content="'角色 [' + roleName + '] 授权'"
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
          v-if="scope.row.id !== 1"
          size="mini"
          type="danger"
          icon="el-icon-delete"
          @click="handleDelete(scope)"
        >
          {{ $t('table.delete') }}
        </el-button>
      </template>
    </userList>
  </div>
</template>
<script>
import { delUserRole } from '@/api/sys/role'
import { getDeptList } from '@/api/sys/dept'
import { buildTree } from '@/utils/tree'
import UserList from '@/views/sys/user/components/UserList'

export default {
  name: 'UserRole',
  /** 注册组件 */
  components: { UserList },
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
    reloadUserList() {
      // 调用子组件查询方法刷新
      this.$refs.userList.handleQuery()
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
          const userRole = {
            roleId: this.roleId,
            userId: row.id
          }
          await delUserRole(userRole)
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
    }
  }
}
</script>
<style scoped>

</style>
