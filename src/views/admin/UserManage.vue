<template>
  <div class="user-manage-container">
    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="用户名">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入用户名"
            clearable
            @clear="handleSearch"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">
            搜索
          </el-button>
          <el-button :icon="Refresh" @click="handleReset">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 用户列表 -->
    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="title">用户管理</span>
          <div>
            <el-button type="primary" :icon="Plus" @click="handleAdd">
              新增用户
            </el-button>
            <el-button
              type="danger"
              :icon="Delete"
              :disabled="selectedUsers.length === 0"
              @click="handleBatchDelete"
            >
              批量删除
            </el-button>
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="userList"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="userid" label="用户ID" width="80" align="center" />
        <el-table-column prop="username" label="用户名" min-width="150" show-overflow-tooltip />
        <el-table-column prop="isadmin" label="角色" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.isadmin === 1 ? 'danger' : 'success'">
              {{ row.isadmin === 1 ? '管理员' : '读者' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" :icon="Edit" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              :icon="Delete"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.limit"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="userForm"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="密码" :prop="isEdit ? '' : 'userpassword'">
          <el-input
            v-model="userForm.userpassword"
            type="password"
            :placeholder="isEdit ? '留空则不修改密码' : '请输入密码'"
            show-password
          />
        </el-form-item>

        <el-form-item label="角色" prop="isadmin">
          <el-radio-group v-model="userForm.isadmin">
            <el-radio :value="0">读者</el-radio>
            <el-radio :value="1">管理员</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Edit, Delete } from '@element-plus/icons-vue'
import { queryUsersByPage, addUser, updateUser, deleteUser, deleteUsers } from '@/api/user'

// 搜索表单
const searchForm = reactive({
  username: ''
})

// 分页参数
const pagination = reactive({
  page: 1,
  limit: 10
})

// 数据
const userList = ref([])
const total = ref(0)
const loading = ref(false)
const selectedUsers = ref([])

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增用户')
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref(null)

// 用户表单
const userForm = reactive({
  userid: null,
  username: '',
  userpassword: '',
  isadmin: 0
})

// 表单验证规则
const formRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  userpassword: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  isadmin: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

// 获取用户列表
const loadUserList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      limit: pagination.limit
    }

    if (searchForm.username) {
      params.username = searchForm.username
    }

    const response = await queryUsersByPage(params)

    if (response.code === 0) {
      userList.value = response.data || []
      total.value = response.count || 0
    } else {
      ElMessage.error(response.message || '获取用户列表失败')
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadUserList()
}

// 重置
const handleReset = () => {
  searchForm.username = ''
  pagination.page = 1
  loadUserList()
}

// 分页大小改变
const handleSizeChange = (size) => {
  pagination.limit = size
  pagination.page = 1
  loadUserList()
}

// 页码改变
const handlePageChange = (page) => {
  pagination.page = page
  loadUserList()
}

// 选择改变
const handleSelectionChange = (selection) => {
  selectedUsers.value = selection
}

// 新增用户
const handleAdd = () => {
  dialogTitle.value = '新增用户'
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

// 编辑用户
const handleEdit = (row) => {
  dialogTitle.value = '编辑用户'
  isEdit.value = true
  Object.assign(userForm, {
    userid: row.userid,
    username: row.username,
    userpassword: '',
    isadmin: row.isadmin
  })
  dialogVisible.value = true
}

// 删除用户
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户"${row.username}"吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const result = await deleteUser({ userid: row.userid })

    if (result === 1) {
      ElMessage.success('删除成功')
      loadUserList()
    } else {
      ElMessage.error('删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedUsers.value.length} 个用户吗？`,
      '批量删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const ids = selectedUsers.value.map(user => ({ userid: user.userid }))
    const result = await deleteUsers(ids)

    ElMessage.success(`成功删除 ${result} 个用户`)
    loadUserList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
      ElMessage.error('批量删除失败')
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        const data = { ...userForm }

        if (isEdit.value) {
          // 编辑模式：如果不填密码，不传密码字段
          if (!data.userpassword) {
            delete data.userpassword
          }
          const result = await updateUser(data)
          if (result === 1) {
            ElMessage.success('更新成功')
            dialogVisible.value = false
            loadUserList()
          } else {
            ElMessage.error('更新失败')
          }
        } else {
          const result = await addUser(data)
          if (result === 1) {
            ElMessage.success('添加成功')
            dialogVisible.value = false
            loadUserList()
          } else {
            ElMessage.error('添加失败，用户名可能已存在')
          }
        }
      } catch (error) {
        console.error('提交失败:', error)
      } finally {
        submitLoading.value = false
      }
    }
  })
}

// 重置表单
const resetForm = () => {
  userForm.userid = null
  userForm.username = ''
  userForm.userpassword = ''
  userForm.isadmin = 0
  formRef.value?.clearValidate()
}

// 对话框关闭
const handleDialogClose = () => {
  resetForm()
}

// 初始化
onMounted(() => {
  loadUserList()
})
</script>

<style scoped>
.user-manage-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 60px);
}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  margin: 0;
}

.search-form :deep(.el-form-item) {
  margin-bottom: 0;
}

.table-card {
  min-height: 500px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header .title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
