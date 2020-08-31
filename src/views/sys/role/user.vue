<template>
  <div class="app-container">
    <el-page-header
      :content="'当前角色 [' + roleName + '] '"
      @back="goBack"
    />
    <el-form
      ref="queryForm"
      :model="pageRequest.params"
      :inline="true"
      style="margin-top: 1em;"
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
          type="selection"
          width="55"
          :selectable="(row, index) => {return row.id !== '1'}"
        />
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
          width="240"
          label="操作"
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <el-button
              v-if="scope.row.id !== '1' "
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope)"
            >
              {{ $t('table.remove') }}
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
      title="添加用户"
      width="80%"
      center
    >
      添加用户
    </el-dialog>
  </div>
</template>
<script>
import { getUserList } from '@/api/sys/user'
import { addUserRole, deleteUserRole } from '@/api/sys/userRole'
import { getDeptList } from '@/api/sys/dept'
import { buildTree } from '@/utils/tree'
import Pagination from '@/components/Pagination'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

/** 查询默认值 */
const defaultParams = {
  username: null,
  nickname: null,
  sex: null,
  idCard: null,
  status: null,
  deptId: null
}

export default {
  name: 'RoleUser',
  /** 注册组件 */
  components: { Pagination, Treeselect },
  data() {
    return {
      // 遮罩层
      listLoading: true,
      // 弹出层显示
      dialogVisible: false,
      // 角色id，从路由中获取
      roleId: this.$route.query.id,
      // 角色名称，从路由中获取
      roleName: this.$route.query.name,
      // 分页请求
      pageRequest: {
        pageNum: 1,
        pageSize: 10,
        params: Object.assign({}, defaultParams)
      },
      // 用户列表
      list: [],
      // 总记录数
      total: 0,
      // 组织机构树
      deptTreeData: [],
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
      ]
    }
  },
  watch: {

  },
  created() {
    this.handleQuery()
    this.getDeptData()
  },
  methods: {
    /** 获取用户分页 */
    getPageList() {
      this.listLoading = true
      // 设置roleId
      this.pageRequest.params.roleId = this.roleId
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
      this.pageRequest.params = Object.assign({}, defaultParams)
      this.handleQuery()
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
          await deleteUserRole(data)
          this.handleQuery()
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
          this.handleQuery()
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
      // 保存用户角色关系
      if (users &&
      users instanceof Array &&
      users.length > 0) {
        const userIds = users.map(u => u.id)
        const data = {
          roleId: this.roleId,
          userIds: userIds
        }
        addUserRole(data)
          .then(async() => {
            this.closeDialog()
            // 刷新
            this.handleQuery()
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

</style>
