<template>
  <div class="not-found-container">
    <div class="content">
      <h1 class="code">404</h1>
      <p class="message">页面不存在</p>
      <p class="desc">您访问的页面不存在或已被移除</p>
      <div class="actions">
        <el-button type="primary" @click="goBack">
          返回上一页
        </el-button>
        <el-button @click="goToHome">
          返回首页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}

const goToHome = () => {
  const token = localStorage.getItem('token')
  if (token) {
    router.push('/dashboard')
  } else {
    router.push('/login')
  }
}
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.content {
  text-align: center;
  background: white;
  border-radius: 12px;
  padding: 60px 80px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.code {
  font-size: 120px;
  font-weight: 700;
  color: #764ba2;
  margin: 0;
  line-height: 1;
}

.message {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 16px 0 8px;
}

.desc {
  font-size: 14px;
  color: #666;
  margin: 0 0 32px;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}
</style>
