<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar
                :user="user"
                @updateAvatar="updateAvatar"
              />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <svg-icon icon-class="user" />
                    <span class="ml5">用户名称</span>
                  </el-col>
                  <el-col :span="12">
                    {{ user.username }}
                  </el-col>
                </el-row>
              </li>
              <li class="list-group-item">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <svg-icon icon-class="star" />
                    <span class="ml5">手机号码</span>
                  </el-col>
                  <el-col :span="12">
                    {{ user.mobile }}
                  </el-col>
                </el-row>
              </li>
              <li class="list-group-item">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <svg-icon icon-class="email" />
                    <span class="ml5">用户邮箱</span>
                  </el-col>
                  <el-col :span="12">
                    {{ user.email }}
                  </el-col>
                </el-row>
              </li>
              <li class="list-group-item">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <svg-icon icon-class="tree" />
                    <span class="ml5">所属部门</span>
                  </el-col>
                  <el-col :span="12">
                    {{ user.deptName }}
                  </el-col>
                </el-row>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="user" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd :user="user" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userAvatar from './components/userAvatar'
import userInfo from './components/userInfo'
import resetPwd from './components/resetPwd'
import { getUserProfile, uploadAvatar } from '@/api/sys/user'

export default {
  name: 'Profile',
  components: { userAvatar, userInfo, resetPwd },
  data() {
    return {
      user: {},
      activeTab: 'userinfo'
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      getUserProfile().then(response => {
        this.user = response.data
      })
    },
    updateAvatar(avatar) {
      uploadAvatar({ id: this.user.id, avatar: avatar })
        .then(response => {
          // 触发父组件时间
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          // 修改缓存中的头像
          this.$store.dispatch('user/changeAvatar', avatar)
        })
    }
  }
}
</script>

<style scoped>

.list-group-striped > .list-group-item {
	border-left: 0;
	border-right: 0;
	border-radius: 0;
	padding-left: 0;
	padding-right: 0;
}

.list-group {
	padding-left: 0px;
	list-style: none;
}

.list-group-item {
	border-bottom: 1px solid #e7eaec;
	border-top: 1px solid #e7eaec;
	margin-bottom: -1px;
	padding: 11px 0px;
	font-size: 13px;
}

.pull-right {
	float: right;
}
.ml5 {
  margin-left: 5px;
}
</style>
