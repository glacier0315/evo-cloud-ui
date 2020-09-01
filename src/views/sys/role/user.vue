<template>
  <div class="app-container">
    <el-page-header
      :content="'当前角色 [' + roleName + '] '"
      @back="goBack"
    />
    <el-form
      ref="queryForm1"
      :model="pageRequest_1.params"
      :inline="true"
      style="margin-top: 1em;"
      label-width="68px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="pageRequest_1.params.username"
          placeholder="用户名"
          clearable
          style="width:90px;"
          @keyup.enter.native="handleQuery1"
        />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input
          v-model="pageRequest_1.params.nickname"
          placeholder="昵称"
          clearable
          style="width:90px;"
          @keyup.enter.native="handleQuery1"
        />
      </el-form-item>
      <el-form-item label="身份证号" prop="idCard">
        <el-input
          v-model="pageRequest_1.params.idCard"
          placeholder="身份证号"
          clearable
          style="width:200px;"
          @keyup.enter.native="handleQuery1"
        />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select
          v-model="pageRequest_1.params.sex"
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
          v-model="pageRequest_1.params.deptId"
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
          v-model="pageRequest_1.params.status"
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
          @click="handleQuery1"
        >
          {{ $t('table.search') }}
        </el-button>
        <el-button
          icon="el-icon-refresh"
          @click="resetQuery1"
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
          type="danger"
          icon="el-icon-delete"
          :disabled="delUserIds.length <= 0"
          @click="handleDelete"
        >
          {{ $t('table.remove') }}
        </el-button>
      </el-col>
    </el-row>
    <div>
      <el-table
        v-loading="listLoading_1"
        :data="list_1"
        border
        fit
        stripe
        highlight-current-row
        current-row-key="id"
        style="width: 100%;margin-top: 1em;"
        @selection-change="handleSelectionChange1"
      >
        <el-table-column
          type="selection"
          width="55"
          :selectable="selectable"
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
      </el-table>

      <pagination
        v-show="total_1>0"
        :total="total_1"
        :page.sync="pageRequest_1.pageNum"
        :limit.sync="pageRequest_1.pageSize"
        @pagination="getPageList1"
      />
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      title="添加用户"
      width="1000px"
      top="10vh"
    >
      <el-form
        ref="queryForm2"
        :model="pageRequest_2.params"
        :inline="true"
        label-width="68px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="pageRequest_2.params.username"
            placeholder="用户名"
            clearable
            style="width:90px;"
            @keyup.enter.native="handleQuery2"
          />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input
            v-model="pageRequest_2.params.nickname"
            placeholder="昵称"
            clearable
            style="width:90px;"
            @keyup.enter.native="handleQuery2"
          />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select
            v-model="pageRequest_2.params.sex"
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
            v-model="pageRequest_2.params.deptId"
            name="deptSearch"
            placeholder="单位"
            :multiple="false"
            clearable
            :options="deptTreeData"
            :normalizer="deptNormalizer"
            style="width:180px;"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="handleQuery2"
          >
            {{ $t('table.search') }}
          </el-button>
          <el-button
            icon="el-icon-refresh"
            @click="resetQuery2"
          >
            {{ $t('table.reset') }}
          </el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-table
          v-loading="listLoading_2"
          :data="list_2"
          border
          fit
          stripe
          highlight-current-row
          current-row-key="id"
          style="width: 100%;margin-top: 1em;"
          @selection-change="handleSelectionChange2"
        >
          <el-table-column
            type="selection"
            width="50"
          />
          <el-table-column
            align="center"
            label="序号"
            type="index"
            width="55"
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
            label="单位"
            prop="deptName"
          />
        </el-table>

        <pagination
          v-show="total_2>0"
          :total="total_2"
          :page.sync="pageRequest_2.pageNum"
          :limit.sync="pageRequest_2.pageSize"
          @pagination="getPageList2"
        />
      </div>
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
import { getUserList } from '@/api/sys/user'
import { addUserRole, deleteUserRole } from '@/api/sys/userRole'
import { getDeptList } from '@/api/sys/dept'
import { buildTree } from '@/utils/tree'
import Pagination from '@/components/Pagination'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'RoleUser',
  /** 注册组件 */
  components: { Pagination, Treeselect },
  data() {
    return {
      // 遮罩层
      listLoading_1: true,
      // 遮罩层
      listLoading_2: true,
      // 弹出层显示
      dialogVisible: false,
      // 角色id，从路由中获取
      roleId: this.$route.query.id,
      // 角色名称，从路由中获取
      roleName: this.$route.query.name,
      // 分页请求
      pageRequest_1: {
        pageNum: 1,
        pageSize: 10,
        params: {}
      },
      // 用户列表
      list_1: [],
      // 总记录数
      total_1: 0,
      // 待移除用户
      delUserIds: [],
      // 分页请求
      pageRequest_2: {
        pageNum: 1,
        pageSize: 10,
        params: {}
      },
      // 用户列表
      list_2: [],
      // 总记录数
      total_2: 0,
      // 待添加用户
      addUserIds: [],
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
    this.handleQuery1()
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
    /** 排除超级管理员用户和角色 */
    selectable(row, index) {
      return !(this.roleId === '1' && row.id === '1')
    },
    /** 获取用户分页 */
    getPageList1() {
      this.listLoading_1 = true
      // 设置roleId
      this.pageRequest_1.params.roleId = this.roleId
      getUserList(this.pageRequest_1).then(response => {
        this.list_1 = response.data.list
        this.total_1 = response.data.total
        this.listLoading_1 = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery1() {
      this.pageRequest_1.pageNum = 1
      this.getPageList1()
    },
    /** 重置查询 */
    resetQuery1() {
      this.pageRequest_1.params = {}
      this.handleQuery1()
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
      this.resetQuery2()
      this.dialogVisible = true
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
          this.handleQuery1()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(err => { console.error(err) })
    },
    handleSelectionChange1(rows) {
      this.delUserIds = rows.map(row => row.id) || []
    },
    /** 关闭用户弹窗 */
    closeDialog() {
      this.dialogVisible = false
    },
    /** 获取用户分页 */
    getPageList2() {
      this.listLoading_2 = true
      // 设置roleId, 排除
      this.pageRequest_2.params.notEqRoleId = this.roleId
      // 设置状态
      this.pageRequest_2.params.status = '1'
      getUserList(this.pageRequest_2).then(response => {
        this.list_2 = response.data.list
        this.total_2 = response.data.total
        this.listLoading_2 = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery2() {
      this.pageRequest_2.pageNum = 1
      this.getPageList2()
    },
    /** 重置查询 */
    resetQuery2() {
      this.pageRequest_2.params = {}
      this.handleQuery2()
    },
    handleSelectionChange2(rows) {
      this.addUserIds = rows.map(row => row.id) || []
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
              this.handleQuery1()
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
            })
            .catch(err => { console.error(err) })
        })
        .catch(err => { console.error(err) })
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
