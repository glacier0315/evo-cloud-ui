<template>
  <div class="app-container">
    <el-form
      ref="queryForm"
      :inline="true"
      label-width="68px"
    />
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="getTreeList"
        >
          {{ $t('table.search') }}
        </el-button>
      </el-col>
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
        <el-table-column
          align="center"
          width="280"
          label="操作"
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <el-button
              v-if="scope.row.type !== 3"
              type="primary"
              size="mini"
              icon="el-icon-plus"
              @click="handleAdd(scope)"
            >
              {{ $t('table.add') }}
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
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope)"
            >
              {{ $t('table.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="dept.id ?'编辑':'添加'"
    >
      <el-form
        ref="dept"
        :model="dept"
        :rules="rules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="机构名称" prop="name">
              <el-input
                v-model="dept.name"
                placeholder="机构名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机构编码" prop="code">
              <el-input
                v-model="dept.code"
                placeholder="机构编码"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
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
          </el-col>
          <el-col :span="12">
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
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              v-if="dept.type && dept.type !== 1"
              label="父级资源"
              prop="parentId"
            >
              <treeselect
                v-model="dept.parentId"
                name="dept"
                :multiple="false"
                :clearable="true"
                :options="treeParentData"
                :normalizer="normalizer"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="排序号" prop="orderNum">
              <el-input-number
                v-model="dept.orderNum"
                :min="1"
                :step="1"
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
import { getDeptList, saveDept, delDept } from '@/api/sys/dept'
import { buildTree } from '@/utils/tree'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

/** 表单默认值 */
const defaultDept = {
  id: '',
  name: '',
  code: '',
  type: 1,
  status: 1,
  parentId: undefined,
  parentName: '',
  orderNum: 1,
  children: []
}

export default {
  name: 'Dept',
  /** 注册组件 */
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      listLoading: true,
      // 弹出层
      dialogVisible: false,
      // 表单
      dept: Object.assign({}, defaultDept),
      // 单位集合
      deptList: [],
      // 单位树
      treeData: [],
      // 父级单位树
      treeParentData: [],
      // 表单校验
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 5 到 20个字符', trigger: 'blur' }
        ]
      },
      // 类型
      typeList: [
        { label: '公司', value: 1 },
        { label: '部门', value: 2 },
        { label: '科室', value: 3 }
      ],
      // 状态
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
    /** 查询单位数 */
    getTreeList() {
      this.listLoading = true
      getDeptList().then(response => {
        // 记录单位集合
        this.deptList = response.data
        this.treeData = buildTree(this.deptList)
        this.listLoading = false
      })
    },
    /** 关闭弹出层 */
    closeDialog() {
      this.dialogVisible = false
      this.$refs['dept'].resetFields()
    },
    /** 新增 */
    handleAdd(scope) {
      this.dept = Object.assign({}, defaultDept)
      if (scope && scope.row) {
        const { id, type } = scope.row
        this.dept.parentId = id
        if (type === 1) {
          this.dept.type = 2
        }
      }
      this.genDeptTree()
      this.dialogVisible = true
    },
    /** 编辑 */
    handleEdit(scope) {
      this.dept = Object.assign({}, scope.row)
      this.genDeptTree()
      this.dialogVisible = true
    },
    /** 删除 */
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
    /** 提交表单 */
    async confirmHandle() {
      const isEdit = this.dept.id

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
    /** 生成父级单位树 */
    genDeptTree() {
      const depts = this.deptList.filter(item => {
        // 过滤当前机构
        if (this.dept.id && this.dept.id === item.id) {
          return false
        }
        return true
      })
      this.treeParentData = buildTree(depts)
    },
    /** 类型 格式化 */
    typeFormat(row, column, cellValue, index) {
      const type = {}
      this.typeList.forEach((item) => {
        if (cellValue && item.value === cellValue) {
          Object.assign(type, item)
        }
      })
      return type.label
    },
    /** 状态 格式化 */
    statusFormat(row, column, cellValue, index) {
      const status = {}
      this.statusList.forEach((item) => {
        if (cellValue && item.value === cellValue) {
          Object.assign(status, item)
        }
      })
      return status.label
    },
    /** 处理属性数据 */
    normalizer(node) {
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
.table-container {
  margin: 1em;
}
.el-row {
  margin-bottom: 1em;
}
</style>
