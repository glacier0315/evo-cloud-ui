<template>
  <div>
    <el-form
      ref="queryForm"
      :model="pageRequest.params"
      :inline="true"
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
      <el-form-item label="身份证号" prop="idCard">
        <el-input
          v-model="pageRequest.params.idCard"
          placeholder="身份证号"
          clearable
          style="width:200px;"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单位" prop="deptId">
        <treeselect
          v-model="pageRequest.params.deptId"
          name="deptSearch"
          placeholder="单位"
          :multiple="false"
          clearable
          :options="deptData"
          :normalizer="normalizer"
          style="width:180px;"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-search"
          @click="handleQuery"
        >
          {{ $t('table.search') }}
        </el-button>
        <el-button
          size="mini"
          icon="el-icon-refresh"
          @click="resetQuery"
        >
          {{ $t('table.reset') }}
        </el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <slot name="handle" />
    </el-row>
    <div>
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        stripe
        highlight-current-row
        size="mini"
        current-row-key="id"
        style="width: 100%;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          v-if="multipleSelected"
          type="selection"
          width="55"
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
          v-if="idCardVisible"
          align="center"
          label="身份证号"
          prop="idCard"
        />
        <el-table-column
          align="center"
          label="出生日期"
        >
          <template #default="scope">
            <span>{{ scope.row.birthday | parseTime('{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="单位"
          prop="deptName"
        />
        <el-table-column
          align="center"
          width="80"
          label="操作"
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <slot name="operation" :row="scope.row" />
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
  </div>
</template>

<script>
import { getUserList } from '@/api/sys/user'
import Pagination from '@/components/Pagination'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'UserList',
  /** 注册组件 */
  components: { Pagination, Treeselect },
  props: {
    // 组织机构树
    deptData: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 分页查询默认参数
    defaultParams: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 是否多选
    multipleSelected: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    // 身份证是否显示
    idCardVisible: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data() {
    return {
      // 遮罩层
      listLoading: true,
      // 分页请求
      pageRequest: {
        pageNum: 1,
        pageSize: 10,
        params: this.defaultParams
      },
      // 用户列表
      list: [],
      // 总记录数
      total: 0,
      multipleSelection: [],
      // 性别集合
      sexList: [
        { label: '男', value: 1 },
        { label: '女', value: 2 },
        { label: '其他', value: 3 }
      ]
    }
  },
  watch: {
    deptData: (val) => {
      console.log('deptData ', val)
    }
  },
  created() {
    this.handleQuery()
  },
  methods: {
    /** 获取用户分页 */
    getPageList() {
      this.listLoading = true
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
      this.pageRequest.params = this.defaultParams
      this.$refs['queryForm'].resetFields()
      this.handleQuery()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getMultipleSelection() {
      return this.multipleSelection
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

</style>
