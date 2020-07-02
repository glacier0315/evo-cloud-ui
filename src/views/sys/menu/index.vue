<template>
  <div class="app-container">
    <div>
      <div class="btn-group">
        <el-button type="primary" @click="getTreeList">
          {{ $t('table.search') }}
        </el-button>
        <el-button type="primary" @click="handleAdd">
          {{ $t('table.add') }}
        </el-button>
      </div>
    </div>

    <div>
      <el-table
        :data="treeData"
        style="margin-top: 1em;"
        row-key="id"
        border
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="name" label="名称" width="180" />
        <el-table-column prop="path" label="路径" />
        <el-table-column prop="component" label="组件" />
        <el-table-column prop="icon" label="图标" width="80" />
        <el-table-column prop="permission" label="权限" />
        <el-table-column prop="type" label="类型" :formatter="typeFormat" width="80" />
        <el-table-column prop="visible" label="显示" :formatter="visibleFormat" width="80" />
        <el-table-column prop="isFrame" label="外链" :formatter="isFrameFormat" width="80" />
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
      <el-form ref="menu" :model="menu" :rules="rules" label-width="80px">
        <el-form-item label="资源名称" prop="name">
          <el-input v-model="menu.name" placeholder="资源名称" />
        </el-form-item>
        <el-form-item label="资源类型" prop="type">
          <el-radio-group v-model="menu.type">
            <el-radio
              v-for="(item,index) in typeList"
              :key="index"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="menu.type===2" label="路径" prop="path">
          <el-input v-model="menu.path" placeholder="相对路径" />
        </el-form-item>
        <el-form-item v-if="menu.type===2" label="外链" prop="isFrame">
          <el-radio-group v-model="menu.isFrame">
            <el-radio
              v-for="(item,index) in isFrameList"
              :key="index"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="menu.type!==3 && menu.isFrame !== 1" label="组件" prop="component">
          <el-input v-model="menu.component" placeholder="组件" />
        </el-form-item>
        <el-form-item v-if="menu.type!==3" label="图标" prop="icon">
          <el-input v-model="menu.icon" placeholder="图标" />
        </el-form-item>
        <el-form-item label="权限标识" prop="permission">
          <el-input v-model="menu.permission" placeholder="权限标识" />
        </el-form-item>
        <el-form-item label="父级资源" prop="parentName">
          <el-input
            v-model="menu.parentName"
            placeholder="父级资源"
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
        <el-form-item v-if="menu.type!==3" label="显示" prop="visible">
          <el-radio-group v-model="menu.visible">
            <el-radio
              v-for="(item,index) in visibleList"
              :key="index"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序号" prop="orderNum">
          <el-input-number v-model="menu.orderNum" :min="1" :step="1" />
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
import { getMenuList, addMenu, updateMenu, delMenu } from '@/api/sys/menu'
import { buildTree } from '@/utils/tree'

const defaultMenu = {
  id: '',
  name: '',
  path: '',
  component: '',
  title: '',
  icon: '',
  permission: '',
  type: 1,
  visible: 1,
  isFrame: 2,
  parentId: '',
  parentName: '',
  orderNum: 0,
  children: []
}

export default {
  name: 'Menu',
  data() {
    return {
      listLoading: true,
      dialogVisible: false,
      dialogType: 'new',
      showTree: false,
      menu: Object.assign({}, defaultMenu),
      menuList: [],
      treeData: [],
      treeParentData: [],
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 5 到 20个字符', trigger: 'blur' }
        ]
      },
      typeList: [
        { label: '目录', value: 1 },
        { label: '端点', value: 2 },
        { label: '权限', value: 3 }
      ],
      visibleList: [
        { label: '显示', value: 1 },
        { label: '隐藏', value: 2 }
      ],
      isFrameList: [
        { label: '是', value: 1 },
        { label: '否', value: 2 }
      ]
    }
  },
  created() {
    this.getTreeList()
  },
  methods: {
    getTreeList() {
      this.listLoading = true
      getMenuList().then(response => {
        this.menuList = response.data
        this.treeData = buildTree(this.menuList)
        this.listLoading = false
      })
    },
    handleAdd(scope) {
      this.menu = Object.assign({}, defaultMenu)
      if (scope && scope.row) {
        const { id, name } = scope.row
        this.menu.parentId = id
        this.menu.parentName = name
      }
      this.dialogType = 'new'
      this.dialogVisible = true
      this.showTree = false
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.showTree = false
      this.menu = Object.assign({}, scope.row)
    },
    handleDelete({ $index, row }) {
      this.$confirm('确认删除当前用户?', 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '关闭',
        type: 'warning'
      })
        .then(async() => {
          await delMenu(row.id)
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

      this.$refs['menu'].validate((valid) => {
        if (valid) {
          if (isEdit) {
            updateMenu(this.menu).then(data => {
              this.dialogVisible = false
              this.getTreeList()

              this.$notify({
                title: '成功',
                dangerouslyUseHTMLString: true,
                message: '更新成功',
                type: 'success'
              })
            })
          } else {
            addMenu(this.menu).then(data => {
              this.dialogVisible = false
              this.getTreeList()

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
    filterDate() {
      const menus = this.menuList.filter(item => {
        // 权限过滤
        if (item.type === 3) {
          return false
        }
        // 过滤当前菜单
        if (this.menu.id && this.menu.id === item.id) {
          return false
        }
        return true
      })
      return menus
    },
    toggleTree() {
      this.showTree = !this.showTree
      this.treeParentData = buildTree(this.filterDate())
    },
    handleNodeClick(data) {
      const { id, name } = data
      this.menu.parentId = id
      this.menu.parentName = name
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
    visibleFormat(row, column, cellValue, index) {
      const visible = {}
      this.visibleList.forEach((item) => {
        if (cellValue && item.value === cellValue) {
          Object.assign(visible, item)
        }
      })
      return visible.label
    },
    isFrameFormat(row, column, cellValue, index) {
      const isFrame = {}
      this.isFrameList.forEach((item) => {
        if (cellValue && item.value === cellValue) {
          Object.assign(isFrame, item)
        }
      })
      return isFrame.label
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
