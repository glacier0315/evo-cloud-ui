<template>
  <div class="app-container">
    <switch-roles @change="handleRolesChange" />
    <div :key="key" style="margin-top:30px;">
      <div>
        <span v-hasRole="['admin']" class="permission-alert">
          Only
          <el-tag class="permission-tag" size="small">admin</el-tag> can see this
        </span>
        <el-tag v-hasRole="['admin']" class="permission-sourceCode" type="info">
          v-hasRole="['admin']"
        </el-tag>
      </div>

      <div>
        <span v-hasRole="['editor']" class="permission-alert">
          Only
          <el-tag class="permission-tag" size="small">editor</el-tag> can see this
        </span>
        <el-tag v-hasRole="['editor']" class="permission-sourceCode" type="info">
          v-hasRole="['editor']"
        </el-tag>
      </div>

      <div>
        <span v-hasRole="['admin','editor']" class="permission-alert">
          Both
          <el-tag class="permission-tag" size="small">admin</el-tag> and
          <el-tag class="permission-tag" size="small">editor</el-tag> can see this
        </span>
        <el-tag v-hasRole="['admin','editor']" class="permission-sourceCode" type="info">
          v-hasRole="['admin','editor']"
        </el-tag>
      </div>
    </div>

    <div :key="'checkRole'+key" style="margin-top:60px;">
      <aside>
        {{ $t('permission.tips') }}
        <br> e.g.
      </aside>

      <el-tabs type="border-card" style="width:550px;">
        <el-tab-pane v-if="checkRole(['admin'])" label="Admin">
          Admin can see this
          <el-tag class="permission-sourceCode" type="info">
            v-if="checkRole(['admin'])"
          </el-tag>
        </el-tab-pane>

        <el-tab-pane v-if="checkRole(['editor'])" label="Editor">
          Editor can see this
          <el-tag class="permission-sourceCode" type="info">
            v-if="checkRole(['editor'])"
          </el-tag>
        </el-tab-pane>

        <el-tab-pane v-if="checkRole(['admin','editor'])" label="Admin-OR-Editor">
          Both admin or editor can see this
          <el-tag class="permission-sourceCode" type="info">
            v-if="checkRole(['admin','editor'])"
          </el-tag>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import hasRole from '@/directive/permission/index.js' // 权限判断指令
import { checkRole } from '@/utils/permission' // 权限判断函数
import SwitchRoles from './components/SwitchRoles'

export default {
  name: 'DirectivePermission',
  components: { SwitchRoles },
  directives: { hasRole },
  data() {
    return {
      key: 1 // 为了能每次切换权限的时候重新初始化指令
    }
  },
  methods: {
    checkRole,
    handleRolesChange() {
      this.key++
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  ::v-deep .permission-alert {
    width: 320px;
    margin-top: 15px;
    background-color: #f0f9eb;
    color: #67c23a;
    padding: 8px 16px;
    border-radius: 4px;
    display: inline-block;
  }
  ::v-deep .permission-sourceCode {
    margin-left: 15px;
  }
  ::v-deep .permission-tag {
    background-color: #ecf5ff;
  }
}
</style>

