<template>
  <div class="app-container">
    <el-form
      ref="queryForm"
      :model="pageRequest.params"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input
          v-model="pageRequest.params.name"
          placeholder="角色名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="角色编码" prop="code">
        <el-input
          v-model="pageRequest.params.code"
          placeholder="角色编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <slot name="queryParams" :pageRequest="pageRequest">
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="pageRequest.params.status"
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
      </slot>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="handleQuery"
        >
          {{ $t('table.search') }}
        </el-button>
        <el-button
          icon="el-icon-refresh"
          @click="resetQuery"
        >
          {{ $t('table.reset') }}
        </el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <slot name="toolbars" :pageRequest="pageRequest" />
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      stripe
      highlight-current-row
      current-row-key="id"
      style="width: 100%; margin-top:1em;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="multipleSelected"
        type="selection"
        width="55"
        :selectable="selectableCallback"
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
      <el-table-column
        align="center"
        :width="rowBtnWidth"
        label="操作"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <slot name="row-btns" :row="scope.row">
            <el-button
              size="mini"
              @click="singleSelect(scope.row)"
            >
              {{ $t('table.confirm') }}
            </el-button>
          </slot>
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
</template>

<script>
import { getRolePageList } from '@/api/sys/role'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'RoleList',
  /** 注册组件 */
  components: { Pagination },
  props: {
    // 分页查询默认参数
    defaultParams: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 操作列宽度
    rowBtnWidth: {
      type: Number,
      default: () => {
        return 85
      }
    },
    // 是否多选
    multipleSelected: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    // 可选择回调函数
    selectableCallback: {
      type: Function,
      default: (row, index) => {
        return true
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
      // 列表集合
      list: [],
      // 总数
      total: 0,
      // 状态集合
      statusList: [
        { label: '正常', value: '1' },
        { label: '禁用', value: '2' }
      ]
    }
  },
  created() {
    this.handleQuery()
  },
  methods: {
    /** 获取分页列表 */
    getPageList() {
      this.listLoading = true
      getRolePageList(this.pageRequest)
        .then(response => {
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
    /** 多选 */
    handleSelectionChange(val) {
      this.multipleSelection = val || []
      this.$emit('handleSelected', this.multipleSelection)
    },
    /** 单选 */
    singleSelect(row) {
      this.multipleSelection = [row]
      this.$emit('handleSingleSelected', this.multipleSelection)
    },
    getMultipleSelection() {
      return this.multipleSelection
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
