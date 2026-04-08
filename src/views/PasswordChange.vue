<template>
  <div class="password-change-container">
    <el-card class="form-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="title">修改密码</span>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        class="password-form"
      >
        <!-- 原密码 -->
        <el-form-item prop="oldPassword">
          <template #label>
            <span>原密码</span>
          </template>
          <el-input
            v-model="formData.oldPassword"
            type="password"
            placeholder="请输入原密码"
            show-password
            clearable
            size="large"
          />
        </el-form-item>

        <!-- 新密码 -->
        <el-form-item prop="newPassword">
          <template #label>
            <span>新密码</span>
          </template>
          <el-input
            v-model="formData.newPassword"
            type="password"
            placeholder="请输入新密码（6-20位）"
            show-password
            clearable
            size="large"
          />
        </el-form-item>

        <!-- 确认新密码 -->
        <el-form-item prop="confirmPassword">
          <template #label>
            <span>确认新密码</span>
          </template>
          <el-input
            v-model="formData.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
            clearable
            size="large"
          />
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSubmit" size="large">
            提交修改
          </el-button>
          <el-button @click="handleReset" size="large">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { readerAlterPassword } from '@/api/user'

const formRef = ref(null)
const loading = ref(false)

// 表单数据
const formData = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 验证确认密码
const validateConfirmPassword = (rule, value, callback) => {
  if (value !== formData.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 表单验证规则
const formRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 提交修改
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const userid = localStorage.getItem('userid')
        const username = localStorage.getItem('username')
        const isadmin = localStorage.getItem('isadmin')

        const result = await readerAlterPassword({
          userid: parseInt(userid),
          username,
          isadmin: parseInt(isadmin),
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword
        })

        if (result === 1) {
          ElMessage.success('密码修改成功')
          // 清除密码相关的表单数据
          handleReset()
        } else {
          ElMessage.error('密码修改失败，请检查原密码是否正确')
        }
      } catch (error) {
        console.error('修改密码失败:', error)
        ElMessage.error('修改密码失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }
  })
}

// 重置
const handleReset = () => {
  formData.oldPassword = ''
  formData.newPassword = ''
  formData.confirmPassword = ''
  formRef.value?.clearValidate()
}
</script>

<style scoped>
.password-change-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 60px);
}

.form-card {
  max-width: 500px;
  margin: 40px auto;
}

.card-header {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.password-form {
  padding: 0 30px;
}
</style>
