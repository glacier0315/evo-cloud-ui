<template>
  <div class="app-container">
    <role-list
      ref="roleList"
      :id-card-visible="true"
      :dept-data="deptTreeData"
      :row-btn-width="320"
    >
      <template v-slot:toolbars="pageRequest">
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
            type="warning"
            icon="el-icon-download"
            @click="handleExport(pageRequest)"
          >
            {{ $t('table.export') }}
          </el-button>
        </el-col>
      </template>
      <template v-slot:row-btns="scope">
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
      </template>
    </role-list>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="role.id ? '编辑':'添加'"
      width="800px"
      append-to-body
    >
      <el-form
        ref="role"
        :model="role"
        :rules="rules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input
                v-model="role.name"
                placeholder="名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编码" prop="code">
              <el-input
                v-model="role.code"
                placeholder="编码"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="数据权限" prop="dataScope">
              <el-select
                v-model="role.dataScope"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in dataScopeList"
                  :key="'dataScope_'+ index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="role.status">
                <el-radio
                  v-for="(item, index) in statusList"
                  :key="'status_'+ index"
                  :label="item.value"
                >{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="描述" prop="description">
              <el-input
                v-model="role.description"
                type="textarea"
                placeholder="描述"
                maxlength="500"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单">
              <el-tree
                ref="menuTree"
                :check-strictly="false"
                :data="menuTreeData"
                :props="defaultProps"
                show-checkbox
                node-key="id"
              >
                <div slot-scope="{ node, data }">
                  <span>
                    {{ node.label }}
                  </span>
                  <span style="margin-left: 3em;">
                    {{ data.type | typeFormat }}
                  </span>
                </div>
              </el-tree>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="role.dataScope === '5'"
              label="单位"
            >
              <el-tree
                ref="deptTree"
                :check-strictly="false"
                :data="deptTreeData"
                :props="defaultProps"
                show-checkbox
                node-key="id"
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
import { saveRole, delRole, checkCode } from '@/api/sys/role'
import { getMenuList, getRoleMenus } from '@/api/sys/menu'
import { getDeptList, getRoleDepts } from '@/api/sys/dept'
import { buildTree } from '@/utils/tree'

import RoleList from '@/views/sys/role/components/RoleList'

/** 角色默认值 */
const defaultRole = {
  id: '',
  name: '',
  code: '',
  status: '1',
  description: '',
  dataScope: '6',
  menus: [],
  depts: []
}

export default {
  name: 'Role',
  /** 注册组件 */
  components: { RoleList },
  /** 过滤器 */
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
      // 弹出层
      dialogVisible: false,
      // 表单
      role: Object.assign({}, defaultRole),
      // 表单校验
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            pattern: /^(?!_)(?!.*?_$)[\u4e00-\u9fa5_a-zA-Z0-9_]{2,10}$/,
            message: '角色名称不合法，长度是2到10位，支持(中文，字母，数字，下划线)，不能以下划线开头结尾',
            trigger: 'blur'
          }
        ],
        code: [
          { required: true, message: '请输入角色编码', trigger: 'blur' },
          {
            pattern: /^(?!_)(?!.*?_$)[a-zA-Z0-9_]{3,20}$/,
            message: '角色编码不合法，长度是3到20位，支持(字母，数字，下划线)，不能以下划线开头结尾',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              const data = {
                id: this.role.id,
                code: value
              }
              let exist = false
              checkCode(data)
                .then((response) => {
                  exist = response.data
                })
                .catch(err => {
                  console.error(err)
                })
              setTimeout(() => {
                if (exist) {
                  callback(new Error('角色编码已存在!'))
                  return
                }
                callback()
              }, 1000)
            },
            trigger: 'blur'
          }
        ]
      },
      // 菜单树
      menuTreeData: [],
      // 组织机构树
      deptTreeData: [],
      // 状态集合
      statusList: [
        { label: '正常', value: '1' },
        { label: '禁用', value: '2' }
      ],
      // 数据权限集合
      dataScopeList: [
        { label: '全部单位', value: '1' },
        { label: '所属一级单位及以下', value: '2' },
        { label: '所属二级单位及以下', value: '3' },
        { label: '所属单位部门及以下', value: '4' },
        { label: '自定义', value: '5' },
        { label: '仅自己', value: '6' }
      ],
      defaultProps: {
        label: 'name'
      }
    }
  },
  created() {
    this.getMenuTree()
    this.getDeptTree()
  },
  methods: {
    /** 查询菜单树 */
    async getMenuTree() {
      this.menuTreeData = []
      getMenuList().then(response => {
        this.menuTreeData = buildTree(response.data)
      })
    },
    /** 查询组织机构树 */
    async getDeptTree() {
      this.deptTreeData = []
      getDeptList().then(response => {
        this.deptTreeData = buildTree(response.data)
      })
    },
    /** 关闭弹出层 */
    closeDialog() {
      this.dialogVisible = false
      this.resetForm()
    },
    /** 授权 */
    grantRole(scope) {
      // 路由跳转
      this.$router.push({
        path: '/sys/role/user',
        query: {
          id: scope.row.id,
          name: scope.row.name
        }
      })
    },
    /** 新增 */
    handleAdd() {
      this.role = Object.assign({}, defaultRole)
      this.dialogVisible = true
      this.$nextTick(() => {
        // 清空选择
        this.setCheckedKeys('menuTree')
      })
    },
    /** 编辑 */
    handleEdit(scope) {
      this.role = Object.assign({}, scope.row)
      this.dialogVisible = true
      this.$nextTick(() => {
        // 清空选择
        this.setCheckedKeys('menuTree')
      })
      getRoleMenus(this.role.id)
        .then(res => {
          this.role.menus = res.data
          this.setCheckedKeys('menuTree', res.data)
        })
      if (this.role.dataScope === '5') {
        this.$nextTick(() => {
          // 清空选择
          this.setCheckedKeys('deptTree')
        })
        // 自定义
        getRoleDepts(this.role.id)
          .then(res => {
            this.role.depts = res.data
            this.setCheckedKeys('deptTree', res.data)
          })
      }
    },
    /** 删除 */
    handleDelete({ $index, row }) {
      this.$confirm('确认删除当前角色?', 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '关闭',
        type: 'warning'
      })
        .then(async() => {
          await delRole(row.id)
          this.handleRefresh()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(err => { console.error(err) })
    },
    // 提交表单
    async confirmHandle() {
      const isEdit = this.role.id
      // 设置menus
      this.role.menus = this.getCheckedKeys('menuTree')
      // 设置组织机构
      if (this.role.dataScope === '5') {
        this.role.depts = this.getCheckedKeys('deptTree')
      }
      this.$refs['role'].validate((valid) => {
        if (valid) {
          saveRole(this.role).then(data => {
            this.dialogVisible = false
            this.handleRefresh()

            if (isEdit) {
              this.$notify({
                title: '成功',
                dangerouslyUseHTMLString: true,
                message: '更新成功',
                type: 'success'
              })
            } else {
              this.$notify({
                title: '成功',
                dangerouslyUseHTMLString: true,
                message: '添加成功',
                type: 'success'
              })
            }
          })
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
    /** 重置表单 */
    resetForm() {
      this.$refs['role'].resetFields()
    },
    // 获取树形选中的值
    getCheckedKeys(ref) {
      return this.$refs[ref].getCheckedKeys()
    },
    // 设置树形选中
    setCheckedKeys(ref, arrayKey) {
      this.$refs[ref].setCheckedKeys(arrayKey || [], false)
    },
    /** 刷新子组件 */
    handleRefresh() {
      this.$nextTick(() => {
        this.$refs['roleList'].resetQuery()
      })
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
