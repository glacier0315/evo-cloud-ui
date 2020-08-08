<template>
  <div class="app-container">
    <el-form ref="roleSearch" :model="pageRequest.params" :inline="true" label-width="68px">
      <el-form-item label="角色名称" prop="name">
        <el-input
          v-model="pageRequest.params.name"
          placeholder="角色名称"
          clearable
          size="small"
          @keyup.enter.native="getPageList"
        />
      </el-form-item>
      <el-form-item label="角色编码" prop="code">
        <el-input
          v-model="pageRequest.params.code"
          placeholder="角色编码"
          clearable
          size="small"
          @keyup.enter.native="getPageList"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="pageRequest.params.status" placeholder="状态" clearable>
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
        <el-button type="primary" @click="getPageList">
          {{ $t('table.search') }}
        </el-button>
        <el-button type="primary" @click="handleAdd">
          {{ $t('table.add') }}
        </el-button>
      </el-form-item>
    </el-form>

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
        <el-table-column align="center" label="角色名称" prop="name" />
        <el-table-column align="center" label="角色编码" prop="code" />
        <el-table-column align="center" label="状态" prop="status" :formatter="statusFormat" />
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope)">
              {{ $t('table.edit') }}
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope)">
              {{ $t('table.delete') }}
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
      :title="dialogType==='edit'?'编辑':'添加'"
    >
      <el-form ref="role" :model="role" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="role.name" placeholder="名称" />
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="role.code" placeholder="编码" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="role.status">
            <el-radio :label="'1'">正常</el-radio>
            <el-radio :label="'2'">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="role.description" type="textarea" placeholder="描述" />
        </el-form-item>
        <el-form-item label="菜单">
          <el-tree
            ref="menuTree"
            :check-strictly="checkStrictly"
            :data="menuTreeData"
            show-checkbox
            node-key="id"
          >
            <div slot-scope="{ node, data }">
              <span>
                {{ data.name }}
              </span>
              <span style="margin-left: 3em;">
                {{ data.type | typeFormat }}
              </span>
            </div>
          </el-tree>
        </el-form-item>
        <el-form-item label="组织机构">
          <el-tree
            ref="deptTree"
            :check-strictly="checkStrictly"
            :data="deptTreeData"
            show-checkbox
            node-key="id"
          >
            <div slot-scope="{ node, data }">
              <span>
                {{ data.name }}
              </span>
            </div>
          </el-tree>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="confirmHandle">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, addRole, updateRole, delRole } from '@/api/sys/role'
import { getMenuList, getRoleMenus } from '@/api/sys/menu'
import { getDeptList, getRoleDepts } from '@/api/sys/dept'
import { buildTree } from '@/utils/tree'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const defaultRole = {
  id: '',
  name: '',
  code: '',
  status: '1',
  description: '',
  menus: [],
  depts: []
}

export default {
  name: 'Role',
  components: { Pagination },
  filters: {
    typeFormat: (cellValue) => {
      const typeMap = {
        1: '目录',
        2: '端点',
        3: '权限'
      }
      return typeMap[cellValue]
    }
  },
  data() {
    return {
      listLoading: true,
      dialogVisible: false,
      dialogType: 'new',
      pageRequest: {
        pageNum: 1,
        pageSize: 10,
        params: {
          name: '',
          code: ''
        }
      },
      list: [],
      total: 0,
      role: Object.assign({}, defaultRole),
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入角色编码', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20个字符', trigger: 'blur' }
        ]
      },
      menuTreeData: [],
      deptTreeData: [],
      checkStrictly: false,
      statusList: [
        { label: '正常', value: '1' },
        { label: '禁用', value: '2' }
      ]

    }
  },
  created() {
    this.getPageList()
    this.getMenuTree()
    this.getDeptTree()
  },
  methods: {
    async getMenuTree() {
      this.menuTreeData = []
      getMenuList().then(response => {
        this.menuTreeData = buildTree(response.data)
      })
    },
    async getDeptTree() {
      this.deptTreeData = []
      getDeptList().then(response => {
        this.deptTreeData = buildTree(response.data)
      })
    },
    getPageList() {
      this.listLoading = true
      getRoleList(this.pageRequest).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleAdd() {
      this.dialogType = 'new'
      this.resetChecked()
      this.role = Object.assign({}, defaultRole)
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.role = Object.assign({}, scope.row)
      this.resetChecked('menuTree')
      getRoleMenus(this.role.id)
        .then(res => {
          this.role.menus = res.data
          this.setCheckedKeys('menuTree', res.data)
        })
      this.resetChecked('deptTree')
      getRoleDepts(this.role.id)
        .then(res => {
          this.role.depts = res.data
          this.setCheckedKeys('deptTree', res.data)
        })
      this.dialogVisible = true
    },
    handleDelete({ $index, row }) {
      this.$confirm('确认删除当前角色?', 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '关闭',
        type: 'warning'
      })
        .then(async() => {
          await delRole(row.id)
          this.getPageList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(err => { console.error(err) })
    },
    async confirmHandle() {
      const isEdit = this.dialogType === 'edit'

      // 设置menus
      const menus = this.getCheckedKeys('menuTree')
      this.role.menus = menus
      // 设置组织机构
      const depts = this.getCheckedKeys('deptTree')
      this.role.depts = depts
      this.$refs['role'].validate((valid) => {
        if (valid) {
          if (isEdit) {
            updateRole(this.role).then(data => {
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
            addRole(this.role).then(data => {
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
    getCheckedKeys(ref) {
      return this.$refs[ref].getCheckedKeys()
    },
    resetChecked(ref) {
      this.$nextTick(() => {
        // 清空选择
        this.setCheckedKeys(ref, [])
      })
    },
    setCheckedKeys(ref, arrayKey) {
      if (arrayKey && arrayKey instanceof Array && arrayKey.length > 0) {
        this.$refs[ref].setCheckedKeys(arrayKey, false)
      } else {
        this.$refs[ref].setCheckedKeys([], false)
      }
    },
    statusFormat(row, column, cellValue, index) {
      const status = {}
      this.statusList.forEach((item) => {
        if (cellValue && item.value === cellValue) {
          Object.assign(status, item)
        }
      })
      return status.label
    }
  }
}
</script>

<style scoped>
.btn-group {
  margin-left: 1em;
  display: inline;
}
</style>
