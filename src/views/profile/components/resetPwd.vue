<template>
  <el-form ref="form" :model="userPasswd" :rules="rules" label-width="80px">
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input v-model="userPasswd.oldPassword" placeholder="请输入旧密码" type="password" />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input v-model="userPasswd.newPassword" placeholder="请输入新密码" type="password" />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input v-model="userPasswd.confirmPassword" placeholder="请确认密码" type="password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
      <el-button type="danger" size="mini" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserPwd } from '@/api/sys/user'

export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.userPasswd.newPassword !== value) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      userPasswd: {
        id: '',
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      },
      // 表单校验
      rules: {
        oldPassword: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' },
          {
            pattern: /^(?!_)(?!.*?_$)[a-zA-Z0-9_]{5,20}$/,
            message: '密码不合法，长度是5到20位，支持(字母，数字，下划线)，不能以下划线开头结尾',
            trigger: 'blur'
          }
        ],
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          {
            pattern: /^(?!_)(?!.*?_$)[a-zA-Z0-9_]{5,20}$/,
            message: '新密码不合法，长度是5到20位，支持(字母，数字，下划线)，不能以下划线开头结尾',
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { validator: equalToPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const { id } = this.user
          this.userPasswd.id = id
          updateUserPwd(this.userPasswd).then(
            response => {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
            }
          )
        }
      })
    },
    close() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/' })
    }
  }
}
</script>
