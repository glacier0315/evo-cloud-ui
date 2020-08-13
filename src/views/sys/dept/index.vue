<template>
  <div class="app-container">
    <el-form ref="roleSearch" :inline="true" label-width="68px">
      <el-form-item>
        <el-button type="primary" @click="getTreeList">
          {{ $t('table.search') }}
        </el-button>
        <el-button type="primary" @click="handleAdd">
          {{ $t('table.add') }}
        </el-button>
      </el-form-item>
    </el-form>

    <div>
      <el-table
        :data="treeData"
        row-key="id"
        border
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="name" label="名称" width="180" />
        <el-table-column prop="code" label="编码" />
        <el-table-column prop="type" label="类型" :formatter="typeFormat" width="80" />
        <el-table-column prop="status" label="显示" :formatter="statusFormat" width="80" />
        <el-table-column align="center" label="操作" width="280">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleAdd(scope)">
              {{ $t('table.add') }}
            </el-button>
            <el-button type="primary" size="small" @click="handleEdit(scope)">
              {{ $t('table.edit') }}
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope)">
              {{ $t('table.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType==='edit'?'编辑':'添加'"
    >
      <el-form ref="dept" :model="dept" :rules="rules" label-width="80px">
        <el-form-item label="机构名称" prop="name">
          <el-input v-model="dept.name" placeholder="机构名称" />
        </el-form-item>
        <el-form-item label="机构编码" prop="code">
          <el-input v-model="dept.code" placeholder="机构编码" />
        </el-form-item>
        <el-form-item label="机构类型" prop="type">
          <el-radio-group v-model="dept.type">
            <el-radio
              v-for="(item,index) in typeList"
              :key="index"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="dept.type && dept.type !== 1" label="父级机构" prop="parentName">
          <el-input
            v-model="dept.parentName"
            placeholder="父级机构"
            @click.native="toggleTree"
          />
          <div v-if="showTree">
            <el-tree
              ref="tree"
              :data="treeParentData"
              accordion
              node-key="id"
              @node-click="handleNodeClick"
            >
              <div slot-scope="{ node, data }">
                <span>
                  {{ data.name }}
                </span>
              </div>
            </el-tree>
          </div>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="dept.status">
            <el-radio
              v-for="(item,index) in statusList"
              :key="index"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序号" prop="orderNum">
          <el-input-number v-model="dept.orderNum" :min="1" :step="1" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="closeDialog">
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
import { getDeptList, saveDept, delDept } from '@/api/sys/dept'
import { buildTree } from '@/utils/tree'

const defaultDept = {
  id: '',
  name: '',
  code: '',
  type: 1,
  status: 1,
  parentId: '',
  parentName: '',
  orderNum: 1,
  children: []
}

export default {
  name: 'Dept',
  data() {
    return {
      listLoading: true,
      dialogVisible: false,
      dialogType: 'new',
      showTree: false,
      dept: Object.assign({}, defaultDept),
      deptList: [],
      treeData: [],
      treeParentData: [],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 5 到 20个字符', trigger: 'blur' }
        ]
      },
      typeList: [
        { label: '公司', value: 1 },
        { label: '部门', value: 2 },
        { label: '科室', value: 3 }
      ],
      statusList: [
        { label: '显示', value: 1 },
        { label: '隐藏', value: 2 }
      ]
    }
  },
  created() {
    this.getTreeList()
  },
  methods: {
    getTreeList() {
      this.listLoading = true
      getDeptList().then(response => {
        this.deptList = response.data
        this.treeData = buildTree(this.deptList)
        this.listLoading = false
      })
    },
    closeDialog() {
      this.dialogVisible = false
      this.$refs['dept'].resetFields()
    },
    handleAdd(scope) {
      this.dept = Object.assign({}, defaultDept)
      if (scope && scope.row) {
        const { id, name, type } = scope.row
        this.dept.parentId = id
        this.dept.parentName = name
        if (type === 1) {
          this.dept.type = 2
        }
      }
      this.dialogType = 'new'
      this.dialogVisible = true
      this.showTree = false
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.showTree = false
      this.dept = Object.assign({}, scope.row)
    },
    handleDelete({ $index, row }) {
      this.$confirm('确认删除当前机构?', 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '关闭',
        type: 'warning'
      })
        .then(async() => {
          await delDept(row.id)
          this.getTreeList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(err => { console.error(err) })
    },
    async confirmHandle() {
      const isEdit = this.dialogType === 'edit'

      this.$refs['dept'].validate((valid) => {
        if (valid) {
          saveDept(this.dept).then(data => {
            this.dialogVisible = false
            this.getTreeList()

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
    filterDate() {
      const depts = this.deptList.filter(item => {
        // 过滤当前机构
        if (this.dept.id && this.dept.id === item.id) {
          return false
        }
        return true
      })
      return depts
    },
    toggleTree() {
      this.showTree = !this.showTree
      this.treeParentData = buildTree(this.filterDate())
    },
    handleNodeClick(data) {
      const { id, name } = data
      this.dept.parentId = id
      this.dept.parentName = name
      this.showTree = false
    },
    typeFormat(row, column, cellValue, index) {
      const type = {}
      this.typeList.forEach((item) => {
        if (cellValue && item.value === cellValue) {
          Object.assign(type, item)
        }
      })
      return type.label
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
.table-container {
  margin: 1em;
}
.btn-group {
  margin-left: 1em;
  display: inline;
}
</style>
