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
        :data="treeDate"
        style="margin-top: 1em;"
        row-key="id"
        border
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="name" label="名称" width="180" />
        <el-table-column prop="title" label="标题" width="180" />
        <el-table-column prop="path" label="端点路径" />
        <el-table-column prop="component" label="组件" />
        <el-table-column prop="icon" label="图标" />
        <el-table-column prop="permission" label="权限标识" />
        <el-table-column prop="type" label="类型" :formatter="typeFormat" />
        <el-table-column prop="visible" label="显示" :formatter="visibleFormat" />
        <el-table-column prop="isFrame" label="外链" :formatter="isFrameFormat" />
        <el-table-column align="center" label="操作">
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
        <el-form-item label="端点路径" prop="path">
          <el-input v-model="menu.path" placeholder="端点相对路径" />
        </el-form-item>
        <el-form-item label="组件" prop="component">
          <el-input v-model="menu.component" placeholder="组件" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="menu.title" placeholder="标题" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="menu.icon" placeholder="图标" />
        </el-form-item>
        <el-form-item label="权限标识" prop="permission">
          <el-input v-model="menu.permission" placeholder="权限标识" />
        </el-form-item>
        <el-form-item label="父级资源" prop="parentId">
          <el-input v-model="menu.parentId" placeholder="父级资源" />
        </el-form-item>
        <el-form-item label="排序号" prop="orderNum">
          <el-input v-model="menu.orderNum" placeholder="排序号" />
        </el-form-item>
        <el-form-item label="显示" prop="visible">
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
        <el-form-item label="外链" prop="isFrame">
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
import { getTree, add, update, del } from '@/api/sys/menu'

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
      menu: Object.assign({}, defaultMenu),
      treeDate: [],
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 5 到 20个字符', trigger: 'blur' }
        ]
      },
      typeList: [
        { label: '目录', value: 1 },
        { label: '端点', value: 2 },
        { label: '权限标识', value: 3 }
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
      getTree().then(response => {
        this.treeDate = response.data
        this.listLoading = false
      })
    },
    handleAdd() {
      this.menu = Object.assign({}, defaultMenu)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.menu = Object.assign({}, scope.row)
    },
    handleDelete({ $index, row }) {
      this.$confirm('确认删除当前用户?', 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '关闭',
        type: 'warning'
      })
        .then(async() => {
          await del(row.id)
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
        console.log('valid,', valid)
        if (valid) {
          if (isEdit) {
            update(this.menu).then(data => {
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
            add(this.menu).then(data => {
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
