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
        <el-table-column prop="path" label="路径" />
        <el-table-column prop="component" label="组件" />
        <el-table-column prop="icon" label="图标" width="80" />
        <el-table-column prop="permission" label="权限" />
        <el-table-column prop="type" label="类型" :formatter="typeFormat" width="80" />
        <el-table-column prop="visible" label="显示" :formatter="visibleFormat" width="80" />
        <el-table-column prop="isFrame" label="外链" :formatter="isFrameFormat" width="80" />
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
      :title="menu.id ?'编辑':'添加'"
    >
      <el-form
        ref="menu"
        :model="menu"
        :rules="rules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="12">
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
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序号" prop="orderNum">
              <el-input-number v-model="menu.orderNum" :min="1" :step="1" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="资源名称" prop="name">
              <el-input
                v-model="menu.name"
                placeholder="资源名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权限标识" prop="permission">
              <el-input v-model="menu.permission" placeholder="权限标识" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
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
          </el-col>
          <el-col :span="12">
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
          </el-col>
        </el-row>
        <el-row v-if="menu.type!==3">
          <el-col :span="12">
            <el-form-item label="路径" prop="path">
              <el-input v-model="menu.path" placeholder="相对路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="menu.type!==3 && menu.isFrame !== 1" label="组件" prop="component">
              <el-input v-model="menu.component" placeholder="组件" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="父级资源" prop="parentId">
              <treeselect
                v-model="menu.parentId"
                name="menu"
                :multiple="false"
                :clearable="true"
                :options="treeParentData"
                :normalizer="normalizer"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图标" prop="icon">
              <el-input v-model="menu.icon" placeholder="图标" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="menu.type!==3">
          <el-col :span="12">
            <el-form-item label="缓存" prop="noCache">
              <el-radio-group v-model="menu.noCache">
                <el-radio
                  v-for="(item,index) in noCacheList"
                  :key="index"
                  :label="item.value"
                >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="menu.visible === 2 && menu.isFrame === 2"
              label="高亮资源"
              prop="activeMenu"
            >
              <el-input
                v-model="menu.activeMenu"
                placeholder="高亮资源"
                maxlength="100"
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
import { getMenuList, saveMenu, delMenu } from '@/api/sys/menu'
import { buildTree } from '@/utils/tree'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

/** 表单默认值 */
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
  parentId: undefined,
  parentName: '',
  noCache: 2,
  activeMenu: undefined,
  orderNum: 0,
  children: []
}

export default {
  name: 'Menu',
  /** 注册组件 */
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      listLoading: true,
      // 弹出层显示
      dialogVisible: false,
      // 表单
      menu: Object.assign({}, defaultMenu),
      // 菜单集合
      menuList: [],
      // 菜单树
      treeData: [],
      // 父级菜单树
      treeParentData: [],
      // 表单校验
      rules: {
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20个字符', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入菜单路径', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20个字符', trigger: 'blur' }
        ]
      },
      // 类型集合
      typeList: [
        { label: '目录', value: 1 },
        { label: '端点', value: 2 },
        { label: '权限', value: 3 }
      ],
      // 可见
      visibleList: [
        { label: '显示', value: 1 },
        { label: '隐藏', value: 2 }
      ],
      // 外链
      isFrameList: [
        { label: '是', value: 1 },
        { label: '否', value: 2 }
      ],
      // 缓存
      noCacheList: [
        { label: '是', value: 1 },
        { label: '否', value: 2 }
      ]
    }
  },
  created() {
    this.getTreeList()
  },
  methods: {
    /** 获取菜单树  */
    getTreeList() {
      this.listLoading = true
      getMenuList().then(response => {
        // 保存菜单集合
        this.menuList = response.data
        this.treeData = buildTree(this.menuList)
        this.listLoading = false
      })
    },
    /** 关闭弹出层 */
    closeDialog() {
      this.dialogVisible = false
      this.$refs['menu'].resetFields()
    },
    /** 新增 */
    handleAdd(scope) {
      this.menu = Object.assign({}, defaultMenu)
      if (scope && scope.row) {
        const { id } = scope.row
        this.menu.parentId = id
      }
      this.genMenuTree()
      this.dialogVisible = true
    },
    /** 编辑  */
    handleEdit(scope) {
      this.menu = Object.assign({}, scope.row)
      this.genMenuTree()
      this.dialogVisible = true
    },
    /** 删除 */
    handleDelete({ $index, row }) {
      this.$confirm('确认删除当前菜单?', 'Warning', {
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
    /** 提交表单 */
    async confirmHandle() {
      const isEdit = this.menu.id

      this.$refs['menu'].validate((valid) => {
        if (valid) {
          saveMenu(this.menu).then(data => {
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
    /** 动态生成父级资源树 */
    genMenuTree() {
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
      this.treeParentData = buildTree(menus)
    },
    /** 类型格式化 */
    typeFormat(row, column, cellValue, index) {
      const type = {}
      this.typeList.forEach((item) => {
        if (cellValue && item.value === cellValue) {
          Object.assign(type, item)
        }
      })
      return type.label
    },
    /** 可见性 格式化 */
    visibleFormat(row, column, cellValue, index) {
      const visible = {}
      this.visibleList.forEach((item) => {
        if (cellValue && item.value === cellValue) {
          Object.assign(visible, item)
        }
      })
      return visible.label
    },
    /** 外链格式化 */
    isFrameFormat(row, column, cellValue, index) {
      const isFrame = {}
      this.isFrameList.forEach((item) => {
        if (cellValue && item.value === cellValue) {
          Object.assign(isFrame, item)
        }
      })
      return isFrame.label
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
