<template>
  <div class="book-type-manage-container">
    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="类型名称">
          <el-input
            v-model="searchForm.booktypename"
            placeholder="请输入类型名称"
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

    <!-- 类型列表 -->
    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="title">图书类型管理</span>
          <div>
            <el-button type="primary" :icon="Plus" @click="handleAdd">
              新增类型
            </el-button>
            <el-button
              type="danger"
              :icon="Delete"
              :disabled="selectedTypes.length === 0"
              @click="handleBatchDelete"
            >
              批量删除
            </el-button>
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="typeList"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="booktypeid" label="类型ID" width="90" align="center" />
        <el-table-column prop="booktypename" label="类型名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="booktypedesc" label="描述" min-width="300" show-overflow-tooltip />

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
        :model="typeForm"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="类型名称" prop="booktypename">
          <el-input v-model="typeForm.booktypename" placeholder="请输入类型名称" />
        </el-form-item>

        <el-form-item label="描述" prop="booktypedesc">
          <el-input
            v-model="typeForm.booktypedesc"
            type="textarea"
            :rows="4"
            placeholder="请输入类型描述"
          />
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
import { queryBookTypesByPage, addBookType, updateBookType, deleteBookType, deleteBookTypes } from '@/api/bookType'

// 搜索表单
const searchForm = reactive({
  booktypename: ''
})

// 分页参数
const pagination = reactive({
  page: 1,
  limit: 10
})

// 数据
const typeList = ref([])
const total = ref(0)
const loading = ref(false)
const selectedTypes = ref([])

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增类型')
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref(null)

// 类型表单
const typeForm = reactive({
  booktypeid: null,
  booktypename: '',
  booktypedesc: ''
})

// 表单验证规则
const formRules = {
  booktypename: [{ required: true, message: '请输入类型名称', trigger: 'blur' }]
}

// 获取类型列表
const loadTypeList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      limit: pagination.limit
    }

    if (searchForm.booktypename) {
      params.booktypename = searchForm.booktypename
    }

    const response = await queryBookTypesByPage(params)

    if (response.code === 0) {
      typeList.value = response.data || []
      total.value = response.count || 0
    } else {
      ElMessage.error(response.message || '获取类型列表失败')
    }
  } catch (error) {
    console.error('获取类型列表失败:', error)
    ElMessage.error('获取类型列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadTypeList()
}

// 重置
const handleReset = () => {
  searchForm.booktypename = ''
  pagination.page = 1
  loadTypeList()
}

// 分页大小改变
const handleSizeChange = (size) => {
  pagination.limit = size
  pagination.page = 1
  loadTypeList()
}

// 页码改变
const handlePageChange = (page) => {
  pagination.page = page
  loadTypeList()
}

// 选择改变
const handleSelectionChange = (selection) => {
  selectedTypes.value = selection
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增类型'
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  dialogTitle.value = '编辑类型'
  isEdit.value = true
  Object.assign(typeForm, row)
  dialogVisible.value = true
}

// 删除
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除类型"${row.booktypename}"吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const result = await deleteBookType({ booktypeid: row.booktypeid })

    if (result === 1) {
      ElMessage.success('删除成功')
      loadTypeList()
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
      `确定要删除选中的 ${selectedTypes.value.length} 个类型吗？`,
      '批量删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const ids = selectedTypes.value.map(type => ({ booktypeid: type.booktypeid }))
    const result = await deleteBookTypes(ids)

    ElMessage.success(`成功删除 ${result} 个类型`)
    loadTypeList()
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
        if (isEdit.value) {
          const result = await updateBookType({ ...typeForm })
          if (result === 1) {
            ElMessage.success('更新成功')
            dialogVisible.value = false
            loadTypeList()
          } else {
            ElMessage.error('更新失败')
          }
        } else {
          const result = await addBookType({
            booktypename: typeForm.booktypename,
            booktypedesc: typeForm.booktypedesc
          })
          if (result === 1) {
            ElMessage.success('添加成功')
            dialogVisible.value = false
            loadTypeList()
          } else {
            ElMessage.error('添加失败')
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
  typeForm.booktypeid = null
  typeForm.booktypename = ''
  typeForm.booktypedesc = ''
  formRef.value?.clearValidate()
}

// 对话框关闭
const handleDialogClose = () => {
  resetForm()
}

// 初始化
onMounted(() => {
  loadTypeList()
})
</script>

<style scoped>
.book-type-manage-container {
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
