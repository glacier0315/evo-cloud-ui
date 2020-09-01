<template>
  <div class="app-container">
    <el-page-header
      :content="'当前用户 [' + username + '] '"
      @back="goBack"
    />
    <el-form
      ref="queryForm"
      :model="pageRequest_1.params"
      :inline="true"
      label-width="68px"
      style="margin-top: 1em;"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input
          v-model="pageRequest_1.params.name"
          placeholder="角色名称"
          clearable
          @keyup.enter.native="handleQuery1"
        />
      </el-form-item>
      <el-form-item label="角色编码" prop="code">
        <el-input
          v-model="pageRequest_1.params.code"
          placeholder="角色编码"
          clearable
          @keyup.enter.native="handleQuery1"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="pageRequest_1.params.status"
          placeholder="状态"
          clearable
        >
          <el-option
            :key="''"
            :label="'全部'"
            :value="null"
          />
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
          :disabled="delRoleIds.length <= 0"
          @click="handleDelete"
        >
          {{ $t('table.remove') }}
        </el-button>
      </el-col>
    </el-row>
    <div style="margin-top: 1em;">
      <el-table
        v-loading="listLoading_1"
        :data="list_1"
        border
        fit
        stripe
        highlight-current-row
        current-row-key="id"
        style="width: 100%;"
        @selection-change="handleSelectionChange1"
      >
        <el-table-column
          type="selection"
          width="50"
          :selectable="selectable"
        />
        <el-table-column
          align="center"
          label="序号"
          type="index"
          width="50"
        />
        <el-table-column
          align="center"
          label="角色名称"
          prop="name"
        />
        <el-table-column
          align="center"
          label="角色编码"
          prop="code"
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
      :title="'添加角色'"
      width="900px"
      top="10vh"
    >
      <el-form
        ref="queryForm2"
        :model="pageRequest_2.params"
        :inline="true"
        label-width="68px"
        style="margin-top: 1em;"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input
            v-model="pageRequest_2.params.name"
            placeholder="角色名称"
            clearable
            @keyup.enter.native="handleQuery2"
          />
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input
            v-model="pageRequest_2.params.code"
            placeholder="角色编码"
            clearable
            @keyup.enter.native="handleQuery2"
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
          style="width: 100%;"
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
            width="50"
          />
          <el-table-column
            align="center"
            label="角色名称"
            prop="name"
          />
          <el-table-column
            align="center"
            label="角色编码"
            prop="code"
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
import { getRolePageList } from '@/api/sys/role'
import { addRoleUser, deleteRoleUser } from '@/api/sys/userRole'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'UserRole',
  /** 注册组件 */
  components: { Pagination },
  data() {
    return {
      // 用户id，从路由中获取
      userId: this.$route.query.id,
      // 用户名称，从路由中获取
      username: this.$route.query.name,
      // 弹出层
      dialogVisible: false,
      // 遮罩层
      listLoading_1: true,
      // 分页请求
      pageRequest_1: {
        pageNum: 1,
        pageSize: 10,
        params: {}
      },
      // 列表集合
      list_1: [],
      // 总数
      total_1: 0,
      // 待移除角色
      delRoleIds: [],
      // 遮罩层
      listLoading_2: true,
      // 分页请求
      pageRequest_2: {
        pageNum: 1,
        pageSize: 10,
        params: {}
      },
      // 列表集合
      list_2: [],
      // 总数
      total_2: 0,
      // 待授予角色
      addRoleIds: [],
      // 状态集合
      statusList: [
        { label: '正常', value: '1' },
        { label: '禁用', value: '2' }
      ]
    }
  },
  created() {
    this.getPageList1()
  },
  methods: {
    /** 返回 */
    goBack() {
      // 路由跳转
      this.$router.push({
        path: '/sys/user'
      })
    },
    /** 排除超级管理员用户和角色 */
    selectable(row, index) {
      return !(this.userId === '1' && row.id === '1')
    },
    /** 获取分页列表 */
    getPageList1() {
      this.listLoading_1 = true
      // 设置用户id
      this.pageRequest_1.params.userId = this.userId
      getRolePageList(this.pageRequest_1).then(response => {
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
    /** 新增 */
    handleAdd() {
      this.resetQuery2()
      this.dialogVisible = true
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
          this.handleQuery1()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(err => { console.error(err) })
    },
    handleSelectionChange1(rows) {
      this.delRoleIds = rows.map(row => row.id) || []
    },
    /** 获取分页列表 */
    getPageList2() {
      this.listLoading_2 = true
      // 设置用户id
      this.pageRequest_2.params.notEqUserId = this.userId
      // 设置状态
      this.pageRequest_2.params.status = '1'
      getRolePageList(this.pageRequest_2).then(response => {
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
      this.addRoleIds = rows.map(row => row.id) || []
    },
    /** 关闭弹出层 */
    closeDialog() {
      this.dialogVisible = false
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
    /** 状态格式化 */
    statusFormat(row, column, cellValue, index) {
      const status = {}
      this.statusList.forEach((item) => {
        if (cellValue && item.value === cellValue) {
          Object.assign(status, item)
          return
        }
      })
      return status.label
    }
  }
}
</script>

<style scoped>
</style>
